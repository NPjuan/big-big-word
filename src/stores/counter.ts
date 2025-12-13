import { defineStore } from 'pinia'

export interface Word {
  id: string
  word: string
  phonetic: string
  wordForms: string
  verbMeaning: string
  nounMeaning: string
  cambridgeLink: string
  createdAt: Date
}

export const useWordStore = defineStore('word', {
  state: () => ({
    words: [] as Word[],
  }),

  actions: {
    addWord(word: Omit<Word, 'id' | 'createdAt'>) {
      const newWord: Word = {
        ...word,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      }
      this.words.push(newWord)
    },

    removeWord(id: string) {
      this.words = this.words.filter((word) => word.id !== id)
    },

    updateWord(id: string, updatedWord: Partial<Word>) {
      const index = this.words.findIndex((word) => word.id === id)
      if (index !== -1) {
        this.words[index] = { ...this.words[index], ...updatedWord }
      }
    },
  },

  getters: {
    sortedWords: (state) => {
      return [...state.words].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    },
  },
})
