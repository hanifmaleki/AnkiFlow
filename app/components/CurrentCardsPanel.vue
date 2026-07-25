<script setup lang="ts">
type CardSummary = {
  id: number
  front: string
  deck: string
  tags: string
}

const cards: CardSummary[] = [
  { id: 1, front: 'to decide', deck: 'Verben', tags: 'Verb' },
  { id: 2, front: 'the book', deck: 'Nomen', tags: 'Nomen' },
  { id: 3, front: 'beautiful', deck: 'Adjektive', tags: 'Adjektiv' }
]
</script>

<template>
  <section class="panel">
    <p class="panel-label">Card Browser</p>
    <h2 class="panel-title">Current Cards</h2>
    <p class="panel-copy">
      This panel will later list your saved cards and let you open one for editing or regenerating.
    </p>

    <div class="list-head">
      <span>Front</span>
      <span>Deck</span>
      <span>Tags</span>
    </div>

    <ul class="card-list">
      <li
        v-for="card in cards"
        :key="card.id"
        class="card-row"
      >
        <strong class="card-front">{{ card.front }}</strong>
        <span class="card-deck">{{ card.deck }}</span>
        <span class="card-tags">{{ card.tags }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.panel {
  display: grid;
  gap: 0.9rem;
  height: 100%;
  border: 1px solid var(--color-border);
  border-radius: 1.25rem;
  padding: 1.25rem;
  background: var(--color-bg-elevated);
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
  margin: 0;
  font-size: 1.4rem;
  color: var(--color-text);
}

.panel-copy {
  margin: 0;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.list-head,
.card-row {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr 1fr;
  gap: 0.75rem;
  align-items: center;
}

.list-head {
  padding: 0 0.25rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-soft);
}

.card-list {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card-row {
  padding: 0.85rem 0.9rem;
  border: 1px solid var(--color-border-soft);
  border-radius: 0.95rem;
  background: var(--color-bg-subtle);
}

.card-front {
  color: var(--color-text);
}

.card-deck,
.card-tags {
  color: var(--color-text-muted);
}
</style>
