<template>
  <div class="word-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h2 class="error-title">{{ error }}</h2>
      <button class="back-btn" @click="goBack">← Go Back</button>
    </div>

    <!-- Word Detail Content -->
    <div v-else-if="word" class="detail-container">
      <!-- Header -->
      <div class="detail-header">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Back</span>
        </button>
      </div>

      <!-- Single Column Layout -->
      <div class="single-column-layout">
        <!-- Unified Word Card -->
        <div class="unified-word-card">
          <!-- Header Row: Word + Phonetic + Stats -->
          <div class="unified-header-row">
            <div class="word-info-group">
              <h1 class="word-title">{{ word.word }}</h1>

              <!-- Inline Phonetic -->
              <div v-if="hasPhonetics()" class="phonetic-inline">
                <span class="phonetic-text">{{
                  word.phonetic || wordData?.phonetics?.[0]?.text
                }}</span>
                <button
                  class="audio-btn-inline"
                  @click="handlePlayAudio(word.audioUrl || wordData?.phonetics?.[0]?.audio)"
                  :aria-label="`Play pronunciation`"
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

                <!-- Additional phonetics -->
                <button
                  v-for="(phonetic, idx) in wordData?.phonetics?.slice(1, 3) || []"
                  :key="idx"
                  class="phonetic-variant-inline"
                  @click="handlePlayAudio(phonetic.audio)"
                  :title="phonetic.text"
                >
                  <span class="variant-text">{{ handleGetPhoneticLabel(phonetic, idx + 1) }}</span>
                </button>
              </div>

              <!-- POS Tags -->
              <div v-if="word.partOfSpeech.length > 0" class="pos-tags-inline">
                <span v-for="pos in word.partOfSpeech" :key="pos" class="pos-badge-inline">
                  {{ pos }}
                </span>
              </div>
            </div>

            <!-- Stats Group -->
            <div class="stats-group">
              <div
                class="stat-compact mastery-stat"
                :class="`mastery-${getMasteryLevel(word.mastery)}`"
              >
                <span class="stat-value-compact">{{ word.mastery }}%</span>
              </div>
              <div class="stat-divider">|</div>
              <div class="stat-compact review-stat">
                <span class="stat-value-compact">{{ word.reviewCount }}</span>
                <span class="stat-label-compact">Reviews</span>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="section-divider"></div>

          <!-- Meanings Section -->
          <div v-if="wordData?.englishMeanings" class="meanings-section-compact">
            <div class="section-label">
              <svg class="section-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Meanings</span>
            </div>
            <div class="meanings-compact-list">
              <div
                v-for="(meaning, idx) in wordData.englishMeanings.slice(0, 3)"
                :key="'meaning-' + idx"
                class="meaning-compact-item"
              >
                <span class="meaning-pos-compact">{{ meaning.partOfSpeech }}</span>
                <span class="meaning-text-compact">{{ meaning.definitions[0] }}</span>
              </div>
            </div>
          </div>

          <!-- Related Words Section -->
          <div v-if="hasRelatedWords()" class="related-section-compact">
            <div class="section-divider"></div>
            <div class="section-label">
              <svg class="section-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Related</span>
            </div>
            <div class="related-compact-content">
              <div v-if="getFirstSynonyms().length > 0" class="related-inline-group">
                <span class="related-type">Synonyms:</span>
                <div class="related-tags-inline">
                  <span
                    v-for="(syn, idx) in getFirstSynonyms()"
                    :key="idx"
                    class="related-tag-compact"
                  >
                    {{ syn }}
                  </span>
                </div>
              </div>
              <div v-if="getFirstAntonyms().length > 0" class="related-inline-group">
                <span class="related-type">Antonyms:</span>
                <div class="related-tags-inline">
                  <span
                    v-for="(ant, idx) in getFirstAntonyms()"
                    :key="idx"
                    class="related-tag-compact antonym"
                  >
                    {{ ant }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Word Forms Card -->
        <div v-if="wordData?.wordForms && hasWordForms(wordData.wordForms)" class="content-card">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h2 class="card-title">Word Forms</h2>
          </div>
          <div class="word-forms-grid">
            <!-- Verb Forms -->
            <template v-if="hasVerbForms(wordData.wordForms)">
              <div v-if="wordData.wordForms.pastTense" class="form-item">
                <span class="form-label">Past Tense</span>
                <span class="form-value">{{ wordData.wordForms.pastTense }}</span>
              </div>
              <div v-if="wordData.wordForms.pastParticiple" class="form-item">
                <span class="form-label">Past Participle</span>
                <span class="form-value">{{ wordData.wordForms.pastParticiple }}</span>
              </div>
              <div v-if="wordData.wordForms.presentParticiple" class="form-item">
                <span class="form-label">Present Participle</span>
                <span class="form-value">{{ wordData.wordForms.presentParticiple }}</span>
              </div>
              <div v-if="wordData.wordForms.thirdPersonSingular" class="form-item">
                <span class="form-label">3rd Person</span>
                <span class="form-value">{{ wordData.wordForms.thirdPersonSingular }}</span>
              </div>
            </template>

            <!-- Noun Forms -->
            <template v-if="hasNounForms(wordData.wordForms)">
              <div v-if="wordData.wordForms.plural" class="form-item">
                <span class="form-label">Plural</span>
                <span class="form-value">{{ wordData.wordForms.plural }}</span>
              </div>
              <div v-if="wordData.wordForms.singular" class="form-item">
                <span class="form-label">Singular</span>
                <span class="form-value">{{ wordData.wordForms.singular }}</span>
              </div>
            </template>

            <!-- Adjective Forms -->
            <template v-if="hasAdjectiveForms(wordData.wordForms)">
              <div v-if="wordData.wordForms.comparative" class="form-item">
                <span class="form-label">Comparative</span>
                <span class="form-value">{{ wordData.wordForms.comparative }}</span>
              </div>
              <div v-if="wordData.wordForms.superlative" class="form-item">
                <span class="form-label">Superlative</span>
                <span class="form-value">{{ wordData.wordForms.superlative }}</span>
              </div>
            </template>

            <!-- Related Forms -->
            <template v-if="hasRelatedForms(wordData.wordForms)">
              <div v-if="wordData.wordForms.noun" class="form-item">
                <span class="form-label">Noun</span>
                <span class="form-value">{{ wordData.wordForms.noun }}</span>
              </div>
              <div v-if="wordData.wordForms.verb" class="form-item">
                <span class="form-label">Verb</span>
                <span class="form-value">{{ wordData.wordForms.verb }}</span>
              </div>
              <div v-if="wordData.wordForms.adjective" class="form-item">
                <span class="form-label">Adjective</span>
                <span class="form-value">{{ wordData.wordForms.adjective }}</span>
              </div>
              <div v-if="wordData.wordForms.adverb" class="form-item">
                <span class="form-label">Adverb</span>
                <span class="form-value">{{ wordData.wordForms.adverb }}</span>
              </div>
            </template>
          </div>
        </div>
        <!-- Origin Card -->
        <div v-if="wordData?.origin" class="content-card">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h2 class="card-title">Origin</h2>
          </div>
          <p class="origin-text">{{ wordData.origin }}</p>
        </div>

        <!-- Definitions Card -->
        <div class="content-card">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h2 class="card-title">Definitions</h2>
          </div>

          <!-- English Definitions -->
          <div v-if="wordData?.englishMeanings" class="definitions-group">
            <div
              v-for="(meaning, idx) in wordData.englishMeanings"
              :key="'en-def-' + idx"
              class="definition-block"
            >
              <div class="definition-pos">{{ meaning.partOfSpeech }}</div>
              <!-- Definitions -->
              <div v-if="meaning.definitions.length > 0" class="definitions-list">
                <div
                  v-for="(def, defIdx) in meaning.definitions"
                  :key="defIdx"
                  class="definition-item"
                >
                  <span class="definition-number">{{ defIdx + 1 }}</span>
                  <span class="definition-text">{{ def }}</span>
                </div>
              </div>
              <!-- Examples -->
              <div v-if="meaning.examples && meaning.examples.length > 0" class="examples-list">
                <div class="examples-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>Examples</span>
                </div>
                <div
                  v-for="(example, exIdx) in meaning.examples.slice(0, 3)"
                  :key="exIdx"
                  class="example-item"
                >
                  "{{ example }}"
                </div>
              </div>

              <!-- Synonyms -->
              <div v-if="meaning.synonyms && meaning.synonyms.length > 0" class="related-section">
                <div class="related-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>Synonyms</span>
                </div>
                <div class="related-tags">
                  <span
                    v-for="(syn, synIdx) in meaning.synonyms.slice(0, 8)"
                    :key="synIdx"
                    class="related-tag"
                  >
                    {{ syn }}
                  </span>
                  <span v-if="meaning.synonyms.length > 8" class="related-more">
                    +{{ meaning.synonyms.length - 8 }} more
                  </span>
                </div>
              </div>

              <!-- Antonyms -->
              <div v-if="meaning.antonyms && meaning.antonyms.length > 0" class="related-section">
                <div class="related-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>Antonyms</span>
                </div>
                <div class="related-tags">
                  <span
                    v-for="(ant, antIdx) in meaning.antonyms.slice(0, 8)"
                    :key="antIdx"
                    class="related-tag antonym-tag"
                  >
                    {{ ant }}
                  </span>
                  <span v-if="meaning.antonyms.length > 8" class="related-more">
                    +{{ meaning.antonyms.length - 8 }} more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWordStore } from '@/stores/wordStore'
