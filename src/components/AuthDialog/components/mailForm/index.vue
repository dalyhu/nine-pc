<template>
  <div class="mail_form">
    <tabs v-if="[0, 1].includes(loginType)" v-model="loginType" @changeTab="changeLogin"></tabs>
    <el-form ref="formRef" :inline="true" :rules="rules" :model="ruleForm">
      <el-form-item prop="account" class="item_box">
        <el-input
          placeholder="请输入账号"
          maxlength="30"
          autocomplete="off"
          v-model.trim="ruleForm.account"
        >
          <template #prepend> <img src="/static/images/login/icon_account.svg" alt="" /></template>
        </el-input>
      </el-form-item>

      <el-form-item prop="mail" v-if="[2].includes(loginType)" class="item_box">
        <el-input placeholder="请输入邮箱" autocomplete="off" v-model.trim="ruleForm.mail">
          <template #prepend> <img src="/static/images/login/icon_mail.svg" alt="" /></template>
        </el-input>
      </el-form-item>

      <el-form-item prop="code" class="code_item" v-if="[0, 2, 3].includes(loginType)">
        <el-input placeholder="请输入验证码" :maxlength="6" v-model="ruleForm.code">
          <template #append
            ><span @click="handleSendCode">
              {{ timer === 0 ? '获取验证码' : `${timer}秒` }}</span
            ></template
          >
        </el-input>
      </el-form-item>

      <el-form-item prop="password" v-if="[1, 2, 3].includes(loginType)" class="item_box">
        <el-input
          :placeholder="loginType === 1 ? '请输入密码' : '请输入6-18位字母和数字登录密码'"
          type="password"
          autocomplete="new-password"
          :maxlength="loginType === 1 ? 32 : 18"
          v-model.trim="ruleForm.password"
        >
          <template #prepend> <img src="/static/images/login/icon_pass.svg" alt="" /></template>
        </el-input>
      </el-form-item>

      <el-form-item class="item_box" v-if="[2].includes(loginType)">
        <el-input
          placeholder="请输入邀请码（可不填写）"
          maxlength="11"
          v-model.trim="ruleForm.invite"
        >
          <template #prepend> <img src="/static/images/login/icon_invite.svg" alt="" /></template>
        </el-input>
      </el-form-item>

      <el-form-item
        v-if="[0, 1, 3].includes(loginType)"
        :class="['tip_btn_item', [3].includes(loginType) ? 'go_login_active' : '']"
      >
        <span @click="changeLogin([0, 1].includes(loginType) ? 3 : 0)">
          {{ [0, 1].includes(loginType) ? '忘记密码？' : '返回登录' }}
        </span>
      </el-form-item>

      <!-- <el-form-item class="btn_item" @click="handleSubmit"> {{ btnText }} </el-form-item> -->
      <el-form-item class="btn_item" @click="handleSubmit">
        <el-button color="transparent" :loading="confirmLoading">
          <div class="flex">
            <img v-if="inviteCode && loginType == 2" src="/static/images/promotion/vip.svg" />
            {{ btnText }}
          </div>
        </el-button>
      </el-form-item>

      <el-form-item class="warn_item">
        <span class="warn_text">{{
          [2].includes(loginType) ? '已有账号？' : '还没有发财账号？'
        }}</span>
        <span class="link_text" @click="changeLogin([2].includes(loginType) ? 0 : 2)">{{
          [2].includes(loginType) ? '返回登录' : '立即注册'
        }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
import mittBus from '@/utils/mittBus'
import { getBbsUrl } from '@/api/common'

const props = defineProps({
  loginModel: {
    type: Boolean,
    default: true
  },
  dialogVisible: {
    type: Boolean,
    default: false
  }
})

const store = useStore()
// const router = useRouter()

const loginType = ref(0) // 0验证码登录 1密码登录 2注册 3重置密码
const formRef = ref<FormInstance>()

const emits = defineEmits(['changeLogin'])

const route = useRoute()
const ruleForm = reactive({
  device_type: 'pc',
  account: '', // 账号
  mail: '', // 邮箱
  password: '', // 密码
  code: '', // 验证码
  invite: '', // 邀请码
  type: '' // 1注册 2忘记密码 3登录 6主播认证 9修改email
})

const confirmLoading = ref(false)

const inviteCode = ref('')
const setInviteCode = () => {
  const queryCode = route.query.invite_code
  const storageCode = sessionStorage.getItem('invite_code')
  if (queryCode && !storageCode) {
    sessionStorage.setItem('invite_code', queryCode)
  }
  inviteCode.value = queryCode || storageCode
}
const buttons = ['登录', '登录', '注册', '确认']
const btnText = computed(() => {
  if (loginType.value === 2 && inviteCode.value) {
    return 'VIP邀请您注册'
  }
  return buttons[loginType.value]
})

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      confirmLoading.value = true
      if ([0, 1].includes(loginType.value)) {
        handleLogin()
      } else if (loginType.value === 2) {
        handleSingUp()
      } else if (loginType.value === 3) {
        handleForgot()
      }
    }
  })
}

