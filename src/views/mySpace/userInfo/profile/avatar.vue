<template>
  <div
    class="avatar-container"
    v-loading="uploadLoading"
    :element-loading-text="uploadLoadingText"
    element-loading-background="rgba(0, 0, 0, 0.6)"
    element-loading-custom-class="avatar-upload-loading"
  >
    <div class="back" @click="back">
      <img src="/static/images/spaceAndMine/back-left.svg" alt="" />
      返回
    </div>

    <div class="avatar-info">
      <img class="avatar" :src="selectedAvatar" alt="" />
      <template v-if="pendingUrl">
        <span class="mask">您新上传的头像审核中</span>
        <img class="avatar" :src="pendingUrl" alt="" />
      </template>
    </div>

    <p class="title">选择头像</p>

    <div class="avatar-list">
      <div
        v-for="item in list"
        :key="item.id"
        class="avatar-item"
        :class="{ selected: selectedIndex === item.id }"
        @click="select(item)"
      >
        <img class="image" :src="item.url" alt="" />
      </div>
    </div>

    <div class="button-list">
      <div class="save" :class="{ active: selectedIndex }" @click="handleSave">保存</div>
      <div class="review" v-if="pendingUrl">您新上传的头像审核中</div>
      <el-upload
        v-else
        class="upload"
        action="upload"
        :show-file-list="false"
        :auto-upload="false"
        :accept="SUPPORTED_UPLOAD_IMAGE_ACCEPT"
        :disabled="uploadLoading"
        :on-change="beforeUpload"
      >
        <div class="button" :class="{ disabled: uploadLoading }">
          {{ uploadLoading ? uploadLoadingText : '上传头像' }}
        </div>
      </el-upload>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getAvatarAuditUrlApi } from '@/api'
import { avatarList, updateInfo, uploadAvatar } from '@/api/user'
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

const userInfo = computed(() => store.state.user.infoData)

const router = useRouter()
const back = () => {
  router.back()
}

const pendingUrl = ref('')

const getUserAvatarStatus = async () => {
  const res = await getAvatarAuditUrlApi()
  if (res.data.url) {
    pendingUrl.value = res.data.url
  }
}

const list = ref([])
const selectedIndex = ref()

const selectedAvatar = ref(userInfo.value?.avatar)

const select = (item) => {
  selectedIndex.value = item.id
  selectedAvatar.value = item.url
}

const getAvatarList = async () => {
  const res = await avatarList()
  list.value = res.data
}

const handleSave = async () => {
  try {
    if (!selectedIndex.value) {
      return
    }
    await updateInfo({
      avatar: selectedAvatar.value
    })
    store.dispatch('updateUserInfo')
    ElMessage.success('更新成功')
    router.back()
  } catch (err) {
    ElMessage.error(err.msg)
  }
}

const uploadLoading = ref(false)
const uploadLoadingText = ref('')
/** 页面仍挂载时为 true；离开后压缩/上传在后台继续，但不再做路由跳转等页面内操作 */
const isPageActive = ref(true)

onBeforeUnmount(() => {
  isPageActive.value = false
})

async function runAvatarUpload(rawFile) {
  if (uploadLoading.value) return

  uploadLoading.value = true
  uploadLoadingText.value = '上传中...'

  const userId = userInfo.value?.id

  try {
    const pic = await compressWithTimeout(rawFile)
    const res = await uploadAvatar({
      avatar: pic,
      userId
    })

    if (res.code === 0 && res.data.uploadSuccess) {
      ElMessage.success(res.msg || '头像上传成功,请等待审核通过')
      if (isPageActive.value) {
        await getUserAvatarStatus()
        router.back()
      }
    } else {
      ElMessage.error(res.msg || '头像上传失败')
    }
  } catch (err) {
    if (err === IMAGE_COMPRESS_TIMEOUT_ERROR || err?.isCompressTimeout) {
      ElMessage.error('上传失败')
    } else {
      console.log('头像上传失败:', err?.message || err)
      ElMessage.error(err?.msg || '头像上传失败')
    }
  } finally {
    if (isPageActive.value) {
      uploadLoading.value = false
      uploadLoadingText.value = ''
    }
  }
}

// 用户头像自定义上传
const beforeUpload = (rawFile) => {
  if (!isSupportedUploadImage(rawFile.raw)) {
    ElMessage.error(`图片格式错误，仅支持 ${SUPPORTED_UPLOAD_IMAGE_FORMAT_HINT} 格式`)
    return false
  }

  const maxMB = imageMaxMB.value
  if (exceedsImageUploadMaxSize(rawFile.raw.size, store.state.system)) {
    ElMessage.error(`图片仅支持 ${maxMB}M 以内，请换张图片试试`)
    return false
  }

  void runAvatarUpload(rawFile.raw)
  return false
}

onMounted(() => {
  getUserAvatarStatus()
  getAvatarList()
})
</script>
<style scoped lang="scss">
:deep(.avatar-upload-loading) {
  .el-loading-text {
    color: #fff;
  }
}

.avatar-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 24px;
  overflow: hidden;

  .back {
    display: flex;
    font-size: 18px;
    color: #333;
    height: 70px;
    line-height: 24px;
    align-items: center;
    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
    }
  }
  .avatar-info {
    display: flex;
    align-items: center;
    margin-top: 24px;
    width: 264px;
    position: relative;
    gap: 24px;

    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
    }

    .mask {
      position: absolute;
      top: 0;
      right: 0;
      display: grid;
      place-items: center;
      box-sizing: border-box;
      padding: 0 10px;
      font-size: 14px;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      color: #fff;
      text-align: center;
      word-break: break-word;
      overflow-wrap: break-word;
      white-space: normal;
      background: rgba(0, 0, 0, 0.5);
    }
  }

  .title {
    font-size: 16px;
    margin: 24px 0;
    color: #333;
  }

  .avatar-list {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    .avatar-item {
      border-radius: 50%;
      border: 2px solid transparent;
      overflow: hidden;

      &.selected {
        border-color: #d02d54;
      }

      .image {
        width: 68px;
        height: 68px;
        cursor: pointer;
      }
    }
  }

  .button-list {
    display: flex;
    align-items: center;
    gap: 24px;
    height: 38px;
    margin-top: 24px;

    .save {
      width: 64px;
      height: 38px;
      line-height: 38px;
      color: #999;
      cursor: pointer;
      border: 1px solid #999;
      text-align: center;
      border-radius: 8px;

      &.active {
        color: #d02d54;
        border-color: #d02d54;
      }
    }

    .upload {
      width: 96px;
      height: 38px;
      line-height: 38px;
      cursor: pointer;
      text-align: center;
      border-radius: 8px;
      color: #333;
      border: 1px solid #333;
      overflow: hidden;

      .button {
        width: 96px;
        height: 38px;
        border: none;

        &.disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
      }
    }

    .review {
      width: 192px;
      height: 38px;
      line-height: 38px;
      cursor: pointer;
      color: #999;
      text-align: center;
      border-radius: 8px;
      border: 1px solid #999;
    }
  }
}
</style>
