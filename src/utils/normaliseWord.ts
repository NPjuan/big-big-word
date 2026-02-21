import type { Word, ChineseMeaning, EnglishMeaning, Etymology, WordRoot } from '@/types/word.types'

/**
 * Shared word normalisation utility.
 *
 * Both the store (when loading / migrating old data) and the import pipeline
 * need to ensure every Word object has all required fields with correct types.
 * This module provides a single source of truth for that logic.
 */

// ---------------------------------------------------------------------------
// Nested normalisers
// ---------------------------------------------------------------------------

export const normaliseChineseMeaning = (raw: any): ChineseMeaning => ({
  partOfSpeech: typeof raw.partOfSpeech === 'string' ? raw.partOfSpeech : '',
  definitions: Array.isArray(raw.definitions) ? raw.definitions : [],
  examples: Array.isArray(raw.examples) ? raw.examples : [],
})

export const normaliseEnglishMeaning = (raw: any): EnglishMeaning => ({
  partOfSpeech: typeof raw.partOfSpeech === 'string' ? raw.partOfSpeech : '',
  definitions: Array.isArray(raw.definitions) ? raw.definitions : [],
  examples: Array.isArray(raw.examples) ? raw.examples : [],
  synonyms: Array.isArray(raw.synonyms) ? raw.synonyms : [],
  antonyms: Array.isArray(raw.antonyms) ? raw.antonyms : [],
})

export const normaliseEtymology = (raw: any, now: string): Etymology => {
  if (!raw || typeof raw !== 'object') {
    return {
      roots: [],
      origin: '',
      evolution: '',
      relatedWords: [],
      mnemonic: '',
      generatedAt: now,
    }
  }
  return {
    roots: Array.isArray(raw.roots)
      ? raw.roots.map(
          (r: any): WordRoot => ({
            root: typeof r.root === 'string' ? r.root : '',
            meaning: typeof r.meaning === 'string' ? r.meaning : '',
            language: typeof r.language === 'string' ? r.language : '',
          }),
        )
      : [],
    origin: typeof raw.origin === 'string' ? raw.origin : '',
    evolution: typeof raw.evolution === 'string' ? raw.evolution : '',
    relatedWords: Array.isArray(raw.relatedWords) ? raw.relatedWords : [],
    mnemonic: typeof raw.mnemonic === 'string' ? raw.mnemonic : '',
    generatedAt: typeof raw.generatedAt === 'string' ? raw.generatedAt : now,
  }
}

export const normalisePartOfSpeech = (raw: any): string[] => {
  if (Array.isArray(raw)) return raw.filter((s: any) => typeof s === 'string')
  if (typeof raw === 'string' && raw.trim().length > 0) return [raw.trim()]
  return []
}

// ---------------------------------------------------------------------------
// Main normaliser
// ---------------------------------------------------------------------------

/**
 * Normalise any raw word-like object into a fully valid `Word`.
 *
 * This replaces both `ensureSRSFields` (wordStore) and `normaliseImportedWord`
 * (wordExport), ensuring the same logic is applied everywhere.
 *
 * - All missing fields are backfilled with sensible defaults.
 * - Nested arrays (chineseMeaning, englishMeaning, etymology) are deeply normalised.
 * - `partOfSpeech` is coerced from a plain string to `string[]` if needed.
 * - An `id` is generated if not present.
 */
export const normaliseWord = (raw: any): Word => {
  const now = new Date().toISOString()

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : crypto.randomUUID(),
    word: typeof raw.word === 'string' ? raw.word.trim().toLowerCase() : '',
    phonetic: raw.phonetic ?? '',
    audioUrl: raw.audioUrl ?? undefined,
    partOfSpeech: normalisePartOfSpeech(raw.partOfSpeech),
    chineseMeaning: Array.isArray(raw.chineseMeaning)
      ? raw.chineseMeaning.map(normaliseChineseMeaning)
      : [],
    englishMeaning: Array.isArray(raw.englishMeaning)
      ? raw.englishMeaning.map(normaliseEnglishMeaning)
      : [],
    etymology: normaliseEtymology(raw.etymology, now),
    createdAt: raw.createdAt ?? now,
    lastReviewed: raw.lastReviewed ?? undefined,
    reviewCount: typeof raw.reviewCount === 'number' ? raw.reviewCount : 0,
    mastery: typeof raw.mastery === 'number' ? raw.mastery : 0,
    // SRS fields
    nextReviewDate: raw.nextReviewDate ?? now,
    reviewInterval: typeof raw.reviewInterval === 'number' ? raw.reviewInterval : 0,
    easeFactor: typeof raw.easeFactor === 'number' ? raw.easeFactor : 2.5,
    consecutiveCorrect: typeof raw.consecutiveCorrect === 'number' ? raw.consecutiveCorrect : 0,
  }
}
