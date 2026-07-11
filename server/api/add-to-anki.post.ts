import { AnkiService } from '../services/ankiService'
import type { GeneratedCard } from '../../types/card'

export default defineEventHandler(async (event) => {
  try {
    const service = new AnkiService()
    const body = await readBody<Partial<GeneratedCard>>(event)
    const front = body?.front?.trim()
    const image = body?.image?.trim() ?? ''
    const back = body?.back?.trim()
    const example = body?.example?.trim()
    const description = body?.description?.trim()
    const deck = body?.deck
    const tags = body?.tags
      ?.split(',')
      .map(tag => tag.trim())
      .filter(Boolean)

    if (!front || !back || !example || !description || !deck) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Front, Back, Example, Description, and Deck are required.'
      })
    }

    const duplicate = await service.findDuplicateCard(front, deck)

    if (duplicate.noteIds.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'This card already exists in Anki.',
        data: {
          duplicate: true,
          noteIds: duplicate.noteIds,
          deck: duplicate.deck,
          front: duplicate.front
        }
      })
    }

    const noteId = await service.addCard({
      front,
      image,
      back,
      example,
      description,
      deck,
      tags: tags ?? []
    })

    return {
      ok: true,
      noteId,
      deckName: deck,
      modelName: 'Basic'
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
