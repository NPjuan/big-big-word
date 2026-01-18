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

      <!-- Statistics Section -->
      <div v-if="wordStore.wordCount > 0" class="header-stats">
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
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWordStore } from '@/stores/wordStore'

const wordStore = useWordStore()

const masteryPercentage = computed(() => {
  if (wordStore.wordCount === 0) return 0
  const total = wordStore.words.reduce((sum, word) => sum + word.mastery, 0)
  return Math.round(total / wordStore.wordCount)
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

  .header-stats {
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
