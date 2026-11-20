# 【PC】WebSocket 认证改为连接建立后通过消息提交 Token — 技术方案

需求与协议见 [WebSocket消息认证-NX-2133-需求文档.md](./WebSocket消息认证-NX-2133-需求文档.md)。

> 2026-11-16 经 Codex（只读审查）审过一轮，修订内容见第七节。

## 一、现状（`main` = `965b7d8f`）

| 文件 | 作用 |
|---|---|
| `src/utils/im/index.js` | 主线程 `IM`：从 `store.getters.token` 取 Token（登录用户优先，否则游客），`postMessage({action:'connect', data:{token, protocol, host}})` 交给 Worker；`IM.isReady()` 等到 `CONNECTED` 才 resolve |
| `src/utils/im/ws-worker.js` | Worker：转发 `connect` / `subscribe` / `unsubscribe` / `destroy`；`allowEvents` 过滤后把消息发回主线程 |
| `src/utils/im/wsHelper.js` | 原生 `WebSocket` 封装，第 116 行：`new WebSocket(\`${protocol}://${host}/wss/?userToken=${token}\`)` |

### 1.1 进入「已连接」的时机

PC **只在收到服务端 `{action:'open'}` 帧时**调用 `handleOpen()` 进入 `CONNECTED`（`wsHelper.js:82-86`），没有绑定 `onopen`。心跳 `heart()` 也在 `handleOpen()` 里启动。所以「先认证、后 `open`」之后，`CONNECTED` 和心跳都天然排在认证成功之后，状态机不用改。

### 1.2 订阅与重放

- 首次进入直播间：`chatDetail/index.vue:483-486` 先 `await IM.isReady()` 再 `IM.subscribe(vid)`。
- 重连后的重放：`index.js:102-104` 里的 `IM.vids.forEach((item) => IM.subscribe(item))` **实际不会发出任何订阅**，因为 `IM.subscribe()` 第 21 行会拒绝已在 `IM.vids` 里的 vid。真正起作用的是紧接着发出的 `reconnected` 事件：`chatDetail/index.vue:608-613` 收到后 `await IM.isReady()`，再直接 `IM.worker.postMessage({action:'subscribe'})` 逐个重发。这条路径同样在 `CONNECTED`（即认证成功）之后。
- `IM.subscribe()` / `IM.unsubscribe()`、`ws-worker.js:90-95`、`wsHelper.send()` 本身都**不检查状态**，只靠调用方自觉等待。

### 1.3 重连路径

都会走 `wsHelper.connect()` → `destroy()` → 新建 `WebSocket`：
- `IM.handleStateChange`：`ERROR` / `CLOSE` 2 秒后重连；`TIMEOUT` / `HEART_TIMEOUT` 立即重连；
- Token 变化：`App.vue:117`（跨标签页 `visitorInfo` 变化）、`store/index.js:239`（游客 Token 变化）、`request-o.js:36`（接口返回 `connection token error`）；
- 退出登录：`store/index.js:395` 调 `IM.destroy()`，随后整页跳转。

## 二、改动

### 2.1 新增 `src/utils/im/wsAuth.js`（纯函数，不依赖别名，便于测试）

```js
// 握手地址不带任何凭证（NX-2131 / NX-2133）
export function buildWsUrl({ protocol, host }) {
  return `${protocol}://${host}/wss/`
}

