# PWA Platform 接入方案 — x9-web-pc（NX-2031）

> 状态：**已确认，执行中**
> 文档版本：2026-10-02（依据交接文件 portable-pc-shared-origin-host-handoff.md 重规划）
> 平台包版本：@pwa-platform/vite 0.3.0 / @pwa-platform/vue 0.3.0 / @pwa-platform/contracts 0.3.0
> **2026-11-11 更新**：当前为 **0.4.3**，并修复了 Safari 13.1 等旧浏览器白屏，见「十二、2026-11-11 补充」
> 文档依据：本地副本 D:/gs/pwa-platform（版本 0.3.0，与安装包一致）+ 交接文件

---

## 一、接入目标与边界

- PC 部署于域名根路径 `/`，独立 H5 部署于 `/m/`
- `deployment.kind: "portable"`：同一份 dist 可部署到构建时未知的多个 HTTPS 域名，不在代码中写死 origin
- `topology.kind: "shared-origin"`，v2 登记表：根 worker 排除 `/m`，不预缓存 H5 文件，不向 H5 返回 PC 离线页
- 提供应用壳、中文离线页（平台生成）、更新提示（prompt 模式）
- 关闭运行时缓存（`runtimeCache.enabled: false`）、关闭离线写入（`offlineWrites.enabled: false`）
- 不缓存业务 API、用户数据、私有页面

---

## 二、版本与环境基线（已核验）

| 项目 | 实测值 | 要求 | 结论 |
|---|---|---|---|
| Node.js | v24.16.0 | >=22.0.0 | ✅ |
| Vite | ^5.0.0 | ^5.0.0 \|\| ^8.0.0 | ✅ |
| Vue | ^3.4.0 | >=3.4 且 <4 | ✅ |
| @pwa-platform/vite | 0.3.0 | 0.3.0 | ✅ |
| @pwa-platform/vue | 0.3.0 | 0.3.0 | ✅ |
| @pwa-platform/contracts | 0.3.0 | 0.3.0 | ✅ |
| 本地副本版本 | 0.3.0 | 与安装包一致 | ✅ |

---

## 三、现状扫描结果

### 3.1 冲突（已确认可处理）

| 冲突项 | 位置 | 处理 |
|---|---|---|
| `VitePWA(...)` 调用 | `vite.config.ts` 第 11、112–124 行 | 移除 |
| 旧 `src/sw.ts` | 完整文件 | 删除（用户已确认） |
| `vite-plugin-pwa` 依赖 | `package.json` devDependencies | 移除（用户已确认） |
| `workbox-*` 7 个包 | `package.json` devDependencies | 移除（用户已确认） |
| 混淆插件 `enable: true` | `vite.config.ts` | 临时改为 `false`（方案 B） |
| 混淆插件 `threadPool: true` | `vite.config.ts` | 已改为 `false`（崩溃修复） |
| `seed: 20241001` | `vite.config.ts` | 保留（无害，待混淆方案确定后评估） |

### 3.2 index.html

无旧 `<link rel="manifest">`，无 `<base>` 标签，无冲突。

### 3.3 资产目录

`build.assetsDir: 'static/assets'`，资产 URL 为 `/static/assets/…`，策略规则写 `pathPrefix: "/static"` 覆盖全部静态资源。

### 3.4 图标位置

已有图标在 `public/static/icons/`，URL 为 `/static/icons/…`，manifest 中路径相应调整。

### 3.5 TypeScript 结构

- `tsconfig.node.json`：检查 `vite.config.*`，需加 `allowImportingTsExtensions: true`（因 `pwa.config.ts` 以 `.ts` 扩展名导入）
- `tsconfig.app.json` include 有 `env.d.ts`，需新建 `src/env.d.ts` 加虚拟模块类型引用
- `main.js` 是 JS 文件，`App.vue` 用 `<script setup>` 但无 `lang="ts"`，保持现有 JS 风格

---

## 四、身份值（PwaPortableIdentity）

可移植模式**没有 `origin` 字段**，身份在多个域名共用。

| 字段 | 值 | 说明 |
|---|---|---|
| `appId` | `x9-pc` | 与旧 sw.ts prefix 一致 |
| `manifestId` | `/` | 根路径部署，与 scope 相同 |
| `scope` | `/` | 与旧 worker scope 一致 |
| `serviceWorkerUrl` | `/sw.js` | 与旧 worker URL 一致，迁移平滑 |
| `manifestUrl` | `/manifest.webmanifest` | 在 scope 内 |
| `mountPath` | `/` | 与 Vite base 相同 |
| `environment` | `production` | 生产环境 |
| `cacheNamespaceSeed` | `r1` | 首次接入 |

