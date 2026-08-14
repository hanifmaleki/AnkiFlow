export type AnkiConnectionStatus = 'connected' | 'disconnected' | 'checking'

type AnkiTestResponse = {
  ok: boolean
  version?: string
  deckNames: string[]
  error?: string
}

export function useAnkiConnection() {
    const ankiConnected = ref(false)
    const status = ref<AnkiConnectionStatus>('disconnected')
    let timer: ReturnType<typeof setInterval> | null = null

    async function refreshAnkiConnection() {
        status.value = 'checking'

        try {
            const response = await $fetch<AnkiTestResponse>('/api/anki-test')
            ankiConnected.value = response.ok
            status.value = response.ok ? 'connected' : 'disconnected'
        } catch (error) {
            ankiConnected.value = false
            status.value = 'disconnected'
        }
    }

    onMounted(() => {
        refreshAnkiConnection()
        timer = setInterval(refreshAnkiConnection, 10000)
    })

    onUnmounted(() => {
        if (timer) {
            clearInterval(timer)
            timer = null
        }
    })
    
    return {
        ankiConnected,
        status,
        refreshAnkiConnection
    }
}