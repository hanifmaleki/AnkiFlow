# AnkiFlow

AnkiFlow is a Nuxt-based project for generating Anki cards from words with an LLM-assisted review flow.

The intended user flow is:

1. Enter a word.
2. Generate card content.
3. Review and edit the result.
4. Confirm and add the note to Anki through AnkiConnect.

## Documentation

Project documentation lives in the `docs/` folder.

Start here:

- [Project Docs](./docs/index.md)

Main documents:

- [Project Plan](./docs/project-plan.md)
- [Architecture Notes](./docs/architecture.md)
- [Decisions Log](./docs/decisions.md)
- [Setup Notes](./docs/setup.md)

## Current Status

The project has implemented a Gemini-backed German card generation flow aligned to the real Anki setup.

The next implementation step is:

- Add duplicate checks before creating notes

## Environment

For local Gemini experiments, set your API key in `.env`:

```bash
GEMINI_API_KEY=your-gemini-api-key-here
```

Nuxt reads this through `runtimeConfig.geminiApiKey`.

## Current Card Shape

Generated cards now target these Anki fields:

- `Front`
- `Image`
- `Back`
- `Example`
- `Description`

Additional metadata:

- `Deck`
- `Tags`

Current German card profile:

- `Front` is English only
- `Back`, `Example`, and `Description` are German only
- `Deck` is auto-classified into `Adjektive`, `Nomen`, `Redewendungen`, or `Verben`
- `Image` stays empty unless a visual aid is genuinely helpful

## Goals

- Build a useful local tool for adding words to Anki
- Learn Vue and Nuxt while building it
- Keep the implementation incremental and easy to understand
