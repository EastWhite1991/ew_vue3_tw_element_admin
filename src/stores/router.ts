import { asyncMenu } from '@/services/menu'
import { asyncRouterHandle } from '@/utils/asyncRouter'
import pathInfo from '@/pathInfo.json'
import router from '@/router'

const notLayoutRouterArr: any = []
const keepAliveRoutersArr: any = []
const nameMap: any = {}

// 格式化路由配置对象，遍历路由配置数组，将路由配置对象转换为路由对象，并将路由对象存入routeMap
const formatRouter = (routes: any, routeMap: any, parent?: any) => {
  if (routes) {
    routes.forEach((item: any) => {
      // 设置当前路由项的父路由
      item.parent = parent
      // 将路由的按钮权限和隐藏状态存入meta对象中
      item.meta.btns = item.btns
      item.meta.hidden = item.hidden

      if (item.meta.defaultMenu === true) {
        // 如果是顶级路由（没有父路由）
        if (!parent) {
          // 因为接口返回的path是没有斜杠（/）的，所以需要在路径前添加斜杠
          item = { ...item, path: `/${item.path}` }
          // 将处理后的路由添加到notLayoutRouterArr数组中
          notLayoutRouterArr.push(item)
        }
      }

      // 将路由名称和路由对象的映射存入routeMap
      routeMap[item.name] = item

      // 如果有子路由，递归处理子路由
      if (item.children && item.children.length > 0) {
        formatRouter(item.children, routeMap, item)
      }
    })
  }
}

const KeepAliveFilter = (routes: any) => {
  if (routes) {
    routes.forEach((item: any) => {
      // 子菜单中有 keep-alive 的，父菜单也必须 keep-alive，否则无效。这里将子菜单中有 keep-alive 的父菜单也加入。
      // 如果当前路由或其任意子路由设置了meta.keepAlive为true，则将该路由的路径信息添加到keepAliveRoutersArr数组中
      // 当子路由需要keep-alive时，父路由也会被自动加入keep-alive列表（这是Vue Router的要求）
      if (
        (item.children && item.children.some((ch: any) => ch.meta.keepAlive)) ||
        item.meta.keepAlive
      ) {
        const path = item.meta.path
        keepAliveRoutersArr.push((pathInfo as any)[path])

        // 同时将路由名称和路径信息的映射存入nameMap对象，方便后续根据路由名称快速查找路径信息
        nameMap[item.name] = (pathInfo as any)[path]
      }
      if (item.children && item.children.length > 0) {
        KeepAliveFilter(item.children)
      }
    })
  }
}

export const useRouterStore = defineStore('router', () => {
  const keepAliveRouters = ref([])
  const asyncRouterFlag = ref<number>(0)
  const asyncRouters = ref<any>([])

  const routeMap: any = {}
  // 从后端获取动态路由
  const SetAsyncRouter = async () => {
    asyncRouterFlag.value++
    const baseRouter = [
      {
        path: '/layout',
        name: 'layout',
        component: 'views/layout/index.vue',
        meta: {
          title: '底层layout',
        },
        children: [],
      },
    ]
    const asyncRouterRes = await asyncMenu()
    const asyncRouter = asyncRouterRes.data
    if (asyncRouter) {
      // 遍历异步路由，将路由路径作为键，路由对象作为值存入routeMap
      asyncRouter.push({
        path: 'reload',
        name: 'reload',
        hidden: true,
        meta: {
          title: '',
          closeTab: true,
        },
        component: 'views/error/reload.vue',
      })
    }

    formatRouter(asyncRouter, routeMap)
    baseRouter[0].children = asyncRouter
    if (notLayoutRouterArr.length !== 0) {
      baseRouter.push(...notLayoutRouterArr)
    }

    asyncRouterHandle(baseRouter)
    KeepAliveFilter(asyncRouter)
    asyncRouters.value = baseRouter

    // 最后才添加通配符路由，否则会出现刷新页面跳转404的问题
    router.addRoute({
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    })
    return true
  }

  return {
    keepAliveRouters,
    asyncRouterFlag,
    SetAsyncRouter,
    routeMap,
    asyncRouters,
  }
})
