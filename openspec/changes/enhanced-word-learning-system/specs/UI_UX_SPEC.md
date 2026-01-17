# UI/UX Design Specification

## Design Philosophy

Big Big Word follows **Material Design 3** principles with a focus on:

- **Clarity**: Information is easy to find and understand
- **Efficiency**: Users can accomplish tasks quickly
- **Delight**: Subtle animations and interactions create joy
- **Accessibility**: Everyone can use the app effectively

## Design System

### Color Palette

#### Light Theme

```scss
// Primary Colors
$primary-50: #EEF2FF
$primary-100: #E0E7FF
$primary-200: #C7D2FE
$primary-300: #A5B4FC
$primary-400: #818CF8
$primary-500: #6366F1  // Main primary
$primary-600: #4F46E5
$primary-700: #4338CA
$primary-800: #3730A3
$primary-900: #312E81

// Secondary Colors
$secondary-50: #FCE7F3
$secondary-100: #FBCFE8
$secondary-200: #F9A8D4
$secondary-300: #F472B6
$secondary-400: #EC4899  // Main secondary
$secondary-500: #DB2777
$secondary-600: #BE185D
$secondary-700: #9D174D
$secondary-800: #831843
$secondary-900: #701A3A

// Accent Colors
$accent-50: #ECFDF5
$accent-100: #D1FAE5
$accent-200: #A7F3D0
$accent-300: #6EE7B7
$accent-400: #34D399
$accent-500: #10B981  // Main accent
$accent-600: #059669
$accent-700: #047857
$accent-800: #065F46
$accent-900: #064E3B

// Semantic Colors
$success: #10B981
$warning: #F59E0B
$error: #EF4444
$info: #3B82F6

// Neutral Colors
$gray-50: #FAFAFA
$gray-100: #F5F5F5
$gray-200: #E5E5E5
$gray-300: #D4D4D4
$gray-400: #A3A3A3
$gray-500: #737373
$gray-600: #525252
$gray-700: #404040
$gray-800: #262626
$gray-900: #171717

// Surface Colors
$surface: #FFFFFF
$background: #FAFAFA
$surface-variant: #F5F5F5
```

#### Dark Theme

```scss
// Surface Colors
$surface-dark: #1E1E1E
$background-dark: #121212
$surface-variant-dark: #2D2D2D

// Adjusted Primary (lighter for dark bg)
$primary-dark: #A5B4FC

// Text Colors
$text-primary-dark: #E5E5E5
$text-secondary-dark: #A3A3A3
```

### Typography

#### Font Families

```scss
// Primary Font (UI Text)
$font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
               'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif

// Monospace Font (Phonetics, Code)
$font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace

// Serif Font (Optional for headings)
$font-serif: 'Merriweather', 'Georgia', serif
```

#### Font Scales

```scss
// Display (Large headings)
$text-display-lg: 3.75rem    // 60px
$text-display-md: 3rem       // 48px
$text-display-sm: 2.25rem    // 36px

// Headings
$text-h1: 2rem               // 32px
$text-h2: 1.75rem            // 28px
$text-h3: 1.5rem             // 24px
$text-h4: 1.25rem            // 20px
$text-h5: 1.125rem           // 18px
$text-h6: 1rem               // 16px

// Body Text
$text-body-lg: 1.125rem      // 18px
$text-body-md: 1rem          // 16px (base)
$text-body-sm: 0.875rem      // 14px

// Utility Text
$text-caption: 0.75rem       // 12px
$text-overline: 0.625rem     // 10px

// Font Weights
$font-light: 300
$font-regular: 400
$font-medium: 500
$font-semibold: 600
$font-bold: 700
$font-extrabold: 800

// Line Heights
$leading-tight: 1.25
$leading-normal: 1.5
$leading-relaxed: 1.75
$leading-loose: 2
```

### Spacing System

Based on 4px grid system:

