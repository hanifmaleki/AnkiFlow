<script setup lang="ts">
type CardPreview = {
  word: string
  meaning: string
  exampleSentence: string
  translationHint: string
  tags: string
}

const word = ref('')
const previewCard = ref<CardPreview | null>(null)
const isGenerating = ref(false)
const generateError = ref('')

async function generatePreview() {
  isGenerating.value = true
  generateError.value = ''

  try {
    previewCard.value = await $fetch<CardPreview>('/api/generate', {
      method: 'POST',
      body: {
        word: word.value
      }
    })
  } catch {
    previewCard.value = null
    generateError.value = 'Could not generate a preview. Please try again.'
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>
  <main class="page">
    <NuxtRouteAnnouncer />
    <div class="shell">
      <section class="hero">
        <h1 class="title">AnkiFlow</h1>
        <p class="subtitle">
          Generate and review Anki cards before adding them.
        </p>
      </section>

      <section class="input-panel" aria-label="Word input">
        <label class="input-label" for="word">Word</label>
        <div class="input-row">
          <input
            id="word"
            v-model="word"
            class="word-input"
            type="text"
            placeholder="Enter a word"
          >
          <button
            class="generate-button"
            type="button"
            :disabled="isGenerating"
            @click="generatePreview"
          >
            {{ isGenerating ? 'Generating...' : 'Generate' }}
          </button>
        </div>
        <p v-if="generateError" class="error-message" role="alert">
          {{ generateError }}
        </p>
      </section>

      <section class="preview-panel" aria-label="Card preview">
        <template v-if="previewCard">
          <p class="preview-eyebrow">Generated card</p>
          <h2 class="preview-title">Review and edit the preview</h2>
          <p class="preview-copy">
            This is still mock data for now, but the review flow is live.
          </p>

          <div class="card-form">
            <label class="field">
              <span class="field-label">Word</span>
              <input
                v-model="previewCard.word"
                class="field-input"
                type="text"
              >
            </label>

            <label class="field">
              <span class="field-label">Meaning</span>
              <textarea
                v-model="previewCard.meaning"
                class="field-input field-textarea"
                rows="3"
              />
            </label>

            <label class="field">
              <span class="field-label">Example sentence</span>
              <textarea
                v-model="previewCard.exampleSentence"
                class="field-input field-textarea"
                rows="4"
              />
            </label>

            <label class="field">
              <span class="field-label">Translation hint</span>
              <textarea
                v-model="previewCard.translationHint"
                class="field-input field-textarea"
                rows="3"
              />
            </label>

            <label class="field">
              <span class="field-label">Tags</span>
              <input
                v-model="previewCard.tags"
                class="field-input"
                type="text"
              >
            </label>
          </div>

          <button class="preview-action" type="button" disabled>
            Add to Anki
          </button>
        </template>

        <template v-else>
          <p class="preview-eyebrow">Generated card</p>
          <h2 class="preview-title">No generated card yet</h2>
          <p class="preview-copy">
            Enter a word and click Generate to preview the card before adding it
            to Anki.
          </p>
          <button class="preview-action" type="button" disabled>
            Add to Anki
          </button>
        </template>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
}

.shell {
  width: min(100%, 42rem);
}

.hero {
  text-align: center;
}

.title {
  margin: 0;
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  line-height: 1;
}

.subtitle {
  margin: 1rem 0 0;
  font-size: 1.125rem;
  line-height: 1.6;
  color: #4b5563;
}

.input-panel {
  margin-top: 2.5rem;
}

.input-label,
.field-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
}

.input-label {
  margin-bottom: 0.75rem;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
}

.word-input,
.generate-button,
.field-input {
  border-radius: 0.9rem;
  border: 1px solid #d1d5db;
  font: inherit;
}

.word-input,
.field-input {
  width: 100%;
  padding: 0.95rem 1rem;
  background: #fff;
  color: #111827;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: 2px solid #111827;
    outline-offset: 2px;
  }
}

.generate-button {
  padding: 0.95rem 1.25rem;
  background: #111827;
  color: #fff;
  cursor: pointer;

  &:hover {
    background: #1f2937;
  }

  &:disabled {
    background: #9ca3af;
    cursor: wait;
  }
}

.error-message {
  margin: 0.75rem 0 0;
  color: #b91c1c;
}

.preview-panel {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  background: #f9fafb;
}

.preview-eyebrow {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7280;
}

.preview-title {
  margin: 0.5rem 0 0;
  font-size: 1.5rem;
  color: #111827;
}

.preview-copy {
  margin: 0.75rem 0 0;
  line-height: 1.7;
  color: #4b5563;
}

.card-form {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

.field {
  display: grid;
  gap: 0.5rem;
}

.field-textarea {
  min-height: 7rem;
  resize: vertical;
}

.preview-action {
  margin-top: 1.25rem;
  padding: 0.9rem 1.2rem;
  border: 1px solid #d1d5db;
  border-radius: 0.9rem;
  background: #e5e7eb;
  color: #6b7280;
  font: inherit;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .input-row {
    grid-template-columns: 1fr;
  }

  .generate-button {
    width: 100%;
  }
}
</style>
