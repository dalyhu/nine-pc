<!-- 我的等级 -->
<template>
  <div class="i-tabs-container">
    <div class="header-nav">
      <!--      <a href="/personal/grade?choose=0">-->
      <div class="item first-item">财富等级</div>
      <!--			</a>-->
    </div>
    <div class="tab-pane-item" name="财富等级" style="padding-left: 35px; height: 575px">
      <div class="grade-wealth-level-container">
        <div class="grade-user-name">{{ infos.user_nickname }}</div>
        <div class="grade-user-level">财富等级：L{{ infos.exp }}</div>
        <div class="grade-tips">
          您当前等级为L{{ infos.exp
          }}<span v-if="maxLevel > parseInt(infos.exp)"
            >, 再获得{{ infos.difference }}经验值即可升为L{{ parseInt(infos.exp) + 1 }}</span
          >
          <div class="icon_tishi" style="display: flex">
            <img
              src="data:image/png;base64,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"
              style="max-width: 100%"
            />
            <div class="hoverText" style="top: -50px; left: 20px">
              <div>在直播间消费钻石可获得财富经验值<br />10钻石=1财富经验值 , 最小单位为0.1</div>
            </div>
          </div>
        </div>
        <div class="grade-list">
          <div class="grade-list-item" v-for="it in maxLevel" :key="it">
            <template v-if="it < maxLevel">
              {{ getGradeText(it) }}
            </template>
          </div>
        </div>
        <nav>
          <div class="navTitle">如何快速提升？</div>
          <img
            src="data:image/png;base64,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"
            style="width: 50px"
          />
          <div class="line"></div>
        </nav>
        <section class="grade-directions" style="justify-content: flex-start">
          <!-- <div class="content">
						<div class="contImg"><img
								src="/static/images/grade-2.png" >
						</div>
						<div class="contText"><span class="contTextTitle">赠送礼物</span><span class="contTextContent">狂刷礼物
								嗨飙经验</span></div>
					</div> -->
          <!-- <div class="content">
						<div class="contImg"><img
								src="/static/images/grade-1.png" >
						</div>
						<div class="contText"><span class="contTextTitle">充值钻石</span><span class="contTextContent">充值不停
								快感不止</span></div>
					</div> -->
          <!-- <div class="content">
						<div class="contImg"><img
								src="/static/images/grade-3.png"
								></div>
						<div class="contText"><span class="contTextTitle">购买贵族</span><span class="contTextContent">贵族尊享
								经验加倍</span></div>
					</div> -->
          <!-- <div class="content">
						<div class="contImg"><img
								src="/static/images/grade-4.png" >
						</div>
						<div class="contText"><span class="contTextTitle">贵族礼物</span><span class="contTextContent">钻石礼物
								增值经验</span></div>
					</div> -->
          <!-- <div class="content">
						<div class="contImg"><img
								src="/static/images/grade-5.png" >
						</div>
						<div class="contText"><span class="contTextTitle">购买定制礼物</span><span
								class="contTextContent">贵族专属 无与伦比</span></div>
					</div> -->
          <!-- <div class="content">
						<div class="contImg"><img
								src="/static/images/grade-6.png"
								></div>
						<div class="contText"><span class="contTextTitle">赠送定制礼物</span><span
								class="contTextContent">拉风炫酷 闪亮全场</span></div>
					</div> -->
          <div class="content">
            <div class="contImg">
              <img src="/static/images/grade-7.png" />
            </div>
            <div class="contText">
              <span class="contTextTitle">每日签到</span>
              <span class="contTextContent">每日签到成功即可获得10经验值</span>
            </div>
          </div>
          <!-- <div class="content">
						<div class="contImg">
							<img src="/static/images/grade-8.png" >
						</div>
						<div class="contText">
							<span class="contTextTitle">分享链接</span>
							<span class="contTextContent">每次分享得5经验值, 每日上限为20经验值</span>
						</div>
					</div> -->
          <div class="content">
            <div class="contImg">
              <img src="/static/images/grade-6.png" />
            </div>
            <div class="contText">
              <span class="contTextTitle">每日任务</span>
              <span class="contTextContent">完成每日任务, 获取大量经验值</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { getLevelList } from '../../api/common.js'
export default {
  data() {
    return {
      levelList: []
    }
  },
  computed: {
    infos() {
      return this.$store.state.user.infoData
    },
    maxLevel() {
      let result = 0
      if (this.levelList.length > 0) {
        result = this.levelList.length
      }
      return result
    }
  },
  created() {
    this.getLevelList()
  },
  methods: {
    // 取得等級表
    getLevelList() {
      getLevelList().then((res) => {
        this.levelList = res.data
      })
    },
    // 返回等級所需經驗文字
    getGradeText(it) {
      let string = ''
      if (this.levelList.length > 0) {
        string += `L${it} - L${it + 1}需经验值${this.levelList[it - 1].level_up}`
      }
      return string
    }
  }
}
</script>

