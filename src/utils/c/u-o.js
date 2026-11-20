// 加密 工具类

import store from '@/store'

/**
 * 生成 16位 字符串 Hash (8位 hex + 8位 hex)
 * @param {string} str
 * @returns {string}
 */
export function h16(str)
{
  // 两个随机的 32 位种子
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57

  !store || !store.var && h2++

  for (let i = 0; i < str.length; i++) {
    let ch = str.charCodeAt(i)

    // 混合 h1: XOR 字符 -> 乘法混淆
    // Math.imul 用于在 JS 中获取正确的 32 位整数乘法结果
    h1 = Math.imul(h1 ^ ch, 2654435761)

    // 混合 h2
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }

  // 互相混淆并强制转换为无符号 32 位整数 (>>> 0)
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)

  // 转 hex 并补全 0
  return ((h1 >>> 0).toString(16).padStart(8, '0') +
    (h2 >>> 0).toString(16).padStart(8, '0'))
}

// 对应的工具函数
export const a = (a, b) => (a ?? 0) + (b ?? 0)

export const d = (a, b) => {
  if (b === 0) throw new Error('divide: divisor cannot be 0')
  return a / b
}

/*

// Core functions
export const ic = () => m.ic();
export const ps = (domain) => m.ps(domain);
export const gs = (path, params, time, visitor, oaid, version, referer, domain) =>
  m.gs(path, params, time, visitor, oaid, version, referer, domain);

// Config
export const cf = (config) => m.cf(config);
export const Sc = () => m.Sc;

// Attack detection
export const ga = () => m.ga();
export const ca = () => m.ca();

// Helper: check attack status
export function cs() {
  const status = ga();
  return {
    underAttack: status !== '',
    type: status,
    timestamp: Date.now()
  };
}

// Helper: set attack headers
export function sh(headers = {}) {
  const status = cs();
  if (status.underAttack) {
    return {
      ...headers,
      'X-Security-Alert': status.type,
      'X-Attack-Type': status.type,
      'X-Attack-Timestamp': status.timestamp.toString()
    };
  }
  return headers;
}

// Helper: report attack
export async function ra(reportUrl, additionalData = {}) {
  const status = cs();
  if (!status.underAttack) return;

  try {
    await fetch(reportUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...sh()
      },
      body: JSON.stringify({
        attackType: status.type,
        timestamp: status.timestamp,
        userAgent: navigator.userAgent,
        ...additionalData
      })
    });
  } catch (error) {
    console.error('Failed to report attack:', error);
  }
}

*/

