<template>
  <div class="chat_detail_comp">
    <div class="chat_detail_header" v-show="props.showHeader">
      <div class="chat_detail_header_back_btn" @click="() => backChatList()">
        <ArrowLeftBold />
      </div>
      <div class="chat_detail_header_title">{{ roomInfo?.name || roomInfo?.user_name }}</div>
      <div class="chat_detail_header_online_status">
        <div
          class="chat_detail_header_online_status_inner"
          :class="{ online: roomInfo?.is_online === 1 }"
          v-if="chatType === CHAT_TYPE.PRIVATE"
        >
          {{ roomInfo?.is_online === 1 ? '在线' : '离线' }}
        </div>
      </div>
    </div>
    <!-- 广场 广告-->
    <template v-if="chatType === CHAT_TYPE.PUBLIC">
      <RoomNotice v-if="pinData" :data="pinData" />
      <InRoomNotice v-if="props.vid" :vid="props.vid" />
    </template>
    <template v-else>
      <PinMessage v-if="pinData" :data="pinData" />
    </template>
    <!-- 消息list -->
    <div
      class="scroller_container hide_scrollbar"
      ref="chatScrollerRef"
      :style="{ paddingBottom: scrollerPadBottom + 'px' }"
      @click="handleMessageListClick"
    >
      <transition name="el-zoom-in-top">
        <div v-show="isLoading" class="loading_box">
          <Loading class="loading_rotate" /><span>加载中...</span>
        </div>
      </transition>
      <div
        v-for="item in msgList"
        :key="item.seed"
        class="message_item_box"
        @click="handleGetItems(item)"
      >
        <MessageItem :data="item" :color="setColorFun(item)" @resend-msg="handleResend" />
      </div>
    </div>
    <!-- NX-1887 AI 预设问题快捷入口：浮层，覆盖消息区底部；仅主播私聊显示 -->
    <div
      v-show="aiCardVisible"
      class="ai_preset_overlay"
      :class="{ expanded: aiCardExpanded }"
      ref="aiOverlayRef"
      :style="aiOverlayStyle"
    >
      <AiPresetQuestions
        :chat-type="props.chatType"
        :vid="props.vid"
        :uid="props.uid"
        :is-ready="!isLoading"
        :is-mute="isMute"
        @select="onPresetSelect"
        @visibility-change="onAiVisibilityChange"
      />
    </div>
    <div
      class="has_new_message"
      v-show="newMsgTipsVisible"
      :style="{ bottom: floatBtnBottom + 'px' }"
      @click="scrollToLastMsg"
    >新消息</div>
    <div
      class="scroll_to_bottom_btn"
      v-show="scrollToBottomBtnVisible"
      :style="{ bottom: floatBtnBottom + 'px' }"
      @click="scrollToLastMsg"
    >
      <Download />
    </div>
    <!-- 礼物 -->
    <div
      v-show="props.chatType === CHAT_TYPE.PUBLIC && giftBoxVisible && giftEffectsVisible"
      class="gift_container"
    >
      <div class="gift_player_box">
        <canvas ref="giftContainer"></canvas>
      </div>
    </div>
    <div v-if="uploadVideoAuth" id="delyDestoryDom" class="applyAuth" @click.once="sendApply">
      <IconFilm :style="{ verticalAlign: 'middle', color: true ? '#d02d54' : '#2671F7' }" />
      上传视频，点我申请
    </div>
    <OperationPanel
      ref="operationPanelRef"
      :chat-box-mode="props.chatBoxMode"
      :chat-type="props.chatType"
      :tab-index="props.tabIndex"
      :is-live-activity-help="props.isLiveActivityHelp"
      :vid="props.vid"
      :uid="props.uid"
      :assign-id="props.assignId"
      :is-mute="isMute"
      :is-forum="isForum"
      :is-ready="!isLoading"
      @_updateChatRead="setRead(msgList.length - 1)"
      @change-vid="(vid: string) => emit('change-vid', vid)"
    />

    <!-- 点击消息操作按钮 -->
    <el-tooltip
      :visible="copyBtnVisible"
      :virtual-ref="selectedMsgRef"
      :offset="2"
      virtual-triggering
      popper-class="chat_item_common_popper"
      placement="bottom"
    >
      <template #content>
        <div class="copy_text_btn" @click.stop="handleCopyBtnClick">复制</div>
        <div
          v-if="chatType === CHAT_TYPE.PUBLIC && !isHouse && isDetelePermiss"
          class="copy_text_btn"
          @click.stop="handleDelete"
        >
          删除
        </div>
      </template>
    </el-tooltip>
  </div>
