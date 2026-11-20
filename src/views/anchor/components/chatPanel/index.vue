<template>
  <div class="chat_panel_comp">
    <el-tabs class="chat_panel_tabs" v-model="activeName" type="card" @tab-change="handleChange">
      <!-- 聊天 -->
      <el-tab-pane label="聊天" name="chat" v-if="!isCloseChatModule">
        <ChatBox
          :active="activeName === 'chat'"
          :chat-box-mode="CHAT_BOX_MODE.LIVE"
          :vid="props.vid"
          :uid="UID"
          :roomDetail="roomDetail"
          :default-chat="defaultChat"
        />
      </el-tab-pane>

      <!-- 活动 -->
      <el-tab-pane label="活动" name="activities">
        <Activities
          @receiveSuccess="emits('receiveSuccess')"
          :live_room="roomDetail.id"
        ></Activities>
      </el-tab-pane>

      <!-- 事件直播 去掉，在赛况里面有-->
      <!-- <el-tab-pane label="事件直播" name="liveEvent" v-if="[0, 1].includes(roomDetail.type)"> -->
      <!-- 足球 -->
      <!-- <FootballEventsLive v-if="roomDetail.type === 0" /> -->
      <!-- 篮球 -->
      <!-- <BasketballEventsLive v-if="roomDetail.type === 1" /> -->
      <!-- </el-tab-pane> -->

      <!-- 数据分析 roomDetail。type = 3 代表电竞  / 0-足球 / 1-篮球  / 2-其他  / 3-电竞 4-区块链 -->
      <el-tab-pane label="数据分析" name="forwardAnalysis" v-if="roomDetail.type === 3">
        <GamingAnalysis
          :gameId="roomDetail.mars_game_id || roomDetail.game_id"
          :matchId="roomDetail.mars_match_id || roomDetail.match_id"
        ></GamingAnalysis>
      </el-tab-pane>

      <!-- 直播预告 -->
      <el-tab-pane
        label="直播预告"
        name="livePreview"
        v-if="[0, 1, 3].includes(props.roomDetail.type)"
      >
        <LivePreview v-if="activeName === 'livePreview'" :uid="UID" :type="props.roomDetail.type" />
      </el-tab-pane>

      <!-- 赛况阵容 -->
      <el-tab-pane label="赛况阵容" name="matchStatus" v-if="[0, 1].includes(roomDetail.type)">
        <FootballMatch
          :roomDetail="roomDetail"
          v-if="roomDetail.type === 0 && activeName === 'matchStatus'"
        ></FootballMatch>
        <BasketballGame
          :roomDetail="roomDetail"
          v-if="roomDetail.type === 1 && activeName === 'matchStatus'"
        ></BasketballGame>
      </el-tab-pane>
    </el-tabs>

    <!-- 贡献榜 -->
    <el-popover
      popper-class="normal_popover live_ranking_popover"
      popper-style="transform: translate(12px, -68px);"
      :show-arrow="false"
      v-model:visible="rankingPopVisible"
      placement="left-start"
      trigger="click"
    >
      <template #reference>
        <div class="ranking_button">
          <RankingBG class="ranking_button_bg" />
          <div class="ranking_button_text" :class="{ ranking_actived: rankingPopVisible }">
            贡献榜
          </div>
        </div>
      </template>
      <template #default>
        <Ranking
          v-if="rankingPopVisible"
          :uid="UID"
          :vid="props.vid"
          @close="rankingPopVisible = false"
        />
      </template>
    </el-popover>

    <!-- 话痨榜 -->
    <el-popover
      popper-class="normal_popover live_chatter_popover"
      popper-style="transform: translate(12px, -204px);"
      :show-arrow="false"
      v-model:visible="chatterPopVisible"
      placement="left-start"
      trigger="click"
    >
      <template #reference>
        <div class="ranking_button chatter_button">
          <RankingBG class="ranking_button_bg" />
          <div class="ranking_button_text" :class="{ chatter_actived: chatterPopVisible }">
            话痨榜
          </div>
        </div>
      </template>
      <template #default>
        <ChatterBoxList
          v-if="chatterPopVisible"
          :uid="UID"
          :vid="props.vid"
          @close="chatterPopVisible = false"
        />
      </template>
    </el-popover>
    <section
      class="tips-audio-switch"
      :title="audioStatus ? '点击关闭提示音' : '点击打开提示音'"
      :class="{ active: audioStatus, open: openMutePopup }"
      v-if="!isCloseChatModule"
    >
      <div class="icon-box">
        <IconBell class="icon-bell" :is-active="audioStatus" @click.stop="changeAudioStatus" />
      </div>
      <span class="tips-text">{{ audioStatus ? '点击关闭提示音' : '点击打开提示音' }}</span>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import ChatBox from '@/components/chatBox/index.vue'
