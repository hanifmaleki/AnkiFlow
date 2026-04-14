# Change Log

This file records meaningful project changes as the work progresses.

## 2026-04-12

### Phase 8 real Gemini generation

- Added `server/utils/llm.ts` to call Gemini with structured JSON output
- Replaced the mocked `server/api/generate.post.ts` response with a Gemini-backed generation flow
- Added response validation and clear malformed-response handling for generated card data
- Reused the existing UI contract so generated cards still flow into review and Anki submission

### Phase 7 reviewed preview data to Anki

- Replaced the hardcoded add-to-Anki payload with the current reviewed preview data
- Mapped the preview fields into Anki's `Basic` note fields using the editable word and a composed back field
- Added request validation so empty preview fields fail with a clear error
- Updated the add-to-Anki success message to confirm the reviewed word that was sent

## 2026-04-11

### Phase 6 hardcoded add-to-Anki

- Added `server/api/add-to-anki.post.ts` to create a hardcoded note through AnkiConnect
- Extended `server/utils/anki.ts` with `addNote` support
- Wired the homepage `Add to Anki` button to call the new route after generating a preview
- Added loading, success, and error feedback for the add-to-Anki action

### Phase 5 AnkiConnect spike

- Added `server/utils/anki.ts` with a small helper for calling AnkiConnect actions
- Added `server/api/anki-test.get.ts` to return safe connectivity data from AnkiConnect
- Confirmed the app builds with the new AnkiConnect server route
- Local connectivity to `127.0.0.1:8765` is still pending because no AnkiConnect server was running during verification

### Phase 4 generate API route

- Added `server/api/generate.post.ts` to return mocked card data from a Nuxt server route
- Updated the homepage to call the generate API instead of creating mock data only on the frontend
- Added a loading state to the `Generate` button and a basic error message for failed requests

### Phase 3 static card preview

- Added local mock card data generation on the homepage
- Made the generated-card preview appear only after clicking `Generate`
- Replaced the placeholder preview with editable fields for word, meaning, example sentence, translation hint, and tags
- Kept the `Add to Anki` action disabled while the backend flow is still pending

## 2026-04-06

### Phase 2 homepage shell

- Replaced the Nuxt starter page with a simple AnkiFlow homepage
- Added a centered hero section with title and short description
- Added a word input field and `Generate` button
- Added a generated-card placeholder panel
- Added a disabled `Add to Anki` button to reflect the future workflow
- Switched component styling to SCSS and installed `sass`

## 2026-03-22

### Project setup

- Created the initial project documentation structure in `docs/`
- Added a root `README.md` that points to the documentation
- Added a shared project plan for incremental delivery

### Nuxt bootstrap

- Initialized the app with the Nuxt minimal starter
- Installed project dependencies with `npm`
- Verified the project builds successfully

### Project decisions

- Confirmed Vue/Nuxt as the main learning and implementation stack
- Kept backend logic inside Nuxt server routes
- Chose a review-before-add workflow for Anki note creation
- Continued with the generated Nuxt 4 starter
