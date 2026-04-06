<template>
  <main class="page">
    <NuxtRouteAnnouncer />
    <section class="hero">
      <h1 class="title">AnkiFlow</h1>
      <p class="subtitle">
        Generate and review Anki cards before adding them.
      </p>
    </section>
  </main>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
}

.hero {
  width: min(100%, 42rem);
  text-align: center;
}

.title {
  margin: 0;
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  line-height: 1;
}

.subtitle {
  margin: 1rem 0 0;
  font-size: 1.125rem;
  line-height: 1.6;
  color: #4b5563;
}
</style>
