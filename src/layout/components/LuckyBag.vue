<template>
  <div class="lucky-bag-box">
    <div class="content-box">
      <p>{{ luckyData.amount }} 金币</p>
    </div>
    <span
      >限时红包，定时清零<br />
      请及时找助理兑换
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    // 红包配置项，数组为空没有开启红包活动，不显示福袋，红包活动开启，is_redbag数据必定有数据
    luckyData() {
      return this.$store.state.luckyBagData
    }
  }
}
</script>

<style lang="scss" scoped>
.lucky-bag-box {
  z-index: 999;
  position: fixed;
  right: 5px;
  bottom: 190px;
  text-align: center;
  .content-box {
    width: 160px;
    height: 150px;
    overflow: hidden;
    background: red;
    background: url(/static/images/envelope/redbag-bg.png) no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    p {
      color: #fff;
      font-size: 14px;
      font-family: PingFang SC;
      margin-bottom: 3px;
    }
  }

  span {
    color: #bcbcbc;
    font-size: 12px;
    font-family: PingFang SC;
  }
}
</style>
