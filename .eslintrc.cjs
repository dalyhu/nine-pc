/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  // 兼容检测的固定样例故意写了不兼容的语法，不参与日常 lint（也避免 --fix 改动它们）
  ignorePatterns: ['scripts/compat-fixtures/'],
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  // 只注册、不启用：兼容检测（.eslintrc.compat.cjs）的忽略注释 eslint-disable-next-line compat/compat 需要能找到规则定义
  plugins: ['compat'],
  rules: {
    'vue/no-reserved-component-names': 'off',
    'vue/multi-word-component-names': 'off' // 要求组件名称始终为 “-” 链接的单词
  }
}