import { fetchWordData, type WordData } from '@/services/dictionaryApi'
import type { Word, WordForms } from '@/types/word.types'
import { playAudio, playTextToSpeech, getPhoneticLabel } from '@/utils/audioUtils'

const route = useRoute()
const router = useRouter()
const wordStore = useWordStore()

const loading = ref(true)
const error = ref<string | null>(null)
const word = ref<Word | null>(null)
const wordData = ref<WordData | null>(null)

const getMasteryLevel = (mastery: number): string => {
  if (mastery >= 80) return 'high'
  if (mastery >= 50) return 'medium'
  return 'low'
}

const hasWordForms = (forms: WordForms | undefined): boolean => {
  if (!forms) return false
  return Object.values(forms).some((value) => value !== undefined && value !== null && value !== '')
}

const hasVerbForms = (forms: WordForms | undefined): boolean => {
  if (!forms) return false
  return !!(
    forms.pastTense ||
    forms.pastParticiple ||
    forms.presentParticiple ||
    forms.thirdPersonSingular
  )
}

const hasNounForms = (forms: WordForms | undefined): boolean => {
  if (!forms) return false
  return !!(forms.plural || forms.singular)
}

const hasAdjectiveForms = (forms: WordForms | undefined): boolean => {
  if (!forms) return false
  return !!(forms.comparative || forms.superlative)
}

