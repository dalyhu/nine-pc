<!-- 前瞻列表 -->
<template>
  <div>
    <div class="foresight-list">
      <el-collapse @change="handleChange" v-model="activeNames" accordion>
        <el-collapse-item
          v-for="(item, index) in matchList.data"
          :name="JSON.stringify(item)"
          :key="index"
        >
          <template v-slot:title style="height: 88px">
            <div class="f-t flex">
              <div class="f-t-name flex-start">
                <img :src="item.competition_logo || teamLogo" />
                <span class="ellipsis">{{ item.competition_name }}</span>
              </div>
              <span class="f-t-time">{{ item.match_time_str }}</span>
              <div class="f-t-team flex-center">
                <div class="flex-end">
                  <p class="text-clamp" style="text-align: right">{{ item.home_team_name }}</p>
                  <img :src="item.home_logo || teamLogo" />
                </div>
                <span>VS</span>
                <div class="flex-start">
                  <img :src="item.away_logo || teamLogo" />
                  <p class="text-clamp">{{ item.away_team_name }}</p>
                </div>
              </div>
              <div class="f-t-btn" @click.stop="">
                <!-- style="border-right: 1px solid #999;" -->
                <span>
                  <a
                    :href="'/score-detail?type=football&tabIndex=4&id=' + item.sourceid"
                    target="_self"
                    >分析</a
                  >
                </span>
                <!-- <span>详情</span> -->
              </div>
            </div>
          </template>
          <!-- 内容 -->
          <div class="t-c">
            <div class="t-c-left">
              <div class="t-c-left-title ellipsis" :data-id="item.sourceid">
                {{ propArr.home_team_name }}VS{{ propArr.away_team_name }}
              </div>
              <div class="t-c-left-nav">
                <div class="t-c-left-nav-li">
                  <p>历史交锋胜率</p>
                  <div class="t-c-left-nav-li-p flex-center">
                    <span>{{ base.home_vs_won_rate }}</span>
                    <div class="t-c-left-nav-li-p-j flex">
                      <span
                        class="left"
                        :style="{
                          width: getCount(base.home_vs_won_rate, base.away_vs_won_rate, 1)
                        }"
                      ></span>
                      <span
                        class="right"
                        :style="{
                          width: getCount(base.away_vs_won_rate, base.home_vs_won_rate, 1)
                        }"
                      ></span>
                    </div>
                    <span>{{ base.away_vs_won_rate }}</span>
                  </div>
                </div>
                <div class="t-c-left-nav-li">
                  <p>近期对战胜率</p>
                  <div class="t-c-left-nav-li-p flex-center">
                    <span>{{ base.home_recent_won_rate }}</span>
                    <div class="t-c-left-nav-li-p-j flex">
                      <span class="left" :style="{ width: base.home_recent_won_rate }"></span>
                      <span class="right" :style="{ width: base.away_recent_won_rate }"></span>
                    </div>
                    <span>{{ base.away_recent_won_rate }}</span>
                  </div>
                </div>
                <div class="t-c-left-nav-li">
                  <p>本赛季胜率</p>
                  <div class="t-c-left-nav-li-p flex-center">
                    <span>{{ base.home_season_won_rate }}</span>
                    <div class="t-c-left-nav-li-p-j flex">
                      <span class="left" :style="{ width: base.home_season_won_rate }"></span>
                      <span class="right" :style="{ width: base.away_season_won_rate }"></span>
                    </div>
                    <span>{{ base.away_season_won_rate }}</span>
                  </div>
                </div>
                <div class="t-c-left-nav-li">
                  <p>进球数</p>
                  <div class="t-c-left-nav-li-p flex-center">
                    <span>{{ base.home_recent_goal }}</span>
                    <div class="t-c-left-nav-li-p-j flex">
                      <span
                        class="left"
                        :style="{
                          width: getCount(base.home_recent_goal, base.away_recent_goal, 2)
                        }"
                      ></span>
                      <span
                        class="right"
                        :style="{
                          width: getCount(base.away_recent_goal, base.home_recent_goal, 2)
                        }"
                      ></span>
                    </div>
                    <span>{{ base.away_recent_goal }}</span>
                  </div>
                </div>
                <div class="t-c-left-nav-li">
                  <p>失球数</p>
                  <div class="t-c-left-nav-li-p flex-center">
                    <span>{{ base.home_recent_last }}</span>
                    <div class="t-c-left-nav-li-p-j flex">
                      <span
                        class="left"
                        :style="{
                          width: getCount(base.home_recent_last, base.away_recent_last, 2)
                        }"
                      ></span>
                      <span
                        class="right"
                        :style="{
                          width: getCount(base.away_recent_last, base.home_recent_last, 2)
                        }"
                      ></span>
                    </div>
                    <span>{{ base.away_recent_last }}</span>
                  </div>
                </div>
              </div>
              <div class="t-c-left-tips">最近6场比赛战绩</div>
              <div class="t-c-left-arr flex">
                <div class="t-c-left-arr-left">
                  <span
                    v-for="(item, index) in base.home_recent_arr"
                    :style="{
                      color: item == '胜' ? '#FF3A31' : item == '负' ? '#56B414' : '#6697E6'
                    }"
                    >{{ item }}</span
                  >
                </div>
                <div class="t-c-left-arr-left">
                  <span
                    v-for="(item, index) in base.away_recent_arr"
                    :style="{
                      color: item == '胜' ? '#FF3A31' : item == '负' ? '#56B414' : '#6697E6'
                    }"
                    >{{ item }}</span
                  >
                </div>
              </div>
            </div>
            <div class="t-c-right">
              <div class="t-c-right-title flex">
                <span
                  v-for="(item, index) in titleNav"
                  :key="index"
                  :class="{ actvie: titleIndex == index }"
                  @click="titleIndex = index"
                  >{{ item }}</span
                >
              </div>
              <!-- 内容1 -->
              <div class="t-c-right-nav" style="position: relative" v-if="titleIndex == 0">
                <div class="flex">
                  <div class="t-c-right-nav-li">
                    <p>{{ propArr.home_team_name }}</p>
                    <div class="flex-start t-c-right-nav-li-t">
                      <img src="/static/images/foresight-down.png" />
                      <span class="yl-1">有利消息</span>
                    </div>
                    <div class="t-c-right-nav-li-c" v-for="(item, index) in matchData.good.home">
                      {{ item }}
                    </div>

                    <div class="flex-start t-c-right-nav-li-t">
                      <img src="/static/images/foresight-up.png" />
                      <span style="color: #4280dc">不利消息</span>
                    </div>
                    <div class="t-c-right-nav-li-c" v-for="(item, index) in matchData.bad.home">
                      {{ item }}
                    </div>
                  </div>
                  <div class="t-c-right-nav-li">
                    <p>{{ propArr.away_team_name }}</p>
                    <div class="flex-start t-c-right-nav-li-t">
                      <img src="/static/images/foresight-down.png" />
                      <span class="yl-2">有利消息</span>
                    </div>
                    <div class="t-c-right-nav-li-c" v-for="(item, index) in matchData.good.away">
                      {{ item }}
                    </div>

                    <div class="flex-start t-c-right-nav-li-t">
                      <img src="/static/images/foresight-up.png" />
                      <span style="color: #4280dc">不利消息</span>
                    </div>
                    <div class="t-c-right-nav-li-c" v-for="(item, index) in matchData.bad.away">
                      {{ item }}
                    </div>
                  </div>
                </div>
                <!-- <div class="t-c-right-nav-li-btn">
									查看详情
								</div> -->
              </div>
              <!-- 内容2-3-4 -->
              <div class="t-c-right-nav" style="padding: 20px" v-else>
                <div class="flex t-c-right-nav-table">
                  <span style="width: 104px; text-align: center">公司</span>
                  <div class="flex li">
                    <p>{{ title[titleIndex - 1].a }}</p>
                    <span>即时</span>
                    <p>{{ title[titleIndex - 1].b }}</p>
                  </div>
                  <div class="flex li">
                    <p>{{ title[titleIndex - 1].a }}</p>
                    <span>初始</span>
                    <p>{{ title[titleIndex - 1].b }}</p>
                  </div>
                </div>
                <el-table
                  :data="matchData.list"
                  border
                  :stripe="true"
                  :show-header="false"
                  :span-method="arraySpanMethod"
                  style="width: 100%"
                >
                  <el-table-column prop="company_name" label="公司" align="center">
                  </el-table-column>
                  <el-table-column>
                    <!-- <template >
										     <span>{{scope.row}}</span>
										</template> -->
                    <div class="flex li" style="padding: 0 19px" slot-scope="scope">
                      <span>{{ scope.row.scilicet_host }}</span>
                      <span>{{ scope.row.scilicet_early }}</span>
                      <span>{{ scope.row.scilicet_guest }}</span>
                    </div>
                  </el-table-column>
                  <el-table-column prop="name" label="姓名"> </el-table-column>
                  <el-table-column prop="name" label="姓名"> </el-table-column>
                  <el-table-column prop="name" label="姓名">
                    <div class="flex li" style="padding: 0 19px" slot-scope="scope">
                      <span>{{ scope.row.early_host }}</span>
                      <span>{{ scope.row.early_early }}</span>
                      <span>{{ scope.row.early_guest }}</span>
                    </div>
                  </el-table-column>
                  <el-table-column prop="address" label="地址"> </el-table-column>
                  <el-table-column prop="address" label="地址"> </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="flex-center" style="background-color: #ffffff; padding: 40px 0">
      <el-pagination
        background
        v-model:current-page="page"
        layout="prev, pager, next"
        :page-size="20"
        :total="matchList.total"
      />
    </div>
  </div>
