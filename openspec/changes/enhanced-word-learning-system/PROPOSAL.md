# Enhanced Word Learning System

## Status

- **State**: PROPOSED
- **Created**: 2026-01-17
- **Author**: Developer
- **Priority**: HIGH

## Overview

Transform Big Big Word into a comprehensive vocabulary learning platform with advanced features including automatic phonetic generation, bilingual definitions, AI-powered etymology analysis, and a modern UI/UX built with Vuetify and advanced design patterns.

## Problem Statement

The current application needs a complete word learning system that:

- Allows users to input words easily with an intuitive interface
- Automatically generates and displays phonetic transcriptions
- Provides both Chinese and English meanings for better understanding
- Offers AI-generated etymology and root word analysis for deeper learning
- Delivers a beautiful, modern user experience using Vuetify and UI/UX best practices

## Proposed Solution

### Core Features

#### 1. Word Input System

- Clean, focused input interface with real-time validation
- Auto-complete suggestions based on existing words
- Keyboard shortcuts for power users (Enter to submit, Esc to clear)
- Loading states and error handling with user-friendly messages

#### 2. Automatic Phonetic Generation

- Fetch phonetics from Free Dictionary API
- Display IPA (International Phonetic Alphabet) notation
- Clickable phonetic text to play pronunciation
- Visual feedback on play (animated icon)
- Fallback to Web Speech API if audio not available

#### 3. Bilingual Definitions

- **Chinese Meaning**: Primary translation for quick understanding
- **English Meaning**: Original definition for accurate comprehension
- Multiple definitions organized by part of speech
- Example sentences in both languages
- Collapsible sections for better readability

#### 4. AI Etymology Analysis

- Integration with AI service (OpenAI/Anthropic) for etymology generation
- Display word roots, prefixes, and suffixes
- Historical origin and evolution of the word
- Related words and word families
- Mnemonic suggestions for better memorization
- Loading skeleton while AI generates content

#### 5. Modern UI/UX Design

- **Material Design 3** principles via Vuetify
- **Responsive Layout**: Mobile-first approach
- **Smooth Animations**: Transitions and micro-interactions
- **Card-based Design**: Clean, organized information hierarchy
- **Color System**: Semantic colors for different information types
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Dark Mode Support**: Toggle between light and dark themes

### Technical Architecture

#### New Components

```
src/
├── components/
│   ├── word-input/
│   │   ├── WordInputForm.vue          # Main input form
│   │   ├── WordSuggestions.vue        # Auto-complete dropdown
│   │   └── InputValidation.vue        # Validation feedback
│   ├── word-display/
│   │   ├── WordCard.vue               # Main word display card
│   │   ├── PhoneticDisplay.vue        # Phonetic with audio
│   │   ├── DefinitionSection.vue      # Bilingual definitions
│   │   ├── EtymologySection.vue       # AI-generated etymology
│   │   └── AudioPlayer.vue            # Custom audio player
│   └── shared/
│       ├── LoadingSkeleton.vue        # Loading states
│       ├── ErrorMessage.vue           # Error display
│       └── ThemeToggle.vue            # Dark mode toggle
├── pages/
│   ├── WordLearning.vue               # Main learning page
│   └── WordGallery.vue                # Word collection view
├── stores/
│   ├── wordStore.ts                   # Word data management
│   ├── aiStore.ts                     # AI service integration
│   └── uiStore.ts                     # UI state (theme, etc.)
├── services/
│   ├── dictionaryService.ts           # Dictionary API
│   ├── aiService.ts                   # AI etymology service
│   └── audioService.ts                # Audio playback
├── types/
│   ├── word.types.ts                  # Word interfaces
│   └── api.types.ts                   # API response types
└── utils/
    ├── phoneticParser.ts              # Parse phonetic data
    ├── translationHelper.ts           # Translation utilities
    └── storageHelper.ts               # Enhanced localStorage
```

#### Data Models

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

interface ChineseMeaning {
  partOfSpeech: string
  definitions: string[]
  examples: string[]
}

interface EnglishMeaning {
  partOfSpeech: string
  definitions: string[]
  examples: string[]
  synonyms: string[]
  antonyms: string[]
}

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

#### API Integration

**Dictionary API** (Free Dictionary API)

```
GET https://api.dictionaryapi.dev/api/v2/entries/en/{word}
```

**Translation API** (Options)

- Google Translate API
- DeepL API
- Azure Translator

**AI Service** (Options)

- OpenAI GPT-4 API
- Anthropic Claude API
- Local LLM (Ollama)

### UI/UX Design Specifications

#### Color Palette

```scss
// Primary Colors
$primary: #6366F1 (Indigo)
$secondary: #EC4899 (Pink)
$accent: #10B981 (Emerald)

// Semantic Colors
$success: #10B981
$warning: #F59E0B
$error: #EF4444
$info: #3B82F6

// Neutral Colors
$background-light: #FAFAFA
$background-dark: #1E1E1E
$surface-light: #FFFFFF
$surface-dark: #2D2D2D
$text-primary: #1F2937
$text-secondary: #6B7280
```

#### Typography

```scss
// Font Family
$font-primary: 'Inter', sans-serif
$font-mono: 'JetBrains Mono', monospace

// Font Sizes
$text-xs: 0.75rem    // 12px
$text-sm: 0.875rem   // 14px
$text-base: 1rem     // 16px
$text-lg: 1.125rem   // 18px
$text-xl: 1.25rem    // 20px
$text-2xl: 1.5rem    // 24px
$text-3xl: 1.875rem  // 30px
```

