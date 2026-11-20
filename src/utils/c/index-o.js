import store from '@/store'
import { w } from './w'
import { j } from './j'
import { a, d } from './u'

export async function c(reqCfg, env)
{
  const version     = env.VITE_VERSION_CODE
  // 渠道号
  const channelCode = store.state.channelCode

  // 使用统一的 getter 获取身份信息，确保 token 和 user_id 来自同一来源 数据
  const identity = store.getters.userIdentity
  
  const visitor  = identity.userId
  const token    = identity.token

  // 时刻
  const sysDiffTime = store.state.sysDiffTime
  const time        = Math.floor(a(d(Date.now(), 1000), sysDiffTime))

  // 设备
  const deviceInfo                                 = store.state.deviceInfo
  const { brand, model, versionOS, fingerprintId } = deviceInfo

  const key           = /(get|delete)/.test(reqCfg.method) ? 'params' : 'data'
  let params          = reqCfg[key] || {}
  params.channel_code = channelCode
  const url           = reqCfg.url

  const lc = window['location']
  const h  = lc['host']
  const r  = lc['href']

  let p = {}
  let falselyValue = [null, undefined, NaN, 'null', 'undefined', 'NaN']

  Object.keys(params).forEach((key) => {
    let val = params[key]

    if (falselyValue.includes(val)) {
      val = ''
    }

    if (typeof val === 'object') {
      return
    }

    p[key] = val
  })

  let sign
  try {
    sign = await w(h, r, url, p, `${time}`, `${visitor}`, fingerprintId, version)
  } catch (e) {  // 回退到 旧版
    //console.log(e)
    sign = j(h, r, url, p, time, visitor, fingerprintId, version)
  }

  token && (reqCfg.headers['token'] = token)

  const x9                          = 'xiao9-'
  reqCfg.headers[x9 + 'visitor']    = visitor
  reqCfg.headers[x9 + 'version']    = version
  reqCfg.headers[x9 + 'channel']    = channelCode ? encodeURIComponent(channelCode) : ''
  reqCfg.headers[x9 + 'oaid']       = fingerprintId
  reqCfg.headers[x9 + 'brand']      = brand
  reqCfg.headers[x9 + 'model']      = model
  reqCfg.headers[x9 + 'version-os'] = versionOS
  reqCfg.headers[x9 + 'sign']       = sign
  reqCfg.headers[x9 + 'time']       = time

  if (reqCfg.method === 'upload') {
    const formData = new FormData()
    Object.keys(params).forEach((k) => formData.append(k, params[k] == null ? '' : params[k]))
    params        = formData
    reqCfg.method = 'post'
  } else {
    Object.keys(params).forEach((k) => (params[k] = params[k] == null ? '' : params[k]))
  }
  reqCfg[key] = params

  return reqCfg
}

