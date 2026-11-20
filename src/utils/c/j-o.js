// 纯js加密方式 相关

import { h16 } from './u'

// 客户端加密的key
const k = 'kig+gin$^&GEB2324D(^(@'

export function j(h, r, path, params, time, visitor, oaId, version)
{
  const segments = path.split('/').filter(Boolean)

  const uriPathRevKey = segments.map((seg) => seg.slice(-1)).reverse().join('')

  let reqStr = ''
  Object.keys(params).sort().forEach((key) => {
    let val = params[key]
    reqStr += `&${key}=${val}`
  })

  const signStr = `${reqStr}&_=${k}#${h}#${r}#${uriPathRevKey}#${time}#${visitor}#${oaId}#${version}`
  // console.log(signStr)
  return h16(signStr)
}


