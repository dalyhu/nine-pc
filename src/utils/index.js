import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { decryptByAES } from '@/utils/crypto'
import { toMD5 } from '@/utils/common'
import { init as initConsoleBan } from 'console-ban'
import imageCompression from 'browser-image-compression'

const IMAGE_COMPRESSION_LIB_URL = new URL(
  'browser-image-compression/dist/browser-image-compression.js',
  import.meta.url
).href

/** 图片压缩参数（browser-image-compression） */
const IMAGE_COMPRESS_OPTIONS = {
  maxSizeMB: 2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  initialQuality: 0.6,
  libURL: IMAGE_COMPRESSION_LIB_URL
}

/** 仅 iPhone / iPad / iPod（不含 macOS） */
export function isIOS() {
  try {
    if (window.UA_INFO?.os?.name === 'iOS') return true
  } catch {
    // ignore
  }
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : ''
  if (/iPhone|iPad|iPod/i.test(ua)) return true
  // iPadOS 13+ 桌面模式 Safari 可能伪装为 Mac
  if (
    typeof navigator !== 'undefined' &&
    navigator.platform === 'MacIntel' &&
    navigator.maxTouchPoints > 1
  ) {
    return true
  }
  return false
}

/**
 * getRoomInfo 等接口的 videoType：iOS 与首页轮播用 m3u8，其余（含 macOS、直播间）用 flv
 * @param {boolean} isHomePage 是否首页嵌入（如 query.type === 'main'）
 */
export function resolveLiveVideoType(isHomePage) {
  if (isIOS()) return 'm3u8'
  if (isHomePage) return 'm3u8'
  return 'flv'
}

export function copyToClipboard(text) {
  if (!text) return false

  const el = document.createElement('textarea')
  Object.assign(el.style, {
    fontSize: '12pt',
    border: '0',
    padding: '0',
    margin: '0',
    position: 'absolute',
    top: '-9999px',
    left: '-9999px'
  })
  el.setAttribute('readonly', '')
  el.value = text
  document.body.appendChild(el)
  el.select()
  el.setSelectionRange(0, text.length)

  let res
  try {
    res = document.execCommand('copy')
  } catch {
    res = false
  }

  el.remove()
  return res
}

export function r(n) {
  return Math.floor(Math.random() * n)
}

/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

function checkSignEnv() {
  return new Promise((resolve) => {
    if (!window || !document) resolve(false)

    try {
      const img = document.createElement('img')
      img.src = '/none.jpg'

      img.onerror = () => {
        if (!img.width && !img.height) {
          resolve(false)
        } else {
          resolve(true)
          img.style.display = 'none'
        }
      }

      document.body.append(img)
    } catch {
      resolve(false)
    }
  })
}

/**
 * 对象转 QueryString
 * @param { Object } target 目标对象
 * @param { String } separator 分隔符
 * @returns QueryString
 */
export function ObjectToQueryString(target, separator = '&') {
  if (!target) return ''

  const keys = Object.keys(target)

  if (!keys.length) return ''

  return keys
    .sort()
    .reduce((res, key) => {
      const item = target[key]

      if (item == null || (!(item instanceof File) && typeof item !== 'object')) {
        res += `${separator}${key}=${item == null ? '' : item}`
      }

      return res
    }, '')
    .substring(1)
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    )
  }
}

