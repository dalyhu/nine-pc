<template>
  <div
    id="ScoreBoard"
    class="layout_score_board score_gaming"
    data-desc="电竞Score列表"
    ref="ScoreBoard"
  >
    <div class="score-container">
      <main class="score-container-main" :class="['tabIndex' + tabIndex]" style="min-height: 0">
        <div class="score-main--top">
          <div class="fixed-header-wrap" style="position: relative">
            <div class="score-left-nav-filter-wrap" style="position: absolute" v-if="tabIndex == 0">
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
            <div class="score_left_nav_filter_wrap">
              <div class="item" :class="{ active: !gameId }" @click="gameId = ''">全部</div>
              <div
                class="item"
                :class="{ active: gameId === item.gameId }"
                v-for="item in game_filter"
                :key="item.gameId"
                @click="gameId = item.gameId"
              >
                {{ item.name }}
              </div>
            </div>
            <div class="score-right-wrap"></div>

            <div style="position: absolute; top: 310px; right: -70px" v-if="tabIndex == 10">
              <div>
                <div id="matchStatusNav">
                  <div
                    class="item"
                    :class="[typeTab == 0 ? 'active' : '', objNum.a == 0 ? 'disable' : '']"
                    @click="setTab(0)"
                  >
                    <i class="going-icon"></i>进行中
                  </div>
                  <div
                    class="item"
                    :class="[typeTab == 1 ? 'active' : '', objNum.b == 0 ? 'disable' : '']"
                    @click="setTab(1)"
                  >
                    <i class="uncoming-icon"></i>未开<span class="line"></span>
                  </div>
                  <div
                    class="item"
                    @click="setTab(2)"
                    :class="[typeTab == 2 ? 'active' : '', objNum.c == 0 ? 'disable' : '']"
                  >
                    <i class="finished-icon"></i>完场<span class="line"></span>
                  </div>
                  <div
                    class="item"
                    @click="setTab(3)"
                    :class="[typeTab == 3 ? 'active' : '', objNum.d == 0 ? 'disable' : '']"
                  >
                    <i class="unknown-icon"></i>异常
                  </div>
                </div>
              </div>
            </div>

            <div id="header-filter">
              <div class="header-filter-left">
                <div class="buttons-wrap">
                  <button
                    class="left-button"
                    @click="tabIndex = index"
                    v-for="(item, index) in tabList"
                    :class="index == tabIndex ? 'active' : ''"
                    :key="index"
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
                    title="点击显示全部"
                    style="margin-left: 16px"
                    v-if="$store.state.concealNum != 0"
                    @click="cancelConceal()"
                  >
                    全部<span class="weight"> （隐藏{{ $store.state.concealNum }}场）</span>
                  </button>
                </div>
              </div>

              <div class="header-filter-right">
                <!-- 收藏标签不需要显示 -->
                <div
                  v-show="[0, 1, 2].includes(tabIndex)"
                  class="header-second-filter-right"
                  style="position: relative"
                >
                  <el-popover
                    placement="bottom"
                    width="424"
                    trigger="click"
                    popper-class="popover gaming_filter_popover"
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
                          按项目
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
                          {{ checkIndex == 0 ? screen.count_competition : screen.count_country }}
                          {{ checkIndex === 0 ? '场' : '场' }}
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
                </div>
                <div class="header-filter-right-tools-wrap">
                  <div class="search">
                    <div class="search-main" style="margin-left: 12px; width: auto" v-if="isSearch">
                      <input
                        placeholder="请输入要查询的赛事或队伍名称"
                        v-model="inputValue"
                        type="text"
                        class="ant-input ant-input-sm"
                      />
                      <div class="search-number">
                        <span class="color-b98c53" v-if="allNum != 0">{{ allNum }}</span>
                      </div>
                      <div class="division"></div>
                      <div class="close" @click="(isSearch = false), clearSearch()"></div>
                    </div>
                    <div v-else @click="isSearch = true">
                      <img
                        class="enlarge-button"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAWlBMVEUAAACJiZiBhJKDhZWFiJWlpaWAg5OBhJOBg5KAhJKAhJOBhZWBg5OBhJSVmKWAg5KChJSSkpeBhJOBhJOBhJSBhZOBhJOChpSFhZWAhJOBhJOChZSAg5KUl6RY8yGOAAAAHHRSTlMAEcA5JgP1387F2UGPUbWrfgy7olx07Ukesp5iRCjhZAAAATFJREFUSMflVdl2hCAMBQRkGce9Tlv9/9+siZ4zynJKXtv7okAuuUkgsL8IPo3Cae3EOPEC80asF4jmF/PKrgFsxfJQjzWBh8qKH1aE6bzse+k7c4wHnrF3uNzK95RsccolGQr3rwPJVY0+UqpQv+CRX4FxJPKD9irhGRlxrizoSWrloMpG9Qq2eT4D52EFwW97GW/bZdCC2sAtbCJzBAmrd7kT1IvlCAwqON0I4z7T5QndvjxGIfg8wUdBOAghS8Ag3I2g95n+yOd2w5Hdfl/WZAJVUk0N2lDT+kUt3Df1aLyIh28gH2/iBTKKeEU9sQnohtZmsP8RGhnCvopbpZg1fD6a4maMwvCvpN17dP4ZyMo9KHZhJ05ZS/mTdcqaWRHesrRi5ZhBFIEAOTEL+5f4AfcQNF+GuUUUAAAAAElFTkSuQmCC"
                        alt="enlarge"
                      />
                    </div>
                  </div>

                  <!-- <el-popover
                    placement="bottom-end"
                    width="384"
                    trigger="click"
                    popper-class="popover"
                    ref="popover3"
                  >
                    <div class="setting-popover-content">
                      <div class="setting-header content_txt_1"></div>
                      <div class="setting-content" style="background: white">
                        <div>
                          <div class="setting-item">
                            <p class="label-name">语言选择</p>
                            <div class="options">
                              <div
                                class="option-button"
                                @click="setGame('lang', index)"
                                v-for="(item, index) in langList"
                                :key="index"
                                :class="index == langIndex ? 'active' : ''"
                              >
                                {{ item }}
                              </div>
                            </div>
                          </div>
                        </div>
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
                  </el-popover> -->
                </div>
              </div>
            </div>
            <img
              class="score-banner"
              @click="$router.push('/downLoad')"
              :src="ballBanner"
              alt="score-banner"
            />
            <!-- 列表 - 即时 -->
            <ul v-if="tabIndex == 0" class="football-score-container-header index0">
              <div
                class="width40 th_check"
                style="background: rgb(58, 48, 64); height: 100%"
                @click="setAllCheck1()"
              >
                <img
                  class="icon-check"
                  :src="
                    getImageUrl(
                      !allCheck ? '/static/images/check.png' : '/static/images/check1.png'
                    )
                  "
                />
              </div>
              <li class="width172 header_th">赛事</li>
              <li class="width32 header_th text-center">时间</li>
              <li class="width93 header_th football-all-status">状态</li>
              <li class="teamName-score width425 header_th">
                <div class="hostTeam">主队</div>
                <div class="vs width40 content_txt_bf"></div>
                <div class="guestTeam">客队</div>
              </li>
              <li class="variable width443 header_th">
                <div class="text-center">直播</div>
                <div class="width87 text-center">项目</div>
                <div class="text-center width76">操作</div>
              </li>
            </ul>
            <!-- 列表 - 赛果 -->
            <div v-if="tabIndex == 1">
              <div class="header-date-filter">
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
                    :picker-options="pickerBeginDateBefore"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    class="datePicker"
                    @change="change"
                    placeholder="选择日期"
                    :disabledDate="disableDates"
                  >
                  </el-date-picker>
                </div>
              </div>

              <ul class="football-score-container-header index1" style="border-radius: 0px">
                <li class="width172 header_th">赛事</li>
                <li class="width32 text-center header_th">时间</li>
                <li class="width93 football-all-status header_th">状态</li>
                <li class="teamName-score width425 header_th">
                  <div class="hostTeam">主队</div>
                  <div class="vs width60 content_txt_bf"></div>
                  <div class="guestTeam">客队</div>
                </li>
                <li class="variable width547 header_th">
                  <div class="width60 text-center">赛果</div>
                  <div class="match width80 text-center">项目</div>
                  <!-- <div class="match width50 text-center">预约</div> -->
                </li>
              </ul>
            </div>
            <!-- 列表 - 赛程 -->
            <div v-if="tabIndex == 2">
              <div class="header-date-filter">
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
                    :picker-options="pickerBeginDateBefore1"
                    ref="abc"
                    type="date"
                    v-model="time"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    class="datePicker"
                    @change="change"
                    placeholder="选择日期"
                    :disabledDate="disableDates"
                  >
                  </el-date-picker>
                </div>
              </div>
              <ul class="football-score-container-header index2" style="border-radius: 0px">
                <li class="width172 header_th">赛事</li>
                <li class="width32 text-center header_th">时间</li>
                <li class="width93 football-all-status header_th">状态</li>
                <li class="teamName-score width425 header_th">
                  <div class="hostTeam">主队</div>
                  <div class="vs width40 content_txt_bf"></div>
                  <div class="guestTeam">客队</div>
                </li>
                <li class="variable width547 header_th">
                  <div class="width65">直播</div>
                  <div class="match width87 text-center">项目</div>
                  <div class="match width56 text-center">操作</div>
                </li>
              </ul>
            </div>
            <!-- 列表 - 收藏 -->
            <ul v-if="tabIndex == 3" class="football-score-container-header index3">
              <li class="width172 header_th">赛事</li>
              <li class="width32 text-center header_th">时间</li>
              <li class="width93 football-all-status header_th">状态</li>
              <li class="teamName-score width420 header_th">
                <div class="hostTeam">主队</div>
                <div class="vs width40 content_txt_bf"></div>
                <div class="guestTeam">客队</div>
              </li>
              <li class="variable width443 header_th">
                <div class="text-center">直播</div>
                <div class="width87 text-center">项目</div>
                <div class="text-center width76">操作</div>
              </li>
            </ul>
          </div>
        </div>
        <!-- 即时/赛果/赛程/收藏 -->
        <div class="scrollbar_wrap">
          <!-- 即时 -->
          <gaming0
            :gameId="gameId"
            :itemHeight="60"
            :height="height"
            @getList="getList"
            @getFootList="getFootList"
            :lang="langIndex"
            :topShow="topShow"
            :list="list1"
            :id="id"
            @setTop="setTop"
            @getallNum="getallNum"
            :topList="topList"
            ref="gaming0"
            v-show="tabIndex == 0"
          >
          </gaming0>
          <!-- 赛果 -->
          <gaming1
            v-if="tabIndex == 1"
            ref="gaming1"
            :time="timeType"
            :id="id"
            :gameId="gameId"
            @getallNum="getallNum"
            @getMatchFilter="getCheckList"
            :lang="langIndex"
          >
          </gaming1>
          <!-- 赛程 -->
          <gaming2
            v-if="tabIndex == 2"
            ref="gaming2"
            :time="timeType"
            :id="id"
            :gameId="gameId"
            @getallNum="getallNum"
            @getMatchFilter="getCheckList"
            :checked="checked"
            :lang="langIndex"
          >
          </gaming2>
          <!-- 收藏 -->
          <gaming3
            v-if="tabIndex == 3"
            ref="gaming3"
            :itemHeight="60"
            :time="timeType"
            :id="id"
            :gameId="gameId"
            @getallNum="getallNum"
            :checked="checked"
            :lang="langIndex"
          >
          </gaming3>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import gaming0 from './gaming-0.vue'
