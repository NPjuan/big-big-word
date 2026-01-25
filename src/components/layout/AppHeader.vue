<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo-section">
        <div class="logo-wrapper">
          <div class="logo-ring"></div>
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="title-section">
          <h1 class="header-title">
            <span class="title-gradient">Big Big Word</span>
          </h1>
          <p class="header-subtitle">Master vocabulary with AI-powered intelligence</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="nav-section">
        <router-link to="/" class="nav-link" exact-active-class="nav-link-active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Learn</span>
        </router-link>
        <router-link to="/history" class="nav-link" exact-active-class="nav-link-active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>History</span>
        </router-link>
      </nav>

      <!-- Statistics & Export Section -->
      <div v-if="wordStore.wordCount > 0" class="header-actions">
        <!-- Statistics -->
        <div class="header-stats">
          <div class="stat-card stat-primary">
            <div class="stat-icon-wrapper">
              <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ wordStore.wordCount }}</div>
              <div class="stat-label">Words</div>
            </div>
          </div>

          <div class="stat-card stat-success">
            <div class="stat-icon-wrapper">
              <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ wordStore.masteredWords.length }}</div>
              <div class="stat-label">Mastered</div>
            </div>
          </div>

          <div class="stat-card stat-chart">
            <div class="stat-icon-wrapper">
              <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ masteryPercentage }}%</div>
              <div class="stat-label">Avg. Mastery</div>
            </div>
          </div>

          <!-- Export Dropdown -->
          <div class="export-dropdown">
            <button
              class="export-btn"
              @click="toggleExportMenu"
              :disabled="isExporting"
              aria-label="Export words"
              tabindex="0"
            >
              <svg
                v-if="!isExporting"
                class="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div v-else class="btn-spinner"></div>
              <span>Export</span>
            </button>

            <transition name="dropdown-fade">
              <div v-if="showExportMenu" class="export-menu">
                <button class="menu-item" @click="handleExportCSV">
                  <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <div class="menu-content">
                    <div class="menu-title">Export as CSV</div>
                    <div class="menu-subtitle">For spreadsheet apps</div>
                  </div>
                </button>

                <button class="menu-item" @click="handleExportJSON">
                  <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <div class="menu-content">
                    <div class="menu-title">Export as JSON</div>
                    <div class="menu-subtitle">For backup & programmatic use</div>
                  </div>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Export Success Toast -->
      <transition name="toast-fade">
        <div v-if="showExportSuccess" class="toast toast-success">
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>
            Successfully exported {{ wordStore.wordCount }}
            {{ wordStore.wordCount === 1 ? 'word' : 'words' }} as {{ exportFormat.toUpperCase() }}!
          </span>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWordStore } from '@/stores/wordStore'
import { exportToCSV, exportToJSON } from '@/utils/wordExport'

const wordStore = useWordStore()
const showExportMenu = ref(false)
const isExporting = ref(false)
const showExportSuccess = ref(false)
const exportFormat = ref<'csv' | 'json'>('csv')

const masteryPercentage = computed(() => {
  if (wordStore.wordCount === 0) return 0
  const total = wordStore.words.reduce((sum, word) => sum + word.mastery, 0)
  return Math.round(total / wordStore.wordCount)
})

const toggleExportMenu = () => {
  showExportMenu.value = !showExportMenu.value
}

