import { ref, computed } from 'vue'
import type { AiProvider } from '@/types/aiProvider.types'
import { getDefaultProvider, getEnabledProviders } from '@/services/aiProviders'
import { buildEtymologyPrompt } from '@/services/etymologyPrompt'

// Shared singleton state (module-level so all consumers share the same state)
const isOpen = ref(false)
const currentProvider = ref<AiProvider | null>(getDefaultProvider())
const drawerWidth = ref(520)
const pendingPrompt = ref<string | null>(null)
const hasNewEtymology = ref(false)

/**
 * Composable for managing the AI Drawer state.
 * This is a global singleton — all components share the same drawer state.
 */
export const useAiDrawer = () => {
  const providers = computed(() => getEnabledProviders())

  const toggleDrawer = () => {
    isOpen.value = !isOpen.value
  }

  const openDrawer = () => {
    isOpen.value = true
  }

  const closeDrawer = () => {
    isOpen.value = false
  }

  const selectProvider = (provider: AiProvider) => {
    currentProvider.value = provider
  }

  /**
   * Open the AI drawer with a pre-crafted etymology prompt for the given word.
   * The prompt is shown as a copyable card inside the drawer.
   */
  const openWithEtymologyPrompt = (word: string, meanings?: string) => {
    pendingPrompt.value = buildEtymologyPrompt(word, meanings)
    hasNewEtymology.value = true
    isOpen.value = true

    // Clear the pulse after a few seconds
    setTimeout(() => {
      hasNewEtymology.value = false
    }, 4000)
  }

  const clearPendingPrompt = () => {
    pendingPrompt.value = null
  }

  return {
    // State
    isOpen,
    currentProvider,
    drawerWidth,
    providers,
    pendingPrompt,
    hasNewEtymology,
    // Actions
    toggleDrawer,
    openDrawer,
    closeDrawer,
    selectProvider,
    openWithEtymologyPrompt,
    clearPendingPrompt,
  }
}
