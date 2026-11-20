<template>
  <div class="forward-analysis" v-if="historyFightData && historyFightData.match_id">
    <div class="analysis_wrapper">
      <!-- 历史交锋 -->
      <div class="analysis_title flex-y-center">历史交锋</div>
      <div class="flex-row flex-x-between flex-y-center filterTab">
        <div class="flex-y-center">
          <div
            class="proBut flex-center"
            :class="{ btn_active: same_side }"
            @click="toggleFilter('same_side')"
          >
            同主客
          </div>
          <div
            class="proBut flex-center"
            :class="{ btn_active: current_league_only }"
            @click="toggleFilter('current_league_only')"
          >
            本赛事
          </div>
        </div>
        <div class="flex-y-center matchNumTab flex-center">
          <div
            class="matchNumTabItem flex-center"
            :class="{ active: match_num === 10 }"
            @click="toggleFilter('match_num', 10)"
          >
            10场
          </div>
          <div
            class="matchNumTabItem flex-center"
            :class="{ active: match_num === 20 }"
            @click="toggleFilter('match_num', 20)"
          >
            20场
          </div>
        </div>
      </div>

      <div class="rate_section flex-y-center flex-x-around">
        <div class="flex-y-center">
          <div>胜率</div>
          <div class="percent_num">{{ rateFix(historyFightData.win_rate.rate) }}</div>
          <div class="rate_result">
            {{ historyFightData.win_rate.won_count }}胜{{
              historyFightData.win_rate.drawn_count
            }}平{{ historyFightData.win_rate.lost_count }}负
          </div>
        </div>
        <div class="flex-y-center">
          <div>赢率</div>
          <div class="percent_num">{{ rateFix(historyFightData.handicap_rate.rate) }}</div>
          <div class="rate_result">
            {{ historyFightData.handicap_rate.won_count }}赢{{
              historyFightData.handicap_rate.drawn_count
            }}走{{ historyFightData.handicap_rate.lost_count }}输
          </div>
        </div>
        <div class="flex-y-center">
          <div>大率</div>
          <div class="percent_num">{{ rateFix(historyFightData.score_rate.rate) }}</div>
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
              <th>让球</th>
              <th>进球</th>
              <th>角球</th>
            </tr>
            <!-- 让球 handicap_result: 0:- 1:赢 2:输 3:走 -->
            <!-- 进球 goal_result: 0:- 1:大 2:小 -->
            <tr
              :class="{ tr_bg: !index % 2 }"
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
                <div class="score_num" :class="classNameHandler(item, 0, home_team)">
                  {{ item.home_score }}:{{ item.away_score }}
                </div>
              </td>
              <td class="td_text">
                <div
                  :class="home_team === item.away_name ? classNameHandler(item, 0, home_team) : ''"
                >
                  {{ item.away_name }}
                </div>
              </td>
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
                  <div class="score_num grey">{{ item.corner_score }}</div>
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
              <th>让分</th>
              <th>总分</th>
            </tr>
            <!-- 让分 handicap_result: 0:- 1:赢 2:输 3:- -->
            <!-- 总分 goal_result: 0:- 1:大 2:小 -->
            <tr
              :class="{ tr_bg: !index % 2 }"
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
                <div class="score_num" :class="classNameHandler(item, 0, home_team)">
                  {{ item.away_score }}:{{ item.home_score }}
                </div>
              </td>
              <td class="td_text">
                <div
                  :class="home_team === item.home_name ? classNameHandler(item, 0, home_team) : ''"
                >
                  {{ item.home_name }}
                </div>
              </td>
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
        </table>
      </div>
    </div>
  </div>
  <div class="forward-analysis no_data" v-else>
    <DfEmpty />
  </div>
</template>
<script>
import { formatTime2 as formatTime } from '@/utils'
import { getRecentRecord, getHistoryFight } from '@/api/sportsAnalysis'

