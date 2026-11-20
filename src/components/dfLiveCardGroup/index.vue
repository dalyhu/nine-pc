<!-- 直播列表 -->
<template>
  <div class="df_live_card_group" ref="rootEl" :style="{ minWidth: minWidth + 'px' }">
    <div
      class="operation_btn"
      v-if="!wrap"
      @click="scroll(-1)"
      :style="{ width: btnSize + 'px', height: btnSize + 'px' }"
    >
      <ArrowLeftBold />
    </div>
    <div
      class="df_live_card_group_content hide_scrollbar"
      ref="listEl"
      :style="{ width: listElWidth + 'px' }"
    >
      <div
        v-for="(list, index) in displayData"
        class="df_live_card_group_list"
        :class="{ nowrap: !wrap }"
        :key="index"
      >
        <div
          v-for="item in list"
          :key="item.id"
          class="df_live_card_group_item"
          :style="{ width: itemElWidth + 'px' }"
        >
          <dfLiveCardItem :item="item" :isIndex="isIndex" />
        </div>
      </div>
    </div>
    <div
      class="operation_btn"
      v-if="!wrap"
      @click="scroll(1)"
      :style="{ width: btnSize + 'px', height: btnSize + 'px' }"
    >
      <ArrowRightBold />
    </div>
  </div>
</template>
<script setup name="DfLiveCardGroup" lang="ts">
import dfLiveCardItem from '@/components/dfLiveCardItem/index.vue'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { useDebounceFn, useScroll } from '@vueuse/core'
import { divide, add, subtract } from 'lodash-es'

defineOptions({
  name: 'DfLiveCardGroup',
  inheritAttrs: true
})

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  rows: {
    type: Number,
    default: 1
  },
  cols: {
    type: Number,
    default: 5
  },
  wrap: {
    type: Boolean,
    default: true
  },
  colMinWidth: {
    type: Number,
    default: 160
  },
  minWidth: {
    type: Number,
    default: 800
  },
  btnSize: {
    type: Number,
    default: 28
  },
  isIndex: {
    type: Boolean,
    default: false
  }
})

const rootEl = ref<HTMLDivElement>()
const listEl = ref<HTMLDivElement>()
const listElWidth = ref(0)
const itemElWidth = ref(0)
const resizeObserver = ref()

const { isScrolling } = useScroll(listEl)

const displayData = computed(() => {
  let group: Array<NormalModel[]> = []
  let i = -1

  props.list.forEach((item: NormalModel) => {
    
    i++
    if (i >= props.rows) i = 0
    if (group[i]) group[i].push({ ...item })
    else group[i] = [{ ...item }]
  })

  return group
})

const debouncedResize = useDebounceFn(onResize, 100)

onMounted(() => {
  resizeObserver.value = new ResizeObserver(debouncedResize)
  resizeObserver.value.observe(rootEl.value)
})

onBeforeUnmount(() => {
  resizeObserver.value?.disconnect()
})

function scroll(direction) {
  if (isScrolling.value) return

  let left

  if (direction === -1) {
    left = Math.floor(subtract(listEl.value.scrollLeft, listElWidth.value))
  } else {
    left = Math.floor(add(listEl.value.scrollLeft, listElWidth.value))
  }

  listEl.value.scrollTo({
    left,
    behavior: 'smooth'
  })
}

function onResize(entries) {
  const listWidth = subtract(entries[0].contentRect.width, props.wrap ? 0 : props.btnSize * 2)
  let width = 0
  let count = props.cols

  while (width < props.colMinWidth) {
    width = Math.floor(divide(listWidth, count))
    count--
  }

  listElWidth.value = width * (count + 1)
  itemElWidth.value = width
}
</script>
<style lang="scss" scoped>
.df_live_card_group {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  .operation_btn {
    flex-shrink: 0;
    color: #cdd0d6;
    cursor: pointer;
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
.df_live_card_group_content {
  position: relative;
  overflow-y: hidden;
  overflow-x: scroll;
  flex-shrink: 0;
}
.df_live_card_group_list {
  flex-wrap: wrap;
  display: flex;
  &.nowrap {
    flex-wrap: nowrap;
  }
  .df_live_card_group_item {
    padding-right: 6px;
    padding-left: 6px;
    padding-top: 12px;
    box-sizing: border-box;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }
}
</style>