const hasRelatedForms = (forms: WordForms | undefined): boolean => {
  if (!forms) return false
  return !!(forms.noun || forms.verb || forms.adjective || forms.adverb)
}

const hasRelatedWords = (): boolean => {
  if (!wordData.value?.englishMeanings) return false
  return wordData.value.englishMeanings.some(
    (m) => (m.synonyms && m.synonyms.length > 0) || (m.antonyms && m.antonyms.length > 0),
  )
}

const getFirstSynonyms = (): string[] => {
  if (!wordData.value?.englishMeanings) return []
  for (const meaning of wordData.value.englishMeanings) {
    if (meaning.synonyms && meaning.synonyms.length > 0) {
      return meaning.synonyms.slice(0, 6)
    }
  }
  return []
}

const getFirstAntonyms = (): string[] => {
  if (!wordData.value?.englishMeanings) return []
  for (const meaning of wordData.value.englishMeanings) {
    if (meaning.antonyms && meaning.antonyms.length > 0) {
      return meaning.antonyms.slice(0, 6)
    }
  }
  return []
}

const hasPhonetics = (): boolean => {
  return !!(
    word.value?.phonetic ||
    (wordData.value?.phonetics && wordData.value.phonetics.length > 0)
  )
}

// Wrapper functions to use imported utilities with component context
const handlePlayAudio = (audioUrl?: string) => {
  const url = audioUrl || word.value?.audioUrl
  const fallbackText = word.value?.word || ''
  playAudio(url, fallbackText)
}

