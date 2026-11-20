<template>
  <div class="live_score">
    <div class="live_score_left">
      <template v-if="scoreDetails.type === 0">
        <p>{{ scoreDetails.home_team_name }}</p>
        <img :src="scoreDetails.home_team_logo" alt="" />
        <strong>{{ scoreDetails.home_scores }}</strong>
      </template>
      <template v-if="scoreDetails.type === 1">
        <p>{{ scoreDetails.home_team_data.short_name_zh }}</p>
        <img :src="scoreDetails.home_team_data.logo" alt="" />
        <strong>{{ scoreDetails.home_scores_total }}</strong>
      </template>
    </div>

    <div class="live_score_center">
      <template v-if="scoreDetails.type === 0">
        <span>vs</span>
      </template>
      <template v-if="scoreDetails.type === 1">
        <span>{{ scoreDetails.short_name_zh }}</span>
      </template>
    </div>

    <div class="live_score_right">
      <template v-if="scoreDetails.type === 0">
        <strong>{{ scoreDetails.away_scores }}</strong>
        <img :src="scoreDetails.away_team_logo" alt="" />
        <p>{{ scoreDetails.away_team_name }}</p>
      </template>
      <template v-if="scoreDetails.type === 1">
        <strong>{{ scoreDetails.away_scores_total }}</strong>
        <img :src="scoreDetails.away_team_data.logo" alt="" />
        <p>{{ scoreDetails.away_team_data.short_name_zh }}</p>
      </template>
    </div>
  </div>
</template>

<script setup name="liveScore" lang="ts">
import { useStore } from 'vuex'

const store = useStore()

const scoreDetails = computed(() => store.state.gameInfo)
</script>

<style scoped lang="scss">
.live_score {
  display: flex;
  color: #fff;
  justify-content: center;
  align-items: center;
  padding: 12px 0px;

  .live_score_left,
  .live_score_right {
    display: flex;
    flex: 1;
    align-items: center;
    overflow: hidden;
    p {
      color: #e5eaf3;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      margin-right: 12px;
      white-space: nowrap;
      overflow: hidden;
    }
    img {
      width: 40px;
      height: 40px;
      border-radius: 999px;
      margin-right: 12px;
    }
    strong {
      color: #e5eaf3;
      font-size: 32px;
      font-style: normal;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .live_score_center {
    display: flex;
    box-sizing: border-box;
    flex-shrink: 0;
    flex-direction: column;
    align-items: center;
    padding: 0px 48px;
    width: 220px;
    padding-top: 10px;
    span {
      color: #fff;
      font-size: 15px;
      font-style: normal;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .live_score_left {
    justify-content: flex-end;
  }
  .live_score_right {
    strong {
      margin-right: 12px;
    }
    p {
      margin-right: 0px;
    }
  }

  // 自适应 - 1440
  @include screen(medium) {
    .live_score_center {
      padding: 0px 24px !important;
      padding-top: 10px !important;
    }
  }
}
</style>
