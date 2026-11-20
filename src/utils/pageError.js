import { ref } from 'vue'

/**
 * 页面主体是否要显示错误页（由页面错误边界之外的地方触发，如路由分包加载失败）
 * PageErrorBoundary 读取它，导航成功后由 PageErrorBoundary 清除
 */
export const pageError = ref(false)

export function setPageError() {
  pageError.value = true
}

export function clearPageError() {
  pageError.value = false
}

/**
 * 记录一条运行期错误：进入 index.html 兜底脚本的诊断信息（复制诊断信息时带上），同时输出到控制台
 * 用 window.console：生产构建开了 drop_console，会删掉 console.xxx() 调用，但不会删 window.console.xxx()
 */
export function reportError(err, source) {
  try {
    const fallback = window.__X9_FALLBACK__
    if (fallback && typeof fallback.record === 'function') {
      fallback.record(err, source)
    } else {
      window.console.error('[' + source + ']', err)
    }
  } catch (e) {
    // 记录失败不能影响页面
  }
}
