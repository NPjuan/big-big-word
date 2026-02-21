<template>
  <div class="compact-input-container">
    <!-- Loading Progress Tips (above input) -->
    <transition name="fade">
      <div v-if="wordStore.loadingStep" class="progress-tip">
        <div class="progress-dot-container">
          <span class="progress-dot"></span>
          <span class="progress-dot"></span>
          <span class="progress-dot"></span>
        </div>
        <span class="progress-text">{{ wordStore.loadingStep }}</span>
      </div>
    </transition>

    <!-- Input Wrapper -->
    <div
      ref="inputWrapperRef"
      class="input-wrapper"
      :class="{
        'input-focused': isFocused,
        'input-error': !!errorMessage,
        'input-shake': isShaking,
        'input-success-flash': isSuccessFlash,
      }"
    >
      <div class="input-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
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
        placeholder="Type a word to add to your collection..."
        :disabled="isLoading"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keydown="handleKeyDown"
        aria-label="Enter a word to add"
      />
      <div class="action-buttons">
        <button
          v-if="inputWord && !isLoading"
          class="clear-btn"
          @click="clearInput"
          aria-label="Clear input"
          tabindex="0"
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
        <button
          v-else
          class="submit-btn"
          :class="{ 'btn-disabled': !isValid }"
          :disabled="!isValid"
          @click="handleSubmit"
          aria-label="Add word"
          tabindex="0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M12 4v16m8-8H4"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Subtle Tips -->
    <div class="tips-row">
      <div class="tip"><kbd>Enter</kbd> to add</div>
      <div class="tip"><kbd>Esc</kbd> to clear</div>
      <transition name="fade">
        <div v-if="errorMessage" class="error-tip">
          {{ errorMessage }}
        </div>
        <div v-else-if="successMessage" class="success-tip">
          {{ successMessage }}
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
const isShaking = ref(false)
const isSuccessFlash = ref(false)
const inputWrapperRef = ref<HTMLDivElement | null>(null)

const triggerShake = () => {
  isShaking.value = true
  setTimeout(() => {
    isShaking.value = false
  }, 600)
}

const triggerSuccessFlash = () => {
  isSuccessFlash.value = true
  setTimeout(() => {
    isSuccessFlash.value = false
  }, 800)
}

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
    successMessage.value = `"${inputWord.value}" added! 🎉`
    inputWord.value = ''
    triggerSuccessFlash()

    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Failed to add word'
    triggerShake()
    setTimeout(() => {
      errorMessage.value = null
    }, 3000)
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
.compact-input-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* ===== Input Wrapper ===== */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px);
  border: 2px solid rgba(13, 148, 136, 0.2);
  border-radius: 16px;
  padding: 0 1rem;
  gap: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  height: 56px;
}

