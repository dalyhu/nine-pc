<template>
  <div class="list">
    <el-empty v-show="empty.show" :image="empty.icon" :description="empty.des[0]">
      <!-- <el-text>{{ empty.des[0] || '' }}</el-text> -->
      <el-text style="color: #666">{{ empty.des[1] || '' }}</el-text>
    </el-empty>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { EmptyKey } from './type'
const props = defineProps<{ empty: EmptyKey }>()
const { empty } = toRefs(props)
</script>

<style scoped lang="scss">
.list {
  display: flex;
  flex-flow: column;
  margin-top: 10px;
  gap: 16px;
}
</style>
