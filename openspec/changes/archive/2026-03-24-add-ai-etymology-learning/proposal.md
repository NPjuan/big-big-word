# Change: Add AI-Powered Etymology Learning on Word Input

## Why

When users add a new word, the app currently leaves the `etymology` field empty (roots, mnemonic, etc.). This is a missed opportunity — the **root/etymology method (词根词源法)** is one of the most effective techniques for memorizing English words. By integrating Doubao AI to automatically generate etymology analysis when a word is added, we can turn a simple "add" action into an instant learning moment.

## Current State

- `Etymology` type exists: `{ roots: WordRoot[], origin, evolution, relatedWords[], mnemonic, generatedAt }`
- `WordRoot` type exists: `{ root, meaning, language }`
- `addWord()` sets all etymology fields to empty defaults
- Doubao AI is already integrated as an iframe sidebar (`AiDrawer.vue`) but only as a general chat — no structured data exchange
- `AiProvider` type supports both `'iframe'` and `'api'` integration types, but only iframe is implemented

## What Changes

Integrate Doubao AI into the word input flow to generate structured etymology and mnemonic data. Below are **three proposed solutions** with different trade-offs.

---

## Solution A: Doubao API Direct Integration (Recommended)

### Description

Call Doubao (Volcengine / 火山引擎) HTTP API directly from the frontend with a structured prompt. Parse the AI response into the existing `Etymology` data model and persist it with the word.

### Flow

```
User adds word → fetchWordData() → generateChineseMeanings()
  → [NEW] generateEtymology(word, meanings) via Doubao API
    → Structured prompt asking for: roots, origin, evolution, relatedWords, mnemonic
    → Parse JSON response → populate Word.etymology
  → Save word with full etymology
```

### UI Changes

1. **Loading step**: Add a new progress step `"🧠 Analyzing word roots & etymology..."` in `CompactWordInput`
2. **WordCard**: Show a small "🌱 Etymology" indicator badge when etymology data is available
3. **WordDetail**: New "Etymology & Memory" card section displaying:
   - Word roots with meaning and source language (e.g., `struct- (Latin: to build)`)
   - Word evolution timeline
   - AI-generated mnemonic / memory story (记忆技巧)
   - Related words sharing the same root
4. **Home page card flip back**: Show a brief etymology summary on card back side

### Pros

- ✅ Structured data: AI returns parseable JSON that fills `Etymology` fields precisely
- ✅ Runs automatically on word add — zero friction for user
- ✅ Data persisted in `Word` object — available offline after generation
- ✅ Fast (~1-3s API call), runs in parallel with Chinese translation
- ✅ Can retry/regenerate independently

### Cons

- ❌ Requires Doubao API key (user needs to configure in settings)
- ❌ API costs (Doubao pricing per token, though very cheap ~¥0.0008/1K tokens)
- ❌ New external dependency: Volcengine API endpoint
- ❌ Need error handling for API failures, rate limits

### Technical Details

- **API**: Volcengine Doubao API (`https://ark.cn-beijing.volces.com/api/v3/chat/completions`)
- **Model**: `doubao-1.5-pro-32k` (or `doubao-1.5-lite-32k` for cost saving)
- **Prompt strategy**: System prompt defines output JSON schema; user prompt contains the word + its part of speech + basic meaning for context
- **Config**: API key stored in localStorage (user-configurable settings page)
- **Fallback**: If API fails, etymology remains empty; user can trigger "regenerate" from WordDetail

---

## Solution B: Iframe Message Bridge (No API Key Required)

### Description

Leverage the existing Doubao iframe sidebar. When a word is added, automatically send a pre-crafted prompt to the iframe chat and display the AI response in-context. No structured data extraction — the etymology content lives as a rendered chat response.

### Flow

```
User adds word → normal addWord() flow completes
  → [NEW] Auto-open AI Drawer with pre-filled etymology prompt
  → Doubao iframe shows etymology analysis in chat format
  → User reads the AI response in sidebar
```

### UI Changes

1. **After word add**: Auto-open AI drawer (if not already open) and inject a prompt like:  
   `"请用词根词源法分析单词 'structure'，包含：1)词根拆解 2)词源演变 3)联想记忆法 4)同根词"`
2. **AppHeader AI button**: Show a pulse animation when new etymology content is available
3. **No changes to WordCard or WordDetail** — etymology remains in the sidebar chat

### Pros

