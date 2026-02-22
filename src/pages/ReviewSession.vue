<template>
  <div class="review-page">
    <!-- Dynamic Gradient Background -->
    <div class="gradient-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="gradient-mesh"></div>
    </div>

    <div class="content-wrapper">
      <!-- Mode Selection (when no active session) -->
      <div v-if="!activeMode" class="mode-selection">
        <div class="selection-header">
          <div class="selection-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h2 class="selection-title">Review Session</h2>
          <p class="selection-subtitle">
            <span class="due-badge" v-if="wordStore.dueWordsCount > 0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="due-icon">
                <path
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {{ wordStore.dueWordsCount }} word{{ wordStore.dueWordsCount > 1 ? 's' : '' }} due for
              review
            </span>
            <span v-else class="no-due">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="due-icon">
                <path
                  d="M5 13l4 4L19 7"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              All caught up! Practice with any mode.
            </span>
          </p>
        </div>

        <!-- Word count selector -->
        <div class="count-selector">
          <label class="count-label">Words per session</label>
          <div class="count-options">
            <button
              v-for="n in countOptions"
              :key="n"
              class="count-btn"
              :class="{ active: sessionWordCount === n }"
              @click="sessionWordCount = n"
              :aria-label="`${n} words per session`"
              tabindex="0"
            >
              {{ n }}
            </button>
          </div>
        </div>

        <div class="mode-grid">
          <!-- Multiple Choice: English → Chinese -->
          <button
            class="mode-card"
            @click="startSession('en-to-cn')"
            :disabled="wordStore.wordCount < 4"
            aria-label="English to Chinese multiple choice"
            tabindex="0"
          >
            <div class="mode-card-inner">
              <div class="mode-icon mode-icon-choice">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="mode-info">
                <h3 class="mode-name">Multiple Choice</h3>
                <p class="mode-desc">See English, pick the correct Chinese meaning</p>
              </div>
            </div>
            <div class="mode-tag tag-teal">EN → CN</div>
          </button>

          <!-- Spelling: Chinese → English -->
          <button
            class="mode-card"
            @click="startSession('cn-to-en')"
            :disabled="wordStore.wordCount < 1"
            aria-label="Chinese to English spelling"
            tabindex="0"
          >
            <div class="mode-card-inner">
              <div class="mode-icon mode-icon-spell">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="mode-info">
                <h3 class="mode-name">Spelling</h3>
                <p class="mode-desc">See Chinese meaning, type the English word</p>
              </div>
            </div>
            <div class="mode-tag tag-orange">CN → EN</div>
          </button>

          <!-- Listening Quiz -->
          <button
            class="mode-card"
            @click="startSession('listening')"
            :disabled="wordStore.wordCount < 1"
            aria-label="Listening spelling quiz"
            tabindex="0"
          >
            <div class="mode-card-inner">
              <div class="mode-icon mode-icon-listen">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="mode-info">
                <h3 class="mode-name">Listening</h3>
                <p class="mode-desc">Hear pronunciation, spell the word</p>
              </div>
            </div>
            <div class="mode-tag tag-purple">AUDIO → EN</div>
          </button>

          <!-- Mixed Mode -->
          <button
            class="mode-card"
            @click="startSession('mixed')"
            :disabled="wordStore.wordCount < 4"
            aria-label="Mixed review mode"
            tabindex="0"
          >
            <div class="mode-card-inner">
              <div class="mode-icon mode-icon-mixed">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="mode-info">
                <h3 class="mode-name">Mixed</h3>
                <p class="mode-desc">Random mix of all modes for best retention</p>
              </div>
            </div>
            <div class="mode-tag tag-blue">ALL</div>
          </button>
        </div>

        <p v-if="wordStore.wordCount < 4" class="min-words-hint">
          Add at least 4 words to unlock all review modes.
        </p>
      </div>

      <!-- Active Quiz Session -->
      <div v-else class="quiz-session">
        <!-- Session Top Bar -->
        <div class="session-topbar">
          <div class="session-row">
            <!-- Exit Button (inline, in top bar) -->
            <button
              class="exit-btn"
              @click="showExitConfirm = true"
              aria-label="Exit review session"
              tabindex="0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Exit</span>
            </button>
            <div class="session-meta session-meta-main">
              <span class="session-mode-chip" :class="`chip-${activeMode}`">{{
                activeModeLabel
              }}</span>
              <span class="session-counter"
                >{{ currentIndex + 1 }}<span class="counter-sep">/</span
                >{{ sessionWords.length }}</span
              >
            </div>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            <div class="progress-dot" :style="{ left: progressPercent + '%' }"></div>
          </div>
          <!-- Score indicator -->
          <div class="score-strip">
            <div class="score-item score-correct">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M5 13l4 4L19 7"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>{{ correctCount }}</span>
            </div>
            <div class="score-item score-wrong">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>{{ wrongCount }}</span>
            </div>
          </div>
        </div>

        <!-- Quiz Content with transition -->
        <div class="quiz-area">
          <transition :name="quizTransition" mode="out-in">
            <div :key="currentWord?.id ?? currentIndex" class="quiz-slide">
              <MultipleChoiceQuiz
                v-if="currentQuizType === 'en-to-cn'"
                :word="currentWord!"
                :all-words="wordStore.words"
                @answer="handleAnswer"
              />
              <SpellingQuiz
                v-else-if="currentQuizType === 'cn-to-en'"
                :word="currentWord!"
                @answer="handleAnswer"
              />
              <ListeningQuiz
                v-else-if="currentQuizType === 'listening'"
                :word="currentWord!"
                @answer="handleAnswer"
              />
            </div>
          </transition>
        </div>
      </div>

      <!-- Exit Confirmation Dialog -->
      <transition name="dialog-fade">
        <div v-if="showExitConfirm" class="dialog-overlay" @click.self="showExitConfirm = false">
          <div class="dialog-card">
            <div class="dialog-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h3 class="dialog-title">Exit Session?</h3>
            <p class="dialog-text">
              You've completed {{ currentIndex }} of {{ sessionWords.length }} words.
              <span v-if="currentIndex > 0">Progress so far has been saved.</span>
            </p>
            <div class="dialog-actions">
              <button
                class="dialog-btn dialog-btn-cancel"
                @click="showExitConfirm = false"
                aria-label="Continue session"
                tabindex="0"
              >
                Keep Going
              </button>
              <button
                class="dialog-btn dialog-btn-confirm"
                @click="handleConfirmExit"
                aria-label="Confirm exit"
                tabindex="0"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Session Complete -->
      <transition name="result-fade">
        <div v-if="showResult" class="result-overlay">
          <div class="result-card">
            <div class="result-confetti">🎉</div>
            <h2 class="result-title">Session Complete!</h2>
            <div class="result-ring">
              <svg viewBox="0 0 120 120" class="ring-svg">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(13,148,136,0.1)"
                  stroke-width="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#ringGradient)"
                  stroke-width="10"
                  stroke-linecap="round"
                  :stroke-dasharray="`${accuracyPercent * 3.14} 314`"
                  transform="rotate(-90 60 60)"
                  class="ring-progress"
                />
                <defs>
                  <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#0d9488" />
                    <stop offset="100%" stop-color="#2dd4bf" />
                  </linearGradient>
                </defs>
              </svg>
              <div class="ring-label">
                <span class="ring-number">{{ accuracyPercent }}%</span>
                <span class="ring-text">Accuracy</span>
              </div>
            </div>
            <div class="result-stats">
              <div class="result-stat">
                <span class="stat-number correct">{{ correctCount }}</span>
                <span class="stat-text">Correct</span>
              </div>
              <div class="result-divider"></div>
              <div class="result-stat">
                <span class="stat-number wrong">{{ sessionWords.length - correctCount }}</span>
                <span class="stat-text">Missed</span>
              </div>
              <div class="result-divider"></div>
              <div class="result-stat">
                <span class="stat-number total">{{ sessionWords.length }}</span>
                <span class="stat-text">Total</span>
              </div>
            </div>
            <div class="result-actions">
              <button class="result-btn result-btn-secondary" @click="resetSession" tabindex="0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Choose Mode
              </button>
              <button class="result-btn result-btn-primary" @click="restartSameMode" tabindex="0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Go Again
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWordStore } from '@/stores/wordStore'
import type { Word } from '@/types/word.types'
import MultipleChoiceQuiz from '@/components/quiz/MultipleChoiceQuiz.vue'
import SpellingQuiz from '@/components/quiz/SpellingQuiz.vue'
import ListeningQuiz from '@/components/quiz/ListeningQuiz.vue'

