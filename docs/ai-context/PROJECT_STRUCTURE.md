# Big Big Word — Project Structure Overview

> This document is designed for AI assistants to quickly understand the project's architecture, file organization, data flow, and key design decisions.

---

## 1. Project Identity

| Field               | Value                                                                        |
| ------------------- | ---------------------------------------------------------------------------- |
| **Name**            | Big Big Word                                                                 |
| **Description**     | AI-powered English vocabulary learning web application with Chrome extension |
| **Tech Stack**      | Vue 3 + TypeScript + Vite 7 + Vuetify 3 + Tailwind CSS 4 + Pinia 3           |
| **Package Manager** | pnpm (also has package-lock.json for npm compatibility)                      |
| **Node Version**    | ^20.19.0 \|\| >=22.12.0                                                      |
| **Test Framework**  | Vitest (unit) + Playwright (e2e)                                             |
| **Linting**         | ESLint + Prettier                                                            |

---

## 2. Top-Level Directory Structure

```
big-big-word/
├── src/                    # Main Vue application source
├── extension/              # Chrome extension (standalone, no build step)
├── docs/                   # Documentation files
├── openspec/               # Feature specs and proposals
├── public/                 # Static assets (favicon etc.)
├── dist/                   # Build output
├── e2e/                    # Playwright e2e tests
├── index.html              # Vite entry HTML
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Vitest configuration
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json           # TypeScript config (project references)
├── tsconfig.app.json       # TypeScript config for app code
├── tsconfig.node.json      # TypeScript config for Node tooling
├── eslint.config.ts        # ESLint flat config
├── .prettierrc.json        # Prettier config
└── package.json            # Dependencies and scripts
```

---

## 3. Source Code Structure (`src/`)

```
src/
├── main.ts                          # App entry: creates Vue app with Vuetify, Pinia, Router
├── App.vue                          # Root component: <v-app> + <router-view>, beforeunload save
│
├── router/
│   └── index.ts                     # Vue Router (web history mode, 4 routes under MainLayout)
│
├── layouts/
│   └── MainLayout.vue               # Main layout: fixed header + scrollable content + AI drawer
│
├── pages/                           # Route-level page components
│   ├── Home.vue                     # Home/Learn page: card stack + swipe + word input
│   ├── ReviewSession.vue            # Review page: quiz modes (MC, spelling, listening, mixed)
│   ├── WordDetail.vue               # Word detail page: full word info, pronunciation, forms
│   ├── WordHistory.vue              # History page: grid/table view of all words
│   └── WordLearning.vue             # Learning page (additional learning features)
│
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue            # Global header: logo, nav, stats, AI toggle, import/export
│   │   └── StatsSidebar.vue         # Statistics sidebar component
│   ├── word-display/
│   │   ├── WordCard.vue             # Swipeable word card with flip, drag, fly-in animation
│   │   ├── WordGrid.vue             # Grid view for word history
│   │   └── WordTable.vue            # Table view for word history
│   ├── word-input/
│   │   ├── CompactWordInput.vue     # Floating compact input bar (used on Home page)
│   │   └── WordInputForm.vue        # Full-size word input form
│   ├── quiz/
│   │   ├── MultipleChoiceQuiz.vue   # EN→CN multiple choice quiz
│   │   ├── SpellingQuiz.vue         # CN→EN spelling quiz
│   │   └── ListeningQuiz.vue        # Audio→EN listening quiz
│   ├── ai/
│   │   └── AiDrawer.vue            # Side-by-side AI assistant drawer (iframe-based)
│   └── stats/                       # (empty — stats displayed inline in header)
│
├── stores/
│   └── wordStore.ts                 # Pinia store: all word state, CRUD, SRS algorithm
│
├── composables/
│   └── useAiDrawer.ts               # Singleton composable for AI drawer state
│
├── services/
│   ├── dictionaryApi.ts             # Free Dictionary API + MyMemory Translation API
│   ├── wordFormsApi.ts              # Rule-based word inflection generator
│   └── aiProviders.ts               # AI provider registry (Doubao etc.)
│
├── types/
│   ├── word.types.ts                # Word, ChineseMeaning, EnglishMeaning, Etymology, WordForms
│   └── aiProvider.types.ts          # AiProvider, AiDrawerState interfaces
│
├── utils/
│   ├── audioUtils.ts                # Audio playback + TTS fallback + voice detection
│   ├── normaliseWord.ts             # Deep word object normalisation (schema migration)
│   └── wordExport.ts                # CSV/JSON export + JSON import + file download
│
├── data/
│   └── defaultWords.ts              # Pre-loaded default words for new users
│
├── styles/
│   └── settings.scss                # Vuetify SCSS variable overrides
│
└── __tests__/
    └── App.spec.ts                  # Basic app mount test
```

