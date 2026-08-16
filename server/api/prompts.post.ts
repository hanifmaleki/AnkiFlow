import { PromptService } from '../services/promptService'

type CreatePromptBody = {
  promptKey?: string
  prompt?: string
}

export default defineEventHandler(async (event) => {
  try { 
    const service = new PromptService()
    const body = await readBody<CreatePromptBody>(event)

    const prompt = await service.createPromptVersion({
      promptKey: body?.promptKey,
      prompt: body?.prompt
    })

    return {
      ok: true,
      prompt
    }
  } catch (error) {
    if (isError(error)) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create prompt',
      data: {
        message: error instanceof Error ? error.message : 'Unknown prompt creation error.'
      }
    })
  }
})