import gaming1 from './gaming-1.vue'
import gaming2 from './gaming-2.vue'
import gaming3 from './gaming-3.vue'
import { getLiveScore } from '@/api/game.js'
import { collect } from '@/api/common.js'
import { GAME_MAP } from '@/utils'
import scorePageMixins from '@/mixins/scorePageMixins.js'
import { getImageUrl } from '@/utils/common.js'
import { myMIxins } from './ballMixins.js'
export default {
  name: 'GamingScore',
  components: {
    gaming0,
    gaming1,
    gaming2,
    gaming3
  },
  mixins: [scorePageMixins, myMIxins],
  data() {
    return {
      adCode: '014',
      timeInterval: null,
      objNum: {
        a: 0,
        b: 0,
        c: 0,
        d: 0
      },
      id: 2,
      dataList: [],
      dataList1: [],
      checked: false, //是否打开列表的欧赔指数
      selectId: 1, //选中完整热门
      selectLi: '完整', //选中的完整热门
      boxLi: '',
      time: '',
      bosList: [],
      typeTab: 0,
      timeType: {},
      langMask: false,
      loading: false,
      allCheck: false, //全选
      footballList: [],
      scrollHeight: '',
      langIndex: 0,
      checkIndex: 0,
      match_id: 0,
      topShow: true,
      isSearch: false,
      num0: 0, //搜索改变数量
      allNum: 0, //搜索总数
      inputValue: '', //搜索内容
      loadingMask: false, //加载
      langList: ['简体', '繁体', 'English'],
      tabIndex: 0, //
      status: 'competition_id', //赛事选中的状态
      countryList: [], //赛事选中列表
      maskIndex: null, //显示的弹窗
      dateTime: [], //时间列表
      timeIndex: 0, //时间下表
      gameList: [], //选中列表
      matchList: [],
      topList: [], //即时比.分置顶列表
      matchList1: [],
      allList: [], //总数组
      concealList: [], //选中的保留
      screen: {
        list: [],
        country: {},
        count_1: null,
        count_2: null,
        competition: {},
        count_country: null,
        count_competition: null
      }, //筛选对象competition-赛事；country-国家
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      pickerBeginDateBefore1: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      height: document.documentElement.clientHeight - 166 - 90,
      tabList: ['即时', '赛果', '赛程'],
      // legendList: ['进球', '点球', '点球射失', '乌龙球', '换人', '角球', '黄牌', '红牌', '两黄变红', '受伤离场', '动画', '视频'],
      gameId: '' // 所选的游戏类型ID
    }
  },

  mounted() {
    this.$store.state.type = 1
    this.resetParams()
    this.getList()
  },
  computed: {
    shouNum() {
      return this.$store.state.shouNum
    },
    infos() {
      return this.$store.state.user.infoData
    },
    game() {
      return this.$store.state.game
    },
    immediately() {
      return this.$store.state.immediately
    },
    list1() {
      // 状态：0-未开始，1-进行中，2-已结束，3-已取消,4-已删除
      // return this.dataList1.filter((item) => {
      //   return (
      //     this.concealList.indexOf(item.id) === -1 &&
      //     ((this.countryList.length > 0 && this.countryList.indexOf(item[this.status]) !== -1) ||
      //       this.countryList.length === 0)
      //   )
      // })
      return this.filterInvalidTitles(
        'gaming',
        this.dataList1.filter((item) => {
          return (
            (this.concealList.indexOf(item.id) === -1 &&
              this.countryList.includes(Number(item[this.status]))) ||
            this.titleIdList.includes(item.id)
          )
        }),
        this.topList || [],
        this.countryList || []
      )
    },
    game_filter() {
      return GAME_MAP.filter((item) => [1, 2, 3, 4].includes(item.gameId))
    },
    conceal_num() {
      return this.$store.state.concealNum
    }
  },
  created() {
    this.$store.state.loading = true
    // setTimeout(res => {
    // this.$store.state.loading = false
    // }, 3000)

    // this.height = (document.documentElement.clientHeight - 166) + 60

    // this.langIndex = Number(localStorage.getItem('langIndex')) || 0
  },
  watch: {
    // 监听赛事切换监听
    checkIndex(e) {
      if (e == 0) {
        this.screen.list = this.screen.competition
      } else {
        this.screen.list = this.screen.country
      }
    },
    langIndex(e) {
      this.langMask = false

      localStorage.setItem('langIndex', e)
    },
    langMask(e) {
      if (e) {
        this.maskIndex = null
      }
    },
    tabIndex(e) {
      this.resetParams()
      // 赛果
      if (e == 1) {
        this.get6Days(2)
        this.timeIndex = 5
        if (this.tabIndex == 0) {
          // this.$refs.gaming0.update()
        }
      } else if (e == 2) {
        // 赛程
        this.timeIndex = 0
        this.get6Days(1)
        this.timeType = this.dateTime[0] // 更新当前查询日期 , 取第一个
      } else if (e == 0) {
        this.scrollHeight = ''
        this.$store.state.concealNum = this.concealList.length
        this.getList() // 需要重新请求数据
      } else {
        this.scrollHeight = '600px'
      }
      console.log(this.dateTime)
      // 不加这个会造成首次进入赛果未带入当天日期
      // this.$nextTick(() => {
      //     this.getCheckList()
      // })
    },
    timeIndex(e) {
      if (e == null) {
        return
      }
      this.resetParams()
      this.timeType = this.dateTime[e]
    },
    listType1(e) {
      this.listType1 = e
    },
    inputValue(e) {
      this.$refs['gaming' + this.tabIndex].searchText(e)
    },
    gameId() {
      if (this.tabIndex === 0) this.getList('gameId')
      this.$store.state.concealNum = 0
    }
  },
  methods: {
    getImageUrl,
    // 重置参数
    resetParams() {
      this.checkIndex = 0 // 重置 赛事/国家地区tab
      this.$store.state.concealNum = 0 // 重置
    },
    // 获取搜索总数
    getallNum(allNum) {
      this.allNum = allNum
    },
    /* 全选 */
    setAllCheck1() {
      if (this.tabIndex == 0) {
        this.$refs.gaming0.setAllCheck1(this.allCheck)
        this.allCheck = !this.allCheck
      }
    },
    // 搜索
    search() {
      // this.$refs['football'+this.tabIndex].searchText(this.inputValue)
      let allNum = this.$refs['gaming' + this.tabIndex].searchText(this.inputValue)
      setTimeout((res) => {}, 1000)
      // this.allNum = allNum
    },

    // 滚动到搜索下一个
    // searchScroll(status) {
    //   let { num, i } = this.$refs['gaming0'].searchScroll(status)
    //   document.documentElement.scrollTop = num
    //   this.num0 = i
    // },
    // 清除搜查
    clearSearch() {
      this.inputValue = ''
      this.allNum = 0
      this.$refs['gaming' + this.tabIndex].clearSearch()
    },

    // 切换显示红牌 黄牌
    setGame(type, num) {
      if (type == 'voice' && num == 1) {
        this.$store.state.game[type] = true
      } else if (type == 'voice' && num == 2) {
        this.$store.state.game[type] = false
      } else if (type == 'lang') {
        this.langIndex = num
      } else {
        this.$store.state.game[type] = !this.$store.state.game[type]
      }
      this.$refs.popover3.hide()
      localStorage.setItem('gameSeting', JSON.stringify(this.$store.state.game))
    },

    // 申请主播
    applyFor() {
      if (Object.keys(this.infos).length === 0) return (this.$store.state.user.showLoginMask = true)
      if (this.infos.is_anchor == 1) {
        router.push({
          name: 'mySpace',
          state: {comp: 7}
        })
      } else {
        router.push({
          name: 'mySpace',
          state: {comp: 7}
        })
      }
    },

    // 隐藏
    conceal() {
      if (this.gameList.length == 0) return
      let arr = []
      this.dataList.forEach((item) => {
        if (item.id == undefined) return
        if (this.gameList.indexOf(item.id) !== -1) {
          arr.push(item.id)
        }
      })
      this.concealList = arr
      this.$store.state.concealNum = arr.length
      this.gameList.splice(0, this.gameList.length)
    },
    // 保留
    retain() {
      if (this.gameList.length == 0) return
      let arr = []
      this.dataList.forEach((item) => {
        if (item.id == undefined) return
        if (this.gameList.indexOf(item.id) == -1) {
          arr.push(item.id)
        }
      })
      this.$store.state.concealNum = arr.length
      this.concealList = arr
      this.gameList.splice(0, this.gameList.length)
    },
    /* 获取选中列表 */
    getFootList(e) {
      this.gameList = e
    },
    // 收藏
    collect() {
      if (!this.infos.id) {
        return this.$message.error('请登录后进行操作')
      }
      // this.$refs.gaming0.collect()
      if (this.gameList.length == 0) return
      let data = {
        match_ids: this.gameList.toString(),
        match_type: 4
      }
      collect(data)
        .then((res) => {
          this.getList()
          this.$message.success('操作成功')
          this.gameList.splice(0, this.gameList.length)
        })
        .catch((res) => {
          this.$message.error(res.msg || '操作失败')
          this.gameList.splice(0, this.gameList.length)
        })
    },
    // 取消隐藏
    cancelConceal() {
      this.concealList = []
      this.$store.state.concealNum = 0
      this.setAllCheck(true)
      this.setCheckList()
    },

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
        this.status = 'competition_id'
        this.countryList = list
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
        this.status = 'country_id'
        this.countryList = list
      }
      // this.$refs['football' + this.tabIndex].update()
      if (this.tabIndex == 0) {
        // 即时比分
        // this.$refs.gaming0.update()
        this.concealList = []
      } else {
        // 赛果赛程
        console.log(list)
        this.$refs['gaming' + this.tabIndex].screenList(list, this.status)
      }
      this.$store.state.concealNum = num
      this.getMaskShow(2)
      this.$nextTick(() => {
        // 返回顶部
        this.$refs['gaming' + this.tabIndex].$refs.scoreScroller.scrollToPosition(-250)
      })
    },
    // 全选 status=true/反选 status=false
    setAllCheck(status) {
      let checkedNum = 0
      if (this.checkIndex == 0) {
        let arr = this.screen.competition
        for (let i in arr) {
          arr[i].list.forEach((item) => {
            if (status) {
              item.check = status
              checkedNum += item.count
            } else {
              item.check = !item.check
              if (item.check) checkedNum += item.count
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
              checkedNum += item.count
            } else {
              item.check = !item.check
              if (item.check) checkedNum += item.count
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
        this.screen.count_2 += item.count
      }
      if (!item.check && this.checkIndex == 0) {
        this.screen.count_2 -= item.count
      }
      if (item.check && this.checkIndex == 1) {
        this.screen.count_1 += item.count
      }
      if (!item.check && this.checkIndex == 1) {
        this.screen.count_1 -= item.count
      }
    },

    // 调用筛选
    getCheckList(dataList) {
      if (!dataList?.length) dataList = []
      let competitionList = []
      let projectList = []
      // 向足球的筛选逻辑兼容
      dataList.forEach((item) => {
        let idx = competitionList.findIndex((it) => it.id === item.series_id)
        let p_idx = projectList.findIndex((it) => it.id === item.game_id)
        if (idx > -1) {
          competitionList[idx].count++
        } else {
          competitionList.push({
            check: true,
            competition_id: item.series_id,
            count: 1,
            id: item.series_id,
            name: item.short_name_zh
          })
        }
        if (p_idx > -1) {
          projectList[p_idx].count++
        } else {
          projectList.push({
            check: true,
            competition_id: item.game_id,
            count: 1,
            id: item.game_id,
            name: item.game_name
          })
        }
      })
      let dataObj = {
        competition: [
          {
            list: competitionList,
            name: ''
          }
        ],
        country: [
          {
            list: projectList,
            name: ''
          }
        ],
        count_competition: dataList.length,
        count_competition_check: dataList.length,
        count_2: dataList.length,
        count_1: dataList.length,
        count_country: dataList.length,
        count_country_check: dataList.length
      }
      dataObj.list = dataObj.competition
      this.screen = dataObj

      let list = []
      dataObj.competition.forEach((item1) => {
        item1.list.forEach((item) => {
          if (item.check) {
            list.push(item.id)
          }
        })
      })
      list.push(1000000)
      this.countryList = list
      this.status = 'competition_id'
      if (this.tabIndex != 0) {
        this.$refs['gaming' + this.tabIndex].screenList(list, 'competition_id')
      }
    },

    addEvent() {
      //监听是否有网络
      if (!navigator.onLine) {
        this.onLine = true
        this.$message.error('当前网络不可用')
        return
      } else {
        this.$message.success('网络连接正常!')
      }
    },

    getScroll(event) {
      // 滚动条距离底部的距离scrollBottom
      let scrollBottom =
        event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight
      // if (this.finished && scrollBottom < 40) {
      //  操作
      // }
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
      if (type == 1) {
        //
        this.matchList = [
          {
            name: '完整',
            id: 0
          },
          {
            name: '热门',
            id: 1
          }
        ]
      }
    },
    // 修改三个状态高度
    setTypeTab(num) {
      document.documentElement.scrollTop = num - 165
    },
    // 切换高度
    setTab(type) {
      this.typeTab = type
      this.$nextTick(() => {})
    },
    setTab1(e) {
      this.typeTab = e
    },

    // 获取足球数组
    // 选中的日期
    change(e) {
      let data = {
        day: e
      }

      this.timeType = data
      this.timeIndex = null
    },

    /* 设置置顶 */
    setTop(item) {
      this.setArr(this.dataList1, 2)
    },

    // 获取列表
    getList(flag) {
      let data = {
        type: 4,
        isWeb: 1
      }
      this.$store.state.loading = true
      getLiveScore({
        game_id: this.gameId // 游戏类型id 不传则获取全部
        // series_id: '', // 比赛id,查询时用
      })
        .then((res) => {
          this.$store.state.loading = false
          res.data.data = res.data // 兼容以前的有分页的结构
          this.allList = res.data.data
          this.setArr(res.data.data, 1)
          // this.$store.state.concealNum = 0
          if (flag === 'gameId') {
            // 重置筛选
            this.cancelConceal()
          }
          this.$nextTick(() => {
            this.getCheckList(this.allList)
          })
        })
        .catch((res) => {
          this.$store.state.loading = false
        })
    },

    /* 重组数组 */
    setArr(data, type) {
      // return
      this.list = []
      let list1 = [] // 进行中
      let list2 = [] // 未开始
      let list3 = [] // 完场
      let list5 = [] // 异常
      let arr = []
      data.forEach((obj) => {
        let obj1
        if (obj.match_time) {
          obj1 = {
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
            },
            // 兼容足球的结构
            status_sort: obj.status,
            status: obj.status_id,
            status_str: obj.status_name,
            time: obj.match_times,
            country_id: obj.game_id,
            competition_id: obj.series_id,
            competition_name_en: obj.short_name_en,
            competition_name_zh: obj.short_name_zh,
            competition_name_zht: obj.short_name_zht,
            away_score: obj.away_team_data.score,
            away_team_log: obj.away_team_data.logo,
            away_team_logo: obj.away_team_data.logo,
            away_team_name: obj.away_team_data.name_zh,
            away_team_name_en: obj.away_team_data.name_en,
            away_team_name_zh: obj.away_team_data.name_zh,
            away_team_name_zht: obj.away_team_data.name_zht,
            home_score: obj.home_team_data.score,
            home_team_log: obj.home_team_data.logo,
            home_team_logo: obj.home_team_data.logo,
            home_team_name: obj.home_team_data.name_zh,
            home_team_name_en: obj.home_team_data.name_en,
            home_team_name_zh: obj.home_team_data.name_zh,
            home_team_name_zht: obj.home_team_data.name_zht,
            id: obj.match_id
          }
          obj = Object.assign(obj, obj1)
        }

        // console.log('todo:dev // setArr obj1', obj1,' ------ ', obj)
        if (this.getMatchStatusType('gaming', obj) === 3) {
          //完场
          obj.type = 3
          list3.push(obj)
        } else if (this.getMatchStatusType('gaming', obj) === 1) {
          //进行中
          obj.type = 1
          list1.push(obj)
        } else if (this.getMatchStatusType('gaming', obj) === 2) {
          //未开始
          obj.type = 2
          list2.push(obj)
        } else if (this.getMatchStatusType('gaming', obj) === 5) {
          //异常（已删除）
          obj.type = 4
          list5.push(obj)
        } else {
          obj.type = 5
        }
        arr.push(obj.match_id)
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
      /* 处理置顶思路
        1.判断列表长度
        2.将列表数据筛选
        3.在原来的数组中添加
        */
      let topList = JSON.parse(localStorage.getItem('topList2')) || []

      this.topList = topList
      /* 判断是否为空 */

      /*
        空：增加标题和选中的数据
        非：增加选中的数据
        第一次进入：获取缓存，渲染列表
				 */
      let visibleTopList = arrList.filter((item) => {
        // screenListT有延迟
        return (
          topList.indexOf(item.id) !== -1 &&
          this.concealList.indexOf(item.id) === -1 &&
          (this.countryList.indexOf(Number(item[this.status])) != -1 || !this.countryList.length)
        )
      })

      if (visibleTopList.length != 0) {
        // let newTopList = []
        let a = arrList.filter((item, index) => {
          return topList.indexOf(item.id) !== -1
        })
        let b = arrList.filter((item, index) => {
          return topList.indexOf(item.id) == -1
        })
        arrList = [...a, ...b]
        arrList.splice(0, 0, {
          typeTitle: 4,
          competition_id: 1000000,
          country_id: 1000000,
          competition_name_zh: '置顶',
          id: 1000009,
          imgUrl: getImageUrl('/static/images/main-beigin.png')
        })
      }

      this.dataList = arrList
      this.dataList1 = arrList

      // })
    },

    // 获取数量
    getNumber(e) {
      this.objNum = e
    },

    getShow() {
      this.$refs.abc.focus()
    },
    //获取六天数据
    get6Days(type) {
      //type==1前,2后
      //获取系统当前时间
      var now = new Date()
      var nowTime = now.getTime()
      var oneDayTime = 24 * 60 * 60 * 1000
      let arr = []
      for (var i = 0; i < 6; i++) {
        let ShowTime
        //显示周一
        if (type == 1) {
          ShowTime = nowTime + i * oneDayTime
        } else {
          ShowTime = nowTime - i * oneDayTime
        }

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
  },
  beforeUnmount() {
    window.clearInterval(this.timeInterval)
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/liveScore.scss';

.datePicker {
  position: absolute;
  top: 0;
  left: -50px;
  z-index: -1;
  /* visibility: hidden; */
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
/* 电竞Score页 */
#ScoreBoard.score_gaming {
  /* 侧边栏 */
  .score-left-nav-filter-wrap {
    left: -62px;
  }
  .score_left_nav_filter_wrap {
    position: absolute;
    left: -67px;
    top: 305px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 60px;
    .item {
      font-size: 12px;
      text-align: center;
      padding: 5px 0;
      background: #fff;
      margin-bottom: 7px;
      color: #949bb1;
      border-radius: 15px;
      cursor: pointer;
      border: 1px solid #fff;
      &:hover {
        color: var(--el-color-primary);
        border-color: var(--el-color-primary);
      }
      &.active,
      &.active:hover {
        background: var(--el-color-primary);
        color: #fff;
        border-color: var(--el-color-primary);
      }
    }
  }
  /* 电竞Score列表 - 头部 */
  .football-score-container-header {
    &.index0,
    &.index1,
    &.index2,
    &.index3 {
      /* 赛果 */
      .header_th {
        &:nth-of-type(1) {
          width: 170px;
        }
        &:nth-of-type(2) {
          width: 60px;
        }
        &:nth-of-type(3) {
          width: 90px;
        }
        &:nth-of-type(4) {
          width: 570px;
          &.teamName-score {
            .hostTeam {
              width: 250px;
            }
            .guestTeam {
              width: 250px;
            }
            .vs {
              width: 70px;
            }
          }
        }
        &:nth-of-type(5) {
          width: 310px;
          justify-content: space-around;
          & > div {
            width: auto;
            &:nth-of-type(1) {
              width: 80px;
              text-align: center;
            }
            &:nth-of-type(2) {
              width: 150px;
            }
            &:nth-of-type(3) {
              width: 80px;
            }
          }
        }
      }
      .th_check {
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    &.index0 {
      .header_th {
        &:nth-of-type(4) {
          width: 480px;
          &.teamName-score {
            .hostTeam {
              width: 230px;
            }
            .guestTeam {
              width: 230px;
            }
          }
        }
        &:nth-of-type(5) {
          width: 360px;
          justify-content: flex-end;
        }
      }
    }
  }

  /* 电竞Score列表 - 内容 */
  /***** 赛果 */
  .flag_score_gaming_0,
  .flag_score_gaming_1,
  .flag_score_gaming_2,
  .flag_score_gaming_3 {
    .score_item_td {
      margin: 0;
      height: 100%;
      &:nth-of-type(1) {
        width: 170px;
      }
      &:nth-of-type(2) {
        width: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &:nth-of-type(3) {
        width: 90px;
      }
      &:nth-of-type(4) {
        width: 570px;
        &.teamName-and-vs {
          .host-container {
            width: 250px;
          }
          .guest-container {
            width: 250px;
          }
          .vs {
            width: 70px;
          }
        }
      }
      &:nth-of-type(5) {
        width: 310px;
        display: flex;
        justify-content: space-around;
        & > div {
          width: auto;
          &:nth-of-type(1) {
            width: 80px;
            border-right: 1px solid #dfe6f0;
            display: flex;
            align-items: center;
            justify-content: center;
            div {
              width: auto;
            }
          }
          &:nth-of-type(2) {
            width: 150px;
            justify-content: space-evenly;
          }
          &:nth-of-type(3) {
            width: 80px;
          }
        }
      }
      &.match-field {
        .competition_wrap {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          margin-left: 5px;
        }
        .league-name {
          margin-left: 0;
        }
        .competition_system {
          font-size: 12px;
          color: #9197ad;
        }
      }
      .project {
        justify-content: center !important;
        img {
          width: 35px;
          margin-right: 6px;
        }
      }
    }
    .td_check {
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .flag_score_gaming_0 {
    .score_item_td {
      &:nth-of-type(4) {
        width: 480px;
        &.teamName-and-vs {
          .host-container {
            width: 230px;
          }
          .guest-container {
            width: 230px;
          }
        }
      }
      &:nth-of-type(5) {
        width: 360px;
        justify-content: flex-end;
      }
    }
  }

  .point-animation {
    color: #ff4343;
    &::after {
      display: none;
    }
  }
}

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
    &.score_football,
    &.score_gaming {
      .score-container-main {
        padding-top: 166px;
        &.tabIndex2 {
          padding-top: 226px;
        }
      }
    }
  }
}
</style>
