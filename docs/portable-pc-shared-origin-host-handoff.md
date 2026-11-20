# PC 可移植 PWA 宿主接入交接文件

本文件交给现有 Vue 3 + Vite PC 项目的开发者或 AI 编程助手。目标是让 PC 项目在域名根路径 `/` 提供应用壳、更新提示和离线页，同时让独立 H5 项目继续使用 `/m/`。PC 构建一次后，同一份 `dist/` 可以部署到构建时未知的多个 HTTPS 域名。以下示例使用已发布的 `@pwa-platform/*@0.3.0`。

这是**宿主接入说明**，不是放进 `public/` 的站点文件。宿主应先读自己的依赖、入口、旧 PWA、路由和部署配置，再把示例合入现有项目；不要覆盖已有业务代码。`appId`、产品名称和图标须换成宿主实际值。若这些身份字段已经在生产注册过，先核对原值，不要直接改名。

## 目标和边界

- PC 的 `base`、`scope`、`mountPath` 均为 `/`；独立 H5 由服务器在 `/m/` 提供。
- `deployment.kind` 为 `portable`；身份和共享登记表都不写域名。
- `topology.kind` 为 `shared-origin`；登记表 v2 声明 H5 占用 `/m/`。根 worker 对 `/m` 生成排除规则，不预缓存 H5 文件，也不向 H5 返回 PC 离线页。
- PC 预缓存自己的应用壳和构建资产，网络失败时提供平台生成的中文离线页；开启更新提示。`runtimeCache` 和 `offlineWrites` 均关闭。不要添加业务 API、用户数据或私有页面缓存。
- H5 当前无需接入 PWA；登记表中的 H5 worker 和 manifest 路径是将来接入时的路径约定，不会由 PC 构建生成。

## 宿主需要检查和修改的文件

| 文件 | 处理方式 |
| --- | --- |
| `package.json`、锁文件 | 安装同版本的三个平台包；保留现有 Vue、Vite 和业务依赖 |
| `pwa.config.ts` | 新增，集中声明 PC 身份、共享登记表、安装信息和策略 |
| `vite.config.ts` | 合入 `pwa(...)`，保留现有插件、别名和构建选项 |
| `tsconfig.json` 或实际检查 `vite.config.ts` 的配置 | 支持 `.ts` 扩展名导入；保持 `noEmit`，不要覆盖其他类型配置 |
| `src/vite-env.d.ts` | 增加虚拟模块类型引用；确保被 TypeScript 包含 |
| `src/main.ts` | 安装 Vue PWA 绑定；保留现有 router、store 等注册 |
| 根组件或根布局，如 `src/App.vue` | 注册 worker 并放置更新提示；保留现有业务页面 |
| `index.html` | 保留现有页面；移除与新插件冲突的旧 manifest 链接 |
| `public/icons/*.png` | 提供四张真实 PNG 图标，实际尺寸须与声明一致 |
| 实际部署配置 | 给 `/m/` 独立路由和正确响应头；按实际 Nginx、Cloudflare Pages 或 CDN 语法实现 |

如已有 `vite-plugin-pwa`、手写注册、旧 worker、旧 manifest 或旧更新提示，先确认它们的功能和线上历史，再迁移；不能让两套机制同时生成或注册根路径 worker。不要删除与业务仍有关的代码。

### 安装依赖

在宿主项目里使用其现有包管理器。npm 示例：

```bash
npm install @pwa-platform/vue@0.3.0
npm install -D @pwa-platform/vite@0.3.0 @pwa-platform/contracts@0.3.0
```

`@pwa-platform/contracts` 供配置文件导入类型。保留宿主原有 Vue、Vite、`@vitejs/plugin-vue` 和 TypeScript 版本；平台公开接入范围为 Vite 5／8、Vue >=3.4 且 <4。构建使用 Node 22；若宿主采用 Vite 8，Node 至少 22.12。

### `pwa.config.ts`

