function ping(url: string, timeout = 3000) {
  if (!url) return Promise.reject(false)

  return new Promise<boolean>((resolve, reject) => {
    const img = new Image()
    const timer = setTimeout(() => {
      clearTimeout(timer)
      reject(false)
    }, timeout)

    img.onload = () => {
      clearTimeout(timer)
      resolve(true)
    }

    img.onerror = () => {
      clearTimeout(timer)
      reject(false)
    }

    img.src = url
  })
}

export function batchPing(hostList: string[], timeout = 3000) {
  // 本地开发环境下，访问100地址的播放器
  if (import.meta.env.VITE_ENV === 'development')
    return Promise.resolve('http://10.83.222.100/xgplayer/index.html')

  if (location.href.includes('SDI=1'))
    return Promise.resolve(location.origin + '/xgplayer/index.html')

  if (!(hostList instanceof Array && hostList.length)) return Promise.resolve('')

  const hostCount = hostList.length
  let rejectedCount = 0

  return new Promise<string>((resolve) => {
    hostList.forEach(async (host = '') => {
      try {
        const origin = host.trim().replace('/xgplayer/index.html', '') || window.origin
        const reqUrl = origin + '/favicon.ico?r=' + new Date().getTime()
        // 非正式环境下，播放器域名与当前应用的域名一致，所以需要手动拼接播放器路径
        const resUrl = origin === window.origin ? origin + '/xgplayer/index.html' : origin
        await ping(reqUrl, timeout)
        resolve(resUrl)
      } catch {
        rejectedCount++
        if (rejectedCount >= hostCount) resolve('')
      }
    })
  })
}
