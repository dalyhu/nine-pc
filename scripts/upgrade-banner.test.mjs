/* eslint-env node */
// 升级提示条阈值计算（构建时）的测试
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { computeThresholds, parseBannerEnv } from './upgrade-banner.mjs'

// 模拟 browserslist：按「last N xxx versions」返回从新到旧的版本
const RELEASES = { chrome: [157, 156, 155, 154, 153, 152, 151], edge: [156, 155, 154, 153, 152, 151], firefox: [159, 158, 157, 156, 155, 154] }
const SAFARI = ['safari TP', 'safari 27.2', 'safari 27.1', 'safari 27', 'safari 26.6', 'safari 26.0', 'safari 18.6', 'safari 18.0']
function fakeQuery(q) {
  let m = q.match(/^last (\d+) (chrome|edge|firefox) versions$/)
  if (m) return RELEASES[m[2]].slice(0, Number(m[1])).map((v) => `${m[2]} ${v}`)
  m = q.match(/^last (\d+) safari major versions$/)
  if (m) {
    const majors = [...new Set(SAFARI.filter((v) => /\d/.test(v)).map((v) => parseInt(v.split(' ')[1], 10)))].slice(0, Number(m[1]))
    return SAFARI.filter((v) => majors.includes(parseInt(v.split(' ')[1], 10)) || v === 'safari TP')
  }
  throw new Error('未知查询 ' + q)
}

test('Chrome/Edge/Firefox 取最新往前数 N 个版本里最旧的；Safari 取最近几个大版本里最旧的大版本', () => {
  assert.deepEqual(computeThresholds(fakeQuery, { behind: 4, safariMajors: 2 }), { chrome: 153, edge: 152, firefox: 155, safari: 26 })
  assert.deepEqual(computeThresholds(fakeQuery, { behind: 2, safariMajors: 3 }), { chrome: 155, edge: 154, firefox: 157, safari: 18 })
})

test('数据里的版本不够数时报错，不悄悄算出偏低的阈值', () => {
  assert.throws(() => computeThresholds(fakeQuery, { behind: 10, safariMajors: 2 }), /版本数据不足/)
})

test('环境变量：off 关闭；on 时次数必须是正整数；也可以直接写各浏览器阈值', () => {
  assert.equal(parseBannerEnv({ VITE_UPGRADE_BANNER: 'off' }), null)
  assert.deepEqual(parseBannerEnv({ VITE_UPGRADE_BANNER: 'on', VITE_UPGRADE_BANNER_BEHIND: '4', VITE_UPGRADE_BANNER_SAFARI_MAJORS: '2' }), { behind: 4, safariMajors: 2 })
  assert.deepEqual(
    parseBannerEnv({ VITE_UPGRADE_BANNER: 'on', VITE_UPGRADE_BANNER_MIN: 'chrome:136, edge:136,firefox:140,safari:18' }),
    { manual: { chrome: 136, edge: 136, firefox: 140, safari: 18 } }
  )
  assert.throws(() => parseBannerEnv({}), /VITE_UPGRADE_BANNER/)
  assert.throws(() => parseBannerEnv({ VITE_UPGRADE_BANNER: 'yes' }), /VITE_UPGRADE_BANNER/)
  assert.throws(() => parseBannerEnv({ VITE_UPGRADE_BANNER: 'on', VITE_UPGRADE_BANNER_BEHIND: '0', VITE_UPGRADE_BANNER_SAFARI_MAJORS: '2' }), /正整数/)
  assert.throws(() => parseBannerEnv({ VITE_UPGRADE_BANNER: 'on', VITE_UPGRADE_BANNER_BEHIND: '4' }), /正整数/)
  assert.throws(() => parseBannerEnv({ VITE_UPGRADE_BANNER: 'on', VITE_UPGRADE_BANNER_MIN: 'chrome:abc' }), /VITE_UPGRADE_BANNER_MIN/)
  assert.throws(() => parseBannerEnv({ VITE_UPGRADE_BANNER: 'on', VITE_UPGRADE_BANNER_MIN: 'chrome:136' }), /VITE_UPGRADE_BANNER_MIN/, '四个浏览器都要写')
})
