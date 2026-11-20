/**
 * 解析 Vue 错误处理回调（errorHandler / onErrorCaptured）的第三个参数 info，判断错误会不会让组件渲染不出来
 *
 * info 的形式（Vue 3.4，见 @vue/runtime-core 的 handleError）：
 * - 生产环境：https://vuejs.org/errors/#runtime-<错误码>，生命周期钩子的码是字符串（如 bm、m）
 * - 开发环境：文字描述（如 render function、mounted hook）
 */

// 开发环境的文字描述 → 错误码（与 @vue/runtime-core 的 ErrorTypeStrings 一致）
const DEV_TEXT_TO_CODE = {
  'setup function': '0',
  'render function': '1',
  'watcher getter': '2',
  'watcher callback': '3',
  'watcher cleanup function': '4',
  'native event handler': '5',
  'component event handler': '6',
  'vnode hook': '7',
  'directive hook': '8',
  'transition hook': '9',
  'app errorHandler': '10',
  'app warnHandler': '11',
  'ref function': '12',
  'async component loader': '13',
  'beforeCreate hook': 'bc',
  'created hook': 'c',
  'beforeMount hook': 'bm',
  'mounted hook': 'm',
  'beforeUpdate hook': 'bu',
  updated: 'u',
  'beforeUnmount hook': 'bum',
  'unmounted hook': 'um',
  'activated hook': 'a',
  'deactivated hook': 'da'
}

// 可能让组件什么都渲染不出来的错误：setup 报错、渲染报错、transition 钩子报错（out-in 会卡在空白）、异步组件加载失败
// 生命周期钩子报错时 Vue 会接着渲染，页面还在，不算
// 注意这只是初筛：选项式组件 setup 报错后仍会用模板渲染出来，是不是真的空了要再看结果（isBlankInstance）
const FATAL_CODES = ['0', '1', '9', '13']

export function parseVueErrorCode(info) {
  if (info === undefined || info === null) return ''
  const text = String(info)
  const m = text.match(/#runtime-([a-z]+|\d+)$/)
  if (m) return m[1]
  if (/^([a-z]+|\d+)$/.test(text)) return text
  return DEV_TEXT_TO_CODE[text] || ''
}

export function isFatalVueError(info) {
  return FATAL_CODES.includes(parseVueErrorCode(info))
}

/**
 * 组件是不是什么都没渲染出来：实例不存在、没有根节点，或根节点是注释（Vue 渲染失败时放的占位）
 * 看结果而不看出错的是哪个组件：插槽里的报错会算到渲染插槽的子组件头上（如 el-scrollbar），按组件类型判断会漏
 */
export function isBlankInstance(proxy) {
  if (!proxy) return true
  const el = proxy.$el
  return !el || el.nodeType === 8
}

/**
 * 当前路由匹配到的各层组件里，有没有渲染成空的
 * @param {Array} matched 当前路由的 matched
 * @param {number} fromLevel 从第几层开始：0 含 Layout、404 页这类顶层路由组件，1 只看页面
 */
export function hasBlankRouteLevel(matched, fromLevel) {
  if (!Array.isArray(matched)) return false
  for (let i = fromLevel; i < matched.length; i++) {
    const record = matched[i]
    if (!record || !record.components || !record.components.default) continue
    if (isBlankInstance(record.instances && record.instances.default)) return true
  }
  return false
}
