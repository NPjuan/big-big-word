<template>
  <div class="main-layout">
    <!-- Fixed Header - Pinned to top -->
    <header class="fixed-header">
      <AppHeader />
    </header>

    <!-- Scrollable Content Area -->
    <main class="scrollable-content">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<style scoped>
/* ===== Main Layout - Full Viewport ===== */
.main-layout {
  width: 100%;
  height: 100vh;
  height: 100dvh; /* Better mobile support */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #fef3c7 100%);
  background-attachment: fixed;
}

/* ===== Fixed Header - Pinned to Top ===== */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0;
  background: linear-gradient(
    to bottom,
    rgba(240, 253, 250, 0.98) 0%,
    rgba(240, 253, 250, 0.95) 80%,
    rgba(240, 253, 250, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(13, 148, 136, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  animation: slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== Scrollable Content Area ===== */
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  scroll-behavior: smooth;
  /* Custom scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(13, 148, 136, 0.5) rgba(13, 148, 136, 0.05);
}

/* Webkit scrollbar for content area */
.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: rgba(13, 148, 136, 0.05);
  border-radius: 10px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%);
}

/* ===== Page Transitions ===== */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px) scale(0.98);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px) scale(0.98);
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
  .fixed-header {
    padding: 0;
  }

  .scrollable-content {
    padding: 0;
  }
}

@media (max-width: 480px) {
  .fixed-header {
    padding: 0;
  }

  .scrollable-content {
    padding: 0;
  }
}
</style>
