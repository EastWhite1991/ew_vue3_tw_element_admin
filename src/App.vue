<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app" class="bg-gray-50 dark:bg-slate-800 text-slate-700 dark:text-slate-500">
    <RouterView />
  </div>
</template>

<style lang="scss">
#app {
  height: 100vh;
  overflow: hidden;
  font-weight: 400 !important;
}

.el-button {
  font-weight: 400 !important;
}
</style>
