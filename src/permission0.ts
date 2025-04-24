import router from '@/router'
import Nprogress from 'nprogress'
import { useUserStore } from '@/stores/user'
import { useRouterStore } from '@/stores/router'
import type { RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router'
import { getPageTitle } from '@/utils/helpers'

/**   优化后的初始文件   */

Nprogress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
})

// 处理路由加载
const setupRouter = async () => {
  try {
    const routerStore = useRouterStore()
    const userStore = useUserStore()
    await Promise.all([routerStore.SetAsyncRouter(), userStore.GetUserInfo()])
    console.log('🚀 ~ routerStore.asyncRouters:', routerStore.asyncRouters)
    routerStore.asyncRouters.forEach((route: any) => router.addRoute(route))
    return true
  } catch (error) {
    console.error('设置路由失败:', error)
    return false
  }
}

// 白名单路由
const WHITE_LIST = ['login']
/**
 * 路由守卫
 * @param to - 目标路由对象
 * @param from - 来源路由对象
 * @returns 路由跳转的目标位置，或者 true 表示允许路由跳转，或者 false 表示阻止路由跳转。
 * 全局路由守卫死循环：https://segmentfault.com/a/1190000022709721
 *
 * 主要考虑两种情况：
 * 1. 不跳转登录页且token为空：not_to('Login') && token === null  ————> return { name: 'Login' }
 * 2. 跳转登录页但是token不为空： to('Login') && token !== null  ————> return { path: '/' } 或者 return { path: '/dashboard' }
 * 其他情况：
 * 1. not_to('Login') && token !== null  ————> return true
 * 2. to('Login') && token === null  ————> return true
 * 3. not_to('Login') && token!== null  ————> return true
 */
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded) => {
  console.log('---------------------------------')
  console.log('🚀 ~ router.beforeEach:')
  const userStore = useUserStore()
  const routerStore = useRouterStore()
  const token = userStore.token
  const defaultRouter = userStore?.userInfo?.authority?.defaultRouter
  console.log('🚀 ~ from:', from)
  console.log('🚀 ~ token:', token === '')

  // 进度条开始
  Nprogress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title as string, to)

  if (to.meta.client) {
    return true
  }

  if (!token) {
    if (to.name !== 'login') {
      // 1. 若用户未登录，且目标路由不是登录页，则将路由重定向到登录页。
      return {
        name: 'login',
      }
    } else {
      return true
    }
  } else {
    if (to.name === 'login') {
      // 2. 若用户已登录，且目标路由是登录页，则将路由重定向到首页。

      // 若 routerStore.asyncRouterFlag 为 0，意味着异步路由还未设置
      if (!routerStore.asyncRouterFlag) {
        // 调用 setupRouter 函数来设置异步路由
        await setupRouter()
      }

      if (defaultRouter) {
        // 若用户信息中的 authority.defaultRouter 存在，将路由重定向到该默认路由。
        return { name: defaultRouter }
      } else {
        // 若用户信息中的 authority.defaultRouter 不存在，将路由重定向到首页。
        return {
          name: 'dashboard',
        }
      }
    } else {
      // 若用户已登录（token 存在），且 sessionStorage 中 needToHome 的值为 true，则移除该 sessionStorage 项，并将路由重定向到首页。
      const needToHome = sessionStorage.getItem('needToHome') === 'true'
      if (needToHome) {
        sessionStorage.removeItem('needToHome')
        return { path: '/' }
      }

      // 若 routerStore 中的 asyncRouterFlag 为 0，且当前路由不是从白名单路由跳转过来的，
      // 意味着异步路由还未设置，就调用 setupRouter 函数来设置异步路由。
      if (!routerStore.asyncRouterFlag && !WHITE_LIST.includes(from.name as string)) {
        const setupSuccess = await setupRouter()
        if (setupSuccess && userStore.token) {
          console.log('异步路由设置成功')
          // 检查当前路由是否已经是用户要访问的路由，如果是则直接返回true
          if (to.name && router.hasRoute(to.name)) {
            return true
          }

          // 若异步路由设置成功且 token 仍存在，调用 handleRedirect 函数处理路由重定向。
          // return handleRedirect(to, userStore)
          if (defaultRouter && router.hasRoute(defaultRouter)) {
            // 当前路由与默认路由相同，直接放行，避免无限重定向
            if (to.name === defaultRouter) {
              return true
            }
            // 需要重定向到默认路由
            return { name: defaultRouter, replace: true }
          } else {
            return { path: '/404' }
          }
        } else {
          // 若设置失败，将路由重定向到登录页，并携带原目标路由的完整路径作为查询参数。
          return {
            name: 'login',
            query: { redirect: to.fullPath },
          }
        }
      }

      return true
    }
  }
})

router.afterEach(() => {
  document.querySelector('.main-cont.main-right')?.scrollTo(0, 0)
  Nprogress.done()
})

// 路由错误处理
router.onError((error) => {
  console.error('Router error:', error)
  Nprogress.remove()
})

// 移除加载动画
const removeLoading = () => {
  const element = document.getElementById('ew-loading-box')
  element?.remove()
}

removeLoading()
/**
路由无限重定向这个问题的主要原因是：
1. 当异步路由设置成功后，代码始终返回{ ...to, replace: true }创建了新的路由对象
2. 即使用户访问的就是有权限的路由，也会创建新路由对象而不是直接放行
3. Vue Router收到新的路由对象后，重新触发导航，导致无限循环

修复方案的核心逻辑是：
1. 先检查用户是否已经在访问一个有效路由，如果是则直接返回true放行
2. 检查用户是否有默认路由权限，并且该路由存在
3. 如果用户当前访问的就是默认路由，则直接放行
4. 只在确实需要重定向时，才返回新的路由对象
这样避免了不必要的重定向，解决了死循环问题，同时也修复了linter警告的可能undefined的问题。
 */
