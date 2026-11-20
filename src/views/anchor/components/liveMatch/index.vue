<template>
  <!-- 直播的赛事 -->
  <div class="match">
    <swiper
      class="match-swiper"
      :navigation="{
        nextEl: '.match-swiper__next',
        prevEl: '.match-swiper__prev'
      }"
      :modules="[Navigation]"
      slides-per-view="auto"
      :space-between="12"
    >
      <swiper-slide style="width: auto" v-for="item in liveMatchList" :key="item.vid">
        <div class="match-swiper__item bg-style">
          <live-match-item :match="item" @reserve="reserve"></live-match-item>
        </div>
      </swiper-slide>
    </swiper>

    <div class="match-swiper__prev swiper-icon">
      <el-icon>
        <ArrowLeftBold />
      </el-icon>
    </div>
    <div class="match-swiper__next swiper-icon">
      <el-icon>
        <ArrowRightBold />
      </el-icon>
    </div>
    <!-- 这里是一个全部赛事的按钮 -->
    <div class="match-more bg-style" @click="router.push('/schedule?type=4')">
      <!-- <img src="/static/images/live/classify/more.png" alt="" /> -->
      <span class="schedule"></span>
      <p class="text">全部赛事</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { ResponseStatus } from '@/enums/response'
import LiveMatchItem from './LiveMatchItem.vue'
import { getAllMatch } from '@/api/user'
import type { ILiveMatchItem } from './types'
import { useRouter } from 'vue-router'

import 'swiper/css'
import 'swiper/css/navigation'

const router = useRouter()
// 获取直播赛程
const liveMatchList = ref<ILiveMatchItem[]>([])

const getMatchList = async () => {
  try {
    const res = await getAllMatch()
    if (res.code === ResponseStatus.Success) {
      liveMatchList.value = res.data.data
    }
  } catch (error) {
    console.log(error)
  }
}

/**预约/取消预约的逻辑**/
const reserve = (sourceid: number) => {
  const currentMatchIndex = liveMatchList.value.findIndex(
    (item: ILiveMatchItem) => item.sourceid === sourceid
  )
  if (currentMatchIndex !== -1) {
    const currentMatch = liveMatchList.value[currentMatchIndex]
    liveMatchList.value.splice(currentMatchIndex, 1, {
      ...liveMatchList.value[currentMatchIndex],
      reserve: currentMatch.reserve === 1 ? 0 : 1
    })
  }
}

onMounted(() => {
  getMatchList()
})
</script>
<style scoped lang="scss">
.match {
  position: relative;
  display: flex;
  width: 100%;
  height: 136px;

  &-swiper {
    width: calc(100% - 82px);
    &__item {
      width: 220px;
    }

    &__prev {
      left: -32px;
    }

    &__next {
      right: -32px;
    }
  }

  .swiper-icon {
    position: absolute;
    top: 50%;
    font-size: 28px;
    cursor: pointer;
    color: #cdd0d6;
    transform: translate3d(0, -50%, 0);
    &:hover {
      color: var(--el-primary-background-color);
    }
  }

  .bg-style {
    position: relative;
    height: 100%;
    padding: 10px;
    background: #37394a;
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    &::after {
      position: absolute;
      content: '';
      width: 162px;
      height: 31px;
      right: 13px;
      bottom: -30px;
      z-index: 1;
      background: rgba(255, 206, 110, 0.8);
      filter: blur(39px);
    }
  }

  &-more {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-direction: column;
    padding: 0 !important;
    width: 70px;
    margin-left: 12px;
    font-size: 14px;

    &:hover {
      color: #ffc17b;
      .schedule {
        background: url('/static/images/live/classify/schedule-hover.png') no-repeat center center /
          100% 100%;
      }
    }

    .schedule {
      width: 36px;
      height: 36px;
      background: url('/static/images/live/classify/schedule.png') no-repeat center center / 100%
        100%;
    }

    .text {
      margin-top: 5px;
    }
  }
}
</style>
