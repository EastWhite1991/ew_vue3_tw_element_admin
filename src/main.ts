import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import App from '@/App.vue'
import router from './router'
import run from './core'

const app = createApp(App)

app.use(run)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
