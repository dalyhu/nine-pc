<template>
  <div class="search">
    <!-- 搜索页的头部 -->
    <div class="search-header">
      <!-- 搜索头部的主体内容 -->
      <div class="search-header__content">
        <p class="search-header__content--title">请尝试输入主播名字或热门赛事</p>
        <!-- 主体的搜索框 -->
        <div class="search-header__content--input">
        <input
        type="text"
   v-model="searchParams.name"
   placeholder="请输入搜索内容"
            @keyup.enter="onSearch"
          />
          <el-button type="primary" size="large" @click="onSearch">搜索</el-button>
  </div>

        <!-- 热门标签 -->
      <div class="search-header__content--tags">
      <el-button
     v-for="item in searchHotList"
      :key="item.sourceid"
        size="large"
         round
            color="rgba(0,0,0,0.3)"
  @click="hotSearch(item.short_name_zh)"
>{{ item.short_name_zh }}</el-button
          >
</div>
  </div>
    </div>

    <!-- 搜索页的 tabs 综合 主播 直播 新闻 -->
    <div class="search-tabs">
      <el-tabs v-model="currentTabName">
        <el-tab-pane
   v-for="tab in tabs"
  :key="tab.key"
   :name="tab.key"
     :label="tab.title"
        ></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 搜索页的结果页 -->
  <div class="search-result">
      <!-- 新闻 Tab 内容区 -->
      <div v-if="currentTabName === SearchTabs.News" class="search-result__content">
        <!-- 新闻有数据 或 首次加载中 -->
        <template v-if="newsList.length || newsLoading">
  <df-hgroup class="search-result__title" title="相关新闻"></df-hgroup>
   <!-- 新闻卡片列表 -->
          <div class="search-news-list">
        <newsCardItem
            v-for="item in newsList"
  :key="item.id"
     :info="item"
   thumbSize="180x106"
   />
          </div>
          <!-- 底部状态区 -->
   <div class="search-news-footer">
 <!-- 加载中 -->
      <template v-if="newsLoading">
     <span class="search-news-footer__loading">加载中...</span>
   </template>
       <!-- 还有更多 -->
   <template v-else-if="newsHasMore">
    <span class="search-news-footer__more" @click="loadMoreNews">加载查看更多</span>
 </template>
            <!-- 全部加载完 -->
            <template v-else>
     <span class="search-news-footer__done">已全部加载，共 {{ newsTotalCount }} 条</span>
    </template>
    </div>
     </template>

        <!-- 新闻空状态 -->
        <template v-else-if="!newsLoading && searchKeywords">
<div class="search-empty">
  <df-hgroup>
   <template #prepend>
     <img src="/static/images/search/search-new/search-icon.svg" alt="" srcset="" />
              </template>
              <template #title>
       抱歉，暂时没有"<span style="color: #d02d54">{{ searchKeywords }}</span>"的相关新闻
         </template>
          </df-hgroup>
<img
  class="search-empty__image"
   src="/static/images/search/search-new/search-empty.png"
     alt=""
       srcset=""
     />
 <p class="search-empty__text">你想要的，我暂时没有</p>
          </div>
        </template>
      </div>

      <!-- 综合 / 主播 / 直播 Tab 内容区 -->
      <div v-else class="search-result__content">
        <!-- 正常搜索出来的内容 如果有数据 totalResult > 0 -->
        <template v-if="totalResult">
          <!-- 标题 -->
    <df-hgroup>
  <template #prepend>
      <img src="/static/images/search/search-new/search-icon.svg" alt="" srcset="" />
            </template>
      <template #title>
        共搜到相关结果 <span style="color: #d02d54">{{ totalResult }}</span> 个
  </template>
          </df-hgroup>
          <!-- 主播列表 -->
          <div v-show="currentTabName !== SearchTabs.Live && anchorList.length">
   <df-hgroup class="search-result__title" title="相关主播"></df-hgroup>
         <dfAnchorGroup :anchorList="anchorList" />
          </div>
 <!-- 直播列表 -->
 <!-- 标题 -->
          <div v-show="currentTabName !== SearchTabs.Anchor && liveList.length">
            <df-hgroup class="search-result__title" title="相关直播"></df-hgroup>
 <dfLiveCardGroup :list="liveList" />
          </div>
    </template>

        <!-- 空状态 当搜索的总数为 0 并且有搜索关键词 时表示没有数据-->
        <template v-else-if="!totalResult && searchKeywords">
        <div class="search-empty">
      <df-hgroup>
  <template #prepend>
        <img src="/static/images/search/search-new/search-icon.svg" alt="" srcset="" />
   </template>
         <template #title>
  抱歉，暂时没有"<span style="color: #d02d54">{{ searchKeywords }}</span
      >"的相关内容
     </template>
         </df-hgroup>
       <img
              class="search-empty__image"
      src="/static/images/search/search-new/search-empty.png"
     alt=""
    srcset=""
 />
            <p class="search-empty__text">你想要的，我暂时没有</p>
          </div>
        </template>
  <!-- 只有在推荐列表有数据的时候显示 -->
        <template v-if="recommendLiveList.length">
  <!-- 标题 -->
    <df-hgroup class="search-result__title" title="为您推荐以下直播"></df-hgroup>
          <!-- 显示推荐列表 -->
          <dfLiveCardGroup :list="recommendLiveList" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ResponseStatus } from '@/enums/response'
