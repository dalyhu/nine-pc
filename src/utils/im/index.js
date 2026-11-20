import mittBus from '@/utils/mittBus'
import { IM_STATUS } from '@/enums'
import Worker from './ws-worker.js?worker'
import store from '@/store'

export const e = import.meta.env

export class IM {
  static type = 'ws'
  static state = IM_STATUS.INIT
  static connectedCount = 0
  static delayConnectTimer = null
  static worker = null
  static vids = []

  static destroy() {
    IM.worker?.postMessage({ action: 'destroy' })
  }

  static subscribe(vid) {
    if (!vid || IM.vids.some((item) => item === vid)) return
    IM.worker.postMessage({ action: 'subscribe', data: { vid } })
    IM.vids.push(vid)
  }

  static unsubscribe(vid) {
    if (vid == null) {
      IM.vids.forEach((item) => {
        IM.worker.postMessage({ action: 'unsubscribe', data: { vid: item } })
      })
      IM.vids = []
    } else {
      IM.worker.postMessage({ action: 'unsubscribe', data: { vid } })
      IM.vids = IM.vids.filter((item) => item !== vid)
    }
  }

  static isReady() {
    return new Promise((resolve) => {
      if (IM.state === IM_STATUS.CONNECTED) return resolve(true)

      let timer = setInterval(() => {
        if (IM.state === IM_STATUS.CONNECTED) {
          clearInterval(timer)
          timer = null
          resolve(true)
        }
      }, 100)
    })
  }

  static async connect() {
    if (IM.state === IM_STATUS.CONNECTING) return

    IM.handleStateChange(IM_STATUS.CONNECTING)

    try {
      const { type, worker } = IM
      const token = store.getters.token

      if (!token) {
        IM.handleStateChange(IM_STATUS.ERROR)
        return
      }

      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss'
      let host = window.location.hostname
      // 開發用, 本地调试使用
      if (import.meta.env.VITE_ENV === 'development') {
        host = import.meta.env.VITE_WS_HOST
      }

      worker.postMessage({
        action: 'connect',
        data: {
          type,
          token,
          protocol,
          host
        }
      })
    } catch {
      IM.handleStateChange(IM_STATUS.ERROR)
    }
  }

  static delayConnect() {
    if (IM.delayConnectTimer) return

    IM.delayConnectTimer = setTimeout(() => {
      IM.delayConnectTimer = null
      IM.connect()
    }, 2000)
  }

  static handleStateChange(data) {
    IM.state = data

    if (IM.state === IM_STATUS.CONNECTED) {
      IM.connectedCount++

      if (IM.connectedCount > 1) {
        IM.vids.forEach((item) => IM.subscribe(item))
        mittBus.emit('imOnMessage', { action: 'reconnected' })
      }

      return
    }

    if (IM.state === IM_STATUS.CONNECTING) {
      return
    }

    if (IM.state === IM_STATUS.EXCEED_COUNT) {
      return
    }

    if (IM.state === IM_STATUS.HEART_TIMEOUT || IM.state === IM_STATUS.TIMEOUT) {
      IM.connect()
      return
    }

    if (IM.state === IM_STATUS.ERROR || IM.state === IM_STATUS.CLOSE) {
      IM.delayConnect()

    }
  }

  static init(type = 'ws') {
    IM.type = type

    IM.worker = new Worker()
    IM.worker.onmessage = ({ data = {} }) => {
      if (data.action === 'tokenError') return IM.handleStateChange(IM_STATUS.ERROR)
      if (data.action === 'stateChange') return IM.handleStateChange(data.state)

      if (data.action === 'balanceChanged') {
        const { new_balance: newBalance, user_id: userid } = data
        const currentUserId = parseInt(store.state.user.infoData?.id, 10)

        if (newBalance != null && userid === currentUserId) {
          store.commit('user/SET_USERINFO', {
            ...store.state.user.infoData,
            balances: newBalance
          })
        }
      }

      mittBus.emit('imOnMessage', data)
    }

    IM.connect()
  }
}
