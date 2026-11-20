<template>
  <div class="dailyMission-box">
    <div class="dailyMission-main">
      <div
        class="sign-box"
        v-for="it in missionList.filter((it) => it.code === 'checkin')"
        :key="it.id"
      >
        <div class="sign-text-le">
          <img :src="it.icon" />
          <p>{{ it.description }}</p>
        </div>
        <div class="sign-amount-ri">
          <div class="masonry-text">
            <span>我的钻石余额</span>
            <div class="btn-sign-box" @click="handleSignIn(0, it)">点击签到</div>
          </div>
          <div class="masonry-box">{{ is_login ? amount : 0 }}</div>
        </div>
      </div>
    </div>
    <div class="dailyMission-footer">
      <div
        class="task-list"
        v-for="it in missionList.filter((it) => it.code !== 'checkin')"
        :key="it.id"
      >
        <div class="list-le">
          <img :src="it.icon" />
          <div>
            <p>{{ it.name }}</p>
            <span> {{ it.description }}</span>
          </div>
        </div>
        <div class="list-ri">
          <div v-if="it.user.progress_status === 2" class="btn-box" @click="handleReceiveAward(it)">
            {{ it.user.progress_str }}
          </div>
          <div v-else :class="['btn-box', 'btn-box-status']">{{ it.user.progress_str }}</div>
        </div>
      </div>
    </div>
    <!-- 签到弹框 -->
    <div class="dialyCalendar" v-if="showCalendar">
      <div class="dialyCalendarTop">
        <div class="dialyCalendarTopTitle">
          <div>签到</div>
          <div class="closeButton" @click="showCalendar = false">
            <el-icon size="22">
              <Close />
            </el-icon>
          </div>
        </div>
        <div class="dialyCalendarTopHead">
          <img class="buttonLeft" src="/static/images/daily/right.png" @click="lastMonth()" />
          <div>{{ year }}年{{ month }}月</div>
          <img class="buttonRight" src="/static/images/daily/right.png" @click="nextMonth()" />
        </div>
      </div>
      <div class="dialyCalendarCenter">
        <div class="dialyCalendarWeek">
          <div class="weekItem">日</div>
          <div class="weekItem">一</div>
          <div class="weekItem">二</div>
          <div class="weekItem">三</div>
          <div class="weekItem">四</div>
          <div class="weekItem">五</div>
          <div class="weekItem">六</div>
        </div>
        <div class="dialyCalendarDays">
          <div class="dayItem" v-for="(it, index) in days" :key="index">
            <div
              class="dayItemText"
              :class="{
                isSignedIn: signedInNum.indexOf(it) !== -1,
                isSelected: selectDateNum === it
              }"
              @click="selectDate(it)"
            >
              {{ it }}
            </div>
          </div>
        </div>
      </div>
      <div class="dialyCalendarBottom">
        <!-- <div class="tips">连续打卡签到30天即可抽取世界杯门票</div> -->
        <div class="tipsMini">
          小提示: 选中日期点击补签即可成功补签<br />
          补签需花費50钻石, 每月补签次数上限為3次。
        </div>
        <div class="remainingTimes">剩余次数: {{ amended }}次</div>
        <div
          :class="['signInButton', { 'signInButton-disabled': amended <= 0 }]"
          @click="handleSignIn(1)"
        >
          补签
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Close } from '@element-plus/icons-vue'
</script>

<script>
import { getMission, getSignInRecord, getAmendedService, signIn, receiveAward } from '../../api/user.js'

