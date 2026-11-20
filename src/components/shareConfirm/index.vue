<template>
  <!-- invite-code-modal -->
  <div class="copy-model" :class="{ 'invite-code-modal': showInviteCode }">
    <div class="invite-content" v-if="showInviteCode">
      <div class="desc">
        <p>恭喜注册成功，</p>
        <p>快进直播间等你开局！</p>
      </div>
    </div>
    <div class="content" v-else>
      <div class="desc">
        <p>链接复制好啦，</p>
        <p>快转发给你的朋友吧！</p>
      </div>
    </div>

    <img src="/static/images/promotion/close.svg" class="close" @click="close" />
  </div>
</template>

<script setup>
import { useStore } from 'vuex'

const store = useStore()
const close = () => {
  store.commit('setShowShareConfirm', false)
}

const showInviteCode = ref(false)

onMounted(() => {
  showInviteCode.value = !!sessionStorage.getItem('invite_register_success')
})
</script>
<style scoped lang="scss">
.copy-model {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 558px;
  height: 178px;
  left: 50%;
  top: 300px;
  transform: translate3d(-50%, 0, 0);
  background: url('/static/images/promotion/copy_success.webp') no-repeat center / 100% 100%;
  z-index: 9999;

  &.invite-code-modal {
    height: 140px;
    background: url('/static/images/promotion/invite_success.webp') no-repeat center / 100% 100%;

    .invite-content {
      width: 100%;
      height: 100%;
      margin-top: -15px;

      .desc {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding-top: 16px;
        box-sizing: border-box;
        padding-left: 200px;

        p {
          color: #272321;
          font-size: 28px;
          margin: 3px 0;
        }
      }
    }
  }

  .content {
    width: 100%;
    height: 100%;
    margin-top: -33px;

    .desc {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding-top: 16px;
      box-sizing: border-box;
      padding-left: 200px;

      p {
        color: #272321;
        font-size: 28px;
        margin: 3px 0;
      }
    }
  }

  .close {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 38px;
    height: 38px;
    cursor: pointer;
    border-radius: 50%;
  }
}
</style>
