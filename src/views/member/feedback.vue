<!-- 悄悄话留言板 -->
<template>
  <div class="i-tabs-container flag_member_feedback">
    <div class="header-nav">
      <div class="item first-item">消息夹</div>
    </div>
    <div class="header_right">
      <div class="add_feedback" @click="addFeedback"><span>我要反馈</span></div>
    </div>
    <div class="tab-pane-item" name="悄悄话留言板">
      <div class="feedback_container" v-if="listData.length !== 0">
        <section class="feedback_list">
          <div class="item" v-for="(item, index) in listData" :key="item.id">
            <hgroup class="hgroup">
              您于{{ item.dateStr }}送出的反馈{{ item.hasReply ? '有了回应' : '' }}：
            </hgroup>
            <!-- <hgroup>您于xxxx年x送出的反馈有了回应：</hgroup> -->
            <!-- 初始反馈 -->
            <div class="info">
              <span class="category">{{ item.category.name }}</span>
              <!-- 反馈内容，最多显示两行 -->
              <div class="content">{{ getText(item.message[0].message_text) }}</div>
            </div>
            <!-- 收到的回应 -->
            <div class="replay" v-if="item.hasReply" @click="showDetail(index)">
              <div class="time">{{ item.lastReplyDateStr }}</div>
              <div class="detail">{{ getText(item.lastReply.message_text) }}</div>
            </div>
          </div>
        </section>
        <!-- 分页按钮 -->
        <div class="ant-pagination" unselectable="unselectable">
          <el-pagination
            background
            :page-size="per_page"
            v-model:current-page="page"
            layout="prev, pager, next"
            :total="total"
          />
        </div>
      </div>

      <div class="no-data-react" v-if="listData.length == 0">
        <DfEmpty description="暂无数据" />
      </div>
    </div>

    <el-dialog
      class="feedback_detail_popper"
      v-model="detailVistble"
      width="537px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      top="30vh"
    >
      <feedbackDetail
        :detail="listData[detailIndex]"
        @close="close"
        @afterSubmit="afterSubmit"
      ></feedbackDetail>
    </el-dialog>
  </div>
</template>

<script>
import { list } from '@/api/feedback.js'
import { formatDate, formatTime2 as formatTime } from '@/utils'
import xssFilter from '@/utils/xssFilter'
import feedbackDetail from '@/components/feedbackDetail.vue'
import mittBus from '@/utils/mittBus'
export default {
  name: 'FeedbackPanel',
  components: {
    feedbackDetail
  },
  data() {
    return {
      listData: [],
      per_page: 4,
      page: 1,
      total: 0,
      detailIndex: 0,
      detailVistble: false
    }
  },
  watch: {
    page() {
      this.getList()
    }
  },
  mounted() {
    this.getList()
    mittBus.on('updateFeedbackList', (v) => {
      if (this.$route.path === '/member') {
        this.page = 1
        this.getList()
      }
    })
  },
  methods: {
    addFeedback() {
      this.$store.commit('setFeedbackPopupVisible', true)
    },
    getText(str) {
      if (!str) return
      str = xssFilter(str)
      return str
    },
    getList() {
      let params = {
        per_page: this.per_page,
        page: this.page
      }
      list(params)
        .then((res) => {
          if (res.code === 0) {
            this.total = res.data.total
            this.listData = res.data.data.map((item) => {
              item.message = item.message.map((msg) => {
                if (msg.sender_id === item.user_id) msg.isMySelf = true
                return msg
              })
              if (item.message.filter((it) => !it.isMySelf).length > 0) {
                item.hasReply = true
                item.lastReply = item.message.filter((it) => !it.isMySelf).slice(-1)[0]
                item.lastReplyDateStr = formatDate(item.lastReply.created_at)
              } else {
                item.hasReply = false
              }
              let str = formatTime(item.created_at * 1000, 'yyyy-MM-dd').split('-')
              item.dateStr = str[0] + '年' + str[1] + '月' + str[2] + '日'
              return item
            })
          } else {
            this.$message({
              message: res.msg || res.data?.msg || '反馈列表获取失败',
              type: 'error',
              customClass: 'feedback_message'
            })
          }
        })
        .catch((err) => {
          this.$message({
            message: err.msg || err.data?.msg || '反馈列表获取失败',
            type: 'error',
            customClass: 'feedback_message'
          })
        })
    },
    showDetail(i) {
      this.detailIndex = i
      this.detailVistble = true
    },
    close() {
      this.detailVistble = false
    },
    // getBasketballInfo(feedbacksId) {
    //   info({ feedbacksId })
    //     .then((res) => {
    //       if (res.code === 0) {
    //         let item = res.data
    //         item.message = item.message.map((msg) => {
    //           if (msg.sender_id === item.user_id) msg.isMySelf = true
    //           return msg
    //         })
    //         if (item.message.filter((it) => !it.isMySelf).length > 0) {
    //           item.hasReply = true
    //           item.lastReply = item.message.filter((it) => !it.isMySelf).slice(-1)[0]
    //           item.lastReplyDateStr = formatDate(item.lastReply.created_at)
    //         } else {
    //           item.hasReply = false
    //         }
    //         let str = formatTime(item.created_at * 1000, 'yyyy-MM-dd').split('-')
    //         item.dateStr = str[0] + '年' + str[1] + '月' + str[2] + '日'
    //         this.$set(this.listData, this.detailIndex, item)
    //       } else {
    //         this.$message({
    //           message: res.msg || res.data?.msg || '反馈详情获取失败',
    //           type: 'error',
    //           customClass: 'feedback_message'
    //         })
    //       }
    //     })
    //     .catch((err) => {
    //       this.$message({
    //         message: err.msg || err.data?.msg || '反馈详情获取失败',
    //         type: 'error',
    //         customClass: 'feedback_message'
    //       })
    //     })
    // },
    afterSubmit(message) {
      message.isMySelf = true
      this.listData[this.detailIndex].message.push(message)
    }
  }
}
</script>

