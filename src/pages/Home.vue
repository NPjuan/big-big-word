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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 class="empty-title">Start Your Learning Journey</h2>
          <p class="empty-description">Add your first word below to begin mastering vocabulary</p>
        </div>

        <div v-else class="card-stack-container">
          <TransitionGroup name="card-stack">
            <WordCard
              v-for="(word, index) in displayWords"
              :key="word.id"
              :word="word"
              :index="index"
              :total="displayWords.length"
              :first-card-drag-x="firstCardDragX"
              @swipe-left="handleSwipeLeft"
              @swipe-right="handleSwipeRight"
              @drag="handleDrag"
            />
          </TransitionGroup>
        </div>
      </section>
    </div>

    <!-- Floating Compact Input -->
    <div class="floating-input-wrapper">
      <div class="floating-input-container">
        <CompactWordInput @word-added="handleWordAdded" @easter-egg="handleEasterEgg" />
      </div>
      <!-- Inline Footer -->
      <div class="inline-footer">
        <span class="footer-text">Powered by </span>
        <span
          class="footer-author"
          tabindex="0"
          aria-label="Author Pan Junyuan - click for surprise"
          @click="handleAuthorClick"
          @keydown.enter="handleAuthorClick"
        >
          Pan Junyuan
        </span>
      </div>
    </div>

    <!-- Hearts Easter Egg -->
    <transition-group name="heart-float" tag="div" class="hearts-container">
      <svg
        v-for="heart in hearts"
        :key="heart.id"
        class="floating-heart"
        :style="{
          left: heart.x + 'px',
          animationDuration: heart.duration + 's',
          animationDelay: heart.delay + 's',
          width: heart.size + 'px',
          height: heart.size + 'px',
          opacity: 0,
          '--heart-opacity': heart.opacity,
          '--heart-sway': heart.sway + 'px',
        }"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          :fill="heart.color"
        />
      </svg>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWordStore } from '@/stores/wordStore'
import CompactWordInput from '@/components/word-input/CompactWordInput.vue'
import WordCard from '@/components/word-display/WordCard.vue'

// ===== Hearts Easter Egg =====
interface Heart {
  id: number
  x: number
  duration: number
  size: number
  color: string
  opacity: number
  delay: number
  sway: number
}

const hearts = ref<Heart[]>([])
let heartIdCounter = 0

const heartColors = [
  '#ef4444',
  '#f43f5e',
  '#ec4899',
  '#f97316',
  '#e11d48',
  '#db2777',
  '#f472b6',
  '#fb7185',
]

const spawnHearts = (
  centerX: number,
  count: number,
  spread: number,
  sizeRange: [number, number],
  durationRange: [number, number],
  opacityRange: [number, number] = [0.7, 1],
  delayRange: [number, number] = [0, 0],
) => {
  for (let i = 0; i < count; i++) {
    const id = heartIdCounter++
    const delay = delayRange[0] + Math.random() * (delayRange[1] - delayRange[0])
    const duration = durationRange[0] + Math.random() * (durationRange[1] - durationRange[0])
    const opacity = opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0])
    // Random horizontal sway for bubble wobble effect
    const sway = (Math.random() - 0.5) * 140
    hearts.value.push({
      id,
      x: centerX + (Math.random() - 0.5) * spread,
      duration,
      size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      opacity,
      delay,
      sway,
    })
    setTimeout(
      () => {
        hearts.value = hearts.value.filter((h) => h.id !== id)
      },
      (delay + duration + 0.5) * 1000,
    )
  }
}

const handleAuthorClick = (event: MouseEvent | KeyboardEvent) => {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2

  spawnHearts(
    centerX,
    10 + Math.floor(Math.random() * 6),
    120,
    [30, 70],
    [1.5, 3],
    [0.6, 1],
    [0, 0.3],
  )
}

