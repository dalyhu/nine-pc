import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
import { compileString } from 'sass'
import { parse } from 'vue/compiler-sfc'

const tablet = compileString(readFileSync(new URL('../src/styles/tablet.scss', import.meta.url), 'utf8'), { style: 'expanded' }).css

function ruleBody(source, selector) {
  const rules = [...source.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  return rules.filter(([, sel]) => sel.split(';').pop().split(',').map((s) => s.trim()).includes(selector)).map(([, , body]) => body).join('\n')
}

// 加载布局组件脚本，document / window 由测试提供；X9Tablet 用线上实际加载的识别脚本
function loadLayout({ tablet: isTablet }) {
  const attrs = new Set(isTablet ? ['data-tablet-pc'] : [])
  const root = {
    hasAttribute: (name) => attrs.has(name),
    toggleAttribute: (name, force) => { if (force) attrs.add(name); else attrs.delete(name); return force }
  }
  const scrolls = []
  const window = { scrollTo: (...args) => scrolls.push(['window', ...args]) }
  const ctx = vm.createContext({ window, document: { documentElement: root }, setTimeout: (fn) => fn(), mittBus: { on() {}, off() {}, emit() {} }, console, LeftMenu: {}, Navbar: {}, Sidebar: {}, AppMain: {}, globalChatDialog: {}, LuckyBag: {}, AuthDialog: {}, feedback: {} })
  vm.runInContext(readFileSync(new URL('../public/static/assets/tablet-profile.js', import.meta.url), 'utf8'), ctx)
  const source = readFileSync(new URL('../src/layout/index.vue', import.meta.url), 'utf8')
  const script = parse(source).descriptor.script.content.replace(/^import .*\n/gm, '').replace('export default', 'globalThis.layout =')
  vm.runInContext(script, ctx)
  const layout = ctx.layout
  const state = {
    ...layout.methods,
    showChatPathArr: ['/live'],
    isCloseChatModule: false,
    showDialogWin: true,
    isShowChat: false,
    $refs: { pageScrollbar: { scrollTo: (...args) => scrolls.push(['pageScrollbar', ...args]) } }
  }
  for (const name of Object.keys(layout.methods)) state[name] = layout.methods[name].bind(state)
  return { attrs, scrolls, state }
}

test('TP-108：平板 PC 首页、直播间启用整页滚动，其余页面与普通电脑不启用', () => {
  for (const [isTablet, path, expected] of [
    [true, '/', true],
    [true, '/main', true],
    [true, '/live', true],
    [true, '/football', false],
    [true, '/schedule', false],
    [false, '/main', false],
    [false, '/live', false]
  ]) {
    const { attrs, state } = loadLayout({ tablet: isTablet })
    state.handlePathChange(path)
    assert.equal(attrs.has('data-tablet-page-scroll'), expected, `${isTablet ? '平板' : '电脑'} ${path}`)
  }
})

test('TP-108：从直播间切到非生效页面时移除整页滚动标记', () => {
  const { attrs, state } = loadLayout({ tablet: true })
  state.handlePathChange('/live')
  assert.equal(attrs.has('data-tablet-page-scroll'), true)
  state.handlePathChange('/football')
  assert.equal(attrs.has('data-tablet-page-scroll'), false)
})

test('TP-108：切换路由时内层滚动容器与整页都回到顶部', () => {
  const { scrolls, state } = loadLayout({ tablet: true })
  state.handlePathChange('/main')
  assert.equal(JSON.stringify(scrolls.find(([target]) => target === 'pageScrollbar')?.[1]), JSON.stringify({ left: 0, top: 0, behavior: 'instant' }))
  assert.equal(JSON.stringify(scrolls.find(([target]) => target === 'window')?.slice(1)), '[0,0]')
})

test('TP-108：整页滚动模式下根容器高度自适应，内层滚动容器不再滚动', () => {
  for (const selector of ['html[data-tablet-page-scroll]', 'html[data-tablet-page-scroll] body', 'html[data-tablet-page-scroll] #app']) {
    const body = ruleBody(tablet, selector)
    assert.match(body, /height:\s*auto !important;/, `${selector} 高度`)
    assert.match(body, /overflow:\s*visible/, `${selector} overflow`)
  }
  // body 不能用 !important 覆盖 overflow，否则会压过网页全屏时 body 上的行内 overflow: hidden
  assert.doesNotMatch(ruleBody(tablet, 'html[data-tablet-page-scroll] body'), /overflow:\s*visible !important/)
  assert.match(ruleBody(tablet, 'html[data-tablet-page-scroll] .app-wrapper'), /overflow:\s*visible !important;/)
  const wrap = ruleBody(tablet, 'html[data-tablet-page-scroll] .app-wrapper > .el-scrollbar__wrap')
  assert.match(wrap, /height:\s*auto !important;/)
  assert.match(wrap, /overflow:\s*visible !important;/)
  assert.match(ruleBody(tablet, 'html[data-tablet-page-scroll] .app-wrapper > .el-scrollbar__bar'), /display:\s*none !important;/)
})

test('TP-108：整页滚动模式下网页全屏锁住整页', () => {
  assert.match(ruleBody(tablet, 'html[data-tablet-page-scroll][data-player-web-fullscreen]'), /overflow:\s*hidden !important;/)
})

test('TP-108：未启用整页滚动的平板页面仍保留 TP-106 的 100dvh', () => {
  assert.match(ruleBody(tablet, 'html[data-tablet-pc]'), /height:\s*100vh;[\s\S]*height:\s*100dvh;/)
})
