<template>
  <div class="basketball_game hide_scrollbar" v-if="Object.keys(gameData).length > 0">
    <TeamScores></TeamScores>
    <Chart></Chart>
    <!-- <BtnTab
      v-model="btnTabValue"
      :tabList="['球员数据', '技术统计', '积分榜', '前瞻分析']"
    ></BtnTab> -->
    <BtnTab
      v-model="btnTabValue"
      :tabList="['球员数据', '事件直播', '积分榜', '前瞻分析']"
    ></BtnTab>
    <!-- 球员数据 -->
    <Team v-if="btnTabValue === 0"></Team>
    <!-- 事件直播 -->
     <BasketballEventsLive v-if="btnTabValue === 1"></BasketballEventsLive>
    <!-- 技术统计 -->
    <!-- <TechnicalStatistics v-if="btnTabValue === 1"></TechnicalStatistics> -->
    <!-- 积分榜 -->
    <RankingPanel
      v-if="btnTabValue === 2"
      :roomType="1"
      :matchId="roomDetail.match_id || roomDetail.mars_match_id"
    />
    <template v-if="btnTabValue === 3">
      <!-- 体育前瞻分析 -->
      <Analysis :roomDetail="roomDetail" />
    </template>
  </div>
  <div v-else>
    <DfEmpty />
  </div>
</template>

<script setup name="basketballGame" lang="ts">
import TeamScores from '@/views/anchor/components/basketballGame/teamScores.vue'
import Chart from '@/views/anchor/components/basketballGame/chart.vue'
import BtnTab from '@/views/anchor/components/btnTab/index.vue'
import Team from '@/views/anchor/components/basketballGame/team.vue'
import BasketballEventsLive from '../basketballEventsLive/index.vue'
// import TechnicalStatistics from '@/views/anchor/components/basketballGame/technicalStatistics.vue'
import RankingPanel from '@/views/anchor/components/rankingPanel/index.vue'
import Analysis from '@/views/anchor/components/analysis/index.vue'
import { useStore } from 'vuex'

defineProps({
  roomDetail: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const store = useStore()

const gameData = computed(() => store.state.gameInfo)

const btnTabValue = ref<number>(0)

watch(() => btnTabValue.value, (val) => {
  console.log(val, 'val')
})
</script>

<style scoped lang="scss">
.basketball_game {
  height: 100%;
  overflow: auto;
}
</style>
