<template>
  <div class="chat_list_comp" :style="rename">
    <div class="chat_list_search_panel">
      <el-input
        class="chat_list_search_input"
        v-model="searchKeywords"
        placeholder="搜索助理昵称"
        :prefix-icon="Search"
        @keydown="keyDown"
      />
      <el-button class="chat_list_search_btn" type="primary" text @click="search">搜索</el-button>
    </div>
    <div v-if="tipsInfo" class="search-result" :class="tipsInfo.type">
      {{ tipsInfo.content }}
    </div>
    <div class="chat_list_content_panel hide_scrollbar 123qz" ref="chatListPanelRef">
      <div
        v-for="chat in chatRoomList"
        :key="chat.vid"
        class="chat_list_item_box"
        @click="handleClickRoom(chat)"
        @contextmenu.prevent="openRightMenu($event, chat)"
      >
        <div
          class="chat_list_item_icon"
          :class="{
            is_text_icon: chat.room_type === CHAT_TYPE.GROUP && !chat.pic
          }"
        >
          <div v-if="hasNewMsgChatsMap[chat.vid]" class="show_dot"></div>
          <template v-if="chat.room_type === CHAT_TYPE.GROUP && !chat.pic">群组</template>
          <template v-else>
            <df-image-lazy
              circle
              fit="cover"
              :src="$common.avatarHandler(chat.pic || chat.avatar)"
            />
          </template>
        </div>
        <div class="chat_list_item_info_panel">
          <div class="chat_list_item_info_box">
            <div class="chat_name" v-if="chat.name">{{ chat.name }}</div>
            <div class="chat_last_msg_time" v-if="chat.last_msg?.creation_time">
              {{ chat.last_msg.creation_time }}
            </div>
          </div>
          <div
            class="chat_list_item_info_box"
            :class="[
              'sticky_btn',
              userInfo.id ? (chat?.is_pin === 1 ? 'already_sticky' : 'not_sticky') : 'not_logged'
            ]"
            @click.stop="handleSticky(chat)"
          >
            <div class="chat_last_msg_content" v-html="formatTextMsg(chat.last_msg.text)"></div>
            <div
              class="user_online_status"
              v-if="chat.room_type === CHAT_TYPE.PRIVATE"
              :class="{ online: chat.is_online === 1 }"
            >
              {{ chat.is_online === 1 ? '在线' : '离线' }}
            </div>
          </div>
        </div>
        <!-- 右键显示内容 -->
        <div
          v-if="currentActivedId === chat.vid"
          class="un-follow"
          :id="chat.vid"
          @click.stop="handleHide(chat)"
        >
          隐藏聊天
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import HomedApi from '@/api/home'
import { CHAT_TYPE, CHAT_BOX_MODE } from '@/enums'
import { getAnchorAssistant, deleteChatRoomHide } from '@/api/search.js'
import { useDebounceFn } from '@vueuse/core'
import { formatTextMsg } from '@/utils/common'
import { useStore } from 'vuex'
import mittBus from '@/utils/mittBus'
import { cloneDeep, orderBy } from 'lodash-es'
import { msgToPrivateChat } from '@/components/chatBox/chatHelper'
import { useRoute } from 'vue-router'

const props = defineProps({
  // 主播id
  uid: {
    type: Number,
    default: 0
  },
  chatBoxMode: {
    type: Number,
    default: CHAT_BOX_MODE.LIVE
  },
  roomInfo: {
    type: Object,
    default: () => null
  }
})

// 环境上读取不到下面样式
const rename = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  height: '100%',
  width: '100%',
  position: 'relative'
}
const emit = defineEmits(['in-room', 'user-online-change'])
const mySelf = inject<(data: any) => boolean>('mySelf')

const store = useStore()
const searchKeywords = ref('')
const chatList = ref<Array<{ [key: string]: any }>>([])
const tipsInfo = ref(null)
const chatListPanelRef = ref<HTMLElement | null>(null)

const chatRoomList = computed(() => orderBy(chatList.value, ['pin_time'], ['desc']))
const hasNewMsgChatsMap = computed(() => store.state.hasNewMsgChatsMap)
const currentUserId = computed(() => store.getters.userId)
const userInfo = computed(() => store.state.user.infoData)
const currentActivedId = ref('')

onMounted(async () => {
  mittBus.on('imOnMessage', handleIMMessage)
  // 仅直播详情页需要在组件初始化时请求接口
  props.chatBoxMode === CHAT_BOX_MODE.LIVE && getChatList()
})

onBeforeUnmount(() => {
  mittBus.off('imOnMessage', handleIMMessage)
})

