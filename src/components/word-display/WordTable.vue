<template>
  <div class="word-table-container">
    <!-- Table Header -->
    <div class="table-header">
      <div class="header-left">
        <div class="header-icon-wrapper">
          <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="header-content">
          <h2 class="header-title">Word Collection</h2>
          <div class="word-count-badge">
            <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span
              >{{ wordStore.wordCount }} {{ wordStore.wordCount === 1 ? 'word' : 'words' }}</span
            >
          </div>
        </div>
      </div>

      <div class="header-right">
        <!-- View Toggle -->
        <div class="view-toggle">
          <button
            class="toggle-btn"
            :class="{ active: viewMode === 'grid' }"
            @click="handleViewChange('grid')"
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
            class="toggle-btn active"
            :class="{ active: viewMode === 'table' }"
            @click="handleViewChange('table')"
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
          <button
            v-if="search"
            class="search-clear"
            @click="search = ''"
            aria-label="Clear search"
            tabindex="0"
            @keydown.enter="search = ''"
            @keydown.space.prevent="search = ''"
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
      </div>
    </div>

    <!-- Table Content -->
    <div class="table-content">
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
        <p class="empty-subtitle">
          Start building your vocabulary by adding your first word above.
        </p>
        <button class="empty-btn" @click="scrollToTop">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M12 4v16m8-8H4"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Add Your First Word</span>
        </button>
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
        <button class="empty-btn-secondary" @click="search = ''">
          <span>Clear Search</span>
        </button>
      </div>

      <!-- Word Table -->
      <div v-else class="word-table">
        <div class="table-scroll">
          <table class="table">
            <thead class="table-head">
              <tr>
                <th class="th th-word">Word</th>
                <th class="th th-phonetic">Phonetic</th>
                <th class="th th-meanings">Meanings</th>
                <th class="th th-pos">Part of Speech</th>
                <th class="th th-date">Created</th>
                <th class="th th-mastery">Mastery</th>
                <th class="th th-reviews">Reviews</th>
                <th class="th th-actions">Actions</th>
              </tr>
            </thead>
            <tbody class="table-body">
              <tr v-for="word in paginatedWords" :key="word.id" class="table-row">
                <!-- Word -->
                <td class="td td-word">
                  <div class="word-cell">
                    <button
                      class="word-link"
                      @click="handleWordClick(word)"
                      aria-label="View word details"
                      tabindex="0"
                    >
                      <span class="word-text">{{ word.word }}</span>
                      <svg class="word-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                          d="M9 5l7 7-7 7"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </td>

                <!-- Phonetic -->
                <td class="td td-phonetic">
                  <div class="phonetic-cell">
                    <span v-if="word.phonetic" class="phonetic-text">{{ word.phonetic }}</span>
                    <span v-else class="phonetic-empty">—</span>
                    <button
                      v-if="word.audioUrl"
                      class="audio-btn"
                      @click="playAudio(word.audioUrl, word)"
                      aria-label="Play pronunciation"
                      tabindex="0"
                      @keydown.enter="playAudio(word.audioUrl, word)"
                      @keydown.space.prevent="playAudio(word.audioUrl, word)"
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
                </td>

                <!-- Meanings (English Only, Expandable for Chinese) -->
                <td class="td td-meanings">
                  <div class="meanings-cell">
                    <button
                      class="meanings-toggle"
                      @click="toggleMeanings(word.id)"
                      aria-label="Toggle meanings"
                      tabindex="0"
                    >
                      <div class="meanings-preview">
                        <span class="meaning-text-compact">
                          {{ getFirstEnglishMeaning(word) }}
                        </span>
                      </div>
                      <svg
                        class="toggle-icon"
                        :class="{ 'icon-expanded': expandedMeanings.has(word.id) }"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M19 9l-7 7-7-7"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>

                    <!-- Expanded Meanings -->
                    <transition name="expand">
                      <div v-if="expandedMeanings.has(word.id)" class="meanings-expanded">
                        <div class="meanings-section">
                          <div class="section-header">
                            <span class="section-label section-label-cn">中文</span>
                          </div>
                          <div
                            v-for="(meaning, idx) in word.chineseMeaning"
                            :key="'cn-' + idx"
                            class="meaning-group"
                          >
                            <span class="meaning-pos-inline">{{ meaning.partOfSpeech }}</span>
                            <ul class="meaning-list">
                              <li
                                v-for="(def, defIdx) in meaning.definitions.slice(0, 3)"
                                :key="defIdx"
                                class="meaning-definition"
                              >
                                {{ def }}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>
                </td>

                <!-- Part of Speech -->
                <td class="td td-pos">
                  <div class="pos-cell">
                    <span v-for="pos in word.partOfSpeech.slice(0, 2)" :key="pos" class="pos-tag">
                      {{ pos }}
                    </span>
                    <span v-if="word.partOfSpeech.length > 2" class="pos-more">
                      +{{ word.partOfSpeech.length - 2 }}
                    </span>
                  </div>
                </td>

                <!-- Created Date -->
                <td class="td td-date">
                  <div class="date-cell">
                    <svg class="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span>{{ formatDate(word.createdAt) }}</span>
                  </div>
                </td>

                <!-- Mastery -->
                <td class="td td-mastery">
                  <div class="mastery-cell">
                    <span
                      class="mastery-number"
                      :class="`mastery-${getMasteryLevel(word.mastery)}`"
                    >
                      {{ word.mastery }}%
                    </span>
                  </div>
                </td>

                <!-- Reviews -->
                <td class="td td-reviews">
                  <div class="review-badge">
                    <svg class="review-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span>{{ word.reviewCount }}</span>
                  </div>
                </td>

                <!-- Actions -->
                <td class="td td-actions">
                  <div class="action-buttons">
                    <button
                      class="action-btn action-delete"
                      @click="handleDelete(word)"
                      aria-label="Delete word"
                      tabindex="0"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="currentPage--"
            aria-label="Previous page"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M15 19l-7-7 7-7"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div class="pagination-info">
            <span class="page-current">{{ currentPage }}</span>
            <span class="page-separator">/</span>
            <span class="page-total">{{ totalPages }}</span>
          </div>

          <button
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            aria-label="Next page"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M9 5l7 7-7 7"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWordStore } from '@/stores/wordStore'
import type { Word } from '@/types/word.types'
import { playAudio as playAudioUtil } from '@/utils/audioUtils'

