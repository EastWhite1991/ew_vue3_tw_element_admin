/**
 * @description: 表单防止重复提交指令
 * @param {*}
 * @return {*}
 */
import type { Directive, DirectiveBinding } from 'vue'

// 防止重复提交的指令
const vRepeat: Directive = {
  mounted(el: HTMLElement & { disabled?: boolean }, binding: DirectiveBinding<number>) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 2000)
      }
    })
  },
}

export default vRepeat
