<template>
  <!-- Drawer panel (side-by-side, no overlay) -->
  <transition name="drawer-slide">
    <aside
      v-if="isOpen"
      class="ai-drawer"
      :style="{ width: drawerWidth + 'px' }"
      role="complementary"
      aria-label="AI Assistant"
    >
      <!-- Drawer header -->
      <div class="drawer-header">
        <div class="drawer-title-section">
          <div class="drawer-icon-wrapper">
            <v-icon :icon="currentProvider?.icon || 'mdi-robot-outline'" size="20" />
          </div>
          <div class="drawer-title-info">
            <h3 class="drawer-title">{{ currentProvider?.name || 'AI Assistant' }}</h3>
            <p class="drawer-subtitle">{{ currentProvider?.description || 'Select a provider' }}</p>
          </div>
        </div>

        <div class="drawer-header-actions">
          <!-- Provider switcher (shown when multiple providers available) -->
          <div v-if="providers.length > 1" class="provider-switcher">
            <button
              class="provider-switch-btn"
              @click="showProviderMenu = !showProviderMenu"
              aria-label="Switch AI provider"
              tabindex="0"
            >
              <v-icon icon="mdi-swap-horizontal" size="16" />
            </button>
            <transition name="dropdown-fade">
              <div v-if="showProviderMenu" class="provider-menu">
                <button
                  v-for="provider in providers"
                  :key="provider.id"
                  :class="['provider-menu-item', { active: provider.id === currentProvider?.id }]"
                  @click="handleSelectProvider(provider)"
                  :aria-label="'Switch to ' + provider.name"
                  tabindex="0"
                >
                  <v-icon :icon="provider.icon" size="16" />
                  <span>{{ provider.name }}</span>
                  <v-icon
                    v-if="provider.id === currentProvider?.id"
                    icon="mdi-check"
                    size="14"
                    class="check-icon"
                  />
                </button>
              </div>
            </transition>
          </div>

          <!-- Refresh button -->
          <button
            class="header-action-btn"
            @click="handleRefresh"
            aria-label="Refresh AI assistant"
            tabindex="0"
          >
            <v-icon icon="mdi-refresh" size="18" />
          </button>

          <!-- Close button -->
          <button
            class="header-action-btn close-btn"
            @click="closeDrawer"
            aria-label="Close AI assistant"
            tabindex="0"
          >
            <v-icon icon="mdi-close" size="18" />
          </button>
        </div>
      </div>

      <!-- Drawer content -->
      <div class="drawer-content">
        <!-- iframe provider -->
        <template v-if="currentProvider?.type === 'iframe' && currentProvider.iframeUrl">
          <iframe
            ref="iframeRef"
            :key="iframeKey"
            :src="currentProvider.iframeUrl"
            :sandbox="currentProvider.iframeSandbox"
            :allow="currentProvider.iframeAllow"
            class="ai-iframe"
            title="AI Assistant"
            loading="lazy"
          />
          <div v-if="isLoading" class="loading-overlay">
            <div class="loading-spinner">
              <v-icon icon="mdi-loading" size="32" class="spin-animation" />
              <span class="loading-text">Loading AI Assistant...</span>
            </div>
          </div>
        </template>

        <!-- Placeholder when no provider is selected or configured -->
        <template v-else>
          <div class="empty-state">
            <div class="empty-icon-wrapper">
              <v-icon icon="mdi-robot-confused-outline" size="48" />
            </div>
            <h4 class="empty-title">No AI Provider Configured</h4>
            <p class="empty-description">
              Configure an AI provider in
              <code>src/services/aiProviders.ts</code>
              to get started.
            </p>
          </div>
        </template>
      </div>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { AiProvider } from '@/types/aiProvider.types'
import { useAiDrawer } from '@/composables/useAiDrawer'

const { isOpen, currentProvider, drawerWidth, providers, closeDrawer, selectProvider } =
  useAiDrawer()

const iframeRef = ref<HTMLIFrameElement | null>(null)
const iframeKey = ref(0)
const isLoading = ref(false)
const showProviderMenu = ref(false)

// Track iframe loading state
watch(
  () => currentProvider.value,
  () => {
    if (currentProvider.value?.type === 'iframe') {
      isLoading.value = true
    }
  },
)

// Handle iframe load complete
const handleIframeLoad = () => {
  isLoading.value = false
}

watch(iframeRef, (iframe) => {
  if (iframe) {
    iframe.addEventListener('load', handleIframeLoad)
    // Start loading state
    isLoading.value = true
  }
})

const handleRefresh = () => {
  iframeKey.value++
  isLoading.value = true
}

const handleSelectProvider = (provider: AiProvider) => {
  selectProvider(provider)
  showProviderMenu.value = false
  iframeKey.value++
}

// Close provider menu on outside click
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.provider-switcher')) {
    showProviderMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* ===== Drawer Panel (side-by-side layout) ===== */
.ai-drawer {
  position: relative;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-left: 1px solid rgba(13, 148, 136, 0.12);
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  z-index: 50;
}

/* ===== Drawer Header ===== */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, rgba(240, 253, 250, 0.95), rgba(204, 251, 241, 0.5));
  border-bottom: 1px solid rgba(13, 148, 136, 0.1);
  flex-shrink: 0;
}

.drawer-title-section {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
}

.drawer-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  box-shadow: 0 2px 8px rgba(13, 148, 136, 0.3);
}

.drawer-title-info {
  min-width: 0;
}

.drawer-title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drawer-subtitle {
  margin: 0;
  font-size: 0.6875rem;
  color: #64748b;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drawer-header-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

/* ===== Header Action Buttons ===== */
.header-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.header-action-btn:hover {
  background: rgba(13, 148, 136, 0.08);
  color: #0d9488;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
}

/* ===== Provider Switcher ===== */
.provider-switcher {
  position: relative;
}

.provider-switch-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.provider-switch-btn:hover {
  background: rgba(13, 148, 136, 0.08);
  color: #0d9488;
}

.provider-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 200px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 10;
}

.provider-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  border: none;
  background: transparent;
  color: #334155;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
}

.provider-menu-item:hover {
  background: rgba(13, 148, 136, 0.06);
}

.provider-menu-item.active {
  background: rgba(13, 148, 136, 0.08);
  color: #0d9488;
}

.check-icon {
  margin-left: auto;
  color: #0d9488;
}

/* ===== Drawer Content ===== */
.drawer-content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* ===== iframe ===== */
.ai-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #fafafa;
}

/* ===== Loading Overlay ===== */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: #0d9488;
}

.spin-animation {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
}

/* ===== Empty State ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.empty-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.08), rgba(45, 212, 191, 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  color: #94a3b8;
}

.empty-title {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #334155;
}

.empty-description {
  margin: 0;
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.6;
  max-width: 280px;
}

.empty-description code {
  background: rgba(13, 148, 136, 0.08);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0d9488;
}

/* ===== Transitions ===== */
.drawer-slide-enter-active {
  transition:
    width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s ease;
}
.drawer-slide-leave-active {
  transition:
    width 0.25s cubic-bezier(0.4, 0, 1, 1),
    opacity 0.25s ease;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  opacity: 0;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.15s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .ai-drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100% !important;
    z-index: 200;
  }
}
</style>
