<template>
  <!-- 动态组件，根据 menuComponent 的值渲染不同组件 -->
  <component :is="menuComponent" v-if="!routerInfo.hidden" :router-info="routerInfo">
    <!-- 如果当前路由有子路由，递归渲染 AsideComponent 组件 -->
    <template v-if="routerInfo.children && routerInfo.children.length">
      <AsideComponent v-for="item in routerInfo.children" :key="item.name" :router-info="item" />
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// 导入所需组件
import MenuItem from './menuItem.vue'
import AsyncSubmenu from './asyncSubmenu.vue'

// 定义组件名称
defineOptions({
  name: 'AsideComponent',
})

// 定义组件接收的属性
const props = defineProps({
  routerInfo: {
    type: Object,
    default: () => null,
  },
  mode: {
    type: String,
    default: 'vertical',
  },
})

// 计算属性，根据 routerInfo 的子路由情况决定渲染哪个组件
const menuComponent = computed(() => {
  if (
    props.routerInfo.children &&
    props.routerInfo.children.filter((item: any) => !item.hidden).length
  ) {
    // 如果有可见的子路由，渲染 AsyncSubmenu 组件
    return AsyncSubmenu
  } else {
    // 否则渲染 MenuItem 组件
    return MenuItem
  }
})
</script>
