<!-- 预约 -->
<template>
  <div class="anchor-page-content-wrap anchor-page-content-wrap-not-home member-reserve">
    <div class="reserve-page-main">
      <div class="title-box">
        <div class="title">预约观看</div>
      </div>
      <div class="content-box-wrap">
        <template v-if="listData.length > 0">
          <section
            class="content-box"
            v-infinite-scroll="loadMore"
            infinite-scroll-immediate="false"
            v-loading="loadingStaus"
          >
            <div class="content-box-reserve" v-for="(item, index) in listData" :key="index">
              <div class="date-box">
                <div class="icon"></div>
                <div class="date">{{ item.name }}</div>
              </div>
              <div class="content-box-item" v-for="item1 in item.list" :key="item1.id">
                <div class="reserve-match-item reserve-match-item-2">
                  <div class="team-info">
                    <div class="team-row">
                      <img
                        :src="item1.home_logo ? item1.home_logo : teamLogo"
                        width="32"
                        height="32"
                      /><span class="team-name">{{ item1.home_name }}</span
                      ><span class="score">{{ item1.home_scores }}</span>
                    </div>
                    <div class="team-row">
                      <img
                        :src="item1.away_logo ? item1.away_logo : teamLogo"
                        width="32"
                        height="32"
                      /><span class="team-name">{{ item1.away_name }}</span
                      ><span class="score">{{ item1.away_scores }}</span>
                    </div>
                  </div>
                  <div class="league-info">
                    <div class="league-info-wrap">
                      <div class="league-name" title="中甲">{{ item1.name }}</div>
                      <div class="league-time">{{ item1.start }}</div>
                    </div>
                    <div class="league-status-wrap" @click="reserveMatch(item1)">
                      <div class="league-status">
                        <div class="already-reserve-button"></div>
                      </div>
                    </div>
                  </div>
                  <div class="anchor-list-container">
                    <!-- <div class="pre-button disabled"></div>
								<div class="next-button "></div> -->
                    <div class="anchor-list">
                      <ul style="width: 498px; margin-left: 0px">
                        <li
                          class="anchor-item"
                          v-for="(item2, index2) in item1.anchorList"
                          :key="index2"
                        >
                          <div class="img-wrap">
                            <img :src="item2.avatar" width="48" height="48" />
                          </div>
                          <div class="anchor-name">{{ item2.user_nickname }}</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </template>
        <div class="no-data-react" v-if="listData.length == 0">
          <DfEmpty description="暂无数据" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import teamLogo from '/static/images/team.png'
import { reserveMatch2, getUserReserveLiveList } from '../../api/user.js'
import mittBus from '@/utils/mittBus'

export default {
  data() {
    return {
      teamLogo,
      page: 1,
      listData: [],
      listOrigin: [], // 初始的数据
      // detail:{},//分页使用
      loading: false,
      loadStatus: 'more',
      loadingStaus: false,
      loadingFlage: false // 是否在加载中
    }
  },
  mounted() {
    this.getUserReserveLiveList()
  },
  methods: {
    // 取消预约
    reserveMatch(item) {
      reserveMatch2({ match_id: item.match_id, type: item.type })
        .then(() => {
          // this.getUserReserveLiveList()
          // 删除当前取消预约的赛事
          this.listOrigin = this.listOrigin.filter((item_1) => item_1.id !== item.id)
          this.listData = this.resetDataArr()
          mittBus.emit('contestReserveStatusChange', { status: false, id: item.match_id })
          this.$message.success('操作成功')
        })
        .catch(() => {})
    },
    // 获取预约列表
    getUserReserveLiveList() {
      if (this.loadingFlage) {
        return
      }
      this.loadingFlage = true
      getUserReserveLiveList({ page: this.page })
        .then((res) => {
          // this.list = res.data.data
          // console.log(res.data.data)
          this.listOrigin = [...this.listOrigin, ...res.data.data]
          console.log(this.listOrigin)
          // res.data.data = []
          this.listData = this.resetDataArr()
          console.log(this.listData)
          // this.detail = res.data;
          // console.log(this.listData)
          if (this.page < res.data.last_page) {
            this.page = this.page + 1
            this.loading = true
            this.loadStatus = 'more'
          } else {
            this.loadStatus = 'noMore'
          }

          // 加载更多的时候会触发两次，在这里做个限制重复请求
          setTimeout(() => {
            this.loadingFlage = false
          }, 1 * 1000)
        })
        .catch((res) => {
          // 加载更多的时候会触发两次，在这里做个限制重复请求
          setTimeout(() => {
            this.loadingFlage = false
          }, 1 * 1000)
        })
    },
    // 数据重整
    resetDataArr() {
      if (this.listOrigin.length === 0) {
        return []
      }
      // 相同key 值数据放在一起
      let list = []
      this.listOrigin.map((item, index) => {
        let obj = {
          name: item.key,
          list: [item]
        }
        // console.log(item);
        this.listOrigin.map((option, optionIndex) => {
          if (item.key == option.key && optionIndex > index) {
            // obj.list = [...obj.list, ...[option]]
            obj.list.push(option)
          }
        })
        let intos = list.filter((res) => {
          return res.name == obj.name
        })
        if (intos.length) return
        list.push(obj)
      })
      return list
    },
    // 加载更多
    loadMore(e) {
      if (this.loadStatus == 'more' && this.loading) {
        // this.loading = false
        this.getUserReserveLiveList()
      }
    }
  }
}
</script>

<style lang="scss">
.reserve-page-main .title-box .title {
  height: 50px;
  font-size: 16px;
  line-height: 50px;
  text-align: center;
  width: 140px;
  color: #bb9352;
  font-weight: 700;
  border-bottom: 1px solid #d8ad66;
  background-image: url(/static/images/tab-bar-xuanzhongqianbu.png);
  background-size: cover;
}

.content-box-wrap {
  position: relative;
  height: calc(100vh - 190px);
  width: 1192px;
  overflow-y: auto;
  background-color: #fafafa;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 4px;
  padding-bottom: 42px;
}

.no-data-react {
  position: absolute;
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
}

.no-data-react .no-data-img {
  width: 276px;
  height: 221px;
}

.no-data-react .no-data-text {
  position: relative;
  top: -60px;
  font-size: 16px;
  color: #999;
}
.reserve-match-item.reserve-match-item-2 .league-info {
  width: 320px;
}
</style>
<style lang="scss" scoped>
.anchor-page-content-wrap.member-reserve {
  width: 100%;
  margin: 0;
  padding-top: 0;
  .reserve-page-main {
    width: 100%;
    .content-box-wrap {
      width: 100%;
      height: calc(100vh - 267px);
    }
  }
}
</style>
