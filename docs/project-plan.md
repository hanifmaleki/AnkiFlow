# AnkiFlow Project Plan

This file is the working board for the project.

It has two goals:

1. Keep the project small and learnable.
2. Give both the human and the assistant one clear list of next steps.

## Project Goal

Build a Nuxt app that lets you:

1. Enter a word.
2. Generate card content with an LLM.
3. Review and edit the result.
4. Confirm and add it to Anki through AnkiConnect.

## Working Rules

- Only do one small step at a time.
- After each step, run the app and verify it works.
- Do not add complexity early.
- Prefer visible progress over hidden architecture.
- Keep notes in this file up to date.

## Current Phase

Phase 8: Real LLM Generation

## Progress Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Done
- `[!]` Blocked

---

## Phase 0: Project Setup Plan

### 0.1 Define the first version

- [x] Decide the project goal.
- [x] Choose the main stack: Nuxt + TypeScript.
- [x] Decide the main user flow: enter word -> review generated result -> confirm -> add to Anki.
- [ ] Decide the initial language pair for cards.
- [ ] Decide the Anki deck name for development.
- [ ] Decide the note fields for v1.

### 0.2 Create the project board

- [x] Add this Markdown planning file.
- [x] Keep this file updated as tasks are completed.

---

## Phase 1: Bootstrap the App

Goal: get a minimal Nuxt app running locally.

- [x] Initialize a new Nuxt project.
- [x] Install dependencies.
- [x] Start the dev server.
- [x] Verify the default Nuxt page opens in the browser.
- [x] Make the home page show a simple title: `AnkiFlow`.
- [x] Commit or checkpoint the state if desired.

## Definition of done

- Nuxt app runs locally.
- Home page loads without errors.

---

## Phase 2: Replace the Starter Page

Goal: create a minimal UI shell for the project.

- [x] Create a simple page layout.
- [x] Add a text input for a word.
- [x] Add a `Generate` button.
- [x] Add a placeholder area for generated content.
- [x] Add a placeholder `Add to Anki` button in disabled state.
- [x] Keep the page intentionally simple.

## Definition of done

- You can type a word into the page.
- The page looks like the beginning of the product.

---

## Phase 3: Static Card Preview

Goal: learn the UI flow before adding any backend logic.

- [x] Create a local mock object for generated card data.
- [x] Show fields like:
  - Word
  - Meaning
  - Example sentence
  - Translation or native-language hint
  - Tags
- [x] Render the mock data in a card preview.
- [x] Enable the review area only after clicking `Generate`.
- [x] Make the preview fields editable in the UI.

## Definition of done

- Clicking `Generate` shows mock card data.
- You can edit the preview before confirming.

---

## Phase 4: First Nuxt Server API Route

Goal: introduce the idea of backend inside Nuxt in the smallest possible way.

- [x] Create `server/api/generate.post.ts`.
- [x] Accept a word from the frontend.
- [x] Return mocked JSON instead of calling an LLM.
- [x] Connect the page to this API route.
- [x] Replace frontend-only mock data with API response data.
- [x] Show a loading state while waiting for the response.
- [x] Show a basic error message if the request fails.

## Definition of done

- Frontend calls the Nuxt server route successfully.
- The page displays returned mock card data.

---

## Phase 5: AnkiConnect Spike

Goal: prove that the app can talk to Anki.

- [x] Read the AnkiConnect endpoint and required actions.
- [x] Create `server/utils/anki.ts`.
- [x] Add a function to call AnkiConnect.
- [x] Add a test route such as `server/api/anki-test.get.ts`.
- [x] Return a safe response like version info or deck list.
- [ ] Run Anki locally and verify the app can reach AnkiConnect.

## Definition of done

- Nuxt can successfully call AnkiConnect.
- We know local connectivity works.

---

## Phase 6: Add a Note to Anki with Hardcoded Data

Goal: make the smallest successful card creation.

- [x] Create `server/api/add-to-anki.post.ts`.
- [x] Send one hardcoded note to a chosen test deck.
- [x] Trigger this route from the UI.
- [x] Show success or failure on the page.
- [ ] Verify the note appears in Anki.

## Definition of done

- A note created from the app appears in Anki.

## Phase 7: Send Reviewed UI Data to Anki

Goal: connect the editable preview to real card creation.

