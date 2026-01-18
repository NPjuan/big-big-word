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

  // Actions
  const loadWords = () => {
    try {
      const stored = localStorage.getItem('big-big-words')
      if (stored) {
        words.value = JSON.parse(stored)
      } else {
        // Load default words if no saved words exist
        words.value = [...defaultWords]
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
          generatedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        reviewCount: 0,
        mastery: 0,
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

  // Initialize
  loadWords()

  return {
    words,
    isLoading,
    error,
    wordCount,
    masteredWords,
    recentWords,
    addWord,
    deleteWord,
    updateWord,
    incrementReview,
    loadWords,
    saveWords,
  }
})
