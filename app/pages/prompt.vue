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
      <AppButton variant="secondary" @click="lastPrompt = ''">
          Load Last
        </AppButton>
        
        <AppButton variant="secondary" @click="lastPrompt = ''">
          Reset
        </AppButton>

        <AppButton variant="secondary">
          Save
        </AppButton>
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

.prompt-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
