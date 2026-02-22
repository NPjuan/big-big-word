import { ref, computed } from 'vue'
import type { AiProvider } from '@/types/aiProvider.types'
import { getDefaultProvider, getEnabledProviders } from '@/services/aiProviders'

// Shared singleton state (module-level so all consumers share the same state)
const isOpen = ref(false)
const currentProvider = ref<AiProvider | null>(getDefaultProvider())
const drawerWidth = ref(520)

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

  return {
    // State
    isOpen,
    currentProvider,
    drawerWidth,
    providers,
    // Actions
    toggleDrawer,
    openDrawer,
    closeDrawer,
    selectProvider,
  }
}
