import { createStore } from 'vuex'
import user from './modules/user'
import house from './modules/house'
import search from './modules/search'
import { refreshUserInfo } from './refreshUserInfo'
import s from './c/s'
import { getForumList } from '@/api'
import { getHot, getRedbagAmount, imTouristAccount, info, inviterLog, logoutService, getIframeDomainService } from '@/api/user'
import { genVisitorId, getCacheUserInfo, getFingerprintId } from '@/utils'
import { IM } from '@/utils/im'
import { isEmpty, omit } from 'lodash-es'
import { IMG_MODE } from '@/enums'
import { getToday, removeUrlParams } from '@/utils/common'
import { checkIframeBeforeInit } from '@/utils/iframeDomain'
import { skipEnterIfReported, skipNextEnter } from '@/utils/onlineReport'
import { shouldBlockByBotVerification } from '@/utils/botVerification'

/** picBncMap 最多缓存的条数，值为 base64 全量图片数据 */
const PIC_BNC_CACHE_MAX = 80

const store = createStore({
  state: {
    uid: undefined,
    gameInfo: {}, //比赛数据
    footballData: {}, // 足球比分数据
    footballEventLive: [], // 足球事件直播
    basketballData: {}, // 篮球比分数据
    basketballEventLive: [], // 篮球事件直播
    activitiesData: [], //活动数据
    type: 1, //2篮球指数或1足球指数
    company_id: 1, //sock 指数公司
    goalItem: [], //进球赛事
    goal: false, //足球socket是否进球
    system: {
      use_iframe_url: '',
      iframe_url: [],
      ios_download_url_extend: [],
      android_download_url_extend: [],
      register_way: '1',
      discuz_system: {}
    }, //系统配置
    danmakuSystem: {
      //弹幕配置
      show: true, //是否显示
      area: 3, //显示的区域
      size: 2, //字体大小
      opacity: 100 //透明度
    },
    shouNum: 0,
    game: {
      red: true,
      yellow: true,
      voice: true,
      voice1: false
    },
    immediately: {
      //即时比。分显示隐藏
      value1: true,
      value2: true,
      value3: false,
      value4: false
    },
    concealNum: 0, // 即时比。分隐藏的场数
    loading: false,
    visitorInfo: {},
    showHeaderFooter: true, // 兼容外部下载页引用这里, 去掉头部和尾部
    luckyBagData: [], // 福袋数据，活动未开启，默认空数组
    showFeedbackPopup: false, // 是否显示全局弹窗-悄悄话留言板/意见反馈
    hasNewMsgChatsMap: {},
    channelCode: '',
    env: 'browser',
    picBncMap: {}, // 解密图片的列表，此记录用于避免相同图片地址重复请求bnc解密
    version: import.meta.env.VITE_VERSION_CODE,
    imgMode: IMG_MODE.NORMAL,
    historyMessageList: [],
    isNewMsgTip: true,
    giftEffectsVisible: true,
    sysDiffTime: 0,
    deviceInfo: {},
    luntan_back_url: '', // 论坛点击登陆传过来的参数
    showEmail: false,
    showShareConfirm: false,
    forumId: [], // 板块列表
    iframeDomainList: null, // iframe 嵌套白名单，null 表示未请求
    systemHotLoaded: false,
    /** getHot 请求是否失败（失败时不阻断用户，fail-open） */
    getHotFailed: false
  },
  modules: {
    user,
    search,
    house
  },
  getters: {
    // 新增：确保 token 和 user_id 来自同一来源
    userIdentity(state) {
      const userInfo = state.user.infoData
      const visitorInfo = state.visitorInfo

      // 优先使用登录用户信息（必须同时有 id 和 token）
      if (userInfo.id && userInfo.token) {
        return {
          userId: parseInt(userInfo.id || '0'),
          token: userInfo.token
        }
      }

      // fallback 到游客信息
      return {
        userId: parseInt(visitorInfo.id || '0'),
        token: visitorInfo.token || ''
      }
    },
    userId(state, getters) {
       return getters.userIdentity.userId
    },
    token(state, getters) {
      return getters.userIdentity.token
    },
    getMobile(state) {
      return state.user.infoData.mobile?.split('-')[1] || ''
    },
    getFullMobile(state) {
      return state.user.infoData.mobile || ''
    },
    getUserEmail(state) {
      return state.user.infoData.user_email || ''
    },
    getXingAccount(state) {
      return state.user.infoData.xing_account || ''
    },
    getUserInfo(state) {
      return state.user.infoData
    },
    getUid(state) {
      return state.uid
    },
    getForumId(state) {
      return state.forumId
    },
    /** 顶部导航论坛入口：discuz_system.discuz_status，1 开 0 关；未返回按 0（关） */
    showForumNavMenu(state) {
      const ds = state.system.discuz_system
      if (!ds || ds.discuz_status == null || ds.discuz_status === '') {
        return false
      }
      return String(ds.discuz_status) === '1'
    },
    /** 人机验证是否通过（4 小时内免验，或未开启验证） */
    botVerificationPassed(state) {
      return !shouldBlockByBotVerification(state.system, state.systemHotLoaded, state.getHotFailed)
    },
    /** 是否应展示人机验证弹窗 */
    botVerificationBlocking(state) {
      return shouldBlockByBotVerification(state.system, state.systemHotLoaded, state.getHotFailed)
    }
  },
  mutations: {
    setUid(state, data) {
      state.uid = data
    },
    /**获取论坛带过来的参数 */
    setLuntanBackUrl(state, data) {
      state.luntan_back_url = data
    },
    setSysDiffTime(state, data) {
      state.sysDiffTime = data
      localStorage.setItem('diffTime', state.sysDiffTime)
    },
    setDeviceInfo(state, data) {
      state.deviceInfo = data
    },
    setEnv(state, data) {
      state.env = data
    },
    setImgMode(state, data) {
      state.imgMode = data
    },
    setChannelCode(state, data) {
      state.channelCode = data
      localStorage.setItem('channel', state.channelCode)
    },
    mergeSystem(state, data) {
      state.system = {
        ...state.system,
        ...data
      }
      localStorage.setItem('system_config', JSON.stringify(omit(state.system, ['use_iframe_url'])))
    },
    setIframeDomainList(state, data) {
      state.iframeDomainList = data
    },
    setSystemHotLoaded(state, loaded) {
      state.systemHotLoaded = !!loaded
    },
    setGetHotFailed(state, failed) {
      state.getHotFailed = !!failed
    },
    // 即时比分，亚/太/欧设置
    setImmediately(state, data) {
      state.immediately = data
    },
    // 即时比分，红黄牌设置
    setGame(state, data) {
      state.game = data
    },
    // 足球比分数据
    setFootballScoreData(state, data) {
      state.footballData = data
    },
    // 足球事件直播
    setFootballEventLive(state, data) {
      state.footballEventLive = data
    },
    // 篮球比分数据
    setBasketballScoreData(state, data) {
      state.basketballData = data
    },
    // 篮球事件直播
    setBasketballEventLive(state, data) {
      state.basketballEventLive = data
    },
    // 活动数据
    setActivitiesData(store, data) {
      store.activitiesData = data
    },
    setGameInfo(store, data) {
      store.gameInfo = data
    },

    // 福袋数据
    SET_REDBAG_AMOUNT(state, data) {
      state.luckyBagData = data
    },
    setVisitorInfo(state, data) {
      const isLogout = !data || (!data.id && !data.token)
      if (!isLogout) {
        if (state.visitorInfo.id && data.id !== state.visitorInfo.id) {
          setTimeout(() => {
            // 游客 id 被重新分配：本页已用同一身份调过「进入系统」时，刷新后不再重复调用
            skipEnterIfReported(state.user.infoData)
            window.location.reload()
          }, 500)
        } else if (state.visitorInfo.token && data.token !== state.visitorInfo.token) {
          IM.connect()
        }
      }

      state.visitorInfo = data || {}
      localStorage.setItem('visitorInfo', JSON.stringify(state.visitorInfo))
    },
    setFeedbackPopupVisible(state, data) {
      state.showFeedbackPopup = data
    },
    setHasNewMsgChatsMap(state, data) {
      state.hasNewMsgChatsMap = data
      localStorage.setItem(
        `has_new_msg_chats_map::${store.getters.userId}`,
        JSON.stringify(state.hasNewMsgChatsMap)
      )
    },
    setPicBncMap(state, data) {
      // 原实现直接覆盖，导致缓存实际只存得下一条，同一张加密图会被反复解密
      const merged = { ...state.picBncMap, ...data }
      const keys = Object.keys(merged)
      // 值是 base64 全量图片数据，需限制条数避免长会话无上限累积
      if (keys.length > PIC_BNC_CACHE_MAX) {
        keys.slice(0, keys.length - PIC_BNC_CACHE_MAX).forEach((key) => delete merged[key])
      }
      state.picBncMap = merged
    },
    setHistoryMessageList(state, data) {
      state.historyMessageList = data
    },
    setIsNewMsgTip(state, data) {
      state.isNewMsgTip = data
      localStorage.setItem(
        `tips_audio_status::${store.getters.userId}`,
        state.isNewMsgTip ? '1' : '0'
      )
    },
    setGiftEffectsVisible(state, data) {
      state.giftEffectsVisible = data
      localStorage.setItem(
        `gift_effects_visible::${store.getters.userId}`,
        state.giftEffectsVisible ? '1' : '0'
      )
    },
    setShowShareConfirm(state, bool) {
      state.showShareConfirm = bool
    },
    setShowEmailTip(state, route) {
      const userInfo = state.user.infoData
      const today = getToday()
      const rawMailInfo = localStorage.getItem('SET_MAIL_TIP')
      const mailInfo = rawMailInfo ? JSON.parse(rawMailInfo) : null

      // 如果是论坛页面 不显示
      if (route && route.path === '/forum') {
        state.showEmail = false
        return
      }
      // 未登陆不提示
      if (!userInfo.id) {
        state.showEmail = false
        return
      }
      // 绑定邮箱不提示
      if (userInfo.user_email) {
        state.showEmail = false
        return
      }

      // 本日不在显示
      if (mailInfo && mailInfo.date === today && mailInfo.userId == userInfo.id) {
        state.showEmail = false
        return
      }

      state.showEmail = true
    },
    closeEmailTip(state) {
      state.showEmail = false
    },
    setForumId(state, data) {
      state.forumId = data
    }
  },
  actions: {
    SET_FORUM_LIST({commit}) {
      getForumList().then(res => {
        commit('setForumId', res.data.list || [])
      })
    },
    // 获取福袋数据
    GET_REDBAG_AMOUNT({ commit }) {
      return getRedbagAmount().then((res) => {
        commit('SET_REDBAG_AMOUNT', res.data || [])
        return res
      })
    },
    async setInviterLog({ commit }, { st, s }) {
      try {
        commit('setShowShareConfirm', true)

        const params = { st, s }
        await inviterLog(params)
      } catch (error) {
        console.error(error)
      }
    },
    async getImTouristAccount({ commit }, createNew) {
      try {
        let cachedVisitorInfo

        if (!createNew) cachedVisitorInfo = JSON.parse(localStorage.getItem('visitorInfo') || '{}')

        if (isEmpty(cachedVisitorInfo)) {
          const fingerprint = await getFingerprintId()
          const { data } = await imTouristAccount({ fingerprint })
          const id = parseInt(data.id)

          if (Number.isNaN(id)) cachedVisitorInfo = { id: genVisitorId() }
          else cachedVisitorInfo = { id }
        }

        commit('setVisitorInfo', cachedVisitorInfo)
        return cachedVisitorInfo
      } catch {
        const visitorInfo = { id: genVisitorId() }
        commit('setVisitorInfo', visitorInfo)
        return visitorInfo
      }
    },
    // 用户信息
    async updateUserInfo({ state, commit }) {
      await refreshUserInfo({
        userId: state.user.infoData.id,
        fetchInfo: info,
        readCachedUserId: () => getCacheUserInfo().id,
        getCurrentInfo: () => state.user.infoData,
        commit: (data) => commit('user/SET_USERINFO', data)
      })
    },
    async logout() {
      try {
        // 退出接口必须在身份仍然有效时发出，否则签名用 visitor=0 计算，会被鉴权层拒绝
        await logoutService()
      } catch (error) {
        console.error(error)
      }

      // 接口成功与否都要完成本地登出。
      // 刻意不 commit Vuex：commit 会触发 SET_USERINFO 里的延迟 reload，
      // 并在页面存活期间制造一段空身份窗口，使窗口内的请求全部被拒。
      // 调用方随后会整页导航，Vuex 状态由此重建。
      // 退出后的那次整页加载不调「进入系统」（需求 D5）
      skipNextEnter()
      try {
        IM.destroy()
        removeUrlParams('invite_code')
        localStorage.removeItem('urlInviteCode')
        localStorage.setItem('userInfo', '{}')
        localStorage.removeItem('visitorInfo')
      } catch (error) {
        console.error(error)
      }
    },
    async getSystem({ commit }) {
      try {
        const { data } = await getHot()
        const nextData = data || {}

        commit('setGetHotFailed', false)
        commit('mergeSystem', nextData)

        const channel = localStorage.getItem('channel')
        if (!channel && nextData.channelCode) {
          commit('setChannelCode', nextData.channelCode)
        }
        return { ok: true, data: nextData }
      } catch (error) {
        console.error(error)
        commit('setGetHotFailed', true)
        return { ok: false, data: {} }
      } finally {
        commit('setSystemHotLoaded', true)
      }
    },
    async getIframeDomain({ commit, state }) {
      if (state.iframeDomainList !== null) return state.iframeDomainList

      const { data } = await getIframeDomainService()
      commit('setIframeDomainList', data ?? [])
      return state.iframeDomainList
    },
    async init({ commit, dispatch }) {

      await s.actions.i()

      try {
        const fingerprintId = await getFingerprintId()
        const { os, browser, device } = window.UA_INFO

        commit('setSysDiffTime', parseFloat(localStorage.getItem('diffTime') || '0'))
        commit('setChannelCode', localStorage.getItem('channel') || '')
        commit('user/SET_USERINFO', getCacheUserInfo())
        commit('setVisitorInfo', JSON.parse(localStorage.getItem('visitorInfo') || '{}'))
        commit('setDeviceInfo', {
          fingerprintId,
          brand: `${device.vendor || ''}_${device.model || ''}`,
          model: `${browser.name || ''}_${browser.version || ''}`,
          versionOS: `${os.name || ''}_${os.version || ''}`
        })

        await dispatch('getSystem')

      
        const canContinue = await checkIframeBeforeInit()
        if (!canContinue) return false

        setTimeout(() => {
          dispatch('updateUserInfo')
          // dispatch('GET_REDBAG_AMOUNT') // 暂时屏蔽

          const userId = store.getters.userId
          if (userId) {
            const { hasNewMsgChatsMap, isNewMsgTip, giftEffectsVisible } = getUserCacheById(userId)

            commit('setHasNewMsgChatsMap', hasNewMsgChatsMap)
            commit('setIsNewMsgTip', isNewMsgTip)
            commit('setGiftEffectsVisible', giftEffectsVisible)
          }

          commit(
            'setImgMode',
            location.search.includes('direct=true') ? IMG_MODE.DIRECT : IMG_MODE.NORMAL
          )
        })
        return true
      } catch {
        //
        return false
      }
    },
    // 游客转注册用户时，转移之前游客身份时产生的缓存数据
    transCacheToUser(store, { oldId, newId }) {
      if (!oldId || !newId) return

      // const { hasNewMsgChatsMap, isNewMsgTip, giftEffectsVisible } = getUserCacheById(oldId)
      // const { hasNewMsgChatsMap: hasNewMsgChatsMap2 } = getUserCacheById(newId)

      // 清空之前游客身份时产生的缓存数据
      resetUserCacheById(oldId)
      // 暂时先不做转移处理，因游客转用户后，之前的私聊房间vid都发生了改变，同步无意义
      // commit('setHasNewMsgChatsMap', { ...hasNewMsgChatsMap2, ...hasNewMsgChatsMap })
      // commit('setIsNewMsgTip', isNewMsgTip)
      // commit('setGiftEffectsVisible', giftEffectsVisible)
      // dispatch('getImTouristAccount', true)
    }
  }
})

function getUserCacheById(userId) {
  return {
    hasNewMsgChatsMap: JSON.parse(localStorage.getItem(`has_new_msg_chats_map::${userId}`) || '{}'),
    isNewMsgTip: localStorage.getItem(`tips_audio_status::${userId}`) !== '0',
    giftEffectsVisible: localStorage.getItem(`gift_effects_visible::${userId}`) !== '0'
  }
}

function resetUserCacheById(userId) {
  localStorage.setItem(`has_new_msg_chats_map::${userId}`, '{}')
  localStorage.setItem(`tips_audio_status::${userId}`, '1')
  localStorage.setItem(`gift_effects_visible::${userId}`, '1')
}

export default store
