<template>
  <div class="chat_operation_panel">
    <div class="chat_operation_tools_panel">
      <div class="left_panel">
        <el-popover
          popper-class="normal_popover"
          popper-style="transform: translate(-8px, 6px);"
          :show-arrow="false"
          width="310"
          placement="top-start"
          :disabled="isMute"
          :visible="emojiPopVisible"
          @show="emojiPopShow"
          @hide="emojiPopHide"
        >
          <template #reference>
            <div class="emoji-sticker-btn-box">
              <IconEmoji
                class="icon_btn emoji"
                :class="{ disabled: isMute }"
                :is-active="emojiPopVisible && emojiPopBtnIndex === 1"
                @click.stop="showEmojiPop(1)"
              />
              <IconSticker
                v-if="showSticker"
                class="icon_btn sticker"
                :class="{ disabled: isMute }"
                :is-active="emojiPopVisible && emojiPopBtnIndex === 2"
                @click.stop="showEmojiPop(2)"
              />
            </div>
          </template>
          <template #default>
            <Emoticons
              v-if="emojisIsLoaded"
              @handleChange="selectedEmoji"
              :emoticonWindowSize="true"
              :activeIndex="emojiPopBtnIndex"
              @changeImage="selectedImg"
            ></Emoticons>
          </template>
        </el-popover>
        <el-popover
          v-if="props.chatType === CHAT_TYPE.PUBLIC"
          popper-class="normal_popover is_gifts_pop_inner"
          popper-style="transform: translate(-78px, 6px);"
          :show-arrow="false"
          placement="top-start"
          trigger="click"
          :disabled="isMute"
          :visible="giftPopVisible"
        >
          <template #reference>
            <IconGift
              class="icon_btn gift"
              :class="{ disabled: isMute }"
              :is-active="giftPopVisible"
              @click="giftPopVisible = !giftPopVisible"
            />
          </template>
          <template #default>
            <GiftsPop v-if="gifts.length" :vid="props.vid" :uid="props.uid" />
          </template>
        </el-popover>
        <template v-else>
          <IconUpload
            class="icon_btn upload"
            :class="{ disabled: isMute }"
            :color="
              uploadType === 'img' && uploadPopVisible ? 'var(--el-color-primary)' : '#b5b5b5'
            "
            @click="handleUploadBtnClick"
          />
          <!-- -2主播私聊，2私聊只有这两个有上传视频功能 -->
          <IconMedia
            v-if="[-2, 2].includes(props.chatType)"
            class="icon_btn media a"
            :class="{ disabled: isMute }"
            :style="{ color: isVideoColor ? '#d02d54' : '#b5b5b5' }"
            @click="uploadVideo"
            src="/static/images/chatBox/iconMedia.svg"
          />
        </template>
      </div>
      <div class="right_panel">
        <div
          class="gift_effects_switch"
          v-if="props.chatType === CHAT_TYPE.PUBLIC"
          @click="toggleGiftEffectsVisible"
        >
          <!-- <img src="/static/images/red_stop.png" alt="唯一标识" v-if="!giftEffectsVisible" class="stop-icon"/> -->
          <iconCheckbox :is-active="!giftEffectsVisible" />
          <el-text class="label_text" :style="{ color: giftEffectsVisible ? '#b5b5b5' : '#d02d54' }"
            >屏蔽礼物特效</el-text
          >
        </div>
      </div>
    </div>
    <div class="chat_operation_input_panel">
      <el-input
        class="msg_input_box"
        ref="msgInputRef"
        v-model="msg"
        type="textarea"
        :rows="2"
        :disabled="isMute"
        :placeholder="isMute ? '全员禁言中' : '请输入聊天内容'"
        resize="none"
        @keydown="keyDown"
      />
      <el-button class="send_msg_btn" type="primary" :disabled="isMute" @click="sendTextMsg"
        >发送</el-button
      >
    </div>
    <el-dialog
      :title="uploadType === 'img' ? '上传图片' : '上传视频'"
      :show-close="false"
      :before-close="closeUploadPop"
      v-model="uploadPopVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="false"
      :width="isForum ? '70%' : '442px'"
      modal-class="img_upload_dialog"
      center
    >
      <div
        class="upload_dialog_body"
        v-loading="isCompressing"
        :element-loading-text="uploadType === 'img' ? '上传中...' : '视频上传中'"
      >
        <el-upload
          :key="uploadInputResetKey"
          class="chat_box_upload_btn"
          action="#"
          :on-change="changeFile"
          :on-exceed="limitCheck"
          :auto-upload="false"
          :accept="uploadType === 'img' ? SUPPORTED_UPLOAD_IMAGE_ACCEPT : '.mp4, .mov'"
          v-model:file-list="fileList"
          list-type="picture"
          :limit="1"
        >
          <div class="uploadArea" v-show="!fileList.length">
            <el-image
              class="img"
              v-show="uploadType === 'video'"
              src="/static/images/chatBox/iconMedia.svg"
            ></el-image>
            <el-image
              class="img"
              v-show="uploadType === 'img'"
              src="/static/images/chatBox/uploadImage.svg"
            ></el-image>
            <span>{{
              uploadType === 'img' ? '点击上传选择你的图片' : '点击上传3分钟以内的视频'
            }}</span>
          </div>
          <!-- 自定义缩略图：浏览器解不了的格式（HEIC）显示占位而非裂图 -->
          <template #file="{ file }">
            <div
              v-if="uploadType === 'img' && !isPreviewDecodable"
              class="el-upload-list__item-thumbnail upload_thumb_placeholder"
            >
              <el-icon><IconPicture /></el-icon>
            </div>
            <img v-else class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <div class="el-upload-list__item-info">
              <a class="el-upload-list__item-name">
                <el-icon class="el-icon--document"><Document /></el-icon>
                <span class="el-upload-list__item-file-name" :title="file.name">
                  {{ file.name }}
                </span>
              </a>
            </div>
            <label class="el-upload-list__item-status-label">
              <el-icon class="el-icon--upload-success el-icon--check"><Check /></el-icon>
            </label>
            <el-icon class="el-icon--close" @click="resetUploadSelection"><Close /></el-icon>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeUploadPop" style="width: 108px; height: 38px">取消</el-button>
          <el-button
            type="primary"
            style="width: 108px; height: 38px"
            :loading="isCompressing"
            @click="handleUploadDialogPrimaryClick"
          >
            {{
              isCompressing
                ? uploadType === 'img'
                  ? '上传中'
                  : '压缩中'
                : fileList.length
                  ? '发送'
                  : '上传'
            }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import Emoticons from '@/components/Emoticons/index.vue'
import GiftsPop from '@/components/chatBox/components/giftsPop/index.vue'
import IconGift from './images/iconGift.vue'
import IconEmoji from './images/iconEmoji.vue'
import IconSticker from './images/iconSticker.vue'
import iconCheckbox from './images/iconCheckbox.vue'
import IconUpload from '@/components/icons/iconUpload.vue'
import IconMedia from './images/iconMedia.vue'
import { genSeedId } from '@/utils/common'
import { MESSAGE_TYPE, CHAT_TYPE, CHAT_BOX_MODE, MESSAGE_STATUS, PM_SOURCE_TYPE } from '@/enums'
import { useDebounceFn } from '@vueuse/core'
import { omit, divide, isEmpty } from 'lodash-es'
import type { UploadUserFile } from 'element-plus'
import {
  Check,
  Close,
  Document,
  Picture as IconPicture
} from '@element-plus/icons-vue'
// import { IM } from '@/utils/im'
import { useStore } from 'vuex'
import HomedApi from '@/api/home'
import mittBus from '@/utils/mittBus'
import { defaultAvatar } from '@/utils/common'
import {
  doCompressor,
  exceedsImageUploadMaxSize,
  getImageUploadMaxMB,
  isSupportedUploadImage,
  SUPPORTED_UPLOAD_IMAGE_ACCEPT,
  SUPPORTED_UPLOAD_IMAGE_FORMAT_HINT
} from '@/utils'
import {
  formatMsg,
  resolvePmSourceType,
  resolvePmSourceTypeStr,
  sendMsgOmitKeys
} from '@/components/chatBox/chatHelper'
import { isLiveActivityHelpSession } from '@/components/chatBox/liveActivityHelp'
import { useRoute } from 'vue-router'

/** 图片表情包发送间隔（毫秒），按会话维度分别冷却 */
const EMOTICON_SEND_INTERVAL_MS = 3000
const lastEmoticonClickAtBySession = new Map<string, number>()

const gifts = inject<Ref<[]>>('gifts')
const emoticons = inject<Ref<{ [key: string]: any }>>('emoticons')
const emit = defineEmits(['change-vid', '_updateChatRead'])
const widthBtn = ref('108px')
const uploadType = ref<'img' | 'video'>('img')
const isVideoColor = ref(false)

const props = defineProps({
  vid: {
    type: String,
    default: ''
  },
  uid: {
    type: Number,
    default: 0
  },
  assignId: {
    type: Number,
    default: 0
  },
  chatType: {
    type: Number,
    default: CHAT_TYPE.PUBLIC
  },
  chatBoxMode: {
    type: Number,
    default: CHAT_BOX_MODE.LIVE
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
  tabIndex: {
    type: String,
    default: '0'
  },
  /** 直播间活动「寻求帮助」打开的会话（由 chatBox 在 clickhelp 时传入） */
  isLiveActivityHelp: {
    type: Boolean,
    default: false
  },
  isMute: {
    type: Boolean,
    default: false
  },
  isReady: {
    type: Boolean,
    default: false
  },
  isForum: {
    type: Boolean,
    default: false
  }
})

const store = useStore()
const { getters } = useStore()
const imageMaxMB = computed(() => getImageUploadMaxMB(store.state.system))

const msg = ref('')
const msgInputRef = ref<HTMLTextAreaElement | null>(null)
const giftPopVisible = ref(false)
const emojiPopVisible = ref(false)
const emojiPopBtnIndex = ref(1)
const uploadPopVisible = ref(false)
/** 打开上传弹窗时递增，重建 el-upload 内 file input，避免重复选同一文件不触发 change */
const uploadInputResetKey = ref(0)
const fileList = ref<UploadUserFile[]>([])
const isCompressing = ref(false)
const isSending = ref(false)

watch(uploadPopVisible, async () => {
  if (uploadPopVisible.value) {
    uploadInputResetKey.value += 1
    await nextTick()
    setUploadInputId()
    const dialogHeader = document.querySelector('.img_upload_dialog .el-dialog__header')
    const dialogBody = document.querySelector('.img_upload_dialog .el-dialog__body')
    if (dialogHeader && dialogBody && dialogHeader.clientHeight <= 440) {
      ;(dialogBody as HTMLElement).style.transform = 'scale(0.8)'
    }
  }
})
const giftEffectsVisible = computed(() => store.state.giftEffectsVisible)
const userInfo = computed<UserInfo>(() => store.state.user.infoData)
const emojisIsLoaded = computed(() => emoticons.value != null)
const currentUserId = computed(() => store.getters.userId)
/** 全局聊天来源，默认右下角聊天列表 */
const pm_source_type = ref(PM_SOURCE_TYPE.GLOBAL_CHAT_LIST)

// 事件总线会被多次触发，使用watch方式避免多次触发
const clickStatus = ref(false)
const setClickStatus = ({ status }) => {
  if (status) {
    clickStatus.value = true
  }
}

watch(clickStatus, () => {
  if (clickStatus.value) {
    actionUpload({ status: clickStatus.value })
  }
})

// 和h5保持一样的风格
const actionUpload = ({ status }) => {
  if (status) {
    uploadVideo()
  }
}

onMounted(() => {
  mittBus.on('mycenter', popMessageFun)
  mittBus.on('sendApply', sendApplyMgs)
  mittBus.on('emitVideoUpload', setClickStatus)
  window.addEventListener('click', (e) => {
    if (e.target?.id === 'delyDestroyDom') {
      setTimeout(() => {
        destroyDom()
      }, 300)
    } else {
      destroyDom()
    }
  })
  window.addEventListener('click', handleWindowClick)
})

onBeforeUnmount(() => {
  mittBus.off('mycenter', popMessageFun)
  mittBus.off('sendApply', sendApplyMgs)
  stopImageProgressTimer()
  window.removeEventListener('click', handleWindowClick)
})

const route = useRoute()

function getEmoticonCooldownSessionKey() {
  return [
    props.chatBoxMode,
    props.chatType,
    props.vid,
    props.uid,
    props.assignId,
    props.tabIndex,
    props.matchType,
    props.matchId,
    props.isForum ? 1 : 0
  ].join('\u001f')
}

const isLogin = computed(() => !!store.state.user.infoData.id)

const showSticker = computed(() => !(route.path === '/forum' && !isLogin.value))

function handleWindowClick(event: MouseEvent) {
  const el = event.target

  if (el instanceof HTMLElement) {
    if (!el.closest('.is_gifts_pop_inner')) giftPopVisible.value = false
  }
}

function toggleGiftEffectsVisible() {
  store.commit('setGiftEffectsVisible', !giftEffectsVisible.value)
}

function widthType(type: 'img' | 'video' = uploadType.value) {
  uploadType.value = type
  widthBtn.value = !fileList.value.length ? '108px' : '176px'
}

function handleUploadBtnClick() {
  if (props.isMute) return
  giftPopVisible.value = false
  uploadPopVisible.value = true
  widthType('img')
}

async function sendImageFromDialog() {
  if (isCompressing.value || !fileList.value.length) return

  if (props.chatType === CHAT_TYPE.PUBLIC && !userInfo.value.id) {
    return ElMessage.error('游客不能在广场发言，请您先登录！（注意：未登录状态可直接私聊主播哦）')
  }

  if (props.chatType === CHAT_TYPE.ANCHOR_PRIVATE) {
    if (!props.isReady) {
      return ElMessage.warning('消息正在加载中，请您稍后再试')
    }
    if (isSending.value) {
      return ElMessage.warning('消息正在发送中，请您稍后再试')
    }
  }

  const item = fileList.value[0]
  const file = (item.raw ?? item) as File & { url?: string }
  if (!file) return

  if (props.chatType === CHAT_TYPE.PRIVATE || props.chatType === CHAT_TYPE.ANCHOR_PRIVATE) {
    emit('_updateChatRead')
  }

  const seed = genSeedId()
  uploadPopVisible.value = false

  emitPendingImageMsg(file, seed)
  try {
    await submitImageMessage(file, seed)
  } catch {
    failPendingImageSendBySeed(seed)
    ElMessage.error('图片发送失败，请稍后重试')
  }
}

function uploadVideo() {
  const params = {
    user_id: userId.value,
    anchor_id: props.assignId ? '0' : props.uid,
    assistant_id: props.assignId
  }
  HomedApi.sendVideoIsAgree(params)
    .then((res) => {
      clickStatus.value = false
      let { expires_at, is_enabled } = res.data
      isVideoColor.value = !is_enabled
      mittBus.emit('isShowApplyBtn', { expires_at, is_enabled })
      if (res.data.is_enabled === true) {
        if (props.isMute) return
        giftPopVisible.value = false
        uploadPopVisible.value = true
        widthType('video')
      }
    })
    .catch(() => {
      clickStatus.value = false
    })
}

function setUploadInputId() {
  const uploadInput = document.querySelector(
    '.img_upload_dialog .el-upload__input'
  ) as HTMLInputElement | null
  if (uploadInput) uploadInput.id = 'upload_input_tag'
}

function triggerUploadInputClick() {
  const uploadInput = document.querySelector(
    '.img_upload_dialog .el-upload__input'
  ) as HTMLInputElement | null
  uploadInput?.click()
}

function handleUploadDialogPrimaryClick() {
  if (isCompressing.value) return
  if (!fileList.value.length) {
    triggerUploadInputClick()
    return
  }
  if (uploadType.value === 'img') {
    sendImageFromDialog()
  } else {
    sendMessage(MESSAGE_TYPE.VIDEO, fileList.value[0])
  }
}

/** 当前选中图片能否被浏览器解码；false 时缩略图显示占位 */
const isPreviewDecodable = ref(true)

/**
 * 探测浏览器能否解码该图片（HEIC 会失败）。
 * 不支持 createImageBitmap 时按可解码处理，维持原有表现。
 */
async function canBrowserDecodeImage(file: File) {
  if (typeof createImageBitmap !== 'function') return true

  try {
    // eslint-disable-next-line compat/compat -- 函数开头已用 typeof 判断，不支持时不会走到这里
    const bitmap = await createImageBitmap(file)
    bitmap.close?.()
    return true
  } catch {
    return false
  }
}

async function resetUploadSelection() {
  fileList.value.splice(0, 999)
  isPreviewDecodable.value = true
  const uploadInput = document.querySelector(
    '.img_upload_dialog .el-upload__input'
  ) as HTMLInputElement | null
  if (uploadInput) uploadInput.value = ''
  uploadInputResetKey.value += 1
  widthBtn.value = '108px'
  await nextTick()
  setUploadInputId()
}

function closeUploadPop() {
  resetUploadSelection()
  uploadPopVisible.value = false
}

const IMAGE_PROGRESS_START = 8
/** 上传阶段进度上限（约 1s：8% → 98%） */
const IMAGE_PROGRESS_SEND_CAP = 98

const imageProgressTimers = new Map<string, ReturnType<typeof setInterval>>()
const imageProgressDisplayedMap = new Map<string, number>()

function buildImageSendParams(pic: File, seed: string): Partial<SendMessageItem> {
  return {
    vid: props.vid,
    uid: props.uid,
    type: props.chatType,
    method: 'notice',
    msg_type: MESSAGE_TYPE.IMG,
    color: '#000',
    contentType: 1,
    sender: currentUserId.value,
    seed,
    time: new Date(),
    pic,
    sender_exp: userInfo.value.exp || '1',
    sender_nickname: userInfo.value.user_nickname || '游客' + currentUserId.value,
    avatar: userInfo.value.avatar || defaultAvatar,
    sender_user_type: userInfo.value.user_type || 0
  }
}

function emitPendingImageMsg(previewFile: File, seed: string) {
  let params = buildImageSendParams(previewFile, seed)
  params.msgStatus = MESSAGE_STATUS.SENDING
  params.imageUploadProgress = IMAGE_PROGRESS_START
  setSource(params)
  params = formatMsg(params)
  emitSendingMsg(params)
  startImageProgressTimer(seed)
}

async function submitImageMessage(uploadFile: File, seed: string) {
  let params = buildImageSendParams(uploadFile, seed)
  setSource(params)
  params = formatMsg(params)
  await sendData(params)
}

function setImageUploadProgress(seed: string, progress: number) {
  const displayed = imageProgressDisplayedMap.get(seed) ?? IMAGE_PROGRESS_START
  const nextProgress = Math.min(IMAGE_PROGRESS_SEND_CAP, Math.max(displayed, progress))
  imageProgressDisplayedMap.set(seed, nextProgress)

  emitSendingMsg({
    seed,
    vid: props.vid,
    msgStatus: MESSAGE_STATUS.SENDING,
    imageUploadProgress: nextProgress
  })
}

function startImageProgressTimer(seed: string) {
  imageProgressDisplayedMap.set(seed, IMAGE_PROGRESS_START)
  stopImageProgressTimer(seed)

  const timer = setInterval(() => {
    const displayed = imageProgressDisplayedMap.get(seed) ?? IMAGE_PROGRESS_START
    if (displayed >= IMAGE_PROGRESS_SEND_CAP) return

    const step = displayed < 45 ? 2 : displayed < 80 ? 1 : 0.25
    setImageUploadProgress(seed, displayed + step)
  }, 180)

  imageProgressTimers.set(seed, timer)
}

function stopImageProgressTimer(seed?: string) {
  if (seed) {
    const timer = imageProgressTimers.get(seed)
    if (timer) clearInterval(timer)
    imageProgressTimers.delete(seed)
    imageProgressDisplayedMap.delete(seed)
    return
  }

  imageProgressTimers.forEach((timer) => clearInterval(timer))
  imageProgressTimers.clear()
  imageProgressDisplayedMap.clear()
}

function failPendingImageSend(params: Partial<SendMessageItem>) {
  if (params.msg_type !== MESSAGE_TYPE.IMG) return
  params.seed && stopImageProgressTimer(params.seed)
  params.msgStatus = MESSAGE_STATUS.FAIL
  emitSendingMsg(params)
}

function failPendingImageSendBySeed(seed: string) {
  stopImageProgressTimer(seed)
  emitSendingMsg({
    seed,
    vid: props.vid,
    msgStatus: MESSAGE_STATUS.FAIL
  })
}

async function changeFile(rawFile: UploadUserFile) {
  if (uploadType.value === 'img') {
    const file = rawFile.raw
    if (!file) return

    if (!isSupportedUploadImage(file)) {
      setTimeout(() => resetUploadSelection())
      return ElMessage.error(`图片格式错误，仅支持 ${SUPPORTED_UPLOAD_IMAGE_FORMAT_HINT} 格式`)
    }

    const maxMB = imageMaxMB.value
    if (exceedsImageUploadMaxSize(file.size, store.state.system)) {
      setTimeout(() => resetUploadSelection())
      return ElMessage.error(`图片仅支持 ${maxMB}M 以内，请换张图片试试`)
    }

    isCompressing.value = true
    try {
      const decodable = await canBrowserDecodeImage(file)
      isPreviewDecodable.value = decodable

      // 浏览器解不了的格式（如 HEIC）跳过压缩：压缩基于 canvas，同样解不了
      const newFile = decodable ? await doCompressor(file) : file
      if (!decodable) {
        console.log('[changeFile] 浏览器无法解码该图片，跳过压缩并原样上传', {
          name: file.name,
          type: file.type
        })
      }

      fileList.value = [
        {
          name: newFile.name,
          uid: rawFile.uid ?? Date.now(),
          status: 'success',
          raw: newFile,
          url: decodable ? newFile.url : ''
        }
      ]
    } catch {
      setTimeout(() => resetUploadSelection())
      return ElMessage.error('图片压缩失败，请换张图片试试')
    } finally {
      isCompressing.value = false
    }
    widthType()
    return
  }

  const fileM = divide(rawFile.size, 1024 * 1024)

  // quicktime是后台转化的，不计入格式限制
  if (!/mp4|mov|quicktime/gi.test(rawFile.raw.type || rawFile.raw.name.substr(-3))) {
    setTimeout(() => fileList.value.splice(0, 999))
    return ElMessage.error('视频格式错误，仅支持 mp4, mov 格式')
  }

  if (fileM > 30) {
    setTimeout(() => fileList.value.splice(0, 999))
    return ElMessage.error('上传视频不可以超过30M')
  }

  let dom = document.createElement('video')
  dom.src = rawFile.url
  dom.onloadedmetadata = () => {
    if (dom.duration > 180) {
      setTimeout(() => fileList.value.splice(0, 999))
      return ElMessage.error('上传视频不可以超过180s')
    }
  }

  isCompressing.value = true
  const newFile = await doCompressor(rawFile.raw)
  fileList.value[0] = newFile
  isCompressing.value = false
  await nextTick()
  let domImgLi = document.querySelector(
    '.el-upload-list.el-upload-list--picture > li.el-upload-list__item.is-success'
  )
  let domImg = document.querySelector(
    '.el-upload-list__item.is-success > img.el-upload-list__item-thumbnail'
  )
  let videoNode = document.createElement('video')
  videoNode.classList.add('el-upload-list__item-thumbnail')
  videoNode.src = rawFile.url
  domImg?.remove()
  domImgLi?.insertAdjacentElement('afterbegin', videoNode)
  widthType()
}

function limitCheck() {
  ElMessage.error(`最多只能上传1${uploadType.value === 'img' ? '张图片' : '个视频'}`)
}

const userId = computed(() => getters.userId)

async function sendData(params: Partial<SendMessageItem>) {
  try {
    // 主播私聊存在虚拟房间，需要作接口防抖处理
    if (props.chatType === CHAT_TYPE.ANCHOR_PRIVATE) {
      const isImageMsg = params.msg_type === MESSAGE_TYPE.IMG
      if (!props.isReady) {
        failPendingImageSend(params)
        return ElMessage.warning('消息正在加载中，请您稍后再试')
      }

      if (isSending.value && !isImageMsg) {
        failPendingImageSend(params)
        return ElMessage.warning('消息正在发送中，请您稍后再试')
      }
    }

    isSending.value = true
    params.msgStatus = MESSAGE_STATUS.SENDING
    if (params.msg_type !== MESSAGE_TYPE.VIDEO) {
      // 跳过初次前端视频显示
      emitSendingMsg(params)
    }

    uploadPopVisible.value = false
    resetUploadSelection()
    emojiPopVisible.value = false
    msg.value = ''

    const data = omit(params, sendMsgOmitKeys)
    const method =
      data.msg_type === MESSAGE_TYPE.IMG || data.msg_type === MESSAGE_TYPE.VIDEO ? 'upload' : 'post' // 上传视频为POST

    const pmSourceCtx = getPmSourceContext()
    const resolvedPmSourceType = resolvePmSourceType(pmSourceCtx)
    const resolvedPmSourceTypeStr =
      resolvedPmSourceType != null
        ? resolvePmSourceTypeStr(resolvedPmSourceType, pmSourceCtx)
        : '0'

    const anchorPrivateId =
      props.chatType === CHAT_TYPE.ANCHOR_PRIVATE && props.uid
        ? String(props.uid)
        : props.assignId
          ? '0'
          : String(props.uid)

    let videoParams = {
      user_id: 0,
      seed: '', // 必传项，很主要
      assistant_id: 0,
      anchor_id: anchorPrivateId,
      contentType: 2, // 写死和图片一样的值
      pm_source_type: data.pm_source_type ?? resolvedPmSourceType ?? PM_SOURCE_TYPE.LIVE_ANCHOR_PRIVATE,
      pm_source_type_str:
        data.pm_source_type_str ??
        (props.chatType === CHAT_TYPE.ANCHOR_PRIVATE && props.uid
          ? String(props.uid)
          : resolvedPmSourceTypeStr),
      video: data.video,
      // localVideo: undefined,
      channel_code: ''
    }
    if (data.msg_type === MESSAGE_TYPE.VIDEO) {
      videoParams.seed = params.seed
      videoParams.user_id = userId.value
      videoParams.assistant_id = props.assignId || 0
      videoParams.anchor_id = anchorPrivateId
      videoParams.pm_source_type = data.pm_source_type ?? resolvedPmSourceType ?? PM_SOURCE_TYPE.LIVE_ANCHOR_PRIVATE
      videoParams.pm_source_type_str =
        data.pm_source_type_str ??
        (props.chatType === CHAT_TYPE.ANCHOR_PRIVATE && props.uid
          ? String(props.uid)
          : resolvedPmSourceTypeStr)
      videoParams.video = data.video
      videoParams.contentType = 2
      videoParams.channel_code = localStorage.getItem('channel')
    }

    if (props.chatType === CHAT_TYPE.ANCHOR_PRIVATE) {
      data.anchorId = props.uid
      data.anchor_id = props.uid
      data.pm_source_type_str = String(props.uid)
      data.msgType = data.msg_type

      // const { data: resData } = data.msg_type === MESSAGE_TYPE.VIDEO ? await HomedApi.sendVideoToAnchor(videoParams, method) : await HomedApi.sendToAnchor(data, method)

      data.assignId = props.assignId
      const result = {
        // 接收发送视频返回的结果
        data: { msg: { pic: '', video: '' } } // pic为视频封面
      }
      let resData = { msg: {} }
      if (data.msg_type === MESSAGE_TYPE.VIDEO) {
        params.localVideo = data.video
        params.localVideoType = data.video?.type?.replace(/.*\//, '')?.slice(-3) // 奇奇怪怪的后缀，只取后三位
        params.localVideoIsPlay = !['avi', 'wmv'].includes(
          data.video?.type?.replace(/.*\//, '')?.slice(-3)
        )
        params.pic = 'isEmpty'
        emitSendingMsg(params)
        const res = await HomedApi.sendVideoToAnchor(videoParams, method)
        try {
          result.data = res.data
          resData = res.data
          resData.msg.mergePic = true
          resData.msg.pic = result.data.msg.pic
          // @ts-ignore
          resData.msg.localVideo = data.video
          resData.msg.video = result.data.msg.video

          resData.msg.localVideoType = data.video?.type?.replace(/.*\//, '')?.slice(-3) // 奇奇怪怪的后缀，只取后三位
          resData.msg.localVideoIsPlay = !['avi', 'wmv'].includes(
            data.video?.type?.replace(/.*\//, '')?.slice(-3)
          )
        } catch (e) {
          ElMessage.warning('上传视频失败')
          resData.msg.msgStatus = MESSAGE_STATUS.FAIL
          resData.msg.uploadVideoFail = true
        }
      } else {
        const res = await HomedApi.sendToAnchor(data, method)
        result.data = res.data
        resData = res.data
      }
      if (resData) {
        // 发送主播私聊消息时的 vid 可以作为主播私聊 vid 使用
        resData.vid && emit('change-vid', resData.vid)

        // 用户首次主动私聊主播时，会返回所分配的助理设置的欢迎语
        if (!isEmpty(resData.msg)) {
          mittBus.emit('imOnMessage', {
            action: 'messageList',
            messageList: [formatMsg(resData.msg)]
          })
        }
      }
    } else if (props.chatType === CHAT_TYPE.PRIVATE) {
      data.assignId = props.assignId
      data.msgType = data.msg_type
      const result = {
        // 接收发送视频返回的结果
        data: { msg: { pic: '', video: '' } } // pic为视频封面
      }
      if (data.msg_type === MESSAGE_TYPE.VIDEO) {
        params.localVideo = data.video
        params.localVideoType = data.video?.type?.replace(/.*\//, '')?.slice(-3) // 奇奇怪怪的后缀，只取后三位
        params.localVideoIsPlay = !['avi', 'wmv'].includes(
          data.video?.type?.replace(/.*\//, '')?.slice(-3)
        )
        params.pic = 'isEmpty'
        emitSendingMsg(params)
        const res = await HomedApi.sendVideoToAnchor(videoParams, method)
        try {
          result.data = res.data
          params.mergePic = true
          params.pic = result.data.msg.pic
          params.video = result.data.msg.video
        } catch (error) {
          ElMessage.warning('上传视频失败')
          params.msgStatus = MESSAGE_STATUS.FAIL
          params.uploadVideoFail = true
        }
      } else {
        const res = await HomedApi.sendToAssistant(data, method)
        result.data = res.data
      }
    } else {
      await HomedApi.sendMessage(data, method)
    }

    if (params.msg_type === MESSAGE_TYPE.IMG && params.seed) stopImageProgressTimer(params.seed)
    params.msgStatus = MESSAGE_STATUS.SUCCESS
    emitSendingMsg(params)
    setTimeout(() => (isSending.value = false), 100)
  } catch (err) {
    if (err.code === -5 && props.chatType === CHAT_TYPE.PUBLIC) {
      // console.log('弹窗')
      store.commit('setShowEmailUserTipState', true)
      return
    }
    ElMessage.error(err.code === 92 ? '抱歉，您的 IP 已禁用，请您联系客服。' : err.msg)
    params.msgStatus = MESSAGE_STATUS.FAIL
    if (params.msg_type === MESSAGE_TYPE.IMG) {
      params.seed && stopImageProgressTimer(params.seed)
      emitSendingMsg(params)
    } else {
      emitSendingMsg(params)
    }
    setTimeout(() => (isSending.value = false), 100)

    console.log(err, 'err')
  }
}

const sendMessage = useDebounceFn(
  async (msg_type: MESSAGE_TYPE, content: string | File | Object, presetSeed?: string, isAiCategory?: number) => {
    if (msg_type === MESSAGE_TYPE.TEXT && !((content as string) || '').trim()) {
      return
    }

    if (props.chatType === CHAT_TYPE.PUBLIC && !userInfo.value.id) {
      return ElMessage.error('游客不能在广场发言，请您先登录！（注意：未登录状态可直接私聊主播哦）')
    }

    // 如果是广场 并且 只注册了邮箱
    if (props.chatType === CHAT_TYPE.PUBLIC && !userInfo.value.id) {
      return
    }

    if (msg_type === MESSAGE_TYPE.EMOTICON) {
      if (props.chatType === CHAT_TYPE.ANCHOR_PRIVATE) {
        if (!props.isReady) {
          return ElMessage.warning('消息正在加载中，请您稍后再试')
        }
        if (isSending.value) {
          return ElMessage.warning('消息正在发送中，请您稍后再试')
        }
      }
      const key = getEmoticonCooldownSessionKey()
      const now = Date.now()
      const last = lastEmoticonClickAtBySession.get(key) ?? 0
      if (now - last < EMOTICON_SEND_INTERVAL_MS) {
        return ElMessage.warning('发言过快，请稍后尝试')
      }
      lastEmoticonClickAtBySession.set(key, now)
    }

    if (msg_type === MESSAGE_TYPE.TEXT && props.chatType === CHAT_TYPE.PUBLIC) {
      msg_type = MESSAGE_TYPE.DANMU
    }

    // 群组里面私聊，发送消息执行read接口
    if (props.chatType === CHAT_TYPE.PRIVATE || props.chatType === CHAT_TYPE.ANCHOR_PRIVATE) {
      emit('_updateChatRead')
    }

    let params: Partial<SendMessageItem> = {
      vid: props.vid,
      uid: props.uid,
      type: props.chatType,
      method: 'notice',
      msg_type,
      color: '#000',
      contentType: 1,
      sender: currentUserId.value,
      seed: presetSeed || genSeedId(),
      time: new Date(),
      text: undefined,
      pic: undefined,
      video: undefined,
      sender_exp: userInfo.value.exp || '1',
      sender_nickname: userInfo.value.user_nickname || '游客' + currentUserId.value,
      avatar: userInfo.value.avatar || defaultAvatar,
      sender_user_type: userInfo.value.user_type || 0, // 0游客 1管理员 2用户
      ...(isAiCategory ? { isAiCategory } : {}) // 条件添加：只在值存在时才添加该字段
    }

    if (msg_type === MESSAGE_TYPE.TEXT || msg_type === MESSAGE_TYPE.DANMU) {
      params.text = content as string
    } else if (msg_type === MESSAGE_TYPE.EMOTICON || msg_type === MESSAGE_TYPE.IMG) {
      const imageFile =
        content instanceof File ? content : (content as UploadUserFile).raw ?? (content as File)
      params.pic = imageFile
      if (msg_type === MESSAGE_TYPE.IMG && !presetSeed) {
        params.imageUploadProgress = IMAGE_PROGRESS_START
        startImageProgressTimer(params.seed)
      }
    } else if (msg_type === MESSAGE_TYPE.VIDEO) {
      params.video = content as File
      params.time = new Date().toLocaleString()
      params.localVideo = content.video
      params.localVideoType = content.video?.type?.replace(/.*\//, '')?.slice(-3) // 奇奇怪怪的后缀，只取后三位
      params.localVideoIsPlay = !['avi', 'wmv'].includes(
        content.video?.type?.replace(/.*\//, '')?.slice(-3)
      )
      params.contentType = 2
      params.pic = '视频正在上传中'
    }

    setSource(params)

    params = formatMsg(params)

    sendData(params)
  },
  80
)

function emitSendingMsg(params) {
  mittBus.emit('imOnMessage', { action: 'sendMsg', ...params })
}

function keyDown(event) {
  // 输入时带有回车键就禁用
  if (event.keyCode === 13) {
    event.preventDefault()
    event.stopPropagation()

    // 如果未同时输入shift，直接提交
    !event.shiftKey && sendMessage(MESSAGE_TYPE.TEXT, msg.value)
    if (event.shiftKey) {
      msg.value += '\n'
    }
  }
}

function sendTextMsg() {
  sendMessage(MESSAGE_TYPE.TEXT, msg.value)
}

function sendApplyMgs(text) {
  // 为了解决 /forum 可能挂载未进入会话时 chatType 默认为 PUBLIC
  if (props.chatBoxMode === CHAT_BOX_MODE.MAIN && !props.vid) return
  sendMessage(MESSAGE_TYPE.TEXT, text)
}

function showEmojiPop(btnIndex) {
  giftPopVisible.value = false
  if (emojiPopBtnIndex.value === btnIndex && emojiPopVisible.value === true) {
    emojiPopVisible.value = false
    return
  }
  emojiPopVisible.value = true
  emojiPopBtnIndex.value = btnIndex
}

function emojiPopClickOutsideHandler(event) {
  if (!event.target.closest('.emoticons-box')) {
    emojiPopVisible.value = false
  }
}

function emojiPopShow() {
  document.body.addEventListener('click', emojiPopClickOutsideHandler)
}

function emojiPopHide() {
  document.body.removeEventListener('click', emojiPopClickOutsideHandler)
}

function selectedEmoji({ data }) {
  const el: HTMLInputElement = msgInputRef.value.ref
  const { selectionStart, selectionEnd } = el || {}

  if (selectionStart == null || selectionEnd == null) return

  msg.value = msg.value.substring(0, selectionStart) + data + msg.value.substring(selectionEnd)

  nextTick(() => {
    const idx = selectionStart + data.length

    el.focus()
    el.selectionStart = idx
    el.selectionEnd = idx
  })
}

function selectedImg({ emojiurl }) {
  sendMessage(MESSAGE_TYPE.EMOTICON, emojiurl)
}

function popMessageFun(val: { type?: number } | null) {
  if (!val) {
    pm_source_type.value = PM_SOURCE_TYPE.GLOBAL_CHAT_LIST
    return
  }
  if (typeof val.type === 'number') {
    pm_source_type.value = val.type
  }
}

function getPmSourceContext() {
  return {
    chatBoxMode: props.chatBoxMode,
    chatType: props.chatType,
    tabIndex: props.tabIndex,
    uid: props.uid,
    matchType: props.matchType,
    matchId: props.matchId,
    globalPmSourceType: pm_source_type.value,
    isLiveActivityHelp: props.isLiveActivityHelp || isLiveActivityHelpSession.value
  }
}

/** 设置发言来源类型（pm_source_type）及主播私聊 anchor 相关字段 */
function setSource(params: Partial<SendMessageItem>) {
  const ctx = getPmSourceContext()
  const sourceType = resolvePmSourceType(ctx)
  if (sourceType == null) return

  params.pm_source_type = sourceType
  params.pm_source_type_str = resolvePmSourceTypeStr(sourceType, ctx)

  if (props.chatType === CHAT_TYPE.ANCHOR_PRIVATE && props.uid) {
    params.anchorId = props.uid
    params.anchor_id = props.uid
    params.pm_source_type_str = String(props.uid)
  }
}

const destroyDom = () => {
  // !!!点击任意出都关掉申请按钮,图标变灰色
  mittBus.emit('isShowApplyBtn', { expires_at: 0, is_enabled: true })
  isVideoColor.value = false
}

defineExpose({
  sendData,
  sendMessage
})
</script>
<style lang="scss" scoped>
.chat_operation_panel {
  flex-shrink: 0;
  overflow: hidden;
  border-top: 1px solid var(--el-border-color-extra-light);
  .chat_operation_tools_panel,
  .chat_operation_input_panel {
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 4px 8px;
    justify-content: space-between;
  }
  .left_panel {
    display: flex;
    align-items: center;
    .emoji-sticker-btn-box {
      display: flex;
      align-items: center;
    }
    .icon_btn {
      width: 24px;
      height: 24px;
      display: block;
      cursor: pointer;
      &.emoji {
        width: 22px;
        height: 22px;
        margin-right: 12px;
      }
      &.sticker {
        margin-right: 12px;
        overflow: hidden;
      }
      &.disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }
      &.media {
        margin-left: 12px;
      }
    }
  }
  .right_panel {
    display: flex;
    align-items: center;
    .gift_effects_switch {
      display: flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      .stop-icon {
        position: absolute;
        width: 18px;
        left: -1px;
        top: 2px;
      }
      .label_text {
        margin-left: 4px;
        color: #b5b5b5;
        @include fontStyle-body1-Medium;
      }
    }
  }
  .msg_input_box {
    padding: 1px 5px;
    border: 1px solid var(--el-color-primary);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    :deep(.el-textarea__inner) {
      box-shadow: none;
      line-height: 22px;
      padding: 0;
    }
  }
  .send_msg_btn {
    height: 48px !important;
    font-size: 16px;
    line-height: 24px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .el-switch {
    height: 24px;
    :deep(.el-switch__core) {
      background-color: var(--el-text-color-disabled);
      border-color: var(--el-text-color-disabled);
      .el-switch__inner .is-text {
        color: var(--el-text-color-regular) !important;
      }
    }
    :deep(.el-switch__action) {
      background-color: var(--el-text-color-regular);
    }
    &.is-checked {
      :deep(.el-switch__core) {
        background-color: var(--el-primary-background-color-9);
        border-color: var(--el-primary-background-color-9);
        .el-switch__inner .is-text {
          color: var(--el-color-primary) !important;
        }
      }
      :deep(.el-switch__action) {
        background-color: var(--el-color-primary);
        color: #fff;
      }
    }
  }
  .chat_box_upload_btn {
    :deep(.el-upload-list) {
      width: 100%;
      .el-upload-list__item-info {
        width: 100%;
        overflow: hidden;
      }
    }
    :deep(.upload_thumb_placeholder) {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--el-fill-color-light);
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 6px;
      box-sizing: border-box;
      color: var(--el-text-color-placeholder);
      font-size: 22px;
    }
  }
}
</style>
<style lang="scss">
.img_upload_dialog {
  .el-dialog {
    height: 293px;
    border-radius: 16px;
    padding: 0;
    .el-dialog__header {
      line-height: 44px;
      font-size: 20px;
      padding-bottom: 0;
      border-bottom: 1px solid #dbdbdb;
    }
    .el-dialog__body {
      // width: 368px;
      margin: 35px auto 0;
      .upload_dialog_body {
        min-height: 120px;
      }
      .uploadArea {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        gap: 18px;
        font-size: 20px;
        color: #262626;
        .img {
          width: 68px;
          height: 68px;
        }
      }
    }
    .el-dialog__footer {
      button {
        width: v-bind(widthBtn);
        height: 38px;
      }
    }
  }
}
</style>
