<template>
  <div class="bigBg">
    <el-image class="image-anchor" src="/static/images/spaceAndMine/becomeAnchor.png" @click="pageToMyMsg"></el-image>
    <div class="title">报名途径</div>
    <el-text class="text font-sc">可以通过留言板，选择主播应聘留下您的方式哦!</el-text>
    <div class="borderLine">
      <div class="title">希望您</div>
      <span class="gridInblock">
        <el-image class="image-header" src="/static/images/spaceAndMine/wish1.png"></el-image>
        <el-text class="paddingRight font-sc">热爱体育，足球，篮球等运动项目皆可</el-text>
        <div class="inlineLine"></div>
        <el-image class="image-header" src="/static/images/spaceAndMine/wish2.png"></el-image>
        <el-text class="paddingRight font-sc">熟悉相关项目规划和使用相关直播工具</el-text>
        <div class="inlineLine"></div>
        <el-image class="image-header" src="/static/images/spaceAndMine/wish3.png"></el-image>
        <el-text class="paddingRight font-sc">善于调动直播气氛着，热情和球迷互动</el-text>
      </span>
    </div>
    <div class="title">小9五大优势</div>
    <div class="gridBottom">
      <div class="dot" style="background-color: #c83354;"></div>
      <el-text class="font-sc">专业大平台，小9体育拥有丰厚的直播赛事版权，海量观众期待你的表演，直播收益不用愁！</el-text>
      <div class="dot" style="background-color: #5780f4;"></div>
      <el-text class="font-sc">草根变明星，完善的主播成长体系，丰富的赛事圈资源百万级别的流量助你成为明日之星！</el-text>
      <div class="dot" style="background-color: #61b061;"></div>
      <el-text class="font-sc">欢乐玩法多，狂热的弹幕筑围墙，百万球迷宠灞，直播不寂寞，快乐，收益，朋友一个都不能少！</el-text>
      <div class="dot" style="background-color: #6c21ea;"></div>
      <el-text class="font-sc">薪美一切美，丰厚的固定底薪+场次底薪+高额的礼物分成，加入小9大家庭一起变美吧！</el-text>
      <div class="dot" style="background-color: #f7b264;"></div>
      <el-text class="font-sc">专业且稳定，专业的赛事直播玩法，大力扶持主播，团队不忘初心，与你见证每一位主播的成功!</el-text>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const pageToMyMsg = () => $router.push({
  name: 'mySpace',
  state: {comp: 7}
})
</script>

<style scoped lang="scss">
  .bigBg {
    text-align: center;
    background: url('/static/images/spaceAndMine/anchorPoster.jpg') no-repeat;
    background-origin: 0;
    background-size: 101% auto;
    .font-sc {
      font-size: 24px;
      color: #666;
    }
    .image-anchor {
      width: 435px;
      margin-top: 857px;
      margin-bottom: 46px;
      cursor: pointer;
    }
    .title {
      font-size: 32px;
      height: 45px;
      color: #333;
      font-weight: 400;
      margin-bottom: 16px;
    }
    .text {
      color: #666;
    }
    .borderLine {
      border: 1px solid #f4f4f4;
      border-width: 1px 0;
      padding-bottom: 20px;
      margin-top: 33px;
      .gridInblock {
        width: 540px;
        margin: 0 auto;
        display: grid;
        text-align: left;
        grid-template-columns: 48px 1fr;
        gap: 16px 24px;
        .image-header {
          width: 48px;
          vertical-align: middle;
          margin-left: 24px;
        }
        .paddingRight {
          margin-right: 24px;
        }
        .inlineLine {
          width: 100%;
          grid-column: span 2;
          border-bottom: 1px solid #f4f4f4;
        }
      }
    }
    .gridBottom {
      width: 900px;
      margin: 0 auto 300px auto;
      display: grid;
      text-align: left;
      grid-template-columns: 8px 1fr;
      gap: 16px 26px;
      align-items: center;
      .dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
      }
    }
  }
</style>