import { CardService } from '../services/cardService'

export default defineEventHandler(() => new CardService().listCards())
