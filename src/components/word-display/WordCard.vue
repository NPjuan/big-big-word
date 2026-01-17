<template>
  <div
    class="word-card"
    :class="{ 'card-dragging': isDragging }"
    :style="cardStyle"
    @mousedown="handleDragStart"
    @touchstart="handleDragStart"
    tabindex="0"
    role="article"
    aria-label="Word flashcard"
  >
    <!-- Card Inner -->
    <div class="card-inner" :class="{ 'card-flipped': isFlipped }">
      <!-- Front Side -->
      <div class="card-face card-front">
        <div class="card-header">
          <div class="word-main">
            <h2 class="word-title">{{ word.word }}</h2>
            <button
              class="audio-btn"
              @click.stop="playAudio"
              aria-label="Play pronunciation"
              tabindex="0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
          <div class="phonetic-row">
            <span class="phonetic-text">{{ getPhonetic }}</span>
          </div>
        </div>

        <div class="card-body">
          <!-- Part of Speech Tags -->
          <div class="pos-tags">
            <span
              v-for="(meaning, idx) in word.englishMeaning.slice(0, 3)"
              :key="idx"
              class="pos-tag"
            >
              {{ meaning.partOfSpeech }}
            </span>
          </div>

          <!-- Example Sentences -->
          <div class="examples-section">
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
                <p class="example-text">{{ example }}</p>
              </div>
            </div>
          </div>

          <!-- Flip Hint -->
          <button class="flip-hint" @click.stop="toggleFlip" tabindex="0">
            <span>Tap to see more</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Back Side -->
      <div class="card-face card-back">
        <div class="card-header">
          <h2 class="word-title">{{ word.word }}</h2>
          <button class="close-btn" @click.stop="toggleFlip" aria-label="Flip back" tabindex="0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <div class="card-body">
          <!-- Synonyms -->
          <div v-if="word.synonyms && word.synonyms.length > 0" class="info-section">
            <h3 class="section-title">Synonyms</h3>
            <div class="tag-list">
              <span v-for="(syn, idx) in word.synonyms.slice(0, 5)" :key="idx" class="info-tag">
                {{ syn }}
              </span>
            </div>
          </div>

          <!-- Antonyms -->
          <div v-if="word.antonyms && word.antonyms.length > 0" class="info-section">
            <h3 class="section-title">Antonyms</h3>
            <div class="tag-list">
              <span v-for="(ant, idx) in word.antonyms.slice(0, 5)" :key="idx" class="info-tag">
                {{ ant }}
              </span>
            </div>
          </div>

          <!-- Mastery Level -->
          <div class="mastery-section">
            <h3 class="section-title">Mastery Level</h3>
            <div class="mastery-bar">
              <div class="mastery-fill" :style="{ width: word.mastery + '%' }"></div>
            </div>
            <span class="mastery-text">{{ word.mastery }}%</span>
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
import type { Word } from '@/types/word'

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
})

const emit = defineEmits<{
  (e: 'swipe-left'): void
  (e: 'swipe-right'): void
}>()

const isFlipped = ref(false)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragX = ref(0)
const dragY = ref(0)
const swipeDirection = ref<'left' | 'right' | null>(null)

const getPhonetic = computed(() => {
  if (props.word.phonetics && props.word.phonetics.length > 0) {
    return props.word.phonetics[0].text || ''
  }
  return ''
})

const displayExamples = computed(() => {
  const examples: string[] = []
  props.word.englishMeaning.forEach((meaning) => {
    if (meaning.examples) {
      examples.push(...meaning.examples)
    }
  })
  return examples.slice(0, 3)
})

const cardStyle = computed(() => {
  const zIndex = props.total - props.index
  const scale = 1 - props.index * 0.05
  const translateY = props.index * 20
  const rotate = dragX.value / 20

  if (props.index === 0 && isDragging.value) {
    return {
      transform: `translate(${dragX.value}px, ${dragY.value}px) rotate(${rotate}deg) scale(${scale})`,
      zIndex,
      transition: 'none',
    }
  }

  return {
    transform: `translateY(${translateY}px) scale(${scale})`,
    zIndex,
    opacity: props.index < 3 ? 1 - props.index * 0.2 : 0,
  }
})

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

const playAudio = () => {
  // TODO: Implement audio playback
  console.log('Play audio for:', props.word.word)
}

