<template>
  <el-progress
    :class="{ 'el-progress-rotateY': !hasClockwise }"
    type="circle"
    :show-text="false"
    :width="50"
    :stroke-width="4"
    :color="!hasClockwise ? '#d02d54' : '#687ae0'"
    :percentage="percentage"
  >
  </el-progress>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  hasClockwise: {
    type: Boolean,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  }
})

const strokeColor = computed(() => {
  if (props.percentage === 0) return '#ccc'
  return props.hasClockwise ? '#d02d54' : '#687ae0'
})
</script>
<style scoped lang="scss">
:deep(.el-progress-circle__track) {
  stroke: v-bind(strokeColor);
}
</style>
