<template>
  <div class="chat_comp">
    <template v-if="props.chatBoxMode === CHAT_BOX_MODE.MAIN">
      <ChatList
        ref="chatListRef"
        :chat-box-mode="props.chatBoxMode"
        v-show="currentRoom === null"
        @in-room="(roomInfo) => (currentRoom = roomInfo)"
        @user-online-change="handleUserOnlineChange"
      />
      <ChatDetail
        :chat-box-mode="props.chatBoxMode"
        v-show="currentRoom !== null"
        :vid="currentRoom?.vid"
        :uid="props.uid"
        :is-forum="isForum"
        :assign-id="currentRoom?.user_id"
        :chat-type="currentRoom?.room_type"
        :room-info="currentRoom"
        :show-header="true"
        @out-room="handleOutRoom"
      />
      <!-- 满级动画 -->
      <FullLevelEnter
        v-if="currentRoom !== null"
        expenText="群组"
        :vid="currentRoom?.vid"
      ></FullLevelEnter>
    </template>
    <!-- manager_type 1普通房管  2高级房管 -->
    <el-tabs
      v-else
      type="card"
      :stretch="true"
      class="chat_tabs"
      v-model="tabIndex"
      @tab-change="currentRoom = null"
    >
      <el-tab-pane class="gc-lottie">
        <template #label>
          <div class="chat_tabs_item_label">广场</div>
        </template>
        <ChatDetail
          :chat-box-mode="props.chatBoxMode"
          v-if="tabIndex === '0'"
          :vid="props.vid"
          :uid="props.uid"
          :roomId="roomDetail.id"
          :is-forum="isForum"
          :tab-index="tabIndex"
          :chat-type="CHAT_TYPE.PUBLIC"
        />
        <!-- 满级动画 -->
        <FullLevelEnter expenText="直播间" :vid="props.vid"></FullLevelEnter>
        <!-- 烟花筒动画 -->
        <div class="lottie-animations"><LottieAnimations /></div>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <div class="chat_tabs_item_label">
            <div v-if="hasNewMsgChatsMap[anchorVid] || hasUnreadMsg" class="show_dot"></div>
            主播私聊
          </div>
        </template>
        <ChatDetail
          :chat-box-mode="props.chatBoxMode"
          v-if="tabIndex === '1'"
          :vid="anchorVid"
          :uid="props.uid"
          :is-forum="isForum"
          :tab-index="tabIndex"
          :chat-type="CHAT_TYPE.ANCHOR_PRIVATE"
          @change-vid="(vid: string) => (anchorVid = vid)"
        />
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <div class="chat_tabs_item_label">
            <div v-if="chatListDotVisible" class="show_dot"></div>
            群组
          </div>
        </template>
        <template v-if="tabIndex === '2'">
          <ChatList
            ref="chatListRef"
            :chat-box-mode="props.chatBoxMode"
            v-show="currentRoom === null"
            :room-info="currentRoom"
            :uid="props.uid"
            @in-room="handleInRoom"
            @user-online-change="handleUserOnlineChange"
          />
          <ChatDetail
            :chat-box-mode="props.chatBoxMode"
            v-show="currentRoom !== null"
            :vid="currentRoom?.vid"
            :uid="props.uid"
            :is-forum="isForum"
            :assign-id="currentRoom?.user_id"
            :chat-type="currentRoom?.room_type"
            :room-info="currentRoom"
            :show-header="true"
            :tab-index="tabIndex"
            :is-live-activity-help="isLiveActivityHelpSession"
            @out-room="handleOutRoom"
          />
          <!-- 满级动画 -->
          <FullLevelEnter
            v-if="currentRoom !== null"
            expenText="群组"
            :vid="currentRoom?.vid"
          ></FullLevelEnter>
        </template>
      </el-tab-pane>
      <!-- 登陆并是房管 -->
      <template v-if="!!userInfo.id && !isHouse">
        <!-- 用户 当前直播间有权限-->
        <el-tab-pane class="gc-lottie" v-if="isAnchorHouse">
          <template #label>
            <div class="chat_tabs_item_label">用户</div>
          </template>
          <TabsUser
            v-if="tabIndex === '3'"
            :vid="vid"
            :userNickname="roomDetail.userNickname"
            :roomId="roomDetail.id"
          />
        </el-tab-pane>
        <!-- 消息 当前直播间有权限并且要有删除的权限才显示 -->
        <el-tab-pane class="gc-lottie" v-if="isAnchorHouse && isDetelePermiss">
          <template #label>
            <div class="chat_tabs_item_label">消息</div>
          </template>
          <TabsMessage v-if="tabIndex === '4'" :roomId="roomDetail.id" />
        </el-tab-pane>
        <!-- 工作台 是高级房管-->
        <el-tab-pane class="gc-lottie" v-if="isHightHouse">
          <template #label>
            <div class="chat_tabs_item_label">工作台</div>
          </template>
          <TabsWorkBench v-if="tabIndex === '5'" />
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { useAnchorPermission, usePermission } from '@/utils/usePermision'
import LottieAnimations from '@/components/chatBox/components/roomNotice/lottie-animations.vue'
import FullLevelEnter from '@/components/chatBox/components/fullLevelEnter/index.vue'
import ChatList from '@/components/chatBox/components/chatList/index.vue'
import ChatDetail from '@/components/chatBox/components/chatDetail/index.vue'
import TabsUser from './components/tabsUser/index.vue'
import TabsWorkBench from './components/tabsWorkBench/index.vue'
import TabsMessage from './components/tabsMessage/index.vue'
import { CHAT_TYPE, CHAT_BOX_MODE } from '@/enums'
import homeApi from '@/api/home.js'
import { getList } from '@/api/user.js'
import { IM } from '@/utils/im'
import { useStore } from 'vuex'
import HomedApi from '@/api/home'
import mittBus from '@/utils/mittBus'
import { nextTick } from 'vue'
import {
  clearLiveActivityHelpSession,
  isLiveActivityHelpSession,
  markLiveActivityHelpSession
} from '@/components/chatBox/liveActivityHelp'

