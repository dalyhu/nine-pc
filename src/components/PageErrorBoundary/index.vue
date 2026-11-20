<template>
  <PageError v-if="error || pageError" />
  <slot v-else />
</template>

<script setup>
/**
 * 页面主体的错误边界（包在 AppMain 的 router-view 外面，不额外渲染任何元素，正常时 DOM 结构不变）
 *
 * 只在现在会白屏的情况下介入：出现渲染类错误（setup / 渲染 / 异步组件加载失败）后，页面组件确实什么都没渲染出来，
 * 才把页面主体换成错误页，导航栏和左侧菜单还能用；导航成功后自动恢复。
 * 其他情况（页面里某个子组件报错、事件回调报错等）只记录，页面保持原样。
 * 所有错误都在这里拦下（return false），不再交给 main.js 的全局 errorHandler，避免重复记录。
 */
import { nextTick, onBeforeUnmount, onErrorCaptured, ref } from 'vue'
import { NavigationFailureType, isNavigationFailure, useRoute, useRouter } from 'vue-router'
import PageError from '@/components/PageError/index.vue'
import { hasBlankRouteLevel, isFatalVueError } from '@/utils/vueErrorInfo'
import { clearPageError, pageError, reportError } from '@/utils/pageError'

const route = useRoute()
const router = useRouter()
const error = ref(false)

onErrorCaptured((err, instance, info) => {
  try {
    reportError(err, 'vue')
    if (isFatalVueError(info)) {
      // 等这一轮渲染结束再看结果；route.matched 第 0 层是 Layout，从第 1 层开始才是页面
      nextTick(() => {
        if (hasBlankRouteLevel(route.matched, 1)) error.value = true
      })
    }
  } catch (e) {
    // 边界自身不能再抛错
  }
  return false
})

// 导航成功后恢复；在错误页上点当前页面的菜单（重复导航）也恢复，重新挂载当前页面
const removeAfterEach = router.afterEach((to, from, failure) => {
  if (failure && !isNavigationFailure(failure, NavigationFailureType.duplicated)) return
  error.value = false
  clearPageError()
})
onBeforeUnmount(removeAfterEach)
</script>