import { SearchTabs } from '@/enums/search'
import { getLives } from '@/api/user'
// import { searchIndex, searchAnchor, searchLive } from '@/api/search'
import { searchIndex, searchHeadlines } from '@/api/search'
import { useRoute, useRouter } from 'vue-router'

import dfHgroup from '@/components/dfHgroup/index.vue'
import dfAnchorGroup from '@/components/dfAnchorGroup/index.vue'
import newsCardItem from '@/components/newsCardItem/index.vue'
import { useStore } from 'vuex'

// 这里是 tabs 相关的逻辑
const tabs = [
  {
    title: '综合',
    key: SearchTabs.Complex
  },
  {
    title: '主播',
    key: SearchTabs.Anchor
  },
  {
    title: '直播',
    key: SearchTabs.Live
  },
  {
    title: '新闻',
    key: SearchTabs.News
  }
]

const currentTabName = ref(SearchTabs.Complex) // 默认为综合

/**
 * 这里是搜索的核心逻辑
 * 这里有两种处理方式：
 * 1 根据不用的tab值来请求不同的接口 --> /index /anchor /live
 * 2 一次性请求综合的值(/index), 然后前端根据tab值来获取对应的数据 --> index 拿到 anchorList liveList
 * 理性分析之后采用方式2，因为方式1返回的接口的数据格式不同，前端处理需要进行多个判断
 */
const searchLoading = ref(false)

// name 默认拿 query.name
const route = useRoute()
const searchParams = reactive({
  isWeb: 1, //默认值
  name: route.query.name ?? ''
})

// 主播列表
const anchorList = ref([])

// 直播列表
const liveList = ref([])

/** ========== 新闻相关状态 ========== */
const NEWS_PAGE_SIZE = 30

// 新闻列表（已加载的累积数据）
const newsList = ref([])
// 新闻总条数（后端返回）
const newsTotalCount = ref(0)
// 新闻当前页码
const newsPage = ref(1)
// 新闻加载中
const newsLoading = ref(false)
// 是否还有更多新闻（直接使用后端返回的 has_more 字段）
const newsHasMore = ref(false)

// 重置新闻分页状态
const resetNews = () => {
  newsList.value = []
  newsTotalCount.value = 0
  newsPage.value = 1
  newsHasMore.value = false
}

// 加载新闻（追加模式）
const fetchNews = async () => {
  if (newsLoading.value) return
  newsLoading.value = true
  try {
 const res = await searchHeadlines({
      name: searchParams.name,
      page: newsPage.value,
      limit: NEWS_PAGE_SIZE
 })
    if (res.code === ResponseStatus.Success) {
      const data = res.data
      const items = data?.data ?? []
      const total = data?.total ?? 0
          newsTotalCount.value = total
      newsHasMore.value = data?.has_more ?? false
      newsList.value = [...newsList.value, ...items]
  }
  } catch (error) {
    console.error(error)
  } finally {
    newsLoading.value = false
  }
}

// 点击「加载查看更多」
const loadMoreNews = async () => {
  if (!newsHasMore.value || newsLoading.value) return
  newsPage.value += 1
  await fetchNews()
}

// 监听 tab 切换到新闻时，若列表为空则触发首次加载
watch(currentTabName, (val) => {
  if (val === SearchTabs.News && newsList.value.length === 0 && searchKeywords.value) {
    fetchNews()
  }
})
/** ========== 新闻相关状态 end ========== */

// 搜素到的结果总数
const totalResult = computed(() => {
  switch (currentTabName.value) {
    case SearchTabs.Anchor:
      return anchorList.value.length
    case SearchTabs.Live:
      return liveList.value.length
    case SearchTabs.News:
      return newsTotalCount.value
    default:
      return anchorList.value.length + liveList.value.length
  }
})

// 这是搜索结果之后的关键词 等于 searchParams.name
// 但是不适用searchParams.name是因为双绑会动态修改，这个值只能搜索结果之后修改
const searchKeywords = ref('')

