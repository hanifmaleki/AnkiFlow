import { CardService } from '../services/cardService'

export default defineEventHandler((event) => {
    const rawDeckId = getQuery(event).deckId
    const deckId = 
        (typeof rawDeckId === 'string' && rawDeckId !== '')
            ? Number(rawDeckId)
            : null

    if (deckId != null && !Number.isInteger(deckId)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'deckId must be an integer',
        })
    }

    return new CardService().listCards(deckId)
})