---

## 五、共享登记表（PwaPortableOriginRegistry）

```
schemaVersion: 2（可移植版本，无 origin）
root:  appId=x9-pc, scope=/, serviceWorkerUrl=/sw.js
child: appId=x9-h5,  scope=/m/, serviceWorkerUrl=/m/sw.js
```

H5 子条目是未来 H5 接入 PWA 时的路径约定，**PC 构建不会生成 H5 的 worker 或 manifest**。根 worker 自动对 `/m` 生成排除规则。

---

## 六、策略（PwaPolicyV3，schemaVersion: 3）

```
install: { enabled: true }
updateMode: "prompt"
offlineFallback: { enabled: true, path: "/offline.html" }
networkTimeoutSeconds: 5
resources:
  - /      navigation-public-static  network-first
  - /index.html   asset    cache-first
  - /static      asset    cache-first   ← 覆盖 /static/assets/ 和 /static/icons/
offlineWrites: { enabled: false, ... }
runtimeCache:  { enabled: false, ... }
```

说明：
- `/static` 规则覆盖 `static/assets/`（业务 JS/CSS）和 `static/icons/`（图标），一条规则足够
- `offlinePage: { locale: 'zh-CN' }` 由平台生成离线页，无需手动提供 `public/offline.html`
- `networkTimeoutSeconds: 5`：弱网超时回退到缓存（离线页）

---

## 七、更新检查说明

| 间隔 | 值 | 配置位置 | 可配置 |
|---|---|---|---|
| 后台轮询检查新版本 | 30 分钟（1,800,000 ms） | `createPwa({ updateCheck: { intervalMs: 1_800_000 } })` | 是 |
| 默认提示"稍后"再次提醒 | 30 分钟 | 平台内部常量 | 否 |

---

## 八、混淆插件处理（方案 B）

本次接入期间关闭混淆（`enable: false`），PWA 验收完成后作为独立 task 解决混淆与 PWA 的兼容问题（需确认 `vite-plugin-bundle-obfuscator` 是否支持确定性 seed 传递）。`threadPool: false` 修复崩溃，永久保留。

> **2026-11-11 更新**：已决定混淆**保持关闭、不得开启**。开启后产物不再经过兼容验证，需要单独立项并完整复验浏览器兼容。

---

## 九、拟修改文件清单

| 操作 | 文件 | 内容 |
|---|---|---|
| **新建** | `pwa.config.ts` | IDENTITY / REGISTRY / INSTALL / POLICY |
| **修改** | `vite.config.ts` | 移除 VitePWA；引入 pwa()；关闭混淆 |
| **修改** | `tsconfig.node.json` | 加 `allowImportingTsExtensions: true` |
| **新建** | `src/env.d.ts` | 虚拟模块类型引用 |
| **修改** | `src/main.js` | 安装 createPwa |
| **修改** | `src/App.vue` | register() + PwaUpdateNotice |
| **删除** | `src/sw.ts` | 旧 workbox worker |
| **移除依赖** | `package.json` | vite-plugin-pwa + 7 个 workbox 包 |

---

## 十、验收标准

### 10.1 产物检查（构建后）

- `dist/` 包含：`sw.js`、`manifest.webmanifest`、`pwa-recovery-worker.js`、`offline.html`
- `index.html` 只有一处 `<link rel="manifest">`
- `sw.js` 最终配置含 `{ pathPrefix: "/m", action: "exclude" }`
- `runtimeCache.enabled: false`
- 预缓存清单不含 `/m/` 文件

### 10.2 本机浏览器验收（预览身份，端口 4173）

1. 只有一个 manifest 链接，指向 `/manifest.webmanifest`
2. SW 已注册，scope=`/`，状态 `activated`
3. 刷新后 `navigator.serviceWorker.controller` 不为 null
4. Offline 模式刷新，仍显示应用外壳
5. Offline 访问未访问路由，显示中文离线页

### 10.3 不可本机验证的项目

| 项 | 原因 |
|---|---|
| 更新提示流程 | 需要两个版本交替部署，线上发版后验证 |
| Android 安装提示 | 需真机 HTTPS |
| /m 路由的生产隔离 | 本地 vite preview 不部署 H5，仅构建产物可核对排除规则 |
| 响应头（no-cache 等） | 需运维配合 |

---

## 十一、运维侧要求（参考）

