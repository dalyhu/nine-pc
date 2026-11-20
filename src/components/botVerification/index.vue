<template>
  <Teleport to="body">
    <!-- 全屏遮罩：未完成验证时阻断全站操作 -->
    <div v-if="show" class="bot-verification-blocker" aria-hidden="true" />

    <el-dialog
      v-model="show"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="400px"
      align-center
      class="bot-verification-dialog"
      append-to-body
      :modal="false"
      :z-index="10001"
    >
      <div class="bot-verification">
        <div class="title">安全验证</div>
        <div class="desc">请完成下方验证后继续访问</div>
        <SlideVerify
          v-if="show"
          ref="blockRef"
          :w="280"
          :h="155"
          slider-text="向右滑动完成验证"
          :accuracy="5"
          :show="true"
          @success="onSuccess"
          @fail="onFail"
          @again="onAgain"
        />
      </div>
    </el-dialog>
  </Teleport>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import SlideVerify from 'vue3-slide-verify';
import 'vue3-slide-verify/dist/style.css';
import { useBotVerification } from '@/composables/useBotVerification';

const { show, markVerified } = useBotVerification();
const blockRef = ref(null);

watch(
  show,
  (visible) => {
    document.body.classList.toggle('bot-verification-active', visible);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  document.body.classList.remove('bot-verification-active');
});

function onSuccess() {
  markVerified();
}

function onFail() {
  // 库内部 fail 后 1s 会自动 reset 换图，此处勿再 refresh，否则会刷新两次
  ElMessage.warning('验证失败，请重试');
}

function onAgain() {
  ElMessage.warning('检测到异常操作，请重新验证');
  blockRef.value?.refresh();
}
</script>

<style scoped lang="scss">
.bot-verification-blocker {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.55);
}

.bot-verification-dialog {
  :deep(.el-dialog__header) {
    display: none;
  }

  :deep(.el-dialog__body) {
    padding: 24px 24px 32px;
  }
}

.bot-verification {
  .title {
    font-size: 18px;
    font-weight: 600;
    color: #13151e;
    text-align: center;
    line-height: 26px;
  }

  .desc {
    margin-top: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #8a8f99;
    text-align: center;
    line-height: 22px;
  }

  :deep(.slide-verify) {
    margin: 0 auto;
  }
}
</style>

<style lang="scss">
/* 人机验证遮罩 z-index 10000+，需保证 ElMessage 浮于其上 */
body.bot-verification-active .el-message {
  z-index: 10002 !important;
}
</style>
