<template>
  <div class="user-tab-component">
    <ul class="status-list flex">
      <li
        v-for="sub in stautsList"
        :key="sub.type"
        @click="handleChangeType(sub)"
        :class="{ isLight: currentType === sub.type }"
      >
        <span>{{ sub.text }}</span>
      </li>
    </ul>

    <SearchParams @search="_emitsSearch" v-model="keyWords"></SearchParams>
    <div v-loading="loading" class="mask-loading">
      <div
        class="user-tab-content hide_scrollbar"
        v-infinite-scroll="_updateloadMore"
        :infinite-scroll-immediate="false"
      >
        <!-- 在线 -->
        <template v-if="isOnline">
          <div class="user-online" v-if="roomUserList.length">
            <SearchQueryList
              v-if="roomUserList.length"
              :vid="vid"
              :roomId="roomId"
              :userNickname="userNickname"
              :itemList="roomUserList"
              :loadingMoreList="loadingMoreList"
              :isTabs="'online'"
              @_updateItemList="_emitsOnline"
            ></SearchQueryList>
          </div>
          <DfEmpty v-else />
        </template>

        <!-- 拉黑 -->
        <template v-if="isBlock">
          <div class="user-block" v-if="roomBlockList.length">
            <SearchQueryList
              :vid="vid"
              :roomId="roomId"
              :userNickname="userNickname"
              :itemList="roomBlockList"
              :loadingMoreList="loadingMoreList"
              :isTabs="'block'"
              @_updateItemList="(sub) => _emitsBlockBan(sub, 'block')"
            ></SearchQueryList>
          </div>
          <DfEmpty v-else />
        </template>

        <!-- 禁言 -->
        <template v-if="isBan">
          <div class="user-ban" v-if="roomBanList.length">
            <SearchQueryList
              :vid="vid"
              :roomId="roomId"
              :userNickname="userNickname"
              :itemList="roomBanList"
              :loadingMoreList="loadingMoreList"
              :isTabs="'ban'"
              @_updateItemList="(sub) => _emitsBlockBan(sub, 'ban')"
            ></SearchQueryList>
          </div>
          <DfEmpty v-else />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import SearchParams from './searchParams.vue'
import SearchQueryList from './searchQueryList.vue'
import { useStore } from 'vuex'
import { getRoomUserList, getBanList, getBlockList } from '@/api/housManage.js'
const props = defineProps({
  vid: {
    type: String,
    default: ''
  },
  userNickname: {
    type: String,
    default: ''
  },
  roomId: {
    type: Number,
    default: 0
  }
})
const store = useStore()
/** tab列表 */
const stautsList = computed(() => {
  const permission = Object.values(store.state.house.houseAuthor?.permission)
  const list = [{ text: '查询', type: 'online' }]
  if (permission.includes('block')) {
    list.push({ text: '拉黑', type: 'block' })
  }
  if (permission.includes('mute')) {
    list.push({ text: '禁言', type: 'ban' })
  }
  return list
})

const currentType = ref('online')
const keyWords = ref('')
const roomUserList = ref([])
/** 拉黑数据 */
const roomBlockList = ref([])
/** 禁言数据 */
const roomBanList = ref([])
const currentPage = ref(1)
const currentSize = ref(20)
const loadingMoreList = ref(false) // 是否加载
const loading = ref(false) // 是否加载
/** 是在线 */
const isOnline = computed(() => {
  return currentType.value === 'online'
})
/** 是拉黑 */
const isBlock = computed(() => {
  return currentType.value === 'block'
})
/** 是禁言 */
const isBan = computed(() => {
  return currentType.value === 'ban'
})

const handleChangeType = (sub) => {
  if (currentType.value === sub.type) return
  currentType.value = sub.type
  keyWords.value = ''
  loadingMoreList.value = false
  getList()
}
/** 搜索 */
const _emitsSearch = () => {
  getList()
}

const getList = () => {
  currentPage.value = 1
  if (currentType.value === 'ban') {
    roomBanList.value = []
    definListFun(getBanList, roomBanList.value)
  } else if (currentType.value === 'block') {
    roomBlockList.value = []
    definListFun(getBlockList, roomBlockList.value)
  } else {
    roomUserList.value = []
    definListFun(getRoomUserList, roomUserList.value)
  }
}

const _emitsOnline = (sub) => {
  roomUserList.value.forEach((ele) => {
    if (ele.id === sub.id) {
      ele[sub.apply_status] = true
    }
  })
}

const _emitsBlockBan = (sub, type) => {
  if (type === 'block') {
    roomBlockList.value.forEach((ele) => {
      if (ele.user_id === sub.user_id) {
        ele.toast = true
      }
    })
  } else {
    roomBanList.value.forEach((ele) => {
      if (ele.user_id === sub.user_id) {
        ele.toast = true
      }
    })
  }
}

const _updateloadMore = () => {
  if (!loadingMoreList.value) return
  if (currentType.value === 'ban') {
    /**禁言 */
    definListFun(getBanList, roomBanList.value)
  } else if (currentType.value === 'block') {
    /**拉黑 */
    definListFun(getBlockList, roomBlockList.value)
  } else {
    /**查询 */
    definListFun(getRoomUserList, roomUserList.value)
  }
}
const definListFun = (listApi, list) => {
  loading.value = true
  listApi({
    page_size: currentSize.value,
    page: currentPage.value,
    username: keyWords.value,
    vid: props.vid, // 直播间id
    room_id: props.roomId // 房间类型0直播间1群组2私信
  })
    .then((res) => {
      let { code, data } = res
      if (code === 0) {
        list.push(...data.data)
        if (currentPage.value < data.last_page) {
          currentPage.value++
          loadingMoreList.value = true
        } else {
          loadingMoreList.value = false
        }
      }
      loading.value = false
    })
    .catch((error) => {
      console.log(error)
      list = []
      loading.value = false
    })
}

onMounted(() => {
  definListFun(getRoomUserList, roomUserList.value)
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
