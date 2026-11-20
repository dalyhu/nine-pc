<template>
  <div class="real-time-data hide_scrollbar">
    <ul v-if="roundList.length" class="flex position-info">
      <li v-for="item in roundList" :key="item.round_id" :class="{ isActived: defaultPos === item.stage }" @click="handleChnagePos(item)">
          <span>第{{ conversionFun(item.stage) }}局</span>
      </li>
    </ul>

    <div class="game-content" v-if="defTeams && defTeams.length">
      <!-- 非csgo游戏 -->
      <template v-if="+game_id !== 2">
        <BanPickHero :defTeams="defTeams" :getTime="getTime"></BanPickHero>
        <!-- 图表区 -->
        <LineChart :goldDiffList="goldDiffList"></LineChart>

        <Equipment :defTeams="defTeams"></Equipment>
      </template>

        <!-- csgo 游戏 -->
        <div v-else class="cs-go">
          <template v-if="defTeams && defTeams.length">
            <SeesawHalf :defTeams="defTeams" :mapName="mapName"></SeesawHalf>
            <UpDownWin :defTeams="defTeams"></UpDownWin>
            <!-- 赛后数据 -->
            <PostGameData :defTeams="defTeams"></PostGameData>
          </template>
      </div>
    </div>

     <!-- 暂无数据 -->
     <DfEmpty v-else/>
  </div>
</template>

<script setup>
import { getRealTimeData } from '@/api/game'
import BanPickHero from './ban-pick-hero.vue';
import LineChart from './line-chart.vue';
import Equipment from './equipment.vue';
import SeesawHalf from './seesaw-half.vue';
import UpDownWin from './up-down-win.vue';
import PostGameData from './post-game-data.vue';

const props = defineProps({
  roundList: {
    type: Array,
    default: () => []
  }
});

const game_id = inject('game_id');

const defaultPos = ref(1);
const defTeams = ref([]);
const getTime = ref(0);
const mapName = ref('');
const goldDiffList = ref([]);
const chineseNumber = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

const conversionFun = (num) => {
  if (num <= chineseNumber.length) {
    return chineseNumber[num - 1];
  }
};

const handleChnagePos = (item) => {
  if (item.stage !== defaultPos.value) {
    defaultPos.value = item.stage;
    getRealTimeDateFun(item);
  }
};

const getRealTimeDateFun = async ({ round_id }) => {
  try {
    const res = await getRealTimeData({
      game_id: +game_id,
      race_id: +round_id
    });
    let { data } = res
      defTeams.value = data.teams;
      mapName.value = data?.map_name;
      getTime.value = data?.time;
      goldDiffList.value = data?.gold_diff;
  } catch (error) {
    defTeams.value = [];
    goldDiffList.value = [];
  }
};

watch(
  () => props.roundList,
  (list) => {
    if (list.length) {
      getRealTimeDateFun(list[0]);
      defaultPos.value = 1
    }
  }
);
</script>

<style scoped lang="scss">
.real-time-data {
    height: 100%;
    overflow: auto;
    .position-info {
        border-radius: 4px;
        font-size: 14px;
        justify-content: center;
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        li {
            height: 32px;
            flex: 0 0 50px;
            text-align: center;
            cursor: pointer;
        span {
            display: inline-block;
            height: 100%;
        }
        &.isActived span {
          border-radius: 1px;
            border-bottom: 3px solid #d02d54;
        }
    }
  }
  .game-content {
    width: 100%;
    .cs-go {
      margin-top: 20px;
    }
  }
}
</style>