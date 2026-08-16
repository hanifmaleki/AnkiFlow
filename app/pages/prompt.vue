<script setup lang="ts">
import HtmlFieldInput from '@/components/HtmlFieldInput'

const lastPrompt = ref('It will be prompted to generate a card for the word "example".')
</script>
<template>
  <section class="panel panel--prompt">
    <HtmlFieldInput v-model="lastPrompt" 
                    label="System Prompt"
                    multiline
                    :rows="12"/>

    <div class="prompt-actions">
      <button class="prompt-action" type="button">
        Load latest
        </button>

        <button class="prompt-action" type="button">
          Reset
        </button>

        <button class="prompt-action" type="button">
          Save
        </button>
    </div>

  </section>
</template>

<style scoped lang="scss">
.panel {
  border: 1px solid var(--color-border);
  border-radius: 1.25rem;
  background: var(--color-bg-elevated);
  backdrop-filter: blur(8px);
  padding: 1.25rem;
}

.panel-label {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-soft);
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
</style>
