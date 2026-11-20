<template>
  <div class="vote-record-panel">
    <el-empty v-show="!list.length" image="/static/images/spaceAndMine/emptyBox.png">
      <el-text style="color: #666">您目前还没有投票记录唷！</el-text>
    </el-empty>
    <div class="card" v-for="(item, i) in list" :key="item.id ?? 'vote-' + i">
      <div class="workIdStatus">
        <el-text type="info">投票活动标题</el-text>
        <el-text size="small" style="color: #999; font-size: 14px">{{ item.created_at }}</el-text>
        <el-text size="large" style="color: #333">{{ item.title }}</el-text>
      </div>
      <div class="choice">
        <el-text class="distributionAccount">
          <div v-show="item.status === 2">派发账号：{{ item.xing }}</div>
        </el-text>
        <el-text class="lottery">开奖选择：{{ item.right_option_name }}</el-text>
        <el-text class="myAnswer">我的选择：{{ item.user_option_name }}</el-text>
      </div>
      <div class="result" :class="{ resultGet: item.status === 2 }">
        <el-image
          class="image-smile"
          :src="`/static/images/${item.status === 2 ? 'pink' : 'black'}Smile.png`"
        ></el-image>
        <el-text size="large" :style="{ color: item.status === 2 ? '#d02d54' : '#333' }">
          结果：
          {{ item.status === 2 ? `命中奖金${item.in_bonus}元` : item.status_str }}
        </el-text>
      </div>
    </div>
    <div ref="loadMoreEl" class="viewPort" v-show="hasNextPage">
      <el-icon class="is-loading"><Loading /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'
import { voteRecordApi } from '@/api'
import { getToday, getOneMonth } from '@/utils/common'

const props = defineProps<{
  dateRange: string[] | null
}>()

const list = ref<any[]>([])
const page = ref(1)
const hasNextPage = ref(false)
const isLoading = ref(false)
const loadMoreEl = ref<HTMLElement | null>(null)

let requestSeq = 0

function getQueryRange() {
  const dr = props.dateRange
  if (!dr || !Array.isArray(dr) || dr.length < 2) return { start: '', end: '' }
  return { start: dr[0] ?? '', end: dr[1] ?? '' }
}

function fetchPage(pageNum: number) {
  const { start, end } = getQueryRange()
  return voteRecordApi({
    page: pageNum,
    start_time: (start || getOneMonth(getToday())) + ' 00:00:00',
    end_time: (end || getToday()) + ' 23:59:59'
  })
}

async function loadFirstPage() {
  const seq = ++requestSeq
  page.value = 1
  isLoading.value = true
  try {
    const res = await fetchPage(1)
    if (seq !== requestSeq) return
    list.value = Array.isArray(res.data.data) ? res.data.data : []
    hasNextPage.value = res.data.last_page > res.data.current_page
  } catch {
    if (seq !== requestSeq) return
    list.value = []
    hasNextPage.value = false
  } finally {
    if (seq === requestSeq) isLoading.value = false
  }
}

function applyAppend(res: { data: { data: unknown; last_page: number; current_page: number } }) {
  const rows = Array.isArray(res.data.data) ? res.data.data : []
  list.value.push(...rows)
  hasNextPage.value = res.data.last_page > res.data.current_page
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || !hasNextPage.value || isLoading.value) return
    isLoading.value = true
    page.value += 1
    const p = page.value
    const seq = requestSeq
    fetchPage(p)
      .then((res) => {
        if (seq !== requestSeq) return
        applyAppend(res)
      })
      .catch(() => {
        if (seq !== requestSeq) return
        page.value = Math.max(1, page.value - 1)
      })
      .finally(() => {
        if (seq === requestSeq) isLoading.value = false
      })
  })
})

onMounted(async () => {
  await loadFirstPage()
  await nextTick()
  const el = loadMoreEl.value
  if (el) observer.observe(el as unknown as Element)
})

onUnmounted(() => {
  observer.disconnect()
})

watch(
  () => props.dateRange,
  () => {
    loadFirstPage()
  },
  { deep: true }
)

defineExpose({
  reloadFirstPage: loadFirstPage
})
</script>

<style scoped lang="scss">
.vote-record-panel {
  display: flex;
  flex-flow: column;
  gap: 8px;
}
.card {
  padding: 18px 16px;
  border: 1px solid #eff0f3;
  border-radius: 8px;
  .workIdStatus {
    display: grid;
    gap: 4px;
    align-items: center;
  }
  .choice {
    display: grid;
    grid-template-columns: auto;
    justify-content: space-between;
    border: 1px solid #f4f4f4;
    border-width: 1px 0;
    padding: 8px 0;
    margin: 6px 0;
    gap: 8px 6px;
  }
  .distributionAccount {
    grid-column: 1 / 3;
    font-size: 16px;
    color: #666;
  }
  .lottery {
    color: #d02d54;
    font-weight: 400;
    font-size: 16px;
  }
  .myAnswer {
    color: #4b8efd;
    font-weight: 400;
    font-size: 16px;
  }
  .result {
    padding: 8px 0;
    text-align: center;
    border-radius: 4px;
    background: #e8e8e8;
    .image-smile {
      width: 24px;
      margin-right: 4px;
      vertical-align: middle;
    }
  }
  .result.resultGet {
    background: #faeaee;
  }
}
.viewPort {
  text-align: center;
  height: 60px;
  line-height: 60px;
}
</style>
