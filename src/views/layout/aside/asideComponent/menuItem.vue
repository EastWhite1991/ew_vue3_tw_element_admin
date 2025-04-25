<template>
  <!-- Element Plus 菜单单项组件，设置索引、类名和高度样式 -->
  <el-menu-item
    :index="routerInfo.name"
    class="dark:text-slate-300 overflow-hidden"
    :style="{
      height: sideHeight,
    }"
  >
    <!-- 若路由元信息包含图标，渲染对应图标 -->
    <el-icon v-if="routerInfo.meta.icon">
      <component :is="routerInfo.meta.icon" />
    </el-icon>
    <!-- 定义菜单项的标题内容 -->
    <template #title>
      {{ routerInfo.meta.title }}
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
// 导入计算属性函数
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
// 创建应用状态管理实例
const appStore = useAppStore()
// 从应用状态中解构出 config 并转换为响应式引用
const { config } = storeToRefs(appStore)

// 定义组件名称
defineOptions({
  name: 'MenuItem',
})

// 定义组件接收的属性
defineProps({
  routerInfo: {
    default: function () {
      return null
    },
    type: Object,
  },
})

// 计算菜单项的高度
const sideHeight = computed(() => {
  return config.value.layout_side_item_height + 'px'
})
</script>

<style lang="scss"></style>
