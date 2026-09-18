<script setup lang="ts">
import type {Deck} from '~~/server/db/entities/decks'

const { data: decks, pendingDecks, decksApierror } = await useFetch<Deck[]>('api/decks')
</script>

<template>
  <section aria-label="Cards workspace">
      <AppPanel title="Cards">
        <div class="cards-layout">
          <div class="decks-pane">
            <div class="decks-header">decs-header</div>
            <div class="deck-list">
                <p v-if="pendingDecks">Loading decks...</p>
                <p v-else-if="decksApiError">Could not load decks.</p>

                <p v-for="deck in decks">
                    {{ deck.name }}
                </p>
            </div>
          </div>

          <div class="cards-pane">
            <div class="cards-header">cards-header</div>
            <div class="card-list">card-list</div>
          </div>

          <div class="card-detail-pane">
            <div class="card-detail-header">card-detail-header</div>
            <div class="card-detail-body">card-detail-body</div>
          </div>
        </div>
    </AppPanel>
  </section>
</template>

<style scoped lang="scss">
  .cards-layout {
    display: grid;
    grid-template-columns: minmax(12rem, 14rem) minmax(16rem, 22rem) minmax(0, 1fr);
    gap: 1rem;
    min-height: 24rem;
    height: calc(100dvh - 14rem);
  }


.decks-pane,
.cards-pane,
.card-detail-pane {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 0;
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: 1.25rem;
  background: var(--color-bg-elevated);
  overflow: hidden;
}
.decks-header,
.cards-header,
.card-detail-header {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-soft);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.decks-list,
.cards-list,
.card-detail-body {
  min-height: 0;
  overflow: auto;
  padding: 1rem;
  color: var(--color-text-muted);
}
@media (max-width: 900px) {
  .cards-layout {
    grid-template-columns: 1fr;
    height: auto;
  }
  .decks-pane,
  .cards-pane {
    min-height: 12rem;
    max-height: 18rem;
  }
  .card-detail-pane {
    min-height: 16rem;
    max-height: 28rem;
  }
}
</style>
