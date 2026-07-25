<script setup lang="ts">
type TabName = 'Generate' | 'Cards' | 'Prompt'

const tabs: TabName[] = ['Generate', 'Cards', 'Prompt']

const activeTab = defineModel<TabName>({ required: true })
</script>

<template>
  <nav class="nav" aria-label="Primary">
    <button
      v-for="tab in tabs"
      :key="tab"
      class="tab"
      :class="{ 'tab--active': activeTab === tab }"
      type="button"
      @click="activeTab = tab"
    >
      {{ tab }}
    </button>
  </nav>
</template>

<style scoped lang="scss">
.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 1.25rem;
  background: var(--color-bg-elevated);
}

.tab {
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.8rem 1rem;
  background: transparent;
  color: var(--color-text-muted);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.tab--active {
  border-color: var(--color-border);
  background: var(--color-bg-subtle);
  color: var(--color-text);
}
</style>
