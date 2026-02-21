import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Word } from '@/types/word.types'
import { fetchWordData, generateChineseMeanings } from '@/services/dictionaryApi'
import { defaultWords } from '@/data/defaultWords'
import { normaliseWord } from '@/utils/normaliseWord'

// Storage constants
const STORAGE_KEY = 'big-big-words'
const SCHEMA_VERSION_KEY = 'big-big-words-schema-version'
const CURRENT_SCHEMA_VERSION = 1

export const useWordStore = defineStore('word', () => {
  // State
  const words = ref<Word[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const loadingStep = ref<string>('') // Progress step hint for UI

  // Computed
  const wordCount = computed(() => words.value.length)

  const masteredWords = computed(() => words.value.filter((w) => w.mastery >= 80))

  const recentWords = computed(() =>
    [...words.value]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10),
  )

  // Words sorted by review priority: due now > overdue > not yet due
  // Within each group: lower mastery first, then harder words first
  const wordsByReviewPriority = computed(() => {
    const now = Date.now()
    return [...words.value].sort((a, b) => {
      const aNextTime = new Date(a.nextReviewDate).getTime()
      const bNextTime = new Date(b.nextReviewDate).getTime()
      const aDue = aNextTime <= now // is this word due for review?
      const bDue = bNextTime <= now

      // Due words come before not-yet-due words
      if (aDue !== bDue) return aDue ? -1 : 1

      if (aDue && bDue) {
        // Both due: most overdue first
        const aOverdue = now - aNextTime
        const bOverdue = now - bNextTime
        if (aOverdue !== bOverdue) return bOverdue - aOverdue
      } else {
        // Both not yet due: soonest due first
        if (aNextTime !== bNextTime) return aNextTime - bNextTime
      }

      // Lower mastery first
      if (a.mastery !== b.mastery) return a.mastery - b.mastery
      // Harder words first (lower easeFactor)
      return a.easeFactor - b.easeFactor
    })
  })

  // Words that are currently due for review
  const dueWords = computed(() => {
    const now = Date.now()
    return words.value.filter((w) => new Date(w.nextReviewDate).getTime() <= now)
  })

  const dueWordsCount = computed(() => dueWords.value.length)

  // --- SRS helpers ---

  // SM-2 algorithm: calculate next review interval and ease factor
  // quality: 0-5, where 0=total blackout, 5=perfect recall
  const calculateSM2 = (
    currentInterval: number,
    currentEF: number,
    quality: number,
  ): { interval: number; easeFactor: number } => {
    // Update ease factor
    const newEF = Math.max(1.3, currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))

    let newInterval: number
    if (quality < 3) {
      // Failed — reset to short interval
      newInterval = 1
    } else if (currentInterval === 0) {
      newInterval = 1 // new word → review in 1 day
    } else if (currentInterval === 1) {
      newInterval = 3
    } else {
      newInterval = Math.round(currentInterval * newEF)
    }

    return { interval: newInterval, easeFactor: newEF }
  }

  // Actions

  /**
   * Import words and merge with existing collection.
   * Conflict resolution: match by `word` (case-insensitive). If a word already
   * exists, keep whichever version was modified more recently (compare
   * lastReviewed → createdAt as fallback).
   * Returns { added, updated, skipped } counts.
   */
  const importWords = (incoming: Word[]): { added: number; updated: number; skipped: number } => {
    let added = 0
    let updated = 0
    let skipped = 0

    // Build a lookup map of existing words by normalised word text
    const existingMap = new Map<string, Word>()
    for (const w of words.value) {
      existingMap.set(w.word.toLowerCase(), w)
    }

    const getLatestTimestamp = (w: Word): number => {
      const reviewed = w.lastReviewed ? new Date(w.lastReviewed).getTime() : 0
      const created = new Date(w.createdAt).getTime()
      return Math.max(reviewed, created)
    }

    for (const incoming_word of incoming) {
      const key = incoming_word.word.toLowerCase()
      const existing = existingMap.get(key)

      if (!existing) {
        // New word — assign a fresh ID and add
        const newWord = { ...incoming_word, id: crypto.randomUUID() }
        words.value.push(normaliseWord(newWord))
        existingMap.set(key, newWord)
        added++
      } else {
        // Conflict — keep the newer version
        const existingTime = getLatestTimestamp(existing)
        const incomingTime = getLatestTimestamp(incoming_word)

        if (incomingTime > existingTime) {
          // Incoming is newer — update existing in-place, preserve the original ID
          const idx = words.value.findIndex((w) => w.id === existing.id)
          if (idx !== -1) {
            words.value[idx] = normaliseWord({ ...incoming_word, id: existing.id })
            updated++
          } else {
            skipped++
          }
        } else {
          // Existing is same or newer — skip
          skipped++
        }
      }
    }

    saveWords()
    return { added, updated, skipped }
  }

  const loadWords = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const storedVersion = Number(localStorage.getItem(SCHEMA_VERSION_KEY) || '0')

      if (stored) {
        let parsed = JSON.parse(stored) as any[]

        // Run migrations when schema version is outdated
        if (storedVersion < CURRENT_SCHEMA_VERSION) {
          console.info(
            `[wordStore] Migrating data from schema v${storedVersion} → v${CURRENT_SCHEMA_VERSION}`,
          )
          parsed = parsed.map(normaliseWord)
        }

        words.value = parsed.map(normaliseWord)
        // Persist the latest schema version
        localStorage.setItem(SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION))
      } else {
        // Load default words if no saved words exist
        words.value = defaultWords.map(normaliseWord)
        saveWords() // Save default words to localStorage
      }
    } catch (err) {
      console.error('Failed to load words:', err)
      error.value = 'Failed to load saved words'
    }
  }

  // Debounced save — coalesce rapid mutations into a single write
  let saveTimer: ReturnType<typeof setTimeout> | null = null

  const saveWords = () => {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      try {
        const data = JSON.stringify(words.value)
        localStorage.setItem(STORAGE_KEY, data)
        localStorage.setItem(SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION))
      } catch (err: any) {
        // Detect quota exceeded
        if (err?.name === 'QuotaExceededError' || err?.code === 22) {
          console.error(
            '[wordStore] localStorage quota exceeded! Please export and backup your data.',
          )
          error.value = 'Storage is full. Please export your words to free up space.'
        } else {
          console.error('Failed to save words:', err)
          error.value = 'Failed to save words'
        }
      }
    }, 300)
  }

  /** Force an immediate synchronous save (used before page unload, etc.) */
  const saveWordsImmediate = () => {
    if (saveTimer) {
      clearTimeout(saveTimer)
      saveTimer = null
    }
    try {
      const data = JSON.stringify(words.value)
      localStorage.setItem(STORAGE_KEY, data)
      localStorage.setItem(SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION))
    } catch (err: any) {
      if (err?.name === 'QuotaExceededError' || err?.code === 22) {
        console.error('[wordStore] localStorage quota exceeded!')
        error.value = 'Storage is full. Please export your words to free up space.'
      } else {
        console.error('Failed to save words:', err)
        error.value = 'Failed to save words'
      }
    }
  }

  const addWord = async (wordText: string) => {
    // Check if word already exists
    if (words.value.some((w) => w.word === wordText.toLowerCase())) {
      throw new Error('Word already exists')
    }

    isLoading.value = true
    loadingStep.value = ''
    error.value = null

    try {
      // Step 1: Fetch word data from dictionary API
      loadingStep.value = '🔍 Looking up dictionary...'
      const wordData = await fetchWordData(wordText)

      if (!wordData) {
        throw new Error('Word not found in dictionary')
      }

      // Step 2: Show what we found so far
      loadingStep.value = `📖 Found "${wordData.word}" — ${wordData.partOfSpeech.join(', ')}${wordData.phonetic ? '  ' + wordData.phonetic : ''}`
      // Small pause to let user see the intermediate result
      await new Promise((resolve) => setTimeout(resolve, 400))

      // Step 3: Generate Chinese meanings
      loadingStep.value = '🀄 Translating to Chinese...'
      const chineseMeanings = await generateChineseMeanings(
        wordData.englishMeanings,
        (progress: string) => {
          loadingStep.value = progress
        },
      )

      // Create word object with API data
      const now = new Date()
      const newWord: Word = {
        id: crypto.randomUUID(),
        word: wordData.word.toLowerCase(),
        phonetic: wordData.phonetic || '',
        audioUrl: wordData.audioUrl,
        partOfSpeech: wordData.partOfSpeech,
        chineseMeaning: chineseMeanings,
        englishMeaning: wordData.englishMeanings,
        etymology: {
          roots: [],
          origin: wordData.origin || '',
          evolution: '',
          relatedWords: [],
          mnemonic: '',
          generatedAt: now.toISOString(),
        },
        createdAt: now.toISOString(),
        reviewCount: 0,
        mastery: 0,
        // SRS fields — immediately available for review
        nextReviewDate: now.toISOString(),
        reviewInterval: 0,
        easeFactor: 2.5,
        consecutiveCorrect: 0,
      }

      // Step 4: Almost done
      loadingStep.value = '✨ Saving word...'

      // Add to store
      words.value.unshift(newWord)
      saveWords()

      loadingStep.value = ''
      return newWord
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add word'
      loadingStep.value = ''
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteWord = (id: string) => {
    words.value = words.value.filter((w) => w.id !== id)
    saveWords()
  }

  const updateWord = (id: string, updates: Partial<Word>) => {
    const word = words.value.find((w) => w.id === id)
    if (word) {
      Object.assign(word, updates)
      saveWords()
    }
  }

  const incrementReview = (id: string) => {
    const word = words.value.find((w) => w.id === id)
    if (word) {
      word.reviewCount++
      word.lastReviewed = new Date().toISOString()
      // Simple mastery calculation
      word.mastery = Math.min(100, word.mastery + 5)
      saveWords()
    }
  }

  // Update mastery when swiping right (mastered) — quality = 5 (perfect recall)
  const updateMasteryRight = (id: string) => {
    const word = words.value.find((w) => w.id === id)
    if (word) {
      const now = new Date()
      word.reviewCount++
      word.lastReviewed = now.toISOString()
      word.mastery = Math.min(100, word.mastery + 10)
      word.consecutiveCorrect++

      const { interval, easeFactor } = calculateSM2(word.reviewInterval, word.easeFactor, 5)
      word.reviewInterval = interval
      word.easeFactor = easeFactor
      const nextDate = new Date(now)
      nextDate.setDate(nextDate.getDate() + interval)
      word.nextReviewDate = nextDate.toISOString()

      saveWords()
    }
  }

  // Update mastery when swiping left (not mastered yet) — quality = 2 (incorrect / hesitant)
  const updateMasteryLeft = (id: string) => {
    const word = words.value.find((w) => w.id === id)
    if (word) {
      const now = new Date()
      word.reviewCount++
      word.lastReviewed = now.toISOString()
      word.mastery = Math.max(0, word.mastery - 5)
      word.consecutiveCorrect = 0

      const { interval, easeFactor } = calculateSM2(word.reviewInterval, word.easeFactor, 2)
      word.reviewInterval = interval
      word.easeFactor = easeFactor
      const nextDate = new Date(now)
      nextDate.setDate(nextDate.getDate() + interval)
      word.nextReviewDate = nextDate.toISOString()

      saveWords()
    }
  }

  // Generic review with quality score (0-5) for quiz modes
  // 0 = total blackout, 1 = wrong, 2 = wrong but recognised, 3 = correct with difficulty, 4 = correct, 5 = perfect
  const reviewWithQuality = (id: string, quality: number) => {
    const word = words.value.find((w) => w.id === id)
    if (!word) return

    const now = new Date()
    word.reviewCount++
    word.lastReviewed = now.toISOString()

    // Update mastery based on quality
    if (quality >= 4) {
      word.mastery = Math.min(100, word.mastery + 10)
      word.consecutiveCorrect++
    } else if (quality === 3) {
      word.mastery = Math.min(100, word.mastery + 5)
      word.consecutiveCorrect++
    } else {
      word.mastery = Math.max(0, word.mastery - 5)
      word.consecutiveCorrect = 0
    }

    const { interval, easeFactor } = calculateSM2(word.reviewInterval, word.easeFactor, quality)
    word.reviewInterval = interval
    word.easeFactor = easeFactor
    const nextDate = new Date(now)
    nextDate.setDate(nextDate.getDate() + interval)
    word.nextReviewDate = nextDate.toISOString()

    saveWords()
  }

  // Initialize
  loadWords()

  return {
    words,
    isLoading,
    loadingStep,
    error,
    wordCount,
    masteredWords,
    recentWords,
    wordsByReviewPriority,
    dueWords,
    dueWordsCount,
    addWord,
    deleteWord,
    updateWord,
    incrementReview,
    updateMasteryRight,
    updateMasteryLeft,
    reviewWithQuality,
    importWords,
    loadWords,
    saveWords,
    saveWordsImmediate,
  }
})
