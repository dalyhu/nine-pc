<template>
  <div class="contents-main flag_score_football_0">
    <!-- 鼠标移入显示指数 -->
    <div class="contents" style="position: relative">
      <div
        class="pop-tip-handicap"
        v-if="fightMask"
        style="position: fixed; right: 0; z-index: 9999; left: auto"
        :style="{ top: top + 20 + 'px', right: right - 1200 + 'px' }"
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
            <div class="item chupan" v-if="expIndex.asia.initial.sealing_disk != 1">
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
            <div class="item chupan" v-else>封</div>
            <div class="item jishi" v-if="expIndex.asia.immediate.sealing_disk != 1">
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
            <div class="item chupan" v-else>封</div>
            <div class="item gunqiu" v-if="expIndex.asia.scram.sealing_disk != 1">
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
            <div class="item chupan" v-else>封</div>
          </div>
          <div class="col_thr">
            <div class="item title bg-color">大小指数</div>
            <div class="item chupan" v-if="expIndex.bs.initial.sealing_disk != 1">
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
            <div class="item chupan" v-else>封</div>
            <div class="item jishi" v-if="expIndex.bs.immediate.sealing_disk != 1">
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
            <div class="item chupan" v-else>封</div>
            <div class="item gunqiu" v-if="expIndex.bs.scram.sealing_disk != 1">
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
            <div class="item chupan" v-else>封</div>
          </div>
          <div class="col_four">
            <div class="item title bg-color">欧赔</div>
            <div class="item chupan" v-if="expIndex.eu.initial.sealing_disk != 1">
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
            <div class="item chupan" v-else>封</div>
            <div class="item jishi" v-if="expIndex.eu.immediate.sealing_disk != 1">
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
            <div class="item chupan" v-else>封</div>
            <div class="item gunqiu" v-if="expIndex.eu.scram.sealing_disk != 1">
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
            <div class="item chupan" v-else>封</div>
          </div>
        </div>
      </div>
      <!-- 足球即时数据 -->
      <div
        class="football-score-container list-view"
        ref="contens"
        v-loading="$store.state.loading"
        @mouseover.stop="changeFlag(true)"
        style="width: 1200px"
      >
        <section
          class="container-section"
          style="box-shadow: rgb(238, 238, 238) 0px 1px 0px 0px inset"
        >
          <ul v-if="list.length > 0" ref="contentList" class="list-view-content noTranslateY">
            <RecycleScroller
              ref="scoreScroller"
              class="scroller"
              :items="listFilter"
              item-class="score_list_item"
              key-field="id"
              page-mode
              :item-size="60"
              :emit-update="true"
              @update="virtualListUpdate"
            >
              <template v-slot="{ item, index }">
                <div class="list-view-item" :data-index="index"
                >
                  <li
                    :style="{
                      height: itemHeight + 'px'
                    }"
                    class="football-score-item flex-center"
                    style="position: relative; font-size: 14px; color: #9197ad; flex-wrap: nowrap"
                    v-if="!item.type"
                  >
                    <img :src="item.imgUrl" class="logo-title" @error="item.imgUrl = '/avatar.png'" />
                    {{ item.competition_name_zh }}
                  </li>
                  <li
                    :data-index="index"
                    :data-id="item.id"
                    :style="{
                      marginBottom: item.note ? '31px' : '',
                      position: 'relative'
                    }"
                    class="football-score-item"
                    style=""
                    v-else
                  >
                    <div
                      class="football-score-item-add-time immediate"
                      style="position: absolute; bottom: -32px; left: 0"
                      v-if="item.note"
                    >
                      <div class="desc-wrap">
                        <div class="desc">
                          {{ item.note }}
                        </div>
                      </div>
                    </div>

                    <div class="gou width40">
                      <div
                        @click="setId(item)"
                        style="
                          display: inline-block;
                          max-width: 100%;
                          overflow: hidden;
                          position: relative;
                          margin: 0px;
                        "
                      >
                        <div style="display: block; max-width: 100%">
                          <img
                            style="width: 20px"
                            :src="
                              getImageUrl(
                                footList.indexOf(item.id) == -1
                                  ? '/static/images/check.png'
                                  : '/static/images/check1.png'
                              )
                            "
                          />
                        </div>
                      </div>
                    </div>
                    <div class="match-field width93">
                      <div class="football-league-name-container false" style="height: 44.5px">
                        <div
                          class="football-league-color-block"
                          :style="{ background: item.primary_color }"
                        ></div>
                        <div class="football-league-logo">
                          <img
                            :src="item.competition_logo"
                            width="100%"
                            height="100%"
                            class="football-league-logo-img"
                            @error="item.competition_logo = '/avatar.png'"
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
                      <span
                        class="point-animation"
                        style="color: rgb(255, 67, 67)"
                        v-if="item.match_str || item.status == 3"
                        >{{ item.status == 3 ? '中' : item.match_str }}</span
                      >
                      <span v-else>{{ item.status == 1 ? '未' : item.status_str }}</span>
                    </div>
                    <div
                      class="teamName-and-vs football-score-item-teamRank width420"
                      @mouseenter="scoreWrapMouseenter(item)"
                    >
                      <div
                        class="team-info host-container width189"
                        :class="jinIdLeft == item.id ? 'score-item-goal-left' : ''"
                      >
                        <!-- 旋转足球图标 -->
                        <img
                          src="/static/images/icon-1.png"
                          alt="goal"
                          class="score-item-ball-left"
                        />
                        <div class="card red-card" v-if="item.home_red_card != 0 && game.red">
                          {{ item.home_red_card }}
                        </div>
                        <div
                          class="card yellow-card"
                          v-if="item.home_yellow_card != 0 && game.yellow"
                        >
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
                        class="hover-box"
                        @mouseenter="(ev) => mouseenter1(index, 4, item, ev)"
                        @mouseleave="scoreMouseleave"
                      >
                        <!-- 判断是否进行中得比。分显示 -->
                        <div class="vs width42 bf" v-if="item.status != 1">
                          <span style="color: rgb(255, 67, 67)">{{ item.home_score }}</span>
                          <span data-a="0" data-b="2" style="color: rgb(255, 67, 67)">-</span>
                          <span style="color: rgb(255, 67, 67)">{{ item.away_score }}</span>
                        </div>
                        <div class="vs width42 bf" v-else>
                          <span data-a="0" data-b="0" style="color: rgb(145, 151, 173)">-</span>
                        </div>
                        <div class="components-box" style="position: relative">
                          <exponent
                            v-if="hoverId === item.id"
                            v-show="exponentIsShow && exponent.id === item.id"
                            :tlive="tlive"
                            :tliveLoading="tliveLoading"
                          ></exponent>
                        </div>
                      </div>
                      <div
                        class="team-info gauest-container width189"
                        :class="jinIdRight == item.id ? 'score-item-goal-right' : ''"
                      >
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
                        <div
                          class="card yellow-card"
                          v-if="item.away_yellow_card != 0 && game.yellow"
                        >
                          {{ item.away_yellow_card }}
                        </div>
                        <div class="card red-card" v-if="item.away_red_card != 0 && game.red">
                          {{ item.away_red_card }}
                        </div>
                        <!-- 旋转的足球 -->
                        <img
                          src="/static/images/icon-1.png"
                          alt="goal"
                          class="score-item-ball-right"
                        />
                      </div>
                    </div>
                    <div class="variable width554" style="position: relative">
                      <div class="immediate">
                        <div class="model-one width180">
                          <div class="half width66 text-center">
                            <span>{{ item.half_score }}</span>
                          </div>
                          <div class="corner width48 text-left">
                            <span>{{ item.corner_kick }}</span>
                          </div>
                          <div class="live">
                            <div class="football-score-item-live">
                              <div
                                class="right"
                                v-if="item.anchor_live && item.anchor_live.length > 0"
                              >
                                <router-link
                                  target="_self"
                                  :to="'/live?router=foot&uid=' + item.anchor_live[0].id"
                                >
                                  <img
                                    class="live-anchor"
                                    :src="
                                      item.anchor_live[0].avatar
                                        ? item.anchor_live[0].avatar
                                        : '/avatar.png'
                                    "
                                    @error="item.anchor_live[0].avatar = '/avatar.png'"
                                    width="36"
                                    height="36"
                                  />
                                </router-link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="h45-w1-border"></div>
                        <!--  鼠标移入显示指数弹窗  -->
                        <div
                          class="model-two width224 model-item-d"
                          ref="sss1"
                          @mouseleave="mousemove"
                          @mouseenter="mouseenter(index, 2, item)"
                        >
                          <div class="football-score-item-odds" v-if="item.exponent">
                            <div
                              class="odds-handicap"
                              style="display: flex"
                              v-if="immediately.value1"
                            >
                              <!-- odds-down -->
                              <div
                                class="left football"
                                :class="
                                  item.asia.scram.win == 1
                                    ? 'odds-up'
                                    : item.asia.scram.win == 2
                                    ? 'odds-down'
                                    : ''
                                "
                              >
                                {{ item.exponent.asia.scram.win }}
                              </div>
                              <div
                                class="middle football"
                                :class="
                                  item.asia.scram.draw == 1
                                    ? 'odds-up'
                                    : item.asia.scram.draw == 2
                                    ? 'odds-down'
                                    : ''
                                "
                              >
                                {{ item.exponent.asia.scram.draw }}
                              </div>
                              <div
                                class="right football"
                                :class="
                                  item.asia.scram.fail == 1
                                    ? 'odds-up'
                                    : item.asia.scram.fail == 2
                                    ? 'odds-down'
                                    : ''
                                "
                              >
                                {{ item.exponent.asia.scram.fail }}
                              </div>
                            </div>
                            <div class="odds-dx" style="display: flex" v-if="immediately.value2">
                              <div
                                class="left football"
                                :class="
                                  item.bs.scram.win == 1
                                    ? 'odds-up'
                                    : item.bs.scram.win == 2
                                    ? 'odds-down'
                                    : ''
                                "
                              >
                                {{ item.exponent.bs.scram.win }}
                              </div>
                              <div
                                class="middle football"
                                :class="
                                  item.bs.scram.draw == 1
                                    ? 'odds-up'
                                    : item.bs.scram.draw == 2
                                    ? 'odds-down'
                                    : ''
                                "
                              >
                                {{ item.exponent.bs.scram.draw }}
                              </div>
                              <div
                                class="right football"
                                :class="
                                  item.bs.scram.fail == 1
                                    ? 'odds-up'
                                    : item.bs.scram.fail == 2
                                    ? 'odds-down'
                                    : ''
                                "
                              >
                                {{ item.exponent.bs.scram.fail }}
                              </div>
                            </div>
                            <div class="odds-dx" style="display: flex" v-if="immediately.value3">
                              <div
                                class="left football"
                                :class="
                                  item.eu.scram.win == 1
                                    ? 'odds-up'
                                    : item.eu.scram.win == 2
                                    ? 'odds-down'
                                    : ''
                                "
                              >
                                {{ item.exponent.eu.scram.win }}
                              </div>
                              <div
                                class="middle football"
                                :class="
                                  item.eu.scram.draw == 1
                                    ? 'odds-up'
                                    : item.eu.scram.draw == 2
                                    ? 'odds-down'
                                    : ''
                                "
                              >
                                {{ item.exponent.eu.scram.draw }}
                              </div>
                              <div
                                class="right football"
                                :class="
                                  item.eu.scram.fail == 1
                                    ? 'odds-up'
                                    : item.eu.scram.fail == 2
                                    ? 'odds-down'
                                    : ''
                                "
                              >
                                {{ item.exponent.eu.scram.fail }}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="data width87" style="justify-content: space-around">
                          <div>
                            <router-link
                              target="_self"
                              :to="'/score-detail?type=football&id=' + item.id"
                              >指数</router-link
                            >
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
                          <div class="football-score-item-operation">
                            <img
                              v-if="[1, 2].includes(getMatchStatusType('football', item))"
                              @click="setCollect(item)"
                              :src="
                                getImageUrl(
                                  item.is_collect == 1
                                    ? '/static/images/icon-reserve-active.png'
                                    : '/static/images/icon-reserve.png'
                                )
                              "
                              class="collect"
                              :title="item.is_collect == 1 ? '取消预约' : '预约'"
                            />
                            <div
                              class="arrow-top arrow-solid"
                              @click="setTop(item, index)"
                              v-if="topList1.indexOf(item.id) != -1"
                            ></div>
                            <img
                              v-else
                              @click="setTop(item, index)"
                              src="/static/images/top.png"
                              class="arrow-top"
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

          <div v-else class="common-empty-view" ref="contentList">
            <DfEmpty description="暂无数据" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
