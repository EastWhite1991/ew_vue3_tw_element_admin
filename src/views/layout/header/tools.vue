<template>
  <div class="mr-6 flex items-center gap-4">
    <el-tooltip class="" effect="dark" content="刷新" placement="bottom">
      <el-icon
        class="h-8 w-8 cursor-pointer rounded-full border border-solid border-gray-200 shadow dark:border-gray-600"
        :class="showRefreshAnimation ? 'animate-spin' : ''"
        @click="toggleRefresh"
      >
        <Refresh />
      </el-icon>
    </el-tooltip>
    <el-tooltip class="" effect="dark" content="切换主题" placement="bottom">
      <el-icon
        v-if="appStore.isDark"
        class="h-8 w-8 cursor-pointer rounded-full border border-solid border-gray-600 shadow"
        @click="appStore.toggleTheme(false)"
      >
        <Sunny />
      </el-icon>
      <el-icon
        v-else
        class="h-8 w-8 cursor-pointer rounded-full border border-solid border-gray-200 shadow"
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

import { emitter } from '@/utils/bus'

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
