# Decisions Log

This file records important technical and product choices.

## Current Decisions

### Framework

- Decision: Use Nuxt with TypeScript.
- Reason: The project supports learning Vue/Nuxt and still provides frontend and backend in one app.

### Nuxt Version

- Decision: Continue with the generated Nuxt 4 starter.
- Reason: The project was bootstrapped successfully with Nuxt 4 and it fits the learning goals and planned architecture.

### Backend Style

- Decision: Keep backend logic inside Nuxt server routes.
- Reason: This is enough for LLM calls and AnkiConnect without introducing a separate service.

### Product Flow

- Decision: Use a review-before-add workflow.
- Reason: Generated content should be visible and editable before it reaches Anki.

### Persistence Direction

- Decision: Start with Postgres and a lightweight ORM, using a local development database first.
- Reason: The app is heading toward structured persistence for versioned prompts, cards, and study data, and Postgres fits that path well while still supporting a future cloud deployment.

## Open Decisions

- Initial target language
- Initial Anki deck name
- Initial note model and field mapping
- LLM provider
- ORM choice for persistence
- Local vs hosted database provider
