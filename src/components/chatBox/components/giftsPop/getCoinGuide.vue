<template>
  <div class="content">
    <div class="contentBtns">
      <div class="BtnLeft">
        <img
          src="/static/images/daily/diamond-directions-btn-1.png"
          @click="gotoDailyMission(true)"
        />
      </div>
      <div class="BtnCenter">
        <img src="/static/images/daily/diamond-directions-btn-2.png" @click="gotoDailyMission()" />
      </div>
      <div class="BtnRight">
        <img src="/static/images/daily/diamond-directions-btn-3.png" @click="gotoDailyMission()" />
      </div>
    </div>
    <img class="closeBtn" src="/static/images/daily/close.png" @click="emit('close')" />
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const emit = defineEmits(['close'])
const router = useRouter()
const store = useStore()

function gotoDailyMission(needLogin) {
  if (needLogin && !store.state.user.infoData.id) {
    store.commit('user/SET_LOGIN_MASK', true)
  } else {
    router.push('/dailyMission')
  }
  emit('close')
}
</script>
<style lang="scss" scoped>
.content {
  width: 650px;
  height: 400px;
  position: relative;
  background: url('/static/images/daily/diamond-directions.png') -15px top / 100% auto no-repeat;
  .contentBtns {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 100px 40px 130px 55px;
    .BtnLeft,
    .BtnCenter,
    .BtnRight {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      cursor: pointer;
      img {
        height: 150px;
      }
    }
  }
  .closeBtn {
    position: absolute;
    top: -20px;
    right: 0px;
    cursor: pointer;
  }
}
</style>
