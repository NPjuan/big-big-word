<template>
  <div class="home-page">
    <!-- Dynamic Gradient Background -->
    <div class="gradient-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="gradient-mesh"></div>
    </div>

    <!-- Main Content -->
    <div class="content-wrapper">
      <!-- Card Learning Section -->
      <section class="learning-section">
        <div v-if="wordStore.wordCount === 0" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h2 class="empty-title">Start Your Learning Journey</h2>
          <p class="empty-description">Add your first word below to begin mastering vocabulary</p>
        </div>

        <div v-else class="card-stack-container">
          <WordCard
            v-for="(word, index) in displayWords"
            :key="word.id"
            :word="word"
            :index="index"
            :total="displayWords.length"
            @swipe-left="handleSwipeLeft"
            @swipe-right="handleSwipeRight"
          />
        </div>
      </section>
    </div>

    <!-- Floating Compact Input -->
    <div class="floating-input-wrapper">
      <div class="floating-input-container">
        <CompactWordInput @word-added="handleWordAdded" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWordStore } from '@/stores/wordStore'
import CompactWordInput from '@/components/word-input/CompactWordInput.vue'
import WordCard from '@/components/word-display/WordCard.vue'

const wordStore = useWordStore()
const currentIndex = ref(0)

const displayWords = computed(() => {
  return wordStore.words.slice(currentIndex.value, currentIndex.value + 3)
})

const handleSwipeLeft = () => {
  // Mark as "need review" or skip
  if (currentIndex.value < wordStore.wordCount - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0 // Loop back
  }
}

const handleSwipeRight = () => {
  // Mark as "mastered" or like
  if (currentIndex.value < wordStore.wordCount - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0 // Loop back
  }
}

const handleWordAdded = () => {
  // Reset to show new word
  currentIndex.value = 0
}

onMounted(() => {
  // Load words if needed
  if (wordStore.wordCount === 0) {
    // Could trigger initial load
  }
})
</script>

<style scoped>
/* ===== Base Styles ===== */
.home-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  padding-bottom: 120px; /* Space for floating input */
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* ===== Learning Section ===== */
.learning-section {
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

/* ===== Empty State ===== */
.empty-state {
  text-align: center;
  max-width: 400px;
  animation: fadeInUp 0.6s ease-out;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(45, 212, 191, 0.1));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(13, 148, 136, 0.2);
  box-shadow: 0 8px 24px rgba(13, 148, 136, 0.15);
}

.empty-icon svg {
  width: 60px;
  height: 60px;
  color: #0d9488;
  stroke-width: 2;
}

.empty-title {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
}

.empty-description {
  font-size: 1rem;
  color: #475569;
  font-weight: 500;
  line-height: 1.6;
}

/* ===== Card Stack Container ===== */
.card-stack-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 600px;
  margin: 0 auto;
  perspective: 1000px;
}

/* ===== Floating Input ===== */
.floating-input-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding: 1rem 1.5rem 1.5rem;
  background: linear-gradient(
    to top,
    rgba(240, 253, 250, 0.98) 0%,
    rgba(240, 253, 250, 0.95) 60%,
    transparent 100%
  );
  backdrop-filter: blur(20px);
  pointer-events: none;
  animation: slideUpFade 0.6s ease-out;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.floating-input-container {
  max-width: 900px;
  margin: 0 auto;
  pointer-events: auto;
}

/* ===== Glass Card Effect ===== */
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
  border-radius: 20px;
  border: 1px solid rgba(13, 148, 136, 0.15);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 1);
  border-color: rgba(13, 148, 136, 0.25);
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

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
  .home-page {
    padding-bottom: 110px;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .learning-section {
    min-height: calc(100vh - 210px);
    padding: 1rem 0;
  }

  .card-stack-container {
    max-width: 100%;
    height: 500px;
  }

  .floating-input-wrapper {
    padding: 0.875rem 1rem 1.25rem;
  }

  .empty-icon {
    width: 100px;
    height: 100px;
  }

  .empty-icon svg {
    width: 50px;
    height: 50px;
  }

  .empty-title {
    font-size: 1.5rem;
  }

  .empty-description {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .home-page {
    padding-bottom: 100px;
  }

  .card-stack-container {
    height: 450px;
  }

  .floating-input-wrapper {
    padding: 0.75rem 0.875rem 1rem;
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
