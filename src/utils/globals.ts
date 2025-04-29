import { getCurrentInstance } from 'vue'

export const useGetGlobals = () => {
  const instance = getCurrentInstance()
  if (instance) {
    const globalProperties = instance.appContext.config.globalProperties
    return {
      appInfo: globalProperties.$appInfo,
    }
  }
  return {
    appInfo: {},
  }
}