</template>

<script>
import teamLogo from '/static/images/team.png'
import { footballOddsList } from '@/api/football.js'
import { getList, match_foresight, match_analyze_data } from '@/api/foresight.js'
export default {
  name: 'ForesightIndex',
  data() {
    return {
      teamLogo,
      page: 1,
      options: [
        {
          value: '选项5',
          label: '测试'
        }
      ],
      value: '',
      titleIndex: 0,
      activeNames: '',
      titleNav: ['优劣势分析', '胜负', '让球', '进球数'],
      tableData: [
        {
          date: '05-02',
          name: '王小虎',
          address: ' 1518 弄'
        },
        {
          date: '05-04',
          name: '王小虎',
          address: ' 1517 弄'
        },
        {
          date: '05-01',
          name: '王小虎',
          address: ' 1519 弄'
        },
        {
          date: '05-03',
          name: '王小虎',
          address: ' 1516 弄'
        }
      ],
      matchList: {
        data: [],
        total: 0
      },
      propArr: {}, //选中的参数
      title: [
        {
          a: '主胜',
          b: '客胜'
        },
        {
          a: '主胜',
          b: '客胜'
        },
        {
          a: '大球',
          b: '小球'
        }
      ],
      matchData: {
        asia: [],
        bs: [],
        eu: [],
        bad: {},
        good: {},
        list: []
      }, //优劣势分析
      base: {} //获取比赛数据
    }
  },
  mounted() {
    this.getList()
  },
  watch: {
    titleIndex(e) {
      let match = this.matchData
      if (e == 1) {
        this.matchData.list = match.eu
      } else if (e == 2) {
        this.matchData.list = match.bs
      } else if (e == 3) {
        this.matchData.list = match.asia
      }
    },
    page() {
      this.getList()
    }
  },
  methods: {
    // 获取前瞻列表
    getList() {
      getList({ page: this.page }).then((res) => {
        this.matchList = res.data
        this.activeNames = JSON.stringify(res.data.data[0])
        this.handleChange(this.activeNames)
      })
    },
    // 触发获取优劣势
    handleChange(val) {
      if (!val) return //关闭
      let prop = JSON.parse(val)
      // if(this.propArr.sourceid == prop.sourceid) return //去重
      this.titleIndex = 0
      this.propArr = prop
      match_foresight({ id: prop.sourceid }).then((res) => {
        //获取优劣势
        // this.matchData = {...this.matchData,...res.data}
        this.matchData = res.data

        footballOddsList({ id: prop.sourceid }).then((res) => {
          //获取指数
          this.matchData = { ...this.matchData, ...res.data }
        })
      })

      match_analyze_data({ id: prop.sourceid }).then((res) => {
        //获取前瞻比赛数据
        this.base = res.data
      })
    },
    // 计算（
    getCount(n1, n2, type) {
      let n11 = parseFloat(n1)
      let n22 = parseFloat(n2)
      if (type == 1) {
        //计算百分比
        if (n11 === 0 && n22 === 0) {
          return '0%'
        }
        if (n11 !== NaN || n22 !== NaN) {
          return (n11 / (n11 + n22)) * 100 + '%'
        }
      } else {
        if (n11 === 0 && n22 === 0) {
          return '0%'
        }
        return (n1 / (n2 + n1)) * 100 + '%'
      }
    },

    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return [1, 3]
      } else if (columnIndex === 4) {
        return [1, 6]
      }
      if (columnIndex === 6 || columnIndex === 2 || columnIndex === 3 || columnIndex === 5) {
        return [0, 0]
      }
    }
  }
}
</script>

