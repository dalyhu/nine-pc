<template>
  <div class="player_container" :class="{ 'player-web-fullscreen': isWebFullscreen }">
    <button v-if="isWebFullscreen" class="web-fullscreen-exit" aria-label="退出全屏" @click.stop="exitWebFullscreen">退出全屏</button>
    <div class="danmu-container" :style="{ top: danmakuTop + 'px' }" v-if="showDanmaku">
      <vue-danmaku
        ref="danmakuRef"
        :danmus="danmus"
        :channels="4"
        :speeds="180"
        :randomChannel="true"
        :fontSize="20"
        extra-style="font-weight: 500; text-shadow: #000 0 0 1px, #000 0 0 1px, #000 0 0 1px;"
        style="height: 100px; width: 100%"
      >
      </vue-danmaku>
    </div>
    <iframe
      v-if="initPlayer"
      ref="iframeRef"
      class="iframe-container"
      allow="autoplay"
      @load="resetWebFullscreen"
      allowfullscreen="allowfullscreen"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      :src="iframe_url"
    >
    </iframe>
    <!-- 播放器兜底封面图：iframe 未就绪时防黑屏；z-index:1 低于启动加载图(102)，不遮挡现有业务 -->
    <transition name="player-fallback-fade">
      <div
        v-if="!playerFallbackCoverReady"
        class="player_fallback_cover"
        :style="{ backgroundImage: 'url(' + fallbackCoverUrl + ')' }"
      />
    </transition>
    <div
      class="pause_ads_wrapper"
      v-show="isShowPauseAds && (loadingAdReady || !firstShowPauseAds)"
      :class="{ first_show: firstShowPauseAds }"
    >
      <div
        v-if="!firstShowPauseAds && !is_index"
        class="close_video_ad_btn"
        title="关闭广告"
        @click="closeAdImage"
      ></div>
      <df-container :height-ratio="56.25">
        <img
          v-if="loadingAdReady || !firstShowPauseAds"
          class="pause_ads"
          @load="videoAdOnload"
          @error="videoError"
          :src="videoCoverImageUrl"
          @click="pauseAdsClick"
        />
      </df-container>
      <div class="video_ad_countdown" v-if="imgLoadState">{{ videoAdCountdown }}</div>
    </div>
    <a
      v-if="is_index && !isWebFullscreen && info?.uid && !isError"
      style="z-index: 99"
      class="anchor-home-page-top-play-area-enter-button"
      @click="setUrl(info)"
      >进入直播间</a
    >
    <div v-if="showUnmute && initPlayer && !isError && (!is_index || !isWebFullscreen)" class="mute_btn" @click="onHandleUnmute">
      <div class="mute_btn_icon"></div>
      <div class="mute_btn_text">取消静音</div>
    </div>

    <div class="anchor-live-player-no-video" v-if="liveClosed || isError">
      <div class="layout-anchor-nostart-content">
        <div class="anchor-close-content">
          <img src="/static/images/live-none.png" />
          <!-- 主播关播 -->
          <template v-if="liveClosed">
            <div class="anchor-close-text">主播已关播</div>
            <div class="redirect-countdown">
              {{ `倒数 ${redirectCountdown} 秒后将自动跳转...` }}
            </div>
          </template>
          <!-- 其他错误 -->
          <template v-else>
            <div class="anchor-close-text">{{ error_msg }}</div>
            <el-button class="reload_video_btn" @click="reloadVideo">重新加载</el-button>
          </template>
        </div>
        <div class="recommd-list">
          <div class="recommd-list-item" v-for="(item, index) in recommendList" :key="index">
            <div>
              <div :style="{ backgroundImage: 'url(' + item.thumb + ')' }">
                <div class="footer">
                  <div class="title">{{ item.title }}</div>
                  <div class="status">直播</div>
                </div>

                <a class="mark" @click="setUrl(item)">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8g2+bRAAAAK3RSTlMA+g400D/HfWTgWusi9gvx7dSn3alXSy+OGBSQhsG3npZwUAewgUY6bOZHJ9ipHQAAA1lJREFUaN6s1+lysjAUBuCXQNmhQNncl1bbb3L/9/dNTqCZMhoT4PnR6ox6krMkCjPMjW+170WJ4ySR59e32GVYC2t7jz/g9e0KQVh4cPhTziFcFqOtM/5CVreYKy6nCy6isoyK6ZbKGHOEH1yJqqDpcgzyrgmqiCsfIWx9q7q+V2GKB9KwelcV/4aN7ek3K8cmx1N5c/zN12kLY9diXPx+gxc2+3EbxRVmPnsuJQGDARYkXOo/YSD1h+TsGAyx3ZAoP8VLbjK8toOFzh827eKFeyaXf4Gli9xEdodW7Mi+dmHN/ZBLi7Wfz8kXwwzsixNNhLtc/xkzneUe7k83KfMfYLZA1sF90p+yf36wwI/spfThfPlq/Uv34D+auJ0m/9Z16B+cP7J/sJjspSsmtgX1/xqXLM1DMT1bT9RgLlbgUrOfJvcLFy5YxYULf28gj2qPlVA/eoASUoI6rKSjJIVQqC47rGZHHTM54xKG1bDk76lXakZ4wUCXGLR0vzOsiNE3gRZSLZ7ssaq9+Mx6iJaJFtpAJ93CzkY0UsZUjx61r/Y49++wclSdehAPG2h4nNbgwkIj3nKgDDmixLkuP3xQpzCWizI7bOyhChpvfOScNzBVjX3UU7L0AZRsz2CGStuPCU6NApDiksNEOpx4TPyPYBiA/Athgn6hMLhUAvMApLyaFsGVB11gE4D4b2bnUYwbTYFtABoLk0m4yYOosw1AqhQ6HY2OvN5yqwCGY5FTKqlLHdgGUGOhWZtDfRqJ1rYOoHhbPFPQACT0d34AXmkHIaF9lLMDaFdXUvYXBzjoAyxOUfa/WWtJQRiGgiNRKhKr4qa2StEoWu9/QBHBbea9MDQ3KE0y/1XmFxUe8uGJzCEXXdNpnZC5piUPbd+0yD40P1Rszz0IqPCC3WI8gQI7J1zfI0i4dhHOJYAmHAdlLt8wUKaZ9I8bwED6VtkyvRJMsoUSXuGfPzYtjMKLko7Y/S5+18MsHTnxe/t+wxhhF7+kfEd4XCM88p02IIDPgMgtlN4E6m2s3ojrowR9GKKPc/SBlD5S04eC+lgT6ATBrDBaVofj6nhfXVCoKxZ1SaSuudRF3fxVI5AGb1k6pDrqXndhXVPlbh8N1Dh74IcbNU9P9OOZ8vnPBxkKMfzzjMchAAAAAElFTkSuQmCC"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--播放器脚本文件-->

<script>
import { getAdList, getLives, getRoomInfo } from '../../api/user.js'
import { mapState } from 'vuex'
import mittBus from '@/utils/mittBus'
import { getQueryString, resolveLiveVideoType } from '@/utils'
import { resolveLiveRoomAnchorUid } from '@/utils/common.js'
import { debounce, cloneDeep } from 'lodash-es'
import { batchPing } from '@/utils/ping.ts'
import vueDanmaku from 'vue3-danmaku'
import { createPlayerFullscreenSession, createWebFullscreenHistory, isCurrentPlayerMessage } from '@/utils/playerFullscreen'

