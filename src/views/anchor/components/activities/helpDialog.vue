<template>
  <!-- 草稿列表 -->
  <el-dialog
    class="help_custom"
    v-model="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :append-to-body="true"
    :width="435"
  >
    <div class="help_content">
      <div class="help_header">
        <img src="/static/images/live/activities/help_bg.png" alt="" />
        <p @click.stop="handleClose">
          <el-icon size="16"><Close /></el-icon>关闭
        </p>
        <div v-if="!isLogin" class="help_hint">先注册小𝟵<br />看高清直播</div>
        <div
          v-else-if="isLogin && !isXCAccountInfo?.xing_account"
          class="help_hint help_award_hint"
        >
          绑定体育站账户<br />领取彩金奖励
        </div>
        <div v-else-if="isLogin && isXCAccountInfo?.xing_account" class="help_hint">
          绑定帐户<br />有问题需协助
        </div>
      </div>
      <div class="help_main">
        <p>欢迎来小９看直播，现正推出各式活动与您共襄盛举。</p>
        <p>并且我们准备了 <span>百万彩金</span> 给您作为热情参与活动的奖励。</p>
        <p>在活动中参与或胜出，都能赢取彩金。</p>
        <p class="p22">现在就注册绑定体育站帐号，参加我们一系列好康活动！</p>
        <p class="p_2">百万彩金等你发～</p>
        <p class="p22">※注意周奖励将于<span>每周六晚上0时0分重置</span>，请尽快领取您的奖励</p>
      </div>
      <div class="help_footer">
        <el-button v-if="!isLogin" @click="handleLogin(0)" round>登陆</el-button>
        <el-form
          v-else-if="isLogin && !isXCAccountInfo?.xing_account"
          ref="formRef"
          :inline="true"
          :rules="rules"
          :model="ruleForm"
          @submit.prevent
        >
          <el-form-item prop="xcAccount">
            <el-input
              placeholder="请输入您在体育站帐号"
              :maxlength="12"
              v-model="ruleForm.xcAccount"
              @keydown="handleKeyDown"
            >
              <template #append><span @click="handleSubmit">绑定</span></template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button
          class="help_btn"
          v-else-if="isLogin && isXCAccountInfo?.xing_account"
          @click="helpBindAccountApi"
          round
          >点击获取帮助</el-button
        >
        <p v-if="!isLogin">还没有小𝟵账号？ <span @click="handleLogin(2)">立即注册</span></p>
        <p class="p10" v-else-if="isLogin && !isXCAccountInfo?.xing_account">
          还没有体育站会员？ <span @click="openLink">去注册</span>
        </p>
      </div>
    </div>
  </el-dialog>
</template>

<script setup name="helpDialog" lang="ts">
import { useStore } from 'vuex'
import mittBus from '@/utils/mittBus'
import { FormInstance, FormRules } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { bindAccount, helpBindAccount } from '@/api/activities.js'

const store = useStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  isXCAccountInfo: {
    type: Object,
    default: () => ({
      xing_account: ''
    })
  }
})

const visible = computed({
  get: function () {
    return props.modelValue
  },
  set: function (newValue) {
    emits('update:modelValue', newValue)
  }
})

const emits = defineEmits(['update:modelValue', 'bindAccountSuccess'])

const system = computed(() => store.state.system)
const userInfo = computed(() => store.state.user.infoData)
const isLogin = computed(() => !!userInfo.value.id)
const formRef = ref<FormInstance>()
const ruleForm = ref({
  xcAccount: ''
})

function handleKeyDown(event) {
  if (event.key === 'Enter') {
     event.preventDefault();
     handleSubmit()
  }
}

function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) bindAccountApi()
  })
}

async function bindAccountApi() {
  const { data = {} } = await bindAccount({ xing: ruleForm.value.xcAccount })
  console.log('data', data)
  emits('bindAccountSuccess', {
    user_id: userInfo.value.id,
    xing_account: ruleForm.value.xcAccount
  })
  ElMessage.success('绑定成功')
}

