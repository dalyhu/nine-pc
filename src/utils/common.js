import avatar from '/static/images/avatar.png'
import team from '/static/images/team.png'
import { unref } from 'vue'
import { concat, uniqBy, divide, add, slice } from 'lodash-es'
import md5 from 'crypto-js/md5'
import { v4 as uuidv4 } from 'uuid'
import xssFilter from '@/utils/xssFilter'
import dayjs from 'dayjs'

export const defaultAvatar = avatar
export const defaultTeamAvatar = team

export const __infinity__ = '__infinity__'
// 获取今天的日期
export function getToday() {
  return dayjs().locale('zh-cn').format('YYYY-MM-DD')
}

export function getOneMonth(d, next = false) {
  let date = new Date(d)
  date.setMonth(date.getMonth() + (next ? 1 : -1))
  return date.toISOString().slice(0, 10)
}

export function getYMD(timestamp) {
  if (('' + timestamp).length === 10) timestamp *= 1000
  return dayjs(timestamp).locale('zh-cn').format('YYYY-MM-DD')
}

export function formatDate(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  if (('' + timestamp).length === 10) timestamp *= 1000
  return dayjs(timestamp).locale('zh-cn').format(format)
}

/** 新闻列表时间：2023-07-18 00:58:42 → 07-18 00:58 */
export function formatNewsTime(addtime) {
  if (!addtime) return ''
  const m = String(addtime).match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/)
  if (!m) return addtime
  return `${m[2]}-${m[3]} ${m[4]}:${m[5]}`
}

export function getTimeMs(timestamp, cut = 1000) {
  if (!timestamp) return ''
  if (('' + timestamp).length === 10) timestamp *= 1000
  if (isNaN(new Date(timestamp).getTime() / cut)) return ''
  return new Date(timestamp).getTime() / cut
}

