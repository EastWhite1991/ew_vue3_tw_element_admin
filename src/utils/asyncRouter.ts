// 导入所有的视图组件

import type { RouterItem } from '@/typings/sys'

const viewModules: Record<string, () => Promise<any>> = import.meta.glob('../views/**/*.vue')
// const pluginModules = import.meta.glob('../plugin/**/*.vue')

/**
 * 处理异步路由，将字符串格式的组件路径转换为实际的组件引用
 * @param asyncRouter 需要处理的路由配置数组
 */
export const asyncRouterHandle = (asyncRouter: RouterItem[]): void => {
  asyncRouter.forEach((item: RouterItem) => {
    if (item.component && typeof item.component === 'string') {
      if (!item.meta) {
        item.meta = { title: '' }
      }
      item.meta.path = '/src/' + item.component
      if (item.component.split('/')[0] === 'views') {
        item.component = dynamicImport(viewModules, item.component)
      }
      // else if (item.component.split('/')[0] === 'plugin') {
      //   item.component = dynamicImport(pluginModules, item.component)
      // }
    }
    if (item.children) {
      asyncRouterHandle(item.children)
    }
  })
}

/**
 * 根据组件路径从动态导入的模块中获取实际的组件
 * @param dynamicViewsModules 动态导入的视图模块集合
 * @param component 组件路径
 * @returns 动态导入的组件
 */
function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<any>>,
  component: string,
): () => Promise<any> {
  const keys = Object.keys(dynamicViewsModules)
  const matchKeys = keys.filter((key) => {
    const k = key.replace('../', '')
    return k === component
  })
  const matchKey = matchKeys[0]

  return dynamicViewsModules[matchKey]
}
