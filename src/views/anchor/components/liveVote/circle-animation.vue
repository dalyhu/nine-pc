<template>
  <div class="circle">
    <!-- +s动画 -->
    <AddOneAnimation :showNumber="showNumber" type="circle" :voteId="details.id" v-show="Number(showNumber) > 0" />

    <div class="max-box">
      <svg
        class="wave"
        :style="isTop"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 200 210"
      >
        <defs>
          <path
            id="wave-shape"
            stroke="rgba(255,255,255,.8)"
            stroke-width=".5"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 58-18 88-18 58 18 88 18 v185h-528z"
          ></path>
        </defs>
        <g class="parallax">
          <use xlink:href="#wave-shape" x="50" y="0" fill="url(#linear)"></use>
          <use xlink:href="#wave-shape" x="50" y="10" fill="url(#linear)"></use>
          <!-- 第二个波纹 -->
        </g>
        <defs>
          <linearGradient
            id="linear"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientTransform="rotate(90)"
          >
            <stop offset="10%" stop-color="#ff3874" stop-opacity="0.75" />
            <stop offset="80%" stop-color="#ff3874" stop-opacity="1" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- <div class="wave wave1" :style="isTop"></div> -->
    <!-- <div class="wave wave2" :style="isTop"></div> -->
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import AddOneAnimation from './add-one-animation.vue'
const props = defineProps({
  showNumber: {
    type: Number,
    default: 0
  },
  details: {
    type: Object,
    default: () => ({})
  }
})

const isTop = computed(() => {
  const maxVal = props.details.rules.reduce((max, current) => {
    return current.level > max.level ? current : max
  }, props.details.rules[0])
  return {
    marginTop:
      props.details.vote_nums / maxVal?.num >= 1
        ? '10%'
        : (1 - props.details.vote_nums / maxVal?.num) * 100 + '%'
  }
})
</script>
<style scoped lang="scss">
.circle {
  width: 126px;
  height: 126px;
  border-radius: 50%;
  position: relative;
  bottom: 0;
  .max-box {
    width: 126px;
    height: 126px;
    border-radius: 50%;
    position: absolute;
    bottom:0;
    overflow: hidden;
  }

  .wave {
    // margin-top: 50%;
    width: 100%;
    height: 150px;
    position: relative;
    overflow: hidden;
    position: relative;
    bottom: 0;
  }
}

.wave {
  // margin-top: 50%;
  width: 100%;
  height: 150px;
  position: relative;
  overflow: hidden;
  z-index: 2;
  top: -30px;
}

.parallax > use {
  animation: wave-move 2s linear infinite;
}

.parallax > use:nth-child(1) {
  animation-delay: 0s; /* 第一个波纹的延迟 */
}

.parallax > use:nth-child(2) {
  animation-delay: -0.3s; /* 第二个波纹的延迟 */
}

@keyframes wave-move {
  0% {
    transform: translate(90px, 0);
  }
  100% {
    transform: translate(-85px, 0);
  }
}
// $height-c: 50px * 1.732;

// .circle {
//   width: 126px;
//   height: 126px;
//   border-radius: 50%;
//   overflow: hidden;
//   position: relative;
//   bottom:0;
// }

// .wave {
//   height: 126px;
//   background-color: #ff3874;
//   margin-top: 80%;   // 0  填满    200在最低下面
//   width: 560px;
//   animation: wave linear infinite 8s;
//   position: absolute;

//   &::before {
//     content: '';
//     position: absolute;
//     left:0;
//     height: $height-c;
//     width:100%;
//     top:calc(-1 * $height-c / 1.8);
//     background: radial-gradient(50px circle at 0 0, #ff387410 50px, transparent),
//      radial-gradient(50px circle at 50px $height-c, #ff3874 50px, transparent),
//       radial-gradient(50px circle at 100px 0,#ff387410 50px, transparent);
//     background-size: 100px 100px;

//   }
//   &.wave1 {
//     opacity: .75;
//     z-index: 2;
//   }

//   &.wave2 {
//     top: 0px;
//     z-index: 1;
//     animation-name: wave1;
//   }
// }

// @keyframes wave {
//   from { transform: translatex(-280px) };
//   to { transform: translatex(0px) }
// }

// @keyframes wave1 {
//   from { transform: translatex(0px) }
//   to { transform: translatex(-280px) };
// }
</style>
