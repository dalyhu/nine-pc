# 【PC】WebSocket 认证改为连接建立后通过消息提交 Token — 需求文档

| 项 | 内容 |
|---|---|
| 工单 | NX-2133（PC）；H5 对应 NX-2132；后端 NX-2131 |
| 分支 | `feat/NX-2133`，从 `main`（`965b7d8f`）切出 |
| 后端方案 | 飞书《【x9】【nx-2131】/wss 的 userToken 问题》（后端分支 `bug/nx-2131`，仓库 `huya-x9-php` 的 IM 服务） |
| 技术方案 | [WebSocket消息认证-NX-2133-技术方案.md](./WebSocket消息认证-NX-2133-技术方案.md) |

## 一、背景

聊天 / 直播间 IM 的 WebSocket 现在把登录 Token 放在握手地址里：`/wss/?userToken=<token>`。登录用户取用户对象的 `token`，未登录时取游客 token。

代理的访问日志会记录完整请求行（含查询参数），并进入 ELK，所以日志里能看到完整 Token。前台 Token 目前没有过期和作废机制，拿到它就能以该用户身份调用前台接口。

## 二、目标

1. WebSocket 握手地址不再带任何登录凭证（`/wss/`，无查询参数）。
2. 连接建立后，客户端用第一条消息提交 Token 完成认证。
3. 认证通过前不发送订阅等业务消息，也不把连接视为可用；认证失败或超时由服务端断开，前端按现有机制重连。

## 三、后端协议（NX-2131，前端只依赖这些）

| 方向 | 内容 | 说明 |
|---|---|---|
| 客户端 → 服务端：连接 | `wss://<域名>/wss/` | 不带任何参数 |
| 客户端 → 服务端：第一条消息 | `{"action":"auth","userToken":"<token>"}` | 值与原来地址里的 `userToken` 相同；登录用户和游客都用这个字段 |
| 服务端 → 客户端：成功 | 现有 `open` 帧，内容不变 | **收到 `open` 后才能发 `sub` / `unsub`** |
| 服务端 → 客户端：Token 错误 | `{"action":"tokenError"}` 后断开 | 与现在相同 |
| 服务端 → 客户端：无渠道 | `{"action":"channelError"}` 后断开 | 与现在相同 |
| 服务端 → 客户端：超时 | `{"action":"authTimeout"}` 后断开 | 新增；连接后 10 秒内未认证成功 |
| 服务端 → 客户端：认证前发了别的消息 | `{"action":"response","code":4,"msg":"NOT-AUTHED"}` | 新增；该消息**作废**，连接保留到超时 |
| 服务端 → 客户端：重复认证 | `{"action":"response","code":5,"msg":"ALREADY-AUTHED"}` | 新增；同一连接不能换身份 |
| 心跳 | 照旧 | 认证前后都一样 |

兼容性：后端开关 `IM_URL_TOKEN_REJECT` 默认关闭，旧客户端（地址带 Token）在开关打开前继续可用。

## 四、范围

**改：** PC 站聊天 IM 连接（`src/utils/im/`）。

**不改：**
- 比分 socket（`src/utils/scoreSocket.js`）：地址只带 `match_id`、`user_id`，不带 Token。
- 后台 IM（`x9-web-im`，地址带 `?token=&tokenid=`）：后端方案要求另开前端单。
- Token 的有效期、作废机制、ELK 历史数据清理：后端方案第 8 节列为不在本单处理。

## 五、验收标准

1. 登录用户和游客进入直播间，开发者工具里 WS 地址为 `wss://<域名>/wss/`，**不含 `userToken`**。
2. WS 帧顺序：连接打开 → 客户端发 `auth` → 收到 `open` → 之后才出现 `sub`。认证前不出现 `sub` / `unsub`，也不会收到 `NOT-AUTHED`。
3. 进入直播间后能收到其他人的发言、礼物等推送；切换直播间，订阅正常。
4. 断网恢复、服务端断开（含 `authTimeout`）后自动重连，每条新连接都先发 `auth`，收到 `open` 后房间订阅恢复。`tokenError` 后同样会重连，但 Token 不变就会一直失败，这与现在一致（见技术方案 2.3 节）。
5. 每条新连接 `auth` 里用的都是本次 `IM.connect()` 取到的 Token；登录、游客 Token 变化后触发的重连使用新 Token。
6. 单元测试覆盖：地址不带 Token、`auth` 帧内容、收到 `open` 前不进入已连接状态。
7. 上 PRE 后在 ELK（`logstash-x9-pre-proxy-*`）查 `/wss` 请求行，新连接不含 Token。

