# Technical Specification: Enhanced Word Learning System

## 1. Component Architecture

### 1.1 Word Input Form Component

**File**: `src/components/word-input/WordInputForm.vue`

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWordStore } from '@/stores/wordStore'
import { useAiStore } from '@/stores/aiStore'

const wordStore = useWordStore()
const aiStore = useAiStore()

const inputWord = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

const isValid = computed(() => {
  return inputWord.value.trim().length > 0 && /^[a-zA-Z\s-]+$/.test(inputWord.value)
})

const handleSubmit = async () => {
  if (!isValid.value) return

  isLoading.value = true
  error.value = null

  try {
    await wordStore.addWord(inputWord.value.trim().toLowerCase())
    inputWord.value = ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to add word'
  } finally {
    isLoading.value = false
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  } else if (event.key === 'Escape') {
    inputWord.value = ''
    error.value = null
  }
}
</script>

<template>
  <v-card class="word-input-card" elevation="2">
    <v-card-title class="text-h5 font-weight-bold">
      <v-icon icon="mdi-book-plus" class="mr-2" color="primary" />
      Add New Word
    </v-card-title>

    <v-card-text>
      <v-text-field
        v-model="inputWord"
        label="Enter a word"
        placeholder="e.g., serendipity"
        variant="outlined"
        density="comfortable"
        :loading="isLoading"
        :error="!!error"
        :error-messages="error || undefined"
        @keydown="handleKeyDown"
        autofocus
        clearable
      >
        <template #prepend-inner>
          <v-icon icon="mdi-magnify" />
        </template>
      </v-text-field>

      <div class="d-flex justify-space-between align-center mt-2">
        <div class="text-caption text-medium-emphasis">Press Enter to add • Esc to clear</div>

        <v-btn
          color="primary"
          :disabled="!isValid || isLoading"
          :loading="isLoading"
          @click="handleSubmit"
        >
          <v-icon icon="mdi-plus" class="mr-1" />
          Add Word
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.word-input-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.word-input-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
</style>
```

### 1.2 Phonetic Display Component

**File**: `src/components/word-display/PhoneticDisplay.vue`

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useAudioService } from '@/services/audioService'

interface Props {
  phonetic: string
  audioUrl?: string
  word: string
}

const props = defineProps<Props>()
const audioService = useAudioService()

const isPlaying = ref(false)
const error = ref<string | null>(null)

const handlePlay = async () => {
  if (isPlaying.value) return

  isPlaying.value = true
  error.value = null

  try {
    if (props.audioUrl) {
      await audioService.playAudio(props.audioUrl)
    } else {
      await audioService.speak(props.word)
    }
  } catch (err) {
    error.value = 'Failed to play audio'
    console.error('Audio playback error:', err)
  } finally {
    isPlaying.value = false
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handlePlay()
  }
}
</script>

<template>
  <div class="phonetic-display">
    <v-chip
      class="phonetic-chip"
      color="primary"
      variant="tonal"
      size="large"
      :disabled="isPlaying"
      @click="handlePlay"
      @keydown="handleKeyDown"
      tabindex="0"
      role="button"
      :aria-label="`Play pronunciation of ${word}`"
    >
      <v-icon
        :icon="isPlaying ? 'mdi-volume-high' : 'mdi-volume-medium'"
        :class="{ 'playing-icon': isPlaying }"
        class="mr-2"
      />
      <span class="phonetic-text">{{ phonetic }}</span>
    </v-chip>

    <v-fade-transition>
      <v-alert
        v-if="error"
        type="error"
        density="compact"
        class="mt-2"
        closable
        @click:close="error = null"
      >
        {{ error }}
      </v-alert>
    </v-fade-transition>
  </div>
</template>

<style scoped>
.phonetic-display {
  display: inline-block;
}

.phonetic-chip {
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'JetBrains Mono', monospace;
}

.phonetic-chip:hover {
  transform: scale(1.05);
}

.phonetic-chip:active {
  transform: scale(0.98);
}

.playing-icon {
  animation: pulse 0.8s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.phonetic-text {
  font-size: 1.1rem;
  font-weight: 500;
}
</style>
```

