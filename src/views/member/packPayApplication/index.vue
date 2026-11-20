<!-- 包赔记录 -->
<template>
  <div class="packPay-application my-person-box">
    <div class="header_nav my-person-header">
      <a v-for="item in tabList" :key="item.id" @click="activeTab = item.id">
        <div
          class="tab_item"
          :class="[
            { first_tab_item: activeTab === item.id },
            { 'first-active': item.id !== 'apply' }
          ]"
        >
          {{ item.name }}
        </div>
      </a>
      <p v-show="activeTab === 'vote'">
        发放奖励前请记得绑定正确体育站账号，若账号输入错误活动奖励将不补发。
      </p>
    </div>

    <template v-if="activeTab === 'apply'">
      <div class="pack-pay-content">
        <el-form
          ref="formRef"
          :inline="true"
          :model="ruleForm"
          class="demo-form-inline"
          label-width="auto"
        >
          <!-- 时间 -->
          <el-form-item label="时间" prop="applyTime">
            <el-date-picker
              v-model="ruleForm.applyTime"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              @change="handleChangeTime"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
        <!-- table -->
        <div class="user-tab-content hide_scrollbar">
          <template v-if="tableData.length">
            <RecoredList :list="tableData" @handleRequest="handleRequest"></RecoredList>
          </template>

          <DfEmpty v-else />
        </div>

        <div class="pagination">
          <el-pagination
            :background="true"
            v-model:current-page="currentPage"
            layout="prev, pager, next"
            @current-change="init"
            :total="total"
          />
        </div>
      </div>

      <!-- 申请包赔 -->
      <GrauantedForm
        v-model:isGrauantedShow="grauantedShow"
        :sub-item-id="grantedFormEventId"
        :live-room="grantedFormLiveRoom"
        :change-notify-id="grantedChangeNotifyId"
        @change="handLeChnageStauts"
      ></GrauantedForm>
    </template>

    <template v-else>
      <dfTable></dfTable>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import type { ListData } from '@/utils/mapping'
import { getFormDate } from '@/utils/common.js'
import RecoredList from './recoredList.vue'
import { getPackPayRecord } from '@/api/activities.js'
import GrauantedForm from '@/views/anchor/components/activities/grananted-form.vue'
import dfTable from './dfTable.vue'

const store = useStore()

const isLogin = computed(() => !!store.state.user.infoData.id)

const activeTab = ref('apply')

const tabList = computed(() => {
  if (isLogin.value) {
    return [
      {
        name: '包賠记录',
        id: 'apply'
      },
      {
        name: '投票记录',
        id: 'vote'
      }
    ]
  }

  return [
    {
      name: '包賠记录',
      id: 'apply'
    }
  ]
})
const tableData = ref<ListData[]>([])
const today = getFormDate(new Date().getTime(), 'YYYY-MM-DD')
const startSecoend = ' 00:00:00'
const endSecoend = ' 23:59:59'
const total = ref(0)
const currentPage = ref(1)
const currentItem = ref<(ListData & { again?: boolean }) | null>(null)
const grauantedShow = ref(false)

const grantedFormEventId = computed(() => {
  const c = currentItem.value
  if (!c?.again) return null
  const e = c.event_id ?? c.eventId
  return e != null && e !== '' ? e : c.id
})

const grantedFormLiveRoom = computed(() => {
  const c = currentItem.value
  if (!c) return null
  return c.live_room ?? c.live_room_id ?? null
})

const grantedChangeNotifyId = computed(() => {
  const c = currentItem.value
  if (!c?.again) return null
  return c.id
})

const ruleForm = ref({
  applyTime: [today, today]
})

const init = () => {
  tableData.value = []
  const params = {
    start_time: ruleForm.value.applyTime[0] + startSecoend,
    end_time: ruleForm.value.applyTime[1] + endSecoend,
    page: currentPage.value,
    per_page: 10
  }
  getPackPayRecord(params)
    .then((res: any) => {
      let { code, data } = res
      if (code === 0) {
        total.value = data.total
        tableData.value = data.data
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

const handleChangeTime = (val) => {
  if (!val) {
    ruleForm.value.applyTime = [today, today]
  }
  currentPage.value = 1
  tableData.value = []
  init()
}

// 手动隐藏重新请求按钮
const handLeChnageStauts = (id: number) => {
  const valObj = tableData.value.find((ele) => ele.id === id)
  if (valObj) {
    valObj.status = 4
  }
}

// 重新请求
const handleRequest = (item: ListData) => {
  currentItem.value = {
    ...item,
    again: true
  }
  grauantedShow.value = true
}

onMounted(() => {
  init()
})
</script>

<style scoped lang="scss">
@import './index.scss';
@import '../my-person-header.scss';

.header_nav {
  p {
    flex: 1;
    text-align: right;
    font-size: 16px;
    color: #333;
    font-weight: 700;
  }

  .first_tab_item {
    padding: 14px 35px;
    margin-left: 0;
    background-image: url(/static/images/tab-bar-xuanzhongqianbu.png);
    background-size: 100% 100%;

    &.first-active {
      color: #b08a5b;
      font-weight: 700;
      background-image: url(/static/images/tab-bar-xuanzhong.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
}
.set_main {
  text-align: left;
}
</style>
