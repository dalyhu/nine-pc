/* global globalThis */ // 单测 34 临时提供假的全局 window
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  createLiveWatchRecord,
  createLiveInfoGate,
  pickLiveWatchInfo,
  LIVE_WATCH_ENTER_DELAY,
  LIVE_WATCH_HEARTBEAT_INTERVAL
} from './liveWatchRecord.js'

const flush = async () => {
  for (let i = 0; i < 6; i++) await Promise.resolve()
}

// 可手动推进的假定时器
function createClock() {
  let now = 0
  let seq = 0
  const tasks = new Map()
  const add = (fn, delay, repeat) => {
    const id = ++seq
    tasks.set(id, { fn, at: now + delay, delay, repeat })
    return id
  }
  return {
    setTimeout: (fn, delay) => add(fn, delay, false),
    setInterval: (fn, delay) => add(fn, delay, true),
    clearTimeout: (id) => tasks.delete(id),
    clearInterval: (id) => tasks.delete(id),
    get pending() {
      return tasks.size
    },
    get now() {
      return now
    },
    async tick(ms) {
      const end = now + ms
      for (;;) {
        let next = null
        for (const [id, t] of tasks) if (t.at <= end && (!next || t.at < next[1].at)) next = [id, t]
        if (!next) break
        const [id, t] = next
        now = t.at
        if (t.repeat) t.at = now + t.delay
        else tasks.delete(id)
        t.fn()
        await flush()
      }
      now = end
      await flush()
    }
  }
}