### 1.3 Etymology Section Component

**File**: `src/components/word-display/EtymologySection.vue`

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Etymology } from '@/types/word.types'
import { useAiStore } from '@/stores/aiStore'

interface Props {
  word: string
  etymology?: Etymology
}

const props = defineProps<Props>()
const aiStore = useAiStore()

const isLoading = ref(false)
const error = ref<string | null>(null)
const etymologyData = ref<Etymology | null>(props.etymology || null)

const loadEtymology = async () => {
  if (etymologyData.value) return

  isLoading.value = true
  error.value = null

  try {
    etymologyData.value = await aiStore.generateEtymology(props.word)
  } catch (err) {
    error.value = 'Failed to generate etymology'
    console.error('Etymology generation error:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!props.etymology) {
    loadEtymology()
  }
})
</script>

<template>
  <v-card class="etymology-card" variant="tonal">
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-tree" class="mr-2" color="success" />
      Etymology & Word Roots
    </v-card-title>

    <v-card-text>
      <!-- Loading State -->
      <div v-if="isLoading" class="etymology-skeleton">
        <v-skeleton-loader type="paragraph" />
        <v-skeleton-loader type="list-item-two-line" class="mt-4" />
        <v-skeleton-loader type="list-item-two-line" />
      </div>

      <!-- Error State -->
      <v-alert v-else-if="error" type="error" variant="tonal">
        {{ error }}
        <template #append>
          <v-btn size="small" variant="text" @click="loadEtymology"> Retry </v-btn>
        </template>
      </v-alert>

      <!-- Content -->
      <div v-else-if="etymologyData" class="etymology-content">
        <!-- Origin -->
        <div class="mb-4">
          <div class="text-subtitle-2 text-medium-emphasis mb-2">Origin</div>
          <p class="text-body-1">{{ etymologyData.origin }}</p>
        </div>

        <!-- Word Roots -->
        <div v-if="etymologyData.roots.length > 0" class="mb-4">
          <div class="text-subtitle-2 text-medium-emphasis mb-2">Word Roots</div>
          <v-chip-group column>
            <v-chip
              v-for="(root, index) in etymologyData.roots"
              :key="index"
              color="success"
              variant="outlined"
              size="small"
            >
              <strong>{{ root.root }}</strong>
              <span class="mx-2">•</span>
              <span>{{ root.meaning }}</span>
              <span class="text-caption ml-2">({{ root.language }})</span>
            </v-chip>
          </v-chip-group>
        </div>

        <!-- Evolution -->
        <div class="mb-4">
          <div class="text-subtitle-2 text-medium-emphasis mb-2">Evolution</div>
          <p class="text-body-2">{{ etymologyData.evolution }}</p>
        </div>

        <!-- Mnemonic -->
        <div v-if="etymologyData.mnemonic" class="mnemonic-box">
          <v-icon icon="mdi-lightbulb" color="warning" class="mr-2" />
          <div>
            <div class="text-subtitle-2 mb-1">Memory Tip</div>
            <p class="text-body-2">{{ etymologyData.mnemonic }}</p>
          </div>
        </div>

        <!-- Related Words -->
        <div v-if="etymologyData.relatedWords.length > 0" class="mt-4">
          <div class="text-subtitle-2 text-medium-emphasis mb-2">Related Words</div>
          <v-chip-group>
            <v-chip
              v-for="(relatedWord, index) in etymologyData.relatedWords"
              :key="index"
              size="small"
              variant="text"
            >
              {{ relatedWord }}
            </v-chip>
          </v-chip-group>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.etymology-card {
  margin-top: 1rem;
}

