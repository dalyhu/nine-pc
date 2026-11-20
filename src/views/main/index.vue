<template>
  <div class="app-main">
    <el-dialog
      v-model="adPopVisible"
      align-center
      :show-close="false"
      :close-on-click-modal="true"
      modal-class="normal_dialog"
    >
      <div class="ad_pop_container">
        <div
          class="ad_pop_close_btn"
          @click="
            () => {
              player?.clear()
              adPopVisible = false
            }
          "
        ></div>
        <div
          @click="openUrl(advertisingImgMap['100'].advertising_url)"
          v-if="advertisingImgMap['100'].svga_url"
          class="svg_ad_box"
        >
          <canvas ref="svgAdPlayer"></canvas>
        </div>
        <el-image
          @click="openUrl(advertisingImgMap['100'].advertising_url)"
          v-else
          class="img_ad"
          fit="contain"
          :src="advertisingImgMap['100'].img_address"
        />
      </div>
    </el-dialog>

    <div class="home-page">
      <div class="home-page-banner" :class="{ 'need-bottom-mask': advertisingImgMap['000'] }">
        <div class="home-page-banner-backend-bg">
          <img v-if="advertisingImgMap['000']" :src="advertisingImgMap['000'].img_address" />
        </div>
        <div v-if="advertisingImgMap['000']" class="home-page-banner-frontend-bg">
          <img :src="advertisingImgMap['000'].img_address" />
        </div>
        <div class="home-page-banner-main layout-adaptive small">
          <div class="home-page-live">
            <div class="home-page-live-box">
              <div class="video-box">
                <live-player
                  ref="homeLivePlayerRef"
                  :info="detail"
                  :liveClosed="liveClosed"
                  :showDanmaku="false"
                  :query="{ type: 'main' }"
                >
                </live-player>
                <!-- 开赛倒计时 -->
                <CountdownToStart
                  v-if="isShowCountdownBroadcast"
                  :countDown="countDown"
                  :isShowIcon="false"
                  @closeCountDown="closeCountDown"
                ></CountdownToStart>
              </div>
            </div>
          </div>
          <div class="home-page-live-list">
            <div class="home-page-videos-playList" v-if="videosPlayList.length">
              <df-container
                class="videos-playList--item"
                v-for="(item, index) in videosPlayList"
                :key="item.id"
              >
                <div
                  class="inner-box"
                  :class="{ active: currentVideoIndex === index }"
                  @click="selectVideoByIndex(index)"
                >
                  <img :src="item.thumb" class="video-thumb" />
                </div>
              </df-container>
            </div>
          </div>
        </div>
      </div>

      <!-- 广告 -->
      <div class="home-page-scroll-ads">
        <div class="scroll-ads-box layout-adaptive small">
          <ScrollAds />
        </div>
      </div>

      <div class="home-page-main">
        <div
          class="download-banner layout-adaptive"
          @click="openUrl(advertisingImgMap['001'].advertising_url)"
          v-if="advertisingImgMap['001']"
        >
          <el-image
            :src="advertisingImgMap['001'].img_address"
            class="download-banner--figure"
            loading="lazy"
          />
        </div>
        <!-- 热门直播 -->
        <div class="home-page-hot-live layout-adaptive">
          <dfHgroup title="热门直播" btnText="更多" link="/anchor?type=-1">
            <template v-slot:prepend>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
              >
                <circle cx="14" cy="14" r="14" fill="#FFC813" />
                <path
                  d="M18.3009 12.9636L12.2968 9.49792C11.4975 9.03754 10.5 9.61302 10.5 10.537V17.4682C10.5 18.3922 11.4975 18.9677 12.2968 18.5073L18.3009 15.0417C19.1001 14.5813 19.1001 13.4271 18.3009 12.9668V12.9636Z"
                  fill="white"
                />
              </svg>
            </template>
          </dfHgroup>
          <div class="wrapper">
            <dfLiveCardGroup :list="hotLiveList.slice(0, 10)" :isIndex="true" />
          </div>
        </div>

        <!-- 倒计时 -->
        <activityCountdown :countdownData="countdownData" />
        <!-- 首页赛程 -欧洲杯、美洲杯 -->
        <indexSchedule :countdownData="countdownData" class="home-page-schedule-banner" />

        <!-- 两个轮播banner -->
        <section class="main-info-banner-grid layout-adaptive">
          <dfHgroup title="官方活动">
            <template v-slot:prepend>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="29"
                height="28"
                viewBox="0 0 29 28"
                fill="none"
              >
                <circle cx="14.8848" cy="14" r="14" fill="#FF7A59" />
                <path
                  d="M12.932 19.7694C13.2366 20.1546 13.6247 20.4655 14.0671 20.6787C14.5095 20.8918 14.9945 21.0017 15.4856 21C15.9766 21.0017 16.4617 20.8918 16.904 20.6787C17.3464 20.4655 17.7346 20.1546 18.0392 19.7694C16.3445 19.9991 14.6266 19.9991 12.932 19.7694ZM20.2106 11.9V12.3928C20.2106 12.9843 20.3786 13.5625 20.695 14.0546L21.4706 15.2607C22.1783 16.3625 21.6379 17.8598 20.4066 18.2077C17.1892 19.1191 13.782 19.1191 10.5646 18.2077C9.33329 17.8598 8.79289 16.3625 9.50059 15.2607L10.2762 14.0546C10.5937 13.5585 10.7621 12.9817 10.7613 12.3928V11.9C10.7613 9.1938 12.8767 7 15.4856 7C18.0945 7 20.2106 9.1938 20.2106 11.9Z"
                  fill="white"
                />
              </svg>
            </template>
          </dfHgroup>
          <div class="wrapper">
            <dfContainer class="main-info-banner" :height-ratio="29.49">
              <div class="swiper swiper-container" v-if="mainBannerAdList.length">
                <swiper
                  :modules="adSwiperModules"
                  v-bind="adSwiperOption"
                  style="width: 100%; height: 100%"
                >
                  <swiper-slide
                    v-for="(item, index) in mainBannerAdList"
                    :key="item.id"
                    :lazy="true"
                  >
                    <img
                      :src="item.img"
                      class="swiper-lazy banner-item--img"
                      @click="adSlideClick(index)"
                      loading="lazy"
                    />
                    <div class="swiper-lazy-preloader"></div>
                  </swiper-slide>
                  <div class="swiper-button-prev" ref="adSwiperBtnPrevRef"></div>
                  <div class="swiper-button-next" ref="adSwiperBtnNextRef"></div>
                </swiper>
              </div>
            </dfContainer>

            <div
              class="ad-swiper-navigation-button ad-swiper-navigation-button-prev"
              @click="slideToPrev"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="52"
                height="53"
                viewBox="0 0 52 53"
                fill="none"
              >
                <g filter="url(#filter0_b_3303_22581)">
                  <path
                    d="M25.7758 50.1727C38.8763 50.1727 49.5517 39.5623 49.5517 26.4887C49.5517 13.4388 38.8763 2.80469 25.7758 2.80469C12.6516 2.80469 2 13.4388 2 26.4887C2 39.3407 12.2936 49.8123 25.1107 50.1636L25.7758 50.1727Z"
                    fill="#2C2A2B"
                  />
                  <path
                    d="M25.7621 51.1726L25.7621 51.1727L25.7758 51.1727C39.4243 51.1727 50.5517 40.1188 50.5517 26.4887C50.5517 12.8829 39.4249 1.80469 25.7758 1.80469C12.1023 1.80469 0.999999 12.8835 0.999998 26.4887C0.999997 39.8873 11.7298 50.7972 25.0833 51.1632L25.0833 51.1633L25.097 51.1635L25.7621 51.1726Z"
                    stroke="#F2F3F5"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <g filter="url(#filter1_b_3303_22581)">
                  <path
                    d="M30.462 19.5276C31.1753 18.8408 31.1753 17.7277 30.4858 17.0171C30.1292 16.6619 29.6774 16.4961 29.2019 16.4961C28.7502 16.4961 28.2984 16.6619 27.9656 17.0171L19.6678 25.2355C19.3349 25.5671 19.1447 26.0171 19.1447 26.4907C19.1447 26.9644 19.3349 27.4144 19.6678 27.746L27.9656 35.9643C28.6551 36.6749 29.7725 36.6749 30.4858 35.9643C31.1753 35.2775 31.1753 34.1407 30.462 33.4538L23.4482 26.4907L30.462 19.5276Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_b_3303_22581"
                    x="-15.5755"
                    y="-14.7708"
                    width="82.7028"
                    height="82.5182"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="7.78775" />
                    <feComposite
                      in2="SourceAlpha"
                      operator="in"
                      result="effect1_backgroundBlur_3303_22581"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_backgroundBlur_3303_22581"
                      result="shape"
                    />
                  </filter>
                  <filter
                    id="filter1_b_3303_22581"
                    x="9.40984"
                    y="6.7614"
                    width="31.3249"
                    height="39.4713"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="4.86735" />
                    <feComposite
                      in2="SourceAlpha"
                      operator="in"
                      result="effect1_backgroundBlur_3303_22581"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_backgroundBlur_3303_22581"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
            <div
              class="ad-swiper-navigation-button ad-swiper-navigation-button-next"
              @click="slideToNext"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="52"
                height="52"
                viewBox="0 0 52 52"
                fill="none"
              >
                <g filter="url(#filter0_b_3303_22587)">
                  <path
                    d="M25.775 49.368C12.6745 49.368 1.99913 38.7576 1.99913 25.684C1.99913 12.6341 12.6745 2 25.775 2C38.8992 2 49.5508 12.6341 49.5508 25.684C49.5508 38.536 39.2572 49.0076 26.4401 49.3589L25.775 49.368Z"
                    fill="#2C2A2B"
                  />
                  <path
                    d="M25.7886 50.3679L25.7886 50.368L25.775 50.368C12.1265 50.368 0.99913 39.3142 0.999129 25.684C0.999127 12.0782 12.1258 1 25.775 1C39.4485 1 50.5508 12.0788 50.5508 25.684C50.5508 39.0826 39.821 49.9925 26.4675 50.3585L26.4675 50.3586L26.4538 50.3588L25.7886 50.3679Z"
                    stroke="#F2F3F5"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <g filter="url(#filter1_b_3303_22587)">
                  <path
                    d="M21.0887 18.723C20.3755 18.0361 20.3755 16.923 21.065 16.2125C21.4216 15.8572 21.8733 15.6914 22.3489 15.6914C22.8006 15.6914 23.2523 15.8572 23.5852 16.2125L31.883 24.4308C32.2158 24.7624 32.406 25.2124 32.406 25.6861C32.406 26.1597 32.2158 26.6097 31.883 26.9413L23.5852 35.1597C22.8957 35.8702 21.7782 35.8702 21.065 35.1597C20.3755 34.4728 20.3755 33.336 21.0887 32.6492L28.1026 25.6861L21.0887 18.723Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_b_3303_22587"
                    x="-15.5765"
                    y="-15.5755"
                    width="82.7028"
                    height="82.5182"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="7.78775" />
                    <feComposite
                      in2="SourceAlpha"
                      operator="in"
                      result="effect1_backgroundBlur_3303_22587"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_backgroundBlur_3303_22587"
                      result="shape"
                    />
                  </filter>
                  <filter
                    id="filter1_b_3303_22587"
                    x="10.8161"
                    y="5.95671"
                    width="31.3246"
                    height="39.4713"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="4.86735" />
                    <feComposite
                      in2="SourceAlpha"
                      operator="in"
                      result="effect1_backgroundBlur_3303_22587"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_backgroundBlur_3303_22587"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </section>
        <!-- 赛事推荐 和 新闻头条 -->
        <section class="match-and-news-grid layout-adaptive">
          <div class="grid-left">
            <matchRecommend :isDoneInitUserId="isDoneInitUserId" />
          </div>
          <div class="grid-right">
            <newsHeadlines :isDoneInitUserId="isDoneInitUserId" />
          </div>
        </section>
        <!-- 倒计时 & 官方活动 & 主播推荐 -->
        <section class="main-footer">
          <df-image-lazy
            :src="getImageUrl('/static/images/index/index--main-footer-bg.png')"
            placeholder-src="/static/images/placeholder_gray_bg.png"
            error-icon="/static/images/placeholder_gray_bg.png"
            class="inner--bg-img"
          />
          <!-- 主播推荐 -->
          <anchorRecommend class="home-page-anchorRecommend layout-adaptive" />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup name="MainIndex" lang="ts">
