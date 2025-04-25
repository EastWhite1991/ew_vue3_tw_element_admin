import { createRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router'

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),
    },
    {
      path: '/404',
      name: 'notfound',
      component: () => import('@/views/error/404.vue'),
    },
    // 未匹配的路由
    // {
    //   path: '/:pathMatch(.*)*',
    //   redirect: '/404',
    // },
  ],
})

export default router
