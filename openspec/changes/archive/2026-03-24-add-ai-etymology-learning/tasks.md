# Tasks: Add AI-Powered Etymology Learning (Solution B — Iframe Message Bridge)

> Solution B: Leverage existing Doubao iframe sidebar with pre-crafted etymology prompt.

## 1. Prompt Template Service

- [x] 1.1 Create `src/services/etymologyPrompt.ts` — etymology prompt builder function
- [x] 1.2 Define structured Chinese prompt template for word root/origin analysis

## 2. AI Drawer Enhancement

- [x] 2.1 Add `pendingPrompt` and `hasNewEtymology` state to `useAiDrawer` composable
- [x] 2.2 Add `openWithEtymologyPrompt(word, meanings)` action
- [x] 2.3 Add `clearPendingPrompt()` action
- [x] 2.4 Display pending prompt as a copyable card in `AiDrawer.vue`
- [x] 2.5 Add "Copy Prompt" button with success feedback
- [x] 2.6 Add dismiss button to close the prompt card

## 3. Word Input Integration

- [x] 3.1 Trigger `openWithEtymologyPrompt` after word is added in `Home.vue`
- [x] 3.2 Convert `ChineseMeaning[]` to readable summary string for prompt context
- [x] 3.3 Add 800ms delay so fly-in card animation is visible before drawer opens

## 4. AppHeader Pulse Animation

- [x] 4.1 Bind `hasNewEtymology` to AI button in `AppHeader.vue`
- [x] 4.2 Add `ai-btn-pulse` CSS animation (expanding ring effect)
- [x] 4.3 Auto-clear pulse after 4 seconds

## 5. Testing & Validation

- [x] 5.1 Verify all files have zero new lint errors
- [x] 5.2 Manual test: add word → AI drawer opens → prompt card appears → copy works
- [x] 5.3 Manual test: dismiss prompt card → card disappears
- [x] 5.4 Manual test: AI button pulse animation triggers on word add

## Files Modified

- `src/composables/useAiDrawer.ts` — Added pendingPrompt, hasNewEtymology, openWithEtymologyPrompt, clearPendingPrompt
- `src/services/etymologyPrompt.ts` — **NEW** Etymology prompt template builder
- `src/pages/Home.vue` — Trigger AI etymology prompt after word add
- `src/components/ai/AiDrawer.vue` — Pending prompt card UI with copy functionality
- `src/components/layout/AppHeader.vue` — AI button pulse animation on new etymology
