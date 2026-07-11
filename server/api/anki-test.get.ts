import { AnkiService } from '../services/ankiService'

export default defineEventHandler(async () => {
  try {
    const service = new AnkiService()
    const { version, deckNames } = await service.testConnection()

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
