<template>
  <div class="live_page_box">
    <div class="container_box">
      <!-- 直播间 -->
      <div class="live_box">
        <!-- 视频播放区域 -->
        <div class="live_left">
          <liveRoomHeader
            ref="liveRoomHeaderEl"
            @handleMess="handleMess"
            @editSuccess="editSuccess"
            :anchorInfo="anchorInfo"
          ></liveRoomHeader>
          <div class="live_left_main" ref="liveLeftMainRef">
            <animationArrows
              v-if="showScore"
              @change="changeArrow"
              :isExpand="isExpand"
            ></animationArrows>
            <div :class="['live_score_box', isExpand ? '' : 'packUp_score']" v-if="showScore">
              <!-- <div :class="['live_score_box', isExpand ? '' : 'packUp_score']"> -->
              <liveScore></liveScore>
            </div>
            <div class="live_video_box">
              <div class="video_box">
                <ForbiddenViewBox v-if="isBlockDisplay" />
                <live-player
                  v-else
                  :info="liveBroadcastRoomDetails"
                  :liveClosed="liveClosed"
                  :danmakuTop="showScore ? (isExpand ? 66 : 20) : 0"
                  :query="query"
                  :link="system.textLinkUrl"
                  @onHandleLiveClosed="onHandleLiveClosed"
                  @onHandleMatchInfoToggle="handleMatchInfoToggle"
                >
                </live-player>
                <!-- 开赛倒计时 -->
                <CountdownToStart
                  v-if="isShowCountdownBroadcast"
                  :countDown="countDown"
                  :anchorInfo="anchorInfo"
                  @closeCountDown="closeCountDown"
                  @handlePay="handlePay"
                  @handleCopy="handleCopy"
                ></CountdownToStart>
              </div>
            </div>
            <!-- 投票 -->
            <liveVote></liveVote>

            <!-- 直播前的红包 -->
            <!-- <DraggableBox width="96px" height="91px" @box-click="showRedEnvelop">
              <img class="red_envelope_icon" src="/static/images/daily/red-envelope.png" />
            </DraggableBox> -->
          </div>
          <div class="live_scroll_ads"><ScrollAds /></div>
        </div>

        <!-- 右边聊天区域 -->
        <div class="chat_right" v-show="!hideChatPanel">
          <div class="chat_right_inner">
            <ChatPanel
              :vid="currentRoomVID"
              :uid="query.uid"
              :roomDetail="liveBroadcastRoomDetails"
              ref="chatPanelRef"
              @receiveSuccess="initActivitiesList"
              @onHandleMatchInfoToggle="handleMatchInfoToggle"
              @tabChange="handleChange"
            />
          </div>
        </div>
      </div>

      <!-- 广告区 -->
      <div class="advertise_box" v-if="advertiseShow">
        <div
          class="advertise_box_004"
          @click="handleOpenLink(advertisingImgEight004.advertising_url)"
          v-if="advertisingImgEight004.img_address"
        >
          <el-image :lazy="true" :src="advertisingImgEight004.img_address" />
        </div>
        <div
          class="advertise_box_008"
          @click="handleOpenLink(advertisingImgEight008.advertising_url)"
          v-if="advertisingImgEight008.img_address"
        >
          <el-image :lazy="true" :src="advertisingImgEight008.img_address" />
        </div>
      </div>

      <section class="live-other-info-box">
        <div class="grid-left">
          <!-- 直播列表 -->
          <div class="live-list-box">
            <dfHgroup title="热门直播" />
            <div class="wrapper">
              <dfLiveCardGroupSwiper :list="hotLiveList" />
            </div>
          </div>
        </div>
        <div class="grid-right">
          <div class="message-board-box" ref="messageBoardRef">
            <dfHgroup title="悄悄话留言板" />
            <messageBoard />
          </div>
        </div>
      </section>
    </div>

    <!-- 红包弹窗 -->
    <redEnvelopDialog v-model="showRedEnvelopeDialog" @showZbChat="showZbChat"></redEnvelopDialog>

    <!-- 下载弹框 -->
    <downLoadModel
      v-if="showDownLoadModel"
      :popData="advertisingImgEleven011"
      @close="showDownLoadModel = false"
    >
    </downLoadModel>
  </div>
