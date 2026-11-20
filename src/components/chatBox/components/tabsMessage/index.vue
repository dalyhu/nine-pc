<template>
  <div class="message-tabs-component flex">
    <div class="del-already">{{ deleteText }}</div>

    <div v-loading="loading" class="mask-loading">
      <!-- v-infinite-scroll="_updateloadMore" -->
      <!-- :infinite-scroll-immediate="false" -->
      <div
        class="delete-scroll hide_scrollbar"
      >
        <ul class="del-content" v-if="delList.length">
          <li v-for="item in delList" :key="item.id">
            <div class="level-status" :class="'level-' + item.level">
              <img
                :src="`/static/images/live/level/${item.level}.png`"
                :alt="item.level"
                width="16px"
                height="16px"
              />
              <span class="sender-exp">{{ `Lv.${item.level}` }}</span>
            </div>
            <!-- username -->
            <span class="del-username">{{ item.username }}: </span>
            <span class="del-message-content">{{ item.text }}</span>
          </li>
        </ul>
  
        <DfEmpty v-else  />
      </div>
    </div>
  </div>
</template>

<script setup>
import { delChatRoomMessage } from '@/api/housManage'
const props = defineProps({
  roomId: {
    type: Number,
    default: 0
  }
})
const deleteText = '已删除'
const currentPage = ref(1)
// const loadingMoreList = ref(false)
const loading = ref(false)
const delList = ref([])

const init = () => {
  loading.value = true
  delChatRoomMessage({
    page: currentPage.value,
    page_size: 10,
    username: '',
    room_id: props.roomId
  })
    .then((res) => {
      const { code, data } = res
      if (code === 0) {
        delList.value = data.data
        // if (currentPage.value < data.last_page) {
        //   currentPage.value++
        //   loadingMoreList.value = true
        // } else {
        //   loadingMoreList.value = false
        // }
      }
      loading.value = false
    })
    .catch((error) => {
      delList.value = []
      loading.value = false
      ElMessage.warning(error.msg)
    })
}
/**加载更多 */
// const _updateloadMore = () => {
//   if (!loadingMoreList.value) return;
//   init()
// }
onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
@import './index.scss';
@import '../tabsUser/searchQueryList.scss';
</style>
