<script setup lang="ts">
import type {Deck} from '~~/server/db/entities/decks'
import type {Card} from '~~/server/db/entities/cards'

const { data: decks, pending: pendingDecks, error: decksApiError } = await useFetch<Deck[]>('/api/decks', {
  key: 'decks'
})

const { data: cards, pending: pendingCards, error: cardsApiError } = await useFetch<Card[]>('api/cards', {
    key: 'cards'
})
</script>

<template>
  <section aria-label="Cards workspace">
      <AppPanel title="Cards">
        <div class="cards-layout">
          <div class="decks-pane">
            <div class="decks-header">
                Decks
            </div>

            <div class="decks-list">
                <div v-if="pendingDecks">
                    Loading decks...
                </div>

                <div v-else-if="decksApiError" class="fetch-error-container">
                    Could not load decks.
                </div>

                <p v-for="deck in decks ?? []" :key="deck.id">
                    {{ deck.name }}
                </p>
            </div>
          </div>

          <div class="cards-pane">
            <div class="cards-header">
                Cards
            </div>

            <div class="cards-list-content-container">
                <div v-if="pendingCards" class="peding-card-container">
                    Loading cards... 
                </div>

                <div v-else-if="cardsApiError" class="fetch-error-container">
                    Could not load cards {{cardsApiError}}.
                </div>

                <div v-else class="card-list-container">
                    <div v-for="card in cards ?? []" class="card-title-container">
                        {{ card.front }}
                    </div>
                </div>

            </div>
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
.cards-list-content-container,
.card-detail-body {
  min-height: 0;
  overflow: auto;
  padding: 1rem;
  color: var(--color-text-muted);
}

.card-list-container {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.card-title-container {

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
