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

The project has implemented Phase 8's Gemini-backed generation flow and the shared German card schema.

The next implementation step is:

- Start the persistence foundation with a local Postgres database and ORM setup

## Environment

For local Gemini experiments, set your API key in `.env`:

```bash
GEMINI_API_KEY=your-gemini-api-key-here
```

Nuxt reads this through `runtimeConfig.geminiApiKey`.

The next major product step is adding versioned prompt storage and preparing the app for future card persistence.

## Goals

- Build a useful local tool for adding words to Anki
- Learn Vue and Nuxt while building it
- Keep the implementation incremental and easy to understand
