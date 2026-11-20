/* eslint-env node */
// lint:compat 规则的固定样例测试：行尾标「应报错」的行必须有报错，标「不应报错」的行必须没有
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const { ESLint } = require('eslint')

async function lint(file) {
  const eslint = new ESLint({ cwd: root, useEslintrc: false, overrideConfigFile: path.join(root, '.eslintrc.compat.cjs'), ignore: false })
  const [result] = await eslint.lintFiles([path.join(root, 'scripts/compat-fixtures', file)])
  return result
}

function check(result, file) {
  const lines = fs.readFileSync(path.join(root, 'scripts/compat-fixtures', file), 'utf8').split('\n')
  const fatal = result.messages.filter((m) => m.fatal)
  assert.deepEqual(fatal, [], `${file} 解析失败`)
  lines.forEach((text, i) => {
    const hits = result.messages.filter((m) => m.line === i + 1)
    if (/\/\/ 应报错/.test(text)) assert.ok(hits.length > 0, `${file}:${i + 1} 应报错但没有：${text.trim()}`)
    if (/\/\/ 不应报错/.test(text)) assert.equal(hits.length, 0, `${file}:${i + 1} 不应报错：${hits.map((h) => h.message).join('；')}`)
  })
}

test('浏览器 API：补不了的拦下，构建能补的和先判断再用的放行', async () => {
  check(await lint('api.js'), 'api.js')
})

test('正则新特性：后行断言、命名捕获组、Unicode 属性转义、s 标志拦下', async () => {
  check(await lint('regex.js'), 'regex.js')
})

test('.vue 文件里的 TypeScript 也能检查', async () => {
  check(await lint('Sample.vue'), 'Sample.vue')
})

test('检查目标来自 browser-support.json', () => {
  const versions = JSON.parse(fs.readFileSync(path.join(root, 'browser-support.json'), 'utf8'))
  require(path.join(root, '.eslintrc.compat.cjs'))
  assert.equal(
    process.env.BROWSERSLIST,
    `safari >= ${versions.safari}, ios_saf >= ${versions.ios}, chrome >= ${versions.chrome}, edge >= ${versions.edge}, firefox >= ${versions.firefox}`
  )
})