const router = useRouter()
const wordStore = useWordStore()

const search = ref('')
const viewMode = ref<'grid' | 'table'>('table')
const currentPage = ref(1)
const itemsPerPage = 10
const deleteDialog = ref(false)
const wordToDelete = ref<Word | null>(null)
const expandedMeanings = ref<Set<string>>(new Set())

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

const totalPages = computed(() => {
  return Math.ceil(filteredWords.value.length / itemsPerPage)
})

const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredWords.value.slice(start, end)
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()

  // Reset time to midnight for accurate day comparison
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const diffInMs = nowOnly.getTime() - dateOnly.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  return date.toLocaleDateString()
}

const getMasteryLevel = (mastery: number): string => {
  if (mastery >= 80) return 'high'
  if (mastery >= 50) return 'medium'
  return 'low'
}

const getFirstChineseMeaning = (word: Word): string => {
  if (!word.chineseMeaning || word.chineseMeaning.length === 0) {
    return '暂无中文释义'
  }
  const firstMeaning = word.chineseMeaning[0]
  if (!firstMeaning || !firstMeaning.definitions || firstMeaning.definitions.length === 0) {
    return '暂无中文释义'
  }
  const definition = firstMeaning.definitions[0]
  if (!definition) {
    return '暂无中文释义'
  }
  return definition.length > 50 ? definition.substring(0, 50) + '...' : definition
}

const getFirstEnglishMeaning = (word: Word): string => {
  if (!word.englishMeaning || word.englishMeaning.length === 0) {
    return 'No definition available'
  }
  const firstMeaning = word.englishMeaning[0]
  if (!firstMeaning || !firstMeaning.definitions || firstMeaning.definitions.length === 0) {
    return 'No definition available'
  }
  const definition = firstMeaning.definitions[0]
  if (!definition) {
    return 'No definition available'
  }
  return definition.length > 80 ? definition.substring(0, 80) + '...' : definition
}