// 时间戳转时间
export function timeStamp(value) {
  var date = new Date(value * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var hour = ('0' + date.getHours()).slice(-2)
  var minute = ('0' + date.getMinutes()).slice(-2)
  // 拼接
  var result = hour + ':' + minute //+ ":" + second;
  // 返回
  return result
}

export function toMD5(content = '') {
  return md5(content).toString()
}

// 时间戳转时间 年月日
export function timeStamp1(value) {
  var date = new Date(value * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var year = date.getFullYear()
  var month = ('0' + (date.getMonth() + 1)).slice(-2)
  var sdate = ('0' + date.getDate()).slice(-2)
  var hour = ('0' + date.getHours()).slice(-2)
  var minute = ('0' + date.getMinutes()).slice(-2)
  // 拼接
  var result = year + '-' + month + '-' + sdate + ' ' + hour + ':' + minute //+ ":" + second;
  // 返回
  return result
}

// 随机数
export function rand(min = 1000, max = 9999) {
  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * 分享QQ好友
 * @param  {[type]} title [分享标题]
 * @param  {[type]} url   [分享url链接，默认当前页面链接]
 * @param  {[type]} pic   [分享图片]
 * @return {[type]}       [description]
 */
export function shareQQ(url, title, pic) {
  var param = {
    url: url || window.location.href,
    desc: '',
    /*分享理由*/
    title: title || '',
    /*分享标题(可选)*/
    summary: '',
    /*分享描述(可选)*/
    pics: pic || '',
    /*分享图片(可选)*/
    flash: '',
    /*视频地址(可选)*/
    site: '' /*分享来源 (可选) */
  }
  var s = []
  for (var i in param) {
    s.push(i + '=' + encodeURIComponent(param[i] || ''))
  }
  var targetUrl = 'http://connect.qq.com/widget/shareqq/iframe_index.html?' + s.join('&')
  window.open(targetUrl, 'qq', 'height=520, width=720')
}

// @ts-ignore
// prettier-ignore
export function ksg() {
  // p1=[url,当前时间戳]
  // c=params经过paramsToQueryString后的结果
  // a=url
  // b=当前时间戳
  // d=()=>[deviceId,uid]
  // e=random方法
  // r=random number 0-2
  // f=deviceId
  // g=uid
  // function fn(p1, c, p3) {
  //   const a = p1[0];
  //   const b = p1[1];
  //   const d = p3[0];
  //   const e = p3[1];
  //   const r = e(3);
  //   const s = c ? '&' : '';
  //   const [f, g] = d();
  //   return [c, b, s + 'key=B_f2$f02##N5PXT1&7L1jf)0&jA3&@#%/' + a + '/' + (b + r) + '/' + g + '/' + f];
  // }
  var _0xodY = 'jsjiami.com.v7'; function _0x28d7(_0x5eeb6e, _0x436053) { const _0x346249 = _0x3462(); return _0x28d7 = function (_0x28d7bd, _0x59f098) { _0x28d7bd = _0x28d7bd - 0x68; let _0x4ad578 = _0x346249[_0x28d7bd]; if (_0x28d7['LRfgUd'] === undefined) { var _0x3be508 = function (_0x4fd7a2) { const _0x4f1015 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/='; let _0x10a957 = '', _0x2c653d = ''; for (let _0x389b9b = 0x0, _0x567d48, _0x451503, _0x249c55 = 0x0; _0x451503 = _0x4fd7a2['charAt'](_0x249c55++); ~_0x451503 && (_0x567d48 = _0x389b9b % 0x4 ? _0x567d48 * 0x40 + _0x451503 : _0x451503, _0x389b9b++ % 0x4) ? _0x10a957 += String['fromCharCode'](0xff & _0x567d48 >> (-0x2 * _0x389b9b & 0x6)) : 0x0) { _0x451503 = _0x4f1015['indexOf'](_0x451503); } for (let _0x5306a4 = 0x0, _0x10b9c2 = _0x10a957['length']; _0x5306a4 < _0x10b9c2; _0x5306a4++) { _0x2c653d += '%' + ('00' + _0x10a957['charCodeAt'](_0x5306a4)['toString'](0x10))['slice'](-0x2); } return decodeURIComponent(_0x2c653d); }; const _0xeaa11f = function (_0x237d52, _0x13797c) { let _0x430966 = [], _0x49d4e5 = 0x0, _0xa26293, _0x2ecfc5 = ''; _0x237d52 = _0x3be508(_0x237d52); let _0x3136a5; for (_0x3136a5 = 0x0; _0x3136a5 < 0x100; _0x3136a5++) { _0x430966[_0x3136a5] = _0x3136a5; } for (_0x3136a5 = 0x0; _0x3136a5 < 0x100; _0x3136a5++) { _0x49d4e5 = (_0x49d4e5 + _0x430966[_0x3136a5] + _0x13797c['charCodeAt'](_0x3136a5 % _0x13797c['length'])) % 0x100, _0xa26293 = _0x430966[_0x3136a5], _0x430966[_0x3136a5] = _0x430966[_0x49d4e5], _0x430966[_0x49d4e5] = _0xa26293; } _0x3136a5 = 0x0, _0x49d4e5 = 0x0; for (let _0xa6b237 = 0x0; _0xa6b237 < _0x237d52['length']; _0xa6b237++) { _0x3136a5 = (_0x3136a5 + 0x1) % 0x100, _0x49d4e5 = (_0x49d4e5 + _0x430966[_0x3136a5]) % 0x100, _0xa26293 = _0x430966[_0x3136a5], _0x430966[_0x3136a5] = _0x430966[_0x49d4e5], _0x430966[_0x49d4e5] = _0xa26293, _0x2ecfc5 += String['fromCharCode'](_0x237d52['charCodeAt'](_0xa6b237) ^ _0x430966[(_0x430966[_0x3136a5] + _0x430966[_0x49d4e5]) % 0x100]); } return _0x2ecfc5; }; _0x28d7['MNhwtG'] = _0xeaa11f, _0x5eeb6e = arguments, _0x28d7['LRfgUd'] = !![]; } const _0x3b89c1 = _0x346249[0x0], _0x46e212 = _0x28d7bd + _0x3b89c1, _0x5a029d = _0x5eeb6e[_0x46e212]; return !_0x5a029d ? (_0x28d7['sLIaXH'] === undefined && (_0x28d7['sLIaXH'] = !![]), _0x4ad578 = _0x28d7['MNhwtG'](_0x4ad578, _0x59f098), _0x5eeb6e[_0x46e212] = _0x4ad578) : _0x4ad578 = _0x5a029d, _0x4ad578; }, _0x28d7(_0x5eeb6e, _0x436053); } function _0x3462() { const _0x30363c = (function () { return [_0xodY, 'kBdjsyjJdiMaPqmRi.VctoHmJ.ChvT7KFwXXxNkM==', 'W7Sgd04g', 'aSoUW5BcJSkQ', 'WQ5RWRhcJalcVSoida', 'WPGdjSoaAmkTWRpcUG', 'W5eXW58iW6jxW6vadbVcP1G', 'ah5VWR8QFgSTv8oaW5aX', 'od8vW6xcJCkXW4VcLvG', 'bhHVWReGEXyrE8o/W64Uza', 'g8kwC8ose8omWR/cQmkqB8km'].concat((function () { return ['yMlcN8ofW4NcQwmPW5Dg', 'WPa3aINdUSkRls/cOG', 'W687WQFcOZu', 'oJ4rWPddSSkzW7NcIvabcq', 'hmkwDmovAmo9WOtcR8k8tW', 'WPH+vdX+ksXRW5ldV1Hk', 'WP3cPSktWQRdJJ3dVmkS', 'pZqrWPldTCoKW6NcNwCSm8kX', 'WPu+kvKEDZi', 'W5xcJHhdVSo7iWpcSmkiW5OA', 'WP4hz8kofSooW4VcGNRcVcJdUwq'].concat((function () { return ['zMJcMSohWRldQcS3W6zRWPHJWPi', 'ot7cNbpdSSonDG', 'BrJcTZpdJq', 'gmkfW4juW4fopqDuaLTe', 'hSkhW4HAW4PgaGL8f0Hf', 'FZ3dMCoYkCkvmeJcTCo7xG', 'WQVcN8kKqg4', 'grPRWQ3dNq']; }())); }())); }()); _0x3462 = function () { return _0x30363c; }; return _0x3462(); }; (function (_0x543ec6, _0x13ed57, _0x95095c, _0x3c2c55, _0xc7ccff, _0x3c33ff, _0xb21791) { return _0x543ec6 = _0x543ec6 >> 0x1, _0x3c33ff = 'hs', _0xb21791 = 'hs', function (_0x23151a, _0x45ee11, _0x4730cb, _0x2cf9e3, _0x24659d) { const _0x36d67b = _0x28d7; _0x2cf9e3 = 'tfi', _0x3c33ff = _0x2cf9e3 + _0x3c33ff, _0x24659d = 'up', _0xb21791 += _0x24659d, _0x3c33ff = _0x4730cb(_0x3c33ff), _0xb21791 = _0x4730cb(_0xb21791), _0x4730cb = 0x0; const _0x4b080c = _0x23151a(); while (!![] && --_0x3c2c55 + _0x45ee11) { try { _0x2cf9e3 = -parseInt(_0x36d67b(0x6c, '7&*O')) / 0x1 * (parseInt(_0x36d67b(0x75, 'GYXn')) / 0x2) + parseInt(_0x36d67b(0x6e, 'A3we')) / 0x3 + parseInt(_0x36d67b(0x82, 'oNv3')) / 0x4 * (-parseInt(_0x36d67b(0x72, 'ysbf')) / 0x5) + parseInt(_0x36d67b(0x78, '^RJr')) / 0x6 * (parseInt(_0x36d67b(0x77, '46cN')) / 0x7) + parseInt(_0x36d67b(0x7e, 'QwyN')) / 0x8 * (parseInt(_0x36d67b(0x70, 'A3we')) / 0x9) + -parseInt(_0x36d67b(0x7d, 'ysbf')) / 0xa + -parseInt(_0x36d67b(0x79, 'GYXn')) / 0xb * (-parseInt(_0x36d67b(0x73, '6ip3')) / 0xc); } catch (_0x2b85c2) { _0x2cf9e3 = _0x4730cb; } finally { _0x24659d = _0x4b080c[_0x3c33ff](); if (_0x543ec6 <= _0x3c2c55) _0x4730cb ? _0xc7ccff ? _0x2cf9e3 = _0x24659d : _0xc7ccff = _0x24659d : _0x4730cb = _0x24659d; else { if (_0x4730cb == _0xc7ccff['replace'](/[dqtFTBwVCXhPxyKMkHJRN=]/g, '')) { if (_0x2cf9e3 === _0x45ee11) { _0x4b080c['un' + _0x3c33ff](_0x24659d); break; } _0x4b080c[_0xb21791](_0x24659d); } } } } }(_0x95095c, _0x13ed57, function (_0x5aff74, _0x2d6475, _0x9220fd, _0x34fc50, _0x75824e, _0x35d355, _0x492c5e) { return _0x2d6475 = '\x73\x70\x6c\x69\x74', _0x5aff74 = arguments[0x0], _0x5aff74 = _0x5aff74[_0x2d6475](''), _0x9220fd = '\x72\x65\x76\x65\x72\x73\x65', _0x5aff74 = _0x5aff74[_0x9220fd]('\x76'), _0x34fc50 = '\x6a\x6f\x69\x6e', (0x17a192, _0x5aff74[_0x34fc50]('')); }); }(0x188, 0xa0a03, _0x3462, 0xc6), _0x3462) && (_0xodY = _0x3462); function fn(_0x21d1b9, _0x9989b8, _0x170157) { const _0x24554e = _0x28d7, _0x706877 = { 'lPosl': function (_0x5c9e91, _0x244960) { return _0x5c9e91(_0x244960); }, 'zdOpS': function (_0x4a2b63) { return _0x4a2b63(); }, 'rfWcx': function (_0x496a15, _0x6ad8f1) { return _0x496a15 + _0x6ad8f1; }, 'VNbDK': function (_0x193061, _0x750a4) { return _0x193061 + _0x750a4; } }, _0x147740 = _0x21d1b9[0x0], _0xafabf0 = _0x21d1b9[0x1], _0x4dae61 = _0x170157[0x0], _0x470198 = _0x170157[0x1], _0xc6c098 = _0x706877[_0x24554e(0x7f, 'QwyN')](_0x470198, 0x3), _0x4165fa = _0x9989b8 ? '&' : '', [_0x2cabfb, _0x18d929] = _0x706877[_0x24554e(0x68, 'PsK^')](_0x4dae61); return [_0x9989b8, _0xafabf0, _0x706877[_0x24554e(0x83, '5o[$')](_0x706877[_0x24554e(0x6a, 'N*c9')](_0x706877[_0x24554e(0x74, '8[BE')](_0x706877['rfWcx'](_0x706877['VNbDK'](_0x706877[_0x24554e(0x69, '46cN')](_0x4165fa, 'key=B_f2$f02##N5PXT1&7L1jf)0&jA3&@#%/') + _0x147740 + '/', _0xafabf0 + _0xc6c098), '/'), _0x18d929), '/'), _0x2cabfb)]; }
  return fn
}

/**
 * 微信分享
 * @return {[type]} [description]
 */
export function weixin() {
  var url = window.location.href,
    encodePath = encodeURIComponent(url),
    targetUrl = 'http://qr.liantu.com/api.php?text=' + encodePath
  window.open(targetUrl, 'weixin', 'height=320, width=320')
}

/**
 * 分享新浪微博
 * @param  {[type]} title [分享标题]
 * @param  {[type]} url   [分享url链接，默认当前页面]
 * @param  {[type]} pic   [分享图片]
 * @return {[type]}       [description]
 */
export function sinaWeiBo(title, url, pic) {
  var param = {
    url: url || window.location.href,
    type: '3',
    count: '1',
    /** 是否显示分享数，1显示(可选)*/
    appkey: '',
    /** 您申请的应用appkey,显示分享来源(可选)*/
    title: '',
    /** 分享的文字内容(可选，默认为所在页面的title)*/
    pic: pic || '',
    /**分享图片的路径(可选)*/
    ralateUid: '',
    /**关联用户的UID，分享微博会@该用户(可选)*/
    rnd: new Date().valueOf()
  }
  var temp = []
  for (var p in param) {
    temp.push(p + '=' + encodeURIComponent(param[p] || ''))
  }
  var targetUrl = 'http://service.weibo.com/share/share.php?' + temp.join('&')
  window.open(targetUrl, 'sinaweibo', 'height=430, width=400')
}
//深度合并对象
export function assignDeep() {
  const args = Array.from(arguments)
  if (args.length < 2) return args[0]
  let result = args[0]
  args.shift()
  args.forEach((item) => {
    if (isPlainObject(item)) {
      if (!isPlainObject(result)) result = {}
      for (let key in item) {
        if (result[key] && isPlainObject(item[key])) {
          result[key] = assignDeep(result[key], item[key])
        } else {
          result[key] = item[key]
        }
      }
    } else if (item instanceof Array) {
      if (!(result instanceof Array)) result = []
      item.forEach((arrItem, arrIndex) => {
        if (isPlainObject(arrItem)) {
          result[arrIndex] = assignDeep(result[arrIndex])
        } else {
          result[arrIndex] = arrItem
        }
      })
    }
  })
  return result
}

export function shareToQq(title, url, picurl) {
  var shareqqzonestring =
    'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary=' +
    title +
    '&url=' +
    url +
    '&pics=' +
    picurl

  window.open(shareqqzonestring, 'newwindow', 'height=400,width=400,top=100,left=100')
}

// 返回篮球足球 类型 字符串, type 0 足球，1 篮球, 3 电竞
export function returnMatchType(type) {
  let typeStr = 'football'
  if (type == 1) {
    typeStr = 'basketball'
  }
  if (type == 2) {
    typeStr = '2'
  }
  if (type == 3) {
    typeStr = '3'
  }
  if (type == 4) {
    typeStr = '4'
  }
  return typeStr
}

// 数组去重
export function dedupArrery(arr) {
  return Array.from(new Set(arr))
}

export function avatarHandler(src) {
  if (!src) {
    return defaultAvatar
  }
  return src
}
// 加载默认头像
export function errorImg(e, defaultUrl) {
  let img = e.srcElement
  img.src = defaultUrl || defaultAvatar
  img.onerror = null
}

export function debounce(fn, delay = 300) {
  let timer = 0
  return () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = 0
    }, delay)
  }
}

export function formatDateLine(time, format = 'YYYY-MM-DD HH:mm:ss') {
  const t = time ? Number(time) * 1000 : ''
  return dayjs(t).locale('zh-cn').format(format)
}

// 金额格式化
export function money(value = 0, dec = 0) {
  return parseFloat(value)
    .toFixed(dec)
    .toString()
    .split('')
    .reverse()
    .join('')
    .replace(/(\d{3})/g, '$1,')
    .replace(/,$/, '')
    .split('')
    .reverse()
    .join('')
}

export function unionEndBy(source, data, by, maxCount) {
  if (!source || !data || !by) throw new Error('unionEndBy params error.')
  let res = uniqBy(concat(source, data), by)
  const len = res.length
  if (maxCount && len > maxCount) res = res.slice(len - maxCount)
  return res
}

export function unionStartBy(source, data, by, maxCount) {
  if (!source || !data || !by) throw new Error('unionStartBy params error.')
  let res = uniqBy(concat(data, source), by)
  const len = res.length
  if (maxCount && len > maxCount) res = res.slice(len - maxCount)
  return res
}

export function genSeedId() {
  return toMD5(`w-${new Date().getTime()}-${uuidv4()}`)
}

export function getBaseUrl() {
  return ''
}

export function getImageUrl(path) {
  return path
}

export function tsg(sysDiffTime) {
  return Math.floor(add(divide(Date.now(), 1000), sysDiffTime))
}

export function addFirstWrap(content) {
  if (
    !/^\s*(\n|\r|\f|<br\/>)+/.test(content) &&
    (/(\n|\r|\f|<br\/>)+/.test(content) ||
      (/https?:\/\/\S+/.test(content) && content.match(/\S/g)?.length >= 50))
  ) {
    return '<br/>' + content
  }

  return content
}

export function formatTextMsg(content, needFirstWrap = false) {
  // // 上传视频, 特殊处理，快速高效(＜buttonclass="video-upload">上传视频＜/button>)
  // if (content?.includes('＜button')) {
  //   content = content.slice(0, content.indexOf('＜button'))
  // }

  content = unref(content)
  if (content == null) return ''

  content = String(content)

  content = xssFilter(content)

  // macos ios 低版本不支持零宽断言 ?<! Lookbehind
  // content = content
  //   .replace(/(?<!<a\s[^>]*?)(?<!<img\s[^>]*?)(https?:\/\/\S+)/g, "<a class='text_link' target='_blank' href='$1'>$1</a>")
  //   .replace(/\r\n/g, '<br/>')
  //   .replace(/(\n|\r|\f)/g, '<br/>');

  // 用以下方式替换上述操作
  content = content
    .split(/(<a.*?a>|<img.*?>)/i)
    .reduce((res, str) => {
      if (str === '') return res

      if (!/<.*>/.test(str))
        str = str.replace(
          /(https?:\/\/\S+)/g,
          "<a class='text_link' target='_blank' href='$1'>$1</a>"
        )

      return res + str
    }, '')
    .replace(/\r\n/g, '<br/>')
    .replace(/(\n|\r|\f)/g, '<br/>')

  // 首行无换行符，并且内容包含至少一个换行符 或 包含超链接且非空字符长度超过50，则在行首追加换行符
  if (needFirstWrap) content = addFirstWrap(content)

  return content
}

export function getFormDate(val, outputFormat = 'MM-DD HH:mm') {
  if (!val) return
  const date = new Date(typeof val === 'number' && val.toString().length === 10 ? val * 1000 : val)

  if (isNaN(date.getTime())) {
    throw new TypeError('Invalid date')
  }

  const parts = {
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    DD: String(date.getDate()).padStart(2, '0'),
    HH: String(date.getHours()).padStart(2, '0'),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
    YYYY: String(date.getFullYear())
  }

  return Object.entries(parts).reduce((item, [key, value]) => {
    return item.replace(key, value)
  }, outputFormat)
}

export const removeUrlParams = (param) => {
  const url = new URL(window.location.href)

  if (url.searchParams.has(param)) {
    url.searchParams.delete(param)
    window.history.replaceState({}, '', url.toString())
  }
}

export function formatThousandsIntl(value, locale = 'en-US') {
  if (value === null || value === undefined) return ''

  const num = Number(String(value).replace(/,/g, ''))

  if (!isFinite(num)) return String(value)

  return new Intl.NumberFormat(locale).format(num)
}

/**
 * 从直播间路由解析主播 uid：优先 query.uid，否则 query.id（与 H5 一致）。
 * 用于避免 getRoomInfo 等接口出现 uid=NaN。
 */
export function pickAnchorUidFromRoute(route) {
  if (!route?.query) return undefined
  const q = route.query
  const raw = q.uid != null && q.uid !== '' ? q.uid : q.id
  const val = Array.isArray(raw) ? raw[0] : raw
  if (val === undefined || val === null || val === '') return undefined
  const n = Number(val)
  return Number.isFinite(n) && n > 0 ? n : undefined
}

/**
 * 解析 getRoomInfo 使用的主播 uid：优先已同步的 query.uid，其次房间详情 info.uid。
 * 注意：live 页会把 query.id 改为 match_id，不可用 query.id 表示主播。
 */
export function resolveLiveRoomAnchorUid(query, info) {
  const quid = query?.uid
  const qFirst = Array.isArray(quid) ? quid[0] : quid
  if (qFirst !== undefined && qFirst !== null && qFirst !== '') {
    const n = Number(qFirst)
    if (Number.isFinite(n) && n > 0) return n
  }
  const iu = info?.uid
  if (iu !== undefined && iu !== null && iu !== '') {
    const n = Number(iu)
    if (Number.isFinite(n) && n > 0) return n
  }
  return undefined
}

export default {
  timeStamp,
  rand,
  timeStamp1,
  shareQQ,
  addFirstWrap,
  weixin,
  sinaWeiBo,
  shareToQq,
  assignDeep,
  returnMatchType,
  dedupArrery,
  avatarHandler,
  errorImg,
  debounce,
  money,
  unionEndBy,
  unionStartBy,
  genSeedId,
  pickAnchorUidFromRoute,
  resolveLiveRoomAnchorUid
}
