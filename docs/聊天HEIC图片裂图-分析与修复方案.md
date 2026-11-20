# 聊天 HEIC 图片裂图 — 分析与修复方案

## 一、现象

iOS 相册的 HEIC 图片在聊天中上传时，两处显示为裂图/失败：

1. **上传弹窗缩略图**：显示浏览器默认的裂图占位，但文件名正常、发送按钮可用。
2. **聊天气泡**：显示「加载失败」，图片实际已成功上传到服务端。

## 二、根因

两个症状同源：**本地 `File` 生成的 blob URL 被塞进了原生 `<img>` / `el-image`，而 Chrome 不能解码 HEIC。**

- 弹窗：`changeFile` 里 `URL.createObjectURL(newFile)`（`operationPanel/index.vue:633`）交给
  el-upload 的 `list-type="picture"`（`:141`）渲染，它内部是原生 `<img>`。
- 气泡：`formatMsg` 对 `File` 走 `processImg` 生成 blob URL 写入 `displayImg`
  （`chatHelper.ts:28-35`、`:47`），模板绑的就是它（`messageItem/index.vue:113`）。
  el-image 解码失败落到默认 error 态。

> `dfImage` 里 `.empty` 那条样式（`:81-85`）只在 `!imgSrc` 时把错误文案字号打成 0。
> blob URL 属于「有值但解不了」，所以文案照常显示。

**服务端链路本身是通的**：后端能从二进制识别 HEIC 并转存为 `.webp`，WS 回包带回可用的
`pic`。问题纯粹在前端一直用本地 blob 回显、从未采用回包字段。

### 回填为什么现在不生效

WS 回包（`action: 'msg'`）在 ws-worker 白名单内（`ws-worker.js:13-14`），会回给发送者本人，
但两条路径都被去重挡掉：

| 路径 | 位置 | 行为 |
| --- | --- | --- |
| WS 回包 / 主播私聊 `messageList` | `chatDetail/index.vue:695-696` | `mergeDataList('push')` 按 seed 过滤掉已存在项 |
| 同一次发送的状态流转 | `chatDetail/index.vue:634-641` | `processSendMsg` 命中同 seed 只覆盖 `msgStatus` / `imageUploadProgress` |

## 三、设计原则

1. **不转码**：不引入 libheif / wasm，HEIC 原样上传，`doCompressor` 对 HEIC 的现有行为不变。
2. **解不了就占位**：浏览器无法解码时显示占位（图标 + 文案），不显示裂图；发送按钮照常可用。
3. **气泡用回包字段回显**，不再依赖本地 blob URL。
4. **SENDING 窗口期同样占位**：从点发送到服务端字段到达之间只有本地 HEIC 可用，
   若不占位会「先裂一下再变好」。

## 四、四条 WS 回包实测（决定了闸门写法）

| 类型 | `msg_type` | `pic` | `pic_bnc` |
| --- | --- | --- | --- |
| 图片（HEIC 转存） | 2 | `..._xxx.webp` | `..._xxx.webp.bnc` |
| 表情贴图 | 2 | `...png` | `""` |
| 视频 | 7 | 服务端封面 `.jpg` | 无 |

服务端**不区分**图片消息与表情贴图（都是 `msg_type: 2`），因此不能用 `msg_type` 判断。
发送侧的 `pic` 类型才是可靠依据：

| 类型 | 发送时 `params.pic` | 是否需要回填 |
| --- | --- | --- |
| 图片 | `File` | 需要 |
| 表情贴图 | URL 字符串（`:1057` 传 `emojiurl`） | 不需要，本来就是可用 URL |
| 视频 | `'视频正在上传中'` 字符串 | 不需要，走独立模板分支 |

**结论：闸门以 `contentType === MESSAGE_TYPE.IMG && pic instanceof File` 为核心。**
这样表情贴图和视频天然被排除，无需依赖 `messageItem:224` 那种 `msg_type !== 7` 的脆弱枚举判断。

落地时在此基础上补了两道，共 4 道（实现见 `backfillLocalImage`）：

