# 📚 Big Big Word - AI-Powered Vocabulary Learning System

<div align="center">

![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vuetify](https://img.shields.io/badge/Vuetify-3.x-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Master vocabulary with AI-powered learning and stunning UI/UX**

[Features](#-features) • [Quick Start](#-quick-start) • [UI/UX](#-uiux-highlights) • [Documentation](#-documentation)

</div>

---

## 🌟 Overview

Big Big Word is a modern, AI-powered vocabulary learning system designed to help you master new words efficiently. With a beautiful, intuitive interface and intelligent features, learning vocabulary has never been more enjoyable.

### ✨ Key Highlights

- 🎨 **UI/UX Pro Max Design** - Glassmorphism, gradients, and smooth animations
- 🤖 **AI-Powered** - Intelligent word analysis and etymology generation
- 📊 **Progress Tracking** - Visual mastery indicators and statistics
- 🎯 **Smart Learning** - Personalized learning experience
- 📱 **Responsive Design** - Perfect on desktop, tablet, and mobile
- ⚡ **Fast & Modern** - Built with Vue 3 + Vite + TypeScript

---

## 🚀 Features

### Core Features

- ✅ **Word Input & Management** - Add, search, and organize your vocabulary
- ✅ **Automatic Dictionary Lookup** - Fetches phonetics, pronunciation, and definitions automatically
- ✅ **Phonetic Display** - IPA phonetics with audio pronunciation
- ✅ **Dual Language Support** - English and Chinese definitions with automatic translation
- ✅ **Chinese Translation** - Powered by MyMemory Translation API
- ✅ **Etymology Analysis** - AI-generated word roots and origins
- ✅ **Mastery Tracking** - Visual progress indicators
- ✅ **Smart Search** - Real-time filtering and sorting
- ✅ **Export Functionality** - Export words to CSV or JSON format

### UI/UX Features

- 🎨 **Dynamic Gradient Background** - Animated floating orbs
- 🪟 **Glassmorphism Cards** - Modern glass effect design
- ✨ **Smooth Animations** - Hover effects and transitions
- 📊 **Data Visualization** - Progress bars and statistics
- 🎯 **Intuitive Interface** - Clean and user-friendly
- 🌈 **Color-Coded System** - Visual mastery levels

---

## 🎨 UI/UX Highlights

### UI/UX Pro Max Design

**Design Philosophy**

- **Minimalism** - Clean visual hierarchy with purposeful elements
- **Micro-interactions** - Smooth animations and delightful feedback
- **Glassmorphism** - Modern glass-effect cards with backdrop blur
- **Gradient Magic** - Dynamic gradients for depth and visual interest
- **Accessibility First** - ARIA labels, keyboard navigation, focus states
- **Mobile-First** - Perfect experience on all devices

### Modern Design System

- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Gradient System**: Beautiful purple-to-pink gradients
- **Animation Library**: Smooth transitions and micro-interactions
- **Responsive Layout**: Optimized for all screen sizes
- **No Vuetify Required**: Pure CSS with minimal dependencies

### Visual Features

- 🌈 **Dynamic Background** - Animated gradient orbs with floating mesh
- 🪟 **Glass Effect Cards** - Semi-transparent with backdrop blur and elevation
- 🎨 **Gradient Text** - Smooth color transitions with animation
- 📊 **Color-Coded System** - Visual mastery levels (green/orange/red)
- ✨ **Micro-interactions** - Hover effects, scale, rotate, and lift animations
- 🎯 **Smart Empty States** - Contextual messages with clear CTAs
- 🔊 **Audio Playback** - Click-to-play pronunciation with visual feedback
- 📱 **Touch-Optimized** - Large touch targets for mobile devices

### Key Components

- **Hero Section**: Animated logo with pulsing ring and feature badges
- **Input Form**: Modern input with focus states and keyboard shortcuts
- **Statistics Cards**: Gradient icons with trend indicators and progress bars
- **Data Table**: Responsive table with search, pagination, and actions
- **Dialogs**: Blur overlay with smooth animations
- **Toasts**: Slide-in notifications with auto-dismiss

**👉 See [UI_UX_PRO_MAX_REDESIGN.md](./UI_UX_PRO_MAX_REDESIGN.md) for complete design documentation**

---

## 🏃 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd big-big-word

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app in action! 🎉

---

## 📖 Documentation

- 📘 [UI/UX Pro Max Redesign](./UI_UX_PRO_MAX_REDESIGN.md) - Complete design documentation
- 🌐 [Translation Feature](./TRANSLATION_FEATURE.md) - Chinese translation implementation
- 🚀 [Quick Start Guide](./QUICK_START_GUIDE.md) - User-friendly getting started guide
- 📋 [OpenSpec Changes](./openspec/changes/) - Feature specifications
- 🏗️ [Architecture](./openspec/changes/enhanced-word-learning-system/ARCHITECTURE.md) - System architecture

---

## 🛠️ Tech Stack

### Frontend

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vuetify 3** - Material Design component library
- **Pinia** - State management
- **Vue Router** - Client-side routing

### Build Tools

- **Vite** - Next-generation frontend tooling
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Testing

- **Vitest** - Unit testing
- **Playwright** - E2E testing

---

## 📦 Project Structure

```
big-big-word/
├── src/
│   ├── components/          # Vue components
│   │   ├── word-input/     # Input form components
│   │   └── word-display/   # Display components
│   ├── pages/              # Page components
│   ├── stores/             # Pinia stores
│   ├── types/              # TypeScript types
│   ├── router/             # Vue Router config
│   └── App.vue             # Root component
├── openspec/               # OpenSpec documentation
├── public/                 # Static assets
└── README.md              # This file
```

---

## 🎯 Usage

### Adding a Word

1. Type a word in the input field (e.g., "serendipity")
2. **System automatically fetches**:
   - 📢 Phonetic notation (IPA format)
   - 🔊 Audio pronunciation URL
   - 📖 English definitions with examples
   - 🇨🇳 Chinese translations (auto-translated)
   - 🏷️ Parts of speech (noun, verb, adjective, etc.)
   - 🌐 Word origin and etymology
3. Press `Enter` or click "Add Word"
4. View the word in the table with all fetched data

### Viewing Translations

- **Meanings Column**: Shows preview of Chinese and English definitions
- **Click to Expand**: Click the meanings card to see full translations
- **Dual Language**: View both Chinese (🇨🇳) and English (🇬🇧) meanings
- **Multiple Definitions**: See all definitions grouped by part of speech

### Viewing Phonetics & Pronunciation

- **Phonetic Column**: Shows IPA notation (e.g., /ˌserənˈdɪpɪti/)
- **Audio Button**: Click the 🔊 volume icon to hear pronunciation
- **Part of Speech**: See word types displayed as chips

### Searching Words

- Use the search box in the table header
- Real-time filtering as you type
- Search by word, phonetic, or part of speech

### Managing Words

- 👁️ **View** - See detailed information
- ✏️ **Edit** - Modify word details
- 🗑️ **Delete** - Remove from collection
- 📥 **Export** - Download your word collection

### Exporting Words

1. Click the "Export" button in the Word Collection header
2. Choose your preferred format:
   - **CSV** - For spreadsheet applications (Excel, Google Sheets)
   - **JSON** - For backup and programmatic use
3. File will be downloaded automatically with format: `words-export-YYYY-MM-DD.{format}`

### Keyboard Shortcuts

- `Enter` - Submit word
- `Esc` - Clear input
- `Tab` - Navigate between elements

---

## 🎨 Design System

### Color Palette

```css
Primary: #667eea → #764ba2 (Purple gradient)
Success: #4caf50 (Mastery ≥80%)
Warning: #ff9800 (Mastery 50-79%)
Error: #f44336 (Mastery <50%)
```

### Typography

- **Headings**: Inter, 700 weight
- **Body**: Inter, 400 weight
- **Monospace**: JetBrains Mono (for phonetics)

### Spacing

- Base unit: 8px
- Scale: 4px, 8px, 16px, 24px, 32px

---

## 🚧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build           # Production build
npm run preview         # Preview production build

# Testing
npm run test:unit       # Run unit tests
npm run test:e2e        # Run E2E tests

# Code Quality
npm run lint            # Lint code
npm run format          # Format code
```

---

## 📱 Responsive Breakpoints

```
xs: 0-599px      (Mobile)
sm: 600-959px    (Tablet Portrait)
md: 960-1279px   (Tablet Landscape)
lg: 1280-1919px  (Desktop)
xl: 1920px+      (Large Desktop)
```

---

## 🎓 Learning Resources

### Vue 3

- [Vue 3 Documentation](https://vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

### Vuetify 3

- [Vuetify Documentation](https://vuetifyjs.com/)
- [Material Design 3](https://m3.material.io/)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Vuetify team for the beautiful components
- Material Design for design inspiration
- OpenAI for AI capabilities

---

## 📞 Support

If you have any questions or need help, please:

- 📧 Open an issue
- 💬 Start a discussion
- 📖 Check the documentation

---

<div align="center">

**Made with ❤️ and Vue 3**

⭐ Star this repo if you find it helpful!

</div>

---

## 🔧 Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
