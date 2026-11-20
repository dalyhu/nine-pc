# 首页 HLS 黑屏 — 播放器错误恢复不必要重建问题 方案

> 文档时间：2026-09-15（2026-09-14 初版，2026-09-15 更新：目标升级为零黑屏）
> 涉及项目：`x9-web-video-player`（播放器）、`x9-web-pc`（PC 宿主）
> 涉及文件：
> - `x9-web-video-player/src/assets/js/index.js`
> - `x9-web-pc/src/views/anchor/live-player-iframe.vue`

---

## 一、问题现象

PC 首页播放器（HLS）在无主播断流的情况下，出现：

- 画面黑屏并进入 loading
- 播放时间从当前值归零
- Blob 地址变化（播放器实例被重建）
- 约 12～15 秒后恢复播放，但从头开始

**同时间段直播间 FLV 全程正常**，主播推流源本身未中断。

---

## 二、根因分析

### 2.1 物理链路

```
首页 HLS (.m3u8)     ←── 签名过期 → 连续 403
直播间 FLV (.flv)    ←── 长连接 200，持续正常
```

线上抓包：`txTime=6AA56961` 解码为 `2026-09-12 15:01:53 UTC`，签名过期后
m3u8 清单持续 403，共连续记录 16 次，未自行恢复。

### 2.2 前端触发链路（原始）

```
HLS 403（签名过期）
  → xgplayer 触发 error 事件
  → index.js player.on("error")，liveRetry=0 < 1
  → reloadPlayer()  ← 第一次黑屏，用的是旧（过期）URL
      · player.destroy()
      · document.querySelector("#mse").remove()
      · new div#mse
      · playerInit()（旧 URL）
  → 新实例加载旧过期 URL → 再次 error，liveRetry=1
  → handlePostMessage({ event: "error" })  ← 第二次才通知外层
  → live-player-iframe.vue 收到 error
  → getLatestRoomInfo()，setTimeout 10s 后发接口请求
  → 拿到新 URL → postMessage({ event: "switchVideoSrc" })
  → switchVideoSrcHandler() → reloadPlayer()  ← 第二次黑屏，用新 URL
  → canplay → 恢复，但 currentTime=0
```

**三个核心问题：**

1. **第一次 error 立即重建，用的还是旧（过期）URL**：注定失败，是一次无效重建，白白黑屏一次。
2. **第二次通知外层后，外层 setTimeout 等了 10s** 才发接口请求：拿到新 URL 再重建，又黑屏一次。
3. **换源时走 `reloadPlayer` 销毁重建 DOM**：同类型 HLS 换源根本不需要重建实例，xgplayer v3 原生支持 `switchURL` 直接换源，不黑屏。

用户体验：**两次黑屏，总耗时约 12～15s**。

### 2.3 关于 iframe 节点

外层 `<iframe v-if="initPlayer">` **从未被重建**（`live-player-iframe.vue`
中 `initPlayer` 在 error 路径下没有置 false）。黑屏完全由 **iframe 内部**
的 `reloadPlayer()` 对 `#mse` DOM 摘除重建引起，这是 iframe 内部的播放器实例级重建。

### 2.4 关键代码证据

```js
// index.js — reloadPlayer 做了什么
function reloadPlayer() {
  if (player.destroy) { player.destroy(); } else { player.dispose(); }
  document.querySelector("#mse").remove();   // ← #mse DOM 被物理移除 → 黑屏
  let playEl = document.createElement("div");
  playEl.id = "mse";
  playerInit();   // ← 用当前 pageData.url（可能是旧过期地址）重建
}

// index.js — 第一次 error 立即用旧 URL 重建
player.on("error", (e) => {
  if (liveRetry < 1) {
    liveRetry++;
    reloadPlayer();   // ← 旧 URL，必然再次失败
    return;
  }
  handlePostMessage({ event: "error" });  // 第二次才告知外层
});

// index.js — 收到新 URL 也走重建
function switchVideoSrcHandler(urlList) {
  // switchURL 曾被尝试但有问题，已注释弃用：
  // "switchURL 切换视频源会整个播放器iframe刷新。。是因为触发emptied事件？？"
  // 注：该问题只在 v2 版本存在（v2 误触发 location.reload()）
  //     v3 的 switchURL 不存在此问题，可以安全使用
  reloadPlayer();
}
```

