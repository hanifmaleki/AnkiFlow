import { PromptService } from '../../services/promptService'

export default defineEventHandler(async (event) => {
  try { 
    const promptService = new PromptService()
    const query = getQuery(event)
    const promptKey =
      typeof query.promptKey === 'string' ? query.promptKey : 'system'

    const prompt = await promptService.getLatestPrompt(promptKey)
    
    return {
      ok: true,
      prompt
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch latest prompt',
      data: {
        message: error instanceof Error ? error.message : 'Unknown error occurred.'
      }
    })
  }
})
