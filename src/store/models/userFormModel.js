import { encryptByRSA } from '@/utils/crypto'

export default class UserForm {
  constructor(form) {
    Object.assign(this, form)
    this._isActiveEncrypt = true
    if (!this.countryCode) {
      this.countryCode = '86'
    }
  }

  get fullMobile() {
    return this.countryCode + '-' + this.mobile
  }

  get sendCodeForm() {
    return {
      mobile: this.encrypt(this.fullMobile),
      type: this.type
    }
  }

  get cryptoMobile() {
    return this.encrypt(this.fullMobile)
  }

  // 邮箱获取验证码接口入参
  get sendNewMailCodeForm() {
    return {
      mail: this.encrypt(this.mail) //邮箱
    }
  }

  get sendMailCodeForm() {
    return {
      type: this.type,
      account: this.account, // 账号
      mail: this.mail //邮箱
    }
  }

  get basicForm() {
    return {
      mobile: this.encrypt(this.fullMobile),
      password: this.encrypt(this.password),
      code: this.code,
      type: this.type
    }
  }

  get signUpForm() {
    return {
      channel_code: this.channel_code,
      guest_id: this.guest_id,
      invite: this.invite,
      device_type: this.device_type,
      ...this.basicForm
    }
  }

  // 邮箱注册
  get mailSignUpForm() {
    return {
      account: this.account, // 账号
      mail: this.mail, // 邮箱
      code: this.code, // 验证码
      password: this.encrypt(this.password), // 密码
      invite: this.invite,
      channel_code: this.channel_code,
      au_login: this.au_login
    }
  }

  get loginForm() {
    return {
      device_type: this.device_type,
      ...this.basicForm
    }
  }

  // 邮箱模式登陆
  get mailLoginForm() {
    return {
      account: this.account, // 账号
      password: this.password ? this.encrypt(this.password) : '', // 密码
      code: this.code, // 验证码
      device_type: this.device_type // 设备类型
    }
  }

  get forgotForm() {
    return this.basicForm
  }

  // 邮箱重置密码
  get mailForgotPassForm() {
    return {
      account: this.account, // 账号
      code: this.code, // 验证码
      password: this.encrypt(this.password) // 密码
    }
  }

  get mailNewForgotPassForm() {
    return {
      mail: this.encrypt(this.mail), // 账号
      code: this.code, // 验证码
      password: this.encrypt(this.password) // 密码
    }
  }

  get PhoneForgotPassForm() {
    return {
      mobile: this.encrypt(this.fullMobile),
      password: this.encrypt(this.password),
      code: this.code // 验证码
    }
  }

  encrypt(str) {
    if (!this._isActiveEncrypt) return str
    return encryptByRSA(str)
  }
}
