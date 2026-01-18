<template>
  <div
    class="word-card"
    :class="{ 'card-dragging': isDragging, 'card-revealed': isRevealed }"
    :style="cardStyle"
    @mousedown="handleDragStart"
    @touchstart="handleDragStart"
    @dblclick="handleDoubleClick"
    tabindex="0"
    role="article"
    aria-label="Word flashcard"
  >
    <!-- Card Content -->
    <div class="card-content">
      <div class="card-face">
        <div class="card-header">
          <div class="word-main">
            <div class="word-title-group">
              <h2 class="word-title">{{ word.word }}</h2>
              <button
                v-if="getPhonetic"
                class="phonetic-btn"
                @click.stop="playAudio"
                aria-label="Play pronunciation"
                tabindex="0"
              >
                <span class="phonetic-text">{{ getPhonetic }}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="audio-icon">
                  <path
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="card-body">
          <!-- Part of Speech Tags -->
          <div class="pos-tags blurrable-content">
            <span
              v-for="(meaning, idx) in word.englishMeaning.slice(0, 4)"
              :key="idx"
              class="pos-tag"
            >
              {{ meaning.partOfSpeech }}
            </span>
          </div>

          <!-- Definitions Section -->
          <div class="definitions-section blurrable-content">
            <h3 class="section-title">Definitions</h3>
            <div class="definitions-list">
              <div
                v-for="(meaning, idx) in word.englishMeaning.slice(0, 2)"
                :key="idx"
                class="definition-item"
              >
                <div class="definition-header">
                  <span class="definition-pos">{{ meaning.partOfSpeech }}</span>
                </div>
                <ul class="definition-meanings">
                  <li
                    v-for="(def, defIdx) in meaning.definitions?.slice(0, 1)"
                    :key="defIdx"
                    class="definition-text"
                  >
                    {{ def }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Example Sentences -->
          <div class="examples-section blurrable-content">
            <h3 class="section-title">Examples</h3>
            <div class="examples-list">
              <div v-for="(example, idx) in displayExamples" :key="idx" class="example-item">
                <div class="example-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <p class="example-text">{{ truncateText(example, 60) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Swipe Indicators -->
    <div class="swipe-indicator swipe-left" :class="{ active: swipeDirection === 'left' }">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          d="M6 18L18 6M6 6l12 12"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div class="swipe-indicator swipe-right" :class="{ active: swipeDirection === 'right' }">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M5 13l4 4L19 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import type { Word } from '@/types/word.types'
import { playAudio as playAudioUtil } from '@/utils/audioUtils'

const props = defineProps({
  word: {
    type: Object as PropType<Word>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  firstCardDragX: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{
  (e: 'swipe-left'): void
  (e: 'swipe-right'): void
  (e: 'drag', dragX: number): void
}>()

const isDragging = ref(false)
const isRevealed = ref(false)
const isLeaving = ref(false)
const leaveDirection = ref<'left' | 'right' | null>(null)
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragX = ref(0)
const dragY = ref(0)
const swipeDirection = ref<'left' | 'right' | null>(null)
const getPhonetic = computed(() => {
  return props.word.phonetic || ''
})

const displayExamples = computed(() => {
  const examples: string[] = []
  props.word.englishMeaning.forEach((meaning: { examples?: string[] }) => {
    if (meaning.examples) {
      examples.push(...meaning.examples)
    }
  })
  return examples.slice(0, 2)
})

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const cardStyle = computed(() => {
  const zIndex = props.total - props.index
  const scale = 1 - props.index * 0.05
  const translateY = props.index * 20
  const translateX = props.index * 12 // Poker card stacking: shift right
  const stackRotate = props.index * 2 // Small rotation angle for neat stacking
  const rotate = dragX.value / 20

  // Card is leaving - animate it flying off screen
  if (props.index === 0 && isLeaving.value) {
    const flyDistance = leaveDirection.value === 'right' ? 1200 : -1200
    const flyRotate = leaveDirection.value === 'right' ? 40 : -40
    return {
      transform: `translate(${flyDistance}px, ${dragY.value}px) rotate(${flyRotate}deg)`,
      zIndex,
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: 0,
    }
  }

  // Card is being dragged
  if (props.index === 0 && isDragging.value) {
    return {
      transform: `translate(${dragX.value}px, ${dragY.value}px) rotate(${rotate}deg)`,
      zIndex,
      transition: 'none',
    }
  }

  // Card is in stack - add smooth transition for position changes
  // Add very subtle response when first card is being dragged
  const firstCardDrag = props.firstCardDragX || 0
  const dragInfluence = props.index > 0 && Math.abs(firstCardDrag) > 30 // Higher threshold

  if (dragInfluence) {
    // Calculate very subtle effects - much weaker response
    const dragFactor = Math.min(Math.abs(firstCardDrag) / 300, 1) // Slower normalization
    const indexFactor = 1 / Math.pow(props.index + 1, 1.5) // Exponential decay for further cards

    // Very subtle horizontal shift (barely follow the drag)
    const subtleX = translateX + firstCardDrag * 0.015 * indexFactor

    // Very subtle rotation (minimal lean)
    const subtleRotate = stackRotate + (firstCardDrag / 80) * indexFactor

    // Minimal scale change
    const subtleScale = scale + 0.005 * dragFactor * indexFactor

    // Very subtle vertical shift
    const subtleY = translateY - 2 * dragFactor * indexFactor

    return {
      transform: `translate(${subtleX}px, ${subtleY}px) rotate(${subtleRotate}deg) scale(${subtleScale})`,
      zIndex,
      opacity: props.index < 5 ? 1 : 0,
      transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smoother, slower easing
    }
  }

  return {
    transform: `translate(${translateX}px, ${translateY}px) rotate(${stackRotate}deg) scale(${scale})`,
    zIndex,
    opacity: props.index < 4 ? 1 : 0,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  }
})

const handleDoubleClick = () => {
  isRevealed.value = !isRevealed.value
}

const playAudio = async () => {
  try {
    // Use the word text for audio playback
    const fallbackText = props.word.word

    // Use the utility function with fallback (no audio URL, will use TTS)
    await playAudioUtil(undefined, fallbackText)
  } catch (error) {
    console.error('Failed to play audio:', error)
  }
}

const handleDragStart = (e: MouseEvent | TouchEvent) => {
  if (props.index !== 0) return

  isDragging.value = true
  const clientX = 'touches' in e ? (e.touches[0]?.clientX ?? 0) : e.clientX
  const clientY = 'touches' in e ? (e.touches[0]?.clientY ?? 0) : e.clientY
  dragStartX.value = clientX
  dragStartY.value = clientY

  const handleDragMove = (moveEvent: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return

    const moveX = 'touches' in moveEvent ? (moveEvent.touches[0]?.clientX ?? 0) : moveEvent.clientX
    const moveY = 'touches' in moveEvent ? (moveEvent.touches[0]?.clientY ?? 0) : moveEvent.clientY

    dragX.value = moveX - dragStartX.value
    dragY.value = moveY - dragStartY.value

    // Emit drag event for first card only
    if (props.index === 0) {
      emit('drag', dragX.value)
    }

    if (Math.abs(dragX.value) > 50) {
      swipeDirection.value = dragX.value > 0 ? 'right' : 'left'
    } else {
      swipeDirection.value = null
    }
  }

  const handleDragEnd = () => {
    isDragging.value = false

    if (Math.abs(dragX.value) > 150) {
      // Card should leave - trigger leaving animation
      isLeaving.value = true
      leaveDirection.value = dragX.value > 0 ? 'right' : 'left'

      // Emit event to parent
      if (dragX.value > 0) {
        emit('swipe-right')
      } else {
        emit('swipe-left')
      }

      // Don't reset dragX/dragY here - let the leaving animation play
    } else {
      // Card returns to position
      dragX.value = 0
      dragY.value = 0
      swipeDirection.value = null

      // Reset drag state for other cards
      if (props.index === 0) {
        emit('drag', 0)
      }
    }

    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)
    document.removeEventListener('touchmove', handleDragMove)
    document.removeEventListener('touchend', handleDragEnd)
  }

  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
  document.addEventListener('touchmove', handleDragMove)
  document.addEventListener('touchend', handleDragEnd)
}
</script>

<style scoped>
/* ===== Card Container ===== */
.word-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: grab;
  transform-origin: center center;
  /* Transition is handled dynamically in cardStyle */
}

.card-dragging {
  cursor: grabbing;
}

/* ===== Blur Effect ===== */
.blurrable-content {
  filter: blur(3px);
  transition: filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  will-change: filter;
  transform: translateZ(0);
  backface-visibility: hidden;
  position: relative;
}

.blurrable-content::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%);
  pointer-events: none;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-revealed .blurrable-content {
  filter: blur(0);
  user-select: auto;
}

.card-revealed .blurrable-content::after {
  opacity: 0;
}

/* ===== Card Content ===== */
.card-content {
  position: relative;
  width: 100%;
  height: 100%;
}

/* ===== Card Face ===== */
.card-face {
  position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 2px solid rgba(13, 148, 136, 0.15);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ===== Custom Scrollbar ===== */
.card-face::-webkit-scrollbar {
  width: 6px;
}

.card-face::-webkit-scrollbar-track {
  background: rgba(13, 148, 136, 0.05);
  border-radius: 10px;
}

.card-face::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #0d9488 0%, #2dd4bf 100%);
  border-radius: 10px;
  transition: background 0.2s ease;
}

.card-face::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #0f766e 0%, #14b8a6 100%);
}

