<template>
  <el-dialog v-model="visible" append-to-body class="video-preview" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" fullscreen @opened="playVideo" @closed="pauseVideo">
    <div class="video-preview-inner">
      <el-icon class="grananed-close" color="#fff" size="32" @click="handleClose">
        <Close />
      </el-icon>
      <video ref="videoRef" :src="previewFileUrl" controls></video>
    </div>
  </el-dialog>
</template>
<script setup>
import { useDebounceFn } from '@vueuse/core'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  previewFileUrl: {
    type: String,
    default: ''
  }
})

const visible = defineModel('showVideo', { type: Boolean, default: false })

const videoRef = ref()

const playVideo = () => {
  nextTick(() => {
    const video = videoRef.value
    if (!video || !props.previewFileUrl) return
    video.currentTime = 0
    video.play().catch(() => { })
  })
}

const pauseVideo = () => {
  videoRef.value?.pause()
}

// 弹窗已打开时切换视频地址
watch(
  () => props.previewFileUrl,
  (url) => {
    if (visible.value && url) playVideo()
  }
)

const handleClose = useDebounceFn(() => {
  visible.value = false
}, 300)
</script>

<style lang="scss">
/* 全屏预览在窄视口 / iframe 内用视口尺寸约束，避免写死 1080×608 被裁切 */
.video-preview {
  padding: 0;
  background-color: transparent;

  .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    margin: 0;
    padding: 12px 12px 20px;
    box-sizing: border-box;
    height: 100%;
    max-height: 100vh;
    max-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
  }

  .video-preview-inner {
    position: relative;
    width: 100%;
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
  }

  video {
    display: block;
    margin: 0 auto;
    width: auto;
    height: auto;
    max-width: 100%;
    /* iframe 内 vh/dvh 相对嵌入窗口，避免超出可视区域 */
    max-height: min(608px, calc(100vh - 72px));
    max-height: min(608px, calc(100dvh - 72px));
    object-fit: contain;
    background: #000;
  }

  .grananed-close {
    position: absolute;
    right: 4px;
    top: 4px;
    cursor: pointer;
    font-weight: 500;
    z-index: 2;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.8));
  }
}
</style>
