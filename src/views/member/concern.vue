<!-- 我的关注 -->
<template>
  <div class="i-tabs-container">
    <div class="header-nav" style="margin-bottom: 0">
      <a v-for="(item, index) in tabList" :key="index" @click="tabIndex = index">
        <div
          class="item"
          :class="[{ 'first-item': index == tabIndex }, { 'first-active': index != 0 }]"
        >
          {{ item }}
        </div>
      </a>
    </div>
    <div class="tab-pane-item" name="我关注的主播">
      <div class="concern-anchor concern-common">
        <div class="anchor-list uc-anchor-list">
          <!-- 有数据 -->
          <div v-if="paginatedData.length > 0" class="item-wrap">
            <div class="item" v-for="(item, index) in paginatedData" :key="index">
              <div class="left">
                <a class="iconBox">
                  <div class="lazyload-wrapper">
                    <img class="icon" :src="item.avatar" @error="$common.errorImg($event)" />
                    <span :class="['live-staust', item.status === 1 && `status-${item.status}`]">
                      {{ item.status === 1 ? '直播中' : '未开播' }}
                    </span>
                  </div>
                </a>
                <a class="des">
                  <div :class="['gun-title', 'ellipsis', `right-b_${item.status}`]">
                    <div class="title-text ellipsis">{{ item.user_nickname }}</div>
                  </div>
                  <span :class="['gun-title', `right-b_${item.status}`]" v-if="item.title">
                    <df-marquee :spacing="50">{{ item.title }}</df-marquee>
                  </span>
                </a>
              </div>
              <!-- 1 未开播，0 预约直播，1 直播中 -->
              <div class="origant-button flex">
                <div class="btn-close" @click="handleGoVideoFun(item)" v-if="item.status === 1">
                  进入直播间
                </div>
                <div class="status-btn-close" v-if="item.status !== 1 && item.status !== -1">
                  <div>开播时间</div>
                  <div class="reserve-style">{{ returnStatusTxt(item) }}</div>
                </div>
                <div class="btn-close" @click="handleAttentionFun(item)">取消关注</div>
              </div>
            </div>
          </div>
          <!-- 暂无数据 -->
          <div v-else class="common-empty-view">
            <DfEmpty />
          </div>
        </div>

        <!-- 前段做分页 -->
        <div class="pagination">
          <button @click="handlePrevPage" :disabled="currentPage === 1">上一页</button>
          <span class="current-page">第{{ currentPage }}页/共{{ totalPages }}页</span>
          <button @click="handleNextPage" :disabled="currentPage === totalPages">下一页</button>
        </div>
      </div>
    </div>

    <!-- 取消关注2次提示 -->
    <DfDialog
      v-model:isDialog="isDialog"
      closeTest="取消"
      :showText="`您确定对主播【${itemAnchor?.user_nickname}】取消关注吗?`"
      @_updataAttentFun="_updataAttentFun"
    />
  </div>
</template>