.etymology-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mnemonic-box {
  display: flex;
  align-items: start;
  padding: 1rem;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 8px;
  border-left: 4px solid rgb(var(--v-theme-warning));
}
</style>
```

## 2. Store Implementation

### 2.1 Word Store

**File**: `src/stores/wordStore.ts`

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Word } from '@/types/word.types'
import { dictionaryService } from '@/services/dictionaryService'
import { translationService } from '@/services/translationService'
import { useAiStore } from './aiStore'
import { v4 as uuidv4 } from 'uuid'

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
    if (words.value.some((w) => w.word === wordText)) {
      throw new Error('Word already exists')
    }

    isLoading.value = true
    error.value = null

    try {
      // Fetch dictionary data
      const dictionaryData = await dictionaryService.fetchWord(wordText)

      // Fetch Chinese translation
      const chineseData = await translationService.translateToChinese(
        wordText,
        dictionaryData.meanings,
      )

      // Create word object
      const newWord: Word = {
        id: uuidv4(),
        word: wordText,
        phonetic: dictionaryData.phonetic,
        audioUrl: dictionaryData.audioUrl,
        partOfSpeech: dictionaryData.partOfSpeech,
        chineseMeaning: chineseData,
        englishMeaning: dictionaryData.meanings,
        etymology: {
          roots: [],
          origin: '',
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

      // Generate etymology asynchronously
      const aiStore = useAiStore()
      aiStore.generateEtymology(wordText).then((etymology) => {
        const word = words.value.find((w) => w.id === newWord.id)
        if (word) {
          word.etymology = etymology
          saveWords()
        }
      })

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
```

### 2.2 AI Store

**File**: `src/stores/aiStore.ts`

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Etymology } from '@/types/word.types'
import { aiService } from '@/services/aiService'

export const useAiStore = defineStore('ai', () => {
  // State
  const cache = ref<Map<string, Etymology>>(new Map())
  const isGenerating = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const generateEtymology = async (word: string): Promise<Etymology> => {
    // Check cache first
    if (cache.value.has(word)) {
      return cache.value.get(word)!
    }

    isGenerating.value = true
    error.value = null

    try {
      const etymology = await aiService.generateEtymology(word)

      // Cache the result
      cache.value.set(word, etymology)

      return etymology
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to generate etymology'
      throw err
    } finally {
      isGenerating.value = false
    }
  }

  const clearCache = () => {
    cache.value.clear()
  }

  return {
    cache,
    isGenerating,
    error,
    generateEtymology,
    clearCache,
  }
})
```

## 3. Service Layer

### 3.1 Dictionary Service

**File**: `src/services/dictionaryService.ts`

```typescript
import type { EnglishMeaning } from '@/types/word.types'

interface DictionaryResponse {
  word: string
  phonetic: string
  phonetics: Array<{
    text: string
    audio?: string
  }>
  meanings: Array<{
    partOfSpeech: string
    definitions: Array<{
      definition: string
      example?: string
      synonyms?: string[]
      antonyms?: string[]
    }>
  }>
}

export const dictionaryService = {
  async fetchWord(word: string) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

    if (!response.ok) {
      throw new Error('Word not found')
    }

    const data: DictionaryResponse[] = await response.json()
    const entry = data[0]

    // Extract phonetic with audio
    const phoneticWithAudio = entry.phonetics.find((p) => p.audio)
    const phonetic = phoneticWithAudio?.text || entry.phonetic || ''
    const audioUrl = phoneticWithAudio?.audio

    // Parse meanings
    const meanings: EnglishMeaning[] = entry.meanings.map((m) => ({
      partOfSpeech: m.partOfSpeech,
      definitions: m.definitions.map((d) => d.definition),
      examples: m.definitions.filter((d) => d.example).map((d) => d.example!),
      synonyms: m.definitions.flatMap((d) => d.synonyms || []),
      antonyms: m.definitions.flatMap((d) => d.antonyms || []),
    }))

    const partOfSpeech = entry.meanings.map((m) => m.partOfSpeech)

    return {
      phonetic,
      audioUrl,
      meanings,
      partOfSpeech,
    }
  },
}
```

### 3.2 AI Service

**File**: `src/services/aiService.ts`

```typescript
import type { Etymology } from '@/types/word.types'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

