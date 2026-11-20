/* eslint-env node */
// 产物检查的固定样例测试：bad/ 下每个文件都必须查出问题，good/ 下的必须通过
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkFile } from './dist-check.mjs'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'compat-fixtures', 'build-output')

test('bad/ 下每个样例都查出问题', () => {
  const files = fs.readdirSync(path.join(dir, 'bad'))
  assert.ok(files.length >= 10)
  for (const f of files) {
    const problems = checkFile(path.join(dir, 'bad', f))
    assert.ok(problems.length > 0, `${f} 应该查出问题`)
  }
})

test('good/ 下的样例全部通过（字符串里的 (?<=、先行断言、ES2020 语法、数字分隔符、普通内联脚本）', () => {
  for (const f of fs.readdirSync(path.join(dir, 'good'))) {
    const problems = checkFile(path.join(dir, 'good', f))
    assert.deepEqual(problems, [], `${f} 不应有问题：${JSON.stringify(problems)}`)
  }
})

test('查出的问题带文件、行号和原因', () => {
  const [p] = checkFile(path.join(dir, 'bad', 'index-fallback-not-es5.html'))
  assert.equal(p.line, 3)
  assert.match(p.reason, /ES5/)
  const [q] = checkFile(path.join(dir, 'bad', 'regex-lookbehind.js'))
  assert.equal(q.line, 1)
  assert.match(q.reason, /后行断言/)
})