// @ts-ignore
// prettier-ignore
export function sg(info, ObjectToQueryString, bulk, version) {
  // a=[url,当前时间戳]
  // b=ObjectToQueryString
  // v=version
  // pd=deviceId
  // pf=()=>[uid,params]
  // pg=genSignKey ksg
  // pu=uid
  // pp=params
  // d=r random方法
  // e=toMD5
  // pq=用于签名的query
  // pt=用于签名的time
  // pk=用于签名的key
  // function fn(d, e) {
  //   return function (a, b, c, v) {
  //     const [pd, pf, pg] = c();
  //     const [pu, pp] = pf();
  //     const [pq, pt, pk] = pg()(a, b(pp), [() => [pd, pu], d]);
  //     return [e(pq + pk + '/' + v), pt];
  //   }
  // }
  var _0xody = 'jsjiami.com.v7'; const _0x4050fe = _0x535f; function _0x535f(_0x3c44dd, _0x3bee99) { const _0x4ceca2 = _0x4cec(); return _0x535f = function (_0x535fe5, _0x3fb3bb) { _0x535fe5 = _0x535fe5 - 0x127; let _0xe936df = _0x4ceca2[_0x535fe5]; if (_0x535f['BIRuAz'] === undefined) { var _0x3832f2 = function (_0x1c3742) { const _0x46d651 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/='; let _0x5e2273 = '', _0x53b713 = ''; for (let _0x29e1d0 = 0x0, _0x2aa6b9, _0x25a88e, _0x555a25 = 0x0; _0x25a88e = _0x1c3742['charAt'](_0x555a25++); ~_0x25a88e && (_0x2aa6b9 = _0x29e1d0 % 0x4 ? _0x2aa6b9 * 0x40 + _0x25a88e : _0x25a88e, _0x29e1d0++ % 0x4) ? _0x5e2273 += String['fromCharCode'](0xff & _0x2aa6b9 >> (-0x2 * _0x29e1d0 & 0x6)) : 0x0) { _0x25a88e = _0x46d651['indexOf'](_0x25a88e); } for (let _0x184b91 = 0x0, _0x7a9f76 = _0x5e2273['length']; _0x184b91 < _0x7a9f76; _0x184b91++) { _0x53b713 += '%' + ('00' + _0x5e2273['charCodeAt'](_0x184b91)['toString'](0x10))['slice'](-0x2); } return decodeURIComponent(_0x53b713); }; const _0x4f7d93 = function (_0x445a09, _0x5c8e6e) { let _0x4e1509 = [], _0x4a5288 = 0x0, _0x515fc7, _0xc83afd = ''; _0x445a09 = _0x3832f2(_0x445a09); let _0x40bdb8; for (_0x40bdb8 = 0x0; _0x40bdb8 < 0x100; _0x40bdb8++) { _0x4e1509[_0x40bdb8] = _0x40bdb8; } for (_0x40bdb8 = 0x0; _0x40bdb8 < 0x100; _0x40bdb8++) { _0x4a5288 = (_0x4a5288 + _0x4e1509[_0x40bdb8] + _0x5c8e6e['charCodeAt'](_0x40bdb8 % _0x5c8e6e['length'])) % 0x100, _0x515fc7 = _0x4e1509[_0x40bdb8], _0x4e1509[_0x40bdb8] = _0x4e1509[_0x4a5288], _0x4e1509[_0x4a5288] = _0x515fc7; } _0x40bdb8 = 0x0, _0x4a5288 = 0x0; for (let _0x4a0a2e = 0x0; _0x4a0a2e < _0x445a09['length']; _0x4a0a2e++) { _0x40bdb8 = (_0x40bdb8 + 0x1) % 0x100, _0x4a5288 = (_0x4a5288 + _0x4e1509[_0x40bdb8]) % 0x100, _0x515fc7 = _0x4e1509[_0x40bdb8], _0x4e1509[_0x40bdb8] = _0x4e1509[_0x4a5288], _0x4e1509[_0x4a5288] = _0x515fc7, _0xc83afd += String['fromCharCode'](_0x445a09['charCodeAt'](_0x4a0a2e) ^ _0x4e1509[(_0x4e1509[_0x40bdb8] + _0x4e1509[_0x4a5288]) % 0x100]); } return _0xc83afd; }; _0x535f['gtpsGd'] = _0x4f7d93, _0x3c44dd = arguments, _0x535f['BIRuAz'] = !![]; } const _0x519e45 = _0x4ceca2[0x0], _0x2e422a = _0x535fe5 + _0x519e45, _0x4006f7 = _0x3c44dd[_0x2e422a]; return !_0x4006f7 ? (_0x535f['TnDgPR'] === undefined && (_0x535f['TnDgPR'] = !![]), _0xe936df = _0x535f['gtpsGd'](_0xe936df, _0x3fb3bb), _0x3c44dd[_0x2e422a] = _0xe936df) : _0xe936df = _0x4006f7, _0xe936df; }, _0x535f(_0x3c44dd, _0x3bee99); } (function (_0x531b1f, _0x87f5b8, _0x4fdaa6, _0x1b4e68, _0x2ad9ac, _0x1a1efe, _0x10a52c) { return _0x531b1f = _0x531b1f >> 0x9, _0x1a1efe = 'hs', _0x10a52c = 'hs', function (_0x4a6f58, _0x16a025, _0x2ea6a6, _0x54a055, _0x2d6f62) { const _0x2d3630 = _0x535f; _0x54a055 = 'tfi', _0x1a1efe = _0x54a055 + _0x1a1efe, _0x2d6f62 = 'up', _0x10a52c += _0x2d6f62, _0x1a1efe = _0x2ea6a6(_0x1a1efe), _0x10a52c = _0x2ea6a6(_0x10a52c), _0x2ea6a6 = 0x0; const _0x568479 = _0x4a6f58(); while (!![] && --_0x1b4e68 + _0x16a025) { try { _0x54a055 = parseInt(_0x2d3630(0x130, 'hHTn')) / 0x1 + -parseInt(_0x2d3630(0x134, 'TrUd')) / 0x2 + -parseInt(_0x2d3630(0x139, 'AY&g')) / 0x3 * (parseInt(_0x2d3630(0x12e, 'Wl(Q')) / 0x4) + -parseInt(_0x2d3630(0x12f, '&vQM')) / 0x5 * (-parseInt(_0x2d3630(0x136, 'drMd')) / 0x6) + -parseInt(_0x2d3630(0x127, '5S@B')) / 0x7 + parseInt(_0x2d3630(0x13c, '5S@B')) / 0x8 + parseInt(_0x2d3630(0x128, 'I%dv')) / 0x9 * (-parseInt(_0x2d3630(0x138, 'Wl(Q')) / 0xa); } catch (_0x18c915) { _0x54a055 = _0x2ea6a6; } finally { _0x2d6f62 = _0x568479[_0x1a1efe](); if (_0x531b1f <= _0x1b4e68) _0x2ea6a6 ? _0x2ad9ac ? _0x54a055 = _0x2d6f62 : _0x2ad9ac = _0x2d6f62 : _0x2ea6a6 = _0x2d6f62; else { if (_0x2ea6a6 == _0x2ad9ac['replace'](/[bCUBydpPADrNQxhWYtXwIJ=]/g, '')) { if (_0x54a055 === _0x16a025) { _0x568479['un' + _0x1a1efe](_0x2d6f62); break; } _0x568479[_0x10a52c](_0x2d6f62); } } } } }(_0x4fdaa6, _0x87f5b8, function (_0x425d92, _0x92acad, _0x247f14, _0x19683c, _0x98ced, _0xd2fae3, _0x3d44cf) { return _0x92acad = '\x73\x70\x6c\x69\x74', _0x425d92 = arguments[0x0], _0x425d92 = _0x425d92[_0x92acad](''), _0x247f14 = '\x72\x65\x76\x65\x72\x73\x65', _0x425d92 = _0x425d92[_0x247f14]('\x76'), _0x19683c = '\x6a\x6f\x69\x6e', (0x17a191, _0x425d92[_0x19683c]('')); }); }(0x18c00, 0x5de9b, _0x4cec, 0xc8), _0x4cec) && (_0xody = _0x4050fe(0x131, 'drMd')); function _0x4cec() { const _0x389a0e = (function () { return [_0xody, 'rjBbspjyXiIaDhmYi.xBJcoCmtU.UvPPN7UwWAQd==', 'W4JcJmoOj8oOWPPTzmkFuZaR', 'fSotgZrjymkoWPGi', 'y8oaWPbffq', 'AsbKWR5Z', 'W7pcOgRdMt48W4hcMg7dN8ogWP5n', 'W7/cP2JdMZC9WRlcGg3dSmoDWQC', 'WO47pCoJWPvZWQNdMW'].concat((function () { return ['k1RcVwhcJ1XpWOq/WQD2', 'W69+W63dMSoZ', 'FaP5W6RdQSoOWPztW6BcL2ldSSk2W7q', 'imonpf5cW5KxWQhcImoGtg0', 'WRnDW50yW43dSthcQHu', 'W4tcI8oQj8oSW79qCCkatr0', 'WQ7cLdJcUdxcQmk1W5K', 'fmoNrdLbWQWpWPLxfSkrFa', 'WQZcQYJdUmo8l8k0WPdcSCodW5hdP8kEta'].concat((function () { return ['iCkbW7WACmkAiCohWOC4u8o3', 'W7xcQg7dNZO+WO7cQhpdUSoNWPK', 'imkcW70DC8ksaSoIWPaaAmoh', 'W5m0hLOb', 'W7xdOhdcO8kODSkQW7RcH8onW7dcNG', 'WPBdSmo5ytJdM8kfjcr2B0y']; }())); }())); }()); _0x4cec = function () { return _0x389a0e; }; return _0x4cec(); }; function fn(_0x169074, _0x43f743) { const _0x3d95be = { 'Czzjz': function (_0x3e058d) { return _0x3e058d(); }, 'vwXjS': function (_0x5a7f82, _0x40c213) { return _0x5a7f82(_0x40c213); }, 'RvELn': function (_0x57b1bd, _0xdd7670) { return _0x57b1bd + _0xdd7670; }, 'xuPre': function (_0x479a06, _0x32e9f6) { return _0x479a06 + _0x32e9f6; } }; return function (_0xd9a3c5, _0x4d2ca4, _0x5326cf, _0x3652fa) { const _0x1bb8d9 = _0x535f, [_0x5d1972, _0x256ac7, _0xaf783d] = _0x3d95be['Czzjz'](_0x5326cf), [_0x94d962, _0x58d172] = _0x3d95be[_0x1bb8d9(0x13b, 'MGM%')](_0x256ac7), [_0x332551, _0x53c598, _0x596143] = _0xaf783d()(_0xd9a3c5, _0x3d95be[_0x1bb8d9(0x135, 'W8K&')](_0x4d2ca4, _0x58d172), [() => [_0x5d1972, _0x94d962], _0x169074]); return [_0x3d95be[_0x1bb8d9(0x13a, 'TrUd')](_0x43f743, _0x3d95be[_0x1bb8d9(0x12a, '9JDj')](_0x3d95be['xuPre'](_0x332551, _0x596143) + '/', _0x3652fa)), _0x53c598]; }; }
  return fn(r, toMD5)(info, ObjectToQueryString, bulk, version)
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach((v) => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

async function checkSignDeviceId() {
  try {
    const fp = await FingerprintJS.load()
    const { visitorId } = await fp.get()
    return !!visitorId
  } catch {
    return false
  }
}

// @ts-ignore
// prettier-ignore
export function kpsg(url, getSignTime) {
  // function fn(a, b) {
  //   return [
  //     a
  //       .replace(/\?.*$/, '')
  //       .split('/')
  //       .map(function (i) {
  //         return i.substring(i.length - 1)
  //       })
  //       .reverse()
  //       .join(''),
  //     b()
  //   ]
  // }
  var _0xodD = 'jsjiami.com.v7';
  (function (_0x18048b, _0x28fde9, _0x3d0f38, _0x3cce75, _0x268558, _0xa09b6, _0x455596) { return _0x18048b = _0x18048b >> 0x7, _0xa09b6 = 'hs', _0x455596 = 'hs', function (_0x4f1bf5, _0x3d8139, _0x5487f0, _0x58efe1, _0x54b027) { var _0x17e993 = _0x8109; _0x58efe1 = 'tfi', _0xa09b6 = _0x58efe1 + _0xa09b6, _0x54b027 = 'up', _0x455596 += _0x54b027, _0xa09b6 = _0x5487f0(_0xa09b6), _0x455596 = _0x5487f0(_0x455596), _0x5487f0 = 0x0; var _0x35837f = _0x4f1bf5(); while (!![] && --_0x3cce75 + _0x3d8139) { try { _0x58efe1 = parseInt(_0x17e993(0x156, 'Xh@n')) / 0x1 * (parseInt(_0x17e993(0x14a, ')65v')) / 0x2) + -parseInt(_0x17e993(0x145, 'pDpx')) / 0x3 * (-parseInt(_0x17e993(0x146, 'I5mN')) / 0x4) + -parseInt(_0x17e993(0x154, 'JrH0')) / 0x5 + parseInt(_0x17e993(0x149, 'Lr2S')) / 0x6 * (-parseInt(_0x17e993(0x158, 'pllV')) / 0x7) + -parseInt(_0x17e993(0x14d, 'J5]k')) / 0x8 + parseInt(_0x17e993(0x14b, 'FIey')) / 0x9 * (parseInt(_0x17e993(0x157, 'rtaE')) / 0xa) + parseInt(_0x17e993(0x151, 'bImR')) / 0xb; } catch (_0x227fab) { _0x58efe1 = _0x5487f0; } finally { _0x54b027 = _0x35837f[_0xa09b6](); if (_0x18048b <= _0x3cce75) _0x5487f0 ? _0x268558 ? _0x58efe1 = _0x54b027 : _0x268558 = _0x54b027 : _0x5487f0 = _0x54b027; else { if (_0x5487f0 == _0x268558['replace'](/[tFOyAeIPHExVGgJfChLnB=]/g, '')) { if (_0x58efe1 === _0x3d8139) { _0x35837f['un' + _0xa09b6](_0x54b027); break; } _0x35837f[_0x455596](_0x54b027); } } } } }(_0x3d0f38, _0x28fde9, function (_0x36c57f, _0x2e339c, _0x94023e, _0x3de27e, _0x2ad7f5, _0x4a806, _0x2e8ac0) { return _0x2e339c = '\x73\x70\x6c\x69\x74', _0x36c57f = arguments[0x0], _0x36c57f = _0x36c57f[_0x2e339c](''), _0x94023e = '\x72\x65\x76\x65\x72\x73\x65', _0x36c57f = _0x36c57f[_0x94023e]('\x76'), _0x3de27e = '\x6a\x6f\x69\x6e', (0x179cf6, _0x36c57f[_0x3de27e]('')); }); }(0x6080, 0x5e642, _0x5605, 0xc3), _0x5605) && (_0xodD = 0x1cda); function fn(_0x1dd250, _0x5761f7) { var _0x3c236b = _0x8109; return [_0x1dd250['replace'](/\?.*$/, '')[_0x3c236b(0x153, 'X1B*')]('/')['map'](function (_0x3df5db) { return _0x3df5db['substring'](_0x3df5db['length'] - 0x1); })[_0x3c236b(0x150, 'Gq1N')]()[_0x3c236b(0x159, ')65v')](''), _0x5761f7()]; } function _0x8109(_0xa1a360, _0x54b7f6) { var _0x5605ef = _0x5605(); return _0x8109 = function (_0x8109e0, _0x3cb985) { _0x8109e0 = _0x8109e0 - 0x144; var _0x1cd4f7 = _0x5605ef[_0x8109e0]; if (_0x8109['fqbQSE'] === undefined) { var _0x5d09df = function (_0x2cf375) { var _0x4e8eb3 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/='; var _0x1e14c3 = '', _0x1e41da = ''; for (var _0x5282c0 = 0x0, _0x58cdfb, _0xdeb9c0, _0x31124c = 0x0; _0xdeb9c0 = _0x2cf375['charAt'](_0x31124c++); ~_0xdeb9c0 && (_0x58cdfb = _0x5282c0 % 0x4 ? _0x58cdfb * 0x40 + _0xdeb9c0 : _0xdeb9c0, _0x5282c0++ % 0x4) ? _0x1e14c3 += String['fromCharCode'](0xff & _0x58cdfb >> (-0x2 * _0x5282c0 & 0x6)) : 0x0) { _0xdeb9c0 = _0x4e8eb3['indexOf'](_0xdeb9c0); } for (var _0x163615 = 0x0, _0x556ee6 = _0x1e14c3['length']; _0x163615 < _0x556ee6; _0x163615++) { _0x1e41da += '%' + ('00' + _0x1e14c3['charCodeAt'](_0x163615)['toString'](0x10))['slice'](-0x2); } return decodeURIComponent(_0x1e41da); }; var _0x59c9a4 = function (_0x4bf844, _0x1f26f9) { var _0x39668e = [], _0x38c715 = 0x0, _0x9362bc, _0x2353d3 = ''; _0x4bf844 = _0x5d09df(_0x4bf844); var _0x226924; for (_0x226924 = 0x0; _0x226924 < 0x100; _0x226924++) { _0x39668e[_0x226924] = _0x226924; } for (_0x226924 = 0x0; _0x226924 < 0x100; _0x226924++) { _0x38c715 = (_0x38c715 + _0x39668e[_0x226924] + _0x1f26f9['charCodeAt'](_0x226924 % _0x1f26f9['length'])) % 0x100, _0x9362bc = _0x39668e[_0x226924], _0x39668e[_0x226924] = _0x39668e[_0x38c715], _0x39668e[_0x38c715] = _0x9362bc; } _0x226924 = 0x0, _0x38c715 = 0x0; for (var _0x52e590 = 0x0; _0x52e590 < _0x4bf844['length']; _0x52e590++) { _0x226924 = (_0x226924 + 0x1) % 0x100, _0x38c715 = (_0x38c715 + _0x39668e[_0x226924]) % 0x100, _0x9362bc = _0x39668e[_0x226924], _0x39668e[_0x226924] = _0x39668e[_0x38c715], _0x39668e[_0x38c715] = _0x9362bc, _0x2353d3 += String['fromCharCode'](_0x4bf844['charCodeAt'](_0x52e590) ^ _0x39668e[(_0x39668e[_0x226924] + _0x39668e[_0x38c715]) % 0x100]); } return _0x2353d3; }; _0x8109['xTszcu'] = _0x59c9a4, _0xa1a360 = arguments, _0x8109['fqbQSE'] = !![]; } var _0x229350 = _0x5605ef[0x0], _0x2414d1 = _0x8109e0 + _0x229350, _0x2d584d = _0xa1a360[_0x2414d1]; return !_0x2d584d ? (_0x8109['NSrBDg'] === undefined && (_0x8109['NSrBDg'] = !![]), _0x1cd4f7 = _0x8109['xTszcu'](_0x1cd4f7, _0x3cb985), _0xa1a360[_0x2414d1] = _0x1cd4f7) : _0x1cd4f7 = _0x2d584d, _0x1cd4f7; }, _0x8109(_0xa1a360, _0x54b7f6); } function _0x5605() { var _0x5dc945 = (function () { return [_0xodD, 'tFjAeEsjPiagImnFGi.BOJcoVfmL.Fvx7ftyhHCJ==', 'WRz4W6jZca', 'l1KFbmklchJdRSoRjSk4WORdGG', 'WRC6W7PmWPxcJHXh', 'C8oKb8oik8kNc8kDW6lcQCkZW6a', 'W4rLW47dSqicWQ5nW7Gy', 'WRvBW5rAWQRcRtC', 'xCkqFSoV'].concat((function () { return ['W7q9WRyQsmoSl8o8jx9xWQZcVG', 'vqxcKmosWR/dG8kgDq', 'wgdcVCkJW5Dyx8oppIVdPa', 'W7jyW4DwjSkbFG', 'WRn/WQ0RzbChvSoMWPu', 'jry9WRFdRfpcIa/dHa/cTmoJeG', 'bCk+qCowWQRcNfK', 'vtpcLSoVbemXW5Tzpq', 'W6tcLrldN8kWWPRcVG'].concat((function () { return ['W6xcIdnfDGjsW5/dJmoKd8knxG', 'wIvRWOldLSomW7jMW7FcTmoQ', 'W5iFW4r9WOrgCtPEbCk8W4RdGq', 'ltmmWP8blxS', 'Bf8OW4lcL8kXW5v7WQlcJwrfha', 'WQldQSo0oxSOCLhdTCkon8oCWR4']; }())); }())); }()); _0x5605 = function () { return _0x5dc945; }; return _0x5605(); };
  return fn(url, getSignTime)
}

/**
 * 格式化数字
 * @param src
 */
export function formatNumber(num, k = '') {
  if (k) {
    return num >= 1e3 ? `${(num / 1e3).toFixed(1)}${k}` : num
  } else {
    return num ? (num / 1e3).toFixed(1) : 0
  }
}

// 时间处理
export const formatDate = (dateTimeStamp) => {
  if (!dateTimeStamp) {
    return
  }
  var minute = 1000 * 60
  var hour = minute * 60
  var day = hour * 24
  var month = day * 30
  var now = new Date().getTime()
  var diffValue = now - dateTimeStamp * 1000
  if (diffValue < 0) {
    //若日期不符则弹出窗口告之
    //alert("结束日期不能小于开始日期！");
  }
  var monthC = diffValue / month
  var weekC = diffValue / (7 * day)
  var dayC = diffValue / day
  var hourC = diffValue / hour
  var minC = diffValue / minute
  var result = ''
  if (monthC >= 1) {
    result = parseInt(monthC) + '个月前'
  } else if (weekC >= 1) {
    result = parseInt(weekC) + '周前'
  } else if (dayC >= 1) {
    result = parseInt(dayC) + '天前'
  } else if (hourC >= 1) {
    result = parseInt(hourC) + '小时前'
  } else if (minC >= 1) {
    result = parseInt(minC) + '分钟前'
  } else result = '刚刚发表'
  return result
}

/**
 * 格式化秒
 * @param int  value 总秒数
 * @return string result 格式化后的字符串
 */
export function formatSeconds(value) {
  // 判断如果数字为0时
  if (value == 0) {
    return 0
  }
  var theTime = parseInt(value) // 需要转换的时间秒
  var theTime1 = 0 // 分
  var theTime2 = 0 // 小时
  var theTime3 = 0 // 天
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60)
    theTime = parseInt(theTime % 60)
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60)
      theTime1 = parseInt(theTime1 % 60)
      if (theTime2 > 24) {
        //大于24小时
        theTime3 = parseInt(theTime2 / 24)
        theTime2 = parseInt(theTime2 % 24)
      }
    }
  }
  var result = ''
  if (theTime > 0) {
    result = '' + parseInt(theTime) + ''
  }
  if (theTime1 > 0) {
    result = '' + parseInt(theTime1) + "'" + result
  }
  if (theTime2 > 0) {
    result = '' + parseInt(theTime2) + '小时' + result
  }
  if (theTime3 > 0) {
    result = '' + parseInt(theTime3) + '天' + result
  }
  return result
}

// 处理场均时长-击杀的
export function averageTime(homeTime, awayTime) {
  // console.log(homeTime)
  // console.log(awayTime)
  var home_time = parseInt(homeTime)
  var away_time = parseInt(awayTime)
  var bili
  if (home_time > away_time) {
    // bili = away_time/home_time
    bili = Math.round((away_time / home_time) * 10000) / 120.0
  } else {
    bili = Math.round((home_time / away_time) * 10000) / 120.0
  }
  // console.log(bili)
  return bili
  // return 50
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime2(time, format) {
  time = typeof time === 'number' ? time : time instanceof Date ? time.getTime() : parseInt(time)
  if (('' + time).length === 10) {
    time = time * 1000
  }
  if (isNaN(time)) return null
  if (typeof format !== 'string' || !format) format = 'yyyy-MM-dd hh:mm:ss'
  let _time = new Date(time)
  time = _time.toString().split(/[\s:]/g).slice(0, -2)
  time[1] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'][
    _time.getMonth()
  ]
  // console.log('format: ' + time);
  let _mapping = {
    MM: 1,
    dd: 2,
    yyyy: 3,
    hh: 4,
    mm: 5,
    ss: 6
  }
  return format.replace(/([Mmdhs]|y{2})\1/g, (key) => time[_mapping[key]])
}

// 游戏列表 含图标文件名
export const GAME_MAP = [
  {
    gameId: 1,
    name: '英雄联盟',
    logo: 'lol.png',
    abbr: 'lol'
  },
  {
    gameId: 4,
    name: 'Dota2',
    logo: 'dota2.png',
    abbr: 'dota2'
  },
  {
    gameId: 2,
    name: 'CS:GO',
    logo: 'csgo.png',
    abbr: 'cs:go'
  },
  {
    gameId: 3,
    name: '王者荣耀',
    logo: 'kog.png',
    abbr: 'kog'
  },
  {
    gameId: 7,
    name: 'LOL手游',
    logo: 'lol_mobile.png',
    abbr: 'lolmobile'
  },
  {
    gameId: 5,
    name: '绝地求生',
    logo: 'PUBG.png',
    abbr: 'pubg'
  },
  {
    gameId: 6,
    name: '和平精英',
    logo: 'hpjy.png',
    abbr: 'pubgmobile'
  },
  {
    gameId: 8,
    name: '使命召唤',
    logo: 'codmw.png',
    abbr: 'codmw'
  },
  {
    gameId: 9,
    name: 'fifa',
    logo: 'fifa.png',
    abbr: 'fifa'
  },
  {
    gameId: 14,
    name: '无畏契约',
    logo: 'valorant.png',
    abbr: 'valorant'
  },
  // {
  //     "gameId": 101,
  //     "name": "篮球",
  //     "logo": "basketball.png",
  //     "abbr": "basketball",
  // },
  {
    gameId: 15,
    name: 'MMA',
    logo: 'mma.png',
    abbr: 'mma'
  },
  // {
  //     "gameId": 102,
  //     "name": "足球",
  //     "logo": "football.png",
  //     "abbr": "足球",
  // },
  {
    gameId: 16,
    name: '穿越火线',
    logo: 'cf.png',
    abbr: 'cf'
  },
  {
    gameId: 17,
    name: '守望先锋',
    logo: 'overWatch.png',
    abbr: 'overwatch'
  },
  {
    gameId: 18,
    name: '星际争霸',
    logo: 'starCraft2.png',
    abbr: 'starcraft2'
  },
  {
    gameId: 19,
    name: '火箭联盟',
    logo: 'rocketLeagues.png',
    abbr: 'rocketleagues'
  },
  {
    gameId: 20,
    name: '彩虹六号',
    logo: 'rainbow6.png',
    abbr: 'rainbow6'
  },
  {
    gameId: 23,
    name: '魔兽争霸',
    logo: 'wow3.png',
    abbr: 'wow3'
  },
  {
    gameId: 21,
    name: '炉石传说',
    logo: 'hearthstone.png',
    abbr: 'hearthstone'
  },
  {
    gameId: 22,
    name: 'NBA2K',
    logo: 'nba2k.png',
    abbr: 'nba2k'
  },
  {
    gameId: 24,
    name: '传说对决',
    logo: 'aov.png',
    abbr: 'aov'
  }
]

export function gameLogoHandler(gameId) {
  let index, logo
  index = GAME_MAP.findIndex((item) => item.gameId === gameId)
  if (index < 0) {
    logo = '/static/images/score/default.png'
  } else {
    logo = '/static/images/score/' + GAME_MAP[index].logo
  }
  return logo
}

export async function getFingerprintId() {
  const cachedFingerprintId = localStorage.getItem('fingerprintId')

  if (cachedFingerprintId) return cachedFingerprintId

  const fp = await FingerprintJS.load()
  const { visitorId } = await fp.get()

  localStorage.setItem('fingerprintId', visitorId)
  return visitorId
}

export function getQueryString(searchString = window.location.search) {
  const result = {}
  const param = searchString.split('?')[1]
  const search = decodeURIComponent('?' + param)
  const arr = search !== '' ? search.substr(1).split('&') : []
  arr.forEach((item) => {
    if (item) {
      const itemArr = item.split('=')
      result[itemArr[0]] = itemArr[1]
    }
  })
  return result
}

/** 允许上传的图片格式：主流格式 + gif + iOS 截图(png) / 相册(heic/heif) */
export const SUPPORTED_UPLOAD_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/avif'
]

export const SUPPORTED_UPLOAD_IMAGE_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'heic',
  'avif'
]

export const SUPPORTED_UPLOAD_IMAGE_ACCEPT = '.jpg,.jpeg,.png,.heic,.webp,.avif,image/jpeg,image/png,image/heic,image/webp,image/avif'

export const SUPPORTED_UPLOAD_IMAGE_FORMAT_HINT = 'jpg、jpeg、png、HEIC、webp、avif'

export function isSupportedUploadImage(file) {
  const type = (file.type || '').toLowerCase()
  const ext = file.name?.split('.').pop()?.toLowerCase() || ''

  if (SUPPORTED_UPLOAD_IMAGE_TYPES.includes(type)) {
    return true
  }

  if (type === 'image/jpg' || type === 'image/pjpeg') {
    return true
  }

  if (ext && SUPPORTED_UPLOAD_IMAGE_EXTENSIONS.includes(ext)) {
    return true
  }

  return false
}

/** 解析 getHot 返回的 img_upload_max_filesize（单位 KB） */
function getImageUploadMaxKB(system) {
  if (system == null) return undefined
  if (!Object.prototype.hasOwnProperty.call(system, 'img_upload_max_filesize')) return undefined

  const raw = system.img_upload_max_filesize
  if (raw == null || raw === '') return undefined

  const sizeKB = Number(raw)
  if (!Number.isFinite(sizeKB) || sizeKB <= 0) return undefined

  return sizeKB
}

/** getHot 返回的 img_upload_max_filesize（KB→MB，向下取整）；字段未配置或无效时不限制大小 */
export function getImageUploadMaxMB(system) {
  const sizeKB = getImageUploadMaxKB(system)
  if (sizeKB == null) return undefined

  const mb = Math.floor(sizeKB / 1024)
  return mb > 0 ? mb : 0
}

/** 是否启用图片上传大小限制（字段存在且为有效正数） */
export function hasImageUploadSizeLimit(system) {
  return getImageUploadMaxKB(system) != null
}

/** 字节数是否超过后台配置的图片上传上限；未配置上限时恒为 false */
export function exceedsImageUploadMaxSize(sizeBytes, system) {
  const sizeKB = getImageUploadMaxKB(system)
  if (sizeKB == null) return false
  return sizeBytes > sizeKB * 1024
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

/**
 * 图片压缩（browser-image-compression）；非图片文件仅挂载预览 URL。
 * 调用方应先对原始文件做大小校验，再调用本方法。
 * @param { File } file 文件
 * @returns { Promise<File> } 压缩后文件（或原文件）
 */
export async function doCompressor(file) {
  if (!file?.type?.startsWith('image/')) {
    file.url = URL.createObjectURL(file)
    return file
  }

  const originalSize = file.size
  const skipCompressBytes = IMAGE_COMPRESS_OPTIONS.maxSizeMB * 1024 * 1024

  if (originalSize <= skipCompressBytes) {
    file.url = URL.createObjectURL(file)
    console.log('[doCompressor] 图片小于 2M，跳过压缩', {
      name: file.name,
      size: formatFileSize(originalSize)
    })
    return file
  }

  try {
    const compressed = await imageCompression(file, IMAGE_COMPRESS_OPTIONS)
    const result = new File([compressed], file.name, {
      type: compressed.type || file.type,
      lastModified: file.lastModified
    })
    result.url = URL.createObjectURL(result)

    return result
  } catch {
    file.url = URL.createObjectURL(file)
    return file
  }
}

/** 图片压缩超时（毫秒） */
export const IMAGE_COMPRESS_TIMEOUT_MS = 20_000

/** 压缩超时错误标识 */
export const IMAGE_COMPRESS_TIMEOUT_ERROR = { isCompressTimeout: true }

/**
 * 带超时限制的图片压缩；超时抛出 IMAGE_COMPRESS_TIMEOUT_ERROR。
 * 调用方应先对原始文件做大小校验。
 */
export function compressWithTimeout(file, timeoutMs = IMAGE_COMPRESS_TIMEOUT_MS) {
  return Promise.race([
    doCompressor(file),
    new Promise((_, reject) => {
      setTimeout(() => reject(IMAGE_COMPRESS_TIMEOUT_ERROR), timeoutMs)
    })
  ])
}

export function getCacheUserInfo() {
  try {
    let infoStr = localStorage.getItem('userInfo')

    if (infoStr) {
      // 兼容旧的用户信息
      if (!/^{.*}$/.test(infoStr)) infoStr = decryptByAES(infoStr)
      return JSON.parse(infoStr)
    }

    return {}
  } catch {
    return {}
  }
}

export function genVisitorId() {
  const max = Number.MAX_SAFE_INTEGER
  let res

  do {
    res = parseInt(`${new Date().getTime()}${Math.floor(Math.random() * 1000)}`)
  } while (res >= max)

  return res
}

export function formatURL(url, base = window.origin) {
  return new URL(url, base)
}

export async function checkEnv(store) {
  const deviceChecked = await checkSignDeviceId()
  const evnChecked = await checkSignEnv()
  store.commit('setEnv', deviceChecked && evnChecked ? 'browser' : 'node')
}

export function getCookie(name) {
  const cookieArr = document.cookie.split('; ')
  for (let index = 0; index < cookieArr.length; index++) {
    const cookiePair = cookieArr[index].split('=')
    if (cookiePair[0] === name) {
      return decodeURIComponent(cookiePair[1])
    }
  }
  return null
}

export function initDebugger() {
  if (
    import.meta.env.VITE_ENV !== 'development' &&
    (!localStorage.getItem('__x9_fe_debug__disabled') ||
      getCookie('_is_debug_data_only_for_x9') == '1')
  ) {
    initConsoleBan({
      clear: false,
      callback: () => {
        console.clear()
      }
    })
  }
}

// 获取url的token参数
export function getUrlParams(name) {
  const url = new URL(window.location.href)

  return url.searchParams.get(name)
}

export function normalizeUrl(url, defaultProtocol = 'https:') {
  if (typeof url !== 'string' || !url.trim()) return ''

  const trimmed = url.trim()

  // 已经有协议
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `${defaultProtocol}//${trimmed}`
}
