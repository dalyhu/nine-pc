<template>
  <div id="ScoreBoard" class="layout_score_board score_basketball">
    <div class="score-conrainer">
      <div class="score-container-main fff" :class="['tabIndex' + tabIndex]" style="margin: 0 auto">
        <div class="score-main--top">
          <div class="fixed-header-wrap" style="position: relative">
            <div
              class="score-left-nav-filter-wrap"
              style="position: absolute; left: -60px"
              v-if="tabIndex == 0"
            >
              <div class="score-left-nav-filter-item" @click="collect()">
                <div class="score-left-nav-filter-item-icon left-nav-guanzhu"></div>
                <span>预约</span>
              </div>
              <div class="score-left-nav-filter-item" @click="retain()">
                <div class="score-left-nav-filter-item-icon left-nav-gouxuan"></div>
                <span>保留</span>
              </div>
              <div class="score-left-nav-filter-item" @click="conceal()">
                <div class="score-left-nav-filter-item-icon left-nav-yingcang"></div>
                <span>隐藏</span>
              </div>
            </div>
            <div class="score-right-wrap"></div>
            <div style="position: absolute; top: 310px; right: -70px" v-if="tabIndex == 0">
              <div>
                <div id="matchStatusNav">
                  <div class="item" :class="typeTab == 0 ? 'active' : ''" @click="setTab(0)">
                    <i class="going-icon"></i>进行中
                  </div>
                  <div class="item" :class="typeTab == 1 ? 'active' : ''" @click="setTab(1)">
                    <i class="uncoming-icon"></i>未开<span class="line"></span>
                  </div>
                  <div class="item" @click="setTab(2)" :class="typeTab == 2 ? 'active' : ''">
                    <i class="finished-icon"></i>完场<span class="line"></span>
                  </div>
                  <!-- disable -->
                  <div class="item" @click="setTab(3)" :class="typeTab == 3 ? 'active' : ''">
                    <i class="unknown-icon"></i>异常
                  </div>
                </div>
              </div>
            </div>
            <div class="fixed-header-wrap">
              <div id="header-filter">
                <div class="header-filter-left">
                  <div class="buttons-wrap">
                    <button
                      v-for="(item, index) in tabList"
                      :class="index == tabIndex ? 'active' : ''"
                      @click="tabIndex = index"
                      :key="index"
                      class="left-button"
                    >
                      {{ item }}
                    </button>
                    <button
                      class="left-button"
                      style="margin-right: 0"
                      :class="3 == tabIndex ? 'active' : ''"
                      @click="tabIndex = 3"
                    >
                      预约
                    </button>
                    <button
                      class="left-button active"
                      style="margin-left: 16px"
                      v-if="$store.state.concealNum != 0"
                      @click="cancelConceal()"
                    >
                      全部<span class="weight"> （隐藏{{ $store.state.concealNum }}场）</span>
                    </button>
                  </div>
                </div>
                <div class="header-filter-right" style="position: relative">
                  <!-- 收藏标签不需要显示 -->
                  <!-- nest_comment_start~<div v-show="[0, 1, 2].includes(tabIndex)" class="header-second-filter-right">
                    <div
                      class="ant-dropdown-trigger filter-main-button-container"
                      style="position: relative"
                    >
                      <el-popover
                        placement="bottom"
                        width="100"
                        trigger="click"
                        popper-class="popover1"
                      >
                        <ul role="menu" tabindex="0" data-menu-list="true">
                          <li
                            class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child"
                            role="menuitem"
                            tabindex="-1"
                            data-menu-id="rc-menu-uuid-93853-1-0"
                            @click="selectTab(item, maskIndex)"
                            v-for="(item, index) in matchList"
                            :key="index"
                          >
                            <span class="ant-dropdown-menu-title-content">
                              <div class="filter-choose-item" style="text-align: center">
                                {{ item.name }}
                              </div>
                            </span>
                          </li>
                        </ul>
                        <template #reference>
                          <button
                            class="match-filter-main-button"
                            :class="maskIndex == 1 ? 'active' : ''"
                            style="margin: 0px"
                            @click="getMaskShow(1)"
                          >
                            <div class="i">{{ selectLi }}</div>
                            <i class="arrow-down"></i>
                          </button>
                        </template>
                      </el-popover>
                      ~nest_comment_end --><!-- 类型下拉 --><!-- nest_comment_start~
                    </div>

                    <el-popover
                      placement="bottom"
                      width="424"
                      trigger="click"
                      popper-class="popover1"
                      ref="popover1"
                    >
                      <div class="filter-content">
                        <div class="filter-header-tabs">
                          <div
                            class="tab-item"
                            :class="checkIndex == 0 ? 'active' : ''"
                            @click="checkIndex = 0"
                          >
                            按赛事
                          </div>
                          <div
                            class="tab-item"
                            :class="checkIndex == 1 ? 'active' : ''"
                            @click="checkIndex = 1"
                          >
                            国家/地区
                          </div>
                        </div>
                        <div class="filter-scroll-view" style="height: 348px">
                          <div
                            class="filter-checkbox-wrap"
                            v-for="(item, key, index) in screen.list"
                            :key="index"
                          >
                            <div class="filter-checkbox-word" v-if="maskIndex != 3">
                              {{ item.name }}
                            </div>
                            <ul class="filter-checkbox-list">
                              <li
                                class="filter-checkbox-item"
                                :class="item1.check ? 'active' : ''"
                                v-for="(item1, index1) in item.list"
                                :key="index1"
                              >
                                <label
                                  class="checkbox-wrap"
                                  @click.stop="setCheckStatus($event, item1)"
                                >
                                  <img
                                    width="18px"
                                    height="18px"
                                    :src="
                                      getImageUrl(
                                        item1.check
                                          ? '/static/images/check1.png'
                                          : '/static/images/check.png'
                                      )
                                    "
                                  />
                                  <div class="checkbox-children">
                                    {{ item1.name }}
                                    <span class="filter-checkbox-item-matchnum"
                                      >[{{ item1.count }}]</span
                                    >
                                  </div>
                                </label>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div class="filter-footer-wrap-for-football">
                          <div class="quantity-information">
                            选中
                            <span class="active"
                              >{{ checkIndex == 0 ? screen.count_2 : screen.count_1 }}/</span
                            >
                            {{
                              checkIndex == 0 ? screen.count_competition : screen.count_country
                            }}场
                          </div>
                          <div class="filter-footer-button" @click="setAllCheck(true)">全选</div>
                          <div class="filter-footer-button" @click="setAllCheck(false)">反选</div>
                          <div class="filter-footer-button confirm-button" @click="setCheckList()">
                            确定
                          </div>
                        </div>
                      </div>
                      <template #reference>
                        <button
                          :class="maskIndex == 2 ? 'active' : ''"
                          class="match-filter-main-button"
                          @click="getMaskShow(2)"
                        >
                          <div class="i">赛事</div>
                          <i class="arrow-down"></i>
                        </button>
                      </template>
                    </el-popover>
                  </div>~nest_comment_end -->
                  <!-- nest_comment_start~<div class="header-filter-right-tools-wrap">
                    <el-popover
                      placement="bottom-end"
                      width="384"
                      trigger="click"
                      popper-class="popover1"
                    >
                      <div class="setting-popover-content">
                        <div class="setting-header content_txt_1"></div>
                        <div class="setting-content" style="background: white">
                          ~nest_comment_end --><!-- <div>
                            <div class="setting-item">
                              <p class="label-name">语言选择</p>
                              <div class="options">
                                <div
                                  class="option-button"
                                  @click="langIndex = index"
                                  v-for="(item, index) in langList"
                                  :key="index"
                                  :class="index == langIndex ? 'active' : ''"
                                >
                                  {{ item }}
                                </div>
                              </div>
                            </div>
                          </div> --><!-- <div>
														<div class="setting-item">
															<p class="label-name">比赛信息</p>
															<div
																class="ant-checkbox-group checkbox-group-container">
																<label class="ant-checkbox-wrapper"
																	@click="setGame('red')"
																	:class="game.red?'ant-checkbox-wrapper-checked':''">
																	<span class="ant-checkbox">
																		<img :src="getImageUrl(game.red?'/static/images/check1.png' : '/static/images/check.png')"
																			width="20px" height="20px">
																		红牌数
																	</span>
																</label>
																<label class="ant-checkbox-wrapper"
																	@click="setGame('yellow')"
																	:class="game.yellow?'ant-checkbox-wrapper-checked':''">
																	<span class="ant-checkbox">
																		<img :src="getImageUrl(game.yellow?'/static/images/check1.png' : '/static/images/check.png')"
																			width="20px" height="20px">
																		黄牌数
																	</span>
																</label>
															</div>
														</div>
													</div> --><!-- <div>
                            <div class="setting-item">
                              <p class="label-name">声音设置</p>
                              <div class="options" style="width: 157px">
                                <div
                                  class="option-button"
                                  :class="game.voice ? 'active' : ''"
                                  @click="setGame('voice', 1)"
                                >
                                  哨声
                                </div>
                                <div
                                  class="option-button"
                                  :class="!game.voice ? 'active' : ''"
                                  @click="setGame('voice', 2)"
                                >
                                  静音
                                </div>
                              </div>
                            </div>
                          </div> --><!-- nest_comment_start~
                        </div>
                      </div>
                      <template #reference>
                        <img
                          class="setting-popover-button"
                          @click="langMask = !langMask"
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAn1BMVEUAAACjo6Ojo6yAg5KUmKWBhJOUoqWBg5OChZOBhJOBhJOLi5yVl6WUmKSAg5OVmKaBhZSXm6aUmaeUmqaBhJOAhJOChZSIiJuBhJKAhJOBhJKChZSDhZSDhZWDh5SFhpaGh5aBhJKAg5KBhZOHh5eVmKSUl6WChJOBhJODhJSAg5KAg5OBhJOBhJOBhJODg5KBhJKBhJKBhZOAg5KUl6R0AIjxAAAAM3RSTlMABAb9kvEL2Fq4nA/z1aqaeEI3K/nQTxT0yLBVSjYuKSLn4XEa5r1zZD7utKGZf0PCpJRbH5GKAAABxUlEQVRIx91V2ZaCMAwdVgvDouigwrC57zrS//+2aYq0pUcRXs0L9Saxyc3Sr48UxZ6UlWjWdxeH35LLsIvDUHCIujhYgkOhdIhII4YZOaiz9phUhCDFGMxuFLHJaTJUCA3h7kn2HtFaxwFlZ0+R1YxGdfSKsvxR27i5PLBQe82XMmAqjevCGUONVdNhWSsmUSrAK9uoFaeG/RTwcxqjvZydukdxuoWLExE+w6VTyVYKeC4AKWS35L/Huus4rj5mwBWCQs3iDhQWhY4fojMyI2Kx4GUHMg55bb/B2A9MM/Ax3jw8ppTEnDn8lSWvjY7Xo+o0WmO9rioYKDypOwC7Kn6Mwb7ywJjmkYD61iDlxGjQsc9hv7rCZgEwyYBpE04uDjgcYBc+kEEoUb2ok3KwyVETO/AB1uUqFTAFrxxgyKUWyDUSktoWUixNw9uk54rYK6cOtLKdwwqndCocb42spTVM1hq9m69/e/cfID6idhaiqzyiZoLiZElHtOcSsF+vmS1DQ0NeM+2LLJYXmdwcxtFbCKsyp/9fWJHBpkFaxtCm6MAIudP4VKKSlvGT2DLgBy7Y9ntQoLjv5SI4eL0fxf7P7kfKP05cbJAGXu+dAAAAAElFTkSuQmCC"
                          width="24"
                          alt="setting"
                        />
                      </template>
                    </el-popover>
                  </div>~nest_comment_end -->
                </div>
              </div>
              <img
                class="score-banner"
                :src="ballBanner"
                alt="score-banner"
                @click="$router.push('/downLoad')"
              />
              <div class="header-date-filter" v-if="tabIndex == 2 || tabIndex == 1">
                <div
                  class="date-button"
                  :class="index == timeIndex ? 'active' : ''"
                  @click="timeIndex = index"
                  v-for="(item, index) in dateTime"
                  :key="index"
                >
                  <div class="date">{{ item.data }}</div>
                  <div class="week">{{ item.time }}</div>
                </div>
                <div
                  class="date-button"
                  style="color: rgb(128, 131, 146); position: relative"
                  @click="getShow()"
                >
                  <i class="date-picker-icon"></i>日历<i class="arrow-down"></i>
                  <el-date-picker
                    ref="abc"
                    type="date"
                    v-model="time"
                    format="yyyy-MM-dd"
                    value-format="YYYY-MM-DD"
                    class="datePicker"
                    @change="change"
                    placeholder="选择日期"
                    :disabledDate="disableDates"
                  >
                  </el-date-picker>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="basketball-score-container"
          style="background: white"
          v-loading="$store.state.loading"
        >
          <div class="scrollbar-wrap" ref="scrollbarContainer">
            <basketball0
              ref="basketball0"
              v-if="tabIndex == 0"
              @setTypeTab="setTypeTab"
              :typeTab="typeTab"
              :lang="langIndex"
            ></basketball0>
            <basketball1
              ref="basketball1"
              v-if="tabIndex == 1"
              @getMatchFilter="getCheckList"
              :lang="langIndex"
              :time="timeType"
            >
            </basketball1>
            <basketball2
              ref="basketball2"
              v-if="tabIndex == 2"
              :lang="langIndex"
              :time="timeType"
              @getMatchFilter="getCheckList"
            ></basketball2>
            <basketball3 ref="basketball3" v-if="tabIndex == 3" :lang="langIndex"></basketball3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import basketball0 from './basketball-0.vue'
