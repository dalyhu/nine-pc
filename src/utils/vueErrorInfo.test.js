import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseVueErrorCode, isFatalVueError, isBlankInstance, hasBlankRouteLevel } from './vueErrorInfo.js'

const prod = (code) => `https://vuejs.org/errors/#runtime-${code}`

test('parseVueErrorCode：兼容生产环境 URL、开发环境文字、直接传码三种形式', () => {
  assert.equal(parseVueErrorCode(prod(1)), '1')
  assert.equal(parseVueErrorCode(prod('bm')), 'bm')
  assert.equal(parseVueErrorCode('render function'), '1')
  assert.equal(parseVueErrorCode('setup function'), '0')
  assert.equal(parseVueErrorCode('mounted hook'), 'm')
  assert.equal(parseVueErrorCode(13), '13')
  assert.equal(parseVueErrorCode('6'), '6')
  assert.equal(parseVueErrorCode(undefined), '')
  assert.equal(parseVueErrorCode('看不懂的内容'), '')
})

test('isFatalVueError：setup、渲染、transition 钩子、异步组件加载算可能致命', () => {
  for (const code of [0, 1, 9, 13]) assert.equal(isFatalVueError(prod(code)), true, `码 ${code}`)
  assert.equal(isFatalVueError('render function'), true)
  assert.equal(isFatalVueError('async component loader'), true)
})

test('isFatalVueError：事件、watch、生命周期钩子等页面还在的错误不算', () => {
  for (const code of [2, 3, 4, 5, 6, 7, 8, 12, 14, 'bc', 'c', 'bm', 'm', 'bu', 'u', 'bum', 'um', 'a', 'da']) {
    assert.equal(isFatalVueError(prod(code)), false, `码 ${code}`)
  }
  assert.equal(isFatalVueError('native event handler'), false)
  assert.equal(isFatalVueError('mounted hook'), false)
})

test('isFatalVueError：不认识的内容一律不算（宁可少拦）', () => {
  assert.equal(isFatalVueError(undefined), false)
  assert.equal(isFatalVueError(''), false)
  assert.equal(isFatalVueError('https://vuejs.org/errors/#runtime-999'), false)
})

// 模拟组件实例：$el 是元素（nodeType 1）、注释（8，渲染失败时 Vue 放的占位）、文本（3，多根组件的锚点）
const inst = (nodeType) => ({ $el: nodeType ? { nodeType } : null })

test('isBlankInstance：实例不存在、没有根节点、根节点是注释，算空', () => {
  assert.equal(isBlankInstance(undefined), true)
  assert.equal(isBlankInstance(inst(null)), true)
  assert.equal(isBlankInstance(inst(8)), true)
  assert.equal(isBlankInstance(inst(1)), false)
  assert.equal(isBlankInstance(inst(3)), false, '多根组件的锚点不算空')
})

test('hasBlankRouteLevel：从指定层开始，有路由组件渲染成空就算', () => {
  const ok = { components: { default: {} }, instances: { default: inst(1) } }
  const blank = { components: { default: {} }, instances: { default: inst(8) } }
  const missing = { components: { default: {} }, instances: {} }
  const noComponent = { components: null, instances: {} }
  assert.equal(hasBlankRouteLevel([ok, ok], 1), false)
  assert.equal(hasBlankRouteLevel([ok, blank], 1), true)
  assert.equal(hasBlankRouteLevel([blank, ok], 1), false, 'Layout 层不在页面边界的检查范围')
  assert.equal(hasBlankRouteLevel([blank, ok], 0), true, '全局检查从第 0 层开始')
  assert.equal(hasBlankRouteLevel([ok, missing], 1), true, '页面实例不存在也算空')
  assert.equal(hasBlankRouteLevel([ok, noComponent, ok], 1), false, '没有组件的路由层跳过')
  assert.equal(hasBlankRouteLevel([], 0), false)
  assert.equal(hasBlankRouteLevel(undefined, 0), false)
})