| # | 条件 | 拦掉什么 |
| --- | --- | --- |
| 1 | `existed.contentType === MESSAGE_TYPE.IMG` | 非图片消息 |
| 2 | `existed.pic instanceof File` | 已回填过的项（幂等）、表情贴图 |
| 3 | `incoming.pic` 是非空字符串 | 回包没带可用地址时不要把 `displayImg` 写成 `undefined` |
| 4 | `existed.msgStatus !== MESSAGE_STATUS.FAIL` | 已失败的消息 |

闸门 4 是后加的，理由是**重发**：`handleResend` 浅拷贝整个消息对象交给 `sendData`，
若 FAIL 项已被回填成服务端 URL 字符串，重发时就会把一个 URL 当图片文件再发一次。
保留本地 `File` 才能正常重发。这一道同时让 §五.1 原计划的「`handleResend` 清 `displayImg`」变得不必要
（FAIL 项的 `pic` 仍是 `File`、blob 未被 revoke，`displayImg` 依然有效）。

## 五、改动方案

HEIC 本身涉及 4 个文件。`utils/index.js` 和 `chatHelper.ts` 不改。

> 本节行号指**改动前**的代码。落地后各文件已位移，以 §十 的实际实现为准。
> 同一提交里还捎带了两处独立修复（WS 重连、加密图同源），见 §十一、§十二。

### 1. 回填 — `chatDetail/index.vue`

**位置**：`mergeDataList` 的 `case 'push'` 过滤处（`:693-696`）。

现在发现同 seed 就直接丢弃。改为丢弃前先尝试合并：命中项若通过上述闸门，
写入回包的 `pic`，并据此重算 `displayImg`；合并后照旧过滤，不新增列表项。

**只写 `pic` + `displayImg` 这两个字段，不能少也不能多：**

- `displayImg` **必须写** — 模板绑的是它而非 `data.pic`（`messageItem:113`）。
- `pic_bnc` **不能写** — `dfImage` 中 `picBnc` 优先于 `src`（`:55-65`），一旦写入非空值就强制走
  `fetch` + `decryptImg`，而 `decryptImg` 失败时 `return ''`（`crypto.ts:449-462`），
  `imgSrc` 变空串 → 气泡**全空白**，比现在的「加载失败」更糟。刚上传完 `.bnc` 是否已生成无法确认，
  不做这个赌；`pic` 那个 `.webp` 直接可用，还省一次网络请求 + 解密。
- `time` / `creation_time` **不能写** — 会让气泡时间跳变。
- `msg_id` **不写** — 它会顺带修掉「自己发的图不触发已读上报」
  （`setRead` 的 `if (!lastMsg.msg_id) return`，`:228`），那是独立 bug，不混进本次改动。

**`processSendMsg`（`:634-641`）不动。** 它只负责同一次发送内的 SENDING→SUCCESS 状态流转，
那时没有服务端字段可合，且文本消息共用该逻辑，改动纯风险无收益。

合并是就地修改 `msgList` 中的对象，不进 `newMsgList`，
因此不受每 200ms 放 7 条的滴灌节流（`:237-249`）影响，回填立即生效。

四种会话类型共用这一处：WS 回包与主播私聊的 `mittBus.emit('imOnMessage', {action:'messageList'})`
（`operationPanel:830`）都进同一个 `push`。广场 / 群组 / 助理私聊虽然丢弃了 HTTP 响应
（`:862-867`），但靠 WS 即可，**无需补捕获响应**。

**revoke 旧 blob**：合并时存下旧 `displayImg`，swap 完在 `nextTick` 中 revoke。
已确认无第二个消费者 —— `msgToPrivateChat` 会把 `pic` 带进 chatList 的 `last_msg`
（`chatHelper.ts:226-247`），但 chatList 模板只渲染 `text` 和 `creation_time`（`:44`、`:55`），
未当图片渲染。不等新图 load 成功再 revoke：HEIC 旧 blob 本来就渲染不出来，
真图万一 404 会落到新增的 `#error` 占位，失败态体面。

