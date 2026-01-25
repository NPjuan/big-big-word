<template>
  <div class="word-grid-container">
    <!-- Header -->
    <div class="grid-header">
      <div class="header-left">
        <div class="header-icon-wrapper">
          <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="header-content">
          <h2 class="header-title">Word Library</h2>
          <div class="word-count-badge">
            <span
              >{{ wordStore.wordCount }} {{ wordStore.wordCount === 1 ? 'word' : 'words' }}</span
            >
          </div>
        </div>
      </div>

      <div class="header-right">
        <!-- Search -->
        <div class="search-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <input
            v-model="search"
            type="text"
            class="search-input"
            placeholder="Search words..."
            aria-label="Search words"
          />
          <button v-if="search" class="search-clear" @click="search = ''" aria-label="Clear search">
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

        <!-- View Toggle -->
        <div class="view-toggle">
          <button
            class="toggle-btn"
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
            aria-label="Grid view"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                stroke-width="2"
              />
            </svg>
          </button>
          <button
            class="toggle-btn"
            :class="{ active: viewMode === 'table' }"
            @click="viewMode = 'table'"
            aria-label="Table view"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredWords.length === 0 && wordStore.wordCount === 0" class="empty-state">
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
      <h3 class="empty-title">No words yet!</h3>
      <p class="empty-subtitle">Start building your vocabulary by adding your first word.</p>
    </div>

    <!-- No Search Results -->
    <div v-else-if="filteredWords.length === 0 && search" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h3 class="empty-title">No results found</h3>
      <p class="empty-subtitle">Try searching with different keywords.</p>
      <button class="empty-btn" @click="search = ''">Clear Search</button>
    </div>

    <!-- Word Grid by Letter -->
    <div v-else class="word-grid-content">
      <div v-for="letter in alphabetWithWords" :key="letter" class="letter-section">
        <div class="letter-header">
          <div class="letter-badge">{{ letter }}</div>
          <div class="letter-count">{{ groupedWords[letter].length }} words</div>
        </div>

        <div class="word-cards">
          <div
            v-for="word in groupedWords[letter]"
            :key="word.id"
            class="word-card"
            :class="`mastery-${getMasteryLevel(word.mastery)}`"
            @click="handleWordClick(word)"
          >
            <!-- Card Content -->
            <div class="card-content">
              <div class="word-title">{{ word.word }}</div>
              <div class="word-phonetic" v-if="word.phonetic">{{ word.phonetic }}</div>
              <div class="word-mastery">{{ word.mastery }}%</div>
            </div>

            <!-- Audio Button (shows on hover) -->
            <button
              v-if="word.audioUrl"
              class="audio-btn-hover"
              @click.stop="playAudio(word.audioUrl, word)"
              aria-label="Play pronunciation"
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
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <transition name="dialog-fade">
      <div v-if="deleteDialog" class="dialog-overlay" @click="deleteDialog = false">
        <div class="dialog-content" @click.stop>
          <div class="dialog-header">
            <svg class="dialog-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h3 class="dialog-title">Delete Word?</h3>
          </div>
          <p class="dialog-text">
            Are you sure you want to delete <strong>"{{ wordToDelete?.word }}"</strong>?
            <br />
            This action cannot be undone.
          </p>
          <div class="dialog-actions">
            <button class="dialog-btn dialog-btn-cancel" @click="deleteDialog = false">
              Cancel
            </button>
            <button class="dialog-btn dialog-btn-delete" @click="confirmDelete">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWordStore } from '@/stores/wordStore'
import type { Word } from '@/types/word.types'
import { playAudio as playAudioUtil } from '@/utils/audioUtils'

const router = useRouter()
const wordStore = useWordStore()

const search = ref('')
const viewMode = ref<'grid' | 'table'>('grid')
const deleteDialog = ref(false)
const wordToDelete = ref<Word | null>(null)

const filteredWords = computed(() => {
  if (!search.value) return wordStore.words

  const searchLower = search.value.toLowerCase()
  return wordStore.words.filter((word) => {
    return (
      word.word.toLowerCase().includes(searchLower) ||
      word.phonetic.toLowerCase().includes(searchLower) ||
      word.partOfSpeech.some((pos) => pos.toLowerCase().includes(searchLower))
    )
  })
})