const router = useRouter()

const onSearch = async () => {
  // 没有搜索值的时候 不给反馈
  if (!searchParams.name) return false
// 如果有搜索值，单纯修改query的name,并记录
  router.push({
query: {
 name: searchParams.name
    }
  })
  try {
    searchLoading.value = true
 const res = await searchIndex(searchParams)
    if (res.code === ResponseStatus.Success) {
      // 1 判断搜索的tab值
      // 如果搜索的结果 主播 和 直播列表都为空的话 去请求推荐列表
      if (!res.data.anchorList.length && !res.data.liveList.length) {
        await getRecommendLiveList()
 }
      anchorList.value = res.data.anchorList
      liveList.value = res.data.liveList
}
    // 每次搜索都重置新闻并重新加载第一页（后台静默，不阻塞主流程）
    resetNews()
    fetchNews()
    // 关闭 loading
    searchLoading.value = false
    // 赋值搜素关键词
    searchKeywords.value = searchParams.name
  } catch (error) {
    searchLoading.value = false
  }
}

/**  推荐的直播列表相关逻辑  **/
const recommendLiveList = ref([])
const getRecommendLiveList = async () => {
  try {
    const res = await getLives({
      isweb: 1,
limit: 20,
      page: 1,
      type: -1
    })
    if (res.code === ResponseStatus.Success) {
      recommendLiveList.value = res.data
    }
  } catch (error) {
    console.log(error)
  }
}

/**    热门搜索      **/
// 获取热门搜索列表
const store = useStore()
const searchHotList = computed(() => store.state.search.searchHotList)
const hotSearch = (keyword: string) => {
  searchParams.name = keyword
  onSearch()
}

onMounted(() => {
  // 初始化的时候
  if (searchParams.name) {
    onSearch()
  } else {
    getRecommendLiveList()
  }
})
</script>
<style scoped lang="scss">
.search {
width: 100%;
  overflow: hidden;

  &-header {
  width: 100%;
 height: 302px;
    background: #1d1e1f; // 设计图显示两种主题都一样，先固定写死
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    overflow: hidden;

    &__content {
   width: 855px;
   margin: 56px auto;
      overflow: hidden;

      &--title {
        height: 45px;
        line-height: 45px;
    font-size: 32px;
        font-weight: 700;
color: #fff;
        text-align: center;
        margin-bottom: 24px;
      }

    &--input {
        display: flex;
        align-items: center;
   width: 680px;
        height: 56px;
        padding: 14px 8px;
        margin: 0 auto;
 background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(4px);

        & > input {
     flex: 1;
          border: none;
   outline: none;
      appearance: none;
     padding-left: 12px;
          color: #fff;
  font-size: 20px;
          line-height: 28px;
          margin-right: 15px;
background: transparent;

     &::placeholder {
     color: #fff;
        }
 }
      }

      &--tags {
        display: flex;
 width: 100%;
        margin-top: 24px;
        overflow: hidden;

        :deep(.el-button) {
        font-size: 16px;
          border-color: transparent;
        }
  }
    }
  }

  &-tabs {
    :deep(.el-tabs__nav-scroll) {
      display: flex;
      justify-content: center;

    .el-tabs__item {
        padding: 0;
        min-width: 68px;
        height: 54px;
        line-height: 54px;
      }
    }
  }

  &-result {
    width: 100%;
    background: var(--el-table-background-color);
    overflow: hidden;

    &__content {
      width: 80%;
      min-width: 800px;
      margin: 0 auto 30px;
    overflow: hidden;

      :deep(.df-live-card-item) {
  margin-top: 0;
        margin-bottom: 12px;
      }
    }
  }

  &-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto 50px;
    overflow: hidden;

    &__image {
    width: 112px;
      margin-top: 80px;
    }

    &__text {
  color: var(--el-text-color-placeholder);
      margin-top: 12px;
    }
  }

  &-news {
    &-list {
      background: var(--el-bg-color);
      border-radius: 8px;
      overflow: hidden;
    }

    &-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px 0 24px;

      &__loading {
        color: var(--el-text-color-placeholder);
  font-size: 14px;
      }

      &__more {
        display: inline-flex;
        align-items: center;
     gap: 4px;
        padding: 6px 20px;
        border: 1px dashed var(--el-border-color);
        border-radius: 4px;
        color: var(--el-text-color-regular);
        font-size: 14px;
        cursor: pointer;
      transition: color 0.2s, border-color 0.2s;

        &:hover {
    color: var(--el-primary-color);
   border-color: var(--el-primary-color);
        }
      }

      &__done {
        color: var(--el-text-color-placeholder);
 font-size: 14px;
      }
    }
  }
}
</style>
