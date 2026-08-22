import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const prompts = pgTable('prompts', {
    id: serial('id').primaryKey(),
    promptKey: text('prompt_key').notNull(),
    version: integer('version').notNull(),
    prompt: text('prompt').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    appliedAt: timestamp('applied_at'),
})