</template>
<script setup lang="ts" name="ChatBoxDetail">
import { usePermission } from '@/utils/usePermision'
import IconFilm from './images/iconFile.vue'
import RoomNotice from '@/components/chatBox/components/roomNotice/index.vue'
import InRoomNotice from '@/components/chatBox/components/inRoomNotice/index.vue'
import PinMessage from '@/components/chatBox/components/pinMessage/index.vue'
import MessageItem from '@/components/chatBox/components/messageItem/index.vue'
import { CHAT_TYPE, CHAT_BOX_MODE, MESSAGE_TYPE, MESSAGE_STATUS } from '@/enums'
import { unionEndBy, unionStartBy, addFirstWrap, genSeedId } from '@/utils/common'
import mittBus from '@/utils/mittBus'
import OperationPanel from '@/components/chatBox/components/operationPanel/index.vue'
import AiPresetQuestions from '@/components/chatBox/components/aiPresetQuestions/index.vue'
import { useScroll, useClipboard, useIntervalFn, useThrottleFn, watchDebounced } from '@vueuse/core'
import { ArrowLeftBold, Download, Loading } from '@element-plus/icons-vue'
import { Parser, Player, DB } from 'svga'
import { IM } from '@/utils/im'
import { useStore } from 'vuex'
import { uniqBy, cloneDeep } from 'lodash-es'
import HomedApi from '@/api/home'
import { formatMsg, processPinData, testGifts } from '@/components/chatBox/chatHelper'
import { definChatDeleted } from '@/api/housManage'

const emit = defineEmits(['out-room', 'change-vid'])
const mySelf = inject<(data: any) => boolean>('mySelf')
const newMsgTips = inject<(data: any) => void>('newMsgTips')
const clearDot = inject<(vid: string, seed?: string, sender?: number) => void>('clearDot')
const gifts = inject<Ref<Array<{ [key: string]: any }>>>('gifts')
const uploadVideoAuth = ref(false)

const props = defineProps({
  chatType: {
    type: Number,
    default: CHAT_TYPE.PUBLIC
  },
  vid: {
    type: String,
    default: ''
  },
  roomId: {
    type: Number,
    default: 0
  },
  uid: {
    type: Number,
    default: 0
  },
  assignId: {
    type: Number,
    default: 0
  },
  showHeader: {
    type: Boolean,
    default: false
  },
  isForum: {
    type: Boolean,
    default: false
  },
  roomInfo: {
    type: Object,
    default: () => null
  },
  chatBoxMode: {
    type: Number,
    default: CHAT_BOX_MODE.LIVE
  },
  tabIndex: {
    type: String,
    default: '0'
  },
  /** 直播间活动「寻求帮助」打开的会话 */
  isLiveActivityHelp: {
    type: Boolean,
    default: false
  }
})

const MAX_MSG_LIST_LENGTH = 600
const NEED_SUB_CHATS = [CHAT_TYPE.GROUP, CHAT_TYPE.PUBLIC]
const NEED_SET_READ_CHATS = [CHAT_TYPE.PRIVATE, CHAT_TYPE.ANCHOR_PRIVATE]
let newMsgList = []
let pageParams = {
  limit: 30,
  hasMore: true
}
let giftIsPlaying = false
let parser = null
let player = null
let playerDB = null

const newMsgCount = ref(0)
const msgList = ref([]) // 消息列表
const pinData = ref(null)
const giftBoxVisible = ref(false)
const copyBtnVisible = ref(false)
const isMute = ref(false)
const isLoading = ref(false)
const newMsgTipsVisible = ref(false)
const scrollToBottomBtnVisible = ref(false)
// 获取chat_msg_color
const chat_msg_color = ref(null)
const systemData = localStorage.getItem('system_config')
if (systemData) {
  chat_msg_color.value = JSON.parse(systemData)?.chat_msg_color
}

