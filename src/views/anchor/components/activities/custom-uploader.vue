<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    action="#"
    :accept="SUPPORTED_UPLOAD_IMAGE_ACCEPT"
    multiple
    list-type="picture-card"
    :auto-upload="true"
    :disabled="fileList.length >= limit"
    :limit="limit"
    :before-upload="beforeUpload"
    :http-request="customUpload"
    :on-exceed="handleExceed"
  >
    <!-- accept="image/*,video/*" -->
    <!-- 上传按钮 -->
    <div class="plus-style" v-if="fileList.length < limit">
      <el-icon><Plus /></el-icon>
    </div>
    <!-- 图片预览 -->
    <template #file="{ file }">
      <div class="upload-preview-self">
        <el-image
          v-if="file.raw && file.raw.type.startsWith('image/')"
          :src="file.url"
          :preview-src-list="[file.url]"
          fit="contain"
        ></el-image>
        <video
          v-if="file.raw && file.raw.type.startsWith('video/')"
          :src="file?.url"
          @click="handlePreview(file)"
        ></video>
        <div class="upload-text" v-if="file.status === 'uploading'">上传中..</div>
        <el-icon class="delete-icon" @click="handleRemove(file)"><CloseBold /></el-icon>
      </div>
    </template>
  </el-upload>

  <previewVideo v-model:showVideo="showVideo" :previewFileUrl="previewFileUrl" />
</template>

<script setup lang="ts">
import previewVideo from './preview-video.vue'
import { Plus, CloseBold } from '@element-plus/icons-vue'
import { getApplyUpload } from '@/api/activities.js'
import { useStore } from 'vuex'
import {
  compressWithTimeout,
  exceedsImageUploadMaxSize,
  getImageUploadMaxMB,
  IMAGE_COMPRESS_TIMEOUT_ERROR,
  isSupportedUploadImage,
  SUPPORTED_UPLOAD_IMAGE_ACCEPT,
  SUPPORTED_UPLOAD_IMAGE_FORMAT_HINT
} from '@/utils'

const store = useStore()
const imageMaxMB = computed(() => getImageUploadMaxMB(store.state.system))

const limit = 4
const maxSize = 1024 * 1024 * 20
const showVideo = ref(false)
const previewFileUrl = ref('')
const fileList = ref<any[]>([])
const isUploading = ref(false)

// 上传校验
const beforeUpload = (file: File | File[]) => {
  const files = Array.isArray(file) ? file : [file]
  for (const f of files) {
    f['status'] = 'uploading'
    if (!isSupportedUploadImage(f)) {
      ElMessage.warning({
        message: `不支持的文件格式，仅支持 ${SUPPORTED_UPLOAD_IMAGE_FORMAT_HINT}`
      })
      return false
    }

    const maxMB = imageMaxMB.value
    if (exceedsImageUploadMaxSize(f.size, store.state.system)) {
      ElMessage.warning({ message: `图片仅支持 ${maxMB}M 以内，请换张图片试试` })
      return false
    }

    if (f.type.startsWith('video') && f.size > maxSize) {
      ElMessage.warning({ message: '单个视频文件不能超过20M' })
      return false
    }
  }
  return true
}

const handleExceed = () => {
  ElMessage.warning({ message: '最多只能上传4张！' })
}

// 上传
const customUpload = async (options: any) => {
  const index = fileList.value.findIndex((f) => f.uid === options.file.uid)
  isUploading.value = true
  try {
    const newFile = await compressWithTimeout(options.file)

    const res: any = await getApplyUpload({
      file: newFile,
      filetype: options.file.type?.split('/')[0]
    })
    if (res.code === 0) {
      if (index !== -1) {
        fileList.value[index].url = res.data.pic
        fileList.value[index].status = 'success'
      }
      options.file.status = 'success'
      // 告诉 el-upload
      options.onSuccess(res.data)
    }
  } catch (err) {
    if (index !== -1) fileList.value.splice(index, 1)
    if (err === IMAGE_COMPRESS_TIMEOUT_ERROR || (err as any)?.isCompressTimeout) {
      ElMessage.error('上传失败')
    }
    options.onError(err)
  } finally {
    isUploading.value = false
  }
}

const handleRemove = (file) => {
  fileList.value = fileList.value.filter((f) => f.uid !== file.uid)
}

const validate = () => {
  const allUploaded = fileList.value.every(
    (file) => file.status === 'success' || file.status === 'done'
  )
  if (!fileList.value.length) {
    return Promise.reject('请至少上传一张截图')
  }
  if (!allUploaded) {
    return Promise.reject('文件尚未上传完')
  }
  return Promise.resolve()
}

// 打开视频大图
const handlePreview = (file: any) => {
  previewFileUrl.value = file.url
  showVideo.value = true
}

defineExpose({
  fileList,
  validate,
  isUploading
})
</script>

<style lang="scss">
.upload-demo {
  .el-upload-list--picture-card {
    display: flex;
    .el-upload-list__item,
    .el-upload {
      width: 68px;
      height: 68px;
      border: none;
      background-color: transparent;
    }
    .plus-style {
      width: 68px;
      height: 68px;
      background-color: #f3f5f8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      color: #848587;
    }
  }
}
.upload-preview-self {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .el-image,
  video {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
    .delete-icon {
      display: block;
      z-index: 99;
    }
  }
  .upload-text {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 68px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .delete-icon {
    display: none;
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 1;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
