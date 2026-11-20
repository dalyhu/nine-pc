import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isChunkLoadError, decideReload, RELOAD_WINDOW_MS } from './chunkReload.js'

test('isChunkLoadError：认三家浏览器的分包加载失败文案和 CSS 预加载失败', () => {
  assert.equal(isChunkLoadError(new TypeError('Failed to fetch dynamically imported module: https://x/a.js')), true, 'Chrome')
  assert.equal(isChunkLoadError(new TypeError('Importing a module script failed.')), true, 'Safari')
  assert.equal(isChunkLoadError(new TypeError('error loading dynamically imported module: https://x/a.js')), true, 'Firefox')
  assert.equal(isChunkLoadError(new Error('Unable to preload CSS for /static/assets/a.css')), true, 'CSS')
})

test('isChunkLoadError：其他错误不算', () => {
  assert.equal(isChunkLoadError(new Error('Network Error')), false)
  assert.equal(isChunkLoadError(new Error("Couldn't resolve component \"default\" at \"/a\"")), false)
  assert.equal(isChunkLoadError(undefined), false)
  assert.equal(isChunkLoadError('Failed to fetch dynamically imported module'), true, '字符串也认')
})

const now = 1_000_000_000_000

test('decideReload：路由跳转中、存储可用、60 秒内没刷新过，才自动刷新', () => {
  assert.equal(decideReload({ navigating: true, storageOk: true, lastReloadAt: null, now }), true, '首次')
  assert.equal(decideReload({ navigating: true, storageOk: true, lastReloadAt: now - RELOAD_WINDOW_MS - 1, now }), true, '超过 60 秒')
})

test('decideReload：不在路由跳转中（弹窗等非路由 import）不刷新', () => {
  assert.equal(decideReload({ navigating: false, storageOk: true, lastReloadAt: null, now }), false)
})

test('decideReload：60 秒内刷新过、存储不可用、时钟回拨，都不刷新（防循环）', () => {
  assert.equal(decideReload({ navigating: true, storageOk: true, lastReloadAt: now - 1000, now }), false, '60 秒内')
  assert.equal(decideReload({ navigating: true, storageOk: false, lastReloadAt: null, now }), false, '存储不可用')
  assert.equal(decideReload({ navigating: true, storageOk: true, lastReloadAt: now + 5000, now }), false, '时钟回拨')
  assert.equal(decideReload({ navigating: true, storageOk: true, lastReloadAt: NaN, now }), true, '存的值坏了按没刷新过')
})
