/**
 * Dictionary API Service for Chrome Extension
 * Adapted from src/services/dictionaryApi.ts
 */

const DictionaryAPI = {
  /**
   * Fetch word data from Free Dictionary API
   * @param {string} word - The word to look up
   * @returns {Promise<Object|null>} Word data or null if not found
   */
  fetchWordData: async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`,
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Word "${word}" not found in dictionary`)
        }
        throw new Error(`Dictionary API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data || data.length === 0) {
        return null
      }

      const firstEntry = data[0]
      if (!firstEntry) {
        return null
      }

      // Extract phonetic (prefer the one with audio)
      let phonetic = firstEntry.phonetic || ''
      let audioUrl = undefined

      if (firstEntry.phonetics && firstEntry.phonetics.length > 0) {
        // Try to find phonetic with audio
        const phoneticWithAudio = firstEntry.phonetics.find((p) => p.audio && p.audio.length > 0)
        if (phoneticWithAudio) {
          phonetic = phoneticWithAudio.text || phonetic
          audioUrl = phoneticWithAudio.audio
        } else {
          // Use first available phonetic text
          const firstPhonetic = firstEntry.phonetics.find((p) => p.text)
          if (firstPhonetic) {
            phonetic = firstPhonetic.text || phonetic
          }
        }
      }

      // Extract parts of speech
      const partOfSpeech = Array.from(new Set(firstEntry.meanings.map((m) => m.partOfSpeech)))

      // Extract English meanings
      const englishMeanings = firstEntry.meanings.map((meaning) => ({
        partOfSpeech: meaning.partOfSpeech,
        definitions: meaning.definitions.map((def) => def.definition),
        examples: meaning.definitions.filter((def) => def.example).map((def) => def.example),
        synonyms: meaning.synonyms || [],
        antonyms: meaning.antonyms || [],
      }))

      return {
        word: firstEntry.word,
        phonetic,
        audioUrl,
        partOfSpeech,
        englishMeanings,
        origin: firstEntry.origin || '',
      }
    } catch (error) {
      console.error('Dictionary API error:', error)
      throw error
    }
  },

  /**
   * Translate text to Chinese using LibreTranslate API
   * @param {string} text - Text to translate
   * @returns {Promise<string>} Translated text
   */
  translateToChinese: async (text) => {
    try {
      // Use LibreTranslate API (free, no API key required)
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: 'zh',
          format: 'text',
        }),
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const data = await response.json()
      return data.translatedText || text
    } catch (error) {
      console.error('Translation error:', error)
      // Fallback: return original text
      return text
    }
  },

  /**
   * Generate Chinese meanings from English meanings
   * @param {Array} englishMeanings - English meanings array
   * @returns {Promise<Array>} Chinese meanings array
   */
  generateChineseMeanings: async (englishMeanings) => {
    const chineseMeanings = []

    for (const meaning of englishMeanings.slice(0, 2)) {
      const translatedDefinitions = []

      // Translate definitions
      for (const def of meaning.definitions.slice(0, 3)) {
        const translated = await DictionaryAPI.translateToChinese(def)
        translatedDefinitions.push(translated)
      }

      chineseMeanings.push({
        partOfSpeech: meaning.partOfSpeech,
        definitions: translatedDefinitions,
      })
    }

    return chineseMeanings
  },
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DictionaryAPI
}