import { getBannerList, getCountdown } from '../../api/common.js'
import { getAdList, getLivesList, getActivityUrl, getRoomInfo } from '../../api/user.js'
import { nextTick, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import dfHgroup from '@/components/dfHgroup/index.vue'
import matchRecommend from '@/components/matchRecommend/index.vue'
import newsHeadlines from '@/components/newsHeadlines/index.vue'
import activityCountdown from '@/components/activityCountdown/index.vue'
import anchorRecommend from '@/components/anchorRecommend/index.vue'
import ScrollAds from '@/components/ScrollAds/index.vue'
import livePlayer from '@/views/anchor/live-player-iframe.vue'
import CountdownToStart from '@/components/CountdownToStart.vue'
import { Parser, Player } from 'svga'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import { getImageUrl } from '@/utils/common.js'
import { resolveLiveVideoType } from '@/utils'
import dfContainer from '@/components/dfContainer/index.vue'
import indexSchedule from '@/components/indexSchedule/index.vue'

// 进入直播间按钮动效配置（单位：毫秒）
const ENTER_BUTTON_ANIMATION_INTERVAL = 5 * 60 * 1000 // 5 分钟

interface AdsMapItem {
  ad_id: string
  advertising_url: string
  img_address: string
  svga_url?: string
  id: number | string
  url: string
}
interface AdvertisingImgMap {
  [key: string]: AdsMapItem
}
interface ActivityItem {
  img: string
  id: number | string
  url: string
}

defineOptions({
  name: 'MainIndex',
  inheritAttrs: true
})

const isDoneInitUserId = ref(false)

// 左右两个轮播-左边的   ==== 注释未使用的代码，测试打包
// const swiperModules = [Autoplay, Pagination]
// const swiperOption = {
//   loop: true,
//   autoplay: {
//     delay: 3000
//   },
//   pagination: {
//     clickable: true
//   }
// }
// const slideClick = (swiper) => {
//   let url = mainBannerList.value[swiper.clickedIndex].url
//   if (url) {
//     window.open(url, '_blank')
//   }
// }
// 左右两个轮播-右边的
const adSwiperBtnPrevRef = ref(null)
const adSwiperBtnNextRef = ref(null)
const adSwiperModules = [Autoplay, Navigation]
const adSwiperOption = {
  loop: true,
  autoplay: {
    disableOnInteraction: false,
    delay: 5000,
    pauseOnMouseEnter: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  }
}
const adSlideClick = (index) => {
  let url = mainBannerAdList.value[index].url
  if (url) {
    window.open(url, '_blank')
  }
}
const slideToPrev = () => {
  adSwiperBtnPrevRef.value.click()
}
const slideToNext = () => {
  adSwiperBtnNextRef.value.click()
}

// 首页弹窗 静态图片/动画
const adPopVisible = ref(false)
const svgAdPlayer = ref<HTMLCanvasElement | null>(null)
const parser = ref(null)
const player = ref(null)

const advertisingImgMap = ref<AdvertisingImgMap>({})
const mainBannerAdList = ref<ActivityItem[]>([])
const getAdListAction = () => {
  getAdList().then((res: { data: any[] }) => {
    res.data.forEach((el) => {
      if (el.ad_id === '100') {
        advertisingImgMap.value['100'] = el || {}
        adPopVisible.value = Boolean(el.svga_url || el.img_address)
        if (el.svga_url) nextTick(() => initMachineSVGA())
      } else {
        advertisingImgMap.value[el.ad_id] = el
      }
    })
  })
}
// 获取活动
const getActivityUrlAction = () => {
  getActivityUrl().then((res) => {
    mainBannerAdList.value = res.data.data
  })
}

// 获取热门直播列表
const detail = ref<any>({
  islive: 1 // islive: 1 在播放中的视频
}) // 直播数据
const liveClosed = ref(false)
const servertime = ref(0) // 服务器时间
const isShowCountdownBroadcast = ref(false) // 是否显示倒计时
const countDown = ref(0) // // 开播倒计时
const hotLiveList = ref<any[]>([])
const currentVideoIndex = ref(0)
const videosPlayList = ref<any[]>([])
const homeLivePlayerRef = ref<any>(null)
let liveListRequestSeq = 0
let roomInfoRequesting = false

const normalizeLiveRoom = (room: any = {}) => {
  room.islive = room.isLive ?? room.islive
  room.is_loop = room.isLoop ?? room.is_loop
  room.user_nickname = room.userNickname ?? room.user_nickname
  return room
}

const getLiveRoomIds = (room: any = {}) => {
  return [
    room.currentRoomId,
    room.roomId,
    room.room_id,
    room.liveRoomId,
    room.live_room_id,
    room.id
  ]
    .filter((id) => id !== undefined && id !== null && id !== '')
    .map((id) => String(id))
}

const getLiveAnchorIds = (room: any = {}) => {
  return [room.uid]
    .filter((id) => id !== undefined && id !== null && id !== '')
    .map((id) => String(id))
}

const isSameLiveRoom = (source: any, target: any) => {
  const sourceRoomIds = new Set(getLiveRoomIds(source))
  const targetRoomIds = getLiveRoomIds(target)

  if (sourceRoomIds.size || targetRoomIds.length) {
    return targetRoomIds.some((id) => sourceRoomIds.has(id))
  }

  const sourceAnchorIds = new Set(getLiveAnchorIds(source))
  if (!sourceAnchorIds.size) return false
  return getLiveAnchorIds(target).some((id) => sourceAnchorIds.has(id))
}

const findLiveRoomIndex = (list: any[], room: any) => {
  if (!room) return -1
  return list.findIndex((item) => isSameLiveRoom(item, room))
}

const getCurrentLiveRoom = () => {
  return detail.value || videosPlayList.value[currentVideoIndex.value]
}

const isRoomBroadcasting = (room: any = {}) => Number(room.islive ?? room.isLive) === 1

const updateLiveCountdown = (info: any = {}) => {
  countDown.value = 0
  isShowCountdownBroadcast.value = false

  // 已在直播中不再展示开播倒计时（避免 starttime 仍为赛事时间导致误判）
  if (isRoomBroadcasting(info) || Number(info.islive ?? info.isLive) === 2) return

  const starttime = Number(info.starttime || 0)
  const currentServertime = Number(info.servertime ?? servertime.value ?? 0)

  if (starttime - currentServertime > 0 && starttime > 0) {
    countDown.value = starttime - currentServertime
    isShowCountdownBroadcast.value = true
  }
}

const refreshCurrentRoomInfo = async (room = getCurrentLiveRoom()) => {
  if (!room?.uid || roomInfoRequesting) return false

  roomInfoRequesting = true

  try {
    const latestRoomInfo = await getLatestRoomInfo(room)
    if (!isSameLiveRoom(getCurrentLiveRoom(), room)) return false

    updatePlayerRoom(latestRoomInfo)
    return true
  } catch {
    return false
  } finally {
    roomInfoRequesting = false
  }
}

const isHomePlayerUnableToPlay = () => {
  const player = homeLivePlayerRef.value
  if (!player || Number(player.countDown) > 0) return false

  return Boolean(
    player.isError || player.playerUrlLoading || (!player.initPlayer && !liveClosed.value)
  )
}

const updatePlayerRoom = (room: any) => {
  if (!room) return

  let nextRoom = normalizeLiveRoom({ ...room, servertime: servertime.value })
  // 已在直播时对齐 starttime，避免播放器内部再次进入 pull_tc 倒计时
  if (isRoomBroadcasting(nextRoom)) {
    nextRoom = { ...nextRoom, starttime: servertime.value }
  }

  updateLiveCountdown(nextRoom)
  detail.value = nextRoom
  liveClosed.value = Number(nextRoom.islive) === 2

  if (!isShowCountdownBroadcast.value && !liveClosed.value) {
    nextTick(() => startHomePlayer())
  }
}

const applyRoomForPlayback = (room: any) => {
  if (!room) return

  const nextRoom = normalizeLiveRoom({ ...room, servertime: servertime.value })
  detail.value = nextRoom
  liveClosed.value = Number(nextRoom.islive) === 2
}

const startHomePlayer = async () => {
  await nextTick()
  const player = homeLivePlayerRef.value
  if (!player || liveClosed.value) return

  player.countDown = false
  if (typeof player.computePlayerUrl === 'function') {
    await player.computePlayerUrl()
  }
}

const syncLivePlaybackAfterListUpdate = async (currentRoom: any) => {
  if (!videosPlayList.value.length) {
    currentVideoIndex.value = 0
    liveClosed.value = true
    updateLiveCountdown()
    return
  }

  const latestCurrentRoomIndex = findLiveRoomIndex(videosPlayList.value, currentRoom)

  if (latestCurrentRoomIndex > -1) {
    const room = videosPlayList.value[latestCurrentRoomIndex]
    if (currentVideoIndex.value === latestCurrentRoomIndex) {
      updatePlayerRoom(room)
    } else {
      currentVideoIndex.value = latestCurrentRoomIndex
    }

    if (!isShowCountdownBroadcast.value && isHomePlayerUnableToPlay()) {
      await refreshCurrentRoomInfo(room)
    }
    return
  }

  await activeFirstLiveRoom()
}

const selectVideoByIndex = (index: number) => {
  if (!videosPlayList.value[index]) return
  currentVideoIndex.value = index
}

watch(
  () => currentVideoIndex.value,
  (index) => {
    const liveRoomDetails = videosPlayList.value[index]
    if (liveRoomDetails) {
      updatePlayerRoom(liveRoomDetails)
    }
  }
)

const getLatestRoomInfo = async (room: any) => {
  if (!room?.uid) return room

  const res = await getRoomInfo({
    uid: room.uid,
    videoType: resolveLiveVideoType(true)
  })
  const { info = {}, userData = {}, vid } = res.data || {}

  return normalizeLiveRoom({
    ...room,
    ...info,
    uid: info.uid ?? userData.uid ?? room.uid,
    vid: vid ?? info.vid ?? room.vid,
    userNickname: userData.user_nickname || info.userNickname || room.userNickname || '',
    user_nickname: userData.user_nickname || info.user_nickname || room.user_nickname || ''
  })
}

const activeFirstLiveRoom = async () => {
  const firstLiveRoom = videosPlayList.value[0]
  if (!firstLiveRoom) {
    currentVideoIndex.value = 0
    liveClosed.value = true
    updateLiveCountdown()
    return
  }

  currentVideoIndex.value = 0

  try {
    const latestRoomInfo = await getLatestRoomInfo(firstLiveRoom)
    updatePlayerRoom(latestRoomInfo)
  } catch {
    updatePlayerRoom(firstLiveRoom)
  }
}

const getLiveListAction = async () => {
  const requestSeq = ++liveListRequestSeq
  let data = {
    page: 1,
    type: -1,
    limit: 1000
    // isweb: 1
  }
  try {
    const res: any = await getLivesList(data)
    if (requestSeq !== liveListRequestSeq) return

    const currentRoom = getCurrentLiveRoom()
    const list = (res.data || []).map((item) => normalizeLiveRoom({ ...item }))
    hotLiveList.value = list

    // 首页视频轮播列表取前六个
    videosPlayList.value = hotLiveList.value.slice(0, 6)

    servertime.value = Number(res.page?.extData?.servertime || 0)
    await syncLivePlaybackAfterListUpdate(currentRoom)
  } catch {
    // ignore
  }
}

// 直播倒计时关闭
const closeCountDown = async () => {
  countDown.value = 0
  isShowCountdownBroadcast.value = false

  const liveRoomDetails = videosPlayList.value[currentVideoIndex.value]
  if (!liveRoomDetails) return

  try {
    const latestRoomInfo = await getLatestRoomInfo(liveRoomDetails)
    applyRoomForPlayback({
      ...latestRoomInfo,
      starttime: servertime.value
    })
  } catch {
    applyRoomForPlayback({
      ...liveRoomDetails,
      starttime: servertime.value
    })
  }

  await startHomePlayer()
}

// 中间左侧的大banner 同H5
const mainBannerList = ref([])
const getBannerListAction = () => {
  getBannerList({
    banner_type: 1,
    type: 1
  }).then((res: { data: any[] }) => {
    mainBannerList.value = res.data
  })
}

function openUrl(url) {
  if (!url) return

  window.open(url, '_blank')
  adPopVisible.value = false
}

async function initMachineSVGA() {
  try {
    if (!parser.value || !player.value) {
      if (!(svgAdPlayer.value instanceof HTMLCanvasElement)) return

      parser.value = parser.value || new Parser()
      player.value = player.value || new Player(svgAdPlayer.value)

      const svga = await parser.value.load(advertisingImgMap.value['100'].svga_url)
      // const svga = await parser.value.load('/static/images/live/gifts/520.svga')
      await player.value.mount(svga)
    }

    nextTick(() => {
      player.value.start()
    })
  } catch (error) {
    // console.log(error)
  }
}

const countdownData = ref<CountdownDataListItem[]>([])
const getCountdownAction = () => {
  getCountdown({ type: 1 }).then((res) => {
    // test code:
    // Object.assign(res.data[0], {
    //   date: '2024-04-25',
    //   date_diff: 5
    //   // matchs: []
    // })
    // Object.assign(res.data[1], {
    //   date: '2024-04-28',
    //   date_diff: -1
    // })
    countdownData.value = res.data
  })
}

const refreshHomePageData = () => {
  getLiveListAction()
  getCountdownAction()
}

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    refreshHomePageData()
  }
}

