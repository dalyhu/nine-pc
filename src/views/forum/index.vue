<template>
  <div class="global-chat-win">
    <!-- 通知弹窗 -->
    <div class="win-chat-con">
      <div class="top">
        <div class="title flex flex-wrap">
          通知
          <a class="close-btn" @click="closeWin"></a>
        </div>
        <div class="tab-nav flex flex-wrap">
          <a :class="`a-click ${curTabIndex === 1 && 'active'}`" @click="changeTab(1)">
            聊天
            <span>
              <i v-show="privateChatDotVisible" class="show_dot"></i>
            </span>
          </a>
          <a :class="`a-click ${curTabIndex === 2 && 'active'}`" @click="changeTab(2)">
            直播
            <span>
              <i v-show="unreadTotalZB" class="show_dot"></i>
            </span>
          </a>
          <a :class="`a-click ${curTabIndex === 3 && 'active'}`" @click="changeTab(3)">
            预约
            <span>
              <i v-show="unreadTotalYY" class="show_dot"></i>
            </span>
          </a>
        </div>
      </div>

      <div class="content-all">
        <!-- 聊天联系人 模块 -->
        <div class="chat-dialog-content" :style="{ display: curTabIndex === 1 ? 'block' : 'none' }">
          <ChatBox v-show="curTabIndex === 1" :is-forum="true" :chat-box-mode="CHAT_BOX_MODE.MAIN" />
        </div>
        <!-- 直播模块 -->
        <div v-if="curTabIndex === 2" class="chat-dialog-content">
          <FoucusMatch
            v-if="dataAnchorList.length"
            :isForum="true"
            :isLoading="anchorParams.isLoading"
            :dataList="dataAnchorList"
            @getMore="getAttentionAction"
          />
          <div v-else-if="!anchorParams.isLoading" class="not-data">
            <img src="/static/images/zb-not-data.svg" />
            <p class="tip">还没有关注任何主播</p>
            <!-- <div class="txt flex" style="justify-content: center">
              <span style="margin-right: 8px">您可以在直播间点击</span>
              <a @click="goTopage('zb')">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAJAAAAAAqDuP8AAABEklEQVRYCe1Y0Q6DIAyUzZf9gv+f+CG6b9rLFjwMixx0Q4MZzpSExZ60Hke1zZrmbMNa22H2fnbV9wciI+Z7DKWETEkAsLjC/xnFaI0xrwhbbV5Wr5QXShuSMNlbQEsJCSHLICWU008VUoVyCuTuaw79nUJtyNjXpi2ffvL3sVrECcPmrm1S+xDAtRBh1Yb50zHgaUvrAsP1M7VH76Q83Fs2ny+kqX1kLl3mI6MEBugaLsJmxp9/XFI/ots32HHTFi0hk5Ka3pIk28kvNbCBFAQZxNlCiGIcLoeUEJ2PYKhCgigEqUIkh2CoQoIoBJ1OIal2SBip8M0oUsjXvnvwgHFrPQx897n0rctx/rDaZ1tLlAmHottsPHEcFAAAAABJRU5ErkJggg=="
                />
                关注
              </a>
            </div>
            <p>来追踪主播</p> -->
          </div>
        </div>

        <!-- 预约模块 -->
        <div v-else-if="curTabIndex === 3" class="chat-dialog-content">
          <ReserveMatch
            v-if="dataReserveList.length"
            :isLoading="reserveParams.isLoading"
            :dataList="dataReserveList"
            @getParentData="getReserveList"
          />
          <div v-else-if="!reserveParams.isLoading" class="not-data">
            <img src="/static/images/yy-not-data.svg" />
            <p class="tip">还没有任何比赛</p>
            <!-- <div class="txt flex" style="justify-content: center">
              <span style="margin-right: 8px">您可以在赛程页面点击</span>
              <a @click="goTopage('yy')">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAJAAAAAAqDuP8AAABEklEQVRYCe1Y0Q6DIAyUzZf9gv+f+CG6b9rLFjwMixx0Q4MZzpSExZ60Hke1zZrmbMNa22H2fnbV9wciI+Z7DKWETEkAsLjC/xnFaI0xrwhbbV5Wr5QXShuSMNlbQEsJCSHLICWU008VUoVyCuTuaw79nUJtyNjXpi2ffvL3sVrECcPmrm1S+xDAtRBh1Yb50zHgaUvrAsP1M7VH76Q83Fs2ny+kqX1kLl3mI6MEBugaLsJmxp9/XFI/ots32HHTFi0hk5Ka3pIk28kvNbCBFAQZxNlCiGIcLoeUEJ2PYKhCgigEqUIkh2CoQoIoBJ1OIal2SBip8M0oUsjXvnvwgHFrPQx897n0rctx/rDaZ1tLlAmHottsPHEcFAAAAABJRU5ErkJggg=="
                />
                预约
              </a>
            </div>
            <p>来追踪比赛</p>-->
          </div>
        </div>
      </div>
    </div>

    <!-- 音频播放组件 -->
    <audio
      id="newMsgNotificationAudio"
      ref="audio"
      controls="controls"
      hidden
      muted
      :src="getStaticUrl('/static/audios/strong_notification.mp3')"
    ></audio>
  </div>