const chatScrollerRef = ref<HTMLElement>()
// @ts-ignore
const useScrollReturn = useScroll(chatScrollerRef, { throttle: 50, idle: 0 })
const giftContainer = ref<HTMLCanvasElement>()
const selectedMsgRef = ref<HTMLElement>()
const operationPanelRef = ref()

// NX-1892 AI 预设问题浮层相关状态
const aiOverlayRef = ref<HTMLElement | null>(null)
const aiCardVisible = ref(false)
const aiCardExpanded = ref(false)
const opPanelH = ref(88) // 操作面板实际高度，默认 88 兜底
let opPanelRO: ResizeObserver | null = null

const aiCardHeight = ref(0)

// 默认态：直接贴在操作面板顶部（bottom = opPanelH），左右满宽
// 展开态：浮层，距工具栏 10px，左右各留 8px 空隙
const aiOverlayStyle = computed(() => {
  if (aiCardExpanded.value) {
    return {
      bottom: opPanelH.value + 10 + 'px',
      left: '8px',
      right: '8px'
    }
  }
  return {
    bottom: opPanelH.value + 'px',
    left: '0',
    right: '0'
  }
})

// 卡片可见 && 未展开：给消息区加 padding-bottom = 默认态卡片实际高度
// 展开态：卡片作为浮层覆盖消息区底部，不加 padding（按需求，展开态不处理遮挡）
const scrollerPadBottom = computed(() => {
  if (!aiCardVisible.value || aiCardExpanded.value) return 0
  return aiCardHeight.value
})

// 浮动按钮（新消息 / 回到底部）在默认态卡片显示时抬起，避免落进卡片区域
const floatBtnBottom = computed(() => {
  const base = 94
  if (!aiCardVisible.value) return base
  if (aiCardExpanded.value) return base
  return base + aiCardHeight.value
})

async function onPresetSelect(question: { id: number; text: string }) {
  const panel = operationPanelRef.value
  if (!panel) return
  // 兼容 operationPanel 未升级出 sendMessage 的历史场景：优先 sendMessage
  if (typeof panel.sendMessage === 'function') {
    panel.sendMessage(MESSAGE_TYPE.TEXT, question.text, undefined, 1)
  }
}

// 卡片可见性/展开态变化时的 padding + 贴底补偿
function onAiVisibilityChange(payload: { visible: boolean; expanded: boolean }) {
  const wasAtBottom = useScrollReturn.arrivedState.bottom
  aiCardVisible.value = payload.visible
  aiCardExpanded.value = payload.expanded
  nextTick(() => {
    // 读一次卡片实际高度（非展开态：60~108 自适应；展开态：252）
    const overlayEl = aiOverlayRef.value
    const cardEl = overlayEl?.firstElementChild as HTMLElement | null
    aiCardHeight.value = cardEl?.offsetHeight ?? 0
    // 面板 resize 期间 useScroll 的 arrivedState 不会更新，此处主动 measure 一次
    useScrollReturn.measure?.()
    if (wasAtBottom) scrollToLastMsg()
  })
}
const { copy } = useClipboard()

const store = useStore()
const getCurrentItems = ref(null)
/**
 * 是否是房管(no)
 * 是高级房管
 * 是否有删除权限
 * */
const { isHouse, isHightHouse, isDetelePermiss } = usePermission()
const giftEffectsVisible = computed(() => store.state.giftEffectsVisible)
const currentUserId = computed(() => store.getters.userId)

const setRead = useThrottleFn((index) => {
  const lastMsg = msgList.value[index]

  if (!lastMsg || mySelf(lastMsg) || !props.vid || !lastMsg.msg_id) return

  try {
    HomedApi.readMessage({ vid: props.vid, lastMsgId: lastMsg.msg_id })
  } catch (error) {
    console.error(error)
  }
}, 200)

useIntervalFn(() => {
  if (
    !newMsgList.length ||
    document.visibilityState === 'hidden' ||
    (msgList.value.length >= MAX_MSG_LIST_LENGTH && !useScrollReturn.arrivedState.bottom)
  )
    return

  let list = msgList.value.concat(newMsgList.splice(0, 7))
  if (list.length > MAX_MSG_LIST_LENGTH) {
    list = list.slice(list.length - MAX_MSG_LIST_LENGTH)
  }
  msgList.value = list

  useScrollReturn.arrivedState.bottom && scrollToLastMsg()
}, 70)

