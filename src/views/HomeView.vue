<template>
  <main>
    <div class="home bg-deepblue container">
      <div class="text-5xl font-bold text-white">This is Home</div>
      <button class="bg-amber text-alabaster mt-12 rounded border-4 px-6 py-4 text-2xl font-bold">
        Button1
      </button>
      <button
        class="bg-amber mt-12 ml-10 rounded border-4 px-6 py-4 text-2xl font-bold text-green-500"
      >
        Button2
      </button>
    </div>
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
