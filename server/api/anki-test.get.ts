import { callAnkiConnect } from '../utils/anki'

export default defineEventHandler(async () => {
  try {
    const version = await callAnkiConnect<number>('version')
    const deckNames = await callAnkiConnect<string[]>('deckNames')

    return {
      ok: true,
      version,
      deckNames
    }
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Could not reach AnkiConnect.',
      data: {
        message: error instanceof Error ? error.message : 'Unknown AnkiConnect error.'
      }
    })
  }
})
