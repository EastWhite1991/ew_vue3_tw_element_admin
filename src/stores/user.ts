import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAppStore } from './app'
import { useStorage } from '@vueuse/core'
import { useCookies } from '@vueuse/integrations/useCookies'
import router from '@/router'
import { joinInBlackList } from '@/services/user'

export const useUserStore = defineStore('user', () => {
  const appStore = useAppStore() as any

  const userInfo = ref({
    uuid: '',
    nickName: '',
    headerImg: '',
    authority: {},
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
    console.log(appStore.config)
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

  const Logout = async () => {
    // 调用 jsonInBlacklist 异步函数，向后端发送请求，将当前用户的 JWT 添加到黑名单中，使该令牌失效，防止被继续使用。
    const res = (await joinInBlackList()) as any

    if (res.code !== 0) {
      return
    }

    await ClearStorage()

    router.push({
      name: 'Login',
      replace: true,
    })
    window.location.reload()
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
  }
})
