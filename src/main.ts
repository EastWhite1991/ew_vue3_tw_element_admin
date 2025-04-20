import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from '@/App.vue'
import router from './router'
// 引入 Element Plus 的图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App)

// 注册 Element Plus 图标为全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
