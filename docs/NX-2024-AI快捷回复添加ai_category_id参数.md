# NX-2024 AI快捷回复添加isAiCategory参数标识

## 需求概述

在主播私聊场景下，当用户点击 AI 预设问题发送消息时，需要在调用发送消息接口时新增参数 `isAiCategory`，用于后端标识该消息是否来自 AI 快捷回复。

## 实现方案

### 1. 数据流转链路

```
用户点击 AI 预设问题
  ↓
aiPresetQuestions 组件 emit('select', question) 
  ↓
chatDetail 组件接收 onPresetSelect(question)
  ↓
调用 operationPanel.sendMessage(MESSAGE_TYPE.TEXT, question.text, undefined, 1)
  ↓
sendMessage 构造 params 对象，包含 isAiCategory: 1
  ↓
sendData 函数调用 HomedApi.sendToAnchor(data)
  ↓
后端接收 isAiCategory 参数
```

### 2. 代码改动清单

#### 2.1 类型定义修改

**文件：`types/global.d.ts`**

在 `SendMessageItem` 类型中新增字段：

```typescript
type SendMessageItem = {
  // ... 原有字段
  isAiCategory?: number // AI 快捷回复标识，值为 1 表示通过快捷问题发送
}
```

#### 2.2 AI 预设问题组件修改

**文件：`src/components/chatBox/components/aiPresetQuestions/index.vue`**

修改 emit 事件定义，传递完整的 question 对象而不是只传递 text：

```typescript
// 修改前
const emit = defineEmits<{
  (e: 'select', text: string): void
  // ...
}>()

function pick(q: AiCategory) {
  if (!canClick.value) return
  expanded.value = false
  emit('select', q.text)
}

// 修改后
const emit = defineEmits<{
  (e: 'select', question: AiCategory): void
  // ...
}>()

function pick(q: AiCategory) {
  if (!canClick.value) return
  expanded.value = false
  emit('select', q)  // 传递完整对象（包含 id 和 text）
}
```

#### 2.3 聊天详情组件修改

**文件：`src/components/chatBox/components/chatDetail/index.vue`**

修改 `onPresetSelect` 方法，接收完整 question 对象并传递固定值 1：

```typescript
// 修改前
async function onPresetSelect(text: string) {
  const panel = operationPanelRef.value
  if (!panel) return
  if (typeof panel.sendMessage === 'function') {
    panel.sendMessage(MESSAGE_TYPE.TEXT, text)
  }
}

// 修改后
async function onPresetSelect(question: { id: number; text: string }) {
  const panel = operationPanelRef.value
  if (!panel) return
  if (typeof panel.sendMessage === 'function') {
    panel.sendMessage(MESSAGE_TYPE.TEXT, question.text, undefined, 1)
    // 第1个参数：消息类型（文本）
    // 第2个参数：消息内容
    // 第3个参数：undefined（使用自动生成的 seed）
    // 第4个参数：固定值 1（标识为 AI 快捷回复）
  }
}
```

#### 2.4 操作面板组件修改

**文件：`src/components/chatBox/components/operationPanel/index.vue`**

**修改 1：sendMessage 函数签名**

```typescript
// 修改前
const sendMessage = useDebounceFn(
  async (msg_type: MESSAGE_TYPE, content: string | File | Object, presetSeed?: string) => {
    // ...
  }
)

// 修改后
const sendMessage = useDebounceFn(
  async (msg_type: MESSAGE_TYPE, content: string | File | Object, presetSeed?: string, isAiCategory?: number) => {
    // 第1个参数：消息类型
    // 第2个参数：消息内容
    // 第3个参数：预设的 seed ID（可选，不传则自动生成）
    // 第4个参数：AI 快捷回复标识（可选，值为 1 表示快捷回复）
  }
)
```

**修改 2：params 对象构造**

```typescript
let params: Partial<SendMessageItem> = {
  vid: props.vid,
  uid: props.uid,
  type: props.chatType,
  method: 'notice',
  msg_type,
  color: '#000',
  contentType: 1,
  sender: currentUserId.value,
  seed: presetSeed || genSeedId(),
  time: new Date(),
  text: undefined,
  pic: undefined,
  video: undefined,
  sender_exp: userInfo.value.exp || '1',
  sender_nickname: userInfo.value.user_nickname || '游客' + currentUserId.value,
  avatar: userInfo.value.avatar || defaultAvatar,
  sender_user_type: userInfo.value.user_type || 0,
  ...(isAiCategory ? { isAiCategory } : {}) // 条件添加：只在值存在时才添加该字段
}
```

