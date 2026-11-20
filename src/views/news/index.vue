<!-- 新闻列表 -->
<template>
  <div class="news-index">
    <div class="bell-2"><span class="bell"></span></div>

    <div class="news-index__wrap">
      <div class="news-index__bg" />

      <header class="news-index__nav-wrap">
        <nav class="news-index__nav">
          <div class="news-index__nav-mark use-transition" :style="navMarkStyle" />
          <div
            v-for="(item, index) in classificationList"
            :key="item.id ?? index"
            class="news-index__nav-item"
            :class="{ 'news-index__nav-item--active': classificationIndex === index }"
            @click="classificationIndex = index"
          >
            <a href="javascript:;">
              <div class="news-index__nav-text">{{ item.name }}</div>
              <div class="news-index__nav-sub-mark" />
            </a>
          </div>
        </nav>
      </header>

      <div class="news-index__content">
        <main class="news-index__main">
          <section class="news-index__hero">
            <div class="news-index__section-head">
              <img class="news-index__section-head-icon" :src="recommendIcon" alt="" />
              <h2 class="news-index__section-head-title">推荐头条</h2>
            </div>

            <div
              class="news-index__hero-panel"
              :class="{ 'news-index__hero-panel--hidden': !headlineItems.length }"
            >
              <div class="news-index__hero-banner">
                <router-link
                  v-if="headlinesBanner.length"
                  target="_self"
                  class="news-index__hero-link"
                  :to="'/detail?id=' + currentBanner.id"
                >
                  <img
                    class="news-index__hero-img"
                    :src="currentBanner.img"
                    :alt="currentBanner.title"
                  />
                  <div class="news-index__hero-caption">
                    {{ currentBanner.title }}
                  </div>
                </router-link>
              </div>

              <div class="news-index__hero-preview">
                <div class="news-index__hero-nav-btn news-index__hero-nav-btn--prev">
                  <div class="news-index__hero-nav-trigger" />
                </div>
                <swiper
                  ref="swiperRef"
                  :modules="swiperModules"
                  :loop="true"
                  :pagination="{ el: '.swiper-pagination', clickable: true }"
                  :width="540"
                  :autoplay="{ delay: 5000, disableOnInteraction: true }"
                  :slides-per-view="5"
                  :space-between="10"
                  :navigation="{
                    nextEl: '.news-index__hero-nav-btn--next',
                    prevEl: '.news-index__hero-nav-btn--prev'
                  }"
                  class="news-index__hero-swiper"
                  @click="handleSwiperClick"
                  @slide-change="onSlideChange"
                >
                  <swiper-slide
                    v-for="(item, index) in headlinesBanner"
                    :key="item.id ?? index"
                  >
                    <div
                      class="news-index__hero-thumb"
                      :class="{ 'news-index__hero-thumb--active': activeBannerIndex === index }"
                    >
                      <img
                        class="news-index__hero-thumb-img"
                        :src="item.img"
                        :id="String(item.id)"
                        :alt="item.title"
                      />
                    </div>
                  </swiper-slide>
                </swiper>
                <div class="news-index__hero-nav-btn news-index__hero-nav-btn--next">
                  <div class="news-index__hero-nav-trigger" />
                </div>
              </div>
            </div>
          </section>

          <section class="news-index__list-wrap">
            <div class="news-index__list">
              <newsCardItem
                v-for="item in headlineItems"
                :key="item.id"
                :info="item"
                thumb-size="180x106"
              />
            </div>
            <button
              type="button"
              class="news-index__load-more"
              :disabled="!canLoadMore"
              @click="loadMore"
            >
              {{ loadMoreText }}
            </button>
          </section>
        </main>

        <aside class="news-index__sidebar">
          <section class="news-index__anchor">
            <div class="news-index__anchor-head">
              <h2 class="news-index__anchor-title">主播推荐</h2>
            </div>
            <div class="news-index__anchor-body">
              <div
                v-for="(item, index) in anchorList"
                :key="item.id ?? index"
                class="news-index__anchor-item"
              >
                <router-link
                  target="_self"
                  class="news-index__anchor-link"
                  :to="'/persona?id=' + item.id"
                >
                  <div class="news-index__anchor-avatar-wrap">
                    <div
                      class="news-index__anchor-live"
                      :class="{ 'news-index__anchor-live--on': item.is_live == 1 }"
                    />
                    <img
                      class="news-index__anchor-avatar"
                      :src="item.avatar"
                      alt=""
                      @error="onAvatarError"
                    />
                  </div>
                  <div class="news-index__anchor-info">
                    <div class="news-index__anchor-row">
                      <div class="news-index__anchor-name">{{ item.user_nickname }}</div>
                      <div class="news-index__anchor-heat">
                        <span class="news-index__anchor-heat-icon" />
                        <span class="news-index__anchor-heat-num">{{ item.heat }}</span>
                      </div>
                    </div>
                    <div class="news-index__anchor-sign">{{ item.signature }}</div>
                  </div>
                </router-link>
              </div>
              <DfEmpty v-if="!anchorList.length" />
              <div class="news-index__anchor-refresh">
                <button type="button" @click="fetchAnchors">换一批</button>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import {
  getList as fetchHeadlinesList,
  getRecommend as fetchRecommendAnchors,
  classification as fetchClassificationList
} from '@/api/headline.js'
import newsCardItem from '@/components/newsCardItem/index.vue'
import recommendIcon from './image/recommed_icon.png'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