<script>
import mittBus from '@/utils/mittBus'
import { getAttentionFoucusList, attention } from '../../api/user.js'
import DfDialog from '@/components/dfDialog/index.vue'
import dfMarquee from '@/components/dfMarquee/index.vue'
import { getQueryString } from '@/utils'
export default {
  components: { DfDialog, dfMarquee },
  data() {
    return {
      isDialog: false,
      pageSize: 8,
      itemAnchor: null,
      currentPage: 1, // 当前页
      list: [],
      tabIndex: 0,
      tabList: [
        '我关注的主播'
        // '我关注的作者', '我关注的用户'
      ]
    }
  },
  computed: {
    totalPages({ list, pageSize }) {
      return Math.ceil(list.length / pageSize)
    },
    // 当前页的数据
    paginatedData({ currentPage, pageSize }) {
      const start = (currentPage - 1) * pageSize
      const end = start + pageSize
      return this.list.slice(start, end)
    }
  },
  watch: {
    tabIndex() {
      this.attentionList()
    }
  },
  mounted() {
    this.attentionList()
  },
  methods: {
    returnStatusTxt(data) {
      let strs = ''
      if (data.starttime) {
        strs = `${this.$common.timeStamp1(data.starttime)}`
      }
      return strs?.replaceAll('-', '/')
    },
    // 获取列表
    attentionList() {
      getAttentionFoucusList({ page: 1 })
        .then((res) => {
          if (res.code === 0) {
            this.list = res.data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    // 上一页
    handlePrevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    // 下一页
    handleNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },

    // 取消关注
    handleAttentionFun(item) {
      this.isDialog = true
      this.itemAnchor = item
    },

    _updataAttentFun() {
      attention({ id: this.itemAnchor?.anchor_id })
        .then(() => {
          mittBus.emit('anchorFollowStatusChange', {
            status: false,
            id: this.itemAnchor?.anchor_id
          })
          this.attentionList()
          this.isDialog = false
          ElMessage({ message: '操作成功!', type: 'success' })
        })
        .catch(() => {
          this.isDialog = false
        })
    },

    // 进入直播间
    handleGoVideoFun(item) {
       /** 看是否是robot直播  还是回放 */
      this.$store.commit('house/setIsRobotAction', item?.iszr)
      this.$store.commit('house/setIsReplayAction', item?.isRecord)

      const live_path = `/live?router=iframe&uid=${item?.anchor_id}`
      let route = this.$router.resolve({ path: live_path, query: { ...getQueryString(live_path) } })
      window.open(route.href, '_self')
    }
  }
}
</script>

<style lang="scss" scoped>
.gun-title {
  width: 165px;
  &.right-b_1 {
    width: 185px !important;
  }
}
.origant-button {
  font-size: 12px;
  .status-btn-close {
    text-align: right;
    width: 103px;
    margin-right: 5px;
    .reserve-style {
      background: #faeaee;
      color: #d02d54;
      padding: 3px 0;
      text-align: center;
      border-radius: 3px;
    }
  }
  .btn-close {
    display: inline-block;
    width: 72px;
    height: 24px;
    border: 1px solid #d8ad66;
    border-radius: 2px;
    color: #b08a5b;
    text-align: center;
    line-height: 24px;
    &:first-child {
      margin-right: 5px;
    }
  }
}
.pagination {
  margin: 10px auto;
  text-align: center;
  .current-page {
    padding: 0 15px;
  }
  button {
    cursor: pointer;
    color: #d02d54;
    background: transparent;
  }
}

.uc-anchor-list {
  height: 510px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
  }
}

.concern-common .item-wrap {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  overflow-y: auto;
  padding: 13px 20px 80px;
}

.concern-common .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 439px;
  height: 85px;
  padding: 0 10px;
  margin-top: 12px;
  border-radius: 8px;
  border: 1px solid #eee;
  background-color: #fff;
  cursor: pointer;
}

.concern-common .item:nth-child(2n-1) {
  margin-right: 12px;
}

.concern-common .item:hover {
  background-color: #fffbf8;
}

.concern-common .btn,
.concern-common .item .left {
  display: flex;
  align-items: center;
}

.concern-common .btn {
  justify-content: center;
  width: 73px;
  height: 26px;
  border-radius: 4px;
  border: 0.5px solid #ddd;
  text-align: center;
  font-size: 12px;
  color: #ccc;
  cursor: pointer;
  user-select: none;
}

.concern-common .btn:hover {
  color: #d8ad66;
  border: 0.5px solid #d8ad66;
}

.concern-common .btnAdd {
  width: 73px;
  height: 26px;
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MyIgaGVpZ2h0PSIyNiIgdmlld0JveD0iMCAwIDczIDI2Ij4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ieHdxb252amE2YSIgeDE9IjAlIiB4Mj0iMTAwJSIgeTE9IjQyLjMzNSUiIHkyPSI1Ni4zNDMlIj4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0VFQ0ZCNSIvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNEOEFENjYiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgogICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8Zz4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBmaWxsPSJ1cmwoI3h3cW9udmphNmEpIiBkPSJNNCAwaDY1YzIuMjEgMCA0IDEuNzkgNCA0djE4YzAgMi4yMS0xLjc5IDQtNCA0SDRjLTIuMjEgMC00LTEuNzktNC00VjRjMC0yLjIxIDEuNzktNCA0LTR6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNjMgLTI5MSkgdHJhbnNsYXRlKDMzIDQ4KSB0cmFuc2xhdGUoMzAgMjQzKSIvPgogICAgICAgICAgICAgICAgICAgIDxnIGZpbGw9IiNGRkYiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTkuMTA3IDUuNTZINS41NnYzLjU0N2MwIC4yMDYtLjI1LjU2LS41Ni41Ni0uMzEgMC0uNTYtLjM1NC0uNTYtLjU2VjUuNTZILjg5M2MtLjIwNiAwLS41Ni0uMjUtLjU2LS41NiAwLS4zMS4zNTQtLjU2LjU2LS41Nkg0LjQ0Vi44OTNjMC0uMjA2LjI1LS41Ni41Ni0uNTYuMzEgMCAuNTYuMzU0LjU2LjU2VjQuNDRoMy41NDdjLjIwNiAwIC41Ni4yNS41Ni41NiAwIC4zMS0uMzU0LjU2LS41Ni41NnoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02MyAtMjkxKSB0cmFuc2xhdGUoMzMgNDgpIHRyYW5zbGF0ZSgzMCAyNDMpIHRyYW5zbGF0ZSgxNyA0KSB0cmFuc2xhdGUoMCA0KSIvPgogICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IGZvbnQtZmFtaWx5PSJNaWNyb3NvZnRZYUhlaSwgTWljcm9zb2Z0IFlhSGVpIiBmb250LXNpemU9IjEyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNjMgLTI5MSkgdHJhbnNsYXRlKDMzIDQ4KSB0cmFuc2xhdGUoMzAgMjQzKSB0cmFuc2xhdGUoMTcgNCkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRzcGFuIHg9IjE1IiB5PSIxMyI+5YWz5rOoPC90c3Bhbj4KICAgICAgICAgICAgICAgICAgICAgICAgPC90ZXh0PgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg==)
    no-repeat 50%;
  cursor: pointer;
  user-select: none;
}

