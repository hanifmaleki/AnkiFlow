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
        throw createError({
            statusCode: 501,
            statusMessage: 'Card synchronization to Anki is not implemented yet.',
        })
    }

    async syncFromAnki(): Promise<void> {
        throw createError({
            statusCode: 501,
            statusMessage: 'Card synchronization from Anki is not implemented yet.',
        })
    }
}
