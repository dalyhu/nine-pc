<template>
  <div v-if="visible" class="ai_preset_wrap">
    <!-- 默认态：透明，融合在操作面板里 -->
    <div v-show="!expanded" class="ai_preset_default">
      <div class="ai_preset_header">
        <span class="ai_preset_title">你可以这样问</span>
        <el-icon class="ai_preset_close" @click="onClose"><Close /></el-icon>
      </div>
      <div class="ai_preset_row_mode" ref="rowContainer">
        <PresetBtn
          v-for="q in list.slice(0, visibleCount)"
          :key="q.id"
          :text="q.text"
          :disabled="!canClick"
          variant="row"
          @click="pick(q)"
        />
        <button
          v-if="hasOverflow"
          class="ai_preset_more_btn"
          data-ai-item
          @click="expanded = true"
        >
          更多 &gt;
        </button>
      </div>
    </div>

    <!-- 展开态：白底浮层，居工具栏上方 8-12px -->
    <div v-if="expanded" class="ai_preset_expanded">
      <div class="ai_preset_header ai_preset_header_expanded">
        <span class="ai_preset_title_expanded">更多常见问题</span>
        <el-icon class="ai_preset_close_boxed" @click="onClose"><Close /></el-icon>
      </div>
      <div class="ai_preset_grid_mode">
        <PresetBtn
          v-for="q in list"
          :key="q.id"
          :text="q.text"
          :disabled="!canClick"
          variant="grid"
          @click="pick(q)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { CHAT_TYPE } from '@/enums'
import HomedApi from '@/api/home'
import PresetBtn from './presetBtn.vue'
import { useAiMock, type AiCategory } from './mock'

const props = defineProps<{
  chatType: number
  vid: string
  uid: number
  isReady: boolean
  isMute: boolean
}>()

const emit = defineEmits<{
  (e: 'select', question: AiCategory): void
  (e: 'visibility-change', payload: { visible: boolean; expanded: boolean }): void
}>()

const list = ref<AiCategory[]>([])
const closed = ref(false)
const expanded = ref(false)
const visibleCount = ref(0)
const rowContainer = ref<HTMLElement | null>(null)

const canClick = computed(() => props.isReady && !props.isMute)
const hasOverflow = computed(() => visibleCount.value < list.value.length)
const visible = computed(
  () =>
    !closed.value &&
    props.chatType === CHAT_TYPE.ANCHOR_PRIVATE &&
    list.value.length > 0
)

let ro: ResizeObserver | null = null
let measuring = false
let lastWidth = 0

async function fetchList() {
  if (props.chatType !== CHAT_TYPE.ANCHOR_PRIVATE) {
    list.value = []
    return
  }
  const mocked = useAiMock()
  if (mocked !== null) {
    list.value = [...mocked].sort((a, b) => (b.sort ?? 0) - (a.sort ?? 0))
    closed.value = false
    expanded.value = false
    visibleCount.value = list.value.length
    await nextTick()
    measure()
    return
  }
  try {
    const res: any = await HomedApi.getAiCategoryList()
    const data: AiCategory[] = Array.isArray(res?.data) ? res.data : []
    list.value = [...data].sort((a, b) => (b.sort ?? 0) - (a.sort ?? 0))
    closed.value = false
    expanded.value = false
    visibleCount.value = list.value.length
    await nextTick()
    measure()
  } catch {
    list.value = []
  }
}

async function measure() {
  if (!rowContainer.value || list.value.length === 0) return
  if (measuring) return
  measuring = true
  try {
    await doMeasure()
  } finally {
    measuring = false
  }
}

async function doMeasure() {
  visibleCount.value = list.value.length
  await nextTick()

  const container = rowContainer.value
  if (!container) return
  const items = container.querySelectorAll<HTMLElement>('[data-ai-item]')
  if (!items.length) return

  // 找出第 3 行首个 item：offsetTop 出现第 3 个唯一值
  const rowTops = new Set<number>()
  let firstThirdRowIdx = -1
  for (let i = 0; i < items.length; i++) {
    rowTops.add(items[i].offsetTop)
    if (rowTops.size > 2) {
      firstThirdRowIdx = i
      break
    }
  }
  if (firstThirdRowIdx === -1) return // 全部塞得下，不显示「更多 >」

  visibleCount.value = firstThirdRowIdx
  await nextTick()

  // 「更多 >」按钮进来后可能自身撑到第 3 行，往前踢
  while (visibleCount.value > 0) {
    const all = container.querySelectorAll<HTMLElement>('[data-ai-item]')
    const tops = new Set(Array.from(all).map(el => el.offsetTop))
    if (tops.size <= 2) break
    visibleCount.value--
    await nextTick()
  }
}

function onClose() {
  if (expanded.value) {
    expanded.value = false
  } else {
    closed.value = true
  }
}

function pick(q: AiCategory) {
  if (!canClick.value) return
  expanded.value = false
  emit('select', q)
}

onMounted(() => {
  fetchList()
})

onBeforeUnmount(() => {
  ro?.disconnect()
  ro = null
})

watch(
  () => [props.chatType, props.vid, props.uid],
  () => fetchList()
)

watch(rowContainer, el => {
  ro?.disconnect()
  ro = null
  lastWidth = 0
  if (!el) return
  ro = new ResizeObserver(entries => {
    const width = entries[0]?.contentRect.width ?? 0
    if (width === 0 || width === lastWidth) return
    lastWidth = width
    measure()
  })
  ro.observe(el)
})

// 通知父组件（chatDetail）调整消息区 padding-bottom 和贴底
watch(
  [visible, expanded],
  ([v, e]) => emit('visibility-change', { visible: v, expanded: e }),
  { immediate: true, flush: 'post' }
)
</script>

<style lang="scss" scoped>
.ai_preset_wrap {
  width: 100%;
  box-sizing: border-box;
}

/* -------------------- 默认态 -------------------- */
.ai_preset_default {
  padding: 8px 12px;
  max-height: 110px;
  background: #fff;
  box-sizing: border-box;
}

.ai_preset_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 15px;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.ai_preset_title {
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 600;
  font-size: 11px;
  color: #666;
  line-height: 100%;
}

.ai_preset_close {
  width: 14px;
  height: 14px;
  color: #999;
  cursor: pointer;

  &:hover {
    color: #666;
  }
}

.ai_preset_row_mode {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  overflow: hidden;
  align-content: flex-start;
}

.ai_preset_more_btn {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 8px 10px 9px 10px;
  background: #f5f5f7;
  border: none;
  border-radius: 8px;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 11px;
  color: #999;
  line-height: 100%;
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  box-sizing: border-box;
  margin: 0;

  &:hover {
    color: #666;
  }
}

/* -------------------- 展开态 -------------------- */
.ai_preset_expanded {
  height: 252px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e4e9f1;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.ai_preset_header_expanded {
  height: auto;
  margin-bottom: 12px;
}

.ai_preset_title_expanded {
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  line-height: 100%;
}

.ai_preset_close_boxed {
  width: 24px;
  height: 24px;
  padding: 4px;
  color: #999;
  background: #f5f5f7;
  border-radius: 6px;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    color: #666;
  }
}

.ai_preset_grid_mode {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  overflow-y: auto;
  flex: 1 1 auto;
  min-height: 0;
  align-content: start;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
  }
}
</style>
