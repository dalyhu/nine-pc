<!-- 电竞页面 === 数据分析  -->
<template>
  <div class="e-sport-analysis">
    <!-- tab切换 -->
    <ul class="tab-ul flex">
      <li v-for="tab in tabList" :key="tab.key" :class="{ liActive: tab.key === currentTab }" @click="handleChnage(tab)">
        <span> {{ tab.label }}</span>
      </li>
    </ul>
    <!-- game_id: 1:lol,2:csgo,3:王者荣耀,4:dota2 -->
     <div class="content-box">
       <!-- 前瞻分析 -->
       <ForwardAnalysis v-if="currentTab === 'qzfx'" :gameId="gameId" :matchId="matchId"> </ForwardAnalysis>
   
       <!-- 实时数据 -->
       <RealTimeData v-show="currentTab === 'sssj'" :roundList="roundList"></RealTimeData>
   
       <!-- 阵容体系 -->
       <LineupSystem v-show="currentTab === 'zrtx'" :currentTab="currentTab" :matchId="matchId"></LineupSystem>
     </div>
  </div>
</template>

<script setup>
import ForwardAnalysis from './forward-analysis/index.vue';
import RealTimeData from './real-time-data/index.vue';
import LineupSystem from './lineup-system/index.vue';
import { getEgameRoundInfo } from '@/api/game'
const props = defineProps({
  gameId: {
    default: '',
    type: String
  },
  matchId: {
    default: '',
    type: String
  }
});

provide('game_id', props.gameId);
const currentTab = ref('qzfx');
// 当前游戏有几局
const roundList = ref([]);

const defaultList = [
  { key: 'qzfx', label: '前瞻分析' },
  { key: 'sssj', label: '实时数据' }
];

const tabList = computed(() => {
  if (+props.gameId === 2) {
    defaultList.push({ key: 'zrtx', label: '选手对比' });
  } else {
    defaultList.push({ key: 'zrtx', label: '阵容体系' });
  }
  return defaultList;
});

// tan切换
const handleChnage = ({ key }) => {
  currentTab.value = key;
};

const getEgameRoundInfoFun = () => {
  if (!props.gameId) return;
  try {
    getEgameRoundInfo({
      game_id: +props.gameId,
      match_id: +props.matchId
    }).then(res => {
      let { data } = res
        roundList.value = data && data.round ? data.round : [];
    })
  } catch(error) {
    roundList.value =[]
  }
};

onMounted(() => {});

watch(
  () => currentTab.value,
  (val) => {
    if (val === 'sssj') {
      // 获取小局round_id
      getEgameRoundInfoFun();
    }
  }
);
</script>

<style lang="scss" scoped>
.e-sport-analysis {
  height: calc(100% - 30px);
  .tab-ul {
    font-size: 14px;
    margin: 30px auto;
    border: 1px solid #d02d54;
    width: 75%;
    padding: 4px;
    border-radius: 80px;
    li {
      color: #000;
      padding: 8px 15px;
      border-radius: 50px;
      cursor: pointer;
      &.liActive {
        color: #fff;
        background: #d02d54;
      }
    }
  }
  .content-box {
    height: calc(100% - 75px);
    padding: 0 12px 20px;
     overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
