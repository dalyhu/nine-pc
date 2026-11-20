<!-- 反馈详情（查看和回复） -->
<template>
  <div class="layout_feedback_detail">
    <el-button class="close_btn" round @click="close">关闭</el-button>
    <section class="main">
      <hgroup class="hgroup">您的问题/建议</hgroup>
      <div class="info">
        <span class="category">{{ detail.category.name }}</span>
        <!-- 反馈内容，最多显示两行 -->
        <div class="content">{{ getText(detail.message[0].message_text) }}</div>
      </div>
      <div class="message_wrap">
        <div class="message_list">
          <div class="item" v-for="(item, index) in messageList" v-show="index" :key="item.id">
            <div class="item_head">
              <img
                class="left_curved_arrow"
                src="/static/images/feedback/left_curved_arrow.png"
                v-if="item.sender_id === detail.user_id"
              />
              <div class="time">{{ timeFix(item.created_at) }}</div>
            </div>
            <div class="message_text">{{ getText(item.message_text) }}</div>
          </div>
        </div>
        <div class="reply_wrap">
          <el-input
            class="msg_input"
            placeholder="回复..."
            v-model="msgText"
            clearable
            @keydown.enter.native="doSubmit"
          ></el-input>
          <el-button class="submit" @click="doSubmit">发送</el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { submit } from '@/api/feedback.js'
import { formatTime2 as formatTime } from '@/utils'
import xssFilter from '@/utils/xssFilter'
export default {
  name: 'FeedbackDetailPop',
  props: {
    detail: {
      type: Object
    }
  },
  components: {},
  data() {
    return {
      msgText: '',
      messageList: [],
      canSubmit: true
    }
  },
  computed: {},
  watch: {
    detail: {
      deep: true,
      handler() {
        this.initInfo()
      }
    }
  },
  mounted() {
    this.initInfo()
  },
  methods: {
    timeFix(timeStamp) {
      return formatTime(timeStamp)?.replace(/-/g, '/') || ''
    },
    initInfo() {
      this.messageList = JSON.parse(JSON.stringify(this.detail.message))
      this.toBottom()
    },
    getText(str) {
      if (!str) return
      str = xssFilter(str)
      return str
    },
    doSubmit() {
      if (!this.canSubmit) return
      if (!this.msgText.trim())
        return this.$message({
          message: '内容不能为空',
          type: 'error',
          customClass: 'feedback_detail_message'
        })
      this.canSubmit = false
      let params = {
        feedback_id: this.detail.id, // 反馈ID
        category_id: this.detail.category_id, // 类目ID
        message: this.msgText.trim()
      }
      submit(params)
        .then((res) => {
          if (res.code === 0) {
            this.msgText = ''
            this.selectedIndex = ''
            this.$message({
              message: '回复成功',
              type: 'success',
              customClass: 'feedback_detail_message'
            })

            this.$emit('afterSubmit', res.data)
          } else {
            this.$message({
              message: res.msg || res.data?.msg || '回复失败',
              type: 'error',
              customClass: 'feedback_detail_message'
            })
          }
          this.canSubmit = true
        })
        .catch((err) => {
          this.$message({
            message: err.msg || err.data?.msg || '回复失败',
            type: 'error',
            customClass: 'feedback_detail_message'
          })
          this.canSubmit = true
        })
    },
    close() {
      this.msgText = ''
      this.$emit('close')
    },
    toBottom() {
      let box = document.querySelector('.feedback_detail_popper .message_list')
      if (!box) return
      this.$nextTick(() => {
        setTimeout(() => {
          box.scrollTop = box.scrollHeight
        }, 20)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.layout_feedback_detail {
  font-family: var(--fontFamily-PingFangSC);
  position: relative;
  padding-top: 17px;
  height: 100%;
  .close_btn {
    color: #fff;
    font-size: 14px;
    background: #333;
    border-radius: 16px;
    width: 48px;
    line-height: 20px;
    text-align: center;
    padding: 0;
    position: absolute;
    right: 0;
    top: -8px;
  }
  .main {
    display: flex;
    flex-direction: column;
    height: 100%;
    .hgroup {
      color: #87636c;
      font-style: 14px;
    }
    .info {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;
      margin-top: 8px;
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
        white-space: nowrap;
        /* 最多显示2行 */
        // -webkit-box-orient: vertical;
        // -webkit-line-clamp: 2;
        // display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-word;
      }
    }
    .message_wrap {
      flex: 1;
      position: relative;
      padding-bottom: 59px;
      overflow: hidden;
      .message_list {
        padding: 8px 8px 16px 8px;
        display: flex;
        flex-direction: column;
        background: #f9f9f9;
        height: 100%;
        overflow-y: auto;
        .item {
          &::after {
            content: '';
            display: block;
            width: 100%;
            height: 0.5px;
            background: #dddfe5;
            margin: 12px 0;
          }
          .item_head {
            display: flex;
            align-items: center;
            margin-bottom: 4px;
          }
          .left_curved_arrow {
            margin-right: 8px;
            width: 14px;
            height: 14px;
          }
          .time {
            color: #999;
            font-size: 12px;
            line-height: 16px;
          }
          .message_text {
            color: #13151e;
            font-size: 14px;
            line-height: 20px;
          }
          &:last-child {
            &::after {
              display: none;
            }
          }
          &.my_self {
          }
        }
      }
      .reply_wrap {
        margin-top: 18px;
        display: flex;
        position: absolute;
        width: 100%;
        .msg_input {
          :deep(input) {
            background: #f9f9f9;
            border-radius: 0;
          }
        }
        .submit {
          margin-left: 6px;
          background: var(--el-color-primary);
          color: #fff;
          border-radius: 0;
          border: 0;
        }
      }
    }
  }
}
</style>
