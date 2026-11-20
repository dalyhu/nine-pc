export function isCurrentPlayerMessage(event, iframe) {
  if (!iframe || event.source !== iframe.contentWindow) return false
  try {
    return event.origin === new URL(iframe.src).origin && event.data?.messageType === 'controlIframe'
  } catch {
    return false
  }
}

export function createPlayerFullscreenSession(body) {
  let saved
  const root = body.ownerDocument?.documentElement
  return {
    enter() {
      if (saved) return
      saved = {
        value: body.style.getPropertyValue('overflow'),
        priority: body.style.getPropertyPriority('overflow'),
        marker: root?.hasAttribute('data-player-web-fullscreen')
      }
      body.style.setProperty('overflow', 'hidden')
      root?.setAttribute('data-player-web-fullscreen', '')
    },
    exit() {
      if (!saved) return
      if (saved.value) body.style.setProperty('overflow', saved.value, saved.priority)
      else body.style.removeProperty('overflow')
      if (!saved.marker) root?.removeAttribute('data-player-web-fullscreen')
      saved = null
    }
  }
}

// 网页全屏不是浏览器全屏，系统返回键会让页面后退。进入时压入一条记录并暂停路由监听，返回键只退出全屏。
export function createWebFullscreenHistory(win, router) {
  let pushed = false
  let onBack = null
  const handlePop = () => {
    win.removeEventListener('popstate', handlePop)
    pushed = false
    if (router) router.listening = true
    const callback = onBack
    onBack = null
    callback?.()
  }
  return {
    push(callback) {
      if (pushed) return
      pushed = true
      onBack = callback
      if (router) router.listening = false
      win.history.pushState({ ...(win.history.state || {}), x9PlayerWebFullscreen: true }, '')
      win.addEventListener('popstate', handlePop)
    },
    release() {
      if (!pushed) return
      onBack = null
      if (win.history.state?.x9PlayerWebFullscreen) win.history.back()
      else handlePop()
    }
  }
}
