import { callAnkiConnect } from '../utils/anki'
import { DeckInput } from '../db/entities/decks'

export type RemoteDeck = {
    id: number
    name: string
    lastChangedAt: Date | null
}

export interface AnkiDeckGateway { 
    list(): Promise<RemoteDeck[]>
    create(deck: DeckInput): Promise<RemoteDeck>
    update(id: number, deck: DeckInput): Promise<RemoteDeck>
}

export class AnkiConnectDeckGateway implements AnkiDeckGateway {
    async list(): Promise<RemoteDeck[]> {
        const namesAndIds = await callAnkiConnect<Record<string, number>>('deckNamesAndIds')

        return Object.entries(namesAndIds).map(([name, id]) => ({
            id,
            name,
            lastChangedAt: null,
        }))
    }

    async create(deck: DeckInput): Promise<RemoteDeck> {
        const id = await callAnkiConnect<number, { deck: string }>('createDeck', {deck: deck.name})

        return {
            id,
            name: deck.name,
            lastChangedAt: null,
        }
    }

    async update(id: number, deck: DeckInput) { 
        throw createError({
            statusCode: 501,
            statusMessage: 'AnkiConnect does not support renaiming decks.'
        })
    }
}