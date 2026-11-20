<template>
  <div class="page-404">
    <img class="page-404__num" src="/static/images/404_number.jpg" alt="404" />
    <h1 class="page-404__title">{{ message }}</h1>
    <p class="page-404__desc">您访问的页面不存在或已下线，<br />回首页看看正在进行的精彩直播吧</p>
    <a href="/" class="page-404__home">返回首页</a>
  </div>
</template>

<script>
export default {
  name: 'Page404',
  computed: {
    message() {
      return '页面走丢了'
    }
  }
}
</script>

<style lang="scss" scoped>
// 风格与站点的 406「禁止访问」页一致：粉色背景 + 玻璃质感数字（数字图由 406 页的素材拼成「404」）
.page-404 {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f3f4f7 url('/static/images/404_bg.jpg') center / cover no-repeat;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;

  &__num {
    display: block;
    width: 600px;
    max-width: 60vw;
    // 数字图是白底 JPG，正片叠底让白底融进背景
    mix-blend-mode: multiply;
  }

  &__title {
    margin: 32px 0 12px;
    font-size: 28px;
    font-weight: 700;
    color: #333;
    letter-spacing: 2px;
  }

  &__desc {
    margin: 0;
    font-size: 16px;
    line-height: 1.7;
    color: #999;
    text-align: center;
  }

  &__home {
    margin-top: 32px;
    padding: 0 40px;
    height: 44px;
    line-height: 44px;
    border-radius: 22px;
    background: linear-gradient(135deg, #ff4d76, #d02d54);
    box-shadow: 0 6px 16px rgba(208, 45, 84, 0.3);
    color: #fff;
    font-size: 16px;
    letter-spacing: 1px;
    text-decoration: none;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
