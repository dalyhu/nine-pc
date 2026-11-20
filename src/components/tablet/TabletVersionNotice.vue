<template>
  <Teleport to="body">
    <div v-if="showNotice" class="tablet-version-notice" role="region" aria-label="观看版本建议">
      <span class="tablet-version-message">
        <strong>{{ recommended === 'pc' ? '当前空间适合大屏版' : '当前空间更适合移动版' }}</strong>
        <small>切换将重新加载页面</small>
      </span>
      <button type="button" class="tablet-version-primary" @click="switchVersion">
        {{ recommended === 'pc' ? '切换大屏版' : '切换移动版' }}
      </button>
      <button type="button" class="tablet-version-close" aria-label="关闭切换提示" @click="dismiss">
        <span aria-hidden="true">×</span>
      </button>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const rules = window.X9Tablet
const tablet = document.documentElement.hasAttribute('data-tablet-pc')
// TP-116：转屏提示对平板所有页面生效；切换后由入口分流（没有对应 H5 页的进 H5 直播首页）
const scoped = computed(() => tablet)
const recommended = ref('pc')
const visible = ref(false)
const dismissed = ref(false)
const fullscreen = ref(false)
const showNotice = computed(() => scoped.value && visible.value && !dismissed.value && !fullscreen.value)
// eslint-disable-next-line compat/compat -- 用 ?. 读取，旧浏览器上为 undefined，下一行再判断是否支持 addEventListener
const orientation = window.screen?.orientation
const modernOrientation = typeof orientation?.addEventListener === 'function'
let previous = null
let timer, frame, observer, stopRouteWatch

function isFullscreen() {
  // eslint-disable-next-line compat/compat -- 不支持时为 undefined，会回退到 webkitFullscreenElement（Safari 16.4 之前）
  return !!(document.fullscreenElement || document.webkitFullscreenElement || document.documentElement.hasAttribute('data-player-web-fullscreen'))
}

function isEditing() {
  return document.activeElement?.matches('input, textarea, [contenteditable="true"]')
}

function cancelPending() {
  clearTimeout(timer)
  if (frame) cancelAnimationFrame(frame)
  timer = frame = undefined
}

function resetBaseline() {
  cancelPending()
  visible.value = false
  previous = null
  if (!scoped.value || isFullscreen() || isEditing()) return
  previous = rules.recommend(window.innerWidth, window.innerHeight)
  recommended.value = previous
}

function refresh() {
  clearTimeout(timer)
  if (!scoped.value) return
  timer = setTimeout(() => {
    if (!scoped.value || isFullscreen() || isEditing()) return
    const target = rules.recommend(window.innerWidth, window.innerHeight)
    if (previous !== null && target !== previous) visible.value = target !== 'pc'
    previous = target
    recommended.value = target
  }, 150)
}

function onFocusOut() {
  if (!scoped.value) return
  if (frame) cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    frame = undefined
    refresh()
  })
}

function onFullscreenChange() {
  fullscreen.value = isFullscreen()
  cancelPending()
  if (fullscreen.value) visible.value = false
  else refresh()
}

function dismiss() {
  dismissed.value = true
  try {
    window.sessionStorage.setItem('x9:tablet-notice-dismissed', '1')
  } catch {
    // 存储不可用时，当前页面仍保持关闭。
  }
}

function switchVersion() {
  try {
    window.sessionStorage.setItem('x9:tablet-switch', recommended.value)
  } catch {
    // 一次性标记尽力写入，失败时仍刷新并按入口规则分流。
  }
  window.location.reload()
}

onMounted(() => {
  if (!tablet || !rules) return
  try {
    dismissed.value = window.sessionStorage.getItem('x9:tablet-notice-dismissed') === '1'
  } catch {
    // 读取失败时按未关闭处理。
  }
  fullscreen.value = isFullscreen()
  stopRouteWatch = watch(() => route.path, resetBaseline, { immediate: true })
  window.addEventListener('resize', refresh)
  if (modernOrientation) orientation.addEventListener('change', refresh)
  else window.addEventListener('orientationchange', refresh)
  window.addEventListener('focusout', onFocusOut)
  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('webkitfullscreenchange', onFullscreenChange)
  observer = new MutationObserver(onFullscreenChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-player-web-fullscreen'] })
})

onBeforeUnmount(() => {
  cancelPending()
  stopRouteWatch?.()
  if (!tablet || !rules) return
  window.removeEventListener('resize', refresh)
  if (modernOrientation) orientation.removeEventListener('change', refresh)
  else window.removeEventListener('orientationchange', refresh)
  window.removeEventListener('focusout', onFocusOut)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
  observer?.disconnect()
})
</script>

<style lang="scss">
html[data-tablet-pc] .tablet-version-notice {
  position: fixed;
  inset: 0 0 auto;
  z-index: 2000000;
  box-sizing: border-box;
  padding: max(8px, env(safe-area-inset-top)) 64px 8px 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--el-text-color-primary, #303133);
  background: var(--el-bg-color, #fff);
  border-bottom: 1px solid var(--el-primary-background-color-9, #ffe8ed);
  box-shadow: 0 2px 8px #0000000d;
  font-family: var(--fontFamily-PingFangSC, sans-serif);
  font-size: 14px;
  line-height: 1.5;

  .tablet-version-message {
    display: flex;
    flex-direction: column;
    padding-left: 12px;
    margin-right: 8px;
    border-left: 3px solid var(--el-primary-background-color, #d02d54);
  }

  strong {
    font-weight: 600;
  }

  small {
    color: var(--el-text-color-regular, #606266);
    font-size: 12px;
  }

  button {
    min-width: 44px;
    min-height: 44px;
    padding: 6px 14px;
    font: inherit;
    border: 1px solid transparent;
    border-radius: 8px;
    cursor: pointer;
  }

  .tablet-version-primary {
    color: #fff;
    background: var(--el-primary-background-color, #d02d54);
    font-weight: 500;
  }

  .tablet-version-close {
    position: absolute;
    top: max(8px, env(safe-area-inset-top));
    right: 12px;
    width: 44px;
    color: var(--el-text-color-regular, #606266);
    background: transparent;
  }

  .tablet-version-close span {
    font-size: 24px;
    line-height: 1;
  }

  button:focus-visible {
    outline: 2px solid var(--el-primary-background-color, #d02d54);
    outline-offset: 2px;
  }
}

html[data-tablet-pc][data-player-web-fullscreen] .tablet-version-notice {
  display: none !important;
}
</style>