const handleApplyBtn = ({ expires_at, is_enabled }) => {
  uploadVideoAuth.value = !is_enabled
}

onMounted(async () => {
  mittBus.on('imOnMessage', handleIMMessage)
  mittBus.on('isShowApplyBtn', handleApplyBtn)
  handleVidChange(props.vid) // 不能删除，是广场和私聊获取历史数据的
  if (giftContainer.value instanceof HTMLCanvasElement) {
    parser = new Parser({ isDisableImageBitmapShim: true })
    player = new Player({
      container: giftContainer.value,
      isUseIntersectionObserver: true,
      isOpenNoExecutionDelay: true
    })
    playerDB = new DB()
  }
  // NX-1892 监听操作面板高度，用于卡片浮层定位
  const panelEl = operationPanelRef.value?.$el as HTMLElement | undefined
  if (panelEl) {
    opPanelH.value = panelEl.offsetHeight || 88
    opPanelRO = new ResizeObserver(() => {
      const h = panelEl.offsetHeight
      if (h > 0) opPanelH.value = h
    })
    opPanelRO.observe(panelEl)
  }
})

onBeforeUnmount(() => {
  leaveRoom(props.chatType, props.vid)
  mittBus.off('imOnMessage', handleIMMessage)
  opPanelRO?.disconnect()
  opPanelRO = null
})

watch(
  () => useScrollReturn.arrivedState.top,
  (val) => val && getChatHistory()
)

watch(
  () => useScrollReturn.isScrolling.value,
  (val) => val && (copyBtnVisible.value = false)
)

watch(() => props.vid, handleVidChange)

watchDebounced(
  () => newMsgCount.value > 0 && !useScrollReturn.arrivedState.bottom,
  (value) => (newMsgTipsVisible.value = value),
  { debounce: 200 }
)

watchDebounced(
  () => !newMsgTipsVisible.value && !useScrollReturn.arrivedState.bottom,
  (value) => (scrollToBottomBtnVisible.value = value),
  { debounce: 400 }
)

const _giftQueue = []

const setColorFun = (item: any) => {
  // 广场才设置这个颜色
  if (props.chatType === CHAT_TYPE.PUBLIC) {
    if (item.designation) {
      return chat_msg_color.value?.admin
    }
    return chat_msg_color.value ? chat_msg_color.value['level' + item.sender_exp] : ''
  }
}

const sendApply = () => {
  mittBus.emit('sendApply', '您好，我需要上传视频，请替我开通')
}

function _playNextGift() {
  player.clear()
  giftIsPlaying = false

  const next = _giftQueue.shift()
  if (next) {
    initMachineSVGA(next)
  } else {
    giftBoxVisible.value = false
  }
}

async function initMachineSVGA(item) {
  try {
    if (giftIsPlaying) {
      _giftQueue.push(item)
      return
    }

    giftIsPlaying = true
    let svga = await playerDB.find(item.swf)
    if (!svga) {
      svga = await parser.load(item.swf)
      await playerDB.insert(item.swf, svga)
    }
    await player.mount(svga)

    giftBoxVisible.value = true

    nextTick(() => {
      player.start()

      setTimeout(_playNextGift, item.swftime * 1000)
    })
  } catch {
    _playNextGift()
  }
}

async function handleVidChange(vid: string, oldVid?: string) {
  // 此判断为了防止主播私聊首次进入时，因 anchorId 由空字符串转为有值，导致请求两次的问题
  if (props.chatType === CHAT_TYPE.ANCHOR_PRIVATE && oldVid === '') return

  newMsgList = []
  pageParams.hasMore = true
  newMsgCount.value = 0
  msgList.value = []
  pinData.value = null
  giftBoxVisible.value = false
  copyBtnVisible.value = false
  isMute.value = false
  isLoading.value = false
  newMsgTipsVisible.value = false
  scrollToBottomBtnVisible.value = false

  inRoom()
  getChatHistory(false)
  await IM.isReady()
  if (NEED_SUB_CHATS.includes(props.chatType)) {
    IM.subscribe(vid)
  }
}