import basketball1 from './basketball-1.vue'
import basketball2 from './basketball-2.vue'
import basketball3 from './basketball-3.vue'
import scorePageMixins from '@/mixins/scorePageMixins.js'
// import { match_filter } from '@/api/football.js'
import { getList } from '@/api/basketball.js'
import { getImageUrl } from '@/utils/common.js'

import { myMIxins } from './ballMixins.js'

export default {
  name: 'BasketballScore',
  components: {
    basketball0,
    basketball1,
    basketball3,
    basketball2
  },
  mixins: [scorePageMixins, myMIxins],
  data() {
    return {
      adCode: '013',
      time: '',
      typeTab: 0,
      timeType: {},
      loading: false,
      tabIndex: 0,
      langIndex: 0,
      checkIndex: 0,
      selectLi: '完整', //选中的完整热门
      screen: {
        list: [],
        country: {},
        count_1: null,
        count_2: null,
        competition: {},
        count_country: null,
        count_competition: null
      }, //筛选对象competition-赛事；country-国家-赛事筛选
      langList: ['简体', '繁体', 'English'],
      langMask: false, //切换语言
      dateTime: [], //时间列表
      timeIndex: 0, //时间下表
      maskIndex: null, //显示的弹窗
      matchList: [
        {
          name: '完整',
          id: 0
        },
        {
          name: '热门',
          id: 1
        }
      ],
      tabList: ['即时', '赛果', '赛程']
    }
  },
  watch: {
    // 切换语言
    langIndex(e) {
      this.langMask = false
      localStorage.setItem('langIndex', e)
    },
    langMask(e) {
      if (e) {
        this.maskIndex = null
      }
    },
    // 监听赛事切换监听
    checkIndex(e) {
      if (e == 0) {
        this.screen.list = this.screen.competition
      } else {
        this.screen.list = this.screen.country
      }
    },

    tabIndex(e) {
      this.resetParams()

      // 赛果
      if (e == 1) {
        this.get6Days(2)
        this.timeIndex = 5
      } else if (e == 2) {
        // 赛程
        this.timeIndex = 0
        this.get6Days(1)
        this.timeType = this.dateTime[0] // 更新当前查询日期 , 取第一个
      }

      // 不加这个会造成首次进入赛果未带入当天日期
      this.$nextTick(() => {
        this.getCheckList()
      })
    },
    timeIndex(e) {
      if (e == null) {
        return
      }
      this.resetParams()
      this.timeType = this.dateTime[e]
    },
    listType1(e) {
      console.log(e)
      this.listType1 = e
    }
  },
  computed: {
    infos() {
      return this.$store.state.user.infoData
    },
    shouNum() {
      return this.$store.state.shouNum
    },
    game() {
      return this.$store.state.game
    }
  },
  created() {

  },
  mounted() {
    this.resetParams()
    this.getCheckList()
    // 获取收藏的条数
    this.getList()
    this.$store.state.type = 2
  },
  methods: {
    getImageUrl,
    // 重置参数
    resetParams() {
      this.checkIndex = 0 // 重置 赛事/国家地区tab
      this.$store.state.concealNum = 0 // 重置
    },
    // 获取收藏的条数
    getList() {
      this.$store.state.loading = true
      getList({ type: 4 })
        .then((res) => {
          this.$store.state.shouNum = res.data.data.length
          this.$store.state.loading = false
        })
        .catch((res) => {
          this.$store.state.loading = false
        })
    },

    // 选择公司
    selectTab(item, type) {
      // if (type != 1) {
      // 	this.id = item.id
      // 	this.boxLi = item.name
      // }else
      if (type == 1) {
        this.match_id = item.id
        this.selectId = item.id
        this.selectLi = item.name
        this.getCheckList()
      } else {
        this.selectId = item.id
        this.selectLi = item.name
      }
      this.maskIndex = null
    },
    // 调用筛选
    getCheckList() {
      // let data = {
      //   ball: 1,
      //   type: this.match_id,
      //   match_filter: this.tabIndex
      // }
      // // console.log();
      // if (this.tabIndex == 1 || this.tabIndex == 2) {
      //   data.date = this.timeType.day
      // }
      // match_filter(data)
      //   .then((res) => {
      //     res.data.count_1 = res.data.count_country
      //     res.data.count_2 = res.data.count_competition
      //     res.data.list = res.data.competition
      //     this.screen = res.data
      //     let list = []
      //     res.data.competition.forEach((item1) => {
      //       item1.list.forEach((item) => {
      //         if (item.check) {
      //           list.push(item.id)
      //         }
      //       })
      //     })
      //     setTimeout((res) => {
      //       this.$refs['basketball' + this.tabIndex].screenList(list, 'competition_id')
      //     }, 500)
      //   })
      //   .catch((res) => {})
    },

    // 申请主播
    // applyFor() {
    //   if (Object.keys(this.infos).length === 0) return (this.$store.state.user.showLoginMask = true)
    //   if (this.infos.is_anchor == 1) {
    //     let routeData = this.$router.resolve({
    //       path: '/member?type=9',
    //       query: {
    //         type: '9'
    //       }
    //     })
    //     window.open(routeData.href, '_self')
    //   } else {
    //     let routeData = this.$router.resolve({
    //       path: '/member?type=7',
    //       query: {
    //         type: '7'
    //       }
    //     })
    //     window.open(routeData.href, '_self')
    //   }
    // },
    // 获取选中的赛事
    setCheckList() {
      let list = []
      let num = 0
      list.push(1000000)
      this.$refs.popover1.hide()
      // 按赛事选择
      if (this.checkIndex == 0) {
        let arr = this.screen.competition

        for (let i in arr) {
          arr[i].list.forEach((item) => {
            if (item.check) {
              list.push(item.id)
            } else {
              num += item.count
            }
          })
        }

        this.$refs['basketball' + this.tabIndex].screenList(list, 'competition_id')
        // this.screen.list = arr
      } else {
        // 按国家/地区选择
        let arr = this.screen.country
        for (let i in arr) {
          arr[i].list.forEach((item) => {
            if (item.check) {
              list.push(item.id)
            } else {
              num += item.count
            }
          })
        }
        console.log(list)
        this.$refs['basketball' + this.tabIndex].screenList(list, 'country_id')
      }
      this.getMaskShow(2)
      this.$store.state.concealNum = num
      this.$nextTick(() => {
        // 返回顶部
        this.$refs['football' + this.tabIndex].$refs.scoreScroller.scrollToPosition(-250)
      })
    },
    // 隐藏
    conceal() {
      this.$refs.basketball0.conceal()
    },
    // 保留
    retain() {
      this.$refs.basketball0.retain()
    },
    // 收藏
    collect() {
      this.$refs.basketball0.collect()
    },
    // 取消隐藏
    cancelConceal() {
      let list = []
      let arr = []
      if (this.tabIndex === 0) this.$refs.basketball0.cancelConceal()
      this.$store.state.concealNum = 0
      // 显示赛事
      if (this.checkIndex == 0) {
        arr = this.screen.competition
      } else {
        arr = this.screen.country
      }
      for (let i in arr) {
        arr[i].list.forEach((item) => {
          item.check = true
          list.push(item.id)
        })
      }
      if (this.checkIndex == 0) {
        this.$refs['basketball' + this.tabIndex].screenList(list, 'competition_id')
      } else {
        this.$refs['basketball' + this.tabIndex].screenList(list, 'country_id')
      }
    },

    getShow() {
      this.$refs.abc.focus()
    },
    // 显示隐藏弹窗
    getMaskShow(type) {
      if (this.maskIndex == type) {
        return (this.maskIndex = null)
      }
      if (this.langMask) {
        this.langMask = false
      }
      this.maskIndex = type
    },
    // 选中的日期
    change(e) {
      console.log(e)
      let data = {
        day: e
      }

      this.timeType = data
      this.timeIndex = null
      console.log(data)
    },

    // 修改三个状态高度
    setTypeTab(num) {
      document.documentElement.scrollTop = num - 145
    },
    // 切换高度
    setTab(type) {
      this.typeTab = type
      this.$refs.basketball0.updateTab(type)
    },
    // 全选/反选
    setAllCheck(status) {
      let checkedNum = 0
      if (this.checkIndex == 0) {
        let arr = this.screen.competition
        for (let i in arr) {
          arr[i].list.forEach((item) => {
            if (status) {
              item.check = status
              checkedNum++
            } else {
              item.check = !item.check
              if (item.check) checkedNum++
            }
          })
        }
        if (status) {
          this.screen.count_2 = this.screen.count_competition
        } else {
          this.screen.count_2 = checkedNum
        }
        this.screen.list = arr
      } else {
        let arr = this.screen.country
        for (let i in arr) {
          arr[i].list.forEach((item) => {
            if (status) {
              item.check = status
              checkedNum++
            } else {
              item.check = !item.check
              if (item.check) checkedNum++
            }
          })
        }
        if (status) {
          this.screen.count_1 = this.screen.count_country
        } else {
          this.screen.count_1 = checkedNum
        }
        this.screen.list = arr
      }
    },
    setCheckStatus(e, item) {
      if (e.target.tagName === 'INPUT') return
      item.check = !item.check
      if (item.check && this.checkIndex == 0) {
        this.screen.count_2++
      }
      if (!item.check && this.checkIndex == 0) {
        this.screen.count_2--
      }
      if (item.check && this.checkIndex == 1) {
        this.screen.count_1++
      }
      if (!item.check && this.checkIndex == 1) {
        this.screen.count_1--
      }

      console.log(item.check)
    },
    //获取六天数据
    get6Days(type) {
      //type==1前,2后
      //获取系统当前时间
      var now = new Date()
      var nowTime = now.getTime()
      var oneDayTime = 24 * 60 * 60 * 1000
      let arr = []
      let ShowTime
      for (var i = 0; i < 6; i++) {
        //显示周一
        if (type == 1) {
          ShowTime = nowTime + i * oneDayTime
        } else {
          ShowTime = nowTime - i * oneDayTime
        }

        //                    var ShowTime = nowTime + (i+1)*oneDayTime ;
        //初始化日期时间
        var myDate = new Date(ShowTime)
        var year = myDate.getFullYear()
        var month = myDate.getMonth() + 1
        var date = myDate.getDate()
        var str = '周' + '日一二三四五六'.charAt(myDate.getDay())
        arr.push({
          data: month + '-' + date.toString().padStart(2, '0'),
          time: str,
          day: year + '-' + month + '-' + date
        })
      }
      if (type == 1) {
        this.dateTime = arr
      } else {
        this.dateTime = arr.reverse()
      }
    },
    disableDates(date) {
      const today = new Date()
      if (this.tabIndex === 1) {
        return date.getTime() >= today.getTime()
      } else {
        return date.getTime() < today.getTime()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/liveScore.scss';
.basketball-score-container {
  width: 100%;
  min-height: calc(100vh - 489px);
  margin-bottom: 21px;
}

.basketball-score-container .container-section {
  border-radius: 4px;
}

.basketball-score-container .container-section.no-border {
  border-radius: 0;
}

#ScoreBoard .score-conrainer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  width: 1304px;
  margin-left: auto;
  margin-right: auto;
  /* left: -50px; */
  /* overflow: hidden; */
}

.datePicker {
  position: absolute;
  top: 0;
  left: -50px;
  z-index: -1;
  /* visibility: hidden; */
}

.container-section .title {
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  /*padding-left: 542px;*/
}

.container-section .title .con {
  display: flex;
  font-size: 14px;
  color: #9197ad;
}

.container-section .title .con img {
  margin-right: 8px;
}

.score-banner {
  width: 1200px;
  height: 80px;
  // object-fit: cover;
  cursor: pointer;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.score-container-main {
  width: 1200px;
  min-height: calc(100vh - 60px);
}

.fff .el-popper[x-placement^='bottom'] {
  padding: 0 !important;
}

.header-date-filter {
  :deep(.datePicker) {
    position: fixed;
    pointer-events: none;
    opacity: 0;
  }
}
</style>
<style lang="scss">
.app-wrapper {
  /* 防止挡住滚动条 */
  .global-chat-win {
    right: 6px;
  }

  .list-view-item {
    padding: 0;
  }

  #ScoreBoard
    .score-container
    .score-container-main
    .container-section
    .score_list_item:nth-child(odd)
    li {
    background-color: #fff;
  }

  .vue-recycle-scroller__item-wrapper {
    margin-bottom: 10px;
  }

  #ScoreBoard {
    .score-container-main {
      padding-top: 136px;
      .score-main--top {
        position: fixed;
        top: 54px;
        z-index: 3;
      }
    }
    &.score_basketball {
      .score-container-main {
        padding-top: 136px;
        &.tabIndex1,
        &.tabIndex2 {
          padding-top: 196px;
        }
      }
    }
  }
}
</style>
