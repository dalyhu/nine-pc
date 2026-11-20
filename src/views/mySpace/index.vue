<template>
  <div class="greyBgc">
    <div class="center">
      <mainMenu v-model="mainMenuKey" />
      <div class="contentBlock">
        <keep-alive :max="9">
          <component
            :is="
              [
                UserInfoPage,
                myPost,
                myCollect,
                myAttention,
                myPromotion,
                bookBroadcast,
                myBroadcast,
                myPrivateMsg
              ][mainMenuKey]
            "
          ></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import mainMenu from './mainMenu.vue'
import myAttention from './myAttention.vue'
import myPost from './myPost.vue'
import myCollect from './myCollect.vue'
import UserInfoPage from './userInfo/index.vue'
import myPrivateMsg from './myPrivateMsg.vue'
import myPromotion from './myPromotion.vue'
import bookBroadcast from './bookBroadcast.vue'
import myBroadcast from './myBroadcast.vue'

const { dispatch } = useStore()
const mainMenuKey = ref(0)

watch(mainMenuKey, () => {
  localStorage.setItem('mainMenuKey', mainMenuKey.value)
  if (mainMenuKey.value != 0 && location.pathname === '/mySpace/user') {
    mainMenuKey.value = ~~localStorage.getItem('mainMenuKey')
  }
})

onMounted(() => {
  mainMenuKey.value = history.state.comp || ~~localStorage.getItem('mainMenuKey')
  dispatch('SET_FORUM_LIST') // 获取fid列表
})

onUnmounted(() => {
  localStorage.removeItem('mainMenuKey')
})
</script>

<style scoped lang="scss">
.greyBgc {
  margin: 0 auto;
  background-color: #f1f1f1;
  height: calc(100vh - 70px);
  overflow-y: scroll;
  border-bottom: 1px solid transparent;
  &::-webkit-scrollbar {
    width: 0;
  }
  .center {
    display: flex;
    height: 100%;
    margin: 0 auto;
    justify-content: center;
    gap: 20px;
    .contentBlock {
      width: 996px;
      min-height: 480px;
      margin-top: 16px;
      background-color: #fff;
      border-radius: 8px;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 0;
      }
    }
  }
}
</style>
