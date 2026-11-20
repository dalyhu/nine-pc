# 首页播放器暂停/重试黑屏修复方案

> 关联需求：NX-2029
> 所属分支：从 feat/NX-2028 切出
> 依赖：feat/NX-2028（播放器兜底封面图，已完成）

---

## 一、问题定义

NX-2028 解决的是「iframe 应用本身还没初始化完成」这段时间的黑屏。

NX-2029 解决的是 **iframe 初始化完成之后**，画面消失时出现的黑屏，共两个场景：

| 场景 | 触发事件 | 现状 |
|---|---|---|
| **网络断流，播放器自动重试** | `liveRetry` | 外层只设 `playerUrlLoading = true`，该变量模板里未绑定任何 DOM，画面消失后无任何遮罩，纯黑屏 |
| **播放器进入暂停状态**（断流触发或用户手动） | `pause` | 直播间有暂停图覆盖；首页因 `pause_ads_wrapper` 的 `!is_index` 条件被硬性排除，暂停时纯黑屏 |

---

## 二、分支策略

从 `feat/NX-2028` 切出新分支，直接继承已有的 `playerFallbackCoverReady` 机制和兜底封面层，不重复实现。

---

## 三、场景一：liveRetry — 复用 NX-2028 的兜底层

### 触发路径

```
直播流中断 / 网络抖动
  → 播放器内核自动重试
  → 向外发出 liveRetry 事件（此时画面已消失）
  → 重试成功 → canplay 事件（画面可以播了）
```

### 为什么复用兜底层而不走暂停图

`liveRetry` 是「播放器基础设施层面不可用」的信号，对应 NX-2028 兜底层「画面不可用」的语义；暂停图对应「内容层面被暂停」。两者语义不同，分开管理，互不干扰：

- `liveRetry` → `playerFallbackCoverReady = false`（兜底层重新出现）
- `canplay` → `playerFallbackCoverReady = true`（兜底层消失）

`canplay` 已有现成逻辑，**恢复路径不需要新增任何代码**。

### 兜底层的展示特点

- 无关闭按钮
- 无倒计时
- 首页和直播间统一走同一套逻辑，不需要区分 `is_index`

---

## 四、场景二：pause — 首页开放暂停图显示

### 根本原因

`pause_ads_wrapper` 的 `v-show` 条件中带有 `!is_index`，从 2024-01-29（x9-1387）暂停图功能诞生第一天就存在，首页始终被排除。

### 修复方向

去掉 `pause_ads_wrapper` 的 `v-show` 中 `!is_index` 的限制，让首页在收到 `pause` 事件时也能展示暂停图，收到 `play` 事件时隐藏。

### 首页暂停图的交互细节

通过代码确认，首页暂停图：

**不显示关闭按钮**：直播间关闭按钮的条件是 `v-if="!firstShowPauseAds"`，暂停阶段 `firstShowPauseAds = false`，按钮会出现。首页不应暴露此控件（首页操作入口只有「进入直播间」和「取消静音」），需在关闭按钮条件上补加 `!is_index`：

```
关闭按钮显示条件：!firstShowPauseAds && !is_index
```

**不显示倒计时**：倒计时触发路径为 `videoAdOnload` → `imgLoadState = true`，`videoAdOnload` 内有守卫条件 `coverSource` 必须是 `loading-*` 才往下走。首页因为长期被 `!is_index` 排除，`coverSource` 从未被赋值为 `loading-*`，守卫条件不满足，倒计时天然不会出现。

**暂停图与首次加载阶段不叠加**：去掉 `!is_index` 后，`pause_ads_wrapper` 的另一个条件 `loadingAdReady || !firstShowPauseAds` 在首次加载阶段：`loadingAdReady = false`，`firstShowPauseAds = true`（初始值），整体为 `false`，暂停图不显示。首次加载由 NX-2028 兜底层独立承担，两者不会错误叠加。

### 层级关系（不改动）

```
.iframe-container    z-index: 0
.player_fallback_cover       z-index: 1   NX-2028 兜底层
.mute_btn（取消静音）       z-index: 1
进入直播间按钮     z-index: 99  （不改动）
.pause_ads_wrapper   z-index: 101 ← 首页 NX-2029 开放
.pause_ads_wrapper.first_show z-index: 102
```

