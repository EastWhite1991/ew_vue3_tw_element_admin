import { createRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router'

/**
 * 系统的基础路由，在登录后还会加载用户的动态路由
 */
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
      path: '/401',
      name: '401',
      component: () => import('@/views/error/401.vue'),
      meta: { title: '401' },
    },
    {
      path: '/404',
      name: 'notfound',
      component: () => import('@/views/error/404.vue'),
    },
    {
      path: '/500',
      name: '500',
      component: () => import('@/views/error/500.vue'),
      meta: { title: '500' },
    },
  ],
})

export default router

/**
1. 基础路由配置：
   - 根路由 "/"
   - 404路由 "/404"
   - 登录路由 "/login"
   - 通配符路由 "/:pathMatch(.)" 重定向到404
2. 异步路由：
   - layout布局路由 "/layout"
   - dashboard仪表盘 "/layout/dashboard"
   - 权限管理 "/layout/admin/authority"
其他子路由...

3. 路由加载流程
  1. 应用初始化时加载基础路由
  2. 用户登录后通过setupRouter加载异步路由
  3. 通过导航守卫控制路由访问权限
 */
