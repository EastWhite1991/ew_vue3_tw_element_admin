<template>
  <!-- Element Plus 子菜单组件，设置引用、索引和类名 -->
  <el-sub-menu
    ref="subMenu"
    :index="routerInfo.name"
    class="gva-sub-menu dark:text-slate-300 relative"
  >
    <!-- 定义子菜单标题 -->
    <template #title>
      <!-- 当菜单未折叠时的标题显示 -->
      <div
        v-if="!isCollapse"
        class="flex items-center"
        :style="{
          height: sideHeight,
        }"
      >
        <!-- 如果路由元信息中有图标，渲染对应图标 -->
        <el-icon v-if="routerInfo.meta.icon">
          <component :is="routerInfo.meta.icon" />
        </el-icon>
        <!-- 显示路由元信息中的标题 -->
        <span>{{ routerInfo.meta.title }}</span>
      </div>
      <!-- 当菜单折叠时的标题显示 -->
      <template v-else>
        <!-- 如果路由元信息中有图标，渲染对应图标 -->
        <el-icon v-if="routerInfo.meta.icon">
          <component :is="routerInfo.meta.icon" />
        </el-icon>
        <!-- 显示路由元信息中的标题 -->
        <span>{{ routerInfo.meta.title }}</span>
      </template>
    </template>
    <!-- 插槽，用于插入子菜单项 -->
    <slot />
  </el-sub-menu>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
// 导入应用状态管理模块
// 导入 Pinia 工具函数
import { storeToRefs } from 'pinia'
// 创建应用状态管理实例
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
// 从应用状态中解构出 config 并转换为响应式引用
const { config } = storeToRefs(appStore)

// 定义组件名称
defineOptions({
  name: 'AsyncSubmenu',
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

// 从父组件注入 isCollapse 状态，默认值为 false
const isCollapse = inject('isCollapse', {
  default: false,
})

// 计算菜单项的高度
const sideHeight = computed(() => {
  return config.value.layout_side_item_height + 'px'
})
</script>

<style lang="scss">
.gva-sub-menu {
  .el-sub-menu__title {
    height: v-bind('sideHeight') !important;
  }
}
</style>