**重要**：使用扩展运算符条件添加 `isAiCategory` 字段，确保：
- 当 `isAiCategory` 有值（为 `1`）时：添加 `isAiCategory: 1` 到对象
- 当 `isAiCategory` 为 `undefined` 时：不添加该字段（字段完全不存在）

这样可以避免向后端传递 `isAiCategory: undefined`。

### 3. 数据传递说明

#### 3.1 参数说明

- **参数名**：`isAiCategory`
- **参数类型**：`number`
- **参数值**：固定值 `1`
- **含义**：标识该消息是否通过 AI 快捷回复发送
  - `1`：表示通过 AI 快捷回复发送
  - 不传或 `undefined`：表示非快捷回复（手动输入等）

#### 3.2 传递时机

- ✅ **传递场景**：用户点击 AI 预设问题按钮发送消息，传递固定值 `1`
- ❌ **不传递场景**：
  - 用户手动输入文字发送
  - 发送图片/表情
  - 发送视频
  - 其他任何非 AI 预设问题触发的发送

#### 3.3 接口影响范围

- ✅ `/api/chat/sendToAnchor` - 主播私聊接口，需要支持此参数
- ❌ `/api/chat/sendToAssistant` - 客服私聊接口，不涉及
- ❌ `/api/chat/sendMessage` - 公共聊天接口，不涉及

### 4. 验证要点

#### 4.1 功能验证

1. 进入主播私聊场景
2. 点击 AI 预设问题
3. 检查网络请求，确认 `/api/chat/sendToAnchor` 请求中包含 `isAiCategory` 参数
4. 参数值应为固定值 `1`

#### 4.2 兼容性验证

1. 手动输入文字发送，确认 `isAiCategory` 不传递（或为 undefined）
2. 发送图片/表情，确认不影响原有功能
3. 客服私聊、公共聊天不受影响

#### 4.3 类型安全

- `SendMessageItem` 类型中 `isAiCategory` 为可选字段（`?: number`）
- 不会破坏现有代码的类型检查
- `sendMsgOmitKeys` 中不包含 `isAiCategory`，确保参数正确传递到接口

### 5. 测试场景

#### 5.1 正常场景

| 场景 | 操作 | 预期结果 |
|------|------|----------|
| 点击 AI 预设问题 | 点击任意 AI 问题 | 发送接口包含 `isAiCategory: 1` |
| 手动输入发送 | 输入文字后点击发送 | 发送接口**不包含** `isAiCategory` 字段 |
| 发送图片 | 选择图片发送 | 正常发送，不包含 `isAiCategory` 字段 |
| 发送表情 | 选择表情发送 | 正常发送，不包含 `isAiCategory` 字段 |

#### 5.2 边界场景

| 场景 | 操作 | 预期结果 |
|------|------|----------|
| 快速连续点击 AI 问题 | 短时间内多次点击 | 每次发送都携带 `isAiCategory: 1` |
| 切换不同 AI 问题 | 点击不同的问题 | 每次都传递 `isAiCategory: 1`（值固定） |
| 客服私聊场景 | 在客服私聊中发送消息 | 不受影响，原功能正常 |
| 公共聊天场景 | 在公共聊天中发送消息 | 不受影响，原功能正常 |

### 6. 后端接口说明

后端接口 `/api/chat/sendToAnchor` 需要支持接收可选参数 `isAiCategory`：

```typescript
// 请求参数
{
  // ... 原有参数
  isAiCategory?: number  // 可选，值为 1 表示通过 AI 快捷问题发送
}
```

后端应该：
1. 识别出哪些消息是通过 AI 快捷问题发送的（`isAiCategory === 1`）
2. 用于统计快捷回复的使用情况

### 7. 注意事项

1. **向后兼容**：`isAiCategory` 是可选参数，不会影响现有功能
2. **数据完整性**：只在用户点击 AI 预设问题时传递固定值 `1`，其他场景**不传递该字段**（字段不存在，而非值为 `undefined`）
3. **类型安全**：已在类型定义中添加，确保 TypeScript 类型检查通过
4. **参数过滤**：使用条件扩展运算符 `...(isAiCategory ? { isAiCategory } : {})`，确保 `undefined` 时字段不存在
5. **固定值**：该参数仅作为标识符，值固定为 `1`，不传递具体问题 ID

