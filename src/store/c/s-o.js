// 加密 环境 设置 初始化

const state = {}

const mutations = {}

const actions = {

  async i()
  {
    try {
      // Inject secure token for Wasm verification 用于 跟项目绑定
      Object.defineProperty(window, '_k_s_', {
        configurable: false,
        writable    : false,
        enumerable  : false, // 不列举，不被序列化
        value       : '7f8d9a1b2c3e4f5g6h7i8j9k0l'
      })
    } finally {
      //
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

