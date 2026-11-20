<template>
  <div class="football_progress_box">
    <ul>
      <li v-for="(item, index) in signal" :key="index">
        <p>{{ item }}</p>
        <div v-if="gameData.home_data" class="progress_box">
          <span>{{ home_data_total[index] }}</span>
          <df-progress
            :has-clockwise="!!clockwise[index]"
            :percentage="percentageValue[index]"
          ></df-progress>
          <span>{{ away_data_total[index] }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup name="chart" lang="ts">
import { useStore } from 'vuex'
import DfProgress from '@/components/dfProgress/index.vue'

const store = useStore()

const gameData = computed(() => store.state.gameInfo)

const percentageValue = computed(() => [
  count(gameData.value.home_data[3], gameData.value.away_data[3]),
  count(gameData.value.home_data[4], gameData.value.away_data[4]),
  count(gameData.value.home_data[5], gameData.value.away_data[5])
])

const home_data_total = computed(() => [
  gameData.value.home_data[3],
  gameData.value.home_data[4],
  gameData.value.home_data[5]
])
const away_data_total = computed(() => [
  gameData.value.away_data[3],
  gameData.value.away_data[4],
  gameData.value.away_data[5]
])

const clockwise = computed(() => [
  gameData.value.home_data[3] <= gameData.value.away_data[3],
  gameData.value.home_data[4] <= gameData.value.away_data[4],
  gameData.value.home_data[5] <= gameData.value.away_data[5]
])

// 计算 进攻 危险进攻 控球率
function count(home_data, away_data) {
  if (home_data === 0 && away_data === 0) {
    return 0
  }

  let res

  if (home_data > away_data) {
    res = (home_data / (home_data + away_data)) * 100
  } else {
    res = (away_data / (home_data + away_data)) * 100
  }

  return isNaN(res) ? 0 : res
}

const signal = ['进攻', '危险进攻', '控球率']
</script>

<style scoped lang="scss">
.football_progress_box {
  ul {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px 10px 20px;
    border-bottom: 1px solid #f3f3f7;
    li {
      p {
        color: #999;
        font-size: 14px;
        margin-bottom: 10px;
        text-align: center;
      }
      .progress_box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-progress {
          margin-left: 6px;
          margin-right: 6px;
        }
        .el-progress-rotateY {
          transform: rotateY(180deg);
        }
        span {
          color: #000;
        }
      }
    }
  }
}
</style>