export default {
  name: 'DailyMission',
  data() {
    return {
      showCalendar: false,
      year: null,
      month: null,
      days: [],
      daynum: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      selectDateNum: null, // 選中號碼
      signedInMap: {}, // 簽到表
      amended: 0, // 剩餘補簽次數
      missionList: [],
      isTodaySignIn: false, // 今天有簽到過
      once: true
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.infoData
    },
    amount() {
      return this.$common.money(this.userInfo.balances, 0)
    },
    is_login() {
      return !!this.userInfo.id
    },
    userId() {
      return this.userInfo.id
    },
    signedInNum() {
      let result = []
      if (this.signedInMap[this.year]) {
        if (this.signedInMap[this.year][this.month]) {
          result = this.signedInMap[this.year][this.month]
        }
      }
      return result
    }
  },
  watch: {
    // 只在登录态变化时刷新任务列表；签到记录/补签次数留到弹窗打开时再拉
    userId(newId, oldId) {
      if (newId && newId !== oldId) {
        this.initCalendar()
        this.getMission()
      }
    }
  },
  created() {
    this.initCalendar() // 初始化日历
    this.getMission() // 获取任务列表（内含今日签到状态，供主页判断使用）
    // 签到记录、补签次数仅在弹窗打开与签到/补签成功后拉取
  },
  methods: {
    /**
     * progress_status：0待完成 1倒计时 2领取奖励 3已领取
     *
     * */
    // 初始日历到表
    initCalendar() {
      let now = new Date()
      this.year = now.getFullYear()
      this.month = now.getMonth() + 1
      this.checkYear()
      this.checkMonth()
    },
    // 顯示簽到表
    showCalendarClick() {
      this.initCalendar()
      this.selectDateNum = null
      this.showCalendar = true
      this.getSignInRecord() // 打开签到弹窗时刷新已签到日期
      this.getAmended() // 打开签到弹窗时刷新补签剩余次数
    },
    // 判斷平年閏年
    checkYear() {
      let year = this.year
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        this.daynum[1] = 29
      } else {
        this.daynum[1] = 28
      }
    },
    // 判斷當月多少天
    checkMonth() {
      let length = this.daynum[this.month - 1]
      this.days.splice(0) // 清空
      for (let i = 0; i < length; i++) {
        this.days.push(i + 1)
      }

      // 當月1號是星期幾
      let times = new Date(this.year, this.month - 1, 1).getDay()
      for (let f = 0; f < times; f++) {
        this.days.unshift(' ')
      }
    },
    // 上個月
    lastMonth() {
      if (this.month == 1) {
        this.month = 12
        this.year--
        this.checkYear()
      } else {
        this.month--
      }
      this.checkMonth()
      this.selectDateNum = null
    },
    // 下個月
    nextMonth() {
      if (this.month == 12) {
        this.month = 1
        this.year++
        this.checkYear()
      } else {
        this.month++
      }
      this.checkMonth()
      this.selectDateNum = null
    },
    // 選擇日期
    selectDate(it) {
      let now = new Date()
      let nowYear = now.getFullYear()
      let nowMonth = now.getMonth() + 1
      let nowDate = now.getDate()
      if (this.year != nowYear || this.month != nowMonth) {
        return
      }
      if (this.month === nowMonth && it > nowDate) {
        return
      }
      if (it === ' ') {
        return
      }
      if (this.selectDateNum === it) {
        this.selectDateNum = null
        return
      }
      if (this.signedInNum.indexOf(it) === -1) {
        this.selectDateNum = it
      }
    },
    // 获取任务列表
    getMission() {
      getMission().then((res) => {
        this.missionList = res.data

        let checkin_status = this.missionList.filter((it) => it.code === 'checkin')[0].user
          .progress_status
        if (checkin_status === 2 || checkin_status === 3) {
          this.isTodaySignIn = true
        }

        const flag = this.missionList.every((it) => it.user.progress_status === 3)
        if (flag && this.once) {
          this.once = false
          this.$message.success('您已完成了所有任务!')
        }
      })
    },
    // 获取签到记录
    getSignInRecord() {
      getSignInRecord().then((res) => {
        let record = res.data.map((it) => it.date)
        let signedInMap = {}
        for (let i = 0; i < record.length; i++) {
          let it = record[i]
          let y = parseInt(it.split('-')[0])
          let m = parseInt(it.split('-')[1])
          let d = parseInt(it.split('-')[2])
          if (signedInMap[y]) {
            if (signedInMap[y][m]) {
              if (signedInMap[y][m].indexOf(d) === -1) {
                signedInMap[y][m].push(d)
              }
            } else {
              signedInMap[y][m] = []
              signedInMap[y][m].push(d)
            }
          } else {
            signedInMap[y] = {}
            signedInMap[y][m] = []
            signedInMap[y][m].push(d)
          }
        }
        this.signedInMap = signedInMap
      })
    },
    // 获取补签次数
    getAmended() {
      getAmendedService()
        .then((res) => {
          // res.data = 當月補簽過次數
         
          this.amended = 3 - Number(res.data) < 0 ? 0 : 3 - Number(res.data)
        })
        .catch((res) => {
          this.amended = 0
        })
    },
    // 0: 签到, 1: 补签
    handleSignIn(type = 0, it) {
      if (!this.is_login) {
        this.$store.commit('user/SET_LOGIN_MASK', true)
        return
      }
      const data = {}
      if (type === 0) {
        this.showCalendarClick() // 内部已刷新签到记录与补签次数
        if (this.isTodaySignIn) {
          return
        }
      }
      if (type === 1) {
        if (this.amended <= 0) {
          return
        }
        if (this.selectDateNum === null) {
          return this.$message.error('尚未选择日期')
        }
        let balance = parseInt(this.userInfo.balances || 0)
        if (balance < 50) {
          return this.$message.error('钻石余额不足')
        }
        data['date'] = `${this.year}-${this.month}-${this.selectDateNum}`
      }
      signIn(data).then((res) => {
        if (res.code === 0) {
          this.getSignInRecord()
          this.$message.success(`${res.msg}`)
          if (type === 0) {
            // 签到
            this.handleReceiveAward(it) // 自动领取签到奖励
            this.isTodaySignIn = true
          }
          if (type === 1) {
            // 补签
            this.$store.dispatch('updateUserInfo')
            this.getAmended()
            this.selectDateNum = null
          }
        } else {
          this.$message.error(`${res.msg}`)
        }
      })
    },
    // 领取奖励
    handleReceiveAward(it) {
      if (!this.is_login) {
        return this.$message.error('请先登录')
      }
      let data = {
        code: it.code
      }
      receiveAward(data).then((res) => {
        if (res.code === 0) {
          this.$store.dispatch('updateUserInfo')
          this.getMission() // 领奖后刷新任务状态（progress_status 2 → 3），原先靠 deep watcher 触发，现改为显式调用
          if (it.code !== 'checkin') {
            this.$message.success(`${res.msg}`)
          }
        } else {
          this.$message.error(`${res.msg}`)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dailyMission-box {
  background-color: #13151e;
  height: 1310px;
  .dailyMission-main {
    width: 100%;
    height: 540px;
    background: url('/static/images/daily/bg-1219.webp') center no-repeat;
    background-size: cover;
    background-color: #13151e;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    .sign-box {
      width: 1200px;
      display: flex;
      background: rgba(231, 233, 231, 0.85);
      height: 104px;
      overflow: hidden;
      .sign-text-le {
        height: 104px;
        width: 800px;
        padding-left: 30px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        img {
          width: 74px;
          height: 70px;
          margin-right: 40px;
        }
        p {
          width: 680px;
          font-weight: 600;
          color: #333;
          letter-spacing: 2px;
        }
      }
      .sign-amount-ri {
        height: 104px;
        width: 400px;
        background: url('/static/images/daily/sign-in-bg.png') center no-repeat;
        background-size: 100.1% 101%;
        box-sizing: border-box;
        padding-left: 80px;
        .masonry-text {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          span {
            margin-top: 18px;
            color: #fff;
            font-size: 15px;
            font-weight: 200;
            letter-spacing: 1px;
          }
          .btn-sign-box {
            color: #fff;
            font-size: 16px;
            letter-spacing: 2px;
            cursor: pointer;
            background: #92203b;
            padding: 8px 22px;
            border-bottom-left-radius: 14px;
          }
        }
        .masonry-box {
          color: #f1e25d;
          font-size: 35px;
          font-weight: 600;
        }
      }
    }
  }
  .dailyMission-footer {
    background-color: #13151e;
    padding-top: 20px;
    .task-list {
      width: 1200px;
      margin: 0 auto;
      height: 104px;
      background: linear-gradient(to right, #231a1c 500px, #5e1627);
      margin-bottom: 20px;
      display: flex;
      .list-le {
        width: 1070px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding-left: 30px;
        img {
          width: 74px;
          height: 70px;
          margin-right: 40px;
        }
        p {
          color: #fff;
          font-weight: 600;
          margin-bottom: 10px;
          letter-spacing: 2px;
          white-space: nowrap;
        }
        span {
          color: #999;
          font-weight: 500;
          letter-spacing: 2px;
        }
      }
      .list-ri {
        display: flex;
        align-items: center;
        .btn-box {
          width: 114px;
          text-align: center;
          padding: 10px 0;
          letter-spacing: 2px;
          background: #d02d54;
          color: #fff;
          font-size: 12px;
          cursor: pointer;
        }
        .btn-box-status {
          color: #fe98b1;
        }
      }
    }
  }
  // 签到弹框样式
  .dialyCalendar {
    width: 80%;
    max-width: 400px;
    position: fixed;
    top: 20vh;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 20px;
    box-shadow: 0px 4px 12px rgba(51, 51, 51, 0.2);
    z-index: 9999;
    .dialyCalendarTop {
      background-color: #13151e;
      border-radius: 20px 20px 0 0;
      color: #fff;
      .dialyCalendarTopTitle {
        position: relative;
        padding: 8px 8px 4px;
        text-align: center;
        font-size: 18px;
        .closeButton {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 24px;
          cursor: pointer;
        }
      }
      .dialyCalendarTopHead {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 0;
        font-size: 16px;
        .dialyCalendarHeadButton {
          width: 40px;
          height: 40px;
          color: #fff;
        }
        img {
          width: 25px;
          height: 25px;
        }
        .buttonLeft {
          margin-right: 20px;
          margin-left: auto;
          cursor: pointer;
        }
        .buttonRight {
          margin-right: auto;
          margin-left: 20px;
          cursor: pointer;
          transform: rotate(180deg);
        }
      }
    }
    .dialyCalendarCenter {
      padding: 0 16px;
      background-color: #13151e;
      .dialyCalendarWeek {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px 0;
        .weekItem {
          flex: 1;
          text-align: center;
          font-size: 18px;
          color: #8a8b88;
          font-weight: bold;
        }
      }
      .dialyCalendarDays {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        .dayItem {
          display: flex;
          align-items: center;
          justify-content: center;
          width: calc(100% / 7);
          height: calc(calc(400px - 40px) / 7);
          padding: 8px;
          font-size: 16px;
          color: #8a8b88;
          font-weight: bold;

          .dayItemText {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            border-radius: 50px;

            cursor: pointer;
            &.isSignedIn {
              color: #fff;
              background-color: #d02d54;
              box-shadow: 0px 2px 6px rgba(51, 51, 51, 0.5);
            }
            &.isSelected {
              color: #fff;
              background-color: #d02d54;
              box-shadow: 0px 2px 6px rgba(51, 51, 51, 0.5);
            }
          }
        }
      }
    }
    .dialyCalendarBottom {
      padding: 0 16px 10px;
      border-radius: 0 0 20px 20px;
      background-color: #13151e;
      .tips {
        font-size: 20px;
        font-weight: bold;
        color: #95382b;
      }
      .tipsMini {
        color: #8a8b88;
      }
      .remainingTimes {
        color: #ea3a21;
      }
      .signInButton {
        width: 86px;
        margin: 0 auto;
        padding: 3px 0;
        border-radius: 20px;
        font-size: 16px;
        text-align: center;
        background-color: #d02d54;
        color: #fff;
        cursor: pointer;
        &.signInButton-disabled {
          background-color: #666;
          color: #999;
          pointer-events: none;
          opacity: 0.6;
        }
      }
    }
  }
}
</style>
