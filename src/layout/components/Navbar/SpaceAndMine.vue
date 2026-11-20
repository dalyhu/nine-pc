<template>
  <el-popover
    popper-class="popper_class_has_logged important"
    :width="120"
    popper-style="min-width: unset;padding: 0;"
    v-model:visible="visible"
    :trigger="tabletMode ? 'click' : 'hover'"
    @show="popperShowHandler"
  >
    <template #reference>
      <el-avatar class="hand" :src="userInfo.avatar" :size="34" @error="() => true">
        <img v-show="isLogin" src="/static/images/avatar.png" />
        <img v-show="!isLogin" src="/static/images/avatarGrey.svg" />
      </el-avatar>
    </template>
    <div class="width-auto hand handColor" @click="pageToMine(false)">
      <el-image
        class="image-icon image-icon-hover-none"
        src="/static/images/my-space.png"
      ></el-image>
      <el-image class="image-icon imgNone" src="/static/images/my-space-hover.svg"></el-image>
      <span class="font-stlye">我的空间</span>
    </div>
    <div class="line"></div>
    <div class="width-auto hand handColor" @click="pageToMine(true)">
      <el-image
        class="image-icon image-icon-hover-none"
        src="/static/images/personal-center.png"
      ></el-image>
      <el-image class="image-icon imgNone" src="/static/images/my-center-hover.svg"></el-image>
      <span class="font-stlye">个人中心</span>
    </div>
    <template v-if="isAnchor">
      <div class="line"></div>
      <div class="width-auto hand handColor" @click="pageToBroadcast()">
        <el-image
          class="image-icon image-icon-hover-none"
          src="/static/images/spaceAndMine/my-camera.svg"
        ></el-image>
        <el-image
          class="image-icon imgNone"
          src="/static/images/spaceAndMine/my-camera-hover.svg"
        ></el-image>
        <span class="font-stlye">我要开播</span>
      </div>
    </template>
    <template v-if="!isLogin">
      <div class="line"></div>
      <div class="width-auto hand handColor" @click="handleLogin(0)">
        <el-image
          class="image-icon image-icon-hover-none"
          src="/static/images/login/signIn.svg"
        ></el-image>
        <el-image class="image-icon imgNone" src="/static/images/login/signInHover.svg"></el-image>
        <span class="font-stlye">登录注册</span>
      </div>
    </template>
  </el-popover>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import UserAvatar from '@/layout/components/Navbar/UserAvatar.vue'
import { updateInfo } from '@/api/user.js'
import mittBus from '@/utils/mittBus'
import { Avatar, VideoCamera } from '@element-plus/icons-vue'
import { inviteeLog } from '@/api/user'
import { getBbsUrl } from '@/api/common'

import Share from '../icons/Share.vue'

const tabletMode = document.documentElement.hasAttribute('data-tablet-pc')
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.user.infoData)
const touristsId = computed(() => store.state.visitorInfo.id)
const isAnchor = computed(() => store.getters.getUserInfo.is_anchor === 1)
const visible = ref(false)

const isLogin = computed(() => {
  return !!userInfo.value.id
})

const initTooltip = ref(false)
nextTick(() => {
  initTooltip.value = true
})

// 编辑用户名
const isShowEdit = ref(false)
const nameValue = ref('')
const handleFinish = () => {
  if (!nameValue.value.trim()) {
    return (isShowEdit.value = false)
  }
  const params = {
    user_nickname: nameValue.value.trim()
  }
  updateUserName(params)
}
const updateUserName = (params) => {
  updateInfo(params).then(() => {
    store.dispatch('updateUserInfo')
    ElMessage.success('修改成功')
    isShowEdit.value = false
    nameValue.value = ''
  })
}

// 登陆/注册
const handleLogin = (type) => {
  store.commit('user/SET_LOGIN_MASK', true)
  if (type === 1) nextTick(() => mittBus.emit('goSignUp', 2))
}

const pageToMine = (type) => {
  visible.value = false
  $router.push(`/${type ? 'personalCenter' : 'mySpace/user'}`)
}

const pageToBroadcast = () => {
  visible.value = false
  $router.push({
    name: 'mySpace',
    state: { comp: 6 }
  })
}

// 个人中心
const handlePersonalCenter = () => {
  // const { href } = router.resolve({
  //   path: '/member',
  //   query: {
  //     type: isLogin.value ? '0' : '12'
  //   }
  // })
  // window.open(href, '_self')
  pageToMine(false)
}

// 申请主播
const applyForHost = () => {
  router.push({
    name: 'mySpace',
    state: { comp: 7 }
  })
}

// 开播记录
const startLiveRecord = () => {
  router.push({
    name: 'mySpace',
    state: { comp: 6 }
  })
}

// 小九推广
const handleGotoPromotion = () => {
  // router.push('/promotion')
  const { href } = router.resolve({
    path: '/promotion'
  })
  window.open(href, '_self')
}

// 已登录的弹窗显示，更新个人信息（头像/等级同步最新）
const popperShowHandler = () => {
  store.dispatch('updateUserInfo')
}

