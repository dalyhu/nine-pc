<!-- 首页赛程 - 单赛事 -->
<template>
  <div class="index_schedule" :class="hasRenderableContent ? 'enable' : 'unable'">
    <div class="inner-box">
      <Transition :name="panelTransitionName" mode="out-in">
        <div v-if="!displaySchedulePanel" key="panel-hero" class="schedule-panel-layer">
          <section class="countdown-hero">
            <div class="hero-left">
              <div class="hero-brand">
                <img class="hero-logo" :src="logoImage" alt="logo" />
                <div class="hero-brand-text">
                  <el-text class="hero-title">FIFA World Cup 2026™</el-text>
                  <el-text class="hero-subtitle">美加墨世界杯 06/11 - 07/19</el-text>
                </div>
              </div>
            </div>
            <div class="hero-center-placeholder">
              <img class="hero-animals" :src="animalsImage" alt="animals" />
            </div>

            <div class="countdown-right">
              <div class="check" @click="openSchedulePanel">
                <img src="./images/football.png" alt="" />
                查看世界杯赛程
              </div>
              <div class="hero-countdown">
                <div class="countdown-cell">
                  <div class="cell-num">{{ countdownParts.days }}</div>
                  <div class="cell-label">天</div>
                </div>
                <div class="countdown-cell">
                  <div class="cell-num">{{ countdownParts.hours }}</div>
                  <div class="cell-label">时</div>
                </div>
                <div class="countdown-cell">
                  <div class="cell-num">{{ countdownParts.minutes }}</div>
                  <div class="cell-label">分</div>
                </div>
                <div class="countdown-cell">
                  <div class="cell-num">{{ countdownParts.seconds }}</div>
                  <div class="cell-label">秒</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div v-else key="panel-schedule" class="schedule-panel-layer">
          <section class="row top">
            <div class="event-title">
              <img class="small-logo" :src="logoImage" alt="logo" />
              <div class="small-title">
                <el-text class="text">FIFA World Cup 2026™</el-text>
                <el-text class="subtext">美加墨世界杯 06/11 - 07/19</el-text>
              </div>
            </div>
            <div class="day-count">
              <img
                v-if="canToggleSchedulePanel"
                class="left-icon"
                src="./images/left-circle.png"
                alt=""
                @click="closeSchedulePanel"
              />
              <el-text class="text">{{ isCountdownMode ? '倒计时' : '已开赛第' }}</el-text>
              <div class="day-count-num opened">{{ Math.abs(dateDiff) }}</div>
              <el-text class="text">天</el-text>
            </div>
          </section>

          <section class="row bottom">
            <div class="match-list" v-if="eventData.matchs?.length">
              <Swiper
                :modules="swiperModules"
                v-bind="swiperOptions"
                @swiper="onSwiperInit"
                style="width: 100%; height: 100%"
              >
                <swiper-slide
                  class="slide-item"
                  v-for="item in eventData.matchs"
                  :key="
                    item.sourceid ||
                    item.vid ||
                    `${item.home_team_name}-${item.away_team_name}-${item.match_time}`
                  "
                >
                  <div class="match-item">
                    <div class="row row-time">
                      <el-text class="text">{{ item.match_time }}</el-text>
                    </div>
                    <div class="row row-league-info">
                      <el-text class="text">{{ item.competition }}</el-text>
                    </div>
                    <div class="row row-match-info">
                      <div class="col team-info">
                        <div class="team-logo">
                          <el-image fit="cover" :src="item.home_team_logo" />
                        </div>
                        <el-text class="team-name" truncated>{{ item.home_team_name }}</el-text>
                      </div>
                      <div class="col match-result">
                        <el-text class="text score">{{
                          item.home_scores + ':' + item.away_scores
                        }}</el-text>
                        <el-text class="text status">{{ item.status_str }}</el-text>
                      </div>
                      <div class="col team-info">
                        <div class="team-logo">
                          <el-image fit="cover" :src="item.away_team_logo" />
                        </div>
                        <el-text class="team-name" truncated>{{ item.away_team_name }}</el-text>
                      </div>
                    </div>
                  </div>
                </swiper-slide>
                <div ref="swiperButtonPrevRef" class="swiper-button-prev"></div>
                <div ref="swiperButtonNextRef" class="swiper-button-next"></div>
              </Swiper>
              <div
                class="schedule-navigation-button schedule-swiper-button-prev"
                @click="slideToggle('prev')"
              >
                <img class="nav-arrow" :src="arrowLeftImage" alt="prev" />
              </div>
              <div
                class="schedule-navigation-button schedule-swiper-button-next"
                @click="slideToggle('next')"
              >
                <img class="nav-arrow" :src="arrowRightImage" alt="next" />
              </div>
            </div>
          </section>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup name="IndexSchedule" lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import 'swiper/css'
