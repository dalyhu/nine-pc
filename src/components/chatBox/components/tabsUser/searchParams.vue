<template>
<div class="tabs-search-box flex">
    <el-input
        class="tabs-search-input"
        v-model="keyWords"
        placeholder="搜索用户昵称"
        :prefix-icon="Search"
        @keydown="handleKeyDown"
    />
    <el-button class="tabs-search-button" type="primary" text @click="handleSearch">搜索</el-button>
</div>
</template>
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
const emit = defineEmits(['search'])
const keyWords = defineModel<string>({ default: ''})
// 搜索
const handleSearch = () => {
  emit('search')
}

// 键盘回车事件
function handleKeyDown(event) {
  if (event.keyCode === 13) {
    event.preventDefault()
    event.stopPropagation()

    // 如果未同时输入shift，直接提交
    !event.shiftKey && handleSearch()
  }
}
</script>
<style lang="scss" scoped>
.tabs-search-box {
    overflow: hidden;
    align-items: center;
    padding: 8px 0px;
    flex-shrink: 0;
    .tabs-search-input {
      :deep(.el-input__wrapper) {
        border-radius: 22px;
        background-color: var(--el-fill-color);
        box-shadow: none;
      }
    }
}
</style>
  