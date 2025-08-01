import { useStorage } from '@vueuse/core'
import type { ILoginFormData } from '@/typings/user'
import { ElLoading, ElMessage } from 'element-plus'
import { useCookies } from '@vueuse/integrations/useCookies'
import { login } from '@/api/modules/user'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  // 登录
  const LoginIn = async (loginInfo: ILoginFormData) => {
    const loadingInstance = ref<any>(null)
    const token = useStorage('token', '')
    const xToken = useCookies(['x-token'])

    const setToken = (t: string) => {
      token.value = t
      xToken.set('x-token', t)
    }

    try {
      loadingInstance.value = ElLoading.service({
        fullscreen: true,
        text: '登录中，请稍后...',
      })
      const res: any = await login(loginInfo)

      if (res.code !== 0) {
        ElMessage.error(res.message || '登录失败')
        return false
      }

      setToken(res.data.token)

      router.push('/')

      return true

      // 登录成功，设置用户信息和权限相关的信息
    } catch (error) {
      console.error('Login error: ', error)
      return false
    } finally {
      loadingInstance.value?.close()
    }
  }

  return {
    LoginIn,
  }
})
