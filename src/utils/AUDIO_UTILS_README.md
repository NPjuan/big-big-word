# Audio Utilities Documentation

## 📖 Overview

The `audioUtils.ts` module provides a centralized, reusable solution for audio playback and text-to-speech functionality across the Big Big Word application. It implements intelligent fallback mechanisms to ensure pronunciation is always available.

## 🎯 Features

- ✅ **Audio Playback**: Play pronunciation audio from URLs
- ✅ **Automatic Fallback**: Falls back to Text-to-Speech if audio fails
- ✅ **Text-to-Speech**: Web Speech API integration
- ✅ **Phonetic Label Detection**: Automatically detect accent (US/UK/AU)
- ✅ **Browser Compatibility**: Checks for feature support
- ✅ **Voice Selection**: Find best English voice for pronunciation
- ✅ **Error Handling**: Graceful degradation on failures

## 📦 Installation

The utility is already integrated into the project. Simply import the functions you need:

```typescript
import { playAudio, playTextToSpeech, getPhoneticLabel } from '@/utils/audioUtils'
```

## 🚀 Usage

### Basic Audio Playback

```typescript
import { playAudio } from '@/utils/audioUtils'

// Play audio with fallback to TTS
const handlePlayAudio = () => {
  playAudio('https://example.com/audio.mp3', 'hello')
}
```

### Text-to-Speech Only

```typescript
import { playTextToSpeech } from '@/utils/audioUtils'

// Speak text directly
const handleSpeak = () => {
  playTextToSpeech('hello', {
    lang: 'en-US',
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0,
  })
}
```

### Phonetic Label Detection

```typescript
import { getPhoneticLabel } from '@/utils/audioUtils'

// Detect accent from phonetic data
const phonetic = {
  audio: 'https://example.com/us-pronunciation.mp3',
  text: '/həˈloʊ/',
}

const label = getPhoneticLabel(phonetic, 0)
// Returns: 'US', 'UK', 'AU', or 'Alt 1'
```

### Check Browser Support

```typescript
import { isAudioSupported, isTTSSupported } from '@/utils/audioUtils'

if (isAudioSupported()) {
  console.log('Audio playback is supported')
}

if (isTTSSupported()) {
  console.log('Text-to-Speech is supported')
}
```

### Advanced: Voice Selection

```typescript
import { findBestEnglishVoice, getAvailableVoices } from '@/utils/audioUtils'

// Get all available voices
const voices = await getAvailableVoices()
console.log('Available voices:', voices)

// Find best US English voice
const usVoice = await findBestEnglishVoice('us')
if (usVoice) {
  console.log('Best US voice:', usVoice.name)
}
```

## 📚 API Reference

### `playAudio(audioUrl?, fallbackText?): Promise<void>`

Play audio from URL with automatic fallback to TTS.

**Parameters:**

- `audioUrl` (string, optional): URL of the audio file
- `fallbackText` (string, optional): Text to speak if audio fails

**Returns:** Promise that resolves when audio starts playing

**Example:**

```typescript
await playAudio('https://example.com/audio.mp3', 'hello')
```

---

### `playTextToSpeech(text, options?): Promise<void>`

Speak text using Web Speech API.

**Parameters:**

- `text` (string, required): Text to speak
- `options` (object, optional):
  - `lang` (string): Language code (default: 'en-US')
  - `rate` (number): Speech rate 0.1-10 (default: 0.9)
  - `pitch` (number): Voice pitch 0-2 (default: 1.0)
  - `volume` (number): Volume 0-1 (default: 1.0)

**Returns:** Promise that resolves when speech starts

**Example:**

```typescript
await playTextToSpeech('hello', {
  lang: 'en-GB',
  rate: 0.8,
  pitch: 1.2,
})
```

---

### `getPhoneticLabel(phonetic, index): string`

Detect phonetic accent from audio URL or return generic label.

**Parameters:**

- `phonetic` (object): Phonetic data with `audio` and/or `text` properties
- `index` (number): Fallback index for generic labels

**Returns:** Accent label ('US', 'UK', 'AU', 'CA', or 'Alt N')

**Example:**

```typescript
const label = getPhoneticLabel({ audio: 'us-audio.mp3' }, 0)
// Returns: 'US'
```

---

### `isAudioSupported(): boolean`

Check if audio playback is supported in the browser.

**Returns:** `true` if Audio API is available

---

### `isTTSSupported(): boolean`

Check if Text-to-Speech is supported in the browser.

**Returns:** `true` if Speech Synthesis API is available

---

### `getAvailableVoices(): Promise<SpeechSynthesisVoice[]>`

Get all available speech synthesis voices.

**Returns:** Promise resolving to array of available voices

---

### `findBestEnglishVoice(preferredAccent?): Promise<SpeechSynthesisVoice | undefined>`

Find the best English voice matching the preferred accent.

**Parameters:**

- `preferredAccent` ('us' | 'uk' | 'au', optional): Preferred accent (default: 'us')

**Returns:** Promise resolving to best matching voice or undefined

## 🎨 Integration Examples

