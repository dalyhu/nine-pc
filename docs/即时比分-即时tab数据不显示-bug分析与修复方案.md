# 即时比分 - 即时 tab 默认不显示数据 Bug 分析与修复方案

> 文档时间: 2026-06-30
> 涉及模块: `src/views/score/football.vue`、`src/views/score/football-0.vue`
> 影响范围: 仅足球即时比分页 - "即时" sub-tab(篮球、电竞不受影响)

## 一、问题现象

进入"即时比分"菜单后,默认停留在"即时" tab,接口已返回数据但列表区域为空白。

复现路径:

1. 点击菜单"即时比分" → 进入页面,默认 `tabIndex = 0`(即时 tab)。
2. 接口 `football_match(type=1) + football_match(type=2)` 正常返回数据。
3. 列表标题(进行中/未开始/已结束 等)和数据均未渲染。
4. 点击左侧浮动按钮组中的"隐藏",数据全部显示出来。
5. 用户疑问: "隐藏是默认就生效了吗?"

**结论先行**: 默认并未生效"隐藏"功能,默认 `setConf.action = 0`(不操作)。点击"隐藏"显示数据是 watch 副作用导致的现象,与"隐藏"业务语义完全无关。

## 二、即时 tab 整体功能架构

### 2.1 组件层级

```
football.vue (父组件 / 容器)
├── 顶部 tabList: 即时(0) / 赛果(1) / 赛程(2) / 预约(3)
├── 左侧浮动按钮组(仅 tabIndex == 0 时显示)
│   ├── 预约 → collect()   收藏勾选的比赛
│   ├── 保留 → retain()    setConf.action = 1
│   └── 隐藏 → conceal()   setConf.action = 2
├── 头部筛选区(语言、欧亚大、搜索、赛事/国家、时间)
└── 内容区
    ├── football-0.vue (即时, v-show)   ← 本次 bug 焦点
    ├── football-1.vue (赛果, v-if)
    ├── football-2.vue (赛程, v-if)
    └── football-3.vue (预约, v-if)
```

### 2.2 数据流(即时 tab)

```
后端 football_match(type=1) + football_match(type=2)
   ↓ Promise.all
父 getList()                       (football.vue:1270)
   ↓ setArr(分组+加标题行+置顶处理)
父 dataList1 = arrList              (football.vue:1488)
   ↓ computed list1 = filterInvalidTitles('football', dataList1, topList)
父向子传 :list="list1" :setConf="setConf"
   ↓
子 props.list / props.setConf      (football-0.vue:620)
   ↓ 仅 watch.setConf (deep) 才写
子 listFilter = list.filter(...)   (football-0.vue:689、698)
   ↓
<RecycleScroller :items="listFilter">  ← 实际渲染源 (football-0.vue:190)
```

### 2.3 预约 / 保留 / 隐藏 三个浮动按钮的设计意图

| 按钮 | 父组件方法 | 业务语义 | 关键状态 |
|------|---------|--------|--------|
| 预约 | `collect()`  football.vue:1006 | 把勾选(`footList`)的比赛调 collect 接口收藏,可在"预约" sub-tab 看到 | 调后端 collect,不改 `setConf` |
| 保留 | `retain()`   football.vue:988  | "保留"勾选的比赛、其余隐藏,`setConf.action` 在 0 ↔ 1 之间切换 | `action = 1`: 仅渲染 `footList.includes(x.id)` 的项 |
| 隐藏 | `conceal()`  football.vue:974  | "隐藏"勾选的比赛,`setConf.action` 在 0 ↔ 2 之间切换 | `action = 2`: 仅渲染 `!footList.includes(x.id)` 的项 |

`actionClass` 高亮规则: `setConf.action === 1` 高亮"保留",`=== 2` 高亮"隐藏",默认 0 都不高亮。

底部"全部 (隐藏 X 场)"按钮(football.vue:93)只有 `$store.state.concealNum != 0` 时显示,点击触发 `cancelConceal()` 撤销隐藏。

### 2.4 控制隐藏 / 保留的核心状态机

```js
// football.vue data
setConf: {
  action: 0,           // 0=不操作  1=保留模式  2=隐藏模式
  timingDataId: []     // 进行中比赛 id 列表,用于轮询合并
}
footList: []           // 用户在列表行内勾选的比赛 id
$store.state.concealNum  // 全局,用于头部显示"隐藏 X 场"
```

子组件根据 `setConf.action` 三态过滤:

```js
listFilter = list.filter(x =>
  (action !== 1 && action !== 2)         // 非过滤模式: 全部显示
  || (typeof x.typeTitle === 'number')   // 标题行(进行中/未开始/已结束/异常/置顶)始终显示
  || (action === 1 &&  footList.includes(x.id))   // 保留模式
  || (action === 2 && !footList.includes(x.id))   // 隐藏模式
)
```