<style lang="scss">
.el-collapse-item__header {
  height: 88px;
  line-height: revert !important;
  transition: all 0.1s;
  .el-collapse-item__arrow {
    margin-top: 3px;
  }
}
.el-collapse-item__header:hover .showMask {
  height: 87px;
}
.el-collapse-item__header:hover {
  height: 135px;
}
.el-collapse-item__wrap {
  background-color: rgb(245, 246, 249);
}

.el-collapse-item__content {
  color: #b9b9c0;
  padding-bottom: 0;
  background-color: #14162c;
}

.foresight-list {
  background-color: white;

  .f-t {
    width: 100%;
    font-size: 14px;
  }

  .f-t-name {
    padding-left: 20px;
    width: 150px;
    height: 88px;

    img {
      width: 22px;
      height: 22px;
      margin-right: 10px;
    }
  }

  .f-t-time {
    color: #999;
    width: 100px;
  }

  .f-t-team {
    width: 500px;
    color: #333;
    font-size: 16px;
    div {
      flex: 1;
    }
    span {
      padding: 0 36px;
      font-weight: bolder;
    }
    p {
      width: 130px;
    }
    img {
      width: 40px;
      height: 40px;
      margin: 0 10px;
    }
  }

  .f-t-btn {
    color: #666;

    span {
      padding: 0 8px;
    }
  }
}