> **关于旧注释「switchURL 会整个 iframe 刷新」**：
> 经过源码分析，该问题只发生在 v2 版本——v2 的 `reloadPlayerHandler` 会走
> `location.reload()` 导致整个 iframe 刷新。xgplayer **v3 的 `switchURL`
> 不触发 `location.reload()`**，且内置 `seamless` 无缝切换支持，可以安全使用。

---

## 三、方案设计

### 3.1 目标：零黑屏

```
原始（2次黑屏，12～15s）：
  error → reloadPlayer(旧URL，失败) → error → 等10s → reloadPlayer(新URL)

最终方案（0次黑屏，约1～2s）：
  error → 通知外层请求新URL（300ms内发接口）→ 收到新URL → switchURL(新URL)
   ↑ 不销毁DOM，不黑屏
```

### 3.2 两步改动

**第一步（已实现）**：把 `error` 首次的无效重建改为向外层请求新 URL

```
播放器 → 外层：postMessage({ event: "requestNewUrl" })
外层   → 接口取新 URL（300ms 内发出）→ postMessage({ event: "switchVideoSrc", urlList })
播放器 → 收到新 URL → switchVideoSrcHandler
```

**第二步（本次新增）**：把 `switchVideoSrcHandler` 里的 `reloadPlayer` 换为 `switchURL`

```
switchVideoSrcHandler（v3 + HLS）
  → player.switchURL(新URL, { seamless: true })   ← 不重建实例，不移除DOM，不黑屏
  → canplay → 恢复播放

switchVideoSrcHandler（v2 / FLV / MP4）
  → reloadPlayer()   ← 保持原有逻辑，完全不变
```

**降级保障**（兼容老接入方）：外层若 4s 内未响应 `requestNewUrl`，播放器自动
fallback 到原有 `reloadPlayer(旧URL)`，行为与修改前一致（此时会有1次黑屏，属降级场景）。

### 3.3 场景对照表

| 场景 | 最终方案行为 | 原始行为 |
|---|---|---|
| HLS error 首次 | 请求外层新 URL，等响应（不重建） | 立即 `reloadPlayer(旧URL)`（黑屏） |
| 外层下发新 URL（v3 HLS） | `switchURL(新URL)` — **不黑屏** | `reloadPlayer(新URL)`（黑屏） |
| 外层下发新 URL（v2 / FLV / MP4） | `reloadPlayer(新URL)`（1次黑屏，同原来） | 同左 |
| 外层 4s 内未响应（老接入方降级） | `reloadPlayer(旧URL)` — 与现在完全一致 | — |
| HLS error 第二次（liveRetry≥1） | 不变，直接上报 error 给外层 | — |
| 持续 403（新URL也无效） | `switchURL` 不断换源，全程不黑屏，30次后展示错误UI | 每次重建黑屏，约6分钟后展示错误UI |
| 主播真的关播 | 不变，`initPlayer=false`，iframe 卸载 | — |
| 直播间 FLV | 不涉及，`mediaType=flv` 场景逻辑不变 | — |

---

## 四、改动细节

### 4.1 播放器项目（`x9-web-video-player/src/assets/js/index.js`）

#### 4.1.1 `pageData` 增加字段

```js
let pageData = {
  // ... 原有字段不变 ...
  requestNewUrlFallbackTimer: null,  // 新增：请求新 URL 的降级定时器
};
```

#### 4.1.2 `player.on("error")` 改动