## 三、Bug 根因(深度分析)

### 3.1 必现等级

**100% 必现**,与数据量、网络、用户无关,是结构性缺陷,不是时序竞态。

### 3.2 根因

`football-0.vue` 的 `RecycleScroller` 渲染源绑定的不是 `props.list`,而是本地 data `listFilter`(初值 `[]`):

```vue
<!-- football-0.vue:186 -->
<ul v-if="list.length > 0" ...>
  <RecycleScroller :items="listFilter" ... />
</ul>
```

但 `listFilter` 的写入时机只有三处:

| # | 位置 | 触发条件 |
|---|------|--------|
| 1 | data() L689 | 初始化为 `[]` |
| 2 | watch.setConf L696 (deep) | `setConf` 内字段变化 |
| 3 | setId() L940 | 用户行内勾选某场比赛 |

**关键缺失: 没有 `watch.list`,且 setConf 的 watch 也没有 `immediate: true`。**

### 3.3 必现的执行时间线

1. 进入即时 tab → `listFilter = []`、`setConf.action = 0`。
2. 父 `mounted()` → `getList()` 发请求。
3. 组件先渲染: `list = []`,`<ul v-if="list.length > 0">` 不挂载,显示 `DfEmpty 暂无数据`。
4. 接口回包(异步) → 父 `dataList1` 更新 → 子 `props.list` 拿到数据 → `<ul>` 进入 DOM。
5. RecycleScroller 取 `listFilter`,**仍是 `[]` → 列表空白**。

### 3.4 为什么点"隐藏"反而显示数据

`conceal()` 第一行:

```js
this.setConf.action = this.setConf.action === 2 ? 0 : 2   // 0 → 2
```

赋值触发 `watch.setConf (deep)`,handler 跑那段 filter:

- 此时 `footList = []`(用户未勾选任何比赛)
- `action === 2` 进入 `!footList.includes(x.id)` 分支,对所有 id 都为 true
- `listFilter = list 全量` → 数据出现

**所以"隐藏"按钮的副作用是把 `listFilter` 第一次填满,与"隐藏"业务语义完全无关。** 点"保留"也能触发 watch,但 `action === 1` 时 `footList.includes(x.id)` 对所有 id 都为 false,`listFilter` 只剩标题行,所以"保留"不能救场。

## 四、连带问题(同源缺陷的扩散)

只要根因没修,以下问题都存在,它们和主 bug 同源。

### 问题 1: 轮询数据无法刷新到 UI

**现象**: `pollingGetList` 每 5 秒重新调 `getList()`(football.vue:1298),父 `dataList1` 更新,子 `props.list` 引用变化,但 `setConf` 没变 → watch 不跑 → `listFilter` 停在第一次过滤的快照。比分、状态、进行中状态都不更新。

**位置**: football-0.vue 缺 `watch.list`。

### 问题 2: 轮询期间用户的"隐藏 / 保留"被强制撤销

**现象**: 用户已开"隐藏"(`action=2`),5 秒后轮询触发 `getList()`,执行到 football.vue:1288:

```js
this.setConf.action = 0
```

`action` 被强改回 0,watch 触发 filter,`action !== 1 && action !== 2` 命中,`listFilter` 恢复全量。用户的隐藏操作被自动撤销。

**位置**: football.vue:1288。

### 问题 3: 切到赛果/赛程后切回即时,数据不刷新

**现象**: football.vue:869 在 `tabIndex` 回到 0 时调 `getList()`,新数据来了,但 `listFilter` 还是上次的快照。

**位置**: 同问题 1,根因相同。

### 问题 4: `cancelConceal()` 不同步状态

**现象**: 点击头部"全部 (隐藏 X 场)"按钮:

```js
// football.vue:1025
cancelConceal() {
  this.concealList = []
  this.$store.state.concealNum = 0
}
```

只清零了计数和列表,**没有重置 `setConf.action`**。结果:

- 头部按钮(依赖 `concealNum != 0`)消失。
- 但 `setConf.action` 仍是 2,左侧"隐藏"按钮仍高亮(`actionClass`)。
- 子组件 `listFilter` 没有重新计算,渲染结果未变。

**位置**: football.vue:1025。

### 问题 5: `virtualListUpdate` 切片源与渲染源不一致

**现象**:

```js
// football-0.vue:1000
virtualListUpdate(startIndex, endIndex, visibleStartIndex, visibleEndIndex) {
  let data = this.list.slice(visibleStartIndex, visibleEndIndex)
  this.updateVisibleData(data)
}
```

RecycleScroller 给出的可见范围是基于 `listFilter` 渲染出来的,但这里用 `this.list` 切片填 `visibleData`。在保留 / 隐藏模式下,两边索引完全错位,`visibleData` 拿到的是错误项。

