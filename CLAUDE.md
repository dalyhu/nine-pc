# 小9直播 PC 站

给在这个仓库里写代码的人和 AI 看：项目约定、不能动的地方、提交前要过的检查。改动前先读「浏览器兼容」和「不能动的地方」两节。

## 项目概况

- 技术栈：Vue 3 + Vite 5 + Vuex 4 + vue-router 4 + Element Plus（按需自动引入）+ SCSS；实际版本以 `pnpm-lock.yaml` 为准（当前 Vue 3.4.0、Vite 5.0.0）
- 环境基线：与 CI 对齐用 Node 22（`Dockerfile`），包管理器用 `package.json` 的 `packageManager` 指定的 pnpm 8.6.5
- `ref`、`computed` 等 Vue API 由 unplugin-auto-import 自动引入，Element Plus 组件由 unplugin-vue-components 自动注册
- 手机访问会在 index.html 里跳转到 H5 站（`/m`），这个仓库只管 PC 端

| 目录 | 内容 |
|---|---|
| `src/views/` | 页面，路由见 `src/router/index.js`（页面都是懒加载的分包） |
| `src/layout/` | 整体布局：导航栏 `components/Navbar`、页面主体 `components/AppMain.vue` |
| `src/components/` | 通用组件 |
| `src/api/` | 接口，按业务分文件，统一用 `@/utils/request` |
| `src/store/` | Vuex，`modules/` 按业务分 |
| `src/utils/` | 工具函数；`*.test.js` 是单测 |
| `src/styles/` | 全局样式、主题变量（`theme.scss`）、暗色主题（`dark.scss`） |
| `scripts/` | 兼容检测脚本和它们的固定样例 |
| `docs/` | 各需求的方案文档 |
| `env/` | 环境变量（`.env.dev` / `.env.test` / `.env.prod`） |

## 常用命令

```bash
pnpm dev            # 本地开发（--mode dev）
pnpm build          # 生产构建：源码兼容检测 → 打包 → 产物兼容检测，任何一步不过就失败
pnpm test           # 单测（Node 自带的 node --test，不需要额外安装）
pnpm lint:compat    # 只跑源码兼容检测
pnpm lint           # 日常 lint：带 --fix，会直接改文件；存量问题较多，不作为卡点
```

- `pnpm lint` 会自动修复并改动整个仓库的文件。小范围任务不要跑完就整批提交；只想检查时用 `npx eslint <文件>`（不带 `--fix`）。
- 本地连 pre 或线上接口：`VITE_API_HOST=<接口域名> pnpm dev`，dev 服务器会把 `/api`、`/bbs`、`/upload` 代理过去。
  pre 会校验请求来源域名，要用 hosts 映射的本地域名访问，不能用 `localhost:端口`；公司网络有证书拦截时加 `NODE_USE_SYSTEM_CA=1`。
  用本地构建产物连 pre / 线上调试的完整做法，见统筹目录的 `x9-统筹/调试环境/README.md`（不在本仓库）。
- CI：`.gitlab-ci.yml` 用 Docker 构建，`Dockerfile` 里执行的就是 `pnpm run build`，所以兼容检测不过就发不了版。

## 浏览器兼容（重要）

**支持范围**：Safari 13.1 / iOS 13.4 / Chrome 80 / Edge 80 / Firefox 74（都是 2020 年发布）。
唯一的配置位置是根目录的 `browser-support.json`，构建配置、兜底页上显示的版本、兼容检测都读它。

**构建会自动处理的（放心用）**：

- JS / TS 新语法：可选链、空值合并、class 字段等，构建时会转成旧写法
- JS 内置方法：`Object.hasOwn`、`Array.prototype.at`、`String.prototype.replaceAll` 等，构建时按需补齐（plugin-legacy + core-js）

**构建处理不了的（必须注意）**：

1. **浏览器 API**：BroadcastChannel、Web Locks（`navigator.locks`）、SharedWorker、`structuredClone` 等。
   要用就先判断再用，并准备好不支持时的替代方案：`if ('BroadcastChannel' in window) { ... }`。
   `pnpm lint:compat` 会拦下 `src` 里没判断就用的写法；已经判断过、但检测认不出来的，在那一行加
   `// eslint-disable-next-line compat/compat -- 写明为什么安全`。
2. **core-js 补不了的内置对象**：`WeakRef`、`FinalizationRegistry`，不要用。
3. **正则新写法**：后行断言 `(?<=` `(?<!`、命名捕获组 `(?<name>`、Unicode 属性转义 `\p{…}`、`s` 标志。
   正则字面量会被检测拦下；**`new RegExp('…')` 动态构造的查不到，同样不能用这些写法**。
