const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export type GeneratedCard = {
  word: string
  meaning: string
  exampleSentence: string
  translationHint: string
  tags: string
}

type GeminiPart = {
  text?: string
}

type GeminiCandidate = {
  content?: {
    parts?: GeminiPart[]
  }
}

type GeminiResponse = {
  candidates?: GeminiCandidate[]
}

function buildPrompt(word: string): string {
  return [
    'You are generating one Anki flashcard for a language learner.',
    'Return exactly one JSON object that matches the provided schema.',
    'Use concise, learner-friendly wording.',
    'The word to generate a card for is:',
    word
  ].join('\n\n')
}

function validateGeneratedCard(value: unknown): GeneratedCard {
  if (!value || typeof value !== 'object') {
    throw new Error('Gemini returned invalid card data.')
  }

  const candidate = value as Record<string, unknown>
  const fields = [
    'word',
    'meaning',
    'exampleSentence',
    'translationHint',
    'tags'
  ] as const

  for (const field of fields) {
    if (typeof candidate[field] !== 'string' || !candidate[field]?.trim()) {
      throw new Error(`Gemini returned an invalid "${field}" value.`)
    }
  }

  return {
    word: candidate.word as string,
    meaning: candidate.meaning as string,
    exampleSentence: candidate.exampleSentence as string,
    translationHint: candidate.translationHint as string,
    tags: candidate.tags as string
  }
}

export async function generateCardWithGemini(word: string, apiKey: string): Promise<GeneratedCard> {
  if (!apiKey.trim()) {
    throw new Error('GEMINI_API_KEY is not configured.')
  }

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: buildPrompt(word)
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'object',
          properties: {
            word: {
              type: 'string',
              description: 'The target word exactly as it should appear on the flashcard front.'
            },
            meaning: {
              type: 'string',
              description: 'A concise learner-friendly meaning.'
            },
            exampleSentence: {
              type: 'string',
              description: 'A natural example sentence using the word.'
            },
            translationHint: {
              type: 'string',
              description: 'A short native-language-friendly hint or gloss.'
            },
            tags: {
              type: 'string',
              description: 'A comma-separated tag list for the generated card.'
            }
          },
          required: ['word', 'meaning', 'exampleSentence', 'translationHint', 'tags']
        }
      }
    })
  })

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}.`)
  }

  const data = await response.json() as GeminiResponse
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('Gemini returned no text response.')
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Gemini returned malformed JSON.')
  }

  return validateGeneratedCard(parsed)
}