**~~`handleResend`（`:792-797`）补一处~~ —— 落地后取消，`handleResend` 未改。**
原顾虑是重发的浅拷贝会带上指向已 revoke URL 的 `displayImg`（且 `sendData` 收到的是已 format
过的对象、不会再跑 `formatMsg`）。加了闸门 4 之后这个场景不成立：能点重发的只有 FAIL 项，
FAIL 项从不回填，`pic` 仍是 `File`、blob 也没 revoke。改它反而会把一个可用的 `displayImg` 清掉。

### 2. `dfImage/index.vue` — 占位插槽 + 预览守卫

1. 给 `el-image` 补 `#error`，向上透传 `<slot name="error">`。
   **必须用 `$slots.error` 守卫**：dfImage 是全局共用组件（头像也在用），
   不守卫会让所有未传插槽的调用方从「加载失败」变成空白。
2. 新增一个 prop 控制是否禁用预览，`preview-src-list`（`:10`）据此给空数组。

> 预览守卫**不用** `isLoaded`（`:45`）：它是异步 load 事件的结果，src 变化后不重置就是脏值，
> 重置了又会在每次加载间隙短暂禁用预览。改由 messageItem 传入
> `pic instanceof File` 的判断结果 —— 语义精确（要禁的就是「本地 HEIC 期间」），且不依赖异步事件。

### 3. `messageItem/index.vue` — 传入占位

给 `:109-116` 那个 `df-image` 传 `#error` 插槽（图标 + 文案，填满盒子），并传入预览禁用标志。
`:31-36` 的 df-image（广告位）不动。

- **气泡侧不用探针**：el-image 的 error 态触发条件恰好是「显示不出来」，
  顺带覆盖回填后 http 图 404 的情况；显式探针只能覆盖格式，反而更窄。
- **占位文案要中性**（如「图片无法预览」而非「格式不支持」），因为 `#error`
  覆盖的是包含 404 的更大集合。
- **尺寸无需处理**：`.pic-info` 已是固定 138×138 + `fit=contain`（`:531-537`），
  占位填满同一盒子，回填换成真图不会有任何重排。
- **SENDING 期间无需额外代码**：进度环 `.pic-upload-overlay` 已是
  `position:absolute; inset:0; z-index:4`（`:501-511`），占位天然垫在环底下。

### 4. `operationPanel/index.vue` — 探针 + `#file` 插槽 + 压缩短路

**探针**：弹窗侧必须显式探测，因为 `list-type="picture"`（`:141`）渲染的是原生 `<img>`，拦不住。
用 `createImageBitmap(file)` —— 直接吃 `File`，无需先造 blob URL，HEIC 会 reject；
成功后 `bitmap.close()`。插在格式校验、大小校验之后，`doCompressor` 之前。
结果存单个 ref（列表限 1 张）。浏览器不支持 `createImageBitmap` 时当作可解码，维持现状。

**`#file` 插槽**：照 `custom-uploader.vue:22-38` 的既有先例写，
**复用 element-plus 类名**（`.el-upload-list__item-thumbnail`、`item-name`、`item-status-label`），
使右上角绿色 ✅ 角标与文件名视觉保持原样。缩略图按探针结果二选一：
可解码渲染 el-image，不可解码渲染占位。

> 不用 CSS 藏裂图：那要依赖 element-plus 内部类名，升级易碎，
> 且失败的 `<img>` 仍在，alt 与无障碍语义都留着。
>
> 需连带确认 `:deep(.el-upload-list)` 那段样式（`:1218-1221`，针对 `.el-upload-list__item-info`），
> 自定义插槽后结构变化可能使其失效。video 分支的 DOM hack（`:678-690`）只在视频路径，不受影响。

**压缩短路**：探针判定不可解码时跳过 `doCompressor`，直接用原 `File`，
并按现有风格打一行日志（对齐 `[doCompressor] 图片小于 2M，跳过压缩`，`utils:716`）。

这解决了一个此前无法静态确认的风险：`doCompressor` 的短路条件**只看体积不看类型**
（`utils:712-721`，2MB 阈值），所以「HEIC 不参与压缩」并不存在 ——
≤2MB 的 HEIC 原样返回只是因为体积小，**>2MB 的 HEIC 会真的进 `imageCompression`**，
而它是 canvas 方案，解不了 HEIC。若它不抛错而返回空白 canvas 结果，
`doCompressor` 会当成功返回，**上传上去就是白图**。
让它根本不进去即可，无需实测其失败方式。
「浏览器解不了」正是 canvas 压缩的准确失败前提，比按 HEIC 列黑名单更对。

