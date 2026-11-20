<template>
  <el-table
    :data="tableData"
    :border="true"
    :maxHeight="440"
    :cell-class-name="cellClassName"
    :header-cell-style="{
      backgroundColor: '#878b9d',
      color: '#fff'
    }"
  >
    <el-table-column width="50" align="center" label="ID" prop="apply_id" />
    <el-table-column
      width="100"
      align="center"
      label="直播间"
      prop="chat_room_name"
      show-overflow-tooltip
    />
    <el-table-column width="90" align="center" label="操作" prop="action"> </el-table-column>
    <el-table-column width="160" align="center" label="详情" prop="detail" show-overflow-tooltip>
    </el-table-column>
    <!-- <el-table-column width="130" align="center" label="IP" prop="ip"> </el-table-column> -->
    <el-table-column
      width="160"
      align="center"
      label="申请时间"
      prop="created_at"
      show-overflow-tooltip
    >
      <template #default="{ row }">
        <span> {{ getFormDate(row.created_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
      </template>
    </el-table-column>
    <el-table-column width="100" align="center" label="审批状态" prop="status">
      <template #default="{ row }">
        <span> {{ workBanStatus[row.status] }}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="审批备注" prop="approval_comment" show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      width="160"
      align="center"
      label="审批时间"
      prop="updated_at"
      show-overflow-tooltip
    >
    <template #default="{ row }">
        <span> {{ getFormDate(row.updated_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
      </template>
    </el-table-column>
    <!-- 空数据展示 -->
    <template #empty>
      <DfEmpty />
    </template>
  </el-table>
  <div class="page_box flex-center">
    <el-pagination
      background
      v-model:current-page="page"
      layout="prev, pager, next"
      :page-size="10"
      :total="total"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { getFormDate } from '@/utils/common'
import { workBanStatus } from '@/utils/mapping'
const emit = defineEmits(['emitPageChange'])
const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  }
})

const page = computed(() => {
  return props.currentPage
})

const handlePageChange = (newPage) => {
  emit('emitPageChange', newPage)
}
</script>

<style lang="scss" scoped>
.page_box {
  margin: 10px 0;
}
</style>
