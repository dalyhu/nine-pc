import { test } from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
import { consumeEnterSkip, markEnterSkip, ENTER_SKIP_KEY } from './onlineReportUtils.js'

// 加载 onlineReport.js 的真实源码，只替换模块边界
const source =
  readFileSync(new URL('./onlineReport.js', import.meta.url), 'utf8')
    .replace(/^import .*$/gm, '')
    .replace(/^export function /gm, 'function ') +
  '\nglobalThis.__exports = { startOnlineReport, skipNextEnter, skipEnterIfReported }'

function createSession() {
  const map = new Map()
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    has: (key) => map.has(key)
  }
}

// 模拟一次整页加载：执行模块顶层代码（此时就读取跳过标记），返回导出函数和调用记录
function loadPage(session) {
  const calls = { enter: [], heartbeat: null }
  const context = {
    enterSystemService: (clientType) => {
      calls.enter.push(clientType)
      return Promise.resolve()
    },
    onlineHeartbeatService: () => Promise.resolve(),
    consumeEnterSkip,
    markEnterSkip,
    getPcClientType: () => 1,
    createTabInterval: (options) => {
      calls.heartbeat = options
      return { start() {} }
    },
    window: { sessionStorage: session },
    Date,
    console
  }
  context.globalThis = context
  vm.runInNewContext(source, context)
  return { calls, ...context.__exports }
}

const storeWith = (infoData) => ({ state: { user: { infoData } } })

test('首次加载：调一次「进入系统」，并启动心跳', () => {
  const page = loadPage(createSession())
  page.startOnlineReport(storeWith({}))
  assert.deepEqual(page.calls.enter, [1])
  assert.equal(page.calls.heartbeat.name, 'x9-online-hb:1', '沿用旧实现的锁名和存储 key')
  assert.equal(page.calls.heartbeat.interval, 3 * 60 * 1000)
})

test('跳过标记在模块加载时就读取并删除，不受 store 初始化快慢影响', () => {
  const session = createSession()
  markEnterSkip(session, Date.now())
  const page = loadPage(session)
  assert.equal(session.has(ENTER_SKIP_KEY), false, '模块一加载就删除了标记')

  page.startOnlineReport(storeWith({}))
  assert.deepEqual(page.calls.enter, [], '这次加载不调「进入系统」')
})

test('URL 登录：本页已用新身份调过「进入系统」，刷新前写跳过标记，刷新后不重复调', () => {
  const session = createSession()
  const first = loadPage(session)
  // App.vue 在挂载时已用 URL 里的 token/userId 提交登录信息，随后 startOnlineReport 用新身份上报
  first.startOnlineReport(storeWith({ id: 5, token: 't' }))
  first.skipEnterIfReported({ id: 5, token: 't' })

  const second = loadPage(session)
  second.startOnlineReport(storeWith({ id: 5, token: 't' }))
  assert.deepEqual(first.calls.enter, [1])
  assert.deepEqual(second.calls.enter, [], '刷新后不再调用')
})

test('普通登录：页面加载时是游客，登录后刷新照常再调一次（需求 D4）', () => {
  const session = createSession()
  const first = loadPage(session)
  first.startOnlineReport(storeWith({}))
  first.skipEnterIfReported({ id: 5, token: 't' })
  assert.equal(session.has(ENTER_SKIP_KEY), false)

  const second = loadPage(session)
  second.startOnlineReport(storeWith({ id: 5, token: 't' }))
  assert.deepEqual(second.calls.enter, [1])
})

test('这一页本来就跳过了「进入系统」：刷新前不再额外写跳过标记', () => {
  const session = createSession()
  markEnterSkip(session, Date.now())
  const page = loadPage(session)
  page.startOnlineReport(storeWith({ id: 5, token: 't' }))
  page.skipEnterIfReported({ id: 5, token: 't' })
  assert.equal(session.has(ENTER_SKIP_KEY), false)
})

test('身份：同时有 id 和 token 才算登录用户，否则是 guest', () => {
  const page = loadPage(createSession())
  const store = storeWith({ id: 5 })
  page.startOnlineReport(store)
  assert.equal(page.calls.heartbeat.key(), 'guest')
  store.state.user.infoData = { id: 5, token: 't' }
  assert.equal(page.calls.heartbeat.key(), 'u:5')
})

test('游客 id 被重新分配、本页即将刷新：已用游客身份调过「进入系统」，刷新后不重复调', () => {
  const session = createSession()
  const first = loadPage(session)
  first.startOnlineReport(storeWith({}))
  first.skipEnterIfReported({})

  const second = loadPage(session)
  second.startOnlineReport(storeWith({}))
  assert.deepEqual(second.calls.enter, [])
})
