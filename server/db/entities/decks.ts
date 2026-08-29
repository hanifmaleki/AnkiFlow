import { bigint, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

export const decks = pgTable('decks', {
    id: serial('id').primaryKey(),

    // Full Anki deck name, including hierarchy, e.g. "German::Nouns"
    name: text('name').notNull(),

    // Null until the deck is known/created in AnkiConnect
    ankiDeckId: bigint('anki_deck_id', { mode: 'number' }),

    // The time the currently stored name was changed.
    lastChangedAt: timestamp('last_changed_at').defaultNow().notNull(),

    // Null until this local deck has completed a successful sync.
    lastSyncedAt: timestamp('last_synced_at'),
}, (table) => [
    uniqueIndex('decks_name_unique').on(table.name),
    uniqueIndex('decks_anki_deck_id_unique').on(table.ankiDeckId),
])

export type Deck = typeof decks.$inferSelect
export type NewDeck = typeof decks.$inferInsert
export type DeckInput = {
    name: string
}