// 打开右键菜单
const openRightMenu = (event, chat) => {
  event.preventDefault()

  // 1是群组，2是私聊
  if (currentActivedId.value === chat.vid || chat.room_type === 1) {
    currentActivedId.value = ''
    return
  }
  currentActivedId.value = chat.vid
}

const handleHide = (chat) => {
  deleteChatRoomHide({ vid: chat.vid })
    .then((res: any) => {
      if (res.code === 0) {
        chatList.value = chatList.value.filter((ele) => ele.vid !== chat.vid) || chatList.value
        currentActivedId.value = ''
        ElMessage.success(res.msg)
      }
    })
    .catch((error) => {
      ElMessage.success(error.msg)
    })
}

async function handleSticky({ vid, is_pin = 0 }: any) {
  try {
    await HomedApi.chatPin({
      userId: userInfo.value.id,
      vid,
      status: is_pin === 0 ? 1 : 0
    })

    getChatList()
  } catch (error) {
    ElMessage.error(error.msg)
  }
}

const route = useRoute()
function handleClickRoom(chat) {
  // 进入房间清空右键事件的值
  currentActivedId.value = ''
  emit('in-room', chat)
  store.commit('setShowEmailTip', route)
}

function keyDown(event) {
  // 输入时带有回车键就禁用
  if (event.keyCode === 13) {
    event.preventDefault()
    event.stopPropagation()

    // 如果未同时输入shift，直接提交
    !event.shiftKey && search()
  }
}

const search = useDebounceFn(async () => {
  if (!searchKeywords.value.trim()) return ElMessage.error('请输入助理名称')

  try {
    const { data } = await getAnchorAssistant({ nickName: searchKeywords.value })

    if (!data) return showSearchTips('error', '查无此助理丶或添加失败')

    const sender = parseInt(data.sender)

    if (!chatList.value.some((item) => item.user_id === sender)) {
      chatList.value = [msgToPrivateChat(data)].concat(chatList.value)
    }

    searchKeywords.value = ''
    showSearchTips('success', '搜索添加助理成功')
  } catch {
    showSearchTips('error', '查无此助理丶或添加失败')
  }
}, 300)

function showSearchTips(type: string, content: string) {
  tipsInfo.value = { type, content }
  setTimeout(() => (tipsInfo.value = null), 3000)
}

async function getChatList() {
  try {
    const { data = [] } = await HomedApi.getMessageList({
      type: '1,2',
      user_id: currentUserId.value
    })

    data.forEach((item) => {
      item.user_id = parseInt(item.user_id)
      item.last_msg && (item.last_msg.sender = parseInt(item.last_msg.sender))
    })

    chatList.value = data

    nextTick(() => {
      if (chatListPanelRef.value) chatListPanelRef.value.scrollTop = 0
    })
  } catch (error) {
    ElMessage.error(error.msg)
  }
}

async function handleIMMessage(source) {
  const data = cloneDeep(source)

  try {
    switch (data.action) {
      case 'updateChatList': {
        getChatList()
        break
      }
      case 'messageList': {
        data.messageList.forEach(processMsg)
        break
      }
      case 'clearHistory': {
        processLastMsg(data.vid)
        break
      }
      case 'delmsg': {
        processLastMsg(data.vid, data.msg_seed)
        break
      }
      case 'ban': {
        processLastMsg(data.vid, null, data.userid)
        break
      }
      case 'useronline': {
        if (chatList.value.some((item) => item.user_id == data.userid)) {
          const online = parseInt(data.text)

          emit('user-online-change', data.userid, online)

          chatList.value.forEach((item) => {
            if (item.user_id == data.userid) item.is_online = online
          })
        }
        break
      }
      case 'kickuser': {
        if (data.userid === currentUserId.value) {
          chatList.value = chatList.value.filter((item) => item.vid !== data.vid)
        }
        break
      }
    }
  } catch (error) {
    console.log(error)
  }
}

function processLastMsg(vid: string, seed?: string, sender?: number) {
  const chat = chatList.value.find((item) => item.vid === vid)
  if (
    chat?.last_msg &&
    ((!seed && !sender) || seed === chat.last_msg.seed || sender === chat.last_msg.sender)
  ) {
    chat.last_msg.text = ''
  }
}

function processMsg(data) {
  if (!data.type) return

  const chat = chatList.value.find((item) => item.vid === data.vid)
  if (chat) {
    // @ts-ignore
    chatList.value = chatList.value.reduce(
      (res, item) => {
        if (item.vid !== data.vid) res.push({ ...item })
        return res
      },
      [
        {
          ...chat,
          last_msg: {
            ...chat?.last_msg,
            text: data.text || '',
            creation_time: data.time || ''
          }
        }
      ]
    )

    nextTick(() => {
      if (chatListPanelRef.value) chatListPanelRef.value.scrollTop = 0
    })
  } else if (!mySelf(data)) {
    // chatList.value = [msgToPrivateChat(data)].concat(chatList.value) // 没有实时更新
    getChatList()
  }
}

