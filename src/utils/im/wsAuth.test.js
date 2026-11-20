import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildWsUrl, buildAuthFrame } from './wsAuth.js'

test('握手地址不带任何凭证', () => {
  const url = buildWsUrl({ protocol: 'wss', host: 'a.example.com' })
  assert.equal(url, 'wss://a.example.com/wss/')
  assert.ok(!url.includes('?'))
  assert.ok(!/token/i.test(url))
})

test('认证帧只包含 action 和 userToken', () => {
  assert.deepEqual(JSON.parse(buildAuthFrame('t1')), { action: 'auth', userToken: 't1' })
})

test('登录用户与游客的认证帧结构相同，只是值不同', () => {
  const user = JSON.parse(buildAuthFrame('user-token'))
  const visitor = JSON.parse(buildAuthFrame('visitor-token'))
  assert.deepEqual(Object.keys(user), Object.keys(visitor))
  assert.notEqual(user.userToken, visitor.userToken)
})