const groupedWords = computed(() => {
  const groups: Record<string, Word[]> = {}

  filteredWords.value.forEach((word) => {
    const firstLetter = word.word[0].toUpperCase()
    if (!groups[firstLetter]) {
      groups[firstLetter] = []
    }
    groups[firstLetter].push(word)
  })

  // Sort words within each group
  Object.keys(groups).forEach((letter) => {
    groups[letter].sort((a, b) => a.word.localeCompare(b.word))
  })

  return groups
})

const alphabetWithWords = computed(() => {
  return Object.keys(groupedWords.value).sort()
})

const getMasteryLevel = (mastery: number): string => {
  if (mastery >= 80) return 'high'
  if (mastery >= 50) return 'medium'
  return 'low'
}

const getFirstEnglishMeaning = (word: Word): string => {
  if (!word.englishMeaning || word.englishMeaning.length === 0) {
    return ''
  }
  const firstMeaning = word.englishMeaning[0]
  if (!firstMeaning || !firstMeaning.definitions || firstMeaning.definitions.length === 0) {
    return ''
  }
  const definition = firstMeaning.definitions[0]
  if (!definition) {
    return ''
  }
  return definition.length > 60 ? definition.substring(0, 60) + '...' : definition
}

const getFirstChineseMeaning = (word: Word): string => {
  if (!word.chineseMeaning || word.chineseMeaning.length === 0) {
    return ''
  }
  const firstMeaning = word.chineseMeaning[0]
  if (!firstMeaning || !firstMeaning.definitions || firstMeaning.definitions.length === 0) {
    return ''
  }
  const definition = firstMeaning.definitions[0]
  if (!definition) {
    return ''
  }
  return definition.length > 40 ? definition.substring(0, 40) + '...' : definition
}

const handleWordClick = (word: Word) => {
  router.push(`/word/${word.id}`)
}

const playAudio = (audioUrl: string, word?: Word) => {
  const fallbackText = word?.word || ''
  playAudioUtil(audioUrl, fallbackText)
}

const handleDelete = (word: Word) => {
  wordToDelete.value = word
  deleteDialog.value = true
}

const confirmDelete = () => {
  if (wordToDelete.value) {
    wordStore.deleteWord(wordToDelete.value.id)
    deleteDialog.value = false
    wordToDelete.value = null
  }
}

// Emit event to parent to switch view mode
const emit = defineEmits<{
  (e: 'changeView', mode: 'grid' | 'table'): void
}>()

// Watch viewMode and emit event
import { watch } from 'vue'
watch(viewMode, (newMode) => {
  emit('changeView', newMode)
})
</script>

<style scoped>
/* Container */
.word-grid-container {
  padding: 1.5rem;
}

/* Header */
.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(13, 148, 136, 0.35);
}

.header-icon {
  width: 24px;
  height: 24px;
  color: white;
  stroke-width: 2;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
}

.word-count-badge {
  padding: 0.375rem 0.875rem;
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(45, 212, 191, 0.1));
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0d9488;
  width: fit-content;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  max-width: 600px;
}

/* Search */
.search-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 0 1rem;
  transition: all 0.3s ease;
}

.search-wrapper:focus-within {
  border-color: #0d9488;
  box-shadow: 0 4px 16px rgba(13, 148, 136, 0.15);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: rgba(0, 0, 0, 0.4);
  stroke-width: 2;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.875rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1a1a1a;
  background: transparent;
}

.search-input::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.search-clear {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.search-clear:hover {
  background: rgba(13, 148, 136, 0.1);
  transform: scale(1.1);
}

.search-clear svg {
  width: 12px;
  height: 12px;
  stroke-width: 2.5;
}

/* View Toggle */
.view-toggle {
  display: flex;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  padding: 0.25rem;
  gap: 0.25rem;
}

.toggle-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: rgba(0, 0, 0, 0.5);
}