import type { Swiper as SwiperInstance } from 'swiper'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

const logoImage = new URL('./images/logo.png', import.meta.url).href
const animalsImage = new URL('./images/animals.webp', import.meta.url).href
const arrowLeftImage = new URL('./images/arrow_left.png', import.meta.url).href
const arrowRightImage = new URL('./images/arrow_right.png', import.meta.url).href

const props = defineProps({
  countdownData: {
    type: Array,
    default: () => []
  }
})

const eventData = computed(() => {
  const fallback = {
    name: '',
    title: '',
    time: 0,
    date: '',
    date_diff: 0,
    matchs: []
  }
  return (props.countdownData?.[0] || fallback) as CountdownDataListItem
})

const dateDiff = computed(() => Number(eventData.value.date_diff) || 0)

const nowUnix = ref(Math.floor(Date.now() / 1000))
let countdownTimer: number | null = null

const firstMatchStartUnix = computed(() => {
  const eventStart = Number((eventData.value as any).time) || 0
  if (eventStart > 0) return eventStart
  const firstMatchStart = Number(eventData.value?.matchs?.[0]?.time) || 0
  return firstMatchStart
})

const remainSeconds = computed(() => {
  return Math.max(firstMatchStartUnix.value - nowUnix.value, 0)
})

const countdownParts = computed(() => {
  const remain = remainSeconds.value
  return {
    days: String(Math.floor(remain / 86400)).padStart(2, '0'),
    hours: String(Math.floor((remain % 86400) / 3600)).padStart(2, '0'),
    minutes: String(Math.floor((remain % 3600) / 60)).padStart(2, '0'),
    seconds: String(remain % 60).padStart(2, '0')
  }
})

const isCountdownMode = computed(() => {
  return dateDiff.value < 0 && remainSeconds.value > 0
})

/** 首场已开赛（距首场开赛剩余 ≤0），此后仅展示赛程板块且不可切回大倒计时 */
const eventStarted = computed(() => remainSeconds.value <= 0)

/** 未开赛时可在倒计时大卡片与赛程列表间切换 */
const canToggleSchedulePanel = computed(() => !eventStarted.value)

const userPrefersSchedulePanel = ref(false)

/** 切换方向：去赛程 / 回大倒计时，用于 Transition 类名 */
const panelTransitionName = ref<'panel-to-schedule' | 'panel-to-hero'>('panel-to-schedule')

const displaySchedulePanel = computed(() => {
  if (eventStarted.value) return true
  return userPrefersSchedulePanel.value
})

const openSchedulePanel = () => {
  if (!canToggleSchedulePanel.value) return
  panelTransitionName.value = 'panel-to-schedule'
  userPrefersSchedulePanel.value = true
}

const closeSchedulePanel = () => {
  if (!canToggleSchedulePanel.value) return
  panelTransitionName.value = 'panel-to-hero'
  userPrefersSchedulePanel.value = false
}

watch(eventStarted, (started) => {
  if (started) {
    panelTransitionName.value = 'panel-to-schedule'
    userPrefersSchedulePanel.value = true
  }
})

// const startedDays = computed(() => {
//   if (dateDiff.value >= 0) return Math.floor(dateDiff.value)
//   if (firstMatchStartUnix.value > 0 && nowUnix.value > firstMatchStartUnix.value) {
//     return Math.floor((nowUnix.value - firstMatchStartUnix.value) / 86400)
//   }
//   return 0
// })

// const startedDaysStr = computed(() => {
//   return String(Math.max(startedDays.value, 0)).padStart(2, '0').slice(-2)
// })

const hasRenderableContent = computed(() => {
  return isCountdownMode.value || !!eventData.value?.matchs?.length
})