</template>

<script setup name="live" lang="ts">
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { getAdList, getRoomInfo, getLives, enterLiveWatchRecord, heartLiveWatchRecord } from '@/api/user.js'
import { activityGames } from '@/api/activities.js'
import { getBasketballInfo } from '@/api/basketball'
// import { ScoreHelper } from '@/utils/scoreSocket.js'
import { getfootballDetail } from '@/api/football.js'
import downLoadModel from '@/components/downLoadModel.vue'
import liveRoomHeader from '@/components/liveRoomHeader.vue'
import ScrollAds from '@/components/ScrollAds/index.vue'
import livePlayer from '@/views/anchor/live-player-iframe.vue'
import CountdownToStart from '@/components/CountdownToStart.vue'
import redEnvelopDialog from '@/components/redEnvelopDialog.vue'
import ChatPanel from '@/views/anchor/components/chatPanel/index.vue'
import messageBoard from '@/components/messageBoard.vue'
import dfHgroup from '@/components/dfHgroup/index.vue'
// import DraggableBox from '@/components/DraggableBox.vue'
import ForbiddenViewBox from '@/components/Forbidden/index.vue'
import liveScore from '@/components/liveScore.vue'
import animationArrows from '@/views/anchor/components/animationArrows/index.vue'
import liveVote from '@/views/anchor/components/liveVote/index.vue'

import dfLiveCardGroupSwiper from '@/components/dfLiveCardGroupSwiper/index.vue'

import {
  returnMatchType,
  pickAnchorUidFromRoute,
  resolveLiveRoomAnchorUid
} from '@/utils/common.js'
import { resolveLiveVideoType } from '@/utils'
import { flattenDeep } from 'lodash-es'
import { CHAT_TYPE } from '@/enums'
import { recordUsageTime } from '@/api/user'
import mittBus from '@/utils/mittBus'
import { createLiveWatchRecord, createLiveInfoGate, pickLiveWatchInfo } from '@/utils/liveWatchRecord.js'

interface liveDetails {
  type?: number
  match_id?: number
  [key: string]: any
}

const store = useStore()
const route = useRoute()

const liveLeftMainRef = ref(null)
provide('containerRef', liveLeftMainRef)

const anchorInfo = ref({
  title_main: '',
  title_sub: ''
}) // 直播信息
const liveBroadcastRoomDetails = ref<liveDetails>({}) // 直播间详情数据
const advertisingImgEight004 = ref({
  advertising_url: '',
  img_address: ''
})
const advertisingImgEight008 = ref({
  advertising_url: '',
  img_address: ''
})
const currentRoomVID = ref('') // 当前房间的VID
const advertisingImgEleven011 = ref({})
const showDownLoadModel = ref(false) // 广告弹窗
const timer011 = ref(null) // 广告倒计时id
const timer011Num = ref(180) // 广告倒计时时间
const showRedEnvelopeDialog = ref(false) // 红包弹窗
const liveRoomHeaderEl = ref(null) // 直播房间头部实例
const messageBoardRef = ref<HTMLElement | null>(null) // 留言板ref
const chatPanelRef = ref(null) // 聊天框 ref
const isExpand = ref(false)

// 是否显示比分
const showScore = computed(() => {
  return (
    (store.state.gameInfo.status_str && store.state.gameInfo.status_str !== '完场') ||
    (store.state.gameInfo.status_name && store.state.gameInfo.status_name !== '完场')
  )
})
// 是否显示广告
const advertiseShow = computed(() => {
  return advertisingImgEight004.value.img_address || advertisingImgEight008.value.img_address
})

const isShowCountdownBroadcast = ref(false) // 是否显示开播倒计时
const countDown = ref(0) // 开播倒计时
const liveClosed = ref(false) // 是否关播
const isBlockDisplay = ref(false) // 直播版权限制
const userInfo = computed(() => store.state.user.infoData)
const currentUserId = computed(() => store.getters.userId)

const query = ref({
  ...route.query
})
const anchorUidFromRoute = pickAnchorUidFromRoute(route)
if (anchorUidFromRoute != null) {
  query.value.uid = String(anchorUidFromRoute)
}

