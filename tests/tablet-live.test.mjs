import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import { compile, computed, createRenderer, defineComponent, h, nextTick, ref } from 'vue'
import { parse } from 'vue/compiler-sfc'

function mountGift(tablet) {
  const descriptor = parse(readFileSync(new URL('../src/components/chatBox/components/giftsPop/index.vue', import.meta.url), 'utf8')).descriptor
  const source = descriptor.scriptSetup.content.replace(/^import .*\n/gm, '')
  const script = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText
  const calls = []
  const gift = { id: 1, needcoin: 1, isHover: false }
  const noop = () => {}
  const context = vm.createContext({
    document: { documentElement: { hasAttribute: () => tablet } },
    defineProps: () => ({ uid: 2 }), computed, ref, inject: () => ref([gift]),
    useStore: () => ({ state: { user: { infoData: { id: 3, balances: 100 } } }, dispatch: noop }),
    useScroll: () => ({ isScrolling: ref(false) }), watch: noop, onMounted: (fn) => fn(),
    useDebounceFn: (fn) => fn, handselGift: (value) => { calls.push(value); return Promise.resolve({ code: 0 }) },
    floor: Math.floor, ElMessage: { success: noop, warning: noop }, getList: noop
  })
  const state = vm.runInContext(`${script}\n;({tabletMode,giftList,gifPopoverRef,giftsScrollerRef,gifPopoverIndex,debouncedSendGift,showDiamondDirections,userInfo,floor})`, context)
  const node = (type, text = '') => ({ type, text, props: {}, children: [], parent: null })
  const root = node('root')
  const remove = (child) => {
    if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1)
    child.parent = null
  }
  const renderer = createRenderer({
    createElement: node, createText: (text) => node('#text', text), createComment: (text) => node('#comment', text),
    setText: (child, text) => { child.text = text }, setElementText: (child, text) => { child.text = text },
    patchProp: (child, key, oldValue, value) => { child.props[key] = value }, parentNode: (child) => child.parent,
    nextSibling: (child) => child.parent?.children[child.parent.children.indexOf(child) + 1],
    insert(child, parent, anchor = null) { remove(child); parent.children.splice(anchor ? parent.children.indexOf(anchor) : parent.children.length, 0, child); child.parent = parent }, remove
  })
  const popover = defineComponent({
    inheritAttrs: false, props: ['trigger'],
    setup: (props, { slots, attrs }) => () => h('section', { 'data-trigger': props.trigger, onClick: () => attrs.onBeforeEnter?.() }, slots.reference?.())
  })
  const generic = defineComponent({ setup: (_, { slots }) => () => h('div', slots.default?.()) })
  const app = renderer.createApp({ setup: () => state, render: compile(descriptor.template.content) })
  app.component('el-popover', popover)
  for (const name of ['df-container', 'df-image-lazy', 'el-dialog', 'GiftDetail', 'GetCoinGuide', 'IconQuestion']) app.component(name, generic)
  app.mount(root)
  const all = (element = root) => [element, ...element.children.flatMap((child) => all(child))]
  const click = (target) => {
    const event = { stopped: false, stopPropagation() { this.stopped = true } }
    for (let current = target; current && !event.stopped; current = current.parent) {
      const handlers = current.props.onClick
      for (const handler of (Array.isArray(handlers) ? handlers : handlers ? [handlers] : [])) handler(event)
    }
    return event
  }
  return { all, click, calls, gift, unmount: () => app.unmount() }
}

for (const tablet of [true, false]) {
  test(`直播间礼物在${tablet ? '平板' : '普通电脑'}保留独立预览和赠送`, async () => {
    const page = mountGift(tablet)
    const popover = page.all().find((element) => element.type === 'section')
    assert.equal(popover.props['data-trigger'], tablet ? 'click' : 'hover')
    const item = page.all().find((element) => element.props.class?.includes('gift_item'))
    page.click(item)
    await nextTick()
    assert.equal(page.calls.length, 0)
    assert.equal(page.gift.isHover, true)
    const send = page.all().find((element) => element.props.class === 'gift_send_btn')
    assert.equal(page.click(send).stopped, tablet)
    assert.equal(page.calls.length, 1)
    assert.equal(page.calls[0].gift_id, 1)
    page.unmount()
  })
}
