<template>
  <div class="tabs-wrapper">
    <el-tabs
      v-model="activeValue"
      :closable="!(historyMenus.length === 1 && route.name === defaultRouter)"
      type="card"
      class="bg-white text-slate-700 dark:text-slate-500 dark:bg-slate-900"
      @contextmenu.prevent="openContextMenu($event)"
      @tab-click="changeTab"
      @tab-remove="removeTab"
      @click.middle.prevent="middleCloseTab($event)"
    >
      <el-tab-pane
        v-for="item in historyMenus"
        :key="getFmtString(item)"
        :label="item.meta.title"
        :name="getFmtString(item)"
        :tab="item"
        class="border-none"
      >
        <template #label>
          <span
            :tab="item"
            :class="
              activeValue === getFmtString(item)
                ? 'text-active'
                : 'text-gray-600 dark:text-slate-400 '
            "
            ><i
              :class="
                activeValue === getFmtString(item)
                  ? 'text-active'
                  : 'text-gray-600 dark:text-slate-400'
              "
            />
            {{ fmtTitle(item.meta.title, item) }}</span
          >
        </template>
      </el-tab-pane>
    </el-tabs>

    <!--自定义右键菜单html代码-->
    <ul
      v-show="contextMenuVisible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="closeAll">关闭所有</li>
      <li @click="closeLeft">关闭左侧</li>
      <li @click="closeRight">关闭右侧</li>
      <li @click="closeOther">关闭其他</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { emitter } from '@/utils/bus.js'
import { fmtTitle } from '@/utils/helpers'

defineOptions({
  name: 'HistoryComponent',
})

const route = useRoute()
const router = useRouter()

const getFmtString = (item: any) => {
  return item.name + JSON.stringify(item.query) + JSON.stringify(item.params)
}

const historyMenus = ref<any[]>([])
const activeValue = ref<any>('')
const contextMenuVisible = ref(false)

const userStore = useUserStore()

const left = ref<any>(0)
const top = ref<any>(0)
const isCollapse = ref<any>(false)
const isMobile = ref<any>(false)
const rightActive = ref<any>('')
const defaultRouter = computed(() => userStore?.userInfo?.authority?.defaultRouter)

const openContextMenu = (e: any) => {
  if (historyMenus.value.length === 1 && route.name === defaultRouter.value) {
    return false
  }
  let id = ''
  if (e.srcElement.nodeName === 'SPAN') {
    id = e.srcElement.offsetParent.id
  } else {
    id = e.srcElement.id
  }
  if (id) {
    contextMenuVisible.value = true

    left.value = e.clientX
    top.value = e.clientY + 10
    rightActive.value = id.substring(4)
  }
}

const closeAll = () => {
  historyMenus.value = [
    {
      name: defaultRouter.value,
      meta: {
        title: '首页',
      },
      query: {},
      params: {},
    },
  ]
  router.push({ name: defaultRouter.value })
  contextMenuVisible.value = false
  sessionStorage.setItem('historyMenus', JSON.stringify(historyMenus.value))
}

const closeLeft = () => {
  let right: any
  const rightIndex = historyMenus.value.findIndex((item) => {
    if (getFmtString(item) === rightActive.value) {
      right = item
    }
    return getFmtString(item) === rightActive.value
  })
  const activeIndex = historyMenus.value.findIndex(
    (item) => getFmtString(item) === activeValue.value,
  )
  historyMenus.value.splice(0, rightIndex)
  if (rightIndex > activeIndex) {
    router.push(right)
  }
  sessionStorage.setItem('historyMenus', JSON.stringify(historyMenus.value))
}
const closeRight = () => {
  let right: any
  const leftIndex = historyMenus.value.findIndex((item) => {
    if (getFmtString(item) === rightActive.value) {
      right = item
    }
    return getFmtString(item) === rightActive.value
  })
  const activeIndex = historyMenus.value.findIndex(
    (item) => getFmtString(item) === activeValue.value,
  )
  historyMenus.value.splice(leftIndex + 1, historyMenus.value.length)
  if (leftIndex < activeIndex) {
    router.push(right)
  }
  sessionStorage.setItem('historyMenus', JSON.stringify(historyMenus.value))
}
const closeOther = () => {
  let right: any
  historyMenus.value = historyMenus.value.filter((item) => {
    if (getFmtString(item) === rightActive.value) {
      right = item
    }
    return getFmtString(item) === rightActive.value
  })
  router.push(right)
  sessionStorage.setItem('historyMenus', JSON.stringify(historyMenus.value))
}
const isSame = (route1: any, route2: any) => {
  if (route1.name !== route2.name) {
    return false
  }
  if (
    Object.keys(route1.query).length !== Object.keys(route2.query).length ||
    Object.keys(route1.params).length !== Object.keys(route2.params).length
  ) {
    return false
  }
  for (const key in route1.query) {
    if (route1.query[key] !== route2.query[key]) {
      return false
    }
  }
  for (const key in route1.params) {
    if (route1.params[key] !== route2.params[key]) {
      return false
    }
  }
  return true
}
const setTab = (route: any) => {
  if (!historyMenus.value.some((item) => isSame(item, route))) {
    const obj: any = {}
    obj.name = route.name
    obj.meta = { ...route.meta }
    delete obj.meta.matched
    obj.query = route.query
    obj.params = route.params
    historyMenus.value.push(obj)
  }
  window.sessionStorage.setItem('activeValue', getFmtString(route))
}

const historyMap = ref<any>({})

