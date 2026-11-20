<template>
  <el-dialog
    v-model="isVideoShow"
    class="video-popup"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-icon class="grananed-close" color="#fff" size="32" @click="handleClose"
      ><Close
    /></el-icon>
    <video :src="previewFileUrl" autoplay controls></video>
  </el-dialog>
</template>
<script lang="ts" setup>
import { Close } from '@element-plus/icons-vue'
const emit = defineEmits(['update:showVideo'])
const props = defineProps({
  showVideo: {
    type: Boolean,
    default: false
  },
  previewFileUrl: {
    type: String,
    default: ''
  }
})

const isVideoShow = ref(false)
watch(
  () => props.showVideo,
  (val) => {
    isVideoShow.value = val
  }
)

const handleClose = () => {
  emit('update:showVideo', false)
}
</script>

<style lang="scss">
.video-popup {
  padding: 0;
  height: 80%;
  margin-top: 10vh;
  background-color: transparent;
  width: fit-content;
  .el-dialog__header {
    padding: 0;
  }
  video {
    width: auto;
    height: auto;
    max-height: 80vh;
    max-width: 100%;
    display: block;
    margin: auto;
  }
  .grananed-close {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    font-weight: 500;
    z-index: 1
  }
}
</style>
