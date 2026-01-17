<template>
  <div class="word-input-container">
    <!-- Header -->
    <div class="input-header">
      <div class="header-icon-wrapper">
        <div class="icon-ring"></div>
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="header-content">
        <h2 class="header-title">Add New Word</h2>
        <p class="header-subtitle">Expand your vocabulary journey</p>
      </div>
    </div>

    <!-- Input Form -->
    <div class="input-form">
      <div
        class="input-wrapper"
        :class="{ 'input-focused': isFocused, 'input-error': !!errorMessage }"
      >
        <div class="input-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <input
          v-model="inputWord"
          type="text"
          class="word-input"
          placeholder="e.g., serendipity, ephemeral, ubiquitous..."
          :disabled="isLoading"
          @focus="isFocused = true"
          @blur="isFocused = false"
          @keydown="handleKeyDown"
          autofocus
          aria-label="Enter a word to add"
        />
        <button
          v-if="inputWord"
          class="clear-btn"
          @click="clearInput"
          aria-label="Clear input"
          tabindex="0"
          @keydown.enter="clearInput"
          @keydown.space.prevent="clearInput"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <div v-if="isLoading" class="loading-spinner">
          <div class="spinner"></div>
        </div>
      </div>

      <!-- Error Message -->
      <transition name="slide-fade">
        <div v-if="errorMessage" class="error-message">
          <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>
      </transition>

      <!-- Form Footer -->
      <div class="form-footer">
        <div class="keyboard-hints">
          <div class="hint">
            <kbd class="kbd">Enter</kbd>
            <span>to add</span>
          </div>
          <div class="hint">
            <kbd class="kbd">Esc</kbd>
            <span>to clear</span>
          </div>
        </div>

        <button
          class="submit-btn"
          :class="{ 'btn-disabled': !isValid || isLoading }"
          :disabled="!isValid || isLoading"
          @click="handleSubmit"
          aria-label="Add word"
          tabindex="0"
        >
          <svg
            v-if="!isLoading"
            class="btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M12 4v16m8-8H4"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>{{ isLoading ? 'Adding...' : 'Add Word' }}</span>
        </button>
      </div>

      <!-- Success Message -->
      <transition name="slide-fade">
        <div v-if="successMessage" class="success-message">
          <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>{{ successMessage }}</span>
          <button
            class="close-btn"
            @click="successMessage = ''"
            aria-label="Close message"
            tabindex="0"
            @keydown.enter="successMessage = ''"
            @keydown.space.prevent="successMessage = ''"
          >
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
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWordStore } from '@/stores/wordStore'

const wordStore = useWordStore()

const inputWord = ref('')
const isFocused = ref(false)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref('')

const isValid = computed(() => {
  return inputWord.value.trim().length > 0 && /^[a-zA-Z\s-]+$/.test(inputWord.value)
})

const clearInput = () => {
  inputWord.value = ''
  errorMessage.value = null
  successMessage.value = ''
}

const handleSubmit = async () => {
  if (!isValid.value) return

  isLoading.value = true
  errorMessage.value = null
  successMessage.value = ''

  try {
    await wordStore.addWord(inputWord.value.trim().toLowerCase())
    successMessage.value = `"${inputWord.value}" added successfully! 🎉`
    inputWord.value = ''

    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Failed to add word'
  } finally {
    isLoading.value = false
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  } else if (event.key === 'Escape') {
    clearInput()
  }
}
</script>

<style scoped>
/* ===== Container ===== */
.word-input-container {
  padding: 1.5rem;
}

/* ===== Header ===== */
.input-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1.25rem;
}

.header-icon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  box-shadow: 0 6px 18px rgba(13, 148, 136, 0.35);
  animation: iconPulse 2.5s ease-in-out infinite;
}

@keyframes iconPulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 6px 18px rgba(13, 148, 136, 0.35);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(13, 148, 136, 0.45);
  }
}

.header-icon {
  width: 24px;
  height: 24px;
  color: white;
  stroke-width: 2;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.header-content {
  flex: 1;
}

.header-title {
  font-size: 1.375rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.15rem 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.header-subtitle {
  font-size: 0.8125rem;
  color: #475569;
  margin: 0;
  font-weight: 500;
}

/* ===== Input Form ===== */
.input-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 14px;
  padding: 0 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.input-wrapper:hover {
  border-color: rgba(13, 148, 136, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.input-focused {
  border-color: #0d9488;
  box-shadow: 0 8px 24px rgba(13, 148, 136, 0.2);
  background: #ffffff;
}

.input-error {
  border-color: #ef4444;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.15);
}

.input-icon {
  width: 20px;
  height: 20px;
  color: rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.input-focused .input-icon {
  color: #0d9488;
}

.input-icon svg {
  width: 100%;
  height: 100%;
  stroke-width: 2;
}

.word-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.875rem 0.875rem;
  font-size: 1rem;
  font-weight: 500;
  color: #0f172a;
  background: transparent;
}

.word-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.word-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-btn,
.close-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.clear-btn:hover,
.close-btn:hover {
  background: rgba(13, 148, 136, 0.1);
  color: #0d9488;
  transform: scale(1.1);
}

.clear-btn:active,
.close-btn:active {
  transform: scale(0.95);
}

.clear-btn svg,
.close-btn svg {
  width: 14px;
  height: 14px;
  stroke-width: 2.5;
}

.loading-spinner {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(13, 148, 136, 0.2);
  border-top-color: #0d9488;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== Messages ===== */
.error-message,
.success-message {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.error-message {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.success-message {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1));
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.error-icon,
.success-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2.5;
  flex-shrink: 0;
}

.error-message span,
.success-message span {
  flex: 1;
}

/* ===== Form Footer ===== */
.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.keyboard-hints {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
  font-weight: 500;
}

.kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 28px;
  padding: 0 0.625rem;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
  color: #475569;
  background: linear-gradient(135deg, #ffffff, #f5f5f5);
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.submit-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 12px rgba(234, 88, 12, 0.3);
  letter-spacing: 0.02em;
}

.submit-btn:hover:not(.btn-disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(234, 88, 12, 0.4);
}

.submit-btn:active:not(.btn-disabled) {
  transform: translateY(-1px);
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: 0 2px 8px rgba(234, 88, 12, 0.2);
}

.btn-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2.5;
}

/* ===== Transitions ===== */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
  .word-input-container {
    padding: 2rem;
  }

  .input-header {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .header-icon-wrapper {
    width: 56px;
    height: 56px;
  }

  .header-icon {
    width: 28px;
    height: 28px;
  }

  .header-title {
    font-size: 1.625rem;
  }

  .header-subtitle {
    font-size: 0.875rem;
  }

  .word-input {
    font-size: 1rem;
    padding: 1rem 0.875rem;
  }

  .form-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .keyboard-hints {
    justify-content: center;
  }

  .submit-btn {
    width: 100%;
    justify-content: center;
    padding: 1rem 2rem;
  }
}

@media (max-width: 480px) {
  .word-input-container {
    padding: 1.5rem;
  }

  .input-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .header-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .header-icon {
    width: 24px;
    height: 24px;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .input-wrapper {
    padding: 0 1rem;
  }

  .word-input {
    font-size: 0.9375rem;
    padding: 1rem 0.75rem;
  }

  .keyboard-hints {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .hint {
    justify-content: center;
  }
}

/* ===== Focus Styles ===== */
.clear-btn:focus-visible,
.close-btn:focus-visible,
.submit-btn:focus-visible {
  outline: 3px solid rgba(13, 148, 136, 0.5);
  outline-offset: 2px;
}

.word-input:focus-visible {
  outline: none;
}
</style>