/* Firefox scrollbar */
.card-face {
  scrollbar-width: thin;
  scrollbar-color: #0d9488 rgba(13, 148, 136, 0.05);
}

/* ===== Card Header ===== */
.card-header {
  margin-bottom: 1rem;
}

.word-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.word-title-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.word-title {
  font-size: 1.75rem;
  font-weight: 900;
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-transform: capitalize;
  line-height: 1.2;
  flex-shrink: 0;
}

.phonetic-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.08), rgba(45, 212, 191, 0.08));
  border: 1.5px solid rgba(13, 148, 136, 0.15);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.phonetic-btn:hover {
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.15), rgba(45, 212, 191, 0.15));
  border-color: rgba(13, 148, 136, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15);
}

.phonetic-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(13, 148, 136, 0.1);
}

.phonetic-btn:focus-visible {
  outline: 2px solid #0d9488;
  outline-offset: 2px;
}

.phonetic-text {
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: #0d9488;
  font-weight: 600;
  line-height: 1;
}

.audio-icon {
  width: 14px;
  height: 14px;
  stroke-width: 2;
  color: #0d9488;
  flex-shrink: 0;
}

/* ===== Card Body ===== */
.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  overflow: hidden;
  position: relative;
  padding: 0.25rem;
  margin: -0.25rem;
}

