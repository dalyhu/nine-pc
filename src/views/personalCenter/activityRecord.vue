<template>
  <div class="mainContainer">
    <div class="tabsGrid" role="tablist">
      <span
        v-for="item in recordTabs"
        :key="item.key"
        class="tab"
        role="tab"
        :aria-selected="tabKey === item.key"
        :class="{ tabSelect: tabKey === item.key }"
        @click="onSelectTab(item.key)"
      >
        {{ item.label }}
      </span>
      <div>
        时间：
        <el-date-picker
          width="264px"
          style="height: 32px"
          v-model="dateRange"
          :clearable="true"
          type="daterange"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
    </div>
    <div class="list">
      <CompensationRecordPanel v-if="tabKey === 'compensation'" :date-range="dateRange" />
      <VoteRecordPanel v-else :date-range="dateRange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { getToday, getOneMonth } from '@/utils/common'
import CompensationRecordPanel from './components/activity-record/CompensationRecordPanel.vue'
import VoteRecordPanel from './components/activity-record/VoteRecordPanel.vue'

type RecordTabKey = 'compensation' | 'vote'

const recordTabs: { key: RecordTabKey; label: string }[] = [
  { key: 'compensation', label: '活动记录' },
  { key: 'vote', label: '投票记录' }
]

const store = useStore()
const dateRange = ref([getOneMonth(getToday()), getToday()])
const tabKey = ref<RecordTabKey>('compensation')

const isLogin = computed(() => !!store.getters.getUserInfo?.id)

function onSelectTab(key: RecordTabKey) {
  if (key === 'vote' && !isLogin.value) {
    store.commit('user/SET_LOGIN_MASK', true)
    return
  }
  tabKey.value = key
}
</script>

<style scoped lang="scss">
.mainContainer {
  padding: 32px 24px;
  .tabsGrid {
    display: grid;
    grid-template-columns: auto 1fr auto;
    justify-items: start;
    align-items: center;
    font-size: 20px;
    line-height: 24px;
    color: #333;
    font-weight: 400;
    padding: 0 12px;
    gap: 40px;
    .tab {
      cursor: pointer;
      padding-bottom: 4px;
      border-bottom: 2px solid transparent;
    }
    .tabSelect {
      color: #d02d54;
      border-bottom: 2px solid #d02d54;
    }
  }
  .list {
    display: flex;
    flex-flow: column;
    margin-top: 10px;
  }
}
</style>