// 重置密码
const handleForgot = () => {
  store
    .dispatch('user/mailForgotPass', {
      ...ruleForm,
      type: 2
    })
    .then(() => {
      ElMessage.success('密码更新完成')
      changeLogin(0)
    })
    .catch((err) => console.error(err))
}

// 注册
const handleSingUp = () => {
  const params = {
    ...ruleForm,
    type: 1,
    au_login: '' // 0不预先登入 1预先登入
  }
  store
    .dispatch('user/mailSignUp', params)
    .then(() => {
      confirmLoading.value = false
      ElMessage.success('注册成功')
      ruleForm.code = ''
      ruleForm.mail = ''
      handleLogin(true)
      sessionStorage.removeItem('invite_code')
      sessionStorage.setItem('invite_register_success', '1')
    })
    .catch(() => {
      confirmLoading.value = false
    })
}

// 登录
const handleLogin = (needTrans?: boolean) => {
  const params = {
    ...ruleForm,
    type: 3
  }
  store
    .dispatch('user/mailLogin', params)
    .then((res) => {
      confirmLoading.value = false
      if (needTrans) {
        store.dispatch('transCacheToUser', { newId: res.id, oldId: store.state.visitorInfo.id })
      }
      setMemberInit()
    })
    .catch(() => {
      confirmLoading.value = false
    })
}

// 论坛请求认证时携带的状态,来源统一改由 sessionStorage 承载,避免 URL 参数被浏览器历史记录留存
const isRegister = sessionStorage.getItem('fromForumRegister')
const redirectTo = sessionStorage.getItem('forumRedirectTo')

const setUrlPrefix = (url) => {
  return url.includes('?') ? '&' : '?'
}

const _getTokenBbsUrlFun = () => {
  try {
    getBbsUrl().then((res) => {
      if (res.code === 0) {
        let url = window.location.origin + res.data.bbs_url
        const channel_code = store.state.channelCode
        if (redirectTo) {
          url += setUrlPrefix(url) + `redirectTo=${redirectTo}`
        }

        sessionStorage.setItem(
          'forumRegisterUrl',
          url + setUrlPrefix(url) + `isRegister=${isRegister}&channel_code=${channel_code}`
        )
      }
    })
  } catch (error) {
    ElMessage.error(error.msg)
  }
}

const setMemberInit = () => {
  if (isRegister) {
    _getTokenBbsUrlFun()
  } else {
    store.commit('user/SET_LOGIN_MASK', false)
    ElMessage.success('欢迎回来')
  }
}

const handleSendCode = () => {
  if (timer !== 0) return false
  formRef.value.validateField(['account', 'mail']).then((valid) => {
    if (valid) {
      getSendCode()
    }
  })
}

const timer = ref(0)
const { pause, resume } = useIntervalFn(
  () => {
    if (timer.value <= 0) {
      pause()
    } else {
      timer.value--
    }
  },
  1000,
  {
    immediate: false
  }
)

// 发送验证码
const getSendCode = () => {
  const type = [3, 3, 1, 2][loginType.value]
  if (timer.value === 0) {
    store
      .dispatch('user/mailSendVerifyCode', {
        ...ruleForm,
        type: type
      })
      .then((res) => {
        if (res.code === 0) {
          timer.value = res.data.seconds
          ElMessage.success(res.msg)
          resume()
        }
      })
      .catch((err) => {
        if (err.data.seconds) {
          timer.value = err.data.seconds
          resume()
        }
      })
  } else {
    return
  }
}

const changeLogin = (value) => {
  loginType.value = value
  timer.value = 0
  formRef.value.resetFields()
  emits('changeLogin', value)
}

onMounted(() => {
  setInviteCode()
  mittBus.on('goSignUp', changeLogin)
})

onBeforeUnmount(() => {
  mittBus.off('goSignUp', changeLogin)
})

