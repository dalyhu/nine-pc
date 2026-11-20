// wasm 环境 模块载入

import store from '@/store'

const state = {}

const mutations = {}

const actions = {
  async i()
  {
    try {
      // 存储 wasm 模块
      const uri = '/upload/wasm/a/w.min.js?t=' + Math.floor(Date.now() / 5000)
      Object.defineProperty(store, 'var', {
        configurable: false,
        writable    : false,
        enumerable  : false, // 不列举，不被序列化
        value       :
        /* @vite-ignore */
          import(window['location']['origin'] + uri)
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


