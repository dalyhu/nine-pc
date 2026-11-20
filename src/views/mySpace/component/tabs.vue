<template>
  <div class="tabs">
    <span
      v-for="item in props.tabsList"
      class="tab"
      :key="item.key"
      :class="{ tabSelect: tabKey === item.key }"
      @click="tabKey = item.key"
      >{{ item.name }}</span
    >
  </div>
  <list v-if="props.empty" :empty="props.empty"><slot></slot></list>
  <slot v-else></slot>
</template>

<script setup lang="ts">
import { EmptyKey, TabKey } from './type'
import list from './list.vue'

const tabKey = defineModel()
const props = defineProps<{
  tabsList: TabKey[]
  empty?: EmptyKey
}>()
</script>

<style scoped lang="scss">
.tabs {
  position: sticky;
  top: 34px;
  background-color: #fff;
  box-shadow: #fff 0px -10px 0 24px;
  z-index: 10;
  display: flex;
  margin: 32px 16px;
  font-size: 20px;
  line-height: 24px;
  font-weight: 400;
  color: #333;
  gap: 48px;
  .tab {
    cursor: pointer;
    padding-bottom: 4px;
    border-bottom: 2px solid transparent;
  }
  .tabSelect {
    color: #d02d54;
    border-bottom: 2px solid #d02d54;
  }
}
</style>
