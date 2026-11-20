/* eslint-env node */
/**
 * 兼容检测专用的 ESLint 配置（pnpm lint:compat，构建前自动执行，见 scripts/compat-check.mjs）
 * 只查「构建补不了、目标浏览器又不支持」的写法，和日常 lint（.eslintrc.cjs）分开，不受日常 lint 存量问题影响：
 * - 浏览器 API（BroadcastChannel、Web Locks 等）：先用 'X' in window 判断再用，判断过的不报
 * - JS 内置方法（Object.hasOwn、Array.prototype.at 等）由构建自动补齐，不报；core-js 补不了的 WeakRef 等单独禁止
 * - 正则新特性：esbuild 会把它们改成 new RegExp 字符串、运行到才报错，所以在源码里拦
 * 目标浏览器来自根目录的 browser-support.json
 */
const fs = require('fs')
const path = require('path')

const versions = JSON.parse(fs.readFileSync(path.join(__dirname, 'browser-support.json'), 'utf8'))
// eslint-plugin-compat 通过 browserslist 读取目标；环境变量优先于其他配置
process.env.BROWSERSLIST = [
  `safari >= ${versions.safari}`,
  `ios_saf >= ${versions.ios}`,
  `chrome >= ${versions.chrome}`,
  `edge >= ${versions.edge}`,
  `firefox >= ${versions.firefox}`
].join(', ')

// 解析器是 eslint-plugin-vue、@vue/eslint-config-typescript 的依赖，按它们的位置解析（pnpm 不会提升到根目录）
const vueParser = require.resolve('vue-eslint-parser', { paths: [require.resolve('eslint-plugin-vue')] })
const tsParser = require.resolve('@typescript-eslint/parser', {
  paths: [require.resolve('@vue/eslint-config-typescript')]
})

const REGEX_MESSAGE = '目标浏览器（Firefox 74～77 / Safari 13.1）不支持，构建也转换不了，请换一种写法'

module.exports = {
  root: true,
  parser: vueParser,
  parserOptions: { parser: tsParser, ecmaVersion: 'latest', sourceType: 'module' },
  env: { browser: true, es2022: true },
  // vue 插件只用来让源码里的 eslint-disable vue/xxx 注释能找到规则定义，不启用任何 vue 规则
  plugins: ['compat', 'vue'],
  settings: {
    // 构建（plugin-legacy + core-js）会按需补齐 JS 内置方法，这里只查浏览器 API
    polyfills: ['es:all'],
    lintAllEsApis: false
  },
  rules: {
    'compat/compat': 'error',
    'no-restricted-globals': [
      'error',
      { name: 'WeakRef', message: 'Safari 14.1 才支持，core-js 也补不了' },
      { name: 'FinalizationRegistry', message: 'Safari 14.1 才支持，core-js 也补不了' }
    ],
    'no-restricted-syntax': [
      'error',
      { selector: 'Literal[regex.pattern=/\\(\\?<[=!]/]', message: `正则后行断言：${REGEX_MESSAGE}` },
      { selector: 'Literal[regex.pattern=/\\(\\?<[A-Za-z_$]/]', message: `正则命名捕获组：${REGEX_MESSAGE}` },
      { selector: 'Literal[regex.pattern=/\\\\[pP]\\{/]', message: `正则 Unicode 属性转义：${REGEX_MESSAGE}` },
      { selector: 'Literal[regex.flags=/s/]', message: `正则 s 标志：${REGEX_MESSAGE}` }
    ]
  }
}
