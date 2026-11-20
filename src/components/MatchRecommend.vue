<template>
  <div class="recommend-list-view">
    <div class="grid-header">
      <div class="grid-header-left">
        <img class="grid-header-left-icon" src="/static/images/home/main-recommend-title.png" />
        <!--        <div class="grid-header-left-text">赛事推荐</div>-->
      </div>
      <div class="grid-header-right">
        <div class="grid-header-right-text">
          <span>今日({{ count }})</span>
        </div>
      </div>
    </div>

    <div class="grid-type-li">
      <div class="grid-header-left-nav flex flex-start">
        <div
          class="flex flex-center"
          v-for="(item, index) in tabList"
          :key="index"
          v-show="item.show"
          :class="{ active2: tabIndex === index }"
          @click="onHandleType(index)"
        >
          <!-- 針對世界杯放置的足球小圖 -->
          <span :class="`h-icon h-icon-${item.icon}`"></span>
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>

    <div
      :class="`type-section type-section-${key}`"
      v-for="(sort, key) in recommendList"
      :key="key"
    >
      <div class="sort-header">
        <div class="sort-title">
          <!--          <img :src="typeInfo[key].icon">-->
          <span>{{ typeInfo[key].context }}</span>
        </div>
        <div
          class="more flex c-pointer"
          @click="onHandleNavigate(type < 3 ? 'football' : 'basketball')"
        >
          查看全部
          <i></i>
        </div>
      </div>
      <div v-if="sort.length === 0">
        <div class="empty-list">没有更多比赛了，请尝试变更过滤条件</div>
      </div>
      <div v-else>
        <div class="sort-list" v-for="item in sort" :key="item.sourceid">
          <div class="match-left-info">
            <div class="match-time-info">
              <div class="match-time">{{ item.match_time.slice(6, 11) || '-' }}</div>
              <div class="match-date">{{ item.match_time.slice(0, 5) || '-' }}</div>
            </div>
            <div class="competition-name">
              {{ item.competition || '-' }}
            </div>
            <!--            <div class="match-state">
              {{ item.status_str || "-" }}
            </div>-->
          </div>
          <div class="match-main-info">
            <div class="team-name left-team">{{ item.home_team_name || '-' }}</div>
            <div class="match-score">
              <span>{{ item.home_scores || '0' }}</span>
              <span>-</span>
              <span>{{ item.away_scores || '0' }}</span>
            </div>
            <div class="team-name right-team">{{ item.away_team_name || '-' }}</div>
          </div>
          <div class="match-right-info">
            <div class="anchor-info" :class="{ 'show-panel': item.anchor_total > 0 }">
              <div v-if="item.anchor_total > 0" class="anchor-icon flex flex-center">
                观看直播
                <img src="/static/images/home/zb-live.gif" />
              </div>
              <div class="hover-anchor-pannel">
                <div class="pannel-title">{{ item.anchor_total }}位主播</div>
                <div
                  class="anchor-list flex"
                  v-for="anchor in item.anchor_list"
                  :key="anchor.id"
                  @click="onHandleNavigate(item, anchor.id)"
                >
                  <span class="anchor-name">{{ anchor.user_nickname }}</span>
                  <span class="live-lable">
                    <img class="w-20" src="/static/images/home/icon-m.png" />
                    <!--
                    直播中
                    <span></span>
                    <span></span>
                    <span></span>-->
                  </span>
                </div>
              </div>
            </div>
            <!-- 有主播在直播赛事不显示该按钮 -->
            <div
              v-if="
                (item.anchor_total === 0 && [0, 2].includes(item.status_type)) ||
                (item.status_type === 1 && item.anchor_total === 0 && item.mlive === 1)
              "
              :class="`c-pointer mlive-button mlive-button-${item.mlive}`"
              @click="item.mlive === 1 ? onHandleNavigate(item, null, true) : false"
            >
              {{ item.mlive === 1 ? '查看详情' : typeInfo[key].txt }}
              <img v-if="item.mlive === 1" src="/static/images/home/icon-jt-2.png" alt="视频图标" />
              <!--              <img
                @click="item.mlive === 1 ? onHandleNavigate(item, null, true) : false"
                :class="{'gray-effect': (item.mlive !== 1)}"
                src="/static/images/mlive-icon.png"
                alt="视频图标" />-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getImageUrl } from '@/utils/common.js'

