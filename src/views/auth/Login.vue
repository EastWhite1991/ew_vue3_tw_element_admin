<template>
  <div id="userLayout">
    <div class="flex min-h-screen flex-col items-center justify-center">
      <div class="mb-9">
        <p class="text-center text-4xl font-bold">
          {{ $appInfo.appName }}
        </p>
        <p class="mt-2.5 text-center text-sm font-normal text-gray-500">
          A management platform using Golang and Vue3
        </p>
      </div>

      <!-- 登录表单 -->
      <el-form
        ref="loginForm"
        :model="loginFormData"
        :rules="loginFormRules"
        :validate-on-rule-change="false"
        @keyup.enter="submitForm"
      >
        <el-form-item prop="username" class="mb-6">
          <el-input
            v-model="loginFormData.username"
            size="large"
            suffix-icon="user"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item prop="password" class="mb-6">
          <el-input
            v-model="loginFormData.password"
            show-password
            type="password"
            size="large"
            suffix-icon="lock"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item class="mb-6" v-if="loginFormData.openCaptcha" prop="captcha">
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
                :src="picPath"
                alt="请输入验证码"
                class="h-full w-full"
                @click="loginVerify()"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item class="mt-10">
          <el-button
            type="primary"
            @click="submitForm"
            size="large"
            class="shadow-active h-11 w-full shadow"
          >
            登 录
          </el-button>
        </el-form-item>
        <el-form-item class="mt-6">
          <el-button
            type="primary"
            @click="checkInit"
            size="large"
            class="shadow-active h-11 w-full shadow"
          >
            前往初始化
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRequest } from 'alova/client'
import { userAlova } from '@/api'
import { ElMessage } from 'element-plus'
import { checkPassword, checkUsername } from '@/utils/user'
import type { LoginFormData } from '@/typings/user'

defineOptions({
  name: 'LoginView',
})

// 登录相关操作
const loginForm = ref<any>(null)
const picPath = ref('')
const loginFormData = reactive<LoginFormData>({
  username: 'admin',
  password: '',
  captcha: '',
  captchaId: '',
  openCaptcha: false,
})

const loginFormRules = {
  username: [{ validator: checkUsername, trigger: 'blur' }],
  password: [{ validator: checkPassword, trigger: 'blur' }],
  captcha: [
    {
      message: '验证码格式不正确',
      trigger: 'blur',
    },
  ],
}

// 使用alova实例创建method并传给useRequest即可发送请求
const { send } = useRequest(userAlova.Post('/base/captcha'), {
  immediate: true, // 是否立即发送请求，默认为true
}).onSuccess((event: any) => {
  const res = event?.data?.data as any // 当前请求的响应数据
  picPath.value = res.picPath
  loginFormData.captchaId = res.captchaId
  loginFormData.openCaptcha = res.openCaptcha
  loginFormRules.captcha.push({
    max: res.captchaLength,
    min: res.captchaLength,
    message: `请输入${res.captchaLength}位验证码`,
    trigger: 'blur',
  } as any)
})

const loginVerify = async () => {
  send()
}

const submitForm = () => {
  loginForm?.value.validate(async (v: any) => {
    if (!v) {
      // 未通过前端静态验证
      ElMessage({
        type: 'error',
        message: '请填写完整信息',
        showClose: true,
      })
      send()
      return false
    }

    // 通过验证
    const res: any = await userAlova.Post('/base/login', loginFormData)
    if (res.code === 0 && res.data) {
      ElMessage({
        type: 'success',
        message: res.msg,
        showClose: true,
      })
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '登录失败',
        showClose: true,
      })
      send()
      return false
    }
  })
}

const checkDB = async () => {
  const res = await userAlova.Post('/init/checkdb')
  return res
}

const checkInit = async () => {
  const res: any = await checkDB()
  console.log('🚀 ~ checkInit ~ res:', res)
  if (res.code === 0) {
    if (res.data?.needInit) {
      // userStore.NeedInit()
      // await router.push({ name: 'Init' })
    } else {
      ElMessage({
        type: 'info',
        message: '已配置数据库信息，无法初始化',
      })
    }
  }
}
</script>