const handlePlayTextToSpeech = (text: string) => {
  playTextToSpeech(text)
}

const handleGetPhoneticLabel = (
  phonetic: { audio?: string; text?: string },
  index: number,
): string => {
  return getPhoneticLabel(phonetic, index)
}

const goBack = () => {
  router.push('/')
}

const loadWordDetail = async () => {
  try {
    loading.value = true
    error.value = null

    const wordId = route.params.id as string
    if (!wordId) {
      error.value = 'Word ID is required'
      return
    }

    // Find word in store
    const foundWord = wordStore.words.find((w) => w.id === wordId)
    if (!foundWord) {
      error.value = 'Word not found'
      return
    }

    word.value = foundWord

    // Fetch additional word data from API
    try {
      const data = await fetchWordData(foundWord.word)
      if (data) {
        wordData.value = data
      }
    } catch (apiError) {
      console.warn('Failed to fetch additional word data:', apiError)
      // Continue with existing word data
    }
  } catch (err) {
    console.error('Error loading word detail:', err)
    error.value = 'Failed to load word details'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadWordDetail()
})
</script>

<style scoped>
/* Page Container */
.word-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #fff7ed 100%);
  padding: 1rem;
}

/* Loading & Error States */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(13, 148, 136, 0.2);
  border-top-color: #0d9488;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0d9488;
  margin: 0;
}

.error-icon {
  font-size: 4rem;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* Detail Container */
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Single Column Layout */
.single-column-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Unified Word Card */
.unified-word-card {
  background: white;
  border-radius: 12px;
  margin-top: 30px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(13, 148, 136, 0.1);
}

/* Unified Header Row */
.unified-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.word-info-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.word-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0d9488;
  margin: 0;
  line-height: 1.2;
}

/* Phonetic Inline */
.phonetic-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.phonetic-text {
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 0.9375rem;
  color: #64748b;
  font-weight: 500;
}

.audio-btn-inline {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #0d9488, #14b8a6);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.audio-btn-inline:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
}

.audio-btn-inline svg {
  width: 16px;
  height: 16px;
}

.phonetic-variant-inline {
  padding: 0.25rem 0.625rem;
  background: rgba(13, 148, 136, 0.08);
  border: 1px solid rgba(13, 148, 136, 0.15);
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #0d9488;
  cursor: pointer;
  transition: all 0.2s ease;
}

.phonetic-variant-inline:hover {
  background: rgba(13, 148, 136, 0.15);
  transform: translateY(-1px);
}

.variant-text {
  text-transform: uppercase;
}

/* POS Tags Inline */
.pos-tags-inline {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pos-badge-inline {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #64748b, #475569);
  border-radius: 6px;
  text-transform: lowercase;
}

/* Stats Group */
.stats-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.stat-compact {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  border: 2px solid;
  transition: all 0.2s ease;
}

.stat-compact:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-value-compact {
  font-size: 1.125rem;
  font-weight: 800;
  line-height: 1;
}

.stat-label-compact {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.9;
  letter-spacing: 0.05em;
}

.stat-divider {
  font-size: 1.25rem;
  color: #cbd5e1;
  font-weight: 300;
}

.mastery-stat.mastery-high {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
  color: #16a34a;
  border-color: rgba(34, 197, 94, 0.3);
}

.mastery-stat.mastery-medium {
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(251, 146, 60, 0.05));
  color: #ea580c;
  border-color: rgba(251, 146, 60, 0.3);
}

