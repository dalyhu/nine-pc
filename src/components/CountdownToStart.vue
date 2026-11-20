<template>
  <div class="countdown_to_start">
    <!-- <div class="center_date">
      <span>{{ date[0] }}</span>
      <span>{{ date[1] }}</span>
      <span>{{ date[2] }}</span>
      <span>{{ date[3] }}</span>
    </div> -->
    <div class="countdown_content">
      <img class="girl" src="/static/images/theme/countdown/live_girl.png" alt="" />

      <div class="time-box">
        <ul class="time-list">
          <li class="time-item">
            <span class="time">{{ date[0] }}</span>
            <span class="text">天</span>
          </li>
          <li class="time-item">
            <span class="time">{{ date[1] }}</span>
            <span class="text">时</span>
          </li>
          <li class="time-item">
            <span class="time">{{ date[2] }}</span>
            <span class="text">分</span>
          </li>
          <li class="time-item">
            <span class="time">{{ date[3] }}</span>
            <span class="text">秒</span>
          </li>
        </ul>
      </div>
      <img class="live-text" src="/static/images/theme/countdown/live_text.png" alt="" />
      <img class="hourglass" src="/static/images/theme/countdown/hourglass.png" alt="" />
    </div>
    <div class="concern_box_show" v-if="isShowIcon">
      <div class="concern_show" @click="handlePay">
        <span class="cancelConcern_date_n" v-if="anchorInfo.is_attention == 0" title="关注"></span>
        <span class="cancelConcern_date_y" v-else title="取消关注"></span>
      </div>
      <div>
        <span class="txt_control" title="分享" @click="handleCopy"></span>
      </div>
    </div>
  </div>
</template>

<script setup name="CountdownToStart" lang="ts">
const props = defineProps({
  // 倒计时
  countDown: {
    type: Number,
    default: 0
  },
  // 直播间信息
  anchorInfo: {
    type: Object,
    default: () => ({})
  },
  // 是否显示icon按钮
  isShowIcon: {
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(['closeCountDown', 'handlePay', 'handleCopy'])

const count = ref(0)
const intervalId = ref(null) // 定时器id
const date = ref([]) // 开播倒计时分秒

// 开启倒计时
const start = () => {
  intervalId.value = setInterval(() => {
    if (count.value > 0) {
      count.value -= 1
      counttDownF(count.value)
    } else if (count.value === 0) {
      count.value = 0
      window.clearInterval(intervalId.value)
      emits('closeCountDown')
    }
  }, 1000)
}

const counttDownF = (time) => {
  let d = parseInt(time / (24 * 60 * 60))
  d = d < 10 ? '0' + d : d
  let h = parseInt((time / (60 * 60)) % 24)
  h = h < 10 ? '0' + h : h
  let m = parseInt((time / 60) % 60)
  m = m < 10 ? '0' + m : m
  let s = parseInt(time % 60)
  s = s < 10 ? '0' + s : s
  date.value = [d, h, m, s]
}

watch(
  () => props.countDown,
  (value) => {
    if (value > 0) {
      count.value = value
      window.clearInterval(intervalId.value)
      start()
    } else {
      window.clearInterval(intervalId.value)
    }
  },
  {
    immediate: true
  }
)

const handlePay = () => {
  emits('handlePay')
}
const handleCopy = () => {
  emits('handleCopy')
}

onBeforeUnmount(() => {
  intervalId.value && window.clearInterval(intervalId.value)
})
</script>

<style scoped lang="scss">
.countdown_to_start {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('/static/images/theme/countdown/live_bg.jpg') no-repeat center / 100% 100%;
  z-index: 10;
  overflow: hidden;

  .countdown_content {
    position: relative;
    width: 584px;
    margin: 120px auto;

    .girl {
      display: block;
      width: 187px;
    }

    .time-box {
      position: absolute;
      left: 46px;
      bottom: 0;
      width: 537px;
      height: 189px;
      background: url('/static/images/theme/countdown/count_bg.png') no-repeat center / 100% 100%;
      overflow: hidden;

      .time-list {
        position: absolute;
        display: flex;
        top: 76px;
        left: 58px;
        height: 70px;

        .time-item {
          display: flex;
          align-items: end;

          .time {
            width: 70px;
            height: 70px;
            font-size: 48px;
            border-radius: 8px;
            text-align: center;
            line-height: 75px;
            color: #242424;
            background: #fff;
          }

          .text {
            color: #fff;
            font-size: 16px;
            margin: 0 14px 0 6px;
          }
        }
      }
    }

    .live-text {
      position: absolute;
      display: block;
      top: 94px;
      left: 160px;
      height: 39px;
    }

    .hourglass {
      position: absolute;
      display: block;
      right: -30px;
      bottom: -30px;
      height: 128px;
    }
  }

  .center_date {
    height: 100%;
    width: 72%;
    display: flex;
    align-items: center;
    justify-content: end;
    span {
      width: 10%;
      display: inline-block;
      color: #fff;
      text-align: center;
      margin-top: -4%;
      font-size: 22px;
    }
  }
  .concern_box_show {
    height: 100%;
    position: absolute;
    top: 0;
    right: 3%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .cancelConcern_date_n {
      display: inline-block;
      width: 40px;
      height: 40px;
      background-image: url(/static/images/ic-love-uncheck.png);
      background-size: 100% 100%;
      cursor: pointer;
    }
    .cancelConcern_date_y {
      display: inline-block;
      width: 40px;
      height: 40px;
      background-image: url(/static/images/ic-love-check.png);
      background-size: 100% 100%;
      cursor: pointer;
    }
    .txt_control {
      display: inline-block;
      width: 40px;
      height: 40px;
      background-image: url(/static/images/ic-share.png);
      background-size: 100% 100%;
      cursor: pointer;
      margin-top: 20px;
    }
  }
  @include screen(medium) {
    .center_date {
      span {
        font-size: 12px;
      }
    }
  }
}
</style>