function handleMessageListClick(event: MouseEvent) {
  const textMsgEl = (event.target as HTMLElement).closest<HTMLElement>('.msg_text_pre')
  if (textMsgEl) {
    if (!textMsgEl.dataset.text) {
      textMsgEl.dataset.text = textMsgEl.innerText?.trim() || ''
    }
    selectedMsgRef.value = textMsgEl
    copyBtnVisible.value = true
  }
}

// 复制
function handleCopyBtnClick() {
  const copiedText = selectedMsgRef.value?.dataset.text || selectedMsgRef.value?.indexText || ''
  if (!copiedText) return
  copy(copiedText)
  ElMessage.success('复制成功')
  copyBtnVisible.value = false
}

// 删除  === 只针对广场的消息
const handleDelete = () => {
  copyBtnVisible.value = false
  const { user_id, sender, msg_id, seed, vid, text, displayText, originalText } =
    getCurrentItems.value

  definChatDeleted({
    uid: user_id || sender,
    room_id: props.roomId,
    msg_id: msg_id,
    seed: seed,
    vid: vid,
    reason: text || originalText || displayText,
    room_manager_nickname: store.state.user.infoData.user_nickname,
    manager_type: isHightHouse.value ? '2' : '1'
  })
    .then((res) => {
      const { code, msg } = res
      if (code === 0) {
        ElMessage.success(msg)
      }
    })
    .catch((error) => {
      ElMessage.warning(error.msg)
    })
}
// 得到当前被点击的一行数据
const handleGetItems = (item) => {
  getCurrentItems.value = { ...item }
}

function backChatList(needRefreshChatList: boolean = true) {
  leaveRoom(props.chatType, props.vid)
  emit('out-room', needRefreshChatList)
}

function leaveRoom(type: CHAT_TYPE, vid: string) {
  if (type === CHAT_TYPE.GROUP && vid) IM.unsubscribe(vid)
}

async function getChatHistory(isPatch?: boolean) {
  if (
    !pageParams.hasMore ||
    isLoading.value ||
    (props.chatType !== CHAT_TYPE.ANCHOR_PRIVATE && !props.vid) ||
    msgList.value.length >= MAX_MSG_LIST_LENGTH
  ) {
    return
  }

  try {
    isLoading.value = true
    const params: { [key: string]: any } = {
      last_id: isPatch ? 0 : msgList.value[0]?.msg_id || 0,
      limit: pageParams.limit
    }
    let type = 'unshift'
    let res

    if (props.chatType === CHAT_TYPE.ANCHOR_PRIVATE) {
      params.anchorId = props.uid
      res = await HomedApi.getChatAnchorHistory(params)

      // 首次请求主播私聊历史记录，将其最新一条消息的 vid 作为主播私聊的 vid
      if (params.last_id === 0) {
        const vid = res.data?.[0]?.vid
        vid && emit('change-vid', vid)
      }
    } else {
      params.room_type = props.chatType
      params.vid = props.vid
      res = await HomedApi.getChatHistory(params)
    }

    const data = (res.data || []).reverse()

    if (params.last_id === 0) {
      if (isPatch) type = 'patch'
      else type = 'init'
    }

    pageParams.hasMore = data.length >= pageParams.limit / 2
    mergeDataList(
      type,
      data.map((item) => formatMsg2(formatMsg(item)))
    )

    setTimeout(() => (isLoading.value = false), 500)
  } catch (error) {
    ElMessage.error(error.msg)
    isLoading.value = false
  }
}

