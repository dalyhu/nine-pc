import axios from 'axios'
import { decryptData } from '@/utils/crypto'
import { debounce, divide, subtract } from 'lodash-es'
import store from '@/store'
import { e, IM } from '@/utils/im'
import { c } from './c/'

let tipsVisible  = false
const handleTips = debounce(
  (time, msg) => {
    if (tipsVisible) return
    tipsVisible = true
    store.commit('setSysDiffTime', subtract(time, divide(Date.now(), 1000)))
    ElMessageBox.alert(msg, {
      appendTo         : 'body',
      confirmButtonText: '刷新页面',
      callback         : () => window.location.reload()
    })
  },
  3000,
  { leading: true }
)

const handleError = debounce(
  (res, resConfig) => {
    if (tipsVisible) return
    // 后台返回code不统一处理
    let exCludesList = [
      '/api/mars_api_cache_proxy/eGameRoundInfo',
      '/api/mars_api_cache_proxy/teamData',
      '/api/mars_api_cache_proxy/realTimeData'
    ]

    if (res.code === 1) {
      if (res.msg === 'connection token error') {
        IM.connect()
      } else if (
        !(resConfig.url.includes('api/chat') || resConfig.url.includes('api/front/buriedPoint'))
      )
      {
        //电竞接口，后台不愿处理！！！
        if (exCludesList.includes(resConfig.url)) {
          return res.msg ? ElMessage.success(res.msg) : null
        } else {
          ElMessage.error(res.msg || '未知异常')
        }
      }
    } else if (res.code === 700) {
      ElMessage.error(res.msg || '登录状态失效，请您重新登录')
      // logout 不再 commit Vuex，必须整页刷新重建 store，
      // 否则界面残留登录态、后续请求继续用失效 token 签名
      store.dispatch('logout').finally(() => {
        setTimeout(() => window.location.reload(), 1500)
      })
    }
  },
  3000,
  { leading: true }
)

const service = axios.create({
  baseURL        : '/',
  withCredentials: false,
  timeout        : 60 * 1000
})

// function processParams(config, uid, channelCode, deviceId, versionOS) {
//   const key = /(get|delete)/.test(config.method) ? 'params' : 'data'
//   let params = config[key] || {}

//   params.channel_code = channelCode

//   const [sign, time] = paramsSign()(params, config.url, store.state, [
//     () => tsg(store.state.sysDiffTime),
//     ObjectToQueryString,
//     () => [kpsg, deviceId, () => [sg, uid], ksg]
//   ])
//   config.headers['xiao9-sign'] = sign
//   config.headers['xiao9-time'] = time

//   if (config.method === 'upload') {
//     const formData = new FormData()
//     Object.keys(params).forEach((k) => formData.append(k, params[k] == null ? '' : params[k]))
//     params = formData
//     config.method = 'post'
//   } else {
//     Object.keys(params).forEach((k) => (params[k] = params[k] == null ? '' : params[k]))
//   }

//   config[key] = params

//   generateSign(config.url, params, time, uid, deviceId, versionOS)
// }

service.interceptors.request.use(
  (cfg) => c(cfg, e),
  (error) => Promise.reject(error)
)

service.interceptors.response.use(
  (response) => {
    const res     = response.data || {}
    const headers = response.headers || {}
    const id      = parseInt(headers['xiao9-visitor'])
    const token   = headers['xiao9-visitor-token']

    if (!isNaN(id) && token) store.commit('setVisitorInfo', { id, token })

    if (res.code === 0) {
      if (res.sec) res.data = decryptData(res.sec)
      return res
    }

    // silentError：后台定时上报类接口（如在线心跳）出错时不打扰用户，只把错误返回给调用方
    if (!response.config?.silentError) handleError(res, response.config)

    return Promise.reject(res)
  },
  (error) => {
    const code     = error.code || ''
    const message  = error.message || ''
    const response = error.response || {}

    const time = parseFloat(response.headers?.['xiao9-time'])
    if (!isNaN(time) && !error.config?.silentError) handleTips(time, response.data?.msg)

    let info

    if (code === 'ECONNABORTED' || message === 'Network Error' || message.includes('timeout')) {
      info = { msg: '网络超时' }
    } else if (!response) {
      info = { msg: '未知异常' }
    } else {
      info = { ...response.data }
    }

    return Promise.reject(info)
  }
)
const toggleUrl = (url = '') => url.startsWith('/') ? url : '/' + url
export const http = {
  get   : (url, params) => service({
    url: toggleUrl(url), method: 'get', params
  }),
  post  : (url, data) => service({
    url: toggleUrl(url), method: 'post', data
  }),
  put   : (url, params) => service({
    url: toggleUrl(url), method: 'put', params
  }),
  delete: (url, params) => service({
    url: toggleUrl(url), method: 'delete', params
  })
}
export default service
