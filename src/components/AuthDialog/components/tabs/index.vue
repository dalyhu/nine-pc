<template>
  <div class="tabs">
    <ul>
      <li
        v-for="curr in tabs"
        :key="curr.state"
        @click="handleTab(curr)"
        :class="[tabValue === curr.state ? 'is_active' : '']"
      >
        {{ curr.title }}
      </li>
    </ul>
  </div>
</template>

<script setup name="tabs" lang="ts">
const tabs = [
  {
    title: '验证码登录',
    state: 0
  },
  {
    title: '密码登录',
    state: 1
  }
]

const emits = defineEmits(['update:modelValue', 'changeTab'])
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
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

const handleTab = ({ state }) => {
  emits('changeTab', state)
}
</script>

<style scoped lang="scss">
.tabs {
  margin-bottom: 16px;
  ul {
    display: flex;
    align-items: center;
    justify-content: center;
    li {
      cursor: pointer;
      color: #a9969d;
      font-family: 'PingFang SC';
      font-size: 14px;
      font-weight: 600;
      padding: 0 8px;
    }
    .is_active {
      color: #fff;
      font-family: 'PingFang SC';
      font-size: 18px;
      font-weight: 600;
    }
  }
}
</style>
