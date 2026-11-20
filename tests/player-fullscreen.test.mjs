import test from 'node:test'
import assert from 'node:assert/strict'
import { createPlayerFullscreenSession, isCurrentPlayerMessage } from '../src/utils/playerFullscreen.js'

const style = () => {
  let value = 'auto', priority = 'important'
  return {
    getPropertyValue: () => value,
    getPropertyPriority: () => priority,
    setProperty: (_, v, p = '') => { value = v; priority = p },
    removeProperty: () => { value = ''; priority = '' }
  }
}
test('仅接收当前 iframe 的同源控制消息', () => {
  const frame = { src: 'https://player.example/index.html', contentWindow: {} }
  const event = { source: frame.contentWindow, origin: 'https://player.example', data: { messageType: 'controlIframe' } }
  assert.equal(isCurrentPlayerMessage(event, frame), true)
  assert.equal(isCurrentPlayerMessage({ ...event, source: {} }, frame), false)
  assert.equal(isCurrentPlayerMessage({ ...event, origin: 'https://other.example' }, frame), false)
  assert.equal(isCurrentPlayerMessage(event, null), false)
})
test('重复进入退出恢复最初的 overflow 值和优先级', () => {
  const body = { style: style() }
  const session = createPlayerFullscreenSession(body)
  session.enter(); session.enter()
  assert.equal(body.style.getPropertyValue('overflow'), 'hidden')
  session.exit(); session.exit()
  assert.equal(body.style.getPropertyValue('overflow'), 'auto')
  assert.equal(body.style.getPropertyPriority('overflow'), 'important')
  session.enter(); session.exit()
  assert.equal(body.style.getPropertyValue('overflow'), 'auto')
})
test('没有 inline overflow 时退出移除临时属性', () => {
  const body = { style: style() }; body.style.removeProperty('overflow')
  const session = createPlayerFullscreenSession(body)
  session.enter(); session.exit()
  assert.equal(body.style.getPropertyValue('overflow'), '')
})
test('全屏期间隐藏版本提示，退出后移除专属标记', () => {
  const attributes=new Set()
  const root={hasAttribute:k=>attributes.has(k),setAttribute:k=>attributes.add(k),removeAttribute:k=>attributes.delete(k)}
  const body={style:style(),ownerDocument:{documentElement:root}}
  const session=createPlayerFullscreenSession(body)
  session.enter();assert.equal(attributes.has('data-player-web-fullscreen'),true)
  session.exit();assert.equal(attributes.has('data-player-web-fullscreen'),false)
})


test('已有全屏标记不会被本次会话移除', () => {
  const attributes = new Set(['data-player-web-fullscreen'])
  const root = { hasAttribute: (key) => attributes.has(key), setAttribute: (key) => attributes.add(key), removeAttribute: (key) => attributes.delete(key) }
  const body = { style: style(), ownerDocument: { documentElement: root } }
  const session = createPlayerFullscreenSession(body)
  session.enter()
  session.exit()
  assert.equal(attributes.has('data-player-web-fullscreen'), true)
})

test('忽略错误消息类型和非法播放器地址', () => {
  const frame = { src: 'not a valid URL', contentWindow: {} }
  const event = { source: frame.contentWindow, origin: 'https://player.example', data: { messageType: 'controlIframe' } }
  assert.equal(isCurrentPlayerMessage(event, frame), false)
  frame.src = 'https://player.example/index.html'
  assert.equal(isCurrentPlayerMessage({ ...event, data: { messageType: 'other' } }, frame), false)
})

test('播放器组件只响应当前 iframe 的网页全屏消息并恢复状态', async () => {
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
  const calls = []
  const state = {
    ...component.methods,
    $refs: { iframeRef: frame },
    isWebFullscreen: false,
    isFullscreen: false,
    _fullscreenSession: { enter: () => calls.push('enter'), exit: () => calls.push('exit') },
    handlePostMessage: (data) => calls.push(data)
  }
  const message = (event, source = frame.contentWindow) => ({ source, origin: 'https://player.example', data: { messageType: 'controlIframe', event } })
  state.listenIframe(message('requestFullscreenFix', {}))
  assert.equal(state.isWebFullscreen, false)
  state.listenIframe(message('requestFullscreenFix'))
  assert.equal(state.isWebFullscreen, true)
  assert.equal(calls[0], 'enter')
  state.listenIframe(message('getFullscreenState'))
  assert.equal(calls[1].state, true)
  state.listenIframe(message('exitFullscreenFix', {}))
  assert.equal(state.isWebFullscreen, true)
  state.listenIframe(message('exitFullscreenFix'))
  assert.equal(state.isWebFullscreen, false)
  assert.equal(calls[2], 'exit')
  state.listenIframe(message('requestFullscreenFix'))
  state.eventAdd({ key: 'Escape' })
  assert.equal(state.isWebFullscreen, false)
  assert.equal(calls[4].event, 'exitH5Fullscreen')
  assert.equal(calls[5], 'exit')
})
