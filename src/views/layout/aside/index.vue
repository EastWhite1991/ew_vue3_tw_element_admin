<template>
  <div>
    <!-- 渲染 normal-mode 组件的条件 -->
    <normal-mode
      v-if="
        config.side_mode === 'normal' ||
        (device === 'mobile' && config.side_mode == 'head') ||
        (device === 'mobile' && config.side_mode == 'combination')
      "
    />
    <!-- 当侧边栏模式为 'head' 且设备不是移动端时，渲染 head-mode 组件 -->
    <!-- <head-mode v-if="config.side_mode === 'head' && device !== 'mobile'" /> -->
    <!-- 当侧边栏模式为 'combination' 且设备不是移动端时，渲染 combination-mode 组件 -->
    <!-- <combination-mode
      v-if="config.side_mode === 'combination' && device !== 'mobile'"
      :mode="mode"
    /> -->
  </div>
</template>

<script setup lang="ts">
// 导入三种不同模式的侧边栏组件
import NormalMode from './normalMode.vue'
// import HeadMode from './headMode.vue'
// import CombinationMode from './combinationMode.vue'

defineOptions({
  name: 'AsideView',
})

// 定义组件接收的属性
defineProps({
  mode: {
    type: String,
    default: 'normal',
  },
})

// 从 pinia 中导入 storeToRefs 函数
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
// 创建 App store 实例
const appStore = useAppStore()
// 从 appStore 中解构出 config 和 device，并转换为响应式引用
const { config, device } = storeToRefs(appStore)
</script>
