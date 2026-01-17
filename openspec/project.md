# Project Context

## Purpose

Big Big Word is a vocabulary learning application designed to help users build and manage their English word collection. The app allows users to add new words, automatically fetch word details (phonetics, meanings, parts of speech) from a dictionary API, and organize their vocabulary with timestamps. It provides features for word pronunciation playback and persistent storage using localStorage.

## Tech Stack

- **Frontend Framework**: Vue 3 (Composition API with `<script setup>`)
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Framework**: Vuetify 3 (Material Design components)
- **Styling**: TailwindCSS 4.x + Sass
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Testing**: Vitest (unit tests) + Playwright (e2e tests)
- **Code Quality**: ESLint + Prettier
- **Node Version**: ^20.19.0 || >=22.12.0

## Project Conventions

### Code Style

- Use Composition API with `<script setup>` syntax for all Vue components
- TypeScript strict mode enabled
- Use `const` for functions (e.g., `const handleClick = () => {}`)
- Event handlers should be prefixed with "handle" (e.g., `handleClick`, `handleKeyDown`)
- Use descriptive variable and function names
- Prefer early returns to reduce nesting
- Use TailwindCSS classes for styling; avoid inline styles or `<style>` tags with custom CSS
- Use `class:` syntax over ternary operators when possible
- Format code with Prettier (configured with `.prettierrc.json`)
- Lint with ESLint (configured with `eslint.config.ts`)

### Architecture Patterns

- **Component Structure**: Pages in `src/pages/`, reusable components would go in `src/components/`
- **Routing**: Centralized in `src/router/index.ts`
- **State Management**: Pinia stores in `src/stores/`
- **Utilities**: Pure functions in `src/utils/`
- **Type Definitions**: Interfaces and types defined alongside their usage or in utility files
- **Data Persistence**: localStorage for client-side data storage
- **API Integration**: Fetch API for external dictionary services

### Testing Strategy

- Unit tests with Vitest for utility functions and component logic
- E2E tests with Playwright for critical user flows
- Test files located in `src/__tests__/` and `e2e/`
- Run tests with `npm run test:unit` and `npm run test:e2e`

### Git Workflow

- Standard Git workflow with feature branches
- Commit messages should be clear and descriptive
- Use `.editorconfig` for consistent editor settings across team

## Domain Context

This is a vocabulary learning application focused on English language learners. Key domain concepts:

- **Word**: Core entity with properties: word text, phonetic transcription, parts of speech, participle forms, English meaning, and creation timestamp
- **Word Gallery**: Main view displaying all saved words in a data table
- **Study Mode**: Planned feature for practicing vocabulary
- **Stats**: Planned feature for tracking learning progress
- **Settings**: Planned feature for app configuration

## Important Constraints

- Client-side only application (no backend server)
- Data stored in browser localStorage (limited to ~5-10MB)
- Relies on external Free Dictionary API (`https://api.dictionaryapi.dev/api/v2/entries/en/{word}`)
- Speech synthesis depends on browser support for Web Speech API
- Must work in modern browsers (Chromium-based, Firefox)

## External Dependencies

- **Free Dictionary API**: `https://api.dictionaryapi.dev/api/v2/entries/en/{word}` - Provides word definitions, phonetics, parts of speech, and meanings
- **Web Speech API**: Browser-native API for text-to-speech pronunciation
- **Material Design Icons**: `@mdi/font` for UI icons
