import { PromptService } from '../services/promptService'

export default defineEventHandler(async (event) => {
  try { 
    const service = new PromptService()
    const query = getQuery(event)
    const promptKey = typeof query.promptKey === 'string' ? query.promptKey : undefined

    const prompts = await service.listPrompts(promptKey)

    return {
      ok: true,
      prompts
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch prompts',
      data: {
        message: error instanceof Error ? error.message : 'Unknown prompt load error.'
      }
    })
  }
})