```ts
import type {
  PwaInstallMetadata,
  PwaPolicyV3,
  PwaPortableIdentity,
  PwaPortableOriginRegistry,
} from "@pwa-platform/contracts";

export const IDENTITY: PwaPortableIdentity = {
  appId: "businessapp-pc",
  manifestId: "/",
  scope: "/",
  mountPath: "/",
  serviceWorkerUrl: "/sw.js",
  manifestUrl: "/manifest.webmanifest",
  environment: "production",
  cacheNamespaceSeed: "r1",
};

export const REGISTRY: PwaPortableOriginRegistry = {
  schemaVersion: 2,
  registryVersion: 1,
  environment: IDENTITY.environment,
  root: {
    appId: IDENTITY.appId,
    scope: IDENTITY.scope,
    serviceWorkerUrl: IDENTITY.serviceWorkerUrl,
    manifestId: IDENTITY.manifestId,
    manifestUrl: IDENTITY.manifestUrl,
  },
  children: [
    {
      appId: "businessapp-h5",
      scope: "/m/",
      serviceWorkerUrl: "/m/sw.js",
      manifestId: "/m/",
      manifestUrl: "/m/manifest.webmanifest",
    },
  ],
};

export const INSTALL: PwaInstallMetadata = {
  startUrl: "/",
  display: "standalone",
  name: "PC 业务系统",
  shortName: "业务系统",
  themeColor: "#087b8b",
  backgroundColor: "#ffffff",
  icons: [
    { src: "/icons/192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/icons/192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
    { src: "/icons/512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/icons/512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
};

export const POLICY: PwaPolicyV3 = {
  schemaVersion: 3,
  install: { enabled: true },
  updateMode: "prompt",
  offlineFallback: { enabled: true, path: "/offline.html" },
  networkTimeoutSeconds: 5,
  resources: [
    { pathPrefix: "/", resourceClass: "navigation-public-static", cache: "network-first" },
    { pathPrefix: "/index.html", resourceClass: "asset", cache: "cache-first" },
    { pathPrefix: "/assets", resourceClass: "asset", cache: "cache-first" },
  ],
  offlineWrites: { enabled: false, maxEntries: 0, maxTotalBodyBytes: 0, targets: [] },
  runtimeCache: { enabled: false, maxEntries: 0, maxEntryBytes: 0, maxAgeSeconds: 0 },
};
```

上面的 `/assets` 假设宿主使用 Vite 默认 `build.assetsDir`；如果实际目录不同，按最终公开路径调整。`registryVersion` 只有登记表内容改变时才递增。可移植配置不能加 `origin`。

### `vite.config.ts`

将以下 PWA 部分合入宿主原有配置。现有 Vue 插件、业务插件、别名、代理和构建选项保留。若后置插件会改写最终 JS/CSS，确保 `pwa()` 读取的是最终资产。

```ts
import { pwa } from "@pwa-platform/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { IDENTITY, INSTALL, POLICY, REGISTRY } from "./pwa.config.ts";

export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    pwa({
      deployment: { kind: "portable" },
      identity: IDENTITY,
      policy: POLICY,
      install: INSTALL,
      topology: { kind: "shared-origin", registry: REGISTRY },
      offlinePage: { locale: "zh-CN" },
    }),
  ],
});
```

### `tsconfig.json` 和 `src/vite-env.d.ts`

若 `vite.config.ts` 使用 `"./pwa.config.ts"` 导入，在检查它的 TypeScript 配置中需要 `allowImportingTsExtensions: true` 和 `noEmit: true`。仅添加缺少的字段，不替换整个宿主 `tsconfig`：

```json
{
  "compilerOptions": {
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

在 `src/vite-env.d.ts` 保留已有声明，并加入：

```ts
/// <reference types="vite/client" />
/// <reference types="@pwa-platform/vite/virtual" />
```

### `src/main.ts`

在现有 `createApp` 到 `mount` 的流程中安装绑定；已有 router 和 store 仍按宿主原顺序注册。

```ts
import config from "virtual:pwa-config";
import { createPwa } from "@pwa-platform/vue";
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
app.use(createPwa({ config, updateCheck: { intervalMs: 1_800_000 } }));
app.mount("#app");
```

### 根组件或根布局

将 PWA 逻辑合入现有根组件。示例中的 `<main>` 只代表原有业务内容；有路由时保留 `<RouterView />`。如果业务有未保存表单，把更新组件的 `reloadPage` 接到已有离页确认逻辑。

```vue
<script setup lang="ts">
import { usePwa } from "@pwa-platform/vue";
import { PwaUpdateNotice } from "@pwa-platform/vue/ui";
import "@pwa-platform/vue/update-notice.css";
import { onMounted } from "vue";

const pwa = usePwa();
onMounted(() => {
  if (!import.meta.env.PROD) return;
  void pwa.register().catch((error: unknown) => {
    console.error("PWA worker 注册失败", error);
  });
});
</script>

<template>
  <main><!-- 原有 PC 页面或 RouterView --></main>
  <PwaUpdateNotice position="bottom-right" />
