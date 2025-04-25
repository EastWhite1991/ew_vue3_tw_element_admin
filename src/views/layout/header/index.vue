<template>
  <div
    class="flex justify-between fixed top-0 left-0 right-0 z-10 h-16 bg-white text-slate-700 dark:text-slate-300 dark:bg-slate-900 shadow dark:shadow-gray-700 items-center px-2"
  >
    <div class="flex items-center cursor-pointer flex-1">
      <div
        class="flex items-center cursor-pointer"
        :class="isMobile ? '' : 'min-w-48'"
        @click="router.push({ path: '/' })"
      >
        <div
          v-if="!isMobile"
          class="inline-flex font-bold text-2xl ml-2"
          :class="
            (config.side_mode === 'head' || config.side_mode === 'combination') && 'min-w-fit'
          "
        >
          EW_VUE_ADMIN
        </div>
      </div>

      <el-breadcrumb
        v-show="!isMobile"
        v-if="config.side_mode !== 'head' && config.side_mode !== 'combination'"
        class="ml-4"
      >
        <el-breadcrumb-item v-for="item in matched?.slice(1, matched.length)" :key="item.path">
          {{ fmtTitle(item.meta.title, route) }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <gva-aside v-if="config.side_mode === 'head' && !isMobile" class="flex-1" />
      <gva-aside
        v-if="config.side_mode === 'combination' && !isMobile"
        mode="head"
        class="flex-1"
      /> -->
    </div>

    <div class="flex items-center">
      <Tools />
      <el-dropdown>
        <div class="flex justify-center items-center h-full w-full">
          <span
            class="cursor-pointer flex justify-center items-center text-black dark:text-gray-100"
          >
            <span v-show="!isMobile" class="w-16">{{ userStore.userInfo.nickName }}</span>
            <el-icon>
              <arrow-down />
            </el-icon>
          </span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <span class="font-bold">
                当前角色：{{ userStore?.userInfo?.authority?.authorityName }}
              </span>
            </el-dropdown-item>
            <template v-if="userStore.userInfo.authorities">
              <el-dropdown-item
                v-for="item in userStore.userInfo.authorities.filter(
                  (i) => i.authorityId !== userStore.userInfo.authorityId,
                )"
                :key="item.authorityId"
                @click="changeUserAuth(item.authorityId)"
              >
                <span> 切换为：{{ item.authorityName }} </span>
              </el-dropdown-item>
            </template>
            <el-dropdown-item icon="avatar" @click="toPerson"> 个人信息 </el-dropdown-item>
            <el-dropdown-item icon="reading-lamp" @click="userStore.Logout">
              登 出
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { fmtTitle } from '@/utils/helpers'
import { useUserStore } from '@/stores/user'
import Tools from './tools.vue'

defineOptions({
  name: 'LayoutHeader',
})

const userStore = useUserStore()
const appStore = useAppStore()
const { device, config } = storeToRefs(appStore)
const isMobile = computed(() => {
  return device.value === 'mobile'
})

const router = useRouter()
const route = useRoute()
const matched = computed(() => route.matched)

const toPerson = () => {
  router.push({ name: 'person' })
}

const changeUserAuth = async (id: any) => {
  console.log('🚀 ~ changeUserAuth ~ id:', id)
  // const res = await setUserAuthority({
  //   authorityId: id
  // })
  // if (res.code === 0) {
  //   window.sessionStorage.setItem('needCloseAll', 'true')
  //   window.sessionStorage.setItem('needToHome', 'true')
  //   window.location.reload()
  // }
}
</script>

<!-- <style scoped></style> -->
