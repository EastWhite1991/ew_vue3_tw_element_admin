import { userAlova } from '..'

// 获取验证码信息
export const getUserCaptcha = () => userAlova.Post('/base/captcha')
