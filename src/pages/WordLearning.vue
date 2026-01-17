<template>
  <div class="word-learning-page">
    <!-- Dynamic Gradient Background -->
    <div class="gradient-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="gradient-mesh"></div>
    </div>

    <!-- Main Content -->
    <div class="content-wrapper">
      <!-- App Header -->
      <AppHeader />

      <!-- Main Layout -->
      <div class="main-layout">
        <!-- Word Input Section -->
        <section class="input-section glass-card">
          <WordInputForm />
        </section>

        <!-- Word Table Section -->
        <section class="table-section glass-card">
          <WordTable />
        </section>
      </div>
    </div>

    <!-- Scroll to Top Button -->
    <button
      v-if="showScrollTop"
      class="scroll-top-btn"
      @click="scrollToTop"
      aria-label="Scroll to top"
      tabindex="0"
      @keydown.enter="scrollToTop"
      @keydown.space.prevent="scrollToTop"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          d="M5 10l7-7m0 0l7 7m-7-7v18"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useWordStore } from '@/stores/wordStore'
import AppHeader from '@/components/layout/AppHeader.vue'
import WordInputForm from '@/components/word-input/WordInputForm.vue'
import WordTable from '@/components/word-display/WordTable.vue'

const wordStore = useWordStore()
const showScrollTop = ref(false)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ===== Base Styles ===== */
.word-learning-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* ===== Gradient Background ===== */
.gradient-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 30%, #fff7ed 70%, #ffedd5 100%);
  z-index: 0;
  overflow: hidden;
}

.gradient-mesh {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: meshMove 20s ease-in-out infinite;
}

@keyframes meshMove {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -20px);
  }
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.6;
  animation: float 25s infinite ease-in-out;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(13, 148, 136, 0.3) 0%, transparent 70%);
  top: -15%;
  left: -10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(234, 88, 12, 0.3) 0%, transparent 70%);
  top: 40%;
  right: -10%;
  animation-delay: 8s;
}

.orb-3 {
  width: 550px;
  height: 550px;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.3) 0%, transparent 70%);
  bottom: -15%;
  left: 25%;
  animation-delay: 16s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  33% {
    transform: translate(60px, -60px) scale(1.1) rotate(120deg);
  }
  66% {
    transform: translate(-60px, 60px) scale(0.9) rotate(240deg);
  }
}

/* ===== Content Wrapper ===== */
.content-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1600px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* ===== Main Layout ===== */
.main-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

/* ===== Glass Card Effect ===== */
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(30px);
  border-radius: 20px;
  border: 1px solid rgba(13, 148, 136, 0.15);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.glass-card:hover {
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border-color: rgba(13, 148, 136, 0.25);
}

.input-section {
  animation-delay: 0.1s;
}

.table-section {
  animation-delay: 0.2s;
}

/* ===== Scroll to Top Button ===== */
.scroll-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(234, 88, 12, 0.4);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  animation: fadeInUp 0.4s ease-out;
}

.scroll-top-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 32px rgba(234, 88, 12, 0.5);
}

.scroll-top-btn:active {
  transform: translateY(-2px) scale(1);
}

.scroll-top-btn svg {
  width: 24px;
  height: 24px;
  stroke-width: 2.5;
}

.scroll-top-btn:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.8);
  outline-offset: 4px;
}

/* ===== Responsive Design ===== */
@media (max-width: 1680px) {
  .content-wrapper {
    max-width: 1440px;
    padding: 1.25rem;
  }

  .main-layout {
    max-width: 1440px;
    gap: 1.25rem;
  }
}

@media (max-width: 1440px) {
  .content-wrapper {
    max-width: 1200px;
    padding: 1rem;
  }

  .main-layout {
    max-width: 1200px;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }

  .main-layout {
    gap: 1rem;
  }

  .scroll-top-btn {
    width: 48px;
    height: 48px;
    bottom: 1.5rem;
    right: 1.5rem;
  }

  .scroll-top-btn svg {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 0.75rem;
  }

  .glass-card {
    border-radius: 16px;
  }
}

/* ===== Accessibility ===== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
