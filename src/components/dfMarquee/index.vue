<template>
  <div class="df_marquee">
    <div class="df_marquee_inner_box">
      <slot></slot>
    </div>
    <div class="df_marquee_inner_box" style="display: none">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash-es'

export default {
  name: 'dfMarquee',
  props: ['spacing'],
  mounted() {
    this.computedSpeed()
    this.observer = new MutationObserver(this.computedSpeed)
    this.observer.observe(this.$el, {
      childList: true,
      subtree: true
    })
    window.addEventListener('resize', this.debouncedComputedSpeed)
    document.addEventListener('visibilitychange', this.handleWindowVisible)
  },
  beforeUnmount() {
    this.observer.disconnect()
    window.removeEventListener('resize', this.debouncedComputedSpeed)
    document.removeEventListener('visibilitychange', this.handleWindowVisible)
  },
  methods: {
    debouncedComputedSpeed: debounce(function () {
      this.computedSpeed()
    }, 300),
    computedSpeed() {
      setTimeout(() => {
        try {
          const innerEl1 = this.$el.children[0]
          const innerEl2 = this.$el.children[1]
          const containerWidth = this.pxToValue(window.getComputedStyle(this.$el)?.width)
          const innerWidth = this.pxToValue(window.getComputedStyle(innerEl1)?.width)
          if (innerWidth > containerWidth) {
            const paddingRight = this.spacing == null ? containerWidth : this.spacing
            const speed = (innerWidth + paddingRight) / 50 + 's'

            innerEl2.style.paddingRight = innerEl1.style.paddingRight = paddingRight + 'px'
            innerEl2.style.display = 'block'

            setTimeout(() => {
              innerEl2.style.animationDuration = innerEl1.style.animationDuration = speed
              innerEl2.style.animationName = innerEl1.style.animationName = 'marquee_loop'
            }, 1000)
          }
        } catch (error) {
          console.error(error)
        }
      }, 0)
    },
    pxToValue(px) {
      try {
        if (px && px !== 'normal') return Math.ceil(px.replace('px', ''))
        return 0
      } catch (error) {
        return 0
      }
    },
    handleWindowVisible() {
      this.$el.querySelectorAll('.df_marquee_inner_box').forEach((el) => {
        if (document.visibilityState === 'visible') {
          el.classList.remove('invisible')
        } else {
          el.classList.add('invisible')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.df_marquee {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  &:hover {
    .df_marquee_inner_box {
      animation-play-state: paused;
    }
  }
  .df_marquee_inner_box {
    white-space: nowrap;
    font-size: 14px;
    box-sizing: border-box;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    &.invisible {
      animation-play-state: paused;
    }
  }
}
</style>
<style lang="scss">
@keyframes marquee_loop {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-100%);
  }
}
</style>
