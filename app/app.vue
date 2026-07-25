<template>
  <main class="page">
    <div class="shell">
      <AppHeader />
      <AppTabs />

      <section class="workspace" aria-label="Workspace">
        <NuxtPage />
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
</style>
