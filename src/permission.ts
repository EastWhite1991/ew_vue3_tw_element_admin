import router from '@/router'
import Nprogress from 'nprogress'
import { useUserStore } from '@/stores/user'
import { useRouterStore } from '@/stores/router'
import type { RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router'
import { getPageTitle } from '@/utils/helpers'

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
    routerStore.asyncRouters.forEach((route: any) => {
      router.addRoute(route)
    })
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
  console.log('1. 进入路由守卫')
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

  // 在路由守卫开始处，判断用户是否已登录且需要加载异步路由
  // 刷新页面时，浏览器会直接请求"/layout/dashboard"，但此时异步路由尚未加载，导致Vue Router找不到匹配的路径，因此提示"No match found"并跳转到404页面。
  if (token && routerStore.asyncRouterFlag === 0) {
    console.log(
      '🚀 ~ router.beforeEach ~ routerStore.asyncRouterFlag:',
      routerStore.asyncRouterFlag,
    )
    await setupRouter()
    // 加载完路由后，需要让当前导航重新匹配一次路由
    // return { ...to, replace: true }
    // 关键：重新触发当前导航以匹配新添加的路由
    return { path: to.fullPath, replace: true }
  }

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

// 移除加载动画
const removeLoading = () => {
  console.log('2. 移除加载动画')
  const element = document.getElementById('ew-loading-box')
  element?.remove()
}

router.afterEach(() => {
  document.querySelector('.main-cont.main-right')?.scrollTo(0, 0)
  Nprogress.done()
  removeLoading()
})

// 路由错误处理
router.onError((error) => {
  console.error('Router error:', error)
  Nprogress.remove()
  removeLoading()
})

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
