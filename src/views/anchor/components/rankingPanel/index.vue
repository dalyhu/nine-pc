<template>
  <div class="integral-group-container">
    <!-- 足球 积分 -->
    <div class="integral-football-table" v-if="roomType === 0">
      <div class="nav-title flex">
        <div class="title-index">排名</div>
        <div class="title-one width120 flex">球队</div>
        <div class="title-two flex">胜/平/负</div>
        <div class="title-three flex">进/失</div>
        <div class="title-four width40">积分</div>
      </div>
      <div class="table--main">
        <ul v-if="rankingList.length > 0" class="content content-1">
          <li class="item" v-for="(item1, index) in rankingList" :key="index">
            <div class="title-index index-num">{{ item1.position }}</div>
            <div class="con-one flex width120">
              <img :src="item1.logo" />
              <div class="name ellipsis">{{ item1.name }}</div>
            </div>
            <div class="con-two flex">{{ item1.won }}/{{ item1.draw }}/{{ item1.loss }}</div>
            <div class="con-three flex">{{ item1.goals }}/{{ item1.goals_against }}</div>
            <div class="con-four width40">{{ item1.points }}</div>
          </li>
        </ul>
        <DfEmpty v-else />
      </div>
    </div>
    <!-- 篮球 积分 -->
    <div class="integral-basketball-table" v-if="roomType === 1">
      <!-- 2023/07/29 篮球积分榜新调整 -->
      <swiper
        class="series_list"
        :modules="swiperModules"
        v-bind="swiperOptions"
        v-if="rankingList && rankingList.length"
      >
        <swiper-slide class="text">
          <div class="series_content flex">
            <div
              class="series_name"
              :class="{ active: activeRankIndex === index }"
              v-for="(item, index) in rankingList"
              :key="index"
              :id="item.id"
              @click="handleSlideClick"
            >
              {{ item.name }}
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-scrollbar" style="height: 2px"></div>
      </swiper>
      <div class="nav-title flex">
        <div class="title-index">排名</div>
        <div class="title-one width120 flex">球队</div>
        <div class="title-two flex">胜/负</div>
        <div class="title-three flex">胜率</div>
        <div class="title-four width40">胜差</div>
      </div>
      <div class="table--main">
        <ul
          class="content themed_scrollbar"
          v-if="
            rankingList[activeRankIndex] &&
            rankingList[activeRankIndex].teams &&
            rankingList[activeRankIndex].teams.length > 0
          "
        >
          <li
            class="item"
            v-for="(item1, index) in rankingList[activeRankIndex].teams"
            :key="index"
          >
            <div class="title-index index-num">{{ item1.position }}</div>
            <div class="con-one flex width120">
              <img :src="item1.logo" />
              <div class="name ellipsis">{{ item1.name }}</div>
            </div>
            <div class="con-two flex">{{ item1.won }}/{{ item1.loss }}</div>
            <div class="con-three flex">{{ item1.won_rate }}</div>
            <div class="con-four width40">{{ item1.game_back || '-' }}</div>
          </li>
        </ul>
        <DfEmpty v-else />
      </div>
    </div>

    <!-- 电竞 积分 -->
    <div class="integral-football-table" v-if="roomType === 3">
      <div class="nav-title flex">
        <div class="title-index flex">排名</div>
        <div class="title-one flex">战队</div>
        <div class="title-four flex">积分</div>
      </div>
      <div class="table--main">
        <ul v-if="rankingList.length > 0" class="content content-1">
          <li class="item" v-for="(item1, index) in rankingList" :key="index">
            <div class="title-index index-num">{{ item1.position }}</div>
            <div class="con-one flex width120">
              <img :src="item1.logo" />
              <div class="name ellipsis">{{ item1.name }}</div>
            </div>
            <div class="con-four flex">{{ item1.points }}</div>
          </li>
        </ul>
        <DfEmpty v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { Scrollbar, FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { getRankingData } from '@/api/headline' // ranking

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/scrollbar'

export default {
  props: ['roomType', 'matchId'],
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      rankingList: [],
      activeRankIndex: 0,
      swiperModules: [Scrollbar, FreeMode],
      swiperOptions: {
        slidesPerView: 'auto',
        autoHeight: true,
        spaceBetween: 8,
        speed: 300,
        direction: 'horizontal',
        freeMode: true,
        scrollbar: {
          el: '.swiper-scrollbar',
          hide: false
        }
      }
    }
  },
  mounted() {
    this.getRankingAction()
  },
  methods: {
    handleSlideClick(e) {
      console.log(e)
      const index = this.rankingList.findIndex((i) => i.id == e.target.attributes.id.nodeValue)
      console.log(index)
      this.activeRankIndex = index
      // this.$refs.mySwiper.swiper.realIndex = index
    },
    getRankingAction() {
      if (this.matchId === 0 || !this.matchId) {
        return
      }
      let data = {
        type: this.roomType,
        id: this.matchId
      }

      getRankingData(data).then((res) => {
        this.rankingList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.swiper-scrollbar {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
  position: absolute;
  width: 100%;
  :deep(.swiper-scrollbar-drag) {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    height: 2px;
  }
}
.dark {
  .swiper-scrollbar {
    background: rgba(215, 215, 215, 0.1);
    :deep(.swiper-scrollbar-drag) {
      background: rgba(215, 215, 215, 0.5);
    }
  }
}
.series_list {
  padding: 10px;
  position: relative;
  width: 100%;
  min-height: 59px;
  :deep(.swiper-wrapper) {
    margin: 5px 0;
    .swiper-slide {
      width: auto !important;
      cursor: grabbing;
    }
  }
  .series_content {
    align-items: center;
  }
  .series_name {
    color: #999;
    font-size: 14px;
    padding: 5px 0;
    &:not(:last-child) {
      margin-right: 10px;
    }
    &.active {
    }
  }
}

.nav-title {
  min-height: 30px;
}

.color-f55b5b {
  color: #f55b5b;
}
.title-index {
  width: 26px;
  text-align: center;
}

.index-num {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background-color: var(--el-warning-background---el-color-warning-9);
  line-height: 30px;
  color: var(--el-warning-text-color-2);
}

.integral-group-container {
  width: 100%;
  padding: 0 12px;
}

.integral-group-container .display,
.integral-group-container .nav {
  display: flex;
  align-items: center;
  justify-content: center;
}

.integral-group-container .nav {
  width: 100%;
  height: 40px;
  padding: 5px 20px 0;
  border-bottom: 0.5px solid #f4f5fd;
}

.integral-group-container .nav li {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  color: #959db0;
  cursor: pointer;
}

.integral-group-container .nav li.active {
  position: relative;
  color: #d8ad66;
}

.integral-group-container .nav li.active:after {
  position: absolute;
  content: '';
  width: 10px;
  height: 6px;
  bottom: 4px;
  left: 50%;
  margin-left: -5px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAMCAMAAABYzB2OAAAAWlBMVEUAAADvzZLw1rjlv5PZqW3tz6/huonWpGTqyqb03MLnxZ3cr3jz27znwpjbqm3ftIDUnlvSnFvftIDTnVrVomPcrnbZqGzes3/nxJzkv5LhuYjqyqXhuYnsz67bacdMAAAAE3RSTlMACvX19dXV1aBgYGAqKiqgoKCfPkq9sAAAAFVJREFUCNddzEcWwBAAAFESvaU34f7XjMgj+MtZDEg4Bw3VdaouEHuPYZXYHbCyiDMSf9H9FfU6j4hz1tmApN1wZPNX5FaQbzFoLyATRnStUAjGpTE9ugYI7ff76AAAAAAASUVORK5CYII=)
    no-repeat;
  background-size: contain;
}

.integral-football-table {
  width: 100%;
  color: #333;
  height: 100%;
  display: flex;
  flex-direction: column;
  .table--main {
    flex: 1;
  }
}

.nav-title {
  width: 100%;
  height: 30px;
  padding: 0 15px;
  background-color: var(--el-disabled-bg-color);
  font-size: 12px;
  color: #959db0;
}

.title-one {
  justify-content: center;
}

.title-two,
.con-two {
  width: 60px;
  justify-content: center;
}

.con-three,
.title-three {
  width: 50px;
  justify-content: center;
}
.con-two,
.con-three,
.con-four {
  color: var(--el-text-color-primary);
}
.table--main {
  flex: 1;
}
.content {
  width: 100%;
  height: 100%;
  padding: 0 15px;
}

.content::-webkit-scrollbar {
  width: 4px;
  height: 10px;
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb {
  background: #bfbebe;
  border-radius: 4px;
  height: 10px;
}

.content::-webkit-scrollbar-track-piece {
  background: #e8e8e8;
}

.content .item {
  font-size: 12px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid var(--el-border-color-dark);
}

.integral-football-table .content .item:last-child {
  border-bottom: none;
}

.con-one {
  justify-content: flex-start;
}

.content .item .con-one img {
  width: 20px;
  height: 20px;
  margin: 0 10px;
}

.content .item .con-one .name {
  max-width: 75px;
  font-size: 12px;
  color: var(--el-text-color-primary);
}

.content .no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-top: 100px;
}

.content .no-data img {
  width: 100%;
  height: auto;
}

.content .no-data .no-data-con {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -60px;
  font-size: 16px;
  color: #999;
}

.width130 {
  width: 130px;
}

.integral-football-table .display {
  display: flex;
  align-items: center;
  justify-content: center;
}

.integral-football-table .bold {
  font-weight: 700;
}

.integral-basketball-table {
  width: 100%;
  color: #333;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content .item-title {
  justify-content: center;
  color: #d8ad66;
}

.width40 {
  width: 40px;
  text-align: center;
}

.width120 {
  width: 120px;
}

.integral-basketball-table .display {
  display: flex;
  align-items: center;
  justify-content: center;
}

.integral-basketball-table .bold {
  font-weight: 700;
}
.ch-type {
  text-align: center;
  .el-select {
    margin: 10px auto;
  }
}
</style>