async function handleIMMessage(source) {
  const data = cloneDeep(source)

  try {
    switch (data.action) {
      case 'reconnected': {
        getChatHistory(true)
        await IM.isReady()
        IM.vids.forEach((vid: string) => {
          IM.worker.postMessage({ action: 'subscribe', data: { vid } })
        })
        break
      }
      case 'clearHistory': {
        if (data.vid !== props.vid) return

        pageParams.hasMore = false
        mergeDataList('empty')
        clearDot(data.vid)
        break
      }
      case 'delmsg': {
        mergeDataList('filter', [{ ...data, seed: data.msg_seed }], 'seed')
        clearDot(data.vid, data.msg_seed)
        break
      }
      case 'ban': {
        const sender = data.userid
        mergeDataList('filter', [{ ...data, sender }], 'sender')
        clearDot(data.vid, null, sender)
        break
      }
      case 'pin': {
        if (data.vid !== props.vid) return

        if (data.pin === 1) {
          pinData.value = processPinData({
            pinObj: { ...JSON.parse(data.data), msg_id: data.msg_id },
            pinType: 0
          })
        } else {
          pinData.value = null
        }
        break
      }
      case 'gift': {
        if (data.vid !== props.vid || props.chatType !== CHAT_TYPE.PUBLIC) return

        const gift = gifts.value.find((item) => item.id == data.gift_id)
        const giftName = gift?.giftname || '礼物'

        data.text = `赠送主播一个${giftName}❤️`
        mergeDataList('push', [formatMsg2(formatMsg(data))])

        if (giftEffectsVisible.value) {
          if (import.meta.env.VITE_ENV === 'development') {
            testGifts.forEach((item) =>
              initMachineSVGA({
                swf: `/static/images/live/gifts/${item}.svga`,
                swftime: 5
              })
            )
          } else {
            gift && initMachineSVGA(gift)
          }
        }
        break
      }
      case 'messageList': {
        const msgs = []

        data.messageList.forEach((item) => {
          if (!item.vid) return
          if (item.sender_nickname === '提示') return ElMessage.warning(item.text)

          if (item.vid === props.vid) {
            msgs.push(formatMsg2(item))
          } else {
            newMsgTips({ ...item })
          }
        })

        mergeDataList('push', msgs)
        break
      }
      case 'sendMsg': {
        data.vid === props.vid && processSendMsg(data)
        break
      }
      case 'sendMsgVideo': {
        data.vid === props.vid && processSendMsg(data)
        break
      }
      case 'backToChatList': {
        backChatList(false)
        break
      }
      case 'scrollToBottom': {
        scrollToLastMsg()
        break
      }
      case 'kickuser': {
        if (data.vid === props.vid && parseInt(data.userid) === currentUserId.value) backChatList()
        break
      }
    }
  } catch (error) {
    //
  }
}

const filterMsgList = () => {
  const lastMsg = msgList.value[msgList.value.length - 1]

  if (lastMsg.msgStatus === MESSAGE_STATUS.SUCCESS) {
    for (let index = 0; index < msgList.value.length; index++) {
      const element = msgList.value[index]
      if (element.msgStatus === MESSAGE_STATUS.FAIL) {
        msgList.value.splice(index, 1)
        index--
      }
    }
  }
}

function processSendMsg(data) {
  const _data = formatMsg2(data)
  const msg = msgList.value.find((item) => item.seed === _data.seed)

  if (data.mergePic) {
    msgList.value.find((x) => {
      if (x.pic === 'isEmpty' && x.seed === data.seed) {
        x.pic = data.pic
        x.video = data.video
        return true
      }
    })
  }

  if (msg) {
    if (_data.msgStatus !== undefined) msg.msgStatus = _data.msgStatus
    if (data.imageUploadProgress !== undefined) {
      msg.imageUploadProgress = data.imageUploadProgress
    }
    if (_data.msgStatus === MESSAGE_STATUS.SUCCESS || _data.msgStatus === MESSAGE_STATUS.FAIL) {
      delete msg.imageUploadProgress
    }
  } else if (_data.action === 'sendMsg') {
    msgList.value.push({ ..._data })
  } else if (_data.action === 'sendMsgVideo') {
    msgList.value.find((x, i) => {
      if (x.seed === _data.seed) {
        msgList.value.splice(i, 1, { ..._data })
        return true
      }
    })
  }

  filterMsgList()
  scrollToLastMsg()
}

watch(msgList, () => {
  store.commit('setHistoryMessageList', msgList.value)
})

function processItemClass(item) {
  return `chat_message_item_type_${item.contentType} ${
    item.chatType === CHAT_TYPE.PUBLIC ? 'public_chat' : 'private_chat'
  } ${item.isMyself ? 'myself' : ''}`
}

