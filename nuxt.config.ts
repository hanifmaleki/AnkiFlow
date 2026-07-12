// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/styles/tokens.css'],
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY ?? ''
  }
})
