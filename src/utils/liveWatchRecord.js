/**
 * 直播间观看行为上报（NX-2151，优化 NX-2082；状态机与 H5 NX-2122 逐条一致）
 *
 * 进入直播间满 10 秒上报一次「进入」，拿到会话 ID 后每 3 分钟上报一次「心跳」。
 * 以「主播 + 比赛 + 直播记录」作为「这一场」的标识：同一场不重复进入，换场时清掉旧的、重新计时。
 * 续期：心跳返回 data === false 表示会话过期，立即用这一场原来的参数重新 enter，拿到新会话后从此刻重新计 3 分钟。
 * 不依赖 Vue / store：请求函数和定时器由调用方传入，方便单测。
 * 需求与方案见 docs/NX-2151-直播间观看行为上报PC优化/。
 */

import { getPcClientType } from './onlineReportUtils.js' // client_type 与 PC 在线心跳共用这一份判断（PWA 窗口 4、普通标签页 1）

export const LIVE_WATCH_ENTER_DELAY = 10 * 1000
export const LIVE_WATCH_HEARTBEAT_INTERVAL = 3 * 60 * 1000

const isBlank = (v) => v === null || v === undefined || v === '' || v === 0 || v === '0'

/**
 * 从 getRoomInfo 返回的 res.data（{ userData, info }）取上报参数，并判断是否已关播。
 * 要在页面改写直播信息之前调用。
 * @returns {{ payload: { anchor_id, live_id, match_id, channel_code }, closed: boolean } | null}
 */
export function pickLiveWatchInfo(data, { fallbackAnchorId, channelCode } = {}) {
  const info = data?.info
  if (!info) return null
  const userUid = Number(data.userData?.uid)
  const infoUid = Number(info.uid)
  return {
    payload: {
      anchor_id: userUid > 0 ? userUid : infoUid > 0 ? infoUid : fallbackAnchorId,
      live_id: isBlank(info.live_id) ? (isBlank(info.id) ? '' : info.id) : info.live_id,
      match_id: info.match_id,
      channel_code: channelCode
    },
    // 与页面判断关播的条件一致
    closed: info.islive == null || Number(info.islive) === 2
  }
}

/**
 * 直播信息回包的闸门：丢弃过期回包；关播时作废所有已发出、还没同步的请求。
 */
export function createLiveInfoGate() {
  let issued = 0 // 已发出的最大序号
  let synced = 0 // 已同步的最大序号
  return {
    /** 发 getRoomInfo 前取序号；播放器重试的快照到达时也取一个 */
    issue() {
      issued += 1
      return issued
    },
    /** 回包是否还有效 */
    accept(seq) {
      return seq > synced
    },
    /** 确认同步成功后才推进（空信息、解析失败不推进） */
    commit(seq) {
      if (seq > synced) synced = seq
    },
    /** 关播：关播前发出的请求全部作废 */
    invalidate() {
      synced = issued
    }
  }
}

/**
 * @param {object} options
 * @param {(data: object) => Promise<any>} options.enter 进入接口，成功时 resolve 请求层的整包 res
 * @param {(data: object) => Promise<any>} options.heart 心跳接口，同上
 * @param {() => number} [options.getClientType] 取 client_type，默认 getPcClientType(window)；创建时调用一次
 * @param {object} [options.timers] 提供 setTimeout / clearTimeout / setInterval / clearInterval，默认 window（单测传假的）
 * @param {{ warn: Function }} [options.logger]
 */