const validatePass = (rule, value, callback) => {
  const psswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (!psswordRegex.test(value) && loginType.value != 1) {
    callback(new Error('密码必须是6-18位的字母和数字组合'))
  } else {
    callback()
  }
}

const validateCode = (rule, value, callback) => {
  const codeRegex = /\d{6}/
  if (value === '') {
    callback(new Error('请输入验证码'))
  } else if (!codeRegex.test(value)) {
    callback(new Error('验证码格式不对'))
  } else {
    callback()
  }
}

// 账号
const validateAccount = (rule, value, callback) => {
  const accountRegex = /^[a-zA-Z0-9_]{8,30}$/
  if (value === '') {
    callback(new Error('请输入账号'))
  } else if (!accountRegex.test(value)) {
    callback(new Error('请输入8-30位账号，只能包含英文、数字和下划线'))
  } else {
    callback()
  }
}

// 邮箱
const validateMail = (rule, value, callback) => {
  const accountRegex = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  if (value === '') {
    callback(new Error('请输入邮箱'))
  } else if (!accountRegex.test(value)) {
    callback(new Error('邮箱格式错误'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePass
    }
  ],
  code: [
    {
      required: true,
      validator: validateCode
    }
  ],
  account: [
    {
      required: true,
      validator: validateAccount,
      type: 'string'
    }
  ],
  mail: [
    {
      required: true,
      validator: validateMail,
      type: 'string'
    }
  ]
})

watch(
  () => props.dialogVisible,
  (newValue) => {
    if (!newValue) {
      setTimeout(() => {
        changeLogin(0)
      }, 100)
    } else {
      // 赋值 inviteCode
      setInviteCode()
    }
  }
)
</script>

<style lang="scss">
.mail_form {
  width: 300px;
  overflow: hidden;
  .el-form {
    .el-form-item {
      margin-bottom: 16px;
      margin-right: 0px;
      background-color: rgba(255, 196, 221, 0.2);
      border-radius: 20px;
      width: 100%;
      .el-input {
        .el-input__wrapper {
          background-color: transparent;
          box-shadow: 0 0 0 0;
          .el-input__inner {
            color: #fff;
            font-size: 12px;
          }
        }
      }
    }
    // 验证码
    .code_item {
      background-color: transparent;
      .el-form-item__content {
        .el-input {
          .el-input__wrapper {
            transform: skewX(-10deg);
            background-color: rgba(255, 196, 221, 0.2);
            margin-right: 4px;
            padding-left: 16px;
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
            border-top-left-radius: 14px;
            border-bottom-left-radius: 21px;
            .el-input__inner {
              transform: skewX(10deg);
            }
          }
          .el-input-group__append {
            transform: skewX(-10deg);
            background-color: rgba(255, 196, 221, 0.2);
            color: #fff;
            font-size: 12px;
            box-shadow: 0 0 0 0;
            padding: 0 8px;
            border-top-right-radius: 21px;
            border-bottom-right-radius: 14px;
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
            span {
              cursor: pointer;
              transform: skewX(10deg);
            }
          }
        }
      }
    }
    .item_box {
      .el-form-item__content {
        .el-input {
          .el-input__wrapper {
            padding-left: 0px;
          }
          .el-input-group__prepend {
            background-color: transparent;
            box-shadow: 0 0 0 0;
            padding: 0 8px;
            padding-left: 12px;
            img {
              width: 16px;
              height: 16px;
            }
          }
        }
      }
    }
    .tip_btn_item {
      background-color: transparent;
      .el-form-item__content {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        line-height: 18px;
        span {
          color: #a9969d;
          font-size: 12px;
          font-weight: 600;
          font-family: 'PingFang SC';
          cursor: pointer;
        }
      }
    }
    .go_login_active {
      .el-form-item__content {
        justify-content: flex-start;
      }
    }

    // 按钮
    .btn_item {
      background-color: #d31357;
      border-radius: 22px;
      cursor: pointer;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      font-family: 'PingFang SC';
      margin-bottom: 12px;
      margin-top: 20px;
      overflow: hidden;
      .el-form-item__content {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    // 提醒
    .warn_item {
      background-color: transparent;
      .el-form-item__content {
        display: flex;
        align-items: center;
        justify-content: center;
        .warn_text {
          color: #a9969d;
          font-size: 12px;
          font-weight: 600;
          font-family: 'PingFang SC';
        }
        .link_text {
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          font-family: 'PingFang SC';
          cursor: pointer;
        }
      }
    }
  }
}
</style>
