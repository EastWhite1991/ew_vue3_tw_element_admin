export interface IMenu {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  parentId: number
  path: string
  name: string
  hidden: boolean
  component: string
  sort: number
  meta: IMenuMeta
  authoritys: null
  menuBtn: null
  menuId: number
  children: null
  parameters: any[]
  btns: null
}

interface IMenuMeta {
  activeName: string
  keepAlive: boolean
  defaultMenu: boolean
  title: string
  icon: string
  closeTab: boolean
}

export interface RouterItem {
  path: string
  name: string
  component: string | (() => Promise<any>)
  parent?: RouterItem
  children?: RouterItem[]
  hidden?: boolean
  meta: {
    title: string
    btns?: any
    hidden?: boolean
    keepAlive?: boolean
    defaultMenu?: boolean
    closeTab?: boolean
    path?: string
    icon?: string
    activeName?: string
  }
  parameters?: { [key: string]: string }[]
  btns?: any
}

export interface RouteMap {
  [key: string]: RouterItem
}

export interface PathInfoMap {
  [key: string]: string
}

export interface ApiResponse<T> {
  status: number
  data: T
  message?: string
}

export interface IAppInfo {
  appName: string
  appLogo: string
  appDesc: string
  appVersion: string
  appAuthor: string
}