export default {
  name: 'livePlayer',
  components: {
    vueDanmaku
  },
  props: {
    danmakuTop: {
      type: Number,
      default: 0
    },
    showDanmaku: {
      type: Boolean,
      default: true
    },
    info: {
      type: Object,
      default: () => {}
    },
    liveClosed: {
      type: Boolean,
      default: false
    },
    query: {
      type: Object,
      default: () => {}
    },
    link: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLiveFlage: false,
      liveListTimer: 5 * 1000, // front/getLiveList 请求时间限制 5 秒，防止错误时过多请求问题
      showUnmute: true, //播放器静音
      danmus: [],
      pageVisibilityState: true, // 页面显示隐藏状态
      isError: false,
      error_msg: '等待推流中...',
      playerUrlLoading: true, //数据加载前loding
      playerFallbackCoverReady: false, // 播放器兜底封面图：收到 playerIframeOnload 后置 true，兜底层消失
      iframeEverReady: false, // iframe 完成过初始化后置 true，永不重置；用于区分兜底封面图优先级
      countDown: 0, //开赛倒计时
      urlPlayer: '', //直播链接
      unmute: false,
      initPlayer: false,
      redirectCountdown: 10,
      redirectTimer: null,
      recommendList: [],
      redirectUrl: '',
      iframe_url: '',
      endConfirm: false,
      haveUnmuted: false,
      iframeWidth: '',
      isFullscreen: false, // 是否正在全屏
      isWebFullscreen: false,
      liveErrorConfig: {
        requestTimeInterval: 10000, // 请求的时间间隔,默认10000,优先取异常事件声明的时间间隔
        requestTimeoutId: '', // 请求的延时器id
        requestTimesLimit: 12, // 一次异常的请求次数限制（TODO: 如果多个页签的不同直播间，如果差不多时间异常）
        requestNum: 0 // 请求次数
      },
      isShowPauseAds: true, // 是否显示暂停广告(只在直播间有，首页轮播那里不显示)
      firstShowPauseAds: true,
      imgLoadState: false, // 图片加载状态
      videoAdCountdown: 3,
      videoAdCountdownInterval: null,
      videoCoverImageUrl: '/static/images/pause_ads.jpg?r=2',
      playerLoadingAd: null,
      playerPauseAd: null,
      loadingAdReady: false,
      loadingAdWaitTimer: null,
      loadingCoverTimeout: null,
      coverSource: ''
    }
  },
  mounted() {
    this._fullscreenSession = createPlayerFullscreenSession(document.body)
    this._fullscreenHistory = createWebFullscreenHistory(window, this.$router)
    if (!this.loadingAdReady) {
      this.loadingAdWaitTimer = window.setTimeout(() => {
        this.finalizeLoadingCover()
      }, 1500)
    }

    if (!localStorage.getItem('danmakuShow')) localStorage.setItem('danmakuShow', '1')
    this.$store.state.danmakuSystem.show = localStorage.getItem('danmakuShow') === '1'

    mittBus.on('imOnMessage', this.handleIMMessage)
    mittBus.on('ifreamAddpro', this.setifreamAddpropertyFun)

    window.addEventListener('keydown', this.eventAdd)
    window.addEventListener('message', this.listenIframe)
    // document.addEventListener('visibilitychange', this.reloadPlayerHandler)
    window.addEventListener('resize', this.resizeHandler)
  },
  watch: {
    iframe_url() {
      this.resetWebFullscreen()
    },
    // 如果关闭弹幕 就清空数据
    'danmakuSystem.show'(value) {
      this.danmakuChange(value)
    },
    liveClosed(cur) {
      if (cur && !this.redirectTimer) {
        this.handleLiveClosed()
      }
    },
    initPlayer(cur) {
      if (!cur) this.resetWebFullscreen()
      if (cur) {
        this.$nextTick(() => {
          // console.log('todo:dev // initPlayer::', this.$refs.iframeRef)
          this.iframeWidth = this.$refs.iframeRef.offsetWidth
          this.$refs.iframeRef.addEventListener('fullscreenchange', this.fullScreenProcessing)
        })
      }
    }
  },
  computed: {
    ...mapState({
      isLogin: (state) => !!state.user.infoData.id
    }),
    //弹幕配置
    danmakuList() {
      return this.$store.state.historyMessageList.filter(
        ({ msg_type, type, vid }) => msg_type == 0 && type == 0 && this.info.vid === vid
      )
    },
    danmakuSystem() {
      return this.$store.state.danmakuSystem
    },
    is_index() {
      return this.query.type === 'main'
    },
    isLoopVideo() {
      return Number(this.info?.isLoop ?? this.info?.is_loop) === 1
    },
    // 播放器兜底封面图地址
    // iframeEverReady = false（初始阶段）：系统配置图 → 本地图（021广告图因接口时序问题不参与兆底封面）
    // iframeEverReady = true（liveRetry 阶段）：当前直播封面 → 系统加载图 → 本地默认图
    fallbackCoverUrl() {
      const systemUrl = this.$store.state.system.loadingCoverScreenUrl
      const localUrl = '/static/images/pause_ads.jpg?r=2'

      if (!this.iframeEverReady) {
     // 初始阶段：直接返回 applyLoadingCover 已维护好的值，避免时序差导致与播放器加载图不一致
       
        return  systemUrl ||localUrl
      }

      // liveRetry 阶段：优先展示当前直播封面，比全站通用图更贴合当前内容
      const thumb = this.info?.thumb
      if (thumb) {
        const thumbUrl = thumb.indexOf('http') > -1
          ? thumb
          : (location.origin.indexOf('localhost') > -1 ? 'http://10.83.222.100' : location.origin) + thumb
        return thumbUrl
      }
      return systemUrl || localUrl
    }
  },
  created() {
    if (this.$store.state.system.loadingCoverScreenUrl) {
      this.videoCoverImageUrl = this.$store.state.system.loadingCoverScreenUrl
    }
    this.getPlayerAds()
    this.$watch('info', (cur, prev) => {
      if (Object.keys(cur).length > 0 && cur !== prev) {
        if (cur.pull_tc && cur.starttime - cur.servertime > 0 && cur.starttime > 0) {
          this.urlPlayer = cur.pull_tc
          this.countDown = cur.starttime - cur.servertime
          // 先卸载定时器从新加载定时器
          window.clearInterval(this.timeInterval)
          this.Iime()
          return
        }

        if (Number(cur.islive) === 2 || !cur.islive) {
          this.countDown = false
          if (!this.redirectTimer) {
            this.handleLiveClosed()
          }
          return //主播未开播
        }

        this.computePlayerUrl()
      }
    })
  },
  methods: {
    getPlayerAds() {
      getAdList()
        .then((res) => {
          const ads = res.data || []
          this.playerLoadingAd =
            ads.find((ad) => ad.ad_id === '021' && ad.img_address) || null
          this.playerPauseAd = ads.find((ad) => ad.ad_id === '022' && ad.img_address) || null

          if (!this.firstShowPauseAds) this.applyPauseCover()
        })
        .catch(() => {})
        .finally(() => {
          this.finalizeLoadingCover()
        })
    },
    applyLoadingCover(fallbackLevel = 0) {
      if (!fallbackLevel && this.playerLoadingAd?.img_address) {
        this.videoCoverImageUrl = this.playerLoadingAd.img_address
        this.coverSource = 'loading-ad'
      } else if (fallbackLevel < 2 && this.$store.state.system.loadingCoverScreenUrl) {
        this.videoCoverImageUrl = this.$store.state.system.loadingCoverScreenUrl
        this.coverSource = 'loading-system'
      } else {
        this.videoCoverImageUrl = '/static/images/pause_ads.jpg?r=2'
        this.coverSource = 'loading-local'
      }
    },
    applyPauseCover(fallbackLevel = 0) {
      if (!fallbackLevel && this.playerPauseAd?.img_address) {
        this.videoCoverImageUrl = this.playerPauseAd.img_address
        this.coverSource = 'pause-ad'
      } else if (fallbackLevel < 2 && this.$store.state.system.videoStopAdvertisingImageUrl) {
        this.videoCoverImageUrl = this.$store.state.system.videoStopAdvertisingImageUrl
        this.coverSource = 'pause-system'
      } else {
        this.videoCoverImageUrl = '/static/images/pause_ads.jpg?r=2'
        this.coverSource = 'pause-local'
      }
    },
    getCurrentCoverLink() {
      if (this.coverSource === 'loading-ad') return this.playerLoadingAd?.advertising_url || ''
      if (this.coverSource === 'pause-ad') return this.playerPauseAd?.advertising_url || ''
      if (['loading-system', 'loading-local'].includes(this.coverSource)) {
        return this.$store.state.system.loadingCoverScreenLink || ''
      }
      if (['pause-system', 'pause-local'].includes(this.coverSource)) {
        return this.$store.state.system.videoStopAdvertisingImageLink || ''
      }
      return ''
    },
    startLoadingCoverTimeout() {
      window.clearTimeout(this.loadingCoverTimeout)
      this.loadingCoverTimeout = window.setTimeout(() => {
        if (this.firstShowPauseAds && !this.imgLoadState) this.videoError()
      }, 3000)
    },
    finalizeLoadingCover() {
      if (this.loadingAdReady) return

      window.clearTimeout(this.loadingAdWaitTimer)
      this.applyLoadingCover()
      this.loadingAdReady = true
      this.startLoadingCoverTimeout()
    },
    // 添加和删除ifream的pointer-events: none;
    setifreamAddpropertyFun(val) {
      if (val === 'disabled') {
        this.$refs.iframeRef.style.pointerEvents = 'none'
      } else {
        this.$refs.iframeRef.style.pointerEvents = 'auto'
      }
    },

    async computePlayerUrl() {
      if (!this.info?.pull) return

      const { iframe_url, use_iframe_url } = this.$store.state.system
      let load_iframe_url = use_iframe_url

      if (!load_iframe_url) {
        load_iframe_url = await batchPing(iframe_url, 5000)
        this.$store.commit('mergeSystem', { use_iframe_url: load_iframe_url })
      }

      //已开播
      if (!load_iframe_url) return

      let params = ''

      // if (this.$route.query.kq == 1) params = this.$route.fullPath.split('?')[1] + '&'

      if (this.is_index) {
        // 首頁視頻不需要切換高低清
        params += `s_url=${encodeURIComponent(this.info.pull)}&hideClarity=1&isLoop=${
          this.info.is_loop || 0
        }`
        if (this.isLogin) params += `&login=1&h_url=${encodeURIComponent(this.info.pull)}`
      } else {
        if (this.isLogin) {
          params += `login=1`
          params += `&s_url=${encodeURIComponent(this.info.clarity.smooth)}`
          params += `&h_url=${encodeURIComponent(this.info.clarity.hd)}`
        } else {
          params += `s_url=${encodeURIComponent(this.info.clarity.smooth)}`
        }
      }

      const videoPreviewPic =
        this.info.thumb.indexOf('http') > -1
          ? this.info.thumb
          : (location.origin.indexOf('localhost') > -1 ? 'http://10.83.222.100' : location.origin) +
            this.info.thumb

      params = `?${params}&poster=${videoPreviewPic}&loadingBar=${this.info.loadingBar}&isLoop=${
        this.isLoopVideo ? 1 : 0
      }`

      if (this.$route.query.SDI == 1) {
        let pathname = this.$route.query.pathname
          ? this.$route.query.pathname
          : '/xgplayer/index.html'
        let port = this.$route.query.port ? this.$route.query.port : '8080'
        let path = location.protocol + '//' + location.hostname
        if (location.hostname === 'localhost') path += `:${port}`
        path += pathname
        this.iframe_url = path + params
      } else {
        this.iframe_url = load_iframe_url + params
      }

      this.countDown = false
      this.initPlayer = true
    },
    sendHistoryDanmakuList(messageList) {
      // 只有存在于广场的消息才能发送弹幕
      const len = messageList.length
      let index = 0
      this.intervalId = window.setInterval(() => {
        if (index < len) {
          const { originalText, text } = messageList[index]
          let barrageText = text || originalText
          if (barrageText.includes('<img')) barrageText = '***'
          if (barrageText && this.$refs.danmakuRef) this.$refs.danmakuRef.insert(barrageText)
          index++
        } else {
          window.clearInterval(this.intervalId)
        }
      }, 300)
    },

    sendDanmaku(messageList) {
      messageList.forEach(({ msg_type, type, vid, originalText, text }) => {
        if (msg_type == 0 && type == 0 && this.info.vid === vid) {
          let barrageText = text || originalText

          // 敏感字换图
          if (barrageText.includes('<img')) barrageText = '***'

          if (barrageText && this.$refs.danmakuRef) this.$refs.danmakuRef.insert(barrageText)
        }
      })
    },
    // 弹幕
    handleIMMessage(source) {
      const data = cloneDeep(source)
      // 只有广场才发送弹幕
      if (data.action === 'messageList') {
        if (document.visibilityState === 'visible' && this.danmakuSystem.show) {
          this.sendDanmaku(data.messageList)
        }
      } else if (data.action === 'closeLive') {
        if (this.info.vid === data.vid) {
          this.$emit('onHandleLiveClosed', true)
        }
      } else if (data.action === 'toggle') {
        const anchorUid = resolveLiveRoomAnchorUid(this.query, this.info)
        if (anchorUid != null && data.data.user_id === anchorUid) {
          this.$emit('onHandleMatchInfoToggle', data.data.match_id)
        }
      }
    },
    // 用于处理 safari fullscreenchange 会触发 visibilitychange 事件导致的无法全屏的 bug
    fullScreenProcessing() {
      this.fullScreenIsProcessing = true
      setTimeout(() => {
        this.fullScreenIsProcessing = false
      }, 2000)
    },
    reloadVideo() {
      this.isError = false
      this.handlePostMessage({
        messageType: 'controlIframe',
        event: 'reloadPlayer',
        volume: localStorage.getItem('videoVolume')
      })
    },
    goRegister() {
      this.$store.state.user.showLoginMask = true
    },
    eventAdd(e) {
      if (e.key === 'Escape' && this.isWebFullscreen) this.exitWebFullscreen()
      if (e.key == 'F5') {
        window.location.reload(true)
      }
    },
    onHandleUnmute() {
      this.unmute = true
      this.showUnmute = false
      this.handlePostMessage({
        messageType: 'controlIframe',
        event: 'unmute',
        volume: localStorage.getItem('videoVolume')
      })
      this.haveUnmuted = true
    },
    onHandleVideoError(data) {
      if (data) {
        this.isError = true
        this.playerUrlLoading = false
        this.error_msg = data.error_text
        if (!this.is_index) this.getLiveList('handError')
      }
    },
    Iime() {
      this.timeInterval = window.setInterval(() => {
        if (this.countDown > 0) {
          this.countDown -= 1
        } else if (this.countDown === 0) {
          //倒计时结束隐藏倒计时并拉流直播，结束定时器
          this.countDown = 0
          this.initPlayer = true
          window.clearInterval(this.timeInterval)
        }
      }, 1000)
    },
    handleLiveClosed() {
      this.$emit('onHandleLiveClosed', true)
      this.redirectCountdown = 10
      this.getLiveList('handClose', -1)
      this.setRedirectCountDownTimer()
      this.initPlayer = false
      this.playerUrlLoading = false
      this.handlePostMessage({
        messageType: 'controlIframe',
        event: 'liveClosed'
      })
      this.resetLiveErrorHandler()
    },
    setRedirectCountDownTimer() {
      this.redirectTimer = window.setInterval(() => {
        if (this.redirectCountdown > 0) {
          this.redirectCountdown -= 1
        } else {
          if (this.redirectCountdown <= 1 && this.redirectUrl) {
            // window.location.href = this.redirectUrl
            window.location.replace(this.redirectUrl)
          }
          this.redirectCountdown = 0
          window.clearInterval(this.redirectTimer)
          this.redirectTimer = null
        }
      }, 1000)
    },
    getLiveList(curType, liveType) {
      let type =
        this.query.type === 'football'
          ? 0
          : this.query.type === 'basketball'
          ? 1
          : this.query.type == 3
          ? 2
          : -1
      let data = {
        page: 1,
        type: liveType || type, //-1全部 0足球 1篮球 2其他
        limit: 7,
        liveType: curType || 'unknow'
      }
      if (this.isLiveFlage) {
        return
      }
      this.isLiveFlage = true
      getLives(data).then((res) => {
        let list = res.data || []
        const anchorUid = resolveLiveRoomAnchorUid(this.query, this.info)
        list = list.filter((res) => {
          return String(anchorUid ?? '') !== String(res.uid)
        })
        this.recommendList = list.splice(0, 5)
        let redirectItem = this.recommendList[0]
        if (redirectItem && redirectItem.uid) {
          // let sport = redirectItem.type === 0 ? "football" : redirectItem.type === 1 ? "basketball" : ""
          const live_path = `/live?router=live&uid=${redirectItem.uid}`
          const routeData = this.$router.resolve({
            path: live_path,
            query: { ...getQueryString(live_path) }
          })
          this.redirectUrl = routeData.href
        }

        setTimeout(() => {
          this.isLiveFlage = false
        }, this.liveListTimer)
      })
    },
    setUrl(item) {
      // let sport = item.type == 0 ? 'football' : item.type == 1 ? 'basketball' : item.type
      if (!item.uid) return this.$message.error('主播ID不能为空，跳转失败，请刷新试试') // 历史逻辑，暂不确定为啥这样

      /** 看是否是robot直播  还是回放 */
      this.$store.commit('house/setIsRobotAction', item?.iszr)
      this.$store.commit('house/setIsReplayAction', item?.isRecord)

      let url = '/live?router=iframe&uid=' + item.uid
      let routeData = this.$router.resolve({ path: url, query: { ...getQueryString(url) } })
      window.open(routeData.href, '_self')
    },
    sendHistoryMessage() {
      setTimeout(() => {
        this.sendHistoryDanmakuList(this.danmakuList.slice(-20))
      }, 1000)
    },
    listenIframe(e) {
      try {
        let data = e.data
        if (data.messageType === 'controlIframe') {
          let event = data.event
          switch (event) {
            // 新版播放器特有的事件
            // case 'new_version_player':
            //   this.showUnmute = false
            //   break
            // case 'init_player':
            //   // 当视频信息加载的时候开始发送历史弹幕
            //   this.sendHistoryMessage()
            //   break
            case 'canplay':
              this.playerUrlLoading = false
              this.isError = false
              this.resetLiveErrorHandler(true)
              if (this.haveUnmuted) {
                setTimeout(() => {
                  console.log('自动取消静音..')
                  this.onHandleUnmute()
                }, 500)
              }

              break
            case 'showUnmute':
              this.unmute = false
              this.showUnmute = true
              break
            case 'hideUnmute':
              this.unmute = true
              this.showUnmute = false
              this.$common.debounce(() => {
                if (data.volume) {
                  this.haveUnmuted = true
                  if (location.hostname === 'localhost')
                    console.log('live page get hideUnmute,,,', data.volume)
                  localStorage.setItem('videoVolume', data.volume)
                }
              })()
              break
            case 'goRegister':
              this.$store.state.user.showLoginMask = true
              break
            case 'error':
              if (this.liveErrorConfig.requestNum >= this.liveErrorConfig.requestTimesLimit)
                this.isError = true
              if (this.endConfirm) return console.log('====log:endConfirm=true')
              this.endConfirm = true
              this.playerUrlLoading = false
              this.getLatestRoomInfo(data)
              break
            case 'end':
              if (this.isLoopVideo) {
                this.handlePostMessage({
                  messageType: 'controlIframe',
                  event: 'play'
                })
                break
              }
              if (this.liveErrorConfig.requestNum >= this.liveErrorConfig.requestTimesLimit)
                this.isError = true
              if (this.endConfirm) return console.log('====log:endConfirm=true')
              this.playerUrlLoading = false
              this.endConfirm = true
              // 判断是否确实已关播or只是视频流异常？
              this.getLatestRoomInfo(data)
              break
            case 'liveRetry':
              this.playerUrlLoading = true
              this.isError = false
              this.playerFallbackCoverReady = false // 断流重试，兜底封面层重新出现覆盖黑屏
              break
            case 'requestNewUrl': {
              // 播放器 error 首次发生，请求外层快速刷新 URL
              // 必须在播放器 4s 降级定时器触发前完成接口响应，临时设 300ms 延迟
              this.resetLiveErrorHandler()
              this.endConfirm = false
              const savedInterval = this.liveErrorConfig.requestTimeInterval
              this.liveErrorConfig.requestTimeInterval = 300
              this.getLatestRoomInfo({ event: 'requestNewUrl', data: { error_text: '' } })
              this.liveErrorConfig.requestTimeInterval = savedInterval
              break
            }
            case 'requestFullscreenFix':
              if (isCurrentPlayerMessage(e, this.$refs.iframeRef)) {
                this._fullscreenSession.enter()
                this._fullscreenHistory?.push(() => this.exitWebFullscreen())
                this.isWebFullscreen = true
              }
              break
            case 'exitFullscreenFix':
              if (isCurrentPlayerMessage(e, this.$refs.iframeRef)) this.resetWebFullscreen()
              break
            case 'requestFullscreen':
              this.isFullscreen = true
              break
            case 'exitFullscreen':
              this.isFullscreen = false
              break
            case 'playerIframeOnload':
              this.sendHistoryMessage()
              this.playerUrlLoading = false
              this.isError = false
              this.playerFallbackCoverReady = true // 播放器已就绪，兜底封面层淡出消失
              this.iframeEverReady = true // 只升不降，标记 iframe 完成过初始化，切换兜底图优先级
              break
            case 'getFullscreenState':
              this.handlePostMessage({
                messageType: 'controlIframe',
                event: 'setFullscreenState',
                state: this.isFullscreen || this.isWebFullscreen
              })
              break
            case 'pause':
              if (this.imgLoadState && !this.isLoopVideo) {
                this.isShowPauseAds = true
              }
              break
            case 'play':
              if (!this.firstShowPauseAds) this.isShowPauseAds = false
              break
          }
        }
      } catch (error) {
        console.log('x9 live listen message error:', error)
      }
    },
    resetWebFullscreen() {
      this.isWebFullscreen = false
      this._fullscreenSession?.exit()
      this._fullscreenHistory?.release()
    },
    exitWebFullscreen() {
      this.handlePostMessage({ messageType: 'controlIframe', event: 'exitH5Fullscreen' })
      this.resetWebFullscreen()
    },
    handlePostMessage(data = {}, origin = '*') {
      let playerIframe = document.querySelector('.iframe-container')
      playerIframe && playerIframe.contentWindow.postMessage(data, origin)
    },
    reloadPlayerHandler() {
      // 页面不可见时 弹幕推送不处理和清除弹幕
      if (document.visibilityState === 'visible') {
        this.danmakuChange(this.danmakuSystem.show)
      } else {
        this.danmakuChange(false)
      }

      if (document.visibilityState === 'visible' && !this.fullScreenIsProcessing) {
        if (!document.querySelector('.iframe-container')) return // 未发现播放器，不在直播间或首页
        // console.log('页面可见,刷新播放器')
        this.playerUrlLoading = true
        this.isError = false
        if (this.showUnmute) this.haveUnmuted = false
        this.handlePostMessage({
          messageType: 'controlIframe',
          event: 'reloadPlayer',
          volume: localStorage.getItem('videoVolume')
        })
      }
    },

    closeAdImage() {
      // 播放
      this.handlePostMessage({
        messageType: 'controlIframe',
        event: 'play'
      })
      this.isShowPauseAds = false
    },
    danmakuChange(value) {
      if (value) {
        this.$refs.danmakuRef && this.$refs.danmakuRef.play()
        this.pageVisibilityState = true
      } else {
        this.$refs.danmakuRef && this.$refs.danmakuRef.stop()
        this.danmus = []
        this.pageVisibilityState = false
      }
    },
    resizeHandler: debounce(function () {
      const iframe = this.$refs.iframeRef

      if (!iframe) return

      if (iframe.offsetWidth != this.iframeWidth && !this.isFullscreen) {
        this.iframeWidth = iframe.offsetWidth
        // this.reloadPlayerHandler()
        console.log('resize 重新加载播放器')
      }

      // 重新计算弹幕滚动距离
      this.$refs.danmakuRef && this.$refs.danmakuRef.resize()
    }, 300),
    // 获取直播间的最新数据
    getLatestRoomInfo(data) {
      if (this.liveErrorConfig.requestTimeoutId)
        return console.log('====log:已存在获取直播间数据的延时任务')
      if (this.liveErrorConfig.requestNum >= this.liveErrorConfig.requestTimesLimit) {
        this.onHandleVideoError(data.data)
        return console.log(
          `====log: ${this.liveErrorConfig.requestNum}/${this.liveErrorConfig.requestTimesLimit} 本次直播异常事件 ${data.event} 累计执行的获取直播间数据的延时任务次数已达上限。。OMG`
        )
      }
      this.liveErrorConfig.requestTimeoutId = window.setTimeout(() => {
        this.liveErrorConfig.requestNum += 1
        // console.log(
        //   `====log:获取直播间【vid:${this.info.vid}】的最新数据 第${this.liveErrorConfig.requestNum}次`
        // )
        const anchorUid = resolveLiveRoomAnchorUid(this.query, this.info)
        if (anchorUid == null) {
          this.resetLiveErrorHandler()
          return
        }
        getRoomInfo({
          uid: anchorUid,
          videoType: resolveLiveVideoType(this.is_index)
        })
          .then((res) => {
            setTimeout(() => (this.endConfirm = false), 3000)
            let { info: roomInfo, userData } = res.data
            /** 看是否是robot直播  还是回放 */
            this.$store.commit('house/setIsRobotAction', userData?.iszr)
            this.$store.commit('house/setIsReplayAction', roomInfo?.isRecord)

            // eslint-disable-next-line no-prototype-builtins
            let liveClosed = Number(roomInfo.islive) === 2 || !roomInfo.hasOwnProperty('islive')
            if (liveClosed) {
              this.handleLiveClosed()
            } else {
              if (roomInfo.match_id !== this.info.match_id) {
                const curAnchorUid = resolveLiveRoomAnchorUid(this.query, this.info)
                if (curAnchorUid != null && this.info.uid === curAnchorUid) {
                  this.$emit('onHandleMatchInfoToggle', roomInfo.match_id, res.data)
                }
              }
              let urlList = {}
              let paramsObj = {}
              this.iframe_url
                .split('?')[1]
                .split('&')
                .forEach((item) => {
                  paramsObj[item.split('=')[0]] = item.split('=')[1]
                })

              if (this.is_index) {
                // 首頁視頻不需要切換高低清
                urlList.s_url = `${encodeURIComponent(roomInfo.pull)}`
                paramsObj['s_url'] = urlList.s_url
                paramsObj['h_url'] = urlList.s_url
              } else {
                urlList.s_url = `${encodeURIComponent(roomInfo.clarity.smooth)}`
                if (this.isLogin) {
                  urlList.h_url = `${encodeURIComponent(roomInfo.clarity.hd)}`
                  paramsObj['s_url'] = urlList.s_url
                  paramsObj['h_url'] = urlList.h_url
                } else {
                  paramsObj['s_url'] = urlList.s_url
                }
              }

              this.initPlayer = true
              // 切换视频源
              this.handlePostMessage({
                messageType: 'controlIframe',
                event: 'switchVideoSrc',
                urlList
              })
            }
            this.resetLiveErrorHandler()
          })
          .catch((err) => {
            this.endConfirm = false
            console.log('getRoomInfo err', err)
          })
      }, this.liveErrorConfig.requestTimeInterval)
    },
    // 重置直播异常处理记录
    resetLiveErrorHandler(numReset) {
      if (localStorage && Number(localStorage.getItem('debuggerMode')) === 1)
        console.log(
          '%c %s %c %s',
          'color:orange;',
          '====log:重置直播异常:第' + this.liveErrorConfig.requestNum,
          'color:red;font-size:16px;',
          new Date()
        )
      window.clearTimeout(this.liveErrorConfig.requestTimeoutId)
      this.liveErrorConfig.requestTimeoutId = ''
      if (numReset) this.liveErrorConfig.requestNum = 0
      this.endConfirm = false
    },
    pauseAdsClick() {
      const url = this.getCurrentCoverLink()

      if (url) {
        let newTab = window.open('about:blank')
        newTab.location.href = url
      }
    },
    videoAdOnload() {
      if (
        !this.firstShowPauseAds ||
        !['loading-ad', 'loading-system', 'loading-local'].includes(this.coverSource) ||
        this.videoAdCountdownInterval
      ) {
        return
      }

      this.imgLoadState = true
      window.clearTimeout(this.loadingCoverTimeout)
      this.loadingCoverTimeout = null
      this.videoAdCountdownInterval = window.setInterval(() => {
        if (this.videoAdCountdown === 1) {
          this.isShowPauseAds = false
          this.firstShowPauseAds = false
          this.applyPauseCover()
          window.clearInterval(this.videoAdCountdownInterval)
          this.videoAdCountdownInterval = null
        } else {
          this.videoAdCountdown--
        }
      }, 1000)
    },
    videoError() {
      if (this.coverSource === 'loading-ad') {
        this.applyLoadingCover(1)
        this.startLoadingCoverTimeout()
        return
      }
      if (this.coverSource === 'loading-system') {
        this.applyLoadingCover(2)
        this.startLoadingCoverTimeout()
        return
      }
      if (this.coverSource === 'pause-ad') {
        this.applyPauseCover(1)
        return
      }
      if (this.coverSource === 'pause-system') {
        this.applyPauseCover(2)
        return
      }

      this.isShowPauseAds = false
      this.firstShowPauseAds = false
      this.imgLoadState = false
      this.videoAdCountdown = 1
      window.clearInterval(this.videoAdCountdownInterval)
      this.videoAdCountdownInterval = null
      window.clearTimeout(this.loadingCoverTimeout)
      this.loadingCoverTimeout = null
    }
  },
  beforeUnmount() {
    if (this.isWebFullscreen) this.exitWebFullscreen()
    mittBus.off('ifreamAddpro', this.setifreamAddpropertyFun)
    mittBus.off('imOnMessage', this.handleIMMessage)

    window.removeEventListener('keydown', this.eventAdd)
    window.removeEventListener('message', this.listenIframe)
    // document.removeEventListener('visibilitychange', this.reloadPlayerHandler)
    window.removeEventListener('resize', this.resizeHandler)
    if (this.$refs.iframeRef)
      this.$refs.iframeRef.removeEventListener('fullscreenchange', this.fullScreenProcessing)
    clearTimeout(this.Iime)
    window.clearInterval(this.timeInterval)
    window.clearInterval(this.redirectTimer)
    window.clearInterval(this.videoAdCountdownInterval)
    window.clearTimeout(this.loadingAdWaitTimer)
    window.clearTimeout(this.loadingCoverTimeout)
    this.intervalId && window.clearInterval(this.intervalId)
  }
}
</script>
<style lang="scss" scoped>
.player_container.player-web-fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  z-index: 2147483000;
}
.web-fullscreen-exit {
  position: absolute;
  top: max(8px, env(safe-area-inset-top));
  right: max(8px, env(safe-area-inset-right));
  min-height: 44px;
  padding: 0 12px;
  z-index: 110;
  color: #fff;
  background: rgba(0, 0, 0, .65);
  border: 0;
  border-radius: 4px;
  cursor: pointer;
}

