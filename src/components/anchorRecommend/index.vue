<!-- 主播推荐 -->
<template>
  <div class="anchorRecommend">
    <div class="inner-box">
      <div class="title">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="18"
          viewBox="0 0 40 18"
          fill="none"
        >
          <path
            d="M0 6.66667C0 2.98477 2.98477 0 6.66667 0H40V11.1111C40 14.793 37.0152 17.7778 33.3333 17.7778H0V6.66667Z"
            fill="#FF5A5A"
          />
          <path
            d="M26.2324 6.26749V4.57715H34.1964V6.26749H31.2277V14.2741H29.2012V6.26749H26.2324Z"
            fill="white"
          />
          <path
            d="M25.5258 9.4254C25.5258 10.4828 25.3253 11.3825 24.9245 12.1243C24.5267 12.8661 23.9838 13.4327 23.2957 13.8241C22.6107 14.2123 21.8405 14.4065 20.9851 14.4065C20.1233 14.4065 19.35 14.2107 18.665 13.8193C17.98 13.4279 17.4387 12.8613 17.0409 12.1195C16.6432 11.3777 16.4443 10.4797 16.4443 9.4254C16.4443 8.36795 16.6432 7.46833 17.0409 6.72653C17.4387 5.98474 17.98 5.41971 18.665 5.03146C19.35 4.64004 20.1233 4.44434 20.9851 4.44434C21.8405 4.44434 22.6107 4.64004 23.2957 5.03146C23.9838 5.41971 24.5267 5.98474 24.9245 6.72653C25.3253 7.46833 25.5258 8.36795 25.5258 9.4254ZM23.4472 9.4254C23.4472 8.74042 23.3446 8.16277 23.1394 7.69244C22.9374 7.22211 22.6517 6.86542 22.2824 6.62237C21.9131 6.37931 21.4806 6.25778 20.9851 6.25778C20.4895 6.25778 20.057 6.37931 19.6877 6.62237C19.3184 6.86542 19.0311 7.22211 18.826 7.69244C18.6239 8.16277 18.5229 8.74042 18.5229 9.4254C18.5229 10.1104 18.6239 10.688 18.826 11.1584C19.0311 11.6287 19.3184 11.9854 19.6877 12.2284C20.057 12.4715 20.4895 12.593 20.9851 12.593C21.4806 12.593 21.9131 12.4715 22.2824 12.2284C22.6517 11.9854 22.9374 11.6287 23.1394 11.1584C23.3446 10.688 23.4472 10.1104 23.4472 9.4254Z"
            fill="white"
          />
          <path
            d="M6.66504 14.2741V4.57715H8.71523V8.5781H12.8772V4.57715H14.9226V14.2741H12.8772V10.2684H8.71523V14.2741H6.66504Z"
            fill="white"
          />
        </svg>
        <span>主播推荐</span>
      </div>
      <div class="list themed_scrollbar">
        <anchorRecommendCard v-for="item in recommendList" :key="item.id" :info="item" />
      </div>
    </div>
  </div>
</template>
<script setup name="AnchorRecommend" lang="ts">
import { ref } from 'vue'
import anchorRecommendCard from '@/components/anchorRecommendCard/index.vue'
import { getRecommendNew } from '@/api/common.js'
defineOptions({
  name: 'AnchorRecommend',
  inheritAttrs: true
})

const page = ref(1)
const recommendList = ref([])
// 获取推荐主播
const getRecommendNewAction = () => {
  let params = {
    type: 2, // 1:热门 2:推荐
    platform: 1, // 1:pc 2:h5 3:android 4:ios
    side: 6, // 投放位置  1:足球 2:篮球 3:电竞 4:首页 5:直播间 6:其他
    listRows: 8, // 每页数量
    page: page.value // 页码
  }
  // getRecommend(params).then(res => {
  getRecommendNew(params).then((res) => {
    recommendList.value = res.data.data
  })
}

getRecommendNewAction()
</script>
<style lang="scss" scoped>
.anchorRecommend {
  margin-top: -34px;
  flex: 1;
  padding: 0;
  .inner-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px 0;
      width: 166px;
      border-radius: 12px;
      border: 1px solid var(--el-border-color);
      background: var(--el-bg-color-page);
      margin-bottom: 24px;
      span {
        color: var(--el-text-color-primary);
        font-size: 18px;
        font-weight: 600;
        line-height: 28px;
        margin-left: 8px;
      }
    }
  }
  .list {
    max-width: 100%;
    overflow: hidden;
    overflow-x: auto;
    padding: 0 12px 10px;
    display: flex;
    height: auto;
    justify-content: space-between;
    :deep(.anchorRecommendCard) {
      width: 144px;
      height: 188px;
      background: var(--el-bg-color-overlay);
      margin-left: 16px;
      &:first-child {
        margin-left: 0;
      }
      .inner-box {
        height: 100%;
        flex-direction: column;
      }
      .grid-info {
        flex-direction: column;
        width: 100%;
        margin-left: 0;
        margin-top: 25px;
        .nickname {
          text-align: center;
        }
        .heat {
          margin-top: 3px;
          justify-content: center;
        }
      }
      + .anchorRecommendCard {
        margin-top: 0;
      }
    }
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
  }
}
</style>
