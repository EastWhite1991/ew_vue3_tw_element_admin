import router from '@/router'
import Nprogress from 'nprogress'
import { useUserStore } from '@/stores/user'
import { useRouterStore } from '@/stores/router'
import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router'
import { getPageTitle } from '@/utils/helpers'

Nprogress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
})

// 白名单路由
const WHITE_LIST = ['Login', 'Init']

/**
 * 路由守卫
 */
router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalizedLoaded,
    next: NavigationGuardNext,
  ) => {
    console.log('🚀 ~ next:', next)
    console.log('🚀 ~ from:', from)
    const userStore = useUserStore()
    const routerStore = useRouterStore()
    const token = userStore.token

    // 进度条开始
    Nprogress.start()

    // 设置页面标题
    document.title = getPageTitle(to.meta.title as string, to)

    if (to.meta.client) {
      // 返回 true 意味着允许路由跳转，继续执行后续的导航逻辑。
      return true
    }

    // 白名单路由处理
    if (WHITE_LIST.includes(to.name as string)) {
      if (token) {
        if (!routerStore.asyncRouterFlag) {
          // await setupRouter(userStore)
        }
      }
    }
  },
)

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