// 进入直播间按钮动效逻辑
let enterButtonAnimationTimer: number | null = null
const triggerEnterButtonAnimation = () => {
  const button = document.querySelector('.anchor-home-page-top-play-area-enter-button')
  if (button) {
    button.classList.add('bounce-animation')
    setTimeout(() => {
      button.classList.remove('bounce-animation')
    }, 2000) // 动效持续 2 秒（跳动 3 次）
  }
}

const startEnterButtonAnimationTimer = () => {
  stopEnterButtonAnimationTimer()
  enterButtonAnimationTimer = window.setInterval(() => {
    triggerEnterButtonAnimation()
  }, ENTER_BUTTON_ANIMATION_INTERVAL)
}

const stopEnterButtonAnimationTimer = () => {
  if (enterButtonAnimationTimer !== null) {
    clearInterval(enterButtonAnimationTimer)
    enterButtonAnimationTimer = null
  }
}

onMounted(() => {
  refreshHomePageData()
  getAdListAction()
  getActivityUrlAction()
  getBannerListAction()
  document.addEventListener('visibilitychange', handleVisibilityChange)
  isDoneInitUserId.value = true

  // 启动进入直播间按钮动效定时器
  startEnterButtonAnimationTimer()
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  stopEnterButtonAnimationTimer()
})
</script>