</template>
```

### `index.html`、图标和自动生成文件

保留宿主现有 `index.html` 的业务 meta、标题和入口脚本。最小示例如下；让插件注入 manifest 链接，如有旧手写 manifest 链接，迁移后移除，避免出现两份。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PC 业务系统</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

将四张真实 PNG 放到 `public/icons/`，分别为 192×192、192×192 maskable、512×512、512×512 maskable。不要创建 `public/offline.html`、`public/manifest.webmanifest` 或手写 `public/sw.js`：插件会在生产构建中生成这些文件。

## 执行和验证

1. 用宿主已有命令完成类型检查和生产构建；通常是 `npm run typecheck`、`npm run build`。如果脚本尚无，分别运行宿主兼容的 `vue-tsc --noEmit` 和 `vite build`。`vite dev` 不生成平台 worker，不能据此验证离线或更新。
2. 检查产物含 `index.html`、`sw.js`、`manifest.webmanifest`、`offline.html`、`pwa-recovery-worker.js`、业务 JS/CSS 和四个图标。`index.html` 应只有一处 manifest 链接；根 `sw.js` 的最终配置应有 `{ pathPrefix: "/m", action: "exclude" }`，且 `runtimeCache.enabled` 为 `false`。PC 的预缓存清单不应包含 `/m/` 文件。
3. 用生产预览或 HTTPS 测试环境做浏览器验收：首次注册后刷新，断网访问已缓存的 PC 入口可看到应用壳；访问未缓存的深层路径在网络失败时看到离线页；发布新构建后出现更新提示。检查私有 API 不进入 Cache Storage。
4. 部署时在每个目标 HTTPS 域名把同一份 PC `dist/` 放在根路径，并在服务器/CDN 中把 `/m/` 优先路由到 H5 项目，`/m` 重定向到 `/m/`。本地 Vite preview 没部署 H5，不能用它判断生产 `/m/` 路由是否正确。
5. 线上响应头：入口与离线 HTML、`sw.js`、manifest 使用 `Cache-Control: no-cache`；`sw.js` 返回 JavaScript MIME 且 HEAD 返回 2xx；带指纹 JS/CSS 使用正数 `max-age` 与 `immutable`，旧指纹资产按发布保留规则继续可用。平台文件缺失时返回 404，不能由 PC SPA 回退成 HTML。每个实际域名都独立验收。

首次生产发布之前，应记录并核对 PC 的稳定身份字段；以后变更身份或登记表按迁移和发布流程处理。产物构建成功不代表真实宿主的路由、响应头、离线和更新已通过，验收报告须区分“通过”“失败”“未验证”。

## 官方接入清单和参考文档

`@pwa-platform/vite@0.3.0` 包内有 `skills/pwa-onboarding/SKILL.md`，可复制到宿主仓库供 AI 助手使用：Codex 放 `.agents/skills/pwa-onboarding/`，Claude Code 放 `.claude/skills/pwa-onboarding/`。该 skill 是工作清单；本文件提供这个 PC + H5 可移植场景的具体值。

```bash
# 宿主使用 Codex 时
mkdir -p .agents/skills
cp -R node_modules/@pwa-platform/vite/skills/pwa-onboarding .agents/skills/pwa-onboarding

# 宿主使用 Claude Code 时
mkdir -p .claude/skills
cp -R node_modules/@pwa-platform/vite/skills/pwa-onboarding .claude/skills/pwa-onboarding
```

之后 Codex 可在提示词中写 `$pwa-onboarding`，Claude Code 可写 `/pwa-onboarding`。若宿主项目已经放了同名 skill，先核对版本，不要盲目嵌套复制。

- [包选择与 AI 接入清单](https://pwa-platform-docs.pages.dev/start/choose)
- [Vue 接入](https://pwa-platform-docs.pages.dev/start/vue)
- [可移植部署](https://pwa-platform-docs.pages.dev/guide/portable-deployment)
- [同源多应用发布](https://pwa-platform-docs.pages.dev/operations/release)
- [服务器与 CDN 配置](https://pwa-platform-docs.pages.dev/operations/hosting)

## 可直接交给宿主 AI 的提示词

> 请阅读随附的《PC 可移植 PWA 宿主接入交接文件》，并在**当前宿主仓库**实际完成接入。先只读检查 `package.json`、锁文件、Vite/TypeScript 配置、`index.html`、`src/main.ts`、根组件、现有 PWA 代码与部署路由；确认项目是 Vue 3 + Vite，记录现有生产 PWA 身份。目标：PC 部署在 `/`，独立 H5 在 `/m/`，同一份 PC 构建产物部署到构建时未知的多个域名；使用 `@pwa-platform/vite`、`@pwa-platform/vue`、`@pwa-platform/contracts` 的 `0.3.0` 版、`deployment.kind: "portable"`、v2 共享登记表、根 worker 排除 `/m`，实现 PC 应用壳、中文离线页、更新提示，关闭运行时缓存与离线写入。按交接文件将配置合入已有代码，保留路由、状态管理、构建插件与业务功能；不要凭空编造图标、生产身份或服务器设置。若已有 PWA，先核对线上迁移影响再处理冲突。完成后运行宿主的类型检查和生产构建，检查生成文件、`/m` 排除规则和 `runtimeCache.enabled: false`，能用浏览器时再验证离线与更新。按实际托管平台准备 `/m/` 路由和响应头配置。最后列出改动文件、验证结果、未验证项及需要业务方提供的真实值。不要把本说明文件复制进 `public/` 或 `dist/`。
