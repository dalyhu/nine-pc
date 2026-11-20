<template>
  <div
    class="chat_message_item"
    :class="props.data.className"
    :style="`min-height: ${props.data.msg_type == 7 && props.data.video ? '0px' : ''};`"
  >
    <template v-if="props.data.chatType === CHAT_TYPE.PUBLIC">
      <UserPrefix :data="props.data" />
      <div class="user_name">
        {{ props.data.sender_nickname || '游客' + props.data.sender }}
      </div>
      <div class="colon_text">:</div>
    </template>
    <df-image-lazy
      v-else
      fit="cover"
      class="user_avatar"
      :src="$common.avatarHandler(props.data.avatar)"
    />
    <div
      class="message_detail_box"
      :class="{
        is_img_msg: MESSAGE_TYPE.IMG === props.data.contentType
      }"
    >
      <div style="display: none">{{ props.data }}</div>
      <div class="user_name" v-if="!props.data.isMyself && props.data.chatType === CHAT_TYPE.GROUP">
        {{ props.data.sender_nickname || '游客' + props.data.sender }}
      </div>
      <div class="pin_notice_msg_box" v-if="props.data.contentType === MESSAGE_TYPE.AD">
        <df-image
          class="pin_notice_msg_img"
          fit="cover"
          @contextmenu.prevent
          :src="props.data.pic"
          :pic-bnc="props.data.pic_bnc || ''"
          :lazy-Load="true"
        />
        <div class="pin_notice_msg_info" @click="openLink(props.data.link)">
          <div class="pin_notice_msg_title">{{ props.data.title }}</div>
          <div class="pin_notice_msg_content" v-html="formatTextMsg(data.text)"></div>
        </div>
      </div>
      <template v-else-if="props.data.contentType === MESSAGE_TYPE.IMG">
        <template v-if="props.data.msg_type === 7">
          <span style="position: relative">
            <div v-if="uploadVideoLoading && !props.data.localVideoIsPlay" class="iconCenter">
              <Loading class="loading_rotate" color="#fff" />
            </div>
            <img
              v-else
              class="iconCenter"
              :src="`/static/images/chatBox/video${
                props.data.pic != '--DELETED--' ? 'Controller' : 'Error'
              }.svg`"
              @click="
                handlePreviewVideo(
                  props.data.localVideoIsPlay ? props.data.localVideo?.url : props.data.video,
                  !!props.data.localVideo?.url
                )
              "
            />
            <div
              v-if="props.data.localVideoIsPlay && uploadVideoLoading"
              class="messageVideoItem"
              :style="`${
                props.data.localVideo?.url
                  ? ''
                  : 'pointer-events: all;width: 120px;height: 170px;max-width: 100px;max-height: 150px;background: #000;'
              }`"
            >
              <video
                v-if="props.data.localVideoIsPlay"
                :src="props.data.localVideo?.url"
                style="width: 120px; height: 170px; pointer-events: none"
              ></video>
            </div>
            <img
              v-else-if="props.data.pic != '--DELETED--' && !isVideoCoverError"
              class="messageVideoItem"
              :src="props.data.pic"
              :class="{
                clipPathCircle: props.data.pic === '--DELETED--',
                clipPath: uploadVideoLoading
              }"
              style="
                display: block;
                pointer-events: all;
                width: 120px;
                height: 170px;
                pointer-events: all;
                object-fit: cover;
              "
              @error="handleVideoCoverError"
              @click="
                handlePreviewVideo(
                  props.data.localVideoIsPlay ? props.data.localVideo?.url : props.data.video
                )
              "
            />
            <div
              v-else
              style="pointer-events: none; width: 120px; height: 170px; background: #000"
            ></div>
          </span>
        </template>
        <template v-else>
          <div class="pic-info-wrap">
            <df-image
              class="pic-info"
              fit="contain"
              @contextmenu.prevent
              :src="displayImg"
              :pic-bnc="data.pic_bnc || ''"
              :lazy-Load="true"
              :preview-disabled="isLocalPendingImg"
            >
              <template #error>
                <div class="pic-placeholder">
                  <IconPicture class="pic-placeholder-icon" />
                  <span class="pic-placeholder-text">图片无法预览</span>
                </div>
              </template>
            </df-image>
            <div v-if="showImageUploadOverlay" class="pic-upload-overlay">
              <svg class="pic-upload-ring" width="56" height="56" viewBox="0 0 56 56">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="rgba(255,255,255,0.28)"
                  stroke-width="3"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="3"
                  stroke-linecap="round"
                  :stroke-dasharray="imageProgressRingLength"
                  :stroke-dashoffset="imageProgressRingOffset"
                  transform="rotate(-90 28 28)"
                />
              </svg>
              <div class="pic-upload-center">
                <span class="pic-upload-percent">{{ imageUploadProgressText }}</span>
              </div>
            </div>
          </div>
          <div
            class="msg_status_box"
            v-if="data.chatType !== CHAT_TYPE.PUBLIC && !showImageUploadOverlay"
            @click="reloadImage"
          >
            <Refresh class="resend_btn" />
          </div>
        </template>
      </template>

      <div v-else-if="props.data.text" class="text-info">
        <div
          v-if="props.data.sender_nickname === '系统' && props.data.text.includes('video-upload')"
          :style="{ color }"
          :data-text="props.data.text"
        >
          <div>已开通视频上传，您现在可以上传1个视频</div>
          <div class="video-upload" @click="uploadVideoEmit">
            <img src="/static/images/chatBox/videoIcon.svg" />
            <span>上传视频</span>
          </div>
        </div>
        <div
          v-else
          :style="{ color }"
          class="msg_text_pre"
          v-html="formatTextMsg(data.displayText)"
        ></div>
      </div>
      <div v-if="props.data.chatType !== CHAT_TYPE.PUBLIC" class="msg_time">
        {{ props.data.displayTime }}
      </div>
      <div class="msg_status_box" v-if="statusBarVisible">
        <Loading v-if="props.data.msgStatus === MESSAGE_STATUS.SENDING" class="loading_rotate" />
        <Refresh
          v-else-if="props.data.msgStatus === MESSAGE_STATUS.FAIL"
          class="resend_btn"
          @click="resend(props.data)"
        />
      </div>
    </div>
    <chatPreviewVideo v-model:showVideo="showVideo" :previewFileUrl="previewFileUrl" />
  </div>
</template>
<script setup>
import chatPreviewVideo from './chat-preview-video.vue'
import { ref, computed, watch } from 'vue'
import { CHAT_TYPE, MESSAGE_STATUS, MESSAGE_TYPE } from '@/enums'
import { Loading, Refresh, Picture as IconPicture } from '@element-plus/icons-vue'
import { useDebounceFn } from '@vueuse/core'
import UserPrefix from '@/components/chatBox/components/userPrefix/index.vue'
import { openLink } from '@/components/chatBox/chatHelper'
import mittBus from '@/utils/mittBus'
import { formatTextMsg } from '@/utils/common'

const showVideo = ref(false)
const previewFileUrl = ref('')

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  color: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['resendMsg'])

const needShowStatusChats = [CHAT_TYPE.ANCHOR_PRIVATE, CHAT_TYPE.PRIVATE, CHAT_TYPE.PUBLIC]
const IMAGE_PROGRESS_RING_RADIUS = 24
const imageProgressRingLength = 2 * Math.PI * IMAGE_PROGRESS_RING_RADIUS

const showImageUploadOverlay = computed(() => {
  return (
    props.data.isMyself &&
    props.data.contentType === MESSAGE_TYPE.IMG &&
    props.data.msg_type !== 7 &&
    props.data.msgStatus === MESSAGE_STATUS.SENDING
  )
})

const imageUploadProgress = computed(() => {
  const progress = Number(props.data.imageUploadProgress)
  if (!Number.isFinite(progress)) return 12
  return Math.min(100, Math.max(0, progress))
})

const imageProgressRingOffset = computed(() => {
  return imageProgressRingLength * (1 - imageUploadProgress.value / 100)
})

const imageUploadProgressText = computed(() => `${Math.round(imageUploadProgress.value)}%`)

const statusBarVisible = computed(() => {
  if (
    !needShowStatusChats.includes(props.data.chatType) ||
    props.data.msgStatus === MESSAGE_STATUS.SUCCESS
  ) {
    return false
  }
  if (showImageUploadOverlay.value) {
    return false
  }
  return (
    props.data.msgStatus === MESSAGE_STATUS.SENDING || props.data.msgStatus === MESSAGE_STATUS.FAIL
  )
})

const resend = useDebounceFn((item) => emit('resendMsg', item), 300)

const displayImg = ref(props.data.displayImg)

/** 本地待上传图片：blob URL 可能无法解码（HEIC），此时禁用大图预览 */
const isLocalPendingImg = computed(() => props.data.pic instanceof File)

const uploadVideoLoading = ref(false)
const isVideoCoverError = ref(false)

const handleVideoCoverError = () => {
  uploadVideoLoading.value = false
  isVideoCoverError.value = true
}

const handlePreviewVideo = (src) => {
  if (src === '--DELETED--') {
    return ElMessage.error('视频不存在')
  }
  previewFileUrl.value = src
  showVideo.value = true
}

watch(
  () => props.data.displayImg,
  () => {
    displayImg.value = props.data.displayImg
  }
)

watch(
  () => [props.data.pic, props.data.msg_id, props.data.seed],
  () => {
    uploadVideoLoading.value = false
    isVideoCoverError.value = false
  }
)

const uploadVideoEmit = () => {
  mittBus.emit('emitVideoUpload', { status: true })
}

function appendVersionIfHttpImage(url) {
  if (typeof url !== 'string') return url // 不是字符串直接返回

  // 判断是否是 HTTP(S) 图片
  const isHttp = /^(http:\/\/|https:\/\/).*\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i.test(url)

  if (isHttp) {
    // HTTP(S) 图片，添加版本号参数
    return url.includes('?') ? `${url}&v=${Date.now()}` : `${url}?v=${Date.now()}`
  } else {
    console.log('非图片链接。')
    return url // 其他非图片链接，直接返回
  }
}

const reloadImage = useDebounceFn(() => {
  displayImg.value = appendVersionIfHttpImage(props.data.displayImg)
}, 300)
</script>
<style scoped lang="scss">
.chat_message_item {
  .user_avatar {
    width: 24px;
    height: 24px;
    min-height: 24px;
    flex-shrink: 0;
    border-radius: 50%;
  }
  &.public_chat {
    position: relative;
    padding: 4px;
    box-sizing: border-box;
    border-radius: 8px;
    background-color: var(--el-fill-color);
    font-size: 14px;
    width: fit-content;
    line-height: 20px;
    > * {
      display: inline-block;
      vertical-align: top;
    }
    .message_detail_box,
    .text-info,
    .msg_text_pre {
      display: inline;
    }
    .message_detail_box.is_img_msg {
      line-height: 0;
      display: inline-block;
    }
    .msg_text_pre {
      padding: 1px 0;
    }

    .msg_status_box {
      position: absolute;
      right: -20px;
      top: 6px;
      width: 16px;
      height: 16px;
      color: var(--el-color-info);
      > .resend_btn {
        cursor: pointer;
      }
    }
  }
  &.private_chat {
    display: flex;
    font-size: 14px;
    line-height: 20px;
    padding-right: 24px;
    .user_avatar {
      margin-right: 4px;
    }
    .msg_time {
      position: absolute;
      font-size: 12px;
      line-height: 20px;
      color: var(--el-text-color-secondary);
      bottom: 4px;
      right: 8px;
      z-index: 3;
    }
    .message_detail_box {
      background-color: var(--el-fill-color);
      border-top-right-radius: 8px;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      padding: 4px 46px 4px 8px;
      position: relative;
    }
    .msg_status_box {
      position: absolute;
      right: -20px;
      top: 6px;
      width: 16px;
      height: 16px;
      color: var(--el-color-info);
      > .resend_btn {
        cursor: pointer;
      }
    }
    &.myself {
      flex-direction: row-reverse;
      padding-left: 24px;
      padding-right: 0;
      .user_avatar {
        margin-left: 4px;
        margin-right: 0;
      }
      .msg_time {
        color: #f6d5dd;
      }
      .message_detail_box {
        border-top-right-radius: 0;
        border-top-left-radius: 8px;
        background-color: var(--el-color-primary);
        .msg_text_pre {
          color: var(--el-color-white);
        }
      }
      .msg_status_box {
        right: unset;
        left: -20px;
      }
    }
    .pic-info {
      display: block;
    }
  }
  .iconCenter {
    position: absolute;
    width: 28px;
    height: 28px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .messageVideoItem {
    max-width: 120px;
    max-height: 170px;
    object-fit: contain;
  }
  .pic-info-wrap {
    position: relative;
    display: inline-block;
    line-height: 0;
  }
  .pic-upload-overlay {
    position: absolute;
    inset: 0;
    z-index: 4;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.42);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  .pic-upload-ring {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .pic-upload-center {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pic-upload-percent {
    font-size: 16px;
    line-height: 1;
    color: #fff;
    font-weight: 600;
  }
  .pic-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    line-height: 1;
    color: var(--el-text-color-secondary);
    background-color: var(--el-fill-color-extra-light);
  }
  .pic-placeholder-icon {
    width: 28px;
    height: 28px;
  }
  .pic-placeholder-text {
    font-size: 12px;
  }
  .pic-info {
    background-color: var(--el-fill-color-extra-light);
    border-radius: 4px;
    overflow: hidden;
    height: 138px;
    min-height: 138px;
    width: 138px;
    :deep(> img) {
      display: block;
      height: 100%;
      width: 100%;
    }
    :deep(.el-image__error) {
      height: 100%;
      width: 100%;
    }
  }
  .user_name {
    font-size: 12px;
    color: #025be8;
    font-weight: 500;
  }
  // 进入直播间
  &.chat_message_item_type_21 {
    .user_name {
      font-size: 14px;
      color: var(--el-text-color-primary);
    }
    .colon_text {
      display: none;
    }
  }
  // 图片
  &.chat_message_item_type_2 {
    // min-height: 146px;
    &.private_chat {
      .message_detail_box {
        padding: 4px;
      }
      .msg_time {
        color: var(--el-color-white);
        background-color: var(--el-overlay-extra-light);
        right: 4px;
        line-height: 16px;
        padding: 0 8px;
        border-radius: 23px;
      }
    }
  }
  // 广告
  &.chat_message_item_type_3 {
    background-color: transparent;
    width: 100%;
    padding-top: 0;
    padding-bottom: 0;
    &.private_chat {
      .message_detail_box {
        flex: 1;
        padding: 0;
        background-color: transparent;
        overflow: hidden;
      }
    }
  }
  .colon_text {
    color: #025be8;
    padding-right: 2px;
  }
  .in_room_tips {
    color: var(--el-text-color-primary);
  }
  .msg_text_pre {
    color: var(--el-text-color-primary);
    white-space: pre-wrap;
    word-break: break-all;
    :deep(img) {
      display: inline-block;
      margin-left: 2px;
      margin-right: 2px;
      width: auto;
      max-width: 100%;
      height: 20px;
      // object-fit: cover;
      vertical-align: top;
    }
  }
  :deep(.text_link) {
    text-decoration: underline;
    color: #025be8;
    font-size: 14px;
    line-height: 20px;
    margin-left: 2px;
    margin-right: 2px;
  }
  .pin_notice_msg_box {
    display: block;
    position: relative;
    background-color: var(--el-color-warning-light-9);
    border-radius: 8px;
    overflow: hidden;
    padding: 8px;
    width: 100%;
    margin-top: 2px;
    &::before {
      content: '';
      background: url('./images/chat_ad_bg.png') no-repeat top right / 100% 100%;
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      width: 54px;
      height: 46px;
      z-index: 1;
    }
    .pin_notice_msg_img {
      position: absolute;
      object-fit: cover;
      width: 32px;
      height: 32px;
      min-height: 32px;
      border-radius: 4px;
      left: 8px;
      top: 8px;
      z-index: 3;
    }
    .pin_notice_msg_info {
      position: relative;
      z-index: 2;
      .pin_notice_msg_title {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        padding-right: 62px;
        color: var(--el-text-color-primary);
        height: 34px;
        padding-left: 36px;
        line-height: 32px;
        font-size: 14px;
        font-weight: 900;
        margin-bottom: 0;
      }
      .pin_notice_msg_content {
        border-radius: 4px;
        background: var(--el-bg-color);
        color: var(--el-text-color-primary);
        padding: 8px;
        font-size: 12px;
        word-break: break-all;
        overflow: hidden;
        :deep(.text_link) {
          font-size: 12px;
        }
        :deep(> img) {
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-left: 2px;
          margin-right: 2px;
          vertical-align: top;
        }
      }
    }
  }
}

.video-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  gap: 6px;
  width: 92px;
  height: 28px;
  border: 1px solid #2671f7;
  background: #f0f2f5;
  color: #2671f7;
  cursor: pointer;

  img {
    width: 14px;
    height: 14px;
  }
}

.clipPath,
.clipPathCircle {
  opacity: 0;
  clip-path: circle(50%);
}
</style>
