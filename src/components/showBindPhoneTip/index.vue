<template>
  <div class="email-tip">
    <img class="close" src="/static/images/login/close.svg" @click="close" alt="" />
    <img class="image" src="/static/images/login/email-tip.png" alt="" />
    <div class="content">
      <div class="title">为了您的账号安全，建议您尽快绑定手机！</div>
      <p class="desc">（完善个人信息后，可私聊小助理领取好运小惊喜!）</p>
      <div class="button" @click="handleConfirm">绑定手机</div>
      <div class="remark" @click="showTip = !showTip">
        <span class="circle" v-if="showTip"></span>
        <img v-else src="/static/images/login/ok.svg" alt="" />
        <span>本日不再提示</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// @ts-ignore
import { getToday } from '@/utils/common'
// @ts-ignore
import { useStore } from 'vuex'

const showTip = ref(true)

const store = useStore()

const close = () => {
  if (!showTip.value) {
    // 确定本日不在显示
    const mailInfo = {
      date: getToday(), // 时间
      userId: store.state.user.infoData.id // 存入用户id
    }
    localStorage.setItem('SET_PHONE_TIP', JSON.stringify(mailInfo))
  }
  store.commit('closeEmailTip')
}

const router = useRouter()

const handleConfirm = () => {
  close()
  router.push('/member?type=0&tab=3')
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

    .remark {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 120px;
      margin: 0 auto;
      font-size: 14px;
      color: rgba($color: #000000, $alpha: 0.39);
      cursor: pointer;
      img,
      .circle {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin-right: 5px;

        &.circle {
          border: 1px solid #2a2a2a;
        }
      }
    }
  }
}
</style>
