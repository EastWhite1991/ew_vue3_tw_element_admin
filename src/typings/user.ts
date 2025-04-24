export interface ILoginResult {
  user: IUserInfo
  token: string
  expiresAt: number
}

export interface IUserInfo {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  uuid: string
  userName: string
  nickName: string
  headerImg: string
  authorityId: number
  authority: IUserAuthority
  authorities: IUserAuthority[]
  phone: string
  email: string
  enable: number
  originSetting: null
}

export interface IUserAuthority {
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: null
  authorityId: number
  authorityName: string
  parentId: number
  dataAuthorityId: null
  children: null
  menus: null
  defaultRouter: string
}

export interface ILoginForm {
  username: string
  password: string
  captcha: string
  captchaId: string
  openCaptcha?: boolean
}