export const aiService = {
  async generateEtymology(word: string): Promise<Etymology> {
    const prompt = `Analyze the etymology of the word "${word}". Provide:
1. Word roots (root, meaning, language of origin)
2. Historical origin and first known use
3. Evolution of meaning over time
4. Related words from the same root
5. A creative mnemonic device to remember this word

Format your response as JSON with this structure:
{
  "roots": [{"root": "string", "meaning": "string", "language": "string"}],
  "origin": "string",
  "evolution": "string",
  "relatedWords": ["string"],
  "mnemonic": "string"
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert etymologist and linguist. Provide accurate, educational etymology information in JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate etymology')
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Parse JSON response
    const etymologyData = JSON.parse(content)

    return {
      ...etymologyData,
      generatedAt: new Date().toISOString(),
    }
  },
}
```

## 4. Type Definitions

**File**: `src/types/word.types.ts`

```typescript
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
  mastery: number
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
```

## 5. Routing Configuration

**File**: `src/router/index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/learn',
    },
    {
      path: '/learn',
      name: 'learn',
      component: () => import('@/pages/WordLearning.vue'),
      meta: {
        title: 'Learn Words',
      },
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('@/pages/WordGallery.vue'),
      meta: {
        title: 'Word Gallery',
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'Big Big Word'} | Vocabulary Learning`
  next()
})

export default router
```

## 6. Environment Configuration

**File**: `.env.example`

```env
# OpenAI API Configuration
VITE_OPENAI_API_KEY=sk-your-api-key-here

# Translation API (Optional - choose one)
VITE_GOOGLE_TRANSLATE_API_KEY=your-key-here
VITE_DEEPL_API_KEY=your-key-here

# Dictionary API
VITE_DICTIONARY_API_URL=https://api.dictionaryapi.dev/api/v2/entries/en

# Feature Flags
VITE_ENABLE_AI_ETYMOLOGY=true
VITE_ENABLE_DARK_MODE=true
```

## 7. Testing Strategy

### Unit Tests Example

**File**: `src/__tests__/stores/wordStore.spec.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWordStore } from '@/stores/wordStore'

describe('Word Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with empty words', () => {
    const store = useWordStore()
    expect(store.words).toEqual([])
    expect(store.wordCount).toBe(0)
  })

  it('should add a new word', async () => {
    const store = useWordStore()
    // Mock API calls would go here
    // await store.addWord('test')
    // expect(store.wordCount).toBe(1)
  })

  it('should delete a word', () => {
    const store = useWordStore()
    // Test implementation
  })
})
```

## 8. Performance Optimization

### Lazy Loading

- Use dynamic imports for routes
- Lazy load AI service only when needed
- Defer etymology generation

### Caching Strategy

- Cache dictionary API responses (24 hours)
- Cache AI etymology responses (permanent)
- Use IndexedDB for large datasets

### Bundle Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['vuetify'],
          ai: ['openai'],
        },
      },
    },
  },
})
```

## 9. Accessibility Checklist

- [ ] All interactive elements have proper ARIA labels
- [ ] Keyboard navigation works for all features
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader announcements for dynamic content
- [ ] Skip links for main content
- [ ] Proper heading hierarchy
- [ ] Form labels and error messages

## 10. Browser Compatibility

**Minimum Supported Versions:**

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile Safari: 14+
- Chrome Android: 90+

**Polyfills Required:**

- None (using modern Vue 3 + Vite)

**Progressive Enhancement:**

- Web Speech API fallback
- Audio playback fallback
- localStorage fallback to memory
