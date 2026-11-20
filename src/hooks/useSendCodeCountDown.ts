
import { ElMessage } from 'element-plus'
import { ref, onMounted, onUnmounted } from 'vue'
// @ts-ignore
import { useStore } from 'vuex'


interface CodeProp {
  mobile?: string
  mail?: string
  type: number
}

export const useSendCodeCountDown = (STORAGE_KEY?: string) => {

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
        if (STORAGE_KEY) {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    }, 1000)
  }

  const getCode = (codeParams: CodeProp) => {
    countLoading.value = true
    store.dispatch('user/sendVerifyCode', codeParams).then((res: any) => {
      if (res.code === 0) {
        countLoading.value = false
        const now = Date.now()
        STORAGE_KEY && localStorage.setItem(STORAGE_KEY, now.toString())
        DURATION = res.data.seconds
        startCountDown(DURATION)
        ElMessage.success(res.msg)
      }
    }).catch(() => {
      countLoading.value = false
    })
  }


  const checkCountDown = () => {
    const saved = STORAGE_KEY && localStorage.getItem(STORAGE_KEY) || ''

    if (saved) {
      const savedTime = Number(saved)
      const elapsed = Math.floor((Date.now() - savedTime) / 1000)

      const remaining = DURATION - elapsed

      if (remaining > 0) {
        startCountDown(remaining)
      } else {
        STORAGE_KEY && localStorage.removeItem(STORAGE_KEY)
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
