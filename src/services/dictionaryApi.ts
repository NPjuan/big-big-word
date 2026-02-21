/**
 * Dictionary API Service
 * Uses Free Dictionary API to fetch word definitions, phonetics, and pronunciations
 * API Documentation: https://dictionaryapi.dev/
 */

export interface DictionaryApiResponse {
  word: string
  phonetic?: string
  phonetics: Phonetic[]
  meanings: Meaning[]
  origin?: string
}

export interface Phonetic {
  text?: string
  audio?: string
}

export interface Meaning {
  partOfSpeech: string
  definitions: Definition[]
  synonyms?: string[]
  antonyms?: string[]
}

export interface Definition {
  definition: string
  example?: string
  synonyms?: string[]
  antonyms?: string[]
}

export interface WordData {
  word: string
  phonetic: string
  audioUrl?: string
  partOfSpeech: string[]
  englishMeanings: {
    partOfSpeech: string
    definitions: string[]
    examples: string[]
    synonyms: string[]
    antonyms: string[]
  }[]
  origin?: string
  wordForms?: {
    pastTense?: string
    pastParticiple?: string
    presentParticiple?: string
    thirdPersonSingular?: string
    plural?: string
    singular?: string
    comparative?: string
    superlative?: string
    noun?: string
    verb?: string
    adjective?: string
    adverb?: string
  }
}

/**
 * Fetch word data from Free Dictionary API
 * @param word - The word to look up
 * @returns Promise with word data or null if not found
 */
export const fetchWordData = async (word: string): Promise<WordData | null> => {
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

    const data: DictionaryApiResponse[] = await response.json()

    if (!data || data.length === 0) {
      return null
    }

    const firstEntry = data[0]
    if (!firstEntry) {
      return null
    }

    // Extract phonetic (prefer the one with audio)
    let phonetic = firstEntry.phonetic || ''
    let audioUrl: string | undefined

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

    // Extract meanings grouped by part of speech
    const englishMeanings = firstEntry.meanings.map((meaning) => {
      const definitions: string[] = []
      const examples: string[] = []
      const synonyms: string[] = []
      const antonyms: string[] = []

      meaning.definitions.forEach((def) => {
        definitions.push(def.definition)
        if (def.example) {
          examples.push(def.example)
        }
        if (def.synonyms) {
          synonyms.push(...def.synonyms)
        }
        if (def.antonyms) {
          antonyms.push(...def.antonyms)
        }
      })

      // Add meaning-level synonyms and antonyms
      if (meaning.synonyms) {
        synonyms.push(...meaning.synonyms)
      }
      if (meaning.antonyms) {
        antonyms.push(...meaning.antonyms)
      }

      return {
        partOfSpeech: meaning.partOfSpeech,
        definitions: [...new Set(definitions)], // Remove duplicates
        examples: [...new Set(examples)],
        synonyms: [...new Set(synonyms)],
        antonyms: [...new Set(antonyms)],
      }
    })

    // Fetch word forms
    let wordForms: WordData['wordForms'] | undefined
    try {
      const { fetchWordForms } = await import('./wordFormsApi')
      wordForms = await fetchWordForms(firstEntry.word)
    } catch (error) {
      console.warn('Failed to fetch word forms:', error)
    }

    return {
      word: firstEntry.word,
      phonetic,
      audioUrl,
      partOfSpeech,
      englishMeanings,
      origin: firstEntry.origin,
      wordForms,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch word data')
  }
}

/**
 * Translate English text to Chinese using MyMemory Translation API
 * API Documentation: https://mymemory.translated.net/doc/spec.php
 * Free tier: 1000 words/day, no API key required
 */