.live-detail-container {
  width: 100%;
  margin: 0 auto;
  position: relative;
  padding: 10px 0 40px !important;
  border-top: 1px solid #e5e1e1;
  background-size: 100% 100%;
}

.live-detail-container .layout-ad-column {
  margin-bottom: 20px;
  height: 123px;
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
}

.live-detail-container .live-layout-match-info {
  margin-bottom: 20px;
  width: 100%;
  background-color: #fff;
}

.live-detail-container .live-odd {
  border-top: 1px solid #e5e1e1;
  min-height: 80px;
}

.live-detail-container .live-match {
  margin-top: 8px;
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgba(69, 74, 99, 0.08);
  background-color: #fff;
  overflow: hidden;
}

.live-detail-container .tvs {
  border-radius: 10px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
  margin: 20px auto 0;
  width: 100%;
  overflow: hidden;
}

.live-detail-container .tvs .tv {
  height: 205px;
  width: 280px;
  margin-right: 29px;
}

.live-detail-container .tvs .title {
  margin-right: 0;
  margin-top: 10px;
  line-height: 16px;
  height: 16px;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  width: 275px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.live-detail-container .tvs .logo {
  background: #ccc;
  height: 160px;
  border-radius: 5px;
  margin: 0;
}

.live-detail-container .tvs .anchor {
  margin-top: 10px;
  font-size: 14px;
  height: 24px;
  line-height: 24px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.live-detail-container .tvs .anchor img {
  width: 24px;
  height: 24px;
  margin-right: 9px;
}

.live-detail-container .live-wrapper .matchlive {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 60%;
  flex: 1;
  height: 100%;
}

.live-detail-container .live-wrapper .matchlive-up {
  border-radius: 4px;
}

.live-detail-container .live-wrapper .matchlive .type-name {
  color: #999;
}

.live-detail-container .live-wrapper .matchlive .type-name img {
  width: 14px;
  height: 14px;
  object-fit: cover;
}

.live-detail-container .live-wrapper .matchlive .type-val {
  color: #333;
  margin-right: 20px;
}

.live-detail-container .live-wrapper .matchlive .hot-anchor-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
}

.live-detail-container .live-wrapper .matchlive .hot-anchor-wrap .hot-anchor-wrap-item {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 171px;
  flex: 1;
  height: 100%;
  margin-right: 13px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
}

.live-detail-container .live-wrapper .matchlive .hot-anchor-wrap .hot-anchor-wrap-item:hover {
  color: #67728f;
}

.live-detail-container .live-wrapper .matchlive .hot-anchor-wrap .hot-anchor-wrap-item:last-child {
  margin-right: 0;
}

.live-detail-container .live-wrapper .matchlive .hot-anchor-wrap .hot-anchor-wrap-item .name {
  display: inline-block;
  max-width: 105px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.live-layout-mian {
  width: 100%;
  padding-left: 100px;
  padding-right: 100px;
  padding-top: 0;
  min-width: 1440px;
}

.live-layout-mian .live-layout-player {
  justify-content: center;
}

.layout-container-live-detail,
.live-layout-mian .live-layout-player {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.layout-live-detail-left {
  width: 100%;
  max-width: 1445px;
  min-width: 1170px;
  margin: 0 auto;
  align-items: start;
}

.layout-live-detail-left .location {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10px;
}

.layout-live-detail-left .anchorBox {
  background: #fff;
  width: 100%;
  height: 193px;
  margin: 20px 0;
  border-radius: 10px;
  padding-top: 15px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
}

.layout-live-detail-left .anchorBox .img {
  width: 251px;
  margin: auto;
}

.layout-live-detail-right {
  width: 336px;
  min-height: 800px;
  margin-left: 10px;
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
  background: #fff;
  margin-top: 20px;
}

.matchInfo {
  background: #fff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding-left: 75px;
  position: relative;
}

.matchInfo .ppp {
  position: absolute;
  right: 2px;
  bottom: -1px;
  opacity: 0.5;
  font-size: 12px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #959db0;
  transform: scale(0.7);
}

.matchInfo .teamlogo-wrapper {
  object-fit: cover;
  position: absolute;
  top: 10px;
  left: 10px;
  width: 48px;
  height: 48px;
  border-radius: 4px;
  cursor: pointer;
}

.matchInfo .teamlogo-wrapper img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  cursor: pointer;
}

.matchInfo .row {
  display: flex;
  justify-content: space-between;
  height: 70px;
}

.matchInfo .row .left {
  min-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 1;
}

.matchInfo .row .left .title {
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin-right: 20px;
}

.matchInfo .row .left .title .editable {
  align-items: center;
  font-size: 20px;
  height: 28px;
  line-height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.matchInfo .row .left .title .ant-input {
  max-width: 500px;
  padding: 5px 14px;
  border-radius: 5px;
  font-size: 20px;
  line-height: 22px;
  caret-color: #ff6b00;
  font-weight: 700;
  border: 1px solid #ccc;
  color: #333;
  min-width: 285px;
}

.matchInfo .row .left .title .bj {
  width: 16px;
  height: 16px;
  margin-left: 10px;
  cursor: pointer;
}

.matchInfo .row .left .title .qd,
.matchInfo .row .left .title .qx {
  width: 28px;
  height: 28px;
  cursor: pointer;
}

.matchInfo .row .left .title .qd {
  margin-left: 15px;
}

.matchInfo .row .left .title .qx {
  margin-left: 10px;
}

.matchInfo .row .left .title .ivu-input {
  width: 520px;
  height: 34px;
  max-width: 300px;
  padding: 5px 14px;
  border-radius: 5px;
  font-size: 22px;
  line-height: 22px;
  caret-color: #ff6b00;
  font-weight: 700;
  color: #333;
  border: 1px solid #ccc;
}

.matchInfo .row .left .title .ivu-input:focus {
  border: 1px solid #ccc;
  box-shadow: none;
}

.matchInfo .row .left .des {
  color: #959db0;
  font-size: 12px;
  height: 29px;
  display: flex;
  align-items: center;
}

.matchInfo .row .left .des .level-img {
  width: 40px;
}

.matchInfo .row .left .des .level-img img {
  width: 40px;
  height: 24px;
  object-fit: cover;
}

.matchInfo .row .left .des .type-name-img {
  width: 12px;
  height: 12px;
}

.matchInfo .row .left .des .type-val {
  color: #959db0;
  font-size: 12px;
  margin-left: 3px;
  margin-right: 25px;
  max-width: 120px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.matchInfo .row .right {
  display: flex;
  flex-shrink: -1;
  margin-right: 10px;
  align-items: center;
}

.matchInfo .row .right .concern-box {
  display: flex;
  justify-content: center;
  min-width: 160px;
}

.matchInfo .row .right .concern-box .concern {
  cursor: pointer;
  display: inline-block;
  height: 26px;
  width: 80px;
  line-height: 26px;
  background-image: linear-gradient(112deg, #eecfb5 -1%, #d8ad66);
  color: #fff;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
  user-select: none;
}

.matchInfo .row .right .concern-box .concern:hover {
  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)),
    linear-gradient(112deg, #eecfb5 -1%, #d8ad66);
}

.matchInfo .row .right .concern-box .concern img {
  width: 11px;
  height: 11px;
  margin-right: 3px;
  vertical-align: middle;
  margin-bottom: 4px;
}

.matchInfo .row .right .concern-box .cancelConcern {
  cursor: pointer;
  display: inline-block;
  height: 26px;
  width: 80px;
  line-height: 26px;
  background-image: linear-gradient(90deg, #dfe0f2, #bebfd0);
  color: #fff;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  text-align: center;
  font-size: 14px;
  vertical-align: middle;
  user-select: none;
}

.matchInfo .row .right .concern-box .cancelConcern:hover {
  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)),
    linear-gradient(90deg, #dfe0f2, #bebfd0);
}

.matchInfo .row .right .concern-box .cancelConcern img {
  width: 17px;
  height: 15px;
}

.matchInfo .row .right .concern-box .num {
  display: inline-block;
  height: 26px;
  min-width: 80px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  line-height: 26px;
  background-color: rgba(149, 152, 230, 0.1);
  color: #959db0;
  text-align: center;
  padding: 0 15px;
  font-size: 12px;
  vertical-align: middle;
}

.matchInfo .row .right .concern-box .num .icon_man {
  width: 12px;
  height: 12px;
  vertical-align: top;
  margin-top: 7px;
}

.matchInfo .row .right .concern-box .num .num_text {
  margin-left: 4px;
}

.matchInfo .row .right .middle-box {
  width: 320px;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.matchInfo .row .right .middle-box .share-hover-phone,
.matchInfo .row .right .middle-box .share-hover-text {
  color: #959db0;
}

.matchInfo .row .right .middle-box .share-hover-text .danmus-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  text-align: center;
  border-radius: 50%;
  border: 1px solid #959db0;
  line-height: 18px;
}

.matchInfo .row .right .middle-box .share-hover-phone .phone-icon,
.matchInfo .row .right .middle-box .share-hover-phone .report-icon,
.matchInfo .row .right .middle-box .share-hover-phone .share-icon,
.matchInfo .row .right .middle-box .share-hover-text .phone-icon,
.matchInfo .row .right .middle-box .share-hover-text .report-icon,
.matchInfo .row .right .middle-box .share-hover-text .share-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURUdwTK6415ifspafs5aesZifs5afsZWesZWespaesJWdsP///8HG0dDU3K+1w/Dx9KZK7GEAAAAKdFJOUwAFUD7HJZy6kekfUjrLAAAA7klEQVQoz2NgoBCIGikHooqozVq1amUSsojJKjBwRohIrIKCRpiIYBVMaLkAVEgczF0HIgqhQl1godOvgMQKiAgzRNPpPSDSACzEAhXafQpIOoCFtCBCt3eDlC0CC2WBDf+9e/fuW6tWLQOJMM6CiezeC/QCyBmsEF1gALQ0AGrh2t1wIZCVTAhFIPMVIEJrgNz/QNNOQYWAGlfv/vsK6C64W4HG3/4D1gxSBDYe6Ii/YNfvA5FgRwCdegvubYhTYR6CgEXI3oYAB+TAgQAD5CAEgxUoAb0KOaAZMaMDS6Rhi1psCQBbMgHaQWJSAwCTmOCA8HHYJQAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-size: 100% 100% !important;
  vertical-align: middle;
}

.matchInfo .row .right .middle-box .share-hover-phone .share-txt,
.matchInfo .row .right .middle-box .share-hover-text .share-txt {
  color: #959db0;
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
  margin-left: 5px;
}

.matchInfo .row .right .middle-box .share-hover-phone .report-icon,
.matchInfo .row .right .middle-box .share-hover-text .report-icon {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA8UExURUdwTJeespadsZyiuLvDypigs5aesZaesKmqvpWesZagspWesZadsZWesZWdsP///9LV3rzBzers752ltm7AzrsAAAAOdFJOUwBd0RMELJPCDHxE7PilBlcZpQAAANVJREFUOMvNkusOgyAMhcv9IhbF93/XocaKgHHJsmznDzT9ODkUAH4r68UzpJE/QxxRfhkSosxkilso2qoQGBVSnUZqQGp4RCqUZ/7AMoOOToyIYTUWLifKGvRaycwYCyXlAdiAh4KWIMKFyX0GUm/tOU3bagR4ZttRb0yMcd6pziQ8ErRbFZnp5ryBgrgxKqHWSncg3nmyXSmm5djX0c8REYKoKogaU5qWJ6jM9Bl0CV5D4Z3gGlvxegSSuVrtH7A9XZykHrCnMBZv7PBOY5Ha3Ar+VS+6qxfpcMYm/wAAAABJRU5ErkJggg==)
    no-repeat;
  background-size: 100% 100%;
}

.matchInfo .row .right .middle-box .share-hover-phone .phone-icon,
.matchInfo .row .right .middle-box .share-hover-text .phone-icon {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAeUExURUdwTJadsJaespaftJuitpaesZadsJeesJigsZWdsNyWtHoAAAAJdFJOUwDmXz0aps1EPtXxYSkAAABdSURBVCjPY2CgCBQpgYE6QsRtJhSIwIUiYUJT4UKSMKGJo0LUExJsNgYDCyQhIHYKARKoQpnTMIRmzsQQipyKIiTpwMDApMDAwIIQikyCJABVRNQ6wtyVgi+ZkAMA1WaBMZyR5gYAAAAASUVORK5CYII=)
    no-repeat;
  background-size: 100% 100%;
}

.matchInfo .row .right .middle-box .share-hover-phone:hover,
.matchInfo .row .right .middle-box .share-hover-phone:hover .share-txt,
.matchInfo .row .right .middle-box .share-hover-text:hover,
.matchInfo .row .right .middle-box .share-hover-text:hover .share-txt {
  color: #ba9250;
  border-color: #ba9250;
}

.matchInfo .row .right .middle-box .share-hover-phone:hover .report-icon,
.matchInfo .row .right .middle-box .share-hover-text:hover .report-icon {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABCUExURUdwTPHHg/PKhfHHg//ttPHHg/LIg/zTkPHGgvHHg/HHgvLJhPHHgvHHg/HHg/DGgv////Xarfnozfz05vfiv/HLjE864+QAAAAPdFJOUwDRI/oElTMNw3ztRVm0Zh+ypzkAAADaSURBVDjLzZLtDoIwDEU39lFgm52A7/+qFpCtbCCJidHzh5qeXG4qQvwWcHAtGZTXkkTUX5YAeKeWLZo0Nkr5vLA5yPaYFg4xWY3zbtPIwY69AtUcDB01Inoz/9LktLmIJssJcetxQxktQHGH8H4xiWkclift7Q3qU8/cY4zTMoWDSzhM0hrFOqdaspJUcxLEpTrKMGl6zfLgL1sZ4/jY5rJ6PlFSEMtSaUF3Spo9kXint9JwJe2K20+KG6yR5Qm070rqbwCO2CVp0+MRKrCwDs8IrHV7RhD/yhMIFBluoOfQsQAAAABJRU5ErkJggg==)
    no-repeat;
  background-size: 100% 100%;
}

.matchInfo .row .right .middle-box .share-hover-phone:hover .share-icon,
.matchInfo .row .right .middle-box .share-hover-text:hover .share-icon {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAqUExURUdwTPLHhfHHg/HHg/HJhPHHgvHIg/HGgvDGgv////jkw/barv337fPSnHiT0zIAAAAIdFJOUwBBl8dZuiXpQSSPiQAAANpJREFUKM9jYKAQsIk4JqCKCFV0dLQrIosId4CBIUKEqQMKFOBCETChVpgIK5jbCyICoEIaYKGdO4BEE0SEEaJp5WwQKQAWYoYKzQQpMwALScCEZgHJRoRR3Sdnzpy5AmZYBcg6kAhIWTvYdxBdYHCjoyMBamHXTLgQyEoWhCKQ+Q4QoW4g98xJsPFgIaDGzpmndgBVwt0KNH7labhTwcYDHXEK4aF2qFNXgL19owPub4kOJNCI7G0IMEAOHAgQQA7CDoRRsIDuQA5oLNGBLdKwRC22BIAtmZAOAM6islCDBLssAAAAAElFTkSuQmCC)
    no-repeat;
  background-size: 100% 100%;
}

.matchInfo .row .right .middle-box .share-hover-phone:hover .phone-icon,
.matchInfo .row .right .middle-box .share-hover-text:hover .phone-icon {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAhUExURUdwTPHGg/LIhPPJhvXMh/HHg/HHgvHHg/DIhPHHg/DGgtlOsZoAAAAKdFJOUwDmXj0ardTtRIIGwbqFAAAAWUlEQVQoz2NgoAg0KYGBBkLEbRUUpMCFomBCS+FCUjChhaNC1BMSN4YCJCEg9pwCJFCFspZhCK1ahSEUtRRFSMqBgYFJgYGBBSEUFQRJAKpL8SUALMmEHAAAsfKOyYwpGrUAAAAASUVORK5CYII=)
    no-repeat;
  background-size: 100% 100%;
}

.matchInfo .row .right .download {
  position: relative;
  cursor: pointer;
  font-size: 14px;
  color: #999;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAiCAMAAAAAh4u3AAAAclBMVEUAAACampqampqampqampqampqampqcnJyZmZmcnJyZmZmampqampqampqampqampqenp6kpKSampqZmZmZmZmcnJyampqampqcnJyampqampqampqampqZmZmampqbm5ubm5udnZ2ampqampqZmZmZmZlPabahAAAAJXRSTlMA7lb53h5hD9M79eW1hXBJCwegnkIs68UhmJJ+z6RUTTEYu7qtSY4OhQAAAWtJREFUOMudktuCgjAMRFuKtOUOchFBFHX+/xcXibZ1gX3YeaLpYZImYY508lBc+O3Fk2xbMolgJOLbFpM2r6t01Lcs6F745fAbyWMgCqRNPJ8b/c0cFESff4UqHyL48lHg2arGO+AGY/CarVQ83XAKYX/xgpNJMEAZ3wY9M+LwbKkhPmUliPIVZK4K+ooI34Ikx0gtgZB7EDuifFvGbBe6gi/5Hkj3oRxYHqsw7kOsgaao/gNSdBSgrTj1LlQFBLX0dJ8mNEU4W6gKiaVbYum1OBO0MD6tk8Ayvgs6ci5niiDL1IBcJoqIIPKaIcuwHi21XkAz68XRWYYNnybGiO0UFhnmCvFenBtQWcplmKJ6qXRfGsplEoST2a0G9+JzKC3jwR2rFniavZsMI1AyRwEwGAOTi/ytMo4wke4iKaAkxqpWAD9eczr0AxCmbK0gwqxGtb4AILqJbakYSw5Sm1IPt7mT9oKsluw/+gGhFiI93wRx6gAAAABJRU5ErkJggg==)
    no-repeat left 2px;
  background-size: 17px 17px;
  vertical-align: middle;
}

.matchInfo .row .right .dw_content:before {
  content: '';
  display: block;
  position: absolute;
  top: -12px;
  left: 295px;
  z-index: 101;
  width: 10px;
  height: 15px;
  background: url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wgARCAAgABQDAREAAhEBAxEB/8QAGgAAAgIDAAAAAAAAAAAAAAAAAQIEBgMFCf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAO/ABiGAYjGxK+WQYxn/xAAkEAACAQQBAgcAAAAAAAAAAAABAgQAAxESIQVBECIxQlFh4f/aAAgBAQABPwDb5NbLWTRl86ijfe3y1LMXH5XQ47y2Mq6PKDx91LjCTZZO/tq5KeNcazdyCD3zSIlpNEGB4GMjMX5BPrhyM1//xAAUEQEAAAAAAAAAAAAAAAAAAAAw/9oACAECAQE/AE//xAAUEQEAAAAAAAAAAAAAAAAAAAAw/9oACAEDAQE/AE//2Q==)
    no-repeat 0 0;
  background-size: 10px 15px;
}

.matchInfo .row .right .download:hover {
  color: #ff6b00;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAMAAAANmfvwAAAAh1BMVEUAAAD/bQD/bAD/gAD/cAD/bAD/awD/bAD/awD/bAD/bQD/dwD/gAD/bQD/bAD/bgD/bQD/bAD/bAD/bAD/bQD/bAD/bAD/bAD/bAD/bAD/bAD/awD/bAD/bAD/awD/awD/awD/bAD/bAD/bQD/awD/awD/bAD/bQD/bAD/cAD/dAD/eAD/awAiZ/r3AAAALHRSTlMAVu0EHvr2357SSg4KYORCLOmjcjzDmJJ+8Lu3soeDZTkx1SLbyK1sUBkXESDVoY0AAAFrSURBVDjLldPZcoMwDAVQGTDBbAECKdkISZr9/v/3FaIWuSU89D4wXs54jDQmK+1ubRx/VhUqoneJmhxD9PYwFtcO6M1ClYdwv0wBFN5vEG+BdC/HtxsgL23hGeg6JjvzT+jEOsNgFdKfPNeALG6xymgU9yLLV2jhKvGsw43Lf5ujpiEOlFzRB1+nQRq/J7T73sqxpwkS8ayFjqYIBSheh21oktzguERrLKZJDJyIjlAThKclf6aJ6ac+uO+n2ibzhMm5r8yMO/FI8SFk7rPk3YrL4gboDJNezLgPGhlRgSUNhomIDIiIFFIS0xMRVKPqi6zRWsbBUgQZLtoWGxLTRUQI/RoegLkYW7hHvmd/4c+nGBHUwL/zyMuxdgcjQkHaV2pc4h/zGISPgIYkgJGXxbQBKpck4Qr+LrIXjkDQC0lmACe4xTypDeAvRq8mSYGOmfNMA9DLO40Tq8IBp1p4NBH3VKokzCL6b74AaD8nVBHLAvAAAAAASUVORK5CYII=)
    no-repeat left 2px;
  background-size: 16px 17px;
}

.matchInfo .row .right .dw_content {
  position: absolute;
  width: 370px;
  height: 246px;
  background: #fff;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  bottom: -262px;
  left: -273px;
  z-index: 150;
  padding: 15px;
}

.matchInfo .row .right .dw_title {
  height: 40px;
  line-height: 30px;
  color: #333;
  font-size: 14px;
  text-align: left;
  padding-bottom: 10px;
  border-bottom: 1px solid #e1e1e1;
}

.matchInfo .row .right .left {
  float: left;
  width: 199px;
  height: 176px;
  font-size: 12px;
  line-height: 12px;
  text-align: left;
  padding-top: 8px;
  flex-shrink: 1;
  color: #666;
  background-size: contain;
}

.matchInfo .row .right .left i {
  color: #ff6b00;
  font-style: normal;
}

.matchInfo .row .right .right_div {
  height: 157px;
  padding-top: 8px;
  float: left;
  width: 139px;
  color: #666;
  font-size: 12px;
  line-height: 12px;
  text-align: left;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN4AAADeAQMAAABoqSz0AAAABlBMVEUAAAD/awCd9j9OAAAAAXRSTlMAQObYZgAAAD9JREFUWMPt2cEJwCAURMFfWCCtp6QUIKwN6FEUnLm+DnYryVcDb9JWxb+mHlE8NQIAAADADY4b5sSL4obHogOnMG2Z2ewkWQAAAABJRU5ErkJggg==)
    no-repeat 3px 46px;
  background-size: 111px 111px;
}

