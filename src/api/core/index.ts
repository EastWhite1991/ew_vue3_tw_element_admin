import { createAlova, Method } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'
import { ElMessage } from 'element-plus'

// let userStore: any
// nextTick(() => {
//   userStore = useUserStore()
// })

const errCode = {
  401: '登录失效，请重新登录',
  403: '没有权限',
  404: '请求地址错误',
  500: '服务器错误',
}

export const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 99999,
  // VueHook用于创建ref状态，包括请求状态loading、响应数据data、请求错误对象error等
  statesHook: VueHook,
  // 请求适配器，推荐使用fetch请求适配器
  requestAdapter: adapterFetch(),
  // 关闭全局请求缓存
  cacheFor: null,
  // 全局缓存配置
  // cacheFor: {
  //   POST: {
  //     mode: 'memory',
  //     expire: 60 * 10 * 1000
  //   },
  //   GET: {
  //     mode: 'memory',
  //     expire: 60 * 10 * 1000
  //   },
  //   HEAD: 60 * 10 * 1000 // 统一设置HEAD请求的缓存模式
  // },
  // 在开发环境开启缓存命中日志
  cacheLogger: import.meta.env.DEV,
  // 全局请求拦截器
  beforeRequest(method: Method) {
    if (method.config.ignoreToken) {
      return
    }
    // if (!userStore.token) {
    //   ElMessage.error('请先登录')
    //   router.push('/login')
    //   return
    // }
    method.config.headers['Content-Type'] = 'application/json'
    method.config.headers['x-token'] = 'user token'
    method.config.headers['x-user-id'] = 'userId'
  },
  // 全局的响应拦截器
  responded: {
    onSuccess: async (response) => {
      console.log(import.meta.env)
      if (response.status !== 200) {
        throw new Error(`[${response.status}]${response.statusText}`)
      }
      try {
        // 解析响应数据
        const json = await response.json()

        // 检查业务状态码
        if (json.code !== 0) {
          // 特殊状态码处理
          if (json.code === 401) {
            // userStore.logout()
            // router.push('/login')
          }

          // 获取错误消息
          const errorMsg = json?.msg || errCode[json?.code as keyof typeof errCode]
          if (errorMsg) {
            ElMessage({
              type: 'error',
              message: errorMsg,
              showClose: true,
            })
            throw new Error(errorMsg)
          }
        }

        // 显示成功消息（如果有）
        const successMsg = json?.msg
        if (successMsg) {
          ElMessage({
            type: 'success',
            message: successMsg,
            showClose: true,
          })
        }

        // 返回数据
        return json
      } catch (e: any) {
        // 处理JSON解析错误
        throw new Error('序列化失败，请检查数据结构' + e.message)
      }
    },
    onError: async (error) => {
      ElMessage({
        type: 'error',
        message: error.message,
        showClose: true,
      })
    },
  },
})
