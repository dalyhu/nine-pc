<template>
  <div class="panel">
    <div v-show="!isShow" class="flexGap">
      <div class="bindAccount">绑定账号</div>
      <div class="borderHover" v-for="item in list" :key="item.text" @click="() => !item.status && showForm(item.type)">
        <div class="leftBlock">
          <el-image class="image-icon" :src="item.icon"></el-image>
          <span>{{ item.text }}</span>
        </div>
        <div class="rightGrid" v-if="item.status">
          <el-text>{{ item.value }}</el-text>
          <el-icon color="#61b061" :size="13.33">
            <SuccessFilled />
          </el-icon>
          <el-text v-if="item.help" tag="ins" @click.stop="pageHelp(item.type)">{{ item.help }}</el-text>
          <el-icon v-if="item.help" color="#6a6c70" :size="14">
            <ChatDotRound />
          </el-icon>
        </div>
      </div>
    </div>
    <div v-if="!!isShow">
      <div class="back">
        <span @click="back">
          <el-image class="icon-back" src="/static/images/spaceAndMine/rightBack.svg"></el-image>
          <span>返回</span>
        </span>
      </div>
      <el-form ref="formRef" :model="data" class="formWidth" label-position="top">
        <el-form-item
          :label="listTitle[curType] + '：'"
          prop="phoneEmailSport"
          :rules="curType != 2 ? [{
            required: true,
            pattern: /^1[3456789]\d{9}$|^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            message: '请输入有效的' + listPlaceholder[curType]
          }] : []"
        >
          <el-input class="el-input-new-style" :placeholder="`请输入${listPlaceholder[curType]}`" v-model="data.phoneEmailSport"></el-input>
        </el-form-item>
        <el-form-item v-if="curType !== 2" label="验证码：" prop="validateCode" :rules="[{required: true, message: '请输入验证码'}]">
          <div class="flexSpaceBetween">
            <el-input class="el-input-new-style" placeholder="请输入验证码" v-model="data.validateCode"></el-input>
            <el-button
              size="large"
              style="width: 109.33px;"
              :disabled="sendCodeLoading || (isDisabled && disabledCount()[0])"
              type="primary"
              @click="getCode"
            >
              {{disabledCount()[1] ? '获取验证码' : `${disabledCount()[2]}s`}}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%;" size="large" :loading="loading" @click="submit(formRef)">绑 定</el-button>
        </el-form-item>
        <el-form-item v-if="curType === 2">
          <div class="txtRight">
            <el-text>※ 请注意若账号输入错误，无法取得彩金奖励<br>若输入错误想改绑账号，请咨询小助理</el-text>
            <el-text></el-text>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { SuccessFilled, ChatDotRound } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { bindMobileApi, bindEmailApi, bindSportApi, getVCCodeApi, helpBindAccount } from '@/api'
import { encryptByRSA } from '@/utils/crypto'
import mittBus from '@/utils/mittBus'

const { getters } = useStore()
const isShow = ref(false)
const curType = ref(0)
const data = reactive({
  phoneEmailSport: undefined,
  validateCode: undefined
})
const downCount = reactive({
  phone: 0,
  email: 0,
  phone_sec: undefined,
  email_sec: undefined,
})
const isDisabled = ref(true)
const sendCodeLoading = ref(false) // 发送验证码请求中标志，防止双击重复请求
const loading = ref(false)
const formRef = ref()
const list = reactive([
  {text: '手机绑定', type: 0, icon: '/static/images/SMSVerification.png', status: false, value: '已绑定', help: ''},
  {text: '邮箱绑定', type: 1, icon: '/static/images/emailVerificaition.png', status: false, value: '-', help: '绑定账号有问题需要协助'},
  {text: '体育站绑定', type: 2, icon: '/static/images/sportsStation.png', status: false, value: '-', help: '绑定账号有问题需要协助'}
])
const listTitle = ['手机号码', '邮箱地址', '绑定体育站']
const listPlaceholder = ['手机号码', '邮箱地址', '体育站账号']

// 获取最新数据
const getMobile$ = computed(() => getters.getMobile)
const getUserEmail$ = computed(() => getters.getUserEmail)
const getXingAccount$ = computed(() => getters.getXingAccount)

watch([getMobile$, getUserEmail$, getXingAccount$], () => {
  setAccountStatus()
})

const setAccountStatus = () => {
  list[0].status = getMobile$.value.length > 0
  if (getUserEmail$.value.length > 0) {
    list[1].status = true
    list[1].value = getUserEmail$.value
  }
  if (getXingAccount$.value.length > 0) {
    list[2].status = true
    list[2].value = getXingAccount$
  }
}

const disabledCount = () => {
  let result = [
    (curType.value === 0 && downCount.phone > 0) || (curType.value === 1 && downCount.email > 0) || !data.phoneEmailSport,
    (curType.value === 0 && downCount.phone <= 0) || (curType.value === 1 && downCount.email <= 0),
    curType.value === 0 ? downCount.phone : downCount.email
  ]
  return result
}

