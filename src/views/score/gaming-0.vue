<template>
  <div class="contents-main flag_score_gaming_0">
    <div class="contents" style="position: relative">
      <!-- 电竞即时数据 -->
      <div
        class="football-score-container list-view"
        v-loading="$store.state.loading"
        style="width: 1200px"
      >
        <section
          class="container-section"
          style="box-shadow: rgb(238, 238, 238) 0px 1px 0px 0px inset"
        >
          <div class="list-view-phantom" :style="{ height: contentHeight }"></div>

          <ul v-if="list.length > 0" ref="contentList" class="list-view-content">
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
                <li
                  :key="item.id"
                  class="football-score-item"
                  :class="{ 'flex-center': !item.type }"
                  style="position: relative"
                  :style="!item.type ? 'height:' + itemHeight + 'px' : ''"
                >
                  <template v-if="!item.type">
                    <img :src="item.imgUrl" class="logo-title" @error="item.imgUrl = '/avatar.png'" />
                    {{ item.competition_name_zh }}
                  </template>
                  <template v-else>
                    <section class="gou width40 td_check">
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
                    </section>
                    <div class="match-field width172 score_item_td">
                      <div class="football-league-name-container false" style="height: 44.5px">
                        <div
                          class="football-league-color-block"
                          :style="{ background: item.primary_color }"
                        ></div>
                        <div class="football-league-logo">
                          <img
                            :src="item.competition_logo"
                            width="56"
                            height="56"
                            @error="item.competition_logo = '/avatar.png'"
                            class="football-league-logo-img"
                          />
                        </div>
                        <div class="competition_wrap">
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
                          <div class="competition_system" v-if="item.bo">BO:{{ item.bo }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="time width32 text-center score_item_td">
                      {{ $common.timeStamp(item.time) }}
                    </div>
                    <div class="match-status width93 football-all-status score_item_td">
                      <span :class="{ 'point-animation': item.status === 1 }">{{
                        item.status_str
                      }}</span>
                    </div>
                    <div
                      class="teamName-and-vs football-score-item-teamRank width420 score_item_td"
                    >
                      <div
                        class="team-info host-container width189"
                        :class="jinIdLeft == item.id ? 'score-item-goal-left' : ''"
                      >
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

                      <div class="hover-box">
                        <!-- 判断是否进行中得比。分显示   -->
                        <div class="vs width42 bf" v-if="item.status != 3">
                          <span style="color: rgb(255, 67, 67)">{{ item.home_score }}</span>
                          <span data-a="0" data-b="2" style="color: rgb(255, 67, 67)">-</span>
                          <span style="color: rgb(255, 67, 67)">{{ item.away_score }}</span>
                        </div>
                        <div class="vs width42 bf" v-else>
                          <span data-a="0" data-b="0" style="color: rgb(145, 151, 173)">-</span>
                        </div>
                      </div>

                      <div
                        class="team-info guest-container width189"
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
                      </div>
                    </div>
                    <div class="variable width443 score_item_td" style="position: relative">
                      <div class="model-one width180">
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
                                  :src="$common.avatarHandler(item.anchor_live[0].avatar)"
                                  width="36"
                                  height="36"
                                  @error="$common.errorImg($event)"
                                />
                              </router-link>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="data width87 project">
                        <img :src="gameLogoHandler(item.game_id)" />
                        <span>{{ item.game_name }}</span>
                      </div>
                      <div class="match width74">
                        <div class="football-score-item-operation">
                          <img
                            v-if="[1, 2].includes(getMatchStatusType('gaming', item))"
                            @click="setCollect(item)"
                            :src="
                              getImageUrl(
                                item.is_collect == 1
                                  ? '/static/images/icon-reserve-active.png'
                                  : '/static/images/icon-reserve.png'
                              )
                            "
                            class="collect"
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
                  </template>
                </li>
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
import { getLiveScore } from '@/api/game.js'
import { collect } from '@/api/common.js'
import { gameLogoHandler } from '@/utils'
import { getImageUrl } from '@/utils/common.js'

export default {
  name: 'GamingScore0',
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
    topShow: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
    topList: {
      type: Array,
      default: () => []
    },
    gameId: {
      type: [Number, String],
      default: ''
    }
  },
  components: {},
  computed: {
    contentHeight() {
      return this.list.length * this.itemHeight + 'px'
    },
    // 显示红黄牌
    game() {
      return this.$store.state.game
    },
    immediately() {
      return this.$store.state.immediately
    }
  },
  mounted() {},
  inject: ['getMatchStatusType'],
  data() {
    return {
      top: 0, //距离顶部的距离
      right: 0, //距离右边的距离
      time: null,
      ishow: false,
      tliveLoading: false,
      footList: [],
      tlive: {}, //
      topList1: [],
      exponent: {}, //鼠标移入获取的下标
      expIndex: {}, //鼠标移入指数弹窗显示的参数
      fightMask: false, //指数弹窗
      // dataMask: false, //对战弹窗
      visibleData: [],
      jinIdLeft: null, //进球提示
      jinIdRight: null, //进球提示
      comparisonID: 0, //状态被修改 (锁)
      timeOutTimer: null,
      timeInTimer: null
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
      if (value.type == 'gaming_exponent') {
        if (value.sourceid == undefined) return
        dom1 = this.$refs[value.sourceid]
      } else if (value.type == 'gaming_match') {
        if (value.id == undefined) return
        dom1 = this.$refs[value.id]
      }
      /* 处理指数 */
      if (value.type == 'gaming_exponent' && dom1 != undefined) {
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
      if (value.type == 'gaming_match' && dom1 != undefined) {
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
        this.$forceUpdate()
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
        match_type: 4
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
          this.$message.error(res.msg || '操作失败')
        })
    },

    // 移除列表
    mousemove() {
      clearTimeout(this.timeOutTimer)
      this.timeOutTimer = setTimeout(() => {
        console.log('移出')
        this.fightMask = false
      }, 200)
    },
    updateVisibleData(data) {
      this.visibleData = data
    },
    /* 全选/反选 */
    setAllCheck1(type) {
      if (!type) {
        this.footList = []
        this.list.forEach((item) => {
          if (item.id) this.footList.push(item.id)
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
      this.$emit('getFootList', this.footList)
    },
    /* 鼠标移入指数动作 */
    mouseenter(e, type, item) {
      clearTimeout(this.timeOutTimer)
      clearTimeout(this.timeInTimer)
      this.timeInTimer = setTimeout(() => {
        console.log('移入')
        this.$nextTick((res) => {
          this.expIndex = JSON.parse(JSON.stringify(item.exponent))
          this.exponent = item
          this.fightMask = true
        })
      }, 200)
    },
    virtualListUpdate(startIndex, endIndex, visibleStartIndex, visibleEndIndex) {
      let data = this.list.slice(visibleStartIndex, visibleEndIndex)
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
      // this.$emit('setTop',item,index)

      // return
      let id = null
      let list = JSON.parse(localStorage.getItem('topList2')) || []
      this.topList1 = list
      /* 判断是取消还是添加 */
      if (list.indexOf(item.id) !== -1) {
        list.splice(list.indexOf(item.id), 1)
        localStorage.setItem('topList2', JSON.stringify(list))
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
        localStorage.setItem('topList2', JSON.stringify(list))
        this.$emit('setTop', item)
      }
    },
    /* 请求详情 */
    getDetail(item, type) {
      this.exponent = item
      this.ishow = true
      this.tliveLoading = true
      getLiveScore({
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
    },
    gameLogoHandler(gameId) {
      return gameLogoHandler(gameId)
    }
  }
}
</script>
<style lang="scss" scoped>
@use '@/styles/liveScore.scss';
html::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: #fff;
}
.list-view {
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
  /* Chrome Safari */
  display: none;
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
