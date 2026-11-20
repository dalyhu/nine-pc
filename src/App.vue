<script setup>
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { decryptByAES } from '@/utils/crypto'
import { IM } from '@/utils/im'
import { skipNextEnter } from '@/utils/onlineReport'
import { uploadNetworkSpeed, getNetworkSpeedApi } from '@/api/common'
import { getUrlParams, normalizeUrl } from '@/utils'
import TipDialog from '@/components/TipDialog/index.vue'
import { TIP_DIALOG_PRESETS } from '@/components/TipDialog/presets'
import ShareConfirm from '@/components/shareConfirm/index.vue'
import BotVerification from '@/components/botVerification/index.vue'
import { usePwa } from '@pwa-platform/vue'
import { PwaUpdateNotice } from '@pwa-platform/vue/ui'
import '@pwa-platform/vue/update-notice.css'
import TabletVersionNotice from '@/components/tablet/TabletVersionNotice.vue'

const isTabletPC = document.documentElement.hasAttribute('data-tablet-pc')

const store = useStore()

// PWA 未启用（不支持 Service Worker 或初始化失败，见 main.js）时为 null，页面其余功能不受影响
let pwa = null
try {
  pwa = usePwa()
} catch (error) {
  console.warn('PWA 未启用', error)
}

// 软性升级提示条：阈值在构建时注入（见 scripts/upgrade-banner.mjs）。开关关闭（默认）时为 null，
// 下面整段在构建时被去掉，提示条不会打进产物
// eslint-disable-next-line no-undef
const upgradeBannerThresholds = __X9_UPGRADE_BANNER__
const UpgradeBanner = upgradeBannerThresholds
  ? defineAsyncComponent(() => import('@/components/UpgradeBanner/index.vue'))
  : null

const token = getUrlParams('token')
const userId = getUrlParams('userId')
const isLogout = getUrlParams('isLogout')
const fingerprintId = getUrlParams('fingerprintId')
const fromForum = getUrlParams('fromForum')

// 论坛 cookie 前缀(如 discuz_2132_)随各环境配置变化,按后缀匹配
const getForumCookie = (suffix) => {
  const pair = document.cookie.split('; ').find((c) => c.split('=')[0].endsWith(suffix))
  return pair ? decodeURIComponent(pair.slice(pair.indexOf('=') + 1)) : ''
}

const isLogin = computed(() => !!store.state.user.infoData.id)

const route = useRoute()
const router = useRouter()

const deleteQueryParam = (...keys) => {
  const { query, path, hash } = route
  const newQuery = { ...query }

  keys.forEach((key) => delete newQuery[key])

  router.replace({ path, query: newQuery, hash })
}

const isForum = () => window.location.href.includes('/forum')

const setForumUrl = async () => {
  try {
    // 如果是论坛的就不跳转
    if (!isForum()) {
      // forumRegisterUrl
      const forumRegisterUrl = sessionStorage.getItem('forumRegisterUrl')
      if (forumRegisterUrl) {
        sessionStorage.removeItem('forumRegisterUrl')
        sessionStorage.removeItem('fromForumRegister')
        sessionStorage.removeItem('forumRedirectTo')
        window.location.replace(normalizeUrl(forumRegisterUrl))
      }
    }

    if (token && userId) {
      // 同步清掉地址栏 + Vue Router 内部 query,避免后续任何 router 导航把 token/userId 写回 URL;
      // 若 SET_USERINFO 触发 reload,也会在干净的 URL 上刷新
      deleteQueryParam('token', 'userId')

      store.commit('user/SET_USERINFO', { ...store.state.user.infoData, id: userId, token })
    }

    // 论坛跳转只带 fromForum=1,登录信息从同域的论坛 cookie 读取。
    // 只在带 fromForum 时读:否则直播站退出后,论坛 cookie 仍在,会被自动登回
    if (fromForum) {
      // 一并删 token/userId:两次 router.replace 都基于同一个旧 route.query,只删 fromForum 会把它们写回
      deleteQueryParam('fromForum', 'token', 'userId')

      const forumToken = getForumCookie('_auth-token')
      const forumUserId = getForumCookie('_auth-userId')
      if (forumToken && forumUserId) {
        store.commit('user/SET_USERINFO', { ...store.state.user.infoData, id: forumUserId, token: forumToken })
      }
    }

    if (isForum() && fingerprintId) {
      // 解码 退出
      const newFingerprintId = decodeURIComponent(escape(atob(fingerprintId)))

      localStorage.setItem('fingerprintId', newFingerprintId)

      setTimeout(() => {
        store.commit('user/SET_USERINFO', {})
        localStorage.removeItem('visitorInfo')
      }, 0)
    }

    if (isLogout) {
      // 退出登录 删除这个参数
      deleteQueryParam('isLogout')
      if (isLogin.value) {
        await store.dispatch('logout')
        // logout 不再 commit Vuex，必须由调用方整页刷新重建 store，否则界面仍是登录态
        window.location.reload()
      }
    }
  } catch (error) {
    console.log(error)
  }
}

