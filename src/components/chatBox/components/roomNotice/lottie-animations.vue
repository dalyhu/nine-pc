<template>
  <!-- Lottie 动画容器 -->
  <div ref="lottieContainer" style="width: 100px; height: 100px"></div>
</template>

<script>
import lottie from 'lottie-web'
import { cloneDeep, throttle } from 'lodash-es'
import mittBus from '@/utils/mittBus'
export default {
  data() {
    return {
      lottieInstance: null
      // playCount: 0,
      // maxPlays: 3,
      // isPlaying: false
    }
  },
  computed: {
    giftEffectsVisible() {
      return this.$store.state.giftEffectsVisible
    }
  },
  mounted() {
    this.createLottieInstance()
    mittBus.on('imOnMessage', this.handleIMMessage)
  },

  beforeUnmount() {
    mittBus.off('imOnMessage', this.handleIMMessage)
  },
  methods: {
    createLottieInstance() {
      this.lottieInstance = lottie.loadAnimation({
        container: this.$refs.lottieContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false, // 不自动播放
        path: '/static/images/4.json' // 动画路径
      })

      // this.lottieInstance.addEventListener('complete', () => {
      //   // this.playCount++;
      //   // if (this.playCount < this.maxPlays) {
      //     this.lottieInstance.play(); // 播放次数未达到 3 次，继续播放
      //   } else {
      //     this.isPlaying = false; // 播放完成 3 次后停止
      //   }
      // });
    },
    playAnimation: throttle(function () {
      if (this.lottieInstance) {
        this.lottieInstance.goToAndStop(0, true) // 重置动画到初始状态
        // this.playCount = 0; // 重置播放次数
        // this.isPlaying = true; // 标记动画为正在播放
        this.lottieInstance.play() // 开始播放动画
      }
    }, 1000),

    handleIMMessage(source) {
      const data = cloneDeep(source)
      try {
        switch (data.action) {
          case 'vote': {
            // 屏蔽礼物开关  true不屏蔽， false屏蔽
            if (this.giftEffectsVisible) {
              this.playAnimation() // 接收到消息时播放动画
            }
            break
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
