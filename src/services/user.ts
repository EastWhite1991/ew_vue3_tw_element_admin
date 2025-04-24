import service from '@/utils/request'

export const joinInBlackList = () => {
  return service({
    url: '/user/joinInBlackList',
    method: 'post',
  })
}

export const getCaptcha = () => {
  return service({
    url: '/captcha',
    method: 'get',
  })
}

export const login = (loginForm: any) => {
  return service({
    url: '/login',
    method: 'get',
    params: loginForm,
  })
}

export const getUserInfo = () => {
  return service({
    url: '/userInfo',
    method: 'get',
  })
}
