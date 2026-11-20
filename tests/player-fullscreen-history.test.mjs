import test from 'node:test'
import assert from 'node:assert/strict'
import { createWebFullscreenHistory, isCurrentPlayerMessage } from '../src/utils/playerFullscreen.js'

// 模拟浏览器历史：back() 异步触发 popstate（flush 时派发），pop() 模拟用户按系统返回键
function fakeWindow(initial = { position: 3, current: '/live?uid=1' }) {
  const listeners = new Set()
  const stack = [initial]
  let pending = false
  const win = {
    history: {
      get state() { return stack.at(-1) },
      pushState: (state) => { stack.push(state) },
      back: () => { stack.pop(); pending = true }
    },
    addEventListener: (type, fn) => { if (type === 'popstate') listeners.add(fn) },
    removeEventListener: (type, fn) => { if (type === 'popstate') listeners.delete(fn) },
    pop() { stack.pop(); listeners.forEach((fn) => fn({ state: stack.at(-1) })) },
    flush() { if (pending) { pending = false; listeners.forEach((fn) => fn({ state: stack.at(-1) })) } },
    listeners,
    stack
  }
  return win
}

test('TP-105：进入网页全屏压入一条历史记录并暂停路由监听，保留路由原有 state', () => {
  const win = fakeWindow(); const router = { listening: true }
  const history = createWebFullscreenHistory(win, router)
  history.push(() => {}); history.push(() => {})
  assert.equal(win.stack.length, 2)
  assert.deepEqual(win.history.state, { position: 3, current: '/live?uid=1', x9PlayerWebFullscreen: true })
  assert.equal(router.listening, false)
})

test('TP-105：全屏中按系统返回键只退出全屏，恢复路由监听，页面不后退', () => {
  const win = fakeWindow(); const router = { listening: true }
  const history = createWebFullscreenHistory(win, router)
  let backs = 0
  history.push(() => backs++)
  win.pop()
  assert.equal(backs, 1)
  assert.equal(router.listening, true)
  assert.equal(win.stack.length, 1)
  assert.equal(win.listeners.size, 0)
  history.release()
  assert.equal(win.stack.length, 1)
})

test('TP-105：用按钮或播放器退出时撤掉压入的记录，不再回调退出', () => {
  const win = fakeWindow(); const router = { listening: true }
  const history = createWebFullscreenHistory(win, router)
  let backs = 0
  history.push(() => backs++)
  history.release(); history.release()
  win.flush()
  assert.equal(backs, 0)
  assert.equal(win.stack.length, 1)
  assert.equal(router.listening, true)
  assert.equal(win.listeners.size, 0)
})

test('TP-105：全屏期间已经发生别的导航时，退出只恢复监听，不再后退', () => {
  const win = fakeWindow(); const router = { listening: true }
  const history = createWebFullscreenHistory(win, router)
  history.push(() => {})
  win.history.pushState({ position: 4, current: '/main' }, '')
  history.release()
  assert.equal(win.stack.length, 3)
  assert.equal(router.listening, true)
  assert.equal(win.listeners.size, 0)
})

test('TP-105：没有路由实例时也能退出全屏', () => {
  const win = fakeWindow()
  const history = createWebFullscreenHistory(win)
  let backs = 0
  history.push(() => backs++)
  win.pop()
  assert.equal(backs, 1)
})

test('TP-105：播放器组件网页全屏时按返回键，通知播放器退出并恢复页面', async () => {
  const { readFileSync } = await import('node:fs')
  const { default: vm } = await import('node:vm')
  const { parse } = await import('vue/compiler-sfc')
  const source = readFileSync(new URL('../src/views/anchor/live-player-iframe.vue', import.meta.url), 'utf8')
  const script = parse(source).descriptor.script.content
    .replace(/^import .*\n/gm, '')
    .replace('export default', 'globalThis.playerComponent =')
  const context = vm.createContext({ mapState: () => ({}), isCurrentPlayerMessage, vueDanmaku: {}, debounce: (fn) => fn, console })
  vm.runInContext(script, context)
  const component = context.playerComponent
  const frame = { src: 'https://player.example/index.html', contentWindow: {} }
  const win = fakeWindow(); const router = { listening: true }
  const calls = []
  const state = {
    ...component.methods,
    $refs: { iframeRef: frame },
    isWebFullscreen: false,
    isFullscreen: false,
    _fullscreenSession: { enter: () => calls.push('enter'), exit: () => calls.push('exit') },
    _fullscreenHistory: createWebFullscreenHistory(win, router),
    handlePostMessage: (data) => calls.push(data)
  }
  const message = (event) => ({ source: frame.contentWindow, origin: 'https://player.example', data: { messageType: 'controlIframe', event } })
  state.listenIframe(message('requestFullscreenFix'))
  assert.equal(win.stack.length, 2)
  assert.equal(router.listening, false)
  win.pop()
  assert.equal(state.isWebFullscreen, false)
  assert.ok(calls.some((call) => call?.event === 'exitH5Fullscreen'))
  assert.equal(calls.at(-1), 'exit')
  assert.equal(win.stack.length, 1)
  assert.equal(router.listening, true)

  state.listenIframe(message('requestFullscreenFix'))
  state.listenIframe(message('exitFullscreenFix'))
  win.flush()
  assert.equal(state.isWebFullscreen, false)
  assert.equal(win.stack.length, 1)
  assert.equal(router.listening, true)
})