---

## 4. Routing

All routes are children of `MainLayout.vue` (which provides header + AI drawer):

| Path        | Name          | Component           | Description                      |
| ----------- | ------------- | ------------------- | -------------------------------- |
| `/`         | `home`        | `Home.vue`          | Card stack learning + word input |
| `/history`  | `history`     | `WordHistory.vue`   | All words in grid/table view     |
| `/review`   | `review`      | `ReviewSession.vue` | Quiz-based review sessions       |
| `/word/:id` | `word-detail` | `WordDetail.vue`    | Detailed word page               |

---

## 5. State Management (Pinia)

### `wordStore` — Single store for all word data

**Persistence**: `localStorage` with key `big-big-words`, debounced save (300ms), schema versioning.

#### State

- `words: Word[]` — All user words
- `isLoading: boolean` — Loading state during API calls
- `loadingStep: string` — Progress message for UI
- `error: string | null` — Error message

#### Key Computed

- `wordCount` — Total words
- `masteredWords` — Words with mastery ≥ 80
- `recentWords` — 10 most recently added
- `wordsByReviewPriority` — Sorted by SRS: due first → overdue → not yet due → lower mastery → harder
- `dueWords` / `dueWordsCount` — Words currently due for review

#### Key Actions

- `addWord(text)` — Fetch from Dictionary API → translate → save
- `deleteWord(id)` / `updateWord(id, updates)`
- `updateMasteryRight(id)` — Swipe right = quality 5 (perfect recall)
- `updateMasteryLeft(id)` — Swipe left = quality 2 (incorrect)
- `reviewWithQuality(id, quality)` — Generic review with SM-2 quality (0-5)
- `importWords(words)` — Merge import with conflict resolution
- `loadWords()` / `saveWords()` / `saveWordsImmediate()`

#### SM-2 SRS Algorithm

The store implements the SuperMemo SM-2 algorithm:

- `easeFactor`: 1.3 ~ 2.5 (higher = easier)
- `reviewInterval`: Days until next review
- `consecutiveCorrect`: Streak counter
- `nextReviewDate`: ISO date string
- Quality < 3 → reset interval to 1 day
- Quality ≥ 3 → increase interval: 1 → 3 → n \* easeFactor

---

## 6. Data Model

### `Word` (core entity)

```typescript
interface Word {
  id: string // UUID
  word: string // Lowercase word text
  phonetic: string // IPA phonetic notation
  audioUrl?: string // Pronunciation audio URL
  partOfSpeech: string[] // ["noun", "verb", ...]
  chineseMeaning: ChineseMeaning[] // Translated definitions
  englishMeaning: EnglishMeaning[] // Original English definitions
  etymology: Etymology // Word origin and roots
  createdAt: string // ISO date
  lastReviewed?: string // ISO date
  reviewCount: number // Total reviews
  mastery: number // 0-100 proficiency score
  // SRS fields
  nextReviewDate: string // When to review next
  reviewInterval: number // Current interval in days
  easeFactor: number // SM-2 ease factor
  consecutiveCorrect: number // Correct streak
}
```

### Nested Types