type ReviewMode = 'en-to-cn' | 'cn-to-en' | 'listening' | 'mixed'
type QuizType = 'en-to-cn' | 'cn-to-en' | 'listening'

const wordStore = useWordStore()

// Session state
const activeMode = ref<ReviewMode | null>(null)
const sessionWords = ref<Word[]>([])
const currentIndex = ref(0)
const correctCount = ref(0)
const showResult = ref(false)
const showExitConfirm = ref(false)
const sessionWordCount = ref(10)
const countOptions = [5, 10, 15, 20]
const quizTransition = ref('quiz-slide-left')

// For mixed mode: pre-assign a quiz type to each word
const mixedQuizTypes = ref<QuizType[]>([])

const activeModeLabel = computed(() => {
  const labels: Record<ReviewMode, string> = {
    'en-to-cn': 'Multiple Choice',
    'cn-to-en': 'Spelling',
    listening: 'Listening',
    mixed: 'Mixed',
  }
  return activeMode.value ? labels[activeMode.value] : ''
})

const currentWord = computed(() => sessionWords.value[currentIndex.value] ?? null)

const wrongCount = computed(() => {
  // Only count answered words so far
  const answeredCount = Math.min(currentIndex.value, sessionWords.value.length)
  return answeredCount - correctCount.value
})

