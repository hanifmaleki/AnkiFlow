<script setup lang="ts">
import HtmlFieldInput from '@/components/HtmlFieldInput'

type PromptRecord = {
  id: number
  promptKey: string
  version: number
  prompt: string
  createdAt: string
  updatedAt: string
  appliedAt: string | null
}

type LatestPromptResponse = {
  ok: boolean
  prompt: PromptRecord | null
}

type CreatePromptResponse = {
  ok: boolean
  prompt: PromptRecord
}

const promptKey = 'system'
const initialPrompt = 'It will be prompted to generate a card for the word "example".'

const systemPrompt = ref(initialPrompt)
const lastSavedPrompt = ref(initialPrompt)
const currentVersion = ref<number | null>(null)
const isLoadingLatestPrompt = ref(false)
const isSavingPrompt = ref(false)
const promptMessage = ref('')
const promptTone = ref<'success' | 'error' | 'info'>('info')

async function loadLastPrompt() {
  isLoadingLatestPrompt.value = true
  promptMessage.value = ''

  try {
    const response = await $fetch<LatestPromptResponse>('/api/prompts/latest', {
      query: { promptKey }
    })

    systemPrompt.value = response.prompt?.prompt ?? ''
    lastSavedPrompt.value = systemPrompt.value
    currentVersion.value = response.prompt?.version ?? null
    promptTone.value = 'info'
    promptMessage.value = response.prompt
      ? `Loaded version ${response.prompt.version}.`
      : 'No saved prompt found yet.'
  } catch (error) {
    promptTone.value = 'error'
    promptMessage.value = error instanceof Error
      ? error.message
      : 'Could not load the latest prompt.'
  } finally {
    isLoadingLatestPrompt.value = false
  }
}

function resetPrompt() {
  systemPrompt.value = lastSavedPrompt.value
  promptTone.value = 'info'
  promptMessage.value = 'Reset to the last saved prompt.'
}

async function savePrompt() {
  isSavingPrompt.value = true
  promptMessage.value = ''

  try {
    const response = await $fetch<CreatePromptResponse>('/api/prompts', {
      method: 'POST',
      body: {
        promptKey,
        prompt: systemPrompt.value
      }
    })

    lastSavedPrompt.value = response.prompt.prompt
    currentVersion.value = response.prompt.version
    systemPrompt.value = response.prompt.prompt
    promptTone.value = 'success'
    promptMessage.value = `Saved version ${response.prompt.version}.`
  } catch (error) {
    promptTone.value = 'error'
    promptMessage.value = error instanceof Error
      ? error.message
      : 'Could not save the prompt.'
  } finally {
    isSavingPrompt.value = false
  }
}

onMounted(() => {
  loadLastPrompt()
})
</script>

<template>
  <section>
    <AppPanel label="Prompt Settings" title="System prompt" >
      <template #header>
        <p class="prompt-meta">
          <span>Key: {{ promptKey }}</span>
          <span>Version: {{ currentVersion ?? 'None' }}</span>
        </p>
      </template>

      <div class="prompt-panel-content-container">
        <HtmlFieldInput
          v-model="systemPrompt"
          label="Prompt"
          multiline
          :rows="30"
        />

        <div class="prompt-actions">
          <AppButton
            variant="secondary"
            :disabled="isLoadingLatestPrompt || isSavingPrompt"
            @click="loadLastPrompt"
          >
            {{ isLoadingLatestPrompt ? 'Loading...' : 'Load Last' }}
          </AppButton>

          <AppButton
            variant="ghost"
            :disabled="isSavingPrompt"
            @click="resetPrompt"
          >
            Reset
          </AppButton>

          <AppButton
            :disabled="isSavingPrompt"
            @click="savePrompt"
          >
            {{ isSavingPrompt ? 'Saving...' : 'Save' }}
          </AppButton>
        </div>

        <p
          v-if="promptMessage"
          class="prompt-message"
          :class="`prompt-message--${promptTone}`"
          role="status"
        >
          {{ promptMessage }}
        </p>
      </div>
    </AppPanel>
  </section>
</template>

<style scoped lang="scss">
.prompt-meta {
  margin: 0;
  display: grid;
  gap: 0.25rem;
  text-align: right;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.prompt-panel-content-container {
  margin: 2rem auto;
}

.prompt-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.prompt-message {
  margin: 0.75rem 0 0;
  font-size: 0.95rem;
}

.prompt-message--success {
  color: #047857;
}

.prompt-message--error {
  color: #b91c1c;
}

.prompt-message--info {
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .prompt-meta {
    text-align: left;
  }

  .prompt-actions {
    justify-content: stretch;
  }

  .prompt-actions :deep(.app-button) {
    flex: 1 1 100%;
  }
}
</style>
