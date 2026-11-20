<template>
  <div class="panel">
    <div v-show="!isShow" class="flexGap">
      <div class="updatePwd">修改密码</div>
      <div class="borderHover" v-for="item in list" :key="item.text" @click="showForm(item.type)">
        <el-image class="image-icon" :src="item.icon"></el-image>
        <span class="rightTitle">{{ item.text }}</span>
        <span class="graySize" v-if="!hidePhoneNumber && item.type === 0">(未绑定)</span>
        <span class="graySize" v-if="!hideEmail && item.type === 1">(未绑定)</span>
      </div>
    </div>
    <div v-if="!!isShow">
      <div class="back">
        <span @click="back">
          <el-image class="icon-back" src="/static/images/spaceAndMine/rightBack.svg"></el-image>
          <span>返回</span>
        </span>
      </div>
      <section v-if="!isPwdPage">
        <div v-if="!curType && hidePhoneNumber" class="phoneHide">您绑定的手机号为：{{ hidePhoneNumber }}</div>
        <div v-if="curType && hideEmail" class="phoneHide">您绑定的邮箱为：{{ hideEmail }}</div>
        <el-form ref="formRef" :model="data" class="formWidth" :class="{mt64: curType}" label-position="top">
          <el-form-item :label="curType === 1 ? '邮箱地址：' : '手机号码：'" prop="phoneEmail" :rules="[{required: true, message: '请输入内容'}]">
            <el-input
              class="el-input-new-style"
              :maxlength="!curType ? 11 : Infinity"
              :placeholder="`请输入${(!curType && hidePhoneNumber) || (curType && hideEmail) ? '上方完整的' : ''}${curType === 1 ? '邮箱地址' : '手机号码'}`"
              size="large"
              v-model.trim="data.phoneEmail"
            ></el-input>
          </el-form-item>
          <el-form-item label="验证码：" prop="validateCode" :rules="[{required: true, message: '请输入验证码'}]">
            <div class="flexSpaceBetween">
              <el-input class="el-input-new-style" :maxlength="6" placeholder="请输入验证码" size="large" v-model.trim="data.validateCode"></el-input>
              <el-button
                size="large"
                style="width: 128px;"
                :disabled="sendCodeLoading || (isDisabled && disabledCount()[0])"
                type="primary"
                @click="getCode"
              >
                {{disabledCount()[1] ? '获取验证码' : `${disabledCount()[2]}s`}}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%;" size="large" :loading="loading" @click="submit(formRef)">下一步</el-button>
          </el-form-item>
        </el-form>
      </section>
      <section v-else>
        <el-form ref="formPwdRef" :model="pwdData" class="formWidth" label-position="top">
          <el-form-item
            label="新登录密码："
            prop="pwd"
            :rules="[{
              required: true,
              pattern: /^(?=.*\d)(?=.*[a-zA-Z])[A-Za-z\d]{6,18}$/,
              message: '请输入6-18位字母和数字新登录密码',
              min: 6,
              max: 18,
              trigger: 'blur'
            }]"
          >
            <el-input
              class="el-input-new-style"
              placeholder="请输入6-18位字母和数字新登录密码"
              size="large"
              type="password"
              show-password
              v-model.trim="pwdData.pwd"
            ></el-input>
          </el-form-item>
          <el-form-item
            label=""
            prop="rePwd"
            :rules="[{
              required: true,
              pattern: /^(?=.*\d)(?=.*[a-zA-Z])[A-Za-z\d]{6,18}$/,
              message: '请再次输入新登录密码',
              min: 6,
              max: 18,
              trigger: 'blur'
            }]"
          >
            <el-input
              class="el-input-new-style"
              placeholder="请再次输入新登录密码"
              size="large"
              type="password"
              show-password
              v-model.trim="pwdData.rePwd"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%;" size="large" :loading="loading" @click="submitAgain(formPwdRef)">
              确认修改密码
            </el-button>
          </el-form-item>
        </el-form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { encryptByRSA } from '@/utils/crypto'
import { getVCCodeApi, checkMobileApi, checkMailApi, modifyPwdByMobileApi, modifyPwdByEmailApi } from '@/api'