import { getfootballDetail } from '@/api/football.js'
import { collect } from '@/api/common.js'
import exponent from './exponent.vue'
import { getImageUrl } from '@/utils/common.js'

export default {
  name: 'FootballScore0',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    lang: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 300
    },
    itemHeight: {
      type: Number,
      default: 45
    },
    setConf: {
      type: Object,
      default: () => {
        return {
          action: 0,
          timingDataId: []
        }
      }
    },
    id: {
      type: Number,
      default: null
    },
    topList: {
      type: Array,
      default: () => []
    }
  },
  components: { exponent },
  computed: {
    // 显示红黄牌
    game() {
      return this.$store.state.game
    },
    immediately() {
      return this.$store.state.immediately
    },
    // 渲染源:根据 setConf.action 过滤
    // action: 0 不操作 / 1 保留 / 2 隐藏
    // 标题行(typeTitle 为数字)在任何模式下都保留
    listFilter() {
      const action = this.setConf.action
      if (action !== 1 && action !== 2) return this.list
      return this.list.filter(x =>
        typeof x.typeTitle === 'number'
          || (action === 1 && this.footList.includes(x.id))
          || (action === 2 && !this.footList.includes(x.id))
      )
    }
  },
  mounted() {},
  inject: ['getMatchStatusType'],
  data() {
    return {
      top: 0, //距离顶部的距离
      right: 0, //距离右边的距离
      time: null,
      exponentIsShow: false,
      exponentRequestTimes: 0, // 鼠标移入比分时实时查询数据的次数，只查一次
      tliveLoading: false,
      footList: [],
      flag: false,
      tlive: {}, //
      topList1: [],
      exponent: {}, //鼠标移入获取的下标
      expIndex: {}, //鼠标移入指数弹窗显示的参数
      fightMask: false, //指数弹窗
      visibleData: [],
      jinIdLeft: null, //进球提示
      jinIdRight: null, //进球提示
      comparisonID: 0, //状态被修改 (锁)
      timeOutTimer: null,
      timeInTimer: null,
      hoverId: ''
    }
  },
  watch: {
    topList(e) {
      this.topList1 = e
    }
  },
  methods: {
    getImageUrl,
    /* 修改赛事 */
    editItem(value) {
      // 监听接收的指数-
      let _this = this
      /* 有时会为空 */

      let dom1 = this.$refs[value.sourceid]
      if (value.type == 'football_exponent') {
        if (value.sourceid == undefined) return
        dom1 = this.$refs[value.sourceid]
      } else if (value.type == 'football_match') {
        if (value.id == undefined) return
        dom1 = this.$refs[value.id]
      }
      /* 处理指数 */
      if (value.type == 'football_exponent' && dom1 != undefined) {
        if (dom1[0] == undefined) return
        let obj = dom1[0].dataset //index ,list ,id
        let item = this.visibleData[Number(obj.index)]
        if (item[value.name] != undefined && item.id == value.sourceid) {
          item[value.name][value.name1].draw = _this.setExp(
            Number(item.exponent[value.name][value.name1].draw),
            Number(value.exponent[value.name][value.name1].draw)
          )
          item[value.name][value.name1].fail = _this.setExp(
            Number(item.exponent[value.name][value.name1].fail),
            Number(value.exponent[value.name][value.name1].fail)
          )
          item[value.name][value.name1].win = _this.setExp(
            Number(item.exponent[value.name][value.name1].win),
            Number(value.exponent[value.name][value.name1].win)
          )
          if (
            item[value.name][value.name1].timer == undefined ||
            item[value.name][value.name1].timer == null
          ) {
            item[value.name][value.name1].timer = setTimeout((res) => {
              item[value.name][value.name1].draw = 0
              item[value.name][value.name1].fail = 0
              item[value.name][value.name1].win = 0
            }, 2000)
          } else {
            clearTimeout(item[value.name][value.name1].timer)
            item[value.name][value.name1].timer = null
          }
          // if(item.status != e.status) {
          // }
          item.exponent = _this.$common.assignDeep(item.exponent, value.exponent)
        }
      }

      /* 处理比。分 */
      if (value.type == 'football_match' && dom1 != undefined) {
        if (dom1[0] == undefined) return
        let obj = dom1[0].dataset //index ,list ,id
        let item = this.visibleData[Number(obj.index)]
        if (item.id == value.id) {
          value.home_team_name_zh = item.home_team_name_zh
          value.away_team_name_zh = item.away_team_name_zh
          if (item.away_score != value.away_score || item.home_score != value.home_score) {
            value.iszhu = 0
            if (item.home_score != value.home_score) {
              value.iszhu = 1
              _this.jinIdLeft = item.id
            } else {
              value.iszhu = 0
              _this.jinIdRight = item.id
            }
            _this.$store.state.goalItem.push(value)
            _this.time = setTimeout((res) => {
              //大球
              _this.$store.state.goalItem.shift()
              if (_this.$store.state.goalItem.length == 0) {
                window.clearInterval(_this.time)
                _this.time = null
              }
              _this.jinIdLeft = null
              _this.jinIdRight = null
            }, 6000)
          }
          if (item.status != value.status) {
            if (_this.comparisonID == item.id) return
            _this.comparisonID = item.id
            this.$emit('getList')
          }
          Object.assign(item, value)
        }
      }
    },

    // 0相等 ， 1 大于 ，2小于
    setExp(num1, num2) {
      if (num1 < num2) {
        return 1
      } else if (num1 > num2) {
        return 2
      } else if (num1 == num2) {
        return 0
      }
    },
    // 搜索高亮
    searchText(inputValue) {
      let _this = this
      if (inputValue) {
        let lang = this.lang == 1 ? 'zht' : this.lang == 2 ? 'en' : 'zh'
        // 每次查询之前清空原数据中标签,防止再次查询时,查不到
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
          // return
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
    /* 收藏 */
    setCollect(item) {
      if (!this.$store.state.user.infoData.id) {
        return this.$message.error('请登录后进行操作')
      }
      let data = {
        match_ids: item.id,
        match_type: 1
      }
      collect(data)
        .then((res) => {
          if (item.is_collect == 0) {
            this.$message.success('预约成功')
          } else {
            this.$message.success('已取消预约')
          }
          item.is_collect = item.is_collect == 0 ? (item.is_collect = 1) : (item.is_collect = 0)
        })
        .catch((res) => {
          this.$message.error(res.msg || res.data?.msg || '操作失败')
        })
    },

    // 移除列表
    mousemove() {
      clearTimeout(this.timeOutTimer)
      // this.dataMask = false
      this.timeOutTimer = setTimeout(() => {
        this.fightMask = false
      }, 200)
    },
    getList() {
      // }
    },
    changeFlag(type) {
      this.flag = type
    },
    updateVisibleData(data) {
      this.visibleData = data
    },
    /* 全选/反选 */
    setAllCheck1(type) {
      if (!type) {
        this.footList = []
        this.list.forEach((item) => {
          this.footList.push(item.id)
        })
      } else {
        this.footList = []
      }
      this.$emit('getFootList', this.footList)
    },
    // 点击选中
    setId(item) {
      let _this = this
      if (this.footList.indexOf(item.id) == -1) {
        this.footList.push(item.id)
      } else {
        this.footList.splice(_this.footList.indexOf(item.id), 1)
      }
      // listFilter 已改为 computed,会自动依赖 footList / setConf / list 重算
      this.$emit('getFootList', this.footList)
    },
    /* 鼠标移入指数动作 */
    mouseenter(e, type, item) {
      clearTimeout(this.timeOutTimer)
      clearTimeout(this.timeInTimer)
      this.timeInTimer = setTimeout(() => {
        this.$nextTick((res) => {
          this.top = 200
          this.right = 200
          // 有滚动过
          //   this.top = this.$refs[item.id][0].offsetTop - 70
          // } else { // 无滚动
          //   this.top = this.$refs[item.id][0].offsetTop + 40
          // }

          // this.right = this.$refs[item.id][0].getBoundingClientRect().right
          this.expIndex = JSON.parse(JSON.stringify(item.exponent))
          this.exponent = item
          this.fightMask = true
        })
      }, 200)
    },
    /* 鼠标移入比。分动作 */
    mouseenter1(e, type, item, ev) {
      this.$nextTick((res) => {
        // this.expIndex = JSON.parse(JSON.stringify(item.exponent))
        if (
          item.status == 2 ||
          item.status == 3 ||
          item.status == 4 ||
          item.status == 5 ||
          item.status == 6 ||
          item.status == 7
        ) {
          //进行中的比赛需要实时请求
          // 请求过于频繁,每次显示都只能请求一次
          if (this.exponentRequestTimes > 0) return
          this.exponentRequestTimes += 1
          this.getDetail(item, 1)
        } else {
          this.tlive = item
          this.exponent = item
          this.exponentIsShow = true
        }
      })
      // let top = this.$refs.sss1[i].offsetTop
    },
    scoreMouseleave() {
      this.exponentIsShow = false
      this.exponentRequestTimes = 0
    },
    scoreWrapMouseenter(item) {
      this.hoverId = item.id
    },
    virtualListUpdate(startIndex, endIndex, visibleStartIndex, visibleEndIndex) {
      // 切片源对齐渲染源 listFilter,确保过滤模式下 visibleData 索引正确
      let data = this.listFilter.slice(visibleStartIndex, visibleEndIndex)
      this.updateVisibleData(data)
    },
    /* 置顶 */
    setTop(item, index) {
      /*
       置顶
       1.子传父，将数据传给父级
       2.无：添加标题+选中的数据，有：添加选中的数据

       */
      item.index = index

      let id = null
      let list = JSON.parse(localStorage.getItem('topList')) || []
      this.topList1 = list
      /* 判断是取消还是添加 */
      if (list.indexOf(item.id) !== -1) {
        list.splice(list.indexOf(item.id), 1)
        localStorage.setItem('topList', JSON.stringify(list))
        this.$emit('setTop', item)
      } else {
        list.push(item.id)
        this.visibleData.splice(index, 1)
        if (this.visibleData[0].typeTitle !== 4) {
          this.visibleData.splice(0, 0, {
            typeTitle: 4,
            competition_id: 1000000,
            country_id: 1000000,
            competition_name_zh: '置顶',
            id: 1000009,
            imgUrl: getImageUrl('/static/images/main-beigin.png')
          })
        }
        this.visibleData.splice(1, 0, item)
        localStorage.setItem('topList', JSON.stringify(list))
        this.$emit('setTop', item)
      }
    },
    /* 请求详情 */
    getDetail(item, type) {
      this.exponent = item
      this.exponentIsShow = true
      this.tliveLoading = true
      getfootballDetail({
        id: item.id,
        list_show: 1
      })
        .then((res) => {
          res.data.id = item.id
          res.data.home_score = item.home_score
          res.data.away_score = item.away_score
          res.data.home_team_name_zh = item.home_team_name_zh
          res.data.away_team_name_zh = item.away_team_name_zh
          res.data.tlive = res.data.tlive.reverse()
          this.tlive = res.data

          this.tliveLoading = false
        })
        .catch((res) => {})
    }
  }
}
</script>
<style lang="scss" scoped>
@use '@/styles/liveScore.scss';

.flag_score_football_0 {
  padding-bottom: 50px;
}

.football-league-logo-img {
  vertical-align: baseline !important;
}
html::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: #fff;
}

.list-view {
  // border: 1px solid #aaa;
  // width: 200px;
  margin: 0 auto;
}

.left-btn {
  position: fixed;
  left: 100px;
  top: 100px;
  z-index: 999;

  p {
    margin-top: 10px;
  }
}

.btn {
  position: fixed;
  bottom: 67px;
  z-index: 999;
}

.list-view::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.list-view-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.list-view-item {
  padding: 5px;
  color: #666;
  line-height: 30px;
}

.immediate,
.width180 {
  display: flex;
}
.logo-title {
  width: 20px;
  height: 20px;
  margin-right: 6px;
}
</style>