.mastery-stat.mastery-low {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
  color: #dc2626;
  border-color: rgba(239, 68, 68, 0.3);
}

.review-stat {
  background: linear-gradient(135deg, rgba(100, 116, 139, 0.1), rgba(100, 116, 139, 0.05));
  color: #475569;
  border-color: rgba(100, 116, 139, 0.25);
}

/* Section Divider */
.section-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(13, 148, 136, 0.2), transparent);
  margin: 1rem 0;
}

/* Section Label */
.section-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0d9488;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.section-icon-small {
  width: 16px;
  height: 16px;
  color: #0d9488;
  flex-shrink: 0;
}

/* Meanings Section Compact */
.meanings-section-compact {
  margin-bottom: 0.75rem;
}

.meanings-compact-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meaning-compact-item {
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  padding: 0.625rem 0.875rem;
  background: rgba(13, 148, 136, 0.04);
  border-radius: 8px;
  border-left: 3px solid #0d9488;
}

.meaning-pos-compact {
  flex-shrink: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #0d9488;
  text-transform: lowercase;
  min-width: 55px;
}

.meaning-text-compact {
  flex: 1;
  font-size: 0.875rem;
  color: #334155;
  line-height: 1.6;
}

/* Related Section Compact */
.related-section-compact {
  margin-top: 0.75rem;
}

