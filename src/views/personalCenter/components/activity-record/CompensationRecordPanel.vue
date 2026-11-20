<template>
  <div class="compensation-record-panel">
    <el-empty v-show="!list.length" image="/static/images/spaceAndMine/emptyBox.png">
      <el-text style="color: #666">您目前还没有活动记录唷！</el-text>
    </el-empty>
    <div class="card" v-for="item in list" :key="item.id">
      <div class="workIdStatus">
        <el-text class="workIdTitle">活动号<el-text class="workId">{{ item.id }}</el-text></el-text>
        <span class="span2" :class="tagStatus[item.status]">{{ tagText[item.status] }}</span>
        <el-text size="small" style="color: #a6a6a6">{{ item.apply_time }}</el-text>
      </div>
      <div class="vs">
        <span class="leftTeam">{{ splitTeam(item.competition_teams)[0] }}</span>
        <el-image class="image-vs" src="/static/images/vs.png" v-if="item.competition_teams"></el-image>
        <span>{{ splitTeam(item.competition_teams)[1] }}</span>
        <span class="span3">赛事：{{ item.game_name }}</span>
      </div>
      <div class="gridCol2">
        <el-text class="weightFont">单号：{{ item.order_no }}</el-text>
        <el-text class="weightFont textRight">
          金额：<span style="color: #d93b36">{{ item.raise }}</span>
        </el-text>
        <el-text>赛事类型：{{ item.game_type }}</el-text>
        <el-text class="textRight">派发账号：{{ item.account || '无' }}</el-text>
        <el-text class="live-room">直播间：{{ item.live_room }}</el-text>
        <div
          v-if="item?.files_path?.length"
          class="view-screenshot"
          @click="previewScreenshots(item.files_path)"
        >
          查看上传截图
        </div>
      </div>
      <div class="applyAgain" v-show="item.status === 2 || item.status === 3">
        <span
          class="remark"
          :class="{ remarkSpan2: item.reorder != false && item.status != 2 }"
          v-show="item.status === 2 || item.status === 3"
          >备注：{{ item.mark }}</span
        >
        <el-button
          class="reReply"
          v-if="item.reorder === false && item.status === 2"
          type="primary"
          size="small"
          @click="handleRequest(item)"
          >重新申请</el-button
        >
      </div>
    </div>
    <div ref="loadMoreEl" class="viewPort" v-show="hasNextPage">
      <el-icon class="is-loading"><Loading /></el-icon>
    </div>

    <GrauantedForm
      v-model:isGrauantedShow="grauantedShow"
      :sub-item-id="currentItem?.event_id"
      :live-room="currentItem?.live_room_id"
      :change-notify-id="currentItem?.id"
      @change="onReapplySuccess"
    />
    <teleport to="body">
      <el-image-viewer
        v-if="showScreenshotViewer"
        hide-on-click-modal
        :url-list="screenshotViewerList"
        @close="showScreenshotViewer = false"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'
import GrauantedForm from '@/views/anchor/components/activities/grananted-form.vue'
import { compensationApi } from '@/api'
import { getToday, getOneMonth } from '@/utils/common'
import type { ListData } from '@/utils/mapping'

const props = defineProps<{
  /** 与父页日期筛选同步 */
  dateRange: string[] | null
}>()

const list = ref<any[]>([])
const page = ref(1)
const hasNextPage = ref(false)
const isLoading = ref(false)
const loadMoreEl = ref<HTMLElement | null>(null)

let requestSeq = 0

const tagStatus = ['', 'successTag', 'dangerTag', 'cancelTag', 'infoTag']
const tagText = ['', '已发放', '已驳回', '已取消', '登记成功，仅需等待审核']

const splitTeam = (str = '') => str.split(' - ')

const showScreenshotViewer = ref(false)
const screenshotViewerList = ref<string[]>([])

function previewScreenshots(filesPath: string[]) {
  screenshotViewerList.value = filesPath
  showScreenshotViewer.value = true
}

const currentItem = ref<ListData>()
const grauantedShow = ref(false)

function onReapplySuccess(id: number) {
  const item = list.value.find((x) => x.id === id)
  if (item) item.status = 4
}

function handleRequest(item: ListData) {
  currentItem.value = item
  grauantedShow.value = true
}

function getQueryRange() {
  const dr = props.dateRange
  if (!dr || !Array.isArray(dr) || dr.length < 2) return { start: '', end: '' }
  return { start: dr[0] ?? '', end: dr[1] ?? '' }
}

function fetchPage(pageNum: number) {
  const { start, end } = getQueryRange()
  return compensationApi({
    page: pageNum,
    per_page: 10,
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
.compensation-record-panel {
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
    grid-template:
      'a b' auto
      'c b' auto / 1fr auto;
    gap: 4px;
    align-items: center;
    .span2 {
      display: inline-block;
   
      line-height: 1.13;
      grid-column: 2 / -1;
      grid-row: -3 / -1;
      font-size: 16px;
      padding: 8px 8px;
      text-align: center;
      border-radius: 4px;
    }
    .successTag {
      color: #23c45d;
      background-color: #def6e7;
    }
    .infoTag {
      color: #367df1;
      background-color: #e1ecfc;
    }
    .cancelTag {
      color: #999;
      background-color: #e8e8e8;
    }
    .dangerTag {
      color: #e23434;
      background-color: #fcebeb;
    }
    .workIdTitle {
      font-size: 14px;
      color: #6666;
      .workId {
        margin-left: 4px;
        font-size: 18px;
        color: #333;
        font-weight: 400;
      }
    }
  }
  .vs {
    display: grid;
    grid-template-columns: auto auto 1fr;
    justify-content: start;
    border: 1px solid #f4f4f4;
    border-width: 1px 0;
    font-size: 18px;
    font-weight: 400;
    color: #333;
    padding: 8px 0;
    margin: 4px 0;
    gap: 8px 4px;
    .leftTeam {
      border-left: 2px solid #d02d54;
      padding-left: 8px;
    }
    .image-vs {
      width: 24px;
      vertical-align: middle;
    }
    .span3 {
      grid-column: 1 / -1;
      color: #666;
      font-size: 16px;
      font-weight: 400;
      padding-left: 12px;
    }
  }
  .gridCol2 {
    display: grid;
    grid-template-columns: 1fr auto;
    justify-content: space-between;
    gap: 8px;
    padding: 0 12px 0;
    .weightFont {
      color: #666;
      font-weight: 400;
      font-size: 18px;
    }
    .textRight {
      text-align: right;
      font-size: 16px;
    }
    .live-room {
      grid-column: 1 / -1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 16px;
      color: #666;
    }
    .view-screenshot {
      grid-column: 1 / -1;
      margin-top: 4px;
      padding: 8px 0;
      text-align: center;
      border-top: 1px solid #f2f5fc;
      border-bottom: 1px solid #f2f5fc;
      font-size: 14px;
      color: #367df1;
      cursor: pointer;
    }
  }
  .applyAgain {
    display: grid;
    grid-template-columns: 1fr auto;
    border-top: 1px solid #f4f4f4;
    padding-top: 8px;
    .remark {
      color: #d02d54;
      font-size: 14px;
      line-height: 22px;
      border-radius: 4px;
      padding: 4px 0 4px 12px;
      background: linear-gradient(to right, #f9eaee, #ffffffff);
      word-wrap: break-word;
      word-break: break-all;
    }
    .remarkSpan2 {
      grid-column: 1 / -1;
    }
    .reReply {
      margin: auto 0;
      background: #d02d54;
    }
  }
}
.viewPort {
  text-align: center;
  height: 60px;
  line-height: 60px;
}
</style>
