<template>
  <div>
    <!-- 赛果 -->
    <section
      class="container-section flag_score_gaming_1"
      id="finished"
      style="box-shadow: rgb(238, 238, 238) 0px 1px 0px 0px inset"
      v-loading="$store.state.loading"
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
            <li
              :data-id="item.id"
              class="football-score-item"
              :key="item.id"
              :data-index="index"
              :style="{ marginBottom: item.note ? '31px' : '' }"
            >
              <div
                class="football-score-item-add-time immediate score_item_td"
                style="position: absolute; bottom: -32px; left: 0"
                v-if="item.note"
              >
                <div class="desc-wrap">
                  <div class="desc">
                    {{ item.note }}
                  </div>
                </div>
              </div>
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
              <div class="match-status width93 football-all-status margin-right-20 score_item_td">
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
                <div class="vs width42" ref="bbb2">
                  <span
                    :style="{
                      color:
                        item.home_score > item.away_score
                          ? 'rgb(255, 67, 67)'
                          : 'rgb(145, 151, 173)'
                    }"
                    >{{ item.home_score }}</span
                  ><span data-a="6" data-b="0" style="color: rgb(145, 151, 173)">-</span
                  ><span
                    :style="{
                      color:
                        item.home_score < item.away_score
                          ? 'rgb(255, 67, 67)'
                          : 'rgb(145, 151, 173)'
                    }"
                    >{{ item.away_score }}</span
                  >
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
                <div class="model-one width417">
                  <div
                    class="width60 text-center color-ff4343"
                    v-if="item.home_score > item.away_score"
                  >
                    主胜
                  </div>
                  <div
                    class="width60 text-center color-3eba61"
                    v-else-if="item.home_score < item.away_score"
                  >
                    客胜
                  </div>
                  <div
                    class="width60 text-center color-9197ad"
                    v-else-if="item.home_score == item.away_score"
                  >
                    平
                  </div>
                </div>
                <div class="data width87 project">
                  <img :src="gameLogoHandler(item.game_id)" />
                  <span>{{ item.game_name }}</span>
                </div>
                <!-- <div class="match width52">
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
                </div> -->
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
import { getfootballDetail } from '@/api/football.js'
import { getResults } from '@/api/game.js'
import { collect } from '../../api/common.js'
import { gameLogoHandler } from '@/utils'
import { getImageUrl } from '@/utils/common.js'

export default {
  name: 'GamingScore1',
  components: {},
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
    gameId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      top: '',
      left: '',
      page: 1,
      list1: [],
      tlive: {}, //详情
      // loading:false,
      dataMask: false,
      loadStatus: 'more',
      tliveLoading: false,
      screenListT: [],
      screenStatus: 'competition_id',
      scrollTopOld: 0
    }
  },
  watch: {
    time(e) {
      this.page = 1
      this.list1 = []
      this.getAllData()
      // this.get list();
    },
    gameId(e) {
      this.getlist()
    }
  },
  computed: {
    list() {
      return this.list1.filter((item) => {
        return (
          this.screenListT.length == 0 || this.screenListT.indexOf(item[this.screenStatus]) != -1
        )
      })
    },
    // 显示红黄牌
    game() {
      return this.$store.state.game
    }
  },
  created() {},
  mounted() {
    this.getlist()
  },
  methods: {
    getImageUrl,
    async getAllData() {
      // const res = await this.$emit('get MatchFilter');
      this.getlist()
    },
    // 筛选列表
    screenList(list, status) {
      console.log(list)
      // todo: 待跟jason对接筛选的接口,暂时先隐藏
      this.screenListT = list
      this.screenStatus = status
    },
    // 技术统计对比
    num(num1, num2) {
      if (num1 == 0 && num2 == 0) {
        return 0
      } else if (num1 == num2 && num1 != 0 && num2 != 0) {
        return 50
      } else {
        // console.log(num2 / (num1 + num2))
        return (num1 / (num1 + num2)) * 100
      }
    },
    mouseenter(e, type, item) {
      this.getDetail(item)
    },
    currentChange(e) {
      this.getlist(e)
    },
    // 时间戳转时间
    timeStamp: function (value) {
      var date = new Date(value * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var hour = ('0' + date.getHours()).slice(-2)
      var minute = ('0' + date.getMinutes()).slice(-2)
      // 拼接
      var result = hour + ':' + minute
      // 返回
      return result
    },
    // 移除列表
    mousemove() {
      this.dataMask = false
    },
    // 获取总进球数
    getAll(num1, num2, num3) {
      if (num1 + num2 > Number(num3)) {
        return '大'
      } else if (num1 + num2 < Number(num3)) {
        return '小'
      } else {
        return '走'
      }
    },
    // 调用详情
    getDetail(item) {
      // return
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
      getResults(data)
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
</style>
