/* eslint-env node */
/**
 * 产物兼容检查：构建后检查 dist 里的 JS（含第三方库）和 index.html 内联脚本，有超出支持范围的语法就让构建失败
 * 由 scripts/compat-check.mjs dist 调用；源码一侧的检查见 .eslintrc.compat.cjs，这里是兜底
 *
 * - JS 按 ES2021 解析：类静态块、私有字段、顶层 await、正则 v 标志等更新的语法会解析失败
 *   ES2021 里的数字分隔符（10_000）Safari 13 / Chrome 75 / Firefox 70 起就支持，放行；
 *   逻辑赋值（&&= ||= ??=）要 Safari 14 / Chrome 85 / Firefox 79，单独拦下
 * - 正则字面量再查四类：后行断言、命名捕获组、Unicode 属性转义、s 标志（Safari 13.1 / Firefox 74～77 不支持，构建转换不了）
 * - BigInt 字面量：Safari 14 才支持
 * - index.html 里带 data-x9-compat 的兜底脚本必须是 ES5（它要在很老的浏览器上也能跑起来，提示用户升级）
 * 已知盲区：new RegExp('…') 用字符串构造的正则查不到
 * 调整 browser-support.json 时要重新核对这里的规则
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const acorn = require('acorn')

const REGEX_RULES = [
  { test: (p) => /\(\?<[=!]/.test(p), reason: '正则后行断言（Safari 16.4 / Firefox 78 才支持）' },
  { test: (p) => /\(\?<[A-Za-z_$]/.test(p), reason: '正则命名捕获组（Firefox 78 才支持）' },
  { test: (p, f) => f.includes('u') && /\\[pP]\{/.test(p), reason: '正则 Unicode 属性转义（Firefox 78 才支持）' },
  { test: (p, f) => f.includes('s'), reason: '正则 s 标志（Firefox 78 才支持）' }
]

const LOGICAL_ASSIGNMENT = ['&&=', '||=', '??=']

function walk(node, visit) {
  if (!node || typeof node.type !== 'string') return
  visit(node)
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'start' || key === 'end') continue
    const value = node[key]
    if (Array.isArray(value)) for (const child of value) walk(child, visit)
    else if (value && typeof value.type === 'string') walk(value, visit)
  }
}

/**
 * 检查一段脚本
 * @param {string} code 源码
 * @param {object} opts
 * @param {number} opts.ecmaVersion 解析上限
 * @param {boolean} [opts.module] 是否按 ES Module 解析；不指定时先按模块、失败再按普通脚本
 * @param {number} [opts.lineOffset] 行号偏移（内联脚本在 html 里的位置）
 * @returns {{ line: number, column: number, reason: string }[]}
 */
export function checkCode(code, { ecmaVersion, module, lineOffset = 0 }) {
  const parse = (sourceType) => acorn.parse(code, { ecmaVersion, sourceType, locations: true })
  let ast
  try {
    ast = parse(module === false ? 'script' : 'module')
  } catch (e) {
    if (module === undefined) {
      try {
        ast = parse('script')
      } catch (e2) {
        // 用模块方式的报错，位置更准
      }
    }
    if (!ast) {
      const loc = e.loc || { line: 0, column: 0 }
      return [{ line: loc.line + lineOffset, column: loc.column, reason: `语法超出 ES${ecmaVersion === 5 ? 5 : ecmaVersion}：${e.message}` }]
    }
  }
  const problems = []
  walk(ast, (node) => {
    if (node.type === 'AssignmentExpression' && LOGICAL_ASSIGNMENT.includes(node.operator)) {
      problems.push({
        line: node.loc.start.line + lineOffset,
        column: node.loc.start.column,
        reason: `逻辑赋值 ${node.operator}（Safari 14 / Chrome 85 / Firefox 79 才支持）`
      })
      return
    }
    if (node.type !== 'Literal') return
    const at = { line: node.loc.start.line + lineOffset, column: node.loc.start.column }
    if (node.regex) {
      for (const rule of REGEX_RULES) {
        if (rule.test(node.regex.pattern, node.regex.flags)) problems.push({ ...at, reason: `${rule.reason}：/${node.regex.pattern}/${node.regex.flags}` })
      }
    } else if (node.bigint !== undefined) {
      problems.push({ ...at, reason: 'BigInt 字面量（Safari 14 才支持）' })
    }
  })
  return problems
}

/** 取出 html 里的内联脚本（带 src 的跳过） */
function inlineScripts(html) {
  const scripts = []
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
  let m
  while ((m = re.exec(html))) {
    const attrs = m[1]
    if (/\bsrc\s*=/.test(attrs) || !m[2].trim()) continue
    const lineOffset = html.slice(0, m.index + m[0].indexOf('>') + 1).split('\n').length - 1
    scripts.push({ code: m[2], attrs, lineOffset })
  }
  return scripts
}

/** 检查单个文件（.js 或 .html），返回问题列表 */
export function checkFile(file) {
  const text = fs.readFileSync(file, 'utf8')
  if (file.endsWith('.html')) {
    const problems = []
    for (const s of inlineScripts(text)) {
      const fallback = /\bdata-x9-compat\b/.test(s.attrs)
      const isModule = /type\s*=\s*["']?module/.test(s.attrs)
      const found = checkCode(s.code, { ecmaVersion: fallback ? 5 : 2021, module: isModule, lineOffset: s.lineOffset })
      for (const p of found) problems.push(fallback ? { ...p, reason: `兜底脚本必须是 ES5：${p.reason}` } : p)
    }
    return problems
  }
  return checkCode(text, { ecmaVersion: 2021 })
}

/** 检查整个产物目录 */
export function checkDist(dir) {
  const files = []
  ;(function collect(d) {
    for (const name of fs.readdirSync(d)) {
      const p = path.join(d, name)
      if (fs.statSync(p).isDirectory()) collect(p)
      else if (/\.(m?js|html)$/.test(name)) files.push(p)
    }
  })(dir)
  const problems = []
  for (const file of files) {
    for (const p of checkFile(file)) problems.push({ file: path.relative(dir, file), ...p })
  }
  return { files: files.length, problems }
}
