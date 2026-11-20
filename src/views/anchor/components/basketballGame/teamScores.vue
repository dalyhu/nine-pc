<template>
  <div class="team_scores">
    <div class="team_name_box">
      <p>球队</p>
      <div class="sessions_title">
        <span>一节</span>
        <span>二节</span>
        <span>三节</span>
        <span>四节</span>
        <span
          v-if="
            Object.keys(gameData).length > 0 &&
            gameData.away_scores.length > 4 &&
            gameData.home_scores.length > 4
          "
          >加时</span
        >
        <span>总分</span>
      </div>
    </div>
    <div class="team_scores_box">
      <div class="team_name">
        <p>{{ gameData.home_team_data.short_name_zh }}</p>
        <p>{{ gameData.away_team_data.short_name_zh }}</p>
      </div>
      <div class="team_sessions">
        <div class="score_box">
          <span v-for="(item, index) in gameData.home_scores" :key="index">{{ item }}</span>
          <span>{{ gameData.home_scores_total }}</span>
        </div>
        <div class="score_box">
          <span v-for="(item, index) in gameData.away_scores" :key="index">{{ item }}</span>
          <span>{{ gameData.away_scores_total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="name" lang="ts">
import { useStore } from 'vuex'

const store = useStore()
const gameData = computed(() => store.state.gameInfo)
</script>

<style scoped lang="scss">
.team_scores {
  padding: 0 10px;
  padding-bottom: 10px;

  .team_name_box {
    border-bottom: 1px solid #f1f1f1;
    display: flex;
    color: #999;
    padding: 8px 0px;
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: 600;
    p {
      flex: 1.2;
      margin-left: 16px;
    }
    .sessions_title {
      flex: 2;
      display: flex;
      align-items: center;
      span {
        text-align: center;
        flex: 1;
      }
    }
  }
  .team_scores_box {
    display: flex;
    .team_name {
      margin-left: 16px;
      flex: 1.2;
      font-size: 14px;
      border-right: 1px solid #f1f1f1;
      p {
        padding-bottom: 8px;
        color: #f84a4b;
      }
      p:last-child {
        color: #687ae0;
        padding: 0px 0px;
      }
    }
    .team_sessions {
      flex: 2;
      font-size: 14px;
      color: #999;
      font-weight: 600;
      .score_box {
        display: flex;
        padding-bottom: 8px;
        align-items: center;
        span {
          flex: 1;
          text-align: center;
        }
        span:last-child {
          color: #873901;
          font-weight: 800;
        }
      }
      .score_box:last-child {
        padding: 0px 0px;
      }
    }
  }
}
</style>
