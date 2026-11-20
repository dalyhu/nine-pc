<template>
  <div class="match_lineup" v-if="Object.keys(lineupData).length > 0">
    <df-container :height-ratio="174.358">
      <div class="site_box">
        <div class="home_site">
          <ul v-for="(curr, index) in homeTeamData" :key="index">
            <li v-for="playerItem in curr" :key="playerItem.shirt_number">
              <img v-if="playerItem.logo" :src="playerItem.logo" alt="" />
              <p v-else>{{ playerItem.shirt_number }}</p>
              <span>{{ playerItem.name_en }}</span>
            </li>
          </ul>
        </div>
        <div class="away_site">
          <ul v-for="(curr, index) in awayTeamData" :key="index">
            <li v-for="playerItem in curr" :key="playerItem.shirt_number">
              <img v-if="playerItem.logo" :src="playerItem.logo" alt="" />
              <p v-else>{{ playerItem.shirt_number }}</p>
              <span>{{ playerItem.name_en }}</span>
            </li>
          </ul>
        </div>
      </div>
    </df-container>
  </div>
  <div v-else>
    <DfEmpty />
  </div>
</template>

<script setup name="matchLineup" lang="ts">
import { useStore } from 'vuex'
import { groupBy, chunk, drop } from 'lodash-es'
import { getSquad } from '@/api/football.js'

const store = useStore()
const gameData = computed(() => store.state.gameInfo)

// 4-1-4-1 守门员-后卫-中锋-前锋-前锋
// 4-5-1 守门员-后卫-中锋-前锋
// G守门员、D后卫、M中场、F前锋、其他为未知
const lineupData = ref({})
// const playerType = ['G', 'D', 'M', 'F']
const homeTeamData = ref([])
const awayTeamData = ref([])

function initLineup() {
  const { id } = gameData.value
  if (!id) return
  getSquad({ id: id }).then((res) => {
    const { data = {} } = res
    if (Object.keys(data).length > 0) {
      const {
        home_formation = '',
        away_formation = '',
        home_player_first = [],
        away_player_first = []
      } = data
      lineupData.value = data
      let homePlayerFirst = home_player_first[0]
      let awayPlayerFirst = away_player_first[0]
      const homeFormation = [1, ...home_formation.split('-')]
      const awayFormation = [1, ...away_formation.split('-')]

      homeTeamData.value = homeFormation.reduce((arr, curr) => {
        const target = homePlayerFirst.slice(0, parseFloat(curr))
        homePlayerFirst = drop(homePlayerFirst, parseFloat(curr))
        return [...arr, target]
      }, [])

      awayTeamData.value = awayFormation
        .reduce((arr, curr) => {
          const target = awayPlayerFirst.slice(0, parseFloat(curr))
          awayPlayerFirst = drop(awayPlayerFirst, parseFloat(curr))
          return [...arr, target]
        }, [])
        .reverse()

      // position和阵容数据无法对齐 通过position和阵容分割数据
      // Object.values()
      // const homePlayerFirst = groupBy(home_player_first[0], 'position')
      // const awayPlayerFirst = groupBy(away_player_first[0], 'position')
      // const homeFormation = [1, ...home_formation.split('-')]
      // const awayFormation = [1, ...away_formation.split('-')]
      // console.log('homeFormation', homeFormation)
      // console.log('awayFormation', awayFormation)

      // homeTeamData.value = playerType.reduce((arr, curr) => {
      //   return [
      //     ...arr,
      //     homeFormation.length === 4 && curr === 'F'
      //       ? chunk(homePlayerFirst[curr], parseFloat(homeFormation[2]))
      //       : homePlayerFirst[curr]
      //   ]
      // }, [])

      // awayTeamData.value = playerType.reduce((arr, curr) => {
      //   return [
      //     ...arr,
      //     awayFormation.length === 4 && curr === 'F'
      //       ? chunk(awayPlayerFirst[curr], parseFloat(awayFormation[2]))
      //       : awayPlayerFirst[curr]
      //   ]
      // }, [])
      // console.log('awayTeamData.value', awayTeamData.value)
    }
  })
}
onMounted(initLineup)
</script>

<style scoped lang="scss">
.match_lineup {
  padding: 0px 6px;
  .site_box {
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url(/static/images/live/site-bg.png);
    display: flex;
    flex-direction: column;
    .away_site,
    .home_site {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10px;
      ul {
        width: 100%;
        display: flex;
        justify-content: space-around;
        li {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          img {
            width: 26px;
            height: 26px;
            border-radius: 50%;
          }
          p {
            width: 26px;
            height: 26px;
            text-align: center;
            background-color: #ee9537;
            border: 2px solid #fff;
            color: #fff;
            font-size: 18px;
            line-height: 26px;
          }
          span {
            color: #fff;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