.input-wrapper:hover {
  border-color: rgba(13, 148, 136, 0.4);
  box-shadow:
    0 6px 24px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.input-focused {
  border-color: #0d9488;
  box-shadow:
    0 8px 32px rgba(13, 148, 136, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  background: #ffffff;
}

.input-error {
  border-color: #ef4444;
  box-shadow:
    0 4px 20px rgba(239, 68, 68, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

/* ===== Shake Animation (Error) ===== */
.input-shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10% {
    transform: translateX(-6px);
  }
  20% {
    transform: translateX(5px);
  }
  30% {
    transform: translateX(-4px);
  }
  40% {
    transform: translateX(3px);
  }
  50% {
    transform: translateX(-2px);
  }
  60% {
    transform: translateX(1px);
  }
  70% {
    transform: translateX(0);
  }
}

/* ===== Success Flash Animation ===== */
.input-success-flash {
  animation: successFlash 0.7s ease-out both;
}

@keyframes successFlash {
  0% {
    border-color: rgba(13, 148, 136, 0.2);
    box-shadow:
      0 4px 20px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
  30% {
    border-color: #16a34a;
    box-shadow:
      0 0 0 4px rgba(34, 197, 94, 0.2),
      0 4px 20px rgba(34, 197, 94, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
  100% {
    border-color: rgba(13, 148, 136, 0.2);
    box-shadow:
      0 4px 20px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
}

/* ===== Input Icon ===== */
.input-icon {
  width: 22px;
  height: 22px;
  color: rgba(13, 148, 136, 0.6);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.input-focused .input-icon {
  color: #0d9488;
  transform: scale(1.1);
}

.input-icon svg {
  width: 100%;
  height: 100%;
  stroke-width: 2;
}

/* ===== Input Field ===== */
.word-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0;
  font-size: 1rem;
  font-weight: 500;
  color: #0f172a;
  background: transparent;
  min-width: 0;
}

.word-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.word-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== Action Buttons ===== */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.clear-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  transform: scale(1.05);
}

.clear-btn:active {
  transform: scale(0.95);
}

.clear-btn svg {
  width: 16px;
  height: 16px;
  stroke-width: 2.5;
}

.submit-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
}

.submit-btn:hover:not(.btn-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 148, 136, 0.4);
}

.submit-btn:active:not(.btn-disabled) {
  transform: translateY(0);
}

.btn-disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: 0 2px 8px rgba(13, 148, 136, 0.2);
}

.submit-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2.5;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 20px;
  height: 20px;
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

/* ===== Tips Row ===== */
.tips-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 0.5rem;
  min-height: 24px;
}

.tip {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: rgba(15, 23, 42, 0.6);
  font-weight: 500;
}

.tip kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 20px;
  padding: 0 0.375rem;
  font-size: 0.6875rem;
  font-weight: 700;
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
  color: rgba(15, 23, 42, 0.7);
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.error-tip,
.success-tip {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  white-space: nowrap;
}

/* ===== Progress Tips ===== */
.progress-tip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.06), rgba(45, 212, 191, 0.06));
  border: 1px solid rgba(13, 148, 136, 0.15);
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #0d9488;
  animation: tipSlideIn 0.3s ease-out;
}

@keyframes tipSlideIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.progress-dot-container {
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
}

.progress-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #0d9488;
  animation: dotPulse 1.4s ease-in-out infinite;
}

.progress-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.progress-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%,
  80%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.progress-text {
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.error-tip {
  color: #dc2626;
  background: rgba(239, 68, 68, 0.1);
}

.success-tip {
  color: #16a34a;
  background: rgba(34, 197, 94, 0.1);
}

/* ===== Transitions ===== */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* Override for absolutely-positioned tips inside tips-row to avoid transform conflict */
.tips-row .fade-enter-from,
.tips-row .fade-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.95);
}

.tips-row .fade-enter-active,
.tips-row .fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
  .input-wrapper {
    height: 52px;
    padding: 0 0.875rem;
  }

  .word-input {
    font-size: 0.9375rem;
  }

  .submit-btn {
    width: 36px;
    height: 36px;
  }

  .submit-btn svg {
    width: 18px;
    height: 18px;
  }

  .tips-row {
    gap: 0.75rem;
  }

  .tip {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .input-wrapper {
    height: 48px;
    padding: 0 0.75rem;
    gap: 0.5rem;
  }

  .input-icon {
    width: 20px;
    height: 20px;
  }

  .word-input {
    font-size: 0.875rem;
  }

  .clear-btn {
    width: 28px;
    height: 28px;
  }

  .clear-btn svg {
    width: 14px;
    height: 14px;
  }

  .submit-btn {
    width: 32px;
    height: 32px;
  }

  .submit-btn svg {
    width: 16px;
    height: 16px;
  }

  .tips-row {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tip {
    font-size: 0.6875rem;
  }

  .error-tip,
  .success-tip {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: auto;
    text-align: center;
    font-size: 0.75rem;
  }
}

/* ===== Focus Styles ===== */
.clear-btn:focus-visible,
.submit-btn:focus-visible {
  outline: 3px solid rgba(13, 148, 136, 0.5);
  outline-offset: 2px;
}

.word-input:focus-visible {
  outline: none;
}
</style>
