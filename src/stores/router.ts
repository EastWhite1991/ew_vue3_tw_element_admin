import { ref } from 'vue'
import { defineStore } from 'pinia'
import { asyncMenu } from '@/services/menu'
import { asyncRouterHandle } from '@/utils/asyncRouter'
import pathInfo from '@/pathInfo.json'
import router from '@/router'
import type { IMenu, PathInfoMap, RouteMap, RouterItem } from '@/typings/sys'

const notLayoutRouterArr: RouterItem[] = []
const keepAliveRoutersArr: string[] = []
const nameMap: { [key: string]: string } = {}

// 格式化路由配置对象，遍历路由配置数组，将路由配置对象转换为路由对象，并将路由对象存入routeMap
const formatRouter = (routes: IMenu[], routeMap: RouteMap, parent?: RouterItem) => {
  if (routes) {
    routes.forEach((item: IMenu) => {
      // 创建RouterItem对象
      const routerItem: RouterItem = {
        path: item.path,
        name: item.name,
        component: item.component,
        meta: {
          title: item.meta.title,
          btns: item.btns,
          hidden: item.hidden,
          keepAlive: item.meta.keepAlive,
          defaultMenu: item.meta.defaultMenu,
          closeTab: item.meta.closeTab,
          icon: item.meta.icon,
          activeName: item.meta.activeName,
        },
      }

      // 设置当前路由项的父路由
      routerItem.parent = parent

      if (routerItem.meta.defaultMenu === true) {
        // 如果是顶级路由（没有父路由）
        if (!parent) {
          // 因为接口返回的path是没有斜杠（/）的，所以需要在路径前添加斜杠
          routerItem.path = `/${routerItem.path}`
          // 将处理后的路由添加到notLayoutRouterArr数组中
          notLayoutRouterArr.push(routerItem)
        }
      }

      // 将路由名称和路由对象的映射存入routeMap
      routeMap[routerItem.name] = routerItem

      // 如果有子路由，递归处理子路由
      if (item.children && Array.isArray(item.children)) {
        routerItem.children = []
        // 使用类型断言，确保children被视为IMenu[]
        formatRouter(item.children as IMenu[], routeMap, routerItem)
      }
    })
  }
}

const KeepAliveFilter = (routes: RouterItem[]) => {
  if (routes) {
    routes.forEach((item: RouterItem) => {
      // 子菜单中有 keep-alive 的，父菜单也必须 keep-alive，否则无效。这里将子菜单中有 keep-alive 的父菜单也加入。
      // 如果当前路由或其任意子路由设置了meta.keepAlive为true，则将该路由的路径信息添加到keepAliveRoutersArr数组中
      // 当子路由需要keep-alive时，父路由也会被自动加入keep-alive列表（这是Vue Router的要求）
      if (
        (item.children && item.children.some((ch: RouterItem) => ch.meta.keepAlive)) ||
        item.meta.keepAlive
      ) {
        const path = item.meta.path
        if (path && (pathInfo as PathInfoMap)[path]) {
          keepAliveRoutersArr.push((pathInfo as PathInfoMap)[path])

          // 同时将路由名称和路径信息的映射存入nameMap对象，方便后续根据路由名称快速查找路径信息
          nameMap[item.name] = (pathInfo as PathInfoMap)[path]
        }
      }
      if (item.children && item.children.length > 0) {
        KeepAliveFilter(item.children)
      }
    })
  }
}

export const useRouterStore = defineStore('router', () => {
  const keepAliveRouters = ref<string[]>([])
  const asyncRouterFlag = ref<number>(0)
  const asyncRouters = ref<RouterItem[]>([])

  const routeMap: RouteMap = {}
  // 从后端获取动态路由
  const SetAsyncRouter = async () => {
    asyncRouterFlag.value++
    const baseRouter: RouterItem[] = [
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
    const asyncRouter = asyncRouterRes.data as IMenu[]
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
      } as IMenu)
    }

    formatRouter(asyncRouter, routeMap)

    // 在将 asyncRouter 赋值给 children 前，修正子路由的 path
    const formatChildrenPath = (routes: RouterItem[]) => {
      routes.forEach((route) => {
        // 确保 path 是字符串且以 /layout/ 开头
        if (typeof route.path === 'string' && route.path.startsWith('/layout/')) {
          // 移除 /layout/ 前缀，保留后面的部分作为相对路径
          route.path = route.path.substring('/layout/'.length)
        }
        // 递归处理更深层级的子路由（如果存在且也需要修正）
        // 注意：根据实际数据结构决定是否需要递归
        // if (route.children && route.children.length > 0) {
        //   formatChildrenPath(route.children);
        // }
      })
    }

    formatChildrenPath(asyncRouter as unknown as RouterItem[]) // 修正路径

    baseRouter[0].children = asyncRouter as unknown as RouterItem[]
    if (notLayoutRouterArr.length !== 0) {
      baseRouter.push(...notLayoutRouterArr)
    }

    asyncRouterHandle(baseRouter)
    KeepAliveFilter(baseRouter)
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
