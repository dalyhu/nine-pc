import test from 'node:test'
import assert from 'node:assert/strict'
import { versionTabletProfileHtml } from '../build/tablet-profile-version.mjs'

const html = '<script src="/static/assets/ua-parser.min.js"></script>\n<script src="/static/assets/tablet-profile.js"></script>\n<script>init()</script>'

test('平板识别脚本地址随脚本内容变化且保留入口顺序', () => {
  const first = versionTabletProfileHtml(html, Buffer.from('first version'))
  const repeat = versionTabletProfileHtml(html, Buffer.from('first version'))
  const next = versionTabletProfileHtml(html, Buffer.from('second version'))
  assert.equal(first, repeat)
  assert.notEqual(first, next)
  assert.match(first, /ua-parser\.min\.js"><\/script>\s*<script src="\/static\/assets\/tablet-profile\.js\?v=[0-9a-f]{64}"><\/script>\s*<script>/)
})

test('带版本参数的脚本 URL 不命中旧的 JS CacheFirst 路由', () => {
  const source = versionTabletProfileHtml(html, Buffer.from('first version'))
  const path = source.match(/src="(\/static\/assets\/tablet-profile\.js\?v=[^"]+)"/)[1]
  const url = new URL(path, 'https://example.test')
  assert.equal(/\.(?:js)$/.test(url.href), false)
  assert.equal(url.searchParams.has('v'), true)
})

test('入口脚本缺失或重复时不生成无法更新的构建', () => {
  assert.throws(() => versionTabletProfileHtml('<html></html>', Buffer.from('test')))
  assert.throws(() => versionTabletProfileHtml(html + html, Buffer.from('test')))
})
