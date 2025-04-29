<template>
  <div class="h-screen w-screen bg-gray-50 text-slate-700 dark:bg-slate-800 dark:text-slate-500">
    <LayoutHeader />
    <div class="gva-container box-border flex h-full w-full flex-row pt-16">
      <aside-view
        v-if="
          config.side_mode === 'normal' ||
          (device === 'mobile' && config.side_mode == 'head') ||
          (device === 'mobile' && config.side_mode == 'combination')
        "
      />
      <aside-view v-if="config.side_mode === 'combination' && device !== 'mobile'" mode="normal" />
      <div class="h-full w-0 flex-1 px-2">
        <history-tabs v-if="config.showTabs" />
        <div
          class="overflow-auto"
          :class="config.showTabs ? 'gva-container2' : 'gva-container pt-1'"
        >
          <router-view v-if="reloadFlag" v-slot="{ Component, route }">
            <div id="gva-base-load-dom" class="gva-body-h bg-gray-50 dark:bg-slate-800">
              <transition mode="out-in" :name="route.meta.transitionType || config.transition_type">
                <keep-alive :include="routerStore.keepAliveRouters">
                  <component :is="Component" :key="route.fullPath" />
                </keep-alive>
              </transition>
            </div>
          </router-view>
          <!-- <BottomInfo /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LayoutHeader from './header/index.vue'
import AsideView from '@/views/layout/aside/index.vue'
import HistoryTabs from './tabs/index.vue'
import { emitter } from '@/utils/bus'

const appStore = useAppStore()
const { config, isDark, device } = storeToRefs(appStore)

const router = useRouter()
const route = useRoute()
const routerStore = useRouterStore()
const font = reactive({
  color: 'rgba(0, 0, 0, .15)',
})

watchEffect(() => {
  font.color = isDark.value ? 'rgba(255,255,255, .15)' : 'rgba(0, 0, 0, .15)'
})

defineOptions({
  name: 'LayoutView',
})

const userStore = useUserStore()

onMounted(() => {
  // 挂载一些通用的事件
  emitter.on('reload', reload)
  if (userStore.loadingInstance) {
    userStore.loadingInstance.close()
  }
})

const reloadFlag = ref<boolean>(true)
let reloadTimer: any = null
const reload = async () => {
  if (reloadTimer) {
    window.clearTimeout(reloadTimer)
  }
  reloadTimer = window.setTimeout(async () => {
    if (route.meta.keepAlive) {
      reloadFlag.value = false
      await nextTick()
      reloadFlag.value = true
    } else {
      const title = route.meta.title as string
      router.push({ name: 'Reload', params: { title } })
    }
  }, 400)
}
</script>

<style scoped></style>
