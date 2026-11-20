<!-- 申请主播 -->
<template>
  <div class="apply-anchor-info" v-if="isApply">
    <div class="uc-auto-page">
      <img
        @click="posterClick"
        style="width: 100%; height: auto"
        src="/static/images/apply-bg.jpg"
      />
    </div>
  </div>
  <div class="apply-anchor-info" v-else>
    <div class="title">认证信息页</div>
    <div class="content">
      <form class="ant-form ant-form-horizontal">
        <div class="ant-row" style="row-gap: 0px">
          <div class="ant-row ant-form-item liveType right160 flex-start" style="row-gap: 0px">
            <div class="ant-col ant-form-item-label">
              <label for="liveTypeArr" class="ant-form-item-required" title="直播赛事 :"
                >直播赛事
              </label>
            </div>
            <div class="ant-col ant-form-item-control">
              <el-checkbox-group fill="#000" v-model="checkList">
                <el-checkbox label="足球"></el-checkbox>
                <el-checkbox label="篮球"></el-checkbox>
                <el-checkbox label="电竞"></el-checkbox>
                <el-checkbox label="其它"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="ant-row ant-form-item liveExperience flex-start" style="row-gap: 0px">
            <div class="ant-col ant-form-item-label flex">
              <label for="liveExperience" class="ant-form-item-required" title="直播经验 :"
                >直播经验</label
              >
            </div>
            <el-select v-model="value" style="width: 218px" placeholder="请选择">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="ant-row" style="row-gap: 0px">
          <div class="ant-row ant-form-item right84 line-height-40" style="row-gap: 0px">
            <div class="ant-col ant-form-item-label">
              <label for="name" class="ant-form-item-required" title="姓名 :">姓名 </label>
            </div>
            <div class="ant-col ant-form-item-control">
              <div class="ant-form-item-control-input">
                <div class="ant-form-item-control-input-content">
                  <input
                    v-model="name"
                    placeholder="请输入您的真实姓名(必填)"
                    type="text"
                    id="name"
                    class="ant-input"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="ant-row ant-form-item relation" style="row-gap: 0px">
            <div class="ant-col ant-form-item-label">
              <label for="contactType" title="联系方式 :">联系方式 </label>
            </div>
            <div class="ant-col ant-form-item-control">
              <div class="ant-form-item-control-input">
                <div class="ant-form-item-control-input-content">
                  <div class="ant-radio-group ant-radio-group-outline" id="contactType">
                    <el-radio-group v-model="radio">
                      <el-radio :label="1">QQ</el-radio>
                      <el-radio :label="2">微信</el-radio>
                      <el-radio :label="3">电话号码</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ant-row" style="row-gap: 0px">
          <div class="ant-row ant-form-item right84" style="row-gap: 0px">
            <div class="ant-col ant-form-item-label">
              <label for="idCardNo" class="ant-form-item-required" title="身份证 :">身份证 </label>
            </div>
            <div class="ant-col ant-form-item-control">
              <div class="ant-form-item-control-input">
                <div class="ant-form-item-control-input-content">
                  <input
                    v-model="id_card"
                    placeholder="请输入身份证号码(必填)"
                    type="text"
                    id="idCardNo"
                    class="ant-input"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="ant-row ant-form-item" style="row-gap: 0px">
            <div class="ant-col ant-form-item-control">
              <div class="ant-form-item-control-input">
                <div class="ant-form-item-control-input-content">
                  <input
                    placeholder="请输入QQ号/微信号/电话号码(非必填)"
                    v-model="connect"
                    type="text"
                    id="contactNo"
                    class="ant-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ant-row ID_img" style="row-gap: 0px">
          <div class="ant-row ant-form-item right10" style="row-gap: 0px">
            <div class="ant-col ant-form-item-label">
              <label for="cardFrontImg" class="ant-form-item-required" title="身份照片 :"
                >身份照片
              </label>
            </div>
            <div class="ant-col ant-form-item-control">
              <div class="ant-form-item-control-input">
                <div class="ant-form-item-control-input-content">
                  <el-upload
                    class="avatar-uploader"
                    action="upload"
                    :auto-upload="false"
                    :on-change="(file) => beforeAvatarUpload(file, 'front')"
                    accept="image/*"
                    :show-file-list="false"
                    :disabled="uploadingStateMap['front']"
                  >
                    <div
                      class="upload-container front"
                      :style="{
                        backgroundImage: `url('${
                          front || getImageUrl('/static/images/id_card-up.png')
                        }')`
                      }"
                      id="cardFrontImg"
                    ></div>
                  </el-upload>
                </div>
              </div>
            </div>
          </div>
          <div class="ant-row ant-form-item" style="row-gap: 0px">
            <div class="ant-col ant-form-item-control">
              <div class="ant-form-item-control-input">
                <div class="ant-form-item-control-input-content">
                  <el-upload
                    class="avatar-uploader"
                    action="upload"
                    :auto-upload="false"
                    :on-change="(file) => beforeAvatarUpload(file, 'back')"
                    accept="image/*"
                    :show-file-list="false"
                    :disabled="uploadingStateMap['back']"
                  >
                    <div
                      class="upload-container back"
                      :style="{
                        backgroundImage: `url('${
                          negative || getImageUrl('/static/images/id_card-down.png')
                        }')`
                      }"
                      id="carBackImg"
                    ></div>
                  </el-upload>
                </div>
              </div>
            </div>
          </div>
          <div class="ant-row ant-form-item" style="row-gap: 0px">
            <div class="ant-col ant-form-item-control">
              <div class="ant-form-item-control-input">
                <div class="ant-form-item-control-input-content">
                  <el-upload
                    class="avatar-uploader"
                    action="upload"
                    :auto-upload="false"
                    :on-change="(file) => beforeAvatarUpload(file, 'handHeld')"
                    accept="image/*"
                    :show-file-list="false"
                    :disabled="uploadingStateMap['handHeld']"
                  >
                    <div
                      class="upload-container hand"
                      :style="{
                        backgroundImage: `url('${
                          hand_held || getImageUrl('/static/images/id_card-hanld.png')
                        }')`
                      }"
                      id="imageFront"
                    ></div>
                  </el-upload>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ant-row" style="row-gap: 0px">
          <div class="ant-row ant-form-item anchorDesc" style="row-gap: 0px">
            <div class="ant-col ant-form-item-label">
              <label for="anchorDesc" class="ant-form-item-required" title="个人简介 :"
                >个人简介
              </label>
            </div>
            <div class="ant-col ant-form-item-control">
              <div class="ant-form-item-control-input">
                <div class="ant-form-item-control-input-content">
                  <div class="textarea-container" id="anchorDesc">
                    <div
                      class="ant-input-textarea ant-input-textarea-show-count"
                      :data-count="introduction.length + '/ 5000'"
                    >
                      <textarea
                        maxlength="5000"
                        v-model="introduction"
                        placeholder="1.主播经验几年
	2.在哪些平台上担任过主播
	3.曾经获得过哪些荣誉
	4.擅长直播哪类赛事（足球、篮球、电竞、娱乐、其他）5.不少于15字"
                        class="ant-input"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ant-row" style="row-gap: 0px">
          <div class="ant-row ant-form-item right84" style="row-gap: 0px">
            <div class="ant-col ant-form-item-label">
              <label for="invitor" title="邀请人 :">邀请人 </label>
            </div>
            <div class="ant-col ant-form-item-control">
              <div class="ant-form-item-control-input">
                <div class="ant-form-item-control-input-content">
                  <input
                    placeholder="请输入邀请人(选填)"
                    maxlength="10"
                    v-model="invite"
                    type="text"
                    id="invitor"
                    class="ant-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ant-row" style="row-gap: 0px">
          <span class="right84" style="padding-left: 95px; margin-bottom: 10px; width: 395px">
            <div class="ant-row ant-form-item" style="row-gap: 0px">
              <div class="ant-col ant-form-item-control" style="width: 100%">
                <div class="ant-form-item-control-input">
                  <div class="ant-form-item-control-input-content">
                    <div class="login-item" id="phoneNo">
                      <div class="login-phone-area-choose">
                        <span class="login-phone-area-code">{{ phoneAreaCode }}</span>
                      </div>
                      <div class="login-input">
                        <input
                          autocomplete="off"
                          type="text"
                          placeholder="请输入手机号"
                          v-model="phoneValue"
                          maxlength="11"
                          oninput="value = value.replace(/[^\d]/g, '')"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </span>
        </div>
        <div class="ant-row" style="row-gap: 0px">
          <span class="right84" style="padding-left: 95px; margin-bottom: 10px">
            <div class="ant-row ant-form-item" style="row-gap: 0px">
              <div class="ant-col ant-form-item-control">
                <div class="ant-form-item-control-input">
                  <div class="ant-form-item-control-input-content">
                    <div id="smsCode">
                      <div class="login-item login-input-sms-verify">
                        <label class="login-input-sms">
                          <div class="login-passwd-icon">
                            <img
                              src="data:image/png;base64,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"
                              alt="icon"
                            />
                          </div>
                          <div class="login-input login-input-sms-verify">
                            <input v-model="code" type="text" placeholder="请输入验证码" />
                          </div>
                        </label>
                        <div class="login-get-verify-btn" @click="!show ? getCode() : ''">
                          {{ count == 0 ? '获取验证码' : count + 's' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </span>
        </div>
        <div
          class="ant-row ant-form-item"
          style="padding-left: 95px; margin-bottom: 10px; row-gap: 0px"
        >
          <div class="ant-col ant-form-item-control" style="text-align: left">
            <div class="ant-form-item-control-input">
              <div class="ant-form-item-control-input-content">
                <label class="ant-checkbox-wrapper">
                  <el-checkbox v-model="checked"></el-checkbox>
                  <router-link class="protocol-text" target="_self" to="/about-user?type=1">
                    ∷直播协议
                  </router-link>
                  <!-- <span class="protocol-text">::直播协议</span> -->
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="ant-row ant-form-item btn-item" style="row-gap: 0px">
          <div class="ant-col ant-form-item-control">
            <div class="ant-form-item-control-input">
              <div class="ant-form-item-control-input-content">
                <span @click="submit()" class="ant-btn ant-btn-primary btn"
                  ><span>提 交</span></span
                >
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { verified, getVerifiedInfo, getExperienceList, commonUpload } from '../../api/user.js'
import { isEmpty, divide } from 'lodash-es'
import { getImageUrl } from '@/utils/common.js'
import { doCompressor } from '@/utils'

export default {
  props:{
    navBarIndex: {
      type: Number
    }
  },
  data() {
    return {
      info: {},
      count: 0,
      show: false,
      timer: null,
      radio: null,
      isApply: true,
      checkList: [],
      options: [],
      invite: '', //邀请人
      code: '', //验证码
      name: '', //姓名
      id_card: '', //身份证号
      front: '', //身份证正面
      negative: '', //身份证反面
      hand_held: '', //手持图片
      introduction: '', //个人简介
      connect: '', //联系方式
      value: '', //选中的直播经验
      phoneValue: '',
      checked: false,
      uploadingStateMap: {
        front: false,
        back: false,
        handHeld: false
      },
      codeLoading: false // 发送验证码请求中标志，防止双击重复请求
    }
  },
  computed: {
    phoneAreaCode() {
      return this.userInfo.mobile ? this.userInfo.mobile.split('-')[0] : '86'
    },
    userInfo() {
      return this.$store.state.user.infoData
    },
    system() {
      return this.$store.state.system
    }
  },
  mounted() {
    if (isEmpty(this.userInfo)) {
      return
    }
    // 获取主播认证信息
    this.getVerifiedInfo1()
    // 获取主播经验列表选中
    this.getExperienceList()
  },
  methods: {
    getImageUrl,
    // 上传图片回调
    async beforeAvatarUpload(rawFile, indexType) {
      const fileM = divide(rawFile.size, 1024 * 1024)

      if (!/jpeg|png|gif|bmp/gi.test(rawFile.raw.type)) {
        ElMessage.error('图片格式错误，仅支持 jpg, png, gif, bmp 格式')
        return false
      }

      if (rawFile.raw.type === 'image/jpeg') {
        if (fileM > 10) {
          ElMessage.error('jpg 图片仅支持 10M 以内，请换张图片试试')
          return false
        }
      } else {
        if (fileM > 2) {
          ElMessage.error('非 jpg 图片仅支持 2M 以内，请换张图片试试')
          return false
        }
      }

      try {
        this.uploadingStateMap[indexType] = true

        const pic = await doCompressor(rawFile.raw)
        const { data } = await commonUpload({ file: pic, filetype: 'image' })

        switch (indexType) {
          case 'front':
            this.front = `${data}`
            break
          case 'back':
            this.negative = `${data}`
            break
          default:
            this.hand_held = `${data}`
            break
        }

        this.uploadingStateMap[indexType] = false
      } catch (error) {
        ElMessage.error(error.msg)
        this.uploadingStateMap[indexType] = false
      }
    },
    // 获取主播认证信息
    getVerifiedInfo1() {
      getVerifiedInfo({})
        .then((res) => {
          if (res.code == 0) {
            ///实名认证信息待审核或已退回
            this.value = res.data.exp
            this.invite = res.data.invite
            this.code = res.data.code //验证码
            this.name = res.data.name //姓名
            this.id_card = res.data.id_card //身份证号
            this.front = res.data.front //身份证反面
            this.negative = res.data.negative //身份证正面
            this.hand_held = res.data.hand_held //手持图片
            this.introduction = res.data.introduction //个人简介
            this.connect = res.data.connect //联系方式
            this.radio = res.data.connect_type

            res.data.type.forEach((item) => {
              if (item == 1) {
                this.checkList.push('篮球')
              } else if (item == 0) {
                this.checkList.push('足球')
              } else if (item == 3) {
                this.checkList.push('电竞')
              } else {
                this.checkList.push('其它')
              }
            })
          } else if (res.code == 3) {
            //实名认证已通过
          } else {
            //没有实名认证信息
          }
        })
        .catch((res) => {})
    },
    // 获取主播经验列表选中
    getExperienceList() {
      getExperienceList({})
        .then((res) => {
          this.options = res.data
        })
        .catch((res) => {})
    },
    // 获取手机验证码
    getCode() {
      // 请求进行中 或 倒计时中 直接拦截，防双击
      if (this.codeLoading || this.count !== 0) return
      if (!this.phoneValue) {
        return this.$message({
          message: '手机号不能为空！',
          type: 'warning'
        })
      }
      let data = {
        mobile: this.phoneValue,
        countryCode: this.phoneAreaCode,
        type: 6 // 主播认证
      }
      this.codeLoading = true
      this.$store
        .dispatch('user/sendVerifyCode', data)
        .then((res) => {
          if (res.code === 0) {
            this.getCount(res.data.seconds)
            this.$message.success(res.msg)
          }
        })
        .catch((err) => {
          if (err.data?.seconds) {
            this.getCount(err.data.seconds)
          }
        })
        .finally(() => {
          this.codeLoading = false
        })
    },

    // 验证码倒计时
    getCount(TIME_COUNT) {
      console.log(this.timer)
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = true
        this.timer = window.setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = false
            window.clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    submit() {
      let data = {
        type: []
      }
      if (this.checkList.length == 0) {
        return this.$message.warning('请选择直播赛事类型')
      }
      if (!this.value) {
        return this.$message.warning('请选择直播经验')
      }
      if (!this.radio) {
        return this.$message.warning('请选择联系方式')
      }
      if (!this.code) {
        return this.$message.warning('请输入验证码')
      }
      if (!this.name) {
        return this.$message.warning('请输入申请人姓名')
      }
      if (!this.id_card) {
        return this.$message.warning('请输入申请人身份证')
      }
      if (!this.introduction) {
        return this.$message.warning('请输入个人简介')
      }
      if (!this.checked) {
        return this.$message.warning('请输入勾选直播协议')
      }
      this.checkList.forEach((item) => {
        if (item == '篮球') {
          data.type.push(1)
        } else if (item == '足球') {
          data.type.push(0)
        } else {
          data.type.push(2)
        }
      })
      data.exp = this.value
      data.invite = this.invite
      data.code = this.code //验证码
      data.name = this.name //姓名
      data.id_card = this.id_card //身份证号
      data.front = this.front //身份证反面
      data.negative = this.negative //身份证正面
      data.hand_held = this.hand_held //手持图片
      data.introduction = this.introduction //个人简介
      data.connect = this.connect //联系方式
      data.connect_type = this.radio
      verified(data)
        .then((res) => {
          this.getVerifiedInfo1()
          this.$message.success('已提交审核')
          // 2939 不知道为什幺要这样搞
          setTimeout(() => {
            this.$emit('update:navBarIndex', 0)
          }, 200)
        })
        .catch((res) => {})
    },
    posterClick() {
      if (isEmpty(this.userInfo)) {
        // 未登录
        this.$store.state.user.showLoginMask = true
        return
      }
      this.isApply = false
    }
  }
}
</script>

<style lang="scss" scoped>
@use './member.scss';
.apply-anchor-info {
  width: 960px;
  padding: 20px;
  margin: 20px auto 40px;
  border-radius: 10px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
  background-color: #fff;
  user-select: none;
}

.login-input {
  input {
    border: none;
  }
}

.apply-anchor-info .title {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 72px;
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.apply-anchor-info .content {
  width: 100%;
}

.ant-row,
.ant-row:after,
.ant-row:before {
  display: flex;
}

.ant-row {
  align-items: center;
  flex-flow: row wrap;
}

.apply-anchor-info .content .ID_img {
  min-height: 220px;
  text-align: center;
}

.apply-anchor-info .content .ID_img .upload-container {
  width: 260px;
  height: 165px;
  margin-top: 12px;
}

.apply-anchor-info .content .ID_img .upload-container.front {
  background-image: url(data:image/png;base64,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);
  background-size: cover;
}

.apply-anchor-info .content .ID_img .upload-container.back {
  margin-left: 10px;
  background-image: url(data:image/png;base64,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);
  background-size: cover;
}

.apply-anchor-info .content .ID_img .upload-container.hand {
  margin-left: 10px;
  background-size: cover;
}

.apply-anchor-info .content .ID_img .upload-container .upload-content {
  width: 240px;
  height: 155px;
  cursor: pointer;
}

.apply-anchor-info .content .ID_img .ID-text {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  color: #999;
}

.apply-anchor-info .content .util-item {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
  font-size: 14px;
}

.apply-anchor-info .content .err-text {
  font-size: 12px;
  color: #ff5d5d;
}

.apply-anchor-info .content .protocol-text {
  text-decoration: underline;
  font-size: 15px;
  color: #44a4ff;
  margin-left: 5px;
  cursor: pointer;
}

.apply-anchor-info .anchorDesc {
  min-height: 223px !important;
}

.apply-anchor-info .btn-item {
  padding-left: 97px;
}

.apply-anchor-info .btn-item .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 40px;
  border-radius: 3px;
  background-image: linear-gradient(112deg, #eecfb5, #d8ad66);
  color: #f4f6f9;
  cursor: pointer;
}

.apply-anchor-info .right160 {
  margin-right: 160px;
}

.apply-anchor-info .right84 {
  margin-right: 84px;
}

.apply-anchor-info .line-height-40 {
  line-height: 40px;
}

.apply-anchor-info .liveExperience .ivu-select {
  width: 124px;
}

.apply-anchor-info .relation .ivu-radio-inner {
  visibility: hidden;
}

.apply-anchor-info ::-webkit-input-placeholder {
  color: #ccc;
}

.apply-anchor-info :-moz-placeholder,
.apply-anchor-info ::-moz-placeholder {
  color: #ccc;
}

.apply-anchor-info :-ms-input-placeholder {
  color: #ccc;
}

.apply-anchor-info .ant-form-item .ant-form-item-label {
  width: 80px;
  /* height: 40px; */
  padding: 0;
  margin-right: 16px;
  text-align: left;
  color: #333;
}

.apply-anchor-info .ant-form-item .ant-input {
  width: 300px;
  height: 40px;
  padding: 4px 20px;
  border-radius: 3px;
  border: 1px solid #e3e3e3;
}

.apply-anchor-info .ant-form-item .ant-radio-wrapper.ant-radio-wrapper-checked {
  color: #cb9a66;
}

.apply-anchor-info .ant-form-item .ant-radio-wrapper .ant-radio {
  display: none;
}

.apply-anchor-info .ant-form-item .ant-radio-wrapper .radio-icon {
  width: 14px;
  height: 14px;
  margin-top: -2px;
  margin-right: 10px;
}

.apply-anchor-info .ant-form-item .ant-input-textarea .ant-input {
  width: 803px;
  height: 220px;
  padding: 8px 20px;
}

.apply-anchor-info .ant-form-item .login-get-verify-btn {
  margin-left: 10px;
}

.apply-anchor-info .ant-form-item .ant-input-textarea {
  position: relative;
}

.apply-anchor-info .ant-form-item .ant-input-textarea.ant-input-textarea-show-count:after {
  position: absolute;
  bottom: 5px;
  right: 10px;
}

.apply-anchor-info textarea {
  resize: none;
}

.apply-anchor-info {
  height: 630px;
  overflow: hidden;
  .uc-auto-page {
    cursor: pointer;
    height: 100%;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 5px;
    }
  }
  .content {
    height: 90%;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 5px;
    }
  }
}
.flex-start {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
