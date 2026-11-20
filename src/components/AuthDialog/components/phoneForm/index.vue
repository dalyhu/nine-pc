<template>
  <div class="phone_form">
    <tabs v-if="[0, 1].includes(loginType)" v-model="loginType" @changeTab="changeLogin"></tabs>
    <el-form ref="formRef" :inline="true" :rules="rules" :model="ruleForm">
      <el-form-item prop="mobile" class="phone_item">
        <el-select :suffix-icon="CaretBottom" :fit-input-width="false" v-model="ruleForm.countryCode" placeholder="请选择">
          <template #prefix>
            <strong>+</strong>
          </template>
          <el-option v-for="item in phoneAreaCode" :key="item.code" :label="item.code" :value="item.code">
          </el-option>
        </el-select>
        <el-input placeholder="请输入手机号码" :maxlength="11" v-model="ruleForm.mobile" />
      </el-form-item>

      <el-form-item prop="code" class="code_item" v-if="[0, 2, 3].includes(loginType)">
        <el-input placeholder="请输入验证码" :maxlength="6" v-model="ruleForm.code">
          <template #append><span @click="handleSendCode">
              {{ timer === 0 ? '获取验证码' : `${timer}秒` }}</span></template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password" v-if="[1, 2, 3].includes(loginType)" class="item_box">
        <el-input :placeholder="loginType === 1 ? '请输入密码' : '请输入6-18位字母/数字的登录密码'" type="password"
          autocomplete="new-password" :maxlength="loginType === 1 ? 32 : 18" v-model.trim="ruleForm.password">
          <template #prepend> <img src="/static/images/login/icon_pass.svg" alt="" /></template>
        </el-input>
      </el-form-item>

      <el-form-item class="item_box" v-if="[2].includes(loginType)">
        <el-input placeholder="请输入邀请码（可不填写）" maxlength="11" v-model.trim="ruleForm.invite">
          <template #prepend> <img src="/static/images/login/icon_invite.svg" alt="" /></template>
        </el-input>
      </el-form-item>

      <el-form-item v-if="[0, 1, 3].includes(loginType)"
        :class="['tip_btn_item', [3].includes(loginType) ? 'go_login_active' : '']">
        <span @click="changeLogin([0, 1].includes(loginType) ? 3 : 0)">
          {{ [0, 1].includes(loginType) ? '忘记密码？' : '返回登录' }}
        </span>
      </el-form-item>

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
        <!-- v-if="inviteCode" -->
        <span class="link_text flex" @click="changeLogin([2].includes(loginType) ? 0 : 2)">
          {{ [2].includes(loginType) ? '返回登录' : '立即注册' }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { CaretBottom } from '@element-plus/icons-vue'
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
const route = useRoute()

const loginType = ref(0) // 0验证码登录 1密码登录 2注册 3重置密码
const formRef = ref()
const confirmLoading = ref(false)

const emits = defineEmits(['changeLogin'])

const ruleForm = reactive({
  countryCode: '86',
  device_type: 'pc',
  mobile: '', // 手机号码
  password: '', // 密码
  code: '', // 验证码
  invite: '', // 邀请码
  type: '' // 1注册 2忘记密码 3登录 6主播认证 9修改email
})

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

const phoneAreaCode = computed(() => {
  return store.state.system.CountryCode
})

const redirectTo = sessionStorage.getItem('forumRedirectTo')
const isRegister = sessionStorage.getItem('fromForumRegister')

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
  confirmLoading.value = true
  store
    .dispatch('user/forgot', {
      ...ruleForm,
      type: 2
    })
    .then((res) => {
      confirmLoading.value = false
      ElMessage.success(res.msg || '修改密码成功')
      changeLogin(0)
    })
    .catch((err) => {
      confirmLoading.value = false
      console.error(err)
    })
}

// 注册
const handleSingUp = () => {
  const params = {
    guest_id: store.state.visitorInfo.id,
    ...ruleForm,
    type: 1
  }
  store
    .dispatch('user/signUp', params)
    .then(async () => {
      confirmLoading.value = false
      sessionStorage.removeItem('invite_code')
      ruleForm.code = ''
      handleLogin(true)

      ElMessage.success('注册成功')
      // 如果不是论坛的注册，提示注册成功
      if (!isRegister) {
        sessionStorage.setItem('invite_register_success', '1')
      }
    })
    .catch((err) => {
      confirmLoading.value = false
      console.error(err)
    })
}

// 登录
const handleLogin = (needTrans) => {
  const params = {
    ...ruleForm,
    type: 3
  }
  store
    .dispatch('user/login', params)
    .then((res) => {
      confirmLoading.value = false
      if (needTrans) {
        store.dispatch('transCacheToUser', { newId: res.id, oldId: store.state.visitorInfo.id })
      }

      setMemberInit()
    })
    .catch((err) => {
      confirmLoading.value = false
      console.error(err)
    })
}

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

    // 第一次加载
    localStorage.setItem('SET_MAIL_TIP_ONCE', '1')
  }
}

const handleSendCode = () => {
  formRef.value.validateField('mobile').then((valid) => {
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
const sendCodeLoading = ref(false)
const getSendCode = () => {
  // 双重防抖：请求中 或 倒计时中 都直接拦截
  if (sendCodeLoading.value || timer.value !== 0) return
  const type = [3, 3, 1, 2][loginType.value]
  sendCodeLoading.value = true
  store
    .dispatch('user/sendVerifyCode', {
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
      if (err?.data?.seconds) {
        timer.value = err.data.seconds
        resume()
      }
    })
    .finally(() => {
      sendCodeLoading.value = false
    })
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

const validateMobile = (rule, value, callback) => {
  const phoneRegex = /\d{11}/
  if (value === '') {
    callback(new Error('手机号不能为空'))
  } else if (!phoneRegex.test(value)) {
    callback(new Error('请输入合法手机号码格式'))
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

const rules = reactive({
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePass
    }
  ],
  mobile: [
    {
      required: true,
      validator: validateMobile,
      type: 'string'
    }
  ],
  code: [
    {
      required: true,
      validator: validateCode
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
.phone_form {
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

    // 手机号
    .phone_item {
      background-color: transparent !important;

      .el-form-item__content {
        flex-wrap: nowrap;

        .el-select {
          width: 90px;

          .el-select__wrapper {
            padding-right: 8px;
            box-shadow: 0 0 0 0;
            background-color: rgba(255, 196, 221, 0.2);
            transform: skewX(-10deg);
            border-top-left-radius: 14px;
            border-bottom-left-radius: 21px;
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;

            .el-select__prefix {
              margin-right: -4px;
              transform: skewX(10deg);

              strong {
                color: #fff;
              }
            }

            .el-select__selection {
              transform: skewX(10deg);

              .el-select__placeholder {
                overflow: visible;
                text-overflow: clip;

                span {
                  color: #fff;
                }
              }
            }

            .el-select__suffix {
              transform: skewX(10deg);

              .el-icon {
                color: #fff;
              }
            }
          }
        }

        .el-input {
          margin-left: 4px;

          .el-input__wrapper {
            transform: skewX(-10deg);
            background-color: rgba(255, 196, 221, 0.2);
            box-shadow: 0 0 0 0;
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
            border-top-right-radius: 21px;
            border-bottom-right-radius: 14px;
            padding-left: 16px;

            .el-input__inner {
              transform: skewX(10deg);
            }
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

        .el-button {
          width: 100%;
        }
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
