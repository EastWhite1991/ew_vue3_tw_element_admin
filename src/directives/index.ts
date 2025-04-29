import type { App } from 'vue'

export default {
  install: function (app: App) {
    const directives = import.meta.glob('./**/index.ts', { eager: true })
    for (const key in directives) {
      if (key === './index.js') return
      const directive = directives[key] as any
      const name = key.replace(/\.\/|\/index.ts/g, '')
      app.directive(name, directive.default || directive)
    }
  },
}
