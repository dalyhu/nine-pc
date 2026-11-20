<template>
  <el-tooltip
    :content="text"
    :disabled="!truncated"
    placement="top"
    :show-after="200"
    popper-class="ai_preset_tooltip"
  >
    <button
      ref="btnRef"
      class="preset_btn"
      :class="[variant, { disabled }]"
      data-ai-item
      @mouseenter="checkTruncation"
      @click="onClick"
    >
      <span ref="textRef" class="preset_btn_text">{{ text }}</span>
      <span v-if="variant === 'grid'" class="preset_btn_arrow">↗</span>
    </button>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  text: string
  disabled?: boolean
  variant?: 'row' | 'grid'
}>()

const emit = defineEmits<{ (e: 'click'): void }>()

const btnRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const truncated = ref(false)

function checkTruncation() {
  const el = textRef.value
  if (!el) return
  truncated.value = el.scrollWidth > el.clientWidth + 1
}

function onClick() {
  if (props.disabled) return
  emit('click')
}

watch(
  () => props.text,
  () => {
    truncated.value = false
    nextTick(checkTruncation)
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.preset_btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 1px solid #e4e9f1;
  border-radius: 8px;
  padding: 8px 10px 9px 10px;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 11px;
  color: #333;
  line-height: 100%;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
  max-width: 159px;
  margin: 0;
  transition: border-color 0.15s, color 0.15s;

  &:hover:not(.disabled) {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.grid {
    width: 100%;
    max-width: none;
    justify-content: space-between;
    padding: 10px 10px;
  }

  .preset_btn_text {
    flex: 1;
    min-width: 0;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .preset_btn_arrow {
    color: #b5b5b5;
    flex-shrink: 0;
    font-size: 12px;
    line-height: 1;
  }
}
</style>
