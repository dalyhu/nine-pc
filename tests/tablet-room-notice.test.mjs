import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { compileString } from 'sass'

const tablet = compileString(readFileSync(new URL('../src/styles/tablet.scss', import.meta.url), 'utf8'), { style: 'expanded' }).css

function ruleBody(source, selector) {
  const rules = [...source.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  return rules.filter(([, sel]) => sel.split(';').pop().split(',').map((s) => s.trim()).includes(selector)).map(([, , body]) => body).join('\n')
}

test('TP-107：平板主播公告卡片高度由内容决定，不再按宽度 25% 截断', () => {
  assert.match(ruleBody(tablet, 'html[data-tablet-pc] .room_notice_comp .df_container_placeholder'), /display:\s*none;/)
  assert.match(ruleBody(tablet, 'html[data-tablet-pc] .room_notice_comp .df_container_inner'), /position:\s*static;/)
})

test('TP-107：平板主播公告背景不小于原图宽度并左上对齐，标题标签装得下「主播公告」', () => {
  const body = ruleBody(tablet, 'html[data-tablet-pc] .room_notice_comp .room_notice_comp_inner_box')
  assert.match(body, /background-size:\s*max\(100%, 439px\) auto;/)
  assert.match(body, /background-position:\s*left top;/)
})

test('TP-107：普通电脑的主播公告组件样式不变', () => {
  const source = readFileSync(new URL('../src/components/chatBox/components/roomNotice/index.vue', import.meta.url), 'utf8')
  assert.match(source, /<DfContainer :height-ratio="25">/)
  assert.match(source, /background-size: 100% auto;/)
})
