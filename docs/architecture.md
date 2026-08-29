# Architecture Notes

This file records the intended shape of the app at a high level.

## Current Direction

Use one Nuxt application for both frontend and backend needs.

That means:

- Vue components for the UI
- Nuxt server routes for API logic
- shared TypeScript types for request and response shapes

## Planned Flow

1. User enters a word on the page.
2. Frontend sends the word to a Nuxt server route.
3. The server route generates structured card content.
4. The frontend shows the generated result for review.
5. User edits or confirms the card.
6. Frontend sends the approved note to another server route.
7. The server route sends the note to AnkiConnect.

## Main Parts

### Frontend

- Word input form
- Generate button
- Preview area
- Editable fields
- Confirm/Add to Anki action

### Nuxt Server

- Generate endpoint
- Add-to-Anki endpoint
- Validation and shaping logic

### External Services

- LLM provider for content generation
- AnkiConnect for local Anki integration

## Why This Shape

- It matches the learning goal for Vue and Nuxt.
- It keeps the LLM key out of the browser.
- It lets us keep the project in one codebase.
- It gives room for future features without a rewrite.

## Things Not Needed Yet

- Authentication
- Complex state management
- Background jobs
- Multi-user support

## Next Persistence Direction

- Use Postgres for structured app data.
- Use a lightweight ORM and migrations so schema changes stay manageable.
- Start with a local development database.
- Keep the schema and connection-string shape compatible with a future hosted Postgres instance.
- Store versioned prompts first, then expand to cards and study data.

## Deck Synchronization

Decks are local-first. Creating, updating, or deleting a deck updates Postgres
immediately. Connecting to Anki later runs an explicit synchronization step.

Writable deck fields live on `DeckInput` in `server/db/entities/decks.ts`.
That type currently has only `name`. Sync metadata (`ankiDeckId`,
`lastChangedAt`, `lastSyncedAt`) is not part of user input.

`DeckService` must not call AnkiConnect directly. The Anki gateway must not
read or write Postgres.

### `server/db/entities/decks.ts`

Local deck rows:

- `name`: full Anki deck path, including hierarchy (`German::Nouns`)
- `ankiDeckId`: null until the deck is known in Anki
- `lastChangedAt`: when the stored name last changed locally
- `lastSyncedAt`: null until a successful sync of that row

### `server/services/deckService.ts`

`DeckService` owns local deck CRUD and decides what to synchronize.

```ts
export class DeckService {
  async listDecks() {
    // Read local decks from Postgres.
  }

  async getDeck(deckId: number) {
    // Read one local deck by id, or 404.
  }

  async create(deck: DeckInput) {
    // Insert a local deck.
    // ankiDeckId: null
    // lastChangedAt: now
    // lastSyncedAt: null
  }

  async updateDeck(deckId: number, deck: DeckInput) {
    // Update the local name.
    // lastChangedAt: now
    // Do not contact Anki here.
  }

  async deleteDeck(deckId: number) {
    // Delete the local row only.
    // Do not contact Anki here.
  }

  async syncFromAnki(gateway: AnkiDeckGateway) {
    // Read remote decks through the gateway.
    // Local deck without ankiDeckId:
    //   bind an existing remote deck with the same name, or create it remotely,
    //   then save ankiDeckId.
    // Remote-only deck: insert it locally.
    // Matching ankiDeckId, names differ, local is already synced:
    //   take the remote name (Anki cannot be renamed from here yet).
    // Matching ankiDeckId otherwise: keep the local name and set lastSyncedAt.
    // A local rename is not pushed to Anki until rename exists on the gateway.
  }
}
```

### `server/services/ankiGatewayService.ts`

`AnkiDeckGateway` is the interface. `AnkiConnectDeckGateway` is the
AnkiConnect implementation. It returns a small remote-deck shape that
`DeckService` can synchronize.

```ts
export type RemoteDeck = {
  id: number
  name: string
  lastChangedAt: Date | null
}

export interface AnkiDeckGateway {
  list(): Promise<RemoteDeck[]>
  create(deck: DeckInput): Promise<RemoteDeck>
  update(id: number, deck: DeckInput): Promise<RemoteDeck>
}
```

- `list()` maps AnkiConnect `deckNamesAndIds`. `lastChangedAt` is always
  `null` because AnkiConnect does not expose a per-deck change time.
- `create()` maps AnkiConnect `createDeck`. The AnkiConnect param is
  `{ deck: name }`, not the `DeckInput` object itself.
- `update()` currently throws 501. AnkiConnect has no deck rename action.

### Current AnkiConnect Limitation

AnkiConnect can list and create decks. It cannot rename a deck or report
when a deck last changed. True last-change-wins sync needs both of those
on the Anki side. Until then, local CRUD stays local, and `syncFromAnki`
only creates missing remote decks, binds matching names, and copies
remote-only decks into Postgres.
