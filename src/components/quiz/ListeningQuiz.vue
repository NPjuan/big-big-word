<template>
  <div class="quiz-container">
    <!-- Question Card -->
    <div class="question-card" :class="{ 'card-answered': answered }">
      <div class="question-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="label-icon">
          <path
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Listen and spell the word
      </div>

      <!-- Play Button -->
      <button
        class="big-play-btn"
        :class="{ playing: isPlaying }"
        @click="handlePlay"
        aria-label="Play word pronunciation"
        tabindex="0"
      >
        <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" class="pulse-icon">
          <path
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <p class="play-hint">
        {{
          playCount === 0 ? 'Tap to play' : `Played ${playCount} time${playCount > 1 ? 's' : ''}`
        }}
      </p>
    </div>

    <!-- Input Area -->
    <div class="input-area">
      <div
        class="input-wrapper"
        :class="{ 'input-correct': answered && isCorrect, 'input-wrong': answered && !isCorrect }"
      >
        <input
          ref="inputRef"
          v-model="userInput"
          type="text"
          class="spell-input"
          :placeholder="answered ? '' : 'Spell the word...'"
          :disabled="answered"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          @keydown.enter="handleSubmit"
          aria-label="Spell the word you heard"
        />
        <button
          v-if="!answered"
          class="submit-btn"
          :disabled="!userInput.trim()"
          @click="handleSubmit"
          aria-label="Submit answer"
          tabindex="0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M13 7l5 5m0 0l-5 5m5-5H6"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <!-- Result feedback -->
      <transition name="feedback-fade">
        <div
          v-if="answered"
          class="feedback"
          :class="isCorrect ? 'feedback-correct' : 'feedback-wrong'"
        >
          <div class="feedback-header">
            <svg
              v-if="isCorrect"
              class="feedback-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg v-else class="feedback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="feedback-text">{{ isCorrect ? 'Perfect ear!' : 'Not quite' }}</span>
          </div>
          <div v-if="!isCorrect" class="correct-answer">
            <span class="correct-label">Answer:</span>
            <span class="correct-word">{{ word.word }}</span>
            <span v-if="word.phonetic" class="correct-phonetic">{{ word.phonetic }}</span>
          </div>
          <!-- Show Chinese meaning for context -->
          <div v-if="!isCorrect && displayMeaning" class="correct-meaning">
            {{ displayMeaning }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, type PropType } from 'vue'
import type { Word } from '@/types/word.types'
import { playAudio } from '@/utils/audioUtils'

const props = defineProps({
  word: {
    type: Object as PropType<Word>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'answer', result: { correct: boolean; quality: number }): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const userInput = ref('')
const answered = ref(false)
const isCorrect = ref(false)
const isPlaying = ref(false)
const playCount = ref(0)

const displayMeaning = computed(() => {
  if (props.word.chineseMeaning && props.word.chineseMeaning.length > 0) {
    return props.word.chineseMeaning
      .slice(0, 2)
      .map((m) => m.definitions?.slice(0, 1).join('') ?? '')
      .join('；')
  }
  return ''
})

const handlePlay = async () => {
  if (isPlaying.value) return
  isPlaying.value = true
  playCount.value++

  try {
    await playAudio(props.word.audioUrl, props.word.word)
  } catch (error) {
    console.error('Failed to play audio:', error)
  }

  // Reset playing state after a short delay
  setTimeout(() => {
    isPlaying.value = false
  }, 800)
}

const handleSubmit = () => {
  if (answered.value || !userInput.value.trim()) return

  answered.value = true
  const answer = userInput.value.trim().toLowerCase()
  const correct = props.word.word.toLowerCase()
  isCorrect.value = answer === correct

  // Quality: correct = 5, close = 2, wrong = 1
  // Penalize slightly more if many replays
  let quality = 1
  if (isCorrect.value) {
    quality = playCount.value <= 2 ? 5 : 4
  } else if (levenshteinDistance(answer, correct) <= 2) {
    quality = 2
  }

  emit('answer', { correct: isCorrect.value, quality })
}

const levenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = []
  for (let i = 0; i <= a.length; i++) matrix[i] = [i]
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      )
    }
  }
  return matrix[a.length][b.length]
}