- **ChineseMeaning**: `{ partOfSpeech, definitions[], examples[] }`
- **EnglishMeaning**: `{ partOfSpeech, definitions[], examples[], synonyms[], antonyms[] }`
- **Etymology**: `{ roots: WordRoot[], origin, evolution, relatedWords[], mnemonic, generatedAt }`
- **WordForms**: `{ pastTense?, plural?, comparative?, noun?, verb?, adjective?, adverb?, ... }`

---

## 7. External APIs & Services

### Dictionary API

- **Provider**: [Free Dictionary API](https://dictionaryapi.dev/)
- **Endpoint**: `GET https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
- **Data**: Definitions, phonetics, audio URLs, synonyms, antonyms, origin

### Translation API

- **Provider**: [MyMemory Translation API](https://mymemory.translated.net/)
- **Endpoint**: `GET https://api.mymemory.translated.net/get?q={text}&langpair=en|zh-CN`
- **Optimization**: Batch translation — concatenates texts with `|||` separator to reduce requests
- **Concurrency**: Max 2 parallel requests with small delays

### Word Forms

- **Provider**: Rule-based (no external API)
- **Implementation**: `wordFormsApi.ts` — generates inflections using English morphology rules
- **Covers**: Past tense, past participle, present participle, third person, plural, comparative, superlative

### AI Assistant

- **Provider**: Doubao (ByteDance) via iframe embed
- **URL**: `https://www.doubao.com/chat/`
- **Integration**: Side-by-side drawer, configurable width

---

## 8. Key UI Features & Interactions

### Home Page (`Home.vue`)

- **Card Stack**: Displays up to 4 word cards stacked with perspective transforms
- **Swipe Gestures**: Drag left (don't know) / right (know) with SRS mastery update
- **Fly-in Animation**: New words fly in from bottom with CSS animation on the real card
- **Floating Input**: `CompactWordInput` pinned at bottom with loading progress tips
- **Easter Egg**: Typing certain keywords triggers floating hearts animation

### Review Session (`ReviewSession.vue`)

- **4 Quiz Modes**:
  - Multiple Choice (EN→CN): See English word, pick Chinese meaning
  - Spelling (CN→EN): See Chinese meaning, type English word
  - Listening (AUDIO→EN): Hear pronunciation, type the word
  - Mixed: Random combination of all modes
- **Session Config**: 5/10/15/20 words per session
- **Progress Tracking**: Progress bar, correct/wrong counter
- **SRS Integration**: Each answer updates word's SM-2 parameters via `reviewWithQuality()`

### Word Detail (`WordDetail.vue`)

- **Full Word Info**: Phonetic with audio playback, all definitions, examples
- **Mastery Display**: Color-coded mastery badge (high/medium/low)
- **Word Forms**: Verb conjugations, noun plurals, adjective comparisons
- **Related Words**: Synonyms and antonyms from dictionary data

### Word History (`WordHistory.vue`)

- **Two View Modes**: Grid (WordGrid) and Table (WordTable), persisted to localStorage
- **Features**: Search, sort, delete, click to navigate to detail

### Header (`AppHeader.vue`)

- **Navigation**: Learn / Review / History tabs with active state
- **Stats**: Word count, mastery percentage, due words badge
- **Import/Export**: JSON import with merge/conflict resolution, CSV/JSON export
- **AI Toggle**: Opens/closes the AI drawer

---

## 9. Design System & Visual Style

- **Color Theme**: Teal/emerald gradient (`#0d9488` primary, `#2dd4bf` accent)
- **Background**: Multi-color gradient with animated orbs and mesh overlay
- **Card Style**: Glass morphism with backdrop blur, soft shadows, rounded corners
- **Typography**: Inter font family, bold weights, gradient text effects
- **Icons**: Inline SVG (no icon library dependency for core UI), MDI for Vuetify components
- **Animations**: CSS transitions and keyframes, cubic-bezier easing, `prefers-reduced-motion` support
- **Responsive**: Mobile-first breakpoints at 480px, 768px, 1024px

---

## 10. Chrome Extension (`extension/`)

A standalone Chrome extension (Manifest V3) that works independently from the web app.

```
extension/
├── manifest.json           # MV3 manifest
├── background.js           # Service worker (context menu, message handling)
├── content.js              # Content script (word selection popup on any webpage)
├── content.css             # Styles for content script popup
├── popup/
│   ├── popup.html          # Extension popup UI
│   ├── popup.js            # Popup logic
│   └── popup.css           # Popup styles
├── lib/
│   ├── types.js            # Shared type definitions
│   └── api.js              # API utilities
└── icons/                  # Extension icons (16/32/48/128px PNG + SVG source)
```

**Features**:

- Select text on any webpage → see translation and definition
- Keyboard shortcut: `Ctrl+Shift+T` (Mac: `Cmd+Shift+T`)
- Right-click context menu to translate selection
- Popup for quick word lookup
- Uses the same Dictionary API as the main app

---

## 11. Build & Development

### Scripts

```bash
pnpm dev              # Start Vite dev server
pnpm build            # Production build (silent warnings)
pnpm preview          # Preview production build
pnpm test:unit        # Run Vitest
pnpm test:e2e         # Run Playwright
pnpm type-check       # vue-tsc type checking
pnpm lint             # ESLint fix with cache
pnpm format           # Prettier format
```

### Vite Configuration

- **Plugins**: Vue, Vue JSX, Vue DevTools, Tailwind CSS (v4), Vuetify
- **Alias**: `@` → `src/`
- **Build**: Suppressed warnings, chunk size limit 1000KB, no compressed size report
- **Log Level**: Error only (minimal console output)

---

## 12. Data Flow Diagrams

### Adding a New Word

```
User types word in CompactWordInput
  → handleSubmit() validates input
  → wordStore.addWord(text)
    → fetchWordData() from Dictionary API
      → extract phonetics, meanings, audio URL
    → generateChineseMeanings() via MyMemory Translation
      → batch translate definitions and examples
    → fetchWordForms() via rule-based engine
    → create Word object with SRS defaults (easeFactor: 2.5, interval: 0)
    → words.unshift(newWord)
    → debounced saveWords() → localStorage
  → CompactWordInput emits 'word-added'
  → Home.vue handleWordAdded()
    → unshift new word into displayWords with _flyIn: true
    → WordCard renders with fly-in CSS animation
    → After 650ms, clear _flyIn flag → card becomes fully interactive
```

### Swipe Review (Home Page)

```
User drags WordCard left/right
  → WordCard tracks drag position, emits 'drag' with dragX
  → On release past threshold: emits 'swipe-left' or 'swipe-right'
  → Home.vue handleSwipeRight/Left()
    → wordStore.updateMasteryRight/Left(id) updates SRS fields
    → displayWords.shift() removes top card
    → pickNextWord() finds next priority word not in current display
    → Push new word to end of displayWords
    → TransitionGroup animates card transitions
```

### Quiz Review Session

```
User selects quiz mode + word count
  → startSession(mode)
    → Pick N words from wordsByReviewPriority
    → Shuffle selection
    → For mixed mode: assign random quiz types per word
  → Render quiz component (MultipleChoice/Spelling/Listening)
  → User answers → handleAnswer({ correct, quality })
    → wordStore.reviewWithQuality(id, quality) → SM-2 update
    → Advance to next word or show results
  → Results screen: accuracy %, option to retry or choose new mode
```

---

## 13. Key Design Decisions

1. **No backend / no auth**: Pure client-side app, all data in localStorage
2. **SM-2 SRS**: Industry-standard spaced repetition for long-term retention
3. **Batch translation**: Minimize API calls by concatenating texts with separator
4. **Rule-based word forms**: Avoids dependency on paid APIs (Words API)
5. **Iframe AI integration**: Embed external AI chatbots without API keys
6. **Schema versioning**: `normaliseWord()` ensures backward compatibility when data model changes
7. **Debounced persistence**: Avoid excessive localStorage writes during rapid actions
8. **CSS animations over JS**: Better performance, respects `prefers-reduced-motion`
9. **Component architecture**: Pages are route-level, components are reusable UI pieces
10. **Singleton composables**: `useAiDrawer` uses module-level state for global sharing