export default {
  name: 'SportAnalysis',
  props: {
    gameId: {
      type: [String, Number],
      default: ''
    },
    matchId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      // 统计场数
      match_num: 10,
      // 近期战绩
      recentData: '',
      // 历史交锋
      historyFightData: '',
      // 只看当前赛事
      current_league_only: 0,
      // 同主客
      same_side: 0,
      // 主队
      home_team: '',
      // 客队
      away_team: '',
      game_id: '',
      match_id: '',
      loading: false
      // requestResData: "",
      // mockData: "",
    }
  },
  watch: {
    gameId(id) {
      this.game_id = id
      // this.game_id = 4
      this.match_id = this.matchId
      if (id) this.getRecentData()
    }
  },
  mounted() {
    // 加载近期数据
    this.game_id = Number(this.gameId)
    this.match_id = Number(this.matchId)
    // this.game_id = 201
    // this.match_id = 458262
    this.getFightData()
    // this.getRecentData()
  },
  methods: {
    rateFix(rate) {
      return Math.round(rate * 100) + '%'
    },
    timeFix(timeStamp) {
      return formatTime(timeStamp, 'yyyy-MM-dd')?.replace(/-/g, '/') || ''
    },
    classNameHandler(data, type, team_name) {
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
    },
    scoreResultHandler(data, type) {
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
    },
    toggleFilter(type, data) {
      if (type === 'same_side') {
        this.same_side = Math.abs(this.same_side - 1)
      } else if (type === 'current_league_only') {
        this.current_league_only = Math.abs(this.current_league_only - 1)
      } else if (type === 'match_num') {
        if (this.match_num === data) return console.log('match_num没变')
        this.match_num = data
      }
      this.getFightData()
    },
    // 历史交锋
    async getFightData() {
      if (!this.match_id)
        return console.error(':::::::体育前瞻分析：比赛id异常，历史交锋数据请求驳回')
      const params = {
        match_num: this.match_num,
        current_league_only: this.current_league_only ? 1 : 0,
        same_side: this.same_side,
        game_id: this.game_id,
        match_id: this.match_id
      }
      this.loading = true
      let { code, data } = await getHistoryFight(params)
      console.log('data:::fight', data, code)
      this.loading = false
      if (code === 0) {
        this.historyFightData = data
        this.home_team = data.team_name
      }
    },
    // 近期战绩
    async getRecentData() {
      if (!this.match_id)
        return console.error(':::::::体育前瞻分析：比赛id异常，近期战绩数据请求驳回')
      const params = {
        match_num: this.match_num,
        current_league_only: this.current_league_only ? 1 : 0,
        same_side: this.same_side,
        game_id: this.game_id,
        match_id: this.match_id
      }
      this.loading = true
      let { code, data } = await getRecentRecord(params)
      this.loading = false
      if (code === 0) {
        this.recentData = data
      }
    }
  }
}
</script>

<style scoped lang="scss">
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

table tr {
  cursor: pointer;
}

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
  color: #000;
  line-height: 16px;
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

.analysis_wrapper {
  padding-bottom: 20px;

  .analysis_title {
    font-size: 18px;
    font-family:
      PingFangSC-Semibold,
      PingFang SC,
      'sans-serif';
    font-weight: 600;
    color: #303133;
    line-height: 25px;
    width: 100%;
    height: 44px;
    margin-bottom: 16px;
    margin-top: 40px;
  }

  .analysis_title:before {
    content: ' ';
    display: block;
    width: 0;
    height: 12px;
    border-right: 4px solid #303133;
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
    height: 68px;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 2px;
    margin: 24px 0;
    font-size: 16px;
    font-family:
      PingFangSC-Medium,
      PingFang SC,
      'sans-serif';
    font-weight: 500;
    color: #303133;
    line-height: 30px;
  }

  .rate_section .percent_num {
    font-size: 26px;
    font-family: DINAlternate-Bold, DINAlternate, 'sans-serif';
    font-weight: 700;
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
    width: 100px;
    height: 36px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 16px;
    font-family: PingFang-SC-Medium, PingFang-SC, 'sans-serif';
    font-weight: 500;
    color: #303133;
    line-height: 22px;
    cursor: pointer;
    &:first-child {
      margin-right: 10px;
    }
    &.btn_active {
      border: 0;
      color: #fff;
      background-image: linear-gradient(114deg, #eecfb5 -2%, #d8ad66);
    }
  }
  .matchNumTab {
    width: 196px;
    height: 36px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 2px;
    .matchNumTabItem {
      width: 94px;
      height: 30px;
      font-size: 16px;
      font-family:
        PingFangSC-Medium,
        PingFang SC,
        'sans-serif';
      font-weight: 500;
      color: #303133;
      line-height: 22px;
      cursor: pointer;
      &.active {
        color: #b08a5b;
        background: #fff;
      }
    }
  }
}
</style>
