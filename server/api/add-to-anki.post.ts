import { addNote } from '../utils/anki'

const HARDCODED_NOTE = {
  deckName: 'Default',
  modelName: 'Basic',
  fields: {
    Front: 'serendipity',
    Back: 'A pleasant surprise or lucky discovery.'
  },
  tags: ['ankiflow', 'hardcoded-test']
}

export default defineEventHandler(async () => {
  try {
    const noteId = await addNote(HARDCODED_NOTE)

    return {
      ok: true,
      noteId,
      deckName: HARDCODED_NOTE.deckName,
      modelName: HARDCODED_NOTE.modelName
    }
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Could not add note to Anki.',
      data: {
        message: error instanceof Error ? error.message : 'Unknown Anki add-note error.'
      }
    })
  }
})
