# Decisions Log

This file records important technical and product choices.

## Current Decisions

### Framework

- Decision: Use Nuxt 3 with TypeScript.
- Reason: The project supports learning Vue/Nuxt and still provides frontend and backend in one app.

### Backend Style

- Decision: Keep backend logic inside Nuxt server routes.
- Reason: This is enough for LLM calls and AnkiConnect without introducing a separate service.

### Product Flow

- Decision: Use a review-before-add workflow.
- Reason: Generated content should be visible and editable before it reaches Anki.

## Open Decisions

- Initial target language
- Initial Anki deck name
- Initial note model and field mapping
- LLM provider
