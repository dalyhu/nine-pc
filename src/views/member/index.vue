<!-- 个人 -->
<template>
  <div class="personal-home-page" style="padding-top: 70px; margin-bottom: 0">
    <nav class="nav">
      <img
        class="usr"
        :src="$common.avatarHandler(infos.avatar)"
        @error="$common.errorImg($event)"
      />
      <div class="name1" :title="infos.user_nickname">
        {{ hasLogged ? infos.user_nickname : `游客${this.visitorId}` }}
      </div>
      <ul>
        <!-- v-if="Number(infos.is_anchor) == 0?index < 8:index < 11 && index !=  7" -->
        <li
          :class="[navBarIndex == item.id ? 'cur' : '', item.icon]"
          v-for="item in navBar"
          v-show="isShow(item)"
          :key="item.id"
          @click="navBarItemClick(item)"
        >
          <a :class="navBarIndex == item.id ? 'cur' : ''">
            <span class="name">
              <span v-if="item.icon === 'account'" style="margin-right: 20px">
                <img
                  src="/static/images/feedback/Frame@3x.png"
                  width="26"
                  v-if="navBarIndex == item.id"
                />
                <img src="/static/images/feedback/Frame@3x-1.png" width="26" v-else />
              </span>
              <span v-else-if="item.icon === 'myApplication'" style="margin-right: 20px">
                <img
                  src="/static/images/feedback/my-apply.png"
                  width="26"
                  height="26"
                  v-if="navBarIndex == item.id"
                />
                <img
                  src="/static/images/feedback/my-apply-default.png"
                  width="26"
                  height="26"
                  v-else
                />
              </span>
              <span v-else-if="item.icon === 'packPayApplication'" style="margin-right: 20px">
                <img
                  src="/static/images/feedback/pack-pay.png"
                  width="26"
                  height="26"
                  v-if="navBarIndex == item.id"
                />
                <img
                  src="/static/images/feedback/pack-pay-default.png"
                  width="26"
                  height="26"
                  v-else
                />
              </span>

              <i class="iconfont" v-else></i>
              {{ item.name }}
            </span>
          </a>
        </li>
        <li
          class="creation"
          v-if="infos.is_writer == 1"
          :class="{ cur: navBarIndex == NAV_BAR_INDEX_ENUM.myWriting }"
          @click="navBarIndex = NAV_BAR_INDEX_ENUM.myWriting"
        >
          <a :class="{ cur: navBarIndex == NAV_BAR_INDEX_ENUM.myWriting }" target="_self">
            <span class="name"> <i class="iconfont"></i>我的创作</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- 设置二级密码 -->
    <el-dialog
      :center="true"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      width="547px"
      top="30vh"
    >
      <div role="document" class="ant-modal wallet-bind-bank-card-modal" style="width: 100%">
        <div class="ant-modal-content" style="transform: translateY(-100px)">
          <button type="button" aria-label="Close" class="ant-modal-close">
            <span class="ant-modal-close-x"
              ><span
                role="img"
                aria-label="close"
                class="anticon anticon-close ant-modal-close-icon"
                ><svg
                  @click="dialogVisible = false"
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="close"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
                  ></path></svg></span
            ></span>
          </button>
          <div class="ant-modal-body">
            <div class="title">设置支付密码</div>
            <div class="text">验证码将发送到您的手机：{{ infos.mobile }}</div>
            <form class="ant-form ant-form-horizontal">
              <div class="ant-row ant-form-item" style="row-gap: 0px">
                <div class="ant-col ant-form-item-label">
                  <label for="password" class="ant-form-item-required" title="设置密码："
                    >设置密码</label
                  >
                </div>
                <div class="ant-col ant-form-item-control">
                  <div class="ant-form-item-control-input">
                    <div class="ant-form-item-control-input-content">
                      <span
                        class="ant-input-affix-wrapper ant-input-affix-wrapper-lg ant-input-password ant-input-password-large"
                        ><input
                          placeholder="请输入密码,不少于6位数"
                          v-model="password"
                          action="click"
                          id="password"
                          type="password"
                          class="ant-input ant-input-lg"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="ant-row ant-form-item" style="row-gap: 0px">
                <div class="ant-col ant-form-item-label">
                  <label for="confirmPassword" class="ant-form-item-required" title="确认密码："
                    >确认密码</label
                  >
                </div>
                <div class="ant-col ant-form-item-control">
                  <div class="ant-form-item-control-input">
                    <div class="ant-form-item-control-input-content">
                      <span
                        class="ant-input-affix-wrapper ant-input-affix-wrapper-lg ant-input-password ant-input-password-large"
                        ><input
                          placeholder="请输入相同的密码"
                          v-model="password1"
                          action="click"
                          id="confirmPassword"
                          type="password"
                          class="ant-input ant-input-lg"
                      /></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="ant-row ant-form-item" style="row-gap: 0px">
                <div class="ant-col ant-form-item-label">
                  <label for="verifyCode" class="ant-form-item-required" title="验证码："
                    >验证码</label
                  >
                </div>
                <div class="ant-col ant-form-item-control">
                  <div class="ant-form-item-control-input">
                    <div class="ant-form-item-control-input-content">
                      <div class="wallet-verify-input">
                        <input
                          maxlength="8"
                          v-model="code"
                          placeholder="请输入验证码"
                          type="text"
                          class="ant-input ant-input-lg"
                        />
                        <div class="btn get-verify-btn" @click="getCode()">
                          {{ show ? '获取验证码' : count + 's' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pay-password-btn-group">
                <div class="btn ok" data-id="handleSubmit" @click="paymentPassword()">确定</div>
                <div class="btn cancel" @click="dialogVisible = false">取消</div>
              </div>
            </form>
          </div>
        </div>
        <div
          tabindex="0"
          aria-hidden="true"
          style="width: 0px; height: 0px; overflow: hidden; outline: none"
        ></div>
      </div>
    </el-dialog>

    <section>
      <div class="personDes" v-if="navBarIndex != NAV_BAR_INDEX_ENUM.wallet">
        <div class="des">
          <span>个人简介 ：</span><i>{{ hasLogged ? infos.signature : '' }}</i>
        </div>
        <div class="num">
          我的粉丝数 ：<i>{{ hasLogged ? infos.attention : '-' }}</i>
        </div>
      </div>
      <div class="wallet-header-container" v-else>
        <div class="wallet-header">
          <div class="info">
            <div class="consume">
              <div class="up">
                <div class="icon"></div>
                <div class="name">消费钱包</div>
              </div>
              <div class="bottom">
                钻石数量：
                <div class="num">{{ infos.balance }}</div>
              </div>
            </div>
            <div class="income">
              <div class="up flex">
                <div class="flex-start">
                  <div class="icon"></div>
                  <div class="name">收入钱包</div>
                </div>

                <!-- <el-popconfirm
								  @confirm="confirm"
								  title="转化后不可提现，只能消费、请确认"
								>
								</el-popconfirm> -->
                <div class="btn" @click="isbalance = true">转消费钱包</div>
              </div>

              <div class="bottom">
                <div class="space">
                  可提现钻石：
                  <div class="num">{{ infos.withdrawal_balance }}</div>
                </div>
                <div class="space">
                  待结算钻石：
                  <div class="num">0</div>
                </div>
                <div>
                  累计到账：
                  <div class="num">0</div>
                  元
                </div>
              </div>
            </div>
          </div>
          <div class="right-btn-group">
            <a>
              <div class="btn btn-up" @click="() => null"></div>
            </a>
            <div class="btn btn-bottom" @click="getwithed()"></div>
          </div>
        </div>
      </div>
      <userinfo v-if="navBarIndex == NAV_BAR_INDEX_ENUM.personalInfo" :infos="infos"></userinfo>
      <concern v-if="navBarIndex == NAV_BAR_INDEX_ENUM.myFocus"></concern>
      <collection v-if="navBarIndex == NAV_BAR_INDEX_ENUM.myCollection"></collection>
      <reserve v-if="navBarIndex == NAV_BAR_INDEX_ENUM.reserveForWatching"></reserve>
      <grade v-if="navBarIndex == NAV_BAR_INDEX_ENUM.myGrade"></grade>
      <information v-if="navBarIndex == NAV_BAR_INDEX_ENUM.loudspeakerAnnouncement"></information>
      <apply
        v-if="navBarIndex == NAV_BAR_INDEX_ENUM.applyAnchor"
        v-model:navBarIndex="navBarIndex"
      ></apply>
      <reserved v-if="navBarIndex == NAV_BAR_INDEX_ENUM.reserveForLive"></reserved>
      <broadcast v-if="navBarIndex == NAV_BAR_INDEX_ENUM.startLive"></broadcast>
      <activitySetting v-if="navBarIndex == NAV_BAR_INDEX_ENUM.activitySetting"></activitySetting>
      <MyApplication
        v-if="navBarIndex == NAV_BAR_INDEX_ENUM.myApplication && !isHouse"
      ></MyApplication>
      <PackPayApplication
        v-if="navBarIndex == NAV_BAR_INDEX_ENUM.packPayApplication"
      ></PackPayApplication>
      <div
        class="i-tabs-container"
        style="padding: 20px 30px"
        v-if="navBarIndex == NAV_BAR_INDEX_ENUM.anchorAnnouncement"
      >
        <div class="row notice flex-start">
          <span style="align-self: flex-start">主播公告：</span>
          <div
            class="ant-input-textarea ant-input-textarea-show-count room-desc"
            style="display: inline-block; width: 528px"
          >
            <textarea
              maxlength="50"
              v-model="content"
              placeholder="不能超过50个字"
              class="ant-input"
              style="margin-top: 0px; margin-bottom: 0px; height: 102px"
            >
解说更多精彩赛事直播，欢迎关注哦！</textarea
            >
          </div>
        </div>
        <button
          class="i-button i-primary-image-button"
          style="
            margin-left: 83px;
            background-image: linear-gradient(106deg, rgb(238, 207, 181), rgb(216, 173, 102));
            margin-top: 40px;
          "
          @click="setPlacard()"
        >
          确认保存
        </button>
      </div>
      <feedback v-if="navBarIndex == NAV_BAR_INDEX_ENUM.feedback"></feedback>
      <write v-if="navBarIndex == NAV_BAR_INDEX_ENUM.myWriting && infos.is_writer == 1"></write>
    </section>

    <!-- 转入消费金额弹窗 -->
    <el-dialog title="提示" v-model="isbalance" width="30%">
      <div style="padding: 20px">
        <div class="flex" style="margin-bottom: 10px">
          <p style="text-align: left">转化后不可提现，只能消费、请确认!</p>
          <img style="width: 108px; height: 12px" src="/static/images/comparison.png" />
        </div>
        <el-input v-model="balanceiInput" placeholder="请输入转入金额"></el-input>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isbalance = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import userinfo from './userinfo.vue'
import concern from './concern.vue'
import collection from './collection.vue'
import reserve from './reserve.vue'
import grade from './grade.vue'
import information from './information.vue'
import apply from './apply.vue'
import reserved from './reserved.vue'
import broadcast from './broadcast.vue'
import write from './write.vue'
import feedback from './feedback.vue'
import activitySetting from './activitySetting/index.vue'
import MyApplication from './myApplication/index.vue'
import PackPayApplication from './packPayApplication/index.vue'

import {
  getCode,
  getPlacard,
  setPlacard,
  paymentPassword,
  conversionBalance
} from '../../api/user.js'

export default {
  components: {
    write,
    apply,
    grade,
    concern,
    reserve,
    reserved,
    userinfo,
    broadcast,
    collection,
    information,
    feedback,
    activitySetting,
    MyApplication,
    PackPayApplication
  },
  data() {
    const NAV_BAR_INDEX_ENUM = {
      personalInfo: 0, // 个人资料
      wallet: 1, // 我的钱包
      myFocus: 2, // 我的关注
      myCollection: 3, // 我的收藏
      reserveForWatching: 4, // 预约观看
      myGrade: 5, // 我的等级
      loudspeakerAnnouncement: 6, // 喇叭消息
      applyAnchor: 7, // 申请主播
      reserveForLive: 8, // 预约开播
      startLive: 9, // 我要直播
      anchorAnnouncement: 10, // 主播公告
      myWriting: 11, // 我的创作
      feedback: 12, // 留言板
      activitySetting: 13, // 绑定账号
      myApplication: 14, // 我的申请
      packPayApplication: 16 // 包赔申请
    }
    return {
      is: false,
      info: {},
      balanceiInput: '', //转入金额
      password: '', //获取验证码
      password1: '', //获取验证码
      code: '', //获取验证码
      count: 0, //获取验证码
      timer: null, //获取验证码
      show: true, //获取验证码
      dialogVisible: false,
      isbalance: false,
      content: '', //主播公告
      placard: {}, //主播公告
      navBarIndex: this.$route.query.type || 0,
      NAV_BAR_INDEX_ENUM,
      navBar: [
        {
          id: NAV_BAR_INDEX_ENUM.personalInfo,
          name: '个人资料',
          icon: 'basic-data'
        },
        // {
        // 	id:1,
        // 	name: '我的钱包',
        // 	icon: 'wallet'
        // },
        {
          id: NAV_BAR_INDEX_ENUM.myFocus,
          name: '我的关注',
          icon: 'concern'
        },
        {
          id: NAV_BAR_INDEX_ENUM.myCollection,
          name: '我的收藏',
          icon: 'collection'
        },
        {
          id: NAV_BAR_INDEX_ENUM.reserveForWatching,
          name: '预约观看',
          icon: 'reserve'
        },
        {
          id: NAV_BAR_INDEX_ENUM.myGrade,
          name: '我的等级',
          icon: 'grade'
        },
        // {
        // 	id: NAV_BAR_INDEX_ENUM.loudspeakerAnnouncement,
        // 	name: '喇叭消息',
        // 	icon: 'information'
        // },
        {
          id: NAV_BAR_INDEX_ENUM.applyAnchor,
          name: '申请主播',
          icon: 'apply'
        },
        {
          id: NAV_BAR_INDEX_ENUM.reserveForLive,
          name: '预约开播',
          icon: 'live-reverse'
        },
        {
          id: NAV_BAR_INDEX_ENUM.startLive,
          name: '我要直播',
          icon: 'start_live'
        },
        {
          id: NAV_BAR_INDEX_ENUM.anchorAnnouncement,
          name: '主播公告',
          icon: 'announcement'
        },
        // 11是【我的创作】
        {
          id: NAV_BAR_INDEX_ENUM.feedback,
          name: '悄悄话留言板',
          icon: 'feedback'
        },
        {
          id: NAV_BAR_INDEX_ENUM.activitySetting,
          name: '绑定账号',
          icon: 'account'
        },
        {
          id: NAV_BAR_INDEX_ENUM.relatedVideo,
          name: '相关视频',
          icon: 'start_live'
        },
        {
          id: NAV_BAR_INDEX_ENUM.myApplication,
          name: '我的申请',
          icon: 'myApplication'
        },
        {
          id: NAV_BAR_INDEX_ENUM.packPayApplication,
          name: '活动记录',
          icon: 'packPayApplication'
        }
      ]
    }
  },
  watch: {
    navBarIndex(e) {
      localStorage.setItem('tabIndex', e)
    }
  },
  computed: {
    infos() {
      return this.$store.state.user.infoData
    },
    visitorId() {
      return this.$store.state.visitorInfo.id
    },
    hasLogged() {
      return !!Object.keys(this.infos).length
    },
    // 是否是房管(no)
    isHouse() {
      return Object.keys(this.$store.state.house.houseAuthor).length === 0
    }
  },
  mounted() {
    let recored = localStorage.getItem('recored')
    if (recored) {
      this.navBarIndex = Number(recored)
    } else {
      let query = this.$route.query
      // 判断是否是打开充值

      // console.log();
      let type = query ? query.type || '0' : '0'

      // 注册用户
      if (this.infos.id) {
        // 是主播，进到了申请主播页，跳转至我要开播
        if (this.infos.is_anchor == 1 && type === '7') {
          type = '9'
          // 不是主播，进到我要开播，跳转至申请主播
        } else if (this.infos.is_anchor != 1 && type === '9') {
          type = '7'
        }
        // 游客访问我要开播页，跳转至申请主播
      } else if (type === '9') {
        type = '7'
      }

      if (
        !this.hasLogged &&
        ![this.NAV_BAR_INDEX_ENUM.applyAnchor, this.NAV_BAR_INDEX_ENUM.feedback].includes(
          Number(type)
        )
      ) {
        type = 12
      }

      if (type) {
        this.navBarIndex = type
        localStorage.setItem('tabIndex', type)
      }

      let tabIndex = localStorage.getItem('tabIndex')
      this.navBarIndex = Number(tabIndex)
      // 登录im
      if (!this.hasLogged) return
      // 获取主播公告
      if (this.infos.is_anchor == 1) this.getPlacard()
    }
  },
  methods: {
    //
    getwithed() {
      if (this.infos.is_defray_pass == 0) {
        //1是 0否
        return (this.dialogVisible = true)
      }
    },
    // 转化金额
    confirm() {
      conversionBalance({ amount: this.balanceiInput })
        .then((res) => {
          this.$store.dispatch('updateUserInfo')
          this.$message.success('转入成功')
          this.isbalance = false
        })
        .catch((res) => {})
    },
    // 子传父打开弹窗
    chagedialog() {
      this.dialogVisible = true
    },
    // 获取手机验证码
    getCode() {
      let data = {
        mobile: this.infos.mobile,
        type: 5
      }
      getCode(data)
        .then((res) => {
          this.getCount()
          this.$message.success(res.msg)
        })
        .catch((res) => {
          console.log('失败' + res)
        })
    },
    paymentPassword() {
      let data = {
        password: this.password,
        code: this.code
      }
      if (!this.password1 && !this.password && !this.code) {
        return this.$message.warning('请输入有误，请检查！')
      }
      if (this.password1 != data.password) {
        return this.$message.warning('两次密码不同，请检查！')
      }

      paymentPassword(data)
        .then((res) => {
          this.$store.dispatch('updateUserInfo')
          this.$message.success('设置成功！')
          this.dialogVisible = false
        })
        .catch((res) => {})
    },
    // 验证码倒计时
    getCount() {
      const TIME_COUNT = 180
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        this.timer = window.setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            window.clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },

    // 获取主播公告
    getPlacard() {
      // 根据后台给出的的详情判断是否为主播 是则触发方法
      getPlacard()
        .then((res) => {
          this.placard = res.data
          this.content = res.data.data
        })
        .catch((res) => {})
    },
    // 添加修改主播公告
    setPlacard() {
      if (!this.content) {
        return this.$message.warning('请输入主播公告内容')
      }
      setPlacard({
        content: this.content
      })
        .then((res) => {
          if (this.placard.data) {
            this.$message.success('修改成功')
          } else {
            this.$message.success('添加成功')
          }
          this.getPlacard()
        })
        .catch((res) => {})
    },
    isShow(item) {
      const commonId = [
        this.NAV_BAR_INDEX_ENUM.feedback,
        this.NAV_BAR_INDEX_ENUM.activitySetting,
        this.NAV_BAR_INDEX_ENUM.packPayApplication
      ]
      if (commonId.includes(item.id)) return true

      if (item.id == this.NAV_BAR_INDEX_ENUM.myApplication && !this.isHouse) return true

      if (Number(this.infos.is_anchor) == 0 || !this.hasLogged) {
        // 非主播
        return item.id < this.NAV_BAR_INDEX_ENUM.reserveForLive
      } else {
        return (
          item.id < this.NAV_BAR_INDEX_ENUM.myWriting &&
          item.id != this.NAV_BAR_INDEX_ENUM.applyAnchor
        )
      }
    },
    navBarItemClick(item) {
      const list = [
        this.NAV_BAR_INDEX_ENUM.applyAnchor,
        this.NAV_BAR_INDEX_ENUM.feedback,
        this.NAV_BAR_INDEX_ENUM.packPayApplication
      ]
      if (!this.hasLogged && !list.includes(item.id)) {
        // 未登录
        this.$store.state.user.showLoginMask = true
        return
      }
      this.navBarIndex = item.id
    }
  }
}
</script>

<style scoped="scoped">
.account-img {
  margin-right: 20px !important;
}
.wallet-header-container {
  height: 100px;
  color: #999;
  display: flex;
  margin-bottom: 15px;
  align-items: center;
  padding: 0 42px;
  background: url('/static/images/img-gerenjianjie-beijing.jpg') no-repeat 50%;
  background-size: cover;
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgb(69 74 99 / 8%);
}

/* .ant-modal {
		top: 0 !important;
	} */
.wallet-header-container .wallet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.wallet-header-container .wallet-header .info {
  width: 790px;
  display: flex;
  align-items: center;
  height: 100%;
  color: #67728f;
}

.wallet-header-container .wallet-header .right-btn-group {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 90px;
  height: 100%;
}

.wallet-header-container .wallet-header .info .consume {
  margin-right: 95px;
}

.wallet-header-container .wallet-header .info .up {
  display: flex;
  margin-bottom: 5px;
}

.wallet-header-container .wallet-header .info .up .icon {
  width: 28px;
  height: 33px;
  margin-right: 6px;
  background-repeat: no-repeat;
  background-size: contain;
}
.up .btn {
  background-image: linear-gradient(106deg, rgb(238, 207, 181), rgb(216, 173, 102));
  padding: 4px 11px;
  border-radius: 4px;
  color: #fff;
}

.wallet-header-container {
  height: 100px;
  color: #999;
  display: flex;
  margin-bottom: 15px;
  align-items: center;
  padding: 0 42px;
  background: url('/static/images/img-gerenjianjie-beijing.jpg') no-repeat 50%;
  background-size: cover;
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgba(69, 74, 99, 0.08);
}

.wallet-header-container .wallet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.wallet-header-container .wallet-header .info {
  width: 790px;
  display: flex;
  align-items: center;
  height: 100%;
  color: #67728f;
}

.wallet-header-container .wallet-header .info .consume {
  margin-right: 95px;
}

.wallet-header-container .wallet-header .info .consume .icon {
  background-image: url(data:image/png;base64,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);
}

.wallet-header-container .wallet-header .info .income .icon {
  background-image: url(data:image/png;base64,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);
}

.wallet-header-container .wallet-header .info .up {
  display: flex;
  margin-bottom: 5px;
}

.wallet-header-container .wallet-header .info .up .icon {
  width: 28px;
  height: 33px;
  margin-right: 6px;
  background-repeat: no-repeat;
  background-size: contain;
}

.wallet-header-container .wallet-header .info .up .name {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.wallet-header-container .wallet-header .info .bottom {
  display: flex;
  font-size: 14px;
}

.wallet-header-container .wallet-header .info .bottom > div {
  display: flex;
  align-items: center;
}

.wallet-header-container .wallet-header .info .bottom .num {
  font-size: 16px;
  color: #b08a5b;
}

.wallet-header-container .wallet-header .right-btn-group {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 90px;
  height: 100%;
}

.wallet-header-container .wallet-header .right-btn-group .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 28px;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
}

.wallet-header-container .wallet-header .right-btn-group .btn-up {
  background-image: url('/static/images/btn-chongzhi-normal.png');
}

.wallet-header-container .wallet-header .right-btn-group .btn-up:hover {
  background-image: url('/static/images/btn-chongzhi-hover.png');
}

.wallet-header-container .wallet-header .right-btn-group .btn-bottom {
  margin-top: 12px;
  background-image: url('/static/images/btn-tixian-normal.png');
}

.wallet-header-container .wallet-header .space {
  margin-right: 46px;
}
</style>
<style lang="scss" scoped>
@use './member.scss';
.personal-home-page {
  margin-top: 0;
}
</style>
