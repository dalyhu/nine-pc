// 兼容检测的固定样例：行尾标「应报错」的必须被 lint:compat 拦下，标「不应报错」的必须放行（见 scripts/compat-lint.test.mjs）
// 构建补不了的浏览器 API
export const channel = new BroadcastChannel('x') // 应报错：Safari 15.4 才支持
navigator.locks.request('k', () => {}) // 应报错：Firefox 96、Safari 15.4 才支持
export const ref = new WeakRef({}) // 应报错：core-js 补不了
// 最低版本已经支持，或者构建会自动补齐的
export const observer = new ResizeObserver(() => {}) // 不应报错
Object.hasOwn({}, 'a') // 不应报错：构建会补
export const replaced = 'a'.replaceAll('a', 'b') // 不应报错：构建会补
export const cloned = Array.prototype.at.call([1], 0) // 不应报错：构建会补
if ('BroadcastChannel' in window) new BroadcastChannel('y') // 不应报错：先判断再用
