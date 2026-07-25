<template>
  <header class="header">
    <p class="eyebrow">UI Foundation</p>
    <h1 class="title">AnkiFlow</h1>
    <p class="subtitle">
      A tabbed workspace for generating, browsing, and configuring cards.
    </p>
  </header>
</template>

<style scoped lang="scss">
.header {
  text-align: center;
}

.eyebrow {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.title {
  margin: 0.5rem 0 0;
  font-size: clamp(2.5rem, 6vw, 4.25rem);
  line-height: 1;
  color: var(--color-text);
}

.subtitle {
  max-width: 42rem;
  margin: 0.85rem auto 0;
  line-height: 1.7;
  color: var(--color-text-muted);
}
</style>