```scss
$space-0: 0
$space-1: 0.25rem    // 4px
$space-2: 0.5rem     // 8px
$space-3: 0.75rem    // 12px
$space-4: 1rem       // 16px
$space-5: 1.25rem    // 20px
$space-6: 1.5rem     // 24px
$space-8: 2rem       // 32px
$space-10: 2.5rem    // 40px
$space-12: 3rem      // 48px
$space-16: 4rem      // 64px
$space-20: 5rem      // 80px
$space-24: 6rem      // 96px
```

### Border Radius

```scss
$radius-none: 0
$radius-sm: 0.25rem      // 4px
$radius-md: 0.5rem       // 8px
$radius-lg: 0.75rem      // 12px
$radius-xl: 1rem         // 16px
$radius-2xl: 1.5rem      // 24px
$radius-full: 9999px     // Pill shape
```

### Shadows

```scss
// Elevation Levels
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06)
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05)
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04)
$shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

// Colored Shadows (for emphasis)
$shadow-primary: 0 10px 15px -3px rgba(99, 102, 241, 0.3)
$shadow-success: 0 10px 15px -3px rgba(16, 185, 129, 0.3)
$shadow-error: 0 10px 15px -3px rgba(239, 68, 68, 0.3)
```

### Animation & Transitions

```scss
// Duration
$duration-fast: 150ms
$duration-base: 250ms
$duration-slow: 350ms
$duration-slower: 500ms

// Easing Functions
$ease-in: cubic-bezier(0.4, 0, 1, 1)
$ease-out: cubic-bezier(0, 0, 0.2, 1)
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
$ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
$ease-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6)

// Common Transitions
$transition-all: all $duration-base $ease-in-out
$transition-colors: color $duration-base $ease-in-out,
                    background-color $duration-base $ease-in-out,
                    border-color $duration-base $ease-in-out
$transition-transform: transform $duration-base $ease-in-out
$transition-opacity: opacity $duration-base $ease-in-out
```

## Component Specifications

### 1. Word Input Form

#### Visual Design

- **Container**: White card with subtle shadow
- **Elevation**: 2 (md shadow)
- **Border Radius**: 16px (xl)
- **Padding**: 24px
- **Max Width**: 600px

#### States

1. **Default**: Clean, inviting input field
2. **Focus**: Primary color border, elevated shadow
3. **Loading**: Animated progress indicator
4. **Error**: Red border, error message below
5. **Success**: Brief green checkmark animation

#### Interactions

- **Hover**: Slight elevation increase (2px translateY)
- **Click**: Scale down slightly (0.98)
- **Type**: Real-time validation feedback

### 2. Word Card

#### Layout Structure

```
┌─────────────────────────────────────┐
│  Word Title                    [🔊] │
│  /fəˈnetɪk/                         │
├─────────────────────────────────────┤
│  📖 English Meaning                 │
│  • Definition 1                     │
│  • Definition 2                     │
│                                     │
│  🇨🇳 Chinese Meaning                │
│  • 定义 1                           │
│  • 定义 2                           │
├─────────────────────────────────────┤
│  🌳 Etymology (Expandable)          │
│  [Collapsed by default]             │
└─────────────────────────────────────┘
```

#### Visual Design

- **Container**: Card with gradient border
- **Elevation**: 1 (sm shadow), 3 on hover
- **Border Radius**: 12px (lg)
- **Padding**: 20px
- **Background**: White with subtle gradient overlay

#### Color Coding

- **Noun**: Blue accent
- **Verb**: Green accent
- **Adjective**: Purple accent
- **Adverb**: Orange accent

### 3. Phonetic Display

#### Visual Design

- **Shape**: Rounded chip/pill
- **Background**: Primary color (tonal variant)
- **Icon**: Volume icon (animated on play)
- **Font**: Monospace (JetBrains Mono)
- **Size**: Large (48px height)

#### States

1. **Idle**: Static volume icon
2. **Hover**: Scale 1.05, cursor pointer
3. **Playing**: Pulsing animation on icon
4. **Error**: Red tint, error icon

#### Animation

```scss
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}
```

### 4. Etymology Section

