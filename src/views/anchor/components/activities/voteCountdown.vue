<template>
  <div class="video-up" v-if="isType === 'video'">{{ ms === '00:00:00' ? '已截止' : `${ms} 截止` }}</div>
  <div class="vote_countdown" v-else>{{ ms === '00:00:00' ? '已截止' : `投票截止:${ms}` }}</div>
</template>

<script setup name="voteCountdown" lang="ts">
import { useIntervalFn } from '@vueuse/core'
const props = defineProps({
  voteItem: {
    type: Object,
    default: () => ({})
  },
  isType: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['handleVoteEnd'])

const time = ref(props.voteItem.countdown)
const ms = ref('')

watch(() => props.voteItem.countdown, (val) => {
  time.value = val
}, { immediate: true})

const { pause } = useIntervalFn(
  () => {
    if (time.value <= 0) {
      pause()
      emits('handleVoteEnd', props.voteItem)
    } else {
      time.value--
      countdown()
    }
  },
  1000,
  {
    immediate: true
  }
)

console.log(ms, 'msms')

function countdown() {
  let h = parseInt(((time.value / 60 / 60) % 3600) + '') + ''
  h = Number(h) < 10 ? '0' + h : h
  let m = parseInt(((time.value / 60) % 60) + '') + ''
  m = Number(m) < 10 ? '0' + m : m
  let s = parseInt((time.value % 60) + '') + ''
  s = Number(s) < 10 ? '0' + s : s
  ms.value = h + ':' + m + ':' + s
}
</script>

<style scoped lang="scss">
.vote_countdown {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 138px;
  height: 23px;
  flex-shrink: 0;
  background-image: url(/static/images/live/activities/vote_time_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: var(--el-color-black);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
}

.video-up {
  font-size: 12px;
  color: #ebebeb;
}
</style>
