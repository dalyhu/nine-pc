<template>
  <div class="football_match_box" v-if="Object.keys(gameData).length > 0">
    <div class="content_box hide_scrollbar">
      <Chart />
      <div class="footBall_data">
        <ul>
          <li v-for="ind in 3" :key="ind">
            <p :class="['icon_box', `icon_${ind}`]"></p>
            <span>{{ home_data[ind] }}</span>
          </li>
        </ul>
        <div class="shooting_data_box">
          <div class="shooting_item" v-for="(val, index) in shootingList" :key="index">
            <div class="num_item">
              {{ shooting_home_data[index] }}
              <span>{{ val }}</span>
              {{ shooting_away_data[index] }}
            </div>
            <div class="progress_item">
              <el-progress
                class="el-progress-rotateY"
                :percentage="home_data_percentage[index]"
                color="#F84A4B"
                :show-text="false"
              ></el-progress>
              <el-progress
                color="#687AE0"
                :percentage="away_data_percentage[index]"
                :show-text="false"
              ></el-progress>
            </div>
          </div>
        </div>
        <ul>
          <li v-for="ind in 3" :key="ind">
            <p :class="['icon_box', `icon_${ind}`]"></p>
            <span>{{ away_data[ind] }}</span>
          </li>
        </ul>
      </div>
      <BtnTab
        v-model="btnTabValue"
        :tabList="['赛事阵容', '事件直播', '积分榜', '前瞻分析']"
      ></BtnTab>
      <MatchLineup v-if="btnTabValue === 0"></MatchLineup>
      <MatchStatistics v-if="btnTabValue === 1"></MatchStatistics>
      <RankingPanel
        v-if="btnTabValue === 2"
        :roomType="0"
        :matchId="roomDetail.match_id || roomDetail.mars_match_id"
      />
      <template v-if="btnTabValue === 3">
        <!-- 体育前瞻分析 -->
        <Analysis :roomDetail="roomDetail" />
      </template>
    </div>
    <div class="footer_icon_list" v-if="btnTabValue === 1">
      <div class="event_item_box" v-for="(eventItem, index) in list" :key="index">
        <img :src="getImageUrl(`/static/images/${eventItem.src}.png`)" />
        <span>{{ eventItem.title }}</span>
      </div>
    </div>
  </div>
  <div v-else>
    <DfEmpty />
  </div>
</template>

<script setup name="footballMatch" lang="ts">
import { useStore } from 'vuex'
import { getImageUrl } from '@/utils/common.js'
import Chart from '@/views/anchor/components/footballMatch/chart.vue'
import BtnTab from '@/views/anchor/components/btnTab/index.vue'
import MatchLineup from '@/views/anchor/components/footballMatch/matchLineup.vue'
import MatchStatistics from '@/views/anchor/components/footballMatch/matchStatistics.vue'
import RankingPanel from '@/views/anchor/components/rankingPanel/index.vue'
import Analysis from '@/views/anchor/components/analysis/index.vue'

defineProps({
  roomDetail: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const store = useStore()

const shootingList = ['射正球门', '射偏球门']
const list = [
  { title: '进球', src: 'f-0' },
  { title: '点球', src: 'f-1' },
  { title: '乌龙球', src: 'f-3' },
  { title: '红牌', src: 'f-7' },
  { title: '黄牌', src: 'f-6' },
  { title: '两黄罚下', src: 'f-14' },
  { title: '任意球', src: 'f-12' },
  { title: '角球', src: 'f-5' },
  { title: '受伤', src: 'f-9' },
  { title: '开哨', src: 'f-15' },
  { title: '换人', src: 'f-4' },
  { title: '助攻', src: 'f-13' }
]
const btnTabValue = ref<number>(0)

const gameData = computed(() => store.state.gameInfo)
const home_data = computed(() => [
  '',
  gameData.value.home_data[8],
  gameData.value.home_data[2],
  gameData.value.home_data[1]
])
const away_data = computed(() => [
  '',
  gameData.value.away_data[1],
  gameData.value.away_data[2],
  gameData.value.away_data[8]
])
const shooting_home_data = computed(() => [
  gameData.value.home_data[6],
  gameData.value.home_data[7]
])
const shooting_away_data = computed(() => [
  gameData.value.away_data[6],
  gameData.value.away_data[7]
])
const home_data_percentage = computed(() => [
  countSec(gameData.value.home_data[6], gameData.value.away_data[6], 'home'),
  countSec(gameData.value.home_data[7], gameData.value.away_data[7], 'home')
])
const away_data_percentage = computed(() => [
  countSec(gameData.value.home_data[6], gameData.value.away_data[6], 'away'),
  countSec(gameData.value.home_data[7], gameData.value.away_data[7], 'away')
])

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
.football_match_box {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .content_box {
    height: 100%;
    overflow: auto;
    flex: 1;
    .footBall_data {
      display: flex;
      justify-content: space-between;
      padding: 10px 20px 0px 20px;
      margin-bottom: 10px;
      ul {
        display: flex;
        justify-content: space-between;
        flex: 1;
        li {
          text-align: center;
          .icon_box {
            width: 13px;
            height: 13px;
            margin-top: 16px;
            margin-bottom: 22px;
          }
          .icon_1 {
            background-image: url(/static/images/f-5.png);
            background-size: cover;
          }
          .icon_2 {
            background-color: #d02d54;
          }
          .icon_3 {
            background-color: #f5c443;
          }
        }
      }
      .shooting_data_box {
        padding: 0px 14px;
        .shooting_item {
          margin-bottom: 10px;
          .num_item {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            font-size: 14px;
            span {
              display: block;
              padding: 0px 10px;
              color: #999;
            }
          }
          .progress_item {
            display: flex;
            width: 140px;
            .el-progress {
              width: 70px;
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
  }
  .footer_icon_list {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    height: 54px;
    padding-left: 8px;
    background-color: #f5f7fa;
    .event_item_box {
      display: flex;
      align-items: center;
      margin-right: 13px;
      img {
        width: 16px;
        height: 16px;
        margin-right: 2px;
      }
      span {
        color: var(--el-text-color-placeholder);
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
}
</style>
