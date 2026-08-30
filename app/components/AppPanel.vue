<script setup lang="ts">
defineProps<{
  label?: string,
  title?: string,
}>()
</script>

<template>
  <div class="panel">
    <div v-if="label || title || $slots.header" class="panel-header">
      <div>
        <p v-if="label" class="panel-label">{{ label }}</p>
        <h2 v-if="title" class="panel-title">{{ title }}</h2> 
      </div>

      <slot name="header" />
    </div>

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

.panel-title {
  margin: 0.2rem 0 0;
  font-size: 1.3rem;
  color: var(--color-text);
}
</style>
