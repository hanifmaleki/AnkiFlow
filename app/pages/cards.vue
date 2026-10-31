<script setup lang="ts">
import type {Deck} from '~~/server/db/entities/decks'
import type {Card} from '~~/server/db/entities/cards'

const { data: decks, pending: pendingDecks, error: decksApiError } = await useFetch<Deck[]>('/api/decks', {
  key: 'decks'
})

const selectedDeck = ref<Deck | null>(null)

const { data: cards, pending: pendingCards, error: cardsApiError } = await useFetch<Card[]>('api/cards', {
    key: 'cards',
    query: computed(() => selectedDeck.value ? 
        { deckId: selectedDeck.value.id }
        : {})
})

function selectDeck(deck: Deck | null) {
    selectedDeck.value = deck
}
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

                <div class="deck-row"
                     :class="{ selected: selectedDeck === null }"
                     @click="selectDeck(null)">
                    All decks
                </div>

                <div v-for="deck in decks ?? []" 
                     class="deck-row"
                     :class="{ selected: selectedDeck?.id === deck.id }"
                     :key="deck.id"
                     @click="selectDeck(deck)">
                     {{ deck.name }}
                </div>
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
                    <div v-for="card in cards ?? []" class="card-row">
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
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    overflow: auto;
    padding: 1rem;
    color: var(--color-text-muted);
}

.card-list-container {
}

.deck-row,
.card-row {
    padding: 0.7rem 0.85rem;
    font-weight: 600;
    color: --color-text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 0.9rem;
    border: solid 1px var(--color-border-soft);

    &:hover {
        background: var(--color-bg-subtle);
        border-color: var(--color-border);
    }

    &.selected {
        background: var(--color-bg-subtle);
        border-color: var(--color-border);
        color: var(--color-text);
    }
}

.fetch-error-container {
    color: var(--color-border);
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