const handleExportCSV = async () => {
  try {
    isExporting.value = true
    exportFormat.value = 'csv'
    showExportMenu.value = false

    await new Promise((resolve) => setTimeout(resolve, 300))
    exportToCSV(wordStore.words)

    showExportSuccess.value = true
    setTimeout(() => {
      showExportSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('Export to CSV failed:', error)
  } finally {
    isExporting.value = false
  }
}

const handleExportJSON = async () => {
  try {
    isExporting.value = true
    exportFormat.value = 'json'
    showExportMenu.value = false

    await new Promise((resolve) => setTimeout(resolve, 300))
    exportToJSON(wordStore.words)

    showExportSuccess.value = true
    setTimeout(() => {
      showExportSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('Export to JSON failed:', error)
  } finally {
    isExporting.value = false
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.export-dropdown')) {
    showExportMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-header {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 0;
  border: none;
  border-bottom: 1px solid rgba(13, 148, 136, 0.08);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  padding: 0.75rem 1.5rem;
  animation: fadeInDown 0.4s ease-out;
  max-width: 100%;
  margin: 0;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: nowrap;
  max-width: 1400px;
  margin: 0 auto;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

/* ===== Navigation Section ===== */
.nav-section {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  background: transparent;
  border: 1px solid transparent;
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.15s ease;
  cursor: pointer;
}

.nav-link:hover {
  background: rgba(13, 148, 136, 0.06);
  color: #0d9488;
  transform: none;
  box-shadow: none;
}

.nav-link-active {
  background: rgba(13, 148, 136, 0.08);
  border-color: transparent;
  color: #0d9488;
  box-shadow: none;
  font-weight: 700;
}

.nav-link svg {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.nav-link span {
  white-space: nowrap;
}

.logo-wrapper {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(45, 212, 191, 0.1));
  backdrop-filter: blur(8px);
  border: 1.5px solid rgba(13, 148, 136, 0.2);
  box-shadow: 0 2px 6px rgba(13, 148, 136, 0.1);
}

.logo-icon {
  width: 20px;
  height: 20px;
  color: #0d9488;
  stroke-width: 2;
  filter: drop-shadow(0 1px 2px rgba(13, 148, 136, 0.2));
  z-index: 1;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.header-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1;
}

.title-gradient {
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  font-size: 0.6875rem;
  color: #64748b;
  font-weight: 500;
  letter-spacing: 0;
  margin: 0;
  display: none;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-stats {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.15s ease;
  cursor: default;
  min-width: 90px;
}

.stat-card:hover {
  transform: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-primary {
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(45, 212, 191, 0.1));
}

.stat-success {
  background: linear-gradient(135deg, rgba(234, 88, 12, 0.1), rgba(251, 146, 60, 0.1));
}

.stat-chart {
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 254, 0.1));
}

.stat-icon-wrapper {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.stat-primary .stat-icon-wrapper {
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
}

.stat-success .stat-icon-wrapper {
  background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%);
}

.stat-chart .stat-icon-wrapper {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon {
  width: 14px;
  height: 14px;
  color: white;
  stroke-width: 2;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-value {
  font-size: 1rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.stat-label {
  font-size: 0.625rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* Export Dropdown */
.export-dropdown {
  position: relative;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(13, 148, 136, 0.25);
  white-space: nowrap;
}

.export-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.35);
}

.export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  width: 14px;
  height: 14px;
  stroke-width: 2.5;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.export-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 240px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 100;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.875rem;
  border: none;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.menu-item:hover {
  background: rgba(13, 148, 136, 0.05);
}

.menu-item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.menu-icon {
  width: 18px;
  height: 18px;
  color: #0d9488;
  stroke-width: 2;
  flex-shrink: 0;
}

.menu-content {
  flex: 1;
}

.menu-title {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.125rem;
}

.menu-subtitle {
  font-size: 0.6875rem;
  color: #475569;
}

/* Toast */
.toast {
  position: fixed;
  top: 5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 380px;
}

.toast-success {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.95));
  color: white;
  backdrop-filter: blur(10px);
}

.toast-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2.5;
  flex-shrink: 0;
}

/* Transitions */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-header {
    padding: 0.625rem 1rem;
  }

  .header-content {
    gap: 1rem;
  }

  .header-subtitle {
    display: none;
  }

  .nav-section {
    flex: 1;
    justify-content: center;
  }

  .header-actions {
    display: none;
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 0.5rem 0.875rem;
  }

  .logo-wrapper {
    width: 32px;
    height: 32px;
  }

  .logo-icon {
    width: 18px;
    height: 18px;
  }

  .header-title {
    font-size: 1rem;
  }

  .nav-link {
    padding: 0.4375rem 0.75rem;
    font-size: 0.8125rem;
  }

  .nav-link svg {
    width: 14px;
    height: 14px;
  }
}
</style>