const props = defineProps({
  chatBoxMode: {
    type: Number,
    default: CHAT_BOX_MODE.LIVE
  },
  roomDetail: {
    type: Object,
    default: () => {
      return {}
    }
  },
  vid: {
    type: String,
    default: ''
  },
  // 主播id
  uid: {
    type: Number,
    default: 0
  },
  // 0足球 1篮球 3电竞 4区块链
  matchType: {
    type: Number,
    default: 0
  },
  matchId: {
    type: String,
    default: ''
  },
  defaultChat: {
    type: Object,
    default: () => ({})
  },
  active: {
    type: Boolean,
    default: true
  },
  user_id: {
    type: String,
    default: ''
  },
  isForum: {
    type: Boolean,
    default: false
  }
})

let tipsAudio = null
const store = useStore()
/**当前直播间是否有房管权限 */
const { isAnchorHouse } = useAnchorPermission(props)
/**
 * 是否是房管(no)
 * 是高级房管
 *  是否有删除权限
 */
const { isHouse, isHightHouse, isDetelePermiss } = usePermission()

const anchorVid = ref('')
const tabIndex = ref('0')
const currentRoom = ref(null)
const emoticons = ref(null)
const gifts = ref([])
const chatListRef = ref(null)

const userInfo = computed<UserInfo>(() => store.state.user.infoData)
const hasNewMsgChatsMap = computed(() => store.state.hasNewMsgChatsMap)
const chatListDotVisible = computed(() =>
  // @ts-ignore
  Object.values(hasNewMsgChatsMap.value).some((item) => item.count)
)
const currentUserId = computed(() => store.getters.userId)
const isCloseChatModule = computed(() => {
  return store.state.system.chat_msg_close === 1
})

const hasUnreadMsg = ref(false)

const getUnreadMsgChatsStatus = async () => {
  try {
    const params = {
      anchorId: props.uid,
      limit: 30,
      last_id: 0
    }
    const { data } = await HomedApi.getChatAnchorHistory(params)
    //如果data的 readed_count == 0就是未读
    const maxItem =
      data &&
      data.length &&
      data.reduce((max, item) => (item.msg_id > max.msg_id ? item : max), data[0])
    hasUnreadMsg.value = maxItem.readed_count == 0 && maxItem.welcome === 1
    if (hasUnreadMsg.value) {
      nextTick(() => {
        ringPlay()
      })
    }
  } catch (error) {
    console.log(error)
  }
}

watch(tabIndex, () => {
  if (tabIndex.value == '1') {
    // 点击了主播私聊
    hasUnreadMsg.value = false

    store.commit('setShowEmailTip')
  }
})

onMounted(async () => {
  // 如果当前是游客 主播私未读消息
  await getUnreadMsgChatsStatus()

  initEmoticons()
  mittBus.on('clickhelp', emitClickHelp)
  mittBus.on('mycenter', mycenterHelp)

  tipsAudio = document.querySelector<HTMLAudioElement | null>('#newMsgNotificationAudio')

  if (props.chatBoxMode === CHAT_BOX_MODE.LIVE) {
    if (props.defaultChat?.type === CHAT_TYPE.ANCHOR_PRIVATE) tabIndex.value = '1'
    initGifts()
  }
})

onBeforeUnmount(() => {
  mittBus.off('clickhelp', emitClickHelp)
  mittBus.off('mycenter', mycenterHelp)
  currentRoom.value = null
  IM.unsubscribe()
})

watch(
  () => props.defaultChat,
  () => {
    if (props.defaultChat?.type === CHAT_TYPE.ANCHOR_PRIVATE) tabIndex.value = '1'
  }
)

