<template>
  <div class="df_container">
    <div class="df_container_placeholder" :style="{ paddingBottom: heightRatio + '%' }"></div>
    <div class="df_container_inner">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup name="DfContainer">
defineProps({
  heightRatio: {
    type: Number,
    default: 50 // 宽高比 2:1
  }
})
</script>

<style lang="scss" scoped>
.df_container {
  position: relative;
  overflow: hidden;
  .df_container_inner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
  }
}
</style>
