import { test } from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'

// 加载 request-o.js 的真实源码，只替换模块边界（import / export），拿到它注册的响应拦截器
const source = readFileSync(new URL('./request-o.js', import.meta.url), 'utf8')
  .replace(/^import .*$/gm, '')
  .replace(/^export const /gm, 'const ')
  .replace(/^export default service$/m, 'globalThis.__service = service')

function load() {
  const calls = { error: [], success: [], alert: [], logout: 0, imConnect: 0 }
  const interceptors = { response: null }
  const service = {
    interceptors: {
      request: { use() {} },
      response: {
        use(onFulfilled, onRejected) {
          interceptors.response = { onFulfilled, onRejected }
        }
      }
    }
  }
  const context = {
    axios: { create: () => service },
    decryptData: (sec) => `解密:${sec}`,
    // 防抖在测试里直接执行，便于断言调用次数
    debounce: (fn) => fn,
    divide: (a, b) => a / b,
    subtract: (a, b) => a - b,
    store: {
      commit() {},
      dispatch(name) {
        if (name === 'logout') calls.logout++
        return Promise.resolve()
      }
    },
    e: {},
    IM: { connect: () => calls.imConnect++ },
    c: (cfg) => cfg,
    ElMessage: {
      error: (msg) => calls.error.push(msg),
      success: (msg) => calls.success.push(msg)
    },
    ElMessageBox: { alert: (msg) => calls.alert.push(msg) },
    setTimeout: () => 0,
    window: { location: { reload() {} } },
    Date,
    Math,
    parseInt,
    parseFloat,
    isNaN,
    Promise
  }
  context.globalThis = context
  vm.runInNewContext(source, context)
  return { calls, ...interceptors.response }
}

const businessError = (code, config = {}) => ({
  data: { code, msg: `业务错误 ${code}` },
  headers: {},
  config: { url: '/api/user_on_line/heartbeat', ...config }
})

const networkError = (config = {}) => ({
  code: 'ERR_BAD_RESPONSE',
  message: 'Request failed',
  config: { url: '/api/user_on_line/heartbeat', ...config },
  response: { headers: { 'xiao9-time': '1700000000' }, data: { msg: '签名时间偏差' } }
})

test('普通请求：code 1 照旧弹错误提示', async () => {
  const { calls, onFulfilled } = load()
  await assert.rejects(onFulfilled(businessError(1)))
  assert.deepEqual(calls.error, ['业务错误 1'])
})

test('普通请求：code 700 照旧提示并退出登录', async () => {
  const { calls, onFulfilled } = load()
  await assert.rejects(onFulfilled(businessError(700)))
  assert.equal(calls.error.length, 1)
  assert.equal(calls.logout, 1)
})

test('普通请求：网络错误带 xiao9-time 时照旧弹「刷新页面」框', async () => {
  const { calls, onRejected } = load()
  await assert.rejects(onRejected(networkError()))
  assert.equal(calls.alert.length, 1)
})

test('silentError 请求：code 1 不弹提示，错误照样返回给调用方', async () => {
  const { calls, onFulfilled } = load()
  await assert.rejects(onFulfilled(businessError(1, { silentError: true })), { code: 1 })
  assert.deepEqual(calls.error, [])
  assert.deepEqual(calls.success, [])
})

test('silentError 请求：code 700 不提示、不退出登录', async () => {
  const { calls, onFulfilled } = load()
  await assert.rejects(onFulfilled(businessError(700, { silentError: true })), { code: 700 })
  assert.deepEqual(calls.error, [])
  assert.equal(calls.logout, 0)
})

test('silentError 请求：网络错误带 xiao9-time 也不弹框，错误照样返回', async () => {
  const { calls, onRejected } = load()
  await assert.rejects(onRejected(networkError({ silentError: true })))
  assert.deepEqual(calls.alert, [])
})

test('silentError 请求：成功时照常解密返回', async () => {
  const { onFulfilled } = load()
  const res = await onFulfilled({
    data: { code: 0, sec: 'abc' },
    headers: {},
    config: { silentError: true }
  })
  assert.equal(res.data, '解密:abc')
})
