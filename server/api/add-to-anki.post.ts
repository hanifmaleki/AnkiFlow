import { addNote } from '../utils/anki'
import { ALLOWED_DECKS, type GeneratedCard } from '~~/types/card'

const DEFAULT_MODEL_NAME = 'Basic'

function requireText(value: string | undefined, label: string): string {
  const trimmed = value?.trim()

  if (!trimmed) {
    throw createError({
      statusCode: 400,
      statusMessage: `${label} is required.`
    })
  }

  return trimmed
}

function requireDeck(value: string | undefined): GeneratedCard['deck'] {
  if (value && ALLOWED_DECKS.includes(value as GeneratedCard['deck'])) {
    return value as GeneratedCard['deck']
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Deck must be one of the allowed deck names.'
  })
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<Partial<GeneratedCard>>(event)
    const front = requireText(body?.front, 'Front')
    const image = body?.image?.trim() ?? ''
    const back = requireText(body?.back, 'Back')
    const example = requireText(body?.example, 'Example')
    const description = requireText(body?.description, 'Description')
    const deck = requireDeck(body?.deck)
    const tags = body?.tags
      ?.split(',')
      .map(tag => tag.trim())
      .filter(Boolean)

    const noteId = await addNote({
      deckName: deck,
      modelName: DEFAULT_MODEL_NAME,
      fields: {
        Front: front,
        Image: image,
        Back: back,
        Example: example,
        Description: description
      },
      tags: tags?.length ? tags : ['ankiflow']
    })

    return {
      ok: true,
      noteId,
      deckName: deck,
      modelName: DEFAULT_MODEL_NAME
    }
  } catch (error) {
    if (isError(error)) {
      throw error
    }

    throw createError({
      statusCode: 502,
      statusMessage: 'Could not add note to Anki.',
      data: {
        message: error instanceof Error ? error.message : 'Unknown Anki add-note error.'
      }
    })
  }
})
