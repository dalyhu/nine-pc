<!-- 图片组件 -->
<template>
  <img
    ref="el"
    class="el-image df_image df_image_lazy"
    :alt="props.alt"
    :title="props.title"
    :src="imgSrc"
    :data-src="props.src"
    :style="{ objectFit: props.fit }"
    @error="errorHandler"
  />
</template>
<script setup name="DfImageLazy" lang="ts">
import { errorImg } from '@/utils/common.js'
import lozad from 'lozad'
import loadingBG from '/static/images/placeholder_gray_bg.png'

defineOptions({
  name: 'DfImageLazy',
  inheritAttrs: true
})

const props = defineProps({
  fit: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  src: {
    type: String,
    default: ''
  },
  placeholderSrc: {
    type: String,
    default: ''
  },
  // 延迟懒加载的初始化，如果能确定在页面完成初始化后图片一定在可视区域，则建议传0
  binding: {
    type: Number,
    default: 300
  },
  errorIcon: {
    type: String,
    default: ''
  }
})

const el = ref()
const imgSrc = computed(() => props.placeholderSrc || loadingBG)

watch(
  () => props.src,
  (val) => {
    el.value.src = val || ''
  }
)

onMounted(() => {
  setTimeout(() => {
    el.value.$observer = lozad(el.value)
    el.value.$observer.observe()
  }, props.binding)
})

onBeforeUnmount(() => {
  el.value.$observer?.observer?.disconnect()
})

function errorHandler($event) {
  errorImg($event, props.errorIcon)
}
</script>
<style lang="scss" scoped>
.df_image {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background-size: cover;
  &.empty {
    :deep(.el-image__error) {
      font-size: 0;
    }
  }
}
</style>