// 监听本地用户信息变化
// 因其他标签页登录态变化而刷新时，不调「进入系统」：只由发生登录的那个标签页调（需求 D4、D5）
const reloadForIdentityChange = () => {
  skipNextEnter()
  window.location.reload()
}

const localStorageChange = (event) => {
  if (['userInfo'].includes(event.key)) {
    const oldValue = JSON.parse(decryptByAES(event.oldValue) || '{}')
    const newValue = JSON.parse(decryptByAES(event.newValue) || '{}')

    if (oldValue.id !== newValue.id) reloadForIdentityChange()
  } else if (['visitorInfo'].includes(event.key)) {
    const oldValue = JSON.parse(event.oldValue || '{}')
    const newValue = JSON.parse(event.newValue || '{}')

    if (oldValue.id !== newValue.id) reloadForIdentityChange()
    if (oldValue.token !== newValue.token) IM.connect()
  }
}

const getNetWorkSpeed = async () => {
  try {
    const startTime = new Date().getTime()
    await getNetworkSpeedApi()
    const endTime = new Date().getTime()
    const diffTime = Math.floor((endTime - startTime) / 2)

    const params = {
      domain: window.location.origin,
      ping: diffTime
    }
    uploadNetworkSpeed(params)
  } catch (error) {
    console.error(error)
  }
}

const emailTipVisible = computed({
  get: () => store.state.showEmail,
  set: (v) => {
    if (!v) store.commit('closeEmailTip')
  }
})

const handleBindEmailConfirm = () => {
  router.push({
    name: 'personalCenter',
    state: { comp: 1, openBindEmail: true }
  })
}

const showShareConfirm = computed(() => store.state.showShareConfirm)

watch(showShareConfirm, () => {
  if (showShareConfirm.value) {
    setTimeout(() => {
      store.commit('setShowShareConfirm', false)
      sessionStorage.removeItem('invite_register_success')
    }, 3000)
  }
})

let timer

const setShowEmailState = () => {
  // SET_MAIL_TIP_ONCE
  const once = localStorage.getItem('SET_MAIL_TIP_ONCE')
  if (once) {
    setTimeout(() => {
      store.commit('setShowEmailTip')
      localStorage.removeItem('SET_MAIL_TIP_ONCE')
    }, 300)
  }

  // 30分钟执行一次
  timer = setInterval(
    () => {
      store.commit('setShowEmailTip')
    },
    30 * 60 * 1000
  )
}

const setShowConfirm = () => {
  // reigster successfully
  const invite_register_success = sessionStorage.getItem('invite_register_success')
  if (invite_register_success) {
    store.commit('setShowShareConfirm', true)
    setTimeout(() => {
      setShowEmailState()
    }, 3000)
  } else {
    setShowEmailState()
  }
}

onMounted(() => {
  if (pwa && import.meta.env.PROD) {
    void pwa.register().catch((error) => {
      console.error('PWA worker 注册失败', error)
    })
  }

  window.addEventListener('storage', localStorageChange)
  window.$router = router
  // 即时比分，红黄牌设置
  const gameSeting = localStorage.getItem('gameSeting')
  if (gameSeting) {
    store.commit('setGame', JSON.parse(gameSeting))
  }

  // 即时比分，亚/太/欧设置
  const immediately = localStorage.getItem('immediately')
  if (immediately) {
    store.commit('setImmediately', JSON.parse(immediately))
  }

  // 获取房管权限
  if (isLogin.value) {
    // store.dispatch('house/houseRoomManagerStore')
  }

  getNetWorkSpeed()

  setForumUrl()

  // 注册成功不显示任何提示信息
  if (!isForum()) {
    setShowConfirm()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', localStorageChange)

  timer && clearInterval(timer)
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
    <TabletVersionNotice v-if="isTabletPC" />
    <TipDialog
      v-model="emailTipVisible"
      v-bind="TIP_DIALOG_PRESETS.bindEmail"
      @confirm="handleBindEmailConfirm"
    />
    <!-- 分享的弹窗 -->
    <ShareConfirm v-if="showShareConfirm" />
    <BotVerification />
  </el-config-provider>
  <PwaUpdateNotice v-if="pwa" position="bottom-right" />
  <component :is="UpgradeBanner" v-if="UpgradeBanner" :thresholds="upgradeBannerThresholds" />
</template>
