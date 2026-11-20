/* eslint-env node */
/**
 * 兼容检测入口，pnpm build 会先执行它，检测不过就不构建（CI 的 Docker 构建执行的也是 pnpm run build）
 *   node scripts/compat-check.mjs lint   源码检测：浏览器 API、正则新特性（规则见 .eslintrc.compat.cjs），在打包前执行
 *   node scripts/compat-check.mjs dist   产物检测：dist 里的 JS（含第三方库）和兜底脚本的语法（规则见 scripts/dist-check.mjs），在打包后执行
 *
 * 紧急开关：环境变量 X9_SKIP_COMPAT_CHECK=1 时跳过检测。
 * 只用于检测脚本本身出故障、又必须发版的情况，由负责人在 CI 变量里设置；日常开发和 AI 不得使用，用过之后要补一次检测。
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const step = process.argv[2]

if (process.env.X9_SKIP_COMPAT_CHECK === '1') {
  const line = '!'.repeat(72)
  console.warn(`\n${line}\n!! 已跳过兼容检测（X9_SKIP_COMPAT_CHECK=1）：${step}\n!! 只能用于检测脚本故障时的紧急发版，事后必须补一次检测\n${line}\n`)
  process.exit(0)
}

if (step === 'lint') {
  const started = Date.now()
  const eslintBin = path.join(root, 'node_modules', '.bin', 'eslint')
  const args = ['--no-eslintrc', '-c', '.eslintrc.compat.cjs', '--ext', '.vue,.js,.ts', '--max-warnings', '0', 'src']
  const result = spawnSync(eslintBin, args, { cwd: root, stdio: 'inherit' })
  const seconds = ((Date.now() - started) / 1000).toFixed(1)
  if (result.status !== 0) {
    console.error(`\n✖ 兼容检测未通过（源码，${seconds}s）：上面的写法在支持的最低版本浏览器上会出错，请按提示修改；规则说明见 .eslintrc.compat.cjs`)
    process.exit(result.status || 1)
  }
  console.log(`✔ 兼容检测通过（源码：浏览器 API、正则新特性，${seconds}s）`)
} else if (step === 'dist') {
  const started = Date.now()
  const { checkDist } = await import('./dist-check.mjs')
  const { files, problems } = checkDist(path.join(root, 'dist'))
  const seconds = ((Date.now() - started) / 1000).toFixed(1)
  if (problems.length) {
    for (const p of problems) console.error(`  dist/${p.file}:${p.line}:${p.column}  ${p.reason}`)
    console.error(
      `\n✖ 兼容检测未通过（产物，${problems.length} 处，${seconds}s）：构建产物里有支持的最低版本浏览器无法运行的语法，` +
        '常见原因是新引入的第三方库或源码里的新写法；规则说明见 scripts/dist-check.mjs'
    )
    process.exit(1)
  }
  console.log(`✔ 兼容检测通过（产物：${files} 个 JS/HTML 文件的语法、正则、兜底脚本 ES5，${seconds}s）`)
} else {
  console.error('用法：node scripts/compat-check.mjs lint | dist')
  process.exit(2)
}
