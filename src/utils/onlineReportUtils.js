/**
 * 进入系统与在线心跳的业务辅助函数（纯函数，不依赖框架和路径别名，单测直接加载）
 * 多标签页选主、跨标签页限频由 tab-leader 库负责，见 onlineReport.js
 */

// 不含 fullscreen：浏览器全屏（F11）和页面元素全屏（视频全屏）也会匹配它，普通标签页会被误判为 PWA；
// 本站 PWA 的 manifest 是 display: standalone（pwa.config.ts），真正的 PWA 窗口匹配 standalone
const PWA_DISPLAY_MODES = ['standalone', 'minimal-ui', 'window-controls-overlay']

/**
 * PC 的 client_type：在已安装的 PWA 窗口里是 4，普通浏览器标签页是 1
 * 只认明确的 PWA 显示模式：不认识 display-mode 的环境里所有查询都不匹配，按普通标签页处理
 */
export function getPcClientType(win) {
  try {
    if (win.navigator && win.navigator.standalone === true) return 4
    if (typeof win.matchMedia === 'function') {
      for (const mode of PWA_DISPLAY_MODES) {
        if (win.matchMedia(`(display-mode: ${mode})`).matches) return 4
      }
    }
  } catch (e) {
    // 读取失败按普通标签页处理
  }
  return 1
}

/**
 * 「进入系统」跳过标记（存在 sessionStorage，只对本标签页紧接着的一次整页加载生效）
 * 退出登录、因其他标签页登录态变化而被动刷新、已在本页调过「进入系统」又紧接着整页跳转时写入，
 * 下一次加载读到未过期的标记就不再调用。过期时间防止没有发生跳转时，标记一直留着误伤以后的刷新；
 * 60 秒是为了覆盖加载慢（弱网下载脚本、后台节流）的情况，读取要放在页面初始化的最前面
 */
export const ENTER_SKIP_KEY = 'x9-enter-skip-until'
export const ENTER_SKIP_MS = 60 * 1000

export function markEnterSkip(storage, now) {
  try {
    storage.setItem(ENTER_SKIP_KEY, String(now + ENTER_SKIP_MS))
  } catch (e) {
    // 存不进去就照常调用，后端按天去重
  }
}

/** 读取并删除标记；返回 true 表示这次加载跳过「进入系统」 */
export function consumeEnterSkip(storage, now) {
  let until
  try {
    until = Number(storage.getItem(ENTER_SKIP_KEY))
    storage.removeItem(ENTER_SKIP_KEY)
  } catch (e) {
    return false
  }
  return until > now && until - now <= ENTER_SKIP_MS
}
