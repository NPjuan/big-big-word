<template>
  <div class="quiz-container">
    <!-- Question Card -->
    <div class="question-card" :class="{ 'card-answered': answered }">
      <div class="question-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="label-icon">
          <path
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        What does this word mean?
      </div>
      <h2 class="question-word">{{ word.word }}</h2>
      <button
        v-if="word.phonetic"
        class="phonetic-play"
        @click.stop="handlePlayAudio"
        aria-label="Play pronunciation"
        tabindex="0"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="play-icon">
          <path
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="phonetic-text">{{ word.phonetic }}</span>
      </button>
    </div>

    <!-- Options -->
    <div class="options-grid">
      <button
        v-for="(option, idx) in options"
        :key="idx"
        class="option-btn"
        :class="{
          'option-correct': answered && idx === correctIndex,
          'option-wrong': answered && idx === selectedIndex && idx !== correctIndex,
          'option-dimmed': answered && idx !== correctIndex && idx !== selectedIndex,
        }"
        :disabled="answered"
        @click="handleSelect(idx)"
        :aria-label="`Option ${idx + 1}: ${option}`"
        tabindex="0"
      >
        <span class="option-letter">{{ ['A', 'B', 'C', 'D'][idx] }}</span>
        <span class="option-text">{{ option }}</span>
        <svg
          v-if="answered && idx === correctIndex"
          class="option-result-icon"
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
        <svg
          v-if="answered && idx === selectedIndex && idx !== correctIndex"
          class="option-result-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M6 18L18 6M6 6l12 12"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type PropType } from 'vue'
import type { Word } from '@/types/word.types'
import { playAudio } from '@/utils/audioUtils'

const props = defineProps({
  word: {
    type: Object as PropType<Word>,
    required: true,
  },
  allWords: {
    type: Array as PropType<Word[]>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'answer', result: { correct: boolean; quality: number }): void
}>()

const selectedIndex = ref<number | null>(null)
const answered = ref(false)

// Build the correct answer text: join chinese meanings
const correctAnswer = computed(() => {
  if (!props.word.chineseMeaning || props.word.chineseMeaning.length === 0) {
    // Fallback: use first english definition
    return props.word.englishMeaning?.[0]?.definitions?.[0] ?? props.word.word
  }
  return props.word.chineseMeaning
    .slice(0, 2)
    .map((m) => {
      const pos = m.partOfSpeech ? `(${m.partOfSpeech}) ` : ''
      return pos + (m.definitions?.slice(0, 2).join('；') ?? '')
    })
    .join(' / ')
})

// Build wrong options from other words
const wrongOptions = computed(() => {
  const others = props.allWords.filter((w) => w.id !== props.word.id)
  const shuffled = [...others].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3).map((w) => {
    if (w.chineseMeaning && w.chineseMeaning.length > 0) {
      return w.chineseMeaning
        .slice(0, 2)
        .map((m) => {
          const pos = m.partOfSpeech ? `(${m.partOfSpeech}) ` : ''
          return pos + (m.definitions?.slice(0, 2).join('；') ?? '')
        })
        .join(' / ')
    }
    return w.englishMeaning?.[0]?.definitions?.[0] ?? w.word
  })
})

// Correct index and shuffled options
const correctIndex = ref(0)
const options = ref<string[]>([])

const buildOptions = () => {
  const wrongs = wrongOptions.value
  const all = [correctAnswer.value, ...wrongs]
  // Shuffle
  const shuffled: { text: string; isCorrect: boolean }[] = all.map((text, i) => ({
    text,
    isCorrect: i === 0,
  }))
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  options.value = shuffled.map((s) => s.text)
  correctIndex.value = shuffled.findIndex((s) => s.isCorrect)
}

const handleSelect = (idx: number) => {
  if (answered.value) return
  selectedIndex.value = idx
  answered.value = true

  const isCorrect = idx === correctIndex.value
  // Quality scoring: correct = 5 (perfect), wrong = 1 (failed but seen)
  emit('answer', {
    correct: isCorrect,
    quality: isCorrect ? 5 : 1,
  })
}

const handlePlayAudio = async () => {
  try {
    await playAudio(undefined, props.word.word)
  } catch (error) {
    console.error('Failed to play audio:', error)
  }
}

// Rebuild options when word changes
watch(
  () => props.word.id,
  () => {
    answered.value = false
    selectedIndex.value = null
    buildOptions()
  },
  { immediate: true },
)
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
  border: 1.5px solid rgba(13, 148, 136, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
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
  margin-bottom: 0.75rem;
}

.label-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.question-word {
  font-size: 2.25rem;
  font-weight: 900;
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.75rem;
}

.phonetic-play {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: rgba(13, 148, 136, 0.06);
  border: 1.5px solid rgba(13, 148, 136, 0.15);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.phonetic-play:hover {
  background: rgba(13, 148, 136, 0.12);
  border-color: rgba(13, 148, 136, 0.3);
}

.phonetic-text {
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: #0d9488;
  font-weight: 600;
}

.play-icon {
  width: 14px;
  height: 14px;
  color: #0d9488;
}

/* ===== Options Grid ===== */
.options-grid {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9375rem 1.125rem;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  border: 1.5px solid rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.option-btn:hover:not(:disabled) {
  border-color: rgba(13, 148, 136, 0.2);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  transform: translateY(-2px);
}

.option-btn:disabled {
  cursor: default;
}

.option-letter {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(13, 148, 136, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: #0d9488;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.option-text {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  line-height: 1.4;
}

.option-result-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Correct */
.option-correct {
  background: rgba(34, 197, 94, 0.08) !important;
  border-color: rgba(34, 197, 94, 0.4) !important;
  animation: correctPulse 0.5s ease;
}

.option-correct .option-letter {
  background: #22c55e;
  color: white;
}

.option-correct .option-result-icon {
  color: #22c55e;
}

@keyframes correctPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* Wrong */
.option-wrong {
  background: rgba(239, 68, 68, 0.06) !important;
  border-color: rgba(239, 68, 68, 0.35) !important;
  animation: wrongShake 0.4s ease;
}

.option-wrong .option-letter {
  background: #ef4444;
  color: white;
}

.option-wrong .option-result-icon {
  color: #ef4444;
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

/* Dimmed */
.option-dimmed {
  opacity: 0.4;
}

/* ===== Responsive ===== */
@media (max-width: 480px) {
  .question-word {
    font-size: 1.75rem;
  }

  .question-card {
    padding: 1.5rem;
  }

  .option-btn {
    padding: 0.875rem 1rem;
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