const { getters, dispatch } = useStore()
const isShow = ref(false)
const isPwdPage = ref(false)
const curType = ref(0)
const hidePhoneNumber = computed(() => getters.getFullMobile?.replace(/^(\d+-)/, '') || '')
const hideEmail = computed(() => getters.getUserEmail)
const data = reactive({
  phoneEmail: undefined,
  validateCode: undefined
})
const pwdData = reactive({
  pwd: undefined,
  rePwd: undefined,
})
const downCount = reactive({
  phone: 0,
  phoneCount: 60,
  email: 0,
  emailCount: 60,
})
const isDisabled = ref(true)
const sendCodeLoading = ref(false) // 发送验证码请求中标志，防止双击重复请求
const loading = ref(false)
const formRef = ref()
const formPwdRef = ref()
const list = [
  {text: '短信验证', type: 0, icon: '/static/images/SMSVerification.png'},
  {text: '邮箱验证', type: 1, icon: '/static/images/emailVerificaition.png'}
]

const prefix = computed(() => getters.getUserInfo?.mobile?.split('-')[0] || '86')
const getMobileEmail = computed(() => !curType.value ? (prefix.value + '-' + data.phoneEmail) : data.phoneEmail)
                        // (getters.getFullMobile || prefix.value + '-' + data.phoneEmail) :
                        // (getters.getUserEmail || data.phoneEmail))
const readonly = computed(() => !curType.value ? !!getters.getMobile : !!getters.getUserEmail)

const showForm = type => {
  if ((type === 0 && !hidePhoneNumber.value) || (type === 1 && !hideEmail.value)) return
  isShow.value = true
  isDisabled.value = true
  curType.value = type
  data.phoneEmail = ''
  data.validateCode = undefined
  data.pwd = undefined
  if (Object.keys(localStorage).includes('downCount' + curType.value)) {
    downCount[curType.value ? 'email' : 'phone'] = +localStorage.getItem('downCount' + curType.value)
  } else {
    downCount[curType.value ? 'email' : 'phone'] = 0
  }
}

const disabledCount = () => {
  let result = [
    (curType.value === 0 && downCount.phone > 0) || (curType.value === 1 && downCount.email > 0) || !data.phoneEmail,
    (curType.value === 0 && downCount.phone <= 0) || (curType.value === 1 && downCount.email <= 0),
    curType.value === 0 ? downCount.phoneCount : downCount.emailCount
  ]
  return result
}

const startCount = (curTypeValue) => {
  const subfix = curTypeValue ?? curType.value
  const timer = setInterval(() => {
    if (subfix === 0) {
      downCount.phoneCount = ~~((downCount.phone - Date.now()) / 1000)
      if (downCount.phone <= Date.now()) downCount.phone = 0
    } else {
      downCount.emailCount = ~~((downCount.email - Date.now()) / 1000)
      if (downCount.email <= Date.now()) downCount.email = 0
    }
    localStorage.setItem('downCount' + subfix, subfix === 0 ? downCount.phone : downCount.email)
    if (+localStorage.getItem('downCount' + subfix) <= 0) {
      localStorage.removeItem('downCount' + subfix)
      clearInterval(timer)
    }
  }, 1000)
}

const getCode = () => {
  // 双重防抖：请求中 或 倒计时中 都直接拦截
  if (sendCodeLoading.value) return
  if (curType.value === 0 && downCount.phone > 0) return
  if (curType.value === 1 && downCount.email > 0) return
  if (!curType.value && hidePhoneNumber.value && hidePhoneNumber.value != data.phoneEmail.replace(/^(\d{3})\d{4}(\d{4})/, '\$1****\$2')) {
    return ElMessage.error('已输入的手机号码与已绑定的手机号码不一致')
  } else
  if (curType.value && hideEmail.value && hideEmail.value.replace(/^(.{2})(.*)(@.*)/, '\$1****\$3') != data.phoneEmail.replace(/^(.{2})(.*)(@.*)/, '\$1****\$3')) {
    return ElMessage.error('已输入的邮箱与已绑定的邮箱不一致')
  }
  const subfix = curType.value
  isDisabled.value = false
  sendCodeLoading.value = true
  getVCCodeApi({type: 2, [subfix === 0 ? 'mobile' : 'mail']: encryptByRSA(getMobileEmail.value)}).then((res) => {
    isDisabled.value = true
    if (res.data?.seconds > 0) {
      if (curType.value === 0 ) {
        downCount.phoneCount = res.data?.seconds
        downCount.phone = ((res.data?.seconds || 60) + 1) * 1000 + Date.now()
      } else {
        downCount.emailCount = res.data?.seconds
        downCount.email = ((res.data?.seconds || 60) + 1) * 1000 + Date.now()
      }
      startCount()
    }
    ElMessage.success('已发送验证码')
  }).catch(() => {
    isDisabled.value = true
  }).finally(() => {
    sendCodeLoading.value = false
  })
}