const system = computed(() => {
  return store.state.system
})

const hideChatPanel = computed(() => {
  if (!liveBroadcastRoomDetails.value.vid) return false
  return (
    ![0, 1, 3].includes(liveBroadcastRoomDetails.value.type) &&
    store.state.system.chat_msg_close === 1
  )
})

const handleOpenLink = (link) => {
  if (link) window.open(link)
}

const onHandleLiveClosed = (boo) => {
  liveClosed.value = boo
}

const handleChange = (value) => {
  if (value === 'activities') {
    initActivitiesList()
  } else if (value === 'matchStatus') {
    if (liveBroadcastRoomDetails.value.type === 0) {
      footballDetails() // 足球详情
    } else if (liveBroadcastRoomDetails.value.type === 1) {
      basketballDetails() // 篮球详情
    }
  }
}

const changeArrow = async () => {
  if (isExpand.value) return false
  isExpand.value = true

  // 每次点击的时候展开 并获取最新的比分
  await playDetails()
  // 3s之后关闭
  setTimeout(() => {
    isExpand.value = false
  }, 3000)
}

// 监听直播关闭状态，关播时停止观看上报，并作废关播前发出的直播信息请求
watch(() => liveClosed.value, (newVal) => {
  if (newVal) closeLiveWatch()
})

const matchType = ref(0)

// 获取直播详情
const initRoomInfo = (action) => {
  const anchorUid =
    resolveLiveRoomAnchorUid(query.value, liveBroadcastRoomDetails.value) ??
    pickAnchorUidFromRoute(route)
  if (anchorUid == null) {
    if (action === 'toggle') isDoingMatchInfoToggle = false
    return
  }
  const params = {
    uid: anchorUid,
    videoType: resolveLiveVideoType(route.query.type === 'main')
  }
  if (action === 'toggle') {
    ;(params as any).ttl = -1
  }
  const liveInfoSeq = liveInfoGate.issue()
  getRoomInfo(params)
    .then((res) => {
      // 直播间观看上报：在页面改写数据之前同步，同一场由状态机去重
      syncLiveWatch(res.data, liveInfoSeq, anchorUid)
      const { userData, info, block, vid } = res.data
      currentRoomVID.value = vid
      anchorInfo.value = userData // 直播信息
      liveBroadcastRoomDetails.value = { ...info, userNickname: userData.user_nickname || '' }
      const resolvedAnchorUid = Number(userData?.uid) > 0 ? Number(userData.uid) : Number(info?.uid) > 0 ? Number(info.uid) : anchorUid
      query.value.uid = String(resolvedAnchorUid)
      liveClosed.value = info.islive == null || Number(info.islive) === 2
      isBlockDisplay.value = block
      query.value.type = returnMatchType(info.type)
      query.value.id = info.match_id
      isDoingMatchInfoToggle = false

      /** 看是否是robot直播  还是回放 */
      store.commit('house/setIsRobotAction', userData?.iszr)
      store.commit('house/setIsReplayAction', info?.isRecord)

      initActivitiesList()
      liveCountdown(info) // 直播倒计时

      if ([0, 1].includes(info.type)) {
        matchType.value = info.type
        playDetails() // 比赛信息
      }
    })
    .catch(() => {
      isDoingMatchInfoToggle = false
    })
}

const getActivityList = () => {
  activityGames({
    anchor_id: query.value.uid,
    match_id: liveBroadcastRoomDetails.value.match_id
  }).then((res: any) => {
    const { data = [] } = res
    store.commit('setActivitiesData', data)
  })
}

let timer: number | null = null
function initActivitiesList() {
  getActivityList()

  // 进行一分钟一次的轮询
  if (timer) window.clearInterval(timer)
  timer = window.setInterval(getActivityList, 1000 * 60)
}

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})

// function handleChange(name) {
//   if (name === 'activities') initActivitiesList()
// }

/**
 *  注释的什么。。。。
 * 足球详情
 * 只针对getRoomInfo接口返回的比赛类型 0:足球 1:篮球 2:其他 3:电竞 4:区块链
 * 路由跳转带的type类型是错误的 需要后面把路由带的参数更正过来 错误的类型(1:足球 2:篮球 3:其他 4:电竞 5:区块链)
 */
