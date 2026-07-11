import { addNote, findNotes } from '../utils/anki'
import { ALLOWED_DECKS } from '../../types/card'
import type { GeneratedCard } from '../../types/card'

const DEFAULT_MODEL_NAME = 'Basic'

function normalizeFront(front: string): string {
  return front.trim().toLowerCase()
}

function escapeAnkiSearchValue(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')
}

function requireDeck(deck: string): GeneratedCard['deck'] {
  if (ALLOWED_DECKS.includes(deck as GeneratedCard['deck'])) {
    return deck as GeneratedCard['deck']
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Deck must be one of the allowed deck names.'
  })
}

function requireFront(front: string | undefined): string {
  const trimmed = front?.trim()

  if (!trimmed) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Front is required.'
    })
  }

  return trimmed
}

export type DuplicateCardSearch = {
  deck: GeneratedCard['deck']
  front: string
  noteIds: number[]
}

export type CardToAdd = {
  front: string
  image: string
  back: string
  example: string
  description: string
  deck: GeneratedCard['deck']
  tags: string[]
}

export class AnkiService {
  async testConnection() {
    const version = await callAnkiConnect<number>('version')
    const deckNames = await callAnkiConnect<string[]>('deckNames')

    return {
      version,
      deckNames
    }
  }

  async findDuplicateCard(front: string, deck: string): Promise<DuplicateCardSearch> {
    const normalizedFront = requireFront(front)
    const normalizedDeck = requireDeck(deck)
    const query = `deck:"${escapeAnkiSearchValue(normalizedDeck)}" Front:"${escapeAnkiSearchValue(normalizeFront(normalizedFront))}"`
    const noteIds = await findNotes(query)

    return {
      deck: normalizedDeck,
      front: normalizedFront,
      noteIds
    }
  }

  async addCard(card: CardToAdd): Promise<number> {
    const front = requireFront(card.front)
    const deck = requireDeck(card.deck)

    return addNote({
      deckName: deck,
      modelName: DEFAULT_MODEL_NAME,
      fields: {
        Front: front,
        Image: card.image.trim(),
        Back: card.back.trim(),
        Example: card.example.trim(),
        Description: card.description.trim()
      },
      tags: card.tags.length ? card.tags : ['ankiflow']
    })
  }
}
