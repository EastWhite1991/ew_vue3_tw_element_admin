<template>
  <div class="mr-6 flex items-center gap-4">
    <el-tooltip effect="dark" content="刷新页面" placement="bottom" :show-after="500">
      <el-icon
        class="h-8 w-8 cursor-pointer rounded-full border border-solid border-gray-200 shadow dark:border-gray-600"
        :class="showRefreshAnimation ? 'animate-spin' : ''"
        @click="toggleRefresh"
      >
        <Refresh />
      </el-icon>
    </el-tooltip>
    <el-tooltip effect="dark" content="切换全屏" placement="bottom" :show-after="500">
      <el-icon
        class="h-8 w-8 cursor-pointer rounded-full border border-solid border-gray-200 shadow dark:border-gray-600"
        @click="toggleFullScreen()"
      >
        <FullScreen v-if="!isFullscreen" />
        <CopyDocument v-if="isFullscreen" />
      </el-icon>
    </el-tooltip>
    <el-tooltip effect="dark" content="清理缓存" placement="bottom" :show-after="500">
      <el-icon
        class="h-8 w-8 cursor-pointer rounded-full border border-solid border-gray-200 shadow dark:border-gray-600"
        @click="clearCache()"
        ><DeleteFilled
      /></el-icon>
    </el-tooltip>
    <el-tooltip effect="dark" content="切换主题" placement="bottom" :show-after="500">
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
import { useFullscreen } from '@vueuse/core'
import { ElMessage } from 'element-plus'

const appStore = useAppStore()
// const showSettingDrawer = ref(false)
const showRefreshAnimation = ref(false)

const { isSupported, isFullscreen, toggle } = useFullscreen()

const toggleFullScreen = () => {
  if (isSupported.value) {
    toggle()
  } else {
    ElMessage({
      message: `Your browser doesn't support full screen`,
      type: 'warning',
    })
  }
}

const toggleRefresh = () => {
  showRefreshAnimation.value = true
  emitter.emit('reload')
  setTimeout(() => {
    showRefreshAnimation.value = false
  }, 1000)
}

const clearCache = () => {
  ElMessage({
    message: '功能暂未开放',
    type: 'warning',
  })
  // 可以参考：https://github.com/gmingchen/agile-admin
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
