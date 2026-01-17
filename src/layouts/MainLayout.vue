<template>
  <div class="main-layout">
    <!-- Fixed Header -->
    <div class="sticky-header-wrapper">
      <AppHeader />
    </div>

    <!-- Page Content with Transitions -->
    <main class="page-content">
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
/* ===== Main Layout ===== */
.main-layout {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #fef3c7 100%);
  background-attachment: fixed;
}

/* ===== Sticky Header ===== */
.sticky-header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1rem 1.5rem;
  background: linear-gradient(
    to bottom,
    rgba(240, 253, 250, 0.98) 0%,
    rgba(240, 253, 250, 0.95) 80%,
    transparent 100%
  );
  backdrop-filter: blur(20px);
  animation: slideDown 0.6s ease-out;
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

/* ===== Page Content ===== */
.page-content {
  position: relative;
  z-index: 1;
  padding-top: 120px; /* Space for header */
  padding-bottom: 2rem;
  min-height: 100vh;
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
  .sticky-header-wrapper {
    padding: 0.75rem 1rem;
  }

  .page-content {
    padding-top: 100px;
  }
}

@media (max-width: 480px) {
  .sticky-header-wrapper {
    padding: 0.625rem 0.875rem;
  }

  .page-content {
    padding-top: 90px;
  }
}
</style>
