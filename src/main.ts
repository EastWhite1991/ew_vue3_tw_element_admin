import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'

import '@/permission'
import App from '@/App.vue'
import router from '@/router'
import core from '@/core'

const app = createApp(App)

app.use(core).use(ElementPlus).use(createPinia()).use(router)

app.mount('#app')
