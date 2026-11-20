import { IM_STATUS } from '@/enums'

export class ScoreHelper {
  static instance = null
  static handleMessage = () => null
  static reconnectTimer = null
  static reconnectedCount = 0

  static match_id = ''
  // 主播id
  static uid = ''

  static STATUS = IM_STATUS.INIT
  static MAX_RECONNECT_COUNT = Infinity
  static MAX_CONNECTING_TIME = 40000

  static async init(match_id, uid, handleMessage) {
    ScoreHelper.handleMessage = (event) => handleMessage(JSON.parse(event.data))
    ScoreHelper.match_id = match_id
    ScoreHelper.user_id = uid
    await ScoreHelper.reconnect()
    return ScoreHelper
  }

  // 销毁方法
  static destroy() {
    if (ScoreHelper.reconnectTimer) {
      clearTimeout(ScoreHelper.reconnectTimer)
      ScoreHelper.reconnectTimer = null
    }

    if (!ScoreHelper.instance) return

    // 尝试关闭上一次 socket 链接
    try {
      ScoreHelper.instance.onopen = null
      ScoreHelper.instance.onerror = null
      ScoreHelper.instance.onclose = null
      ScoreHelper.instance.onmessage = null
      ScoreHelper.instance.close()
      ScoreHelper.instance = null
      ScoreHelper.STATUS = IM_STATUS.CLOSE
    } catch (error) {
      console.warn(error)
    }
  }

  // 链接成功，清空重连计数，开启心跳
  static handleOpen() {
    console.log('connected...................................................')
    ScoreHelper.STATUS = IM_STATUS.CONNECTED
    ScoreHelper.reconnectedCount = 0

    if (ScoreHelper.reconnectTimer) {
      clearTimeout(ScoreHelper.reconnectTimer)
      ScoreHelper.reconnectTimer = null
    }
  }

  // 通信发生错误时触发
  static handleError() {
    ScoreHelper.STATUS = IM_STATUS.ERROR
    console.log('reconnect::error...................................................')
    ScoreHelper.destroy()
    setTimeout(() => ScoreHelper.reconnect(), 6000)
  }

  // 连接关闭时触发
  static handleClose() {
    ScoreHelper.STATUS = IM_STATUS.CLOSE
    console.log('reconnect::close...................................................')
    ScoreHelper.destroy()
    setTimeout(() => ScoreHelper.reconnect(), 6000)
  }

  static async reconnect() {
    ScoreHelper.destroy()
    // 重连过程中，直接跳过
    if (ScoreHelper.STATUS === IM_STATUS.CONNECTING) return
    ScoreHelper.STATUS = IM_STATUS.CONNECTING
    // 超过最大重连次数，提示用户刷新页面
    ScoreHelper.reconnectedCount++
    if (ScoreHelper.reconnectedCount > ScoreHelper.MAX_RECONNECT_COUNT) {
      console.log('超过最大连接数')
      ScoreHelper.STATUS = IM_STATUS.CLOSE
      return
    }

    // 重连超时，自动进行下一次重连
    ScoreHelper.reconnectTimer = setTimeout(() => {
      ScoreHelper.STATUS = IM_STATUS.ERROR
      console.log('reconnect::overtime...................................................')
      ScoreHelper.reconnect()
    }, ScoreHelper.MAX_CONNECTING_TIME)

    try {
      if (!ScoreHelper.match_id) {
        ScoreHelper.handleError()
        return
      }

      const wsProtocol = window.location.protocol === 'http:' ? 'ws' : 'wss'
      let locationHost = window.location.hostname

      // 開發用, 本地调试使用
      if (import.meta.env.VITE_ENV === 'development') {
        locationHost = import.meta.env.VITE_WS_HOST
      }

      // 创建新的 socket 对象
      ScoreHelper.instance = new WebSocket(
        `${wsProtocol}://${locationHost}/wsc/?match_id=${ScoreHelper.match_id}&user_id=${ScoreHelper.user_id}`
      )
      ScoreHelper.instance.onopen = ScoreHelper.handleOpen
      ScoreHelper.instance.onerror = ScoreHelper.handleError
      ScoreHelper.instance.onclose = ScoreHelper.handleClose
      ScoreHelper.instance.onmessage = ScoreHelper.handleMessage
    } catch (error) {
      console.error(error)
      ScoreHelper.handleError()
    }
  }
}
