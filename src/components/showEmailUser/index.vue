<template>
  <div class="email-tip">
    <img class="close" src="/static/images/login/close.svg" @click="close" alt="" />
    <img class="image" src="/static/images/login/phone-tip.png" alt="" />
    <div class="content">
      <div class="title">新账号等级过低，请先进行签到活跃升级或绑定手机号码立即解锁发言！</div>
      <p class="desc">（XC会员可私聊小助理即刻开通VIP权益!）</p>
      <div class="button" @click="handleConfirm">我知道了</div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()

const router = useRouter()
// 手机绑定页面
const handleConfirm = () => {
  router.push('/member?type=0&tab=3')
  store.commit('setShowEmailUserTipState', false)
}

const close = () => {
  store.commit('setShowEmailUserTipState', false)
}
</script>
<style scoped lang="scss">
.email-tip {
  position: absolute;
  width: 558px;
  height: 551px;
  top: 120px;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  border-radius: 8px;
  z-index: 999;
  overflow: hidden;

  .image {
    display: block;
    width: 100%;
  }

  .close {
    position: absolute;
    top: 30px;
    right: 5px;
    width: 38px;
    height: 38px;
    cursor: pointer;
  }

  .content {
    padding: 0 45px;
    height: 283px;
    text-align: center;
    background: #fffbf8;
    overflow: hidden;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    overflow: hidden;

    .title {
      font-size: 24px;
      color: #3f3f3f;
      font-weight: 500;
      margin: 28px 0 10px;
    }

    .desc {
      font-size: 18px;
      color: #666;
    }

    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      margin: 24px 0;
      font-size: 20px;
      cursor: pointer;
      height: 52px;
      background: #d02d54;
      border-radius: 32px;
    }
  }
}
</style>
