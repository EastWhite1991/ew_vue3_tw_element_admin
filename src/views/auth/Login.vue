<template>
  <div id="userLayout" class="relative h-full w-full">
    <div
      class="flex h-full w-full items-center justify-evenly rounded-lg bg-white md:h-screen md:w-screen md:bg-[#c2cae7]"
    >
      <div class="flex h-full w-10/12 items-center justify-evenly md:w-3/5">
        <div
          class="z-[999] box-border flex w-full flex-col justify-between rounded-lg pt-12 pb-10 md:w-96"
        >
          <div>
            <div class="mb-9">
              <p class="text-center text-4xl font-bold">EW_VUE_ADMIN</p>
              <p class="mt-2.5 text-center text-sm font-normal text-gray-500">
                A management platform using Golang and Vue
              </p>
            </div>
            <el-form
              ref="loginForm"
              :model="loginFormData"
              :rules="rules"
              :validate-on-rule-change="false"
              @keyup.enter="submitForm"
            >
              <el-form-item prop="username" class="mb-6">
                <el-input
                  v-model="loginFormData.username"
                  size="large"
                  placeholder="请输入用户名"
                  suffix-icon="user"
                />
              </el-form-item>
              <el-form-item prop="password" class="mb-6">
                <el-input
                  v-model="loginFormData.password"
                  show-password
                  size="large"
                  type="password"
                  placeholder="请输入密码"
                />
              </el-form-item>
              <el-form-item v-if="loginFormData.openCaptcha" prop="captcha" class="mb-6">
                <div class="flex w-full justify-between">
                  <el-input
                    v-model="loginFormData.captcha"
                    placeholder="请输入验证码"
                    size="large"
                    class="mr-5 flex-1"
                  />
                  <div class="h-11 w-1/3 rounded bg-[#c3d4f2]">
                    <img
                      v-if="picPath"
                      class="h-full w-full"
                      :src="picPath"
                      alt="请输入验证码"
                      @click="loginVerify()"
                    />
                  </div>
                </div>
              </el-form-item>
              <el-form-item class="mb-6">
                <el-button
                  class="shadow-active h-11 w-full shadow"
                  type="primary"
                  size="large"
                  @click="submitForm"
                  >登 录</el-button
                >
              </el-form-item>
              <el-form-item class="mb-6">
                <el-button
                  class="shadow-active h-11 w-full shadow"
                  type="primary"
                  size="large"
                  @click="checkInit"
                  >前往初始化</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { getCaptcha } from '@/services/user'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { ILoginForm } from '@/typings/user'

defineOptions({
  name: 'LoginView',
})

// 验证函数
const checkUsername = (rule: any, value: any, callback: any) => {
  if (value.length < 5) {
    return callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
}
const checkPassword = (rule: any, value: any, callback: any) => {
  if (value.length < 6) {
    return callback(new Error('请输入正确的密码'))
  } else {
    callback()
  }
}

// 获取验证码
const loginVerify = async () => {
  const ele = await getCaptcha()
  rules.captcha.push({
    max: ele.data.captchaLength,
    min: ele.data.captchaLength,
    message: `请输入${ele.data.captchaLength}位验证码`,
    trigger: 'blur',
  })
  picPath.value = ele.data.picPath
  loginFormData.captchaId = ele.data.captchaId
  loginFormData.openCaptcha = ele.data.openCaptcha
}
loginVerify()

// 登录相关操作
const loginForm = ref<any>(null)
const picPath = ref('')
const loginFormData = reactive<ILoginForm>({
  username: 'ian_kevin',
  password: '123456',
  captcha: '228193',
  captchaId: 'qNTCcdQmzomkxQo0k3RD',
  openCaptcha: true,
})
const rules = reactive<any>({
  username: [{ validator: checkUsername, trigger: 'blur' }],
  password: [{ validator: checkPassword, trigger: 'blur' }],
  captcha: [
    {
      message: '验证码格式不正确',
      trigger: 'blur',
    },
  ],
})

const userStore = useUserStore()
const login = async () => {
  return await userStore.LoginIn(loginFormData)
}
const submitForm = () => {
  loginForm.value.validate(async (valid: any) => {
    if (!valid) {
      // 未通过前端静态验证
      ElMessage({
        type: 'error',
        message: '请正确填写登录信息',
        showClose: true,
      })
      await loginVerify()
      return false
    }

    // 通过验证，请求登陆
    const flag = await login()

    // 登陆失败，刷新验证码
    if (!flag) {
      await loginVerify()
      return false
    }

    // 登陆成功
    return true
  })
}

// 跳转初始化
const checkInit = async () => {
  // 初始化
}
</script>
