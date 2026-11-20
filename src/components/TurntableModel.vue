<template>
  <div v-if="showDialog" class="dialog-turn-table">
    <div v-show="!showRuleTip" :class="`lp-bg ${showDialog ? 'move-in' : ''}`">
      <a class="close-btn" @click="closeDialog"></a>
      <div class="lb-top">
        <div class="lb-top-1"></div>
      </div>
      <!-- 按钮 -->
      <div v-show="step === 'first'" class="lp-zp-btn"></div>
      <!-- 抽奖内容列表 -->
      <div v-if="step === 'first'" class="lp-zp-bg" ref="prizeWrap">
        <!-- 奖品列表 -->
        <div class="prize-list">
          <div
            class="prize-item"
            v-for="(item, index) in prizeList"
            :style="prizeStyle(index)"
            :key="index"
          >
            <img :src="item.award_img" @click="showGoodsMsg(item)" :alt="item.award_desc" />
          </div>
        </div>
      </div>
      <!-- 已抽奖 -->
      <div v-else class="lp-zp-bg lp-zp-bg-done flex flex-center">
        <!-- 中奖图片 -->
        <img :src="prizeImg" :alt="prizeObj.award_desc" />
      </div>
      <div class="lp-bottom">
        <div class="top flex flex-end">
          <span>i</span>
          <a @click="showRule"> 活动规则 </a>
        </div>

        <div class="bottom">
          <!-- 抽奖前 -->
          <template v-if="step === 'first'">
            <div class="txt">
              抽奖次数：<span class="num">{{ turnTableNum }}次</span>
            </div>
            <div class="btn" @click="openTurntableAc">开始抽奖</div>
          </template>
          <!-- 已抽奖-->
          <template v-else>
            <div class="sec-all">
              <div class="zj-txt">恭喜抽中 {{ prizeObj.award_desc }} 大奖</div>
              <div class="txt">
                抽奖次数：<span class="num">{{ turnTableNum }}次</span>
              </div>
              <div class="txt-tip">
                我们已经把您的中奖资讯记录下来，请联系小助理，确认中奖记录后进行后续派送礼物发放流程
              </div>
              <div class="btn-com flex flex-around">
                <div class="btn" @click="step = 'first'">再抽一次</div>
                <div class="btn btn-confirm" @click="closeDialog">确认</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 规则 -->
    <div v-show="showRuleTip" class="lp-bg gz-content">
      <div class="gz-top">
        <i class="el-icon-back" @click="showRuleTip = false"></i>
      </div>
      <div class="gz-txt">
        <div class="title"><span>1【活动对象】</span> 仅限小𝟵直播用户参与；</div>
        <div class="title"><span>2【活动时间】</span> 每月9日、19日、29日；</div>
        <div class="title">
          <span>3【活动奖励】</span>
          <p>A、抽到彩金红包请主动联系小𝟵直播助理添加到体育中心钱包，3倍流水可提款；</p>
          <p>
            B、实物奖励：抽到实物奖励后，请主动联系小𝟵直播助理并提交收货地址，提交成功后，会
            在7~10个工作日内安排邮寄，成功邮寄后会有短信通知，请耐心等候短信提示即可；
            小𝟵直播赠送的实物奖励，均为市场高端正品，实物奖品领取有效期为：一周，逾期视为自动放弃，不支持兑现现金；
          </p>
          <p>
            C 此优惠只适用于拥有一个账号玩家；
            每户、每一住址、每一电子邮箱地址、每一号码、相同支付方式及IP地址只享受一次；
          </p>
          <p>D 避免文字理解差异，小𝟵直播将保留对该活动的最终解释权。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { openTurntable } from '../api/user.js'
