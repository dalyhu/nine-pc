import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
import { compile, computed, createRenderer, defineComponent, h, ref } from 'vue'
import { parse } from 'vue/compiler-sfc'

const menuList = [
  { title: '即时比分', path: '/football', showPopper: true, children: [] },
  { title: 'APP下载', path: '/downLoad', children: [] }
]

function mountNavigation(name, tablet) {
  const file = new URL(`../src/layout/components/Navbar/${name}.vue`, import.meta.url)
  const descriptor = parse(readFileSync(file, 'utf8')).descriptor
  const script = descriptor.scriptSetup.content.replace(/^import .*\n/gm, '')
  const navigations = []
  const router = { push: (path) => navigations.push(path), resolve: () => ({ href: '/search' }) }
  const store = { state: { user: { infoData: {} }, visitorInfo: {} }, getters: { getUserInfo: {} }, commit() {}, dispatch() {} }
  const noop = () => {}
  const ctx = vm.createContext({
    document: { documentElement: { hasAttribute: (name) => name === 'data-tablet-pc' && tablet } },
    window: { location: { origin: 'https://example.test' }, open: noop },
    sessionStorage: { getItem: () => null }, localStorage: { getItem: () => null },
    useRouter: () => router, useRoute: () => ({ path: '/main', query: {} }), useStore: () => store,
    defineProps: noop, computed, ref, nextTick: (fn) => fn?.(), onMounted: noop, onUnmounted: noop,
    getUrlParams: () => null, normalizeUrl: (url) => url, getBbsUrl: noop,
    useLocalStorage: () => ref([]), union: (value) => value, initialList: noop,
    updateInfo: noop, inviteeLog: noop, mittBus: { on: noop, off: noop },
    Search: 'i', Delete: 'i', Avatar: 'i', VideoCamera: 'i', Share: 'i'
  })
  const exports = {
    SubMenu: '{tabletMode, handleClickMenu, gotoDownload, subMenuActive, menuList}',
    HeadSearch: '{tabletMode, searchValue, historyList, popularList, handleKeyCode, handleSearch, handleOpen, handleTag, clearHistory, Search, Delete}',
    SpaceAndMine: '{tabletMode, visible, userInfo, isLogin, isAnchor, pageToMine, pageToBroadcast, handleLogin, popperShowHandler}'
  }
  ctx.menuList = menuList
  const state = vm.runInContext(`${script}\n;(${exports[name]})`, ctx)

  const node = (type, text = '') => ({ type, text, props: {}, style: {}, children: [], parent: null })
  const root = node('root')
  const remove = (child) => {
    if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1)
    child.parent = null
  }
  const renderer = createRenderer({
    createElement: node, createText: (text) => node('#text', text), createComment: (text) => node('#comment', text),
    setText: (child, text) => { child.text = text }, setElementText: (child, text) => { child.text = text },
    patchProp: (child, key, oldValue, value) => { child.props[key] = value },
    parentNode: (child) => child.parent,
    nextSibling: (child) => child.parent?.children[child.parent.children.indexOf(child) + 1],
    insert(child, parent, anchor = null) {
      remove(child)
      parent.children.splice(anchor ? parent.children.indexOf(anchor) : parent.children.length, 0, child)
      child.parent = parent
    },
    remove
  })
  const popover = defineComponent({
    props: ['trigger', 'popperClass'],
    setup: (props, { slots }) => () => h('section', { 'data-trigger': props.trigger, 'data-popper': props.popperClass }, [slots.reference?.(), slots.default?.()])
  })
  const menuItem = defineComponent({
    inheritAttrs: false,
    setup: (_, { slots, attrs }) => () => h('li', { onClick: attrs.onClick }, slots.title?.())
  })
  const generic = defineComponent({ setup: (_, { slots }) => () => h('div', slots.default?.()) })
  const app = renderer.createApp({ setup: () => state, render: compile(descriptor.template.content) })
  app.component('el-popover', popover)
  app.component('el-menu-item', menuItem)
  for (const component of ['el-icon', 'el-input', 'el-button', 'el-tag', 'el-avatar', 'el-image', 'qrCode', 'Search', 'Delete']) app.component(component, generic)
  app.mount(root)
  const all = (element = root) => [element, ...element.children.flatMap((child) => all(child))]
  function click(target) {
    const event = { stopped: false, stopPropagation() { this.stopped = true } }
    for (let current = target; current && !event.stopped; current = current.parent) {
      const handlers = current.props.onClick
      for (const handler of (Array.isArray(handlers) ? handlers : handlers ? [handlers] : [])) handler(event)
    }
  }
  return { all, click, navigations, unmount: () => app.unmount() }
}

for (const tablet of [true, false]) {
  for (const name of ['SubMenu', 'HeadSearch', 'SpaceAndMine']) {
    test(`${name} 在${tablet ? '平板' : '普通电脑'}使用${tablet ? '点击' : '悬停'}弹层`, () => {
      const page = mountNavigation(name, tablet)
      const popovers = page.all().filter((element) => element.type === 'section' && element.props['data-popper'])
      assert.equal(popovers.length, name === 'SubMenu' ? 2 : 1)
      for (const popover of popovers) assert.equal(popover.props['data-trigger'], tablet ? 'click' : 'hover')
      page.unmount()
    })
  }

  test(`点击${tablet ? '平板' : '普通电脑'}菜单标题${tablet ? '不触发' : '保留'}父级导航`, () => {
    const page = mountNavigation('SubMenu', tablet)
    const popovers = page.all().filter((element) => element.type === 'section' && element.props['data-popper'])
    for (const popover of popovers) {
      const reference = popover.children.find((element) => element.type === 'span')
      assert.ok(reference)
      page.click(reference)
    }
    assert.deepEqual(page.navigations, tablet ? [] : ['/football', '/downLoad'])
    page.unmount()
  })
}
