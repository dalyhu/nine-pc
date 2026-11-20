<template>
  <div class="list">
    <div v-if="!single" class="tag" :class="{tagSelect: !modelValue.length}" @click="setFeedback(undefined)">全部</div>
    <div
      class="tag"
      :class="{tagSelect: modelValue.includes(item.id)}"
      v-for="(item, i) in feedbackData"
      :key="i"
      @click="setFeedback(item.id)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { FeedbackKey } from './type'
let modelValue = defineModel<number[]>()
const emit = defineEmits(['click'])
const props = defineProps<{feedbackData: FeedbackKey[], single?: boolean | string}>()
const { feedbackData, single } = toRefs(props)

const setFeedback = (key: number | undefined) => {
  if (single.value) {
    if (modelValue.value[0] === key) {
      modelValue.value.splice(0, 1)
      return
    }
    modelValue.value.splice(0, 1, key)
  } else {
    let i = modelValue.value.indexOf(key)
    if (key === undefined) {
      modelValue.value.splice(0, modelValue.value.length)
    } else if (i !== -1) {
      modelValue.value.splice(i, 1)
    } else {
      modelValue.value.push(key)
    }
  }
  emit('click')
}
</script>

<style scoped lang="scss">
.list {
  display: flex;
  flex-flow: row wrap;
  gap: 16px;
  .tag {
    font-size: 16px;
    padding: 8px 16px;
    color: #333;
    font-weight: 500;
    border: 1px solid #333;
    border-radius: 8px;
    cursor: pointer;
    &:where(:active) {
      filter: brightness(110%);
    }
  }
  .tagSelect {
    background-color: #d02d54;
    color: #fff;
    border-color: #d02d54;
  }
}
</style>