import router from '@/router'
import Nprogress from 'nprogress'
import { useUserStore } from '@/stores/user'
import { useRouterStore } from '@/stores/router'
import type { RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router'
import { getPageTitle } from '@/utils/helpers'

/**  Cursor 优化逻辑后的代码   */

/**
 * 配置进度条
 */
Nprogress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
})

/**
 * 处理异步路由加载
 * 同时获取用户信息和路由配置，并将异步路由添加到路由系统中
 * @returns {Promise<boolean>} 是否成功设置路由
 */
const setupRouter = async () => {
  try {
    const routerStore = useRouterStore()
    const userStore = useUserStore()
    // 并行获取路由配置和用户信息，提高效率
    await Promise.all([routerStore.SetAsyncRouter(), userStore.GetUserInfo()])
    // 将异步路由添加到路由系统
    routerStore.asyncRouters.forEach((route: any) => router.addRoute(route))
    return true
  } catch (error) {
    console.error('设置路由失败:', error)
    return false
  }
}

// 路由白名单（无需登录即可访问的路由）
const WHITE_LIST = ['login']

/**
 * 全局路由守卫
 *
 * 主要处理以下场景：
 * 1. 用户未登录时的路由拦截与重定向
 * 2. 用户已登录时访问登录页的重定向处理
 * 3. 异步路由的加载与权限判断
 * 4. 路由重定向时避免无限循环
 *
 * @param to - 目标路由对象
 * @param from - 来源路由对象
 * @returns 路由跳转的目标位置，或允许/阻止路由跳转的布尔值
 */
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded) => {
  // 获取用户和路由状态
  const userStore = useUserStore()
  const routerStore = useRouterStore()
  const token = userStore.token
  // 使用可选链安全地获取默认路由
  const defaultRouter = userStore?.userInfo?.authority?.defaultRouter

  // 进度条开始
  Nprogress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title as string, to)

  // 客户端路由直接放行
  if (to.meta.client) {
    return true
  }

  // 用户未登录的处理逻辑
  if (!token) {
    // 若目标不是登录页，则重定向到登录页
    if (to.name !== 'login') {
      return { name: 'login' }
    }
    // 目标是登录页且未登录，直接放行
    return true
  }

  // 用户已登录的处理逻辑
  if (to.name === 'login') {
    // 若已登录但访问登录页，则重定向到有权限的页面

    // 若异步路由尚未加载，先加载异步路由
    if (!routerStore.asyncRouterFlag) {
      await setupRouter()
    }

    // 优先重定向到用户默认路由
    if (defaultRouter) {
      return { name: defaultRouter }
    } else {
      // 无默认路由时重定向到仪表盘
      return { name: 'dashboard' }
    }
  }

  // 处理需要返回首页的情况
  const needToHome = sessionStorage.getItem('needToHome') === 'true'
  if (needToHome) {
    sessionStorage.removeItem('needToHome')
    return { path: '/' }
  }

  // 处理异步路由加载
  // 若异步路由尚未加载，且来源不是白名单路由，则加载异步路由
  if (!routerStore.asyncRouterFlag && !WHITE_LIST.includes(from.name as string)) {
    const setupSuccess = await setupRouter()

    if (setupSuccess && userStore.token) {
      // 异步路由加载成功后的路由处理

      // 关键修复：检查当前路由是否有效，避免无限重定向
      if (to.name && router.hasRoute(to.name)) {
        return true
      }

      // 检查默认路由权限
      if (defaultRouter && router.hasRoute(defaultRouter)) {
        // 关键修复：如果当前已经是默认路由，直接放行避免重定向循环
        if (to.name === defaultRouter) {
          return true
        }
        // 需要重定向到默认路由时使用replace模式
        return { name: defaultRouter, replace: true }
      } else {
        // 无权限访问任何路由时跳转到404
        return { path: '/404' }
      }
    } else {
      // 路由加载失败时重定向到登录页，并保存原目标路径
      return {
        name: 'login',
        query: { redirect: to.fullPath },
      }
    }
  }

  // 其他情况允许通过
  return true
})

/**
 * 路由后置守卫
 * 页面加载完成后的处理
 */
router.afterEach(() => {
  // 滚动到页面顶部
  document.querySelector('.main-cont.main-right')?.scrollTo(0, 0)
  // 结束进度条
  Nprogress.done()
})

/**
 * 路由错误处理
 */
router.onError((error) => {
  console.error('路由错误:', error)
  Nprogress.remove()
})

/**
 * 移除初始加载动画
 */
const removeLoading = () => {
  const element = document.getElementById('ew-loading-box')
  element?.remove()
}

removeLoading()
