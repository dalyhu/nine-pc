<!-- 悄悄话留言板 -->
<template>
  <div class="flag_layout_feedback">
    <transition name="feedback-bg-fade">
      <div class="feedback_bg" v-if="showFeedbackPopup"></div>
    </transition>
    <transition name="feedback-fade">
      <div class="layout_feedback_wrap" v-if="showFeedbackPopup">
        <div class="main">
          <div class="close_btn" title="关闭留言板" @click="close"></div>
          <div class="header">
            <div class="icon"></div>
            <span class="title">悄悄话留言板</span>
          </div>
          <section class="layout_type_list">
            <hgroup class="hgroup">问题类型</hgroup>
            <div class="type_list">
              <div
                class="item"
                :class="{ active: selectedIndex === index }"
                v-for="(item, index) in listData"
                :key="item.id"
                @click="select(index)"
              >
                {{ item.name }}
              </div>
              <div
                class="item placeholder"
                v-for="item in placeholderDivNum"
                :key="'placeholder' + item"
              ></div>
            </div>
          </section>
          <section class="layout_textarea">
            <hgroup class="hgroup">请填写您的意见和建议</hgroup>
            <el-input
              id="msg"
              ref="msg"
              resize="none"
              clearable
              type="textarea"
              v-model="msgText"
              @keydown.enter.native="doSubmit"
              placeholder="让我悄悄的告诉你..."
            ></el-input>
          </section>
          <section class="layout_buttons">
            <el-button class="submit_btn" :disabled="!canSubmit || !canSubmitFeedback" @click="doSubmit">提交</el-button>
          </section>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { category, submit } from '@/api/feedback.js'
import mittBus from '@/utils/mittBus'
export default {
  name: 'GlobalFeedbackPop',
  data() {
    return {
      listData: [],
      msgText: '',
      selectedIndex: '',
      canSubmit: true
    }
  },
  computed: {
    showFeedbackPopup() {
      return this.$store.state.showFeedbackPopup
    },
    // 占位布局
    placeholderDivNum() {
      return 4 - (this.listData.length % 4 || 4)
    },
    canSubmitFeedback() {
      return this.selectedIndex !== '' && this.msgText.trim().length >= 5
    }
  },
  watch: {
    showFeedbackPopup(v) {
      if (v) {
        this.getCategory()
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    getCategory() {
      category()
        .then((res) => {
          if (res.code === 0) {
            this.listData = res.data
          } else {
            this.$message({
              message: res.msg || res.data?.msg || '问题类型获取失败',
              type: 'error',
              customClass: 'feedback_message'
            })
          }
        })
        .catch((err) => {
          this.$message({
            message: err.msg || err.data?.msg || '问题类型获取失败',
            type: 'error',
            customClass: 'feedback_message'
          })
        })
    },
    select(index) {
      this.selectedIndex = index
    },
    doSubmit() {
      if (!this.canSubmit) return
      if (!this.canSubmitFeedback) return
      if (this.selectedIndex === '')
        return this.$message({
          message: '请选择问题类型',
          type: 'error',
          customClass: 'feedback_message'
        })
      if (!this.msgText.trim())
        return this.$message({
          message: '内容不能为空',
          type: 'error',
          customClass: 'feedback_message'
        })
      this.canSubmit = false
      let params = {
        feedback_id: '', // 反馈ID，第一次反馈的时候不需要，后面回复需要带上
        category_id: this.listData[this.selectedIndex].id, // 类目ID
        message: this.msgText.trim()
      }
      submit(params)
        .then((res) => {
          if (res.code === 0) {
            this.msgText = ''
            this.selectedIndex = ''
            this.$message({
              message: '提交成功',
              type: 'success',
              customClass: 'feedback_message'
            })
            mittBus.emit('updateFeedbackList', true)
            this.$store.commit('setFeedbackPopupVisible', false)
          } else {
            this.$message({
              message: res.msg || res.data?.msg || '提交失败',
              type: 'error',
              customClass: 'feedback_message'
            })
          }
          this.canSubmit = true
        })
        .catch((err) => {
          this.$message({
            message: err.msg || err.data?.msg || '提交失败',
            type: 'error',
            customClass: 'feedback_message'
          })
          this.canSubmit = true
        })
    },
    close() {
      this.$store.commit('setFeedbackPopupVisible', false)
    }
  }
}
</script>

<style lang="scss">
.feedback_message {
  z-index: 999999999992 !important;
}
</style>
<style lang="scss" scoped>
.flag_layout_feedback {
  font-family: var(--fontFamily-PingFangSC);
  // background: var(--el-color-primary);
  .feedback_container {
    height: 100%;
    overflow-y: auto;
  }

  .feedback-bg-fade-enter-active {
    transition: all 0.2s ease;
  }
  .feedback-bg-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .feedback-bg-fade-enter,
  .feedback-bg-fade-leave-active {
    // transform: scale(0.9);
    opacity: 0;
  }

  .feedback-fade-enter-active {
    transition: all 0.2s ease;
  }
  .feedback-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .feedback-fade-enter,
  .feedback-fade-leave-active {
    transform: scale(0.8);
    opacity: 0;
  }

  .feedback_bg {
    position: fixed;
    z-index: 999999999990;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
  }
  .layout_feedback_wrap {
    font-family: var(--fontFamily-PingFangSC);
    position: fixed;
    z-index: 999999999991;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background: rgba(0,0,0,0.8);
    // transform: translate(-50%, -50%);
    // min-height: 688px;
    .main {
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-height: 688px;
      width: 563px;
      background: url('/static/images/feedback/feedback_bg.png') no-repeat top left / 100% 100%;
      padding: 35px;
      padding-top: 45px;
      .close_btn {
        position: absolute;
        width: 36px;
        height: 36px;
        right: -25px;
        top: 0;
        background: url('/static/images/feedback/close.png') no-repeat top left / 100% 100%;
        cursor: pointer;
      }
      .header {
        display: flex;
        justify-content: center;
        align-items: center;
        .icon {
          width: 36px;
          height: 36px;
          margin-right: 11px;
          background: url('/static/images/feedback/pen_red.png') no-repeat top left / 100% 100%;
        }
        .title {
          color: var(--el-color-primary);
          font-size: 20px;
          font-weight: 600;
        }
      }
      .hgroup {
        color: #333;
        font-size: 16px;
        font-weight: 600;
      }
      .layout_type_list {
        margin-top: 20px;
        .type_list {
          display: flex;
          position: relative;
          flex-wrap: wrap;
          justify-content: space-between;
          .item {
            margin-top: 16px;
            width: 100px;
            text-align: center;
            height: 28px;
            line-height: 28px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background: #f2f2f3;
            font-size: 14px;
            color: #333;
            cursor: pointer;
            &.placeholder {
              opacity: 0;
              pointer-events: none;
            }
            &:hover,
            &.active {
              background: var(--el-color-primary);
              color: #fff;
            }
          }
        }
      }
      .layout_textarea {
        margin-top: 40px;
        .el-textarea {
          margin-top: 16px;
          :deep(#msg) {
            height: 184px;
            padding: 13px 18px;
          }
        }
      }
      .layout_buttons {
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }
      .submit_btn {
        background: var(--el-color-primary);
        width: 150px;
        color: #fff;
        padding: 8px 20px;
        font-family: initial;
        &:hover {
          background: #ed476f;
        }
      }
    }
  }
}
</style>