function formatMsg2(item) {
  const _item = {
    ...item,
    isMyself: mySelf(item),
    isAnchor: item.sender === props.uid,
    chatType: props.chatType
  }

  _item.className = processItemClass(_item)

  if (_item.contentType !== MESSAGE_TYPE.AD && props.chatType === CHAT_TYPE.PUBLIC) {
    _item.displayText = addFirstWrap(_item.displayText)
  }

  return _item
}

function isUsableUrl(value: unknown) {
  return typeof value === 'string' && Boolean(value)
}

/** 本地待上传图片收到服务端同 seed 回包时，用服务端地址替换本地 blob URL */
function backfillLocalImage(existed: { [key: string]: any }, incoming: { [key: string]: any }) {
  if (existed.contentType !== MESSAGE_TYPE.IMG) return
  if (!(existed.pic instanceof File)) return
  if (!isUsableUrl(incoming.pic_bnc) && !isUsableUrl(incoming.pic)) return
  // 已标记失败的消息保留本地 File，否则重发会把服务端 URL 当图片文件再发一次
  if (existed.msgStatus === MESSAGE_STATUS.FAIL) return

  // pic 必须脱离 File：幂等闸门与 messageItem 的预览禁用都以 pic instanceof File 为判据
  existed.pic = isUsableUrl(incoming.pic) ? incoming.pic : ''
  existed.pic_bnc = isUsableUrl(incoming.pic_bnc) ? incoming.pic_bnc : ''
  existed.displayImg = existed.pic

  // 旧 blob 不回收：pic_bnc 要经 fetch + 解密才能显示，且可能失败，需留作退路
}

function mergeDataList(status: string, data?: Array<{ [key: string]: any }>, key: string = 'seed') {
  if (data && !data.length) return

  switch (status) {
    case 'init': {
      msgList.value = uniqBy(data, key)
      scrollToLastMsg()
      break
    }
    case 'push': {
      const _data = data
        .filter((item) => !newMsgList.some((msg) => item[key] === msg[key]))
        .filter((item) => {
          const existed = msgList.value.find((msg) => item[key] === msg[key])
          if (!existed) return true

          backfillLocalImage(existed, item)
          return false
        })

      if (_data.length) {
        newMsgList = newMsgList.concat(_data)

        const maxLen = document.visibilityState === 'hidden' ? 50 : MAX_MSG_LIST_LENGTH

        if (newMsgList.length > maxLen) {
          newMsgList = newMsgList.slice(newMsgList.length - maxLen)
        }

        if (!useScrollReturn.arrivedState.bottom) {
          newMsgCount.value += _data.reduce((res, item) => {
            if (!mySelf(item)) res += 1
            return res
          }, 0)
        }
      }
      break
    }
    case 'patch': {
      const _data = data
        .filter((item) => !newMsgList.some((msg) => item[key] === msg[key]))
        .filter((item) => !msgList.value.some((msg) => item[key] === msg[key]))

      msgList.value = unionEndBy(msgList.value, _data, key, MAX_MSG_LIST_LENGTH)

      if (useScrollReturn.arrivedState.bottom) scrollToLastMsg()
      else newMsgCount.value += _data.length
      break
    }
    case 'filter': {
      msgList.value = msgList.value.filter((item) => !data.some((msg) => item[key] === msg[key]))
      newMsgList = newMsgList.filter((item) => !data.some((msg) => item[key] === msg[key]))
      break
    }
    case 'unshift': {
      const oldLen = msgList.value.length
      msgList.value = unionStartBy(msgList.value, data, key, MAX_MSG_LIST_LENGTH)
      const newLen = msgList.value.length
      scrollToItem(newLen - oldLen + 1)
      break
    }
    case 'empty': {
      msgList.value = []
      newMsgList = []
      newMsgCount.value = 0
      break
    }
  }
}

function scrollToItem(index: number) {
  nextTick(() => {
    const item = chatScrollerRef.value.children[index] as HTMLElement
    if (item) chatScrollerRef.value.scrollTop = item.offsetTop
  })
}

const rIC = (cb) => window.setTimeout(cb, 0)

function $scrollToLastMsg() {
  chatScrollerRef.value.scrollTop += 10000
  if (!useScrollReturn.arrivedState.bottom) rIC($scrollToLastMsg)
}

