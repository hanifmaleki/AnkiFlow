import { AnkiConnectCardGateway, AnkiConnectDeckGateway } from '../services/ankiGatewayService'
import { CardService } from '../services/cardService'
import { DeckService } from '../services/deckService'

export default defineEventHandler(async () => {
  try {
    const deckGateway = new AnkiConnectDeckGateway()
    const cardGateway = new AnkiConnectCardGateway()

    // Cards can only be matched to local decks after their Anki deck IDs have
    // been imported or created.
    await new DeckService().syncFromAnki(deckGateway)
    await new CardService().syncWithAnki(cardGateway)

    return { ok: true }
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Could not synchronize with AnkiConnect.',
      data: {
        message: error instanceof Error ? error.message : 'Unknown AnkiConnect error.'
      }
    })
  }
})
