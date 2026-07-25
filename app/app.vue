<template>
  <main class="page">
    <div class="shell">
      <header class="panel panel--hero">
        <p class="eyebrow">UI Foundation</p>
        <h1 class="title">AnkiFlow</h1>
        <p class="subtitle">
          A simple layout for browsing, editing, prompting, and reviewing cards.
        </p>
      </header>

      <section class="grid">
        <div class="panel panel--input">
          <p class="panel-label">Input Area</p>
          <div class="placeholder-box">Word input and generate action</div>
        </div>

        <div class="panel panel--browser">
          <p class="panel-label">Card Browser</p>
          <div class="placeholder-box">List of current cards</div>
        </div>

        <div class="panel panel--editor">
          <p class="panel-label">Card Editor</p>
          <div class="placeholder-box">Rendered preview and editable card form</div>
        </div>

        <div class="panel panel--prompt">
          <p class="panel-label">Prompt Settings</p>
          <div class="placeholder-box">System prompt editor and reset action</div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 2rem;
  background:
    radial-gradient(circle at top, var(--color-bg-soft) 0, var(--color-bg) 38%),
    linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-subtle) 100%);
}

.shell {
  width: min(100%, 76rem);
  margin: 0 auto;
}

.panel {
  border: 2px dashed var(--color-border);
  border-radius: 1.25rem;
  background: var(--color-bg-elevated);
  backdrop-filter: blur(8px);
  padding: 1.25rem;
}

.panel--hero {
  text-align: center;
  padding: 2rem 1.5rem;
}

.eyebrow,
.panel-label {
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

.grid {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

.placeholder-box {
  margin-top: 0.75rem;
  min-height: 8rem;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 1rem;
  border: 1px solid var(--color-border-soft);
  border-radius: 1rem;
  background: var(--color-bg-subtle);
  color: var(--color-text-muted);
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }

  .panel--hero,
  .panel--editor {
    grid-column: 1 / -1;
  }
}
</style>
