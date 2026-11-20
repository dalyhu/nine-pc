<template>
  <div style="height: 100%">
    <section
      class="container-section flag_score_basketball_0"
      ref="complete1"
      id="going"
      style="margin-bottom: 10px; box-shadow: rgb(238, 238, 238) 0px 1px 0px 0px inset"
    >
      <ul>
        <RecycleScroller
          ref="scoreScroller"
          class="scroller"
          :items="list"
          item-class="score_list_item"
          key-field="id"
          page-mode
          :item-size="108"
          :emit-update="true"
          @update="virtualListUpdate"
        >
          <template v-slot="{ item, index }">
            <div class="basketball-score-item" v-if="item.imgUrl">
              <div class="title" style="display: flex">
                <div class="con">
                  <img alt="b" :src="item.imgUrl" class="icon" @error="item.imgUrl = '/avatar.png'" />
                  <div class="container-section-field">{{ item.competition_name_zh }}</div>
                </div>
              </div>
            </div>
            <div
              class="basketball-score-item"
              :data-index="index"
              :data-id="item.id"
              :ref="item.id"
              style="display: flex"
              v-else
            >
              <ul class="header">
                <li class="width88 text-center">
                  <div
                    class="baseball-league-name-container false"
                    style="background-color: rgb(118, 145, 111)"
                  >
                    <div class="league-name ellipsis" :style="{ background: item.primary_color }">
                      {{
                        lang == 1
                          ? item.short_name_zht
                          : lang == 2
                          ? item.short_name_en
                          : item.short_name_zh
                      }}
                    </div>
                  </div>
                </li>
                <li class="width160 time-status">
                  <div class="basketball-score-item-header-timeStatus">
                    <span class="color-bc8c5a">{{ item.status_name }} {{ item.time_left }}</span>
                  </div>
                </li>
                <li class="width236 modal-session">
                  <div class="width45 text-center">1</div>
                  <div class="width45 text-center">2</div>
                  <div class="width45 text-center">3</div>
                  <div class="width45 text-center">4</div>
                  <div class="width56 text-center">OT</div>
                </li>
                <li class="width347 modal-score">
                  <div class="width57 text-center">全场</div>
                  <div class="width57 text-center">上下</div>
                  <div class="width57 text-center">分差</div>
                  <div class="width57 text-center">总分</div>
                  <div class="width57 text-center">直播</div>
                  <div class="width62 text-center">欧指</div>
                </li>
                <li class="width121 text-center">亚盘</li>
                <li class="width124 text-center">大小球</li>
                <li class="width80 text-center">数据</li>
                <li class="operation text-center" style="flex: 1 1 0%">功能</li>
              </ul>
              <ul class="basketball-score-item-body">
                <li class="gou-time width88">
                  <div class="gou" @click="setId(item)">
                    <img
                      class="checkbox-icon"
                      :src="
                        getImageUrl(
                          basketList.indexOf(item.id) == -1
                            ? '/static/images/check.png'
                            : '/static/images/check1.png'
                        )
                      "
                    />
                  </div>
                  <div class="time">
                    <div class="time-down">{{ item.match_time }}</div>
                  </div>
                </li>
                <li class="width160 team-name">
                  <div class="name ellipsis search-by-team-name border-bottom-dfe6f0">
                    <img
                      class="team-logo"
                      :src="item.home_team_data.logo"
                      width="48"
                      height="48"
                      @error="item.home_team_data.logo = '/avatar.png'"
                    /><span class="name-span ellipsis">{{
                      lang == 1
                        ? item.home_team_data.short_name_zht
                        : lang == 2
                        ? item.home_team_data.short_name_en
                        : item.home_team_data.short_name_zh
                    }}</span>
                    <div class="rank"></div>
                  </div>
                  <div class="name ellipsis search-by-team-name">
                    <img
                      class="team-logo"
                      :src="item.away_team_data.logo"
                      width="48"
                      height="48"
                      @error="item.away_team_data.logo = '/avatar.png'"
                    /><span class="name-span ellipsis">{{
                      lang == 1
                        ? item.away_team_data.short_name_zht
                        : lang == 2
                        ? item.away_team_data.short_name_en
                        : item.away_team_data.short_name_zh
                    }}</span>
                    <div class="rank"></div>
                  </div>
                </li>
                <li class="quarter-section width236">
                  <div
                    class="op width45 text-center"
                    v-for="(item2, index2) in item.home_scores"
                    :key="index2"
                  >
                    <div class="border-bottom-dfe6f0 color-333">{{ item2 }}</div>
                    <div>{{ item.away_scores[index2] }}</div>
                  </div>
                </li>
                <li class="score-section">
                  <div class="score-item quanchang width57">
                    <div class="border-bottom-dfe6f0" :class="item.red_bg == 2 ? 'red-bg' : ''">
                      <span>{{ item.home_scores_total }}</span>
                    </div>
                    <div :class="item.red_bg == 3 ? 'red-bg' : ''">
                      <span>{{ item.away_scores_total }}</span>
                    </div>
                  </div>
                  <div class="score-item shangxia width57">
                    <div class="border-bottom-dfe6f0">
                      {{ item.home_top_half }}/{{ item.home_lower_half }}
                    </div>
                    <div>{{ item.away_top_half }}/{{ item.away_lower_half }}</div>
                  </div>
                  <div class="score-item width57">
                    <div class="color-9197ad border-bottom-dfe6f0">
                      <span style="margin-right: 5px">全</span>{{ item.audience_score_gap }}
                    </div>
                    <div class="color-333">
                      <span class="color-9197ad">半{{ item.halftime_score_gap }}</span>
                    </div>
                  </div>
                  <div class="score-item width57">
                    <div class="border-bottom-dfe6f0 border-right-dfe6f0">
                      <span style="margin-right: 5px">全</span>{{ item.total_score }}
                    </div>
                    <div class="color-333 border-right-dfe6f0">
                      <span class="color-9197ad">半{{ item.total_half_time }}</span>
                    </div>
                  </div>
                  <div class="score-item live width57 score-item-01">
                    <div class="basketball-score-item-live">
                      <div class="right" v-if="item.anchor_live.length > 0">
                        <router-link
                          target="_self"
                          :to="'/live?router=basket&uid=' + item.anchor_live[0].id"
                        >
                          <img
                            class="live-anchor"
                            :src="item.anchor_live[0].avatar"
                            width="36"
                            height="36"
                            @error="item.anchor_live[0].avatar = '/avatar.png'"
                          />
                        </router-link>
                      </div>
                    </div>
                  </div>
                  <div v-if="item.eu1" class="ouzhi width62">
                    <div
                      class="border-bottom-dfe6f0"
                      :class="item.eu1?.host == 2 ? 'red' : item.eu1?.host == 3 ? 'green' : ''"
                    >
                      <div class="num">{{ item?.eu?.host }}</div>
                      <div class="arrow"></div>
                    </div>
                    <div
                      class="down"
                      :class="item.eu1?.guest == 2 ? 'red' : item.eu1?.guest == 3 ? 'green' : ''"
                    >
                      <div class="num">{{ item.eu?.guest }}</div>
                      <div class="arrow"></div>
                    </div>
                  </div>
                </li>
                <li v-if="item.asia1" class="rangfen width121">
                  <div class="top-wrap border-bottom-dfe6f0">
                    <div class="data-wrap"></div>
                    <div class="up">
                      <div class="color-9197ad">主</div>
                      <div
                        class="num"
                        :class="
                          item.asia1?.host == 2 ? 'red' : item.asia1?.host == 3 ? 'green' : ''
                        "
                      >
                        <div>{{ item.asia?.host }}</div>
                        <div class="arrow"></div>
                      </div>
                    </div>
                  </div>
                  <div class="down-wrap">
                    <div
                      class="data-wrap"
                      :class="
                        item.asia1?.early == 2
                          ? 'red-bg red'
                          : item.asia1?.early == 3
                          ? 'green-bg green'
                          : ''
                      "
                    >
                      {{ item.asia?.early }}
                    </div>
                    <div class="down">
                      <div class="color-9197ad">客</div>
                      <div
                        class="num"
                        :class="
                          item.asia1?.guest == 2 ? 'red' : item.asia1?.guest == 3 ? 'green' : ''
                        "
                      >
                        <div>{{ item.asia?.guest }}</div>
                        <div class="arrow"></div>
                      </div>
                    </div>
                  </div>
                </li>
                <li v-if="item.bs1" class="zongfen width124">
                  <div class="top-wrap border-bottom-dfe6f0">
                    <div class="data-wrap"></div>
                    <div class="up">
                      <div class="num">
                        <div
                          class="num"
                          :class="item.bs1?.host == 2 ? 'red' : item.bs1?.host == 3 ? 'green' : ''"
                        >
                          {{ item.bs?.host }}
                        </div>
                        <div class="arrow"></div>
                      </div>
                    </div>
                  </div>
                  <div class="down-wrap">
                    <div
                      class="data-wrap"
                      :class="
                        item.bs1?.early == 2
                          ? 'red-bg red'
                          : item.bs1?.early == 3
                          ? 'green-bg green'
                          : ''
                      "
                    >
                      <div class="num">{{ item.bs?.early }}</div>
                    </div>
                    <div class="down">
                      <div class="num">
                        <div
                          class="num"
                          :class="
                            item.bs1?.guest == 2 ? 'red' : item.bs1?.guest == 3 ? 'green' : ''
                          "
                        >
                          {{ item.bs?.guest }}
                        </div>
                        <div class="arrow"></div>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="data width80 border-right-dfe6f0">
                  <div class="data-item">
                    <router-link
                      target="_self"
                      :to="'/score-detail?type=basketball&tabIndex=4&id=' + item.id"
                      >分析</router-link
                    >
                  </div>
                  <div class="data-item">
                    <router-link target="_self" :to="'/score-detail?type=basketball&id=' + item.id">
                      指数</router-link
                    >
                  </div>
                </li>
                <li class="score-item-operation">
                  <div
                    class="arrow-top arrow-solid"
                    @click="setTop(item)"
                    v-if="topList.indexOf(item.id) != -1"
                  ></div>
                  <img
                    v-else
                    @click="setTop(item)"
                    src="/static/images/top.png"
                    class="arrow-top"
                  />
                  <!-- <img src="/static/images/top.png" class="arrow-top" @click="setTop(item)"> -->
                  <img
                    v-if="[1, 2].includes(getMatchStatusType('basketball', item))"
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
                </li>
              </ul>
            </div>
          </template>
        </RecycleScroller>
      </ul>
    </section>
  </div>