**不改 `doCompressor` 本身**（`utils:705-735`）：另有 5 个调用方
（apply、broadcast、userinfo、broadcastModal、custom-uploader），
在其中加异步探针会给所有人增加延迟。

**顺手修 blob 泄漏**（`:633`）：`doCompressor` 已挂了 `newFile.url`，
该行却优先用 `rawFile.url` 又 `createObjectURL` 一个，每次选图多漏 1-2 个。
改为复用 `newFile.url`，全程只追踪一个 URL。不可解码的文件不生成 blob URL，
`fileList` 项的 `url` 留空、靠占位显示 —— 这条路径零泄漏。

## 六、已排查并确认无需处理

- **`historyMessageList` 的外部消费者**：`watch(msgList, ...)`（`:656-658`）非 deep，
  就地改属性不触发。唯一消费者 `danmakuList` 过滤 `msg_type == 0 && type == 0`
  （`live-player-iframe.vue:225-227`），即弹幕；图片消息（`msg_type: 2`）永不进入。无影响。
- **重发的 seed 匹配**：`handleResend` 生成新 seed 并移除旧项（`:792-797`），
  WS 回包带新 seed，能匹配。且重发按钮仅 FAIL 时可点，与成功回填不冲突。
- **表情贴图的 `pic_bnc: ""`**：`dfImage` 判断是 `if (props.picBnc)`（`:55`），
  空串 falsy 会正确掉到 `src` 分支。且本方案不回填 `pic_bnc`，不涉及。
- **视频消息**：走 `msg_type === 7` 的独立 `<img>` 模板分支（`:44-48`），
  不经过要加占位的 df-image。

## 七、明确不在本次范围

- **heif 不支持**：`SUPPORTED_UPLOAD_IMAGE_*`（`utils:617-637`）只有 heic。
  `.heif` 会命中「图片格式错误」提示，属有意为之，提示文案也不加。
- **`msg_id` 回填 / 图片消息的已读上报**：独立 bug，单独记录。
- **`appendVersionIfHttpImage` 的正则缺陷**（`messageItem:355`）：以扩展名 `$` 结尾，
  回填后首次点刷新有效，第二次因已带 `?v=` 而匹配不上。既有缺陷，本次不动。
- **`setPicBncMap` 整体覆盖**（`store/index.js:253-255`）：`store.picBncMap = data`
  而非合并，缓存只留最后一张。本方案不走 `pic_bnc`，不会加剧。
  > 落地后 §十二 动了 `picBnc` 分支，这条重新变得相关，但性质仍是「缓存命中率低」而非错误：
  > 未命中会重新 `decryptImg`，结果正确。**不在本次范围**，另见下条。
- **`decryptImg` 失败结果被写进缓存**（`dfImage:67-70`）：`decryptImg` 失败时 `return ''`
  （`crypto.ts:459-461`），而 `dfImage` 无条件 `commit('setPicBncMap')`。空串一旦入缓存，
  下次 `if (!picBnc)` 为真会重试，所以不会永久卡死——但配合上一条的整体覆盖，
  行为不好推理。既有缺陷，本次不动，记录备查。

## 八、改动清单（计划）

| 文件 | 改动 |
| --- | --- |
| `chatDetail/index.vue` | `mergeDataList('push')` 加同 seed 合并 + revoke；~~`handleResend` 清 `displayImg`~~ |
| `dfImage/index.vue` | `#error` 插槽透传（`$slots` 守卫）+ 预览禁用 prop |
| `messageItem/index.vue` | 传入占位插槽与预览禁用标志 |
| `operationPanel/index.vue` | `createImageBitmap` 探针、`#file` 插槽、压缩短路、blob 泄漏修复 |

## 九、验证要点

