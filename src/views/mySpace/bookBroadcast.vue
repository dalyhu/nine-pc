<template>
  <div class="mainContainer">
    <div class="girdSt">
      <div class="title">直播类型：</div>
      <el-select class="type" v-model="type" placeholder="全部" @select="httpReserveLiveApi()">
        <el-option v-for="(item, i) in typeOption" :key="i" :value="item.value" :label="item.label"></el-option>
      </el-select>
      <div class="title">比赛时间：</div>
        <el-date-picker
          width="264px"
          ref="calenderRef"
          style="height: 32px;"
          v-model="dateRange"
          :clearable="true"
          type="daterange"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="httpReserveLiveApi()"
        ></el-date-picker>
      <div class="btnDIY" @click="httpReserveLiveApi()">查询</div>
      <div class="btnAddBook" @click="() => (dialogVisible = true, searchList())">
        <img class="iconBook" src="/static/images/spaceAndMine/bookBroadcast.svg">
        <span class="addBook">添加预约</span>
      </div>
    </div>
    <el-table :data="tableData" class-name="tableName" style="margin-top: 19px;">
      <el-table-column prop="name" label="赛事名称" width="" align="center">
        <template #default="{row}">
          <div class="leftIcon" :title="row.name">
            <img class="iconTv" src="/static/images/spaceAndMine/iconTv.svg">
            {{ row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="match_time" label="比赛时间" width="" align="center">
        <template #default="{row}"><div style="color: #999;">{{row.match_time}}</div></template>
      </el-table-column>
      <el-table-column prop="home_name" label="主队名称" width="184" align="right"></el-table-column>
      <el-table-column prop="|" label="|" width="32">
        <template #header><div class="fixedWidth">|</div></template>
        <template #default><div class="fixedWidth">|</div></template>
      </el-table-column>
      <el-table-column prop="away_name" label="客队名称" width="184" align="left"></el-table-column>
      <el-table-column prop="operation" label="操作" width="100" align="center">
        <template #default="{row}"><div class="btnTable" @click="deleteItem(row.id)">删除</div></template>
      </el-table-column>
      <template #empty>
        <el-empty image="/static/images/spaceAndMine/emptyBox.png" description="暂无预约">
          <el-text style="color: #666">您目前还没有预约唷！</el-text>
        </el-empty>
      </template>
    </el-table>
    <el-pagination
      class="pagination"
      background
      v-model:current-page="pageMsg.page"
      layout="prev, pager, next"
      :page-size="pageMsg.per_page"
      :pager-count="5"
      :total="pageMsg.total"
      @change="httpReserveLiveApi(pageMsg.page)"
    />

    <el-dialog v-model="dialogVisible" width="1200" :show-close="false">
      <div class="girdSt">
        <div class="title">直播类型：</div>
        <el-select class="type" v-model="typeModal" placeholder="全部" @select="searchList()">
          <el-option v-for="(item, i) in typeModalOption" :key="i" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <div class="title">比赛时间：</div>
        <el-date-picker class="time" value-format="YYYY-MM-DD" v-model="time" placeholder="比赛时间" @change="searchList()"></el-date-picker>
        <div class="btnDIY" @click="searchList()">查询</div>
      </div>
      <el-table :data="tableModalData" max-height="650" top="54px" class-name="tableName" style="margin-top: 16px;">
        <el-table-column prop="name" label="赛事名称" align="center">
          <template #default="{row}">
            <div class="leftIcon">
              <img class="iconTv" src="/static/images/spaceAndMine/iconTv.svg">
              {{ row.series_name_zh || row.competition_name_zh || row.short_name_zh }} 
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="match_time" label="比赛时间" width="" align="center">
          <template #default="{row}">
            <div style="color: #999;">
              {{ formatDate(row.match_times || row.match_time, 'YYYY-MM-DD HH:mm') }} 
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="home_name" label="主队名称" width="184" align="right">
          <template #default="{row}">
            {{ row.home_team_name_zh || row.home_team_data.short_name_zh }} 
          </template>
        </el-table-column>
        <el-table-column prop="|" label="|" width="32">
          <template #header><div class="fixedWidth">|</div></template>
          <template #default><div class="fixedWidth">|</div></template>
        </el-table-column>
        <el-table-column prop="away_name" label="客队名称" width="184" align="left">
          <template #default="{row}">
            {{ row.away_team_name_zh || row.away_team_data.short_name_zh }} 
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="100" align="center">
          <template #default="{row}">
            <div class="btnTable" @click="book(row.id)">预约</div>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty image="/static/images/spaceAndMine/emptyBox.png" description="暂无预约">
            <el-text style="color: #666">您目前还没有预约唷！</el-text>
          </el-empty>
        </template>
      </el-table>
      <el-pagination
        class="paginationDialog"
        background
        v-model:current-page="pageModalMsg.page"
        layout="prev, pager, next"
        :page-size="pageModalMsg.per_page"
        :pager-count="5"
        :total="pageModalMsg.total"
        @change="searchList(pageModalMsg.page)"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import {getReserveLiveApi, getGameVSApi, getFootballListApi, getBasketballListApi, setBookApi, deleteBookApi} from '@/api'
import { formatDate, getToday, getOneMonth } from '@/utils/common'

const type = ref(undefined)
const typeModal = ref(0)
const dateRange = ref([getToday(), getOneMonth(getToday(), true)])
const time = ref(getToday())
const pageMsg = ref({per_page: 20, page: 1, total: undefined})
const pageModalMsg = ref({per_page: 20, page: 1, total: undefined})
const typeOption = [
  {label: '全部', value: -1},
  {label: '足球', value: 0},
  {label: '篮球', value: 1},
  {label: '电竞', value: 2}
]
const typeModalOption = [
  {label: '足球', value: 0},
  {label: '篮球', value: 1},
  {label: '电竞', value: 3}
]
const tableData = reactive([])
const tableModalData = reactive([])
const dialogVisible = ref(false)

const httpReserveLiveApi = (page = 1) => {
  pageMsg.value.page = page
  const params = {type: type.value || -1, start_date: dateRange.value && dateRange.value[0], end_date: dateRange.value && dateRange.value[1], page: pageMsg.value.page}
  getReserveLiveApi(params).then((res) => {
    tableData.splice(0, tableData.length, ...res.data.data)
    pageMsg.value.per_page = res.data.per_page
    pageMsg.value.total = res.data.total || undefined
  })
}
const searchList = async (page = 1) => {
  pageModalMsg.value.page = page
  const params = {type: 2, time: time.value, page}
  const api = [getFootballListApi, getBasketballListApi, , getGameVSApi]
  const res = await api[typeModal.value](params)
  if (res.code === 0) {
    tableModalData.splice(0, tableModalData.length, ...res.data.data)
    pageModalMsg.value.per_page = res.data.per_page
    pageModalMsg.value.total = res.data.total || undefined
  }
}
const book = match_id => {
  setBookApi({match_id, type: typeModal.value}).then(res => {
    if (res.code === 0) {
      ElMessage.success('预约成功')
      httpReserveLiveApi()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
const deleteItem = id => {
  deleteBookApi({id}).then(res => {
    ElMessage.success('删除成功')
    httpReserveLiveApi()
  })
}

onMounted(() => {
  httpReserveLiveApi()
})
</script>

<style scoped lang="scss">
.mainContainer {
  padding: 35px;
  .girdSt {
    display: grid;
    grid-template-columns: auto auto auto auto auto 1fr;
    align-items: center;
    gap: 0 16px;
    .title {
      font-size: 14px;
      font-weight: 600;
      color: #3f3f3f;
    }
    .type {
      width: 142px;
    }
    .btnDIY {
      padding: 0 8px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      background-color: #d02d54;
      color: #fff;
      border-radius: 8px;
      cursor: pointer;
    }
    .btnAddBook {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 118px;
      height: 36px;
      line-height: 36px;
      border: 1px solid #333;
      border-radius: 8px;
      cursor: pointer;
      .iconBook {
        width: 24px;
        margin-right: 8px;
      }
    }
  }
  .leftIcon {
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
      margin: 0 6px 0 22px;
    }
  }
  .fixedWidth {
    text-align: center;
    color: #e6e7eb;
  }
  .btnTable {
    width: 44px;
    color: #d02d54;
    border: 1px solid red;
    border-radius: 8px;
    text-align: center;
    height: 28px;
    line-height: 28px;
    margin: 0 auto;
    cursor: pointer;
  }
}
</style>

<style lang="scss">
.el-date-editor.el-input.time {
  width: 142px;
}
.el-pagination.pagination {
  margin-top: 10px;
  justify-content: center;
}
.el-pagination.paginationDialog {
  margin-top: 10px;
  justify-content: end;
}
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
</style>