/* eslint-env node */
/**
 * 软性升级提示条的阈值，在构建时计算（vite.config.ts 调用），结果注入为 __X9_UPGRADE_BANNER__
 *
 * env/.env.* 里的配置：
 *   VITE_UPGRADE_BANNER=on|off               开关，必须写；off 时注入 null，提示条不打进产物
 *   VITE_UPGRADE_BANNER_BEHIND=4             Chrome/Edge/Firefox：比最新版落后几个版本开始提示
 *   VITE_UPGRADE_BANNER_SAFARI_MAJORS=2      Safari：保留最近几个大版本（Safari 一年一个大版本，且跟着系统升级）
 *   VITE_UPGRADE_BANNER_MIN=chrome:153,edge:152,firefox:155,safari:26   可选：直接写阈值，写了就不按数据计算
 *
 * 「最新版」来自 caniuse-lite 数据（每季度更新，见 CLAUDE.md）。数据旧了只会让阈值偏低、提示的人变少，不会误伤
 */

const BROWSERS = ['chrome', 'edge', 'firefox']

function positiveInt(value, name) {
  const n = Number(value)
  if (!Number.isInteger(n) || n <= 0) throw new Error(`${name} 必须是正整数，现在是「${value}」`)
  return n
}

/** 读环境变量：关闭返回 null；打开返回计算参数，或直接写的阈值 { manual } */
export function parseBannerEnv(env) {
  const flag = env.VITE_UPGRADE_BANNER
  if (flag === 'off') return null
  if (flag !== 'on') throw new Error(`VITE_UPGRADE_BANNER 必须是 on 或 off，现在是「${flag}」`)

  if (env.VITE_UPGRADE_BANNER_MIN) {
    const manual = {}
    for (const part of env.VITE_UPGRADE_BANNER_MIN.split(',')) {
      const [name, version] = part.split(':').map((s) => s && s.trim())
      const n = Number(version)
      if (![...BROWSERS, 'safari'].includes(name) || !Number.isInteger(n) || n <= 0) {
        throw new Error(`VITE_UPGRADE_BANNER_MIN 格式不对：「${part}」，应为 chrome:153,edge:152,firefox:155,safari:26`)
      }
      manual[name] = n
    }
    if (Object.keys(manual).length !== 4) throw new Error('VITE_UPGRADE_BANNER_MIN 要把 chrome、edge、firefox、safari 四个都写上')
    return { manual }
  }
  return {
    behind: positiveInt(env.VITE_UPGRADE_BANNER_BEHIND, 'VITE_UPGRADE_BANNER_BEHIND'),
    safariMajors: positiveInt(env.VITE_UPGRADE_BANNER_SAFARI_MAJORS, 'VITE_UPGRADE_BANNER_SAFARI_MAJORS')
  }
}

/**
 * 按 browserslist 的结果算阈值（低于阈值就提示），不自己做减法：版本号不一定连续（Safari 从 18 跳到 26）
 * @param {(query: string) => string[]} query browserslist 函数
 */
export function computeThresholds(query, { behind, safariMajors }) {
  const majorOf = (entry) => parseInt(String(entry).split(' ')[1], 10)
  const result = {}
  for (const name of BROWSERS) {
    const majors = query(`last ${behind + 1} ${name} versions`).map(majorOf).filter(Number.isFinite)
    if (majors.length < behind + 1) throw new Error(`升级提示条：${name} 版本数据不足，需要 ${behind + 1} 个，只有 ${majors.length} 个`)
    result[name] = Math.min(...majors)
  }
  const safari = [...new Set(query(`last ${safariMajors} safari major versions`).map(majorOf).filter(Number.isFinite))]
  if (safari.length < safariMajors) throw new Error(`升级提示条：safari 版本数据不足，需要 ${safariMajors} 个大版本，只有 ${safari.length} 个`)
  result.safari = Math.min(...safari)
  return result
}

/** vite.config.ts 用：返回要注入的阈值（关闭时为 null），并在构建日志里打印 */
export function resolveUpgradeBanner(env, query) {
  const options = parseBannerEnv(env)
  if (!options) {
    console.log('[升级提示条] 关闭（VITE_UPGRADE_BANNER=off）')
    return null
  }
  const thresholds = options.manual || computeThresholds(query, options)
  const text = Object.entries(thresholds).map(([k, v]) => `${k}<${v}`).join(' ')
  console.log(`[升级提示条] 开启，${options.manual ? '使用直接写的阈值' : `按数据计算（落后 ${options.behind} 个版本，Safari 保留 ${options.safariMajors} 个大版本）`}：${text}`)
  return thresholds
}
