import { PromptService } from '../services/promptService';
import { generateCardWithGemini } from '../utils/llm'

type GenerateCardRequest = {
  word?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<GenerateCardRequest>(event)
  const word = body?.word?.trim() || 'serendipity'
  const runtimeConfig = useRuntimeConfig(event)
  const systemPrompt = await new PromptService().getLatestPrompt('system')

  if (!systemPrompt) {
    throw createError({
      statusCode: 503,
      statusMessage: 'System prompt is not configured.',
    })
  }

  try {
    return await generateCardWithGemini(word, runtimeConfig.geminiApiKey, systemPrompt.prompt)
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Unknown Gemini generation error.'

    throw createError({
      statusCode: 502,
      statusMessage: 'Could not generate card content.',
      data: {
        message
      }
    })
  }
})
