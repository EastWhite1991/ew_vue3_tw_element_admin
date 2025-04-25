<template>
  <div>
    <h1>LayoutView</h1>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'

defineOptions({
  name: 'LayoutView',
})

const userStore = useUserStore()

onMounted(() => {
  // 挂载一些通用的事件
  // emitter.on('reload', reload)
  if (userStore.loadingInstance) {
    userStore.loadingInstance.close()
  }
})
</script>

<style scoped></style>