</template>

<script>
import { getImageUrl } from '@/utils/common.js'
import { getList } from '@/api/basketball.js'
import { collect } from '@/api/common.js'
import pollingGetScoreList from '@/mixins/pollingGetScoreList.js'
export default {
  props: {
    lang: {
      type: Number,
      default: 0
    },
    typeTab: {
      //即时列表切换进行中/ 未开 / 完场
      type: Number,
      default: 0
    }
  },
  mixins: [pollingGetScoreList],
  inject: ['getMatchStatusType', 'filterInvalidTitles', 'titleIdList'],
  data() {
    return {
      i: 1,
      lock: false,
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      basketList: [],
      topList: [],
      screenListT: [], //筛选选中列表
      concealList: [],
      isAbnormalTime: false,
      isEndTime: false,
      screenStatus: 'competition_id',
      tabIndex: 0,
      list: [],
      visibleData: []
    }
  },
  watch: {},
  computed: {
    // justZh(item) {
    //   if(this.lang===1) return item.short_name_zht
    //   if(this.lang===2) return item.short_name_
    //   return item.short_name_zh
    // },
    arrList1() {
      return this.filterInvalidTitles('basketball', this.list, this.topList || [])
      // return arr
    },
    arrList2() {
      return this.list2
      // return arr
    },
    arrList3() {
      return this.list3
      // return arr
    },
    arrList5() {
      return this.list5
      // return arr
    },
    // 可视的置顶数据（已置顶 && 未设置隐藏 && 符合当前的筛选条件的数据）
    arrList4() {
      return this.list.filter((item) => {
        return this.topList.indexOf(item.id) !== -1
      })
    }
  },
  mounted() {
    this.topList = JSON.parse(localStorage.getItem('topList1')) || []
    this.getlist()
  },
  methods: {
    getImageUrl,
    // 1相等 ， 2 大于 ，3小于
    setExp(num1, num2) {
      if (num1 < num2) {
        return 3
      } else if (num1 > num2) {
        return 2
      } else if (num1 == num2) {
        return 1
      }
    },
    // 隐藏
    conceal() {
      if (this.basketList.length == 0) return
      this.concealList = this.basketList
      this.basketList = []
      this.$store.state.concealNum = this.concealList.length
    },
    // 保留
    retain() {
      if (this.basketList.length == 0) return
      // 获取所有的列表 push（id）
      let arr = []
      this.arrList1.forEach((item) => {
        if (this.basketList.indexOf(item.id) === -1) {
          arr.push(item.id)
        }
      })
      this.arrList2.forEach((item) => {
        if (this.basketList.indexOf(item.id) === -1) {
          arr.push(item.id)
        }
      })
      this.arrList3.forEach((item) => {
        if (this.basketList.indexOf(item.id) === -1) {
          arr.push(item.id)
        }
      })
      this.arrList5.forEach((item) => {
        if (this.basketList.indexOf(item.id) === -1) {
          arr.push(item.id)
        }
      })
      this.concealList = arr
      this.$store.state.concealNum = arr.length
    },
    // 收藏
    collect() {
      if (!this.$store.state.user.infoData.id) {
        return this.$message.error('请登录后进行操作')
      }
      if (this.basketList.length == 0) return
      let data = {
        match_ids: this.basketList.toString(),
        match_type: 2
      }
      collect(data)
        .then(() => {
          this.getlist()
          this.$message.success('操作成功')
        })
        .catch((res) => {
          this.$message.error(res.msg || res.data?.msg || '操作失败')
        })
    },
    // 取消隐藏
    cancelConceal() {
      this.concealList = []
      this.$store.state.concealNum = 0
    },

    // 筛选列表
    screenList(list, status) {
      this.screenListT = list
      this.screenStatus = status
    },
    // 点击置顶/取消操作 1.置顶：需添加，删除
    setTop(item) {
      if (this.topList.indexOf(item.id) != -1) {
        // 取消置顶
        this.topList.splice(this.topList.indexOf(item.id), 1)
        if (!this.arrList4.length) {
          // 当前总数据列表已经没有已置顶的比赛了,移除【置顶】栏目
          this.list.splice(
            this.list.findIndex((it) => it.competition_name_zh === '置顶'),
            1
          )
        }
        localStorage.setItem('topList1', JSON.stringify(this.topList))
      } else {
        this.topList.push(item.id)
        localStorage.setItem('topList1', JSON.stringify(this.topList))
      }

      // let id = null
      // this.topList.forEach(item1 => {
      // 	if (item1 == item.id) {
      // 		id = item1
      // 	}
      // })
      // if (id == item.id) return
      // this.topList.push(item.id)
      // localStorage.setItem('topList1', JSON.stringify(this.topList))
      this.setList4()
    },
    // 取消置顶删除缓存
    cancelTop(item) {
      this.list4.splice(
        this.list4.findIndex((item1) => item1.id === item.id),
        1
      )
      this.topList.splice(
        this.topList.findIndex((item1) => item1.id === item.id),
        1
      )
      localStorage.setItem('topList1', JSON.stringify(this.topList))
    },
    // 置顶
    setList4() {
      this.setArr(this.list)
    },
    // 收藏
    setCollect(item) {
      if (!this.$store.state.user.infoData.id) {
        return this.$message.error('请登录后进行操作')
      }
      let data = {
        match_ids: item.id,
        match_type: 2
      }
      collect(data)
        .then(() => {
          item.is_collect = item.is_collect == 0 ? (item.is_collect = 1) : (item.is_collect = 0)
          if (item.is_collect == 1) {
            this.$message.success('预约成功')
          } else {
            this.$message.success('已取消预约')
          }
        })
        .catch((res) => {
          this.$message.error(res.msg || res.data?.msg || '操作失败')
        })
    },
    // 收藏 取消收藏
    setId(item) {
      let _this = this
      if (this.basketList.indexOf(item.id) == -1) {
        this.basketList.push(item.id)
      } else {
        this.basketList.splice(_this.basketList.indexOf(item.id), 1)
      }
    },

    // 比赛已开始
    async getlist() {
      this.isGettingList = true
      this.lock = true

      const [res1, res2] = await Promise.all([
        getList({
          type: 1
        }),
        getList({
          type: 2
        })
      ])
      this.isGettingList = false
      this.lock = false
      if (res1 && res2) {
        this.list = [...res1.data.data, ...res2.data.data]
        this.setArr(this.list)
      }
    },
    // 赛程
    // getlist2() {
    //   getList({
    //     type: 2
    //   })
    //     .then((res) => {
    //       this.list2 = res.data
    //     })
    //     .catch(() => {})
    // },
    // 赛果
    // getlist3() {
    //   getList({
    //     type: 3
    //   })
    //     .then((res) => {
    //       this.list3 = res.data
    //     })
    //     .catch(() => {})
    // },
    /* 重组数组 */
    setArr(data) {
      // 根据分类查询id
      //         状态
      // 2第一节 3第一节完 4第二节 5第二节完 6第三节 7第三节完 8第四节 9加时
      // 比赛中
      // 1未开赛
      // 0异常11中断 12取消 13延期 14腰斩 15待定
      // 异常
      // 10完场
      // 已完赛
      let list1 = [] // 进行中
      let list2 = [] // 未开始

      data.forEach((item) => {
        let obj = {
          asia1: {
            host: 1,
            early: 1,
            guest: 1,
            timer: null
          },
          eu1: {
            host: 1,
            early: 1,
            guest: 1,
            timer: null
          },
          bs1: {
            host: 1,
            early: 1,
            guest: 1,
            timer: null
          }
        }
        /* 设置自定义值修改背景色 */
        item = {
          ...item,
          ...obj
        }
        item.red_bg = 1
        // 进行中
        if (this.getMatchStatusType('basketball', item) === 1) {
          list1.push(item)
        } else if (this.getMatchStatusType('basketball', item) === 2) {
          // 未开始
          list2.push(item)
        }
      })
      this.goingList = list1
      this.lock = false
      if (this.isFirstGetList) {
        if (this.tabIndex === 0) this.pollingGetList('basketball', 0, this.getlist)
        this.isFirstGetList = false
      }
      let arrList = list1.concat(list2)
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
      // if (list3.length > 0)
      //   arrList.splice(
      //     arrList.findIndex((it) => it.id === list3.slice(0, 1)[0].id),
      //     0,
      //     {
      //       typeTitle: 2,
      //       competition_id: 1000000,
      //       country_id: 1000000,
      //       competition_name_zh: '已结束',
      //       id: 1000002,
      //       imgUrl: getImageUrl('/static/images/main-ends.png')
      //     }
      //   )
      // if (list5.length > 0)
      //   arrList.splice(
      //     arrList.findIndex((it) => it.id === list5.slice(0, 1)[0].id),
      //     0,
      //     {
      //       typeTitle: 3,
      //       competition_id: 1000000,
      //       country_id: 1000000,
      //       competition_name_zh: '异常',
      //       id: 1000003,
      //       imgUrl: getImageUrl('/static/images/main-yi.png')
      //     }
      //   )

      // this.updateVisibleData()
      /* 处理置顶思路
					1.判断列表长度
					2.将列表数据筛选
					3.在原来的数组中添加
				 */
      let topList = JSON.parse(localStorage.getItem('topList1')) || []

      this.topList = topList
      /* 判断是否为空 */

      /*
          空：增加标题和选中的数据
          非：增加选中的数据
          第一次进入：获取缓存，渲染列表
				 */
      let visibleTopList = arrList.filter((item) => {
        // screenListT有延迟
        return topList.indexOf(item.id) !== -1
      })
      if (visibleTopList.length != 0) {
        // let newTopList = []
        let a = arrList.filter((item) => {
          return topList.indexOf(item.id) !== -1
        })
        let b = arrList.filter((item) => {
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

      this.list = arrList
    },
    virtualListUpdate(startIndex, endIndex, visibleStartIndex, visibleEndIndex) {
      let data = this.list.slice(visibleStartIndex, visibleEndIndex)
      this.updateVisibleData(data)
    },
    updateVisibleData(data) {
      this.visibleData = data
    },
    updateTab(type) {
      let index
      switch (type) {
        case 0:
          index = this.list.findIndex((it) => it.id === 1000000)
          break
        case 1:
          index = this.list.findIndex((it) => it.id === 1000001)
          break
        case 2:
          index = this.list.findIndex((it) => it.id === 1000002)
          break
        case 3:
          index = this.list.findIndex((it) => it.id === 1000003)
          break
      }
      if (index > 0) {
        index--
      }
      this.scrollToItem(index)
    },
    scrollToItem(index) {
      const scroller = this.$refs.scoreScroller
      if (scroller) scroller.scrollToItem(index)
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/liveScore.scss';
.score-item-operation {
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
}

.score-item-operation .arrow-top,
.score-item-operation .collect,
.score-item-operation .statics {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
}
.con {
  width: 100%;
  display: flex;
  padding: 10px 0;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.con .icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.score-item-operation .arrow-solid {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABCUExURUdwTPDVs+zOrevMrPzevO3PrfTWtvPZt/LWs+rKqfPYtvjgv/DSsfHVtOzNrPPYt+7SsPXcu+rLqfjfvuXDoejIp/hoeCYAAAANdFJOUwCoc8AIkBhDJeDi6F/dI+x8AAABWUlEQVRIx+2W266DIBBFlWoF6wWs8/+/ergz2oCMbydxx7dmZSFzsU3z5MmtdP3na6NM1rHvCHCL0VU/bT37xqxGdd7V8HAQ68zzQISRmAor5KXC6htZIybBgVUOnSXNjLU0M6qR9UpJhBXyzkQYnVmSzenMZPjkrYO5zYRZSy+T/aHU4cPn2JOJtdm2TeRP4FhUI39mS282Ig8r01kZr6EB8jBL3jV5lygGAFbYILZEKvQGEm9O3Jd2V6vCDEbvIuOZobyNutepOSJq2NfFHuyEY2UUh4u+ZvXyG+dUpHjNxisqlqCjQ32lvipfpKoFyseD19+V4HWfCy7NGy/usvz7Aq+eKnmoL2i4fiQNjcRAYptmkqitACbad5LhIjHqV7b36EVDl2hz5husHrGaYcgPSV1D5/5cCNHfZP9PuMC9YbIfUhwthofwl913dmVO3jO6C948eULKH7b9NLnrKefYAAAAAElFTkSuQmCC);
}

.basketball-score-item-body:last-child {
  border-bottom: 1px solid #dfe6f0 !important;
}
.green {
  color: #3eba61;
  animation: odds-change-green-font 0.8s ease-in 0s 6 reverse both running;
}

.red {
  color: #ff4343;
  animation: odds-change-red-font 0.8s ease-in 0s 6 reverse both running;
}
.red-bg {
  background-color: #ffefec;
  animation: odds-change-red 0.8s ease-in 0s 6 reverse both running;
}

.green-bg {
  background-color: rgba(104, 185, 92, 0.25);
  animation: odds-change-green 0.8s ease-in 0s 6 reverse both running;
}
@keyframes odds-change-red {
  0% {
    background-color: rgba(255, 67, 67, 0.3);
  }

  50% {
    background-color: rgba(255, 67, 67, 0.6);
  }

  to {
    background-color: rgba(255, 67, 67, 0.3);
  }
}
@keyframes odds-change-red-font {
  0% {
    color: #ff4343;
  }

  50% {
    color: rgba(255, 67, 67, 0.5);
  }

  to {
    color: #ff4343;
  }
}

@keyframes odds-change-green-font {
  0% {
    color: #3eba61;
  }

  50% {
    color: rgba(62, 186, 97, 0.5);
  }

  to {
    color: #3eba61;
  }
}

@keyframes odds-change-green {
  0% {
    background-color: rgba(62, 186, 97, 0.3);
  }

  50% {
    background-color: rgba(62, 186, 97, 0.6);
  }

  to {
    background-color: rgba(62, 186, 97, 0.3);
  }
}

.basketball-score-item {
  height: 108px;
}
</style>