import mittBus from '@/utils/mittBus'
import { CHAT_TYPE, CHAT_BOX_MODE } from '@/enums'
import Ranking from '@/views/anchor/components/contributionRanking/index.vue'
import ChatterBoxList from '@/views/anchor/components/chatterBoxList/index.vue'
import RankingBG from './images/rankingBG.vue'
// import FootballEventsLive from '@/views/anchor/components/footballEventsLive/index.vue'
// import BasketballEventsLive from '@/views/anchor/components/basketballEventsLive/index.vue'
import FootballMatch from '@/views/anchor/components/footballMatch/index.vue'
import BasketballGame from '@/views/anchor/components/basketballGame/index.vue'
import GamingAnalysis from '@/views/anchor/components/gamingAnalysis/index.vue'
import LivePreview from '@/views/anchor/components/livePreview/index.vue'
import Activities from '@/views/anchor/components/activities/index.vue'
import IconBell from './images/iconBell.vue'
import { computed, onMounted, ref } from 'vue'

defineOptions({
  name: 'ChatPanel',
  inheritAttrs: true
})
const emits = defineEmits(['tabChange', 'receiveSuccess'])

const props = defineProps({
  vid: {
    type: String,
    default: ''
  },
  uid: {
    type: [String, Array<string>],
    default: ''
  },
  roomDetail: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const store = useStore()
const activeName = ref('chat')
const rankingPopVisible = ref(false)
const chatterPopVisible = ref(false)
const defaultChat = ref()
const openMutePopup = ref(false)
const chatPanelTabsRendered = ref(false)

const isCloseChatModule = computed(() => {
  return store.state.system.chat_msg_close === 1
})
const audioStatus = computed(() => store.state.isNewMsgTip)
const UID = computed<number>(() => {
  let uid

  if (props.uid instanceof Array) {
    uid = props.uid[0] || '0'
  } else {
    uid = props.uid ?? '0'
  }

  const n = parseInt(String(uid), 10)
  return Number.isFinite(n) && n >= 0 ? n : 0
})

let chatPanelTabsObserver: MutationObserver
function chatPanelTabsInitHandler() {
  let el = document.querySelector<HTMLDivElement>('.chat_panel_tabs .el-tabs__item')
  if (el) {
    if (!chatPanelTabsRendered.value) {
      el.click()
      chatPanelTabsRendered.value = true
      chatPanelTabsObserver.disconnect()
    }
  }
}

function getMoreParamFun(val: string) {
  activeName.value = val
}

function emitClickHelp(val: { [key: string]: string }) {
  activeName.value = val.type
}

const currentUserId = computed(() => store.getters.userId)

onMounted(() => {
  mittBus.on('ismore', getMoreParamFun)
  mittBus.on('clickhelp', emitClickHelp)
  audioStatus.value = localStorage.getItem(`tips_audio_status::${currentUserId.value}`) !== '0'
  if (isCloseChatModule.value) {
    chatPanelTabsObserver = new MutationObserver(chatPanelTabsInitHandler)
    chatPanelTabsObserver.observe(document.querySelector('.chat_panel_tabs'), {
      childList: true,
      subtree: true
    })
  }
})

onBeforeUnmount(() => {
  mittBus.off('ismore', getMoreParamFun)
  mittBus.off('clickhelp', emitClickHelp)
  chatPanelTabsObserver && chatPanelTabsObserver.disconnect()
})

// const handleChange = (name: string) => {
//   if (name === 'matchStatus' && props.roomDetail.type === 1) {
//     nextTick(() => {
//       basketballMatchStatisticsRef.value.initPlayerData()
//     })
//   }
// }

const handleChange = (name: string) => {
  emits('tabChange', name)
}

function openChat(type: CHAT_TYPE, vid?: string) {
  if (isCloseChatModule.value) return
  activeName.value = 'chat'
  defaultChat.value = { type, vid }
}

function changeAudioStatus() {
  if (openMutePopup.value) return

  store.commit('setIsNewMsgTip', !audioStatus.value)

  openMutePopup.value = true
  setTimeout(() => {
    openMutePopup.value = false
  }, 800)
}

watch(
  () => props.roomDetail.type,
  () => {
    if (activeName.value !== 'chat') {
      if (store.state.system.chat_msg_close == 0) {
        activeName.value = 'chat'
      } else {
        // location.reload()
        console.log(['-------关闭刷新------'])
      }
    }
  }
)

defineExpose({
  openChat
})
</script>

<style lang="scss" scoped>
.chat_panel_comp {
  position: relative;
  width: 100%;
  height: 100%;
  .chat_panel_tabs {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: var(--el-bg-color-overlay);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    :deep(.el-tabs__header) {
      margin-bottom: 0;
      overflow: hidden;
      height: 30px;
      border-bottom-color: var(--el-border-color-extra-light);
      .el-tabs__nav-scroll {
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        &::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
          color: transparent;
        }
      }
      .el-tabs__nav {
        border: none;
      }
      .el-tabs__item {
        border: none;
        line-height: 30px;
        font-weight: 500;
        font-size: 14px;
        height: 30px;
        &.is-active {
          background-color: var(--el-color-primary);
          color: var(--el-text-color-white);
        }
      }
      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        line-height: 30px;
      }
    }
    :deep(.el-tabs__content) {
      flex: 1;
    }
    :deep(.el-tab-pane) {
      height: 100%;
      overflow: hidden;
    }
  }
  .ranking_button {
    position: absolute;
    right: -34px;
    top: 68px;
    width: 34px;
    height: 146px;
    cursor: pointer;
    &.chatter_button {
      top: 204px;
    }
    .ranking_button_bg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      transform: rotate(180deg);
    }
    .ranking_button_text {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 2;
      transform: translate(-50%, -50%);
      color: var(--el-text-color-primary);
      font-size: 16px;
      font-weight: 700;
      writing-mode: vertical-lr;
      letter-spacing: 8px;
      text-indent: 8px;
      white-space: nowrap;
      &.ranking_actived {
        color: #059cf1;
      }
      &.chatter_actived {
        color: #059cf1;
      }
    }
  }
  .tips-audio-switch {
    position: absolute;
    right: -34px;
    top: 368px;
    width: 28px;
    height: 28px;
    padding: 2px;
    border-radius: 38px;
    background-color: #c0c4cc;
    overflow: hidden;
    cursor: pointer;

    .icon-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
      border-radius: 24px;
      overflow: hidden;
      background-color: var(--el-icon-color-regular);
    }
    .tips-text {
      height: 0;
      transition: height 0.2s linear;
      overflow: hidden;
      display: block;
      text-align: center;
      color: var(--el-text-color-regular);
      line-height: 1.1;
      font-size: 14px;
      font-weight: 400;
      margin-top: 4px;
      margin-bottom: 6px;
    }
    &.active {
      background-color: var(--el-primary-background-color-9);
      .icon-box {
        background-color: var(--el-primary-background-color);
      }
      .tips-text {
        color: var(--el-color-primary);
      }
    }
    &.open {
      height: auto;
      .tips-text {
        height: 105px;
      }
    }
  }
}
</style>
