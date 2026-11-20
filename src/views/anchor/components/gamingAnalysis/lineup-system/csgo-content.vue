<template>
    <div class="csgo-game">
        <CsgoTeam :awayData="awayData" :homeData="homeData"></CsgoTeam>

        <div class="player-comparison">
          <div v-for="sub in csgoPlayerLength" :key="sub.key" class="player-box">
            <div class="flex player-name">
              <div class="player-item common-player">
                <span>{{ sub.hName }}</span>
                <div><img :src="sub?.hLogo || defaultImage" alt="" width="100%" height="100%" /></div>
              </div>
              <div class="player-item common-player">
                <div><img :src="sub?.aLogo || defaultImage" alt="" width="100%" height="100%" /></div>
                <span>{{ sub.aName }}</span>
              </div>
            </div>
            <!-- 主体 -->
            <div v-for="(item, index) in sub.list" :key="index" class="flex player-content">
              <div class="content-item common-player">
                <span>{{ item.redNum ? item.redNum.toFixed(2) : item.redNum }}{{ item.text === 'KAST' ? '%' : '' }}</span>
                <div class="line">
                  <span class="red-line" :style="{ width: (item.redNum / (item.blueNum + item.redNum)) * 100 + '%' }"></span>
                </div>
              </div>
              <span class="_text">{{ item.text }}</span>
              <div class="content-item common-player">
                <div class="line">
                  <span class="blue-line" :style="{ width: (item.blueNum / (item.blueNum + item.redNum)) * 100 + '%' }"></span>
                </div>
                <span>{{ item.blueNum ? item.blueNum.toFixed(2) : item.blueNum }}{{ item.text === 'KAST' ? '%' : '' }}</span>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
<script setup>
import CsgoTeam from '../csgo-team.vue'

const props =  defineProps({
    awayData: {
        type: Object,
        default: () => ({})
    },
    homeData: {
        type: Object,
        default: () => ({})
    }
});

const defaultImage = '/static/images/theme/personalCenter/default_avatar.png'
const csgoPlayerLength = computed(() => {
  const home = props.homeData.players;
  const away = props.awayData.players;
  const leng = (home && home.length) || (away && away.length);
  const reorganuzationList = [];
  for (let index = 0; index < leng; index++) {
    reorganuzationList.push({
      hName: home[index].name,
      aName: away[index].name,
      hLogo: home[index].logo,
      aLogo: away[index].logo,
      key: index,
      list: [
        { redNum: home[index].rating_avg, text: 'Rating', blueNum: away[index].rating_avg },
        { redNum: home[index].kd, text: 'K/D', blueNum: away[index].kd },
        { redNum: home[index].adr_avg, text: 'ADR', blueNum: away[index].adr_avg },
        { redNum: home[index].kast_avg, text: 'KAST', blueNum: away[index].kast_avg }
      ]
    });
  }
  return reorganuzationList;
});
</script>
<style scoped lang="scss">
.player-comparison {
  width: 100%;
  margin-top: 16px;
  .player-box {
    margin-bottom: 36px;
    .common-player {
      width: calc(100% / 2 - 16px);
      display: flex;
      align-items: center;
      &:first-child {
        justify-content: end;
      }
    }
    .player-name {
        font-size: 14px;
      margin-bottom: 10px;
      .player-item {
        width: calc(100% / 2 - 16px) !important;
        &:first-child {
          div {
            border-color:#d02d54 !important;
          }
        }
        div {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid #025be8;
          overflow: hidden;
          margin: 0 10px;
        }
      }
    }
    .player-content {
      margin-top: 4px;
      ._text {
        font-size: 14px;
      }
      .content-item {
        span {  font-size: 13px;}
        .line {
            width:58%;
          height: 4px;
          background: #f5f5f5;
          margin: 0 12px;
          position: relative;
          .red-line {
            position: absolute;
            right: 0;
            height: 100%;
            background: #d02d54;
          }
          .blue-line {
            position: absolute;
            left: 0;
            height: 100%;
            background: #025be8;
          }
        }
      }
    }
  }
}
</style>