```js
player.on("error", (e) => {
  pageData.playError = true;
  if (!pageData.setRegisterBtnSuccess) window.clearInterval(pageData.setRegisterInterval);

  if (liveRetry < 1) {
    liveRetry++;
    storage.setItem("liveRetry", liveRetry);
  console.log(`xgplayer 失败重载第${liveRetry}次 - 请求外层刷新 URL`);

    handlePostMessage({ messageType: "controlIframe", event: "liveRetry" }, "*");

    // 【新增】通知外层请求新 URL，不立即 reloadPlayer
    handlePostMessage(
      { messageType: "controlIframe", event: "requestNewUrl", data: { reason: "error" } },
      "*"
    );

    // 【新增】降级保障：外层 4s 内未响应则走原有 reloadPlayer（兼容老接入方）
    pageData.requestNewUrlFallbackTimer = setTimeout(() => {
      if (!pageData.playError) return;
      console.log("====log: 外层未响应 requestNewUrl，降级 reloadPlayer");
    playerVer === "v3" ? reloadPlayer() : location.reload();
    }, 4000);

    return; // 不立即 reload，等外层响应
  }

  // 超过重试次数，上报外层
  storage.removeItem("liveRetry");
  let errorObj = JSON.parse(JSON.stringify(e));
  errorObj.error_text = "当前观看网络不佳，请刷新后继续观看";
  errorObj.requestTimeInterval = 10000;
  errorObj.requestTimesLimit = pageData.requestTimesLimit;
  handlePostMessage({ messageType: "controlIframe", event: "error", data: errorObj }, "*");
});
```

#### 4.1.3 `switchVideoSrcHandler` 改动（本次核心新增）

```js
function switchVideoSrcHandler(urlList) {
  // 清除降级定时器（外层已响应）
  if (pageData.requestNewUrlFallbackTimer) {
    clearTimeout(pageData.requestNewUrlFallbackTimer);
    pageData.requestNewUrlFallbackTimer = null;
  }

  if (pageData.isDebuggerMode) {
    if (v_src) pageData.url = v_src;
    reloadPlayer();
    return;
  }

  if (hideClarity === "1") {
    s_url = decodeURIComponent(urlList.s_url);
  pageData.url = s_url;
  } else {
    s_url = decodeURIComponent(urlList.s_url);
    h_url = decodeURIComponent(urlList.h_url);
    pageData.url = Number(login) > 0 ? h_url : s_url;
  }

  // 重置错误状态
  pageData.playError = false;
  liveRetry = 0;
  storage.removeItem("liveRetry");

  // 【新增】v3 HLS：直接换源，不重建实例，不黑屏
  // xgplayer v3 的 switchURL 不触发 location.reload()，旧注释的问题仅在 v2 存在
  if (playerVer === "v3" && pageData.mediaType === "m3u8" && player && player.switchURL) {
    player.switchURL(pageData.url, { seamless: true });
    return;
  }

  reloadPlayer(); // v2 / FLV / MP4 保持原有重建逻辑
}
```

#### 4.1.4 `player.on("canplay")` 增加重置

```js
player.on("canplay", () => {
  // ... 原有逻辑完全不变 ...

  // 【新增】成功播放后清理重试状态和降级定时器
  liveRetry = 0;
  storage.removeItem("liveRetry");
  pageData.playError = false;
  if (pageData.requestNewUrlFallbackTimer) {
    clearTimeout(pageData.requestNewUrlFallbackTimer);
    pageData.requestNewUrlFallbackTimer = null;
  }
});
```

---

### 4.2 PC 宿主项目（`x9-web-pc/src/views/anchor/live-player-iframe.vue`）

在 `listenIframe()` 的 `switch (event)` 中增加 `requestNewUrl` 分支：

```js
case "requestNewUrl": {
  // 播放器 error 首次发生，请求外层快速刷新 URL
  // 必须在播放器 4s 降级定时器触发前完成接口响应，所以临时设 300ms 延迟
  this.resetLiveErrorHandler();
  this.endConfirm = false;
  const savedInterval = this.liveErrorConfig.requestTimeInterval;
  this.liveErrorConfig.requestTimeInterval = 300;
  this.getLatestRoomInfo({ event: "requestNewUrl", data: { error_text: "" } });
  this.liveErrorConfig.requestTimeInterval = savedInterval;
  break;
}
```

---

## 五、时序图（最终方案）