### 8. 技术实现细节

#### 条件添加属性

使用 JavaScript 扩展运算符条件添加属性，避免传递 `undefined`：

```typescript
// ❌ 错误写法（会传递 isAiCategory: undefined）
let params = {
  // ...
  isAiCategory
}

// ✅ 正确写法（undefined 时字段不存在）
let params = {
  // ...
  ...(isAiCategory ? { isAiCategory } : {})
}
```

这确保了：
- `isAiCategory = 1` → 对象包含 `{ isAiCategory: 1 }`
- `isAiCategory = undefined` → 对象不包含 `isAiCategory` 字段

### 9. 相关文件

- `types/global.d.ts` - 类型定义
- `src/components/chatBox/components/aiPresetQuestions/index.vue` - AI 预设问题组件
- `src/components/chatBox/components/chatDetail/index.vue` - 聊天详情组件
- `src/components/chatBox/components/operationPanel/index.vue` - 操作面板组件
- `src/components/chatBox/chatHelper.ts` - 辅助函数（`sendMsgOmitKeys` 定义）
- `src/api/home.js` - 接口定义

### 10. 开发时间

2026-10-23 初始实现  
2026-10-27 修复：条件添加属性避免传递 undefined

---

## PR 信息

### 需求背景

在主播私聊场景下，需要标识消息是否来自 AI 快捷回复。当用户点击AI预设问题发送消息时，需要在发送接口中新增 `isAiCategory` 参数传递给后端。

### 参数说明

- **参数名**: `isAiCategory`
- **参数类型**: `number`
- **参数值**: 固定值 `1`
- **含义**: `1` 表示该消息通过 AI 快捷回复发送
- **使用场景**: 仅在用户点击 AI 预设问题时传递

### 数据流转

```
用户点击AI预设问题
  ↓
aiPresetQuestions emit('select', question)
  ↓
chatDetail.onPresetSelect(question)
  ↓
operationPanel.sendMessage(MESSAGE_TYPE.TEXT, question.text, undefined, 1)
  ↓
构造 params: ...(isAiCategory ? { isAiCategory } : {})
  ↓
sendData → sendToAnchor 接口
  ↓
后端接收 isAiCategory: 1
```

### 参数传递规则

- ✅ **传递场景**：用户点击 AI 预设问题发送消息，传递 `isAiCategory: 1`
- ❌ **不传递场景**：手动输入文字、发送图片/表情/视频等，字段不存在

### 影响范围

- ✅ 仅影响主播私聊场景（`/api/chat/sendToAnchor` 接口）
- ❌ 客服私聊、公共聊天不受影响
- ✅ 可选参数设计，不破坏现有功能

### 测试要点

#### 功能测试
1. 进入主播私聊
2. 点击 AI 预设问题
3. 检查网络请求，确认 `isAiCategory` 参数值为 `1`

#### 兼容性测试
1. 手动输入文字发送 - 确认请求中**不包含** `isAiCategory` 字段（字段不存在，而非值为 undefined）
2. 发送图片/表情 - 确认原有功能正常，请求中不包含 `isAiCategory` 字段
3. 客服私聊/公共聊天 - 确认不受影响

### 提交记录

- **1ef98bfa** - feat: AI快捷回复添加isAiCategory参数标识（初始实现）
- **69a9a008** - fix: 修复非快捷回复场景传递isAiCategory字段的问题（条件添加属性）

### 问题修复说明

**修复前问题**：手动输入发送时，`params` 对象中使用 `isAiCategory` 会导致即使值为 `undefined`，该字段仍然被发送到后端。

**原因**：JavaScript 对象简写语法 `{ isAiCategory }` 会将属性添加到对象中，即使值为 `undefined`。

**解决方案**：使用条件扩展运算符 `...(isAiCategory ? { isAiCategory } : {})` 确保只在有值时才添加字段。

**效果对比**：

| 场景 | 修复前 | 修复后 |
|------|--------|--------|
| 点击AI问题 | `{ isAiCategory: 1 }` | `{ isAiCategory: 1 }` ✅ |
| 手动输入 | `{ isAiCategory: undefined }` ❌ | 无此字段 ✅ |
| 发送图片 | `{ isAiCategory: undefined }` ❌ | 无此字段 ✅ |