#### Spacing System

```scss
// Based on 4px grid
$space-1: 0.25rem   // 4px
$space-2: 0.5rem    // 8px
$space-3: 0.75rem   // 12px
$space-4: 1rem      // 16px
$space-6: 1.5rem    // 24px
$space-8: 2rem      // 32px
$space-12: 3rem     // 48px
```

#### Animation Timings

```scss
$transition-fast: 150ms
$transition-base: 250ms
$transition-slow: 350ms
$easing: cubic-bezier(0.4, 0, 0.2, 1)
```

### User Flows

#### Flow 1: Adding a New Word

1. User navigates to Word Learning page
2. User types word in input field
3. System validates input and shows suggestions
4. User presses Enter or clicks "Add Word"
5. System shows loading state
6. System fetches dictionary data (phonetics, definitions)
7. System fetches Chinese translation
8. System calls AI for etymology analysis
9. System displays complete word card with all information
10. User can click phonetic to hear pronunciation
11. User can expand/collapse sections
12. Word is automatically saved to localStorage

#### Flow 2: Reviewing Words

1. User navigates to Word Gallery
2. System displays all saved words in cards/table
3. User can filter by mastery level, date, or part of speech
4. User clicks on a word card
5. System shows detailed view with all information
6. User can play audio, read etymology
7. User can mark word as "mastered" or "needs review"
8. System updates mastery score and review count

### Implementation Phases

#### Phase 1: Core Infrastructure (Week 1)

- [ ] Set up Pinia stores (wordStore, aiStore, uiStore)
- [ ] Create type definitions
- [ ] Implement dictionary service
- [ ] Implement translation service
- [ ] Set up AI service integration
- [ ] Create base layout and routing

#### Phase 2: Word Input System (Week 1-2)

- [ ] Build WordInputForm component
- [ ] Implement validation and suggestions
- [ ] Add keyboard shortcuts
- [ ] Create loading and error states
- [ ] Test input flow end-to-end

#### Phase 3: Word Display (Week 2)

- [ ] Build WordCard component
- [ ] Create PhoneticDisplay with audio
- [ ] Implement DefinitionSection (bilingual)
- [ ] Build EtymologySection
- [ ] Add animations and transitions

#### Phase 4: AI Integration (Week 2-3)

- [ ] Set up AI API client
- [ ] Create etymology prompt engineering
- [ ] Implement streaming responses (optional)
- [ ] Add caching for AI responses
- [ ] Handle rate limits and errors

#### Phase 5: UI/UX Polish (Week 3)

- [ ] Implement dark mode
- [ ] Add micro-interactions
- [ ] Optimize animations
- [ ] Ensure accessibility (ARIA, keyboard nav)
- [ ] Mobile responsive design
- [ ] Performance optimization

#### Phase 6: Testing & Documentation (Week 4)

- [ ] Unit tests for services and stores
- [ ] Component tests
- [ ] E2E tests for critical flows
- [ ] Update documentation
- [ ] User guide

## Dependencies

### New NPM Packages

```json
{
  "axios": "^1.6.0", // HTTP client for APIs
  "openai": "^4.20.0", // OpenAI SDK (if using OpenAI)
  "@anthropic-ai/sdk": "^0.9.0", // Anthropic SDK (if using Claude)
  "uuid": "^9.0.0", // Generate unique IDs
  "date-fns": "^3.0.0", // Date formatting
  "zod": "^3.22.0" // Runtime validation
}
```

### API Keys Required

- OpenAI API Key (or Anthropic API Key)
- Translation API Key (Google/DeepL/Azure)

### Environment Variables

```env
VITE_OPENAI_API_KEY=sk-...
VITE_TRANSLATION_API_KEY=...
VITE_DICTIONARY_API_URL=https://api.dictionaryapi.dev/api/v2/entries/en
```

## Risks & Mitigations

### Risk 1: API Rate Limits

**Mitigation**:

- Implement caching for dictionary and translation results
- Add request throttling
- Provide offline mode with cached data

### Risk 2: AI API Costs

**Mitigation**:

- Cache etymology results aggressively
- Implement daily usage limits per user
- Offer option to disable AI features
- Consider using local LLM (Ollama) as alternative

### Risk 3: Audio Playback Issues

**Mitigation**:

- Fallback to Web Speech API
- Provide manual pronunciation guide
- Test across browsers

### Risk 4: localStorage Limits

**Mitigation**:

- Implement data compression
- Add export/import functionality
- Warn users when approaching limits
- Consider IndexedDB for larger storage

## Success Metrics

- [ ] Users can add words in < 3 seconds
- [ ] Phonetic audio plays successfully 95%+ of time
- [ ] AI etymology generates in < 5 seconds
- [ ] Mobile responsive on all screen sizes
- [ ] Accessibility score 95+ (Lighthouse)
- [ ] Performance score 90+ (Lighthouse)
- [ ] Zero critical bugs in production

## Open Questions

1. Which AI provider should we use? (OpenAI vs Anthropic vs Local)
2. Which translation API? (Google vs DeepL vs Azure)
3. Should we support multiple languages beyond English?
4. Do we need user authentication for cloud sync?
5. Should we add spaced repetition algorithm?

## References

- [Free Dictionary API Docs](https://dictionaryapi.dev/)
- [Vuetify 3 Documentation](https://vuetifyjs.com/)
- [Material Design 3](https://m3.material.io/)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
