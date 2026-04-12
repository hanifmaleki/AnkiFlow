import { addNote } from '../utils/anki'

type AddToAnkiRequest = {
  word?: string
  meaning?: string
  exampleSentence?: string
  translationHint?: string
  tags?: string
}

const DEFAULT_DECK_NAME = 'Default'
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

function buildBackField(input: AddToAnkiRequest): string {
  const sections = [
    `Meaning: ${requireText(input.meaning, 'Meaning')}`,
    `Example sentence: ${requireText(input.exampleSentence, 'Example sentence')}`,
    `Translation hint: ${requireText(input.translationHint, 'Translation hint')}`
  ]

  return sections.join('\n\n')
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<AddToAnkiRequest>(event)
    const word = requireText(body?.word, 'Word')
    const tags = body?.tags
      ?.split(',')
      .map(tag => tag.trim())
      .filter(Boolean)

    const noteId = await addNote({
      deckName: DEFAULT_DECK_NAME,
      modelName: DEFAULT_MODEL_NAME,
      fields: {
        Front: word,
        Back: buildBackField(body ?? {})
      },
      tags: tags?.length ? tags : ['ankiflow']
    })

    return {
      ok: true,
      noteId,
      deckName: DEFAULT_DECK_NAME,
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
