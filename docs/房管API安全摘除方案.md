# 房管 API 安全摘除方案

## 背景

房管功能（分支 `x9-3393`，开发于 2025-02 ~ 2025-04）从未经过验收、从未实际启用。  
当前打包产物中包含完整的后台管理 API 路径（禁言、拉黑、删消息、审批等），这些 URL 暴露在客户端 JS 里，存在被恶意探测或直接调用的安全风险。

## 目标

**最小化安全摘除**：抹掉打包产物中的所有房管 API URL，杜绝接口被探测或调用，同时不影响任何已上线功能。

## 现状分析

### 涉及文件

| 文件 | 角色 |
|---|---|
| `src/api/housManage.js` | 所有房管 API URL 的唯一来源（12 个接口函数） |
| `src/store/modules/house.js` | 调用 `getHouseRoomManager`，但该 action 在 `App.vue` 中**已被注释** |
| `src/components/chatBox/components/tabsWorkBench/index.vue` | import 3 个审批接口 |
| `src/components/chatBox/components/tabsUser/index.vue` | import 3 个用户查询接口 |
| `src/components/chatBox/components/tabsUser/searchQueryList.vue` | import 2 个禁言/拉黑接口 |
| `src/components/chatBox/components/tabsMessage/index.vue` | import 1 个消息列表接口 |
| `src/components/chatBox/components/chatDetail/index.vue` | import `definChatDeleted`，有真实调用逻辑 |
| `src/views/member/myApplication/index.vue` | import `getOperateList` |

### 为什么 UI 层当前不会触发请求

1. `App.vue:195` 的 `store.dispatch('house/houseRoomManagerStore')` **已注释**，`houseAuthor` 永远是空对象 `{}`
2. `isHouse = Object.keys(houseAuthor).length === 0`，永远为 `true`
3. 所有房管 Tab（用户 / 消息 / 工作台）均有 `!isHouse` 的 `v-if` guard，永远不渲染
4. `chatDetail` 的删除按钮有双重 guard：`!isHouse && isDetelePermiss`，同样永远不显示

但 **API URL 字符串仍会被 Vite 打包进产物**，这是当前唯一的安全风险点。

## 方案：只改 1 个文件

### 改动内容

将 `src/api/housManage.js` 内容替换为空 stub，导出签名保持不变：

```js
// 房管 API 已下线，接口入口已移除
// 所有导出保留签名以避免 import 侧报错，实际不发起任何网络请求
export const myApprovalTodo = () => Promise.resolve({})
export const myApprovalDone = () => Promise.resolve({})
export const getHouseRoomManager = () => Promise.resolve({})
export const getRoomUserList = () => Promise.resolve({})
export const getBanList = () => Promise.resolve({})
export const getBlockList = () => Promise.resolve({})
export const submitBlockOperation = () => Promise.resolve({})
export const submitBanOperation = () => Promise.resolve({})
export const definApproval = () => Promise.resolve({})
export const delChatRoomMessage = () => Promise.resolve({})
export const definChatDeleted = () => Promise.resolve({})
export const getOperateList = () => Promise.resolve({})
```

### 为什么只改这 1 个文件就够

- 所有 8 处 import 的调用方**一行不需要动**，不会有 build 报错
- API URL 字符串从源头消失，打包产物中不再包含 `chat_room_manager`、`approval` 等路径
- 运行时：房管 UI 本就不渲染（见上方 guard 分析），stub 函数不会被调用；即便万一被调用，返回空 Promise 也不会抛错

### 与"全量删除"方案的对比

| 维度 | 全量删除（删文件 + 修所有 import） | 本方案（stub 化） |
|---|---|---|
| 改动文件数 | 9+ | **1** |
| Build 报错风险 | 有（需逐一修 import） | 无 |
| 引入新 bug 风险 | 有（漏改某处调用） | 无 |
| 安全目标达成 | ✅ | ✅ |
| UI 行为变化 | 无（本来就不渲染） | 无 |

## 验收标准

改动后执行以下验证：

```bash
# 构建产物中不应出现任何房管 API 路径
grep -r "chat_room_manager\|api/approval" dist/
# 预期：无任何输出
```

- [ ] `dist/` 目录下所有 JS 文件中，不包含 `chat_room_manager` 字符串
- [ ] `dist/` 目录下所有 JS 文件中，不包含 `api/approval` 字符串
- [ ] 本地 `npm run dev` 启动无报错
- [ ] 直播间聊天、用户体系等已上线功能运行正常

## 风险评估

| 风险项 | 等级 | 说明 |
|---|---|---|
| 构建失败 | 无 | 导出签名不变，import 方无感知 |
| 运行时报错 | 无 | stub 返回空 Promise，现有 guard 保证不会被调用 |
| 功能回归 | 无 | 房管功能从未启用，无用户依赖 |
| 遗漏 API 路径 | 无 | 所有 URL 集中在单一文件，已全量替换 |

## 后续建议（非本次范围）

- UI 组件层（`tabsWorkBench`、`tabsUser`、`tabsMessage`、`myApplication`）可在后续迭代中按需清理，当前不影响安全目标
- `src/utils/usePermision.js` 的权限 hook 同样可在后续清理，当前已无实际调用场景
- `src/store/modules/house.js` 的 action 虽已注释，后续可整体移除该 module

---

*文档生成日期：2026-10-15*
