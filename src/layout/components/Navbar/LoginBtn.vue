<template>
  <div class="login_btn">
    <!-- 未登录 -->
    <el-popover
      v-if="!isLogin"
      popper-class="popper_class_login"
      trigger="hover"
      placement="bottom"
      width="204"
    >
      <template #reference>
        <div class="login_btn_box" @click="handleLogin(0)">
          <span class="login_text">登录</span>
        </div>
      </template>
      <div class="content_box">
        <el-tooltip
          popper-class="personal_center_tips"
          effect="dark"
          content="点击进入个人中心"
          placement="bottom"
          append-to=".popper_class_login .content_box"
          v-if="initTooltip"
        >
          <el-avatar
            class="visitor_avatar"
            :icon="UserAvatar"
            :size="48"
            @click="handlePersonalCenter"
          ></el-avatar>
        </el-tooltip>
        <!-- <el-avatar :icon="UserAvatar" :size="48"></el-avatar> -->
        <span class="span_name">{{ '游客' + touristsId }}</span>
        <div class="btn_box">
          <el-button type="primary" @click="handleLogin(0)">登录</el-button>
          <el-button class="el_button_default" @click="handleLogin(1)">注册</el-button>
        </div>
      </div>
    </el-popover>

    <!-- 已登录 -->
    <el-popover
      v-else
      popper-class="popper_class_has_logged"
      trigger="hover"
      :placement="isShowEdit ? 'bottom' : 'bottom-start'"
      width="auto"
      @show="popperShowHandler"
    >
      <template #reference>
        <el-avatar class="avatar_box" :src="userInfo.avatar" :size="34" @error="() => true">
          <img src="/static/images/avatar.png" alt="" />
        </el-avatar>
      </template>
      <div class="has_logged_box">
        <div class="has_logged_name">
          <el-avatar :src="userInfo.avatar" :size="44" @error="() => true">
            <img src="/static/images/avatar.png" alt="" />
          </el-avatar>
          <div class="user_info_box">
            <div class="edit_input" v-if="isShowEdit">
              <el-input v-model="nameValue" :autofocus="true">
                <template #append>
                  <span @click="handleFinish">完成</span>
                </template>
              </el-input>
            </div>
            <div class="user_nickname_box" v-else>
              <span>
                {{ userInfo.user_nickname }}
              </span>
              <i class="icon_edit" @click="isShowEdit = true"></i>
            </div>
            <div class="lv_box">LV.{{ userInfo.exp }}</div>
          </div>
          <el-button @click="handleSignOut" size="small">退出</el-button>
        </div>
        <ul class="icon_btn_box">
          <li @click="handlePersonalCenter">
            <el-icon class="icon_box" size="24">
              <Avatar />
            </el-icon>
            <span>个人中心</span>
          </li>
          <li @click="applyForHost" v-if="(isLogin && userInfo.is_anchor == 0) || !isLogin">
            <el-icon class="icon_box" size="24">
              <VideoCamera />
            </el-icon>
            <span>申请主播</span>
          </li>
          <li @click="startLiveRecord" v-if="isLogin && userInfo.is_anchor == 1">
            <el-icon class="icon_box" size="24">
              <VideoCamera />
            </el-icon>
            <span>开播记录</span>
          </li>
          <li @click="handleGotoPromotion" v-if="isLogin">
            <el-icon class="icon_box" size="24">
              <Share class="share_icon" />
            </el-icon>
            <span>小九推广</span>
          </li>
        </ul>
      </div>
    </el-popover>
  </div>
</template>

<script setup name="LoginBtn" lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import UserAvatar from '@/layout/components/Navbar/UserAvatar.vue'
import { updateInfo } from '@/api/user.js'
import mittBus from '@/utils/mittBus'
import { Avatar, VideoCamera } from '@element-plus/icons-vue'
import { inviteeLog } from '@/api/user'
import { getBbsUrl } from '@/api/common'

import Share from '../icons/Share.vue'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.user.infoData)
const touristsId = computed(() => store.state.visitorInfo.id)

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

// 退出登录
const handleSignOut = async () => {
  await store.dispatch('logout')
  window.location.reload()
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

const setUrlPrefix = (url) => {
  return url.includes('?') ? '&' : '?'
}

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
  const hasForumFlag = sessionStorage.getItem('fromForumRegister')

  if (urlIsRegister === '1' && !sessionStorage.getItem('forumRegisterUrl')) {
    // 先落 sessionStorage,再清 URL,避免刷新/回退中间态重复触发
    sessionStorage.setItem('fromForumRegister', urlIsRegister)
    if (route.query.redirectTo) {
      sessionStorage.setItem('forumRedirectTo', route.query.redirectTo)
    }
    const { isRegister, redirectTo, ...restQuery } = route.query
    router.replace({ path: route.path, query: restQuery })

    if (!isLogin.value) {
      handleLogin(1)
    } else {
      // 直接跳转到论坛
      _getTokenBbsUrlFun()
    }
  } else if (hasForumFlag && !sessionStorage.getItem('forumRegisterUrl')) {
    // 另一个入口已处理过 URL,这里沿用 sessionStorage 状态
    if (!isLogin.value) {
      handleLogin(1)
    } else {
      _getTokenBbsUrlFun()
    }
  }

  if (!isLogin.value && route.query.invite_code) {
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
.login_btn {
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
      height: 30px;
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
// 已登录
.popper_class_has_logged {
  .has_logged_name {
    display: flex;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid #2b2b2c;
    .user_info_box {
      flex: 1;
      margin-left: 8px;
      .edit_input {
        width: 188px;
        margin-bottom: 4px;
        .el-input {
          background-color: #202021;
          caret-color: #e5eaf3;
          :deep(.el-input__wrapper) {
            box-shadow: 0 0 0 0;
            background-color: #202021;
          }
          :deep(.el-input-group__append) {
            background-color: #202021;
            box-shadow: 0 0 0 0;
            cursor: pointer;
            padding-right: 10px;
          }
        }
      }
      .user_nickname_box {
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 14px;
        font-style: normal;
        color: #e5eaf3;
        .icon_edit {
          display: block;
          margin: 0 6px;
          width: 24px;
          height: 24px;
          font-style: normal;
          background-image: url(/static/images/login/icon_edit.svg);
          background-repeat: no-repeat;
          cursor: pointer;
        }
      }
      .lv_box {
        display: inline-block;
        padding: 4px;
        border-radius: 4px;
        background-color: #4fa5ff;
        color: #fff;
        font-size: 10px;
        font-weight: 600;
      }
    }
    .el-button {
      background-color: #1d1e1f !important;
      border: 1px solid #4c4d4f;
      color: #909399;
    }
    .el-button:hover,
    .el-button:focus {
      color: #d02d54;
      border-color: #4c1c27;
      background-color: #27171a;
    }
  }
  .icon_btn_box {
    display: flex;
    padding-top: 12px;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      cursor: pointer;
      i {
        width: 25px;
        height: 25px;
        font-style: normal;
        background-repeat: no-repeat;
      }
      .icon_personal_box {
        background-image: url(/static/images/login/icon_personal_dark.svg);
      }
      .icon_anchor_box {
        background-image: url(/static/images/login/icon_anchor_dark.svg);
        width: 41px;
      }
      span {
        font-weight: 500;
        font-size: 14px;
        font-style: normal;
        color: #e5eaf3;
      }
      .icon_box {
        color: var(--el-color-info-light-8);
      }
      &:hover {
        span,
        .icon_box {
          color: var(--el-color-primary);
          .share_icon {
            :deep(path) {
              fill: var(--el-color-primary);
            }
          }
        }
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
</style>
