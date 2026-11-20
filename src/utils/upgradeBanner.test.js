import { test } from 'node:test'
import assert from 'node:assert/strict'
import { shouldShowUpgradeBanner, CLOSE_DAYS } from './upgradeBanner.js'

const DAY = 86400000
const now = 1_800_000_000_000
const thresholds = { chrome: 153, edge: 152, firefox: 155, safari: 26 }
const desktop = (name, major) => ({ browser: { name, major: String(major) }, device: {} })
const base = { thresholds, unsupported: false, userAgent: 'Mozilla/5.0 (Windows NT 10.0)', maxTouchPoints: 0, closedAt: null, now }

test('四大浏览器：低于阈值显示，等于或高于阈值不显示', () => {
  for (const [name, key] of [['Chrome', 'chrome'], ['Edge', 'edge'], ['Firefox', 'firefox'], ['Safari', 'safari']]) {
    const t = thresholds[key]
    assert.equal(shouldShowUpgradeBanner({ ...base, uaInfo: desktop(name, t - 1) }), true, `${name} ${t - 1}`)
    assert.equal(shouldShowUpgradeBanner({ ...base, uaInfo: desktop(name, t) }), false, `${name} ${t}`)
    assert.equal(shouldShowUpgradeBanner({ ...base, uaInfo: desktop(name, t + 1) }), false, `${name} ${t + 1}`)
  }
})

test('开关关闭、已显示升级兜底页时不显示', () => {
  assert.equal(shouldShowUpgradeBanner({ ...base, thresholds: null, uaInfo: desktop('Chrome', 100) }), false)
  assert.equal(shouldShowUpgradeBanner({ ...base, unsupported: true, uaInfo: desktop('Chrome', 100) }), false)
})

test('非四大浏览器、手机平板、iPad 桌面模式、识别不出来的都不显示', () => {
  for (const name of ['WeChat', 'Sogou Explorer', 'QQBrowser', '360 Browser', 'Mobile Safari', 'Chrome WebView', undefined]) {
    assert.equal(shouldShowUpgradeBanner({ ...base, uaInfo: desktop(name, 10) }), false, String(name))
  }
  assert.equal(shouldShowUpgradeBanner({ ...base, uaInfo: { browser: { name: 'Chrome', major: '100' }, device: { type: 'mobile' } } }), false, '手机')
  assert.equal(shouldShowUpgradeBanner({ ...base, uaInfo: { browser: { name: 'Chrome', major: '100' }, device: { type: 'tablet' } } }), false, '平板')
  assert.equal(
    shouldShowUpgradeBanner({ ...base, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', maxTouchPoints: 5, uaInfo: desktop('Safari', 17) }),
    false,
    'iPad 桌面模式'
  )
  assert.equal(
    shouldShowUpgradeBanner({ ...base, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', maxTouchPoints: 0, uaInfo: desktop('Safari', 17) }),
    true,
    '真正的 Mac 照常显示'
  )
  assert.equal(shouldShowUpgradeBanner({ ...base, uaInfo: undefined }), false, 'UA 没解析出来')
  assert.equal(shouldShowUpgradeBanner({ ...base, uaInfo: { browser: { name: 'Chrome' }, device: {} } }), false, '没有版本号')
})

test('主动关闭后 7 天内不显示，过了 7 天再显示', () => {
  const uaInfo = desktop('Chrome', 100)
  assert.equal(shouldShowUpgradeBanner({ ...base, uaInfo, closedAt: now - 1 * DAY }), false)
  assert.equal(shouldShowUpgradeBanner({ ...base, uaInfo, closedAt: now - (CLOSE_DAYS * DAY - 1) }), false)
  assert.equal(shouldShowUpgradeBanner({ ...base, uaInfo, closedAt: now - CLOSE_DAYS * DAY }), true)
  assert.equal(shouldShowUpgradeBanner({ ...base, uaInfo, closedAt: now - 8 * DAY }), true)
  assert.equal(shouldShowUpgradeBanner({ ...base, uaInfo, closedAt: now + DAY }), true, '时钟回拨导致关闭时间在未来：按没关过处理')
  assert.equal(shouldShowUpgradeBanner({ ...base, uaInfo, closedAt: NaN }), true, '存的值坏了：按没关过处理')
})
