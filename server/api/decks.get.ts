import { DeckService } from '../services/deckService'

export default defineEventHandler(() => new DeckService().listDecks())
