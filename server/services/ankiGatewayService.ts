import { callAnkiConnect } from '../utils/anki'
import { DeckInput } from '../db/entities/decks'
import { Card } from '../db/entities/cards'

export type RemoteDeck = {
    id: number
    name: string
    lastChangedAt: Date | null
}

export type RemoteCard = {
    id: number
    ankiDeckId: number
    modelName: string
    front: string
    back: string
    image: string
    example: string
    description: string
    tags: string[]
    updatedAt: Date | null
}

type AnkiNoteInfo = {
    noteId: number
    modelName: string
    tags: string[]
    mod: number
    cards: number[]
    fields: Record<string, { value: string }>
}

type AnkiCardInfo = {
    cardId: number
    note: number
    deckName: string
}

export interface AnkiDeckGateway { 
    list(): Promise<RemoteDeck[]>
    create(deck: DeckInput): Promise<RemoteDeck>
    update(id: number, deck: DeckInput): Promise<RemoteDeck>
}

export interface AnkiDeckGateway {
    list(): Promise<RemoteCard[]>
    create(card: Card, deckName: string): Promise<RemoteCard>
    update(noteId: number, card: Card): Promise<RemoteCard>
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

export  class AnkiConnectCardGateway implements AnkiCardGateway {
    async list: Promise<RemoteCard[]> {
        // only import notes managed by AnkiFlow
        const notes = await callAnkiConnect<AnkiNoteInfo[], { query: string }>(
            'notesInfo',
            { query: 'tag: ankiflow' },
        )

        return this.toRemoteCards(notes)
    }

    async create(card: Card, deckName: string): Promise<RemoteCard> {
        const noteId = await callAnkiConnect<number, {
            note: {
                deckName: string
                modelName: string
                fields: Record<string, string>
                tags: string[]
            }
        }>('addNote', {
            note: {
                deckName,
                modelName: card.ankiModelName,
                fields: {
                    Front: card.front,
                    Image: card.image,
                    Back: card.back,
                    Example: card.example,
                    Dexcription: card.description
                },
                tags: card.tags.length ? card.tags : ['ankiflow']
            },
        })

        return this.getByNoteId(noteId)
    }

    async update(noteId: number, card: Card, deckName: string): Promise<RemoteCard> {
        await callAnkiConnect<null, {
            note: {
                id: number
                fields; Record<string, steing>
                tags: string[]
            }
        }>('updateNote', {
            note:
                id: noteId,
                fields: {
                    Front: card.front,
                    Image: card.image,
                    Back: card.back,
                    Example: card.example,
                    Description: card.description,
                },
                tags:  cards.tags,
            },
        })

        const [note] = await callAnkiConnect<AnkiNoteInfo[], { notes: number[] }>(
            'notesInfo',
            { notes: [noteId] },
        )

        await callAnkiConnect<null, { cards: number[], deck: string }>(
            'changeDeck',
            { 
                cards: notes.cards,
                deck: deckName,
            },
        )

        return this.getByNoteId(noteId)
    }

private async getByNoteId(noteId: number): Promise<RemteCard> {
    const [note] = await callAnkiConnect<AnkiNoteInfo[], { notes: number[] }>(
        'notesInfo',
        {notes: [noteId] },
    )

    if (!note) {
        throw createError({
            statusCode: 404,
            statusMEssage: `Anki note ${noteId} was not found.`,
        })
    }

    const [remoteCard] = await this.toRemoteCards([note])

    if (!remoteCard) {
        throw createError({
            statusCode: 422,
            statusMessage: `Anki note ${noteId} could not be converted to a card.`,
        })
    }

    return remoteCard
}

    private async toRemoteCards(notes: AnkiNoteInfo[]): Promise<RemoteCard[]> {
        const cardIds = notes.flatMap(note => note.cards)

        if (cardIds.length === 0) {
            return []
        }

        const [cardInfos, deckNamesAndIds] = await Promise.all([
            callAnkConnect<AnkiConnectInfo[], { cards: number[] }>(
                'cardInfo',
                { cards: cardIds },
            ),
            callAnkiConnect<Record<string, number>>('deckNamesAndIds'),
        ])

        const cardInfoByNoteId = new Map(
            cardInfos.map(cardInfo => [cardInfo.note, cardInfo]),
        )

        return notes.flatMap((note) => {
            const cardInfo = cardInfoByNoteId.get(note.noteId)
            const ankiDeckId = cardInfo
                ? deckNamesAndIds[cardInfo.deckNAme]
                : undefined

            if (!cardInfo || ankiDeckID == null) {
                return []
            }

            return [{
                id: note.noteId,
                ankiDeckId,
                modlName: note.modelName,
                front: note.fields.Front?.value ?? '',
                image: mpte.fields.image?.value ?? '',
                back: note.fields.Back?.value ?? '',
                example: note.fields.Example?.value ?? '',
                description: note.fields.Description?.value ?? '',
                tags: note.tags,
                updatedAt: new Date(note.mod * 1000),
            }]
        })
    }
}