const handleDragStart = (e: MouseEvent | TouchEvent) => {
  if (props.index !== 0) return

  isDragging.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  dragStartX.value = clientX
  dragStartY.value = clientY

  const handleDragMove = (moveEvent: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return

    const moveX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX
    const moveY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY

    dragX.value = moveX - dragStartX.value
    dragY.value = moveY - dragStartY.value

    if (Math.abs(dragX.value) > 50) {
      swipeDirection.value = dragX.value > 0 ? 'right' : 'left'
    } else {
      swipeDirection.value = null
    }
  }

  const handleDragEnd = () => {
    isDragging.value = false

    if (Math.abs(dragX.value) > 150) {
      if (dragX.value > 0) {
        emit('swipe-right')
      } else {
        emit('swipe-left')
      }
    }

    dragX.value = 0
    dragY.value = 0
    swipeDirection.value = null

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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center center;
}

.card-dragging {
  cursor: grabbing;
}

/* ===== Card Inner (3D Flip) ===== */
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-flipped {
  transform: rotateY(180deg);
}

/* ===== Card Face ===== */
.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
  border-radius: 24px;
  border: 3px solid rgba(13, 148, 136, 0.2);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    inset 0 2px 0 rgba(255, 255, 255, 0.8);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.card-back {
  transform: rotateY(180deg);
}

/* ===== Card Header ===== */
.card-header {
  margin-bottom: 1.5rem;
}

.word-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.word-title {
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-transform: capitalize;
}

.audio-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.audio-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(234, 88, 12, 0.4);
}

.audio-btn svg {
  width: 24px;
  height: 24px;
  stroke-width: 2;
}

.phonetic-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.phonetic-text {
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
  font-size: 1.125rem;
  color: #0d9488;
  font-weight: 600;
}

/* ===== Card Body ===== */
.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ===== Part of Speech Tags ===== */
.pos-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pos-tag {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: lowercase;
  color: #0d9488;
  background: rgba(13, 148, 136, 0.1);
  border-radius: 10px;
  border: 2px solid rgba(13, 148, 136, 0.2);
}

/* ===== Examples Section ===== */
.examples-section {
  flex: 1;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #0d9488;
  margin-bottom: 1rem;
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.example-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.example-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(45, 212, 191, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid rgba(13, 148, 136, 0.2);
}

.example-icon svg {
  width: 16px;
  height: 16px;
  color: #0d9488;
  stroke-width: 2;
}

.example-text {
  font-size: 1rem;
  color: #334155;
  line-height: 1.6;
  margin: 0;
  font-weight: 500;
}

/* ===== Flip Hint ===== */
.flip-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(45, 212, 191, 0.1));
  border: 2px solid rgba(13, 148, 136, 0.2);
  border-radius: 12px;
  color: #0d9488;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: auto;
}

.flip-hint:hover {
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.15), rgba(45, 212, 191, 0.15));
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.2);
}

.flip-hint svg {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

/* ===== Back Side Content ===== */
.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(13, 148, 136, 0.1);
  border: 2px solid rgba(13, 148, 136, 0.2);
  color: #0d9488;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(13, 148, 136, 0.2);
  transform: scale(1.1);
}

.close-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.info-section {
  margin-bottom: 1.5rem;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.info-tag {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  background: rgba(13, 148, 136, 0.08);
  border-radius: 10px;
  border: 2px solid rgba(13, 148, 136, 0.15);
}

/* ===== Mastery Section ===== */
.mastery-section {
  margin-top: auto;
}

.mastery-bar {
  width: 100%;
  height: 12px;
  background: rgba(13, 148, 136, 0.1);
  border-radius: 6px;
  overflow: hidden;
  margin: 0.75rem 0;
  border: 2px solid rgba(13, 148, 136, 0.2);
}

.mastery-fill {
  height: 100%;
  background: linear-gradient(90deg, #0d9488 0%, #2dd4bf 100%);
  transition: width 0.3s ease;
}

.mastery-text {
  font-size: 1.25rem;
  font-weight: 900;
  color: #0d9488;
}

/* ===== Swipe Indicators ===== */
.swipe-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  border: 4px solid;
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
  width: 40px;
  height: 40px;
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
  .card-face {
    padding: 1.5rem;
  }

  .word-title {
    font-size: 2rem;
  }

  .audio-btn {
    width: 40px;
    height: 40px;
  }

  .audio-btn svg {
    width: 20px;
    height: 20px;
  }

  .phonetic-text {
    font-size: 1rem;
  }

  .example-text {
    font-size: 0.9375rem;
  }
}

@media (max-width: 480px) {
  .card-face {
    padding: 1.25rem;
    border-radius: 20px;
  }

  .word-title {
    font-size: 1.75rem;
  }

  .swipe-indicator {
    width: 60px;
    height: 60px;
  }

  .swipe-indicator svg {
    width: 30px;
    height: 30px;
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
