export interface Word {
  word: string
  phonetic: string
  partOfSpeech: string
  participle: string
  meaning: string
}

/**
 * 生成动词的分词形式
 */
export function generateParticipleForms(word: string, partOfSpeech: string): string {
  if (partOfSpeech !== 'verb') return ''

  const baseWord = word.toLowerCase()

  // 常见动词分词规则
  if (baseWord.endsWith('e')) {
    return `${baseWord}d/${baseWord.slice(0, -1)}ing`
  } else if (
    baseWord.endsWith('y') &&
    !['a', 'e', 'i', 'o', 'u'].includes(baseWord.charAt(baseWord.length - 2))
  ) {
    return `${baseWord.slice(0, -1)}ied/${baseWord}ing`
  } else if (baseWord.match(/[^aeiou][aeiou][^aeiou]$/)) {
    return `${baseWord}${baseWord.charAt(baseWord.length - 1)}ed/${baseWord}ing`
  } else {
    return `${baseWord}ed/${baseWord}ing`
  }
}

/**
 * 生成简单的音标（备选方案）
 */
export function generateSimplePhonetic(word: string): string {
  return `/${word.toLowerCase().replace(/[^a-z]/g, '')}/`
}

/**
 * 从Free Dictionary API获取单词详细信息
 */
export async function fetchWordDetails(word: string): Promise<Partial<Word>> {
  if (!word.trim()) return {}

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`,
    )

    if (response.ok) {
      const data = await response.json()

      if (data && data.length > 0) {
        const wordData = data[0]
        const result: Partial<Word> = {}

        // 获取音标
        if (wordData.phonetics && wordData.phonetics.length > 0) {
          const phonetic = wordData.phonetics.find((p: any) => p.text)?.text
          result.phonetic = phonetic || generateSimplePhonetic(word)
        } else {
          result.phonetic = generateSimplePhonetic(word)
        }

        // 获取词性和英文意思
        if (wordData.meanings && wordData.meanings.length > 0) {
          const firstMeaning = wordData.meanings[0]
          result.partOfSpeech = firstMeaning.partOfSpeech || ''

          if (firstMeaning.definitions && firstMeaning.definitions.length > 0) {
            const firstDefinition = firstMeaning.definitions[0]
            result.meaning = firstDefinition.definition || word
          } else {
            result.meaning = word
          }
        } else {
          result.partOfSpeech = ''
          result.meaning = word
        }

        // 获取分词形式
        result.participle = generateParticipleForms(word, result.partOfSpeech || '')

        return result
      }
    }
  } catch (error) {
    console.error('获取单词信息失败:', error)
  }

  // API调用失败时的备选方案
  return {}
}

/**
 * 播放单词发音
 */
export function playWord(word: string, playingWords: Set<string>): void {
  if (!word || playingWords.has(word)) return

  // 检查SpeechSynthesis API是否可用
  if (typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined') {
    console.warn('SpeechSynthesis API is not supported in this browser')
    return
  }

  playingWords.add(word)

  const utterance = new SpeechSynthesisUtterance(word)
  utterance.lang = 'en-US'
  utterance.rate = 0.8
  utterance.pitch = 1

  speechSynthesis.cancel()

  utterance.onend = () => {
    playingWords.delete(word)
  }

  utterance.onerror = () => {
    playingWords.delete(word)
  }

  speechSynthesis.speak(utterance)
}
