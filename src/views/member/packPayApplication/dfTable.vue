<template>
  <div class="df_table">
    <div class="show-time">
      <el-date-picker
        v-model="currentTime"
        type="datetimerange"
        range-separator="-"
        size="large"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="handleChnageTime"
      ></el-date-picker>
    </div>
    <el-table
      :data="tableData.data"
      :maxHeight="510"
      :border="true"
      :cell-class-name="cellClassName"
      :header-cell-style="{
        backgroundColor: '#878b9d',
        color: '#fff'
      }"
    >
      <el-table-column fixed align="center" label="投票ID" prop="id"> </el-table-column>
      <el-table-column fixed width="100" align="center" label="日期" prop="created_at">
        <template #default="{ row }">
          <span> {{ getFormDate(row.created_at, 'YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed width="80" align="center" label="时间" prop="created_at">
        <template #default="{ row }">
          <span> {{ getFormDate(row.created_at, 'HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        width="200"
        align="center"
        :show-overflow-tooltip="true"
        label="直播间"
        prop="live_title"
      >
      </el-table-column> -->
      <el-table-column width="160" align="center" label="投票问题" prop="title"> </el-table-column>
      <!-- <el-table-column width="48" align="center" label="罚球">
        <template #default="{ row }">
          <span> {{ row.free_throw }}/{{ row.free_throw_shots }} </span>
        </template>
      </el-table-column> -->
      <el-table-column width="100" align="center" label="您的投票" prop="user_option_name">
      </el-table-column>
      <el-table-column align="center" label="状态" prop="vote_status_str"> </el-table-column>
      <el-table-column width="100" align="center" label="最终答案" prop="right_option_name">
      </el-table-column>
      <el-table-column align="center" label="结果" prop="status_str"> </el-table-column>
      <el-table-column width="100" align="center" label="瓜分奖金" prop="in_bonus">
      </el-table-column>
      <el-table-column width="160" align="center" label="奖金发送时绑定账号" prop="xing">
      </el-table-column>
      <template #empty>
        <DfEmpty />
      </template>
    </el-table>
    <div class="page_box flex-center">
      <el-pagination
        background
        v-model:current-page="tableData.current_page"
        layout="prev, pager, next"
        :page-size="tableData.per_page"
        :total="tableData.total"
        @change="voteList()"
      />
    </div>
  </div>
</template>

<script setup name="dfTable" lang="ts">
import { activityVoteLog } from '@/api/activities.js'
import { getFormDate } from '@/utils/common'
const props = defineProps({
  selectId: {
    type: Number,
    default: 0
  }
})

const tableData = ref({
  data: [],
  current_page: 1,
  per_page: 20,
  total: 0
})

const currentTime = ref<[Date, Date]>([])

function cellClassName({ row, column, columnIndex }) {
  if ([5, 7].includes(columnIndex)) {
    if (['已结束', '猜错'].includes(row[column.property])) {
      return 'color_red'
    } else {
      return 'color_green'
    }
  }
}

function handleChnageTime() {
  voteList()
}

function voteList() {
  let params = {
    page: tableData.value.current_page,
    start_time: currentTime.value?.[0],
    end_time: currentTime.value?.[1]
  }
  activityVoteLog(params).then((res) => {
    const { data } = res
    if (data.length === 0) return
    tableData.value = data
  })
}

onMounted(() => {
  voteList()
})
</script>

<style lang="scss">
.df_table {
  padding-top: 10px;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  .el-table {
    .el-table__cell {
      background-color: #f5f6fa;
      border-right: 1px solid #d8d9dd;
      border-bottom: 1px solid #d8d9dd;
    }
    .color_red {
      color: #ff0000;
      font-weight: 600;
    }
    .color_green {
      color: #34a853;
      font-weight: 600;
    }
  }

  .page_box {
    margin: 20px 0;
  }

  .show-time {
    margin-left: auto;
    margin-bottom: 20px;
    margin-right: 10px;
  }
}
</style>