const route = useRoute()

const isRealInviteCode = computed(() => route.query.invite_code?.split('-')[0])

const setUrlPrefix = (url) => {
  return url.includes('?') ? '&' : '?'
}

// 这里是注册完成之后进行自动跳转 origin
const _getTokenBbsUrlFun = () => {
  try {
    getBbsUrl().then((res) => {
      if (res.code === 0) {
        let url = window.location.origin + res.data.bbs_url

        const channel_code = store.state.channelCode

        const redirectTo = sessionStorage.getItem('forumRedirectTo')
        if (redirectTo) {
          url += setUrlPrefix(url) + `redirectTo=${redirectTo}`
        }

        sessionStorage.setItem(
          'forumRegisterUrl',
          url + setUrlPrefix(url) + `channel_code=${channel_code}`
        )
      }
    })
  } catch (error) {
    ElMessage.error(error.msg)
  }
}

onMounted(() => {
  const urlIsRegister = route.query.isRegister
  const urlRedirectTo = route.query.redirectTo
  const hasForumFlag = sessionStorage.getItem('fromForumRegister')

  if (urlIsRegister && !sessionStorage.getItem('forumRegisterUrl')) {
    // 先落 sessionStorage,再清 URL,避免刷新/回退重复触发中间态
    sessionStorage.setItem('fromForumRegister', urlIsRegister)
    if (urlRedirectTo) sessionStorage.setItem('forumRedirectTo', urlRedirectTo)

    const { isRegister, redirectTo, ...restQuery } = route.query
    router.replace({ path: route.path, query: restQuery })

    if (!isLogin.value) {
      handleLogin(1)
    } else {
      // 直接跳转到论坛
      _getTokenBbsUrlFun()
    }
  } else if (hasForumFlag && !sessionStorage.getItem('forumRegisterUrl')) {
    // 另一个入口已清过 URL,这里沿用 sessionStorage 里的状态
    if (!isLogin.value) {
      handleLogin(1)
    } else {
      _getTokenBbsUrlFun()
    }
  }

  // 分享打开注册
  if (!isLogin.value && route.query.invite_code && isRealInviteCode) {
    handleLogin(1)
    // 这里就需要调用接口
    inviteeLog(route.query.invite_code)
  }

  mittBus.on('openLogin', handleLogin)
})

onUnmounted(() => {
  mittBus.off('openLogin', handleLogin)
})
</script>

<style scoped lang="scss">
.popper_class_has_logged {
  .width-auto {
    text-align: center;
    padding: 12px;
    .image-icon {
      width: 20px;
      vertical-align: middle;
      margin-right: 12px;
    }
    .font-stlye {
      font-size: 14px;
      color: #fff;
      line-height: 1;
    }
  }
  .line {
    margin: 0 16px;
    border-bottom: 1px solid #f6f6f6;
  }
}
.hand {
  cursor: pointer;
  user-select: none;
}
.imgNone {
  display: none;
}
.handColor:hover {
  .font-stlye {
    color: #d02d54;
  }
  .image-icon-hover-none {
    display: none;
  }
  .imgNone {
    display: inline-block;
  }
}
.login_btn {
  width: 92px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  background-image: url(/static/images/login/login_btn.png);
  background-size: 96px 42px;
  background-position: 10% 220%;
  font-size: 16px;
  cursor: pointer;
  color: #ffffff;
}
</style>
<style scoped lang="scss">
.avatar_box {
  cursor: pointer;
}
.login_btn_box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 92px;
  height: 44px;
  background-image: url(/static/images/login/login_btn.png);
  background-repeat: no-repeat;
  background-size: 96px 42px;
  background-position: 10% 220%;
  .login_text {
    width: 82px;
    height: 28px;
    display: block;
    text-align: center;
    color: #ffffff;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    margin-top: 3px;
    margin-left: 3px;
  }
}

// 未登录
.popper_class_login {
  .content_box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .el-avatar {
      background-color: #393a3c;
      color: #1d1e1f !important;
      border: 1px solid transparent;
      &.visitor_avatar {
        cursor: pointer;
        &:hover {
          border-color: var(--el-color-primary);
        }
      }
    }
    .span_name {
      padding: 12px 0;
      color: #8d9095;
      font-size: 14px;
    }
    .btn_box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-button {
        margin: 0;
        padding: 8px 28px;
      }
      .el_button_default {
        background-color: #1d1e1f !important;
        border: 1px solid #4c4d4f;
      }
      .el_button_default:hover,
      .el_button_default:focus {
        color: #d02d54;
        border-color: #4c1c27;
        background-color: #27171a;
      }
    }
  }
}
</style>
<style lang="scss">
// 已登陆
.popper_class_has_logged,
.popper_class_login {
  background-color: #1d1e1f !important;
  border: 1px solid #363637 !important;
  .el-popper__arrow::before {
    background-color: #1d1e1f !important;
    border: 1px solid #414243 !important;
  }
}
.el-popover.el-popper.important {
  padding: var(--el-popover-padding);
}
</style>
