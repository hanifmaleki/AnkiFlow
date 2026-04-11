type GenerateCardResponse = {
  word: string
  meaning: string
  exampleSentence: string
  translationHint: string
  tags: string
}

type GenerateCardRequest = {
  word?: string
}

function createMockCard(inputWord: string): GenerateCardResponse {
  const cleanWord = inputWord.trim() || 'serendipity'

  return {
    word: cleanWord,
    meaning: 'A pleasant surprise or a lucky discovery.',
    exampleSentence: `Finding the perfect example for "${cleanWord}" felt like pure serendipity.`,
    translationHint: 'Lucky accident; pleasant surprise.',
    tags: 'vocabulary, everyday-english, review'
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<GenerateCardRequest>(event)

  return createMockCard(body?.word ?? '')
})
