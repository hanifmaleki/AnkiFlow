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

The project has completed Phase 4 of the initial UI and API work.

The next implementation step is:

- Read the AnkiConnect endpoint and required actions

## Goals

- Build a useful local tool for adding words to Anki
- Learn Vue and Nuxt while building it
- Keep the implementation incremental and easy to understand
