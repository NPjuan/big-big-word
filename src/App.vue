<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup lang="ts"></script>

<style>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100vh;
  height: 100dvh; /* Use dvh for better mobile support */
  overflow: hidden; /* Prevent page scroll */
  position: fixed; /* Lock the page */
  inset: 0;
}

body {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(13, 148, 136, 0.05);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  border-radius: 10px;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%);
  border-color: rgba(13, 148, 136, 0.1);
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Selection Color */
::selection {
  background: rgba(13, 148, 136, 0.3);
  color: #0f172a;
}

::-moz-selection {
  background: rgba(13, 148, 136, 0.3);
  color: #0f172a;
}

/* Focus Styles */
*:focus-visible {
  outline: 3px solid rgba(13, 148, 136, 0.5);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Smooth Scroll - Only for content areas */
.scrollable-content {
  scroll-behavior: smooth;
}

/* Utility Classes */
.text-gradient {
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(13, 148, 136, 0.15);
}

.shadow-soft {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.shadow-medium {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

.shadow-strong {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
</style>
