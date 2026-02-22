import type { AiProvider } from '@/types/aiProvider.types'

/**
 * Registry of available AI providers.
 * To add a new provider, simply add a new entry to this array.
 * The first enabled provider will be used as default.
 */
export const aiProviders: AiProvider[] = [
  {
    id: 'doubao',
    name: 'Doubao',
    description: 'ByteDance Doubao AI - Free AI assistant',
    icon: 'mdi-robot-outline',
    type: 'iframe',
    iframeUrl: 'https://www.doubao.com/chat/',
    iframeSandbox:
      'allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-popups-to-escape-sandbox',
    iframeAllow: 'microphone; clipboard-write; clipboard-read',
    enabled: true,
  },
  // Example: Add more providers here
  // {
  //   id: 'chatgpt',
  //   name: 'ChatGPT',
  //   description: 'Powered by OpenAI',
  //   icon: 'mdi-chat-outline',
  //   type: 'iframe',
  //   iframeUrl: 'https://chat.openai.com',
  //   enabled: false,
  // },
]

/**
 * Get the default (first enabled) provider
 */
export const getDefaultProvider = (): AiProvider | null => {
  return aiProviders.find((p) => p.enabled) ?? null
}

/**
 * Get a provider by its ID
 */
export const getProviderById = (id: string): AiProvider | null => {
  return aiProviders.find((p) => p.id === id) ?? null
}

/**
 * Get all enabled providers
 */
export const getEnabledProviders = (): AiProvider[] => {
  return aiProviders.filter((p) => p.enabled)
}