watch(
  () => props.active,
  (val) => val && mittBus.emit('imOnMessage', { action: 'scrollToBottom' })
)

function emitClickHelp(val) {
  tabIndex.value = '2'
  currentRoom.value = { ...val.data }
  markLiveActivityHelpSession()
}
function mycenterHelp(val) {
  if (val) {
    currentRoom.value = { ...val.data }
  }
}

function handleInRoom(roomInfo) {
  clearLiveActivityHelpSession()
  currentRoom.value = roomInfo
}

function handleOutRoom(needRefreshChatList: boolean = true) {
  clearLiveActivityHelpSession()
  currentRoom.value = null
  if (needRefreshChatList) chatListRef.value?.getChatList()
}

function handleUserOnlineChange(uid: number, online: number) {
  if (currentRoom.value?.uid == uid) {
    currentRoom.value.is_online = online
  }
}

async function initGifts() {
  try {
    const { data = [] } = await getList()
    gifts.value = data
  } catch (error) {
    console.log(error)
  }
}

async function initEmoticons() {
  try {
    if (!userInfo.value.id) {
      emoticons.value = {}
    } else {
      const { data = {} } = await homeApi.getEmoticonsList()
      emoticons.value = data
    }
  } catch (error) {
    console.log(error)
  }
}

function mySelf(item) {
  const { sender, sender_nickname = '' } = item
  const user_nickname = userInfo.value.user_nickname || ''
  return (
    sender === currentUserId.value ||
    sender_nickname === user_nickname ||
    sender === store.state.visitorInfo?.id
    // sender_nickname.includes('游客')
  )
}

function clearDot(vid: string, seed?: string, sender?: number) {
  const chats = store.state.hasNewMsgChatsMap
  const chat = chats[vid]

  if (chat && ((!seed && !sender) || seed === chat.seed || sender === chat.sender)) {
    const _chats = { ...chats }

    Reflect.deleteProperty(_chats, vid)
    store.commit('setHasNewMsgChatsMap', _chats)
  }
}

function newMsgTips(data: any) {
  if (data.type === CHAT_TYPE.PUBLIC || mySelf(data)) return

  const chats = store.state.hasNewMsgChatsMap

  if (chats[data.vid]?.seed === data.seed) return

  store.commit('setHasNewMsgChatsMap', {
    ...chats,
    [data.vid]: {
      count: 1,
      seed: data.seed,
      sender: data.sender
    }
  })

  if (
    (data.type === CHAT_TYPE.PRIVATE || data.type === CHAT_TYPE.ANCHOR_PRIVATE) &&
    tipsAudio &&
    store.state.isNewMsgTip &&
    document.visibilityState === 'visible' &&
    !isCloseChatModule.value
  ) {
    tipsAudio.currentTime = 0
    tipsAudio.muted = false
    tipsAudio.play()
  }
}

const ringPlay = () => {
  if (
    tipsAudio &&
    store.state.isNewMsgTip &&
    document.visibilityState === 'visible' &&
    !isCloseChatModule.value
  ) {
    tipsAudio.currentTime = 0
    tipsAudio.muted = false
    tipsAudio.play()
  }
}

provide('gifts', gifts)
provide('emoticons', emoticons)

provide('mySelf', mySelf)
provide('newMsgTips', newMsgTips)
provide('clearDot', clearDot)
</script>
<style lang="scss" scoped>
.chat_comp {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  overflow: hidden;
  .chat_tabs {
    flex: 1;
    display: flex;
    position: relative;
    flex-direction: column;
    overflow: hidden;
    .chat_tabs_item_label {
      line-height: 24px;
      position: relative;
      .show_dot {
        top: 5px;
        right: -15px;
      }
    }
    :deep(.el-tabs__header) {
      margin-bottom: 0;
      border-bottom-color: var(--el-border-color-extra-light);
      overflow: hidden;
      .el-tabs__nav {
        border: none;
      }
      .el-tabs__item {
        border: none;
        font-weight: 500;
        font-size: 14px;
        &.is-active {
          background-color: var(--el-bg-color-overlay) !important;
          color: var(--el-color-primary) !important;
        }
        &::after {
          content: '';
          display: block;
          position: absolute;
          right: -0.5px;
          width: 0;
          z-index: 2;
          top: 50%;
          transform: translateY(-50%);
          height: 16px;
          border-right: 1px solid var(--el-border-color);
        }
        &:last-child {
          &::after {
            display: none;
          }
        }
      }
    }
    :deep(.el-tabs__content) {
      flex: 1;
    }
    :deep(.el-tab-pane) {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }
  }

  .gc-lottie {
    position: relative;
    .lottie-animations {
      position: absolute;
      bottom: 120px;
      right: -20px;
      z-index: 10;
    }
  }
}
</style>
