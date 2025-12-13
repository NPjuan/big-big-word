import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/word-gallery.vue'
import StudyMode from '@/pages/study-mode.vue'
import Stats from '@/pages/stats.vue'
import Settings from '@/pages/settings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
    },
    {
      path: '/study',
      name: 'Study',
      component: StudyMode,
    },
    {
      path: '/stats',
      name: 'Stats',
      component: Stats,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
    },
  ],
})

export default router
