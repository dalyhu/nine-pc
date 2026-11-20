import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { compileString } from 'sass'

const css = (file) => compileString(readFileSync(new URL(`../src/styles/${file}`, import.meta.url), 'utf8'), { style: 'expanded' }).css

// 取出与选择器完全匹配的规则体
function ruleBody(source, selector) {
  const rules = [...source.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  return rules.filter(([, sel]) => sel.split(';').pop().split(',').map((s) => s.trim()).includes(selector)).map(([, , body]) => body).join('\n')
}

test('TP-106：平板 PC 的 html、body、#app 高度用 100dvh，iPad Safari 外层文档不再多出可滚动的 80px', () => {
  const tablet = css('tablet.scss')
  for (const selector of ['html[data-tablet-pc]', 'html[data-tablet-pc] body', 'html[data-tablet-pc] #app']) {
    const body = ruleBody(tablet, selector)
    assert.match(body, /height:\s*100vh;[\s\S]*height:\s*100dvh;/, `${selector} 应先写 100vh 兜底再写 100dvh`)
  }
})

test('TP-106：普通电脑全局样式仍为 100vh，不受平板修复影响', () => {
  const source = readFileSync(new URL('../src/styles/index.scss', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /dvh/)
  for (const selector of ['html', 'body', '#app']) {
    assert.match(ruleBody(source, selector), /height:\s*100vh;/)
  }
})
