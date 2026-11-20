<template>
    <div class="other-content">
        <slot></slot>

       <div class="member-info flex">
            <div class="win-rate" v-if="isDota || isLol">
                <el-progress type="circle" :percentage="playerLeft?.[defaultPos].match_win_rate" width="80" color="#d02d54" stroke-width="4">
                    <template #default="{ percentage }">
                        <div style="margin-bottom: 12px">{{ percentage }}%</div>
                        <div>胜率</div>
                    </template>
                </el-progress>
                <div class="win-lose">
                    <img src="/static/images/marz/431342eb-37eb-451e-8c72-3b8384a63e55_18_18.png"  width="16px" />
                    <span class="">{{ playerLeft?.[defaultPos].match_win }}</span>
                    <img src="/static/images/marz/aea767e6-b57f-48cd-bf93-9c70aadd58de_18_18.png" width="16px" />
                    <span>{{ playerLeft?.[defaultPos].match_lose }}</span>
                </div>
            </div>
            <ProgressBar :leftPlayer="playerLeft?.[defaultPos]" :rightPlayer="playerRiht?.[defaultPos]"></ProgressBar>

            <div class="win-rate" v-if="isDota || isLol">
                <el-progress type="circle" :percentage="playerRiht?.[defaultPos].match_win_rate" width="80" color="#025be8" stroke-width="4">
                    <template #default="{ percentage }">
                        <div style="margin-bottom: 12px" >{{ percentage }}%</div>
                        <div>胜率</div>
                    </template>
                </el-progress>
                <div class="win-lose">
                    <img src="/static/images/marz/431342eb-37eb-451e-8c72-3b8384a63e55_18_18.png"  width="16px" />
                    <span class="">{{ playerRiht?.[defaultPos].match_win }}</span>
                    <img src="/static/images/marz/aea767e6-b57f-48cd-bf93-9c70aadd58de_18_18.png" width="16px" />
                    <span>{{ playerRiht?.[defaultPos].match_lose }}</span>
                </div>
            </div>

       </div>
       <!-- 展示前三常用英雄 -->
      <RoleInfo :leftRoles="leftData.roles" :rightRoles="rightData.roles" v-if="isDota || isLol"></RoleInfo>

      <RoleTable :setTeamdata="setTeamdata"></RoleTable>
</div>
</template>
<script setup>
import RoleInfo from './role-info.vue'
import ProgressBar from './progress-bar.vue'
import RoleTable from './role-table.vue'
const props = defineProps({
  setTeamdata: {
    type: Array,
    default: () => []
  },
  defaultPos: {
    type: Number,
    default: 0
  }
});

const game_id = inject('game_id');
const isKing = computed(() => {
  return +game_id === 3;
});
const isDota = computed(() => {
  return +game_id === 4;
});
const isLol = computed(() => {
  return +game_id === 1;
});

const leftData = computed(() => {
    return props.setTeamdata.length && props.setTeamdata[0];
});
const rightData = computed(() => {
    return props.setTeamdata.length && props.setTeamdata[1];
});

// 王者才计算sortNoFun全队排名
const playerLeft = computed(() => {
  return isKing.value ? sortNoFun(leftData.value.players) : leftData.value.players;
});
const playerRiht = computed(() => {
  return isKing.value ? sortNoFun(rightData.value.players) : rightData.value.players;
});

// 全队排名
const sortNoFun = (arr) => {
  if (!isKing.value) return;
  const uniqueA = [...new Set(arr.map((item) => item.kda_avg))].sort((n, m) => m - n);
  const uniqueB = [...new Set(arr.map((item) => item.gold_per_min))].sort((n, m) => m - n);
  const uniqueC = [...new Set(arr.map((item) => item.damage_per_min))].sort((n, m) => m - n);
  const uniqueD = [...new Set(arr.map((item) => item.damage_taken_per_min))].sort((n, m) => m - n);
  const uniqueE = [...new Set(arr.map((item) => item.kill_participation_avg))].sort((n, m) => m - n);
  return arr.map((item) => ({
    ...item,
    NOA: uniqueA.indexOf(item.kda_avg) + 1,
    NOB: uniqueB.indexOf(item.gold_per_min) + 1,
    NOC: uniqueC.indexOf(item.damage_per_min) + 1,
    NOD: uniqueD.indexOf(item.damage_taken_per_min) + 1,
    NOE: uniqueE.indexOf(item.kill_participation_avg) + 1
  }));
};
</script>

<style lang="scss" scoped>
.other-content {
    .win-rate {
        font-size: 12px;
        width: 23%;
        text-align: center;
        .win-lose { 
            margin-top:12px;
            span { margin: 0 5px }
        }
    }
}
</style>