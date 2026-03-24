# Design: AI Etymology Learning

## Context

The app has an existing `Etymology` data model with fields for roots, origin, evolution, relatedWords, and mnemonic — but these are never populated. Doubao AI is already integrated as an iframe sidebar. We want to add structured AI-powered etymology generation using the Doubao API.

## Goals

- Automatically generate etymology data when a word is added (zero friction)
- Populate the existing `Etymology` type fields with structured AI output
- Display etymology in WordDetail and optionally on WordCard
- Keep the feature optional (works without API key, just skips etymology)

## Non-Goals

- Building a full settings/preferences page (minimal API key config only)
- Replacing the existing iframe AI drawer
- Supporting multiple AI providers for etymology (Doubao only for now)
- Generating etymology for existing words in bulk (only on new word add + manual regenerate)

## Decisions

### 1. API Model Selection

- **Decision**: Use `doubao-1.5-pro-32k` model via Volcengine ARK API
- **Why**: Best balance of quality and cost for structured output. Pro model follows JSON schema instructions more reliably than lite model.
- **Alternative**: `doubao-1.5-lite-32k` (cheaper but less reliable JSON output)

### 2. Prompt Strategy

- **Decision**: Use a system prompt defining the JSON output schema + a user prompt with the word and its context (POS, basic meaning)
- **Why**: Two-prompt approach gives better structured output than single prompt
- **Schema**: Output must match `Etymology` interface exactly

```
System: You are an expert linguist specializing in English etymology.
Given an English word, analyze its roots, origin, evolution, and provide
a creative mnemonic for Chinese learners. Output ONLY valid JSON:
{
  "roots": [{ "root": "string", "meaning": "string (in Chinese)", "language": "string" }],
  "origin": "string (in Chinese, 1-2 sentences)",
  "evolution": "string (in Chinese, brief history)",
  "relatedWords": ["string", ...],  // 3-6 words sharing same root(s)
  "mnemonic": "string (in Chinese, creative memory technique)"
}

User: Word: "structure"
Part of speech: noun, verb
Meaning: a building or framework; to arrange or organize
```

### 3. API Key Storage

- **Decision**: Store in `localStorage` with key `doubao-api-key`, no encryption
- **Why**: Client-side only app, no backend. localStorage is already used for all data. API key is low-risk (personal key, low cost).
- **Alternative**: Encrypted storage — overkill for this context

### 4. Error Handling Strategy

- **Decision**: Fail silently — save word without etymology, log error, allow manual retry from WordDetail
- **Why**: Etymology is enhancement, not core. Must never block word addition.

### 5. Parallel vs Sequential Execution

- **Decision**: Run etymology generation IN PARALLEL with Chinese translation (both start after dictionary fetch)
- **Why**: Reduces total latency. Both API calls are independent.

```
fetchWordData()
  ├── generateChineseMeanings()  [parallel]
  └── generateEtymology()        [parallel]
→ Promise.allSettled() → save word
```

## Risks / Trade-offs

| Risk                                 | Impact                      | Mitigation                                                 |
| ------------------------------------ | --------------------------- | ---------------------------------------------------------- |
| Doubao API changes or deprecates     | Etymology generation breaks | Isolate in single service file; easy to swap provider      |
| AI returns malformed JSON            | Parse failure               | Robust JSON parsing with fallback; validate against schema |
| User exposes API key in localStorage | Security concern (low)      | Document the risk; key is personal, low cost               |
| API latency adds to word add time    | Slower UX                   | Run in parallel; fail silently with timeout (8s)           |
| Token cost accumulates               | Unexpected bills            | Each word ~200 tokens out ≈ ¥0.001; document in UI         |

## Open Questions

1. Should we show etymology content on the card back (flip side) or only in WordDetail? — Recommend: WordDetail only for V1, card back as enhancement later
2. Should the API key config be a modal, a settings page, or inline in the header? — Recommend: Small modal triggered from header menu for V1
