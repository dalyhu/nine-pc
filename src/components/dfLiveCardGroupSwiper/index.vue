<!-- 直播列表 -->
<template>
  <div class="df_live_card_group">
    <div class="operation_btn swiper__prev_btn">
      <ArrowLeftBold />
    </div>

    <swiper
      class="swiper"
      :navigation="{
        nextEl: '.swiper__next_btn',
        prevEl: '.swiper__prev_btn'
      }"
      :modules="[Navigation]"
    >
      <swiper-slide style="width: 100%" v-for="(list, index) in swiperList" :key="index">
        <div class="swiper__item">
          <dfLiveCardItem v-for="item in list" :key="item.id" :item="item"></dfLiveCardItem>
        </div>
      </swiper-slide>
    </swiper>
    <div class="operation_btn swiper__next_btn">
      <ArrowRightBold />
    </div>
  </div>
</template>
<script setup lang="ts">
import dfLiveCardItem from '../dfLiveCardItem/index.vue'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import { computed } from 'vue'

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

type LiveItem = {
  id: number
  vid: string
  uid: number
  title: string
  thumb: string
  priority: number
  isHot: boolean
  isRecommend: boolean
  isLoop: boolean
  avatar: string
  user_nickname: string
  heat: number
}

// 处理list 每10个一组
const swiperList = computed(() => splitArray<LiveItem>(props.list as LiveItem[], 10))

function splitArray<T>(arr: T[], size: number) {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }

  return result
}
</script>
<style lang="scss" scoped>
.df_live_card_group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 800px;
  overflow: hidden;
  .operation_btn {
    flex-shrink: 0;
    color: #cdd0d6;
    width: 28px;
    height: 28px;
    cursor: pointer;
    &:hover {
      color: var(--el-color-primary);
    }
  }

  .swiper__item {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
  }
}
</style>