.concern-common .btnAdd:hover {
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNzMiIGhlaWdodD0iMjYiIHZpZXdCb3g9IjAgMCA3MyAyNiI+CiAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9IjJkZDNvenp2bGEiIHgxPSIwJSIgeDI9IjEwMCUiIHkxPSI0Mi4zMzUlIiB5Mj0iNTYuMzQzJSI+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNFRUNGQjUiLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRDhBRDY2Ii8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8cGF0aCBpZD0iZGtsMHltcXZuYiIgZD0iTTQgMGg2NWMyLjIxIDAgNCAxLjc5IDQgNHYxOGMwIDIuMjEtMS43OSA0LTQgNEg0Yy0yLjIxIDAtNC0xLjc5LTQtNFY0YzAtMi4yMSAxLjc5LTQgNC00eiIvPgogICAgPC9kZWZzPgogICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8Zz4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTU4IC0yOTEpIHRyYW5zbGF0ZSgzMyA0OCkgdHJhbnNsYXRlKDEyNSAyNDMpIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSBmaWxsPSJ1cmwoIzJkZDNvenp2bGEpIiB4bGluazpocmVmPSIjZGtsMHltcXZuYiIvPgogICAgICAgICAgICAgICAgICAgICAgICA8dXNlIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjA1IiB4bGluazpocmVmPSIjZGtsMHltcXZuYiIvPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8ZyBmaWxsPSIjRkZGIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGcgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik05LjEwNyA1LjU2SDUuNTZ2My41NDdjMCAuMjA2LS4yNS41Ni0uNTYuNTYtLjMxIDAtLjU2LS4zNTQtLjU2LS41NlY1LjU2SC44OTNjLS4yMDYgMC0uNTYtLjI1LS41Ni0uNTYgMC0uMzEuMzU0LS41Ni41Ni0uNTZINC40NFYuODkzYzAtLjIwNi4yNS0uNTYuNTYtLjU2LjMxIDAgLjU2LjM1NC41Ni41NlY0LjQ0aDMuNTQ3Yy4yMDYgMCAuNTYuMjUuNTYuNTYgMCAuMzEtLjM1NC41Ni0uNTYuNTZ6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTU4IC0yOTEpIHRyYW5zbGF0ZSgzMyA0OCkgdHJhbnNsYXRlKDEyNSAyNDMpIHRyYW5zbGF0ZSgxNyA0KSB0cmFuc2xhdGUoMCA0KSIvPgogICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IGZvbnQtZmFtaWx5PSJNaWNyb3NvZnRZYUhlaSwgTWljcm9zb2Z0IFlhSGVpIiBmb250LXNpemU9IjEyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTU4IC0yOTEpIHRyYW5zbGF0ZSgzMyA0OCkgdHJhbnNsYXRlKDEyNSAyNDMpIHRyYW5zbGF0ZSgxNyA0KSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHNwYW4geD0iMTUiIHk9IjEzIj7lhbPms6g8L3RzcGFuPgogICAgICAgICAgICAgICAgICAgICAgICA8L3RleHQ+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K)
    no-repeat 50%;
}
.concern-anchor {
  height: 100%;
}

