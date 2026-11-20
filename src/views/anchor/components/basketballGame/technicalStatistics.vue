<template>
  <div class="technical_statistics">
    <div class="team_box">
      <div class="team_name">
        <img :src="gameData.home_team_data.logo" />
        <span>{{ gameData.home_team_data.short_name_zh }}</span>
      </div>
      <div class="team_name right_team_name">
        <span>{{ gameData.away_team_data.short_name_zh }}</span>
        <img :src="gameData.away_team_data.logo" />
      </div>
    </div>
    <div class="shooting_data_box">
      <div class="shooting_item" v-for="(curr, index) in technical_statistics" :key="index">
        <div class="num_item">
          <span>{{ curr.home_score }}</span>
          <span>{{ curr.name }}</span>
          <span>{{ curr.away_score }}</span>
        </div>
        <div class="progress_item">
          <el-progress
            class="el-progress-rotateY"
            :stroke-width="3"
            :percentage="countSec(curr.home_score, curr.away_score, 'home')"
            color="#F84A4B"
            :show-text="false"
          ></el-progress>
          <el-progress
            color="#687AE0"
            :stroke-width="3"
            :percentage="countSec(curr.home_score, curr.away_score, 'away')"
            :show-text="false"
          ></el-progress>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="technicalStatistics" lang="ts">
import { useStore } from 'vuex'

const store = useStore()

const gameData = computed(() => store.state.gameInfo)
const technical_statistics = computed(() => gameData.value.technical_statistics || [])

// 计算 进攻 危险进攻 控球率
function countSec(home_data, away_data, type) {
  if (home_data === 0 && away_data === 0) {
    return 0
  }

  let res

  // 主队
  if (type === 'home') {
    res = (home_data / (home_data + away_data)) * 100
  } else {
    // 客队
    res = 100 - (home_data / (home_data + away_data)) * 100
  }

  return isNaN(res) ? 0 : res
}
</script>

<style scoped lang="scss">
.technical_statistics {
  padding: 0 20px;
  .team_box {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    .team_name {
      flex: 1;
      display: flex;
      align-items: center;
      img {
        width: 30px;
        height: 30px;
        margin-right: 2px;
      }
      span {
        color: var(--el-text-color-primary);
        font-size: 14px;
        font-weight: 500;
      }
    }
    .right_team_name {
      justify-content: end;
      span {
        margin-right: 2px;
      }
      img {
        margin-right: 0px;
      }
    }
  }
  .shooting_data_box {
    width: 100%;
    .shooting_item {
      width: 100%;
      padding-bottom: 16px;
      .num_item {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        font-size: 14px;
        color: #999;
      }
      .progress_item {
        width: 100%;
        display: flex;
        .el-progress {
          width: 50%;
          :deep(.el-progress-bar__outer) {
            border-radius: 0px !important;
          }
          :deep(.el-progress-bar__inner) {
            border-radius: 0px !important;
          }
        }
        .el-progress-rotateY {
          transform: rotateY(180deg);
        }
      }
    }
  }
}
</style>
