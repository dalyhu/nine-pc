<template>
  <el-dialog
    v-model="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :width="452"
    align-center
    class="tip-dialog"
    @closed="onClosed"
  >
    <img class="tip-dialog__bell" src="/static/images/login/tip-bell.png" alt="" />

    <div v-if="showClose" @click="handleClose">
      <img src="/static/images/login/close.svg" alt="close" class="tip-dialog__close"/>
    </div>

    <div class="tip-dialog__header">
      <div class="tip-dialog__title">{{ title }}</div>
      <div v-if="subtitle" class="tip-dialog__subtitle">{{ subtitle }}</div>
    </div>

    <div class="tip-dialog__card">
      <div class="tip-dialog__content">
        <slot name="content">{{ content }}</slot>
      </div>
      <div v-if="tip" class="tip-dialog__tip">
        <slot name="tip">（{{ tip }}）</slot>
      </div>
    </div>

    <div class="tip-dialog__confirm" @click="handleConfirm">
      {{ confirmText }}
    </div>

    <div v-if="showNoRemind" class="tip-dialog__remind" @click="noRemind = !noRemind">
      <span v-if="noRemind" class="tip-dialog__remind-checked">
        <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M5.2 9.1L7.6 11.5L12.8 6.3"
            stroke="#ffffff"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
        </svg>
      </span>
      <span v-else class="tip-dialog__remind-uncheck"></span>
      <span class="tip-dialog__remind-text">本日不再提示</span>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
// @ts-ignore
import { getToday } from '@/utils/common'
// @ts-ignore
import { useStore } from 'vuex'

interface Props {
  modelValue: boolean
  title?: string
  subtitle?: string
  content?: string
  tip?: string
  confirmText?: string
  showClose?: boolean
  showNoRemind?: boolean
  noRemindKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '贴心提示',
  subtitle: '',
  content: '',
  tip: '',
  confirmText: '确认',
  showClose: true,
  showNoRemind: true,
  noRemindKey: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const store = useStore()

const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const noRemind = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    if (val) noRemind.value = false
  }
)

const persistNoRemind = () => {
  if (!props.showNoRemind || !props.noRemindKey || !noRemind.value) return
  const userId = store?.state?.user?.infoData?.id ?? ''
  const payload = { date: getToday(), userId }
  localStorage.setItem(props.noRemindKey, JSON.stringify(payload))
}

const handleClose = () => {
  persistNoRemind()
  visible.value = false
  emit('close')
}

const handleConfirm = () => {
  persistNoRemind()
  visible.value = false
  emit('confirm')
}

const onClosed = () => {
  noRemind.value = false
}
</script>

<script lang="ts">
// @ts-ignore
import { getToday as _getToday } from '@/utils/common'

export const isTipDialogMutedToday = (noRemindKey: string, userId?: string | number) => {
  if (!noRemindKey) return false
  try {
    const raw = localStorage.getItem(noRemindKey)
    if (!raw) return false
    const info = JSON.parse(raw)
    const sameDay = info?.date === _getToday()
    const sameUser = userId == null ? true : info?.userId === userId
    return sameDay && sameUser
  } catch {
    return false
  }
}
</script>

<style lang="scss">
.tip-dialog {
  background: transparent;
  box-shadow: none;
  border-radius: 16px;
  overflow: visible;
  padding: 0;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    position: relative;
    padding: 60px 24px 24px;
    background: linear-gradient(180deg, #ffc1d0 0px, #ffffff 120px);
    border-radius: 16px;
    color: #333333;
  }

  &__bell {
    position: absolute;
    top: -46px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: auto;
    pointer-events: none;
    user-select: none;
  }
  
  &__close {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    // background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;

  
  }

  &__header {
    text-align: center;
    margin-bottom: 20px;
  }

  &__title {
    font-size: 24px;
    font-weight: 600;
    color: #333333;
    line-height: 1.4;
  }

  &__subtitle {
    margin-top: 6px;
    font-size: 18px;
    font-weight: 400;
    color: #666666;
    line-height: 1.4;
  }

  &__card {
    background: #fff3f6;
    border-radius: 16px;
    padding: 20px 16px;
    text-align: center;
    margin-bottom: 24px;
  }

  &__content {
    font-size: 18px;
    font-weight: 500;
    color: #333333;
    line-height: 1.6;
    white-space: pre-line;
    word-break: break-word;
  }

  &__tip {
    margin-top: 14px;
    font-size: 15px;
    color: #666666;
    line-height: 1.4;
  }

  &__confirm {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    background: #d02d54;
    border-radius: 999px;
    color: #ffffff;
    font-size: 20px;
    font-weight: 400;
    cursor: pointer;
    user-select: none;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }

  &__remind {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666666;
    font-size: 13px;
    cursor: pointer;
    user-select: none;

    &-uncheck,
    &-checked {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-sizing: border-box;
    }

    &-uncheck {
      border: 1.5px solid #666;
      background: transparent;
    }

    &-checked {
      background: #d02d54;
      border: 1.5px solid #d02d54;
    }

    &-checked svg {
      width: 14px;
      height: 14px;
      display: block;
    }
  }
}
</style>
