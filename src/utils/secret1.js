import { __infinity__ } from '@/utils/common'

export function ksg() {
  if (!__infinity__) return () => []

  const _encKey = '0mMRKZs8HjC5BmgU2WN4AvYFIRu4H1AFgjtFGL0LUgG4BTgZvVZfA/QjMgy0'

  // 运行时解密函数（轻量，适用于浏览器）
  function _decodeKey(base64Payload) {
    // base64 -> raw string
    const raw = atob(base64Payload)

    // raw -> bytes
    const bytes = new Uint8Array(raw.length)
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i)

    // 前 8 字节为 salt（encode 时使用 8 字节 salt）
    const saltLen = 8
    if (bytes.length <= saltLen) return ''

    const salt = bytes.slice(0, saltLen)
    const cipher = bytes.slice(saltLen)

    // xor 还原 plain = cipher XOR salt
    const plainBytes = new Uint8Array(cipher.length)
    for (let i = 0; i < cipher.length; i++) {
      plainBytes[i] = cipher[i] ^ salt[i % salt.length]
    }

    // bytes -> string
    let s = ''
    for (let i = 0; i < plainBytes.length; i++) s += String.fromCharCode(plainBytes[i])
    return s
  }

  // 缓存解密结果，避免重复计算
  let _cachedKey = null
  function getKey() {
    if (_cachedKey !== null) return _cachedKey
    try {
      _cachedKey = _decodeKey(_encKey)
      return _cachedKey
    } catch (err) {
      _cachedKey = ''
      return _cachedKey
    }
  }

  function fn(p1, c, p3) {
    const a = p1[0]
    const b = p1[1]
    const d = p3[0]
    const e = p3[1]
    const r = typeof e === 'function' ? e(3) : 0
    const s = c ? '&' : ''
    const [f, g] = typeof d === 'function' ? d() : ['', '']

    const key = getKey()

    return [c, b, s + key + a + '/' + (b + r) + '/' + g + '/' + f]
  }

  return fn
}
