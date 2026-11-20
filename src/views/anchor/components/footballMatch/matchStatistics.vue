<template>
  <div class="football_match_statistics">
    <template v-if="footballMatchStatisticsList.length > 0">
      <div class="team_box">
        <div class="team_info">
          <img :src="gameData.home_team_log" />
          <span>{{ gameData.home_team_name_zh }}</span>
        </div>
        <div class="vs_box">VS</div>
        <div class="team_info right_team_box">
          <span>{{ gameData.away_team_name_zh }}</span>
          <img :src="gameData.away_team_log" />
        </div>
      </div>
      <!-- 事件线 -->
      <div>
        <div
          class="team_line_box"
          v-for="(matchStatisticsItem, index) in footballMatchStatisticsList"
          :key="index"
        >
          <div class="left_team_info" v-if="matchStatisticsItem.position != 0">
            <div class="event_item_box" v-if="matchStatisticsItem.position === 1">
              <span class="team_name_box">{{ gameData.home_team_name_zh }}</span>
              <span class="event_item_msg">{{ matchStatisticsItem.data }}</span>
            </div>
            <span class="time_box" v-if="matchStatisticsItem.position === 2">
              {{ matchStatisticsItem.time }}
            </span>
          </div>

          <div class="line_box" v-if="matchStatisticsItem.position != 0">
            <div class="img_box">
              <img :src="imgUrl(matchStatisticsItem.type)" alt="" />
            </div>
            <div class="line"></div>
          </div>

          <div class="left_team_info right_team_info" v-if="matchStatisticsItem.position != 0">
            <span class="time_box" v-if="matchStatisticsItem.position === 1">
              {{ matchStatisticsItem.time }}
            </span>
            <div class="event_item_box" v-if="matchStatisticsItem.position === 2">
              <span class="team_name_box">{{ gameData.away_team_name_zh }}</span>
              <span class="event_item_msg">{{ matchStatisticsItem.data }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <DfEmpty v-else />
  </div>
</template>

<script setup name="footballMatchStatistics" lang="ts">
import { useStore } from 'vuex'
import { getImageUrl } from '@/utils/common.js'

const store = useStore()

const gameData = computed(() => store.state.gameInfo)

const footballMatchStatisticsList = computed(() =>
  store.state.footballEventLive.filter((item) => item.position !== 0)
)
const imgUrl = (type) => {
  if (eventImageList[type]) {
    return getImageUrl(`/static/images/${eventImageList[type]}.png`)
  } else {
    return getImageUrl(`/static/images/${eventImageList[1]}.png`)
  }
}

const eventImageList = [
  '',
  'f-0',
  'f-5',
  'f-6',
  'f-7',
  '',
  'f-12',
  '',
  'f-1',
  'f-4',
  '',
  '',
  '',
  '',
  '',
  'f-14',
  '',
  'f-3',
  'f-13',
  '',
  '',
  ''
]
</script>

<style scoped lang="scss">
.football_match_statistics {
  padding: 0px 10px;

  .team_box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0px;
    .team_info {
      display: flex;
      align-items: center;
      flex: 1;
      img {
        width: 32px;
        height: 32px;
        margin-right: 2px;
      }
      span {
        color: var(--el-text-color-primary);
        font-size: 16px;
        font-weight: 500;
      }
    }
    .right_team_box {
      justify-content: end;
      span {
        margin-right: 2px;
      }
      img {
        margin-right: 0px;
      }
    }
    .vs_box {
      width: 32px;
      height: 32px;
      margin: 0 10px;
      text-align: center;
      line-height: 32px;
      border-radius: 999px;
      background-color: var(--el-warning-background---el-color-warning-9);
      color: var(--el-warning-text-color-2);
      font-size: 14px;
      font-weight: 500;
    }
  }
  .team_line_box {
    display: flex;
    justify-content: space-between;
    .left_team_info {
      flex: 1;
      .event_item_box {
        .team_name_box {
          display: block;
          display: flex;
          justify-content: end;
          align-items: center;
          color: var(--el-text-color-primary);
          font-size: 14px;
          font-weight: 400;
          margin-bottom: 4px;
        }
        .event_item_msg {
          display: block;
          text-align: right;
          color: var(--el-text-color-placeholder);
          font-size: 14px;
          font-weight: 400;
          padding-bottom: 10px;
        }
      }
      .time_box {
        display: block;
        display: flex;
        padding: 16px 0px;
        height: 100%;
        justify-content: end;
        align-items: center;
        color: var(--el-text-color-placeholder);
        font-size: 14px;
        font-weight: 400;
      }
    }
    .right_team_info {
      flex: 1;
      .time_box {
        justify-content: start;
      }
      .event_item_box {
        .team_name_box {
          justify-content: start;
        }
        .event_item_msg {
          text-align: left;
        }
      }
    }
    .line_box {
      width: 32px;
      margin: 0 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      flex-shrink: 0;
      .img_box {
        position: absolute;
        width: 32px;
        height: 32px;
        background-color: var(--el-fill-color);
        border-radius: 999px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 16px;
          height: 16px;
        }
      }
      .line {
        width: 2px;
        background-color: var(--el-fill-color);
        height: 100%;
      }
    }
  }
}
</style>
