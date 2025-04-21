<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
    <div class="home">This is Home</div>
    <TheWelcome />
  </main>
</template>

<style scoped lang="scss">
.home {
  color: $primary-color;
}
</style>
