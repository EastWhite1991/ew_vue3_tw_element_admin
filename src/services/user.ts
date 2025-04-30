import service from '@/utils/request'
import type { ILoginForm, ILoginResult, IUserInfo } from '@/typings/user'
import type { ApiResponse } from '@/typings/sys'

export const joinInBlackList = (): Promise<ApiResponse<void>> => {
  return service({
    url: '/user/joinInBlackList',
    method: 'post',
  })
}

export const getCaptcha = (): Promise<
  ApiResponse<{
    captchaId: string
    picPath: string
  }>
> => {
  return service({
    url: '/captcha',
    method: 'get',
  })
}

export const login = (loginForm: ILoginForm): Promise<ApiResponse<ILoginResult>> => {
  return service({
    url: '/login',
    method: 'get',
    params: loginForm,
  })
}

export const getUserInfo = (): Promise<ApiResponse<IUserInfo>> => {
  return service({
    url: '/userInfo',
    method: 'get',
  })
}
