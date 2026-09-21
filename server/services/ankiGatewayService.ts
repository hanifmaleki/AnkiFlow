import { callAnkiConnect } from '../utils/anki'
import type { Card } from '../db/entities/cards'
import type { DeckInput } from '../db/entities/decks'

export type RemoteDeck = {
    id: number
    name: string
    lastChangedAt: Date | null
}

// The normalized note shape that CardService receives from an Anki gateway.
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

// Raw `notesInfo` data returned by AnkiConnect. It stays private to this file.
type AnkiNoteInfo = {
    noteId: number
    modelName: string
    tags: string[]
    mod: number
    cards: number[]
    fields: Record<string, { value: string }>
}

// Raw `cardsInfo` data returned by AnkiConnect. A note needs this to identify
// the deck in which its generated review card is placed.
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

export interface AnkiCardGateway {
    // The caller controls which local deck names may be imported.
    list(deckNames: string[]): Promise<RemoteCard[]>
    create(card: Card, deckName: string): Promise<RemoteCard>
    update(noteId: number, card: Card, deckName: string): Promise<RemoteCard>
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
        const id = await callAnkiConnect<number, { deck: string }>('createDeck', { deck: deck.name })

        return {
            id,
            name: deck.name,
            lastChangedAt: null,
        }
    }

    async update(_id: number, _deck: DeckInput): Promise<RemoteDeck> {
        throw createError({
            statusCode: 501,
            statusMessage: 'AnkiConnect does not support renaming decks.',
        })
    }
}

export class AnkiConnectCardGateway implements AnkiCardGateway {
    async list(deckNames: string[]): Promise<RemoteCard[]> {
        const uniqueDeckNames = [...new Set(deckNames)]

        if (uniqueDeckNames.length === 0) {
            return []
        }

        const notesByDeck = await Promise.all(
            uniqueDeckNames.map((deckName) => callAnkiConnect<AnkiNoteInfo[], { query: string }>(
                'notesInfo',
                { query: `deck:"${deckName.replaceAll('"', '\\"')}"` },
            )),
        )

        const notes = [...new Map(
            notesByDeck.flat().map((note) => [note.noteId, note]),
        ).values()]

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
                fields: this.toAnkiFields(card),
                tags: card.tags,
            },
        })

        return this.getByNoteId(noteId)
    }

    async update(noteId: number, card: Card, deckName: string): Promise<RemoteCard> {
        await callAnkiConnect<null, {
            note: {
                id: number
                fields: Record<string, string>
            }
        }>('updateNoteFields', {
            note: {
                id: noteId,
                fields: this.toAnkiFields(card),
            },
        })

        await callAnkiConnect<null, { note: number, tags: string[] }>(
            'updateNoteTags',
            { note: noteId, tags: card.tags },
        )

        const [note] = await callAnkiConnect<AnkiNoteInfo[], { notes: number[] }>(
            'notesInfo',
            { notes: [noteId] },
        )

        if (!note) {
            throw createError({
                statusCode: 404,
                statusMessage: `Anki note ${noteId} was not found.`,
            })
        }

        await callAnkiConnect<null, { cards: number[], deck: string }>(
            'changeDeck',
            { cards: note.cards, deck: deckName },
        )

        return this.getByNoteId(noteId)
    }

    private toAnkiFields(card: Card): Record<string, string> {
        return {
            Front: card.front,
            Image: card.image,
            Back: card.back,
            Example: card.example,
            Description: card.description,
        }
    }

    private async getByNoteId(noteId: number): Promise<RemoteCard> {
        const [note] = await callAnkiConnect<AnkiNoteInfo[], { notes: number[] }>(
            'notesInfo',
            { notes: [noteId] },
        )

        if (!note) {
            throw createError({
                statusCode: 404,
                statusMessage: `Anki note ${noteId} was not found.`,
            })
        }

        const [remoteCard] = await this.toRemoteCards([note])

        if (!remoteCard) {
            throw createError({
                statusCode: 422,
                statusMessage: `Anki note ${noteId} does not have the fields required by AnkiFlow.`,
            })
        }

        return remoteCard
    }

    private async toRemoteCards(notes: AnkiNoteInfo[]): Promise<RemoteCard[]> {
        const cardIds = notes.flatMap((note) => note.cards)

        if (cardIds.length === 0) {
            return []
        }

        const [cardInfos, deckNamesAndIds] = await Promise.all([
            callAnkiConnect<AnkiCardInfo[], { cards: number[] }>('cardsInfo', { cards: cardIds }),
            callAnkiConnect<Record<string, number>>('deckNamesAndIds'),
        ])

        const cardInfoByNoteId = new Map(
            cardInfos.map((cardInfo) => [cardInfo.note, cardInfo]),
        )

        return notes.flatMap((note) => {
            const cardInfo = cardInfoByNoteId.get(note.noteId)
            const ankiDeckId = cardInfo ? deckNamesAndIds[cardInfo.deckName] : undefined
            const front = note.fields.Front?.value
            const back = note.fields.Back?.value
            const example = note.fields.Example?.value
            const description = note.fields.Description?.value

            // A local card represents one Anki note in one deck. Notes from a
            // different model, or models that generate multiple review cards,
            // cannot be represented safely by this schema.
            if (
                note.cards.length !== 1
                || !cardInfo
                || ankiDeckId == null
                || !front
                || !back
                || !example
                || !description
            ) {
                return []
            }

            return [{
                id: note.noteId,
                ankiDeckId,
                modelName: note.modelName,
                front,
                image: note.fields.Image?.value ?? '',
                back,
                example,
                description,
                tags: note.tags,
                updatedAt: new Date(note.mod * 1000),
            }]
        })
    }
}
