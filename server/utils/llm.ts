const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

import { ALLOWED_DECKS } from '../../types/card'
import type { GeneratedCard } from '../../types/card'

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
    'You are generating one Anki flashcard for a German learner.',
    'Return exactly one JSON object that matches the provided schema.',
    'Use concise, learner-friendly wording.',
    'For image, prefer null unless a direct, valid image URL is obvious and reliable.',
    'The word to generate a card for is:',
    word
  ].join('\n\n')
}

async function normalizeImageUrl(image: unknown): Promise<string | null> {
  if (typeof image !== 'string') {
    return null
  }

  const trimmed = image.trim()

  if (!trimmed) {
    return null
  }

  let url: URL

  try {
    url = new URL(trimmed)
  } catch {
    return null
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    return null
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 2500)

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal
    })
    const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''

    if (!response.ok || !contentType.startsWith('image/')) {
      return null
    }

    return url.toString()
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

async function validateGeneratedCard(value: unknown): Promise<GeneratedCard> {
  if (!value || typeof value !== 'object') {
    throw new Error('Gemini returned invalid card data.')
  }

  const candidate = value as Record<string, unknown>
  const fields = [
    'front',
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

  const image = await normalizeImageUrl(candidate.image)

  if (!ALLOWED_DECKS.includes(candidate.deck as GeneratedCard['deck'])) {
    throw new Error('Gemini returned an invalid "deck" value.')
  }

  return {
    front: candidate.front as string,
    image,
    back: candidate.back as string,
    example: candidate.example as string,
    description: candidate.description as string,
    deck: candidate.deck as GeneratedCard['deck'],
    tags: candidate.tags as string
  }
}

export async function 
generateCardWithGemini(word: string, apiKey: string, systemPrompt: string): Promise<GeneratedCard> {
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
       system_instruction: {
        parts: [
            { text: systemPrompt }
        ]
      },
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
            front: {
              type: 'string',
              description: 'English-only front field.'
            },
            image: {
              type: ['string', 'null'],
              description: 'Image URL or null.'
            },
            back: {
              type: 'string',
              description: 'German-only back field.'
            },
            example: {
              type: 'string',
              description: 'German-only example sentence.'
            },
            description: {
              type: 'string',
              description: 'German-only learning description.'
            },
            deck: {
              type: 'string',
              enum: [...ALLOWED_DECKS],
              description: 'One deck name chosen by the model.'
            },
            tags: {
              type: 'string',
              description: 'A comma-separated tag list for the generated card.'
            }
          },
          required: ['front', 'back', 'example', 'description', 'deck', 'tags']
        }
      }
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Gemini request failed with status ${response.status}. ${JSON.stringify(errorData)}`)
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
