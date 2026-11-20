import {
  cryptoLogin,
  mailCryptoLogin,
  cryptoRegister,
  cryptoMailRegister,
  cryptoForgotPassword,
  mailCryptoForgotPassword,
  getMailCode,
  cryptoSendCode
} from '@/api/user'
import { getQiniuToken } from '@/api/common'
import UserForm from '../models/userFormModel'
import { encryptByAES } from '@/utils/crypto'
import { skipEnterIfReported } from '@/utils/onlineReport'

const getDefaultState = () => {
  return {
    showLoginMask: false,
    infoData: { isInit: true },
    QiniuToken: {}
  }
}

const state = getDefaultState()

const mutations = {
  SET_USERINFO: (state, data) => {
    if (!state.infoData.isInit && data?.id != state.infoData.id) {
      // if (!(data && data.payload && data.payload === 'loginOut')) {
      setTimeout(() => {
        // 本页已用新身份调过「进入系统」时，刷新后不再重复调用（例如带 token/userId 的地址打开）
        skipEnterIfReported(state.infoData)
        window.location.reload()
      }, 500)
      // }
    }

    state.infoData = data

    if (state.infoData.id) {
      localStorage.setItem('userInfo', encryptByAES(JSON.stringify(state.infoData)))
    } else {
      localStorage.setItem('userInfo', '{}')
    }
  },
  SET_LOGIN_MASK: (state, status) => {
    state.showLoginMask = status
  },
  // 设置七牛配置
  SET_QI_NIU_TOKEN: (state, data) => {
    state.QiniuToken = data
  }
}

const actions = {
  setQiniuToken: ({ commit }) => {
    return new Promise((resolve, reject) => {
      getQiniuToken()
        .then((res) => {
          const { data } = res
          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          commit('SET_QI_NIU_TOKEN', data)
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  async login({ commit }, userForm) {
    try {
      const currForm = new UserForm(userForm).loginForm
      const { data } = await cryptoLogin(currForm)

      if (!data) return Promise.reject({ msg: '登录失败...' })

      commit('SET_USERINFO', data)

      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 邮箱模式登陆
  async mailLogin({ commit }, userForm) {
    try {
      const loginForm = new UserForm(userForm).mailLoginForm
      const { data } = await mailCryptoLogin(loginForm)

      if (!data) return Promise.reject({ msg: '登录失败...' })

      commit('SET_USERINFO', data)

      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },
  signUp(store, userForm) {
    return new Promise((resolve, reject) => {
      const currForm = new UserForm(userForm).signUpForm
      cryptoRegister(currForm)
        .then(() => {
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // 邮箱注册
  mailSignUp(store, userForm) {
    const mailForm = new UserForm(userForm).mailSignUpForm
    return cryptoMailRegister(mailForm)
  },

  forgot(store, userForm) {
    return new Promise((resolve, reject) => {
      const currForm = new UserForm(userForm).forgotForm
      cryptoForgotPassword(currForm)
        .then((res) => {
          const { data } = res
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // 邮箱重置密码
  mailForgotPass(store, userForm) {
    const mailForgotForm = new UserForm(userForm).mailForgotPassForm
    return mailCryptoForgotPassword(mailForgotForm)
  },
  sendVerifyCode(store, userForm) {
    if (userForm.mail) {
      const mail = new UserForm(userForm).sendNewMailCodeForm
      return cryptoSendCode({
        ...userForm,
        ...mail
      })
    }
    return cryptoSendCode(new UserForm(userForm).sendCodeForm)
  },
  // 获取邮箱验证码
  mailSendVerifyCode(store, userForm) {
    return getMailCode(new UserForm(userForm).sendMailCodeForm)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