| 文件 | Cache-Control |
|---|---|
| `/sw.js`、`/pwa-recovery-worker.js`、`/manifest.webmanifest`、`/offline.html`、`/index.html` | `no-cache` |
| 带指纹 JS/CSS | `max-age=31536000, immutable` |

服务器须把 `/m/` 优先路由到 H5 项目，`/m` 重定向到 `/m/`。worker 文件最后上传。

---

## 十二、2026-11-11 补充：旧浏览器白屏修复与 PWA 库升级（当前 0.4.3）

### 12.1 起因

真实用户用 Safari 13.1 打开网站白屏。原因是 PWA 库 0.4.0 用了 `Object.hasOwn`（Safari 15.4 才支持），页面启动时报错，应用没有挂载。

### 12.2 本分支的改动（`feat/NX-2031`，共 5 个代码提交 + 本文档）

| 提交 | 内容 |
|---|---|
| `e100f8fe` | **白屏修复**：接入 `@vitejs/plugin-legacy` 5.4.1（只补 API，不生成旧版本包，必须锁定 5.4.1），`build.target` 设为最低支持版本；`main.js`、`App.vue` 里 PWA 初始化失败时跳过 PWA、页面照常运行。**兜底页**：`index.html` 里一段 ES5 检测脚本，浏览器版本过低或页面启动失败时显示提示页，不再白屏 |
| `b104da26` | PWA 库升级到 **0.4.1**：后台脚本 `sw.js` 不再调用 `URL.canParse`、`Object.hasOwn`，Chrome/Edge 80～119、Firefox 74～114、Safari 13.1～16.x 上后台脚本能正常安装 |
| `0ad6b4d6` | PWA 库升级到 **0.4.2**：更新提示条在 Chrome/Edge 80～86、Safari 13.1～14.0 上原来会跑到屏幕外，现在补了旧浏览器的定位回退 |
| `476fd94a` | 兜底页「页面加载失败」精简：只给「刷新页面」和「复制诊断信息」，不推荐换浏览器；文案改为「页面没有加载出来 / 可能是网络不太稳定，刷新一下就好」 |
| `50775c0d` | PWA 库升级到 **0.4.3**：0.4.1 引入的 `canParseUrl` 在只传一个参数时调用 `new URL(value, undefined)`，Safari 13 会抛错，后台脚本因此不接管任何请求、丢弃「更新」消息（点「更新」没反应、网络卡住不出离线页）；0.4.3 修复，并把 worker 构建目标降到最低支持版本、提示条按钮间距不再用 gap |

### 12.3 浏览器支持范围

Safari 13.1 / iOS 13.4 / Chrome 80 / Edge 80 / Firefox 74 及以上。低于这个范围显示「浏览器版本过低」兜底页。

### 12.4 验证结果

| 浏览器 | 页面 | 后台脚本接管 | 更新提示条 | 点「更新」接管 | 断网离线页 |
|---|---|---|---|---|---|
| Chromium 80（本机真内核） | ✅ | ✅ | ✅ 右下角 | ✅ | ✅ |
| Safari 13.1 / Catalina（BrowserStack，0.4.3） | ✅ | ✅ | ✅ 右下角 | ✅ | ✅ |
| Safari 14.1 / Big Sur（BrowserStack，0.4.3） | ✅ | ✅ | ✅ 右下角 | ✅ | ✅ |
| iPad Pro 12.9 / iPadOS 14（BrowserStack，桌面版网页，0.4.3） | ✅ | ✅ | ✅ 右下角 | ✅ | ✅ |
| Firefox 74、Edge 80 / Windows 10（BrowserStack） | ✅ | ✅ | — | — | ✅ |

### 12.5 已解决的问题（记录）

0.4.1、0.4.2 在 Safari 13.x 上点「更新」后新版本不接管、网络卡住时不出离线页（后台脚本虽然激活，但实际没有接管任何请求）。根因是 `new URL(value, undefined)` 在 Safari 13 上抛错，0.4.3 已修复，BrowserStack 上 Safari 13.1 复测通过。BrowserStack 没有 iPadOS 13 真机，iOS 13 未直接验证（与 Safari 13 同一引擎）。

### 12.6 上线注意

- 覆盖文件后执行 `pnpm install`（`package.json`、`pnpm-lock.yaml` 有变化），再 `pnpm build`。
- `sw.js` 内容变了，老用户下次访问会自动更新，可能看到一次「有新版本」提示，属于正常。
- 离线页的内联脚本和样式哈希会变，线上如果配置了 CSP 响应头需要同步更新。
