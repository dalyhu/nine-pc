<template>
  <el-scrollbar ref="pageScrollbar" class="app-wrapper">
    <div class="fixed-header" v-if="$route.path !== '/forum'">
      <div :class="[['/', '/main'].includes($route.path) ? 'main_header_nav' : 'header_nav']">
        <navbar v-if="$store.state.showHeaderFooter" @getIndex="getIndex" />
      </div>
    </div>
    <div class="main-container">
      <LeftMenu v-show="is_show_left_menu"></LeftMenu>
      <app-main />
      <Sidebar v-if="is_show_footer" />
    </div>
    <auth-dialog v-model="loginVisible" />
    <div id="TeamMessageContainer" style="z-index: 99">
      <div v-for="(item, index) in goalItem" :key="index">
        <div
          class="team-message-item host-message fade-in-left"
          style="background: url('/static/images/img-jinqiushijian.png')"
        >
          <div class="message-content" :class="item.iszhu == 1 ? 'left' : 'right'">
            <div class="team-info host-team">
              <div class="time" v-if="item.iszhu == 1">{{ item.match_str }}'</div>

              <div class="icon" v-if="item.iszhu == 1">
                <i class="football-icon rotate"></i>
              </div>
              <div class="team-name ellipsis">{{ item.home_team_name_zh }}</div>

              <div class="score">{{ item.home_score }}</div>
            </div>
            <span class="vs">-</span>
            <div class="team-info guest-team">
              <div class="score">{{ item.away_score }}</div>
              <div class="team-name ellipsis">{{ item.away_team_name_zh }}</div>

              <div class="icon" v-if="item.iszhu != 1">
                <i class="football-icon rotate"></i>
              </div>
              <div class="time" v-if="item.iszhu != 1">{{ item.match_str }}'</div>
            </div>
          </div>

          <div class="bottom-wrap" @click="del(index)">
            <button class="close-button"><i class="close-icon"></i>关闭</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 福袋 -->
    <LuckyBag v-if="is_show_redbag" />
    <!-- 右下角帮助 -->
    <globalChatDialog
      v-if="$store.state.showHeaderFooter && $route.path !== '/forum'"
      ref="gChatDialog"
      :isShowChat="isShowChat"
      :showDialogWin="showDialogWin"
      @setChatWinStatus="setChatWinStatus"
    />
    <!-- 全局 - 悄悄话留言板/意见反馈 -->
    <feedback />
  </el-scrollbar>
</template>

<script>
// 整体布局（包含页眉，主体，导航）
import LeftMenu from '@/layout/components/LeftMenu.vue'
import { Navbar, Sidebar, AppMain, globalChatDialog, LuckyBag, feedback } from './components'
import AuthDialog from '@/components/AuthDialog/index.vue'
// import { clearExpiredRecordData } from '@/utils/recordUsagetime'
import mittBus from '@/utils/mittBus'
export default {
  name: 'DefaultLayout',
  components: {
    LeftMenu,
    Navbar,
    Sidebar,
    AppMain,
    globalChatDialog,
    LuckyBag,
    AuthDialog,
    feedback
  },
  data() {
    return {
      loginVisible: false,
      audio: null,
      tabIndex: 0,
      showDialogWin: false, // 默认不显示聊天窗，即关闭
      isShowChat: false, // 是否显示 聊天模块，直播页面不显示
      showHelpPathArr: ['/main', '/news'],
      showChatPathArr: ['/live']
    }
  },
  computed: {
    // 左侧导航
    is_show_left_menu() {
      return ['/anchor', '/live', '/schedule', '/reserve'].includes(this.$route.path)
    },
    // 底部
    is_show_footer() {
      return (
        this.$store.state.showHeaderFooter &&
        ['/main', '/foresight', '/dailyMission', '/member', '/search', '/downLoad'].includes(
          this.$route.path
        )
      )
    },
    // 红包配置项，数组为空没有开启红包活动，不显示福袋，红包活动开启，is_redbag数据必定有数据
    is_show_redbag() {
      let _toString = Object.prototype.toString
      return _toString.call(this.$store.state.luckyBagData) === '[object Object]'
    },
    goalItem() {
      if (this.$store.state.goalItem.length == 0) return
      this.playVideo()
      return this.$store.state.goalItem
    },
    isCloseChatModule() {
      return this.$store.state.system.chat_msg_close === 1
    }
  },
  watch: {
    '$route.query.type'(e) {
      this.tabIndex == null
    },
    '$route.path'(path) {
      this.handlePathChange(path)
    },
    showDialogWin(value) {
      if (!value) {
        mittBus.emit('mycenter', null)
      }
    }
  },
  mounted() {
    mittBus.on('mycenter', this.popMessageFun)
    this.handlePathChange(this.$route.path)
  },
  unmounted() {
    mittBus.off('mycenter', this.popMessageFun)
  },
  methods: {
    // 获取帮助
    popMessageFun(val) {
      this.showDialogWin = val?.type
    },
    // 平板 PC 首页、直播间改为整页滚动：iPad Safari 退出视频全屏后，从播放器 iframe 开始的滑动交给整页，内层滚动容器收不到（TP-108）
    syncTabletPageScroll(path) {
      const root = document.documentElement
      const enabled = root.hasAttribute('data-tablet-pc') && !!window.X9Tablet?.inScope('pc', path)
      root.toggleAttribute('data-tablet-page-scroll', enabled)
    },
    handlePathChange(path) {
      this.syncTabletPageScroll(path)
      setTimeout(() => {
        this.$refs.pageScrollbar.scrollTo({ left: 0, top: 0, behavior: 'instant' })
        window.scrollTo(0, 0)
      }, 0)

      this.showDialogWin = false // 关闭聊天窗

      // 直播页不显示
      if (this.showChatPathArr.includes(path)) {
        this.isShowChat = false
      } else {
        // 非直播页
        if (!this.isCloseChatModule) this.isShowChat = true
      }

      // clearExpiredRecordData(this.$store.getters.userId)
    },
    /* 删除弹窗 */
    del(id) {
      this.goalItem.splice(id, 1)
    },
    // 进球播放声音
    playVideo() {
      if (!this.$store.state.game.voice) return
      let that = this
      this.audio = new Audio()
      this.audio.src = '/static/audios/xiaohao.mp3'
      this.audio.play()
      setTimeout(() => {
        that.audio.pause()
        that.audio = null
      }, 6000)
    },
    // 导航栏切换
    getIndex(e) {
      this.tabIndex = e
    },
    // 显示消息窗口
    setChatWinStatus(sts) {
      this.showDialogWin = sts
    }
  }
}
</script>

<style lang="scss" scoped>
.fixed-header {
  position: sticky;
  top: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
  background-color: #1d1e1f;
  .header_nav {
    max-width: 1760px;
    width: 100%;
    margin: 0 auto;
    overflow: hidden;
  }
  .main_header_nav {
    max-width: 1446px;
    width: 100%;
    margin: 0 auto;
    overflow: hidden;
  }
}

.main-container {
  width: 100%;
  min-height: 100%;
  position: relative;
  background: var(--el-bg-color-page);
}
</style>