.concern-anchor .no-data img.no-data-img {
  width: 300px !important;
  height: 240px !important;
}

.concern-anchor .anchor-list .item:hover .title,
.concern-anchor .anchor-list .item:hover .txt {
  color: #b08a5b;
}

.concern-anchor .anchor-list .item .iconBox {
  width: 54px;
  height: 54px;
}

.concern-anchor .anchor-list .item .hotLive {
  position: relative;
}

.concern-anchor .anchor-list .item .hotLive:before {
  content: '';
  display: block;
  position: absolute;
  width: 76px;
  height: 76px;
  top: -3px;
  left: -7px;
  background: url(data:image/png;base64,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)
    0 0 no-repeat;
  background-size: 68px 68px;
}

.concern-anchor .anchor-list .item .hot {
  position: relative;
}

.concern-anchor .anchor-list .item .hot:before {
  content: '';
  display: block;
  position: absolute;
  width: 68px;
  height: 68px;
  top: -3px;
  left: -7px;
  background: url(data:image/png;base64,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)
    0 0 no-repeat;
  background-size: 68px 68px;
}

.concern-anchor .anchor-list .item .live {
  position: relative;
}

.concern-anchor .anchor-list .item .live:before {
  content: '';
  display: block;
  position: absolute;
  width: 68px;
  height: 68px;
  top: -3px;
  left: -7px;
  background: url(data:image/png;base64,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)
    0 0 no-repeat;
  background-size: 68px 68px;
}

.concern-anchor .anchor-list .item img.icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.concern-anchor .anchor-list .item .des {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 10px;
}

.concern-anchor .anchor-list .item .title {
  display: flex;
  justify-items: flex-start;
  align-items: center;
  line-height: 22px;
  height: 22px;
  color: #333;
  width: 185px;
}

.concern-anchor .anchor-list .item .title .title-text {
  max-width: 133px;
  font-size: 14px;
  line-height: 22px;
  height: 22px;
  font-weight: 700;
}
.concern-anchor .anchor-list .item .txt {
  width: 185px;
  margin-top: 4px;
  font-size: 12px;
  color: #a8a8a8;
}

.lazyload-wrapper {
  position: relative;
  margin-right: 10px;
  .live-staust {
    position: absolute;
    bottom: -10px;
    right: -10px;
    display: block;
    color: #a8a8a8;
    width: 100%;
    text-align: center;
    font-size: 11px;
    padding: 3px 0;
    border-radius: 8px 0 8px 0;
    background: #f0f0f0;
    &.status-1 {
      color: #35924f;
      background: #ebf9ee;
    }
  }
}
</style>