const toggleMeanings = (wordId: string) => {
  if (expandedMeanings.value.has(wordId)) {
    expandedMeanings.value.delete(wordId)
  } else {
    expandedMeanings.value.add(wordId)
  }
  // Trigger reactivity
  expandedMeanings.value = new Set(expandedMeanings.value)
}

const handleWordClick = (word: Word) => {
  router.push(`/word/${word.id}`)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

const handleClickOutside = (event: MouseEvent) => {
  // Reserved for future use
}

// Emit event to parent to switch view mode
const emit = defineEmits<{
  (e: 'changeView', mode: 'grid' | 'table'): void
}>()

const handleViewChange = (mode: 'grid' | 'table') => {
  viewMode.value = mode
  emit('changeView', mode)
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Container */
.word-table-container {
  padding: 1.5rem;
}

/* Table Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.header-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(13, 148, 136, 0.35);
  flex-shrink: 0;
}

.header-icon {
  width: 22px;
  height: 22px;
  color: white;
  stroke-width: 2;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.header-title {
  font-size: 1.375rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.word-count-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(45, 212, 191, 0.1));
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0d9488;
  width: fit-content;
}

.badge-icon {
  width: 14px;
  height: 14px;
  stroke-width: 2.5;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  max-width: 600px;
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

/* Search */
.search-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 0 0.875rem;
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
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.75rem 0.625rem;
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
  flex-shrink: 0;
}

.search-clear:hover {
  background: rgba(13, 148, 136, 0.1);
  transform: scale(1.1);
  cursor: pointer;
}

.search-clear svg {
  width: 12px;
  height: 12px;
  stroke-width: 2.5;
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

.empty-btn,
.empty-btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.empty-btn {
  color: white;
  background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%);
  box-shadow: 0 4px 16px rgba(234, 88, 12, 0.3);
}

.empty-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(234, 88, 12, 0.4);
  cursor: pointer;
}

.empty-btn-secondary {
  color: #0d9488;
  background: rgba(13, 148, 136, 0.1);
}

.empty-btn-secondary:hover {
  background: rgba(13, 148, 136, 0.15);
  transform: translateY(-2px);
  cursor: pointer;
}

