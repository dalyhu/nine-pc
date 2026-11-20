import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const parserSource = read('../public/static/assets/ua-parser.min.js')
const profileSource = read('../public/static/assets/tablet-profile.js')
const entryHTML = read('../index.html')
const entryScript = entryHTML.match(/<script>([\s\S]*?)<\/script>/)[1]
const context = vm.createContext({})
const parserScript = new vm.Script(parserSource)
const profileScript = new vm.Script(profileSource)
const inlineScript = new vm.Script(entryScript)
const ipadUA = 'Mozilla/5.0 (iPad; CPU OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1'
const macUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15'
const androidDesktopUA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
const androidUA = (model, mobile = false) => `Mozilla/5.0 (Linux; Android 15; ${model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 ${mobile ? 'Mobile ' : ''}Safari/537.36`
const harmonyUA = (type) => `Mozilla/5.0 (${type}; OpenHarmony 5.0) AppleWebKit/537.36 (KHTML, like Gecko) ArkWeb/4.1.0.0 Chrome/114.0.0.0 Safari/537.36`
// UA 按公开格式构造，非真机采集；鸿蒙 4 正向样本沿用方案制定时的原文。
const devices = [
  ['iPad 移动版', ipadUA, 'MacIntel', 5, true, false],
  ['iPad 伪装 Mac', macUA, 'MacIntel', 5, true, true],
  ['Android 平板', androidUA('K'), 'Linux armv8l', 5, true, false],
  ['三星平板', androidUA('SM-X920'), 'Linux armv8l', 5, true, false],
  ['小米平板（无 Mobile）', androidUA('Xiaomi Pad 8 Pro'), 'Linux armv8l', 5, true, false],
  ['华为鸿蒙 4 平板', 'Mozilla/5.0 (Linux; Android 12; HarmonyOS; BAH4-W09; HMSCore 6.13.0.302) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.196 HuaweiBrowser/15.0.4.312 Safari/537.36', 'Linux armv8l', 5, true, false],
  ['UAParser 按华为型号规则判为 mobile，按原逻辑进 H5（已知识别边界）', androidUA('HUAWEI DBY-W09 Build/HUAWEIDBY-W09; HarmonyOS 4.0'), 'Linux armv8l', 5, false, false],
  ['鸿蒙 NEXT 平板', harmonyUA('Tablet'), 'Linux armv8l', 5, true, false],
  ['真 Mac', macUA, 'MacIntel', 0, false, false],
  ['iPhone', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', 'iPhone', 5, false, false],
  ['Android 手机', androidUA('Pixel 7', true), 'Linux armv8l', 5, false, false],
  ['鸿蒙 NEXT 手机', harmonyUA('Phone'), 'Linux armv8l', 5, false, false],
  ['三星 Z Fold', androidUA('SM-F946B', true), 'Linux armv8l', 5, false, false],
  ['华为 Mate X', androidUA('HUAWEI TET-AN00', true), 'Linux armv8l', 5, false, false],
  ['iPhone Duo', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1', 'iPhone', 5, false, false],
  ['Windows 触屏本', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'Win32', 10, false, false],
  ['Android 桌面模式', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'Linux x86_64', 5, false, false],
  ['Windows UA 继承 Mac 模拟宿主', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0.0.0 Safari/537.36', 'MacIntel', 5, false, false],
  ['iPhone UA 继承 Mac 模拟宿主', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1', 'MacIntel', 5, false, false]
]

function load({ nav = {}, saved = new Map(), now = 20000, storage, screen } = {}) {
  const sessionStorage = storage || {
    getItem: (key) => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
    removeItem: (key) => saved.delete(key)
  }
  const clock = { now }
  const window = { navigator: nav, sessionStorage, screen }
  // 每次清空测试注入的全局值，减少 VM 上下文创建与垃圾回收压力。
  for (const key of Object.keys(context)) delete context[key]
  Object.assign(context, { window, Date: { now: () => clock.now } })
  parserScript.runInContext(context)
  profileScript.runInContext(context)
  return { rules: window.X9Tablet, context, window, saved, clock }
}

test('安卓桌面版仅在 ARM 触屏且屏幕短边至少 600 时识别为平板', () => {
  const cases = [
    ['小米平板横屏', androidDesktopUA, 'Linux armv81', 5, 1164, 777, true],
    ['平板竖屏', androidDesktopUA, 'Linux aarch64', 5, 600, 960, true],
    ['Pixel 8 模拟器桌面版实测', androidDesktopUA, 'Linux armv81', 5, 412, 915, false],
    ['安卓手机 arm', androidDesktopUA, 'Linux armv8l', 5, 599, 1000, false],
    ['安卓手机 aarch64', androidDesktopUA, 'Linux aarch64', 5, 1000, 599, false],
    ['Linux PC', androidDesktopUA, 'Linux x86_64', 0, 1920, 1080, false],
    ['Linux 触屏笔记本', androidDesktopUA, 'Linux x86_64', 10, 1920, 1080, false],
    ['CrOS', 'Mozilla/5.0 (X11; CrOS x86_64) Chrome/138.0.0.0 Safari/537.36', 'Linux aarch64', 5, 1200, 800, false],
    ['无触摸点', androidDesktopUA, 'Linux armv8l', 0, 1200, 800, false]
  ]
  for (const [name, userAgent, platform, maxTouchPoints, width, height, expected] of cases) {
    const nav = { userAgent, platform, maxTouchPoints }
    const { rules, window } = load({ nav, screen: { width, height } })
    const parsed = new window.UAParser(userAgent).getResult()
    assert.equal(rules.isDesktopModeAndroidTablet(parsed, nav), expected, name)
    assert.equal(rules.isTablet(parsed, nav), expected, name)
    assert.equal(rules.isMacDisguisedIPad(parsed, nav), false, name)
  }
})

test('安卓桌面版识别对缺失或异常的 navigator 和 screen 安全返回 false', () => {
  const nav = { userAgent: androidDesktopUA, platform: 'Linux armv8l', maxTouchPoints: 5 }
  const state = load({ nav })
  const fail = () => { throw new Error('unavailable') }
  assert.equal(state.rules.isDesktopModeAndroidTablet(null, null), false)
  assert.equal(state.rules.isDesktopModeAndroidTablet({}, nav), false)
  state.window.screen = { get width() { return fail() }, height: 800 }
  assert.equal(state.rules.isDesktopModeAndroidTablet({}, nav), false)
  Object.defineProperty(state.window, 'screen', { get: fail })
  assert.equal(state.rules.isDesktopModeAndroidTablet({}, nav), false)
  assert.equal(state.rules.isDesktopModeAndroidTablet({}, new Proxy({}, { get: fail })), false)
})

test('桌面版 iPhone（Mac UA + 触摸）按屏幕短边排除，iPad 仍识别', () => {
  const nav = { userAgent: macUA, platform: 'MacIntel', maxTouchPoints: 5 }
  for (const [name, screen, expected] of [
    ['iPhone 17', { width: 402, height: 874 }, false],
    ['iPhone 17 Pro Max', { width: 440, height: 956 }, false],
    ['iPhone Duo 外屏', { width: 466, height: 678 }, false],
    ['短边 599', { width: 599, height: 1000 }, false],
    ['短边边界 600', { width: 600, height: 1000 }, true],
    ['iPad mini', { width: 744, height: 1133 }, true],
    ['iPad Pro 横屏', { width: 1366, height: 1024 }, true]
  ]) {
    const { rules } = load({ nav, screen })
    assert.equal(rules.isMacDisguisedIPad({}, nav), expected, name)
    assert.equal(rules.isTablet({}, nav), expected, name)
    // 浏览器里 UAParser 自己会把「Mac UA + 触点 > 2」解析成 iPad 平板（桌面版 iPhone 也一样），同样按屏幕判断
    assert.equal(rules.isTablet({ device: { type: 'tablet', model: 'iPad' } }, nav), expected, name)
  }
  const fail = () => { throw new Error('unavailable') }
  for (const screen of [undefined, null, { get width() { return fail() }, height: 1180 }]) {
    assert.equal(load({ nav, screen }).rules.isMacDisguisedIPad({}, nav), false)
  }
})

test('桌面版 iPhone 真实入口维持原有行为：不加平板标记、不跳 H5', () => {
  const state = runEntry({ ua: macUA, platform: 'MacIntel', touch: 5, width: 402, height: 714, screen: { width: 402, height: 874 } })
  assert.equal(state.attrs.has('data-tablet-pc'), false)
  assert.deepEqual(state.redirects, [])
})

for (const [name, userAgent, platform, maxTouchPoints, tablet, disguised] of devices) {
  test(`真实 UAParser 识别：${name}`, () => {
    const nav = { userAgent, platform, maxTouchPoints }
    // 设备表统一给 iPad Air 屏幕；屏幕短边规则由上面的用例单独覆盖
    const { rules, window } = load({ nav, screen: { width: 820, height: 1180 } })
    const parsed = new window.UAParser(userAgent).getResult()
    assert.equal(rules.isTablet(parsed, nav), tablet)
    assert.equal(rules.isMacDisguisedIPad(parsed, nav), disguised)
  })
}

test('推荐覆盖 01 第二节全部机型及 6 个尺寸档的横竖屏', () => {
  const { rules } = load()
  const viewports = [
    [756, 1158], [744, 1133], [810, 1080], [820, 1180], [834, 1210],
    [1024, 1366], [1032, 1376], [800, 1228], [920, 1400], [976, 1518],
    [960, 1440], [1068, 1600], [800, 1280], [1060, 1500], [1200, 1696],
    [984, 1400], [1032, 1548], [920, 1472], [924, 1480]
  ]
  for (const [width, height] of viewports) {
    assert.equal(rules.recommend(width, height), 'h5', `${width}×${height}`)
    assert.equal(rules.recommend(height, width), 'pc', `${height}×${width}`)
  }
})

test('推荐边界 B1、B2、B3、B5', () => {
  const { rules } = load()
  for (const [w, h, target] of [[853, 640, 'h5'], [854, 640, 'pc'], [590, 820, 'h5'], [900, 900, 'pc']]) {
    assert.equal(rules.recommend(w, h), target)
  }
})

test('H5 去掉 baseURL 前缀并保持应用内路径精确', () => {
  const { rules } = load()
  for (const [pathname, expected] of [
    ['/m', '/'], ['/m/', '/'], ['/m/live/idx', '/live/idx'],
    ['/m/live/detail', '/live/detail'], ['/m/download', '/download'],
    ['/mobile/live/idx', '/mobile/live/idx'], ['/m/live/idx/', '/live/idx/']
  ]) {
    assert.equal(rules.toAppPath(pathname, '/m/'), expected)
    assert.equal(rules.toAppPath(pathname, ''), pathname)
    assert.equal(rules.toAppPath(pathname, '/'), pathname)
  }
})

test('PC 与 H5 生效路径精确匹配，拒绝其他页面和末尾斜杠', () => {
  const { rules } = load()
  const paths = {
    pc: [['/', '/main', '/live', '/room/123', '/room/'], ['/live/', '/main/', '/football', '/download', '/about-user', '/room', '/roommate/123']],
    h5: [['/', '/live/idx', '/live/detail'], ['/live/idx/', '/live/detail/', '/download', '/user', '/m/live/idx', '/live']]
  }
  for (const [project, [included, excluded]] of Object.entries(paths)) {
    for (const path of included) assert.equal(rules.inScope(project, path), true, `${project} ${path}`)
    for (const path of excluded) assert.equal(rules.inScope(project, path), false, `${project} ${path}`)
  }
  assert.equal(rules.inScope('other', '/'), false)
})

test('一次性标记读取后删除，第二次读取为空，非法值也被清除', () => {
  const { rules, saved } = load()
  for (const target of ['pc', 'h5', 'invalid', '']) {
    saved.set('x9:tablet-switch', target)
    assert.equal(rules.takeSwitchTarget(), target === 'pc' || target === 'h5' ? target : null)
    assert.equal(saved.has('x9:tablet-switch'), false)
    assert.equal(rules.takeSwitchTarget(), null)
  }
})

test('10 秒内记录两次自动跳转后拦截，满 10 秒恢复并清理旧记录', () => {
  const { rules, saved, clock } = load()
  assert.equal(rules.canAutoRedirect(), true)
  rules.recordAutoRedirect()
  assert.equal(rules.canAutoRedirect(), true)
  rules.recordAutoRedirect()
  assert.equal(rules.canAutoRedirect(), false)
  clock.now += 9999
  assert.equal(rules.canAutoRedirect(), false)
  clock.now += 1
  assert.equal(rules.canAutoRedirect(), true)
  rules.recordAutoRedirect()
  assert.deepEqual(JSON.parse(saved.get('x9:tablet-redirects')), [30000])
})

test('损坏的跳转记录按无记录处理，记录后修复为合法时间戳数组', () => {
  const { rules, saved } = load()
  for (const value of ['abc', '{}', 'null', '"text"', '[null]', '["20000"]', '[-1]', '[20001]', '[1e400]']) {
    saved.set('x9:tablet-redirects', value)
    assert.equal(rules.canAutoRedirect(), true, value)
    assert.doesNotThrow(() => rules.recordAutoRedirect())
    assert.deepEqual(JSON.parse(saved.get('x9:tablet-redirects')), [20000])
  }
})

test('存储读、写、删除或属性访问抛错时全部公开函数不抛错', () => {
  const fail = () => { throw new Error('storage unavailable') }
  const { rules, window } = load({ storage: { getItem: fail, setItem: fail, removeItem: fail } })
  const check = () => {
    assert.equal(rules.isTablet({}, {}), false)
    assert.equal(rules.isMacDisguisedIPad({}, {}), false)
    assert.equal(rules.toAppPath('/m/live/idx', '/m/'), '/live/idx')
    assert.equal(rules.inScope('pc', '/main'), true)
    assert.equal(rules.recommend(820, 1180), 'h5')
    assert.equal(rules.takeSwitchTarget(), null)
    assert.equal(rules.canAutoRedirect(), true)
    assert.doesNotThrow(() => rules.recordAutoRedirect())
  }
  check()
  Object.defineProperty(window, 'sessionStorage', { get: fail })
  check()
})

test('识别与路径输入缺失或属性抛错时仍不抛错', () => {
  const { rules } = load()
  const bad = new Proxy({}, { get() { throw new Error('bad input') } })
  assert.equal(rules.isTablet(bad, bad), false)
  assert.equal(rules.isMacDisguisedIPad(bad, bad), false)
  assert.equal(rules.isTablet(null, null), false)
  assert.equal(rules.inScope('pc', bad), false)
  assert.equal(rules.toAppPath('/main', bad), '/main')
  assert.equal(rules.recommend(Symbol(), Symbol()), 'h5')
})

function runEntry({ ua = ipadUA, platform = 'MacIntel', touch = 5, width = 820, height = 1180, path = '/main', saved, storage, screen } = {}) {
  const nav = { userAgent: ua, platform, maxTouchPoints: touch }
  const state = load({ nav, saved, storage, screen })
  const attrs = new Set()
  const redirects = []
  const local = new Map()
  const location = new URL(path, 'https://tablet.test')
  location.replace = (url) => redirects.push(url)
  Object.assign(state.window, { location, innerWidth: width, innerHeight: height })
  Object.assign(state.context, {
    navigator: nav, location, innerWidth: width, innerHeight: height,
    UAParser: state.window.UAParser,
    document: { documentElement: { setAttribute: (key) => attrs.add(key) } },
    localStorage: { setItem: (key, value) => local.set(key, value) }
  })
  inlineScript.runInContext(state.context)
  return { ...state, attrs, redirects, local }
}

test('安卓桌面版平板真实入口横屏留 PC、竖屏切 H5', () => {
  const args = { ua: androidDesktopUA, platform: 'Linux armv81', touch: 5, screen: { width: 1164, height: 777 } }
  const landscape = runEntry({ ...args, width: 1164, height: 777 })
  assert.equal(landscape.attrs.has('data-tablet-pc'), true)
  assert.deepEqual(landscape.redirects, [])
  const portrait = runEntry({ ...args, width: 777, height: 1164 })
  assert.equal(portrait.attrs.has('data-tablet-pc'), true)
  assert.deepEqual(portrait.redirects, ['https://tablet.test/m/live/idx'])
})

test('安卓手机桌面版真实入口维持原有行为', () => {
  const state = runEntry({
    ua: androidDesktopUA, platform: 'Linux aarch64', touch: 5,
    width: 393, height: 852, screen: { width: 393, height: 852 }
  })
  assert.equal(state.attrs.has('data-tablet-pc'), false)
  assert.deepEqual(state.redirects, [])
})

test('共享规则在 UAParser 之后、入口内联脚本之前同步加载', () => {
  assert.match(entryHTML, /ua-parser\.min\.js"><\/script>\s*<script src="\/static\/assets\/tablet-profile\.js"><\/script>\s*<script>/)
})

for (const target of [null, 'pc', 'h5']) {
  for (const recommended of ['pc', 'h5']) {
    for (const allowed of [true, false]) {
      test(`PC 真实入口：标记 ${target}、推荐 ${recommended}、自动跳转 ${allowed}`, () => {
        const records = allowed ? [20000] : [20000, 20000]
        const saved = new Map([['x9:tablet-redirects', JSON.stringify(records)]])
        if (target) saved.set('x9:tablet-switch', target)
        const state = runEntry({ saved, width: recommended === 'pc' ? 1180 : 820, height: recommended === 'pc' ? 820 : 1180 })
        const redirect = target ? target === 'h5' : recommended === 'h5' && allowed
        assert.deepEqual(state.redirects, redirect ? ['https://tablet.test/m/live/idx'] : [])
        assert.equal(state.attrs.has('data-tablet-pc'), true)
        assert.equal(saved.has('x9:tablet-switch'), false)
        assert.equal(JSON.parse(saved.get('x9:tablet-redirects')).length, records.length + (redirect && !target ? 1 : 0))
      })

      test(`H5 等价入口决策：标记 ${target}、推荐 ${recommended}、自动跳转 ${allowed}`, () => {
        const records = allowed ? [20000] : [20000, 20000]
        const saved = new Map([['x9:tablet-redirects', JSON.stringify(records)]])
        if (target) saved.set('x9:tablet-switch', target)
        const { rules: X } = load({ saved })
        const switchTarget = X.takeSwitchTarget()
        const scoped = X.inScope('h5', X.toAppPath('/m/live/idx', '/m/'))
        const width = recommended === 'pc' ? 1180 : 820
        const height = recommended === 'pc' ? 820 : 1180
        const tabletStayH5 = scoped && (switchTarget
          ? switchTarget === 'h5'
          : X.recommend(width, height) === 'h5' || !X.canAutoRedirect())
        if (!tabletStayH5 && scoped && !switchTarget) X.recordAutoRedirect()
        assert.equal(tabletStayH5, target ? target === 'h5' : recommended === 'h5' || !allowed)
        assert.equal(saved.has('x9:tablet-switch'), false)
        assert.equal(JSON.parse(saved.get('x9:tablet-redirects')).length, records.length + (!tabletStayH5 && !target ? 1 : 0))
      })
    }
  }
}

test('PC 直播间和首页沿用手机路径映射，携带渠道、邀请和登录参数', () => {
  for (const [path, expected] of [
    ['/live?uid=341&channel_code=A06&invite_code=abc', '/m/live/detail?id=341&sharingFromShortLink=1&channel_code=A06&invite_code=abc'],
    ['/room/341?channel=A06&invite_code=abc', '/m/live/detail?id=341&sharingFromShortLink=1&channel_code=A06&invite_code=abc'],
    ['/?token=test-token&userId=42&c=A06&invite_code=abc', '/m/live/idx?token=test-token&userId=42&channel_code=A06&invite_code=abc']
  ]) {
    const { redirects, local } = runEntry({ path })
    assert.deepEqual(redirects, ['https://tablet.test' + expected])
    assert.equal(local.get('channel'), 'A06')
    assert.equal(local.get('urlInviteCode'), 'abc')
  }
})

// TP-116：非生效页面只在用户点了「切换移动版」（一次性 h5 标记）时去 H5，有对应页进对应页，其余进 H5 直播首页；
// 没有标记时仍不自动分流（用户决定），不记录防循环
test('非生效页面与末尾斜杠：有一次性 H5 标记时去 H5，没有对应页进直播首页，不记防循环', () => {
  for (const [path, expected] of [
    ['/football', '/m/live/idx'],
    ['/download', '/m/download'],
    ['/about-user', '/m/protocol/privacy'],
    ['/live/?uid=341', '/m/live/idx'],
    ['/main/', '/m/live/idx'],
    ['/football?channel_code=A06', '/m/live/idx?channel_code=A06']
  ]) {
    for (const size of [{ width: 820, height: 1180 }, { width: 1180, height: 820 }]) {
      const saved = new Map([['x9:tablet-switch', 'h5']])
      const state = runEntry({ path, saved, ...size })
      assert.deepEqual(state.redirects, ['https://tablet.test' + expected], path)
      assert.equal(state.attrs.has('data-tablet-pc'), true)
      assert.equal(saved.has('x9:tablet-switch'), false)
      assert.equal(saved.has('x9:tablet-redirects'), false)
    }
  }
})

test('非生效页面没有 H5 标记时不自动分流：竖屏、PC 标记都留在 PC', () => {
  for (const path of ['/football', '/download', '/about-user', '/live/?uid=341', '/main/']) {
    for (const saved of [new Map(), new Map([['x9:tablet-switch', 'pc']])]) {
      const state = runEntry({ path, saved })
      assert.deepEqual(state.redirects, [], path)
      assert.equal(saved.has('x9:tablet-switch'), false)
      assert.equal(saved.has('x9:tablet-redirects'), false)
    }
  }
})

test('PC 短链接规范化在横屏、被拦截、手动留 PC 时保留且不记跨站跳转', () => {
  for (const options of [
    { width: 1180, height: 820 },
    { saved: new Map([['x9:tablet-redirects', '[20000,20000]']]) },
    { saved: new Map([['x9:tablet-switch', 'pc']]) }
  ]) {
    const before = options.saved?.get('x9:tablet-redirects')
    const state = runEntry({ ...options, path: '/room/341?channel_code=A06&invite_code=abc' })
    assert.deepEqual(state.redirects, ['https://tablet.test/live?uid=341&channel_code=A06&invite_code=abc'])
    assert.equal(state.saved.get('x9:tablet-redirects'), before)
  }
})

test('一次性 PC 标记仅作用一次，下一次加载恢复按推荐跳 H5', () => {
  const saved = new Map([['x9:tablet-switch', 'pc']])
  assert.deepEqual(runEntry({ saved }).redirects, [])
  assert.deepEqual(runEntry({ saved }).redirects, ['https://tablet.test/m/live/idx'])
})

test('非法记录或存储完全不可用时真实入口仍可跳转且不抛错', () => {
  const fail = () => { throw new Error('storage unavailable') }
  for (const options of [
    { saved: new Map([['x9:tablet-redirects', 'abc']]) },
    { storage: { getItem: fail, setItem: fail, removeItem: fail } }
  ]) assert.deepEqual(runEntry(options).redirects, ['https://tablet.test/m/live/idx'])
})

for (const [name, ua, platform, touch] of devices.filter((row) => !row[4])) {
  test(`非平板真实入口回归：${name}`, () => {
    const parsed = load().window.UAParser(ua)
    const phone = parsed.device.type === 'mobile'
    for (const width of [375, 1180]) {
      for (const [path, mobileTarget, desktopTarget] of [
        ['/main', '/m/live/idx', null],
        ['/?token=test-token&userId=42', '/m/live/idx?token=test-token&userId=42', null],
        ['/live?uid=341', '/m/live/detail?id=341&sharingFromShortLink=1', null],
        ['/room/341', '/m/live/detail?id=341&sharingFromShortLink=1', '/live?uid=341'],
        ['/download', '/m/download', null],
        ['/about-user', '/m/protocol/privacy', null]
      ]) {
        const saved = new Map([['x9:tablet-switch', 'h5']])
        const state = runEntry({ ua, platform, touch, width, path, saved })
        const target = phone ? mobileTarget : desktopTarget
        assert.deepEqual(state.redirects, target ? ['https://tablet.test' + target] : [], path)
        assert.equal(state.attrs.size, 0)
        assert.equal(saved.get('x9:tablet-switch'), 'h5')
        assert.equal(saved.has('x9:tablet-redirects'), false)
      }
    }
  })
}

test('PC 真实入口覆盖 6 档横竖屏与 B1、B2、B3、B5，首页和直播间结论一致', () => {
  const dimensions = [
    [744, 1133, 'h5'], [1133, 744, 'pc'], [820, 1180, 'h5'], [1180, 820, 'pc'],
    [800, 1280, 'h5'], [1280, 800, 'pc'], [1024, 1366, 'h5'], [1366, 1024, 'pc'],
    [1068, 1600, 'h5'], [1600, 1068, 'pc'], [1200, 1696, 'h5'], [1696, 1200, 'pc'],
    [853, 640, 'h5'], [854, 640, 'pc'], [590, 820, 'h5'], [900, 900, 'pc']
  ]
  for (const [width, height, target] of dimensions) {
    for (const [path, mobilePath] of [['/main', '/m/live/idx'], ['/live?uid=341', '/m/live/detail?id=341&sharingFromShortLink=1']]) {
      const state = runEntry({ width, height, path })
      assert.deepEqual(state.redirects, target === 'h5' ? ['https://tablet.test' + mobilePath] : [], `${width}×${height} ${path}`)
      assert.equal(state.attrs.has('data-tablet-pc'), true)
    }
  }
})

test('H5 非生效路径不因推荐 H5、一次性 H5 标记或防循环而留站', () => {
  for (const switchTarget of [null, 'pc', 'h5']) {
    const { rules: X } = load({ saved: new Map([['x9:tablet-redirects', '[20000,20000]']]) })
    for (const pathname of ['/m/download', '/m/user', '/m/live/idx/']) {
      const scoped = X.inScope('h5', X.toAppPath(pathname, '/m/'))
      const tabletStayH5 = scoped && (switchTarget
        ? switchTarget === 'h5'
        : X.recommend(820, 1180) === 'h5' || !X.canAutoRedirect())
      assert.equal(tabletStayH5, false)
    }
  }
})