**影响**: `editItem`(L710,接收 WebSocket 推送同步比分/指数)、`setTop`(L1005,置顶)、鼠标悬浮指数弹窗(`mouseenter` 取 `visibleData[index]`)都可能拿错数据。

**位置**: football-0.vue:1001。

### 问题 6: `watch.topList` 未触发渲染源重算

**现象**:

```js
// football-0.vue:692
watch: {
  topList(e) { this.topList1 = e }
}
```

置顶变化时只更新了内部 `topList1`,但 `listFilter` 没有重算。当前实现下 `listFilter` 的 filter 逻辑不依赖 topList,这个问题暂不致使可见 bug,但说明同步机制不完整。修复后 `listFilter` 改 computed 自动消除。

**位置**: football-0.vue:693。

## 五、修复方案(方案 A - 根治)

核心思路: **把 `listFilter` 由 data + 多处手写赋值 改成 computed,让 Vue 的依赖追踪自动处理 `list / setConf / footList` 的所有变化。** 同时清理同源连带问题。

### 5.1 修改清单

#### 5.1.1 `src/views/score/football-0.vue`

**A. 删除 data 中的 `listFilter`**

```diff
data() {
  return {
    ...
    hoverId: '',
-   listFilter: []
  }
}
```

**B. 删除 `watch.setConf`,保留 `watch.topList`(或一并清理也可)**

```diff
watch: {
  topList(e) {
    this.topList1 = e
  },
- setConf: {
-   handler() {
-     this.listFilter = this.list.filter(x => {
-       return ((this.setConf.action != 1 && this.setConf.action != 2) || typeof x.typeTitle === 'number')
-         || (this.setConf.action === 1 && this.footList.includes(x.id))
-         || (this.setConf.action === 2 && !this.footList.includes(x.id))
-     })
-   },
-   deep: true
- }
}
```

**C. 在 computed 中新增 `listFilter`**

```js
computed: {
  game() { return this.$store.state.game },
  immediately() { return this.$store.state.immediately },
  listFilter() {
    const action = this.setConf.action
    if (action !== 1 && action !== 2) return this.list
    return this.list.filter(x =>
      typeof x.typeTitle === 'number'
      || (action === 1 &&  this.footList.includes(x.id))
      || (action === 2 && !this.footList.includes(x.id))
    )
  }
}
```

**D. 删除 `setId` 内部手动同步 `listFilter`**

```diff
setId(item) {
  let _this = this
  if (this.footList.indexOf(item.id) == -1) {
    this.footList.push(item.id)
  } else {
    this.footList.splice(_this.footList.indexOf(item.id), 1)
  }
- this.listFilter = this.list.filter(x => {
-   return ((this.setConf.action != 1 && this.setConf.action != 2) || typeof x.typeTitle === 'number')
-     || (this.setConf.action === 1 && this.footList.includes(x.id))
-     || (this.setConf.action === 2 && !this.footList.includes(x.id))
- })
  this.$emit('getFootList', this.footList)
}
```

**E. `virtualListUpdate` 切片源对齐到渲染源**

```diff
virtualListUpdate(startIndex, endIndex, visibleStartIndex, visibleEndIndex) {
- let data = this.list.slice(visibleStartIndex, visibleEndIndex)
+ let data = this.listFilter.slice(visibleStartIndex, visibleEndIndex)
  this.updateVisibleData(data)
}
```

#### 5.1.2 `src/views/score/football.vue`

**F. 删除轮询期间强制重置 `setConf.action`(解决连带问题 2)**

```diff
async getList() {
  ...
  if (res1 && res2) {
    this.setConf.timingDataId.splice(0)
    let getId = []
-   this.setConf.action = 0
    res1.data.data.forEach(item => {
      getId.push(item.id)
    })
    this.setConf.timingDataId.splice(0, ...getId)
    this.allList = [...res1.data.data.map(x => ({timing: true, ...x})), ...res2.data.data]
  }
  ...
}
```

**G. `cancelConceal()` 补齐状态同步(解决连带问题 4)**

```diff
cancelConceal() {
  this.concealList = []
  this.$store.state.concealNum = 0
+ this.setConf.action = 0
}
```

### 5.2 修复后预期行为

| 场景 | 预期 |
|------|------|
| 进入即时 tab | 接口返回后立即显示全部数据(标题行 + 比赛数据) |
| 勾选若干比赛 → 点击"保留" | 列表仅剩勾选的比赛 + 标题行,"保留"按钮高亮 |
| 同上 → 再次点击"保留" | 恢复全量,"保留"按钮取消高亮 |
| 勾选若干 → 点击"隐藏" | 列表仅剩未勾选的 + 标题行,"隐藏"按钮高亮 |
| 隐藏模式下点头部"全部 (隐藏 X 场)" | 恢复全量,"隐藏"按钮取消高亮,头部按钮消失 |
| 5 秒轮询 | 比分/状态实时更新,用户的隐藏/保留状态保持 |
| 切到赛果再切回即时 | 自动拉新数据并显示,无需任何手动操作 |
| 鼠标悬浮赔率/比分弹窗 | 在过滤模式下也能取到正确的当前行数据 |

