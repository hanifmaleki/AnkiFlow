import { eq } from 'drizzle-orm'
import { db } from '../db/client'
import { cards, type Card, type CardInput } from '../db/entities/cards'

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

    async syncToAnki(): Promise<void> {
        const localCards = await db
            .select({ card: cards, deck: decks })
            .from(cards)
            .innerJoin(decks, eq(cards.deckId, decks.id))

        const syncedAt = new Date()

        for (const { card, deck } of localCards) {
            const changedLocally = 
                card.lastSyncedAt == null || card.updatedAt > card.lastSyncedAt

            if (!changedLocally) {
                continue
            }

            const remoteCard = {
                deckNAme: deck.name,
                modelName: card.ankiModelName,
                front: card.front,
                back: card.back,
                image: card.image,
                example: card.example,
                description: card.description,
                tags: card.tags,
            }

            const remote = card.ankiNoteId == null
                ? await this.gateway.create(remoteCard)
                : await this.gateway.update(card.ankiNoteId, remoteCard)

            await db
                .update(cards)
                .set({
                    ankiNoteId: remote.id,
                    lastSyncedAt: syncedAt,
                })
                .where(eq(card.id, card.id))
        }
    }

    async syncFromAnki(): Promise<void> {
        const [remoteCards, localCards, localDecks] = await Promise.all([
            this.gateway.list(),
            db.select().from(cards),
            db.select().from(decks),
        ])

        const localByAnkiNoteId 
    }
}