<style lang="scss" scoped>
.grade-wealth-level-container {
  max-height: 648px;
}

.grade-wealth-level-container header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 75px;
  width: 100%;
  height: 67px;
}

.grade-wealth-level-container header #vip {
  display: flex;
  align-items: center;
  width: 100%;
}

.grade-wealth-level-container header #vip .vip {
  width: 120px;
}

.grade-wealth-level-container header #vip .bgDiv {
  width: 616px;
  height: 12px;
  border-radius: 6px;
  position: relative;
  background-color: #fff5e9;
  margin: 0 12px;
}

.grade-wealth-level-container header #vip .bgDiv .process-container {
  width: 100%;
  height: 12px;
  position: absolute;
  top: 0;
  left: 0;
}

.grade-wealth-level-container header #vip .bgDiv .process-container .current-process-box {
  display: flex;
}

.grade-wealth-level-container
  header
  #vip
  .bgDiv
  .process-container
  .current-process-box
  .current-process {
  width: 50px;
  height: 12px;
  position: relative;
  border-radius: 6px 0 0 6px;
  transition: width 3.5s ease-in-out;
  background-image: linear-gradient(270deg, #e3ac72, #ffd1a1 50%);
}

.grade-wealth-level-container
  header
  #vip
  .bgDiv
  .process-container
  .current-process-box
  .current-process:before {
  content: '';
  width: 100%;
  height: 12px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.53;
  background-size: cover;
}

.grade-wealth-level-container
  header
  #vip
  .bgDiv
  .process-container
  .current-process-box
  .current-process-stop {
  height: 12px;
  position: relative;
  display: flex;
  align-items: center;
}

.grade-wealth-level-container
  header
  #vip
  .bgDiv
  .process-container
  .current-process-box
  .current-process-stop
  .current-process-num {
  font-size: 11px;
  text-align: center;
  color: #e3ac72;
  position: absolute;
  top: -24px;
  left: 10px;
}

.grade-wealth-level-container
  header
  #vip
  .bgDiv
  .process-container
  .current-process-box
  .current-process-stop
  .current-process-arrow {
  height: 24px;
}

.grade-wealth-level-container
  header
  #vip
  .bgDiv
  .process-container
  .current-process-box
  .current-process-stop
  .current-process-gif {
  height: 20px;
  position: absolute;
  left: 0;
  top: -4px;
}

.grade-wealth-level-container header .process-text {
  color: #999;
  font-size: 14px;
  text-align: center;
}

.grade-wealth-level-container aside,
.grade-wealth-level-container nav {
  display: flex;
  align-items: center;
  height: 38px;
  margin: 70px 0 0 10px;
}

.grade-wealth-level-container aside .navTitle,
.grade-wealth-level-container nav .navTitle {
  width: 120px;
  height: 38px;
  font-size: 16px;
  color: #b08a5b;
  border: 1px solid #d8ad66;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
}

.grade-wealth-level-container aside .line,
.grade-wealth-level-container nav .line {
  border-top: 1px solid #d8ad66;
  margin-left: -2px;
  width: 710px;
}

.grade-wealth-level-container section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-left: 10px;
}

.grade-wealth-level-container section .content {
  display: flex;
  height: 68px;
  width: 30%;
  margin-top: 30px;
}

.grade-wealth-level-container section .content .contImg {
  width: 68px;
  height: 68px;
  border: 1px solid #d8ad66;
  border-radius: 68px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.grade-wealth-level-container section .content .contImg img {
  width: 35px;
  height: auto;
}

.grade-wealth-level-container section .content .contText {
  margin: 5px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}

.grade-wealth-level-container section .content .contText .contTextTitle {
  color: #333;
  font-size: 16px;
}

.grade-wealth-level-container section .content .contText .contTextContent {
  color: #999;
  font-size: 14px;
}
.grade-wealth-level-container {
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
  }
}
.grade-user-name {
  margin-top: 20px;
  font-size: 24px;
  color: #80643e;
}
.grade-user-level,
.grade-tips {
  margin-top: 20px;
  display: flex;
  color: #80643e;
}
.grade-list {
  display: flex;
  flex-wrap: wrap;
  margin-right: 35px;
  margin-top: 20px;
  padding: 20px;
  border-radius: 10px;
  background: #fffbf8;
}
.grade-list-item {
  width: 25%;
  text-align: left;
  color: #80643e;
}
.grade-directions .content {
  width: 100%;
}
</style>
