/**
 * 页面分包加载失败时自动恢复（常见于发版后用户还开着旧页面：点击跳转时，旧版本的分包文件已经不在服务器上了）
 *
 * 只在路由跳转进行中才介入，其余情况（弹窗等非路由的动态 import）只记录，行为和原来一样：
 * - 第一次失败：整页刷新一次，拿到新版本的文件
 * - 60 秒内再次失败，或浏览器存储不可用：不再刷新（不可能死循环），页面主体显示错误页（PageErrorBoundary）
 *
 * Vite 5.0 的行为（vite/dist/node/chunks/dep-*.js 里的 preload 辅助函数）：动态 import 失败时派发可取消的
 * vite:preloadError 事件，原始错误在 event.payload；调用 preventDefault 后 import 不再报错，而是返回 undefined，
 * 不调用则原错误照常抛出，router.onError 会收到
 */
import { reportError, setPageError } from './pageError.js'

export const RELOAD_KEY = 'x9-chunk-reload-at'
export const RELOAD_WINDOW_MS = 60000

const CHUNK_ERROR_PATTERNS = [
  /Failed to fetch dynamically imported module/i, // Chrome、Edge
  /Importing a module script failed/i, // Safari
  /error loading dynamically imported module/i, // Firefox
  /Unable to preload CSS/i // Vite 预加载分包 CSS 失败
]

export function isChunkLoadError(err) {
  if (!err) return false
  const message = typeof err === 'string' ? err : err.message || ''
  return CHUNK_ERROR_PATTERNS.some((p) => p.test(message))
}

/**
 * 要不要自动刷新
 * @param {object} p
 * @param {boolean} p.navigating 是否在路由跳转中
 * @param {boolean} p.storageOk sessionStorage 能否读写
 * @param {number|null} p.lastReloadAt 上次自动刷新的时间戳
 * @param {number} p.now 当前时间戳
 */
export function decideReload({ navigating, storageOk, lastReloadAt, now }) {
  if (!navigating || !storageOk) return false
  if (lastReloadAt === null || lastReloadAt === undefined || !Number.isFinite(lastReloadAt)) return true
  const elapsed = now - lastReloadAt
  if (elapsed < 0) return false // 时钟被回拨，当作刚刷新过
  return elapsed >= RELOAD_WINDOW_MS
}

export function setupChunkReload(router) {
  let navigating = false
  let reloading = false

  router.beforeEach(() => {
    navigating = true
  })
  router.afterEach(() => {
    navigating = false
  })
  router.onError((err) => {
    navigating = false
    // 分包加载失败已在 vite:preloadError 里记录过，这里不重复记
    if (!isChunkLoadError(err)) reportError(err, 'router')
    // 刷新进行中的报错（如取消 import 后组件为 undefined）只记录，避免刷新前闪一下错误页
    if (!reloading && isChunkLoadError(err)) setPageError()
  })

  window.addEventListener('vite:preloadError', (event) => {
    // 已经在刷新了：后续的分包失败一律吞掉，多个分包同时失败也只刷新一次
    if (reloading) {
      event.preventDefault()
      return
    }
    reportError(event.payload, 'chunk')

    let storageOk = true
    let lastReloadAt = null
    try {
      const saved = window.sessionStorage.getItem(RELOAD_KEY)
      lastReloadAt = saved ? Number(saved) : null
    } catch (e) {
      storageOk = false
    }
    if (!decideReload({ navigating, storageOk, lastReloadAt, now: Date.now() })) return

    try {
      window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
    } catch (e) {
      return // 记不下刷新时间就无法防循环，不刷新
    }
    reloading = true
    event.preventDefault()
    window.location.reload()
  })
}
