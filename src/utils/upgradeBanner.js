/**
 * 软性升级提示条：要不要显示（纯函数，组件见 src/components/UpgradeBanner）
 * 阈值在构建时按 caniuse 数据算好（scripts/upgrade-banner.mjs），开关和参数在 env/.env.* 里
 */

export const CLOSE_KEY = 'x9-upgrade-banner-closed'
export const CLOSE_DAYS = 7

// ua-parser 识别出的浏览器名 → 阈值的键；只提示这四个，其他（微信、搜狗、QQ、360 等）用户自己升级不了，不提示
const BROWSER_KEYS = { Chrome: 'chrome', Edge: 'edge', Firefox: 'firefox', Safari: 'safari' }

/**
 * @param {object} p
 * @param {object|null} p.thresholds 各浏览器的阈值（低于它就提示），开关关闭时为 null
 * @param {boolean} p.unsupported 是否已显示「请升级浏览器」兜底页（window.__X9_UNSUPPORTED__）
 * @param {object} p.uaInfo index.html 里 ua-parser 解析的结果（window.UA_INFO）
 * @param {string} p.userAgent navigator.userAgent
 * @param {number} p.maxTouchPoints navigator.maxTouchPoints
 * @param {number|null} p.closedAt 用户上次主动关闭的时间戳
 * @param {number} p.now 当前时间戳
 */
export function shouldShowUpgradeBanner({ thresholds, unsupported, uaInfo, userAgent, maxTouchPoints, closedAt, now }) {
  if (!thresholds || unsupported) return false
  if (!uaInfo || !uaInfo.browser) return false
  // 只在桌面端提示：手机、平板不提示；iPad 的桌面模式 UA 和 Mac 一样，靠触控点数区分
  if (uaInfo.device && uaInfo.device.type) return false
  if (/Macintosh/.test(userAgent || '') && maxTouchPoints > 1) return false

  const key = BROWSER_KEYS[uaInfo.browser.name]
  if (!key) return false
  const major = parseInt(uaInfo.browser.major, 10)
  const threshold = thresholds[key]
  if (!Number.isFinite(major) || !Number.isFinite(threshold) || major >= threshold) return false

  // 主动关闭后 7 天内不再提示；关闭时间在未来（时钟被回拨）或存的值坏了，按没关过处理
  if (Number.isFinite(closedAt)) {
    const elapsed = now - closedAt
    if (elapsed >= 0 && elapsed < CLOSE_DAYS * 86400000) return false
  }
  return true
}