.related-compact-content {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.related-inline-group {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
}

.related-type {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  min-width: 80px;
}

.related-tags-inline {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.related-tag-compact {
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #0d9488;
  background: rgba(13, 148, 136, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.related-tag-compact:hover {
  background: rgba(13, 148, 136, 0.2);
  transform: translateY(-1px);
}

.related-tag-compact.antonym {
  color: #dc2626;
  background: rgba(239, 68, 68, 0.1);
}

.related-tag-compact.antonym:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* Content Card */
.content-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(13, 148, 136, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(13, 148, 136, 0.1);
}

.card-icon {
  width: 20px;
  height: 20px;
  color: #0d9488;
  flex-shrink: 0;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* Word Forms Grid */
.word-forms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  background: rgba(13, 148, 136, 0.04);
  border-radius: 8px;
  border: 1px solid rgba(13, 148, 136, 0.1);
}

.form-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #0f172a;
}

/* Related Content */
.related-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.related-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.related-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.related-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.related-tag {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #0d9488;
  background: rgba(13, 148, 136, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.related-tag:hover {
  background: rgba(13, 148, 136, 0.2);
  transform: translateY(-1px);
}

.related-tag.antonym {
  color: #dc2626;
  background: rgba(239, 68, 68, 0.1);
}

.related-tag.antonym:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* Origin */
.origin-text {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
  margin: 0;
  font-style: italic;
  padding-left: 1rem;
  border-left: 3px solid #0d9488;
}

/* Meanings List */
.meanings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.meaning-item {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(13, 148, 136, 0.04);
  border-radius: 8px;
  border-left: 3px solid #0d9488;
}

.meaning-pos {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0d9488;
  text-transform: lowercase;
  min-width: 60px;
}

.meaning-text {
  flex: 1;
  font-size: 0.9375rem;
  color: #334155;
  line-height: 1.6;
}

/* Definitions */
.definitions-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.definition-block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.definition-block:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.definition-pos {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #0d9488, #14b8a6);
  border-radius: 6px;
  text-transform: lowercase;
  align-self: flex-start;
}

.definitions-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.definition-item {
  display: flex;
  gap: 0.625rem;
  align-items: flex-start;
}

.definition-number {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #0d9488, #14b8a6);
  border-radius: 50%;
}

.definition-text {
  flex: 1;
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
}

/* Examples */
.examples-list {
  margin-top: 0.5rem;
}

.examples-header {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #0d9488;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

.examples-header svg {
  width: 14px;
  height: 14px;
}

.example-item {
  padding: 0.625rem 0.875rem;
  background: rgba(13, 148, 136, 0.04);
  border-left: 3px solid #0d9488;
  border-radius: 6px;
  font-size: 0.8125rem;
  color: #475569;
  line-height: 1.5;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.example-item:last-child {
  margin-bottom: 0;
}

/* Related Section */
.related-section {
  margin-top: 0.75rem;
}

.related-header {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #0d9488;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

.related-header svg {
  width: 14px;
  height: 14px;
}

.related-more {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}

.antonym-tag {
  color: #dc2626;
  background: rgba(239, 68, 68, 0.1);
}

.antonym-tag:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* Header */
.detail-header {
  margin-bottom: 0.75rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #0d9488, #14b8a6);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  transform: translateX(-2px);
  box-shadow: 0 2px 8px rgba(13, 148, 136, 0.3);
}

.back-btn svg {
  width: 14px;
  height: 14px;
}

/* Unified Word Section */
.unified-word-section {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  padding-top: 3.5rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(13, 148, 136, 0.1);
}

/* Stats Corner */
.stats-corner {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

/* Header Row */
.unified-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

/* Word + Phonetic Row */
.word-phonetic-row {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.word-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0d9488;
  margin: 0;
  line-height: 1;
}

/* Inline Phonetic */
.phonetic-inline {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.phonetic-text {
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.audio-btn-inline {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #0d9488, #14b8a6);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.audio-btn-inline:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(13, 148, 136, 0.3);
}

.audio-btn-inline svg {
  width: 14px;
  height: 14px;
}

.phonetic-variant-inline {
  padding: 0.25rem 0.5rem;
  background: rgba(13, 148, 136, 0.08);
  border: 1px solid rgba(13, 148, 136, 0.15);
  border-radius: 6px;
  font-size: 0.625rem;
  font-weight: 600;
  color: #0d9488;
  cursor: pointer;
  transition: all 0.2s ease;
}

.phonetic-variant-inline:hover {
  background: rgba(13, 148, 136, 0.15);
  transform: translateY(-1px);
}

.variant-text {
  text-transform: uppercase;
}

/* POS Inline */
.pos-inline {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.pos-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: lowercase;
}

.pos-badge::after {
  content: '•';
  margin: 0 0.5rem;
  color: #cbd5e1;
}

.pos-badge:last-child::after {
  content: '';
  margin: 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 10px;
  border: 2px solid;
  min-height: 80px;
  transition: all 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.375rem;
}

.stat-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.9;
  letter-spacing: 0.05em;
}

.mastery-stat.mastery-high {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
  color: #16a34a;
  border-color: rgba(34, 197, 94, 0.3);
}

.mastery-stat.mastery-medium {
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(251, 146, 60, 0.05));
  color: #ea580c;
  border-color: rgba(251, 146, 60, 0.3);
}

.mastery-stat.mastery-low {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
  color: #dc2626;
  border-color: rgba(239, 68, 68, 0.3);
}

.review-stat {
  background: linear-gradient(135deg, rgba(100, 116, 139, 0.1), rgba(100, 116, 139, 0.05));
  color: #475569;
  border-color: rgba(100, 116, 139, 0.25);
}

/* Responsive */
@media (max-width: 768px) {
  .word-detail-page {
    padding: 0.75rem;
  }

  .unified-header-row {
    flex-direction: column;
    gap: 0.75rem;
  }

  .stats-group {
    align-self: flex-start;
  }

  .word-title {
    font-size: 1.75rem;
  }

  .content-card {
    padding: 1.25rem;
  }

  .related-inline-group {
    flex-direction: column;
    gap: 0.375rem;
  }

  .related-type {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .word-title {
    font-size: 1.5rem;
  }

  .unified-word-card,
  .content-card {
    padding: 1rem;
  }

  .stats-group {
    flex-wrap: wrap;
  }

  .stat-compact {
    padding: 0.375rem 0.625rem;
  }

  .stat-value-compact {
    font-size: 1rem;
  }

  .word-forms-grid {
    grid-template-columns: 1fr;
  }

  .phonetic-inline {
    flex-wrap: wrap;
  }
}
</style>