// ===== Easter Egg: balanced heart flood (~120 hearts, GPU optimized) =====
const handleEasterEgg = () => {
  const sw = window.innerWidth

  // Wave 1: center burst with mixed sizes (hero big + fill small)
  spawnHearts(sw / 2, 20, sw * 1.2, [120, 200], [2.2, 4.5], [0.5, 0.95], [0, 0.2])
  spawnHearts(sw / 2, 8, sw * 0.8, [40, 70], [1.8, 3.5], [0.4, 0.8], [0, 0.3])

  // Wave 2: left side
  setTimeout(() => {
    spawnHearts(sw * 0.2, 14, sw * 0.55, [100, 180], [2.4, 4.2], [0.4, 0.9], [0, 0.3])
    spawnHearts(sw * 0.3, 6, sw * 0.4, [35, 60], [1.8, 3.2], [0.35, 0.75], [0, 0.3])
  }, 180)

  // Wave 3: right side
  setTimeout(() => {
    spawnHearts(sw * 0.8, 14, sw * 0.55, [100, 180], [2.4, 4.2], [0.4, 0.9], [0, 0.3])
    spawnHearts(sw * 0.7, 6, sw * 0.4, [35, 60], [1.8, 3.2], [0.35, 0.75], [0, 0.3])
  }, 360)

  // Wave 4: full-width fill with large anchors
  setTimeout(() => {
    spawnHearts(sw / 2, 16, sw * 1.3, [130, 220], [2.6, 4.8], [0.35, 0.85], [0, 0.25])
    spawnHearts(sw / 2, 8, sw * 1.0, [45, 80], [2, 3.5], [0.3, 0.7], [0, 0.35])
  }, 560)

  // Wave 5: scattered mid supplement
  setTimeout(() => {
    spawnHearts(sw * 0.4, 10, sw * 0.7, [90, 170], [2.2, 4], [0.3, 0.8], [0, 0.3])
    spawnHearts(sw * 0.6, 6, sw * 0.5, [40, 65], [1.8, 3], [0.3, 0.7], [0, 0.3])
  }, 780)

  // Wave 6: gentle tail
  setTimeout(() => {
    spawnHearts(sw / 2, 8, sw * 1.0, [110, 200], [3, 5], [0.2, 0.6], [0, 0.4])
    spawnHearts(sw / 2, 4, sw * 0.8, [50, 80], [2.5, 4], [0.15, 0.5], [0, 0.4])
  }, 1000)
}

const wordStore = useWordStore()
const displayWords = ref<any[]>([])
const isAnimating = ref(false)
const firstCardDragX = ref(0)

// Pick the next best word to show based on SRS priority, excluding IDs in the set
const pickNextWord = (excludeIds: Set<string>) => {
  return wordStore.wordsByReviewPriority.find((w) => !excludeIds.has(w.id)) ?? null
}

// Get latest data snapshot for a word from the store (reflects SRS updates)
const getLatestWordData = (id: string) => {
  return wordStore.words.find((w) => w.id === id)
}

// Initialize display words from priority queue
const initializeDisplayWords = () => {
  if (wordStore.wordCount === 0) {
    displayWords.value = []
    return
  }

  const maxCards = Math.min(4, wordStore.wordCount)
  const prioritized = wordStore.wordsByReviewPriority
  displayWords.value = prioritized.slice(0, maxCards).map((word, index) => ({
    ...word,
    displayIndex: index,
  }))
}

const handleSwipeRight = () => {
  if (isAnimating.value || wordStore.wordCount === 0) return

  isAnimating.value = true

  // Update mastery for right swipe (user knows the word)
  const currentCard = displayWords.value[0]
  if (currentCard) {
    wordStore.updateMasteryRight(currentCard.id)
  }

  // Wait for card leaving animation to complete
  setTimeout(() => {
    const removedCard = displayWords.value.shift()

    if (removedCard && wordStore.wordCount > 0) {
      // Exclude only the cards still visible in the deck (NOT the removed one)
      const currentIds = new Set(displayWords.value.map((w: any) => w.id))
      const nextWord = pickNextWord(currentIds)

      if (nextWord) {
        // Use fresh data snapshot from store (reflects updated SRS fields)
        const freshData = getLatestWordData(nextWord.id)
        displayWords.value.push({
          ...(freshData ?? nextWord),
          displayIndex: displayWords.value.length,
        })
      }
      // If no word found at all (shouldn't happen), deck just shrinks by 1
    }

    // Refresh display indices
    displayWords.value.forEach((word: any, index: number) => {
      word.displayIndex = index
    })

    isAnimating.value = false
  }, 200)
}
const handleSwipeLeft = () => {
  if (isAnimating.value || wordStore.wordCount === 0) return

  isAnimating.value = true

  // Update mastery for left swipe (user doesn't know the word well)
  const currentCard = displayWords.value[0]
  if (currentCard) {
    wordStore.updateMasteryLeft(currentCard.id)
  }

  // Wait for card leaving animation to complete
  setTimeout(() => {
    const removedCard = displayWords.value.shift()

    if (removedCard && wordStore.wordCount > 0) {
      // Exclude only the cards still visible in the deck (NOT the removed one)
      const currentIds = new Set(displayWords.value.map((w: any) => w.id))
      const nextWord = pickNextWord(currentIds)

      if (nextWord) {
        // Use fresh data snapshot from store (reflects updated SRS fields)
        const freshData = getLatestWordData(nextWord.id)
        displayWords.value.push({
          ...(freshData ?? nextWord),
          displayIndex: displayWords.value.length,
        })
      }
    }

    // Refresh display indices
    displayWords.value.forEach((word: any, index: number) => {
      word.displayIndex = index
    })

    isAnimating.value = false
  }, 200)
}
const handleDrag = (dragX: number) => {
  firstCardDragX.value = dragX
}

