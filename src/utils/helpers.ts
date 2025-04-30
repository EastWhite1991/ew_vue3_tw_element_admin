import appInfo from '@/core/appInfo'
import type { RouteLocationNormalized } from 'vue-router'

/**
 * 格式化标题，替换标题中的占位符
 * @param title 包含占位符的标题字符串
 * @param routeTo 路由对象，包含params和query
 * @returns 格式化后的标题
 */
export const formatTitle = (title: string, routeTo: RouteLocationNormalized) => {
  // 非全局匹配的正则表达式，用于匹配单个 ${key} 格式的占位符，并捕获其中的 key 值。
  const reg = /\$\{(.+?)\}/
  // 全局匹配的正则表达式，用于匹配所有 ${key} 格式的占位符，并捕获其中的 key 值。
  const reg_g = /\$\{(.+?)\}/g
  // 检查 title 中是否包含 ${key} 格式的占位符。
  const result = title.match(reg_g)

  if (result) {
    // 如果有，则使用正则表达式进行匹配，并将匹配到的占位符替换为 routeTo.params[key] 或 routeTo.query[key] 的值。
    result.forEach((item: string) => {
      // 使用非全局正则表达式 reg 匹配当前占位符，提取出其中的 key。
      const match = item.match(reg)
      if (match && match[1]) {
        const key = match[1]
        // 尝试从 routeTo.params 对象中获取 key 对应的值，若不存在则从 routeTo.query 对象中获取。如果都不存在，则使用空字符串作为替换值。
        const value = (routeTo.params[key] || routeTo.query[key]) as string | undefined
        // 使用 replace 方法将占位符替换为实际的值。
        title = title.replace(item, value || '')
      }
    })
  }
  // 返回处理后的 title。
  return title
}

// 示例调用
// const title = '欢迎访问 ${appName}，当前用户：${username}'
// const routeTo = {
//   params: {
//     appName: 'Gin - Vue Admin'
//   },
//   query: {
//     username: 'admin'
//   }
// }
// const formattedTitle = fmtTitle(title, routeTo)

/**
 * 根据传入的页面标题和路由信息，生成完整的页面标题
 * @param pageTitle 页面标题
 * @param routeTo 路由对象
 * @returns 完整的页面标题
 */
export const getPageTitle = (pageTitle: string, routeTo: RouteLocationNormalized) => {
  if (pageTitle) {
    const title = formatTitle(pageTitle, routeTo)
    // 使用模板字符串将格式化后的 title 和全局配置中的 appName 拼接，中间用 - 连接，返回完整的页面标题。
    return `${title} - ${appInfo.appName}`
  }
  // 如果页面标题为空，则直接返回全局配置中的 appName。
  return `${appInfo.appName}`
}

/**
 * 已被formatTitle替代，保留以向后兼容
 * @deprecated 请使用formatTitle
 */
export const fmtTitle = (title: string, now: RouteLocationNormalized) => {
  // 非全局匹配的正则表达式，用于匹配单个 ${key} 格式的占位符，并捕获其中的 key 值。
  const reg = /\$\{(.+?)\}/
  // 全局匹配的正则表达式，用于匹配所有 ${key} 格式的占位符，并捕获其中的 key 值。
  const reg_g = /\$\{(.+?)\}/g
  // 检查 title 中是否包含 ${key} 格式的占位符。
  const result = title.match(reg_g)

  if (result) {
    // 如果有，则使用正则表达式进行匹配，并将匹配到的占位符替换为 now.params[key] 或 now.query[key] 的值。
    result.forEach((item: string) => {
      // 使用非全局正则表达式 reg 匹配当前占位符，提取出其中的 key。
      const match = item.match(reg)
      if (match && match[1]) {
        const key = match[1]
        // 尝试从 now.params 对象中获取 key 对应的值，若不存在则从 now.query 对象中获取。如果都不存在，则使用空字符串作为替换值。
        const value = now.params[key] || now.query[key]
        // 使用 replace 方法将占位符替换为实际的值。
        title = title.replace(item, value as string || '')
      }
    })
  }
  // 返回处理后的 title。
  return title
}

/**
 * 获取数据类型
 * @param target 任何值
 * @returns 返回目标的精确类型字符串（小写）
 */
export function getDataType(target: unknown): string {
  // 使用正则表达式匹配并提取类型名称
  const typeStrMatch = Object.prototype.toString.call(target).match(/^\[object\s(.*)]$/)
  return typeStrMatch ? typeStrMatch[1].toLowerCase() : 'unknown'
}
