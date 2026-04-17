export const ALLOWED_DECKS = [
  'Adjektive',
  'Nomen',
  'Redewendungen',
  'Verben'
] as const

export type AllowedDeck = (typeof ALLOWED_DECKS)[number]

export type GeneratedCard = {
  front: string
  image: string
  back: string
  example: string
  description: string
  deck: AllowedDeck
  tags: string
}
