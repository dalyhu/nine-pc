<template>
  <el-dialog
    class="el_dialog_login"
    :before-close="handleClose"
    @open="dialogOpen"
    :show-close="false"
    :close-on-click-modal="false"
    :width="724"
    v-model="dialogVisible"
  >
    <div class="login_box">
      <!-- 标题 -->
      <div class="login_header">
        <span @click="changeLoginModel"
          >{{ title }} <img src="/static/images/login/icon_switch.svg"
        /></span>
      </div>
      <!-- 关闭按钮 -->
      <div class="close_icon_box" @click="handleClose">
        <img src="/static/images/login/icon_close.svg" alt="" />
      </div>
      <!-- 表单 -->
      <div class="login_content">
        <phoneForm
          v-if="loginModel"
          :loginModel="loginModel"
          :dialogVisible="dialogVisible"
          @changeLogin="(value) => (loginState = value)"
        ></phoneForm>
        <mailForm
          v-else
          :loginModel="loginModel"
          :dialogVisible="dialogVisible"
          @changeLogin="(value) => (loginState = value)"
        ></mailForm>
      </div>
    </div>
  </el-dialog>
</template>

<script setup name="AuthDialog" lang="ts">
import { useStore } from 'vuex'

const store = useStore()

defineOptions({
  name: 'AuthDialog',
  inheritAttrs: true
})

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const dialogVisible = computed({
  get: function () {
    return props.modelValue
  },
  set: function (newValue) {
    emits('update:modelValue', newValue)
  }
})

watch(
  () => store.state.user.showLoginMask,
  (visible) => {
    dialogVisible.value = visible
  }
)

const phoneTitle = ['手机登录', '手机登录', '手机号注册', '手机号重置密码']
const mailTitle = ['邮箱登录', '邮箱登录', '邮箱注册', '邮箱重置密码']
const title = computed(() => {
  return loginModel.value ? phoneTitle[loginState.value] : mailTitle[loginState.value]
})

const loginState = ref(0)
const loginModel = ref(true) // 默认手机登录模式
// 切换登录模式
const changeLoginModel = () => {
  if (['1', '2'].includes(store.state.system.register_way)) return
  loginModel.value = !loginModel.value
}

const dialogOpen = () => {
  loginModel.value = ['1', '1,2'].includes(store.state.system.register_way)
}

// 关闭
const handleClose = () => {
  // 若未生成 forumRegisterUrl,说明"从论坛来注册"的流程被用户中断
  // 清理 sessionStorage 标记,防止后续在同一 Tab 打开的普通登录弹窗误认为处于论坛流程
  if (!sessionStorage.getItem('forumRegisterUrl')) {
    sessionStorage.removeItem('fromForumRegister')
    sessionStorage.removeItem('forumRedirectTo')
  }
  store.commit('user/SET_LOGIN_MASK', false)
}
</script>

<style lang="scss">
.el_dialog_login {
  background-image: url(/static/images/login/login_bg.webp);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  border-radius: 8px;
  background-color: transparent;
  padding: 16px 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  .el-dialog__header {
    padding: 0;
  }
  .login_box {
    height: 424px;
    width: 485px;
    position: relative;
    .login_header {
      padding-top: 16px;
      padding-left: 16px;
      span {
        color: #fff;
        font-family: 'PingFang SC';
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        img {
          width: 12px;
          height: 12px;
          margin-bottom: 2px;
        }
      }
    }
    .close_icon_box {
      position: absolute;
      top: 7px;
      right: 7px;
      cursor: pointer;
      img {
        width: 36px;
        height: 36px;
      }
    }
    .login_content {
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