const playDetails = async () => {
  if (matchType.value === 0) {
    footballDetails() // 足球详情
  } else if (matchType.value === 1) {
    basketballDetails() // 篮球详情
  }
  // await ScoreHelper.init(info.match_id, info.uid, scoreMessage) // 比分推送
}
// 足球详情
const footballDetails = () => {
  getfootballDetail({ id: liveBroadcastRoomDetails.value.match_id }).then((res) => {
    const { data = {} } = res
    store.commit('setGameInfo', data)

    scoreMessage({
      channel: 'live',
      home_score: data.home_score,
      away_score: data.away_score,
      state_id: data.status_id
    })

    // 足球事件直播
    const eventLiveList = data.tlive ? data.tlive.reverse() : []
    store.commit('setFootballEventLive', eventLiveList)
  })
}
// 篮球详情
const basketballDetails = () => {
  getBasketballInfo({ id: liveBroadcastRoomDetails.value.match_id }).then((res) => {
    const { data = {} } = res
    store.commit('setGameInfo', data)

    // 篮球比分数据
    scoreMessage({
      channel: 'live',
      home_score: data.home_score,
      away_score: data.away_score
    })

    // 篮球事件直播
    const eventLiveList = data.tlive || []
    store.commit('setBasketballEventLive', eventLiveList)
  })
}

const scoreMessage = (data) => {
  // 比分
  if (data.channel === 'live') {
    // 比分
    if (liveBroadcastRoomDetails.value.type === 0) {
      store.commit('setFootballScoreData', data)
    } else if (liveBroadcastRoomDetails.value.type === 1) {
      store.commit('setBasketballScoreData', data)
    }
  }
  if (data.channel === 'live-event') {
    // 事件直播
    const { events = [] } = data
    if (liveBroadcastRoomDetails.value.type === 0) {
      store.commit('setFootballEventLive', flattenDeep(events))
    } else if (liveBroadcastRoomDetails.value.type === 1) {
      store.commit('setBasketballEventLive', events)
    }
  }
}

// 直播倒计时
const liveCountdown = (info) => {
  if (info.starttime - info.servertime > 0 && info.starttime > 0) {
    countDown.value = info.starttime - info.servertime
    isShowCountdownBroadcast.value = true
  }
}
// 直播倒计时关闭
const closeCountDown = () => {
  countDown.value = 0
  isShowCountdownBroadcast.value = false
}

const showRedEnvelop = () => {
  if (!userInfo.value.id) {
    store.commit('user/SET_LOGIN_MASK', true)
    return
  }
  showRedEnvelopeDialog.value = true
}
const showZbChat = () => {
  chatPanelRef.value.openChat(CHAT_TYPE.ANCHOR_PRIVATE)
  showRedEnvelopeDialog.value = false
}

// 获取热门直播列表
const hotLiveList = ref([])
const getLiveListAction = () => {
  let data = {
    page: 1,
    type: -1, //-1全部 0足球 1篮球 2其他
    limit: 100,
    isweb: 1
  }
  getLives(data)
    .then((res) => {
      hotLiveList.value = res.data || []
    })
    .catch(() => {})
}

// 悄悄话
const handleMess = () => {
  if (messageBoardRef.value) {
    messageBoardRef.value.scrollIntoView({
      behavior: 'smooth'
    })
  }
}

// 直播标题修改成功
const editSuccess = ({ title_main, title_sub }) => {
  anchorInfo.value.title_main = title_main
  anchorInfo.value.title_sub = title_sub
}

// 关注
const handlePay = () => {
  if (liveRoomHeaderEl.value) liveRoomHeaderEl.value.handlePay()
}
// 分享
const handleCopy = () => {
  if (liveRoomHeaderEl.value) liveRoomHeaderEl.value.handleCopy()
}

