import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRouterStore = defineStore('router', () => {
  const keepAliveRouters = ref([])
  const asyncRouterFlag = ref(0)
  const asyncRouters = ref<any>([])

  const routeMap: any = {}
  // 从后端获取动态路由
  const SetAsyncRouter = async () => {
    //
  }

  return {
    keepAliveRouters,
    asyncRouterFlag,
    SetAsyncRouter,
    routeMap,
    asyncRouters,
  }
})
