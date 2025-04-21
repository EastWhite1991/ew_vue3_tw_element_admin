import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  css: {
    // Vue3 vite 集成 sass: https://www.cnblogs.com/wt7018/p/18786855
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/variables" as *;`,
        api: 'modern-compiler', // or "modern"
      },
    },
  },
  plugins: [vue(), tailwindcss(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