const currentQuizType = computed<QuizType | null>(() => {
  if (!activeMode.value) return null
  if (activeMode.value === 'mixed') {
    return mixedQuizTypes.value[currentIndex.value] ?? 'en-to-cn'
  }
  return activeMode.value as QuizType
})

const progressPercent = computed(() => {
  if (sessionWords.value.length === 0) return 0
  return Math.round((currentIndex.value / sessionWords.value.length) * 100)
})

const accuracyPercent = computed(() => {
  if (sessionWords.value.length === 0) return 0
  return Math.round((correctCount.value / sessionWords.value.length) * 100)
})

// Shuffle helper
const shuffleArray = <T,>(arr: T[]): T[] => {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const startSession = (mode: ReviewMode) => {
  activeMode.value = mode
  currentIndex.value = 0
  correctCount.value = 0
  showResult.value = false
  showExitConfirm.value = false

  // Pick words: prioritize due words, then fill with others
  const due = wordStore.wordsByReviewPriority
  const count = Math.min(sessionWordCount.value, due.length)
  sessionWords.value = shuffleArray(due.slice(0, count))

  // For mixed mode, assign random quiz types
  if (mode === 'mixed') {
    const types: QuizType[] = ['en-to-cn', 'cn-to-en', 'listening']
    mixedQuizTypes.value = sessionWords.value.map(
      () => types[Math.floor(Math.random() * types.length)],
    )
  }
}

const handleAnswer = (result: { correct: boolean; quality: number }) => {
  if (currentWord.value) {
    wordStore.reviewWithQuality(currentWord.value.id, result.quality)
    if (result.correct) correctCount.value++
  }

  // Advance to next word after a brief delay
  quizTransition.value = 'quiz-slide-left'
  setTimeout(() => {
    if (currentIndex.value < sessionWords.value.length - 1) {
      currentIndex.value++
    } else {
      showResult.value = true
    }
  }, 1200)
}

const resetSession = () => {
  activeMode.value = null
  sessionWords.value = []
  currentIndex.value = 0
  correctCount.value = 0
  showResult.value = false
  showExitConfirm.value = false
  mixedQuizTypes.value = []
}

const restartSameMode = () => {
  if (activeMode.value) {
    const mode = activeMode.value
    resetSession()
    setTimeout(() => startSession(mode), 100)
  }
}

const handleConfirmExit = () => {
  showExitConfirm.value = false
  resetSession()
}
</script>

<style scoped>
/* ===== Base Styles ===== */
.review-page {
  flex: 1;
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
  max-width: 720px;
  margin: 0 auto;
  padding: 100px 1.5rem 2rem; /* top padding reserves space for fixed header */
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* ===== Mode Selection ===== */
.mode-selection {
  animation: fadeInUp 0.5s ease-out;
}

.selection-header {
  text-align: center;
  margin-bottom: 1.75rem;
}

.selection-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 1rem;
  border-radius: 16px;
  background: linear-gradient(135deg, #0d9488, #2dd4bf);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(13, 148, 136, 0.25);
}

.selection-icon svg {
  width: 28px;
  height: 28px;
  color: white;
  stroke-width: 2;
}

.selection-title {
  font-size: 1.75rem;
  font-weight: 900;
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.625rem;
}

.selection-subtitle {
  margin: 0;
  font-size: 0.9375rem;
  color: #475569;
}

.due-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  background: linear-gradient(135deg, rgba(234, 88, 12, 0.1), rgba(251, 146, 60, 0.1));
  color: #ea580c;
  border: 1.5px solid rgba(234, 88, 12, 0.2);
  border-radius: 100px;
  font-weight: 700;
  font-size: 0.8125rem;
}

.due-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.no-due {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: #16a34a;
  font-weight: 600;
}

.no-due .due-icon {
  color: #22c55e;
}

/* ===== Count Selector ===== */
.count-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.count-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #475569;
}

