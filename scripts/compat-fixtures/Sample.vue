<template>
  <div>{{ text }}</div>
</template>

<script setup lang="ts">
// 确认 .vue 文件和 TypeScript 写法也能被检查（见 scripts/compat-lint.test.mjs）
const channel: BroadcastChannel = new BroadcastChannel('x') // 应报错
const text: string = 'ok' // 不应报错
</script>
