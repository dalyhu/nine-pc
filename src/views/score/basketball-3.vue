<template>
  <section class="container-section flag_score_basketball_3" id="going">
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
        <div class="basketball-score-item" v-if="item.imgUrl">
          <div class="title" style="display: flex">
            <div class="con">
              <img alt="b" :src="item.imgUrl" class="icon" />
              <div class="container-section-field">{{ item.competition_name_zh }}</div>
            </div>
          </div>
        </div>
        <div class="basketball-score-item" :data-index="index" style="display: flex" v-else>
          <ul class="header">
            <li class="width88 text-center">
              <div
                class="baseball-league-name-container false"
                style="background-color: rgb(118, 145, 111)"
              >
                <div class="league-name ellipsis" :style="{ background: item.primary_color }">
                  {{ item.short_name_zh }}
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
            <li class="width80 text-center">数据</li>
            <li class="operation text-center" style="flex: 1 1 0%">操作</li>
          </ul>
          <ul class="basketball-score-item-body">
            <li class="gou-time width88">
              <div class="gou">
                <img
                  class="checkbox-icon"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8BAMAAADI0sRBAAAALVBMVEUAAADNzc3Ozs7T09PNzc3Nzc3Nzc3Ozs7MzMz////MzMzU1NTw8PD5+fno6Oi3ZcsjAAAACXRSTlMA5VwPs8uPfDeKAlU5AAABJElEQVQ4y92UvU4CQRSFjVrYa2G2IjGxsEIbEytteQRKS1s7K3mMAZZk+Q1ngJ4JoefnBZaCHgjvQCA7k2HvJKfntF/m3Jk7956ri9DN81eUPHwXw/SthJPaTyH6DqdfSa8jYLpM4+UOSAqibhl6r05aG3Ty9SvQM5WpbvCYswY2yqkBnNu/YKI8LdD06R106uPY4N/DrxirM9Vw7+GyO+yOd/yLDVROcxQ8700eNzz3P62ETM917Ogt3Yuu9Fjimit+eywti39m+AOpxDFatqNaBWRsX39GIbztZrg0COF5O8NRGCcWD0N4ZTH6IVwFwcScXI08jLSFNJV8CflQMg5kmMgokkEma0CWiKwgWWCy/jQ8ePTw4JKxR0KTR66UDexL0AFE/SvujFRlrwAAAABJRU5ErkJggg=="
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
                /><span class="name-span ellipsis">{{ item.home_team_data.short_name_zh }}</span>
                <div class="rank"></div>
              </div>
              <div class="name ellipsis search-by-team-name">
                <img
                  class="team-logo"
                  :src="item.away_team_data.logo"
                  width="48"
                  height="48"
                /><span class="name-span ellipsis">{{ item.away_team_data.short_name_zh }}</span>
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
              <div class="score-item live width57">
                <div class="basketball-score-item-live"></div>
              </div>
              <div class="ouzhi width62">
                <div class="border-bottom-dfe6f0 up">
                  <div class="num" v-if="item.bs">{{ item.bs.host }}</div>
                  <div class="arrow"></div>
                </div>
                <div class="down">
                  <div class="num" v-if="item.bs">{{ item.bs.guest }}</div>
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
                    <div v-if="item.bs">{{ item.asia.host }}</div>
                    <div class="arrow"></div>
                  </div>
                </div>
              </div>
              <div class="down-wrap">
                <div class="data-wrap" v-if="item.asia">{{ item.asia.early }}</div>
                <div class="down">
                  <div class="color-9197ad">客</div>
                  <div class="num">
                    <div v-if="item.bs">{{ item.asia.guest }}</div>
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
                    <div class="num" v-if="item.bs">{{ item.bs.host }}</div>
                    <div class="arrow"></div>
                  </div>
                </div>
              </div>
              <div class="down-wrap">
                <div class="data-wrap">
                  <div class="num" v-if="item.asia">{{ item.bs.early }}</div>
                </div>
                <div class="down">
                  <div class="num">
                    <div class="num" v-if="item.bs">{{ item.bs.guest }}</div>
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
                <a target="_self" href="/score-detail/yapan?matchId=3894475&amp;sportId=2">指数</a>
              </div>
            </li>
            <li class="score-item-operation">
              <div class="collect collect-solid" @click="setCollect(item)"></div>
            </li>
          </ul>
        </div>
      </template>
    </RecycleScroller>

    <div v-if="list.length == 0" class="common-empty-view">
      <DfEmpty description="暂无数据" />
    </div>
  </section>
</template>

<script>
import { getImageUrl } from '@/utils/common.js'
import { getList } from '@/api/basketball.js'
import { collect } from '@/api/common.js'
import pollingGetScoreList from '@/mixins/pollingGetScoreList.js'
import { cloneDeep } from 'lodash-es'
export default {
  name: 'BasketballScore3',
  data() {
    return {
      list: [],
      tabIndex: 3,
      screenStatus: 'competition_id'
    }
  },
  mixins: [pollingGetScoreList],
  mounted() {
    this.getlist()
  },
  methods: {
    // 筛选列表
    screenList(list, status) {
      this.screenListT = list
      this.screenStatus = status
    },
    getlist() {
      this.isGettingList = true
      getList({
        type: 4
      })
        .then((res) => {
          this.isGettingList = false
          this.setArr(res.data.data)
        })
        .catch(() => {
          this.isGettingList = false
        })
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
    // 收藏 取消收藏
    setId(index) {
      this.list.splice(index, 1)
    },
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
        if (
          item.status_id == 2 ||
          item.status_id == 3 ||
          item.status_id == 4 ||
          item.status_id == 5 ||
          item.status_id == 6 ||
          item.status_id == 7 ||
          item.status_id == 8 ||
          item.status_id == 9
        ) {
          list1.push(item)
        } else if (item.status_id == 1) {
          // 未开始
          list2.push(item)
        }
      })
      this.lock = false
      let arrList = this.list.concat(list1).concat(list2)
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

      this.list = arrList
      this.goingList = list1
      if (this.isFirstGetList) {
        this.pollingGetList('basketball', 3, this.getlist)
        this.isFirstGetList = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/liveScore.scss';

.container-section {
  margin: 0px auto 10px;
}
.score-item-operation img {
  width: 20px;
  height: 20px;
}
.score-item-operation {
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
}
.score-item-operation .collect-solid {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
  background-image: url(/static/images/icon-reserve-active.png);
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
.basketball-score-item {
  height: 108px;
}
</style>
