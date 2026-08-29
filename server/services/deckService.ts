import { eq } from 'drizzle-orm'
import { db } from '../db/client'
import { decks, type Deck, DeckInput } from '../db/entities/decks'
import { AnkiDeckGateway } from './ankiGatewayService'

function validateInputDeck(deck: DeckInput): string {
    const name = deck?.name?.trim()
    
    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Deck name is required',
        })
    }

    return name
}

function now(): Date {
    return new Date()
}

export class DeckService {
    async listDecks(): Promise<Deck[]> {
        return db.select().from(decks).orderBy(decks.name)
    }

    async getDeck(deckId: number): Promise<Deck> { 
        const [deck] = await db
            .select()
            .from(decks)
            .where(eq(decks.id, deckId))
            .limit(1)

        if (!deck) { 
            throw createError({
                statusCode: 404,
                statusMessage: `Deck with ID ${deckId} not found`,
            })
        }

        return deck
    }

    async create(deck: DeckInput): Promise<Deck> {
        const name = validateInputDeck(deck)

        const [created] = await db
            .insert(decks)
            .values({
                name,
                ankiDeckId: null,
                lastChangedAt: now(),
                lastSyncedAt: null,
            })
            .returning()

        return created
    }

    async updateDeck(deckId: number, deck: DeckInput) {
        await this.getDeck(deckId)
        const name = validateInputDeck(deck)

        const [updated] = await db
            .update(decks)
            .set({
                name: name,
                lastChangedAt: now()
            })
            .where(eq(decks.id, deckId))
            .returning()

        return updated
     }

    async deleteDeck(deckId: number) {
        await this.getDeck(deckId)
        await db.delete(decks).where(eq(decks.id, deckId))
    }

    async syncFromAnki(gateway: AnkiDeckGateway): Promise<Deck[]> {
        const remoteDecks = await gateway.list()
        const localDecks = await this.listDecks()
        const syncedAt = now()

        const remoteById = new Map(remoteDecks.map((deck) => [deck.id, deck]))
        const remoteByName = new Map(remoteDecks.map((deck) => [deck.name, deck]))
        const localByAnkiId = new Map(
            localDecks
                .filter((deck) => deck.ankiDeckId != null)
                .map((deck) => [deck.ankiDeckId!, deck])
        )

        for (const local of localDecks) { 
            if (local.ankiDeckId == null) { 
                const existingRemote = remoteByName.get(local.name)
                const remote = existingRemote ?? await gateway.create({
                    name: local.name
                })

                await db
                    .update(decks)
                    .set({
                        ankiDeckId: remote.id,
                        lastSyncedAt: syncedAt,
                    })
                    .where(eq(decks.id, local.id))

                continue
            }

            const remote = remoteById.get(local.ankiDeckId)

            if (!remote) { 
                continue
            }

            const localChangedSinceSync =
                local.lastSyncedAt == null || local.lastChangedAt > local.lastSyncedAt

            if (remote.name !== local.name && !localChangedSinceSync) { 
                await db
                    .update(decks)
                    .set({
                        name: remote.name,
                        lastChangedAt: remote.lastChangedAt ?? syncedAt,
                        lastSyncedAt: syncedAt,
                    })
                    .where(eq(decks.id, local.id))

                continue
            }

            await db
                .update(decks)
                .set({
                    lastSyncedAt: syncedAt,
                })
                .where(eq(decks.id, local.id))
        }

        for (const remote of remoteDecks) { 
            if (localByAnkiId.has(remote.id)) { 
                continue
            }

            const alreadyBoundedByName = localDecks.some(
                (deck) => deck.ankiDeckId == null && deck.name === remote.name, 
            )

            if (alreadyBoundedByName) { 
                continue
            }

            await db.insert(decks).values({
                name: remote.name,
                ankiDeckId: remote.id,
                lastSyncedAt: syncedAt,
            })
        }

        return this.listDecks()
    }
}