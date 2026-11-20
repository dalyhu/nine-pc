<!-- 新闻头条 -->
<template>
  <div class="newsHeadlines">
    <dfHgroup title="新闻头条">
      <template v-slot:prepend>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
        >
          <circle cx="14" cy="14" r="14" fill="#27CE24" />
          <path
            d="M20.2222 7C20.4127 7.00003 20.5966 7.06997 20.739 7.19656C20.8813 7.32315 20.9723 7.49758 20.9946 7.68678L21 7.77778V18.6667C21 19.2618 20.7726 19.8345 20.3643 20.2675C19.956 20.7006 19.3977 20.9612 18.8036 20.9961L18.6667 21H8.94444C8.45077 21.0001 7.97556 20.8124 7.61519 20.475C7.25482 20.1376 7.03627 19.6757 7.00389 19.1831L7 19.0556V13.2222C7.00003 13.0317 7.06997 12.8478 7.19656 12.7055C7.32315 12.5631 7.49758 12.4722 7.68678 12.4499L7.77778 12.4444H9.33333V7.77778C9.33336 7.58727 9.4033 7.4034 9.52989 7.26104C9.65648 7.11868 9.83092 7.02773 10.0201 7.00544L10.1111 7H20.2222ZM9.33333 14H8.55556V19.0556C8.55538 19.1527 8.59159 19.2465 8.65706 19.3183C8.72253 19.3901 8.81252 19.4348 8.90931 19.4436C9.00609 19.4524 9.10265 19.4246 9.17998 19.3657C9.25731 19.3069 9.3098 19.2212 9.32711 19.1256L9.33333 19.0556V14ZM16.3333 15.5556H12.4444C12.2382 15.5556 12.0403 15.6375 11.8945 15.7834C11.7486 15.9292 11.6667 16.1271 11.6667 16.3333C11.6667 16.5396 11.7486 16.7374 11.8945 16.8833C12.0403 17.0292 12.2382 17.1111 12.4444 17.1111H16.3333C16.5396 17.1111 16.7374 17.0292 16.8833 16.8833C17.0292 16.7374 17.1111 16.5396 17.1111 16.3333C17.1111 16.1271 17.0292 15.9292 16.8833 15.7834C16.7374 15.6375 16.5396 15.5556 16.3333 15.5556ZM17.8889 10.1111H12.4444C12.2539 10.1111 12.0701 10.1811 11.9277 10.3077C11.7853 10.4343 11.6944 10.6087 11.6721 10.7979L11.6667 10.8889V13.2222C11.6667 13.4127 11.7366 13.5966 11.8632 13.739C11.9898 13.8813 12.1642 13.9723 12.3534 13.9946L12.4444 14H17.8889C18.0794 14 18.2633 13.93 18.4056 13.8034C18.548 13.6769 18.6389 13.5024 18.6612 13.3132L18.6667 13.2222V10.8889C18.6666 10.6984 18.5967 10.5145 18.4701 10.3722C18.3435 10.2298 18.1691 10.1388 17.9799 10.1166L17.8889 10.1111ZM17.1111 11.6667V12.4444H13.2222V11.6667H17.1111Z"
            fill="white"
          />
        </svg>
      </template>
    </dfHgroup>
    <div class="list">
      <div class="inner-box themed_scrollbar">
        <newsCardItem
          v-for="item in headlineList.data"
          :key="item.id"
          :info="item"
          thumb-size="108x78"
        />
      </div>
    </div>
  </div>
</template>
<script setup name="NewsHeadlines" lang="ts">
import { ref, watch } from 'vue'
import dfHgroup from '@/components/dfHgroup/index.vue'
import { getList } from '@/api/headline'
import newsCardItem from '@/components/newsCardItem/index.vue'
defineOptions({
  name: 'NewsHeadlines',
  inheritAttrs: true
})

const props = defineProps({
  isDoneInitUserId: {
    type: Boolean,
    default: false
  }
})

const headlineList = ref([])
// 获取头条
const getHeadlineList = () => {
  getList().then((res) => {
    headlineList.value = res.data.list
  })
}

watch(
  () => props.isDoneInitUserId,
  () => {
    if (props.isDoneInitUserId) getHeadlineList()
  }
)
if (props.isDoneInitUserId) getHeadlineList()
</script>
<style lang="scss" scoped>
.newsHeadlines {
  font-size: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  .dfHgroup {
    position: relative;
    z-index: 1;
    padding: 10px 0;
  }
  .list {
    flex: 1;
    width: 100%;
    background-color: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color-extra-light);
    padding: 12px 0;
    overflow: hidden;
    border-radius: 16px;
    .inner-box {
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 5px;
      }
    }
  }
}
</style>