const resetState = () => {
  userInput.value = ''
  answered.value = false
  isCorrect.value = false
  isPlaying.value = false
  playCount.value = 0
  nextTick(() => {
    inputRef.value?.focus()
    // Auto-play on load
    handlePlay()
  })
}

watch(() => props.word.id, resetState, { immediate: true })
</script>

<style scoped>
.quiz-container {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ===== Question Card ===== */
.question-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1.5px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.question-label {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  margin-bottom: 1.25rem;
}

.label-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* ===== Big Play Button ===== */
.big-play-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 auto;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.3);
}

.big-play-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 12px 32px rgba(124, 58, 237, 0.4);
}

.big-play-btn:active {
  transform: scale(0.96);
}

.big-play-btn.playing {
  animation: playPulse 0.8s ease infinite;
}

.big-play-btn svg {
  width: 36px;
  height: 36px;
}

.pulse-icon {
  animation: iconPulse 0.5s ease;
}

@keyframes playPulse {
  0%,
  100% {
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.3);
  }
  50% {
    box-shadow: 0 8px 40px rgba(124, 58, 237, 0.5);
  }
}

@keyframes iconPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}

.play-hint {
  margin: 0.75rem 0 0;
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

/* ===== Input Area ===== */
.input-area {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 14px;
  border: 2px solid rgba(124, 58, 237, 0.15);
  transition: all 0.2s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.input-wrapper:focus-within {
  border-color: rgba(124, 58, 237, 0.4);
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.08);
}

.input-correct {
  border-color: rgba(34, 197, 94, 0.5) !important;
  background: rgba(34, 197, 94, 0.04) !important;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1) !important;
}

.input-wrong {
  border-color: rgba(239, 68, 68, 0.5) !important;
  background: rgba(239, 68, 68, 0.04) !important;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1) !important;
  animation: wrongShake 0.4s ease;
}

@keyframes wrongShake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-6px);
  }
  75% {
    transform: translateX(6px);
  }
}

.spell-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.02em;
}

.spell-input::placeholder {
  color: #94a3b8;
  font-weight: 500;
}

.submit-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.submit-btn:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.submit-btn svg {
  width: 18px;
  height: 18px;
}

/* ===== Feedback ===== */
.feedback {
  width: 100%;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  animation: feedbackSlide 0.3s ease;
}

@keyframes feedbackSlide {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feedback-correct {
  background: rgba(34, 197, 94, 0.06);
  border: 1.5px solid rgba(34, 197, 94, 0.2);
}

.feedback-wrong {
  background: rgba(239, 68, 68, 0.06);
  border: 1.5px solid rgba(239, 68, 68, 0.2);
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.feedback-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.feedback-correct .feedback-icon {
  color: #22c55e;
}

.feedback-wrong .feedback-icon {
  color: #ef4444;
}

.feedback-text {
  font-size: 0.9375rem;
  font-weight: 800;
}

.feedback-correct .feedback-text {
  color: #16a34a;
}

.feedback-wrong .feedback-text {
  color: #dc2626;
}

.correct-answer {
  margin-top: 0.5rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.correct-label {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 600;
}

.correct-word {
  font-size: 1.125rem;
  font-weight: 900;
  color: #7c3aed;
}

.correct-phonetic {
  font-size: 0.8125rem;
  color: #94a3b8;
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
}

.correct-meaning {
  margin-top: 0.375rem;
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

/* ===== Transitions ===== */
.feedback-fade-enter-active,
.feedback-fade-leave-active {
  transition: all 0.3s ease;
}

.feedback-fade-enter-from,
.feedback-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* ===== Responsive ===== */
@media (max-width: 480px) {
  .question-card {
    padding: 1.5rem;
  }

  .big-play-btn {
    width: 68px;
    height: 68px;
  }

  .big-play-btn svg {
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
    transition-duration: 0.01ms !important;
  }
}
</style>
