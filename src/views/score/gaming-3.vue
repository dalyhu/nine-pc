<!-- 收藏 -->
<template>
  <article class="football-score-container flag_score_gaming_3">
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
            <li class="football-score-item" :data-index="index" v-else>
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
              <div class="time width32 text-center score_item_td">
                {{ $common.timeStamp(item.time) }}
              </div>
              <div class="match-status width93 football-all-status score_item_td">
                <span :class="{ 'point-animation': item.status === 1 }">{{ item.status_str }}</span>
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
                <div class="vs width42">
                  <span style="color: rgb(255, 67, 67)">{{ item.home_score }}</span
                  ><span data-a="0" data-b="2" style="color: rgb(255, 67, 67)">-</span
                  ><span style="color: rgb(255, 67, 67)">{{ item.away_score }}</span>
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
              <div class="variable width554 score_item_td">
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
                <div class="data width87 project">
                  <img :src="gameLogoHandler(item.game_id)" />
                  <span>{{ item.game_name }}</span>
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
            </li>
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
import { getCollect } from '@/api/game.js'
import { collect } from '@/api/common.js'
import { gameLogoHandler } from '@/utils'
import { getImageUrl } from '@/utils/common.js'
import { cloneDeep } from 'lodash-es'

export default {
  name: 'GamingScore3',
  props: {
    id: {
      type: Number,
      default: null
    },
    lang: {
      type: Number,
      default: 0
    },
    checked: {
      type: Boolean,
      default: false
    },
    itemHeight: {
      type: Number,
      default: 45
    },
    gameId: {
      type: [Number, String],
      default: ''
    }
  },
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
      dataMask: false, //数据弹窗
      list: [],
      visibleData: []
    }
  },
  watch: {
    id(e) {
      this.list1 = []
      this.list2 = []
      this.list3 = []
      this.getlist()
    },
    gameId(e) {
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
  methods: {
    getImageUrl,
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
    getlist() {
      getCollect({
        game_id: this.gameId, // 游戏类型id 不传则获取全部
        // page: this.page,
        time: ''
        // limit: 20,
      })
        .then((res) => {
          if (res.data?.length) {
            res.data = res.data.map((obj) => {
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
            this.setArr(res.data)
          }
          // this.list = res.data.data
          // 未开始
          this.list2 = res.data.filter((obj) => {
            return obj.status == 0
          })
          // 已完场
          this.list3 = res.data.filter((obj) => {
            return obj.status == 2 || obj.status == 3
          })
          // 进行中
          this.list1 = res.data.filter((obj) => {
            return obj.status == 1
          })
        })
        .catch((res) => {})
    },
    // 收藏
    setCollect(item) {
      let data = {
        match_ids: item.id,
        match_type: 4
      }
      collect(data)
        .then((res) => {
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
          this.$message.error(res.msg || '操作失败')
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
      // list1, list2, list3,
      _this.list.forEach((item, index) => {
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
    },
    updateVisibleData(data) {
      this.visibleData = data
    },
    virtualListUpdate(startIndex, endIndex, visibleStartIndex, visibleEndIndex) {
      let data = this.list.slice(visibleStartIndex, visibleEndIndex)
      this.updateVisibleData(data)
    },
    /* 重组数组 */
    setArr(data, type) {
      // 状态：0-未开始，1-进行中，2-已结束，3-已取消,4-已删除
      this.list = []
      let list1 = [] // 进行中
      let list2 = [] // 未开始
      let list3 = [] // 完场
      let list5 = [] // 异常
      data.forEach((item) => {
        // 进行中
        if (item.status_id == 1) {
          item.type = '进行中'
          list1.push(item)
        } else if (item.status_id == 0) {
          // 未开始
          item.type = '未开始'
          list2.push(item)
        } else if (item.status_id == 2) {
          // 已结束
          item.type = '已结束'
          list3.push(item)
        } else {
          // 异常
          item.type = '异常'
          list5.push(item)
        }
      })
      this.lock = false
      let arrList = this.list.concat(list1).concat(list2).concat(list3).concat(list5)
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
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/liveScore.scss';
.logo-title {
  width: 20px;
  height: 20px;
  margin-right: 6px;
}
</style>