const initGetAdList = () => {
  getAdList().then((res) => {
    res.data.forEach((el) => {
      switch (el.ad_id) {
        case '004':
          advertisingImgEight004.value = el
          break
        case '008':
          advertisingImgEight008.value = el
          break
        case '011':
          advertisingImgEleven011.value = el
          setAdTimer()
          break
      }
    })
  })
}
const setAdTimer = () => {
  if (timer011.value) {
    window.clearInterval(timer011.value)
    timer011.value = null
  }
  timer011.value = window.setInterval(() => {
    if (timer011Num.value <= 0) {
      window.clearInterval(timer011.value)
      timer011.value = null
      if (!sessionStorage.getItem('isShowDownLoad')) {
        showDownLoadModel.value = true
        sessionStorage.setItem('isShowDownLoad', true)
      }
    }
    timer011Num.value -= 1
  }, 1000)
}

let timeInterval = 0
// const handlePageVisible = () => {
//   if (document.visibilityState !== 'visible') {
//     timeInterval && window.clearInterval(timeInterval)
//   }
//   if (document.visibilityState === 'visible') {
//     timeInterval && window.clearInterval(timeInterval)
//     timeInterval = window.setInterval(() => {
//       recordUsageTimeAction({
//         user_id: currentUserId.value,
//         match_id: query.value.uid,
//         channel_code: store.state.channelCode
//       })
//     }, 60000)
//   }
// }

timeInterval = window.setInterval(() => {
  const data = {
    cum_min: 1,
    addTime: new Date().getTime(),
    match_id: query.value.uid,
    channel_code: store.state.channelCode
  }
  recordUsageTime(data)
}, 60 * 1000)

// 直播间观看上报（NX-2151）：进入、心跳、续期由状态机负责；换场、关播、离开都在这里接入
let liveWatch = createLiveWatchRecord({ enter: enterLiveWatchRecord, heart: heartLiveWatchRecord })
const liveInfoGate = createLiveInfoGate() // 丢弃过期的直播信息回包；关播时作废关播前发出的请求

// 每次拿到直播信息都交给这里：同一场忽略，换场重新计时，已关播不上报
const syncLiveWatch = (data, seq, fallbackAnchorId) => {
  try {
    if (!liveInfoGate.accept(seq)) return
    const picked = pickLiveWatchInfo(data, {
      fallbackAnchorId,
      channelCode: query.value.channel_code || store.state.channelCode
    })
    if (!picked) return
    liveInfoGate.commit(seq)
    if (picked.closed) liveWatch?.markClosed(picked.payload)
    else liveWatch?.start(picked.payload)
  } catch (err) {
    console.warn('直播间观看上报同步失败:', err)
  }
}

const closeLiveWatch = () => {
  liveWatch?.markClosed()
  liveInfoGate.invalidate()
}

// 禁播展示时播放器不渲染、收不到关播通知，这里自己订阅一次，只用于停止上报，不改页面数据
const onLiveWatchIMMessage = (source) => {
  if (source?.action !== 'closeLive') return
  const vid = liveBroadcastRoomDetails.value?.vid
  if (vid && source.vid === vid) closeLiveWatch()
}

// 连播（播放异常重试查到换场时，播放器会带上它拿到的直播信息 snapshot）
let isDoingMatchInfoToggle = false
let toggleMatchInfoTimeoutId
const handleMatchInfoToggle = (match_id, snapshot) => {
  if (snapshot) {
    const anchorUid =
      resolveLiveRoomAnchorUid(query.value, liveBroadcastRoomDetails.value) ?? pickAnchorUidFromRoute(route)
    syncLiveWatch(snapshot, liveInfoGate.issue(), anchorUid)
  }
  if (isDoingMatchInfoToggle) return
  if (Number(match_id) !== Number(liveBroadcastRoomDetails.value.match_id)) {
    isDoingMatchInfoToggle = true
    toggleMatchInfoTimeoutId = window.setTimeout(() => {
      // ScoreHelper?.destroy()
      initRoomInfo('toggle')
    }, 3000)
  }
}

onMounted(() => {
  initGetAdList() // 获取广告
  initRoomInfo('init') // 获取直播详情
  getLiveListAction() // 获取热门直播
  mittBus.on('imOnMessage', onLiveWatchIMMessage)
  // document.addEventListener('visibilitychange', handlePageVisible)

  document.addEventListener('dragstart', (event: Event) => {
    if (event.target?.tagName === 'IMG') {
      event.preventDefault()
    }
  })
})

