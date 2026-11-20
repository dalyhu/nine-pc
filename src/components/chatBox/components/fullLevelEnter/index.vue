<template>
  <div class="full-level-enter" v-if="currentEnterUser">
    <div class="user-name user-super-vip" v-if="currentEnterUser.is_super_vip">
      <img
        src="/static/images/live/full-vip-frist.png"
        alt="满级图标"
        class="full-rich-frist"
        width="45px"
      />
      <div class="vip-text text-clamp text_common">
        欢迎{{ currentEnterUser.user_nickname }}至尊VIP进入{{ expenText }}
      </div>
      <img
        src="/static/images/live/full-vip-last.png"
        alt="满级图标"
        class="full-rich-last"
        width="45px"
      />
    </div>

    <div class="user-name user-super-rich" v-if="currentEnterUser.is_super_rich">
      <img
        src="/static/images/live/full-rich-frist.png"
        alt="满级图标"
        class="full-rich-frist"
        width="36px"
      />
      <div class="rich-text text-clamp text_common">
        欢迎{{ currentEnterUser.user_nickname }}至尊钞神进入{{ expenText }}
      </div>
      <img
        src="/static/images/live/full-rich-last.png"
        alt="满级图标"
        class="full-rich-last"
        width="80px"
      />
    </div>

    <div
      class="user-name user-level-10"
      v-if="
        !currentEnterUser.is_super_vip &&
        !currentEnterUser.is_super_rich &&
        currentEnterUser.sender_exp === 10
      "
    >
      <img src="/static/images/live/full-level-enter.png" alt="满级图标" class="full-level-image" />
      <span>欢迎{{ currentEnterUser.user_nickname }}进入{{ expenText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import mittBus from '@/utils/mittBus'
const props = defineProps<{ expenText: string; vid: string }>()

type FullLevelEnterUser = {
  user_nickname: string
  is_super_rich: boolean
  is_super_vip: boolean
  sender_exp: number
}

const currentEnterUser = ref<FullLevelEnterUser | null>(null)
const enterUserQueue: FullLevelEnterUser[] = []
let isFullShowing = false
const ANIMATTION_DURATTON = 3000
const INTERVAL_BETWEEN = 300
let clearTextTimer: ReturnType<typeof setTimeout>
let nextNicknameTimer: ReturnType<typeof setTimeout>

const parseBoolean = (value: unknown): boolean => {
  return value === true || value === 1 || value === '1' || value === 'true'
}

const normalizeEnterUser = (data: any): FullLevelEnterUser | null => {
  const senderExp = Number(data.sender_exp ?? data.exp ?? data.level ?? 0)
  const enterUser = {
    user_nickname: data.user_nickname || data.sender_nickname || '',
    is_super_rich: parseBoolean(data.is_super_rich),
    is_super_vip: parseBoolean(data.is_super_vip),
    sender_exp: Number.isFinite(senderExp) ? senderExp : 0
  }

  if (!enterUser.user_nickname) return null
  if (!enterUser.is_super_rich && !enterUser.is_super_vip && enterUser.sender_exp !== 10) {
    return null
  }

  return enterUser
}

/** 当有多个特殊用户进入的时候按队列展示特效 */
const showNextEnterUser = (): void => {
  if (enterUserQueue.length === 0) {
    isFullShowing = false
    currentEnterUser.value = null
    return
  }
  const enterUser = enterUserQueue.shift()
  if (!enterUser) {
    isFullShowing = false
    currentEnterUser.value = null
    return
  }

  currentEnterUser.value = enterUser
  isFullShowing = true

  clearTextTimer = setTimeout(() => {
    currentEnterUser.value = null
    nextNicknameTimer = setTimeout(() => {
      showNextEnterUser()
    }, INTERVAL_BETWEEN)
  }, ANIMATTION_DURATTON)
}

/** 满级特效ws 推送 */
const handleIMMessage = (data: any) => {
  if (data.action === 'inRoom' && data.vid === props.vid) {
    const enterUser = normalizeEnterUser(data)
    if (!enterUser) return

    enterUserQueue.push(enterUser)
    if (!isFullShowing) {
      showNextEnterUser()
    }
  }
}

onMounted(() => {
  mittBus.on('imOnMessage', handleIMMessage)
})

onUnmounted(() => {
  mittBus.off('imOnMessage', handleIMMessage)
  clearTimeout(clearTextTimer)
  clearTimeout(nextNicknameTimer)
})
</script>

<style lang="scss" scoped>
.full-level-enter {
  position: absolute;
  bottom: 100px;
  z-index: 999;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  align-items: flex-start; /* 确保图片和文字对齐 */
  animation:
    moveText 1s cubic-bezier(0.25, 1.5, 0.5, 1) forwards,
    startText 1s ease 1s forwards,
    leaveText 1s cubic-bezier(0.9, 0, 1, 0.3) 2s forwards;
  .user-name {
    color: #fff;
    display: flex;
    &.user-level-10 {
      margin-top: 12px;
      align-items: center;
      padding: 3px 8px;
      border-radius: 30px;
      background: linear-gradient(to right, #f75531, #ff9317);
    }
    &.user-super-vip {
      height: 36px;
      .vip-text {
        padding: 0 4px;
        line-height: 40px;
        background-image: url('/static/images/live/full-vip-mid.png');
      }
    }
    .text_common {
      flex: 1;
      max-width: 70%;
      height: 100%;
      background-repeat: repeat-x;
      background-size: 100% 100%;
    }
    &.user-super-rich {
      height: 50px;
      .rich-text {
        line-height: 60px;
        background-image: url('/static/images/live/full-rich-mid.png');
      }
    }
  }
  .full-level-image {
    height: 22px;
    margin-right: 4px; /* 防止图片和文字粘在一起 */
  }
}

/* 进场动画 */
@keyframes moveText {
  0% {
    transform: translateX(50vw);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translateX(30px);
  }
}

/* 停留动画 */
@keyframes startText {
  0%,
  100% {
    transform: translateX(30px);
  }
}

/* 离场动画 */
@keyframes leaveText {
  0% {
    transform: translateX(30px);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
