<script setup lang="ts">
import type { GeneratedCard } from '../../types/card'

type AddToAnkiResponse = {
  ok: boolean
  noteId: number
  deckName: string
  modelName: string
}

const word = ref('')
const previewCard = ref<GeneratedCard | null>(null)
const isGenerating = ref(false)
const generateError = ref('')
const isAddingToAnki = ref(false)
const addToAnkiStatus = ref('')
const addToAnkiTone = ref<'success' | 'error' | 'warning'>('success')

async function generatePreview() {
  isGenerating.value = true
  generateError.value = ''
  addToAnkiStatus.value = ''

  try {
    previewCard.value = await $fetch<GeneratedCard>('/api/generate', {
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

async function addReviewedCardToAnki() {
  if (!previewCard.value) {
    addToAnkiTone.value = 'error'
    addToAnkiStatus.value = 'Generate a card before adding it to Anki.'
    return
  }

  isAddingToAnki.value = true
  addToAnkiStatus.value = ''

  try {
    const response = await $fetch<AddToAnkiResponse>('/api/add-to-anki', {
      method: 'POST',
      body: previewCard.value
    })

    addToAnkiTone.value = 'success'
    addToAnkiStatus.value =
      `Added card to ${response.deckName} as note ${response.noteId}.`
  } catch (error) {
    const fetchError = error as {
      statusCode?: number
      data?: {
        duplicate?: boolean
        front?: string
        deck?: string
        noteIds?: number[]
        message?: string
      }
      message?: string
    }

    if (fetchError.statusCode === 409 || fetchError.data?.duplicate) {
      addToAnkiTone.value = 'warning'
      addToAnkiStatus.value =
        fetchError.data?.message ??
        'This card already exists in Anki, so it was not added again.'
    } else {
      addToAnkiTone.value = 'error'

      const message = error instanceof Error
        ? error.message
        : fetchError.data?.message ?? 'Could not add note to Anki.'

      addToAnkiStatus.value = message
    }
  } finally {
    isAddingToAnki.value = false
  }
}
</script>

<template>
  <section class="generate-layout">
    <AppPanel label="Word Input">
      <div class="input-panel" aria-label="Word input">
        <label class="input-label" for="word">Word</label>
        <div class="input-row">
          <input
            id="word"
            v-model="word"
            class="word-input"
            type="text"
            placeholder="Enter a word"
            @keyup.enter="generatePreview"
          >
          <AppButton
            :disabled="isGenerating"
            @click="generatePreview"
          >
            {{ isGenerating ? 'Generating...' : 'Generate' }}
          </AppButton>
        </div>
        <p v-if="generateError" class="error-message" role="alert">
          {{ generateError }}
        </p>
      </div>
    </AppPanel>

    <AppPanel label="Card Editor">
      <template v-if="previewCard">
        <CardEditorForm v-model="previewCard" />
        <AppButton
          variant="secondary"
          class="preview-action preview-action--enabled"
          :disabled="isAddingToAnki"
          @click="addReviewedCardToAnki"
        >
          {{ isAddingToAnki ? 'Adding to Anki...' : 'Add to Anki' }}
        </AppButton>
        <p
          v-if="addToAnkiStatus"
          :class="['status-message', `status-message--${addToAnkiTone}`]"
          role="status"
        >
          {{ addToAnkiStatus }}
        </p>
      </template>
      <template v-else>
        <div class="placeholder-box">
          Enter a word and click Generate to preview the card.
        </div>
        <button class="preview-action" type="button" disabled>
          Add to Anki
        </button>
      </template>
    </AppPanel>
  </section>
</template>

<style scoped lang="scss">
.generate-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.input-label {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-strong);
}

.input-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
}

.word-input,
.generate-button,
.preview-action {
  border-radius: 0.9rem;
  border: 1px solid var(--color-border);
  font: inherit;
}

.word-input {
  width: 100%;
  padding: 0.95rem 1rem;
  background: var(--color-bg);
  color: var(--color-text);

  &::placeholder {
    color: var(--color-text-soft);
  }

  &:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}

.generate-button {
  padding: 0.95rem 1.25rem;
  background: var(--color-accent);
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

.placeholder-box {
  min-height: 9rem;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 1rem;
  border: 1px solid var(--color-border-soft);
  border-radius: 1rem;
  background: var(--color-bg-subtle);
  color: var(--color-text-muted);
}

.preview-action {
  margin-top: 1.25rem;
  padding: 0.9rem 1.2rem;
  background: #e5e7eb;
  color: #6b7280;
  cursor: not-allowed;
}

.preview-action--enabled {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
  cursor: pointer;

  &:hover {
    background: #1f2937;
  }

  &:disabled {
    background: #9ca3af;
    border-color: #9ca3af;
    cursor: wait;
  }
}

.status-message {
  margin: 0.75rem 0 0;
}

.status-message--success {
  color: #047857;
}

.status-message--error {
  color: #b91c1c;
}

.status-message--warning {
  color: #b45309;
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
