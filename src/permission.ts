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

// 白名单路由
// const WHITE_LIST = ['Login', 'Init']

/**
 * 路由守卫
 */
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded) => {
  console.log('🚀 ~ from:', from)
  const userStore = useUserStore()
  const routerStore = useRouterStore()
  console.log('🚀 ~ routerStore:', routerStore)
  const token = userStore.token
  console.log('🚀 ~ token:', token)

  // 进度条开始
  Nprogress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title as string, to)

  return true
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
