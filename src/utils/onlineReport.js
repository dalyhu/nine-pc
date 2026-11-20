/**
 * 进入系统与在线心跳上报（PC 接入层）
 * 多标签页选主、跨标签页 3 分钟限频由 tab-leader 库负责；这里只负责：判断 client_type、调用接口、读取当前身份
 *
 * 身份变化不需要在这里处理：PC 登录、退出后所有标签页都会整页刷新（user.js 的 SET_USERINFO、App.vue 的 storage 监听），
 * 刷新后的 Leader 发现「上次运行」记录的 key 和当前身份不同，会立即补发
 */
import { createTabInterval } from 'tab-leader'
import { enterSystemService, onlineHeartbeatService } from '@/api/user'
import { consumeEnterSkip, getPcClientType, markEnterSkip } from './onlineReportUtils'

const HEARTBEAT_INTERVAL_MS = 3 * 60 * 1000

function getSessionStorage() {
  try {
    return window.sessionStorage
  } catch (error) {
    return null
  }
}

// 模块加载时（页面初始化最前面）就读取跳过标记：如果等 store 初始化完再读，接口慢时标记可能已经过期
const skipEnterThisLoad = consumeEnterSkip(getSessionStorage(), Date.now())
// 本页调「进入系统」时用的身份；没调过为 null
let enteredIdentity = null

// 和 store getters.userIdentity 的判断一致：同时有 id 和 token 才算登录用户
function identityOf(info) {
  return info && info.id && info.token ? `u:${info.id}` : 'guest'
}

/** 在 store 初始化成功后调用一次 */
export function startOnlineReport(store) {
  try {
    const clientType = getPcClientType(window)

    if (!skipEnterThisLoad) {
      enteredIdentity = identityOf(store.state.user.infoData)
      enterSystemService(clientType).catch(() => {})
    }

    // name 沿用旧实现的锁名和存储 key 前缀（x9-online-hb:<client_type>）：发版时新旧代码的标签页共用同一把锁和同一份记录
    createTabInterval({
      name: `x9-online-hb:${clientType}`,
      interval: HEARTBEAT_INTERVAL_MS,
      key: () => identityOf(store.state.user.infoData),
      run: () => onlineHeartbeatService(clientType)
    }).start()
  } catch (error) {
    console.error(error)
  }
}

/** 本标签页接下来的整页加载不调「进入系统」（退出登录、被其他标签页的登录态变化带着刷新） */
export function skipNextEnter() {
  markEnterSkip(getSessionStorage(), Date.now())
}

/**
 * 本页因身份变化即将刷新（user.js 的 SET_USERINFO）时调用：
 * 如果本页已经用这个新身份调过「进入系统」（例如带 token/userId 的地址打开，挂载时就提交了登录信息），刷新后不再重复调用；
 * 普通登录时本页是用游客身份调的，刷新后照常再调一次（需求 D4）
 */
export function skipEnterIfReported(info) {
  if (enteredIdentity && enteredIdentity === identityOf(info)) skipNextEnter()
}