.matchInfo .row .right .qrcode {
  width: 94px;
  height: 94px;
  margin: 36px 0 0 11px;
}

.matchInfo .row .right .qrcode img {
  width: 100%;
}

.matchInfo .row .right .dw_btn {
  margin-left: 24px;
  height: 30px;
  display: inline-block;
  line-height: 30px;
  border-radius: 16px;
  background-image: linear-gradient(72deg, #ff6b00, #ff8e02);
  width: 94px;
  text-align: center;
  font-size: 12px;
  color: #fff;
}

.matchInfo .row .right .dw_btn img {
  width: 16px;
  height: 16px;
  margin-right: 2px;
}

.matchInfo .row .right1 {
  width: auto;
}

.matchInfo .row .right1 .concern-box {
  margin-left: 20px;
}

.matchInfo .row .right2 {
  min-width: 160px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

.matchInfo .row .right2 .concern-box {
  margin-left: 0;
  margin-right: 0;
}

.player-header-phone-share {
  width: 300px;
}

.player-header-phone-share ul li {
  list-style: none;
}

.player-header-phone-share .big-title {
  font-size: 14px;
  font-weight: 700;
  padding: 10px 0 12px;
  color: #333;
  text-align: center;
  border-bottom: 1px solid #e8e8e8;
}

.player-header-phone-share .phone-box-ul {
  display: flex;
  font-size: 12px;
  margin-top: 10px;
  justify-content: center;
}

.player-header-phone-share .phone-box-ul .phone-box-li {
  width: 55%;
  margin-bottom: 5px;
}

.player-header-phone-share .phone-box-ul .phone-box-li p {
  text-align: center;
  font-size: 15px;
  margin-top: 5px;
}

.player-header-phone-share .phone-box-ul .phone-box-li .phone-left-img {
  width: 160px;
  margin-top: -12px;
}

.player-header-phone-share .phone-box-ul .phone-box-li .phone-left-foot {
  white-space: break-spaces;
}

.player-header-phone-share .phone-box-ul .phone-box-li-right {
  width: 48%;
  /* margin-left: 10% */
}

.player-header-phone-share .phone-box-ul .phone-box-li-right .qrcode-bg {
  /* width: 112px; */
  /* height: 112px; */
  padding: 10px;
  margin: 5px 0 10px;
  background-color: #fff;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN4AAADeCAYAAABSZ763AAAAAXNSR0IArs4c6QAABIRJREFUeAHt3EFOw1AMBUDCfXL/g+RAZdWqCl3U1PlYesOGgizHHuupsOl22/fb14Kv7Ti2BY/xCAJ/EliVg/tw3/cXvhMgsE5A8NZZexKBh4DgPSi8ILBOYDv/bet/sXX4npQjcM6Zd7yc29t0kIDgDTqGUXIEBC/n1jYdJCB4g45hlBwBwcu5tU0HCQjeoGMYJUdA8HJubdNBAoI36BhGyREQvJxb23SQgOANOoZRcgQEL+fWNh0kIHiDjmGUHAHBy7m1TQcJCN6gYxglR0Dwcm5t00ECgjfoGEbJERC8nFvbdJCA4A06hlFyBAQv59Y2HSQgeIOOYZQcAcHLubVNBwkI3qBjGCVHQPBybm1TAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQILBXYbvt+e37idhzb889eEyDwucA5Z9+ft9SBAIGqgOBVxdQTaBAQvAZELQhUBQSvKqaeQIOA4DUgakGgKiB4VTH1BBoEBK8BUQsCVQHBq4qpJ9AgIHgNiFoQqAoIXlVMPYEGAcFrQNSCQFVA8Kpi6gk0CAheA6IWBKoCglcVU0+gQUDwGhC1IFAVELyqmHoCDQKC14CoBYGqgOBVxdQTaBAQvAZELQhUBQSvKqaeQIOA4DUgakGgKvDrU8aqDd6t9+ll70qp+w+B86eAXT2Dd7yrhfUn8EJA8F6g+BWBqwUE72ph/Qm8EPgB6PoZyVyeerEAAAAASUVORK5CYII=);
  background-size: 100% 100%;
}

.player-header-phone-share .phone-box-ul .phone-box-li-right .appdown-btn {
  width: 95px;
  height: 28px;
  line-height: 28px;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  margin: 0 auto;
  /* margin-left: 10px; */
  background-image: url(data:image/png;base64,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);
  background-size: 100% 100%;
}

.player-header-phone-share .phone-box-ul .phone-box-li-right .appdown-btn:hover {
  background-image: url(data:image/png;base64,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);
}

.player-header-phone-share .phone-box-ul .phone-box-li-right .appdown-btn-txt {
  font-size: 12px;
  margin-left: 2px;
}

.play-header-live-share {
  width: 370px;
}

.play-header-live-share ul li {
  list-style: none;
}

.play-header-live-share .big-title {
  font-size: 14px;
  font-weight: 700;
  padding: 10px 0 12px;
  color: #333;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
}

.play-header-live-share .share-box-ul {
  overflow: hidden;
}

.play-header-live-share .share-box-ul .share-box-li {
  float: left;
}

.play-header-live-share .share-box-ul .share-box-li .share-icon {
  display: flex;
  padding: 24px 0;
}

.play-header-live-share .share-box-ul .share-box-li .share-icon .item-p {
  color: #666;
  line-height: 43px;
  margin-right: 22px;
}

.play-header-live-share .share-box-ul .share-box-li .share-icon .item-icon {
  width: 43px;
  height: 43px;
  margin-right: 22px;
}

.play-header-live-share .share-box-ul .share-box-li .qrcode-img {
  width: 92px;
  height: 92px;
  margin: 12px 0 5px 5px;
}

.play-header-live-share .share-box-ul .share-box-li .qrcode-txt {
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  color: #333;
}

.play-header-live-share .url-content {
  overflow: hidden;
  padding-bottom: 18px;
  margin-top: 10px;
}

.play-header-live-share .url-content input {
  width: 290px;
  padding: 0 10px;
  height: 36px;
  border-radius: 4px 0 0 4px;
  float: left;
  border: 1px solid #eaeaea;
  border-right: none;
  background: #f8f8f8;
  color: #333;
}

.play-header-live-share .url-content .btn {
  height: 36px;
  float: left;
  cursor: pointer;
  padding: 0 10px;
  border-radius: 0 4px 4px 0;
  line-height: 36px;
  color: #fff;
  font-size: 13px;
  background-image: linear-gradient(120deg, #eecfb5 -2%, #d8ad66);
}

.anchor-live-player-no-video {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #171717;
  z-index: 4;
}

.anchor-live-player-no-video .layout-anchor-nostart-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.anchor-live-player-no-video .layout-anchor-nostart-content .title-info {
  text-align: center;
  line-height: 32px;
  width: 222px;
  height: 41px;
  color: #666;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbwAAABSCAMAAAAYV5GrAAAAh1BMVEUAAAA/Pz84ODg5OTk4ODhAQEA5OTk4ODg7OztAQEA5OTk5OTk5OTk4ODg5OTk5OTk5OTk5OTk5OTk+Pj41NTU5OTkxMTE4ODg5OTk6Ojo4ODg4ODg5OTmAgIANDQ04ODg1NTUSEhIODg4QEBAqKioxMTEnJyceHh4WFhYaGhouLi4kJCQtLS1WRD1+AAAAHnRSTlMADfztxgX43ToZzTEo57epnWJVH/vzy7SPgH9wSAKOhsWJAAADWElEQVR42u3diVLqMBjF8a+UfbkoILj2pKWyiO//fPfOdaEaNYHUJJ05v0fwP8PYnrQVJ/PlAuRksZxLEHOmq8EiTL0lyjwjJ3mJpYSwANs5y7GQEICMnAFigfGixHgNxngNxngNxngNxngNxngNxngNxngN5hxvtEpxOsarA06VrkYf2nUBxrMTPh7QrdZrY7POTsd4Gh9/xfUGbXmXtFSRMZ6d8PGyQrUSedMB41mLIh461Z/NA+NZiiDeAW056rewZTw74eNt0epLxSWwZzwrwePtgUv54BZqx3g2QsfbKdzKJxdQOeNZCBwvV7iQzzp/8LhmPLOw8daP+NMRTTLEU8F4RkHjFU8YJvKFQQ8l4xkFjVeiN5AvjVNsGM8kZLwN0rF8o9/FlvEMAsbbotuXb81a2DOeQbB4e7Rm8oM7YMd4BoHi7YA7+dE1VM54BkHi5QrX8rOHKR7XjOcTYHmBN30Qg077Xz3G8wiwa9fuiFHSw3PBeAae4xXP6CViYT7BhvEMPMfbYDIXK6MrHBjPwGu8A65GYum+hS3j+QJYrK/3YlTdZhnPE+DE9VWnb7OM5wdgsb4a6Nss43kBmNdXI32bZTwfAPP6aqZvs4znAWBeX830bZbxPABM66sVfZtlvN8HGNZXS/o2y3i/DjCsr+eZQRWMp/EWr1CYydna2DGexlu8HdrCeFEzxOPPZsxMP5v8hyVixn9YeKkQL/OlAi/So2Vxkc7bY7GyuD3GG9OxsrkxzUkoUrVPQjccY408jrE3IjwGESXLYxA8gBQj2wNIPPoXIeujfzx0Gx/7Q7c87h6dE46780GT2JzwoAkf8YqNwyNeLg9XKn4Iyl0OdcbDle6PNZf8BJuzvER5xmPN7i8UyBXImcrdXyigr69mecl8jpT9j1ehbbPG9bUp3wmIHJA50bdZfX1lvBdxxqtus/r6ynivIo1X2Wb19ZXxXkUa77jN6usr472JNd7bNquvr4z3Ltp4L9usvr4y3lG88Y7bbPXV/IxXEXG8z6/mH+KQMV5VzPGyA4byLoEqGO+DqOMVCon2Iaha5JgIaSbIa4zXSrRPsNUhLzEV0kzrWWD0T7DJqIv6pAMhzSBFfbojqRivUtRjMmW7Lw2mE9QjXY3lv7+lCDj0rAZ04wAAAABJRU5ErkJggg==);
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}

.anchor-live-player-no-video .layout-anchor-nostart-content .live-reserve-box {
  width: 432px;
  height: 76px;
  border: 1px solid #d8ad66;
  background-color: #000;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 22px 16px;
  margin: 0 30px 35px;
  color: #d8ad66;
}

.anchor-live-player-no-video .layout-anchor-nostart-content .live-reserve-box .live-reserve-left {
  padding-right: 15px;
  border-right: 1px solid #d8ad66;
  line-height: 1;
}

.anchor-live-player-no-video
  .layout-anchor-nostart-content
  .live-reserve-box
  .live-reserve-left
  .live-reserve-name {
  margin-bottom: 8px;
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.anchor-live-player-no-video .layout-anchor-nostart-content .live-reserve-box .live-reserve-right {
  font-size: 16px;
  margin-left: 15px;
  display: flex;
  align-items: center;
}

.anchor-live-player-no-video
  .layout-anchor-nostart-content
  .live-reserve-box
  .live-reserve-right
  .live-reserve-vs {
  font-size: 12px;
  margin: 0 5px 0 3px;
}

.anchor-live-player-no-video
  .layout-anchor-nostart-content
  .live-reserve-box
  .live-reserve-right
  .live-reserve-guest,
.anchor-live-player-no-video
  .layout-anchor-nostart-content
  .live-reserve-box
  .live-reserve-right
  .live-reserve-host {
  display: inline-block;
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.anchor-live-player-no-video .layout-anchor-nostart-content .recommd-title-info {
  margin: 68px 0 38px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.anchor-live-player-no-video .layout-anchor-nostart-content .recommd-title-info .left-line {
  width: 55px;
  height: 1px;
  background-color: #b08a5b;
}

.anchor-live-player-no-video .layout-anchor-nostart-content .recommd-title-info .text {
  padding: 0 18px;
  font-size: 15px;
  height: 20px;
  color: #b08a5b;
}

.anchor-live-player-no-video .layout-anchor-nostart-content .recommd-title-info .right-line {
  width: 55px;
  height: 1px;
  background-color: #b08a5b;
}

.anchor-live-player-no-video .layout-anchor-nostart-content .recommd-list {
  display: flex;
  justify-content: center;
  width: 100%;
}

.anchor-live-player-no-video .layout-anchor-nostart-content .recommd-list > div {
  width: 25%;
  padding: 0 10px;
}

.anchor-live-player-no-video .layout-anchor-nostart-content .recommd-list > div > div {
  position: relative;
}

.anchor-live-player-no-video .layout-anchor-nostart-content .recommd-list > div > div:before {
  content: '';
  display: block;
  padding-top: 58%;
}

.anchor-live-player-no-video .layout-anchor-nostart-content .recommd-list > div > div > div {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 5px;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  cursor: pointer;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.anchor-live-player-no-video .layout-anchor-nostart-content .recommd-list .recommd-list-item .type {
  width: 50px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  font-size: 12px;
  color: #fff;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}

.anchor-live-player-no-video
  .layout-anchor-nostart-content
  .recommd-list
  .recommd-list-item
  .footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: absolute;
  padding: 0 10px;
  left: 0;
  right: 0;
  bottom: 0;
  height: 55px;
  background-image: linear-gradient(180deg, transparent -29%, #000);
}

.anchor-live-player-no-video
  .layout-anchor-nostart-content
  .recommd-list
  .recommd-list-item
  .footer
  .title {
  display: inline-block;
  width: 180px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.anchor-live-player-no-video
  .layout-anchor-nostart-content
  .recommd-list
  .recommd-list-item
  .footer
  .status {
  display: inline-block;
  margin-left: 5px;
  margin-bottom: 10px;
  width: 50px;
  height: 18px;
  font-size: 12px;
  border-radius: 10px;
  border: 1px solid #ff5d5d;
  background-color: rgba(0, 0, 0, 0.5);
  color: #ff5d5d;
  line-height: 16px;
  text-align: center;
}

.anchor-live-player-no-video .layout-anchor-nostart-content .recommd-list .recommd-list-item .mark {
  display: none;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.anchor-live-player-no-video
  .layout-anchor-nostart-content
  .recommd-list
  .recommd-list-item
  .mark
  img {
  display: block;
  width: 55px;
  height: 55px;
  top: 20px;
}

.anchor-live-player-no-video
  .layout-anchor-nostart-content
  .recommd-list
  .recommd-list-item:hover
  .mark {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.anchor-live-player-no-video
  .layout-anchor-nostart-content
  .recommd-list
  .recommd-list-item:hover
  .mark
  img {
  width: 40px;
  height: 40px;
  margin-bottom: 25px;
}

.anchor-news-wrap {
  margin-top: 22px;
  width: 100%;
  min-width: 800px;
  max-width: 1100px;
  min-height: 800px;
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgba(69, 74, 99, 0.08);
  background-color: #fff;
  overflow: hidden;
  flex: 1;
}

.anchor-news-wrap .tab {
  width: 100%;
  margin: 0 auto;
  position: relative;
  height: 44px;
  box-shadow: 0 0.5px 0 0 #ddd;
  background-color: #fff;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.anchor-news-wrap .tab .lable {
  position: absolute;
  transition: transform 0.3s ease-in-out;
  bottom: -1px;
  left: 0;
  width: 76px;
  height: 2px;
  background-color: #ff6b00;
}

.anchor-news-wrap .tab .tab-item {
  position: relative;
  cursor: pointer;
  width: 76px;
  font-size: 14px !important;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.anchor-news-wrap .tab .tab-item:before {
  left: 50%;
}

.anchor-news-wrap .tab .tab-item:after,
.anchor-news-wrap .tab .tab-item:before {
  transition: width 0.2s;
  transform-style: preserve-3d;
  content: '';
  position: absolute;
  bottom: -1px;
  width: 0;
  height: 2px;
}

.anchor-news-wrap .tab .tab-item:after {
  right: 50%;
  background-color: #ff6b00;
}

.anchor-news-wrap .tab .cur,
.anchor-news-wrap .tab .tab-item:hover {
  color: #b08a5b !important;
}

.anchor-news-wrap .tab .cur:before {
  transition: width 0.2s;
  transform-style: preserve-3d;
  content: '';
  position: absolute;
  bottom: 2px;
  margin-left: -5px;
  left: 50%;
  width: 9px;
  height: 6px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAMCAYAAABvEu28AAAAAXNSR0IArs4c6QAAAWZJREFUKBWNkr9PwkAUx98rZWliIiwGZllutpOJk6uDizPERF3c/RPcjY0ORmYXB1YnEiecu8BIKKSGiGj9UdrzvdprqxTxkpd7uffue9/73AEsGS+9dp1jSRvgXw3T7p2YffodRIRCUTdXatv2ov6FQnLQMsajWUeCFLwZAe3ymm5idcfLE9PyFnnN7U+twPdE6L8BB+du//l8UX+uI+f+qg4yvGYfAJLiu43cAaLWqGzuN38Lzgk57QsRzHy+kkFoQJIOz2oQL0/TimZl6+gHr0wLwODh0vDHkw7tjrikbthVZiDYxXLJrG4cJrz0TBk+ho4lE5FsZS4X4fCdeTVUJXHUuz2JuKREcvyoYmwQNa2xvnvaZLFIqHtzLAIJfCUjBazOSmf6AoSbgMfwiZ1HYdb2zmwctA6Mp4mMuNC1CCw1M+H/DuJVWi2Y+th9tcIw/nTkL/tKKle6/Hpqjc+Jc/E4QusLgQOVYo8O6GwAAAAASUVORK5CYII=);
  background-size: contain;
}

.anchor-news-wrap .tab-content {
  margin: 0 auto;
  position: relative;
  min-height: 500px;
  display: flex;
}

.anchor-news-wrap .tab-content .tab-content-item {
  flex-shrink: 0;
  width: 100%;
}

.anchor-news-wrap .tab-content .tab-content-item .ivu-page {
  text-align: center;
}

.anchor-news-wrap .tab-content .activeItem {
  display: none;
}

.anchor-news-wrap .padding21px {
  padding: 21px;
}

.anchor-news-wrap .not-fulfill-one-page-wrap {
  height: 72px;
  line-height: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  margin-top: -20px;
}

.anchor-news-wrap .not-fulfill-one-page-wrap .content {
  margin: 0 12px;
}

.anchor-news-wrap .not-fulfill-one-page-wrap .line {
  width: 40px;
  border-top: 0.2px solid #999;
}

.anchor-news-wrap .page-wrap {
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  height: 60px;
}

.personal-space-content-left .anchor-news-wrap {
  margin-top: 0 !important;
}

.live_play_back_wraps .live_play_back_list {
  padding-top: 15px;
  border-bottom: 1px solid #ebebeb;
}

.live_play_back_wraps .live_play_back_list:last-child {
  border-bottom: none;
}

.live_play_back_wraps .live_play_back_list .time_title {
  height: 31px;
  line-height: 31px;
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap {
  overflow: hidden;
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap .team_info {
  color: #333;
  font-size: 16px;
  font-weight: 700;
  height: 21px;
  line-height: 21px;
  margin: 10px 0 13px;
  width: 275px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap .other_info {
  color: #999;
  font-size: 14px;
  padding-top: 9px;
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap .other_info .time {
  border-right: 1px solid #d5d5d5;
  padding-right: 8px;
  height: 14px;
  line-height: 14px;
  display: inline-block;
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap .other_info .num_icon {
  width: 20px;
  height: 18px;
  object-fit: contain;
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap .live_play_back_itme_wraps {
  margin: 0 20px 15px 0;
  float: left;
  position: relative;
  cursor: pointer;
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap .img-wrap {
  position: relative;
  text-align: center;
  height: 160px;
  width: 275px;
  transition: all 0.5s ease-in-out;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap .img-wrap .play-total-time {
  position: absolute;
  right: 0;
  bottom: 0;
  min-width: 60px;
  height: 24px;
  background-image: linear-gradient(270deg, #000, transparent);
  color: #fff;
  text-align: right;
  font-size: 12px;
  padding: 0 5px 0 23px;
  line-height: 24px;
  border-radius: 0 0 5px 0;
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap .img-wrap .title-line {
  position: absolute;
  width: 100%;
  height: 52px;
  background-image: linear-gradient(0deg, transparent, #000);
  left: 0;
  top: 0;
  color: #fff;
  text-align: left;
  font-size: 16px;
  padding: 5px 0 0 8px;
  border-radius: 5px 5px 0 0;
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap .img-wrap .title-line .con {
  max-width: 165px;
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap .img-wrap img {
  height: 100%;
  width: 100%;
  border-radius: 5px;
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap .img-wrap .mask {
  position: absolute;
  height: 160px;
  width: 275px;
  left: 0;
  top: 0;
  display: flex;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap .img-wrap .mask img {
  margin: auto;
  opacity: 0;
  height: 30px;
  width: 30px;
  transform: scale(1.6);
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap .img-wrap:hover .mask {
  -webkit-animation: pulse 0.5s ease;
  -moz-animation: pulse 0.5s ease;
  background: hsla(0, 0%, 40%, 0.5);
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap .img-wrap:hover .mask img {
  display: inline-block;
  -webkit-animation: playBtn 0.5s ease;
  -moz-animation: playBtn 0.5s ease;
  transform: scale(1);
  opacity: 1;
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap .img-wrap .angle-icon {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 88px;
  height: auto;
  z-index: 1;
}

.live_play_back_wraps .live_play_back_list .pay_back_list_wrap:last-child {
  margin-bottom: 15px;
  border-bottom: none;
}

@-webkit-keyframes pulse {
  0% {
    background: hsla(0, 0%, 40%, 0.8);
  }

  to {
    background: hsla(0, 0%, 40%, 0.5);
  }
}

@-moz-keyframes pulse {
  0% {
    background: hsla(0, 0%, 40%, 0.8);
  }

  to {
    background: hsla(0, 0%, 40%, 0.5);
  }
}

@-webkit-keyframes playBtn {
  0% {
    -webkit-transform: scale(1.6);
  }

  to {
    -webkit-transform: scale(1);
  }
}

@-moz-keyframes playBtn {
  0% {
    -webkit-transform: scale(1.6);
  }

  to {
    -webkit-transform: scale(1);
  }
}

.reload_video_btn {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #fff;
  margin-top: 14px;
}

.danmu-container {
  position: absolute;
  height: 112px;
  box-sizing: border-box;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 99;
  /* 弹幕区域挡住了关闭暂停广告的关闭按钮 */
  pointer-events: none;
}
.player_container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #14092a;
  position: absolute;
  top: 0;
  .video_bottom_logo {
    position: absolute;
    left: 20px;
    bottom: 20px;
    width: 120px;
    z-index: 1;
  }
  .anchor-live-player-no-video {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .layout-anchor-nostart-content {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    .anchor-close-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 60px;
      img {
        width: 64px;
        height: 64px;
      }
      .anchor-close-text {
        font-size: 20px;
        color: #666;
        padding: 10px 0;
        margin-bottom: 5px;
      }
      .redirect-countdown {
        font-size: 0.8em;
        color: #f4ca4e;
        padding-left: 0.5em;
      }
    }

    // padding-top: 24%;
    .player-loading {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 2px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .recommd-list {
      .recommd-list-item {
        &:hover {
          transform: scale(1.05);
          transform-origin: center;
          transition: all 0.3s linear;
        }
      }
    }
  }
  .mute_btn {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 96px;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 1;
    width: 120px;
    height: 40px;
    border-radius: 5.8px;
    cursor: pointer;
    background: rgba(208, 45, 84, 0.8);
    .mute_btn_text {
      display: block;
      font-size: 16px;
      text-align: center;
      color: #fff;
      margin-left: 2px;
    }
    .mute_btn_icon {
      width: 22px;
      height: 22px;
      display: none;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAAB65masAAAERUlEQVRYCeWYS4hOYRjHzQwjuUzuFu4LCyFZSGLELLAQEcrOQqNZEAtlQ7MSK+XSFCtCuZekXLJAyYLcipIm5d5Mxv0+fs/nPMfzPed857zHzIq3/vM+l//zvP/vO+d9z/mmR4//aXR2dk4HN8BH0AJquv3z03Qg6F20MTVLwWdgx/qifTL5dF4HfoA20JBJNkm4jVEdU9k4ZWhdN2ndatrLZcoVCWeLqfHm5a6rMh3oftitUFEkvGqwx/G92+0C+7HCFbdKQiT5WnDU8cSVjXHPxLtXoHyZNM8VCeesEaFmc1R/RwPMmQLJy717CMw1FzLfpCBTJPkFQHesbKom7YodJBDeDKDjO8Ya7ZE6QxgE5KhYC2pAiMgOeMttQ/xQgbPh2vETZ5XtFdskGsBrwz6CHSKyLm4SGdQFCRQ63G1mTTHlfp9S1pOAHMyvgB9BIsua/V40WKDUsugmt7A8iarivjiLHcG6hUVSnCqQ+HwgD4Kh8eKRQewgsGN1zCEqRXbIzTvKoFbI+Jn3pDaElxBIbC7QIbdS2a7FrwP2Fruv/WRhL3B0nHQG3FyRcG4DHaVjBmeNBqL5E/Mc2x5/g+PUl/IEgwVKAfxMkeTtEaQCexE/D+x4hjNYRWLLXhDhOnZVEjhGiyrNdAgVWRIofaiRU+GArh7N2+0axE6a/O1SjoD/BnMFRguGiDznBPRkvQdGxBvsnsrB3mhy8gCoS7sHx2pB3kyDPJGJXtSsNCLEnKPrYPvDe2q1Jv9mrqqqek/dQnDV1PfBPsNiDeRbTVxNy5XYJE0wPze2mIO7JFA65IkUjh3wn+J3mNgIY7cbW8whaQL/nOKOXcktKpI+70yvn8b+amwxa9MEOk6YGyqSSy+bwj5NnpgV/LO9vdsEyiKBIocZQWJagUNcrk0+zTcXXM2nbHOx7/gXEfDQxROuiKReNo4cMbMigm6cReQvkV9C/DT4Aa5HHJkmG1vM53LM1IOQIS+oy1yDhAtnMwh5VZMnzj7bAH8n0PGilMOTHz/XNJozy+G51jb1Nnl5WQh6C4JX9sMe/zHQ8ecnK5Fh4Dj4qtmceasXpj51+jYTJNLU+UO6UXPxTPPeYCwYZzAe+wTwYy+BxCYjpgKFv1uaM2c+cSKOHO46PmD4HR3rTBiQ5TZo0WozH8Mu+zcJvhVoXxYyRVJn34L2J0SEBGjSDPyQXdlf67FTBUqeXIjIdngjtV/hmeImIJvFjps4wyMRFQVG+TyR9tFXWF+pADHLwRerEPsRkPs1U2CIyL9T5aoQMg+8BXa8wHlpAvE96MqzLnf8+uVrCvsImeYEGW0ls6JAWQxG2uW+a4UkjgmbzLN5bN2EMxM8zuOm5eWxSNy/T35I43YpxjcxAtwqfWflfw6FNKakL9gB5PfxhJCawhwaDwAXgA7Z6bn/AM1bqPDLaVZDBEm/FWAiOM8lvJbF/ydyvwBeczm56psw7AAAAABJRU5ErkJggg==);
      background-size: 100% 100%;
    }
  }
  .iframe-container {
    position: relative;
    width: 100%;
    height: 100%;
    background: #14092a;
    z-index: 0;
  }
  // 播放器兜底封面图：iframe 未就绪时防黑屏
  // z-index:1 保证低于 pause_ads_wrapper.first_show(102)，不遮挡启动加载图
  .player_fallback_cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: #14092a;      // 图片未加载时与容器背景一致，无差异
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}
// 兜底封面图 0.3s 淡出动画
.player-fallback-fade-leave-active {
  transition: opacity 0.3s ease;
}
.player-fallback-fade-leave-to {
  opacity: 0;
}
:deep(.vjs-playback-rate) {
  display: none;
}

.button-container {
  position: absolute;
  z-index: 999;
  button {
    padding: 0 10px;
    -webkit-appearance: none;
    background: #006eff;
    border: 0;
    color: #fff;
    height: 30px;
    min-width: 24px;
    font-size: 15px;
    margin-right: 5px;
    z-index: 99999999;
    border-radius: 5px;
    opacity: 0;
    cursor: pointer;
    &:nth-child(1) {
      background: #006eff;
    }
    &:nth-child(2) {
      background: #ff0000;
    }
  }
}
.button-container:hover button {
  opacity: 1;
}
.register-enjoy-HD {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 65px;
  right: 25px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 10px;
  z-index: 1;
  cursor: pointer;
  .register-HD-title {
    background-color: #00aeec;
    padding: 3px 5px;
    color: #ffffff;
    border-radius: 10px;
  }
  .register-HD-text {
    color: #f26392;
    text-decoration: underline;
    margin-left: 10px;
  }
}

.pause_ads_wrapper {
  position: absolute;
  z-index: 101;
  top: 50%;
  left: 50%;
  width: 80%;
  transform: translate(-50%, -50%);
  .df_container {
    width: 100%;
  }
}
.video_ad_countdown {
  display: none;
  position: absolute;
  width: 20px;
  height: 20px;
  line-height: 20px;
  right: 15px;
  top: 15px;
  color: var(--el-color-primary);
  font-size: 12px;
  border-radius: 12px;
  background-color: #fff;
  text-align: center;
  z-index: 102;
}
.pause_ads_wrapper.first_show {
  background-color: rgba(0, 0, 0, 1);
  height: 100%;
  width: 100%;
  max-width: 100%;
  z-index: 102;
  .video_ad_countdown {
    display: block;
  }
}
.close_video_ad_btn {
  position: absolute;
  width: 36px;
  height: 36px;
  right: -35px;
  top: -18px;
  background: url('/static/images/feedback/close.png') no-repeat top left / 100% 100%;
  cursor: pointer;
}
.pause_ads {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 101;
  cursor: pointer;
}
</style>