```
播放器（iframe 内部）        外层 live-player-iframe.vue
        │         │
HLS 403 │                │
 error  │──── postMessage(requestNewUrl) ────▶│
liveRetry=0resetLiveErrorHandler()
[启动 4s 降级定时器]    requestTimeInterval=300ms
  │         getLatestRoomInfo()
        │      │
        │      约 300ms 后发 getRoomInfo 接口
        │        │
        │      ←── API 响应（约 500ms）
        ││
  │◀─── postMessage(switchVideoSrc) ────│
        │      │
[清除 4s 降级定时器]            │
 pageData.url = 新URL  │
 liveRetry=0, playError=false  │
 player.switchURL(新URL)  ← 不黑屏     │
        │    │
   canplay │──── postMessage(canplay) ───▶│
        │           isError=false, loading=false

总耗时：约 1～2s（原来 12～15s），黑屏次数：0次（原来 2次）
```

---

## 六、降级场景时序（兼容老接入方）

```
播放器（iframe 内部）              老接入方（无 requestNewUrl 消费）
        │     │
 error  │──── postMessage(requestNewUrl) ────▶│（忽略，不处理）
   │ │
    [4s 降级定时器等待中...]          │
  │         │
  4s 后定时器触发      │
  reloadPlayer(旧URL)  ← 与现在行为完全相同
        │     │
 error  │──── postMessage(error) ────────▶│
        │        getLatestRoomInfo（原有 10s 延迟流程）
```

老接入方最终行为与当前完全一致，无兼容风险。

---

## 七、为什么 switchURL 之前被废弃，现在可以用

| | v2（旧版） | v3（当前） |
|---|---|---|
| `switchURL` 内部实现 | 触发某路径导致 `location.reload()` | 直接 `this.src = newUrl`，Promise 回调 |
| `emptied` 事件处理 | 关联了 iframe 级刷新逻辑 | 仅作为普通事件定义，不触发 reload |
| HLS 插件 `switchURL` | 无 seamless 支持 | 内置 `seamless: true` 无缝切换 |
| 结论 | ❌ 不可用 | ✅ 可以安全使用 |

旧注释 `"switchURL 切换视频源会整个播放器iframe刷新"` 描述的是 v2 的行为，v3 已无此问题。

---

## 八、待验证项

| 编号 | 验证点 | 验证方法 |
|---|---|---|
| V1 | v3 HLS `switchURL` 换源后画面正常恢复、无黑屏 | DevTools Network 阻断 `.m3u8` 请求 ~13s，观察恢复过程 |
| V2 | `seamless` 模式在当前 xgplayer-v3.0.1-hls 版本下可用 | 同上，观察切换时是否无缝或仅有 loading |
| V3 | 多页签同时触发 `requestNewUrl` 各自独立恢复，不互相干扰 | 同时打开两个首页页签，同时阻断 HLS 请求 |
| V4 | 4s 降级定时器与外层响应竞态（极端慢网接口 >4s） | DevTools 将接口限速到 3G，观察 fallback 后不进入无限循环 |
| V5 | v2 / FLV / MP4 路径完全不受影响 | 切换到对应播放器类型验证 |

---

## 九、不改动的部分

- `live-player-iframe.vue` 中 `error` 事件的已有处理逻辑**完全不变**
- `getLatestRoomInfo` 内部逻辑**完全不变**
- `handleLiveClosed`、`initPlayer=false` 的关播路径**完全不变**
- 阿里播放器、DPlayer 路径**完全不变**
- v2 / FLV / MP4 的 `reloadPlayer` 路径**完全不变**

---

## 十、实施步骤

1. `x9-web-video-player` 在 `fix/bug` 分支按 §4.1 完成全部 4 处改动
   - §4.1.1 `pageData.requestNewUrlFallbackTimer`（已完成）
   - §4.1.2 `player.on("error")`（已完成）
 - §4.1.3 `switchVideoSrcHandler` 新增 `switchURL` 分支（**本次新增**）
   - §4.1.4 `player.on("canplay")` 重置（已完成）
2. 构建，部署到测试环境
3. `x9-web-pc` 在 `feat/NX-2009` 按 §4.2 修改 `live-player-iframe.vue`（已完成）
4. 联调验证 V1～V5
5. 验证通过后按正常发布流程合并上线
