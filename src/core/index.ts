import type { App } from 'vue'
import { register } from './register'

export default {
  install: (app: App) => {
    register(app)
    console.log(`
      hello world!
    `)
  },
}
