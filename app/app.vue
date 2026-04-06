<template>
  <main class="page">
    <NuxtRouteAnnouncer />
    <div class="shell">
      <section class="hero">
        <h1 class="title">AnkiFlow</h1>
        <p class="subtitle">
          Generate and review Anki cards before adding them.
        </p>
      </section>

      <section class="input-panel" aria-label="Word input">
        <label class="input-label" for="word">Word</label>
        <div class="input-row">
          <input
            id="word"
            class="word-input"
            type="text"
            placeholder="Enter a word"
          >
          <button class="generate-button" type="button">
            Generate
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
}

.shell {
  width: min(100%, 42rem);
}

.hero {
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

.input-panel {
  margin-top: 2.5rem;
}

.input-label {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
}

.word-input,
.generate-button {
  border-radius: 0.9rem;
  border: 1px solid #d1d5db;
  font: inherit;
}

.word-input {
  width: 100%;
  padding: 0.95rem 1rem;
  background: #fff;
  color: #111827;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: 2px solid #111827;
    outline-offset: 2px;
  }
}

.generate-button {
  padding: 0.95rem 1.25rem;
  background: #111827;
  color: #fff;
  cursor: pointer;

  &:hover {
    background: #1f2937;
  }
}

@media (max-width: 640px) {
  .input-row {
    grid-template-columns: 1fr;
  }

  .generate-button {
    width: 100%;
  }
}
</style>
