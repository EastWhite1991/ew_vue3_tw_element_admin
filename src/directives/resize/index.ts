/**
 * @description: Element 尺寸变化监听指令
 * @param {*}
 * @return {*}
 */
import type { Directive, DirectiveBinding } from 'vue'

// 定义调整大小的观察者支持的参数类型
type ResizeArgType = 'borderBoxSize' | 'contentBoxSize' | 'contentRect' | 'devicePixelContentBoxSize'

// 定义处理函数的参数类型
interface ResizeParams {
  height: number;
  width: number;
}

// 保存在weakMap中的值类型
interface ResizeObserverValue {
  arg?: ResizeArgType;
  handler: (params: ResizeParams | DOMRectReadOnly) => void;
}

const args: ResizeArgType[] = ['borderBoxSize', 'contentBoxSize', 'contentRect', 'devicePixelContentBoxSize']

const weakMap = new WeakMap<Element, ResizeObserverValue>()

const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
  for (const entry of entries) {
    const value = weakMap.get(entry.target)
    if (value) {
      let { arg } = value
      arg = arg || args[1]
      let params: ResizeParams | DOMRectReadOnly
      
      if (arg !== args[2]) {
        // 处理非contentRect的情况
        const boxSize = (entry as any)[arg][0]
        if (boxSize) {
          const { blockSize, inlineSize } = boxSize
          params = {
            height: blockSize,
            width: inlineSize,
          }
        } else {
          // 如果无法获取，使用默认值
          params = { height: 0, width: 0 }
        }
      } else {
        // contentRect已经是DOMRectReadOnly，直接使用
        params = entry.contentRect
      }
      
      value.handler(params)
    }
  }
})

const vResize: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { arg, value } = binding
    if (typeof value !== 'function') {
      console.warn(
        '[Directive warn]: Invalid value: validation failed for value. Must be a function.',
      )
      return
    }
    if (arg && !args.includes(arg as ResizeArgType)) {
      console.warn(
        `[Directive warn]: Invalid arg: validation failed for arg. Expected one of ${JSON.stringify(args)}, got value "${arg}".`,
      )
      return
    }
    resizeObserver.observe(el)
    weakMap.set(el, { arg: arg as ResizeArgType, handler: binding.value })
  },
  unmounted(el: HTMLElement) {
    resizeObserver.unobserve(el)
  },
}

export default vResize
