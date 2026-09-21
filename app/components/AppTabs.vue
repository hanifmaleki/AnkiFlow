<script setup lang="ts">
const route = useRoute()
const tabs = [
  { label: 'Generate', to: '/' },
  { label: 'Cards', to: '/cards' },
  { label: 'Prompt', to: '/prompt' }
] as const
import type { SynchronizationResponse } from '../../types/synchronization'

const { ankiConnected, status, refreshAnkiConnection } = useAnkiConnection()
const syncing = ref(false)
const syncStats = ref<SynchronizationResponse['stats'] | null>(null)

const syncLabel = computed(() => {
  if (syncing.value) return 'Syncing…'
  return ankiConnected.value ? 'Sync' : 'No connection'
})

async function sync() {
  if (!ankiConnected.value || syncing.value) return

  syncing.value = true

  try {
    const response = await $fetch<SynchronizationResponse>('/api/sync', { method: 'POST' })
    syncStats.value = response.stats
    await refreshNuxtData('decks')
  } finally {
    syncing.value = false
    await refreshAnkiConnection()
  }
}

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

    <AppButton
      variant="secondary"
      class="sync-button"
      :disabled="!ankiConnected || syncing"
      :title="ankiConnected ? 'Synchronize with Anki' : 'AnkiConnect is unavailable'"
      @click="sync"
    >
      <span class="tab-status" :class="`tab-status--${status}`" />
      {{ syncLabel }}
    </AppButton>
  </nav>

  <SyncSummaryDialog v-if="syncStats" :stats="syncStats" @close="syncStats = null" />
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

.sync-button {
  align-self: stretch;
  border-radius: 999px;
}

.tab-status {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: var(--color-text-soft);
}

.tab-status--connected {
  background: var(--color-success);
}

.tab-status--disconnected {
  background: var(--color-error);
}

.tab-status--checking {
  background: var(--color-warning);
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
