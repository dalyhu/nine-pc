<template>
  <div class="flag_score_gaming_2">
    <!-- 赛程 -->
    <section
      class="container-section"
      id="uncoming-f-2"
      v-loading="$store.state.loading"
      style="box-shadow: rgb(238, 238, 238) 0px 1px 0px 0px inset"
    >
      <ul v-if="list.length > 0">
        <RecycleScroller
          ref="scoreScroller"
          class="scroller"
          :items="list"
          item-class="score_list_item"
          key-field="id"
          page-mode
          :item-size="60"
        >
          <template v-slot="{ item, index }">
            <li class="football-score-item" :key="item.id" :data-index="index">
              <div class="match-field width172 score_item_td">
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
              <div class="time width32 text-center score_item_td">{{ timeStamp(item.time) }}</div>
              <div class="match-status width93 football-all-status score_item_td">
                <span>{{ item.status_str }}</span>
              </div>
              <div class="teamName-and-vs football-score-item-teamRank width420 score_item_td">
                <div class="team-info host-container width189">
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
                <div class="vs width42" ref="bbb">
                  <span style="color: rgb(255, 67, 67)"></span
                  ><span data-a="0" data-b="0" style="color: rgb(145, 151, 173)">-</span
                  ><span style="color: rgb(255, 67, 67)"></span>
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
                </div>
              </div>
              <div class="variable width547 score_item_td">
                <div class="live width65">
                  <div class="live">
                    <div class="football-score-item-live">
                      <div
                        class="right"
                        v-if="
                          item.anchor_live && item.anchor_live.length > 0 && item.anchor_live[0].id
                        "
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
                <div class="match width52">
                  <div class="match width56">
                    <div class="football-score-item-operation">
                      <img
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
                    </div>
                  </div>
                </div>
                <!-- </div> -->
              </div>
            </li>
          </template>
        </RecycleScroller>
      </ul>
      <div v-else class="common-empty-view">
        <DfEmpty description="暂无数据" />
      </div>
    </section>
  </div>
</template>

<script>
import { footballOddsList } from '@/api/football.js'
import { getSchedule } from '@/api/game.js'
import { collect } from '../../api/common.js'
import { gameLogoHandler } from '@/utils'
import { getImageUrl } from '@/utils/common.js'

export default {
  name: 'GamingScore2',
  props: {
    time: {
      type: Object,
      default: () => {}
    },
    lang: {
      type: Number,
      default: 0
    },
    id: {
      type: Number,
      default: null
    },
    checked: {
      type: Boolean,
      default: false
    },
    gameId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      page: 1,
      tlive: {},
      list1: [],
      exponent: {},
      OddsList: {},
      expIndex: {},
      dataMask: false,
      // loading: false,
      fightMask: false,
      loadStatus: 'more',
      screenListT: [],
      screenStatus: 'competition_id'
    }
  },
  watch: {
    time(e) {
      this.page = 1
      this.list = []
      // this.getlist();
      this.getAllData()
    },
    id(e) {
      this.getlist()
    },
    gameId(e) {
      this.getlist()
    }
  },
  computed: {
    list: {
      get() {
        return this.list1.filter((item) => {
          return !this.screenListT.length || this.screenListT.indexOf(item[this.screenStatus]) != -1
        })
      },
      set(v) {
        this.list1 = v
      }
    },
    immediately() {
      return this.$store.state.immediately
    }
  },
  created() {},
  mounted() {
    this.getlist()
  },
  methods: {
    getImageUrl,
    async getAllData() {
      this.getlist()
    },
    // 筛选列表
    screenList(list, status) {
      this.screenListT = list
      this.screenStatus = status
    },
    mouseenter(e, type, item) {
      let left, top
      if (type == 1) {
        this.fightMask = true
        this.exponent = item
        this.expIndex = item.exponent
        top = this.$refs.sss1[e].getBoundingClientRect().top - 194 + 'px'
        left = this.$refs.sss1[e].getBoundingClientRect().left - 157 + 'px'
      } else {
        this.fightMask = false
        this.dataMask = true
        console.log(this.fightMask)
        this.tlive = item
        top = this.$refs.bbb[e].getBoundingClientRect().top + 'px'
        left = this.$refs.bbb[e].getBoundingClientRect().left + 50 + 'px'
      }
      if (this.top == this.$refs.bbb[e].getBoundingClientRect().top + 'px') {
        //判断重复问题
        return
      }
      this.top = top
      this.left = left
    },
    // 收藏
    setCollect(item) {
      if (!this.$store.state.user.infoData.id) {
        return this.$message.error('请登录后进行操作')
      }
      let data = {
        match_ids: item.id,
        match_type: 4
      }
      console.log(data)
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
    getlist(page) {
      let data = {
        game_id: this.gameId, // 游戏类型id 不传则获取全部
        // page: this.page,
        time: this.time.day
        // limit: 20,
      }
      this.$store.state.loading = true
      getSchedule(data)
        .then((res) => {
          if (res.data?.data?.length) {
            res.data.data = res.data.data.map((obj) => {
              return {
                ...obj,
                // 兼容足球的结构
                status_sort: obj.status,
                status: obj.status_id,
                status_str: obj.status_name,
                time: obj.match_times,
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
            })
          }
          this.list1 = res.data.data
          this.$emit('getMatchFilter', this.list1)
          this.$store.state.loading = false
        })
        .catch((res) => {
          this.$store.state.loading = false
        })
    },
    // 指数弹窗详情
    footballOddsList(type) {
      let company_id = this.id
      footballOddsList({
        id: type.id
      })
        .then((res) => {
          let r = res.data
          // asia让球（亚盘） eu欧赔 bs总分（大小球）
          let data = {
            asia: {},
            eu: {},
            bs: {}
          }
          let arr = ['asia', 'eu', 'bs']
          arr.forEach((item, index) => {
            console.log(r.arr[index])
            r.arr[index].forEach((item1) => {
              console.log(item1)
              if (item1.company_id === company_id) {
                data[index] = item1
              }
            })
          })
          this.dataMask = true
          console.log(data)
          this.OddsList = data
        })
        .catch((res) => {})
    },
    // 移除列表
    mousemove() {
      this.dataMask = false
      this.fightMask = false
    },
    // 时间戳转时间
    timeStamp: function (value) {
      var date = new Date(value * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var year = date.getFullYear()
      var month = ('0' + (date.getMonth() + 1)).slice(-2)
      var sdate = ('0' + date.getDate()).slice(-2)
      var hour = ('0' + date.getHours()).slice(-2)
      var minute = ('0' + date.getMinutes()).slice(-2)
      var second = ('0' + date.getSeconds()).slice(-2)
      var result = hour + ':' + minute //+ ":" + second;
      return result
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
        setTimeout((res) => {
          this.$emit('getallNum', document.querySelectorAll('.highlight').length)
        }, 2000)
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
    gameLogoHandler(gameId) {
      return gameLogoHandler(gameId)
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/liveScore.scss';
.football-score-height-60 {
  height: 60px !important;
}
</style>
