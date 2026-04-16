const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

import { ALLOWED_DECKS, type GeneratedCard } from '~~/types/card'
import {
  buildGermanCardSystemPrompt,
  buildGermanCardUserPrompt
} from '../prompts/german-card'

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

function validateGeneratedCard(value: unknown): GeneratedCard {
  if (!value || typeof value !== 'object') {
    throw new Error('Gemini returned invalid card data.')
  }

  const candidate = value as Record<string, unknown>
  const fields = [
    'front',
    'image',
    'back',
    'example',
    'description',
    'deck',
    'tags'
  ] as const

  for (const field of fields) {
    if (typeof candidate[field] !== 'string' || !candidate[field]?.trim()) {
      throw new Error(`Gemini returned an invalid "${field}" value.`)
    }
  }

  return {
    front: candidate.front as string,
    image: candidate.image as string,
    back: candidate.back as string,
    example: candidate.example as string,
    description: candidate.description as string,
    deck: candidate.deck as GeneratedCard['deck'],
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
      systemInstruction: {
        parts: [
          {
            text: buildGermanCardSystemPrompt()
          }
        ]
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: buildGermanCardUserPrompt(word)
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'object',
          properties: {
            front: {
              type: 'string',
              description: 'English-only front-side prompt or gloss.'
            },
            image: {
              type: 'string',
              description: 'Image URL or HTML image snippet, or an empty string when not needed.'
            },
            back: {
              type: 'string',
              description: 'German-only back-side target including formatting rules and optional synonyms.'
            },
            example: {
              type: 'string',
              description: 'German-only example sentence.'
            },
            description: {
              type: 'string',
              description: 'German-only learning notes such as antonyms or usage help.'
            },
            deck: {
              type: 'string',
              enum: [...ALLOWED_DECKS],
              description: 'The Anki deck chosen for this card.'
            },
            tags: {
              type: 'string',
              description: 'A comma-separated tag list for the generated card.'
            }
          },
          required: ['front', 'image', 'back', 'example', 'description', 'deck', 'tags']
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