## 六、上线约束（重要）

**后端必须先上，前端后上。** 新前端在旧服务端上会因为地址没有 Token 被立刻回 `tokenError` 并断开，聊天全部不可用。每个环境（PRE、BETA、生产）都要先确认后端 `bug/nx-2131` 已部署，再合入前端。

快速判断某个环境的后端是否已支持（浏览器控制台，未登录即可），分两步：

**第一步：只连接、什么都不发，看服务端反应**（判断后端版本）：

```js
const ws = new WebSocket(`wss://${location.host}/wss/`)
ws.onmessage = (e) => console.log(new Date().toISOString(), '收到', e.data)
ws.onclose = (e) => console.log(new Date().toISOString(), '关闭', e.code)
```

- 连上后立刻收到 `tokenError` 并被关闭：旧服务端，后端**未部署**。
- 连上后没有任何消息，约 10 秒后收到 `authTimeout` 并被关闭：新服务端，**已部署**。

**第二步：确认 Token 能通过认证**（第一步确认已部署之后再做）：

```js
const ws2 = new WebSocket(`wss://${location.host}/wss/`)
ws2.onmessage = (e) => console.log('收到', e.data)
ws2.onopen = () => ws2.send(JSON.stringify({ action: 'auth', userToken: '<从任一接口响应头 xiao9-visitor-token 复制>' }))
```

- 收到 `open`：游客 Token 认证可用。登录用户把 Token 换成登录后的再做一次。
- 收到 `tokenError`：后端已部署但这个 Token 不被认可，把现象（不含 Token）反馈给后端。

不能只看「发 auth 后收到 `tokenError`」来判断后端版本：旧服务端也会在连接后立刻回 `tokenError`，客户端可能已经先把 auth 发出去了。

自测记录与截图里不要出现 Token，只写 userId。

## 七、待确认

| # | 问题 | 现状 |
|---|---|---|
| 1 | 后端 `bug/nx-2131` 何时部署 PRE / BETA / 生产 | PRE 已部署（第八节实测）；BETA、生产待确认 |
| 2 | 游客 Token 走 `auth` 消息是否可用 | **已确认可用**（第八节实测） |
| 3 | 前端回滚时，该环境 `IM_URL_TOKEN_REJECT` 是否仍关闭 | 回滚前必须确认（技术方案第五节） |

## 八、PRE 探测记录（2026-11-16）

后端已部署 PRE，在 `pre-www.eje60.click` 页面控制台实测（未登录，用游客 Token；Token 未打印）：

| 场景 | 结果 |
|---|---|
| 连上 `/wss/` 什么都不发 | 0.42s 原生 open，**10.37s 收到 `authTimeout`，随即断开，关闭码 1006** |
| 发 `auth` + 错误 Token（连续 3 次，覆盖不同 worker） | 约 0.1s 收到 `tokenError`，随即断开，**关闭码 1006**（3 次一致） |
| 发 `auth` + 游客 Token | 约 0.1s 收到 `open`，`info.userId` 为游客 id，`userType = 0` |
| 认证前发 `"heart"`、`sub` | `heart` 无回应；`sub` 收到 `{"action":"response","code":4,"msg":"NOT-AUTHED"}`，连接保留 |
| 接上一步再发 `auth` | 收到 `open`；再发一次 `auth` 收到 `{"action":"response","code":5,"msg":"ALREADY-AUTHED"}`，连接保留 |

结论：
- 第七节第 1 条（后端部署）：PRE 已部署；BETA、生产仍需在合入前按第六节确认。
- 第七节第 2 条（游客）：**游客 Token 可以通过 `auth` 认证**。
- 关闭码：`authTimeout`、`tokenError` 都是 1006（服务端直接断开 TCP，不发关闭帧），不在 4001～4003，H5 会继续按 partysocket 退避重连。
- 登录用户的 `auth` 未实测（需要测试账号），开发完成后在 PRE 手工验证时覆盖。

## 九、场景与预期（S1～S14，PC / H5 共用）

> 2026-11-18 按统筹 README 4.1 补建（本需求写于规范出台前）。每条场景对应到上面的目标、协议和验收标准；回归测试清单的每条用例都标注对应的 S。测试步骤见统筹目录 `需求/WebSocket消息认证__pc-NX-2133__h5-NX-2132/回归测试清单.md`。

| S | 场景 | 预期 | 对应 | PC / H5 差异 |
|---|---|---|---|---|
| S1 | 游客打开首页或直播间 | 连接地址为 `/wss/`、不带 Token；第一条消息是 `auth`（游客 Token）；收到服务端 `open`（`userType=0`）后才订阅 | 目标 1～3，验收 1、2 | 相同 |
| S2 | 登录用户打开直播间 | 同 S1，`open` 返回登录用户的 userId | 目标 1～3，验收 1、2 | 相同 |
| S3 | 在直播间收看实时消息（发言、礼物、公告、关播等） | 认证、订阅后推送正常到达，与改版前一致 | 验收 3 | 相同 |
| S4 | 进出群组、发私聊 | 打开群组时订阅、离开时退订；私聊消息在本账号的各端同步 | 验收 3 | 相同 |
| S5 | 切换直播间 | 只收到新房间的消息；新连接（如整页刷新）先认证再订阅新房间 | 验收 3 | PC 切换直播间为整页刷新 |
| S6 | 网络中断或服务端断开后恢复 | 自动重连；每条新连接先 `auth`，收到 `open` 后订阅恢复为断开前的集合，已退订的不恢复 | 验收 4 | H5 由 partysocket 退避重连，PC 约 2 秒后重连 |
| S7 | 页面切到后台、长时间停留 | 连接保持，心跳持续（PC `"heart"`、H5 借 `unsub` 的 `PING`），没有反复重连 | 验收 4 | 心跳形式不同 |
| S8 | 同一账号多个标签页、PC 与 H5 同时在线 | 每个标签页各自认证，推送都能收到 | 验收 2、3 | 相同 |
| S9 | 认证完成前 | 不发出 `sub` / `unsub` / 心跳等业务消息，不收到 `NOT-AUTHED` | 目标 3，验收 2 | H5 的心跳也在认证后才开始 |
| S10 | 登录、退出登录、游客 Token 变化 | 之后建立的新连接用当时取到的 Token 认证，`open` 返回新身份 | 验收 5 | PC 会立即重连；连接建立中（未收到 `open`）Token 变化，下次重连才生效（已知现状，第十节 D3） |
| S11 | Token 无效（服务端回 `tokenError` 并断开） | 前端按现有机制重连；Token 不变时会持续失败，与改版前一致 | 验收 4，协议「Token 错误」 | 相同 |
| S12 | 连接后未完成认证（服务端回 `authTimeout` 并断开） | 前端自动重连，新连接重新认证 | 验收 4，协议「超时」 | 相同 |
| S13 | H5 收到关闭码 4001～4003 | 停止重连（现有逻辑不变） | 验收 4 | PC 不适用 |
| S14 | 后端兼容期与安全目标 | 旧客户端（地址带 Token）在 `IM_URL_TOKEN_REJECT` 关闭期间仍可用；新前端的握手请求行在日志（ELK）中不含 Token | 目标 1，验收 7，上线约束 | 相同 |

## 十、决策记录

| D | 日期 | 决定 | 来源 |
|---|---|---|---|
| D1 | 2026-11-16 | 后端先上、前端后上；回滚前提是 `IM_URL_TOKEN_REJECT` 仍关闭 | 后端方案第 7 节 |
| D2 | 2026-11-16 | 前端只用新协议，认证失败不降级回地址带 Token | 用户确认的需求分析 |
| D3 | 2026-11-16 | PC 连接建立中 Token 变化不立即生效、Token 变空不关闭已有连接 属于改版前已有的现状，本单不改，如需修复另开单 | 技术方案 2.4 节 |
| D4 | 2026-11-16 | 游客与登录用户走同一套 `auth` 流程，`userToken` 取当前身份的 Token | PRE 探测确认游客可用（第八节） |
| D5 | 2026-11-18 | 按统筹 README 4.1 补建 S 场景（第九节），回归测试清单改为空白模板并逐条标注 S | 用户确认 Codex 补审意见 |
