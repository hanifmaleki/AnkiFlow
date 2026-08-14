<script setup lang="ts">
import { ALLOWED_DECKS } from '../../types/card'
import type { GeneratedCard } from '../../types/card'

const card = defineModel<GeneratedCard>({ required: true })

const imageValue = computed({
  get: () => card.value.image ?? '',
  set: (value: string) => {
    card.value.image = value.trim() ? value : null
  }
})
</script>

<template>
  <form class="card-form" @submit.prevent>
    <HtmlFieldInput v-model="card.front"
                    label="Front"
                    placeholder="English front text" />

    <label class="field" for="card-image">
      <span class="field-label">Image</span>
      <input
        id="card-image"
        v-model="imageValue"
        class="field-input"
        type="text"
        placeholder="Image URL or leave empty"
      >
    </label>

    <HtmlFieldInput
      v-model="card.back"
      label="Back"
      multiline
      :rows="3"
      placeholder="German back with optional markup"
    />

    <HtmlFieldInput
      v-model="card.example"
      label="Example"
      multiline
      :rows="4"
      placeholder="German example sentence"
    />

    <HtmlFieldInput
      v-model="card.description"
      label="Description"
      multiline
      :rows="3"
      placeholder="German description"
    />

    <label class="field" for="card-deck">
      <span class="field-label">Deck</span>
      <select
        id="card-deck"
        v-model="card.deck"
        class="field-input"
      >
        <option
          v-for="deck in ALLOWED_DECKS"
          :key="deck"
          :value="deck"
        >
          {{ deck }}
        </option>
      </select>
    </label>

    <label class="field" for="card-tags">
      <span class="field-label">Tags</span>
      <input
        id="card-tags"
        v-model="card.tags"
        class="field-input"
        type="text"
        placeholder="Comma-separated tags"
      >
    </label>
  </form>
</template>

<style scoped lang="scss">
.card-form {
  display: grid;
  gap: 1rem;
}

.field {
  display: grid;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-strong);
}

.field-input {
  padding: 0.95rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.9rem;
  background: var(--color-bg);
  color: var(--color-text);
  font: inherit;

  &::placeholder {
    color: var(--color-text-soft);
  }

  &:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}
</style>
