<template>
  <main>
    <div class="home">This is Home</div>
    <el-button type="primary" @click="appStore.toggleTheme(false)">切换亮色主题</el-button>
    <el-button type="default" @click="appStore.toggleTheme(true)">切换暗色主题</el-button>
  </main>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<style scoped lang="scss">
.home {
  color: $primary-color;
}
</style>
