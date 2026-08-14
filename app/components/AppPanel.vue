<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<template>
  <div class="panel">
    <p v-if="label" class="panel-label">{{ label }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.panel {
  display: grid;
  gap: 0.75rem;
  align-content: start;
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
</style>