export const translateToChineseSimple = async (text: string): Promise<string> => {
  try {
    // Limit text length to avoid API issues
    const textToTranslate = text.length > 500 ? text.substring(0, 500) : text

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|zh-CN`,
    )

    if (!response.ok) {
      console.warn('Translation API error:', response.status)
      return text // Return original text if translation fails
    }

    const data = await response.json()

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText
    }

    return text // Return original text if no translation available
  } catch (error) {
    console.error('Translation error:', error)
    return text // Return original text on error
  }
}

/**
 * Internal separator used to pack / unpack multiple texts in a single API call.
 * Chosen because it is extremely unlikely to appear inside dictionary definitions.
 */
const BATCH_SEPARATOR = ' ||| '

/**
 * Translate multiple texts in as few HTTP requests as possible.
 *
 * Strategy: concatenate all non-empty texts using `BATCH_SEPARATOR`, send them
 * as one request (up to ~480 chars to stay within the 500-char API limit), then
 * split the translated result back.  If a single text already exceeds the budget
 * it is sent individually.
 *
 * This dramatically reduces the number of requests (and therefore total latency)
 * compared with the old one-request-per-text approach.
 */
const translateBatch = async (texts: string[], delayMs = 200): Promise<string[]> => {
  // Pre-filter: keep track of which indices need translation
  const results: string[] = new Array(texts.length).fill('')
  const nonEmpty: { index: number; text: string }[] = []

  for (let i = 0; i < texts.length; i++) {
    if (texts[i] && texts[i].trim().length > 0) {
      nonEmpty.push({ index: i, text: texts[i] })
    }
  }

  if (nonEmpty.length === 0) return results

  // Build batches that fit within ~480 characters each
  const MAX_CHARS = 480
  const batches: { indices: number[]; combined: string }[] = []
  let currentTexts: string[] = []
  let currentIndices: number[] = []
  let currentLength = 0

  for (const { index, text } of nonEmpty) {
    const addition = currentTexts.length > 0 ? BATCH_SEPARATOR.length + text.length : text.length
    if (currentLength + addition > MAX_CHARS && currentTexts.length > 0) {
      // Flush current batch
      batches.push({ indices: [...currentIndices], combined: currentTexts.join(BATCH_SEPARATOR) })
      currentTexts = []
      currentIndices = []
      currentLength = 0
    }
    currentTexts.push(text)
    currentIndices.push(index)
    currentLength += currentTexts.length === 1 ? text.length : BATCH_SEPARATOR.length + text.length
  }
  // Flush remaining
  if (currentTexts.length > 0) {
    batches.push({ indices: [...currentIndices], combined: currentTexts.join(BATCH_SEPARATOR) })
  }

  // Execute batches with concurrency limit of 2 to stay polite to the API
  const CONCURRENCY = 2
  for (let i = 0; i < batches.length; i += CONCURRENCY) {
    const chunk = batches.slice(i, i + CONCURRENCY)
    const translationPromises = chunk.map((batch) => translateToChineseSimple(batch.combined))
    const translatedChunk = await Promise.all(translationPromises)

    for (let j = 0; j < chunk.length; j++) {
      const batch = chunk[j]
      const translated = translatedChunk[j]
      // Split the translated string back
      const parts = translated.split(/\s*\|\|\|\s*/)

      for (let k = 0; k < batch.indices.length; k++) {
        results[batch.indices[k]] = (parts[k] ?? '').trim()
      }
    }

    // Small delay between concurrent groups to avoid rate limits
    if (i + CONCURRENCY < batches.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  return results
}

/**
 * Generate Chinese meanings from English meanings
 * Uses MyMemory Translation API to translate definitions and examples
 */
export const generateChineseMeanings = async (
  englishMeanings: WordData['englishMeanings'],
  onProgress?: (step: string) => void,
): Promise<
  {
    partOfSpeech: string
    definitions: string[]
    examples: string[]
  }[]
> => {
  try {
    const chineseMeanings = []
    const total = englishMeanings.length

    for (let i = 0; i < total; i++) {
      const meaning = englishMeanings[i]

      // Notify progress for each part of speech
      if (onProgress) {
        onProgress(`🀄 Translating ${meaning.partOfSpeech} (${i + 1}/${total})...`)
      }

      // Collect all texts to translate
      const definitionsToTranslate = meaning.definitions.slice(0, 3) // Limit to 3 definitions
      const examplesToTranslate = meaning.examples.slice(0, 2) // Limit to 2 examples

      // Translate definitions
      const translatedDefinitions = await translateBatch(definitionsToTranslate)

      // Translate examples
      const translatedExamples = await translateBatch(examplesToTranslate)

      chineseMeanings.push({
        partOfSpeech: meaning.partOfSpeech,
        definitions: translatedDefinitions.filter((d) => d.length > 0),
        examples: translatedExamples.filter((e) => e.length > 0),
      })
    }

    return chineseMeanings
  } catch (error) {
    console.error('Failed to generate Chinese meanings:', error)
    // Return placeholder on error
    return englishMeanings.map((meaning) => ({
      partOfSpeech: meaning.partOfSpeech,
      definitions: meaning.definitions.slice(0, 3).map((def) => `[翻译失败: ${def}]`),
      examples: meaning.examples.slice(0, 2).map((ex) => `[翻译失败: ${ex}]`),
    }))
  }
}