.count-options {
  display: flex;
  gap: 0.375rem;
}

.count-btn {
  width: 42px;
  height: 36px;
  border-radius: 10px;
  border: 1.5px solid rgba(13, 148, 136, 0.15);
  background: rgba(255, 255, 255, 0.8);
  color: #0d9488;
  font-weight: 700;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.count-btn:hover {
  background: rgba(13, 148, 136, 0.08);
  border-color: rgba(13, 148, 136, 0.3);
}

.count-btn.active {
  background: linear-gradient(135deg, #0d9488, #2dd4bf);
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(13, 148, 136, 0.3);
}

/* ===== Mode Grid ===== */
.mode-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
}

.mode-card {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  border: 1.5px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  position: relative;
  overflow: hidden;
}

.mode-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 18px;
  opacity: 0;
  transition: opacity 0.25s ease;
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.04), rgba(45, 212, 191, 0.04));
}

.mode-card:hover:not(:disabled)::before {
  opacity: 1;
}

.mode-card:hover:not(:disabled) {
  border-color: rgba(13, 148, 136, 0.2);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
  transform: translateY(-3px);
}

.mode-card:active:not(:disabled) {
  transform: translateY(-1px);
}

.mode-card:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.mode-card-inner {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}

.mode-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mode-icon svg {
  width: 22px;
  height: 22px;
  color: white;
  stroke-width: 2;
}

