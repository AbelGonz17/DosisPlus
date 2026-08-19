import { createRouter, createWebHistory } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import AppShell from '@/components/layout/AppShell.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      component: AppShell,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'today',
          component: () => import('@/views/TodayView.vue'),
        },
        {
          path: 'cabinet',
          name: 'cabinet',
          component: () => import('@/views/CabinetView.vue'),
        },
        {
          path: 'logbook',
          name: 'logbook',
          component: () => import('@/views/LogbookView.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const users = useUsersStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  if (requiresAuth && !users.activeUserId) {
    return { name: 'login' }
  }
  if (to.name === 'login' && users.activeUserId) {
    return { name: 'today' }
  }
  return true
})

export default router