export function createLiveWatchRecord({ enter, heart, getClientType = () => getPcClientType(window), timers = window, logger = console }) {
  // 打开直播间页面时判断一次，这一页的进入、换场、续期都用它：PWA 窗口里视频全屏时 display-mode 会变成 fullscreen，
  // 每场重新判断会把全屏中的换场误报成 1；在线心跳也是加载时判断一次
  const clientType = getClientType()
  let enterTimer = null
  let heartbeatTimer = null
  let sessionId = ''
  let currentKey = '' // `${anchor_id}|${match_id}|${live_id}`，空表示没有在上报的一场
  let closed = false // 当前这一场已关播
  let generation = 0 // 每次开始、关播或停止都加一，用来丢弃过期的进入、心跳、续期回包
  let enterData = null // 这一场的上报参数，首次进入和续期共用
  let renewingGen = null // 续期令牌：正在续期的那一批的批次号，null 表示没有续期在途

  // 统一包成 Promise，请求函数同步抛错也走 catch
  const call = (fn, data) => Promise.resolve().then(() => fn(data))

  const keyOf = (payload) => `${payload.anchor_id}|${payload.match_id ?? ''}|${payload.live_id ?? ''}`

  const clearAll = () => {
    generation += 1
    if (enterTimer) {
      timers.clearTimeout(enterTimer)
      enterTimer = null
    }
    if (heartbeatTimer) {
      timers.clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
    sessionId = ''
  }

  const startHeartbeat = (id) => {
    if (heartbeatTimer) timers.clearInterval(heartbeatTimer)
    sessionId = id
    heartbeatTimer = timers.setInterval(() => {
      const gen = generation
      const sid = sessionId
      call(heart, { watchSessionId: sid })
        .then((res) => {
          // 已离开、换场、关播，或续期后才回来的旧会话心跳：丢弃
          if (gen !== generation || sid !== sessionId) return
          if (res?.data === false) renew(gen) // 会话已过期，续期
        })
        .catch((err) => {
          // 单次失败跳过，等下一个周期
          logger.warn('直播间观看心跳上报失败:', err)
        })
    }, LIVE_WATCH_HEARTBEAT_INTERVAL)
  }

  // 续期：立即用这一场原来的参数重新 enter；失败则保留旧会话，等下一次心跳
  const renew = (gen) => {
    if (renewingGen === gen) return // 这一批已有续期在途
    renewingGen = gen
    call(enter, enterData)
      .then((res) => {
        if (gen !== generation) return
        const id = res?.data?.watch_session_id
        if (!id) {
          logger.warn('直播间观看续期未返回 watch_session_id:', res)
          return
        }
        startHeartbeat(id) // 换新会话，从此刻重新计 3 分钟
      })
      .catch((err) => {
        if (gen === generation) logger.warn('直播间观看续期失败:', err)
      })
      .finally(() => {
        if (renewingGen === gen) renewingGen = null // 只释放自己的令牌
      })
  }

  const doEnter = (data, gen) => {
    enterTimer = null
    call(enter, data)
      .then((res) => {
        if (gen !== generation) return // 已离开、换场或关播，丢弃
        const id = res?.data?.watch_session_id
        if (!id) {
          logger.warn('进入直播间埋点未返回 watch_session_id:', res)
          return
        }
        startHeartbeat(id)
      })
      .catch((err) => {
        if (gen === generation) logger.warn('进入直播间埋点上报失败:', err)
      })
  }

  return {
    /**
     * 开始上报这一场。同一场已经在上报（计时中、心跳中、进入失败或已关播）时直接返回。
     * @param {{ anchor_id, live_id, match_id, channel_code }} payload
     */
    start(payload) {
      if (!payload || !payload.anchor_id) return
      const key = keyOf(payload)
      if (key === currentKey) return

      clearAll()
      currentKey = key
      closed = false
      const gen = generation
      enterData = {
        anchor_id: payload.anchor_id,
        live_id: payload.live_id,
        match_id: payload.match_id,
        channel_code: payload.channel_code,
        client_type: clientType
      }
      const data = enterData
      enterTimer = timers.setTimeout(() => doEnter(data, gen), LIVE_WATCH_ENTER_DELAY)
    },

    /**
     * 关播：取消还没发出的进入、停止心跳、清空会话 ID，并记住这一场已关播，之后同一场的 start 会被忽略。
     * @param {object} [payload] 打开时已关播的情况传入这一场；不传则沿用当前这一场
     */
    markClosed(payload) {
      clearAll()
      if (payload && payload.anchor_id) currentKey = keyOf(payload)
      closed = true
    },

    /** 离开直播间：全部清掉。 */
    stop() {
      clearAll()
      currentKey = ''
      closed = false
    },

    /** 只给单测和调试用。 */
    get state() {
      return {
        key: currentKey,
        sessionId,
        closed,
        entering: !!enterTimer,
        heartbeating: !!heartbeatTimer,
        renewing: renewingGen === generation
      }
    }
  }
}