### Vue Component (WordDetail.vue)

```vue
<script setup lang="ts">
import { playAudio, playTextToSpeech, getPhoneticLabel } from '@/utils/audioUtils'

const handlePlayAudio = (audioUrl?: string) => {
  const url = audioUrl || word.value?.audioUrl
  const fallbackText = word.value?.word || ''
  playAudio(url, fallbackText)
}

const handlePlayTextToSpeech = (text: string) => {
  playTextToSpeech(text)
}

const handleGetPhoneticLabel = (phonetic: any, index: number): string => {
  return getPhoneticLabel(phonetic, index)
}
</script>

<template>
  <button @click="handlePlayAudio(audioUrl)">Play Audio</button>
</template>
```

### Vue Component (WordCard.vue)

```vue
<script setup lang="ts">
import { playAudio as playAudioUtil } from '@/utils/audioUtils'

const playAudio = async () => {
  const audioUrl = props.word.phonetics?.find((p) => p.audio)?.audio
  const fallbackText = props.word.word
  await playAudioUtil(audioUrl, fallbackText)
}
</script>
```

### Vue Component (WordTable.vue)

```vue
<script setup lang="ts">
import { playAudio as playAudioUtil } from '@/utils/audioUtils'

const playAudio = (audioUrl: string, word?: Word) => {
  const fallbackText = word?.word || ''
  playAudioUtil(audioUrl, fallbackText)
}
</script>

<template>
  <button @click="playAudio(word.audioUrl, word)">Play</button>
</template>
```

## 🔧 Error Handling

The utility handles errors gracefully:

1. **No Audio URL**: Automatically falls back to TTS if `fallbackText` is provided
2. **Audio Load Failure**: Catches errors and falls back to TTS
3. **TTS Not Supported**: Logs warning and rejects promise
4. **No Text Provided**: Rejects promise with error

```typescript
try {
  await playAudio(undefined, 'hello')
  // Will use TTS since no audio URL
} catch (error) {
  console.error('Failed to play:', error)
}
```

## 🌐 Browser Compatibility

| Feature          | Chrome | Firefox | Safari     | Edge |
| ---------------- | ------ | ------- | ---------- | ---- |
| Audio Playback   | ✅     | ✅      | ✅         | ✅   |
| Speech Synthesis | ✅     | ✅      | ✅         | ✅   |
| Voice Selection  | ✅     | ✅      | ⚠️ Limited | ✅   |

**Note:** Safari has limited voice selection options compared to Chrome/Edge.

## 🎯 Best Practices

1. **Always Provide Fallback Text**: Ensure TTS can work if audio fails

   ```typescript
   playAudio(audioUrl, word.text) // ✅ Good
   playAudio(audioUrl) // ⚠️ No fallback
   ```

2. **Handle Promises**: Audio playback is asynchronous

   ```typescript
   await playAudio(url, text) // ✅ Good
   playAudio(url, text) // ⚠️ Unhandled promise
   ```

3. **Check Support**: Verify browser support before critical features

   ```typescript
   if (isTTSSupported()) {
     // Show TTS button
   }
   ```

4. **User Interaction**: Audio playback requires user interaction in most browsers

   ```typescript
   // ✅ Good: Called from button click
   <button @click="playAudio(url, text)">Play</button>

   // ❌ Bad: Called on page load
   onMounted(() => playAudio(url, text))
   ```

## 📊 Performance Considerations

- **Audio Caching**: Browser automatically caches audio files
- **TTS Performance**: Speech synthesis is instant, no network required
- **Memory**: Audio objects are garbage collected after playback
- **Network**: Only downloads audio when needed

## 🔄 Migration Guide

### Before (Old Code)

```typescript
// WordDetail.vue - Old
const playAudio = (audioUrl?: string) => {
  if (!audioUrl) return
  const audio = new Audio(audioUrl)
  audio.play().catch(console.error)
}
```

### After (New Code)

```typescript
// WordDetail.vue - New
import { playAudio } from '@/utils/audioUtils'

const handlePlayAudio = (audioUrl?: string) => {
  playAudio(audioUrl, word.value?.word)
}
```

## 🐛 Troubleshooting

### Audio Not Playing

1. Check browser console for errors
2. Verify audio URL is accessible
3. Ensure user has interacted with page (browser requirement)
4. Check if audio format is supported (MP3, WAV, OGG)

### TTS Not Working

1. Verify browser supports Speech Synthesis
2. Check if voices are loaded: `await getAvailableVoices()`
3. Ensure text is not empty
4. Try different voice/language settings

### Fallback Not Triggering

1. Ensure `fallbackText` parameter is provided
2. Check if TTS is supported in browser
3. Verify error handling is not suppressed

## 📝 License

This utility is part of the Big Big Word project and follows the same license.

## 🤝 Contributing

To improve the audio utilities:

1. Add new features to `audioUtils.ts`
2. Update this documentation
3. Add tests for new functionality
4. Update integration examples

## 📞 Support

For issues or questions:

- Check the troubleshooting section
- Review browser compatibility
- Consult the API reference
- Check integration examples