- ✅ Zero configuration — uses existing iframe, no API key needed
- ✅ No additional cost — Doubao web chat is free
- ✅ Rich formatted response (markdown, examples, etc.)
- ✅ User can ask follow-up questions naturally

### Cons

- ❌ **No structured data** — cannot populate `Etymology` fields in the data model
- ❌ Response is ephemeral — lost when page refreshes or iframe reloads
- ❌ Cannot run in parallel with word add — opens after word is saved
- ❌ Iframe cross-origin restrictions may prevent `postMessage` injection → might only be able to open the drawer, not auto-fill the prompt
- ❌ User must manually read sidebar — not integrated into card/detail UI
- ❌ Slower: user waits for iframe to load + Doubao to respond

### Technical Details

- **Communication**: `window.postMessage` to iframe (if Doubao allows), or fallback to just opening drawer with a prompt hint text the user can copy
- **Prompt template**: Stored in `services/aiProviders.ts` as a configurable template
- **State**: New field in `useAiDrawer` composable: `pendingPrompt: string | null`

---

## Solution C: Hybrid — API with Iframe Fallback

### Description

Use Doubao API (Solution A) as the primary method when an API key is configured. Fall back to the iframe approach (Solution B) when no API key is available. This gives power users structured data while keeping the app functional for casual users.

### Flow

```
User adds word →
  IF apiKey configured:
    → Solution A flow (structured API call → populate Etymology)
  ELSE:
    → Solution B flow (open iframe with pre-filled prompt)
```

### UI Changes

- **Settings page** (new): API key configuration with validation
- **All UI from Solution A** when API is available
- **Fallback UI from Solution B** when no API key
- **WordDetail**: "Upgrade to API mode for structured etymology" banner when using iframe fallback

### Pros

- ✅ Best of both worlds — structured data when possible, free fallback otherwise
- ✅ Progressive enhancement — works out of the box, improves with config
- ✅ Graceful degradation

### Cons

- ❌ Most complex to implement — two code paths to maintain
- ❌ Inconsistent UX between API and iframe modes
- ❌ Settings page is a new feature scope (currently no settings page exists)
- ❌ Testing burden: need to test both paths

### Technical Details

- **API key check**: `const hasApiKey = computed(() => !!localStorage.getItem('doubao-api-key'))`
- **Service layer**: `services/aiEtymology.ts` with strategy pattern: `ApiEtymologyProvider` and `IframeEtymologyProvider`
- **Settings**: New route `/settings` + `SettingsPage.vue` for API key management

---

## Comparison Matrix

| Criteria                  | Solution A (API)    | Solution B (Iframe) | Solution C (Hybrid)              |
| ------------------------- | ------------------- | ------------------- | -------------------------------- |
| **Setup friction**        | Medium (API key)    | None                | Low (optional key)               |
| **Structured data**       | ✅ Full Etymology   | ❌ None             | ✅ When API available            |
| **Cost**                  | ~¥0.001/word        | Free                | Conditional                      |
| **Offline available**     | ✅ Persisted        | ❌ Ephemeral        | Partial                          |
| **UX integration**        | Deep (card, detail) | Shallow (sidebar)   | Deep when API, shallow otherwise |
| **Implementation effort** | Medium (~3-4 days)  | Low (~1-2 days)     | High (~5-7 days)                 |
| **Maintenance**           | Low                 | Low                 | Medium (two paths)               |
| **User experience**       | ⭐⭐⭐⭐⭐          | ⭐⭐⭐              | ⭐⭐⭐⭐                         |

## Recommendation

**Solution A (Doubao API Direct Integration)** is recommended because:

1. It provides the richest learning experience with structured, persistent etymology data
2. The cost is negligible (~¥0.001 per word, even 10,000 words costs only ¥10)
3. It integrates deeply into the existing UI (card, detail page) without disrupting current UX
4. The `Etymology` and `WordRoot` types already exist — we just need to populate them
5. Implementation is clean: one new service file + minor changes to `addWord()` + UI enhancements

## Impact

- **Affected specs**: None existing (new capability)
- **Affected code**:
  - `src/stores/wordStore.ts` — `addWord()` action (add etymology generation step)
  - `src/services/aiEtymology.ts` — **NEW** AI etymology service
  - `src/types/aiProvider.types.ts` — Add API config types
  - `src/components/word-display/WordCard.vue` — Etymology badge
  - `src/pages/WordDetail.vue` — Etymology & Memory card section
  - `src/components/word-input/CompactWordInput.vue` — New loading step
  - `src/pages/Home.vue` — Card back etymology summary (optional)