defineExpose({
  getChatList
})
</script>
<style lang="scss" scoped>
.chat_list_comp {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: relative;
  .chat_list_search_panel {
    display: flex;
    overflow: hidden;
    align-items: center;
    padding: 8px 4px 8px 12px;
    flex-shrink: 0;
    .chat_list_search_input {
      margin-right: 4px;
      :deep(.el-input__wrapper) {
        border-radius: 22px;
        background-color: var(--el-fill-color);
        box-shadow: none;
      }
    }
  }
  .search-result {
    line-height: 36px;
    font-size: 15px;
    font-weight: 600;
    text-align: center;
    color: var(--el-color-white);
    border-style: solid;
    border-top-width: 1px;
    border-bottom-width: 1px;
    border-left-width: 0;
    border-right-width: 0;
    &.success {
      border-color: var(--el-color-success-light-3);
      background-color: var(--el-color-success-light-5);
    }
    &.error {
      border-color: var(--el-color-error-light-3);
      background-color: var(--el-color-error-light-5);
    }
  }
  .chat_list_content_panel {
    flex: 1;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .chat_list_item_box {
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    height: 60px;
    padding: 0 12px;
    cursor: pointer;
    .chat_list_item_icon {
      width: 36px;
      height: 36px;
      margin-right: 8px;
      border-radius: 50%;
      position: relative;
      flex-shrink: 0;
      .el-image {
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }

      &.is_text_icon {
        border-radius: 18px;
        border: 0.5px solid var(--el-color-white);
        box-shadow:
          0 2.25px 5.626px 0 rgba(200, 148, 160, 0.18),
          0 0 11.25px 0 var(--el-color-white) inset;
        backdrop-filter: blur(2.9px);
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.95) 0%,
          rgba(232, 216, 219, 0.95) 239.79%
        );
        font-size: 12px;
        font-weight: 600;
        line-height: 36px;
        color: var(--el-color-primary);
        text-align: center;
      }
    }
    .chat_list_item_info_panel {
      flex: 1;
      border-bottom: 1px solid var(--el-border-color-extra-light);
      height: 60px;
      padding: 8px 0;
      overflow: hidden;
    }
    .chat_list_item_info_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .chat_name {
        font-size: 15px;
        font-weight: 500;
        line-height: 24px;
        color: var(--el-text-color-primary);
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .chat_last_msg_time {
        font-size: 20px;
        zoom: 0.5;
        line-height: 1.2;
        flex-shrink: 0;
        margin-left: 8px;
        color: var(--el-text-color-disabled);
        margin-left: auto;
      }
      .chat_last_msg_content {
        font-size: 12px;
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 18px;
        height: 18px;
        color: var(--el-text-color-placeholder);
        :deep(img) {
          display: inline-block;
          watch: 18px;
          height: 18px;
          margin-left: 2px;
          margin-right: 2px;
        }
        :deep(.text_link) {
          text-decoration: underline;
          color: #025be8;
          font-size: 12px;
          line-height: 18px;
          margin-left: 2px;
          margin-right: 2px;
        }
      }
      .user_online_status {
        flex-shrink: 0;
        margin-left: 8px;
        font-size: 20px;
        zoom: 0.5;
        line-height: 1.2;
        display: flex;
        align-items: center;
        margin-left: auto;
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
    .sticky_btn {
      pointer-events: none;
      &::after {
        content: '';
        display: block;
        width: 14px;
        height: 15px;
        margin-left: 8px;
        background-size: 14px 15px;
        pointer-events: auto;
        overflow: hidden;
      }
    }
    .not_sticky {
      &::after {
        background-image: url('/static/images/live/not_sticky_icon.png');
      }
    }
    .already_sticky {
      &::after {
        background-image: url('/static/images/live/already_sticky_icon.png');
      }
    }
    .not_logged {
      pointer-events: none;
      &::after {
        content: '';
        display: block;
        width: 0px;
        height: 0px;
      }
    }
  }
}
.un-follow {
  position: absolute;
  right: 82px;
  top: 50%;
  transform: translateY(-50%);
  width: 82px;
  height: 36px;
  background: #fff;
  text-align: center;
  line-height: 36px;
  font-size: 14px;
  border-radius: 2px;
  cursor: pointer;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
}
</style>