4. **异步 setup**：`<script setup>` 顶层 `await` 或 `async setup()`。项目入口没有 `<Suspense>`，这种组件不管成功还是失败都可能渲染不出来。异步数据放在 `onMounted` 里，自己处理失败。
5. **CSS**：不要指望构建替你兼容旧浏览器不支持的布局、选择器和单位。新代码避免 flex `gap`、`:where()`、`dvh`（Safari 13.1 不支持；存量代码里有，暂不处理）；`backdrop-filter` 要同时写 `-webkit-backdrop-filter`。

**兼容检测**：

- 源码：`.eslintrc.compat.cjs`，静态检查 `src` 里的 `.vue` / `.js` / `.ts`：浏览器 API、`WeakRef`、正则新写法。静态检查不保证能发现所有不兼容的调用
- 产物：`scripts/dist-check.mjs`，检查 dist 里全部 JS（含第三方库）的**语法**（按 ES2021 解析，另查逻辑赋值、BigInt、正则），以及 index.html 兜底脚本必须是 ES5。**它不检查浏览器 API**：第三方库、index.html 内联脚本、`public/` 下静态脚本用到的 API 要人工核对
- 检测有固定样例和测试（`scripts/compat-fixtures/`、`scripts/*.test.mjs`），改规则时同步改样例
- 改支持范围时，要同时核对：index.html 兜底脚本的检测项（它按能力检测，判断边界和现在的支持范围对齐）、`.eslintrc.compat.cjs` 的正则规则、`scripts/dist-check.mjs` 的语法规则

**紧急开关**：`compat-check.mjs` 在进程环境变量 `X9_SKIP_COMPAT_CHECK=1` 时跳过检测。
**注意：当前 CI 的 `docker build` 不会把 CI 变量传进构建容器，只在 CI 里设变量不会生效。**
它只用于检测脚本自身故障时的紧急发版，由负责人决定怎么注入，**日常开发和 AI 不得使用**；用过之后要补一次检测。

**更新浏览器数据**（团队约定：每季度一次）：不要用 `pnpm up caniuse-lite`，实测它会顺带升级 typescript、`@parcel/watcher`、`workbox-window`。
做法：只改 `pnpm-lock.yaml` 里 caniuse-lite 的版本号和 npm 上的 integrity，执行 `pnpm install --frozen-lockfile`，再跑测试、构建，并对比更新前后的产物。
2026-11 按这个做法更新过，过程见 `docs/浏览器兼容与白屏兜底-技术方案.md`。

**软性升级提示条**：给版本偏旧、但还在支持范围内的四大浏览器（桌面端），在页面底部提示升级。开关是 `env/.env.*` 里的 `VITE_UPGRADE_BANNER`，默认 `off`；关闭时提示条不会打进产物。
阈值在构建时按 caniuse 数据计算（Chrome / Edge / Firefox 落后最新版 4 个版本，Safari 保留最近 2 个大版本），构建日志会打印算出的结果。说明见 `scripts/upgrade-banner.mjs`。

## 不能动的地方

- **`@vitejs/plugin-legacy` 锁定 5.4.1**：项目实测过，5.4.2 及以上依赖 Vite 5.0.0 没有的 `config.decodedBase`，polyfill 路径会丢掉开头的 `/`，深层路径的页面会白屏。升级 Vite 前不要动它。
- **`eslint-plugin-compat` 锁定 6.2.1**：7.x 需要 ESLint 9 和 Node 22。
- **index.html 开头的兜底脚本**（带 `data-x9-compat`）：
  - 必须是 ES5（`var`、`function`，不能有箭头函数、`const`、模板字符串），产物检测会查；
  - 必须放在所有脚本之前，它要在不支持的浏览器里也能运行，展示「请升级浏览器」；
  - 样式要写在脚本里插入，**不能写成内联 `<style>`**：会被合并进 CSS 包，再被 purgeCss 删掉。
- **purgeCss 只扫描 `src/**/*.vue`**：只在 `.js` / `.ts` 里拼出来的 class 名，会被当成没用的样式删掉。动态 class 要让完整类名出现在 `.vue` 文件里，或者加进 `vite.config.ts` 的 safelist。
- **加密文件**：`vite.config.ts` 的 `originFiles` 里列出的 7 个 `*-o.js`（`src/utils/request-o.js`、`src/utils/c/`、`src/store/c/` 下）是源文件。
  只改 `-o.js`；**`pnpm dev` 已经在运行时**修改它，才会重新生成同名的加密文件。启动 dev 和 `pnpm build` 都不会重新生成，新加的 `-o.js` 也不会自动纳入。
  改完确认加密文件确实更新了，再两个一起提交。不要直接改加密后的文件。
