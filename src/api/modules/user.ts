import type { ILoginFormData } from '@/typings/user'
import { alovaInstance } from '../core'

// 获取验证码信息
export const getUserCaptcha = () => alovaInstance.Post('/base/captcha')

// 登录
export const login = (data: ILoginFormData) => alovaInstance.Post('/base/login', data)
