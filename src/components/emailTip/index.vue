<template>
  <div class="email-tip">
    <img class="close" src="/static/images/login/close.svg" @click="close" alt="" />
    <img class="image" src="/static/images/login/email-tip.webp" alt="" />
    <div class="content">
      <img
        class="button"
        src="/static/images/login/email-tip-button.webp"
        alt="绑定邮箱"
        @click="handleConfirm"
      />
      <div class="remark" @click="showTip = !showTip">
        <span class="circle" v-if="showTip"></span>
        <img v-else class="remark-check" src="/static/images/login/email-tip-check.svg" alt="" />
        <span>今日不再提示</span>
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
    localStorage.setItem('SET_MAIL_TIP', JSON.stringify(mailInfo))
  }
  store.commit('closeEmailTip')
}

const router = useRouter()

const handleConfirm = () => {
  close()
  // 与 personalCenter 一致用 history.state 传参；绑定页消费后清除，避免 sessionStorage 跨次导航残留
  router.push({
    name: 'personalCenter',
    state: { comp: 1, openBindEmail: true }
  })
}
</script>
<style scoped lang="scss">
.email-tip {
  position: absolute;
  width: 484px;
  height: 551px;
  top: 120px;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  border-radius: 8px;
  z-index: 999;
  overflow: hidden;

  .image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .close {
    position: absolute;
    top: 30px;
    right: 5px;
    z-index: 2;
    width: 38px;
    height: 38px;
    cursor: pointer;
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    box-sizing: border-box;
    padding: 0 36px 20px;
    text-align: center;
    background: transparent;
    pointer-events: none;

    .button,
    .remark {
      pointer-events: auto;
    }

    .button {
      display: block;
      width: auto;
      max-width: 300px;
      height: auto;
      margin: 0 auto 14px;
      cursor: pointer;
      user-select: none;
    }

    .remark {
      display: flex;
      justify-content: center;
      align-items: center;
      width: fit-content;
      max-width: 100%;
      margin: 0 auto;
      padding: 6px 8px;
      font-size: 16px;
      line-height: 1.4;
      color: rgba($color: #ffffff, $alpha: 0.92);
      cursor: pointer;
      img,
      .circle,
      .remark-check {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        margin-right: 8px;
        flex-shrink: 0;

        &.circle {
          border: 2px solid rgba($color: #ffffff, $alpha: 0.75);
        }
      }
    }
  }
}
</style>
