<!-- 图片组件 -->
<template>
  <el-image
    v-if="resolved"
    v-bind="$attrs"
    class="df_image"
    :class="{ empty: !imgSrc }"
    :loading="lazyLoad ? 'lazy' : 'eager'"
    :fit="fit"
    :preview-teleported="true"
    :hide-on-click-modal="true"
    :preview-src-list="previewDisabled ? [] : [imgSrc]"
    :src="imgSrc"
    @load="isLoaded = true"
    @error="onLoadError"
  >
    <template v-if="$slots.error" #error>
      <slot name="error" />
    </template>
  </el-image>
  <!-- 地址尚未算出（如 bnc 解密中）时不挂载 el-image：
       空 src 会让它立即触发 error，把错误插槽当成加载态显示出来 -->
  <div v-else v-bind="$attrs" class="df_image df_image_loading" />
</template>
<script setup name="DfImage" lang="ts">
import { useStore } from 'vuex'
import { decryptImg } from '@/utils/crypto'
import { formatURL } from '@/utils'
import { IMG_MODE } from '@/enums'
import { defaultAvatar } from '@/utils/common.js'

// 多根节点下 Vue 不会自动继承 attrs，需手动 v-bind 到两个分支，
// 否则调用方的 class / 事件会被静默丢弃（如聊天气泡 .pic-info 的尺寸）
defineOptions({
  inheritAttrs: false
})

/** 网络抖动的退避重试间隔；耗尽后才交给 el-image 展示错误态 */
const RETRY_DELAYS = [800, 2000]

const props = defineProps({
  lazyLoad: {
    type: Boolean,
    default: false
  },
  fit: {
    type: String,
    default: 'contain'
  },
  src: {
    type: String,
    default: ''
  },
  picBnc: {
    type: String,
    default: ''
  },
  previewDisabled: {
    type: Boolean,
    default: false
  }
})

const store = useStore()
const imgSrc = ref('')
const picBncMap = computed(() => store.state.picBncMap || {})
const imgMode = computed(() => store.state.imgMode)
const isLoaded = ref(false)
/** computeImgSrc 是否已为当前 props 得出结论 */
const resolved = ref(false)

// 组件在长列表中会被复用，props 可能在 await 期间变化，用自增令牌丢弃过期结果
let generation = 0
let retried = 0
let retryTimer: ReturnType<typeof setTimeout> | null = null
// 明文 pic 加载失败后是否已尝试过 pic_bnc 降级，同一 generation 只降级一次
let bncFallbackTried = false

watch(
  () => (props.picBnc || '') + '-' + (props.src || ''),
  (newV, oldV) => newV !== oldV && computeImgSrc(),
  { immediate: true }
)

onBeforeUnmount(clearRetryTimer)

async function computeImgSrc() {
  const current = ++generation

  clearRetryTimer()
  retried = 0
  bncFallbackTried = false
  resolved.value = false

  // 策略：优先用明文 pic（无需额外网络请求 + 解密），加载失败再走 pic_bnc 降级。
  // 只有明文缺失时才在首屏直接走 pic_bnc。
  if (props.src) {
    imgSrc.value = getURL(props.src)
    resolved.value = true
    return
  }

  if (props.picBnc) {
    const decrypted = await resolvePicBnc(props.picBnc)
    if (current !== generation) return

    if (decrypted) {
      imgSrc.value = decrypted
      resolved.value = true
      return
    }

    console.warn('[dfImage] 加密图解密失败，且无明文回落', props.picBnc)
    imgSrc.value = ''
  } else {
    imgSrc.value = defaultAvatar
  }

  resolved.value = true
}

/** 解出 pic_bnc 的 base64，命中缓存直接返回，失败结果不入缓存 */
async function resolvePicBnc(key: string) {
  const cached = picBncMap.value[key]
  if (cached) return cached

  const decrypted = await decryptImg(key)
  if (decrypted) store.commit('setPicBncMap', { [key]: decrypted })
  return decrypted
}

/**
 * 错误优雅降级：
 *   1. 明文 pic 加载失败且存在 pic_bnc → 解密 pic_bnc 替换 src（仅一次）
 *   2. 否则走网络抖动的退避重试（仅 http(s)）
 *   3. 都不适用则保持挂载，由 el-image 的错误插槽兜底（不显示裂图）
 * 重试期间回到未挂载状态，避免把错误插槽当成加载态闪一下。
 */
async function onLoadError() {
  if (!bncFallbackTried && props.picBnc && imgSrc.value !== picBncMap.value[props.picBnc]) {
    bncFallbackTried = true
    const current = generation

    resolved.value = false
    clearRetryTimer()
    retried = 0

    const decrypted = await resolvePicBnc(props.picBnc)
    if (current !== generation) return

    if (decrypted) {
      imgSrc.value = decrypted
      resolved.value = true
      return
    }
    // pic_bnc 也拿不到，恢复挂载让下面走重试或错误插槽兜底
    resolved.value = true
  }

  if (!isRetryableSrc(imgSrc.value) || retried >= RETRY_DELAYS.length) return

  const current = generation
  const delay = RETRY_DELAYS[retried++]

  resolved.value = false
  clearRetryTimer()

  retryTimer = setTimeout(() => {
    if (current !== generation) return
    imgSrc.value = appendCacheBuster(imgSrc.value)
    resolved.value = true
  }, delay)
}

function clearRetryTimer() {
  if (retryTimer) {
    clearTimeout(retryTimer)
    retryTimer = null
  }
}

/** blob: / data: 的失败是确定性的（如 Windows 无法解码的 HEIC），重试没有意义 */
function isRetryableSrc(url = '') {
  return /^https?:\/\//i.test(url)
}

/** 必须在 getURL 之后调用：DIRECT 模式下 getURL 只取 pathname，会丢掉 query */
function appendCacheBuster(url = '') {
  const stripped = url.replace(/([?&])_r=\d+/, '$1').replace(/[?&]$/, '')
  return stripped + (stripped.includes('?') ? '&' : '?') + `_r=${Date.now()}`
}

function getURL(url = '') {
  if (imgMode.value !== IMG_MODE.DIRECT) return url

  if (!url.trim()) return ''

  return window.origin + formatURL(url).pathname
}
</script>
<style lang="scss" scoped>
.df_image {
  &.empty {
    :deep(.el-image__error) {
      font-size: 0;
    }
  }
}
// 不设宽高：该分支通过 $attrs 继承调用方的尺寸 class，自设会同优先级冲突
.df_image_loading {
  background-color: var(--el-fill-color-extra-light);
}
</style>
