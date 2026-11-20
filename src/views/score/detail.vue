<!-- 即时比。分详情 -->
<template>
  <div class="score-detail-container" style="padding-top: 70px">
    <div class="score-detail-header-container" v-if="query.type == 'basketball'">
      <div class="score-detail-header" style="width: 1200px">
        <div class="team">
          <div class="guest-name1 name tip-basketball">
            <span class="ellipsis match-name" style="max-width: 340px">{{
              detail.home_team_data.short_name_zh
            }}</span
            ><img
              style="object-fit: initial"
              v-if="detail.home_team_data.logo"
              :src="detail.home_team_data.logo || teamLogo"
            /><span class="num">{{ detail.home_scores_total }}</span>
          </div>
          <div class="score">
            <p class="league-name">
              <span>{{ detail.match_time }}</span> {{ detail.short_name_zh }}
            </p>
            <p class="time" style="margin-top: 4px">VS</p>
          </div>
          <div class="host-name1 name tip-basketball">
            <span class="num">{{ detail.away_scores_total }}</span
            ><img
              v-if="detail.away_team_data.logo"
              :src="detail.away_team_data.logo || teamLogo"
            /><span class="ellipsis match-name" style="max-width: 340px">{{
              detail.away_team_data.short_name_zh
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="score-detail-header-container" v-else>
      <div class="score-detail-header" style="width: 1200px; background-image:">
        <div class="team">
          <div class="guest-name name">
            <span class="num" style="color:" v-if="detail.away_data">{{ detail.away_data[0] }}</span
            ><img :src="detail.away_team_log || teamLogo" /><span
              class="ellipsis match-name"
              style="color:"
              >{{ detail.away_team_name_zh }}</span
            >
          </div>
          <div class="score">
            <p class="league-name">
              <span>{{ detail.time }}</span> {{ detail.competition_name_zh }}
            </p>
            <div>
              <div class="on-time flex-center custom-score-wrap" style="color:">
                <div>
                  <p class="time-text">
                    {{ detail.status == 1 ? '未开始' : detail.status == 8 ? '完' : '比赛中' }}
                  </p>
                </div>
              </div>
              <p class="color-999 score-text">
                <span
                  >半:
                  <!-- -->{{ detail.half_score }} </span
                ><span v-if="detail.home_data"
                  >&nbsp;&nbsp;角:
                  <!-- -->{{ detail.away_data[8] }}-{{ detail.home_data[8] }}
                </span>
              </p>
            </div>
          </div>
          <div class="host-name name">
            <span class="ellipsis match-name" style="color:">{{ detail.home_team_name_zh }}</span
            ><img :src="detail.home_team_log || teamLogo" /><span
              class="num"
              style="color:"
              v-if="detail.home_data"
              >{{ detail.home_data[0] }}</span
            >
          </div>
          <div class="custom-matchData-info"></div>
        </div>
      </div>
    </div>
    <div class="score-detail-nav-container">
      <ul class="navs">
        <li class="item" v-for="(item, index) in tabList" :key="index">
          <a :class="index == tabIndex ? 'active' : ''" @click="tabIndex = index">{{ item }}</a>
        </li>
      </ul>
    </div>
    <div class="match-detail-analyze">
      <!-- 篮球 数据分析 -->
      <detail1
        v-if="tabIndex == 4 && query.type == 'basketball'"
        :query="query"
        :analyze="analyze"
        :list="detail"
        @getDetail="getDetail"
      ></detail1>
      <!-- 足球 数据分析 -->
      <detail7
        v-if="tabIndex == 4 && query.type == 'football'"
        :query="query"
        :analyze="analyze"
        :list="detail"
        @getDetail="getDetail"
      ></detail7>
      <!-- 欧赔指数 -->
      <detail2
        v-if="tabIndex == 1"
        :query="query"
        @getDetail="getDetail"
        :list="dataBase"
      ></detail2>
      <!-- 亚盘 / 让分 -->
      <detail3
        v-if="tabIndex == 2"
        :query="query"
        @getDetail="getDetail"
        :list="dataBase"
      ></detail3>
      <!-- 大小球 / 总分 -->
      <detail4
        v-if="tabIndex == 3"
        :query="query"
        @getDetail="getDetail"
        :list="dataBase"
      ></detail4>
      <detail6
        v-if="tabIndex == 6"
        @getDetail="getDetail"
        :list="dataBase"
        :type="type"
        :id="id"
      ></detail6>
    </div>
  </div>
</template>

<script>
import teamLogo from '/static/images/team.png'
import detail1 from './detail1.vue'
import detail2 from './detail2.vue'
import detail3 from './detail3.vue'
import detail4 from './detail4.vue'
import detail6 from './detail6.vue'
import detail7 from './detail7.vue'
import { getExponent, getBasketballInfo } from '@/api/basketball.js'
import { getAnalyze, footballOddsList, getfootballDetail } from '@/api/football.js'
import mittBus from '@/utils/mittBus'

export default {
  components: {
    detail1,
    detail2,
    detail3,
    detail4,
    detail6,
    detail7
  },
  data() {
    return {
      teamLogo,
      id: null,
      type: '',
      detail: {},
      analyze: {},
      dataBase: {},
      tabIndex: 2,
      tabList: [] //'数据分析' '三合一' 暂时不做隐藏10-28
    }
  },
  created() {
    // 获取type详情
    // console.log()
    this.query = this.$route.query

    if (this.query.type == 'basketball') {
      this.getBasketballInfo()
      this.getExponent()
      this.tabList = ['视频直播', '欧赔', '让分', '总分', '数据分析']
    } else {
      this.getAnalyse()
      this.footballOddsList()
      this.getfootballDetail()
      this.tabList = ['视频直播', '欧赔指数', '亚盘', '大小球', '数据分析'] //足球
    }
    if (this.query.tabIndex == 4) {
      this.tabIndex = 4
    }
  },
  methods: {
    // 蓝球详情
    getExponent() {
      console.log('我是篮球')
      getExponent({
        id: this.query.id
      })
        .then((res) => {
          this.dataBase = res.data
        })
        .catch((res) => {})
    },
    // 篮球对战详情
    getBasketballInfo() {
      getBasketballInfo({
        id: this.query.id
      })
        .then((res) => {
          this.detail = res.data
        })
        .catch((res) => {})
    },
    // 获取分析 足球
    getAnalyse() {
      getAnalyze({
        id: this.query.id
      })
        .then((res) => {
          this.analyze = res.data
        })
        .catch((res) => {})
    },

    // 足球
    footballOddsList() {
      footballOddsList({
        id: this.query.id
      })
        .then((res) => {
          this.dataBase = res.data
        })
        .catch((res) => {})
    },

    // 足球对战详情
    getfootballDetail() {
      getfootballDetail({
        id: this.query.id
      })
        .then((res) => {
          this.detail = res.data
        })
        .catch((res) => {})
    },
    // 监听子集点击查看按钮触发切换detail6
    getDetail(e) {
      console.log(e)
      this.id = Number(e.id)
      this.type = e.type
      this.tabIndex = 6
    }
  }
}
</script>

<style lang="scss" scoped="scoped">
.match-detail-analyze {
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(.ellipsis) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :deep(.line) {
    display: inline-block;
    width: 4px;
    height: 16px;
    margin-right: 10px;
    border-radius: 2px;
  }

  :deep(.line-d9ad66) {
    background-color: #d9ad66;
  }

  :deep(.line-0071e3) {
    background-color: #0071e3;
  }

  :deep(bold) {
    font-weight: 700;
  }

  :deep(.black, .color-333) {
    color: #333;
  }

  :deep(.color-666) {
    color: #666;
  }

  :deep(.color-ff5d5d) {
    color: #ff5d5d;
  }

  :deep(.color-f48484) {
    color: #f48484;
  }

  :deep(.color-e30000, .red) {
    color: #e30000;
  }

  :deep(.color-6dd400, .green) {
    color: #6dd400;
  }

  :deep(.blue, .color-7770b6) {
    color: #7770b6;
  }

  :deep(.ant-table .ant-table-thead) {
    font-size: 12px;
  }

  :deep(.ant-table .ant-table-thead > tr > th) {
    padding: 0;
    height: 45px;
    text-align: center;
    color: #999;
    border: none;
    font-weight: 400;
    background: #fafafa;
  }

  :deep(.ant-table .ant-table-tbody) {
    font-size: 14px;
  }

  :deep(.ant-table .ant-table-tbody > tr > td) {
    height: 50px;
    padding: 0;
    text-align: center;
    font-weight: 400;
    color: #333;
    border: none;
  }

  :deep(.ant-table .ant-table-tbody .ant-empty) {
    display: none;
  }

  :deep(.ant-checkbox-checked:after, .ant-checkbox-inner) {
    border-radius: 50%;
  }

  :deep(.ant-radio-checked .ant-radio-inner:after) {
    top: -1px;
    left: -1px;
    width: 16px;
    height: 16px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAS1BMVEUAAADZrmfftWrsxXbZrmbYrmbZrmfYrmfarWbZr2far2bbsGjbsWfYrWb////dt3j69e3nzKHv3sLZsGz16tj37t/u27zy5M3p0qucMWz4AAAADXRSTlMA8xgG49nHv5aVgkct8zFIpgAAAMdJREFUOMuFk1sSgyAMRRMp8vJqq63t/lfaEa0Fg3J+dOZcCEpCf1RwRjNr44IiSWMZO2ybg1aekcFeZctbCNpkk+6GArduX796mdj2UC1OaNdzeJziYwEuuil+y1LEFv2jfy0PS6S47NcAKwon/j7Et0Du0sORufQwpC89NG1nnOep5MFbYOj751Tw4F+JMSaEhyaDJCE8DDkkCeHhKCBJCI+Q/upRelbZZX3eBw+bXbeEm1rDVFuu1rTVtq8PTn306sNbHf8v8d0ouYc5rAcAAAAASUVORK5CYII=)
      no-repeat;
    background-size: contain;
    background-color: transparent;
  }

  :deep(.ant-select-arrow) {
    transform: scaleY(0.7);
    color: #999;
  }

  :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    border-radius: 3px;
  }
}

.ant-table-thead > tr > th {
  height: 44px;
  line-height: 44px;
  color: #333 !important;
  background-color: #f1f3f4;
}
</style>
