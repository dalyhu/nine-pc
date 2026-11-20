<template>
  <el-dialog v-model="innerVisible" width="966" :show-close="false" align-center :close-on-click-modal="false">
    <div class="choice">{{gameType.find(x => x.value === form.type)?.label}}&gt;选择赛事</div>
    <el-table v-loading="loading" :data="tableData" max-height="460" class-name="tableName" style="margin: 8px 0;" @row-click="setRadio">
      <el-table-column prop="operation" label="" width="40" align="center">
        <template #default="{row}"><div class="radioTable" :class="{radioTrue: row.id === radioId}"></div></template>
      </el-table-column>
      <el-table-column prop="competition_name_zh" label="赛事名称" width="">
        <template #default="{row}">
          <div class="leftIcon" :title="row.competition_name_zh">
            <img v-if="row.isShow" class="iconTv" src="/static/images/spaceAndMine/iconTv.svg">
            <span v-else class="widthSpace"></span>
            {{ row.competition_name_zh || row.series_name_zh }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="match_time" label="比赛时间" width="154">
        <template #default="{row}">
          <div style="color: #999;" v-if="form.type === 3">{{ formatDate(row.match_time)}}</div>
          <div style="color: #999;" v-else>{{ row.match_date }} {{row.match_time}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="home_team_name_zh" label="主队名称" width="184" align="right">
        <template #default="{row}">{{ row.home_team_name_zht || row.home_team_name_zh }}</template>
      </el-table-column>
      <el-table-column prop="|" label="|" width="32">
        <template #header><div class="fixedWidth">|</div></template>
        <template #default><div class="fixedWidth">|</div></template>
      </el-table-column>
      <el-table-column prop="away_team_name_zh" label="客队名称" width="184" align="left">
        <template #default="{row}">{{ row.away_team_name_zht || row.away_team_name_zh }}</template>
      </el-table-column>
      <template #empty>
        <el-empty image="/static/images/spaceAndMine/emptyBox.png" description="暂无赛事">
          <el-text style="color: #666">您目前还没有赛事唷！</el-text>
        </el-empty>
      </template>
    </el-table>
    <div class="btnGrp">
      <div class="btn" @click="setInnerVisible()">取消</div>
      <div class="btn btnConfirm" @click="setCompetition()">确认</div>
    </div>
  </el-dialog>
</template>

<script setup>
import { basketballListApi, footballListApi, matchListApi } from '@/api'
import { formatDate } from '@/utils/common'
const form = defineModel('form')
const prop = defineProps(['gameType', 'isCheck', 'isCheckCopy'])
let gameType = toRef(prop, 'gameType')
let isCheck = toRef(prop, 'isCheck')
let isCheckCopy = toRef(prop, 'isCheckCopy')
const innerVisible = ref(false)
const tableData = reactive([])
const loading = ref(false)
const radioId = ref(undefined)
let item = {}
let timer = undefined
let requestSeq = 0

const setRadio = row => {
  radioId.value = row.id
  item = toRaw(row)
}
const titlePlus = item => {
  let title = item.home_team_name_zht && item.away_team_name_zht ?
              item.home_team_name_zht + ' vs ' + item.away_team_name_zht :
              item.home_team_name_zh + ' vs ' + item.away_team_name_zh
  return title
}
const setCompetition = () => {
  if (Object.keys(item).length > 0) {
    form.value.match_id = item.id
    form.value.competition_name_zh = item.competition_name_zh || item.series_name_zh
    form.value.title_main = isCheck.value ? titlePlus(item) : undefined
    form.value.title_sub = isCheckCopy.value ? (item.series_name_zh || item.competition_name_zh) : undefined
    form.value.starttime = form.value.type === 3 ? formatDate(item.match_time) : item.match_date + ' ' + item.match_time + ':00'
    form.value.status_str = item.status_str
    form.value.showTitle = (form.value.competition_name_zh || '')
                            + ' '
                            + (formatDate(form.value.starttime, 'YYYY-MM-DD HH:mm') || '')
                            + ' '
                            + (form.value.title_main || '')
  }
  innerVisible.value = false
  radioId.value = undefined
  item = {}
}
// 做数据切割，首次同步渲染二十条，之后每 500ms 追加二十条
const sliceData = (resoureData) => {
  if (resoureData.length <= 100) { // 小于一百条就直接全部加载
    tableData.splice(0, tableData.length, ...resoureData)
    return
  }
  // 先同步塞入第一批，避免 loading 关闭后 tableData 仍为空、el-table 渲染 #empty 的空窗期
  tableData.splice(0, tableData.length, ...resoureData.slice(0, 20))
  let i = 40
  let count = 1 // 大于10次，5s后一次性加完
  clearInterval(timer)
  timer = setInterval(() => {
    if (i >= resoureData.length || count > 10) {
      tableData.splice(0, tableData.length, ...resoureData)
      clearInterval(timer)
      timer = undefined
      return
    }
    tableData.splice(0, tableData.length, ...resoureData.slice(0, i))
    i += 20
    count += 1
  }, 500)
}
const setInnerVisible = () => {
  innerVisible.value = innerVisible.value ? false : true
  clearInterval(timer)
}
// 按当前直播分类实时请求赛事列表
const fetchMatchList = (type, gameSort) => {
  if (type === 0) {
    // 足球：仅显示1 ~ 7状态的数据
    const status = [1, 2, 3, 4, 5, 6, 7]
    const show = [2, 3, 4, 5, 6, 7]
    return footballListApi().then(res => res.data
      .filter(item => status.includes(item.status))
      .map(item => ({...item, isShow: show.includes(item.status)}))
    )
  }
  if (type === 1) {
    // 篮球：仅显示1 ~ 9状态的数据
    const status = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const show = [2, 3, 4, 5, 6, 7, 8, 9]
    return basketballListApi().then(res => res.data
      .filter(item => status.includes(item.status))
      .map(item => ({...item, isShow: show.includes(item.status)}))
    )
  }
  if (type === 3) {
    // 电竞：仅显示0，1状态的数据。gameSort未选时传0（后端返回全量电竞赛事）
    const status = [0, 1]
    return matchListApi(gameSort).then(res => res.data
      .filter(item => status.includes(item.status))
      .map(item => ({...item, isShow: item.status === 1}))
    )
  }
  return Promise.resolve([])
}
const openSubModal = async () => {
  // 先打开弹窗，用户立即看到反馈（loading 状态在表格内显示）
  setInnerVisible()
  const seq = ++requestSeq
  loading.value = true
  tableData.splice(0, tableData.length)
  try {
    const list = await fetchMatchList(form.value.type, form.value.gameSort)
    // 防竞态：只应用最新一次请求的结果
    if (seq !== requestSeq) return
    sliceData(list)
  } catch (e) {
    if (seq !== requestSeq) return
    tableData.splice(0, tableData.length)
    ElMessage.error(e?.msg || '赛事列表加载失败')
  } finally {
    if (seq === requestSeq) loading.value = false
  }
}

defineExpose({openSubModal})
</script>

<style scoped lang="scss">
.choice {
  color: #3f3f3f;
  font-size: 16px;
  font-weight: 600;
  padding: 8px;
}
.btnGrp {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 32px 0 16px 0;
  .btn {
    width: 128px;
    height: 38px;
    line-height: 38px;
    font-size: 16px;
    font-weight: 500;
    color: #d02d54;
    border: 1px solid #d02d54;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
  }
  .btnConfirm {
    background-color: #d02d54;
    color: #fff;
  }
}
</style>
<style lang="scss">
.tableName .el-table__cell:where(th) {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  background-color: #f9fafb!important;
}
.tableName.el-table:hover {
  --el-table-row-hover-bg-color: #fdf4f6!important;
}
.tableName .el-empty {
  --el-empty-description-margin-top: 0;
  --el-empty-bottom-margin-top: 0;
}
.tableName .radioTable {
  width: 12px;
  height: 12px;
  border-radius: 12px;
  border: 1px solid #666;
  &.radioTrue {
    box-shadow: 0 0 0 3px #d02d54 inset;
    border: 1px solid #d02d54;
  }
}
.tableName .leftIcon {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  .iconTv {
    vertical-align: middle;
    width: 16px;
    margin-right: 6px;
  }
  .widthSpace {
    display: inline-block;
    width: 22px;
  }
}
.tableName .fixedWidth {
  text-align: center;
  color: #e6e7eb;
}
.tableName * {
  user-select: text;
}
</style>