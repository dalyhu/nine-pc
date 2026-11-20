<template>
  <div class="forward-analysis hide_scrollbar" v-if="historyFightData && historyFightData.match_id">
    <div class="analysis_wrapper">
      <!-- 历史交锋 -->
      <div class="analysis_title flex-y-center">历史交锋</div>
      <div class="flex-row flex-x-between flex-y-center filterTab">
        <div class="flex-y-center flex-1">
          <div
            class="proBut flex-center flex-1"
            :class="{ btn_active: same_side }"
            @click="toggleFilter('same_side', '')"
          >
            同主客
          </div>
          <div
            class="proBut flex-center flex-1"
            :class="{ btn_active: current_league_only }"
            @click="toggleFilter('current_league_only', '')"
          >
            本赛事
          </div>
        </div>
        <div class="flex-y-center matchNumTab flex-center flex-1">
          <div
            class="matchNumTabItem flex-center flex-1"
            :class="{ active: match_num === 10 }"
            @click="toggleFilter('match_num', 10)"
          >
            10场
          </div>
          <div
            class="matchNumTabItem flex-center flex-1"
            :class="{ active: match_num === 20 }"
            @click="toggleFilter('match_num', 20)"
          >
            20场
          </div>
        </div>
      </div>

      <div class="rate_section flex-y-center flex-x-around">
        <div class="rate_section--item flex-y-center tw-flex-cloumn">
          <div class="flex-row">
            <div>胜率</div>
            <div class="percent_num">{{ rateFix(historyFightData.win_rate.rate) }}</div>
          </div>
          <div class="rate_result">
            {{ historyFightData.win_rate.won_count }}胜{{
              historyFightData.win_rate.drawn_count
            }}平{{ historyFightData.win_rate.lost_count }}负
          </div>
        </div>
        <div class="rate_section--item flex-y-center tw-flex-cloumn">
          <div class="flex-row">
            <div>赢率</div>
            <div class="percent_num">{{ rateFix(historyFightData.handicap_rate.rate) }}</div>
          </div>
          <div class="rate_result">
            {{ historyFightData.handicap_rate.won_count }}赢{{
              historyFightData.handicap_rate.drawn_count
            }}走{{ historyFightData.handicap_rate.lost_count }}输
          </div>
        </div>
        <div class="rate_section--item flex-y-center tw-flex-cloumn">
          <div class="flex-row">
            <div>大率</div>
            <div class="percent_num">{{ rateFix(historyFightData.score_rate.rate) }}</div>
          </div>
          <div class="rate_result">
            {{ historyFightData.score_rate.won_count }}大{{
              historyFightData.score_rate.drawn_count
            }}走{{ historyFightData.score_rate.lost_count }}小
          </div>
        </div>
      </div>

      <div class="table_wrapper">
        <table class="table">
          <!-- 足球 -->
          <tbody v-if="game_id == 202">
            <tr class="tr_th">
              <th>日期</th>
              <th>主队</th>
              <th class="content_txt_bf"></th>
              <th>客队</th>
              <!-- <th>让球</th>
              <th>进球</th>
              <th>角球</th> -->
            </tr>
            <!-- 让球 handicap_result: 0:- 1:赢 2:输 3:走 -->
            <!-- 进球 goal_result: 0:- 1:大 2:小 -->
            <tr
              :class="{ tr_bg: !(index % 2) }"
              v-for="(item, index) in historyFightData.matches"
              :key="item.match_id"
            >
              <td class="td_text">
                <div class="flex-col">
                  <div>{{ timeFix(item.match_start_time) }}</div>
                  <div v-if="item.series_name">{{ item.series_name }}</div>
                </div>
              </td>
              <td class="td_text">
                <div
                  :class="home_team === item.home_name ? classNameHandler(item, 0, home_team) : ''"
                >
                  {{ item.home_name }}
                </div>
              </td>
              <td class="td_text">
                <div class="score_num res-bf" :class="classNameHandler(item, 0, home_team)">
                  {{ item.home_score }}:{{ item.away_score }}
                  <div class="hover-box">
                    <tbody>
                      <tr class="tr_th">
                        <th>让球</th>
                        <th>进球</th>
                        <th>角球</th>
                      </tr>
                      <tr>
                        <!-- 让球 -->
                        <td class="td_text">
                          <div class="flex-col" v-if="item.handicap_result">
                            <div class="score_num">{{ item.handicap_count }}</div>
                            <div :class="classNameHandler(item, 'handicap_result', home_team)">
                              {{ scoreResultHandler(item, 'handicap_result') }}
                            </div>
                          </div>
                          <div v-else>-</div>
                        </td>
                        <!-- 进球 -->
                        <td class="td_text">
                          <div class="flex-col" v-if="item.goal_result">
                            <div class="score_num">{{ item.goal_count }}</div>
                            <div :class="classNameHandler(item, 'goal_result', home_team)">
                              {{ scoreResultHandler(item, 'goal_result') }}
                            </div>
                          </div>
                          <div v-else>-</div>
                        </td>
                        <!-- 角球 -->
                        <td class="td_text">
                          <div class="flex-col">
                            <div class="score_num">{{ item.corner_count }}</div>
                            <div class="score_num grey corner_score">{{ item.corner_score }}</div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </div>
                </div>
              </td>
              <td class="td_text">
                <div
                  :class="home_team === item.away_name ? classNameHandler(item, 0, home_team) : ''"
                >
                  {{ item.away_name }}
                </div>
              </td>
            </tr>
          </tbody>
          <!-- 篮球 -->
          <tbody v-else>
            <tr class="tr_th">
              <th>日期</th>
              <th>客队</th>
              <th class="content_txt_bf"></th>
              <th>主队</th>
              <!-- <th>让分</th>
              <th>总分</th> -->
            </tr>
            <!-- 让分 handicap_result: 0:- 1:赢 2:输 3:- -->
            <!-- 总分 goal_result: 0:- 1:大 2:小 -->
            <tr
              :class="{ tr_bg: !(index % 2) }"
              v-for="(item, index) in historyFightData.matches"
              :key="item.match_id"
            >
              <td class="td_text">
                <div class="flex-col">
                  <div>{{ timeFix(item.match_start_time) }}</div>
                  <div v-if="item.series_name">{{ item.series_name }}</div>
                </div>
              </td>
              <td class="td_text">
                <div
                  :class="home_team === item.away_name ? classNameHandler(item, 0, home_team) : ''"
                >
                  {{ item.away_name }}
                </div>
              </td>
              <td class="td_text">
                <div class="score_num res-bf" :class="classNameHandler(item, 0, home_team)">
                  {{ item.away_score }}:{{ item.home_score }}
                  <div class="hover-box">
                    <tbody>
                      <tr class="tr_th">
                        <th>让球</th>
                        <th>总分</th>
                      </tr>
                      <tr>
                        <!-- 让分 -->
                        <td class="td_text">
                          <div class="flex-col" v-if="item.handicap_result">
                            <div class="score_num">{{ item.handicap_count }}</div>
                            <div :class="classNameHandler(item, 'handicap_result', home_team)">
                              {{ scoreResultHandler(item, 'handicap_result') }}
                            </div>
                          </div>
                          <div v-else>-</div>
                        </td>
                        <!-- 总分 -->
                        <td class="td_text">
                          <div class="flex-col" v-if="item.goal_result">
                            <div class="score_num">{{ item.goal_count }}</div>
                            <div :class="classNameHandler(item, 'goal_result', home_team)">
                              {{ scoreResultHandler(item, 'goal_result') }}
                            </div>
                          </div>
                          <div v-else>-</div>
                        </td>
                      </tr>
                    </tbody>
                  </div>
                </div>
              </td>
              <td class="td_text">
                <div
                  :class="home_team === item.home_name ? classNameHandler(item, 0, home_team) : ''"
                >
                  {{ item.home_name }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="forward-analysis no_data" v-else>
    <DfEmpty />
  </div>
</template>

<script setup lang="ts">
import { formatTime2 as formatTime } from '@/utils'
// import { getRecentRecord, getHistoryFight } from '@/api/sportsAnalysis'
import { getHistoryFight } from '@/api/sportsAnalysis'

interface MatchListItem {
  wdl: string
  match_id: number
  goal_count: string
  goal_result: number
  corner_count: number
  corner_score: string
  handicap_count: string
  handicap_result: number
  away_name: string
  away_score: number
  away_first_half_score: number
  home_name: string
  home_score: number
  home_first_half_score: number
  match_start_time: number
  series_name: string
}
interface HistoryFightDataModel {
  [key: string]: any
  match_id: number
  win_rate: {
    rate: number
    won_count: number
    drawn_count: number
    lost_count: number
  }
  handicap_rate: {
    rate: number
    won_count: number
    drawn_count: number
    lost_count: number
  }
  score_rate: {
    rate: number
    won_count: number
    drawn_count: number
    lost_count: number
  }
  matches: MatchListItem[]
}

defineOptions({
  name: 'SportsAnalysis',
  inheritAttrs: true
})

const props = defineProps({
  gameId: {
    type: Number,
    default: 0
  },
  matchId: {
    type: Number,
    default: 0
  }
})

// 统计场数
const match_num = ref(10)
// 近期战绩
// const recentData = ref('')
// 历史交锋
const historyFightData = ref<HistoryFightDataModel>({
  match_id: 0,
  win_rate: {
    rate: 0,
    won_count: 0,
    drawn_count: 0,
    lost_count: 0
  },
  handicap_rate: {
    rate: 0,
    won_count: 0,
    drawn_count: 0,
    lost_count: 0
  },
  score_rate: {
    rate: 0,
    won_count: 0,
    drawn_count: 0,
    lost_count: 0
  },
  matches: []
})
// 只看当前赛事
const current_league_only = ref(0)
// 同主客
const same_side = ref(0)
// 主队
const home_team = ref('')
// 客队
// const away_team = ref('')
const game_id = ref(0)
const match_id = ref(0)

watch(
  () => game_id.value,
  (id) => {
    game_id.value = id
    match_id.value = props.matchId
    // if (id) getRecentData()
  }
)

onMounted(() => {
  game_id.value = Number(props.gameId)
  match_id.value = Number(props.matchId)
  getFightData()
})

const rateFix = (rate) => {
  return Math.round(rate * 100) + '%'
}
const timeFix = (timeStamp) => {
  return formatTime(timeStamp, 'yyyy-MM-dd')?.replace(/-/g, '/') || ''
}
const classNameHandler = (data, type, team_name) => {
  // type: 0, 比——分胜负
  // 让球/让分 handicap_result: 0:- 1:赢 2:输 3:走
  // 进球/总分 goal_result: 0:- 1:大 2:小
  let className = ''
  if (type === 0) {
    let res
    if (data.home_name === team_name) {
      res = data.home_score - data.away_score
    } else {
      res = data.away_score - data.home_score
    }
    if (res > 0) {
      className = 'win_corlor'
    } else if (res < 0) {
      className = 'lose_corlor'
    } else {
      className = 'draw_corlor'
    }
  } else if (type === 'handicap_result' || type === 'goal_result') {
    if (data[type] === 1) {
      className = 'win_corlor'
    } else if (data[type] === 2) {
      className = 'lose_corlor'
    } else if (data[type] === 3) {
      className = 'draw_corlor'
    }
  }
  return className
}
const scoreResultHandler = (data, type) => {
  let text = ''
  if (type === 'handicap_result') {
    if (data[type] === 1) {
      text = '赢'
    } else if (data[type] === 2) {
      text = '输'
    } else if (data[type] === 3) {
      text = '走'
    }
  } else if (type === 'goal_result') {
    if (data[type] === 1) {
      text = '大'
    } else if (data[type] === 2) {
      text = '小'
    }
  }
  return text
}
const toggleFilter = (type, data) => {
  if (type === 'same_side') {
    same_side.value = Math.abs(same_side.value - 1)
  } else if (type === 'current_league_only') {
    current_league_only.value = Math.abs(current_league_only.value - 1)
  } else if (type === 'match_num') {
    if (match_num.value === data) return console.log('match_num没变')
    match_num.value = data
  }
  getFightData()
}
// 历史交锋
const getFightData = async () => {
  if (!match_id.value) return console.error(':::::::体育前瞻分析：比赛id异常，历史交锋数据请求驳回')
  const params = {
    match_num: match_num.value,
    current_league_only: current_league_only.value ? 1 : 0,
    same_side: same_side.value,
    game_id: game_id.value,
    match_id: match_id.value
  }
  let { code, data } = (await getHistoryFight(params)) as any
  console.log('data:::fight', data, code)
  if (code === 0 && data.match_id) {
    historyFightData.value = data
    home_team.value = data.team_name
  }
}
// 近期战绩
// 后端未接入
// const getRecentData = async () => {
//   if (!match_id.value) return console.error(':::::::体育前瞻分析：比赛id异常，近期战绩数据请求驳回')
//   const params = {
//     match_num: match_num.value,
//     current_league_only: current_league_only.value ? 1 : 0,
//     same_side: same_side.value,
//     game_id: game_id.value,
//     match_id: match_id.value
//   }
//   let { code, data } = (await getRecentRecord(params)) as any
//   if (code === 0) {
//     recentData.value = data
//   }
// }
</script>

<style scoped lang="scss">
 .tw-flex-cloumn {
    flex-direction: column;
  }
.flex-1 {
  flex: 1;
}

.flex-row {
  display: flex;
}

.flex-row {
  flex-direction: row;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-center,
.flex-x-center {
  display: flex;
  justify-content: center;
}

.flex-center {
  align-items: center;
}

.flex-x-around {
  display: flex;
  justify-content: space-around;
}

.flex-x-between {
  display: flex;
  justify-content: space-between;
}

.flex-y-start {
  display: flex;
  -webkit-box-align: flex-start;
  -ms-flex-align: flex-start;
  -ms-grid-row-align: flex-start;
  align-items: flex-start;
}

.flex-y-center {
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -ms-grid-row-align: center;
  align-items: center;
}

.flex-y-end {
  display: flex;
  -webkit-box-align: flex-end;
  -ms-flex-align: flex-end;
  -ms-grid-row-align: flex-end;
  align-items: flex-end;
}

table {
  width: 100%;
  font-size: 14px;
}

table td,
table th {
  border: none;
  text-align: center;
}

table td {
  padding: 17px;
}

// table tr {
//   cursor: pointer;
// }

.table_wrapper {
  .table {
    border: 0;
  }

  .tr_th {
    background: #fff;
    height: 32px;
    line-height: 32px;
    color: #9f9f9f;
    position: sticky;
  }

  .tr_bg {
    background: #f7f7f7;
  }
}

.score_num {
  font-size: 14px;
  font-family: DINAlternate-Bold, DINAlternate, 'sans-serif';
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 16px;
  &.res-bf {
    cursor: pointer;
    text-decoration: underline;
    position: relative;
  }
  &.grey {
    color: #9f9f9f;
  }
}
.win_corlor {
  color: #c53920;
}

.lose_corlor {
  color: #2fab4e;
}

.draw_corlor {
  color: #127bd1;
}

::-webkit-scrollbar {
  display: none;
}

.forward-analysis {
  width: 100%;
  // height: 100%;
  // overflow: auto;
  padding: 0 12px;
  // &::-webkit-scrollbar {
  //   width: 5px;
  //   display: initial;
  //   border-radius: 5px;
  // }
}
.analysis_wrapper {
  padding-bottom: 20px;

  .analysis_title {
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    line-height: 25px;
    width: 100%;
    height: 44px;
    margin-bottom: 16px;
    margin-top: 0;
  }

  .analysis_title:before {
    content: ' ';
    display: block;
    width: 0;
    height: 12px;
    border-right: 4px solid var(--el-text-color-primary);
    margin-right: 4px;
  }

  .teamRow {
    height: 44px;
    width: 100%;
    margin-bottom: 10px;
    margin-top: 22px;
    font-size: 16px;
    font-family:
      PingFangSC-Semibold,
      PingFang SC,
      'sans-serif';
    font-weight: 600;
    color: #303033;
    line-height: 22px;
  }

  .teamRow img {
    width: 30px;
    height: 30px;
    margin-right: 7px;
  }

  .rate_section {
    width: 100%;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 2px;
    margin: 24px 0;
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    line-height: 30px;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 5px;
    .rate_section--item {
      flex: 1
    }
  }

  .rate_section .percent_num {
    font-size: 16px;
    font-family: DINAlternate-Bold, DINAlternate, 'sans-serif';
    font-weight: 600;
    color: #c53920;
    line-height: 30px;
    margin: 0 5px;
  }

  .rate_section .rate_result {
    font-size: 14px;
    font-family: PingFang-SC-Medium, PingFang-SC, 'sans-serif';
    font-weight: 500;
    color: #a1a1a2;
    line-height: 30px;
  }
}

.filterTab {
  width: 100%;
  .proBut {
    height: 36px;
    background: var(--el-fill-color);
    border-radius: 2px;
    border: 1px solid var(--el-border-color-light);
    font-size: 16px;
    font-family: PingFang-SC-Medium, PingFang-SC, 'sans-serif';
    font-weight: 500;
    color: var(--el-text-color-primary);
    line-height: 22px;
    cursor: pointer;
    &.btn_active {
      border: 0;
      color: #fff;
      background-image: linear-gradient(114deg, rgba(251, 0, 81, 0.88) -2%, rgba(179, 0, 41, 0.8));
    }
  }
  .matchNumTab {
    height: 36px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 2px;
    .matchNumTabItem {
      height: 30px;
      font-size: 16px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      line-height: 22px;
      cursor: pointer;
      &.active {
        color: var(--el-menu-hover-text-color);
        background: #fff;
      }
    }
  }
}
.hover-box {
  display: none;
  position: absolute;
  padding: 12px;
  top: 80%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--el-bg-color-overlay);
  border: 2px solid var(--el-borer-color);
  border-radius: 5px;
  z-index: 1;
  .score_num {
    color: var(--el-text-color-primary);
  }
  .corner_score {
    white-space: nowrap;
  }
}
.res-bf {
  &:hover {
    .hover-box {
      display: block;
    }
  }
}
// 深色主题
.dark {
  .analysis_wrapper {
    .rate_section {
      background: rgb(46 46 46 / 60%);
    }
    .filterTab .matchNumTab .matchNumTabItem.active {
      background-color: #4e212a;
    }
    .filterTab .proBut.btn_active {
      background-image: linear-gradient(114deg, #93113b -2%, #5c0015);
    }
    .table_wrapper .tr_bg {
      background-color: rgba(133, 133, 133, 0.05);
    }
    .table_wrapper .tr_th {
      background: rgba(185, 183, 183, 0.15);
    }
  }
}
</style>
