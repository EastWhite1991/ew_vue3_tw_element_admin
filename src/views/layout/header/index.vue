<template>
  <div
    class="fixed top-0 right-0 left-0 z-10 flex h-16 items-center justify-between bg-white px-2 text-slate-700 shadow dark:bg-slate-900 dark:text-slate-300 dark:shadow-gray-700"
  >
    <div class="flex flex-1 cursor-pointer items-center">
      <div
        class="flex cursor-pointer items-center"
        :class="isMobile ? '' : 'min-w-48'"
        @click="router.push({ path: '/' })"
      >
        <div
          v-if="!isMobile"
          class="ml-2 inline-flex text-2xl font-bold"
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
        <div class="flex h-full w-full items-center justify-center">
          <span
            class="flex cursor-pointer items-center justify-center text-black dark:text-gray-100"
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
import { fmtTitle } from '@/utils/helpers'
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
