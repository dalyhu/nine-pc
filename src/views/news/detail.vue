<!-- 新闻详情 -->
<template>
  <div class="news-detail">
    <header class="news-detail__crumb-bar">
      <nav class="news-detail__crumb">
        <span class="news-detail__crumb-label">当前位置：</span>
        <span class="news-detail__crumb-arrow">&gt;</span>
        <span>首页</span>
        <span class="news-detail__crumb-arrow">&gt;</span>
        <span class="news-detail__crumb-title">{{ info.title }}</span>
      </nav>
    </header>

    <div class="news-detail__body">
      <div class="news-detail__main">
        <article class="news-detail__article">
          <h1 class="news-detail__title">{{ info.title }}</h1>

          <div class="news-detail__meta">
            <span>作者:</span>
            <span class="news-detail__meta-value">{{ info.user_nickname }}</span>
            <span class="news-detail__meta-label">发布时间:</span>
            <span class="news-detail__meta-value">{{ info.addtime }}</span>
            <span class="news-detail__meta-label">阅读次数:</span>
            <span class="news-detail__meta-value">{{ info.click }}</span>
          </div>

          <div class="news-detail__content">
            <div class="news-detail__content-html" v-html="info.content" />
          </div>

          <nav class="news-detail__pager">
            <div class="news-detail__pager-item">
              <template v-if="isEmpty(last)">
                <p class="news-detail__pager-empty">&lt;&nbsp; 没有更多文章了</p>
              </template>
              <template v-else>
                <p class="news-detail__pager-label" @click="openPage('/detail?id=' + last.id)">
                  &lt;&nbsp; 上一篇
                </p>
                <p
                  class="news-detail__pager-link"
                  :title="last.title"
                  @click="openPage('/detail?id=' + last.id)"
                >
                  {{ last.title }}
                </p>
              </template>
            </div>
            <div class="news-detail__pager-gap" />
            <div class="news-detail__pager-item news-detail__pager-item--next">
              <template v-if="isEmpty(next)">
                <p class="news-detail__pager-empty">已经是最后一篇了 &nbsp;&gt;</p>
              </template>
              <template v-else>
                <p
                  class="news-detail__pager-label"
                  @click="openPage('/detail?id=' + next.id)"
                >
                  下一篇 &nbsp;&gt;
                </p>
                <p
                  class="news-detail__pager-link"
                  :title="next.title"
                  @click="openPage('/detail?id=' + next.id)"
                >
                  {{ next.title }}
                </p>
              </template>
            </div>
          </nav>
        </article>

        <section class="news-detail__section">
          <div class="news-detail__section-head">
            <img class="news-detail__section-head-icon" :src="recommendIcon" alt="" />
            <h2 class="news-detail__section-head-title">推荐头条</h2>
          </div>
          <div class="news-detail__list news-detail__list--recommend">
            <newsCardItem
              v-for="item in recommend"
              :key="item.id"
              :info="item"
              thumb-size="180x106"
            />
          </div>
        </section>
      </div>

      <aside class="news-detail__sidebar">
        <div class="news-detail__author">
          <div class="news-detail__author-inner">
            <img
              class="news-detail__author-avatar"
              :src="info.avatar"
              alt=""
              @error="onAvatarError"
            />
            <div class="news-detail__author-info">
              <div class="news-detail__author-row">
                <div class="news-detail__author-name" :title="info.user_nickname">
                  {{ info.user_nickname }}
                </div>
                <button
                  v-if="info.is_attention == 0"
                  type="button"
                  class="news-detail__author-btn news-detail__author-btn--follow"
                  @click="handleAttention"
                >
                  关注
                </button>
                <button
                  v-else
                  type="button"
                  class="news-detail__author-btn news-detail__author-btn--followed"
                >
                  已关注
                </button>
              </div>
              <div class="news-detail__author-stats">
                <span>关注</span>
                <span class="news-detail__author-stats-num">{{ info.attention }}</span>
              </div>
            </div>
          </div>
        </div>

        <section class="news-detail__user-articles">
          <div class="news-detail__section-head">
            <img class="news-detail__section-head-icon" :src="articleIcon" alt="" />
            <h2 class="news-detail__section-head-title">TA的文章</h2>
          </div>
          <div class="news-detail__list news-detail__list--user">
            <newsCardItem
              v-for="item in userPostArticles"
              :key="item.id"
              :info="item"
              thumb-size="108x78"
            />
            <DfEmpty v-if="!userPostArticles.length" />
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { isEmpty } from 'lodash-es'
import { ElMessage } from 'element-plus'
import { getInfo, userPostList as getUserPostListApi } from '@/api/headline.js'
import { attention } from '@/api/user.js'
import { getQueryString } from '@/utils'
import newsCardItem from '@/components/newsCardItem/index.vue'
import articleIcon from './image/article_icon.png'
import recommendIcon from './image/recommed_icon.png'

defineOptions({ name: 'NewsDetail' })

const route = useRoute()
const router = useRouter()
const store = useStore()
const { proxy } = getCurrentInstance()

const info = ref({})
const last = ref({})
const next = ref({})
const recommend = ref([])
const userPosts = ref({ total: 0 })

const userPostArticles = computed(() => (userPosts.value.data || []).slice(0, 5))

function onAvatarError(event) {
  proxy.$common.errorImg(event)
}

async function fetchUserPostList() {
  if (!info.value?.uid) return
  try {
    const res = await getUserPostListApi({ uid: info.value.uid })
    userPosts.value = res.data
  } catch {
    /* ignore */
  }
}

async function fetchDetail() {
  const id = route.query.id
  if (!id) return
  try {
    const res = await getInfo({ id })
    info.value = res.data.info
    last.value = res.data.last
    next.value = res.data.next
    recommend.value = res.data.recommend
    await fetchUserPostList()
  } catch {
    /* ignore */
  }
}

async function handleAttention() {
  if (!store.state.user.infoData?.id) {
    store.state.user.showLoginMask = true
    return
  }
  try {
    const res = await attention({ id: info.value.uid })
    if (res.code === 0) {
      if (info.value.is_attention == 0) {
        info.value.is_attention = 1
        info.value.attention = info.value.attention + 1
      } else {
        info.value.is_attention = 0
      }
      ElMessage({ message: res.msg, type: 'success' })
    }
  } catch (error) {
    console.log(error)
  }
}

function openPage(targetPath) {
  router.push({
    path: '/detail',
    query: { ...getQueryString(targetPath) }
  })
}

watch(
  () => route.query.id,
  (id, prevId) => {
    if (!id) return
    fetchDetail()
    if (prevId != null && String(prevId) !== String(id)) {
      window.scrollTo(0, 0)
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@import './detail.scss';
</style>