const changeTab = (TabsPaneContext: any) => {
  const name = TabsPaneContext?.props?.name
  if (!name) return
  const tab = historyMap.value[name]
  router.push({
    name: tab.name,
    query: tab.query,
    params: tab.params,
  })
}
const removeTab = (tab: any) => {
  const index = historyMenus.value.findIndex((item) => getFmtString(item) === tab)
  if (getFmtString(route) === tab) {
    if (historyMenus.value.length === 1) {
      router.push({ name: defaultRouter.value })
    } else {
      if (index < historyMenus.value.length - 1) {
        router.push({
          name: historyMenus.value[index + 1].name,
          query: historyMenus.value[index + 1].query,
          params: historyMenus.value[index + 1].params,
        })
      } else {
        router.push({
          name: historyMenus.value[index - 1].name,
          query: historyMenus.value[index - 1].query,
          params: historyMenus.value[index - 1].params,
        })
      }
    }
  }
  historyMenus.value.splice(index, 1)
}

watch(
  () => contextMenuVisible.value,
  () => {
    if (contextMenuVisible.value) {
      document.body.addEventListener('click', () => {
        contextMenuVisible.value = false
      })
    } else {
      document.body.removeEventListener('click', () => {
        contextMenuVisible.value = false
      })
    }
  },
)

watch(
  () => route,
  (to) => {
    if (to.name === 'Login' || to.name === 'Reload') {
      return
    }
    historyMenus.value = historyMenus.value.filter((item) => !item.meta.closeTab)
    setTab(to)
    sessionStorage.setItem('historyMenus', JSON.stringify(historyMenus.value))
    activeValue.value = window.sessionStorage.getItem('activeValue')
  },
  { deep: true },
)

watch(
  () => historyMenus.value,
  () => {
    sessionStorage.setItem('historyMenus', JSON.stringify(historyMenus.value))
    historyMap.value = {}
    historyMenus.value.forEach((item) => {
      historyMap.value[getFmtString(item)] = item
    })
    emitter.emit('setKeepAlive', historyMenus.value)
  },
  {
    deep: true,
  },
)

const initPage = () => {
  // 全局监听 关闭当前页面函数
  emitter.on('closeThisPage', () => {
    removeTab(getFmtString(route))
  })
  // 全局监听 关闭所有页面函数
  emitter.on('closeAllPage', () => {
    closeAll()
  })
  emitter.on('mobile', (data) => {
    isMobile.value = data
  })
  emitter.on('collapse', (data) => {
    isCollapse.value = data
  })

  emitter.on('setQuery', (data: any) => {
    const index = historyMenus.value.findIndex((item) => getFmtString(item) === activeValue.value)
    historyMenus.value[index].query = data
    activeValue.value = getFmtString(historyMenus.value[index])
    const currentUrl = window.location.href.split('?')[0]
    const currentSearchParams = new URLSearchParams(data).toString()
    window.history.replaceState({}, '', `${currentUrl}?${currentSearchParams}`)
    sessionStorage.setItem('historyMenus', JSON.stringify(historyMenus.value))
  })

  emitter.on('switchTab', async (data: any) => {
    const index = historyMenus.value.findIndex((item) => item.name === data.name)
    if (index < 0) {
      return
    }
    for (const key in data.query) {
      data.query[key] = String(data.query[key])
    }
    for (const key in data.params) {
      data.params[key] = String(data.params[key])
    }

    historyMenus.value[index].query = data.query || {}
    historyMenus.value[index].params = data.params || {}
    await nextTick()
    router.push(historyMenus.value[index])
  })
  const initHistorys = [
    {
      name: defaultRouter.value,
      meta: {
        title: '首页',
      },
      query: {},
      params: {},
    },
  ]
  setTab(route)
  historyMenus.value = JSON.parse(sessionStorage.getItem('historyMenus') as any) || initHistorys
  if (!window.sessionStorage.getItem('activeValue')) {
    activeValue.value = getFmtString(route)
  } else {
    activeValue.value = window.sessionStorage.getItem('activeValue')
  }
  if (window.sessionStorage.getItem('needCloseAll') === 'true') {
    closeAll()
    window.sessionStorage.removeItem('needCloseAll')
  }
}
initPage()

onUnmounted(() => {
  emitter.off('collapse')
  emitter.off('mobile')
})

const middleCloseTab = (e: any) => {
  if (historyMenus.value.length === 1 && route.name === defaultRouter.value) {
    return false
  }
  let id = ''
  if (e.srcElement.nodeName === 'SPAN') {
    id = e.srcElement.offsetParent.id
  } else {
    id = e.srcElement.id
  }
  if (id) {
    removeTab(id.substring(4))
  }
}
</script>

<style lang="scss" scoped>
.contextmenu {
  @apply bg-white dark:bg-slate-900 w-28 m-0 py-2.5 px-0 border border-gray-200 text-sm shadow-md rounded absolute z-50 border-solid dark:border-slate-800;
}

.contextmenu li {
  @apply text-slate-700 dark:text-slate-200 text-base list-none px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer;
}

$base-tag-item-height: 4rem;

.tabs-wrapper {
  ::v-deep(.el-tabs--card > .el-tabs__header) {
    border: none;
  }
  ::v-deep(.el-tabs__nav-scroll) {
    padding: 4px 4px;
  }

  ::v-deep(.el-tabs__nav) {
    border: 0;
  }

  ::v-deep(.el-tabs__header) {
    border-bottom: 0;
  }
  ::v-deep(.el-tabs__item) {
    box-sizing: border-box;
    border: 1px solid var(--el-border-color-darker);
    border-radius: 2px;
    margin-right: 5px;
    margin-left: 2px;
    transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
    height: 34px;
    &.is-active {
      border: 1px solid var(--el-color-primary);
    }
  }
  ::v-deep(.el-tabs__item):first-child {
    border: 1px solid var(--el-border-color-darker);
    &.is-active {
      border: 1px solid var(--el-color-primary);
    }
  }
}
</style>
