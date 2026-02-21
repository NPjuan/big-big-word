import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Word } from '@/types/word.types'
import { fetchWordData, generateChineseMeanings } from '@/services/dictionaryApi'
import { defaultWords } from '@/data/defaultWords'

export const useWordStore = defineStore('word', () => {
  // State
  const words = ref<Word[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

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

  // --- SRS helpers ---

  // Ensure a word has all SRS fields (backward compat for old data)
  const ensureSRSFields = (w: any): Word => {
    const now = new Date().toISOString()
    return {
      ...w,
      nextReviewDate: w.nextReviewDate ?? now,
      reviewInterval: w.reviewInterval ?? 0,
      easeFactor: w.easeFactor ?? 2.5,
      consecutiveCorrect: w.consecutiveCorrect ?? 0,
    }
  }

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
        words.value.push(ensureSRSFields(newWord))
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
            words.value[idx] = ensureSRSFields({ ...incoming_word, id: existing.id })
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
      const stored = localStorage.getItem('big-big-words')
      if (stored) {
        // Migrate old data that lacks SRS fields
        words.value = (JSON.parse(stored) as any[]).map(ensureSRSFields)
      } else {
        // Load default words if no saved words exist
        words.value = defaultWords.map(ensureSRSFields)
        saveWords() // Save default words to localStorage
      }
    } catch (err) {
      console.error('Failed to load words:', err)
      error.value = 'Failed to load saved words'
    }
  }

  const saveWords = () => {
    try {
      localStorage.setItem('big-big-words', JSON.stringify(words.value))
    } catch (err) {
      console.error('Failed to save words:', err)
      error.value = 'Failed to save words'
    }
  }

  const addWord = async (wordText: string) => {
    // Check if word already exists
    if (words.value.some((w) => w.word === wordText.toLowerCase())) {
      throw new Error('Word already exists')
    }

    isLoading.value = true
    error.value = null

    try {
      // Fetch word data from dictionary API
      const wordData = await fetchWordData(wordText)

      if (!wordData) {
        throw new Error('Word not found in dictionary')
      }

      // Generate Chinese meanings (placeholder for now)
      const chineseMeanings = await generateChineseMeanings(wordData.englishMeanings)

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

      // Add to store
      words.value.unshift(newWord)
      saveWords()

      return newWord
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add word'
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

  // Initialize
  loadWords()

  return {
    words,
    isLoading,
    error,
    wordCount,
    masteredWords,
    recentWords,
    wordsByReviewPriority,
    addWord,
    deleteWord,
    updateWord,
    incrementReview,
    updateMasteryRight,
    updateMasteryLeft,
    importWords,
    loadWords,
    saveWords,
  }
})
