<template>
  <div class="work-search-box flex">
    <el-date-picker
      v-model="selectTime"
      type="daterange"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      :default-time="defaultTime"
      value-format="YYYY-MM-DD"
      @keydown="handleKeyDown"
    ></el-date-picker>
    <el-button class="tabs-search-button" type="primary" text @click="handleSearch">搜索</el-button>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits(['search'])
const selectTime = defineModel<string>({ default: ''})
// 搜索
const handleSearch = () => {
  emit('search', selectTime.value)
}
const defaultTime:[Date, Date] = [
  new Date(2000, 1, 1),
  new Date(2000, 1, 1),
]

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
.work-search-box {
  :deep(.el-range-editor.el-input__wrapper) {
    border-radius: 20px;
    margin: 10px 0; 
    background: #f0f2f5;
    box-shadow: none;
  }
}
</style>
