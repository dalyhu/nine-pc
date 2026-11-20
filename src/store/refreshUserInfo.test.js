import { test } from 'node:test'
import assert from 'node:assert/strict'
import { refreshUserInfo } from './refreshUserInfo.js'

// 模拟一次刷新用户信息：接口返回前先执行 duringRequest（模拟请求在途时发生的事）
const run = async ({
  userId = '100',
  cachedId = '100',
  currentInfo = { id: '100', token: 't1', nickname: '旧昵称' },
  response = { data: { nickname: '新昵称', level: 3 } },
  duringRequest = () => {}
} = {}) => {
  const env = { cachedId, currentInfo, commits: [], requests: [] }

  const committed = await refreshUserInfo({
    userId,
    fetchInfo: async (params) => {
      env.requests.push(params)
      duringRequest(env)
      if (response instanceof Error) throw response
      return response
    },
    readCachedUserId: () => env.cachedId,
    getCurrentInfo: () => env.currentInfo,
    commit: (info) => env.commits.push(info)
  })

  return { committed, ...env }
}

test('T1：请求期间退出（本地存储被清空），返回后不写回', async () => {
  const r = await run({ duringRequest: (env) => (env.cachedId = undefined) })
  assert.equal(r.committed, false)
  assert.deepEqual(r.commits, [])
})

test('T2：请求期间一直是同一用户，照常合并提交', async () => {
  const r = await run()
  assert.equal(r.committed, true)
  assert.deepEqual(r.commits, [{ id: '100', token: 't1', nickname: '新昵称', level: 3 }])
})

test('T3：请求期间本地存储换成另一个用户，不写回', async () => {
  const r = await run({ duringRequest: (env) => (env.cachedId = '200') })
  assert.equal(r.committed, false)
  assert.deepEqual(r.commits, [])
})

test('T4：数字和字符串形式的同一 ID 视为同一用户', async () => {
  const a = await run({ userId: '100', cachedId: 100 })
  assert.equal(a.committed, true)
  const b = await run({ userId: 100, cachedId: '100' })
  assert.equal(b.committed, true)
})

test('T5：游客（没有用户 ID）不发请求', async () => {
  // 不走 run()：它的默认参数会把 undefined 换成 '100'
  for (const userId of [undefined, null, '']) {
    let requested = false
    const committed = await refreshUserInfo({
      userId,
      fetchInfo: async () => {
        requested = true
        return { data: {} }
      },
      readCachedUserId: () => undefined,
      getCurrentInfo: () => ({}),
      commit: () => assert.fail('不应提交')
    })
    assert.equal(committed, false)
    assert.equal(requested, false, `userId=${userId}`)
  }
})

test('T6：接口报错时不提交、不抛出', async (t) => {
  t.mock.method(console, 'error', () => {})
  const r = await run({ response: new Error('Network Error') })
  assert.equal(r.committed, false)
  assert.deepEqual(r.commits, [])
})

test('T7：合并的底是返回时的用户信息，保留请求期间别处的更新', async () => {
  const r = await run({
    duringRequest: (env) => (env.currentInfo = { ...env.currentInfo, balances: 99 })
  })
  assert.deepEqual(r.commits, [{ id: '100', token: 't1', nickname: '新昵称', level: 3, balances: 99 }])
})
