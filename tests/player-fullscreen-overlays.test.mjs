import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { compile, createRenderer, nextTick, reactive } from 'vue'
import { parse } from 'vue/compiler-sfc'

function mountOverlays(isIndex) {
  const source = readFileSync(new URL('../src/views/anchor/live-player-iframe.vue', import.meta.url), 'utf8')
  const ast = parse(source).descriptor.template.ast
  function find(node, className) {
    if (node.props?.some((prop) => prop.type === 6 && prop.name === 'class' && prop.value?.content === className)) return node
    for (const child of node.children || []) {
      const found = find(child, className)
      if (found) return found
    }
  }
  const enter = find(ast, 'anchor-home-page-top-play-area-enter-button')
  const mute = find(ast, 'mute_btn')
  assert.ok(enter && mute, '播放器模板应包含进入直播间和取消静音控件')
  const state = reactive({ is_index: isIndex, isWebFullscreen: false, info: { uid: 1 }, isError: false, showUnmute: true, initPlayer: true, setUrl() {}, onHandleUnmute() {} })
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
  const enterMarkup = enter.loc.source.trimEnd() + (enter.loc.source.trimEnd().endsWith('</a') ? '>' : '')
  const app = renderer.createApp({ setup: () => state, render: compile(`<div>${enterMarkup}${mute.loc.source}</div>`) })
  app.mount(root)
  const all = (item = root) => [item, ...item.children.flatMap((child) => all(child))]
  const visible = (className) => all().some((item) => item.props.class === className)
  return { state, visible, unmount: () => app.unmount() }
}

test('首页网页全屏时隐藏两个首页覆盖按钮，退出后恢复', async () => {
  const page = mountOverlays(true)
  const enter = 'anchor-home-page-top-play-area-enter-button', mute = 'mute_btn'
  assert.equal(page.visible(enter), true)
  assert.equal(page.visible(mute), true)
  page.state.isWebFullscreen = true
  await nextTick()
  assert.equal(page.visible(enter), false)
  assert.equal(page.visible(mute), false)
  page.state.isWebFullscreen = false
  await nextTick()
  assert.equal(page.visible(enter), true)
  assert.equal(page.visible(mute), true)
  page.unmount()
})

test('直播间网页全屏不改变取消静音入口', async () => {
  const page = mountOverlays(false)
  assert.equal(page.visible('mute_btn'), true)
  page.state.isWebFullscreen = true
  await nextTick()
  assert.equal(page.visible('mute_btn'), true)
  assert.equal(page.visible('anchor-home-page-top-play-area-enter-button'), false)
  page.unmount()
})
