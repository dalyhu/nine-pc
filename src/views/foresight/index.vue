<!-- 前瞻 -->
<template>
  <div class="foresight">
    <div class="left_person_bg"></div>
    <list></list>
    <div class="right_person_bg"></div>
  </div>
</template>

<script>
import list from './list.vue'
import mittBus from '@/utils/mittBus'

export default {
  components: { list },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.foresight {
  padding: 140px 0 100px 0;
  position: relative;
  box-sizing: border-box;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background-color: #171717;
  &::before {
    position: absolute;
    top: 0;
    width: 100%;
    left: 0;
    content: '';
    display: block;
    height: 40.833vw;
    background: url(/static/images/infoCenter/info-index-bg1.png) center top no-repeat;
    background-size: 116.875vw auto;
    z-index: 10;
  }
  &::after {
    position: absolute;
    top: 22vw;
    width: 100%;
    left: 0;
    content: '';
    display: block;
    height: 40.833vw;
    background: url(/static/images/infoCenter/info-index-bg2.png) center top no-repeat;
    background-size: 116.875vw auto;
    z-index: 30;
  }
  > div {
    position: relative;
    z-index: 40;
    width: 1200px;
    margin: 0 auto;
  }
  .left_person_bg {
    width: 18.125vw;
    height: 32.239vw;
    background: url(/static/images/infoCenter/info-index-left-person.png) center center no-repeat;
    background-size: contain;
    position: absolute;
    top: 6.789vw;
    transform: translateX(calc(-600px - 17.5vw));
    left: 50%;
    z-index: 20;
  }
  .right_person_bg {
    width: 26.145vw;
    height: 30.625vw;
    background: url(/static/images/infoCenter/info-index-right-person.png) center center no-repeat;
    background-size: contain;
    position: absolute;
    top: 8.143vw;
    transform: translateX(calc(600px - 6vw));
    left: 50%;
    z-index: 20;
  }
}
</style>
