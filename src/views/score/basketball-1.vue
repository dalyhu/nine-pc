<template>
  <div>
    <section
      class="container-section flag_score_basketball_1 border-top-radius-none"
      id="finished"
      v-loading="$store.state.loading"
    >
      <div v-if="list.length > 0">
        <RecycleScroller
          ref="scoreScroller"
          class="scroller"
          :items="list"
          item-class="score_list_item"
          key-field="id"
          page-mode
          :item-size="108"
        >
          <template v-slot="{ item, index }">
            <div class="basketball-score-item" style="display: flex" :data-index="index">
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
                  <div class="width62 text-center">指数</div>
                </li>
                <li class="width121 text-center">让分</li>
                <li class="width124 text-center">总分</li>
                <li class="width80 th_data text-center">数据</li>
                <!-- <li class="operation text-center" style="flex: 1 1 0%">功能</li> -->
              </ul>
              <ul class="basketball-score-item-body">
                <li class="gou-time width88">
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
                    <div class="border-bottom-dfe6f0">
                      <span>{{ item.home_scores_total }}</span>
                    </div>
                    <div>
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
                  <div class="score-item live width57 score-item-1">
                    <div class="basketball-score-item-live"></div>
                  </div>
                  <div class="ouzhi width62">
                    <div class="border-bottom-dfe6f0 up">
                      <div class="num">{{ item.bs?.host }}</div>
                      <div class="arrow"></div>
                    </div>
                    <div class="down">
                      <div class="num">{{ item.bs?.guest }}</div>
                      <div class="arrow"></div>
                    </div>
                  </div>
                </li>
                <li class="rangfen width121">
                  <div class="top-wrap border-bottom-dfe6f0">
                    <div class="data-wrap"></div>
                    <div class="up">
                      <div class="color-9197ad">主</div>
                      <div class="num">
                        <div>{{ item.asia?.host }}</div>
                        <div class="arrow"></div>
                      </div>
                    </div>
                  </div>
                  <div class="down-wrap">
                    <div class="data-wrap">{{ item.asia?.early }}</div>
                    <div class="down">
                      <div class="color-9197ad">客</div>
                      <div class="num">
                        <div>{{ item.asia?.guest }}</div>
                        <div class="arrow"></div>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="zongfen width124">
                  <div class="top-wrap border-bottom-dfe6f0">
                    <div class="data-wrap"></div>
                    <div class="up">
                      <div class="num">
                        <div class="num">{{ item.bs?.host }}</div>
                        <div class="arrow"></div>
                      </div>
                    </div>
                  </div>
                  <div class="down-wrap">
                    <div class="data-wrap">
                      <div class="num">{{ item.bs?.early }}</div>
                    </div>
                    <div class="down">
                      <div class="num">
                        <div class="num">{{ item.bs?.guest }}</div>
                        <div class="arrow"></div>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="data width80 border-right-dfe6f0 td_data">
                  <div class="data-item">
                    <router-link
                      target="_self"
                      :to="'/score-detail?type=basketball&tabIndex=4&id=' + item.id"
                      >分析</router-link
                    >
                  </div>
                  <div class="data-item">
                    <a @click="$router.push('/score-detail?type=basketball&id=' + item.id)">指数</a>
                  </div>
                </li>
                <!-- <li class="score-item-operation">
                </li> -->
              </ul>
            </div>
          </template>
        </RecycleScroller>

        <div class="load-more" v-if="list.length">
          <span v-if="total > list.length" @click="loadMore">
            {{ $store.state.loading ? '加载中...' : '点击加载更多' }}
          </span>
          <span v-else>没有更多数据</span>
        </div>
      </div>
      <div v-else class="common-empty-view">
        <DfEmpty description="暂未数据" />
      </div>
    </section>
  </div>
</template>

<script>
import { getList } from '@/api/basketball.js'
export default {
  name: 'BasketballScore1',
  props: {
    time: {
      type: Object,
      default: () => {}
    },
    lang: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      page: 1,
      total: 0,
      list: [],
      loading: false,
      loadStatus: 'more',
      screenListT: [], //筛选选中列表
      concealList: [],
      screenStatus: 'competition_id'
    }
  },
  watch: {
    time() {
      this.page = 1
      this.list = []
      this.getlist()
      // this.getAllData()
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    // async getAllData() {
    //   await this.$emit('getMatchFilter')
    //   this.getlist()
    // },
    // 加载更多
    load() {
      if (this.loadStatus == 'more' && this.loading) {
        this.loading = false
        // this.getlist()
      }
    },
    loadMore() {
      this.page++
      this.getlist()
    },
    // 筛选列表
    // screenList(list, status) {
    //   this.screenListT = list
    //   this.screenStatus = status
    // },
    getlist() {
      let data = {
        type: 3,
        page: this.page,
        time: this.time.day || new Date().toISOString().slice(0, 10)
      }
      this.$store.state.loading = true
      getList(data)
        .then((res) => {
          // this.list1 = res.data.data
          this.list = [...this.list, ...res.data.data]
          this.$store.state.loading = false
          this.total = res.data.total
        })
        .catch(() => {
          this.$store.state.loading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/liveScore.scss';
.container-section {
  min-height: 200px;
  margin: 0 auto 10px;
  box-shadow: rgb(238, 238, 238) 0px 1px 0px 0px inset;
}
.th_data,
.td_data {
  width: auto;
  flex: 1;
}
.basketball-score-item {
  .basketball-score-item-body {
    .td_data {
      flex-direction: row;
    }
  }
}
</style>
