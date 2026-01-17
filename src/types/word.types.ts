export interface Word {
  id: string
  word: string
  phonetic: string
  audioUrl?: string
  partOfSpeech: string[]
  chineseMeaning: ChineseMeaning[]
  englishMeaning: EnglishMeaning[]
  etymology: Etymology
  createdAt: string
  lastReviewed?: string
  reviewCount: number
  mastery: number // 0-100
}

export interface ChineseMeaning {
  partOfSpeech: string
  definitions: string[]
  examples: string[]
}

export interface EnglishMeaning {
  partOfSpeech: string
  definitions: string[]
  examples: string[]
  synonyms: string[]
  antonyms: string[]
}

export interface Etymology {
  roots: WordRoot[]
  origin: string
  evolution: string
  relatedWords: string[]
  mnemonic: string
  generatedAt: string
}

export interface WordRoot {
  root: string
  meaning: string
  language: string
}

export interface WordForms {
  // Verb forms
  pastTense?: string // 过去式
  pastParticiple?: string // 过去分词
  presentParticiple?: string // 现在分词
  thirdPersonSingular?: string // 第三人称单数

  // Noun forms
  plural?: string // 复数
  singular?: string // 单数

  // Adjective/Adverb forms
  comparative?: string // 比较级
  superlative?: string // 最高级

  // Related forms
  noun?: string // 名词形式
  verb?: string // 动词形式
  adjective?: string // 形容词形式
  adverb?: string // 副词形式
}
