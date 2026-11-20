import store from '@/store'

/** 是否被其他页面 iframe 嵌套 */
export function isInIframe() {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

/** 获取最顶层窗口的 hostname */
export function getTopHostname() {
  try {
    if (window.top === window.self) return window.location.hostname
    return window.top.location.hostname
  } catch {
    try {
      if (!document.referrer) return ''
      return new URL(document.referrer).hostname
    } catch {
      return ''
    }
  }
}

function normalizeWhitelist(data) {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.list)) return data.list
  if (Array.isArray(data.domains)) return data.domains
  return []
}

function parseDomainEntry(entry) {
  if (!entry) return ''
  const raw = String(entry).trim()
  if (!raw) return ''
  try {
    if (/^https?:\/\//i.test(raw)) return new URL(raw).hostname
  } catch {
    /* ignore */
  }
  return raw.replace(/^https?:\/\//, '').split('/')[0].split(':')[0]
}

/** 是否与顶层窗口同 hostname（同站不同路径嵌套，如 /discuz 套 /main） */
export function isNestedInSameHostname(topHostname = getTopHostname()) {
  const selfHostname = window.location.hostname
  return Boolean(topHostname && selfHostname && topHostname === selfHostname)
}

/** 判断 hostname 是否在白名单内（支持子域名） */
export function isDomainWhitelisted(hostname, whitelist) {
  if (!hostname || !whitelist?.length) return false
  return whitelist.some((entry) => {
    const domain = parseDomainEntry(entry)
    if (!domain) return false
    return hostname === domain || hostname.endsWith(`.${domain}`)
  })
}

function redirectTo404Page() {
  window.location.replace(`${window.location.origin}/404.html`)
}

/**
 * 校验未通过：优先让顶层窗口跳转到本站（打破 iframe 嵌套）；
 * 若因跨域等原因失败，则将当前 iframe 页跳转到 404，防止被其他网站套用。
 */
export function handleIframeDomainBlocked() {
  try {
    window.top.location.href = window.location.href
  } catch {
    redirectTo404Page()
  }
}

export async function fetchIframeDomainWhitelist() {
  const data = await store.dispatch('getIframeDomain')
  return normalizeWhitelist(data)
}

/**
 * iframe 嵌套时的域名白名单校验。
 * @returns {Promise<boolean>} 
 */
export async function checkIframeBeforeInit() {
  if (!isInIframe()) return true

  const topHostname = getTopHostname()
  if (isNestedInSameHostname(topHostname)) return true

  let whitelist = []

  try {
    whitelist = await fetchIframeDomainWhitelist()
  } catch (e) {
    console.warn('[iframeDomain] fetch whitelist failed:', e)
    return true
  }
  if (whitelist.length === 0) return true

  if (isDomainWhitelisted(topHostname, whitelist)) return true

  handleIframeDomainBlocked()
  return false
}
