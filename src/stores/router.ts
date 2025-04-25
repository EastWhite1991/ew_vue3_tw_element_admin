import { ref } from 'vue'
import { defineStore } from 'pinia'
import { asyncMenu } from '@/services/menu'
import { asyncRouterHandle } from '@/utils/asyncRouter'
import router from '@/router'

const notLayoutRouterArr: any = []
// const keepAliveRoutersArr: any = []
// const nameMap: any = {}

const formatRouter = (routes: any, routeMap: any, parent?: any) => {
  if (routes) {
    routes.forEach((item: any) => {
      item.parent = parent
      item.meta.btns = item.btns
      item.meta.hidden = item.hidden

      if (item.meta.defaultMenu === true) {
        if (!parent) {
          item = { ...item, path: `/${item.path}` }
          notLayoutRouterArr.push(item)
        }
      }
      routeMap[item.name] = item
      if (item.children && item.children.length > 0) {
        formatRouter(item.children, routeMap, item)
      }
    })
  }
}

// const KeepAliveFilter = (routes: any) => {
//   if (routes) {
//     routes.forEach((item: any) => {
//       // 子菜单中有 keep-alive 的，父菜单也必须 keep-alive，否则无效。这里将子菜单中有 keep-alive 的父菜单也加入。
//       if (
//         (item.children && item.children.some((ch: any) => ch.meta.keepAlive)) ||
//         item.meta.keepAlive
//       ) {
//         const path = item.meta.path
//         keepAliveRoutersArr.push(pathInfo[path])
//         nameMap[item.name] = pathInfo[path]
//       }
//       if (item.children && item.children.length > 0) {
//         KeepAliveFilter(item.children)
//       }
//     })
//   }
// }

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
    console.log('🚀 ~ SetAsyncRouter ~ asyncRouterRes:', asyncRouterRes)
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
    // KeepAliveFilter(asyncRouter)
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
