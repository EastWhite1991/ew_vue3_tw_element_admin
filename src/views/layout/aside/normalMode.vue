<template>
  <div
    class="relative h-full bg-white text-slate-700 dark:text-slate-300 dark:bg-slate-900 shadow dark:shadow-gray-700"
    :class="isCollapse ? '' : '  px-2'"
    :style="{
      width: layoutSideWidth + 'px',
    }"
  >
    <!-- 滚动条组件 -->
    <el-scrollbar>
      <!-- Element Plus 菜单组件 -->
      <el-menu
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="active"
        class="border-r-0 w-full"
        unique-opened
        @select="selectMenuItem"
      >
        <!-- 遍历异步路由的子路由 -->
        <template v-for="item in routerStore.asyncRouters[0]?.children || []">
          <!-- 渲染侧边栏子组件，仅显示非隐藏路由 -->
          <aside-component v-if="!item.hidden" :key="item.name" :router-info="item" />
        </template>
      </el-menu>
    </el-scrollbar>
    <!-- 折叠/展开按钮 -->
    <div
      class="absolute bottom-8 right-2 w-8 h-8 bg-gray-50 dark:bg-slate-800 flex items-center justify-center rounded cursor-pointer"
      :class="isCollapse ? 'right-0 left-0 mx-auto' : 'right-2'"
      @click="toggleCollapse"
    >
      <!-- 根据折叠状态显示不同图标 -->
      <el-icon v-if="!isCollapse">
        <DArrowLeft />
      </el-icon>
      <el-icon v-else>
        <DArrowRight />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入组件和工具函数
import AsideComponent from './asideComponent/index.vue'
import { ref, provide, watchEffect, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { useRouterStore } from '@/stores/router'
// 获取应用状态
const appStore = useAppStore()
const { device, config } = storeToRefs(appStore)

// 定义组件名称
defineOptions({
  name: 'NormalAside',
})

// 获取当前路由和路由实例
const route = useRoute() as any
const router = useRouter()
// 获取路由状态
const routerStore = useRouterStore()
// 定义折叠状态
const isCollapse = ref(false)
// 定义当前激活菜单项
const active = ref<any>('')
// 计算侧边栏宽度
const layoutSideWidth = computed(() => {
  if (!isCollapse.value) {
    return config.value.layout_side_width
  } else {
    return config.value.layout_side_collapsed_width
  }
})
// 监听路由变化，更新激活菜单项
watchEffect(() => {
  if (route.name === 'Iframe') {
    active.value = decodeURIComponent(route?.query?.url)
    return
  }
  active.value = route.meta.activeName || route.name
})

// 监听设备类型变化，更新折叠状态
watchEffect(() => {
  if (device.value === 'mobile') {
    isCollapse.value = true
  } else {
    isCollapse.value = false
  }
})

// 提供折叠状态给子组件
provide('isCollapse', isCollapse)

// 菜单项选择处理函数
const selectMenuItem = (index: any) => {
  const query: any = {}
  const params: any = {}
  // 处理路由参数
  if (routerStore?.routeMap[index]?.parameters) {
    routerStore.routeMap[index]?.parameters.forEach((item: any) => {
      if (item.type === 'query') {
        query[item.key] = item.value
      } else {
        params[item.key] = item.value
      }
    })
  }

  // 避免重复导航
  if (index === route.name) return
  // 处理外部链接
  if (index.indexOf('http://') > -1 || index.indexOf('https://') > -1) {
    if (index === 'Iframe') {
      query.url = decodeURIComponent(index)
      router.push({
        name: 'Iframe',
        query,
        params,
      })
      return
    } else {
      window.open(index, '_blank')
      return
    }
  } else {
    // 内部路由导航
    router.push({ name: index, query, params })
  }
}

// 切换折叠状态函数
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style lang="scss"></style>
