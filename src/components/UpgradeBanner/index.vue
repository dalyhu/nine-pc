<template>
  <transition name="upgrade-banner">
    <div
      v-if="visible"
      class="upgrade-banner"
      :class="{ 'upgrade-banner--paused': paused }"
      role="status"
      @mouseenter="pause"
      @mouseleave="resume"
    >
      <div class="upgrade-banner__icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </div>
      <div class="upgrade-banner__text">
        <div class="upgrade-banner__title">升级浏览器，观看更流畅</div>
        <div class="upgrade-banner__desc">您的浏览器版本稍旧，升级后可体验全部新功能，推荐使用谷歌浏览器</div>
      </div>
      <button type="button" class="upgrade-banner__btn" @click="upgrade">
        立即升级
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
      <button type="button" class="upgrade-banner__close" aria-label="关闭" @click="close">×</button>
      <div class="upgrade-banner__bar" />
    </div>
  </transition>
</template>

<script setup>
/**
 * 软性升级提示条：浏览器在支持范围内、但版本偏旧时，在页面底部居中提示升级
 * 每次打开页面都显示，8 秒后自动消失（鼠标悬停时暂停）；用户点 × 关闭后 7 天内不再显示
 * 由 App.vue 按开关异步加载；要不要显示见 utils/upgradeBanner.js
 * 这个组件就是给旧浏览器看的，样式只用 Safari 13.1 也支持的写法：不用 flex gap、inset、:where()，毛玻璃写 -webkit- 前缀
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { CLOSE_KEY, shouldShowUpgradeBanner } from '@/utils/upgradeBanner'
import { reportError } from '@/utils/pageError'

const props = defineProps({
  thresholds: { type: Object, default: null }
})

const DURATION = 8000
// 与 index.html 兜底页推荐的下载地址一致
const DOWNLOAD_URL = 'https://www.google.cn/chrome/'

const visible = ref(false)
const paused = ref(false)
let timer = null
let remaining = DURATION
let startedAt = 0

function readClosedAt() {
  try {
    const saved = window.localStorage.getItem(CLOSE_KEY)
    return saved ? Number(saved) : null
  } catch (e) {
    return null // 存储不可用时按没关过处理
  }
}

function startTimer() {
  startedAt = Date.now()
  timer = setTimeout(() => {
    visible.value = false
  }, remaining)
}

function pause() {
  if (paused.value) return
  clearTimeout(timer)
  remaining = Math.max(0, remaining - (Date.now() - startedAt))
  paused.value = true
}

function resume() {
  if (!paused.value) return
  paused.value = false
  startTimer()
}

function close() {
  try {
    window.localStorage.setItem(CLOSE_KEY, String(Date.now()))
  } catch (e) {
    // 记不下来就只关掉这一次
  }
  clearTimeout(timer)
  visible.value = false
}

function upgrade() {
  window.open(DOWNLOAD_URL, '_blank', 'noopener')
}

onMounted(() => {
  try {
    visible.value = shouldShowUpgradeBanner({
      thresholds: props.thresholds,
      unsupported: !!window.__X9_UNSUPPORTED__,
      uaInfo: window.UA_INFO,
      userAgent: navigator.userAgent,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      closedAt: readClosedAt(),
      now: Date.now()
    })
  } catch (e) {
    reportError(e, 'upgrade-banner')
  }
  if (visible.value) startTimer()
})

onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped lang="scss">
.upgrade-banner {
  position: fixed;
  z-index: 1900; // 低于 Element Plus 弹窗（2000 起），不盖住登录等弹窗
  bottom: 24px;
  left: 50%;
  width: 620px;
  margin-left: -310px;
  padding: 12px 12px 12px 14px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: rgba(32, 33, 36, 0.82);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  backdrop-filter: blur(14px) saturate(140%);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(208, 45, 84, 0.18);
  color: #fff;
  font-size: 14px;
  line-height: 20px;
}

.upgrade-banner__icon {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff5a7e, #d02d54);
  box-shadow: 0 4px 12px rgba(208, 45, 84, 0.45);
}

.upgrade-banner__text {
  flex: 1;
  min-width: 0;
}

.upgrade-banner__title {
  font-weight: 600;
}

.upgrade-banner__desc {
  margin-top: 2px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}

.upgrade-banner__btn {
  flex: none;
  display: flex;
  align-items: center;
  height: 32px;
  margin-left: 16px;
  padding: 0 16px;
  border: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, #ff4d76, #d02d54);
  box-shadow: 0 4px 14px rgba(208, 45, 84, 0.4);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  svg {
    margin-left: 4px;
  }
}

.upgrade-banner__close {
  flex: none;
  width: 28px;
  height: 28px;
  margin-left: 8px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 18px;
  line-height: 28px;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
}

// 底部进度条：8 秒走完，和自动消失的时间一致；鼠标悬停时一起暂停
.upgrade-banner__bar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #ff4d76, #d02d54);
  transform-origin: left center;
  animation: upgrade-banner-countdown 8s linear forwards;
}

.upgrade-banner--paused .upgrade-banner__bar {
  animation-play-state: paused;
}

@keyframes upgrade-banner-countdown {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.upgrade-banner-enter-active,
.upgrade-banner-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.upgrade-banner-enter-from,
.upgrade-banner-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
