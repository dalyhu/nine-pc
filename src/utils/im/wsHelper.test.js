import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'

// wsHelper.js 依赖 '@/enums'（TS 别名），测试里换成同值的替身
const IM_STATUS = {
  INIT: 0,
  CONNECTING: 1,
  CONNECTED: 2,
  CLOSE: 3,
  ERROR: 4,
  TIMEOUT: 5,
  EXCEED_COUNT: 6,
  HEART_TIMEOUT: 7
}
const enumsStub = `data:text/javascript,export const IM_STATUS = ${encodeURIComponent(JSON.stringify(IM_STATUS))}`
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === '@/enums') return { url: enumsStub, shortCircuit: true }
    return next(specifier, context)
  }
})

const { default: WsHelper } = await import('./wsHelper.js')

// 可手动触发事件的假 WebSocket
class FakeWebSocket {
  static instances = []
  constructor(url) {
    this.url = url
    this.readyState = 0
    this.sent = []
    this.closed = false
    FakeWebSocket.instances.push(this)
  }
  send(data) {
    if (this.readyState !== 1) throw new Error('InvalidStateError')
    this.sent.push(data)
  }
  close() {
    this.closed = true
    this.readyState = 3
  }
  // 测试驱动
  fireOpen() {
    this.readyState = 1
    this.onopen?.()
  }
  fireMessage(obj) {
    this.onmessage?.({ data: JSON.stringify(obj) })
  }
  fireClose() {
    this.readyState = 3
    this.onclose?.()
  }
}

let states
let messages

function connect(token = 'tok-1') {
  WsHelper.connect({
    token,
    protocol: 'wss',
    host: 'a.example.com',
    handleMessage: (data) => messages.push(data),
    handleStateChange: (state) => states.push(state)
  })
  return FakeWebSocket.instances.at(-1)
}

beforeEach(() => {
  globalThis.WebSocket = FakeWebSocket
  FakeWebSocket.instances = []
  states = []
  messages = []
})

afterEach(() => {
  WsHelper.destroy()
})

test('握手地址为 /wss/，不带 Token', () => {
  const ws = connect()
  assert.equal(ws.url, 'wss://a.example.com/wss/')
})

test('原生 open 后发出且只发出一条 auth，Token 为本次 connect 传入的值', () => {
  const ws = connect('tok-A')
  ws.fireOpen()
  assert.equal(ws.sent.length, 1)
  assert.deepEqual(JSON.parse(ws.sent[0]), { action: 'auth', userToken: 'tok-A' })
})

test('收到服务端 open 帧之前：不是已连接，业务消息不发出，没有心跳', () => {
  const ws = connect()
  ws.fireOpen()
  assert.notEqual(WsHelper.STATUS, IM_STATUS.CONNECTED)
  assert.ok(!states.includes(IM_STATUS.CONNECTED))
  WsHelper.send({ action: 'sub', vid: 'v1' })
  assert.equal(ws.sent.length, 1, '只有 auth')
  assert.equal(WsHelper.heartTimer, null)
})

test('收到服务端 open 帧之后：进入已连接，业务消息正常发出，开始心跳', () => {
  const ws = connect()
  ws.fireOpen()
  ws.fireMessage({ action: 'open', info: {} })
  assert.equal(WsHelper.STATUS, IM_STATUS.CONNECTED)
  assert.ok(states.includes(IM_STATUS.CONNECTED))
  WsHelper.send({ action: 'sub', vid: 'v1' })
  assert.deepEqual(JSON.parse(ws.sent.at(-1)), { action: 'sub', vid: 'v1' })
  assert.notEqual(WsHelper.heartTimer, null)
})

test('重新 connect：旧实例被关闭，旧实例迟到的 open 不发任何消息；新实例用新 Token 认证', () => {
  const oldWs = connect('tok-old')
  const newWs = connect('tok-new')
  assert.notEqual(oldWs, newWs)
  assert.ok(oldWs.closed)
  oldWs.fireOpen()
  assert.equal(oldWs.sent.length, 0)
  newWs.fireOpen()
  assert.deepEqual(JSON.parse(newWs.sent[0]), { action: 'auth', userToken: 'tok-new' })
})

test('destroy 后实例迟到的 open 不发任何消息', () => {
  const ws = connect()
  WsHelper.destroy()
  ws.fireOpen()
  assert.equal(ws.sent.length, 0)
})

test('tokenError 交给业务层，断开后状态为 CLOSE（与改造前一致）', () => {
  const ws = connect()
  ws.fireOpen()
  ws.fireMessage({ action: 'tokenError' })
  assert.deepEqual(messages.at(-1), { action: 'tokenError' })
  ws.fireClose()
  assert.equal(WsHelper.STATUS, IM_STATUS.CLOSE)
})