<style lang="scss">
.feedback_detail_popper {
  height: 497px;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 24px 16px;
    height: 100%;
  }
}
</style>
<style lang="scss" scoped>
.flag_member_feedback {
  font-family: var(--fontFamily-PingFangSC);
  .header-nav {
  }
  .header_right {
    position: absolute;
    top: 9px;
    right: 19px;
    background: var(--el-color-primary);
    cursor: pointer;
    color: #fff;
    .add_feedback {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 110px;
      height: 32px;
      font-size: 0;
      span {
        font-size: 14px;
        font-family: var(--fontFamily-PingFangSC);
        font-weight: 400;
      }
    }
  }
  .tab-pane-item {
    padding-left: 0;
    height: 586px;
  }
  .feedback_container {
    height: 100%;
    padding-bottom: 65px;
    // overflow-y: auto;
    // &::-webkit-scrollbar {
    //     width: 5px;
    // }
    .feedback_list {
      height: 100%;
      overflow-y: auto;
      .item {
        background: #fff;
        padding: 20px;
        border-bottom: 1px solid #f0f0f0;
        .hgroup {
          color: #87636c;
          font-size: 14px;
          line-height: 20px;
          margin-bottom: 7px;
        }
        .info {
          display: flex;
          align-items: flex-start;
          margin-bottom: 9px;
          .category {
            width: 80px;
            height: 17px;
            line-height: 17px;
            background: #fff1f5;
            text-align: center;
            margin-right: 8px;
            font-size: 12px;
            color: var(--el-color-primary);
            margin-top: 2px;
            white-space: nowrap;
            padding: 0 4px;
          }
          .content {
            line-height: 20px;
            color: #13151e;
            font-size: 14px;
            font-weight: 600;
            max-height: 42px;
            /* 最多显示2行 */
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-word;
          }
        }
        .replay {
          cursor: pointer;
          padding: 8px 16px;
          background: #f9f9f9;
          box-shadow: none;
          transform: scale(1);
          transition: all 0.06s;
          .time {
            color: #9f9f9f;
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 4px;
          }
          .detail {
            line-height: 20px;
            color: #4b4b4b;
            font-size: 14px;
            font-weight: 400;
            max-height: 42px;
            /* 最多显示2行 */
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-word;
          }
          &:hover {
            transform: scale(1.003);
            box-shadow: 0px 8px 13px 0px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
    .ant-pagination {
      margin-top: 15px;
      .el-pagination {
        text-align: center;
      }
    }
  }
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
</style>