「进入直播间」按钮（z-index: 99）在暂停图（z-index: 101）下方，暂停时按钮被遮挡。本次不改动层级，作为后续独立问题处理。

---

## 五、兜底封面图优先级调整

`playerFallbackCoverReady = false` 时显示的图，按 `iframeEverReady` 分两条路：

### 新增标志位 `iframeEverReady`

- 初始值：`false`
- 收到 `playerIframeOnload` 时：`true`
- **永远不重置**，`liveRetry` 不动它
- 作用：区分「iframe 从未就绪过」和「iframe 曾经就绪过、现在是重试」两个阶段

### 初始阶段（`iframeEverReady = false`）

与 `applyLoadingCover` 保持一致（修正 NX-2028 遗漏的 021 广告图）：

```
021 广告图（playerLoadingAd.img_address）
  → 系统配置加载图（loadingCoverScreenUrl）
  → 本地默认图（/static/images/pause_ads.jpg?r=2）
```

### liveRetry 阶段（`iframeEverReady = true`）

优先展示当前直播封面，比全站通用图更贴合当前内容：

```
info.thumb 不为空时拼接完整 URL（逻辑同 videoPreviewPic）
  → 系统配置加载图（loadingCoverScreenUrl）
  → 本地默认图（/static/images/pause_ads.jpg?r=2）
```

> `info.thumb` 为空时直接跳过，不拼出错误 URL，降级到系统配置图。
>
> 021 广告图不纳入此优先级：liveRetry 阶段 iframe 已就绪，广告图语义是「初始加载」，不适合在重试期间展示。

### thumb 的处理

`videoPreviewPic` 是 `computePlayerUrl` 方法内的局部变量，其拼接逻辑为：

```
info.thumb 以 http 开头 → 直接使用
info.thumb 是相对路径   → 拼上 location.origin（localhost 时用 http://10.83.222.100）
info.thumb 为空     → 降级到下一优先级
```

**不新增 data 字段，不修改 `computePlayerUrl`。**

`fallbackCoverUrl` computed 可直接访问 `this.info?.thumb`，在 computed 内部复用相同的拼接逻辑即可，保证两处逻辑始终一致，不会出现因维护两份而不同步的问题。

`info.thumb` 为空时，跳过直接降级到系统配置图，不拼接出错误 URL。

---

## 六、改动清单

**仅修改一个文件：`src/views/anchor/live-player-iframe.vue`**

### 新增 data 字段

| 字段 | 初始值 | 说明 |
|---|---|---|
| `iframeEverReady` | `false` | iframe 完成过初始化后置 true，永不重置；用于区分兜底封面图优先级 |

`computePlayerUrl` 不需要改动。

### fallbackCoverUrl computed

按 `iframeEverReady` 分两条优先级路径（见第五节）。

> `playerLoadingAd` 由 `getPlayerAds()` 异步加载，广告接口回来前为 `null`。`fallbackCoverUrl` 是 computed，Vue 响应式会在 `playerLoadingAd` 变化时自动更新，广告图到位后自动切换，无需手动处理。

### playerIframeOnload case

新增 `this.iframeEverReady = true`（只升不降）。

### liveRetry case

新增 `this.playerFallbackCoverReady = false`，兜底层重新出现。

### pause_ads_wrapper 的 v-show 条件

去掉 `!is_index`，首页开放暂停图显示。

### 关闭按钮的 v-if 条件

补加 `&& !is_index`，首页暂停时不显示关闭按钮。

---

## 七、不改动的内容

| 内容 | 说明 |
|---|---|
| iframe 点击交互 | 首页保持可操作播放器暂停/播放，不拦截 |
| 层级关系 | 进入直播间按钮、取消静音按钮 z-index 不变 |
| `applyLoadingCover / applyPauseCover` | 广告逻辑不动 |
| `videoAdCountdown` 倒计时 | 不动 |
| `canplay` 恢复逻辑 | 天然覆盖 liveRetry 恢复路径，无需新增 |
| `live.vue`、`main/index.vue` | 不动 |
| store、接口、路由 | 不动 |

---

## 八、不在本次范围内的问题

| 问题 | 说明 |
|---|---|
| 人为暂停 + liveRetry 叠加后播放器自动续播 | iframe 内核行为，外层无法区分，后续独立处理 |
| 进入直播间按钮被暂停图遮挡 | 层级调整后续独立处理 |
| 取消静音按钮被暂停图遮挡 | 同上 |