onBeforeUnmount(() => {
  timer011.value && window.clearInterval(timer011.value)
  timeInterval && window.clearInterval(timeInterval)
  mittBus.off('imOnMessage', onLiveWatchIMMessage)
  liveWatch?.stop() // 停止直播间观看上报
  liveWatch = null // 卸载后才返回的直播信息不再开始上报
  // document.removeEventListener('visibilitychange', handlePageVisible)
  // ScoreHelper?.destroy()
  if (toggleMatchInfoTimeoutId) window.clearTimeout(toggleMatchInfoTimeoutId)
})
</script>

<style scoped lang="scss">
$live-card-item-space-between: 12px;
.live_page_box {
  min-height: 100vh;
  padding-top: 10px;
  padding-left: 6vw;
  padding-right: 6vw;
  padding-bottom: 30px;
  position: relative;
  max-width: 2000px;
  min-width: 800px;
  margin: 0 auto;
  .container_box {
    position: relative;
    width: 100%;
    margin: 0 auto;
    .live_box {
      position: relative;
      display: flex;
      .live_left {
        flex: 1;
        position: relative;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        .live_left_main {
          flex: 1;
          width: 100%;
          position: relative;
          background-color: var(--el-color-block);
          display: flex;
          align-items: center;
          overflow: hidden;
          min-height: 400px;
          // 比分
          .live_score_box {
            width: 100%;
            height: 66px;
            position: absolute;
            top: 0;
            left: 0;
            overflow: hidden;
            background-color: rgba(0, 0, 0, 0.35);
            z-index: 20;
            transition: top ease-in-out 0.2s;
          }
          .packUp_score {
            top: -66px;
          }
          // 视频
          .live_video_box {
            position: relative;
            width: 100%;
            overflow: hidden;

            .video_box {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
            }

            &::before {
              content: '';
              display: block;
              padding-bottom: 56.25%;
            }
          }
          // 红包按钮
          .red_envelope_icon {
            // position: absolute;
            // right: 0;
            // z-index: 3;
            width: 100%;
            animation-name: upAnimation;
            transform-origin: center bottom;
            animation-duration: 2s;
            animation-fill-mode: both;
            animation-iteration-count: infinite;
            animation-delay: 0.5s;
          }
        }
        .live_scroll_ads {
          flex-shrink: 0;
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding-left: 4px;
          background-color: var(--el-fill-color-extra-light);
        }
      }
      .chat_right {
        position: relative;
        width: 23vw;
        flex-shrink: 0;
        margin-left: 10px;
        min-width: 375px;
        max-width: 480px;
        .chat_right_inner {
          width: 100%;
          height: 100%;
          top: 0;
          right: 0;
          position: absolute;
        }
      }
    }
    // 广告
    .advertise_box {
      width: 100%;
      padding-top: 12px;
      .advertise_box_004,
      .advertise_box_008 {
        padding-bottom: 12px;
        cursor: pointer;
        .el-image {
          width: 100%;
        }
      }
    }
    .live-other-info-box {
      width: 100%;
      display: flex;
      overflow: hidden;
      .grid-left {
        flex: 1;
        margin-right: 12px;
        overflow: hidden;
      }
      .grid-right {
        width: 294px;
        flex-shrink: 0;
      }
    }
    .live-list-box {
      width: 100%;
      .dfHgroup {
        padding: 20px 0;
      }
    }
    .message-board-box {
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      .dfHgroup {
        padding: 20px 0;
      }
    }
  }
}
@keyframes upAnimation {
  0% {
    transform: rotate(0deg);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  10% {
    transform: rotate(-12deg);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  20% {
    transform: rotate(12deg);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  28% {
    transform: rotate(-10deg);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  36% {
    transform: rotate(10deg);
    transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
  }

  42% {
    transform: rotate(-8deg);
    transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
  }

  48% {
    transform: rotate(8deg);
    transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
  }

  52% {
    transform: rotate(-4deg);
    transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
  }

  56% {
    transform: rotate(4deg);
    transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
  }

  60% {
    transform: rotate(0deg);
    transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
  }

  100% {
    transform: rotate(0deg);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
}
</style>
