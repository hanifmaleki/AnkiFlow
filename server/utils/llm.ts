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

function buildSystemPrompt() {
    return [
        'You generate Anki card data for a German learner.',
        'Return exactly one JSON object matching the provided schema.',
        'Do not include markdown fences or any explanation outside the JSON object.',
        '',
        'Field rules:',
        '- front must be English only.',
    '- image is a separate field and may be an empty string or null.',
        '- back must be German only.',
        '- example must be German only.',
        '- description must be German only.',
        '- deck must be exactly one of: Adjektive, Nomen, Redewendungen, Verben.',
        '- tags must be a comma-separated string.',
        '',
        'Classification rules:',
        '- Nouns go to deck "Nomen" and include tag "Nomen".',
        '- Verbs go to deck "Verben" and include tag "Verb".',
        '- Adjectives go to deck "Adjektive" and include tag "Adjektiv".',
        '- Idioms and fixed expressions go to deck "Redewendungen" and include tag "Redewendung".',
        '',
        'Extra tag rules:',
        '- Add tag "Präposition" when the word commonly requires a preposition.',
        '- Add tag "Küche" for food or cooking-related terms.',
        '- Add tag "Kleidung" for clothing-related terms.',
        '- Add tag "Tier" for animals.',
        '',
        'Formatting rules for German output:',
        '- If the target is a noun, include the article and wrap it with one of <der>...</der>, <die>...</die>, <das>...</das>.',
        '- If case information is relevant, use <nom>...</nom>, <akk>...</akk>, <dat>...</dat>.',
        '- If the verb is reflexive, write <refl>sich</refl>.',
        '- Wrap the main German target word in <b>...</b>.',
        '- In back, if synonyms are useful, append: <br /><br /><b>Synonym:</b><br /> and list each synonym separated by <br>.',
        '- In description, if an antonym is useful, include: <b>Antonym:</b> ...',
        '',
        'Content quality rules:',
        '- Front should be clear English that helps active recall into German.',
        '- Back, example, and description must contain no English.',
        '- Example should be natural, practical, and learner-friendly German.',
        '- Description should contain helpful German-only learning notes.',
        '- Use image only when it materially helps with concrete visual concepts such as food, clothing, animals, or objects. Otherwise return an empty string.',
    '- Keep tags concise and relevant.'
    ].join('\n')
}

function buildPrompt(word: string): string {
  return [
    'You are generating one Anki flashcard for a German learner.',
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

  const image = candidate.image
  if (image !== undefined && image !== null && typeof image !== 'string') {
    throw new Error('Gemini returned an invalid "image" value.')
  }

  if (!ALLOWED_DECKS.includes(candidate.deck as GeneratedCard['deck'])) {
    throw new Error('Gemini returned an invalid "deck" value.')
  }

  return {
    front: candidate.front as string,
    image: typeof image === 'string' && image.trim() ? image : null,
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
       system_instruction: {
        parts: [
            { text: buildSystemPrompt() }
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
