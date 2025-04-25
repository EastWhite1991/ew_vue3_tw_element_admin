import type { App } from 'vue'
// 引入 Element Plus 的图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import appInfo from './appInfo'

export const register = (app: App) => {
  // 注册 Element Plus 图标为全局组件
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  app.config.globalProperties.$EW_VUE_ADMIN = appInfo
}