const showForm = type => {
  isShow.value = true
  isDisabled.value = true
  curType.value = type
  data.phoneEmailSport = undefined
  data.validateCode = undefined
  if (curType.value === 0 && ~~localStorage.getItem('phone_sec') && ~~localStorage.getItem('phone_sec') < Date.now() - 60 * 1000) {
    const timer = setInterval(() => {// +是转成数字，~~是转成整数数字
      downCount.phone = ~~((+localStorage.getItem('phone_sec') - Date.now()) / 1000)
      if (downCount.phone <= 0) {
        localStorage.removeItem('phone_sec')
        clearInterval(timer)
      }
    }, 1000) // 每1秒计算一次
  }
  if (curType.value === 1 && ~~localStorage.getItem('email_sec') && ~~localStorage.getItem('email_sec') < Date.now() - 60 * 1000) {
    const timer = setInterval(() => {
      downCount.email = ~~((+localStorage.getItem('email_sec') - Date.now()) / 1000)
      if (downCount.email <= 0) {
        localStorage.removeItem('email_sec')
        clearInterval(timer)
      }
    }, 1000) // 每1秒计算一次
  }
}

const getCode = () => {
  // 双重防抖：请求中 或 倒计时中 都直接拦截
  if (sendCodeLoading.value) return
  if (curType.value === 0 && downCount.phone > 0) return
  if (curType.value === 1 && downCount.email > 0) return
  const subfix = curType.value
  isDisabled.value = false
  sendCodeLoading.value = true
  getVCCodeApi({type: subfix === 0 ? 2 : 12, [subfix === 0 ? 'mobile' : 'mail']: encryptByRSA(data.phoneEmailSport)}).then((res) => {
    isDisabled.value = true
    if (curType.value === 0) {
      downCount.phone_sec = ((res.data?.seconds || 60) + 1) * 1000 + Date.now()
      localStorage.setItem('phone_sec', downCount.phone_sec)
      downCount.phone = 60
    } else {
      downCount.email_sec = ((res.data?.seconds || 60) + 1) * 1000 + Date.now()
      localStorage.setItem('email_sec', downCount.email_sec)
      downCount.email = 60
    }
    const timer = setInterval(() => {
      if (subfix === 0) {
        downCount.phone = ~~((downCount.phone_sec - Date.now()) / 1000)
      } else {
        downCount.email = ~~((downCount.email_sec - Date.now()) / 1000)
      }
      if (subfix === 0 && downCount.phone <= 0) {
        localStorage.removeItem('phone_sec')
        clearInterval(timer)
      }
      if (subfix === 1 && downCount.email <= 0) {
        localStorage.removeItem('email_sec')
        clearInterval(timer)
      }
    }, 1000) // 每1秒计算一次
    ElMessage.success('验证码发送成功')
  }).catch(() => {
    isDisabled.value = true
  }).finally(() => {
    sendCodeLoading.value = false
  })
}

const submit = (formRef) => {
  if (!formRef) return
  formRef.validate(async (valid) => {
    if (valid) {
      const i = curType.value
      const api = [bindMobileApi, bindEmailApi, bindSportApi]
      const params = [
        {mobile: encryptByRSA('86-' + data.phoneEmailSport), code: data.validateCode},
        {mail: encryptByRSA(data.phoneEmailSport), code: data.validateCode},
        {xing: data.phoneEmailSport}
      ]
      api[i](params[i]).then(res => {
        if (res.msg.includes('成功') || res.data === true) {
          ElMessage.success('绑定成功')
          location.reload()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
  })
}

const back = () => isShow.value = false

const pageHelp = async (type) => {
  let res = await helpBindAccount({ type: type === 1 ? 2 : 1 })
  if (res?.code === 0) {
    ElMessage.success('发送成功')
    mittBus.emit('mycenter', { data: { ...res.data, room_type: 2, is_online: 1 }, type: type === 1 ? 7 : 6 })
  }
}

onActivated(() => {
  setAccountStatus()
  if (history.state?.openBindEmail) {
    // 必须用 replaceState 持久化，否则整页刷新会还原 push 时的 openBindEmail
    const next = { ...history.state }
    delete next.openBindEmail
    history.replaceState(next, '')
    if (!list[1].status) {
      showForm(1)
    }
  }
})
</script>

<style scoped lang="scss">
.panel {
  .flexGap {
    margin: 64px 160px;
    display: flex;
    flex-flow: column;
    gap: 26px;
    .bindAccount {
      font-size: 18px;
    }
    .borderHover {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #e6e7eb;
      padding: 18px;
      border-radius: 8px;
      cursor: pointer;
      .image-icon {
        width: 40px;
        vertical-align: middle;
        margin-right: 16px;
      }
      .rightGrid {
        display: grid;
        grid-template-columns: auto auto;
        justify-items: right;
        align-items: center;
        font-size: 14px;
        color: #666;
        gap: 9px;
      }
    }
  }
  .back {
    margin: 16px 0 0 16px;
    font-size: 18px;
    font-weight: 400;
    .icon-back {
      width: 24px;
      vertical-align: middle;
      transform: rotate(180deg);
    }
  }
  .formWidth {
    margin: 64px 160px 0 160px;
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
}
</style>