import { prompts } from '../db/entities/prompts'
import { db } from '../db/client'
import { desc, eq } from 'drizzle-orm'

export type PromptRecord = typeof prompts.$inferSelect
export type NewPromptRecord = {
    promptKey: string
    prompt: string
}

function requireText(value: string | undefined, label: string): string {
    const trimmed = value?.trim()

    if (!trimmed) {
        throw createError({
            statusCode: 400,
            statusMessage: `${label} is required`,
        })
    }

    return trimmed
}

export class PromptService { 
    async listPrompts(promptKey?: string): Promise<PromptRecord[]> {
        if (promptKey) {
            return db
                .select()
                .from(prompts)
                .where(eq(prompts.promptKey, promptKey))
                .orderBy(desc(prompts.version))
        }

        return db
            .select()
            .from(prompts)
            .orderBy(desc(prompts.version))
    }

    async getLatestPrompt(promptKey: string): Promise<PromptRecord | null> {
        const row = await db
            .select()
            .from(prompts)
            .where(eq(prompts.promptKey, promptKey))
            .orderBy(desc(prompts.version))
            .limit(1)

        return row[0] || null
    }

    async createPromptVersion(input: NewPromptRecord): Promise<PromptRecord> {
        const promptKey = requireText(input.promptKey, 'Prompt Key')
        const prompt = requireText(input.prompt, 'Prompt')

        const latestPrompt = await this.getLatestPrompt(promptKey)
        const nextVersion = latestPrompt ? latestPrompt.version + 1 : 1

        const rows = await db
            .insert(prompts)
            .values({
                promptKey,
                version: nextVersion,
                prompt,
            })
            .returning()
            
        return rows[0]
    }

    async markPromptAsApplied(id: number): Promise<PromptRecord> {
        const rows = await db
            .update(prompts)
            .set({
                appliedAt: new Date(),
            })
            .where(eq(prompts.id, id))
            .returning()

        const updatedPrompt = rows[0]

        if (!updatedPrompt) {
            throw createError({
                statusCode: 404,
                statusMessage: `Prompt with ID ${id} not found`,
            })
        }
        
        return updatedPrompt
    }
}