1. HEIC（分别测 ≤2MB 与 >2MB）：弹窗显示占位而非裂图，✅ 角标与文件名位置不变，发送按钮可用。
2. 气泡：SENDING 期间占位 + 进度环叠加正常，回填后变为服务端 `.webp` 真图，无中间裂图。
3. 占位期间点击不触发大图预览；回填后预览恢复正常。
4. 回归：普通 jpg/png 全程无变化；表情贴图、视频、文本消息、历史消息均不受影响。
5. 回归：头像等其他 `df-image` 调用方的加载失败表现不变（验证 `$slots.error` 守卫）。
6. 四种会话类型（广场 / 群组 / 助理私聊 / 主播私聊）都验证回填。
7. blob URL 无泄漏：多次选图后 `chrome://blob-internals` 不持续增长。
8. 重发：HEIC 发送失败后点重发，仍发出原始 `File` 而非服务端 URL（验证闸门 4）。
9. WS 状态机（§十一）：断网重连后能自动恢复收消息，`stateChange` 正常回到主线程。
10. 加密图（§十二）：`pic_bnc` 图片在直连与代理两种 `imgMode` 下都能解密显示。

## 十、实际落地（提交 `1899e080`）

改动 8 个文件，其中 4 个是 HEIC 方案本体，3 个是 WS 修复，1 个是本文档。

| 文件 | 改动 | 与方案的差异 |
| --- | --- | --- |
| `chatDetail/index.vue` | 抽出 `backfillLocalImage`，在 `mergeDataList('push')` 的过滤回调中调用 | 闸门 4 道（方案是 1 道）；`handleResend` 未改 |
| `dfImage/index.vue` | `#error` 透传 + `previewDisabled` prop | 另加 `getSameOriginURL`（见 §十二） |
| `messageItem/index.vue` | `#error` 占位（`IconPicture` + 「图片无法预览」）+ `isLocalPendingImg` | 与方案一致 |
| `operationPanel/index.vue` | `canBrowserDecodeImage` 探针、`#file` 插槽、压缩短路、blob 复用 | 与方案一致 |
| `utils/im/wsHelper.js` | 状态机回调与 `this` 绑定修复 | 方案未涉及 |
| `utils/im/ws-worker.js` | 排查日志 | 方案未涉及 |
| `utils/im/index.js` | 排查日志 | 方案未涉及 |

`backfillLocalImage` 只写 `pic` 与 `displayImg` 两个字段，与 §五.1 的约束一致
（不写 `pic_bnc` / `time` / `msg_id`），旧 blob 在 `nextTick` 中 revoke。

未匹配到同 seed 本地项时，回包按原逻辑当新消息插入——即回填失败会退化成「多一条消息」，
而不是丢消息。这是有意保留的兜底。

## 十一、捎带修复：web worker 收不到消息（`wsHelper.js`）

排查回填链路时发现的独立 bug，与 HEIC 无关，但会让回包根本到不了 `mergeDataList`。

**症状**：WS 断开后无法恢复收消息。

**根因（`this` 丢失）**：

`this.instance.onerror = this.handleError` 把静态方法直接赋给 WebSocket 的事件属性，
触发时 `this` 指向 WebSocket 实例而非 `WsHelper` 类。`handleError` / `handleClose` 内部要读
`this.STATUS` 和 `this.handleStateChange`，于是抛错 → 状态永远不流转 → 不重连 → 收不到消息。
`onclose` 同理。改为箭头函数包一层 `() => this.handleError()` 绑回类。

**连带重构（解耦，非 bug 修复）**：

`wsHelper` 原本 `import { handleStateChange } from './ws-worker.js'`，而 `ws-worker.js` 又
`import wsHelper from './wsHelper'`——两个模块互相 import。改回 `connect(config)` 传回调、
存进 `this.handleStateChange` 的原设计（该字段原先被注释掉了）。

> 这一条**未验证是否参与了故障**：`export function` 会被提升，循环 import 下调用大概率是通的。
> 记录为「消除双向耦合」，不要当成症状的原因。

重构后多了个顺序约束：`this.handleStateChange = handleStateChange` **必须早于 `this.destroy()`**，
因为 `destroy` 内部会派发 `INIT` 状态。若沿用原来「先 destroy 再取 config」的顺序，
首次连接时 `destroy` 会调到默认的 `() => null`，状态丢一拍。

