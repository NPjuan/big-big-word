# Quick Reference Guide

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install axios uuid date-fns zod openai

# Set up environment
cp .env.example .env
# Edit .env and add your API keys

# Start development server
npm run dev
```

### Essential Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test:unit    # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Lint code
npm run format       # Format code
```

---

## 📁 File Structure Quick Reference

```
src/
├── components/
│   ├── word-input/          # Input form components
│   ├── word-display/        # Display components
│   ├── shared/              # Reusable components
│   └── layout/              # Layout components
├── pages/                   # Page components
├── stores/                  # Pinia stores
├── services/                # API services
├── types/                   # TypeScript types
└── utils/                   # Utility functions
```

---

## 🎨 Component Quick Reference

### Word Input Form

```vue
<template>
  <WordInputForm @word-added="handleWordAdded" />
</template>

<script setup lang="ts">
const handleWordAdded = (word: Word) => {
  console.log('Word added:', word)
}
</script>
```

### Phonetic Display

```vue
<template>
  <PhoneticDisplay phonetic="/ˌserənˈdɪpɪti/" :audioUrl="audioUrl" word="serendipity" />
</template>
```

### Word Card

```vue
<template>
  <WordCard :word="wordData" @delete="handleDelete" @update="handleUpdate" />
</template>
```

### Etymology Section

```vue
<template>
  <EtymologySection word="serendipity" :etymology="etymologyData" />
</template>
```

---

## 🗄️ Store Quick Reference

### Word Store

```typescript
import { useWordStore } from '@/stores/wordStore'

const wordStore = useWordStore()

// Add word
await wordStore.addWord('serendipity')

// Get all words
const words = wordStore.words

// Get word count
const count = wordStore.wordCount

// Delete word
wordStore.deleteWord(wordId)

// Update word
wordStore.updateWord(wordId, { mastery: 80 })
```

### AI Store

```typescript
import { useAiStore } from '@/stores/aiStore'

const aiStore = useAiStore()

// Generate etymology
const etymology = await aiStore.generateEtymology('serendipity')

// Check if generating
const isLoading = aiStore.isGenerating

// Clear cache
aiStore.clearCache()
```

### UI Store

```typescript
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()

// Toggle theme
uiStore.toggleTheme()

// Get current theme
const theme = uiStore.theme // 'light' | 'dark'

// Toggle drawer
uiStore.toggleDrawer()
```

---

## 🔧 Service Quick Reference

### Dictionary Service

```typescript
import { dictionaryService } from '@/services/dictionaryService'

const data = await dictionaryService.fetchWord('serendipity')
// Returns: { phonetic, audioUrl, meanings, partOfSpeech }
```

### Translation Service

```typescript
import { translationService } from '@/services/translationService'

const chinese = await translationService.translateToChinese('serendipity', englishMeanings)
// Returns: ChineseMeaning[]
```

### AI Service

```typescript
import { aiService } from '@/services/aiService'

const etymology = await aiService.generateEtymology('serendipity')
// Returns: Etymology
```

### Audio Service

```typescript
import { useAudioService } from '@/services/audioService'

const audioService = useAudioService()

// Play from URL
await audioService.playAudio('https://...')

// Use Web Speech API
await audioService.speak('serendipity')
```

---

## 📝 Type Definitions Quick Reference

### Word

```typescript
interface Word {
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
```

### Etymology

```typescript
interface Etymology {
  roots: WordRoot[]
  origin: string
  evolution: string
  relatedWords: string[]
  mnemonic: string
  generatedAt: string
}

interface WordRoot {
  root: string
  meaning: string
  language: string
}
```

### Meanings

```typescript
interface EnglishMeaning {
  partOfSpeech: string
  definitions: string[]
  examples: string[]
  synonyms: string[]
  antonyms: string[]
}

interface ChineseMeaning {
  partOfSpeech: string
  definitions: string[]
  examples: string[]
}
```

---

## 🎨 Design Tokens Quick Reference

### Colors

```scss
// Primary
$primary: #6366F1
$secondary: #EC4899
$accent: #10B981

// Semantic
$success: #10B981
$warning: #F59E0B
$error: #EF4444
$info: #3B82F6

// Neutral
$gray-50: #FAFAFA
$gray-500: #737373
$gray-900: #171717
```

### Spacing