## 六、影响范围

### 6.1 文件改动

- `src/views/score/football-0.vue`(改动 5 处: 删 data、删 watch、加 computed、删 setId 副作用、改 virtualListUpdate)
- `src/views/score/football.vue`(改动 2 处: getList 删 1 行、cancelConceal 补 1 行)

### 6.2 不受影响的功能

- **篮球比分页**: `basketball-0.vue` 用 `arrList1/2/3/5` + `concealList` 自管,无 `listFilter`,完全独立。
- **电竞比分页**: `gaming-0.vue` 没有"保留 / 隐藏"机制。
- **足球赛果 / 赛程 / 预约 sub-tab**: 对应 `football-1.vue` / `football-2.vue` / `football-3.vue`,与即时数据流隔离。
- **头部筛选、搜索、欧亚大切换、欧赔弹窗、置顶、收藏接口**: 这些操作的上游(`list`、`footList`、`setConf`、`topList`)未改变接口与字段,computed 自动消费,无需调整。

### 6.3 需要回归的场景

- 进入即时 tab 默认显示数据(本次主 bug)。
- 保留 / 隐藏切换、再次点击退出模式、勾选变化时实时过滤。
- 5 秒轮询期间保持过滤状态,且比分实时更新。
- 切 sub-tab(即时 ↔ 赛果 ↔ 赛程 ↔ 预约)后回到即时数据自动刷新。
- `cancelConceal` 后状态全部清零,按钮高亮同步消失。
- 全选 / 反选(`setAllCheck1`)在过滤模式下表现一致。
- 鼠标悬浮赔率弹窗、比分弹窗在过滤模式下数据正确。
- WebSocket 推送(`editItem` 用 `visibleData`)在过滤模式下命中正确行。
- 置顶操作在过滤模式下行为正确。

### 6.4 风险点

- **删除 `getList` 内 `setConf.action = 0`**: 这一行原是每次轮询重置过滤状态。若产品确实希望"轮询时撤销过滤",请保留,但应放到非轮询场景(如重新进入页面)。建议单独 commit,便于回滚。
- **`searchText` 高亮**: 它用的是 `this.list` 直接改字段做高亮(L810),与 `listFilter` 解耦,不受改动影响。但其计数 `getallNum` 依赖 `document.querySelectorAll('.highlight')`,会受过滤后 DOM 影响,如需精确计数后续可单独优化(本次不变更)。
- **`watch.topList`**: 当前 listFilter 不依赖 topList,改 computed 后仍然不依赖,行为一致。`topList1` 内部副本可保留以避免 prop 直接修改告警,未来可一并清理。

## 七、改动验收清单(回归测试)

- [ ] 进入即时 tab,无需任何点击,直接显示全部数据。
- [ ] 勾选 3 场比赛 → 点"保留" → 列表只剩 3 场 + 标题。
- [ ] 再点"保留" → 恢复全量。
- [ ] 勾选 3 场 → 点"隐藏" → 列表只剩剩余比赛 + 标题。
- [ ] 头部出现"全部 (隐藏 X 场)" → 点击 → 全量恢复 + 高亮取消。
- [ ] 隐藏模式下等 5 秒(轮询触发) → 隐藏状态保持,比分变化能看到。
- [ ] 切到赛果 → 再切回即时 → 数据自动出现。
- [ ] 隐藏模式下鼠标悬浮某行 → 赔率/比分弹窗显示的是当前悬浮行的数据。
- [ ] 隐藏模式下点某行置顶 → 该行置顶到顶部。
- [ ] 篮球、电竞页表现无任何变化(回归保护)。

## 八、附录: 原始代码定位

| 关键代码 | 位置 |
|---------|------|
| `setConf` 默认值 | `football.vue:721` |
| 浮动按钮模板 | `football.vue:12-29` |
| `conceal()` | `football.vue:974` |
| `retain()` | `football.vue:988` |
| `collect()` | `football.vue:1006` |
| `cancelConceal()` | `football.vue:1025` |
| `getList()` 内重置 action | `football.vue:1288` |
| `dataList1` 赋值 | `football.vue:1488` |
| `list1` computed | `football.vue:828` |
| 子组件 `listFilter` 初始化 | `football-0.vue:689` |
| 子组件 watch.setConf | `football-0.vue:696` |
| 子组件 RecycleScroller 绑定 | `football-0.vue:190` |
| 子组件 `setId()` | `football-0.vue:933` |
| `virtualListUpdate` | `football-0.vue:1000` |
