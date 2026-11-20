<!-- 内容区域顶部 -->
<template>
  <div class="dfHgroup">
    <div class="title">
      <slot v-if="$slots.prepend" name="prepend"></slot>
      <span class="title--text">
        <slot name="title"> {{ title }} </slot>
      </span>
    </div>
    <div class="operation-btn" v-if="btnText">
      <el-button class="bg-transparent" round @click="btnClick">
        <span v-html="btnText"></span>
        <el-icon class="el-icon--right df-space-small"><CaretRight /></el-icon>
      </el-button>
    </div>
  </div>
</template>
<script setup name="DfHgroup" lang="ts">
import { CaretRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getQueryString } from '@/utils'

defineOptions({
  name: 'DfHgroup',
  inheritAttrs: true
})

const props = defineProps({
  link: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  btnText: {
    type: String,
    default: ''
  }
})
const router = useRouter()
const emits = defineEmits(['btnClick'])

const btnClick = () => {
  if (!props.link) return emits('btnClick')
  let routeData = router.resolve({ path: props.link, query: { ...getQueryString(props.link) } })
  window.open(routeData.href, '_self')
}
</script>
<style lang="scss" scoped>
.bg-transparent {
  background-color: transparent;
}
.df-space-small {
  margin-left: 8px;
}
.dfHgroup {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  width: 100%;
  .title {
    color: var(--el-text-color-primary);
    font-weight: 700;
    font-size: 20px;
    line-height: 28px;
    display: flex;
    align-items: center;
  }
  .title--text {
    padding-left: 12px;
  }
  .operation-btn {
    display: flex;
    border: none;
    & > button {
      padding: 0;
      height: 22px;
      border: none;
      span {
        color: var(--el-text-color-primary);
      }
    }
    :deep(.num) {
      color: var(--el-color-primary);
      font-style: initial;
    }
  }
}
</style>