这条链路的下游是 `ws-worker.js` 的 `handleStateChange`：只有收到 `CONNECTED` 才会
`scheduledPush(100)` 启动滴灌定时器（`:85-93`）。状态机哑火 = 定时器不启动 = 缓冲区里的消息
永远不 `postMessage` 给主线程。这也是当时「回填看起来没生效」的一个干扰因素。

> `onopen` 仍未接：连接成功依赖服务端下发 `action: 'open'` 消息后手动调 `handleOpen()`
> （`:82-86`）。既有设计，本次未动。

## 十二、捎带修复：加密图同源改写（`dfImage.getSameOriginURL`）

`decryptImg` 走 `fetch` 读取加密图，受同源策略限制；而普通图走 `<img>` 不受限。
原来两者共用 `getURL`，它只在 `imgMode === IMG_MODE.DIRECT` 时改写地址，其余情况原样返回。
于是 `decryptImg` 拿到跨域地址 → fetch 失败 → `decryptImg` 返回 `''`（`crypto.ts:459-461`）
→ `imgSrc` 空串 → 气泡全空白，正是 §五.1 里担心的那个失败态。

**这条路径是默认路径**：`imgMode` 初值为 `IMG_MODE.NORMAL`（`store/index.js:69`），
只有 URL 带 `direct=true` 才切到 `DIRECT`（`:462`）。也就是说加密图在常规访问下一直走的是
不改写的分支。

新增 `getSameOriginURL` 只用于 `picBnc` 分支：无条件改写为 `window.origin + pathname`，
空串短路，`formatURL` 抛错时回退原值。`getURL` 保持原样给 `src` 分支用——
普通图走 `<img>`，不需要同源。

影响面是**所有** `pic_bnc` 调用方，不止聊天图片，回归验证时需一并覆盖。
同源改写依赖代理把该 pathname 转发到图片源站，若某环境没配这条代理，
会从「跨域失败」变成「404 失败」，两者都落到空串，但排查方向不同，需留意。

## 十三、临时排查日志（已清理）

功能验证通过后，4 个文件里的 `TODO 临时排查` 日志已全部删除。

| 文件 | 清掉的内容 |
| --- | --- |
| `chatDetail/index.vue` | `HEIC_LOG` 常量、messageList 回包日志、`backfillLocalImage` 的 `ctx` 对象与 4 处闸门日志、回填成功日志、未匹配日志 |
| `dfImage/index.vue` | `logLoadError` 函数 + 模板的 `@error` 绑定 |
| `utils/im/index.js` | 主线程收 worker 图片包日志 |
| `utils/im/ws-worker.js` | `INSTANCE_ID`、滴灌启动日志、`tickCount` 心跳、postMessage 前日志、白名单前日志、入缓冲区日志 |

清理时保留的两处，都是有意为之：

- **`ws-worker.js` 的 `catch`**：简化为 `console.error('[ws-worker] handleMessage', data?.action, error)`。
  原始代码只有裸 `console.error(error)`，`formatMsg` 抛错时看不出是哪个 action，留个前缀更好排查。
- **`operationPanel` 跳过压缩那行 `console.log`**：对齐 `doCompressor` 既有风格，属正常运行日志。

**两个容易踩的点**（已避开，重复此类清理时留意）：

- `backfillLocalImage` 的 4 道闸门当时写成 `return console.log(...)`，删日志必须改成裸 `return`，
  整行删掉会让闸门失效、非图片消息也被回填。
- `dfImage` 的 `logLoadError` 与模板 `@error` 绑定必须同时删；`#error` 插槽是功能代码，不能动。

**验证**：`eslint` 四个文件 0 error（`chatDetail:254` 的 `expires_at` 未使用告警是既有的，与本次无关）；
`vite build` 已确认 Rollup 打包阶段通过。

> 构建的 JSConfuser 混淆阶段（`vite.config.ts:126-164`，`threadPool: true`）在本机会段错误退出，
> 每次崩在不同 chunk（含 `UserLevel-*.js` 这类未改动的文件），发生在打包完成之后，
> 与本次改动无关，属既有环境问题。

