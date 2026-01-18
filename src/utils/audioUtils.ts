/**
 * Audio Utilities for Word Pronunciation
 * Provides audio playback with intelligent fallback to Text-to-Speech
 */

/**
 * Play audio from URL with automatic fallback to TTS
 * @param audioUrl - The URL of the audio file to play
 * @param fallbackText - Text to speak if audio fails (optional)
 * @returns Promise that resolves when audio starts playing
 */
export const playAudio = async (audioUrl?: string, fallbackText?: string): Promise<void> => {
  if (!audioUrl) {
    // No audio URL provided, use TTS if fallback text is available
    if (fallbackText) {
      return playTextToSpeech(fallbackText)
    }
    console.warn('No audio URL or fallback text provided')
    return
  }

  try {
    const audio = new Audio(audioUrl)
    await audio.play()
  } catch (error) {
    console.error('Failed to play audio:', error)
    // Fallback to text-to-speech if audio fails and fallback text is provided
    if (fallbackText) {
      return playTextToSpeech(fallbackText)
    }
  }
}

/**
 * Play text using Web Speech API (Text-to-Speech)
 * @param text - The text to speak
 * @param options - Optional speech synthesis options
 * @returns Promise that resolves when speech starts
 */
export const playTextToSpeech = (
  text: string,
  options?: {
    lang?: string
    rate?: number
    pitch?: number
    volume?: number
  },
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!text) {
      reject(new Error('No text provided for speech synthesis'))
      return
    }

    // Check if browser supports Speech Synthesis
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported in this browser')
      reject(new Error('Speech synthesis not supported'))
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = options?.lang || 'en-US'
    utterance.rate = options?.rate || 0.9 // Slightly slower for clarity
    utterance.pitch = options?.pitch || 1.0
    utterance.volume = options?.volume || 1.0

    utterance.onstart = () => resolve()
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
      reject(event)
    }

    window.speechSynthesis.speak(utterance)
  })
}

/**
 * Detect phonetic accent from audio URL or phonetic data
 * @param phonetic - Phonetic object with audio URL
 * @param index - Fallback index for generic labels
 * @returns Accent label (US, UK, AU, etc.)
 */
export const getPhoneticLabel = (
  phonetic: { audio?: string; text?: string },
  index: number,
): string => {
  // Try to detect accent from audio URL
  if (phonetic.audio) {
    const audioUrl = phonetic.audio.toLowerCase()
    if (audioUrl.includes('us') || audioUrl.includes('american')) return 'US'
    if (audioUrl.includes('uk') || audioUrl.includes('british')) return 'UK'
    if (audioUrl.includes('au') || audioUrl.includes('australian')) return 'AU'
    if (audioUrl.includes('ca') || audioUrl.includes('canadian')) return 'CA'
  }

  // Fallback to generic labels
  return index === 0 ? 'Alt 1' : `Alt ${index + 1}`
}

/**
 * Check if audio playback is supported
 * @returns true if audio playback is supported
 */
export const isAudioSupported = (): boolean => {
  try {
    return typeof Audio !== 'undefined'
  } catch {
    return false
  }
}

/**
 * Check if Text-to-Speech is supported
 * @returns true if speech synthesis is supported
 */
export const isTTSSupported = (): boolean => {
  return 'speechSynthesis' in window
}

/**
 * Get available speech synthesis voices
 * @returns Promise that resolves with available voices
 */
export const getAvailableVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (!isTTSSupported()) {
      resolve([])
      return
    }

    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      resolve(voices)
    } else {
      // Voices might not be loaded yet
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices())
      }
    }
  })
}

/**
 * Find the best English voice for pronunciation
 * @param preferredAccent - Preferred accent (us, uk, au, etc.)
 * @returns The best matching voice or undefined
 */
export const findBestEnglishVoice = async (
  preferredAccent: 'us' | 'uk' | 'au' = 'us',
): Promise<SpeechSynthesisVoice | undefined> => {
  const voices = await getAvailableVoices()
  const englishVoices = voices.filter((voice) => voice.lang.startsWith('en'))

  // Try to find voice matching preferred accent
  const accentMap: Record<string, string[]> = {
    us: ['en-US', 'en_US'],
    uk: ['en-GB', 'en_GB'],
    au: ['en-AU', 'en_AU'],
  }

  const preferredLangs = accentMap[preferredAccent] || accentMap.us
  for (const lang of preferredLangs) {
    const voice = englishVoices.find((v) => v.lang === lang)
    if (voice) return voice
  }

  // Fallback to any English voice
  return englishVoices[0]
}