const submit = (formRef) => {
  pwdData.pwd = undefined
  pwdData.rePwd = undefined
  if (!formRef) return
  formRef.validate(async (valid) => {
    if (valid) {
      let i = curType.value
      let api = [checkMobileApi, checkMailApi]
      api[i]({code: data.validateCode, [i === 0 ? 'mobile' : 'mail']: encryptByRSA(getMobileEmail.value)}).then(async res => {
        if (res.data === true) {
          isPwdPage.value = true
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
  })
}

const submitAgain = (formPwdRef) => {
  if (pwdData.pwd != pwdData.rePwd) {
    return ElMessage.error('请确认新登陆密码与确认密码一致')
  }
  if (!formPwdRef) return
  formPwdRef.validate(async (valid) => {
    if (valid) {
      const params = {
        password: encryptByRSA(pwdData.pwd),
        confirmPassword: encryptByRSA(pwdData.rePwd)
      }
      const res = await curType.value === 1 ? modifyPwdByEmailApi(params) : modifyPwdByMobileApi(params)
      res.then(x => {
        if (x.data === true) {
          ElMessage.success('修改密码成功')
          isShow.value = false
          isPwdPage.value = false
          dispatch('updateUserInfo')
        } else {
          ElMessage.error(x.msg)
        }
      })
    }
  })
}

const back = () => {
  if (!isPwdPage.value) {
    isShow.value = false
  }
  if (isPwdPage.value) {
    isPwdPage.value = false
  }
}

onActivated(() => {
  // 解决刷新倒计时丢失问题
  downCount.phone = +localStorage.getItem('downCount0')
  downCount.email = +localStorage.getItem('downCount1')
  if (downCount.phone > 0) startCount(0)
  if (downCount.email > 0) startCount(1)
})
onActivated(() => {
  isPwdPage.value = false
})
</script>

<style scoped lang="scss">
.panel {
  .flexGap {
    margin: 64px 160px;
    display: flex;
    flex-flow: column;
    gap: 26px;
    .updatePwd {
      color: #3f3f3f;
      font-size: 18px;
      font-weight: 400;
    }
    .borderHover {
      border: 1px solid #e6e7eb;
      padding: 18px;
      border-radius: 8px;
      cursor: pointer;
      .image-icon {
        width: 40px;
        vertical-align: middle;
        margin-right: 16px;
      }
      .rightTitle {
        color: #111827;
        font-weight: 400;
        font-size: 16px;
      }
      .graySize {
        color: #666;
        font-size: 14px;
      }
    }
  }
  .back {
    margin: 16px 0 0 16px;
    font-size: 18px;
    font-weight: 400;
    cursor: pointer;
    .icon-back {
      width: 24px;
      vertical-align: middle;
      transform: rotate(180deg);
    }
  }
  .phoneHide {
    margin-top: 64px;
    margin-bottom: 24px;
    text-align: center;
    font-size: 16px;
    line-height: 24px;
    color: #333;
  }
  .formWidth {
    margin: 0 160px 0 160px;
    :deep(.el-form-item__label) {
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
    }
    :deep(.el-input) {
      height: 48px;
    }
    .el-input.el-input-new-style {
      --el-input-border-color: #e5e7eb;
      --el-input-hover-border-color: #e5e7eb;
      --el-input-focus-border-color: #e5e7eb;
      --el-input-bg-color: #f9fafb;
    }
    .el-button--primary {
      --el-button-bg-color: #d02d54;
      --el-button-text-color: #fff;
      font-size: 16px;
      line-height: 24px;
      height: 48px;
      &.is-disabled {
        background-color: #f9fafb;
        border-color: #f9fafb;
        color: #666;
      }
    }
    .flexSpaceBetween {
      width: 100%;
      gap: 12px;
      display: flex;
      justify-content: space-between;
    }
  }
  .mt64 {
    margin-top: 64px;
  }
}
</style>