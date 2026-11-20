<!-- 内容区域顶部 -->
<template>
  <div class="dfEmpty">
    <el-empty
      :image-size="props.imageSize"
      :image="props.image"
      :description="props.description"
    ></el-empty>
  </div>
</template>
<script setup name="DfEmpty" lang="ts">
import { getImageUrl } from '@/utils/common.js'
defineOptions({
  name: 'DfEmpty',
  inheritAttrs: true
})

const props = defineProps({
  imageSize: {
    type: Number,
    default: 112
  },
  image: {
    type: String,
    default: getImageUrl('/static/images/theme/no_data.png?v=20240308')
  },
  description: {
    type: String,
    default: ''
  }
})
</script>
<style lang="scss" scoped>
.dfEmpty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