export default {
  name: 'TurntableModel',
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    prizeList: {
      type: Array
    },
    // 剩余抽奖次数
    turnTableNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      step: 'first', // first, second
      showRuleTip: false, // 规则
      // prizeList: [
      //   {act_id: 21, award_id: 1, award_desc: "奖品A", win_rate: 10, win_qty: 10, remain_qty: 8,award_img: '/static/images/grade-1.png'},
      //   {act_id: 22, award_id: 2, award_desc: "奖品b", win_rate: 10, win_qty: 10, remain_qty: 8,award_img: '/static/images/grade-2.png'},
      //   {act_id: 23, award_id: 3, award_desc: "奖品c", win_rate: 10, win_qty: 10, remain_qty: 8,award_img: '/static/images/grade-3.png'},
      //   {act_id: 24, award_id: 4, award_desc: "奖品d", win_rate: 10, win_qty: 10, remain_qty: 8,award_img: '/static/images/grade-4.png'},
      //   {act_id: 25, award_id: 5, award_desc: "奖品e", win_rate: 10, win_qty: 10, remain_qty: 8,award_img: '/static/images/grade-5.png'},
      //   {act_id: 26, award_id: 6, award_desc: "奖品e", win_rate: 10, win_qty: 10, remain_qty: 8,award_img: '/static/images/grade-6.png'},
      // ],
      isRunning: false, // 是否正在抽奖
      baseRunAngle: 360 * 6, // 总共转动角度 至少 6 圈
      prizeObj: {}, // 中奖数据
      prizeId: 0, // 中奖id
      prizeIndex: 0, // 中奖奖品 index
      prizeImg: 0 // 中奖 图片
    }
  },
  computed: {
    // 平均每个奖品角度
    rotateAngle() {
      const _degree = 360 / this.prizeList.length
      return _degree
    },
    // 要执行总角度数
    totalRunAngle() {
      return this.baseRunAngle + 360 - this.prizeIndex * this.rotateAngle - this.rotateAngle / 2
    },
    // 每个奖品布局
    prizeStyle() {
      const _degree = this.rotateAngle
      return (i) => {
        return `
                    width: ${2 * 230 * Math.sin(((_degree / 2) * Math.PI) / 180)}px;
                    height: 230px;
                    transform: rotate(${_degree * i + _degree / 2}deg);
                    transform-origin: 50% 100%;
                  `
      }
    }
  },
  mounted() {
    // console.log(this.prizeList)
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.step = 'first' // 重置
      this.$emit('showTurnTableAc')
    },
    // 显示活动规则
    showRule() {
      this.showRuleTip = true
    },
    // 显示商品信息
    showGoodsMsg(data) {
      this.$alert(`<p>${data.award_desc}</p><p>限量${data.remain_qty}台</p>`, '提示', {
        dangerouslyUseHTMLString: true
      })
    },
    // 抽奖按钮
    async openTurntableAc() {
      if (this.turnTableNum === 0) {
        this.$message.error('剩余抽奖次数不足')
        return false
      }
      if (!this.isRunning) {
        this.isRunning = true
        const params = {
          act_id: this.prizeList[0].act_id // 活动 id
        }
        // console.log('开始抽奖，后台请求中奖奖品')
        // 请求返回的奖品编号 这里使用随机数
        const res = await openTurntable(params)
        // console.log(res)
        if (res.code === 0) {
          this.prizeObj = res.data
          this.prizeId = this.prizeObj.award_id
          this.prizeImg = this.prizeList.filter(
            (item) => item.award_id === this.prizeId
          )[0].award_img
          this.prizeIndex = this.prizeList.findIndex((item) => item.award_id === this.prizeId)
          // console.log(this.prizeIndex)
          this.startRun()
          this.$emit('getTurntableNumAc') // 更新抽奖次数
        } else {
          this.$message.error(res.msg)
        }
      }
    },
    startRun() {
      // console.log(this.isRunning, this.totalRunAngle)
      // 设置动效  ${bgColor.value}
      this.$refs.prizeWrap.style = `
            transform: rotate(${this.totalRunAngle}deg);
            transition: all 4s ease;
          `
      // 监听transition动效停止事件
      this.$refs.prizeWrap.addEventListener('transitionend', this.stopRun)
    },
    // 抽奖结束
    stopRun(e) {
      // console.log(e)
      this.isRunning = false // 停止抽奖后重置
      this.step = 'second'
      // this.$message.success(this.prizeObj.award_desc);
      /*  ${bgColor.value} */
      this.$refs.prizeWrap.style = `
            transform: rotate(${this.totalRunAngle - this.baseRunAngle}deg);
          `
    },
    beforeUnmount() {
      this.$refs.prizeWrap.removeEventListener('transitionend', this.stopRun)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-turn-table {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  .lp-bg {
    position: absolute;
    width: 640px;
    height: 670px;
    background: url('/static/images/turntable/lp-bg.png');
    background-size: 100%;
    //transform: translate(-50%, -50%);
    margin: -375px -320px;
    left: 50%;
    top: 50%;
    border-radius: 30px;
    transform: scale(0.9);

    .close-btn {
      position: absolute;
      z-index: 20;
      top: 0;
      right: 0;
      width: 30px;
      height: 30px;
      background: url('/static/images/turntable/clost-btn.png');
      background-size: 100%;
    }
    .lb-top {
      width: 640px;
      height: 500px;
      //background: url('/static/images/turntable/zp-bg.png') center;
      background: url('/static/images/turntable/zp-bg-b.png') center;
      background-size: 100%;
      position: absolute;
      z-index: 10;
      .lb-top-1 {
        width: 100%;
        height: 100%;
        background: url('/static/images/turntable/zp-bg-t.png') center;
        background-size: 100%;
        animation: rotate 6s infinite;
      }
    }
    .lp-zp-btn {
      position: absolute;
      z-index: 15;
      width: 100px;
      height: 120px;
      top: 175px;
      left: 270px;
      background: url('/static/images/turntable/zp-btn.png') center;
      background-size: 100%;
    }
    .lp-zp-bg {
      position: relative;
      z-index: 12;
      margin: 20px auto 10px;
      width: 455px;
      height: 460px;
      background: url('/static/images/turntable/zp.png') center no-repeat;
      background-size: 100%;
      .prize-list {
        position: absolute;
        width: 460px;
        height: 460px;
        border-radius: 50%;
        overflow: hidden;
        margin: 10px 0 0 0;

        .prize-item {
          position: absolute;
          left: 0;
          right: 0;
          top: -10px;
          margin: auto;
          img {
            cursor: pointer;
            width: 110px;
            /*height: 110px;*/
            margin: 20px auto 10px;
            display: block;
          }
        }
      }
    }
    .lp-zp-bg-done {
      background-image: url('/static/images/turntable/done-bg.png');
      background-size: 94.5%;
      position: relative;
      z-index: 11;
      width: 480px;
      height: 480px;
      margin: 10px auto;
      transform: rotate(0deg) !important;
      img {
        width: 290px;
        margin: 0;
      }
    }
    .lp-bottom {
      text-align: center;
      position: relative;
      z-index: 11;
      .top {
        position: absolute;
        width: 100%;
        top: -25px;
        padding: 0 30px;
        color: #3e3730;
        font-size: 14px;
        transition: 0.3s;
        &:hover {
          opacity: 0.8;
        }
        span {
          margin-right: 5px;
          height: 20px;
          line-height: 20px;
          width: 20px;
          background: #3e3730;
          color: #fff;
          border-radius: 50%;
        }
      }
      .bottom {
        .txt {
          font-size: 40px;
          margin: 0 0 5px;
          padding-top: 25px;
          .num {
            color: #c61d48;
          }
        }
        .btn {
          cursor: pointer;
          width: 250px;
          height: 60px;
          line-height: 60px;
          background-image: linear-gradient(180deg, #ce2e08 0%, #861400 100%);
          font-size: 30px;
          color: #fff;
          margin: 0 auto;
          border-radius: 10px;
          text-align: center;
          transition: 0.3s;
          &:hover {
            opacity: 0.9;
          }
        }
        .sec-all {
          .zj-txt {
            font-size: 30px;
            color: #3b5bca;
          }
          .txt {
            font-size: 25px;
            margin: 0;
            padding: 0;
          }
          .txt-tip {
            padding: 0 88px;
            font-size: 15px;
            color: #4c4e60;
            margin-bottom: 5px;
          }
          .btn-com {
            padding: 0 80px;
            .btn {
              width: 220px;
            }
            .btn-confirm {
              background-image: linear-gradient(180deg, #e6a91f 0%, #835a00 100%);
            }
          }
        }
      }
    }
  }
  .gz-content {
    padding: 25px;
    background: #fff;
    font-size: 14px;
    .gz-top {
      height: 40px;
      i {
        font-size: 30px;
        color: #ddd;
        cursor: pointer;
      }
    }
    .gz-txt {
      height: 548px;
      overflow-y: auto;
      .title {
        margin: 15px;
        line-height: 25px;
        span {
          color: #c61d48;
        }
      }
    }
  }
  .move-in {
    animation-name: antNoWrapperZoomBadgeIn;
    animation-duration: 0.1s;
    animation-timing-function: linear;
  }
}
</style>
