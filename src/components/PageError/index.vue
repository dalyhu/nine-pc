<template>
  <div class="page-error">
    <div class="page-error__card">
      <div class="page-error__badge">页面出错了</div>
      <h1 class="page-error__title">页面加载遇到问题</h1>
      <p class="page-error__desc">
        很抱歉，当前页面暂时无法显示。<br />您可以刷新重试，或返回首页继续浏览。
      </p>
      <div class="page-error__actions">
        <button type="button" class="page-error__btn page-error__btn--primary" @click="reload">
          刷新页面
        </button>
        <button type="button" class="page-error__btn" @click="goHome">返回首页</button>
      </div>
      <div v-if="canCopy" class="page-error__copy">
        <button type="button" class="page-error__link" @click="copy">复制诊断信息</button>
        <div class="page-error__tip" :class="{ 'page-error__tip--done': copyTip }">
          {{ copyTip || '多次刷新仍无法打开？复制诊断信息发送给客服，我们会尽快为您处理' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 页面主体渲染失败时展示（见 PageErrorBoundary）。样式只用 Safari 13.1 也支持的写法：不用 flex gap、inset、:where()
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 诊断信息和复制能力由 index.html 的兜底脚本提供，与兜底页格式一致
const fallback = window.__X9_FALLBACK__
const canCopy = !!(fallback && fallback.diagnostics && fallback.copyText)
const copyTip = ref('')

function reload() {
  window.location.reload()
}

function goHome() {
  if (route.path === '/' || route.path === '/main') {
    reload()
    return
  }
  router.push('/').catch(reload)
}

function copy() {
  fallback.copyText(fallback.diagnostics('runtime'), (ok) => {
    copyTip.value = ok ? '已复制，请粘贴发送给客服' : '复制失败，请截图本页面发送给客服'
  })
}
</script>

<style scoped lang="scss">
.page-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 54px);
  padding: 40px 16px;
  box-sizing: border-box;
}

.page-error__card {
  width: 480px;
  max-width: 100%;
  padding: 40px 48px 32px;
  box-sizing: border-box;
  border-radius: 16px;
  background: var(--el-bg-color, #fff);
  box-shadow: 0 8px 32px rgba(208, 45, 84, 0.08);
  text-align: center;
}

.page-error__badge {
  display: inline-block;
  margin-bottom: 16px;
  padding: 4px 12px;
  border-radius: 999px;
  background: #facbce;
  color: #b72b4a;
  font-size: 12px;
}

.page-error__title {
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 600;
  color: var(--el-text-color-primary, #222);
}

.page-error__desc {
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 22px;
  color: var(--el-text-color-regular, #666);
}

.page-error__actions {
  display: flex;
  justify-content: center;
}

.page-error__btn {
  margin: 0 8px;
  padding: 10px 24px;
  border: 1px solid #d02d54;
  border-radius: 999px;
  background: transparent;
  color: #d02d54;
  font-size: 14px;
  cursor: pointer;
  outline: none;

  &:hover {
    background: #fff7f8;
  }
}

.page-error__btn--primary {
  background: #d02d54;
  color: #fff;

  &:hover {
    background: #b72b4a;
    border-color: #b72b4a;
  }
}

.page-error__copy {
  margin-top: 20px;
}

.page-error__link {
  padding: 0;
  border: 0;
  background: transparent;
  color: #d02d54;
  font-size: 13px;
  cursor: pointer;
}

.page-error__tip {
  min-height: 20px;
  margin-top: 8px;
  font-size: 12px;
  line-height: 20px;
  color: #999;
}

.page-error__tip--done {
  color: #d02d54;
}
</style>
