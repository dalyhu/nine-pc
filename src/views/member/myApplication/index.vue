<!-- 我的申请 -->
<template>
  <div class="my-application my-person-box">
    <div class="header_nav my-person-header">
      <a v-for="item in tabList" :key="item.id">
        <div class="tab_item">
          {{ item.name }}
        </div>
      </a>
    </div>

    <div class="my-content">
      <el-form
        ref="formRef"
        :inline="true"
        :rules="rules"
        :model="ruleForm"
        class="demo-form-inline"
        label-width="auto"
      >
        <!-- 操作 -->
        <el-form-item label="操作" prop="optarion">
          <el-select
            v-model="ruleForm.optarion"
            clearable
            placeholder="全部"
            @change="handleChangeOption"
            @clear="handleChangeOption"
          >
            <el-option
              v-for="item in optionList"
              :key="item.key"
              :label="item.text"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 申请时间 -->
        <el-form-item label="申请时间" prop="applyTime">
          <el-date-picker
            v-model="ruleForm.applyTime"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="申请日期"
            clearable
            @change="handleChangeTime"
            @clear="handleChangeTime"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <!-- table -->
      <SearchTable
        :tableData="tableData"
        v-model:currentPage="currentPage"
        :total="total"
        @emitPageChange="emitPageChange"
      ></SearchTable>
    </div>
  </div>
</template>

<script setup name="myApplication">
import SearchTable from './searchTable.vue'
import { getOperateList } from '@/api/housManage'
const tabList = [
  {
    name: '我的申请',
    di: 'apply'
  }
]
const currentPage = ref(1)
const total = ref(0)
const currentPageSize = ref(10)
const tableData = ref([])
const ruleForm = ref({
  optarion: '',
  applyTime: ''
})
const optionList = [
  { text: '拉黑', key: 'block' },
  { text: '禁言', key: 'mute' },
  { text: '删除', key: 'delete' }
]

const rules = reactive({})

const handleChangeOption = (val) => {
  console.log(val, 'handleChangeOption')
  ruleForm.value.optarion = val
  init()
}

const handleChangeTime = (val) => {
  console.log(val, 'handleChangeTime')
  ruleForm.value.applyTime = val
  init()
}

const emitPageChange = (val) => {
  currentPage.value = val
  init()
}

const init = () => {
  getOperateList({
    action: !ruleForm.value.optarion ? 'all' : ruleForm.value.optarion,
    page: currentPage.value,
    page_size: currentPageSize.value,
    apply_time: ruleForm.value.applyTime // 申请日期
  })
    .then((res) => {
      const { code, data } = res
      if (code === 0) {
        tableData.value = data.data
        total.value = data.total
        currentPage.value = data.current_page
      }
    })
    .catch((error) => {
      tableData.value = []
      total.value = 0
      currentPage.value = 1
      ElMessage.warning(error.msg)
    })
}
onMounted(() => {
  init()
})
</script>

<style scoped lang="scss">
@import './index.scss';
@import '../my-person-header.scss';
.demo-form-inline {
  text-align: left;
  .el-form-item {
    margin: 15px 10px 10px 0;
    .el-select {
      width: 220px;
    }
  }
}
</style>
