import { useStore } from 'vuex';
import {
  BOT_VERIFICATION_STORAGE_KEY,
  isVerificationWithinValidPeriod,
  saveBotVerificationRecord,
  shouldBlockByBotVerification
} from '@/utils/botVerification';

/**
 * 人机验证（简化版）：
 * 1. 进入页面 getHot 完成后判断
 * 2. bot_verification_enabled=false → 直接通过
 * 3. bot_verification_enabled=true → 弹窗，验证成功关闭
 * 4. 4 小时内刷新再次 getHot → 忽略 bot_verification_enabled，直接通过
 * 5. 超过 4 小时刷新 → 重新按 bot_verification_enabled 判断
 */
export function useBotVerification() {
  const store = useStore();
  const show = ref(false);
  const verifiedTick = ref(0);

  const getHotFailed = computed(() => store.state.getHotFailed === true);

  const shouldBlock = computed(() => {
    verifiedTick.value;
    return shouldBlockByBotVerification(store.state.system, store.state.systemHotLoaded, getHotFailed.value);
  });

  watch(
    shouldBlock,
    (val) => {
      show.value = val;
    },
    { immediate: true }
  );

  function markVerified() {
    saveBotVerificationRecord();
    verifiedTick.value += 1;
    show.value = false;
  }

  function syncVerifiedState() {
    verifiedTick.value += 1;
  }

  function onStorageChange(event: StorageEvent) {
    if (event.key !== BOT_VERIFICATION_STORAGE_KEY) return;
    syncVerifiedState();
  }

  onMounted(() => {
    window.addEventListener('storage', onStorageChange);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('storage', onStorageChange);
  });

  return {
    show,
    shouldBlock,
    isVerified: computed(() => isVerificationWithinValidPeriod()),
    markVerified,
    syncVerifiedState
  };
}