#### Visual Design

- **Container**: Tonal card (success color)
- **Icon**: Tree icon (representing roots)
- **Expandable**: Accordion-style
- **Border**: Left accent border (4px)

#### Content Sections

1. **Origin**: Historical background
2. **Roots**: Chip group with root + meaning
3. **Evolution**: Timeline-style text
4. **Mnemonic**: Highlighted box with lightbulb icon
5. **Related Words**: Chip group

#### Loading State

- Skeleton loaders for each section
- Shimmer animation effect

### 5. Definition Section

#### Layout

```
┌─────────────────────────────────────┐
│  📖 English                          │
│  ┌─────────────────────────────┐   │
│  │ noun                        │   │
│  │ 1. First definition         │   │
│  │ 2. Second definition        │   │
│  │ Example: "..."              │   │
│  └─────────────────────────────┘   │
│                                     │
│  🇨🇳 中文                            │
│  ┌─────────────────────────────┐   │
│  │ 名词                        │   │
│  │ 1. 第一个定义               │   │
│  │ 2. 第二个定义               │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Visual Design

- **Sections**: Separated by subtle divider
- **Part of Speech**: Badge/chip style
- **Definitions**: Numbered list
- **Examples**: Italic, indented, gray text

## Page Layouts

### Word Learning Page

```
┌─────────────────────────────────────────────┐
│  Header                                     │
│  ┌─────────────────────────────────────┐   │
│  │  Big Big Word  [🌙] [⚙️]            │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Main Content                               │
│  ┌─────────────────────────────────────┐   │
│  │  Word Input Form                    │   │
│  │  [Enter a word...]          [Add]   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Word Card (if word added)          │   │
│  │  ...                                │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Recent Words (Quick Access)        │   │
│  │  [word1] [word2] [word3]            │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Word Gallery Page

```
┌─────────────────────────────────────────────┐
│  Header + Filters                           │
│  ┌─────────────────────────────────────┐   │
│  │  [Search] [Filter] [Sort]           │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Word Grid                                  │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│  │Word1│ │Word2│ │Word3│ │Word4│          │
│  └─────┘ └─────┘ └─────┘ └─────┘          │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│  │Word5│ │Word6│ │Word7│ │Word8│          │
│  └─────┘ └─────┘ └─────┘ └─────┘          │
└─────────────────────────────────────────────┘
```

## Responsive Design

### Breakpoints

```scss
$breakpoint-xs: 0px       // Phone
$breakpoint-sm: 600px     // Tablet portrait
$breakpoint-md: 960px     // Tablet landscape
$breakpoint-lg: 1280px    // Desktop
$breakpoint-xl: 1920px    // Large desktop
```

### Mobile Adaptations (< 600px)

- Single column layout
- Larger touch targets (min 44px)
- Bottom navigation bar
- Simplified word cards
- Collapsible sections by default

### Tablet Adaptations (600px - 960px)

- Two column grid for word gallery
- Side drawer navigation
- Larger typography

### Desktop (> 960px)

- Three column grid for word gallery
- Persistent navigation sidebar
- Hover effects enabled
- Keyboard shortcuts visible

## Micro-interactions

### 1. Word Added Success

```
1. Input field: Green checkmark appears
2. Card: Slides in from bottom with bounce
3. Confetti animation (optional)
4. Success toast notification
```

### 2. Audio Play

```
1. Click phonetic chip
2. Icon changes to volume-high
3. Pulsing animation starts
4. Audio plays
5. Animation stops when complete
```

### 3. Etymology Expand

```
1. Click etymology header
2. Rotate chevron icon 180°
3. Content slides down with fade-in
4. Smooth height transition
```

### 4. Card Hover (Desktop)

```
1. Mouse enters card
2. Elevation increases (shadow grows)
3. Slight scale increase (1.02)
4. Border glow effect
```

## Accessibility Features

### Keyboard Navigation

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons, play audio
- **Escape**: Close modals, clear input
- **Arrow Keys**: Navigate lists

