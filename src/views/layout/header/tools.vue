<template>
  <div class="flex items-center gap-4 mr-6">
    <el-tooltip class="" effect="dark" content="刷新" placement="bottom">
      <el-icon
        class="w-8 h-8 shadow rounded-full border border-gray-200 dark:border-gray-600 cursor-pointer border-solid"
        :class="showRefreshAnimation ? 'animate-spin' : ''"
        @click="toggleRefresh"
      >
        <Refresh />
      </el-icon>
    </el-tooltip>
    <el-tooltip class="" effect="dark" content="切换主题" placement="bottom">
      <el-icon
        v-if="appStore.isDark"
        class="w-8 h-8 shadow rounded-full border border-gray-600 cursor-pointer border-solid"
        @click="appStore.toggleTheme(false)"
      >
        <Sunny />
      </el-icon>
      <el-icon
        v-else
        class="w-8 h-8 shadow rounded-full border border-gray-200 cursor-pointer border-solid"
        @click="appStore.toggleTheme(true)"
      >
        <Moon />
      </el-icon>
    </el-tooltip>

    <!-- <gva-setting v-model:drawer="showSettingDrawer"></gva-setting> -->
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ToolsView',
})

import { ref } from 'vue'
import { emitter } from '@/utils/bus'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
// const showSettingDrawer = ref(false)
const showRefreshAnimation = ref(false)

const toggleRefresh = () => {
  showRefreshAnimation.value = true
  emitter.emit('reload')
  setTimeout(() => {
    showRefreshAnimation.value = false
  }, 1000)
}

const first = ref('')
const command = ref()

const handleCommand = () => {
  command.value.open()
}
const initPage = () => {
  // 判断当前用户的操作系统
  if (window.localStorage.getItem('osType') === 'WIN') {
    first.value = 'Ctrl'
  } else {
    first.value = '⌘'
  }
  // 当用户同时按下ctrl和k键的时候
  const handleKeyDown = (e: any) => {
    if (e.ctrlKey && e.key === 'k') {
      // 阻止浏览器默认事件
      e.preventDefault()
      handleCommand()
    }
  }
  window.addEventListener('keydown', handleKeyDown)
}

initPage()
</script>

<style scoped lang="scss"></style>
