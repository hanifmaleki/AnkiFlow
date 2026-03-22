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

- Database
- Authentication
- Complex state management
- Background jobs
- Multi-user support