defineOptions({ name: 'NewsIndex' })

const { proxy } = getCurrentInstance()!

const swiperModules = [Navigation, Pagination]
const swiperRef = ref<{ swiper?: { realIndex: number; slideToLoop: (i: number) => void } } | null>(
  null
)

const page = ref(1)
const classificationIndex = ref(0)
const classificationList = ref<{ id: number; name: string }[]>([])
const headlinesList = ref<{ data?: any[]; total?: number }>({ data: [], total: 0 })
const headlinesBanner = ref<any[]>([])
const anchorList = ref<any[]>([])
const activeBannerIndex = ref(0)

const headlineItems = computed(() => headlinesList.value.data || [])
const currentBanner = computed(
  () => headlinesBanner.value[activeBannerIndex.value] || {}
)
const navMarkStyle = computed(() => ({
  transform: `translateX(${classificationIndex.value * 90}px)`,
  width: '90px'
}))
const canLoadMore = computed(
  () => headlineItems.value.length < (headlinesList.value.total ?? 0)
)
const loadMoreText = computed(() =>
  canLoadMore.value ? '点击加载更多' : '没有更多了'
)

function onAvatarError(event: Event) {
  proxy.$common.errorImg(event)
}

function onSlideChange(swiper: { realIndex: number }) {
  activeBannerIndex.value = swiper.realIndex
}

function handleSwiperClick(_swiper: unknown, event: MouseEvent) {
  const target = event.target as HTMLElement
  const id = target?.id
  if (!id || !swiperRef.value?.swiper) return
  const index = headlinesBanner.value.findIndex((item) => String(item.id) === id)
  if (index >= 0 && swiperRef.value.swiper.slideToLoop) {
    swiperRef.value.swiper.slideToLoop(index)
    activeBannerIndex.value = index
  }
}

async function fetchAnchors() {
  try {
    const res = await fetchRecommendAnchors()
    anchorList.value = res.data
  } catch {
    /* ignore */
  }
}

async function fetchHeadlines(cid: number) {
  try {
    const res = await fetchHeadlinesList({ cid, page: page.value })
    const list = res.data.list
    if (page.value === 1) {
      headlinesList.value = list
    } else {
      headlinesList.value = {
        ...list,
        data: [...(headlinesList.value.data || []), ...(list.data || [])]
      }
    }
    if (classificationIndex.value === 0) {
      headlinesBanner.value = res.data.banner || []
    }
  } catch {
    /* ignore */
  }
}

async function initClassifications() {
  try {
    const res = await fetchClassificationList()
    const list = res.data || []
    list.unshift({ id: 0, name: '热门' })
    classificationList.value = list
    page.value = 1
    await fetchHeadlines(0)
  } catch {
    /* ignore */
  }
}

function loadMore() {
  if (!canLoadMore.value) return
  page.value += 1
  const cid = classificationList.value[classificationIndex.value]?.id ?? 0
  fetchHeadlines(cid)
}

watch(classificationIndex, (index) => {
  page.value = 1
  activeBannerIndex.value = 0
  swiperRef.value?.swiper?.slideToLoop?.(0)
  const cid = classificationList.value[index]?.id ?? 0
  fetchHeadlines(cid)
})

onMounted(() => {
  fetchAnchors()
  initClassifications()
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