<style lang="scss" scoped>
$mediumMaxWidth: 1144px;
$smallMaxWidth: 800px;
.app-main {
  width: 100%;
  overflow-x: hidden;

  .ad_pop_container {
    position: relative;
    .ad_pop_close_btn {
      position: absolute;
      width: 32px;
      height: 32px;
      top: -14px;
      right: -14px;
      cursor: pointer;
      z-index: 2;
      background: url(/static/images/daily/close.png) center center no-repeat;
      background-size: auto 100%;
    }
    .svg_ad_box {
      width: 500px;
      height: 600px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      cursor: pointer;
      > canvas {
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: auto;
      }
    }
    .img_ad {
      cursor: pointer;
      width: 500px;
      height: 600px;
    }
  }

  .home-page {
    .home-page-banner {
      padding-top: 28px;
      position: relative;
      .home-page-banner-backend-bg {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: #1d1e1f;
        > img {
          position: absolute;
          filter: blur(20px);
          left: -20px;
          top: -20px;
          right: -20px;
          bottom: -20px;
          display: block;
          width: 100%;
          height: auto;
          transform: scale(3.5);
          transform-origin: center center;
        }
      }
      .home-page-banner-frontend-bg {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
        width: auto;
        height: 100%;
        max-width: var(--max-layout-width);
        -webkit-mask-image: url(/static/images/home/mask.svg);
        mask-image: url(/static/images/home/mask.svg);
        > img {
          display: block;
          width: auto;
          height: 100%;
          margin: 0 auto;
        }
      }
      .home-page-banner-main {
        position: relative;
        z-index: 4;
        display: flex;
        max-width: 1424px;
        margin: 0 auto;
        box-sizing: border-box;
        overflow: hidden;
        .home-page-live {
          flex: 1;
          overflow: hidden;
          position: relative;
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
          // 视频
          .home-page-live-box {
            flex: 1;
            position: relative;
            width: 100%;
            overflow: hidden;
            box-sizing: border-box;
            .video-box {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
            }
            &::before {
              content: '';
              display: block;
              padding-bottom: 56.25%;
            }
          }
        }
        .home-page-live-list {
          width: 16%;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          padding: 8px;
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
          background-color: rgba(0, 0, 0, 0.8);
          .home-page-videos-playList {
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .inner-box {
              cursor: pointer;
              position: relative;
              box-sizing: border-box;
              border: 2px solid transparent;
              border-radius: 8px;
              overflow: hidden;
              width: 100%;
              height: 100%;
              overflow: hidden;
              &:hover {
                border-color: var(--el-primary-border-color);
              }
              &.active {
                border-color: var(--el-primary-border-color);
              }
            }
            .video-thumb {
              display: block;
              box-sizing: border-box;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }
      &.need-bottom-mask::after {
        content: '';
        left: 0;
        bottom: 0;
        z-index: 3;
        position: absolute;
        width: 100%;
        height: 90px;
        pointer-events: none;
        background: linear-gradient(180deg, rgba(242, 243, 245, 0), rgba(242, 243, 245, 1));
      }
    }

    .home-page-scroll-ads {
      width: 100%;
      position: relative;
      overflow: hidden;
      z-index: 4;
      margin-top: 16px;
    }
    .scroll-ads-box {
      max-width: 1424px;
      position: relative;
      overflow: hidden;
      :deep(.scroll_ads) {
        height: 24px;
        margin-left: -5px;
        margin-right: -9px;
        line-height: 24px;
        .title {
          line-height: 24px;
        }
        .icon_box {
          margin-right: 2px;
        }
      }
    }

    .home-page-main {
      margin-top: 30px;
      .dfHgroup {
        padding: 0;
      }
    }
    .layout-adaptive,
    .home-page-banner .home-page-banner-main.layout-adaptive {
      width: 73.59%;
      margin-left: auto;
      margin-right: auto;
      min-width: $smallMaxWidth;
      &.small {
        width: 68.44%;
        min-width: 729px;
        max-width: 1324px;
      }
    }
  }
  .home-page-hot-live {
    max-width: 1424px;
    margin: 0 auto;
    width: 100%;
    margin-top: 32px;
    min-height: 200px;
    .wrapper {
      margin-top: 16px;
    }
  }
  .download-banner {
    position: relative;
    width: 100%;
    max-width: 1424px;
    height: auto;
    overflow: hidden;
    margin: 0 auto;
    border-radius: 8px;
    border: 1px solid var(--el-border-color-extra-light);
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
    overflow: hidden;
    display: flex;
    cursor: pointer;
    &--figure {
      width: 100%;
      height: auto;
      :deep(img) {
        @include imageStyle-cover;
      }
    }
  }
  .home-page-schedule-banner {
    :deep(.inner-box) {
      width: 73.59%;
      margin-left: auto;
      margin-right: auto;
      min-width: $smallMaxWidth;
      max-width: 1424px;
    }
  }
  .main-info-banner-grid {
    width: 100%;
    max-width: 1424px;
    display: flex;
    justify-content: space-between;
    margin: 32px auto 22px;
    flex-direction: column;
    .wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;
      position: relative;
      margin-top: 16px;
    }
    .swiper {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      .banner-item--img {
        cursor: pointer;
        @include imageStyle-cover;
      }
    }
    .ad-swiper-navigation-button {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      cursor: pointer;
      &-next {
        right: 0;
        transform: translate(50%, -50%);
      }
    }
    .swiper-button-prev,
    .swiper-button-next {
      display: none;
    }
    .ad-swiper {
      .swiper-slide {
        display: flex;
        align-items: center;
      }
    }
    .inner-box {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: block;
    }
  }
  .main-info-banner {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-radius: 16px;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.15);
    &--1 {
      width: 75.21%;
      position: relative;
      :deep(.swiper-pagination) {
        position: absolute;
        bottom: 23px;
        width: 100%;
        height: 26px;
        z-index: 2;
        text-align: center;
        .swiper-pagination-bullet {
          width: 30px;
          height: 2px;
          border-radius: 0;
          background: #fff;
          opacity: 0.6;
          display: inline-block;
          margin-left: 8px;
          cursor: pointer;
          &.swiper-pagination-bullet-active,
          &:hover {
            opacity: 1;
          }
        }
      }
    }
    &--2 {
      width: 23.87%;
      position: relative;
    }
  }
  .match-and-news-grid {
    width: 100%;
    max-width: 1424px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    margin-bottom: 60px;
    position: relative;
    .grid-left {
      width: 75.21%;
      position: relative;
      min-height: 390px;
    }
    .grid-right {
      width: 23.94%;
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
    }
  }
  .main-footer {
    width: 100%;
    height: 260px;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    border: 1px solid var(--el-border-color);
    padding: 12px;
    position: relative;
    .inner--bg-img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .anchorRecommend {
      max-width: 1424px;
      z-index: 1;
    }
  }

  // 自适应 - 1440
  @include screen(medium) {
    max-width: 1440px;
    .home-page {
      .home-page-banner {
        .home-page-banner-main {
          max-width: $mediumMaxWidth;
          padding: 0;
        }
      }
    }
    .download-banner {
      max-width: $mediumMaxWidth;
    }
    .scroll-ads-box {
      max-width: $mediumMaxWidth;
    }
    .home-page-hot-live {
      max-width: $mediumMaxWidth;

      :deep(.df-live-card-item) {
        .title {
          font-size: 14px;
        }
        .desc {
          font-size: 12px;
        }
      }
    }
    .activityCountdown {
      width: 100%;
      :deep(.inner-box) {
        max-width: $mediumMaxWidth;
      }
    }
    .home-page-schedule-banner {
      :deep(.inner-box) {
        max-width: 1144px;
      }
    }
    .main-info-banner-grid {
      max-width: $mediumMaxWidth;
      .main-info-banner--1 {
        width: 75.17%;
      }
      .main-info-banner--2 {
        width: 23.93%;
      }
    }
    .match-and-news-grid {
      max-width: $mediumMaxWidth;
    }
    .main-footer {
      .anchorRecommend {
        max-width: 1106px;
      }
    }
  }
  // 自适应 - 1080
  @include screen(small) {
    max-width: 1080px;
    .home-page {
      .home-page-banner {
        .home-page-banner-main {
          max-width: $smallMaxWidth;
          padding: 0;
        }
      }
    }

    .download-banner {
      max-width: $smallMaxWidth;
    }
    .scroll-ads-box {
      max-width: $smallMaxWidth;
    }
    .home-page-hot-live {
      max-width: $smallMaxWidth;
    }
    .activityCountdown {
      :deep(.inner-box) {
        max-width: $smallMaxWidth;
      }
    }
    .home-page-schedule-banner {
      :deep(.inner-box) {
        max-width: $smallMaxWidth;
      }
    }
    .main-info-banner-grid {
      max-width: $smallMaxWidth;
      .main-info-banner--1 {
        width: 75.25%;
      }
      .main-info-banner--2 {
        width: 23.9%;
      }
    }
    .match-and-news-grid {
      max-width: $smallMaxWidth;
      .grid-left {
        width: 100%;
      }
    }
    .main-footer {
      .activitySwiper {
        width: 557px;
        :deep(.activity-swiper-grid) {
          flex-direction: column;
          .grid-left {
            margin-right: 0;
          }
          .grid-right {
            flex-direction: row;
            width: 100%;
            height: 78px;
            padding-right: 0;
            margin-top: 6px;
            .swiper-wrapper {
              flex-direction: row;
              justify-content: space-between;
              height: 78px !important;
              .swiper-slide {
                width: 127px;
                height: 78px !important;
                .inner-box {
                  &.active {
                    &::before {
                      left: 50%;
                      top: 0;
                      transform: translate(-50%, -100%);
                      border-top: 0;
                      border-left: 10px solid transparent;
                      border-right: 10px solid transparent;
                      border-bottom: 6px solid var(--el-primary-border-color);
                    }
                  }
                }
              }
            }
          }
        }
      }
      .anchorRecommend {
        max-width: $smallMaxWidth;
        :deep(.list) {
          display: flex;
          height: auto;
          justify-content: space-between;
        }
      }
    }
  }
  @media (max-width: 1535px) {
    .match-and-news-grid {
      flex-direction: column;
      .grid-left { width: 100%; }
      .grid-right {
        position: static;
        width: 100%;
        height: auto;
        margin-top: 24px;
        :deep(.newsHeadlines) { height: auto; }
        :deep(.newsHeadlines .list .inner-box) { height: auto; max-height: 520px; }
      }
    }
  }
}
</style>

<style lang="scss">
html[data-player-web-fullscreen] .app-main .home-page .home-page-banner .home-page-banner-main {
  z-index: 2147483000 !important;
}

.home-page {
  .home-page-banner {
    .home-page-banner-main {
      .home-page-live {
        .home-page-live-box {
          .video-box {
            .player_container {
              // 进入直播间按钮
              .anchor-home-page-top-play-area-enter-button {
                display: block;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 153px;
                height: 52px;
                box-shadow: 0 2px 8px 0 hsla(37, 59%, 62%, 0.56);
                font-size: 16px;
                text-align: center;
                line-height: 52px;
                cursor: pointer;
                background: var(--el-color-primary);
                color: #fff;
                transition: transform 0.3s ease, box-shadow 0.3s ease;

                &:hover {
                  transform: translate(-50%, -50%) scale(1.05);
                  box-shadow: 0 4px 16px 0 hsla(37, 59%, 62%, 0.7);
                }

                &.bounce-animation {
                  animation: buttonBounce 0.6s ease 3;
                }
              }
              &:not(.player-web-fullscreen) .mute_btn {
                top: calc(50% + 50px);
                bottom: auto;
              }
            }
          }
        }
      }
    }
  }
  .home-page-main {
    .dfHgroup {
      .title--text {
        font-size: 18px;
        font-weight: 600;
        padding-left: 12px;
      }
    }
  }
}

@keyframes buttonBounce {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 2px 8px 0 hsla(37, 59%, 62%, 0.56);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.08);
    box-shadow: 0 4px 16px 0 hsla(37, 59%, 62%, 0.8), 0 0 0 8px hsla(37, 59%, 62%, 0.2);
  }
}
</style>
