const ANKI_CONNECT_URL = 'http://127.0.0.1:8765'
const ANKI_CONNECT_VERSION = 5

type AnkiConnectAction = 'version' | 'deckNames' | 'addNote'

type AnkiConnectRequest<TParams> = {
  action: AnkiConnectAction
  version: number
  params?: TParams
}

type AnkiConnectResponse<TResult> = {
  result: TResult | null
  error: string | null
}

export type AnkiNote = {
  deckName: string
  modelName: string
  fields: Record<string, string>
  tags?: string[]
}

export async function callAnkiConnect<TResult, TParams = undefined>(
  action: AnkiConnectAction,
  params?: TParams
): Promise<TResult> {
  const payload: AnkiConnectRequest<TParams> = {
    action,
    version: ANKI_CONNECT_VERSION
  }

  if (params !== undefined) {
    payload.params = params
  }

  const response = await fetch(ANKI_CONNECT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`AnkiConnect request failed with status ${response.status}.`)
  }

  const data = await response.json() as AnkiConnectResponse<TResult>

  if (data.error) {
    throw new Error(data.error)
  }

  if (data.result === null) {
    throw new Error('AnkiConnect returned no result.')
  }

  return data.result
}

export async function addNote(note: AnkiNote): Promise<number> {
  return callAnkiConnect<number, { note: AnkiNote }>('addNote', { note })
}