/* Word Table */
.word-table {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.table-scroll {
  overflow-x: auto;
  border-radius: 16px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.table-head {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.th {
  padding: 0.875rem 0.75rem;
  text-align: left;
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #0d9488;
  white-space: nowrap;
}

.th:first-child {
  border-top-left-radius: 16px;
}

.th:last-child {
  border-top-right-radius: 16px;
}

.table-body {
  background: white;
}

.table-row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.table-row:hover {
  background: rgba(13, 148, 136, 0.03);
}

.table-row:last-child {
  border-bottom: none;
}

.td {
  padding: 0.875rem 0.75rem;
  vertical-align: middle;
}

/* Word Cell */
.word-cell {
  display: flex;
  align-items: center;
}

.word-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.word-link:hover {
  background: rgba(13, 148, 136, 0.1);
  transform: translateX(4px);
}

.word-link:hover .word-arrow {
  opacity: 1;
  transform: translateX(4px);
}

.word-text {
  font-size: 1rem;
  font-weight: 700;
  color: #0d9488;
  text-transform: capitalize;
}

.word-arrow {
  width: 18px;
  height: 18px;
  color: #0d9488;
  stroke-width: 2.5;
  opacity: 0;
  transition: all 0.2s ease;
}

/* Phonetic Cell */
.phonetic-cell {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.phonetic-text {
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: #0d9488;
  font-weight: 600;
}

.phonetic-empty {
  color: rgba(0, 0, 0, 0.3);
  font-size: 1.125rem;
}

.audio-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(13, 148, 136, 0.1);
  color: #0d9488;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.audio-btn:hover {
  background: rgba(13, 148, 136, 0.2);
  transform: scale(1.1);
}

.audio-btn svg {
  width: 16px;
  height: 16px;
  stroke-width: 2.5;
}

/* Part of Speech Cell */
.pos-cell {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.pos-tag {
  padding: 0.3125rem 0.625rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: lowercase;
  color: #0d9488;
  background: rgba(13, 148, 136, 0.1);
  border-radius: 6px;
}

.pos-more {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.5);
}

/* Meanings Cell */
.meanings-cell {
  min-width: 280px;
  max-width: 450px;
}

.meanings-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.625rem;
  padding: 0.625rem 0.875rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(13, 148, 136, 0.12);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.meanings-toggle:hover {
  background: rgba(13, 148, 136, 0.06);
  border-color: rgba(13, 148, 136, 0.25);
  box-shadow: 0 2px 8px rgba(13, 148, 136, 0.1);
}

.meanings-preview {
  flex: 1;
  min-width: 0;
}

.meaning-text-compact {
  font-size: 0.8125rem;
  color: #334155;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: 500;
}

.toggle-icon {
  width: 18px;
  height: 18px;
  color: #0d9488;
  stroke-width: 2.5;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.icon-expanded {
  transform: rotate(180deg);
}

.meanings-expanded {
  margin-top: 0.625rem;
  padding: 0.875rem;
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.04), rgba(45, 212, 191, 0.04));
  border: 1px solid rgba(13, 148, 136, 0.15);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(13, 148, 136, 0.08);
}

.meanings-section {
  padding: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.625rem;
}

.section-label {
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  letter-spacing: 0.03em;
}

.section-label-cn {
  background: linear-gradient(135deg, #0d9488, #14b8a6);
  color: white;
}

.meaning-group {
  margin-bottom: 0.625rem;
}

.meaning-group:last-child {
  margin-bottom: 0;
}

.meaning-pos-inline {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #0d9488;
  text-transform: lowercase;
  padding: 0.1875rem 0.5rem;
  background: rgba(13, 148, 136, 0.12);
  border-radius: 5px;
  display: inline-block;
  margin-bottom: 0.375rem;
}

.meaning-list {
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 0.375rem;
}

.meaning-definition {
  font-size: 0.8125rem;
  color: #475569;
  line-height: 1.5;
  padding: 0.25rem 0;
  padding-left: 1rem;
  position: relative;
}

.meaning-definition::before {
  content: '•';
  position: absolute;
  left: 0.25rem;
  color: #0d9488;
  font-weight: 700;
  font-size: 0.875rem;
}

/* Date Cell */
.date-cell {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.date-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

/* Mastery Cell */
.mastery-cell {
  min-width: 80px;
}

.mastery-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
  min-width: 55px;
}

.mastery-high {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.mastery-medium {
  background: rgba(251, 146, 60, 0.1);
  color: #ea580c;
}

.mastery-low {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

/* Review Badge */
.review-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: rgba(79, 172, 254, 0.1);
  color: #0284c7;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
  width: fit-content;
}

.review-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2.5;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-btn svg {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.action-delete {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.action-delete:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
  cursor: pointer;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 0;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  background: white;
  color: #0d9488;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #0d9488;
  background: rgba(13, 148, 136, 0.05);
  transform: scale(1.05);
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pagination-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2.5;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
}

.page-current {
  color: #0d9488;
}

.page-separator {
  color: rgba(0, 0, 0, 0.3);
}

.page-total {
  color: #475569;
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
  cursor: pointer;
}

.dialog-btn-delete {
  color: white;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.dialog-btn-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  cursor: pointer;
}

/* Transitions */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
  margin-top: 0.75rem;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

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
  .word-table-container {
    padding: 2rem;
  }

  .table-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-right {
    max-width: 100%;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .word-table-container {
    padding: 1.5rem;
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

  .th,
  .td {
    padding: 1rem 0.75rem;
  }

  .word-text {
    font-size: 1rem;
  }

  .toast {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .word-table-container {
    padding: 1rem;
  }

  .table-scroll {
    border-radius: 12px;
  }

  .th,
  .td {
    padding: 0.875rem 0.625rem;
    font-size: 0.875rem;
  }

  .word-text {
    font-size: 0.9375rem;
  }

  .dialog-content {
    padding: 1.5rem;
  }

  .dialog-actions {
    flex-direction: column;
  }

  .dialog-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Focus Styles */
.word-link:focus-visible,
.search-clear:focus-visible,
.audio-btn:focus-visible,
.action-btn:focus-visible,
.pagination-btn:focus-visible {
  outline: 3px solid rgba(13, 148, 136, 0.5);
  outline-offset: 2px;
}
</style>
