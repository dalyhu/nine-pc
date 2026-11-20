import { IM_STATUS } from '@/enums'
import { buildWsUrl, buildAuthFrame } from './wsAuth.js'
export default class WsHelper {
  static instance = null
  static handleMessage = () => null
  static handleStateChange = () => null
  static reconnectTimer = null
  static heartTimer = null
  static reconnectedCount = 0
  static STATUS = IM_STATUS.INIT
  static HEART_INTERVAL = 10000
  static MAX_RECONNECT_COUNT = Infinity
  static MAX_CONNECTING_TIME = 40000
  static config = null

  // 销毁方法
  static destroy() {
    this.STATUS = IM_STATUS.INIT
    this.handleStateChange(this.STATUS)

    if (this.heartTimer) {
      clearTimeout(this.heartTimer)
      this.heartTimer = null
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (!this.instance) return

    // 尝试关闭上一次 socket 链接
    try {
      // 旧实例迟到的 open 不能再发送认证
      this.instance.onopen = null
      this.instance.onerror = null
      this.instance.onclose = null
      this.instance.onmessage = null
      typeof this.instance.close === 'function' && this.instance.close()
      this.instance = null
    } catch (error) {
      console.error(error)
    }
  }

  // 链接成功，清空重连计数，开启心跳 重新订阅
  static handleOpen() {
    this.STATUS = IM_STATUS.CONNECTED
    this.handleStateChange(this.STATUS)
    this.reconnectedCount = 0

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.heart()
  }

  // 通信发生错误时触发
  static handleError() {
    // console.log(handleStateChange, '--------------error-----------')
    this.STATUS = IM_STATUS.ERROR
    this.handleStateChange(this.STATUS)
  }

  // 连接关闭时触发
  static handleClose() {
    this.STATUS = IM_STATUS.CLOSE
    this.handleStateChange(this.STATUS)
  }

  static connect(config) {
    this.config = { ...config }
    const { handleMessage, handleStateChange } = this.config
    // 必须早于 destroy()：destroy 内部会派发 INIT 状态
    this.handleStateChange = handleStateChange

    this.destroy()

    this.handleMessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.action === 'open') {
        handleMessage(data)
        this.handleOpen()
        return
      }

      handleMessage(data)
    }

    // 重连过程中，直接跳过
    if (this.STATUS === IM_STATUS.CONNECTING) return
    this.STATUS = IM_STATUS.CONNECTING
    this.handleStateChange(this.STATUS)

    // 超过最大重连次数，提示用户刷新页面
    this.reconnectedCount++
    if (this.reconnectedCount > this.MAX_RECONNECT_COUNT) {
      this.STATUS = IM_STATUS.EXCEED_COUNT
      this.handleStateChange(this.STATUS)
      return
    }

    // 重连超时，自动进行下一次重连
    this.reconnectTimer = setTimeout(() => {
      this.STATUS = IM_STATUS.TIMEOUT
      this.handleStateChange(this.STATUS)
    }, this.MAX_CONNECTING_TIME)

    try {
      // 获取链接信息
      const { token, protocol, host } = this.config

      // 创建新的 socket 对象
      if (this.STATUS !== IM_STATUS.CONNECTED) {
        // 握手地址不带 Token，连接建立后再用消息认证；收到服务端 open 帧才算连上
        const ws = new WebSocket(buildWsUrl({ protocol, host }))
        ws.onopen = () => {
          try {
            ws.send(buildAuthFrame(token))
          } catch (error) {
            console.error(error)
          }
        }
        this.instance = ws
      }

      // 回调里的 this 会指向 WebSocket 实例，必须绑回类
      this.instance.onerror = () => this.handleError()
      this.instance.onclose = () => this.handleClose()
      this.instance.onmessage = this.handleMessage
    } catch (error) {
      this.handleError()
    }
  }

  static heart() {
    this.heartTimer = setTimeout(() => {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      if (this.instance?.readyState === 1) {
        // 如果连接正常
        this.instance.send(JSON.stringify('heart')) // 这里可以自己跟后端约定
        this.heart()
      } else {
        // 否则重连
        this.STATUS = IM_STATUS.HEART_TIMEOUT
        this.handleStateChange(this.STATUS)
      }
    }, this.HEART_INTERVAL)
  }

  static send(data) {
    // 认证成功（收到 open 帧）前不发业务消息，订阅会在连上后重发
    if (this.STATUS !== IM_STATUS.CONNECTED) return
    this.instance?.send(JSON.stringify(data))
  }
}