// 可手动控制何时返回的 Promise
function deferred() {
  let resolve
  let reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

// PC 请求层成功时返回整包 { code: 0, data }
const ok = (data) => Promise.resolve({ code: 0, msg: '操作成功', data })
const session = (id) => ok({ watch_session_id: id })

// 假接口：记录调用；enter / heart 的返回可以逐次指定
function createApi({ enter = () => session('S1'), heart = () => ok(true) } = {}) {
  const enters = []
  const hearts = []
  return {
    enters,
    hearts,
    enter: (data) => {
      enters.push(data)
      return enter(data, enters.length)
    },
    heart: (data) => {
      hearts.push(data)
      return heart(data, hearts.length)
    }
  }
}

const silentLogger = { warn() {} }
const roomA = { anchor_id: 101, live_id: 9001, match_id: 501, channel_code: 'AAA' }
const roomB = { anchor_id: 101, live_id: 9002, match_id: 502, channel_code: 'AAA' }

function setup(apiOptions, getClientType = () => 1) {
  const clock = createClock()
  const api = createApi(apiOptions)
  const record = createLiveWatchRecord({ enter: api.enter, heart: api.heart, getClientType, timers: clock, logger: silentLogger })
  return { clock, api, record }
}

const ENTER = LIVE_WATCH_ENTER_DELAY
const BEAT = LIVE_WATCH_HEARTBEAT_INTERVAL

test('常量：10 秒进入，3 分钟心跳', () => {
  assert.equal(ENTER, 10 * 1000)
  assert.equal(BEAT, 3 * 60 * 1000)
})

test('1 满 10 秒才进入，参数含 client_type（普通标签页 1）（R1）', async () => {
  const { clock, api, record } = setup()
  record.start(roomA)
  await clock.tick(ENTER - 1)
  assert.equal(api.enters.length, 0)
  await clock.tick(1)
  assert.deepEqual(api.enters, [{ ...roomA, client_type: 1 }])
})

test('2 10 秒内 stop 不进入（R2）', async () => {
  const { clock, api, record } = setup()
  record.start(roomA)
  await clock.tick(5000)
  record.stop()
  await clock.tick(BEAT)
  assert.equal(api.enters.length, 0)
  assert.equal(clock.pending, 0)
})

test('3 进入成功后每 3 分钟一次心跳，参数是 { watchSessionId }（R3）', async () => {
  const { clock, api, record } = setup()
  record.start(roomA)
  await clock.tick(ENTER)
  await clock.tick(BEAT - 1)
  assert.equal(api.hearts.length, 0)
  await clock.tick(1)
  await clock.tick(BEAT)
  assert.deepEqual(api.hearts, [{ watchSessionId: 'S1' }, { watchSessionId: 'S1' }])
})

test('4 会话 ID 从整包 res.data 取；H5 那种解包后的结构取不到（I3）', async () => {
  const pc = setup()
  pc.record.start(roomA)
  await pc.clock.tick(ENTER + BEAT)
  assert.equal(pc.api.hearts.length, 1)

  const h5 = setup({ enter: () => Promise.resolve({ watch_session_id: 'S1' }) })
  h5.record.start(roomA)
  await h5.clock.tick(ENTER + BEAT)
  assert.equal(h5.api.hearts.length, 0)
})

test('5 进入失败或没有会话 ID：不发心跳；同一场再 start 不重试（R4）', async () => {
  for (const enter of [() => Promise.reject({ code: 1 }), () => ok({})]) {
    const { clock, api, record } = setup({ enter })
    record.start(roomA)
    await clock.tick(ENTER)
    record.start(roomA)
    await clock.tick(BEAT * 2)
    assert.equal(api.enters.length, 1)
    assert.equal(api.hearts.length, 0)
  }
})

test('6 心跳失败跳过，下一个周期照发，会话不变（R5）', async () => {
  const { clock, api, record } = setup({ heart: (d, n) => (n === 1 ? Promise.reject({ code: 1 }) : ok(true)) })
  record.start(roomA)
  await clock.tick(ENTER + BEAT * 2)
  assert.deepEqual(api.hearts, [{ watchSessionId: 'S1' }, { watchSessionId: 'S1' }])
})

test('7 进入请求未回时 stop：回包被丢弃，不启动心跳（R6，P1）', async () => {
  const d = deferred()
  const { clock, api, record } = setup({ enter: () => d.promise })
  record.start(roomA)
  await clock.tick(ENTER)
  record.stop()
  d.resolve({ code: 0, data: { watch_session_id: 'S1' } })
  await clock.tick(BEAT * 2)
  assert.equal(api.hearts.length, 0)
  assert.equal(clock.pending, 0)
})

test('8 换场（比赛变、主播变、只有直播记录变）：清掉旧的，新一场重新计 10 秒（R7）', async () => {
  for (const next of [roomB, { ...roomA, anchor_id: 102 }, { ...roomA, live_id: 9003 }]) {
    const { clock, api, record } = setup({ enter: (d, n) => session(`S${n}`) })
    record.start(roomA)
    await clock.tick(ENTER + BEAT)
    record.start(next)
    await clock.tick(ENTER - 1)
    assert.equal(api.enters.length, 1)
    await clock.tick(1)
    assert.deepEqual(api.enters[1], { ...next, client_type: 1 })
    await clock.tick(BEAT)
    assert.deepEqual(api.hearts.at(-1), { watchSessionId: 'S2' })
    assert.equal(api.hearts.filter((h) => h.watchSessionId === 'S1').length, 1)
  }
})

test('9 进入请求未回时换场：旧回包被丢弃（R7，P2）', async () => {
  const first = deferred()
  const { clock, api, record } = setup({ enter: (d, n) => (n === 1 ? first.promise : session('S2')) })
  record.start(roomA)
  await clock.tick(ENTER)
  record.start(roomB)
  first.resolve({ code: 0, data: { watch_session_id: 'S1' } })
  await clock.tick(ENTER + BEAT * 2)
  assert.ok(api.hearts.length > 0)
  assert.ok(api.hearts.every((h) => h.watchSessionId === 'S2'))
})

test('10 同一场重复 start：只进入一次，会话不变（R8）', async () => {
  const { clock, api, record } = setup()
  record.start(roomA)
  await clock.tick(3000)
  record.start({ ...roomA })
  await clock.tick(ENTER + BEAT)
  record.start({ ...roomA })
  await clock.tick(BEAT)
  assert.equal(api.enters.length, 1)
  assert.equal(api.hearts.length, 2)
})

test('11 markClosed：10 秒内则不进入；心跳停止；会话 ID 清空；之后同一场 start 不再进入（R9、P4、P9）', async () => {
  const early = setup()
  early.record.start(roomA)
  await early.clock.tick(5000)
  early.record.markClosed()
  early.record.start(roomA)
  await early.clock.tick(ENTER + BEAT)
  assert.equal(early.api.enters.length, 0)

  const late = setup()
  late.record.start(roomA)
  await late.clock.tick(ENTER + BEAT)
  late.record.markClosed()
  assert.equal(late.record.state.sessionId, '')
  assert.equal(late.record.state.closed, true)
  late.record.start(roomA)
  await late.clock.tick(BEAT * 2)
  assert.equal(late.api.enters.length, 1)
  assert.equal(late.api.hearts.length, 1)
  assert.equal(late.clock.pending, 0)
})

test('11a 进入请求未回时 markClosed：回包被丢弃（R9）', async () => {
  const d = deferred()
  const { clock, api, record } = setup({ enter: () => d.promise })
  record.start(roomA)
  await clock.tick(ENTER)
  record.markClosed()
  d.resolve({ code: 0, data: { watch_session_id: 'S1' } })
  await clock.tick(BEAT * 2)
  assert.equal(api.hearts.length, 0)
})

test('11b 打开时已关播：markClosed(payload) 不进入，之后同一场 start 也不进入（R10、P3）', async () => {
  const { clock, api, record } = setup()
  record.markClosed(roomA)
  record.start(roomA)
  await clock.tick(ENTER + BEAT)
  assert.equal(api.enters.length, 0)
  assert.equal(record.state.key, '101|501|9001')
})

test('12 关播后同主播同比赛、新的直播记录：重新进入（R9、D8）', async () => {
  const { clock, api, record } = setup()
  record.start(roomA)
  await clock.tick(ENTER)
  record.markClosed()
  record.start({ ...roomA, live_id: 9100 })
  await clock.tick(ENTER)
  assert.equal(api.enters.length, 2)
  assert.equal(api.enters[1].live_id, 9100)
})

test('13 没有 anchor_id 不开始；match_id 为空照常进入', async () => {
  const { clock, api, record } = setup()
  record.start({ ...roomA, anchor_id: '' })
  await clock.tick(ENTER)
  assert.equal(api.enters.length, 0)
  record.start({ ...roomA, match_id: '' })
  await clock.tick(ENTER)
  assert.equal(api.enters.length, 1)
  assert.equal(api.enters[0].match_id, '')
})

// ---- pickLiveWatchInfo ----

test('14 anchor_id 优先顺序：userData.uid > info.uid > fallbackAnchorId', () => {
  const info = { id: 1, uid: 22, islive: 1 }
  assert.equal(pickLiveWatchInfo({ userData: { uid: 11 }, info }, { fallbackAnchorId: 33 }).payload.anchor_id, 11)
  assert.equal(pickLiveWatchInfo({ userData: { uid: 0 }, info }, { fallbackAnchorId: 33 }).payload.anchor_id, 22)
  assert.equal(pickLiveWatchInfo({ userData: {}, info: { id: 1, islive: 1 } }, { fallbackAnchorId: 33 }).payload.anchor_id, 33)
})

test('15 live_id：优先 info.live_id，为空值时取 info.id（D12）', () => {
  const pick = (info) => pickLiveWatchInfo({ userData: { uid: 1 }, info: { islive: 1, ...info } }, {}).payload.live_id
  assert.equal(pick({ live_id: 7, id: 2406 }), 7)
  for (const blank of [null, undefined, '', 0, '0']) assert.equal(pick({ live_id: blank, id: 2406 }), 2406)
  assert.equal(pick({}), '')
})

test('15a 同一场两次返回得到相同标识（live_id 一次有、一次没有但值相同）', async () => {
  const { clock, api, record } = setup()
  const a = pickLiveWatchInfo({ userData: { uid: 101 }, info: { id: 9001, match_id: 501, islive: 1 } }, { channelCode: 'AAA' })
  const b = pickLiveWatchInfo({ userData: { uid: 101 }, info: { live_id: 9001, id: 9001, match_id: 501, islive: 1 } }, { channelCode: 'AAA' })
  record.start(a.payload)
  record.start(b.payload)
  await clock.tick(ENTER)
  assert.equal(api.enters.length, 1)
})

test('16 match_id 为空照样返回；channel_code 原样带上', () => {
  const r = pickLiveWatchInfo({ userData: { uid: 1 }, info: { id: 2, islive: 1 } }, { channelCode: 'CH' })
  assert.equal(r.payload.match_id, undefined)
  assert.equal(r.payload.channel_code, 'CH')
})

test('17 关播判断与页面一致：islive 为 null、未定义、2、"2" 算关播，1 不算（R10）', () => {
  const closed = (islive) => pickLiveWatchInfo({ userData: { uid: 1 }, info: { id: 2, islive } }, {}).closed
  assert.equal(closed(null), true)
  assert.equal(closed(undefined), true)
  assert.equal(closed(2), true)
  assert.equal(closed('2'), true)
  assert.equal(closed(1), false)
})

test('18 没有 info 时返回 null', () => {
  assert.equal(pickLiveWatchInfo({ userData: {} }, {}), null)
  assert.equal(pickLiveWatchInfo(undefined, {}), null)
})

// ---- 续期（R17） ----

// 第 n 次心跳返回 false，其余 true
const falseAt = (...ns) => (d, n) => ok(ns.includes(n) ? false : true)

test('19 心跳返回 data === false：立即续期，参数与首次相同；之后用新会话从续期成功时起每 3 分钟', async () => {
  const { clock, api, record } = setup({ enter: (d, n) => session(`S${n}`), heart: falseAt(1) })
  record.start(roomA)
  await clock.tick(ENTER + BEAT) // 第 1 次心跳返回 false，立即续期
  assert.equal(api.enters.length, 2)
  assert.deepEqual(api.enters[1], api.enters[0])
  await clock.tick(BEAT)
  assert.deepEqual(api.hearts, [{ watchSessionId: 'S1' }, { watchSessionId: 'S2' }])
})

test('20 心跳返回 true、null、没有 data、字符串 "false"：都不续期', async () => {
  for (const res of [{ code: 0, data: true }, { code: 0, data: null }, { code: 0 }, { code: 0, data: 'false' }, undefined]) {
    const { clock, api, record } = setup({ heart: () => Promise.resolve(res) })
    record.start(roomA)
    await clock.tick(ENTER + BEAT * 2)
    assert.equal(api.enters.length, 1)
  }
})

test('21 续期失败或没有会话 ID：保留旧会话；再遇 false 再续期；两次心跳之间不重试', async () => {
  for (const failed of [() => Promise.reject({ code: 1 }), () => ok({})]) {
    const { clock, api, record } = setup({
      enter: (d, n) => (n === 1 ? session('S1') : n === 2 ? failed() : session('S3')),
      heart: falseAt(1, 2)
    })
    record.start(roomA)
    await clock.tick(ENTER + BEAT) // 心跳 1 false → 续期失败
    assert.equal(api.enters.length, 2)
    await clock.tick(BEAT - 1)
    assert.equal(api.enters.length, 2)
    await clock.tick(1) // 心跳 2 仍用 S1，返回 false → 再续期成功
    assert.equal(api.hearts[1].watchSessionId, 'S1')
    assert.equal(api.enters.length, 3)
    await clock.tick(BEAT)
    assert.equal(api.hearts[2].watchSessionId, 'S3')
  }
})

test('22 续期在途时 stop / markClosed / 换场：续期回包被丢弃，不启动新心跳', async () => {
  for (const action of ['stop', 'markClosed', 'switch']) {
    const renewing = deferred()
    const { clock, api, record } = setup({
      enter: (d, n) => (n === 1 ? session('S1') : n === 2 ? renewing.promise : session('SB')),
      heart: falseAt(1)
    })
    record.start(roomA)
    await clock.tick(ENTER + BEAT)
    assert.equal(api.enters.length, 2)
    if (action === 'stop') record.stop()
    else if (action === 'markClosed') record.markClosed()
    else record.start(roomB)
    renewing.resolve({ code: 0, data: { watch_session_id: 'S2' } })
    await clock.tick(ENTER + BEAT * 2)
    assert.ok(api.hearts.every((h) => h.watchSessionId !== 'S2'), action)
    if (action === 'switch') assert.ok(api.hearts.slice(1).every((h) => h.watchSessionId === 'SB'))
    else assert.equal(clock.pending, 0, action)
  }
})

test('22a 续期令牌：旧续期挂起时新一场仍能续期；旧续期晚回来不影响新一场', async () => {
  const oldRenew = deferred()
  const { clock, api, record } = setup({
    enter: (d, n) => (n === 1 ? session('S1') : n === 2 ? oldRenew.promise : n === 3 ? session('B1') : session('B2')),
    heart: falseAt(1, 2)
  })
  record.start(roomA)
  await clock.tick(ENTER + BEAT) // A 心跳 false，A 续期挂起
  record.start(roomB)
  await clock.tick(ENTER) // B 进入 → B1
  await clock.tick(BEAT) // B 心跳 false → B 续期
  assert.equal(api.enters.length, 4)
  oldRenew.reject({ code: 1 }) // 旧续期晚回来
  await clock.tick(BEAT)
  assert.deepEqual(api.hearts.at(-1), { watchSessionId: 'B2' })
  assert.equal(clock.pending, 1)
})

test('22b 续期令牌：新一场续期挂起时旧续期晚回来，不能解开新一场的锁', async () => {
  const oldRenew = deferred()
  const newRenew = deferred()
  const { clock, api, record } = setup({
    enter: (d, n) => (n === 1 ? session('S1') : n === 2 ? oldRenew.promise : n === 3 ? session('B1') : newRenew.promise),
    heart: () => ok(false)
  })
  record.start(roomA)
  await clock.tick(ENTER + BEAT) // A 续期挂起
  record.start(roomB)
  await clock.tick(ENTER + BEAT) // B 心跳 false → B 续期挂起
  assert.equal(api.enters.length, 4)
  oldRenew.reject({ code: 1 }) // 旧续期晚回来
  await clock.tick(BEAT) // B 下一次心跳又是 false：B 续期仍在途，不能再续期
  assert.equal(api.enters.length, 4)
})

test('23 续期在途、下一次心跳又返回 false：不发起第二次续期', async () => {
  const renewing = deferred()
  const { clock, api, record } = setup({
    enter: (d, n) => (n === 1 ? session('S1') : renewing.promise),
    heart: () => ok(false)
  })
  record.start(roomA)
  await clock.tick(ENTER + BEAT * 3)
  assert.equal(api.enters.length, 2)
})

test('24 心跳在 stop 之后才回来、且为 false：不续期', async () => {
  const beat = deferred()
  const { clock, api, record } = setup({ heart: () => beat.promise })
  record.start(roomA)
  await clock.tick(ENTER + BEAT)
  record.stop()
  beat.resolve({ code: 0, data: false })
  await clock.tick(BEAT)
  assert.equal(api.enters.length, 1)
})

test('26 旧会话心跳晚到：H1 挂起，H2 返回 false 并续期成功，H1 再返回 false 也不再续期', async () => {
  const h1 = deferred()
  const { clock, api, record } = setup({
    enter: (d, n) => session(`S${n}`),
    heart: (d, n) => (n === 1 ? h1.promise : n === 2 ? ok(false) : ok(true))
  })
  record.start(roomA)
  await clock.tick(ENTER + BEAT * 2) // H1 挂起，H2 false → 续期得到 S2
  assert.equal(api.enters.length, 2)
  h1.resolve({ code: 0, data: false })
  await clock.tick(BEAT)
  assert.equal(api.enters.length, 2)
  assert.deepEqual(api.hearts.at(-1), { watchSessionId: 'S2' })
  assert.equal(clock.pending, 1)
})

test('27 续期回包延迟 20 秒：旧节奏的时刻不发心跳，续期成功后 3 分钟正好一次；连续续期只有一个心跳定时器', async () => {
  const renew = deferred()
  const { clock, api, record } = setup({
    enter: (d, n) => (n === 1 ? session('S1') : n === 2 ? renew.promise : session('S3')),
    heart: falseAt(1, 2)
  })
  record.start(roomA)
  await clock.tick(ENTER + BEAT) // T：心跳 1 false
  await clock.tick(20 * 1000)
  renew.resolve({ code: 0, data: { watch_session_id: 'S2' } })
  await clock.tick(0) // 让续期回包先处理完
  await clock.tick(BEAT - 20 * 1000) // T+180 秒：旧节奏，本应发心跳
  assert.equal(api.hearts.length, 1)
  await clock.tick(20 * 1000) // T+200 秒
  assert.deepEqual(api.hearts[1], { watchSessionId: 'S2' }) // 心跳 2 false → 再续期得 S3
  assert.equal(api.enters.length, 3)
  assert.equal(clock.pending, 1)
  await clock.tick(BEAT)
  assert.deepEqual(api.hearts[2], { watchSessionId: 'S3' })
})

test('28 续期延迟后失败：沿用旧会话和旧节奏', async () => {
  const renew = deferred()
  const { clock, api, record } = setup({
    enter: (d, n) => (n === 1 ? session('S1') : renew.promise),
    heart: falseAt(1)
  })
  record.start(roomA)
  await clock.tick(ENTER + BEAT)
  await clock.tick(20 * 1000)
  renew.resolve({ code: 0, data: {} })
  await clock.tick(0)
  await clock.tick(BEAT - 20 * 1000)
  assert.deepEqual(api.hearts, [{ watchSessionId: 'S1' }, { watchSessionId: 'S1' }])
})

// ---- createLiveInfoGate ----

test('29 闸门：旧序号的回包被丢弃', () => {
  const gate = createLiveInfoGate()
  const s1 = gate.issue()
  const s2 = gate.issue()
  assert.equal(gate.accept(s2), true)
  gate.commit(s2)
  assert.equal(gate.accept(s1), false)
})

test('30 闸门：较新的请求返回空信息（未 commit）时，较旧请求的有效回包仍能同步（Codex F4）', () => {
  const gate = createLiveInfoGate()
  const s1 = gate.issue()
  const s2 = gate.issue()
  assert.equal(gate.accept(s2), true) // 空信息：不 commit
  assert.equal(gate.accept(s1), true)
})

test('31 闸门：invalidate 后，之前发出的回包全部丢弃，之后新发出的照常（Codex F1）', () => {
  const gate = createLiveInfoGate()
  const s1 = gate.issue()
  const s2 = gate.issue()
  gate.invalidate()
  assert.equal(gate.accept(s1), false)
  assert.equal(gate.accept(s2), false)
  const s3 = gate.issue()
  assert.equal(gate.accept(s3), true)
})

test('32 闸门：播放器快照到达时取的序号大于此前发出的请求，此前请求晚回来被丢弃', () => {
  const gate = createLiveInfoGate()
  const parent = gate.issue()
  const snapshot = gate.issue()
  assert.equal(gate.accept(snapshot), true)
  gate.commit(snapshot)
  assert.equal(gate.accept(parent), false)
})

// ---- client_type（R18、D15）：与 PC 在线心跳共用 getPcClientType ----

test('33 client_type：创建时判断一次；首次进入、同一场重复 start、换场、续期都沿用这个值', async () => {
  let calls = 0
  let value = 4
  const getClientType = () => {
    calls += 1
    return value
  }
  const { clock, api, record } = setup({ enter: (d, n) => session(`S${n}`), heart: falseAt(2) }, getClientType)
  assert.equal(calls, 1, '创建时调用一次')
  value = 1 // 中途返回值变了（例如 PWA 窗口里视频全屏），也不影响
  record.start(roomA)
  record.start({ ...roomA })
  await clock.tick(ENTER + BEAT)
  record.start(roomB) // 换场
  await clock.tick(ENTER + BEAT * 2) // 新一场第 2 次心跳返回 false → 续期
  assert.equal(calls, 1, '之后不再调用')
  assert.deepEqual(api.enters.map((e) => e.client_type), [4, 4, 4])
  assert.equal(api.enters[2].match_id, roomB.match_id, '第 3 次是新一场的续期')
})

test('34 默认接线：不传 getClientType 时用 getPcClientType(window)：PWA 显示模式为 4，否则为 1', async () => {
  const hadWindow = 'window' in globalThis
  const saved = globalThis.window
  const fakeWindow = (modes) => ({ navigator: {}, matchMedia: (q) => ({ matches: modes.some((m) => q.includes(m)) }) })
  try {
    for (const [modes, expected] of [[['standalone'], 4], [[], 1], [['fullscreen'], 1]]) {
      globalThis.window = fakeWindow(modes)
      const clock = createClock()
      const api = createApi()
      const record = createLiveWatchRecord({ enter: api.enter, heart: api.heart, timers: clock, logger: silentLogger })
      record.start(roomA)
      await clock.tick(ENTER)
      assert.equal(api.enters[0].client_type, expected, modes.join(',') || '普通标签页')
    }
  } finally {
    if (hadWindow) globalThis.window = saved
    else delete globalThis.window
  }
})
