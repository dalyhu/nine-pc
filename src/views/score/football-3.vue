<template>
  <article class="football-score-container flag_score_football_3">
    <div
      v-if="fightMask"
      class="pop-tip-handicap"
      style="position: fixed"
      :style="{ left: left, top: top }"
    >
      <div class="pop-header">
        <div class="left">
          <p class="team-name text-right opacity">
            {{
              lang == 1
                ? exponent.home_team_name_zht
                : lang == 2
                ? exponent.home_team_name_en
                : exponent.home_team_name_zh
            }}
          </p>
          <p class="vs">
            <span class="opacity">{{ exponent.home_score }}</span
            ><span>-</span><span>{{ exponent.away_score }}</span>
          </p>
          <p class="team-name">
            {{
              lang == 1
                ? exponent.away_team_name_zht
                : lang == 2
                ? exponent.away_team_name_en
                : exponent.away_team_name_zh
            }}
          </p>
        </div>
        <a target="_self" href="/score-detail/three?matchId=undefined&amp;sportId=1">
          <div
            style="
              display: inline-block;
              max-width: 100%;
              overflow: hidden;
              position: relative;
              margin: 0px;
            "
          ></div>
        </a>
      </div>
      <div class="table">
        <div class="col_one">
          <div class="item bg-color">盘</div>
          <div class="item color-000">初盘</div>
          <div class="item color-000">即时</div>
          <div class="item color-000">滚球</div>
        </div>
        <div class="col_two">
          <div class="item title bg-color">让球指数</div>
          <div
            class="item chupan"
            v-if="expIndex.asia && expIndex.asia.initial && expIndex.asia.initial.sealing_disk == 0"
          >
            <div class="left">
              <span class="val">{{ expIndex.asia.initial.win }}</span>
            </div>
            <div class="middle">
              <span class="val">{{ expIndex.asia.initial.draw }}</span>
            </div>
            <div class="right">
              <span class="val">{{ expIndex.asia.initial.fail }}</span>
            </div>
          </div>
          <div
            class="item chupan"
            v-if="expIndex.asia && expIndex.asia.initial && expIndex.asia.initial.sealing_disk == 1"
          >
            封
          </div>
          <div
            class="item jishi"
            v-if="
              expIndex.asia && expIndex.asia.immediate && expIndex.asia.immediate.sealing_disk == 0
            "
          >
            <div class="left">
              <span class="val">{{ expIndex.asia.immediate.win }}</span>
            </div>
            <div class="middle">
              <span class="val">{{ expIndex.asia.immediate.draw }}</span>
            </div>
            <div class="right">
              <span class="val">{{ expIndex.asia.immediate.fail }}</span>
            </div>
          </div>
          <div
            class="item chupan"
            v-if="
              expIndex.asia && expIndex.asia.immediate && expIndex.asia.immediate.sealing_disk == 1
            "
          >
            封
          </div>
          <div
            class="item gunqiu"
            v-if="expIndex.asia && expIndex.asia.scram && expIndex.asia.scram.sealing_disk == 0"
          >
            <div class="left">
              <span class="val">{{ expIndex.asia.scram.win }}</span>
            </div>
            <div class="middle">
              <span class="val">{{ expIndex.asia.scram.draw }}</span>
            </div>
            <div class="right">
              <span class="val">{{ expIndex.asia.scram.fail }}</span>
            </div>
          </div>
          <div
            class="item chupan"
            v-if="expIndex.asia && expIndex.asia.scram && expIndex.asia.scram.sealing_disk == 1"
          >
            封
          </div>
        </div>
        <div class="col_thr">
          <div class="item title bg-color">大小指数</div>
          <div
            class="item chupan"
            v-if="expIndex.bs && expIndex.bs.initial && expIndex.bs.initial.sealing_disk == 0"
          >
            <div class="left">
              <span class="val">{{ expIndex.bs.initial.win }}</span>
            </div>
            <div class="middle">
              <span class="val">{{ expIndex.bs.initial.draw }}</span>
            </div>
            <div class="right">
              <span class="val">{{ expIndex.bs.initial.fail }}</span>
            </div>
          </div>
          <div
            class="item chupan"
            v-if="expIndex.bs && expIndex.bs.initial && expIndex.bs.initial.sealing_disk == 1"
          >
            封
          </div>
          <div
            class="item jishi"
            v-if="expIndex.bs && expIndex.bs.immediate && expIndex.bs.immediate.sealing_disk == 0"
          >
            <div class="left">
              <span class="val">{{ expIndex.bs.immediate.win }}</span>
            </div>
            <div class="middle">
              <span class="val">{{ expIndex.bs.immediate.draw }}</span>
            </div>
            <div class="right">
              <span class="val">{{ expIndex.bs.immediate.fail }}</span>
            </div>
          </div>
          <div
            class="item chupan"
            v-if="expIndex.bs && expIndex.bs.immediate && expIndex.bs.immediate.sealing_disk == 1"
          >
            封
          </div>
          <div
            class="item gunqiu"
            v-if="expIndex.bs && expIndex.bs.scram && expIndex.bs.scram.sealing_disk == 0"
          >
            <div class="left">
              <span class="val">{{ expIndex.bs.scram.win }}</span>
            </div>
            <div class="middle">
              <span class="val">{{ expIndex.bs.scram.draw }}</span>
            </div>
            <div class="right">
              <span class="val">{{ expIndex.bs.scram.fail }}</span>
            </div>
          </div>
          <div
            class="item chupan"
            v-if="expIndex.bs && expIndex.bs.scram && expIndex.bs.scram.sealing_disk == 1"
          >
            封
          </div>
        </div>
        <div class="col_four">
          <div class="item title bg-color">欧赔</div>
          <div
            class="item chupan"
            v-if="expIndex.eu && expIndex.eu.initial && expIndex.eu.initial.sealing_disk == 0"
          >
            <div class="left">
              <span class="val">{{ expIndex.eu.initial.win }}</span>
            </div>
            <div class="middle">
              <span class="val">{{ expIndex.eu.initial.draw }}</span>
            </div>
            <div class="right">
              <span class="val">{{ expIndex.eu.initial.fail }}</span>
            </div>
          </div>
          <div
            class="item chupan"
            v-if="expIndex.eu && expIndex.eu.initial && expIndex.eu.initial.sealing_disk == 1"
          >
            封
          </div>
          <div
            class="item jishi"
            v-if="expIndex.eu && expIndex.eu.immediate && expIndex.eu.immediate.sealing_disk == 0"
          >
            <div class="left">
              <span class="val">{{ expIndex.eu.immediate.win }}</span>
            </div>
            <div class="middle">
              <span class="val">{{ expIndex.eu.immediate.draw }}</span>
            </div>
            <div class="right">
              <span class="val">{{ expIndex.eu.immediate.fail }}</span>
            </div>
          </div>
          <div
            class="item chupan"
            v-if="expIndex.eu && expIndex.eu.immediate && expIndex.eu.immediate.sealing_disk == 1"
          >
            封
          </div>
          <div
            class="item gunqiu"
            v-if="expIndex.eu && expIndex.eu.scram && expIndex.eu.scram.sealing_disk == 0"
          >
            <div class="left">
              <span class="val">{{ expIndex.eu.scram.win }}</span>
            </div>
            <div class="middle">
              <span class="val">{{ expIndex.eu.scram.draw }}</span>
            </div>
            <div class="right">
              <span class="val">{{ expIndex.eu.scram.fail }}</span>
            </div>
          </div>
          <div
            class="item chupan"
            v-if="expIndex.eu && expIndex.eu.scram && expIndex.eu.scram.sealing_disk == 1"
          >
            封
          </div>
        </div>
      </div>
    </div>
    <section
      class="container-section"
      style="box-shadow: rgb(238, 238, 238) 0px 1px 0px 0px inset"
      v-if="list.length != 0"
    >
      <ul>
        <RecycleScroller
          ref="scoreScroller"
          class="scroller"
          :items="list"
          item-class="score_list_item"
          key-field="id"
          page-mode
          :item-size="60"
          :emit-update="true"
          @update="virtualListUpdate"
        >
          <template v-slot="{ item, index }">
            <div class="list-view-item" :data-index="index">
              <li
                :style="{
                  height: itemHeight + 'px'
                }"
                class="football-score-item flex-center"
                style="position: relative; font-size: 14px; color: #9197ad; flex-wrap: nowrap"
                v-if="!item.type"
              >
                <img :src="item.imgUrl" class="logo-title" />
                {{ item.competition_name_zh }}
              </li>
              <li @mouseleave="mousemove" class="football-score-item" v-else>
                <div class="match-field width93">
                  <div class="football-league-name-container false" style="height: 44.5px">
                    <div
                      class="football-league-color-block"
                      :style="{ background: item.primary_color }"
                    ></div>
                    <div class="football-league-logo">
                      <img
                        class="football-league-logo-img"
                        :src="item.competition_logo ? item.competition_logo : '/avatar.png'"
                        width="56"
                        height="56"
                      />
                    </div>
                    <div
                      class="league-name ellipsis search-by-team-name"
                      v-html="
                        lang == 1
                          ? item.competition_name_zht
                          : lang == 2
                          ? item.competition_name_en
                          : item.competition_name_zh
                      "
                    ></div>
                  </div>
                </div>
                <div class="time width32 text-center">{{ $common.timeStamp(item.time) }}</div>
                <div class="match-status width40 football-all-status">
                  <span class="point-animation">{{
                    item.status == 3 ? '中' : item.status_str
                  }}</span>
                </div>
                <div
                  class="teamName-and-vs football-score-item-teamRank width420"
                  @mouseenter="scoreWrapMouseenter(item)"
                >
                  <div class="team-info host-container width189">
                    <div class="card red-card" v-if="item.home_red_card != 0">
                      {{ item.home_red_card }}
                    </div>
                    <div class="card yellow-card" v-if="item.home_yellow_card != 0">
                      {{ item.home_yellow_card }}
                    </div>
                    <div
                      class="name ellipsis search-by-team-name"
                      v-html="
                        lang == 1
                          ? item.home_team_name_zht
                          : lang == 2
                          ? item.home_team_name_en
                          : item.home_team_name_zh
                      "
                    ></div>
                  </div>
                  <div
                    class="vs width42"
                    ref="bbb"
                    @mouseenter="(ev) => mouseenter1(index, 1, item, ev)"
                    @mouseleave="mousemove"
                  >
                    <span style="color: rgb(255, 67, 67)">{{ item.home_score }}</span
                    ><span data-a="0" data-b="2" style="color: rgb(255, 67, 67)">-</span
                    ><span style="color: rgb(255, 67, 67)">{{ item.away_score }}</span>
                    <div class="components-box" style="position: relative">
                      <exponent
                        v-if="hoverId === item.id"
                        v-show="exponentIsShow && exponent.id === item.id"
                        :tlive="tlive"
                        :tliveLoading="tliveLoading"
                      ></exponent>
                    </div>
                  </div>
                  <div class="team-info guest-container width189">
                    <div
                      class="name ellipsis search-by-team-name"
                      v-html="
                        lang == 1
                          ? item.away_team_name_zht
                          : lang == 2
                          ? item.away_team_name_en
                          : item.away_team_name_zh
                      "
                    ></div>
                    <div class="card yellow-card" v-if="item.away_yellow_card != 0">
                      {{ item.away_yellow_card }}
                    </div>
                    <div class="card red-card" v-if="item.away_red_card != 0">
                      {{ item.away_red_card }}
                    </div>
                  </div>
                </div>
                <div class="variable width554">
                  <div class="immediate">
                    <div class="model-one width180">
                      <div class="half width66 text-center">
                        <span>{{ item.half_score || '-' }}</span>
                      </div>
                      <div class="corner width48 text-left">
                        <span>{{ item.corner_kick || '-' }}</span>
                      </div>
                      <div class="live">
                        <div class="football-score-item-live"></div>
                      </div>
                    </div>
                    <div class="h45-w1-border"></div>
                    <div
                      class="model-two width224 model-item-3"
                      ref="sss"
                      :style="{ height: immediately.value4 ? '60px' : '42px' }"
                      @mouseleave="mousemove"
                      @mouseenter="(ev) => mouseenter(index, 2, item, ev)"
                    >
                      <div
                        class="football-score-item-odds"
                        v-if="item.exponent && item.exponent.asia"
                      >
                        <div class="odds-handicap" style="display: flex" v-if="immediately.value1">
                          <div class="left">{{ item.exponent.asia.scram.win }}</div>
                          <div class="middle">{{ item.exponent.asia.scram.draw }}</div>
                          <div class="right">{{ item.exponent.asia.scram.fail }}</div>
                        </div>
                        <div class="odds-dx" style="display: flex" v-if="immediately.value2">
                          <div class="left football">{{ item.exponent.bs.scram.win }}</div>
                          <div class="middle">{{ item.exponent.bs.scram.draw }}</div>
                          <div class="right football">{{ item.exponent.bs.scram.fail }}</div>
                        </div>
                        <div class="odds-dx" style="display: flex" v-if="immediately.value3">
                          <div class="left football">{{ item.exponent.eu.scram.win }}</div>
                          <div class="middle">{{ item.exponent.eu.scram.draw }}</div>
                          <div class="right football">{{ item.exponent.eu.scram.fail }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="data width87" style="justify-content: space-around">
                      <div>
                        <a @click="$router.push('/detail?type=football&id=' + item.id)">指数</a>
                      </div>
                      <div>
                        <router-link
                          target="_self"
                          :to="'/score-detail?type=football&tabIndex=4&id=' + item.id"
                          >分析</router-link
                        >
                      </div>
                    </div>
                    <div class="match width74">
                      <div class="football-score-item-operation" @click="setCollect(item)">
                        <img
                          :src="
                            getImageUrl(
                              item.is_collect == 1
                                ? '/static/images/icon-reserve-active.png'
                                : '/static/images/icon-reserve.png'
                            )
                          "
                          class="collect"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </div>
          </template>
        </RecycleScroller>
      </ul>
    </section>

    <div v-if="list.length == 0" class="common-empty-view">
      <DfEmpty description="暂无数据" />
    </div>
  </article>
</template>

<script>
import { football_match, getfootballDetail } from '@/api/football.js'
import { collect } from '@/api/common.js'
import pollingGetScoreList from '@/mixins/pollingGetScoreList.js'
import exponent from './exponent.vue'
import { getImageUrl } from '@/utils/common.js'
import { cloneDeep } from 'lodash-es'

export default {
  name: 'FootballScore3',
  components: { exponent },
  props: {
    id: {
      type: Number,
      default: null
    },
    lang: {
      type: Number,
      default: 0
    },
    itemHeight: {
      type: Number,
      default: 45
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  mixins: [pollingGetScoreList],
  data() {
    return {
      dataBase: [],
      list1: [],
      list2: [],
      list3: [],
      page1: 1,
      page2: 1,
      tlive: {},
      page3: 1,
      tliveLoading: false,
      expIndex: {}, //指数
      exponent: {}, //技术统计
      top: '', //定位弹窗的位置
      left: '', //定位弹窗的位置
      fightMask: false, //对战弹窗
      exponentIsShow: false, //数据弹窗
      exponentRequestTimes: 0,
      hoverId: '',
      list: [],
      visibleData: [],
      tabIndex: 3
    }
  },
  watch: {
    id(e) {
      this.list1 = []
      this.list2 = []
      this.list3 = []
      this.getlist()
    }
  },
  computed: {
    immediately() {
      return this.$store.state.immediately
    }
  },
  created() {},
  mounted() {
    this.getlist()
  },
  beforeUnmount() {
    this.timeInterval && window.clearInterval(this.timeInterval)
  },
  methods: {
    getImageUrl,
    // 移除列表
    mousemove() {
      this.exponentIsShow = false
      this.fightMask = false
    },

    // 对战详情弹窗
    mouseenter(e, type, item, event) {
      this.fightMask = true
      let left, top
      if (type == 1) {
        top = event.target.getBoundingClientRect().top
        left = event.target.getBoundingClientRect().left
      } else if (type == 2) {
        top = event.target.getBoundingClientRect().top
        left = event.target.getBoundingClientRect().left
      } else {
        top = event.target.getBoundingClientRect().top
        left = event.target.getBoundingClientRect().left
      }
      this.exponent = item
      this.expIndex = item.exponent
      this.top = top - 194 + 'px'
      this.left = left - 157 + 'px'
    },
    mouseenter1(e, type, item, event) {
      this.exponentIsShow = true
      let left, top
      if (type == 1) {
        top = event.target.getBoundingClientRect().top
        left = event.target.getBoundingClientRect().left
      } else if (type == 2) {
        top = event.target.getBoundingClientRect().top
        left = event.target.getBoundingClientRect().left
      } else {
        top = event.target.getBoundingClientRect().top
        left = event.target.getBoundingClientRect().left
      }
      if (this.top == top + 'px') {
        //判断重复问题
      }
      this.top = top + 'px'
      this.left = left + 35 + 'px'
      this.getDetail(item, 1)
    },
    // 技术统计对比
    num(num1, num2) {
      if (num1 == 0 && num2 == 0) {
        return 0
      } else if (num1 == num2 && num1 != 0 && num2 != 0) {
        return 50
      } else {
        return (num1 / (num1 + num2)) * 100
      }
    },
    /* 重组数组 */
    setArr(data) {
      // return
      this.list = []
      let list1 = [] // 进行中
      let list2 = [] // 未开始
      let list3 = [] // 完场
      let list5 = [] // 异常
      data.forEach((obj) => {
        let obj1 = {
          eu: {
            scram: {
              win: 0,
              draw: 0,
              fail: 0
            },
            initial: {
              win: 0,
              draw: 0,
              fail: 0
            },
            immediate: {
              win: 0,
              draw: 0,
              fail: 0
            }
          },
          bs: {
            scram: {
              win: 0,
              draw: 0,
              fail: 0
            },
            initial: {
              win: 0,
              draw: 0,
              fail: 0
            },
            immediate: {
              win: 0,
              draw: 0,
              fail: 0
            }
          },
          asia: {
            scram: {
              win: 0,
              draw: 0,
              fail: 0
            },
            initial: {
              win: 0,
              draw: 0,
              fail: 0
            },
            immediate: {
              win: 0,
              draw: 0,
              fail: 0
            }
          }
        }
        obj = Object.assign(obj, obj1)
        obj.new_away_team_name_zh = obj.away_team_name_zh
        obj.new_home_team_name_zh = obj.home_team_name_zh
        if (obj.status === 8) {
          //完场
          obj.type = 3
          list3.push(obj)
        } else if (
          obj.status == 2 ||
          obj.status == 3 ||
          obj.status == 4 ||
          obj.status == 5 ||
          obj.status == 6 ||
          obj.status == 7
        ) {
          //进行中

          obj.type = 1

          list1.push(obj)
        } else if (obj.status === 1) {
          //未开始
          obj.type = 2
          list2.push(obj)
        } else if (
          obj.status == 9 ||
          obj.status == 10 ||
          obj.status == 11 ||
          obj.status == 12 ||
          obj.status == 13
        ) {
          //异常
          obj.type = 4
          list5.push(obj)
        } else {
          obj.type = 5
        }
      })
      let arrList = this.list.concat(list1).concat(list2).concat(list3).concat(list5)
      // 添加标题
      if (list1.length > 0)
        arrList.splice(0, 0, {
          typeTitle: 0,
          competition_id: 1000000,
          country_id: 1000000,
          competition_name_zh: '进行中',
          id: 1000000,
          imgUrl: getImageUrl('/static/images/main-beigin.png')
        })
      if (list2.length > 0)
        arrList.splice(
          arrList.findIndex((it) => it.id === list2.slice(0, 1)[0].id),
          0,
          {
            typeTitle: 1,
            competition_id: 1000000,
            country_id: 1000000,
            competition_name_zh: '未开始',
            id: 1000001,
            imgUrl: getImageUrl('/static/images/main-end.png')
          }
        )
      if (list3.length > 0)
        arrList.splice(
          arrList.findIndex((it) => it.id === list3.slice(0, 1)[0].id),
          0,
          {
            typeTitle: 2,
            competition_id: 1000000,
            country_id: 1000000,
            competition_name_zh: '已结束',
            id: 1000002,
            imgUrl: getImageUrl('/static/images/main-ends.png')
          }
        )
      if (list5.length > 0)
        arrList.splice(
          arrList.findIndex((it) => it.id === list5.slice(0, 1)[0].id),
          0,
          {
            typeTitle: 3,
            competition_id: 1000000,
            country_id: 1000000,
            competition_name_zh: '异常',
            id: 1000003,
            imgUrl: getImageUrl('/static/images/main-yi.png')
          }
        )
      this.list = arrList
      this.goingList = this.list1
      if (this.isFirstGetList) {
        this.pollingGetList('football', 3, this.getlist)
        this.isFirstGetList = false
      }
    },
    getlist() {
      this.isGettingList = true
      football_match({
        type: 4,
        is_web: 1,
        company_id: this.id
      })
        .then((res) => {
          this.isGettingList = false
          this.setArr(res.data.data)
        })
        .catch(() => {
          this.isGettingList = false
        })
    },
    // 调用详情
    getDetail(item, type) {
      this.exponent = item
      this.exponentIsShow = true
      this.tliveLoading = true
      getfootballDetail({
        id: item.id
      })
        .then((res) => {
          res.data.tlive = res.data.tlive.reverse()
          this.tlive = res.data

          setTimeout((res1) => {
            this.tliveLoading = false
          }, 500)
        })
        .catch((res) => {})
    },
    // 收藏
    setCollect(item) {
      if (!this.$store.state.user.infoData.id) {
        return this.$message.error('请登录后进行操作')
      }
      let data = {
        match_ids: item.id,
        match_type: 1
      }
      collect(data)
        .then(() => {
          this.list = this.list.filter((it) => it.id !== item.id)
          let list = cloneDeep(this.list)
          this.list.forEach((it, idx) => {
            if (
              (it.competition_id === 1000000 && this.list.length === idx + 1) ||
              (it.competition_id === 1000000 &&
                this.list.length !== idx + 1 &&
                this.list[idx + 1].competition_id === 1000000)
            ) {
              list = list.filter((_it) => _it.id !== it.id)
            }
          })
          this.list = list
          this.$refs.scoreScroller._.update()
          this.$message.success('已取消预约')
        })
        .catch((res) => {
          this.$message.error(res.msg || res.data?.msg || '操作失败')
        })
    },
    // 搜索高亮
    searchText(inputValue) {
      let _this = this
      if (inputValue) {
        let lang = this.lang == 1 ? 'zht' : this.lang == 2 ? 'en' : 'zh'
        // 每次查询之前清空原数据中标签,防止再次查询时,查不到
        // list1, list2, list3,
        if (document.querySelectorAll('.highlight').length > 0) {
          this.list.forEach((item, index) => {
            if (item['away_team_name_' + lang] == undefined) return
            _this.list[index]['away_team_name_' + lang] = item['away_team_name_' + lang].replace(
              /<[^<>]+>/g,
              ''
            )
            _this.list[index]['competition_name_' + lang] = item[
              'competition_name_' + lang
            ].replace(/<[^<>]+>/g, '')
            _this.list[index]['home_team_name_' + lang] = item['home_team_name_' + lang].replace(
              /<[^<>]+>/g,
              ''
            )
          })
        }
        const regExp = new RegExp(inputValue, 'g')
        this.list.forEach((item, index) => {
          if (item['away_team_name_' + lang] == undefined) return
          _this.list[index]['away_team_name_' + lang] = item['away_team_name_' + lang].replace(
            regExp,
            `<span style="color: red" class="highlight">${inputValue}</span>`
          )
          _this.list[index]['competition_name_' + lang] = item['competition_name_' + lang].replace(
            regExp,
            `<span style="color: red" class="highlight">${inputValue}</span>`
          )
          _this.list[index]['home_team_name_' + lang] = item['home_team_name_' + lang].replace(
            regExp,
            `<span style="color: red" class="highlight">${inputValue}</span>`
          )
        })
        setTimeout((res) => {
          this.$emit('getallNum', document.querySelectorAll('.highlight').length)
          // return document.querySelectorAll('.highlight').length
        }, 2000)
        // this.searchIndex = document.querySelectorAll('.highlight').length
      } else {
        this.clearSearch()
        this.$emit('getallNum', 0)
      }
    },
    // 删除高亮
    clearSearch() {
      let _this = this
      // this.i = 0
      if (document.querySelectorAll('.highlight').length == 0) return
      this.list.forEach((item, index) => {
        let lang = this.lang == 1 ? 'zht' : this.lang == 2 ? 'en' : 'zh'
        if (item['away_team_name_' + lang] == undefined) return
        _this.list[index]['away_team_name_' + lang] = item['away_team_name_' + lang].replace(
          /<[^<>]+>/g,
          ''
        )
        _this.list[index]['competition_name_' + lang] = item['competition_name_' + lang].replace(
          /<[^<>]+>/g,
          ''
        )
        _this.list[index]['home_team_name_' + lang] = item['home_team_name_' + lang].replace(
          /<[^<>]+>/g,
          ''
        )
      })
    },
    scoreMouseleave() {
      this.exponentIsShow = false
      this.exponentRequestTimes = 0
    },
    scoreWrapMouseenter(item) {
      this.hoverId = item.id
    },
    virtualListUpdate(startIndex, endIndex, visibleStartIndex, visibleEndIndex) {
      let data = this.list.slice(visibleStartIndex, visibleEndIndex)
      this.updateVisibleData(data)
    },
    updateVisibleData(data) {
      this.visibleData = data
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/liveScore.scss';
.football-popup-score {
  z-index: 2;
}
// .components-box {
//   position: fixed;
//   z-index: 1;
//   :deep(.football-popup-score) {
//     position: relative !important;
//     top: auto !important;
//     left: auto !important;
//   }
// }
.logo-title {
  width: 20px;
  height: 20px;
  margin-right: 6px;
}
</style>