const handleWordAdded = () => {
  // Reinitialize to show new word
  initializeDisplayWords()
}

onMounted(() => {
  // Initialize display words
  initializeDisplayWords()
})
</script>

<style scoped>
/* ===== Base Styles ===== */
.home-page {
  flex: 1;
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
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===== Learning Section ===== */
.learning-section {
  width: 100%;
  height: calc(100vh - 56px - 100px); /* viewport - header - input */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  padding-top: 40px; /* Move cards down for better centering */
  overflow: hidden;
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
  max-width: 380px;
  height: 460px;
  margin: 0 auto;
  perspective: 1000px;
}

/* ===== TransitionGroup Animations ===== */
.card-stack-move {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-stack-leave-active {
  position: absolute;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100 !important;
}

.card-stack-leave-to {
  opacity: 0;
}

.card-stack-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-stack-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

/* ===== Floating Input ===== */
.floating-input-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: var(--ai-drawer-offset, 0px);
  z-index: 50;
  transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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

/* ===== Inline Footer ===== */
.inline-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 0 2px;
  user-select: none;
  pointer-events: auto;
}

.inline-footer .footer-text {
  font-size: 11px;
  color: rgba(100, 116, 139, 0.5);
  font-weight: 400;
  letter-spacing: 0.3px;
}

.inline-footer .footer-author {
  font-size: 11px;
  color: rgba(13, 148, 136, 0.6);
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  padding: 1px 3px;
  border-radius: 3px;
}

.inline-footer .footer-author:hover {
  color: #0d9488;
  background: rgba(13, 148, 136, 0.08);
}

.inline-footer .footer-author:active {
  transform: scale(0.95);
}

/* Hearts Container */
.hearts-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.floating-heart {
  position: absolute;
  bottom: -20px;
  animation: bubbleUp ease-out forwards;
  opacity: 0;
  pointer-events: none;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
  will-change: transform, opacity;
  contain: layout style;
}

@keyframes bubbleUp {
  0% {
    opacity: var(--heart-opacity, 0.8);
    transform: translateY(0) translateX(0) scale(0.3) rotate(0deg);
  }
  5% {
    opacity: var(--heart-opacity, 0.8);
    transform: translateY(-20px) translateX(calc(var(--heart-sway, 0px) * 0.1)) scale(1.05)
      rotate(-3deg);
  }
  15% {
    opacity: var(--heart-opacity, 0.8);
    transform: translateY(-12vh) translateX(calc(var(--heart-sway, 0px) * -0.4)) scale(1.08)
      rotate(5deg);
  }
  30% {
    opacity: calc(var(--heart-opacity, 0.8) * 0.9);
    transform: translateY(-28vh) translateX(calc(var(--heart-sway, 0px) * 0.5)) scale(1.02)
      rotate(-4deg);
  }
  50% {
    opacity: calc(var(--heart-opacity, 0.8) * 0.7);
    transform: translateY(-48vh) translateX(calc(var(--heart-sway, 0px) * -0.6)) scale(0.95)
      rotate(6deg);
  }
  65% {
    opacity: calc(var(--heart-opacity, 0.8) * 0.5);
    transform: translateY(-62vh) translateX(calc(var(--heart-sway, 0px) * 0.4)) scale(0.85)
      rotate(-3deg);
  }
  80% {
    opacity: calc(var(--heart-opacity, 0.8) * 0.25);
    transform: translateY(-80vh) translateX(calc(var(--heart-sway, 0px) * -0.3)) scale(0.7)
      rotate(4deg);
  }
  92% {
    opacity: calc(var(--heart-opacity, 0.8) * 0.08);
    transform: translateY(-98vh) translateX(calc(var(--heart-sway, 0px) * 0.15)) scale(0.5)
      rotate(-2deg);
  }
  100% {
    opacity: 0;
    transform: translateY(-115vh) translateX(var(--heart-sway, 0px)) scale(0.35) rotate(0deg);
  }
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
    padding: 0;
  }

  .learning-section {
    height: calc(100vh - 56px - 100px);
    padding: 0;
    padding-top: 30px; /* Adjust for mobile */
  }

  .card-stack-container {
    max-width: 100%;
    height: 420px;
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

  .learning-section {
    padding-top: 20px; /* Smaller adjustment for small screens */
  }

  .card-stack-container {
    height: 380px;
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
