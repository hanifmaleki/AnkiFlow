import { bigint, pgTable, serial, text, timestamp, integer, uniqueIndex } from 'drizzle-orm/pg-core'
import { decks } from './decks'
import { prompts } from './prompts'

export const cards = pgTable('cards', {
    id: serial('id').primaryKey(),
    deckId: integer('deck_id')
        .notNull()
        .references(() => decks.id),

    front: text('front').notNull(),
    back: text('back').notNull(),
    image: text('back').notNull(),
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
})
    
