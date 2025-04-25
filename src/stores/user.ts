import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAppStore } from './app'
import { useStorage } from '@vueuse/core'
import { useCookies } from '@vueuse/integrations/useCookies'
import router from '@/router'
import { getUserInfo, login } from '@/services/user'
import { ElLoading, ElMessage } from 'element-plus'
import type { IUserInfo } from '@/typings/user'
import { useRouterStore } from './router'

export const useUserStore = defineStore('user', () => {
  const appStore = useAppStore() as any

  const userInfo = ref<Partial<IUserInfo>>({
    uuid: '',
    nickName: '',
    headerImg: '',
  })
  const token = useStorage('token', '')
  const cookies = useCookies(['x-token'])
  const currentToken = token.value || cookies.get('x-token') || ''

  const setUserInfo = (info: any) => {
    userInfo.value = info

    // setUserInfo 函数用于更新用户信息，并根据用户信息中的 originSetting 字段选择性地更新应用配置。
    // 这样做可以确保用户登录后，应用配置能根据用户的个性化设置进行调整。
    // 例如，用户可以选择深色模式、浅色模式或跟随系统设置，这个设置会保存在用户信息中，
    // 然后在应用启动时根据用户信息中的 originSetting 字段来更新应用配置。
    // 这样，用户每次登录后，应用都会根据用户的设置来显示深色或浅色的界面元素。
    if (info.originSetting) {
      Object.keys(appStore.config).forEach((key: any) => {
        if (info.originSetting[key] !== undefined) {
          appStore.config[key] = info.originSetting[key]
        }
      })
    }
  }

  const setToken = (newToken: string) => {
    token.value = newToken
    cookies.set('x-token', newToken)
  }

  const NeedInit = async () => {
    await ClearStorage()
    await router.push({ name: 'Init', replace: true })
  }

  const ClearStorage = async () => {
    token.value = ''
    cookies.remove('x-token')
    sessionStorage.clear()
    localStorage.removeItem('originSetting')
  }

  const loadingInstance = ref<any>(null)
  const LoginIn = async (loginInfo: any) => {
    try {
      loadingInstance.value = ElLoading.service({
        fullscreen: true,
        text: '登录中，请稍候...',
      })
      const res = await login(loginInfo)
      if (res.status !== 200) {
        ElMessage.error('登录失败！')
        return false
      }
      ElMessage.success('登录成功！')

      // 1. 登陆成功后，设置用户信息和权限相关信息
      setUserInfo(res.data.user)
      setToken(res.data.token)

      // 2. 初始化路由信息
      const routerStore = useRouterStore()
      await routerStore.SetAsyncRouter()
      const asyncRouters = routerStore.asyncRouters

      // 3. 将动态路由注册到路由表里
      asyncRouters.forEach((route: any) => {
        router.addRoute(route)
      })

      // 4. 检查路由表中是否存在用户权限里的默认路由。若不存在，显示错误信息；若存在，跳转到该默认路由。
      if (!router.hasRoute(userInfo?.value?.authority?.defaultRouter as any)) {
        ElMessage.error('请联系管理员进行授权')
      } else {
        await router.replace({ name: userInfo?.value?.authority?.defaultRouter })
      }

      // 5. 检测用户的操作系统类型，将结果存储到 localStorage 中。
      const isWindows = /windows/i.test(navigator.userAgent)
      window.localStorage.setItem('osType', isWindows ? 'WIN' : 'MAC')

      // 6. 全部操作均结束，关闭loading并返回
      return true
    } catch (error) {
      console.error('Login error...', error)
      return false
    } finally {
      loadingInstance.value?.close()
    }
  }

  const Logout = async () => {
    // 调用 jsonInBlacklist 异步函数，向后端发送请求，将当前用户的 JWT 添加到黑名单中，使该令牌失效，防止被继续使用。
    // const res = (await joinInBlackList()) as any

    // if (res.code !== 0) {
    //   return
    // }

    await ClearStorage()

    router.push({
      name: 'login',
      replace: true,
    })
    window.location.reload()
  }

  /* 获取用户信息*/
  const GetUserInfo = async () => {
    const res = await getUserInfo()
    if (res.status === 200) {
      setUserInfo(res.data)
    }
    return res
  }

  return {
    userInfo,
    token,
    currentToken,
    setUserInfo,
    setToken,
    NeedInit,
    ClearStorage,
    Logout,
    LoginIn,
    loadingInstance,
    GetUserInfo,
  }
})
