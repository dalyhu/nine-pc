<template>
  <el-switch
    size="large"
    inactive-text="浅色"
    active-text="深色"
    v-model="isDark"
    @change="toggleDark"
    class="theme-switch-btn"
  ></el-switch>
</template>

<script setup name="SwitchDark" lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style scoped lang="scss">
.theme-switch-btn {
  :deep(.el-switch__label) {
    display: flex;
    align-items: center;
    color: #393a3c;
    span {
      overflow: hidden;
      white-space: nowrap;
    }
    &.is-active {
      color: #e5eaf3;
    }
  }
  @include screen(medium) {
    :deep(.el-switch__label) {
      display: none;
    }
  }
}
</style>
<style lang="scss">
html {
  .theme-switch-btn {
    .el-switch__core {
      background: #636466;
      border: 1px solid #636466;
    }
  }
}
html.dark {
  .theme-switch-btn {
    .el-switch__core {
      background: #d02d54 !important;
      border: 1px solid #d02d54 !important;
    }
  }
}
</style>
