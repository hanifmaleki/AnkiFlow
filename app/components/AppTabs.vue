<script setup lang="ts">
const route = useRoute()
const tabs = [
  { label: 'Generate', to: '/' },
  { label: 'Cards', to: '/cards' },
  { label: 'Prompt', to: '/prompt' }
] as const
const { status } = useAnkiConnection()

function isActive(to: string) {
  return route.path === to
} 
</script>

<template>
  <nav class="nav" aria-label="Primary">
    <div class="tabs-row">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        class="tab"
        :class="{ 'tab--active': isActive(tab.to) }"
        :to="tab.to">
            {{ tab.label }}
      </NuxtLink>
    </div>

    <AnkiConnectionStatusBadge :status="status" />
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

.tabs-row {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.tab {
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.8rem 1rem;
  background: transparent;
  color: var(--color-text-muted);
  font: inherit;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.tab--active {
  border-color: var(--color-border);
  background: var(--color-bg-subtle);
  color: var(--color-text);
}
</style>
