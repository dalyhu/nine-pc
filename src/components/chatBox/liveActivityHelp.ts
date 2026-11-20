import { ref } from 'vue'
import mittBus from '@/utils/mittBus'

/** 直播间活动「寻求帮助」打开的会话标记（跨组件/挂载时机共享） */
export const isLiveActivityHelpSession = ref(false)

export function markLiveActivityHelpSession() {
  isLiveActivityHelpSession.value = true
}

export function clearLiveActivityHelpSession() {
  isLiveActivityHelpSession.value = false
}

// 尽早标记，避免 OperationPanel 尚未挂载时丢失 clickhelp 事件
mittBus.on('clickhelp', (val: { data?: unknown }) => {
  if (val?.data) markLiveActivityHelpSession()
})
