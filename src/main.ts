import '@/assets/styles/element_style.scss'
import '@/assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'

import '@/permission'
import App from '@/App.vue'
import router from '@/router'
import core from '@/core'
import Directive from '@/directives'

const app = createApp(App)

app.use(core).use(ElementPlus).use(createPinia()).use(Directive).use(router)

app.mount('#app')
