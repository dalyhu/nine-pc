import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
import { ref, computed, watch, reactive, nextTick, createRenderer, compile } from 'vue'
import { parse, compileStyleAsync } from 'vue/compiler-sfc'

const source = readFileSync(new URL('../src/components/tablet/TabletVersionNotice.vue', import.meta.url), 'utf8')
const profileSource = readFileSync(new URL('../public/static/assets/tablet-profile.js', import.meta.url), 'utf8')
const script = parse(source).descriptor.scriptSetup.content.replace(/^import .* from ['"](?:vue|vue-router)['"]\n/gm, '')

function mountNotice({ tablet = true, path = '/main', width = 1180, height = 820, modern = false, saved = new Map(), storageThrows = false } = {}) {
  const windowEvents = new Map(), documentEvents = new Map(), orientationEvents = new Map()
  const timers = new Map(), frames = new Map(), mounted = [], unmounted = [], observers = []
  const attrs = new Set(tablet ? ['data-tablet-pc'] : [])
  const route = reactive({ path })
  let nextId = 0, reloads = 0
  const add = (events) => (type, fn) => {
    if (!events.has(type)) events.set(type, new Set())
    events.get(type).add(fn)
  }
  const remove = (events) => (type, fn) => events.get(type)?.delete(fn)
  const storage = {
    getItem(key) { if (storageThrows) throw Error('storage unavailable'); return saved.get(key) ?? null },
    setItem(key, value) { if (storageThrows) throw Error('storage unavailable'); saved.set(key, value) }
  }
  const window = {
    innerWidth: width, innerHeight: height, sessionStorage: storage,
    location: { reload: () => { reloads++ } },
    addEventListener: add(windowEvents), removeEventListener: remove(windowEvents),
    screen: modern ? { orientation: { addEventListener: add(orientationEvents), removeEventListener: remove(orientationEvents) } } : undefined
  }
  const document = {
    documentElement: { hasAttribute: (key) => attrs.has(key) },
    activeElement: { matches: () => false }, fullscreenElement: null, webkitFullscreenElement: null,
    addEventListener: add(documentEvents), removeEventListener: remove(documentEvents)
  }
  const ctx = vm.createContext({
    window, document, ref, computed, watch, useRoute: () => route,
    onMounted: (fn) => mounted.push(fn), onBeforeUnmount: (fn) => unmounted.push(fn),
    setTimeout: (fn, delay) => { assert.equal(delay, 150); const id = ++nextId; timers.set(id, fn); return id },
    clearTimeout: (id) => timers.delete(id),
    requestAnimationFrame: (fn) => { const id = ++nextId; frames.set(id, fn); return id },
    cancelAnimationFrame: (id) => frames.delete(id),
    MutationObserver: class {
      constructor(callback) { this.callback = callback; observers.push(this) }
      observe(target, options) { this.target = target; this.options = options; this.active = true }
      disconnect() { this.active = false }
    }
  })
  vm.runInContext(profileSource, ctx)
  vm.runInContext(script + '\nwindow.notice = { showNotice, recommended, dismiss, switchVersion }', ctx)
  mounted.forEach((fn) => fn())
  const emit = (events, type) => [...(events.get(type) || [])].forEach((fn) => fn())
  const flush = (queue) => { const pending = [...queue.values()]; queue.clear(); pending.forEach((fn) => fn()) }
  return {
    window, document, route, attrs, saved, timers, frames, observers, windowEvents, documentEvents, orientationEvents,
    notice: window.notice,
    get reloads() { return reloads },
    emit: (type) => emit(windowEvents, type),
    emitDocument: (type) => emit(documentEvents, type),
    orient: () => emit(orientationEvents, 'change'),
    flush: () => flush(timers), frame: () => flush(frames),
    resize(w, h) { window.innerWidth = w; window.innerHeight = h; emit(windowEvents, 'resize'); flush(timers) },
    async navigate(next) { route.path = next; await nextTick() },
    fullscreen(type, enabled) {
      if (type === 'web') {
        if (enabled) attrs.add('data-player-web-fullscreen'); else attrs.delete('data-player-web-fullscreen')
        observers.filter((observer) => observer.active).forEach((observer) => observer.callback([{ attributeName: 'data-player-web-fullscreen' }]))
      } else {
        document[type === 'native' ? 'fullscreenElement' : 'webkitFullscreenElement'] = enabled ? {} : null
        emit(documentEvents, type === 'native' ? 'fullscreenchange' : 'webkitfullscreenchange')
      }
      flush(timers)
    },
    unmount() { unmounted.forEach((fn) => fn()) }
  }
}

test('进入不匹配视口只记录基线，推荐不变时不弹横条', () => {
  const page = mountNotice({ width: 820, height: 1180 })
  assert.equal(page.notice.showNotice.value, false)
  page.resize(821, 1180)
  page.emit('focusout'); page.frame(); page.flush()
  assert.equal(page.notice.showNotice.value, false)
  page.resize(1180, 820)
  assert.equal(page.notice.showNotice.value, false)
  page.resize(820, 1180)
  assert.equal(page.notice.showNotice.value, true)
  assert.equal(page.notice.recommended.value, 'h5')
  assert.equal(page.reloads, 0)
  page.unmount()
})

test('150ms 防抖只看最终尺寸，提示出现后同一推荐下保持显示', () => {
  const page = mountNotice()
  page.window.innerWidth = 820; page.window.innerHeight = 1180
  page.emit('resize'); page.emit('orientationchange'); page.emit('resize')
  assert.equal(page.timers.size, 1)
  assert.equal(page.notice.showNotice.value, false)
  page.flush()
  assert.equal(page.notice.showNotice.value, true)
  page.resize(821, 1180)
  assert.equal(page.notice.showNotice.value, true)
  page.resize(1180, 820)
  assert.equal(page.notice.showNotice.value, false)
  page.unmount()
})

test('换页清理待执行计算，进入新页面重新建立基线', async () => {
  const page = mountNotice()
  page.window.innerWidth = 820; page.window.innerHeight = 1180
  page.emit('resize')
  await page.navigate('/football')
  assert.equal(page.timers.size, 0)
  page.flush()
  assert.equal(page.notice.showNotice.value, false)
  await page.navigate('/live')
  assert.equal(page.notice.showNotice.value, false)
  page.resize(1180, 820); page.resize(820, 1180)
  assert.equal(page.notice.showNotice.value, true)
  await page.navigate('/main')
  assert.equal(page.notice.showNotice.value, false)
  page.unmount()
})

test('非平板不渲染提示，也不注册事件、路由监听或观察器', async () => {
  const page = mountNotice({ tablet: false })
  page.resize(820, 1180)
  await page.navigate('/live')
  assert.equal(page.notice.showNotice.value, false)
  assert.equal(page.windowEvents.size, 0)
  assert.equal(page.documentEvents.size, 0)
  assert.equal(page.orientationEvents.size, 0)
  assert.equal(page.observers.length, 0)
  assert.equal(page.timers.size, 0)
  page.unmount()
})

// TP-116：转屏提示对平板所有页面生效（不再只限首页、直播间），每次换页按当前尺寸重新建立基线
test('平板任何页面（含末尾斜杠）转到推荐 H5 的尺寸都提示，换页后重新建立基线', async () => {
  const page = mountNotice({ path: '/football' })
  for (const path of ['/download', '/main/', '/live/', '/football', '/main']) {
    await page.navigate(path)
    assert.equal(page.notice.showNotice.value, false, path)
    page.resize(1180, 820); page.resize(820, 1180)
    assert.equal(page.notice.showNotice.value, true, path)
  }
  page.unmount()
})

test('关闭提示后在当前会话内永久隐藏，重新挂载也读取关闭标记', () => {
  const saved = new Map()
  const page = mountNotice({ saved })
  page.resize(820, 1180)
  page.notice.dismiss()
  assert.equal(page.notice.showNotice.value, false)
  assert.equal(saved.get('x9:tablet-notice-dismissed'), '1')
  page.resize(1180, 820); page.resize(820, 1180)
  assert.equal(page.notice.showNotice.value, false)
  page.unmount()
  const next = mountNotice({ saved })
  next.resize(820, 1180)
  assert.equal(next.notice.showNotice.value, false)
  next.unmount()
  const fresh = mountNotice()
  fresh.resize(820, 1180)
  assert.equal(fresh.notice.showNotice.value, true)
  fresh.unmount()
})

test('切换只写入一次性 h5 目标并刷新当前页面，不拼接地址', () => {
  const page = mountNotice()
  page.resize(820, 1180)
  page.notice.switchVersion()
  assert.equal(page.saved.get('x9:tablet-switch'), 'h5')
  assert.equal(page.reloads, 1)
  assert.equal(page.saved.has('x9:tablet-redirects'), false)
  page.unmount()
})

test('存储不可用时关闭仍生效，切换仍刷新，不抛错', () => {
  const page = mountNotice({ storageThrows: true })
  page.resize(820, 1180)
  assert.doesNotThrow(() => page.notice.switchVersion())
  assert.equal(page.reloads, 1)
  assert.doesNotThrow(() => page.notice.dismiss())
  page.resize(1180, 820); page.resize(820, 1180)
  assert.equal(page.notice.showNotice.value, false)
  page.unmount()
})

for (const kind of ['input', 'textarea', 'contenteditable']) {
  test(`${kind} 聚焦期间不更新推荐，失焦后下一帧再防抖补算`, () => {
    const page = mountNotice()
    let focused = true
    const selector = kind === 'contenteditable' ? '[contenteditable="true"]' : kind
    page.document.activeElement = { matches: (selectors) => focused && selectors.split(',').some((value) => value.trim() === selector) }
    page.resize(820, 1180)
    assert.equal(page.notice.recommended.value, 'pc')
    assert.equal(page.notice.showNotice.value, false)
    focused = false
    page.emit('focusout')
    assert.equal(page.frames.size, 1)
    assert.equal(page.timers.size, 0)
    page.frame()
    assert.equal(page.notice.showNotice.value, false)
    page.flush()
    assert.equal(page.notice.showNotice.value, true)
    page.unmount()
  })
}

for (const kind of ['native', 'webkit', 'web']) {
  test(`${kind} 全屏期间不计算、不显示，退出后按最终方向补算`, () => {
    const page = mountNotice()
    page.fullscreen(kind, true)
    page.resize(820, 1180)
    assert.equal(page.notice.recommended.value, 'pc')
    assert.equal(page.notice.showNotice.value, false)
    page.fullscreen(kind, false)
    assert.equal(page.notice.recommended.value, 'h5')
    assert.equal(page.notice.showNotice.value, true)
    page.fullscreen(kind, true)
    assert.equal(page.notice.showNotice.value, false)
    page.resize(1180, 820)
    page.fullscreen(kind, false)
    assert.equal(page.notice.showNotice.value, false)
    page.unmount()
  })

  test(`${kind} 全屏中的往返旋转不计入推荐变化`, () => {
    const page = mountNotice()
    page.fullscreen(kind, true)
    page.resize(820, 1180); page.resize(1180, 820)
    page.fullscreen(kind, false)
    assert.equal(page.notice.showNotice.value, false)
    page.unmount()
  })
}

test('现代方向事件和网页全屏观察器只注册所需事件，卸载完全清理', async () => {
  const page = mountNotice({ modern: true })
  assert.equal(page.orientationEvents.get('change').size, 1)
  assert.equal(page.windowEvents.has('orientationchange'), false)
  assert.equal(page.observers.length, 1)
  assert.deepEqual(Array.from(page.observers[0].options.attributeFilter), ['data-player-web-fullscreen'])
  page.window.innerWidth = 820; page.window.innerHeight = 1180
  page.orient(); page.flush()
  assert.equal(page.notice.showNotice.value, true)
  page.emit('resize'); page.emit('focusout')
  page.unmount()
  assert.equal(page.timers.size, 0)
  assert.equal(page.frames.size, 0)
  for (const events of [page.windowEvents, page.documentEvents, page.orientationEvents]) {
    for (const handlers of events.values()) assert.equal(handlers.size, 0)
  }
  assert.equal(page.observers[0].active, false)
  await page.navigate('/live')
  assert.equal(page.timers.size, 0)
})

test('离开页面也取消失焦的下一帧计算', async () => {
  const page = mountNotice()
  page.emit('focusout')
  await page.navigate('/football')
  assert.equal(page.frames.size, 0)
  page.frame(); page.flush()
  assert.equal(page.notice.showNotice.value, false)
  page.unmount()
})

test('B1 两个方向都推荐 H5，不因往返旋转产生无意义提示', () => {
  const page = mountNotice({ width: 853, height: 640 })
  for (const [width, height] of [[640, 853], [853, 640], [640, 853]]) {
    page.resize(width, height)
    assert.equal(page.notice.recommended.value, 'h5')
    assert.equal(page.notice.showNotice.value, false)
  }
  page.unmount()
})

function renderNotice(state) {
  const node = (type, text = '') => ({ type, text, props: {}, children: [], parent: null })
  const body = node('body'), root = node('root')
  const remove = (child) => {
    if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1)
    child.parent = null
  }
  const renderer = createRenderer({
    createElement: node, createText: (text) => node('#text', text), createComment: (text) => node('#comment', text),
    setText: (child, text) => { child.text = text }, setElementText: (child, text) => { child.text = text },
    patchProp: (child, key, previous, next) => { child.props[key] = next },
    parentNode: (child) => child.parent,
    nextSibling: (child) => child.parent?.children[child.parent.children.indexOf(child) + 1],
    insert(child, parent, anchor = null) {
      remove(child)
      const index = anchor ? parent.children.indexOf(anchor) : parent.children.length
      parent.children.splice(index, 0, child); child.parent = parent
    },
    remove, querySelector: (selector) => selector === 'body' ? body : null
  })
  const app = renderer.createApp({ render: compile(parse(source).descriptor.template.content), setup: () => state })
  app.mount(root)
  const all = (element = body) => [element, ...element.children.flatMap((child) => all(child))]
  return { all, unmount: () => app.unmount() }
}

test('实际模板在无提示时无横条 DOM，触发后只有一条横条和两个可访问按钮', async () => {
  const page = mountNotice()
  const dom = renderNotice(page.notice)
  assert.equal(dom.all().filter((node) => node.props.role === 'region').length, 0)
  page.resize(820, 1180); await nextTick()
  assert.equal(dom.all().filter((node) => node.props.role === 'region').length, 1)
  const buttons = dom.all().filter((node) => node.type === 'button')
  assert.equal(buttons.length, 2)
  assert.equal(buttons[1].props['aria-label'], '关闭切换提示')
  assert.equal(buttons[0].props.type, 'button')
  assert.ok(dom.all().some((node) => node.text === '当前空间更适合移动版'))
  assert.ok(dom.all().some((node) => node.text === '切换将重新加载页面'))
  buttons[0].props.onClick()
  assert.equal(page.saved.get('x9:tablet-switch'), 'h5')
  assert.equal(page.reloads, 1)
  buttons[1].props.onClick(); await nextTick()
  assert.equal(dom.all().filter((node) => node.props.role === 'region').length, 0)
  dom.unmount(); page.unmount()
})

test('非平板实际模板始终没有横条 DOM，App 在挂载前还有平板条件守卫', async () => {
  const page = mountNotice({ tablet: false })
  const dom = renderNotice(page.notice)
  page.resize(820, 1180); await nextTick()
  assert.equal(dom.all().filter((node) => node.props.role === 'region').length, 0)
  assert.equal(dom.all().filter((node) => node.type === 'button').length, 0)
  const app = readFileSync(new URL('../src/App.vue', import.meta.url), 'utf8')
  assert.match(app, /const isTabletPC = document\.documentElement\.hasAttribute\('data-tablet-pc'\)/)
  assert.match(app, /<router-view\s*\/>\s*<TabletVersionNotice v-if="isTabletPC"\s*\/>/)
  dom.unmount(); page.unmount()
})

test('编译后的横条样式限定平板作用域，全屏隐藏规则不隐藏 html，触摸按钮至少 44px', async () => {
  const style = parse(source).descriptor.styles[0]
  const result = await compileStyleAsync({ source: style.content, id: 'data-v-test', scoped: style.scoped, preprocessLang: 'scss' })
  assert.deepEqual(result.errors, [])
  const selectors = [...result.code.matchAll(/([^{}]+)\{/g)].map((match) => match[1].trim())
  assert.ok(selectors.length > 0)
  for (const selector of selectors) {
    assert.match(selector, /^html\[data-tablet-pc\]/)
    assert.match(selector, /\.tablet-version-/)
  }
  assert.match(result.code, /min-height:\s*44px/)
  assert.match(result.code, /min-width:\s*44px/)
  assert.match(result.code, /html\[data-tablet-pc\]\[data-player-web-fullscreen\] \.tablet-version-notice\s*\{\s*display:\s*none !important/)
})
