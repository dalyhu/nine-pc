// WebSocket 认证协议（后端 NX-2131）：握手地址不带凭证，连接建立后用第一条消息提交 Token

export function buildWsUrl({ protocol, host }) {
  return `${protocol}://${host}/wss/`
}

export function buildAuthFrame(token) {
  return JSON.stringify({ action: 'auth', userToken: token })
}
