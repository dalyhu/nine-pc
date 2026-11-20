<!-- 首页的活动倒计时 -->
<template>
  <div class="activityCountdown" :class="[info.enable === 1 ? 'enable' : 'unable']">
    <df-image-lazy
      placeholder-src="/static/images/placeholder_gray_bg.png"
      :src="getImageUrl('/static/images/index/countdown-container-bg.png')"
      class="inner--bg-img"
    />
    <div class="inner-box">
      <div class="figure">
        <df-image-lazy
          :src="getImageUrl('/static/images/index/countdown-main-bg.png')"
          placeholder-src="/static/images/placeholder_gray_bg.png"
        />
      </div>
      <el-text class="title">{{ info.title }}</el-text>
      <el-text class="desc">赛事开始时间：{{ start_time_computed }}</el-text>
      <!-- <div class="info">
      </div> -->
      <div class="time">
        <el-text class="text">距今还有</el-text>
        <div class="countdown">
          <div class="num num--1">
            <svg
              class="num-bg--svg"
              xmlns="http://www.w3.org/2000/svg"
              width="54"
              height="55"
              viewBox="0 0 54 55"
              fill="none"
            >
              <rect y="0.952881" width="54" height="54" rx="16" fill="#606266" />
              <path
                d="M0 16.9529C0 8.11633 7.16344 0.952881 16 0.952881H38C46.8366 0.952881 54 8.11633 54 16.9529V27.9529H0V16.9529Z"
                fill="#303133"
              />
            </svg>
            <el-text class="num-text">{{ countdown_str_computed[0] }}</el-text>
          </div>
          <div class="num num--2">
            <svg
              class="num-bg--svg"
              xmlns="http://www.w3.org/2000/svg"
              width="54"
              height="55"
              viewBox="0 0 54 55"
              fill="none"
            >
              <rect y="0.952881" width="54" height="54" rx="16" fill="#606266" />
              <path
                d="M0 16.9529C0 8.11633 7.16344 0.952881 16 0.952881H38C46.8366 0.952881 54 8.11633 54 16.9529V27.9529H0V16.9529Z"
                fill="#303133"
              />
            </svg>
            <el-text class="num-text">{{ countdown_str_computed[1] }}</el-text>
          </div>
          <div class="num num--3">
            <svg
              class="num-bg--svg"
              xmlns="http://www.w3.org/2000/svg"
              width="54"
              height="55"
              viewBox="0 0 54 55"
              fill="none"
            >
              <rect y="0.952881" width="54" height="54" rx="16" fill="#606266" />
              <path
                d="M0 16.9529C0 8.11633 7.16344 0.952881 16 0.952881H38C46.8366 0.952881 54 8.11633 54 16.9529V27.9529H0V16.9529Z"
                fill="#303133"
              />
            </svg>
            <el-text class="num-text">{{ countdown_str_computed[2] }}</el-text>
          </div>
        </div>
        <el-text class="text">天</el-text>
      </div>
    </div>
  </div>
</template>
<script setup name="ActivityCountdown" lang="ts">
import { getImageUrl } from '@/utils/common.js'
import { computed } from 'vue'

defineOptions({
  name: 'ActivityCountdown',
  inheritAttrs: true
})

const props = defineProps({
  countdownData: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const info = computed(() => {
  let o = {
    countdown: '0',
    start_time: '',
    title: '2024欧洲足球锦标赛',
    enable: 0
  }
  try {
    let europeanCupInfo = props.countdownData.find(
      (item: CountdownDataListItem) => item.name === '欧洲杯'
    ) as CountdownDataListItem
    if (europeanCupInfo) {
      if (Number(europeanCupInfo.date_diff) < 0) {
        o.enable = 1
      } else {
        o.enable = 0
      }
      o.countdown = europeanCupInfo.date_diff.toString()
      o.start_time = europeanCupInfo.date
    }
  } catch (error) {
    console.error(error)
  }
  return o
})

const start_time_computed = computed(() => {
  let timeStr = ''
  try {
    timeStr = info.value.start_time.replace('-', '年').replace('-', '月') + '日'
  } catch (error) {
    console.error('start_time_computed:', error)
  }
  return timeStr
})

const countdown_str_computed = computed(() => {
  let cdStr = '000'
  try {
    cdStr = info.value.countdown.replace('-', '').padStart(3, '0')
  } catch (error) {
    console.error('countdown_str_computed:', error)
    cdStr = '000'
  }
  // 格式是3位数，小于3位数则用0补全前面，最后返回类型是字符串，如“001”
  // 且小于0则返回“000”
  return cdStr
})
</script>
<style lang="scss" scoped>
.activityCountdown {
  width: 100%;
  display: flex;
  justify-content: center;
  background-repeat: no-repeat;
  margin: 0 auto;
  margin-top: 32px;
  background-size: 100% 100%;
  position: relative;
  &.unable {
    display: none;
  }
  .inner--bg-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .inner-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 792px;
    position: relative;
    z-index: 1;
  }
  .figure {
    width: 100%;
    img {
      width: 100%;
      height: auto;
    }
  }
  .info {
    margin: 24px auto;
    display: flex;
    flex-direction: column;
  }
  .title {
    color: #233acf;
    font-size: 28px;
    font-weight: 900;
    line-height: 51px;
    position: absolute;
    margin-bottom: 135px;
    margin-left: 380px;
    -webkit-text-stroke-width: 1.56;
    -webkit-text-stroke-color: var(--el---el-color-white);
    font-family:
      'Noto Sans S Chinese',
      Inter,
      Helvetica Neue,
      Helvetica,
      PingFang SC,
      Hiragino Sans G6,
      Microsoft YaHei,
      \5FAE\8F6F\96C5\9ED1,
      'Arial',
      sans-serif;
  }
  .desc {
    color: var(--el-text-color-primary);
    position: absolute;
    font-size: 18px;
    font-weight: 400;
    line-height: 26px;
    margin-left: 270px;
    margin-top: 153px;
  }
  .time {
    display: flex;
    position: absolute;
    margin-left: 380px;
    .text {
      color: #c0c4cc;
      @include fontStyle-Headline2-Bold;
    }
  }
  .countdown {
    display: flex;
    margin: 0 15px;
  }
  .num {
    margin-left: 4px;
    width: 54px;
    height: 54px;
    line-height: 54px;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    &--3 {
      margin-right: 4px;
    }
    .num-bg--svg {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      // rect {
      //   fill: var(--el-icon-color-regular);
      // }
      // path {
      //   fill: var(--el-icon-color-primary);
      // }
    }
    .num-text {
      z-index: 1;
      position: relative;
      color: var(--el-text-color-white);
      font-size: 32px;
      font-weight: 700;
    }
  }
}
</style>
