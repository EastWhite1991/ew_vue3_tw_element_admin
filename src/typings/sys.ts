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