// 连接建立后的第一条消息
export function buildAuthFrame(token) {
  return JSON.stringify({ action: 'auth', userToken: token })
}
```

### 2.2 修改 `src/utils/im/wsHelper.js`

1. **地址去掉 Token，`onopen` 发送认证**（`connect()` 内）：

   ```js
   const { token, protocol, host } = this.config

   if (this.STATUS !== IM_STATUS.CONNECTED) {
     const ws = new WebSocket(buildWsUrl({ protocol, host }))
     // 绑定在本次创建的实例上：Token 只会发给这条连接
     ws.onopen = () => {
       try {
         ws.send(buildAuthFrame(token))
       } catch (error) {
         console.error(error)
       }
     }
     this.instance = ws
   }
   ```

2. **认证成功前不发业务消息（发送门槛）**：`send()` 只在 `this.STATUS === IM_STATUS.CONNECTED`（即已收到 `open` 帧）时发送，否则丢弃并在开发环境打印提示。

   ```js
   static send(data) {
     if (this.STATUS !== IM_STATUS.CONNECTED) return
     this.instance?.send(JSON.stringify(data))
   }
   ```

   丢掉的订阅不会丢失：首次连接时业务层在 `CONNECTED` 之后才订阅；重连时由 `chatDetail` 的 `reconnected` 处理统一重发（1.2 节）。退订在未认证的连接上本来就没有意义。心跳不走 `send()`，但它只在 `handleOpen()` 之后启动，同样在认证之后。

3. **`destroy()` 补上 `this.instance.onopen = null`**（原来是注释掉的）：被销毁的旧实例即使之后才触发 `open`，也不会再发送 `auth`。

### 2.3 认证失败与超时

不新增处理逻辑，复用现有链路：

| 服务端行为 | 前端现有处理 |
|---|---|
| `tokenError` 后断开 | `tokenError` 在 `allowEvents` 里，主线程转为 `ERROR` → 2 秒后重连；随后 `onclose` → `CLOSE`，`delayConnect` 有防重 |
| `channelError` / `authTimeout` 后断开 | 消息被 `allowEvents` 丢弃；`onclose` → `CLOSE` → 2 秒后重连 |
| 连接迟迟没有 `open` 帧 | 现有 40 秒 `MAX_CONNECTING_TIME` → `TIMEOUT` → 重连（服务端 10 秒就会断开，通常先走 `CLOSE`） |

说明：Token 本身无效时，重连仍用同一个 Token，只会不断收到 `tokenError`，直到 Token 变化触发 `IM.connect()`。这与现在地址带 Token 时的行为一致，本单不改。

### 2.4 不改的部分（现状问题，记录在案）

| 现象 | 位置 | 说明 |
|---|---|---|
| 连接建立中（`CONNECTING`）Token 变化，新 Token 不生效 | `index.js:53` 在 `CONNECTING` 时直接返回 | 现在地址带 Token 也一样；旧连接认证成功后仍是旧身份，直到下次重连 |
| Token 变空时不会关闭已有连接 | `index.js:59-63` 只改状态、不通知 Worker | 退出登录另有 `IM.destroy()` 并整页跳转，实际影响小 |
| `index.js:103` 的内置重放是空操作 | 见 1.2 节 | 有 `chatDetail` 兜底，不影响结果 |

这几处改成消息认证前后行为不变，不在本单处理；如需修复另开单。

## 三、测试

### 3.1 单元测试（`node --test`，已在 `package.json` 的 `test` 脚本里）

**`src/utils/im/wsAuth.test.js`：**
1. `buildWsUrl` 结果不含 `?`、`token`。
2. `buildAuthFrame('t1')` 解析后正好是 `{action:'auth', userToken:'t1'}`。

**`src/utils/im/wsHelper.test.js`（行为测试）：** 用 `node:module` 的 `register()` 钩子把 `@/enums` 映射到测试替身，并用假的 `WebSocket` 类手动触发 `open` / `message` / `close`：
1. 新建连接的地址是 `/wss/`；原生 `open` 后第一条且唯一一条发出的消息是 `auth`，Token 是本次 `connect` 传入的。
2. 原生 `open` 后、收到服务端 `open` 帧前：状态不是 `CONNECTED`；调用 `send({action:'sub'})` 不会发出任何帧；没有心跳。
3. 收到 `open` 帧后：状态 `CONNECTED`；`send` 正常发出；心跳计时开始。
4. 再次 `connect`（新 Token）：旧实例被关闭且 `onopen` 已清空，旧实例迟到的 `open` 不发任何消息；新实例用新 Token 认证。
5. `destroy()` 后，实例迟到的 `open` 不发任何消息。
6. 收到 `tokenError` / 关闭事件时，状态变化与现在一致（`ERROR` / `CLOSE`）。

### 3.2 PRE 手工验证（后端 `bug/nx-2131` 部署 PRE 之后）

登录用户、游客各做一遍：

| # | 操作 | 预期 |
|---|---|---|
| 1 | 进入直播间，看开发者工具 WS | 地址 `/wss/`，无 `userToken`；帧顺序 `auth` → `open` → `sub` |
| 2 | 另一账号在该房间发言 | 能收到 |
| 3 | 切换直播间 | 旧房间 `unsub`、新房间 `sub`，消息正常 |
| 4 | 断网 10 秒后恢复 | 新连接先发 `auth`，收到 `open` 后重发订阅，消息恢复 |
| 5 | 游客状态下登录（连接已建立） | 触发重连后新连接的 `open` 帧 `info.userId` 是登录用户 |
| 6 | 全程 | 没有 `NOT-AUTHED`、`ALREADY-AUTHED` |
| 7 | ELK 查 `logstash-x9-pre-proxy-*` 的 `/wss` 请求行 | 新连接不含 Token |

### 3.3 回归

`npm test`、构建，以及项目现有的兼容检测。

## 四、上线

- **后端先上并验证，前端后上。** 每个环境合入前，先按需求文档第六节确认后端已支持。

## 五、回滚

- 前端回滚的前提：该环境后端的 `IM_URL_TOKEN_REJECT` **仍是关闭**（旧的地址带 Token 方式还能用）。如果已经打开，要先请后端关掉开关并重启 IM，确认旧方式能连上，再回滚前端。
- 后端如果回滚（不认 `auth` 消息），前端必须同时回滚。

## 六、改动文件

| 文件 | 改动 |
|---|---|
| `src/utils/im/wsAuth.js` | 新增 |
| `src/utils/im/wsAuth.test.js` | 新增 |
| `src/utils/im/wsHelper.test.js` | 新增 |
| `src/utils/im/wsHelper.js` | 地址去掉 Token；`onopen` 发送 `auth`；`send()` 加认证门槛；`destroy()` 清 `onopen` |

与进行中的其他需求分支（NX-2124、NX-2091）无文件重叠（2026-11-16 用 `git diff origin/main...<分支> --name-only` 核对，两者都没有改 `src/utils/im/`）。

## 七、审查记录

2026-11-16 Codex 只读审查（请求模型 `gpt-6.1-sol`，宿主未回报实际模型），7 条发现的处理：

| 发现 | 处理 |
|---|---|
| P1 重连重放被 `IM.subscribe` 去重挡掉 | 部分成立：内置重放确实是空操作，但 `chatDetail/index.vue:608-613` 会重发订阅，实际有效。已改 1.2 节描述，列入 2.4 节 |
| P1 缺少认证前的业务发送门槛 | 采纳：2.2 节第 2 条加 `send()` 门槛 |
| P1 `CONNECTING` 期间 Token 变化不生效 | 成立，但是现状问题，改造前后行为一致：列入 2.4 节，不在本单处理 |
| P2 空 Token 不关闭已有连接 | 同上，列入 2.4 节 |
| P2「发 auth 后收到 tokenError」不能证明后端已部署 | 采纳：需求文档第六节改为「不发 auth、只看服务端反应」 |
| P2 回滚遗漏 `IM_URL_TOKEN_REJECT` 前提 | 采纳：第五节 |
| P2 测试没有覆盖时序与边界 | 采纳：3.1 节加行为测试 |