</template>

<script>
import { getUserReserveLiveList, getAttentionFoucusList } from '@/api/user.js'
import ChatBox from '@/components/chatBox/index.vue'
import FoucusMatch from '@/components/FoucusAnchorMatch.vue'
import ReserveMatch from '@/components/ReserveMatch.vue'
import { CHAT_BOX_MODE } from '@/enums'
import mittBus from '@/utils/mittBus'
import { uniqBy, cloneDeep } from 'lodash-es'

export default {
  name: 'GlobalChatDialog',
  components: {
    ChatBox,
    FoucusMatch,
    ReserveMatch
  },
  data() {
    return {
      CHAT_BOX_MODE: CHAT_BOX_MODE,
      curTabIndex: 1, // 默认聊天标签
      dataAnchorList: [], // 关注的直播列表
      dataReserveList: [], // 预约列表,
      unreadTotalZB: 0,
      unreadTotalYY: 0,
      anchorParams: {
        limit: 20,
        page: 0,
        hasMore: true,
        isLoading: true
      },
      reserveParams: {
        limit: 20,
        page: 0,
        hasMore: true,
        isLoading: true
      }
    }
  },
  computed: {
    privateChatDotVisible() {
      return Object.values(this.$store.state.hasNewMsgChatsMap).some((item) => item.count)
    },
    userInfo() {
      return this.$store.state.user.infoData
    }
  },
  mounted() {
    this.openWin()
    this.curTabIndex = 1
    this.changeTab(1)
    mittBus.on('imOnMessage', this.handleIMMessage)
    mittBus.on('anchorFollowStatusChange', this.handleAnchorFollowStatusChange)
    mittBus.on('contestReserveStatusChange', this.handleContestReserveStatusChange)
  },
  beforeUnmount() {
    mittBus.off('imOnMessage', this.handleIMMessage)
    mittBus.off('anchorFollowStatusChange', this.handleAnchorFollowStatusChange)
    mittBus.off('contestReserveStatusChange', this.handleContestReserveStatusChange)
  },
  methods: {
    handleAnchorFollowStatusChange({ status, id }) {
      if (this.curTabIndex !== 2) return

      if (status) {
        this.getAttentionAction(
          Math.ceil((this.dataAnchorList.length + 1) / this.anchorParams.limit)
        )
      } else {
        this.dataAnchorList = this.dataAnchorList.filter((item) => item.followed_id != id)
      }
    },
    handleContestReserveStatusChange({ status, id }) {
      if (this.curTabIndex !== 3) return

      if (status) {
        this.getReserveList(Math.ceil((this.dataReserveList.length + 1) / this.reserveParams.limit))
      } else {
        this.dataReserveList = this.dataReserveList.filter((item) => item.match_id != id)
      }
    },
    async handleIMMessage(source) {
      const data = cloneDeep(source)

      try {
        switch (data.action) {
          case 'startLive':
            this.unreadTotalZB++
            break
          case 'reserveStartLive':
            this.unreadTotalYY++
            break
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 显示消息窗口
    openWin() {
      this.$emit('setChatWinStatus', true)
    },
    // 关闭窗口
    closeWin() {
      this.$emit('setChatWinStatus', false)
      mittBus.emit('imOnMessage', { action: 'backToChatList' })
    },
    // tab 切换
    changeTab(el) {
      this.curTabIndex = el
      this.resetPageParams()

      switch (el) {
        case 1: // 聊天
          mittBus.emit('imOnMessage', { action: 'updateChatList' })
          break
        case 2: // 直播
          this.getAttentionAction()
          this.unreadTotalZB = 0 // 点击未读重置为0
          mittBus.emit('imOnMessage', { action: 'backToChatList' })
          break
        case 3: // 预约
          this.getReserveList()
          this.unreadTotalYY = 0 // 点击未读重置为0
          mittBus.emit('imOnMessage', { action: 'backToChatList' })
          break
      }
    },
    // 获取关注列表
    async getAttentionAction(p) {
      // 直播和预约 需要登录
      if (!this.userInfo.id) return
      if (!p && (this.anchorParams.isLoading || !this.anchorParams.hasMore)) return

      try {
        this.anchorParams.isLoading = true
        const page = p || this.anchorParams.page + 1

        // const res = await attentionList({ page })
        const res = await getAttentionFoucusList({ page, limit: 100 })
        if (res.code === 0) {
          // this.dataAnchorList.push(...res.data.data)
          this.dataAnchorList = [...res.data]
          // this.dataAnchorList = uniqBy(this.dataAnchorList, 'followed_id')
          this.anchorParams.page = page
          // this.anchorParams.hasMore = this.anchorParams.page < res.data.last_page
        }

        this.anchorParams.isLoading = false
      } catch (error) {
        this.anchorParams.isLoading = false
      }
    },
    // 获取预约列表
    async getReserveList(p) {
      // 直播和预约 需要登录
      if (!this.userInfo.id) return
      if (!p && (this.reserveParams.isLoading || !this.reserveParams.hasMore)) return

      try {
        this.reserveParams.isLoading = true
        const page = p || this.reserveParams.page + 1

        const res = await getUserReserveLiveList({ page })

        if (res.code === 0) {
          this.dataReserveList.push(...res.data.data)
          this.dataReserveList = uniqBy(this.dataReserveList, 'match_id')
          this.reserveParams.page = page
          this.reserveParams.hasMore = this.reserveParams.page < res.data.last_page
        }

        this.reserveParams.isLoading = false
      } catch (error) {
        this.reserveParams.isLoading = false
      }
    },
    // 跳转直播或者赛程 type: zb, yy
    goTopage(type) {
      // 未登录，弹出登录
      if (!this.userInfo.id) {
        this.$store.state.user.showLoginMask = true
        return
      }
      if (type === 'zb') {
        this.$router.push('/anchor?type=0')
      } else {
        this.$router.push('/schedule?type=4')
      }
    },

    // 重置请求页页码数据
    resetPageParams() {
      this.dataReserveList = []
      this.dataAnchorList = []
      this.anchorParams = {
        limit: 20,
        page: 0,
        hasMore: true,
        isLoading: false
      }
      this.reserveParams = {
        limit: 20,
        page: 0,
        hasMore: true,
        isLoading: false
      }
    },

    // 打开悄悄话留言板弹窗
    addFeedback() {
      this.$store.commit('setFeedbackPopupVisible', true)
    },

    getStaticUrl(path) {
      return path
    }
  }
}
</script>

<style lang="scss" scoped>
.global-chat-win {
  height: 500px;
  width: 100%;
  overflow: hidden;

  .win-chat-con {
    overflow: hidden;
    background: #fff;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 1px 8px rgba(69, 74, 99, 0.3);
    border-radius: 10px 10px 0 0;
    transition: 0.2s;
    .top {
      flex-shrink: 0;
      .title {
        padding: 0 12px;
        height: 35px;
        background: #f4f4f4;
        border-radius: 10px 10px 0 0;
        .close-btn {
          display: inline-block;
          width: 20px;
          height: 20px;
          background: url('/static/images/close-btn.svg');
        }
      }
      .tab-nav {
        padding: 6px 12px;
        border-bottom: 1px solid #efefef;
        .a-click {
          position: relative;
          text-align: center;
          font-size: 14px;
          width: 29%;
          padding: 2px 0;
          background: #ddd;
          border-radius: 20px;
          //transition: .3s;
          &:hover {
            opacity: 0.8;
            background: #c61d48;
            color: #fff;
          }
          .show_dot {
            top: 6px;
            right: 10px;
          }
        }
        .active {
          background: #c61d48;
          color: #fff;
        }
      }
    }
    .content-all {
      flex: 1;
      overflow: hidden;
      /* 加载图标 */
      :deep(.el-loading-spinner) {
        .circular {
          width: 42px !important;
          height: 42px !important;
        }
      }
    }
    .chat-dialog-content {
      position: relative;
      height: 100%;
      overflow: hidden;
      /* 无数据 */
      .not-data {
        font-size: 14px;
        padding: 30px 44px;
        text-align: center;
        line-height: 30px;
        .tip {
          color: #c61d48;
          margin-top: 5px;
        }
        .txt {
          font-size: 12px;
          a {
            cursor: pointer;
            background-image: linear-gradient(112deg, #eecfb5 -1%, #d8ad66);
            color: #fff;
            padding: 0 12px;
            border-radius: 3px;
            height: 24px;
            line-height: 24px;
            transition: 0.3s;
            &:hover {
              background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)),
                linear-gradient(112deg, #eecfb5 -1%, #d8ad66);
            }
            img {
              width: 12px;
              height: 12px;
            }
          }
        }
      }
    }
  }
  .win-chat-con-sec {
    .top {
      .tab-nav {
        a {
          width: 46% !important;
        }
      }
    }
  }
}
</style>
