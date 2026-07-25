<script setup lang="ts">
type TabName = 'Generate' | 'Cards' | 'Prompt'

const activeTab = ref<TabName>('Generate')
</script>

<template>
  <main class="page">
    <div class="shell">
      <AppHeader />
      <AppTabs v-model="activeTab" />

      <section class="workspace" aria-label="Workspace">
        <template v-if="activeTab === 'Generate'">
          <section class="panel panel--generate">
            <div class="panel-block">
              <p class="panel-label">Word Input</p>
              <div class="placeholder-box">Enter a word and generate a card</div>
            </div>

            <div class="panel-block">
              <p class="panel-label">Card Editor</p>
              <div class="placeholder-box">Rendered preview and editable card form</div>
            </div>
          </section>
        </template>

        <template v-else-if="activeTab === 'Cards'">
          <CurrentCardsPanel />
        </template>

        <template v-else>
          <section class="panel panel--prompt">
            <p class="panel-label">Prompt Settings</p>
            <div class="placeholder-box">
              System prompt editor and reset action
            </div>
          </section>
        </template>
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

.workspace {
  margin-top: 1rem;
}

.panel {
  border: 1px solid var(--color-border);
  border-radius: 1.25rem;
  background: var(--color-bg-elevated);
  backdrop-filter: blur(8px);
  padding: 1.25rem;
}

.panel--generate {
  display: grid;
  gap: 1rem;
}

.panel-block {
  display: grid;
  gap: 0.75rem;
}

.panel-label {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.placeholder-box {
  min-height: 9rem;
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
  .panel--generate {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
