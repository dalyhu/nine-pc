<template>
  <div class="btn_tab">
    <div class="btn_box">
      <div
        v-for="(item, index) in tabList"
        :key="index"
        :class="[tabValue === index ? 'is-active' : '']"
        @click="change(index)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup name="btnTab" lang="ts">
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  tabList: {
    type: Array,
    default: () => []
  }
})

const tabValue = computed({
  get: function () {
    return props.modelValue
  },
  set: function (newValue) {
    emits('update:modelValue', newValue)
  }
})
const emits = defineEmits(['update:modelValue', 'change'])

function change(val) {
  tabValue.value = val
  emits('change')
}
</script>

<style scoped lang="scss">
.btn_tab {
  display: flex;
  justify-content: center;
  padding-top: 10px;
  padding-bottom: 10px;
  .btn_box {
    border: 1px solid var(--el-primary-background-color);
    border-radius: 30px;
    padding: 2px;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    > div {
      cursor: pointer;
      color: var(--el-primary-background-color);
      border-radius: 30px;
      white-space: nowrap;
      overflow: hidden;
      padding: 8px 10px;
      text-align: center;
      text-overflow: ellipsis;
    }
    .is-active {
      color: #fff;
      background: var(--el-primary-background-color);
    }
  }
}
</style>