/* ===== Part of Speech Tags ===== */
.pos-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pos-tag {
  padding: 0.3125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: lowercase;
  color: #0d9488;
  background: rgba(13, 148, 136, 0.08);
  border-radius: 6px;
  border: 1.5px solid rgba(13, 148, 136, 0.15);
}

/* ===== Definitions Section ===== */
.definitions-section {
  flex: 1;
}

.definitions-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.definition-item {
  padding: 0.625rem;
  background: rgba(13, 148, 136, 0.04);
  border-radius: 8px;
  border: 1px solid rgba(13, 148, 136, 0.1);
}

.definition-header {
  margin-bottom: 0.375rem;
}

.definition-pos {
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #ea580c;
  background: rgba(234, 88, 12, 0.08);
  padding: 0.1875rem 0.4375rem;
  border-radius: 5px;
}

.definition-meanings {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.definition-text {
  font-size: 0.8125rem;
  color: #334155;
  line-height: 1.4;
  padding-left: 0.875rem;
  position: relative;
}

.definition-text::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #0d9488;
  font-weight: 900;
}

/* ===== Examples Section ===== */
.examples-section {
  flex: 1;
}

.section-title {
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #0d9488;
  margin-bottom: 0.5rem;
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.example-item {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.example-icon {
  width: 24px;
  height: 24px;
  border-radius: 5px;
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.08), rgba(45, 212, 191, 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1.5px solid rgba(13, 148, 136, 0.15);
}

.example-icon svg {
  width: 12px;
  height: 12px;
  color: #0d9488;
  stroke-width: 2;
}

.example-text {
  font-size: 0.8125rem;
  color: #334155;
  line-height: 1.4;
  margin: 0;
  font-weight: 500;
}

/* ===== Swipe Indicators ===== */
.swipe-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  border: 3px solid;
}

.swipe-left {
  left: 20px;
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #ef4444;
}

.swipe-right {
  right: 20px;
  background: rgba(34, 197, 94, 0.1);
  border-color: #22c55e;
  color: #22c55e;
}

.swipe-indicator.active {
  opacity: 1;
}

.swipe-indicator svg {
  width: 32px;
  height: 32px;
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
  .card-face {
    padding: 1rem;
  }

  .word-title {
    font-size: 1.5rem;
  }

  .word-title-group {
    gap: 0.5rem;
  }

  .phonetic-btn {
    padding: 0.3125rem 0.5rem;
  }

  .phonetic-text {
    font-size: 0.75rem;
  }

  .audio-icon {
    width: 12px;
    height: 12px;
  }

  .example-text {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .card-face {
    padding: 0.875rem;
    border-radius: 14px;
  }

  .word-title {
    font-size: 1.375rem;
  }

  .word-title-group {
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  .phonetic-btn {
    padding: 0.25rem 0.4375rem;
  }

  .phonetic-text {
    font-size: 0.6875rem;
  }

  .audio-icon {
    width: 11px;
    height: 11px;
  }

  .swipe-indicator {
    width: 52px;
    height: 52px;
  }

  .swipe-indicator svg {
    width: 26px;
    height: 26px;
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
