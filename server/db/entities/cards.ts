import { bigint, index, integer, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { decks } from './decks'
import { prompts } from './prompts'

export const cards = pgTable('cards', {
    id: serial('id').primaryKey(),
    deckId: integer('deck_id')
        .notNull()
        .references(() => decks.id),

    front: text('front').notNull(),
    back: text('back').notNull(),
    image: text('image').notNull(),
    example: text('example').notNull(),
    description: text('description').notNull(),
    tags: text('tag').array().notNull().default([]),

    ankiNoteId: bigint('anki_note_id', { mode: 'number' }),
    ankiModelName: text('anki_model_name').notNull().default('Basic'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    lastSyncedAt: timestamp('last_synced_at'),

    promptId: integer('prompt_id')
        .references(() => prompts.id),
}, (table) => [
    index('cards_deck_id_index').on(table.deckId),
    uniqueIndex('cards_anki_note_id_unique').on(table.ankiNoteId),
    index('cards_prompt_id_index').on(table.promptId),
])

export type Card = typeof cards.$inferSelect
export type CardInput = typeof cards.$inferInsert