### Screen Reader Support

- Proper ARIA labels on all interactive elements
- Live regions for dynamic content
- Semantic HTML structure
- Alt text for icons

### Focus Management

- Visible focus indicators (2px outline)
- Focus trap in modals
- Skip to main content link
- Logical tab order

### Color Contrast

- Text: Minimum 4.5:1 ratio (WCAG AA)
- Large text: Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio
- Test with color blindness simulators

## Dark Mode

### Color Adjustments

```scss
// Dark theme overrides
.dark-theme {
  --surface: #{$surface-dark};
  --background: #{$background-dark};
  --text-primary: #{$text-primary-dark};
  --text-secondary: #{$text-secondary-dark};
  --primary: #{$primary-dark};

  // Reduce shadow opacity
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);

  // Adjust borders
  --border-color: rgba(255, 255, 255, 0.12);
}
```

### Toggle Implementation

- Smooth transition between themes (350ms)
- Persist preference in localStorage
- System preference detection
- Toggle button in header

## Loading States

### Skeleton Loaders

```
┌─────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓                         │
│  ▓▓▓▓▓▓▓                            │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
└─────────────────────────────────────┘
```

### Shimmer Effect

```scss
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, $gray-200 0%, $gray-300 50%, $gray-200 100%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

## Error States

### Error Message Design

- **Icon**: Alert circle icon
- **Color**: Error red
- **Position**: Below input or inline
- **Action**: Retry button when applicable
- **Dismissible**: Close button

### Error Types

1. **Validation Error**: Inline, immediate feedback
2. **Network Error**: Toast notification with retry
3. **API Error**: Alert banner with details
4. **Not Found**: Empty state illustration

## Empty States

### No Words Yet

```
┌─────────────────────────────────────┐
│           📚                        │
│     No words yet!                   │
│  Start building your vocabulary    │
│     [Add Your First Word]           │
└─────────────────────────────────────┘
```

### Search No Results

```
┌─────────────────────────────────────┐
│           🔍                        │
│     No results found                │
│  Try a different search term        │
│     [Clear Search]                  │
└─────────────────────────────────────┘
```

## Performance Considerations

### Animation Performance

- Use `transform` and `opacity` for animations
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Reduce motion for users with preference

### Image Optimization

- Lazy load images
- Use appropriate formats (WebP with fallback)
- Responsive images with srcset
- Compress assets

### Code Splitting

- Route-based code splitting
- Lazy load heavy components
- Dynamic imports for AI service

## Design Tokens (Vuetify Configuration)

```typescript
// src/plugins/vuetify.ts
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#6366F1',
          secondary: '#EC4899',
          accent: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
          success: '#10B981',
          background: '#FAFAFA',
          surface: '#FFFFFF',
        },
      },
      dark: {
        colors: {
          primary: '#A5B4FC',
          secondary: '#F472B6',
          accent: '#34D399',
          error: '#F87171',
          warning: '#FBBF24',
          info: '#60A5FA',
          success: '#34D399',
          background: '#121212',
          surface: '#1E1E1E',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none;',
      rounded: 'lg',
    },
    VCard: {
      rounded: 'lg',
      elevation: 2,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
  },
})
```

## Figma Design File Structure

```
Big Big Word Design System
├── 🎨 Design Tokens
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Shadows
├── 🧩 Components
│   ├── Buttons
│   ├── Input Fields
│   ├── Cards
│   ├── Chips
│   └── Icons
├── 📱 Pages
│   ├── Word Learning
│   ├── Word Gallery
│   └── Settings
└── 📐 Layouts
    ├── Mobile
    ├── Tablet
    └── Desktop
```

## Implementation Checklist

- [ ] Set up design tokens in Vuetify config
- [ ] Create reusable component library
- [ ] Implement dark mode toggle
- [ ] Add loading skeletons
- [ ] Create error state components
- [ ] Implement responsive layouts
- [ ] Add micro-interactions
- [ ] Test accessibility
- [ ] Optimize animations
- [ ] Test on multiple devices
