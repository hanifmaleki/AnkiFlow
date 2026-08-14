<script setup lang="ts">
import type { AnkiConnectionStatus } from '@/composables/useAnkiConnection'

defineProps<{
  status: AnkiConnectionStatus
}>()
</script>

<template>
  <div class="status" 
       :title="status === 'connected' ? 'Anki connected'
              : status === 'disconnected' ? 'Anki disconnected'
              : 'Checking Anki connection'">
    <span class="tab-status" :class="`tab-status--${status}`" />
    
    <span class="status-text">
      {{ status === 'connected' ? 'OK' : status === 'checking' ? 'CHK' : 'OFF' }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.status {
  display: inline-flex;
  gap: 0.75rem;
  align-items: center;
  margin-left: auto;
  margin-right: 1.5rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.tab-status {
  flex: none;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: var(--color-text-soft);
  animation: pulse 1.5s infinite;
}

.tab-status--connected {
  background: var(--color-success);
}

.tab-status--disconnected {
  background: var(--color-error);
}

.tab-status--checking {
  background: var(--color-warning);
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>