.mode-icon-choice {
  background: linear-gradient(135deg, #0d9488, #2dd4bf);
  box-shadow: 0 3px 10px rgba(13, 148, 136, 0.25);
}

.mode-icon-spell {
  background: linear-gradient(135deg, #ea580c, #fb923c);
  box-shadow: 0 3px 10px rgba(234, 88, 12, 0.25);
}

.mode-icon-listen {
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  box-shadow: 0 3px 10px rgba(124, 58, 237, 0.25);
}

.mode-icon-mixed {
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  box-shadow: 0 3px 10px rgba(37, 99, 235, 0.25);
}

.mode-info {
  flex: 1;
  min-width: 0;
}

.mode-name {
  font-size: 0.9375rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.25rem;
}

.mode-desc {
  font-size: 0.6875rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
}

.mode-tag {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-size: 0.5625rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.1875rem 0.4375rem;
  border-radius: 6px;
}

.tag-teal {
  background: rgba(13, 148, 136, 0.08);
  color: #0d9488;
}

.tag-orange {
  background: rgba(234, 88, 12, 0.08);
  color: #ea580c;
}

.tag-purple {
  background: rgba(124, 58, 237, 0.08);
  color: #7c3aed;
}

.tag-blue {
  background: rgba(37, 99, 235, 0.08);
  color: #2563eb;
}

.min-words-hint {
  text-align: center;
  margin-top: 1.25rem;
  font-size: 0.8125rem;
  color: #94a3b8;
  font-weight: 500;
}

/* ===== Quiz Session ===== */
.quiz-session {
  flex: 1;
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.4s ease-out;
  position: relative;
}

/* ===== Exit Button (inside top bar) ===== */
.exit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.375rem 0.75rem;
  background: rgba(239, 68, 68, 0.06);
  border: 1.5px solid rgba(239, 68, 68, 0.15);
  border-radius: 10px;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.exit-btn:hover {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.35);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
  transform: translateY(-1px);
}

.exit-btn:active {
  transform: translateY(0);
}

.exit-btn svg {
  width: 14px;
  height: 14px;
  stroke-width: 2.5;
}

/* ===== Session Top Bar ===== */
.session-topbar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  animation: fadeInDown 0.4s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.session-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.session-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.session-meta-main {
  flex: 1;
}

.session-mode-chip {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.25rem 0.625rem;
  border-radius: 8px;
  letter-spacing: 0.02em;
}

.chip-en-to-cn {
  background: rgba(13, 148, 136, 0.1);
  color: #0d9488;
}

.chip-cn-to-en {
  background: rgba(234, 88, 12, 0.1);
  color: #ea580c;
}

.chip-listening {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}

.chip-mixed {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.session-counter {
  font-size: 0.9375rem;
  font-weight: 900;
  color: #0f172a;
}

.counter-sep {
  color: #cbd5e1;
  margin: 0 0.125rem;
}

.progress-track {
  width: 100%;
  height: 6px;
  background: rgba(13, 148, 136, 0.08);
  border-radius: 100px;
  overflow: visible;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0d9488, #2dd4bf);
  border-radius: 100px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.progress-dot {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  border: 3px solid #0d9488;
  box-shadow: 0 1px 4px rgba(13, 148, 136, 0.3);
  transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.score-strip {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8125rem;
  font-weight: 700;
}

.score-item svg {
  width: 14px;
  height: 14px;
}

.score-correct {
  color: #22c55e;
}

.score-wrong {
  color: #ef4444;
}

/* ===== Quiz Area ===== */
.quiz-area {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.5rem;
}

.quiz-slide {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Quiz slide transition */
.quiz-slide-left-enter-active,
.quiz-slide-left-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.quiz-slide-left-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.quiz-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

/* ===== Exit Confirmation Dialog ===== */
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  padding: 1.5rem;
}

.dialog-card {
  background: white;
  border-radius: 20px;
  padding: 2rem 1.75rem;
  text-align: center;
  max-width: 340px;
  width: 100%;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.18);
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialog-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(251, 191, 36, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.dialog-icon svg {
  width: 24px;
  height: 24px;
  color: #f59e0b;
}

.dialog-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.5rem;
}

.dialog-text {
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 1.5rem;
}

.dialog-actions {
  display: flex;
  gap: 0.625rem;
}

.dialog-btn {
  flex: 1;
  padding: 0.6875rem 1rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
}

.dialog-btn-cancel {
  background: linear-gradient(135deg, #0d9488, #2dd4bf);
  color: white;
  box-shadow: 0 2px 8px rgba(13, 148, 136, 0.25);
}

.dialog-btn-cancel:hover {
  box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35);
  transform: translateY(-1px);
}

.dialog-btn-confirm {
  background: rgba(239, 68, 68, 0.06);
  color: #ef4444;
  border: 1.5px solid rgba(239, 68, 68, 0.2);
}

.dialog-btn-confirm:hover {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.35);
}

/* ===== Result Overlay ===== */
.result-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  padding: 1.5rem;
}

.result-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  text-align: center;
  max-width: 380px;
  width: 100%;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.result-confetti {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  animation: confettiBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes confettiBounce {
  from {
    opacity: 0;
    transform: scale(0) rotate(-20deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.result-title {
  font-size: 1.375rem;
  font-weight: 900;
  color: #0f172a;
  margin: 0 0 1.25rem;
}

/* ===== Accuracy Ring ===== */
.result-ring {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1.25rem;
}

.ring-svg {
  width: 100%;
  height: 100%;
}

.ring-progress {
  transition: stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ring-number {
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #0d9488, #2dd4bf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.ring-text {
  font-size: 0.625rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-top: 0.125rem;
}

/* ===== Result Stats ===== */
.result-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

.result-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 900;
}

.stat-number.correct {
  color: #22c55e;
}

.stat-number.wrong {
  color: #ef4444;
}

.stat-number.total {
  color: #64748b;
}

.stat-text {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.result-divider {
  width: 1px;
  height: 36px;
  background: rgba(0, 0, 0, 0.06);
}

.result-actions {
  display: flex;
  gap: 0.625rem;
}

.result-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
}

.result-btn svg {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.result-btn-secondary {
  background: rgba(13, 148, 136, 0.06);
  color: #0d9488;
  border: 1.5px solid rgba(13, 148, 136, 0.15);
}

.result-btn-secondary:hover {
  background: rgba(13, 148, 136, 0.12);
  border-color: rgba(13, 148, 136, 0.3);
}

.result-btn-primary {
  background: linear-gradient(135deg, #0d9488, #2dd4bf);
  color: white;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
}

.result-btn-primary:hover {
  box-shadow: 0 6px 18px rgba(13, 148, 136, 0.4);
  transform: translateY(-1px);
}

/* ===== Transitions ===== */
.result-fade-enter-active,
.result-fade-leave-active {
  transition: all 0.3s ease;
}

.result-fade-enter-from,
.result-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all 0.25s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
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

/* ===== Responsive ===== */
@media (max-width: 640px) {
  .content-wrapper {
    padding: 100px 0.875rem 1.5rem;
  }

  .mode-grid {
    grid-template-columns: 1fr;
  }

  .selection-title {
    font-size: 1.5rem;
  }

  .selection-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
  }

  .selection-icon svg {
    width: 24px;
    height: 24px;
  }

  .result-card {
    padding: 1.75rem 1.5rem;
  }

  .exit-btn {
    padding: 0.3rem 0.625rem;
    font-size: 0.6875rem;
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