- **`src/store/c/` 和 `main.js` 里标「不可删除」的初始化**不要删。
- **PWA 必须保持可选**：浏览器不支持 Service Worker 时要跳过 PWA、页面照常运行（`main.js`、`App.vue`）。PWA 库在不支持的环境下会直接抛错，导致整站白屏。
- **升级 `@pwa-platform/*` 后要在旧浏览器上实测**：PWA 库生成的 `sw.js` 不经过本项目的语法转换和 polyfill，构建后检查只查语法、查不出新 API（0.4.0 的 `URL.canParse` 就是这样漏过的）。三个包一起升级，至少用 Chrome 80 测后台脚本接管和断网离线页。
- **混淆插件**（`vite-plugin-bundle-obfuscator`）保持关闭（`enable: false`），这是团队决定（2026-11-11，见 `docs/浏览器兼容与白屏兜底-需求文档.md`）。真要开，必须单独立项，并完整复验浏览器兼容。
- **产物文件名**：`assetFileNames` 只用 hash，不带原文件名。PWA 要求产物路径里不能有中文、空格等字符。

## 错误处理

页面不能白屏。现在的兜底分这几层，新代码要配合：

| 场景 | 处理 | 位置 |
|---|---|---|
| 浏览器缺少必需能力（低于支持范围） | 展示「请升级浏览器」，应用不初始化 | index.html 兜底脚本（按能力检测；CSP 禁止动态执行时无法判断语法支持，按支持处理） |
| 启动失败（入口加载失败、卡住） | 10～30 秒后展示「页面没有加载出来」（只给刷新和复制诊断信息；页面随后加载出来会自动关闭） | index.html 兜底脚本 |
| 页面组件渲染不出来 | 页面主体换成错误页，导航还能用，换页面就恢复 | `src/components/PageErrorBoundary` |
| App / Layout 渲染不出来 | 整页「页面没有加载出来」（同上） | `main.js` 的 `errorHandler` |
| 路由跳转时页面分包加载失败 | 能读写 sessionStorage、且 60 秒内没刷新过：自动刷新一次；否则页面主体显示错误页（旧页面虽然还在，也会被替换）。非路由的动态 import 失败不刷新 | `src/utils/chunkReload.js` |
| 不存在的地址 | 404 页 | 路由表最后一条 |

- 兜底文案保持轻描淡写：加载失败多数刷新就能解决，不写「失败」「抱歉」，不推荐换浏览器（只有「版本过低」才推荐）。
- 渲染错误的兜底**只在路由页面或根组件确实渲染成空时**介入：页面里某个子组件报错、事件回调报错，只记录，页面保持原样。业务代码仍要自己处理可预期的错误（接口失败、数据为空等），不能靠兜底。
- 异步代码（接口请求、`setTimeout`、事件回调）里的错误，Vue 不一定能捕获，要自己 try/catch，给用户合适的提示。
- 想记录意外错误、方便排查：`import { reportError } from '@/utils/pageError'`，调用 `reportError(err, '来源')`。
  错误会进入「复制诊断信息」，生产环境的控制台也能看到。生产构建开了 `drop_console`，直接写 `console.error` 会被删掉。
- 诊断信息**只做了局部脱敏**：只把「页面」那一行网址查询串里的 `token`、`userId`、`fingerprintId` 去掉（列表在 index.html 的 `SENSITIVE_PARAMS`，新增敏感参数时同步加）。
  网址 hash、错误信息、堆栈、资源地址都不脱敏，不要把敏感信息写进错误信息里。

## 编码约定（团队约定）

- 新组件用 `<script setup>`（可用 `lang="ts"`）；老代码里的选项式写法，改动时不用顺手重写
- 注释、提交信息用中文；提交信息带 `feat:`、`fix:`、`refactor:`、`chore:` 前缀；分支名 `feat/NX-<工单号>`
- 格式：Prettier（不加分号、单引号、行宽 100），配置见 `.prettierrc.json`
- 接口：在 `src/api/` 对应的业务文件里加方法，通过 `@/utils/request` 发请求，不要在页面里直接用 axios
- 样式：SCSS，`scoped`；颜色用 `theme.scss` 里的 CSS 变量，同时考虑暗色主题（`html.dark`）；主题色 `#d02d54`
- 纯函数尽量放 `src/utils/`，在旁边写 `*.test.js`（用 `node:test`；不要引用 `@/` 别名，用相对路径）
- 改动只做需求要求的部分，不顺手重构无关代码
- 新代码按 `docs/目录约定.md` 放置和复用（放在哪个目录、常用功能用哪个首选函数）

## 提交前自查

1. `pnpm test` 通过
2. `pnpm build` 通过（包含源码和产物两道兼容检测）
3. 用到了新的浏览器 API → 已先判断再用，并有不支持时的替代方案
4. 改了 index.html 兜底脚本 → 仍是 ES5，没有写内联 `<style>`
5. 涉及页面展示 → 在线上或 pre 接口下实际打开看过，接口正常、没有新的报错

## 文档索引

- `docs/` 下按需求存放方案文档，命名带工单号，例如 `pwa-platform-onboarding-NX-2031.md`
- 浏览器兼容与白屏兜底：`docs/浏览器兼容与白屏兜底-需求文档.md`、`docs/浏览器兼容与白屏兜底-技术方案.md`
