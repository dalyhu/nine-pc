<!-- 官方活动 -->
<template>
  <div class="activitySwiper">
    <dfHgroup title="官方活动" />
    <div class="activity-swiper-grid">
      <div class="grid-left">
        <!-- <router-link target="_self" class="grid-link" :to="activityList[activeIndex].url"> -->
        <img class="activity-post-img--active" :src="activeActivityPostSrc" @click="postClick" />
        <!-- </router-link> -->
      </div>
      <div class="grid-right">
        <swiper
          :modules="activitySwiperModules"
          v-bind="activitySwiperOptions"
          style="width: 100%; height: 100%"
          @click="slideClick"
        >
          <swiper-slide v-for="(item, index) in activityList" :key="item.id">
            <div class="inner-box" :class="{ active: index === activeIndex }">
              <img :src="item.img" class="activity-item--img" />
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>
<script setup name="ActivitySwiper" lang="ts">
import dfHgroup from '@/components/dfHgroup/index.vue'
import { getActivityUrl } from '../../api/user.js'
import { ref, computed } from 'vue'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
defineOptions({
  name: 'ActivitySwiper',
  inheritAttrs: true
})

const activeIndex = ref(0)
const activitySwiperModules = [Autoplay]
const activitySwiperOptions = {
  slidesPerView: 4,
  direction: 'vertical',
  speed: 3000,
  freeMode: true,
  loop: true,
  observer: true,
  observerParents: true,
  autoHeight: true,
  autoplay: {
    delay: 300
  }
}
const slideClick = (swiper) => {
  activeIndex.value = swiper.clickedIndex
}

const activeActivityPostSrc = computed(() => {
  return activityList.value[activeIndex.value]?.img || ''
})

const postClick = () => {
  const url = activityList.value[activeIndex.value].url
  let newTab = window.open('about:blank')
  newTab.location.href = url
}

const activityList = ref([])
// 获取活动
const getActivityUrlAction = () => {
  getActivityUrl().then((res) => {
    activityList.value = res.data.data
  })
}

getActivityUrlAction()
</script>
<style lang="scss" scoped>
.activitySwiper {
  .activity-swiper-grid {
    display: flex;
    justify-content: space-between;
    padding-right: 2px;
  }
  .grid-left {
    width: 557px;
    min-height: 300px;
    max-height: 329px;
    margin-right: 12px;
  }
  .grid-right {
    display: flex;
    flex-direction: column;
    padding-right: 2px;
    width: 129px;
  }
  .swiper {
    overflow: visible;
  }
  .activity-post-img--active {
    cursor: pointer;
    width: 100%;
    height: auto;
  }
  .inner-box {
    position: relative;
    width: 127px;
    height: 74px;
    border: 2px solid transparent;
    &:hover {
      cursor: pointer;
      border-color: var(--el-primary-border-color);
    }
    &.active {
      border-color: var(--el-primary-border-color);
      &::before {
        content: '';
        display: block;
        position: absolute;
        width: 0;
        height: 0;
        left: 0;
        top: 50%;
        transform: translate(-100%, -50%);
        border-top: 15px solid transparent;
        border-bottom: 15px solid transparent;
        border-right: 10px solid var(--el-primary-border-color);
      }
    }
  }
  .activity-item--img {
    width: 100%;
    height: 100%;
  }

  // 自适应 - 1440
  @include screen(medium) {
    max-width: 1440px;
  }
  // 自适应 - 1080
  @include screen(small) {
    max-width: 1080px;
  }
}
</style>
