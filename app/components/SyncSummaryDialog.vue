<script setup lang="ts">
import type { SynchronizationStatus } from '../../types/synchronization'

defineProps<{ stats: SynchronizationStatus }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <dialog class="sync-summary" open aria-labelledby="sync-summary-title">
    <h2 id="sync-summary-title">Synchronization complete</h2>

    <section aria-labelledby="deck-summary-title">
      <h3 id="deck-summary-title">Decks</h3>
      <dl>
        <div><dt>Imported from Anki</dt><dd>{{ stats.decks.importedFromAnki }}</dd></div>
        <div><dt>Created in Anki</dt><dd>{{ stats.decks.createdInAnki }}</dd></div>
        <div><dt>Renamed from Anki</dt><dd>{{ stats.decks.renamedFromAnki }}</dd></div>
        <div><dt>Linked to Anki</dt><dd>{{ stats.decks.linkedToAnki }}</dd></div>
      </dl>
    </section>

    <section aria-labelledby="card-summary-title">
      <h3 id="card-summary-title">Cards</h3>
      <dl>
        <div><dt>Imported from Anki</dt><dd>{{ stats.cards.importedFromAnki }}</dd></div>
        <div><dt>Updated from Anki</dt><dd>{{ stats.cards.updatedFromAnki }}</dd></div>
        <div><dt>Pushed to Anki</dt><dd>{{ stats.cards.pushedToAnki }}</dd></div>
        <div><dt>Skipped: unsupported</dt><dd>{{ stats.cards.skippedUnsupported }}</dd></div>
        <div><dt>Skipped: local changes</dt><dd>{{ stats.cards.skippedLocalChanges }}</dd></div>
        <div><dt>Skipped: unknown deck</dt><dd>{{ stats.cards.skippedUnmappedDeck }}</dd></div>
      </dl>
    </section>

    <AppButton @click="$emit('close')">Close</AppButton>
  </dialog>
</template>

<style scoped lang="scss">
.sync-summary {
  z-index: 1000;
  width: min(32rem, calc(100vw - 2rem));
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 1.25rem;
  background: var(--color-bg-elevated);
  color: var(--color-text);
  box-shadow: 0 1rem 3rem color-mix(in srgb, var(--color-bg) 55%, transparent);
}

h2, h3 { margin: 0; }
h3 { margin-top: 1.25rem; color: var(--color-text-soft); font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
dl { display: grid; gap: 0.45rem; margin: 0.75rem 0 0; }
dl div { display: flex; justify-content: space-between; gap: 1rem; }
dt { color: var(--color-text-muted); }
dd { margin: 0; font-weight: 700; }
.app-button { margin-top: 1.5rem; }
</style>
