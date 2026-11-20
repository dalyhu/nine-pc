<template>
  <div class="error">
    <img src="/static/images/is-error.png" alt="" />
    <div class="desc">
      此服务目前维护中
    </div>
    <div class="btn" @click="goHome">点击导航至首页</div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const HOME_PATH = '/main'

const router = useRouter()

const handleRefresh = () => {
  window.location.reload()
}

const goHome = () => {
  router.replace(HOME_PATH)
}
</script>

<style scoped lang="scss">
.error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 80px;
  gap: 14px;

  img {
    width: 160px;
    height: 160px;
  }

  .desc {
    font-size: 14px;
    color: #999;
  }

  .btn {
    width: 160px;
    height: 40px;
    margin: 16px auto 0;
    background-color: #333;
    color: #fff;
    font-size: 14px;
    line-height: 40px;
    text-align: center;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
  }
}
</style>
