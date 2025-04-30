import { useDark, usePreferredDark } from '@vueuse/core'
import { ref, reactive, watchEffect } from 'vue'
import { defineStore } from 'pinia'

/**
 * 应用配置接口
 */
export interface AppConfig {
  weakness: boolean;
  grey: boolean;
  primaryColor: string;
  showTabs: boolean;
  darkMode: 'auto' | 'dark' | 'light';
  layout_side_width: number;
  layout_side_collapsed_width: number;
  layout_side_item_height: number;
  show_watermark: boolean;
  side_mode: 'normal' | 'compact' | 'mini' | 'head' | 'combination';
  transition_type: string;
  [key: string]: string | number | boolean;
}

const baseConfig: AppConfig = {
  weakness: false,
  grey: false,
  primaryColor: '#3b82f6',
  showTabs: true,
  darkMode: 'auto',
  layout_side_width: 256,
  layout_side_collapsed_width: 80,
  layout_side_item_height: 48,
  show_watermark: true,
  side_mode: 'normal',
  // 页面过渡动画配置
  transition_type: 'slide',
}

export const useAppStore = defineStore('app', () => {
  const device = ref<'desktop' | 'mobile'>('desktop')
  const drawerSize = ref('')
  const operateMinWith = ref('240')
  const config = reactive<AppConfig>({
    weakness: false,
    grey: false,
    primaryColor: '#3b82f6',
    showTabs: true,
    darkMode: 'auto',
    layout_side_width: 256,
    layout_side_collapsed_width: 80,
    layout_side_item_height: 48,
    show_watermark: true,
    side_mode: 'normal',
    transition_type: 'slide', // 页面过渡动画配置
  })

  // useDark 用于控制和监听深色模式状态。它接受一个可选的参数，用于指定深色模式的控制方式。
  // 这个参数可以是一个字符串，也可以是一个对象。
  // 如果是字符串，它会被当作是一个 CSS 选择器，用于选择要控制深色模式的元素。
  // 如果是对象，它可以包含以下属性：
  // - selector: 一个 CSS 选择器，用于选择要控制深色模式的元素。
  // - attribute: 一个字符串，用于指定要控制深色模式的元素的属性。
  // - valueDark: 一个字符串，用于指定深色模式时的属性值。
  // - valueLight: 一个字符串，用于指定浅色模式时的属性值。
  // 这个函数会返回一个响应式的 ref，其值为 true 表示深色模式，为 false 表示浅色模式。
  // 你可以使用这个 ref 来动态设置应用的深色模式或浅色模式。
  // 例如，你可以使用这个 ref 来动态设置应用的主题，或者根据用户的选择来切换深色或浅色的界面元素。
  // 注意，useDark 是一个组合函数，它会在内部使用 useMediaQuery 来实现深色模式的检测和设置。
  // 你可以在应用的任何地方使用 useDark 来控制和监听深色模式状态。
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: 'light',
  })

  // usePreferredDark 用于获取用户系统偏好的深色模式设置。
  // 它返回一个响应式的 ref，其值为 true 表示用户系统偏好深色模式，为 false 表示用户系统偏好浅色模式。
  // 这个 ref 可以用于根据用户的偏好设置应用深色模式或浅色模式。
  // 例如，你可以使用这个 ref 来动态设置应用的主题，或者根据用户的偏好设置显示深色或浅色的界面元素。
  // 注意，usePreferredDark 是一个组合函数，它会在内部使用 useDark 来实现深色模式的检测和设置。
  // 你可以在应用的任何地方使用 usePreferredDark 来获取用户系统偏好的深色模式设置。
  const preferredDark = usePreferredDark()

  watchEffect(() => {
    // 若 darkMode 为 'auto'，则根据用户系统偏好设置深色模式状态。
    if (config.darkMode === 'auto') {
      isDark.value = preferredDark.value
    } else {
      // 若 darkMode 为 'light'，则设置深色模式状态为 false。
      isDark.value = config.darkMode === 'dark'
    }
  })

  const toggleDarkMode = (mode: 'auto' | 'dark' | 'light') => {
    config.darkMode = mode
  }

  const toggleTheme = (isDarkMode: boolean) => {
    isDark.value = isDarkMode
  }

  const toggleDevice = (e: 'desktop' | 'mobile') => {
    if (e === 'mobile') {
      drawerSize.value = '100%'
      operateMinWith.value = '80'
    } else {
      drawerSize.value = '800'
      operateMinWith.value = '240'
    }
    device.value = e
  }

  const toggleSideMode = (e: 'normal' | 'compact' | 'mini' | 'head' | 'combination') => {
    config.side_mode = e
  }

  const resetConfig = () => {
    for (const baseConfigKey in baseConfig) {
      config[baseConfigKey] = baseConfig[baseConfigKey]
    }
  }

  return {
    isDark,
    device,
    drawerSize,
    operateMinWith,
    config,
    toggleSideMode,
    toggleDarkMode,
    toggleTheme,
    toggleDevice,
    resetConfig,
  }
})