```scss
$space-1: 0.25rem   // 4px
$space-2: 0.5rem    // 8px
$space-4: 1rem      // 16px
$space-6: 1.5rem    // 24px
$space-8: 2rem      // 32px
```

### Typography

```scss
$text-xs: 0.75rem      // 12px
$text-sm: 0.875rem     // 14px
$text-base: 1rem       // 16px
$text-lg: 1.125rem     // 18px
$text-xl: 1.25rem      // 20px
$text-2xl: 1.5rem      // 24px
```

### Animations

```scss
$duration-fast: 150ms
$duration-base: 250ms
$duration-slow: 350ms
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 🔑 Environment Variables

```env
# Required
VITE_OPENAI_API_KEY=sk-...

# Optional (choose one translation API)
VITE_GOOGLE_TRANSLATE_API_KEY=...
VITE_DEEPL_API_KEY=...

# Optional (defaults provided)
VITE_DICTIONARY_API_URL=https://api.dictionaryapi.dev/api/v2/entries/en
VITE_ENABLE_AI_ETYMOLOGY=true
VITE_ENABLE_DARK_MODE=true
```

---

## 🧪 Testing Quick Reference

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { useWordStore } from '@/stores/wordStore'

describe('Word Store', () => {
  it('should add a word', async () => {
    const store = useWordStore()
    await store.addWord('test')
    expect(store.wordCount).toBe(1)
  })
})
```

### Component Test Example

```typescript
import { mount } from '@vue/test-utils'
import WordInputForm from '@/components/word-input/WordInputForm.vue'

describe('WordInputForm', () => {
  it('should emit word-added event', async () => {
    const wrapper = mount(WordInputForm)
    await wrapper.find('input').setValue('test')
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('word-added')).toBeTruthy()
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test('should add a word', async ({ page }) => {
  await page.goto('/')
  await page.fill('input', 'serendipity')
  await page.click('button:has-text("Add Word")')
  await expect(page.locator('.word-card')).toBeVisible()
})
```

---

## 🐛 Common Issues & Solutions

### Issue: API Rate Limit

**Solution**: Implement caching and throttling

```typescript
// In service
const cache = new Map()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

const fetchWithCache = async (key: string, fetcher: () => Promise<any>) => {
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key)
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data
    }
  }
  const data = await fetcher()
  cache.set(key, { data, timestamp: Date.now() })
  return data
}
```

### Issue: localStorage Quota Exceeded

**Solution**: Compress data or use IndexedDB

```typescript
// Compress before storing
const compressed = LZString.compress(JSON.stringify(data))
localStorage.setItem('words', compressed)

// Decompress when reading
const compressed = localStorage.getItem('words')
const data = JSON.parse(LZString.decompress(compressed))
```

### Issue: Audio Not Playing

**Solution**: Check browser support and use fallback

```typescript
const playAudio = async (word: string, audioUrl?: string) => {
  try {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      await audio.play()
    } else {
      // Fallback to Web Speech API
      const utterance = new SpeechSynthesisUtterance(word)
      speechSynthesis.speak(utterance)
    }
  } catch (error) {
    console.error('Audio playback failed:', error)
    // Show error to user
  }
}
```

### Issue: AI Response Too Slow

**Solution**: Show loading state and cache results

```vue
<template>
  <div v-if="isLoading">
    <LoadingSkeleton />
  </div>
  <div v-else-if="etymology">
    <EtymologySection :etymology="etymology" />
  </div>
</template>

<script setup lang="ts">
const isLoading = ref(true)
const etymology = ref(null)

onMounted(async () => {
  // Check cache first
  const cached = getCachedEtymology(word)
  if (cached) {
    etymology.value = cached
    isLoading.value = false
    return
  }

  // Generate new
  etymology.value = await aiService.generateEtymology(word)
  isLoading.value = false

  // Cache result
  cacheEtymology(word, etymology.value)
})
</script>
```

---

## 📊 Performance Optimization Tips

### 1. Lazy Load Routes

```typescript
const routes = [
  {
    path: '/gallery',
    component: () => import('@/pages/WordGallery.vue'),
  },
]
```

### 2. Lazy Load Components

```vue
<script setup lang="ts">
const EtymologySection = defineAsyncComponent(
  () => import('@/components/word-display/EtymologySection.vue'),
)
</script>
```

### 3. Use v-memo for Lists

```vue
<template>
  <div v-for="word in words" :key="word.id" v-memo="[word.id, word.mastery]">
    <WordCard :word="word" />
  </div>
</template>
```

