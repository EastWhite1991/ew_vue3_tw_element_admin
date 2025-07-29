import { alovaInstance } from '../core'

// 获取验证码信息
export const getUserCaptcha = () => alovaInstance.Post('/base/captcha')