function scrollToLastMsg() {
  newMsgTipsVisible.value = false
  scrollToBottomBtnVisible.value = false
  newMsgCount.value = 0
  if (NEED_SET_READ_CHATS.includes(props.chatType)) setRead(msgList.value.length - 1)
  nextTick($scrollToLastMsg)
}

async function inRoom() {
  if (!props.vid) return

  try {
    if (NEED_SUB_CHATS.includes(props.chatType)) {
      const { data } = await HomedApi.getPinInfo({
        vid: props.vid,
        room_type: props.chatType
      })

      pinData.value = processPinData(data)
      isMute.value = data.room_mute === 1
    }

    const chats = { ...store.state.hasNewMsgChatsMap }
    Reflect.deleteProperty(chats, props.vid)
    store.commit('setHasNewMsgChatsMap', chats)
  } catch (error) {
    //
  }
}

function handleResend(data) {
  // 重发必须使用新的 seed，避免列表 key 冲突/去重误判
  const next = { ...data, seed: genSeedId() }

  msgList.value = msgList.value.filter((item) => item.seed !== data.seed)
  operationPanelRef.value.sendData(next)
}
</script>
<style scoped lang="scss">
.chat_detail_comp {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.chat_detail_header {
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color-extra-light);
  justify-content: space-between;
  padding: 0 12px;
  flex-shrink: 0;
  .chat_detail_header_back_btn {
    padding: 4px;
    height: 24px;
    flex-shrink: 0;
    width: 28px;
    cursor: pointer;
    > svg {
      width: 16px;
      height: 16px;
    }
  }
  .chat_detail_header_title {
    font-weight: 500;
    font-size: 15px;
    line-height: 24px;
    color: var(--el-text-color-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    text-align: center;
  }
  .chat_detail_header_online_status {
    flex-shrink: 0;
    width: 28px;
    .chat_detail_header_online_status_inner {
      font-size: 20px;
      zoom: 0.5;
      line-height: 1.2;
      display: flex;
      align-items: center;
      &::before {
        content: '';
        display: block;
        width: 8px;
        height: 8px;
        margin-right: 4px;
        border-radius: 50%;
      }

      &.online {
        color: var(--el-color-success);
        &::before {
          background-color: var(--el-color-success);
        }
      }
    }
  }
}
.scroller_container {
  padding: 4px 12px 0 12px;
  width: 100%;
  height: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .message_item_box {
    padding-bottom: 4px;
    min-height: 32px;
    will-change: transform;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
  }
}
.ai_preset_overlay {
  position: absolute;
  z-index: 998;
  pointer-events: auto;
}
.has_new_message {
  position: absolute;
  right: 8px;
  z-index: 1000;
  font-size: 13px;
  line-height: 22px;
  cursor: pointer;
  padding: 5px 20px;
  border-radius: 36px;
  color: var(--el-color-primary);
  background-color: var(--el-primary-background-color-9);
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    right: -3px;
    border: 1px solid var(--el-color-white);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--el-color-primary);
  }
}
.scroll_to_bottom_btn {
  width: 32px;
  height: 32px;
  position: absolute;
  border-radius: 50%;
  background-color: #0009;
  cursor: pointer;
  right: 8px;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  > svg {
    color: #fff;
    width: 20px;
    height: 20px;
  }
}
.applyAuth {
  font-size: 14px;
  color: #d02d54;
  line-height: 2.75;
  background-color: #ffe8ed;
  text-align: center;
  cursor: pointer;
}
.gift_container {
  position: absolute;
  pointer-events: none;
  bottom: 88px;
  left: 0;
  width: 100%;
  z-index: 100;
  height: calc(100% - 88px);
  .df_container {
    width: 100%;
  }
  .gift_player_box {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
    height: 100%;
    width: 100%;
    opacity: 0.91;
    > canvas {
      display: block;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      width: 100%;
      height: auto;
      transform: translateY(28px);
    }
  }
}
.loading_box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 24px;
  font-size: 12px;
  line-height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color-overlay);
  z-index: 2;
  color: var(--el-text-color-placeholder);
  opacity: 0.92;
  > svg {
    display: block;
    width: 1em;
    height: 1em;
    margin-right: 2px;
  }
}
</style>