### 4. Debounce Search Input

```typescript
import { debounce } from 'lodash-es'

const handleSearch = debounce((query: string) => {
  // Perform search
}, 300)
```

### 5. Virtual Scrolling for Large Lists

```vue
<template>
  <v-virtual-scroll :items="words" :item-height="200">
    <template #default="{ item }">
      <WordCard :word="item" />
    </template>
  </v-virtual-scroll>
</template>
```

---

## ♿ Accessibility Checklist

- [ ] All images have alt text
- [ ] All buttons have aria-labels
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Screen reader announces dynamic content
- [ ] Form inputs have labels
- [ ] Error messages are announced
- [ ] Skip to main content link exists
- [ ] Heading hierarchy is correct (h1 → h2 → h3)

---

## 🔐 Security Best Practices

### 1. Never Commit API Keys

```bash
# Add to .gitignore
.env
.env.local
```

### 2. Sanitize User Input

```typescript
import DOMPurify from 'dompurify'

const sanitized = DOMPurify.sanitize(userInput)
```

### 3. Validate Input

```typescript
import { z } from 'zod'

const wordSchema = z
  .string()
  .min(1)
  .max(50)
  .regex(/^[a-zA-Z\s-]+$/)

const validated = wordSchema.parse(input)
```

### 4. Use HTTPS Only

```typescript
// In vite.config.ts
export default defineConfig({
  server: {
    https: true,
  },
})
```

---

## 📱 Responsive Design Breakpoints

```scss
// Mobile
@media (max-width: 599px) {
  // Single column, larger touch targets
}

// Tablet
@media (min-width: 600px) and (max-width: 959px) {
  // Two columns, medium spacing
}

// Desktop
@media (min-width: 960px) {
  // Three columns, hover effects
}

// Large Desktop
@media (min-width: 1280px) {
  // Four columns, max width container
}
```

---

## 🎯 Keyboard Shortcuts

| Shortcut      | Action                           |
| ------------- | -------------------------------- |
| `Enter`       | Submit word / Activate button    |
| `Esc`         | Clear input / Close modal        |
| `Tab`         | Navigate forward                 |
| `Shift + Tab` | Navigate backward                |
| `Space`       | Play audio / Toggle checkbox     |
| `/`           | Focus search (future)            |
| `?`           | Show keyboard shortcuts (future) |

---

## 📈 Monitoring & Analytics

### Performance Metrics

```typescript
// Measure page load time
const perfData = performance.getEntriesByType('navigation')[0]
console.log('Page load:', perfData.loadEventEnd - perfData.fetchStart)

// Measure component render time
const start = performance.now()
// ... render component
const end = performance.now()
console.log('Render time:', end - start)
```

### Error Tracking

```typescript
window.addEventListener('error', (event) => {
  // Send to error tracking service
  console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  // Send to error tracking service
  console.error('Unhandled promise rejection:', event.reason)
})
```

---

## 🔄 Git Workflow

### Branch Naming

```
feature/word-input-form
fix/audio-playback-issue
refactor/store-architecture
docs/update-readme
```

### Commit Messages

```
feat: add word input form component
fix: resolve audio playback on Safari
refactor: simplify store actions
docs: update API documentation
test: add unit tests for word store
style: format code with prettier
```

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots

(if applicable)

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

---

## 📚 Useful Resources

### Documentation

- [Vue 3 Docs](https://vuejs.org/)
- [Vuetify 3 Docs](https://vuetifyjs.com/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Vite Docs](https://vitejs.dev/)

### APIs

- [Free Dictionary API](https://dictionaryapi.dev/)
- [OpenAI API](https://platform.openai.com/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

### Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Vue DevTools](https://devtools.vuejs.org/)

---

## 💡 Pro Tips

1. **Use Composition API**: More flexible and easier to test
2. **Keep Components Small**: Single responsibility principle
3. **Use TypeScript**: Catch errors early
4. **Write Tests First**: TDD approach
5. **Cache Aggressively**: Reduce API calls
6. **Optimize Images**: Use WebP format
7. **Lazy Load Everything**: Improve initial load time
8. **Monitor Performance**: Use Lighthouse regularly
9. **Test Accessibility**: Use screen readers
10. **Document Your Code**: Future you will thank you

---

_This quick reference guide is your go-to resource for common tasks and patterns in the Big Big Word project._
