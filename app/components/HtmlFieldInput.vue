<script setup lang="ts">
import { renderPreviewMarkup } from '../../shared/previewMarkup'

type ViewMode = 'html' | 'raw'

const props = withDefaults(defineProps<{
  label: string
  multiline?: boolean
  rows?: number
  placeholder?: string
  id?: string
}>(), {
  multiline: false,
  rows: 3,
  placeholder: '',
  id: undefined
})

const model = defineModel<string>({ required: true })

const viewMode = ref<ViewMode>('html')

const fieldId = computed(() => props.id ?? `field-${props.label.toLowerCase().replace(/\s+/g, '-')}`)
const previewHtml = computed(() => renderPreviewMarkup(model.value ?? ''))
const hasPreview = computed(() => Boolean(model.value?.trim()))
</script>

<template>
  <div class="field">
    <div class="field-header">
      <label class="field-label" :for="fieldId">{{ label }}</label>

      <div class="view-toggle" role="group" :aria-label="`${label} view mode`">
        <button class="view-toggle__button"
                :class="{ 'view-toggle__button--active': viewMode === 'html' }"
                type="button"
                @click="viewMode = 'html'">
          HTML
        </button>

        <button class="view-toggle__button"
                :class="{ 'view-toggle__button--active': viewMode === 'raw' }"
                type="button"
                @click="viewMode = 'raw'">
          Raw
        </button>
      </div>
    </div>

    <template v-if="viewMode === 'raw'">
      <textarea v-if="multiline"
                 :id="fieldId"
                 v-model="model"
                 class="field-input field-textarea"
                 :rows="rows"
                 :placeholder="placeholder" />
      
      <input v-else
             :id="fieldId"
             v-model="model"
             class="field-input"
             type="text"
             :placeholder="placeholder">
    </template>

    <div v-else
         class="field-preview"
         :class="{ 'field-preview--empty': !hasPreview }"
         aria-live="polite">
      <div v-if="hasPreview"
           class="field-preview-value"
           v-html="previewHtml" />

      <p v-else class="field-preview-empty">
        Switch to Raw to enter markup.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.field {
  display: grid;
  gap: 0.5rem;
}

.field-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.field-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-strong);
}

.view-toggle {
  display: inline-flex;
  padding: 0.15rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-bg-subtle);
}

.view-toggle__button {
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  background: transparent;
  color: var(--color-text-muted);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
}

.view-toggle__button--active {
  border-color: var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
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

.field-textarea {
  min-height: 7rem;
  resize: vertical;
}

.field-preview {
  min-height: 3.5rem;
  padding: 0.95rem 1rem;
  border: 1px solid var(--color-border-soft);
  border-radius: 0.9rem;
  background: var(--color-bg-subtle);
}

.field-preview--empty {
  display: grid;
  place-items: center;
  text-align: center;
}

.field-preview-value {
  margin: 0;
  line-height: 1.7;
  color: var(--color-text);

  :deep(b) {
    font-weight: 700;
  }

  :deep(der),
  :deep(die),
  :deep(das) {
    font-weight: 700;
    color: var(--color-accent);
  }

  :deep(nom),
  :deep(akk),
  :deep(dat),
  :deep(refl) {
    font-size: 0.85em;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }
}

.field-preview-empty {
  margin: 0;
  line-height: 1.5;
  color: var(--color-text-soft);
}
</style>