.toggle-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.toggle-btn.active {
  background: white;
  color: #0d9488;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toggle-btn:hover:not(.active) {
  color: #0d9488;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  width: 96px;
  height: 96px;
  margin-bottom: 2rem;
  color: rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

.empty-icon svg {
  width: 100%;
  height: 100%;
  stroke-width: 1.5;
}

.empty-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.75rem 0;
}

.empty-subtitle {
  font-size: 1.0625rem;
  color: #475569;
  max-width: 400px;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.empty-btn {
  padding: 0.875rem 1.75rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(13, 148, 136, 0.3);
}

.empty-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 148, 136, 0.4);
}

/* Word Grid Content */
.word-grid-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Letter Section */
.letter-section {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.letter-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(13, 148, 136, 0.15);
}

.letter-badge {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  color: white;
  font-size: 1.25rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
}

.letter-count {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #64748b;
}

/* Word Cards */
.word-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

/* Word Card */
.word-card {
  position: relative;
  border-radius: 10px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Mastery-based background colors */
.word-card.mastery-high {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.08));
  border: 1.5px solid rgba(34, 197, 94, 0.3);
}

.word-card.mastery-medium {
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.12), rgba(251, 146, 60, 0.08));
  border: 1.5px solid rgba(251, 146, 60, 0.3);
}

.word-card.mastery-low {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(239, 68, 68, 0.08));
  border: 1.5px solid rgba(239, 68, 68, 0.3);
}

.word-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.word-card:hover.mastery-high {
  border-color: rgba(34, 197, 94, 0.5);
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.25);
}

.word-card:hover.mastery-medium {
  border-color: rgba(251, 146, 60, 0.5);
  box-shadow: 0 4px 16px rgba(251, 146, 60, 0.25);
}

.word-card:hover.mastery-low {
  border-color: rgba(239, 68, 68, 0.5);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.25);
}

/* Card Content */
.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: relative;
  z-index: 1;
}

.word-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  text-transform: capitalize;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.word-phonetic {
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
  font-size: 0.6875rem;
  color: #64748b;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.word-mastery {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #64748b;
  margin-top: 0.125rem;
}

/* Audio Button on Hover */
.audio-btn-hover {
  position: absolute;
  top: 50%;
  right: -48px;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #0d9488;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  pointer-events: none;
  z-index: 10;
}

.word-card:hover .audio-btn-hover {
  right: -12px;
  opacity: 1;
  pointer-events: all;
}

.audio-btn-hover:hover {
  background: #0d9488;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.audio-btn-hover svg {
  width: 18px;
  height: 18px;
  stroke-width: 2.5;
}

/* Dialog */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.dialog-content {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.dialog-icon {
  width: 48px;
  height: 48px;
  color: #dc2626;
  stroke-width: 2;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.dialog-text {
  font-size: 1rem;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.dialog-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.dialog-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dialog-btn-cancel {
  color: #475569;
  background: rgba(0, 0, 0, 0.05);
}

.dialog-btn-cancel:hover {
  background: rgba(0, 0, 0, 0.1);
}

.dialog-btn-delete {
  color: white;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.dialog-btn-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.btn-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2.5;
}

/* Transitions */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-from .dialog-content,
.dialog-fade-leave-to .dialog-content {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 1024px) {
  .word-cards {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  }
}

@media (max-width: 768px) {
  .word-grid-container {
    padding: 1rem;
  }

  .grid-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-right {
    max-width: 100%;
  }

  .word-cards {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.625rem;
  }

  .letter-badge {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }

  .word-card {
    min-height: 70px;
  }

  .word-title {
    font-size: 0.9375rem;
  }

  /* On mobile, show audio button on tap instead of hover */
  .audio-btn-hover {
    right: 0.5rem;
    top: 0.5rem;
    transform: none;
    opacity: 0.7;
    pointer-events: all;
  }

  .word-card:active .audio-btn-hover {
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .word-cards {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }

  .word-card {
    padding: 0.625rem;
    min-height: 65px;
  }

  .word-title {
    font-size: 0.875rem;
  }

  .word-phonetic {
    font-size: 0.625rem;
  }

  .word-mastery {
    font-size: 0.625rem;
  }
}
</style>