const formatDateKey = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const getMatchDateKey = (match: MatchListItem & { time?: number }) => {
  if (match.date) {
    return match.date.slice(0, 10)
  }
  const unix = Number(match.match_ADate) || Number(match.time) || 0
  if (unix > 0) {
    return formatDateKey(new Date(unix * 1000))
  }
  const timeStr = match.match_time?.trim()
  if (!timeStr) return ''

  const datePart = timeStr.split(/\s+/)[0]?.replace(/\//g, '-')
  if (!datePart) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart
  if (/^\d{1,2}-\d{1,2}$/.test(datePart)) {
    const [month, day] = datePart.split('-')
    return `${new Date().getFullYear()}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
  return ''
}

const todayDateKey = computed(() => formatDateKey(new Date()))

type ScheduleMatch = MatchListItem & {
  time?: number
  status?: number
  status_type?: number
  status_id?: number
}

const FOOTBALL_ENDED_STATUS = 8
const STATUS_TYPE_ENDED = 2
const BASKETBALL_ENDED_STATUS_ID = 10

const isMatchEnded = (match: ScheduleMatch) => {
  const statusType = Number(match.status_type)
  if (Number.isFinite(statusType) && statusType >= 0) {
    return statusType === STATUS_TYPE_ENDED
  }

  const status = Number(match.status)
  if (Number.isFinite(status) && status > 0) {
    return status === FOOTBALL_ENDED_STATUS
  }

  const statusId = Number(match.status_id)
  if (Number.isFinite(statusId) && statusId > 0) {
    return statusId === BASKETBALL_ENDED_STATUS_ID
  }

  return false
}

/** 轮播起始位置：从今天起第一个未结束的赛事；今日全部结束后定位到后续日期首个未结束赛事 */
const activeMatchSlideIndex = computed(() => {
  const matchs = eventData.value.matchs as ScheduleMatch[]
  if (!matchs?.length) return 0

  const today = todayDateKey.value
  const activeIdx = matchs.findIndex((match) => {
    const matchDate = getMatchDateKey(match)
    if (matchDate && matchDate < today) return false
    return !isMatchEnded(match)
  })
  if (activeIdx >= 0) return activeIdx

  const anyActiveIdx = matchs.findIndex((match) => !isMatchEnded(match))
  if (anyActiveIdx >= 0) return anyActiveIdx

  return Math.max(matchs.length - 1, 0)
})

onMounted(() => {
  countdownTimer = window.setInterval(() => {
    nowUnix.value = Math.floor(Date.now() / 1000)
  }, 1000)
})

onUnmounted(() => {
  if (countdownTimer) {
    window.clearInterval(countdownTimer)
    countdownTimer = null
  }
})

const swiperModules = [Navigation]
const swiperOptions = computed(() => ({
  watchSlidesProgress: true,
  slidesPerView: 'auto' as const,
  spaceBetween: 8,
  initialSlide: activeMatchSlideIndex.value,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  }
}))

const swiperInstance = ref<SwiperInstance | null>(null)

const scrollToActiveMatch = () => {
  swiperInstance.value?.slideTo(activeMatchSlideIndex.value, 0)
}

const onSwiperInit = (swiper: SwiperInstance) => {
  swiperInstance.value = swiper
  scrollToActiveMatch()
}

watch(
  () => eventData.value.matchs,
  () => {
    nextTick(scrollToActiveMatch)
  }
)

watch(displaySchedulePanel, (visible) => {
  if (visible) {
    nextTick(scrollToActiveMatch)
  }
})

const swiperButtonPrevRef = ref(null)
const swiperButtonNextRef = ref(null)
const slideToggle = (action: 'prev' | 'next') => {
  if (action === 'prev') {
    swiperButtonPrevRef.value?.click()
  } else {
    swiperButtonNextRef.value?.click()
  }
}
</script>

<style lang="scss" scoped>
.index_schedule {
  display: flex;
  align-items: center;
  width: 100%;
  height: 290px;
  margin-top: 32px;
  background: url('./images/bg.webp') no-repeat center;
  background-size: 100% 100%;

  &.unable {
    display: none;
  }

  .inner-box {
    position: relative;
    width: 100%;
  }

  .schedule-panel-layer {
    width: 100%;
  }

  .panel-to-schedule-enter-active,
  .panel-to-schedule-leave-active,
  .panel-to-hero-enter-active,
  .panel-to-hero-leave-active {
    transition:
      opacity 0.34s cubic-bezier(0.25, 0.8, 0.25, 1),
      transform 0.34s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .panel-to-schedule-enter-from {
    opacity: 0;
    transform: translateX(28px);
  }

  .panel-to-schedule-leave-to {
    opacity: 0;
    transform: translateX(-28px);
  }

  .panel-to-hero-enter-from {
    opacity: 0;
    transform: translateX(-28px);
  }

  .panel-to-hero-leave-to {
    opacity: 0;
    transform: translateX(28px);
  }

  .row {
    display: flex;
    align-items: center;

    &.top {
      margin-bottom: 17px;
      justify-content: space-between;
    }
  }

  .event-title {
    display: flex;
    align-items: center;

    .small-logo {
      width: 32px;
      margin-right: 8px;
      flex-shrink: 0;
    }

    .small-title {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .text {
      color: var(--el-text-color-write);
      font-size: 24px;
      font-weight: 700;
      line-height: 28px;
    }

    .subtext {
      color: var(--el-text-color-write);
      font-size: 14px;
      font-weight: 400;
      line-height: 18px;
      align-self: self-start;
    }
  }

  .countdown-hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .hero-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .hero-brand {
    display: flex;
    align-items: center;
  }

  .hero-logo {
    width: 74px;
    margin-right: 28px;
    flex-shrink: 0;
  }

  .hero-brand-text {
    display: flex;
    flex-direction: column;
  }

  .hero-title {
    color: #fff;
    font-size: 44px;
    font-weight: 700;
    line-height: 48px;
  }

  .hero-subtitle {
    color: #fff;
    font-size: 28px;
    line-height: 1;
    margin-top: 14px;
    align-self: self-start;
  }

  .hero-center-placeholder {
    flex: 1;
    margin: 0 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .hero-animals {
    width: 370px;
  }

  .countdown-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 196px;
    align-items: end;

    .check {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      width: 188px;
      height: 38px;
      color: #fff;
      border-radius: 12px;
      cursor: pointer;
      font-size: 18px;
      font-weight: 600;
      background: url('./images/bg_button.png') no-repeat center / 100% 100%;
      overflow: hidden;

      img {
        width: 22px;
        height: 22px;
      }
    }
  }

  .hero-countdown {
    display: flex;
    align-items: center;
    gap: 28px;
  }

  .countdown-cell {
    border-radius: 16px;
    padding: 16px;
    color: #fff;
    background: #1c3dde;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .cell-num {
    width: 55px;
    font-size: 44px;
    font-weight: 700;
    line-height: 54px;
  }

  .cell-label {
    width: 55px;
    margin-top: 14px;
    font-size: 28px;
    line-height: 34px;
  }

  .day-count {
    display: flex;
    align-items: center;

    .text {
      color: #fff;
      font-size: 18px;
      font-weight: 700;
    }

    .left-icon {
      width: 22px;
      height: 22px;
      margin: 0 8px;
      cursor: pointer;
    }

    .day-count-num {
      font-family:
        Roboto Mono,
        Inter,
        Helvetica Neue,
        Helvetica,
        PingFang SC,
        sans-serif;
      color: #fff;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      background: #1c3dde;

      &.opened {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        margin: 0 8px;
        font-size: 28px;
        width: 50px;
        height: 50px;
      }
    }
  }

  .match-list {
    position: relative;
    width: 100%;
    border-radius: 16px;
    background: rgba(98, 141, 253, 0.54);
    backdrop-filter: blur(10px);
    padding: 14px 8px 18px;
    border: 1px solid #fff;

    .swiper-button-prev,
    .swiper-button-next {
      display: none;
    }
  }

  .schedule-navigation-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0;
    cursor: pointer;
    z-index: 3;
  }

  .schedule-swiper-button-prev {
    left: -52px;
  }

  .schedule-swiper-button-next {
    right: -52px;
  }

  .nav-arrow {
    width: 40px;
    height: 40px;
    object-fit: contain;
    display: block;
  }

  .slide-item {
    width: auto;
  }

  .match-item {
    width: 260px;
    height: 122px;
    padding: 8px;
    background: var(--el-bg-color-overlay);
    border-radius: 8px;
    box-shadow: 0px 6px 12px 0px rgba(98, 69, 83, 0.05);
    overflow: hidden;
    cursor: pointer;

    .row {
      text-align: center;
    }

    .row-time {
      justify-content: center;

      .text {
        color: var(--el-text-color-primary);
        @include fontStyle-body1-Medium;
      }
    }

    .row-league-info {
      justify-content: center;
      margin-top: 2px;
      margin-bottom: 4px;

      .text {
        @include fontStyle-body3-Regular;
      }
    }

    .row-match-info {
      display: flex;
      justify-content: space-between;

      .col {
        display: flex;
        flex-direction: column;
      }
    }

    .team-info {
      justify-content: center;
      align-items: center;
      width: 80px;

      .team-logo {
        width: 32px;
        height: 32px;

        > .el-image {
          width: 100%;
          height: 100%;
        }
      }

      .team-name {
        margin-top: 4px;
        @include fontStyle-body1-Medium;
      }
    }

    .match-result {
      margin-top: 6px;
      justify-content: space-between;
      width: 80px;

      .score {
        @include fontStyle-Headline1-Bold;
      }

      .status {
        @include fontStyle-body3-Regular;
      }
    }
  }
}

@media (max-width: 1800px) {
  .hero-center-placeholder {
    display: none !important;
  }
  .countdown-hero {
    justify-content: space-between !important;
    gap: 12px;
  }
  .hero-left {
    flex: 1;
    min-width: 0;
  }
}
</style>
