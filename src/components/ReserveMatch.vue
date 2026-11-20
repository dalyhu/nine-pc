<template>
  <div class="reserve-match">
    <section class="content-box" v-infinite-scroll="loadMore" infinite-scroll-immediate="false">
      <div class="item-li" v-for="(item, index) in dataList" :data-index="index" :key="index">
        <div class="top">{{ item.name }}</div>
        <div class="con-1 flex flex-wrap" :title="item.home_name">
          <div class="left flex">
            <df-image-lazy
              placeholder-src="/static/images/placeholder_gray_bg.png"
              fit="cover"
              :src="item.home_logo"
              :error-icon="defaultTeamAvatar"
            />
            <span class="name">{{ item.home_name }}</span>
          </div>
          <div class="right">{{ item.start2 }} {{ item.start }} 的比赛</div>
        </div>
        <div class="con-1 con-2 flex flex-wrap" :title="item.away_name">
          <div class="left flex">
            <df-image-lazy
              placeholder-src="/static/images/placeholder_gray_bg.png"
              fit="cover"
              :src="item.away_logo"
              :error-icon="defaultTeamAvatar"
            />
            <span class="name">{{ item.away_name }}</span>
          </div>
          <div class="right">
            {{ returnTxt(item.match_time) }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defaultTeamAvatar } from '@/utils/common'

export default {
  name: 'FoucusAnchorMatch',
  props: {
    dataList: {
      type: Array
    },
    isLoading: {
      type: Boolean
    }
  },
  data() {
    return {
      defaultTeamAvatar,
      loadingStaus: false
    }
  },
  methods: {
    returnTxt(matchTime) {
      const now = new Date().getTime() / 1000
      let txt = ''
      if (now > matchTime) {
        txt = '您预约的比赛开始了'
      }
      return txt
    },
    // 加载更多
    loadMore() {
      if (!this.isLoading) {
        this.$emit('getParentData')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.reserve-match {
  padding: 0 0 10px;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
  }
  .item-li {
    font-size: 12px;
    padding: 9px 12px;
    border-bottom: 1px solid #efefef;
    .top {
      color: #151515;
      font-weight: bold;
      margin-bottom: 6px;
    }
    .con-1 {
      color: #666564;
      margin-bottom: 4px;
      .left {
        .el-image {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin-right: 4px;
        }
        .name {
          width: 70px;
          line-height: 24px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .right {
        line-height: 24px;
        flex: auto;
        text-align: right;
      }
    }
    .con-2 {
      .right {
        text-align: center;
        color: #c61d48;
      }
    }
  }
}
</style>
