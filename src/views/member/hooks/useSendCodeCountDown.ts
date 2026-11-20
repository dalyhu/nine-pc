
import { ElMessage } from 'element-plus'
import { ref, onMounted, onUnmounted } from 'vue'
// @ts-ignore
import { useStore } from 'vuex'


interface CodeProp {
  mobile?: string
  mail?: string
  type: number
}

export const useSendCodeCountDown = (STORAGE_KEY: string) => {

  let DURATION = 60

  const store = useStore()

  const countDown = ref(0)

  const isCounting = ref(false)

  const countLoading = ref(false)

  let timer: number | undefined

  const startCountDown = (seconds: number) => {
    countDown.value = seconds
    isCounting.value = true

    if (timer) clearInterval(timer)

    timer = window.setInterval(() => {
      countDown.value--

      if (countDown.value <= 0) {
        clearInterval(timer)
        isCounting.value = false
        countDown.value = 0
        localStorage.removeItem(STORAGE_KEY)
      }
    }, 1000)
  }

  const getCode = (codeParams: CodeProp) => {
    // 双击/连击防重：请求进行中 或 倒计时中 直接拦截
    if (countLoading.value || isCounting.value) return
    countLoading.value = true
    store.dispatch('user/sendVerifyCode', codeParams).then((res: any) => {
      if (res.code === 0) {
        const now = Date.now()
        localStorage.setItem(STORAGE_KEY, now.toString())
        DURATION = res.data.seconds
        startCountDown(DURATION)
        ElMessage.success(res.msg)
      }
    }).catch(() => {
      // 失败时不启动倒计时，交给业务侧感知
    }).finally(() => {
      countLoading.value = false
    })
  }


  const checkCountDown = () => {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      const savedTime = Number(saved)
      const elapsed = Math.floor((Date.now() - savedTime) / 1000)

      const remaining = DURATION - elapsed

      if (remaining > 0) {
        startCountDown(remaining)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  onMounted(() => {
    checkCountDown()
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })



  return {
    getCode,
    countLoading,
    countDown
  }
}
