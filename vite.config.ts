import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'

const aliasPath = (path: string) => {
  return fileURLToPath(new URL(path, import.meta.url))
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  /*
  可以将env中的变量赋值给process.env，也可以直接用上面的env变量
  const NODE_ENV = mode || 'development'
  const envFiles = [`.env.${NODE_ENV}`]
  for (const file of envFiles) {
    const envConfig = dotenv.parse(fs.readFileSync(file))
    for (const k in envConfig) {
      process.env[k] = envConfig[k]
    }
  }
  */

  return {
    css: {
      // Vue3 vite 集成 sass: https://www.cnblogs.com/wt7018/p/18786855
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/variables" as *;`,
          api: 'modern-compiler', // or "modern"
        },
      },
    },
    plugins: [
      vue(),
      tailwindcss(),
      vueJsx(),
      vueDevTools(),
      AutoImport({
        //注册Vue和VueRouter的自动导入，在组件中就无需手动导入内置的api了
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/auto-import.d.ts',
        dirs: ['src/stores/*'],
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),
    ],
    // 项目根目录（index.html 文件所在的位置）。可以是一个绝对路径，或者一个相对于该配置文件本身的相对路径。
    root: process.cwd(),
    // 公共基础路径。
    base: './',
    // 作为静态资源服务的文件夹。
    publicDir: 'public',
    // 存储缓存文件的目录。
    cacheDir: 'node_modules/.vite',
    resolve: {
      alias: {
        '@': aliasPath('./src'),
        // '@enums': aliasPath('./src/common/enums'),
        // '@constants': aliasPath('./src/common/constants'),
        // '@stores': aliasPath('./src/stores/modules'),
      },
    },
    // 开发服务器选项
    server: {
      // 指定服务器应该监听哪个 IP 地址。
      host: true,
      // host: '0.0.0.0', // 可选，用于局域网调试
      port: 5173,
      proxy: {
        // 匹配所有以 /api 开头的请求
        [env.VITE_BASE_API as string]: {
          // 需要代理的路径   例如 '/api'
          target: `${env.VITE_BASE_PATH}:${env.VITE_SERVER_PORT}/`, // 代理到 目标路径
          changeOrigin: true,
          rewrite: (path) => {
            return path.replace(new RegExp('^' + env.VITE_BASE_API), '')
          },
          secure: false,
        },
      },
      // 为开发服务器配置 CORS。
      cors: true,
      // 若端口已被占用则会直接退出
      strictPort: true,
      // 自动打开浏览器。
      open: false,
    },
    // 构建选项
    // build: {
    //   // 设置最终构建的浏览器兼容目标。
    //   target: 'modules',
    //   // 决定是否自动注入 module preload 的 polyfill。
    //   polyfillModulePreload: true,
    //   // 指定输出路径（相对于 项目根目录).
    //   outDir: 'dist',
    //   // 指定生成静态资源的存放路径（相对于 build.outDir）。
    //   assetsDir: 'assets',
    //   // 小于此阈值的导入或引用资源将内联为 base64 编码
    //   assetsInlineLimit: 'assets',
    //   // 启用/禁用 CSS 代码拆分。
    //   cssCodeSplit: true,
    //   // 构建后是否生成 source map 文件。 boolean | 'inline' | 'hidden'
    //   sourcemap: false,
    //   // chunk 大小警告的限制（以 kbs 为单位）。
    //   chunkSizeWarningLimit: 500
    // }
  }
})