export default {
  props: {
    type: {
      type: Number,
      default: 0
    },
    count: {
      type: [Number, String],
      default: 0
    },
    recommendList: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      tabIndex: 0,
      tabList: [
        {
          name: '全部',
          moreBtnUrl: 'football',
          show: true,
          showIcon: false,
          params: { type: 0 },
          btn_type: 0,
          icon: 'all'
        },
        // { name: "世界杯", params: {type: 99} },
        {
          name: '足球',
          moreBtnUrl: 'football',
          show: true,
          showIcon: false,
          params: { type: 1 },
          btn_type: 0,
          icon: 'ft'
        },
        {
          name: '篮球',
          moreBtnUrl: 'basketball',
          show: true,
          showIcon: false,
          params: { type: 2 },
          btn_type: 0,
          icon: 'bk'
        },
        {
          name: '电竞',
          moreBtnUrl: 'anchor?type=4',
          show: true,
          showIcon: false,
          params: { type: 4 },
          btn_type: 0,
          icon: 'dj'
        },
        {
          name: '五大联赛',
          moreBtnUrl: 'football',
          show: true,
          showIcon: true,
          params: { football: '82,120,108,129,142' },
          btn_type: 1,
          icon: 'wdls'
        },
        {
          name: 'NBA',
          moreBtnUrl: 'basketball',
          show: true,
          showIcon: true,
          params: { basketball: '1' },
          btn_type: 2,
          icon: 'nba'
        }
      ],
      typeInfo: {
        type1: {
          context: '进行中的比赛',
          txt: '查看详情',
          key: 'jxz',
          icon: getImageUrl('/static/images/main-beigin.png')
        },
        type2: {
          context: '未开始的比赛',
          txt: '敬请期待',
          key: 'wks',
          icon: getImageUrl('/static/images/main-end.png')
        },
        type3: {
          context: '已结束的比赛',
          txt: '已结束',
          key: 'yjs',
          icon: getImageUrl('/static/images/main-ends.png')
        }
      }
    }
  },
  created() {
    // 放到父级调用了,避免首次进入没有带入 user_id 问题
    // this.onHandleType(0)
  },
  computed: {
    // buttonClass () {
    //   let isAct = this.type === this.tabIndex
    //   return {
    //     // 'fifa-normal': this.tabIndex === 1,
    //     // 'fifa-active': this.type === 1 && isAct,
    //     'image-button-normal': this.tabIndex > 2,
    //     'image-button-active': this.tabIndex > 2 && isAct,
    //     'five-league-normal': this.tabIndex === 3,
    //     'five-league-active': this.tabIndex === 3 && isAct,
    //     'nba-normal': this.tabIndex === 4,
    //     'nba-active': this.tabIndex === 4 && isAct,
    //     active2: this.tabIndex <= 2 && isAct
    //   }
    // }
  },
  methods: {
    onHandleType(index) {
      this.tabIndex = index
      let params = this.tabList[index].params
      this.$emit('onHandleType', { type: index, params: params })
    },
    onHandleNavigate(item, anchor_id, isLive) {
      let url = ''
      let type = 'football'
      switch (Number(item.type)) {
        case 0:
          type = 'football'
          break
        case 1:
          type = 'basketball'
          break
        default:
          type = item.type
          break
      }
      if (anchor_id) {
        url = `live?router=recommend&uid=${anchor_id}`
      } else if (isLive) {
        return
      } else {
        url = this.tabList[this.tabIndex].moreBtnUrl
      }

      this.$emit('onHandleNavigate', url)
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend-list-view {
  width: 100%;

  .grid-header-left-nav {
    margin-bottom: 16px;
    margin-left: 20px;
    & > div {
      position: relative;
      cursor: pointer;
      font-size: 16px;
      letter-spacing: 0.3px;
      color: #333;
      text-align: center;
      margin: 5px 4px 3px 0;
      width: 110px;
      height: 28px;
      line-height: 28px;

      &.active2,
      &.active2:hover,
      &:hover {
        color: #fff;
        background: url(/static/images/home/icon-btn-h.png) center no-repeat;
        background-size: 100% 100%;
        .h-icon-all {
          background-image: url(/static/images/home/icon-all-a.png);
        }
        .h-icon-ft {
          background-image: url(/static/images/home/icon-ft-a.png);
        }
        .h-icon-bk {
          background-image: url(/static/images/home/icon-bk-a.png);
        }
        .h-icon-dj {
          background-image: url(/static/images/home/icon-dj-a.png);
        }
        .h-icon-wdls {
          background-image: url(/static/images/home/icon-wdls-a.png);
        }
        .h-icon-nba {
          background-image: url(/static/images/home/icon-nba-a.png);
        }
      }

      span {
        position: relative;
        z-index: 1;
      }
      .h-icon {
        display: inline-block;
        margin-right: 3px;
        width: 20px;
        height: 20px;
        background: url(/static/images/home/icon-all-a.png) center no-repeat;
        background-size: 100%;
      }
      .h-icon-all {
        background-image: url(/static/images/home/icon-all-u.png);
      }
      .h-icon-ft {
        background-image: url(/static/images/home/icon-ft-u.png);
      }
      .h-icon-bk {
        background-image: url(/static/images/home/icon-bk-u.png);
      }
      .h-icon-dj {
        background-image: url(/static/images/home/icon-dj-u.png);
      }
      .h-icon-wdls {
        background-image: url(/static/images/home/icon-wdls-u.png);
      }
      .h-icon-nba {
        background-image: url(/static/images/home/icon-nba-u.png);
      }

      &:after {
        content: '';
        display: inline-block;
        width: 1px;
        height: 20px;
        background: url(/static/images/home/icon-line-h.png) no-repeat;
        background-size: 100%;
        position: absolute;
        right: -2px;
      }

      /*&::after {
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
       !* border: 1px solid #9ea3b0;
        border-radius: 4px;*!
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) skewX(-20deg);
        z-index: 0;
      }
      &:hover {
        background: #d02d54;
        transform: translate(-50%, -50%) skewX(-20deg);
        &::after {
          background: #d02d54;
        }
      }
      &.active2 {
        background: none;
        &::after {
          width: calc(100% + 2px);
          height: calc(100% + 2px);
          background: #d02d54;
        }
        &:hover {
          &::after {
            border: 1px solid;
          }
        }
      }*/
      /*  img {
        position: relative;
        width: 16px;
        height: 16px;
        margin-right: 3px;
        vertical-align: sub;
        z-index: 1;
      }
    */

      /* &.five-league-normal {
        width: 86px;
        span {
          background: -webkit-linear-gradient(#3F60D0, #021D77);
        }
        &:hover {
          &::after {
            background-image: linear-gradient(92deg, #3F60D0 0%, #021D77 100%);
          }
        }
      }
      &.five-league-active {
        width: 86px;
        &::after {
          background-image: linear-gradient(92deg, #3F60D0 0%, #021D77 100%);
        }
      }
      &.nba-normal {
        width: 60px;
        span {
          background: -webkit-linear-gradient(#F4993E, #F45610);
        }
        &:hover {
          &::after {
            background-image: linear-gradient(92deg, #F4A73E 0%, #F45610 100%);
          }
        }
      }
      &.nba-active {
        width: 60px;
        &::after {
          background-image: linear-gradient(92deg, #F4A73E 0%, #F45610 100%);
        }
      }
      &.five-league-normal, &.nba-normal {
        span {
          font-weight: bolder;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        &::after {
          border: none;
        }
        &:hover {
          span {
            color: #FFF;
            background: none;
            -webkit-background-clip: unset;
            -webkit-text-fill-color: unset;
          }
        }
      }
      &.five-league-active, &.nba-active {
        span {
          color: #FFF;
          background: none;
          -webkit-background-clip: unset;
          -webkit-text-fill-color: unset;
        }
        &::after {
          border: none;
          border-radius: 4px;
        }
      }
      &.fifa-normal {
        width: 72px;
        font-size: 13px;
        font-weight: bolder;
        background: -webkit-linear-gradient(#CC0742, #770225, #770225);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        &:hover {
          color: white;
          -webkit-background-clip: unset;
          -webkit-text-fill-color: unset;
          background-size: 100% 100%;
          background-image: url('/static/images/fifa-nav-bg.png');
        }
      }
      &.fifa-active {
        color: white;
        -webkit-background-clip: unset;
        -webkit-text-fill-color: unset;
        background-size: 100% 100%;
        background-image: url('/static/images/fifa-nav-bg.png');
      }*/
    }
  }

  .type-section {
    border-radius: 4px;
    margin-bottom: 8px;
    background-color: white;
    box-shadow: 0 0 5px rgba($color: #a6a6a6, $alpha: 0.2);
    .sort-header {
      background: #2c3041;
      padding: 9px 16px;
      border-radius: 2px 2px 0 0;
      color: #fff;
      .sort-title {
        display: inline-block;
        font-size: 16px;
        vertical-align: super;
        img {
          width: 18px;
          height: 18px;
          margin-right: 5px;
          vertical-align: sub;
        }
      }
      .more {
        float: right;
        margin-top: 3px;
        font-size: 14px;
        &:hover {
          opacity: 0.8;
        }
        i {
          display: inline-block;
          width: 18px;
          height: 14px;
          background: url(/static/images/home/icon-jt-1.png) no-repeat;
          background-size: 100% 100%;
          margin-left: 3px;
        }
      }
    }
    .empty-list {
      font-size: 14px;
      text-align: center;
      padding: 15px 25px 20px;
      color: #9497a4;
    }
    .sort-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #333;
      padding: 16px 15px;
      background: linear-gradient(270deg, #fff 50%, #fff8fa 100%);
      margin-bottom: 4px;
      &:last-child {
        border-bottom: none;
      }
      .match-left-info {
        display: flex;
        align-items: center;
        text-align: center;
        width: 290px;
        font-weight: 500;
        .match-time-info {
          width: 50px;
          .match-time {
            font-size: 16px;
            letter-spacing: 1px;
          }
          .match-date {
            line-height: 1;
            color: #999;
            font-size: 12px;
          }
        }
        .competition-name {
          text-align: left;
          width: 170px;
          padding: 0 5px 0 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
        }
        .match-state {
          min-width: 40px;
        }
      }
      .match-main-info {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 442px;
        font-weight: 500;
        .team-name {
          width: 120px;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          &.left-team {
            text-align: right;
          }
          &.right-team {
            text-align: left;
          }
        }
        .match-score {
          min-width: 86px;
          font-size: 24px;
          text-align: center;
          margin: 0 5px;
          span {
            &:nth-child(2) {
              padding: 0 3px;
            }
          }
        }
      }
      .match-right-info {
        display: flex;
        justify-content: flex-end;
        width: 200px;
        .anchor-info {
          position: relative;
          .anchor-icon {
            //animation: shining 2s ease infinite alternate;
            text-align: center;
            cursor: pointer;
            width: 108px;
            height: 30px;
            line-height: 30px;
            border: 1px solid #d02d54;
            color: #d02d54;
            img {
              width: 20px;
              height: 20px;
              margin-left: 5px;
            }
            @keyframes shining {
              10% {
                transform: scale(1.2);
              }
              20% {
                transform: scale(1);
              }
              30% {
                transform: rotate(5deg);
              }
              40% {
                transform: rotate(-5deg);
              }
              50% {
                transform: rotate(5deg);
              }
              60% {
                transform: rotate(-5deg);
              }
              65% {
                transform: rotate(0);
              }
            }
          }
          .hover-anchor-pannel {
            display: none;
            min-width: 165px;
            width: max-content;
            height: auto;
            position: absolute;
            bottom: -1px;
            right: 8px;
            z-index: 99;
            padding: 8px;
            transform: translate(5%, 98%);
            border-radius: 2px;
            background: linear-gradient(316.31deg, #13151e 31.05%, #b12043 91.21%);
            box-shadow: 0 6px 12px rgba(99, 69, 83, 0.05);
            .pannel-title {
              font-size: 12px;
              padding: 0 0 5px;
              color: #fff0db;
              border-bottom: 1px solid rgba(0, 0, 0, 0.2);
            }
            .anchor-list {
              min-width: 100%;
              max-width: max-content;
              padding: 4px 4px;
              margin: 4px 0;
              cursor: pointer;
              color: #fff;
              .live-lable {
                animation: shining 2s ease infinite alternate;
              }
              /*.live-lable {
                display: inline-block;
                color: #5c4625;
                padding: 0 5px;
                margin-left: 10px;
                border-radius: 3px;
                background-color: #f0b864;
                transform: scale(0.8);
                span {
                  display: inline-block;
                  width: 3px;
                  height: 10px;
                  background-color: rgb(128, 96, 65);
                  border-radius: 2px;
                  margin-right: 1px;
                  transform-origin: bottom;
                  animation: bounce 2.2s ease infinite alternate;
                  &:nth-of-type(2) {animation-delay: -2.2s;}
                  &:nth-of-type(3) {animation-delay: -3.7s;}
                }
              }*/
              /*       @keyframes bounce {
                10% {transform: scaleY(0.3);}
                30% {transform: scaleY(1);}
                60% {transform: scaleY(0.5);}
                80% {transform: scaleY(0.75);}
                100% {transform: scaleY(0.6);}
              }

              */
              &:hover {
                border-radius: 2px;
                background: linear-gradient(
                  116.75deg,
                  rgba(255, 139, 70, 0.3) -36.81%,
                  rgba(208, 45, 84, 0.3) 69.05%,
                  rgba(182, 119, 245, 0.3) 135.08%
                );
                /*   .live-lable {
                  color: #f9efe0;
                  background-color: #df310e;
                  span {
                    background-color: #f9efe0;
                  }
                }*/
              }
            }
          }
          &.show-panel:hover {
            .anchor-icon {
              animation-play-state: paused;
            }
            .hover-anchor-pannel {
              display: block;
            }
          }
        }
        .mlive-button {
          text-align: center;
          width: 108px;
          height: 30px;
          line-height: 30px;
          margin-left: 15px;
          border: 1px solid #bcbcbc;
          color: #bcbcbc;
          border-radius: 2px;
          &:hover {
            transform: scale(1.01);
          }
          img {
            width: 18px;
            height: 18px;
            cursor: pointer;
            &:hover {
              filter: contrast(1.2) hue-rotate(10deg);
            }
            &.gray-effect {
              filter: grayscale(1) brightness(1.15);
              cursor: default;
            }
          }
        }
        .mlive-button-1 {
          border: 1px solid #d02d54;
          color: #d02d54;
        }
      }
    }
    &.type-section-type2 {
      .sort-list {
        background: linear-gradient(270deg, #fff 50%, #f9f8ff 100%);
        .match-main-info {
          .match-score {
            min-width: 65px;
          }
        }
      }
    }
    &.type-section-type3 {
      .sort-list {
        background: linear-gradient(270deg, #fff 50%, #f2f2f2 100%);
      }
    }
  }
}
</style>
