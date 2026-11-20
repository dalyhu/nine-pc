# 播放器兜底封面图方案

> 关联需求：首页及直播间 iframe 播放器加载期间黑屏问题
> 所属分支：feat/NX-2028

---

## 一、问题定义

### 黑屏产生的两个阶段

| 阶段 | 状态 | 现象 |
|---|---|---|
| **阶段 1** | `initPlayer = false` | `computePlayerUrl()` 内 `batchPing` 最长等 5 秒才选出最快 CDN，`<iframe>` 标签尚未挂载，`player_container` 裸露 `background: #14092a` |
| **阶段 2** | `initPlayer = true` 但未收到 `playerIframeOnload` | `<iframe>` 标签已挂载但内部页面仍在下载/执行，iframe 自身背景覆盖容器 |

### 首页尤为严重的原因

`pause_ads_wrapper`（启动加载图/3-2-1 倒计时）的显示条件带有 `!is_index`：

```html
<!-- live-player-iframe.vue -->
<div class="pause_ads_wrapper"
  v-show="isShowPauseAds && !is_index && (loadingAdReady || !firstShowPauseAds)">
```

首页（`query.type === 'main'`，即 `is_index = true`）时，宿主侧的启动加载图**完全不渲染**，
从进入首页到 iframe 就绪全程黑屏，没有任何过渡。直播间因为有启动图（`first_show` 状态）托底，相对好一些。

---

## 二、功能命名

| 命名 | 说明 |
|---|---|
| 功能名 | **播放器兜底封面图** |
| 变量名 | `playerFallbackCoverReady`（布尔，iframe 就绪后置 true） |
| CSS class | `.player_fallback_cover` |

> "背景色兜底"描述的是颜色，实际要用图片填充，"兜底封面图"更准确；"fallback cover"是业界通用叫法。

---

## 三、层级设计（z-index 全景）

```
player_container  (position: relative)
│
├── .iframe-container       z-index: 0    现有 iframe
├── .player_fallback_cover         z-index: 1    ← 新增，紧贴 iframe 上方
├── .anchor-live-player-no-video   z-index: 1    关播/错误提示（与兜底层平级，依 DOM 顺序后者优先）
├── .danmu-container   z-index: 99   弹幕层
├── 进入直播间按钮           z-index: 99
├── .pause_ads_wrapperz-index: 101  暂停广告
└── .pause_ads_wrapper.first_show  z-index: 102  启动加载图（3-2-1 倒计时）← 不受影响
```

**关键点：**
- 兜底封面 z-index: 1，低于 `pause_ads_wrapper`（101）和 `first_show`（102）
- 直播间进入时，启动加载图（z-index 102）始终盖在兜底层之上，视觉上兜底层在此阶段不可见，业务逻辑零干扰
- 首页无启动加载图，兜底层独自承担直到 iframe 就绪

---

## 四、图片来源

**不引入新接口请求**，按优先级复用现有数据：

| 优先级 | 来源 | 说明 |
|---|---|---|
| 1 | `store.state.system.loadingCoverScreenUrl` | 系统配置的加载封面，与直播间启动图（3-2-1倒计时）同一字段 |
| 2 | `/static/images/pause_ads.jpg?r=2` | 本地兜底图，已有文件，零成本 |

与现有广告请求（`ad_id=021`）完全解耦，不参与 `applyLoadingCover / finalizeLoadingCover` 流程。

---

## 五、显示/消失时机

| 时机 | 兜底封面层状态 |
|---|---|
| 组件创建（`initPlayer = false`） | **显示**（`playerFallbackCoverReady = false`） |
| `computePlayerUrl` 完成，iframe 挂载 | **显示**（iframe 自身黑色，兜底层继续覆盖） |
| 收到 `playerIframeOnload` postMessage | **渐隐（opacity 0, transition 0.3s）→ 完全隐藏** |
| 后续 `canplay` / 播放中 / 暂停 | 已隐藏，不再介入 |
| 页面重新可见触发刷新播放器（`playerUrlLoading = true`） | **不重置兜底层**，避免重复闪烁（iframe 重载时已有内容占位） |

---

## 六、实现范围

**仅修改一个文件：`src/views/anchor/live-player-iframe.vue`**

### 改动清单

1. **新增响应式变量**（`data()`）
   ```js
   playerFallbackCoverReady: false,  // iframe 首次就绪后置 true，之后永不重置
   ```

2. **新增计算属性**
   ```js
 fallbackCoverUrl() {
     return this.$store.state.system.loadingCoverScreenUrl
       || '/static/images/pause_ads.jpg?r=2'
 }
```

3. **模板**：在 `<iframe>` 与 `<div class="pause_ads_wrapper">` 之间插入兜底层
   ```html
   <!-- 播放器兜底封面图：iframe 未就绪时防黑屏，z-index 低于启动加载图（102），不遮挡现有业务 -->
   <div
     v-if="!playerFallbackCoverReady"
     class="player_fallback_cover"
     :style="{ backgroundImage: `url(${fallbackCoverUrl})` }"
   />
   ```
> 使用 `v-if` 而非 `v-show`：就绪后直接销毁节点，避免常驻内存

4. **`listenIframe` 的 `playerIframeOnload` case**
   ```js
   case 'playerIframeOnload':
  this.sendHistoryMessage()
     this.playerUrlLoading = false
     this.isError = false
     this.playerFallbackCoverReady = true   // ← 新增，触发兜底层消失
     break
   ```

5. **SCSS**（追加到 `.player_container` 内）
   ```scss
   .player_fallback_cover {
     position: absolute;
     top: 0;
     left: 0;
width: 100%;
   height: 100%;
     z-index: 1;
     background-color: #14092a;      // 图片未加载时的颜色兜底（与容器背景一致，无差异）
 background-size: cover;
     background-position: center;
     background-repeat: no-repeat;
   }
   ```
   > 消失动画：用 `v-if` + CSS `animation` 配合 Vue `<transition>` 实现 0.3s 淡出（实现时确认是否需要）

---

## 七、不改动的内容（确认边界）

- `pause_ads_wrapper` 及其 `!is_index` 条件：**不动**
- `applyLoadingCover / finalizeLoadingCover` 广告逻辑：**不动**
- `videoAdCountdown` 3-2-1 倒计时：**不动**
- `playerUrlLoading` 变量语义：**不动**（兜底层有独立的 `playerFallbackCoverReady` 控制）
- store、接口、路由：**不动**
- `live.vue`（直播间入口）、`main/index.vue`（首页入口）：**不动**

---

## 八、待确认事项（实现前请确认）

1. **`playerIframeOnload` 是否是最合适的就绪信号？**
   - 现有逻辑：收到 `playerIframeOnload` 时执行 `sendHistoryMessage` 和 `playerUrlLoading = false`，说明此时 iframe 内部页面已完成加载
   - 候选：`canplay` 更晚（流真正可播），视觉上兜底层会显示更久——倾向用 `playerIframeOnload`
   - **请确认是否同意用 `playerIframeOnload` 作为消失时机**

2. **首页（`is_index=true`）是否需要兜底层？**
   - 首页黑屏最严重，且没有启动加载图，兜底层在首页收益最大
   - 方案中首页与直播间逻辑一致，不做区分——**请确认**

3. **兜底层消失是否需要渐隐动画（0.3s fade-out）？**
   - 有动画：视觉更平滑，但需加 `<transition>` 包裹
   - 无动画：直接消失（`v-if` 直接移除），简单无副作用
   - **请确认偏好**
