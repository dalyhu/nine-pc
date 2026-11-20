import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  getPcClientType,
  markEnterSkip,
  consumeEnterSkip,
  ENTER_SKIP_KEY,
  ENTER_SKIP_MS
} from './onlineReportUtils.js'

const MIN = 60 * 1000

// ---------- 判断 client_type ----------

const fakeWindow = ({ modes = [], standalone, matchMedia = true } = {}) => ({
  navigator: standalone === undefined ? {} : { standalone },
  matchMedia: matchMedia
    ? (query) => ({ matches: modes.some((mode) => query === `(display-mode: ${mode})`) })
    : undefined
})

test('getPcClientType：PWA 窗口（standalone 等显示模式）返回 4', () => {
  assert.equal(getPcClientType(fakeWindow({ modes: ['standalone'] })), 4)
  assert.equal(getPcClientType(fakeWindow({ modes: ['minimal-ui'] })), 4)
  assert.equal(getPcClientType(fakeWindow({ modes: ['window-controls-overlay'] })), 4)
  assert.equal(getPcClientType(fakeWindow({ standalone: true })), 4, 'iPad 从主屏打开')
})

test('getPcClientType：普通浏览器标签页、不认识 display-mode、没有 matchMedia 都返回 1', () => {
  assert.equal(getPcClientType(fakeWindow({ modes: ['browser'] })), 1)
  assert.equal(getPcClientType(fakeWindow({ modes: [] })), 1, '不认识 display-mode 时全部不匹配，不能误判为 PWA')
  assert.equal(getPcClientType(fakeWindow({ matchMedia: false })), 1)
  assert.equal(getPcClientType(fakeWindow({ modes: ['browser'], standalone: false })), 1)
})

test('getPcClientType：浏览器全屏（F11）或页面元素全屏时匹配 fullscreen，不是 PWA，返回 1', () => {
  // Chromium 80 实测：F11 和 Fullscreen API（视频全屏）都会让 (display-mode: fullscreen) 匹配；
  // 本站 PWA 的 manifest 是 display: standalone（pwa.config.ts），真正的 PWA 窗口匹配 standalone
  assert.equal(getPcClientType(fakeWindow({ modes: ['fullscreen'] })), 1)
})

// ---------- 「进入系统」跳过标记 ----------

const createSessionStorage = () => {
  const map = new Map()
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    has: (key) => map.has(key)
  }
}

test('跳过标记：有效期 60 秒，覆盖初始化慢（接口慢、后台节流）的整页加载', () => {
  assert.equal(ENTER_SKIP_MS, 60 * 1000)
})

test('跳过标记：有效期内的下一次加载跳过「进入系统」，并且只跳过一次', () => {
  const storage = createSessionStorage()
  const t = 1_000_000_000_000
  markEnterSkip(storage, t)

  assert.equal(consumeEnterSkip(storage, t + 3000), true)
  assert.equal(storage.has(ENTER_SKIP_KEY), false, '读完就删')
  assert.equal(consumeEnterSkip(storage, t + 4000), false, '第二次加载照常调用')
})

test('跳过标记：超过有效期不跳过，并清掉过期标记', () => {
  const storage = createSessionStorage()
  const t = 1_000_000_000_000
  markEnterSkip(storage, t)

  assert.equal(consumeEnterSkip(storage, t + ENTER_SKIP_MS + 1), false)
  assert.equal(storage.has(ENTER_SKIP_KEY), false)
})

test('跳过标记：没有标记、标记内容损坏、时钟被调回很多，都不跳过', () => {
  const t = 1_000_000_000_000
  assert.equal(consumeEnterSkip(createSessionStorage(), t), false, '没有标记')

  const broken = createSessionStorage()
  broken.setItem(ENTER_SKIP_KEY, 'abc')
  assert.equal(consumeEnterSkip(broken, t), false, '内容损坏')

  const future = createSessionStorage()
  markEnterSkip(future, t + 60 * MIN)
  assert.equal(consumeEnterSkip(future, t), false, '标记时间远在未来（时钟被调回）')
})

test('跳过标记：存储不可用时不抛错、不跳过', () => {
  const throwing = {
    getItem() {
      throw new Error('blocked')
    },
    setItem() {
      throw new Error('blocked')
    },
    removeItem() {
      throw new Error('blocked')
    }
  }
  assert.doesNotThrow(() => markEnterSkip(throwing, 0))
  assert.equal(consumeEnterSkip(throwing, 0), false)
  assert.equal(consumeEnterSkip(null, 0), false)
})
