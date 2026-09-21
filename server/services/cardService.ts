import { eq } from 'drizzle-orm'
import { db } from '../db/client'
import { cards, type Card, type CardInput } from '../db/entities/cards'
import { decks } from '../db/entities/decks'
import type { AnkiCardGateway } from './ankiGatewayService'
import type { SynchronizationStatus } from '../../types/synchronization'

export type CardSyncStats = SynchronizationStatus['cards']

function now(): Date {
    return new Date()
}

export class CardService {
    async listCards(): Promise<Card[]> {
        return db.select().from(cards).orderBy(cards.createdAt)
    }

    async getCard(cardId: number): Promise<Card> {
        const [card] = await db
            .select()
            .from(cards)
            .where(eq(cards.id, cardId))
            .limit(1)

        if (!card) {
            throw createError({
                statusCode: 404,
                statusMessage: `Card with ID ${cardId} not found`,
            })
        }

        return card
    }

    async create(input: CardInput): Promise<Card> {
        const [created] = await db
            .insert(cards)
            .values(input)
            .returning()

        return created
    }

    async update(cardId: number, input: CardInput): Promise<Card> {
        await this.getCard(cardId)

        const [updated] = await db
            .update(cards)
            .set({
                ...input,
                updatedAt: now(),
            })
            .where(eq(cards.id, cardId))
            .returning()

        return updated
    }

    async delete(cardId: number): Promise<void> {
        await this.getCard(cardId)
        await db.delete(cards).where(eq(cards.id, cardId))
    }

    // The UI needs one sync action. Pull first, then push local changes and
    // conflicts so that the documented local-wins rule is applied.
    async syncWithAnki(gateway: AnkiCardGateway): Promise<CardSyncStats> {
        const imported = await this.syncFromAnki(gateway)
        const pushedToAnki = await this.syncToAnki(gateway)

        return { ...imported, pushedToAnki }
    }

    async syncToAnki(gateway: AnkiCardGateway): Promise<number> {
        const localCards = await db
            .select({ card: cards, deck: decks })
            .from(cards)
            .innerJoin(decks, eq(cards.deckId, decks.id))

        const syncedAt = now()
        let pushedToAnki = 0

        for (const { card, deck } of localCards) {
            const changedLocally =
                card.lastSyncedAt == null || card.updatedAt > card.lastSyncedAt

            if (!changedLocally) {
                continue
            }

            const remote = card.ankiNoteId == null
                ? await gateway.create(card, deck.name)
                : await gateway.update(card.ankiNoteId, card, deck.name)

            await db
                .update(cards)
                .set({
                    ankiNoteId: remote.id,
                    ankiModelName: remote.modelName,
                    lastSyncedAt: syncedAt,
                })
                .where(eq(cards.id, card.id))

            pushedToAnki += 1
        }

        return pushedToAnki
    }

    async syncFromAnki(gateway: AnkiCardGateway): Promise<Omit<CardSyncStats, 'pushedToAnki'>> {
        const localDecks = await db.select().from(decks)
        const remote = await gateway.list(localDecks.map((deck) => deck.name))
        const remoteCards = remote.cards
        const localCards = await db.select().from(cards)
        const syncedAt = now()
        let importedFromAnki = 0
        let updatedFromAnki = 0
        let skippedLocalChanges = 0
        let skippedUnmappedDeck = 0

        const localByAnkiNoteId = new Map(
            localCards
                .filter((card) => card.ankiNoteId != null)
                .map((card) => [card.ankiNoteId!, card]),
        )
        const deckByAnkiDeckId = new Map(
            localDecks
                .filter((deck) => deck.ankiDeckId != null)
                .map((deck) => [deck.ankiDeckId!, deck]),
        )

        for (const remote of remoteCards) {
            const deck = deckByAnkiDeckId.get(remote.ankiDeckId)

            // Deck synchronization must occur before card synchronization.
            if (!deck) {
                skippedUnmappedDeck += 1
                continue
            }

            const local = localByAnkiNoteId.get(remote.id)

            if (!local) {
                await db.insert(cards).values({
                    deckId: deck.id,
                    front: remote.front,
                    back: remote.back,
                    image: remote.image,
                    example: remote.example,
                    description: remote.description,
                    tags: remote.tags,
                    ankiNoteId: remote.id,
                    ankiModelName: remote.modelName,
                    updatedAt: remote.updatedAt ?? syncedAt,
                    lastSyncedAt: syncedAt,
                })

                importedFromAnki += 1

                continue
            }

            const changedLocally =
                local.lastSyncedAt == null || local.updatedAt > local.lastSyncedAt

            // A local edit is pushed in syncToAnki(), which gives conflicts a
            // deterministic local-wins outcome.
            if (changedLocally) {
                skippedLocalChanges += 1
                continue
            }

            await db
                .update(cards)
                .set({
                    deckId: deck.id,
                    front: remote.front,
                    back: remote.back,
                    image: remote.image,
                    example: remote.example,
                    description: remote.description,
                    tags: remote.tags,
                    ankiModelName: remote.modelName,
                    updatedAt: remote.updatedAt ?? syncedAt,
                    lastSyncedAt: syncedAt,
                })
                .where(eq(cards.id, local.id))

            updatedFromAnki += 1
        }

        return {
            importedFromAnki,
            updatedFromAnki,
            skippedUnsupported: remote.skippedUnsupported,
            skippedLocalChanges,
            skippedUnmappedDeck,
        }
    }
}
