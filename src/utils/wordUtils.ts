export interface Word {
  word: string
  phonetic: string
  partOfSpeech: string[]
  participle: string
  meaning: string
  createdAt: string
}

/**
 * 生成动词的分词形式
 */
export function generateParticipleForms(word: string, partOfSpeech: string[]): string {
  if (!partOfSpeech.includes('verb')) return ''

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
export async function fetchWordDetails(word: string): Promise<Partial<Word> | null> {
  if (!word.trim()) return null

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
        result.phonetic = wordData.phonetics?.find((p: any) => p.text).text
        // 获取词性和英文意思
        if (wordData.meanings && wordData.meanings.length > 0) {
          // 收集所有词性
          const partOfSpeechSet = new Set<string>()
          let meaning = word

          wordData.meanings.forEach((meaningData: any) => {
            if (meaningData.partOfSpeech) {
              partOfSpeechSet.add(meaningData.partOfSpeech)
            }
            // 使用第一个有定义的释义
            if (meaningData.definitions && meaningData.definitions.length > 0 && meaning === word) {
              meaning = meaningData.definitions[0].definition || word
            }
          })

          result.partOfSpeech = Array.from(partOfSpeechSet)
          result.meaning = meaning
        } else {
          result.partOfSpeech = []
          result.meaning = word
        }

        // 获取分词形式(TODO)
        result.participle = ''

        // 添加当前时间戳
        result.createdAt = new Date().toISOString()

        return result
      }
    } else {
      console.error('获取单词信息失败:', response.statusText)
    }
  } catch (error) {
    console.error('获取单词信息失败:', error)
  }

  // API调用失败时的备选方案
  return null
}

/**
 * 播放单词发音
 */
export function playWord(word: string): void {
  if (!word) return

  // 检查SpeechSynthesis API是否可用
  if (typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined') {
    console.warn('SpeechSynthesis API is not supported in this browser')
    return
  }

  const utterance = new SpeechSynthesisUtterance(word)
  utterance.lang = 'en-US'
  utterance.rate = 0.8
  utterance.pitch = 1

  speechSynthesis.cancel()

  speechSynthesis.speak(utterance)
}

/**
 * 保存单词到localStorage
 */
export function saveWordsToStorage(words: Word[]): void {
  try {
    localStorage.setItem('wordGallery', JSON.stringify(words))
  } catch (error) {
    console.error('保存单词到localStorage失败:', error)
  }
}

/**
 * 从localStorage加载单词
 */
export function loadWordsFromStorage(): Word[] {
  try {
    const stored = localStorage.getItem('wordGallery')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('从localStorage加载单词失败:', error)
  }
  return []
}

/**
 * 删除单词并更新localStorage
 */
export function deleteWordFromStorage(words: Word[], wordToDelete: Word): Word[] {
  const updatedWords = words.filter((word) => word.word !== wordToDelete.word)
  saveWordsToStorage(updatedWords)
  return updatedWords
}
