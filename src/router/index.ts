import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/Home.vue'),
          meta: {
            title: 'Learn',
          },
        },
        {
          path: 'history',
          name: 'history',
          component: () => import('@/pages/WordHistory.vue'),
          meta: {
            title: 'History',
          },
        },
        {
          path: 'word/:id',
          name: 'word-detail',
          component: () => import('@/pages/WordDetail.vue'),
          meta: {
            title: 'Word Detail',
          },
        },
      ],
    },
  ],
})

// Set page title
router.beforeEach((to) => {
  document.title = `${to.meta.title || 'Big Big Word'} | Vocabulary Learning`
})

export default router
