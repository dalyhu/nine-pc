<template>
  <div class="greyBgc">
    <div class="center">
      <mainMenu v-model="mainMenuKey" />
      <div class="contentBlock">
        <keep-alive :max="2">
          <component :is="[UserInfoPage, OtherPost][mainMenuKey]"></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script setup>
import mainMenu from './mainMenu.vue'
import OtherPost from './otherPost.vue'
import UserInfoPage from './userInfo/index.vue'

const mainMenuKey = ref(0)

watch(mainMenuKey, () => localStorage.setItem('otherMainMenuKey', mainMenuKey.value))

onMounted(() => {
  mainMenuKey.value = history.state.comp || ~~localStorage.getItem('otherMainMenuKey')
})

onUnmounted(() => {
  localStorage.removeItem('otherMainMenuKey')
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
