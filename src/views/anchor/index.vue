<template>
  <div class="classify">
    <!-- 这里是居中的主要内容 -->
    <div class="classify-container">
      <!-- 这里分为上中下三部分 上面部分为swiper轮播-->
      <live-match-swiper></live-match-swiper>
      <!-- 这里是分类 先不抽离出一个组件-->
      <!-- <live-match-classify></live-match-classify> -->
      <div class="classify-container__tabs">
        <div class="classify-container__tabs--label">在线直播</div>
        <ul class="classify-container__tabs--list">
          <li class="item" v-for="item in liveCategories" :key="item.id">
            <el-button
              :type="categoryActive === item.id ? 'primary' : ''"
              round
              @click="handleClickCategory(item.id)"
              >{{ item.name }}</el-button
            >
          </li>
        </ul>
      </div>
      <!-- 下面的直播列表 -->
      <dfLiveCardGroup v-if="liveList.length" :list="liveList" />
      <!-- 空状态 -->
      <div class="classify-container__empty" v-else>
        <el-empty :image="EmptyImage" description="暂无数据"></el-empty>
      </div>
      <!-- 分页功能 -->
      <div class="classify-container__pagination">
        <el-pagination
          background
          v-model:current-page="queryParams.page"
          @change="getLiveList"
          :page-size="queryParams.limit"
          layout="prev, pager, next"
          :total="total"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ResponseStatus } from '@/enums/response'
import { LiveCateGory } from '@/enums/category'
import { getLiveCategories, getLives } from '@/api/user'
import { useRoute, useRouter } from 'vue-router'
import EmptyImage from '/static/images/theme/no_data.png'

import LiveMatchSwiper from './components/liveMatch/index.vue'
// import LiveMatchClassify from './components/liveMatchClassify/index.vue'

/** 获取直播流分类的相关逻辑  **/
const liveCategories = ref([])

// 选中状态下的 category
const route = useRoute()
// 获取选中状态下的分类 query.type  LiveCateGory的值
const categoryActive = computed(() =>
  route.query.type ? Number(route.query.type) : LiveCateGory.Football
)

watch(categoryActive, () => {
  if (queryParams.page !== 1) {
    queryParams.page = 1
  } else {
    getLiveList()
  }
})

const getCategories = async () => {
  try {
    const res = await getLiveCategories()
    if (res.code === ResponseStatus.Success) {
      // 在第一个加一个全部
      liveCategories.value = [{ id: -1, name: '全部' }, ...res.data]
    }
  } catch (error) {
    console.error(error)
  }
}

// 选择分类进行赛事搜索
const router = useRouter()
const handleClickCategory = (id: LiveCateGory) => {
  // 修改route 的 type
  router.push({
    query: {
      type: id
    }
  })
}

// 根据分类来获取对应的直播列表
const queryParams = reactive({
  page: 1,
  limit: 20,
  type: categoryActive.value, // -1全部 0足球 1篮球 2更多 3電競 4区块
  isweb: 1
})
const liveList = ref([])

const total = ref(0)
const getLiveList = async () => {
  queryParams.type = categoryActive.value
  try {
    const res = await getLives(queryParams)
    if (res.code === ResponseStatus.Success) {
      liveList.value = res.data
      total.value = res.page.allCount
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getCategories()
  getLiveList()
})
</script>
<style scoped lang="scss">
.classify {
  padding-left: 48px;
  height: 100%;
  overflow: hidden;
  &-container {
    display: flex;
    flex-direction: column;
    width: 90%;
    min-width: 800px;
    height: 100%;
    margin: 20px auto 0;

    &__tabs {
      display: flex;
      align-items: center;
      margin-top: 24px;
      margin-bottom: 12px;
      line-height: 32px;
      overflow: hidden;

      &--label {
        font-size: 20px;
        margin-right: 24px;
        white-space: nowrap;
        color: var(--el-icon-color-primary);
      }

      &--list {
        flex: 1;
        display: flex;

        li.item {
          margin-right: 12px;

          :deep(.el-button) {
            min-width: 74px;
          }
        }
      }
    }

    &__empty {
      width: 100%;
      margin-top: 20px;
    }

    &__pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 50px auto;
    }
  }
}
</style>