async function helpBindAccountApi() {
  let res = await helpBindAccount()
  if (res?.code === 0) {
    ElMessage.success('发送成功')
    handleClose()
    mittBus.emit('clickhelp', { data: { ...res.data, room_type: 2, is_online: 1 }, type:'chat'})
  }
}

function openLink() {
  if (!system.value.xt_url) {
    console.error('no 配置')
    return
  }
  window.open(system.value.xt_url);
}

function handleLogin(value) {
  store.state.user.showLoginMask = true
  mittBus.emit('goSignUp', value)
}

function handleClose() {
  visible.value = false
  formRef.value && formRef.value.resetFields()
}
// 账号
// function validateAccount(rule, value, callback) {
//   const accountRegex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
//   if (value === '') {
//     callback(new Error('账号不能为空'))
//   } else if (!accountRegex.test(value)) {
//     callback(new Error('请输入由字母和数字组成的6-12为字符'))
//   } else {
//     callback()
//   }
// }
function validateAccount(rule, value, callback) {
  if (value === '') {
    callback(new Error('账号不能为空'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  xcAccount: [
    {
      required: true,
      validator: validateAccount,
      type: 'string'
    }
  ]
})
</script>

<style lang="scss">
.help_custom {
  padding: 0;
  border-radius: 12px;
  background-color: transparent;
  font-family: 'PingFang SC';
  .el-dialog__header {
    display: none;
  }
  .help_content {
    .help_header {
      position: relative;
      img {
        width: 100%;
        height: auto;
      }
      p {
        position: absolute;
        top: 4px;
        right: 16px;
        color: #111;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        display: flex;
        align-items: center;
        cursor: pointer;
        .el-icon {
          margin-top: 2px;
          margin-right: 4px;
        }
      }
      .help_hint {
        position: absolute;
        top: 50px;
        left: 60px;
        color: rgba(255, 255, 255, 0.9);
        font-size: 28px;
        font-style: normal;
        font-weight: 600;
      }
      .help_award_hint {
        left: 42px;
      }
    }
    .help_main {
      padding: 0px 20px;
      background-color: #fff;
      color: #9d898d;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      .p_2,
      span {
        color: #d02d54;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
      }
      .p22 {
        padding-top: 22px;
      }
    }
    .help_footer {
      padding: 22px 20px;
      background-color: #fff;
      border-radius: 12px;
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
      .el-button {
        background-color: #d31357;
        color: #fff;
        width: 100% !important;
        border: 0;
        height: 44px;
        font-weight: 600;
        margin-bottom: 12px;
      }
      .help_btn {
        margin-top: 10px;
        margin-bottom: 0px;
      }
      p {
        text-align: center;
        color: #a9969d;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: 22px;
        span {
          cursor: pointer;
          color: #111;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
        }
      }
      .p10 {
        margin-bottom: 10px;
      }
      .el-form-item {
        margin-right: 0px;
        margin-bottom: 18px;
        width: 100%;
        .el-input {
          border: 1px solid #d31357;
          border-radius: 8px;
          margin-bottom: 2px;
          .el-input__wrapper {
            box-shadow: 0 0 0 0px #d31357;
            border-radius: 8px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
          }
          .el-input__inner {
            height: 40px !important;
          }
          .el-input-group__append {
            background-color: #fff;
            border-radius: 8px;
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
            box-shadow: 0 0 0 0px #d31357;
            padding: 0 12px;
            span {
              height: 28px !important;
              line-height: 28px;
              padding: 0px 12px;
              cursor: pointer;
              border-radius: 4px;
              background-color: var(--el-primary-background-color);
              color: #fff;
              font-size: 14px;
              font-style: normal;
              font-weight: 500;
              box-shadow:
                0px 2px 4px 0px rgba(255, 255, 255, 0.25),
                0px 4px 8px 0px rgba(208, 45, 84, 0.3);
            }
          }
        }
      }
    }
  }
}
</style>