- [x] Replace hardcoded note data with the edited preview data.
- [x] Map UI fields to Anki note fields.
- [x] Add basic payload validation.
- [x] Disable submit while request is in progress.
- [x] Show a clear success message after adding the note.

## Definition of done

- Edited preview content is what gets added to Anki.

---

## Phase 8: Real LLM Generation

Goal: replace mocked generation with real model output.

- [x] Choose the LLM provider.
- [x] Add environment variable support for the API key.
- [x] Create `server/utils/llm.ts`.
- [x] Write a strict prompt for structured flashcard output.
- [x] Validate the returned JSON.
- [x] Handle malformed responses safely.
- [x] Connect the generate API route to the LLM.

## Definition of done

- Entering a word produces real generated card content.

---

## Phase 9: Duplicate Checks

Goal: avoid adding the same word multiple times.

- [x] Decide what counts as a duplicate.
- [x] Add an AnkiConnect search before creating a note.
- [x] Show duplicate warnings in the UI.
- [x] Prevent accidental duplicate inserts.

Duplicate rule:

- A card is a duplicate when the same English `Front` already exists in the same deck.
- Compare the `Front` value after trimming whitespace and normalizing case.
- Allow the same front text in a different deck when the meaning or part of speech is different.

## Definition of done

- The app warns or blocks when the word already exists.

---

## Phase 8.5: Preview Polish

Goal: make the generated preview easier to read before adding duplicate checks.

- [ ] Render supported inline markup in the preview, including `b`, `der`, `die`, `das`, `nom`, `akk`, `dat`, and `refl`.
- [ ] Show a fallback image placeholder when the generated image is `null`.
- [ ] Keep the implementation lightweight and local unless a reusable component becomes clearly useful.

## Definition of done

- The preview shows styled card content instead of literal markup.
- The image area still looks intentional when no image is generated.

---

## Phase 10: Basic Product Quality

Goal: make the app stable enough for regular use.

- [ ] Add simple composables or utilities where repetition appears.
- [ ] Add basic tests for critical logic.
- [ ] Add basic form validation.
- [ ] Improve loading and error states.
- [ ] Add a simple configuration story for deck and note type.
- [ ] Write setup instructions in `README.md`.

## Definition of done

- Another person can set up and run the project.

---

## Phase 11: Nice-to-Have Features

Only after the core flow works.

- [ ] Save recent generated words.
- [ ] Add a history page.
- [ ] Add tags based on source or topic.
- [ ] Add pronunciation or audio fields.
- [ ] Add multiple card templates.
- [ ] Add support for multiple languages.
- [ ] Add import from clipboard, browser, or mobile share flow.

---

## Next Version Plan

Goal: rebuild the UI in small learnable steps.

### Phase 12: UI Foundation

- [ ] Replace the current homepage with a simple placeholder layout.
- [ ] Keep each major area visible with borders and labels.
- [ ] Use this version to learn the future layout before adding behavior.

### Phase 13: Reusable Card Components

- [ ] Make the rendered HTML preview a reusable component.
- [ ] Make the card form a reusable component and keep it editable.
- [ ] Keep safe rendering logic inside the component.

### Phase 14: Card Browser

- [ ] Add a basic screen to browse current cards.
- [ ] Add search or filtering by deck and text.
- [ ] Prepare the edit/regenerate flow for a selected card.

### Phase 15: Prompt Settings

- [ ] Add a UI for viewing and editing the system prompt.
- [ ] Add a reset-to-default action.
- [ ] Decide how prompt changes are stored.

### Phase 16: UI Redesign

- [ ] Redesign the layout once the structure is stable.
- [ ] Make the app feel polished and consistent.
- [ ] Keep the design simple enough to support learning.

---

## Immediate Next Step

The next step should be:

- [ ] Build the UI foundation as a simple placeholder layout.

---

## Decisions Log Summary

- [x] Use Vue/Nuxt because learning Vue/Nuxt is a secondary project goal.
- [x] Keep backend logic inside Nuxt server routes.
- [x] Start with a review-before-add flow.
- [x] Continue with the generated Nuxt 4 starter.
- [x] Use a shared card schema for frontend and backend.
- [ ] Choose the initial target language.
- [ ] Choose the Anki deck and note model for development.

---

## Notes for the Assistant

When helping on this project:

- Prefer the smallest possible next step.
- Do not jump ahead unless asked.
- Keep this file updated when a task is completed or the plan changes.
- Favor learning value, not only speed.
