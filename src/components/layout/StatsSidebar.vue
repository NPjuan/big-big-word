<template>
  <aside class="stats-sidebar glass-card">
    <h3 class="sidebar-title">Statistics</h3>

    <div class="stat-item">
      <div class="stat-icon-wrapper stat-primary">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="stat-content">
        <div class="stat-value">{{ wordStore.wordCount }}</div>
        <div class="stat-label">Total Words</div>
      </div>
      <div class="stat-badge badge-up">
        <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-icon-wrapper stat-success">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="stat-content">
        <div class="stat-value">{{ wordStore.masteredWords.length }}</div>
        <div class="stat-label">Mastered</div>
      </div>
      <div class="stat-badge badge-fire">
        <span>{{ masteryRate }}%</span>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-icon-wrapper stat-chart">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="stat-content">
        <div class="stat-value">{{ masteryPercentage }}%</div>
        <div class="stat-label">Avg. Mastery</div>
      </div>
    </div>

    <div class="progress-section">
      <div class="progress-label">Overall Progress</div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${masteryPercentage}%` }"></div>
      </div>
    </div>
  </aside>
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

const masteryRate = computed(() => {
  if (wordStore.wordCount === 0) return 0
  return Math.round((wordStore.masteredWords.length / wordStore.wordCount) * 100)
})
</script>

<style scoped>
.stats-sidebar {
  padding: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  animation: fadeInRight 0.6s ease-out;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.glass-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-title {
  margin: 0 0 0.25rem 0;
  font-size: 0.75rem;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-item:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: translateX(2px);
}

.stat-icon-wrapper {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.stat-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-success {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-chart {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon {
  width: 14px;
  height: 14px;
  color: white;
  stroke-width: 2;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 1rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.15rem;
}

.stat-label {
  font-size: 0.625rem;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.625rem;
  font-weight: 700;
  flex-shrink: 0;
}

.badge-up {
  background: rgba(67, 233, 123, 0.15);
  color: #10b981;
}

.badge-fire {
  background: rgba(251, 146, 60, 0.15);
  color: #f59e0b;
}

.badge-icon {
  width: 12px;
  height: 12px;
  stroke-width: 2.5;
}

.progress-section {
  margin-top: 0.25rem;
  padding-top: 0.625rem;
  padding-bottom: 0.125rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.progress-label {
  font-size: 0.625rem;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.4rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 8px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .stats-sidebar {
    padding: 1rem;
  }

  .stat-item {
    padding: 0.75rem;
  }

  .stat-icon-wrapper {
    width: 32px;
    height: 32px;
  }

  .stat-icon {
    width: 16px;
    height: 16px;
  }

  .stat-value {
    font-size: 1.125rem;
  }
}
</style>
