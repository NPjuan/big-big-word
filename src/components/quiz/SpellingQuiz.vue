<template>
  <div class="quiz-container">
    <!-- Question Card -->
    <div class="question-card" :class="{ 'card-answered': answered }">
      <div class="question-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="label-icon">
          <path
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Type the English word
      </div>
      <div class="chinese-meaning">
        <div v-for="(meaning, idx) in displayMeanings" :key="idx" class="meaning-item">
          <span class="meaning-pos">{{ meaning.partOfSpeech }}</span>
          <span class="meaning-def">{{ meaning.text }}</span>
        </div>
      </div>
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
          :placeholder="answered ? '' : 'Type your answer...'"
          :disabled="answered"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          @keydown.enter="handleSubmit"
          aria-label="Type the English word"
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

      <!-- Hint: show first letter after 10s -->
      <button
        v-if="!answered && showHintBtn"
        class="hint-btn"
        @click="handleHint"
        aria-label="Show hint"
        tabindex="0"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Hint
      </button>

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
            <span class="feedback-text">{{ isCorrect ? 'Correct!' : 'Not quite' }}</span>
          </div>
          <div v-if="!isCorrect" class="correct-answer">
            <span class="correct-label">Answer:</span>
            <span class="correct-word">{{ word.word }}</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted, type PropType } from 'vue'
import type { Word } from '@/types/word.types'

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
const showHintBtn = ref(false)
const hintUsed = ref(false)

let hintTimer: ReturnType<typeof setTimeout> | null = null

const displayMeanings = computed(() => {
  if (props.word.chineseMeaning && props.word.chineseMeaning.length > 0) {
    return props.word.chineseMeaning.slice(0, 3).map((m) => ({
      partOfSpeech: m.partOfSpeech || '',
      text: m.definitions?.slice(0, 2).join('；') ?? '',
    }))
  }
  // Fallback: english definitions
  return props.word.englishMeaning.slice(0, 2).map((m) => ({
    partOfSpeech: m.partOfSpeech || '',
    text: m.definitions?.slice(0, 2).join('; ') ?? '',
  }))
})

const handleSubmit = () => {
  if (answered.value || !userInput.value.trim()) return

  answered.value = true
  const answer = userInput.value.trim().toLowerCase()
  const correct = props.word.word.toLowerCase()
  isCorrect.value = answer === correct

  // Quality scoring: exact match = 5, close = 3, wrong = 1
  let quality = 1
  if (isCorrect.value) {
    quality = hintUsed.value ? 3 : 5
  } else if (levenshteinDistance(answer, correct) <= 2) {
    // Close enough — give partial credit
    quality = 2
  }

  emit('answer', { correct: isCorrect.value, quality })
}

const handleHint = () => {
  hintUsed.value = true
  const word = props.word.word
  // Show first letter + placeholder
  userInput.value = word[0] + '_'.repeat(word.length - 1)
  inputRef.value?.focus()
  // Move cursor to end
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.setSelectionRange(1, userInput.value.length)
    }
  })
}

// Simple Levenshtein distance
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
  showHintBtn.value = false
  hintUsed.value = false
  if (hintTimer) clearTimeout(hintTimer)
  hintTimer = setTimeout(() => {
    showHintBtn.value = true
  }, 8000)
  nextTick(() => inputRef.value?.focus())
}

watch(() => props.word.id, resetState, { immediate: true })

onUnmounted(() => {
  if (hintTimer) clearTimeout(hintTimer)
})
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
  margin-bottom: 1rem;
}

.label-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.chinese-meaning {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.meaning-item {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.meaning-pos {
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #ea580c;
  background: rgba(234, 88, 12, 0.08);
  padding: 0.125rem 0.375rem;
  border-radius: 5px;
  flex-shrink: 0;
}

.meaning-def {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
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
  border: 2px solid rgba(13, 148, 136, 0.15);
  transition: all 0.2s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.input-wrapper:focus-within {
  border-color: rgba(13, 148, 136, 0.4);
  box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.08);
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
  background: linear-gradient(135deg, #0d9488, #2dd4bf);
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
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
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

/* ===== Hint Button ===== */
.hint-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1.5px solid rgba(251, 191, 36, 0.25);
  border-radius: 10px;
  color: #d97706;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  animation: fadeIn 0.3s ease;
}

.hint-btn:hover {
  background: rgba(251, 191, 36, 0.18);
  border-color: rgba(251, 191, 36, 0.4);
}

.hint-btn svg {
  width: 14px;
  height: 14px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
}

.correct-label {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 600;
}

.correct-word {
  font-size: 1.125rem;
  font-weight: 900;
  color: #0d9488;
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

  .meaning-def {
    font-size: 1rem;
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