.t-c {
  font-weight: bold;
  display: flex;
  align-items: stretch;

  .t-c-left {
    width: 467px;
    min-height: 478px;
    padding-bottom: 25px;
    border-right: 2px solid #513338;
    background: linear-gradient(299deg, #13151e 13.27%, #691126 140.23%);

    .t-c-left-title,
    .t-c-left-tips {
      height: 52px;
      font-size: 16px;
      line-height: 52px;
      text-align: center;
    }
    .t-c-left-nav-li {
      padding: 0 10px;
      p {
        font-size: 12px;
        text-align: center;
      }
      .t-c-left-nav-li-p > span {
        width: 52px;
        font-size: 16px;
        text-align: center;
      }
      .t-c-left-nav-li-p-j {
        height: 9px;
        width: 314px;
        margin: 0 10px;
        overflow: hidden;
        border-radius: 8px;
        position: relative;
        background-color: white;
      }
      // .t-c-left-nav-li-p-j > span {
      // 	flex: 1;
      // }
      .left {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 0;
        border-radius: 8px;
        background-color: #ff5338;
      }
      .right {
        width: 0;
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        border-radius: 8px;
        background-color: #6697e6;
      }
    }

    .t-c-left-arr {
      padding: 0 16px;
      font-size: 12px;

      span {
        margin-right: 16px;
      }
    }
  }

  .t-c-right {
    flex: 1;
    align-self: flex-start;

    .t-c-right-nav-li {
      flex: 1;
      padding: 0 16px;
      background: linear-gradient(299deg, #13151e 13.27%, #691126 140.23%);
      img {
        width: 18px;
        height: 19px;
        margin-right: 4px;
      }

      p {
        font-size: 16px;
        text-align: center;
        padding: 29px 0 15px 0;
      }
    }

    .t-c-right-nav-li-t {
      color: #ff5338;
      font-size: 14px;
      margin-bottom: 9px;
    }

    .t-c-right-title {
      height: 52px;
      font-size: 16px;
      line-height: 52px;
      padding: 0 125px;
      background-color: var(--el-color-primary);

      span {
        cursor: pointer;
        color: #fff;
        font-weight: 400;
      }

      .actvie {
        color: #fff;
        font-weight: 600;
      }
    }

    .t-c-right-nav-li-c {
      margin-bottom: 18px;
    }

    .t-c-right-nav-li-btn {
      position: absolute;
      bottom: -135px;
      left: 0;
      right: 0;
      width: 100%;
      color: #fff;
      font-size: 14px;
      text-align: center;
    }
    .t-c-right-nav {
      .t-c-right-nav-table {
        padding: 13px 0;
        background-color: var(--el-color-primary);
        color: #fff;
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        .li {
          padding: 0 29px;
          flex: 1;
          span {
            color: #fff;
          }
        }
      }
    }
  }
}

.el-table .warning-row {
  background: var(--el-color-primary) !important;
}

.el-table .success-row {
  background: var(--el-color-primary) !important;
}
.el-table {
  border-radius: 0;
  background: var(--el-color-primary);
}
.el-table__empty-text {
  color: #fff;
}
.el-table--border:after,
.el-table--group:after,
.el-table:before {
  content: none;
}
.el-table--border,
.el-table--group {
  border: none;
}
.el-table td,
.el-table th.is-leaf {
  border-bottom: none;
}

.el-table--border th,
.el-table--border th.gutter:last-of-type {
  border-bottom: none;
}

.el-table--border td,
.el-table--border th {
  border-right: none;
}
</style>
