<template>
  <div class="animation_arrows" @click="changeFold">
    <span>赛况比分</span>
    <div class="arrows_box" :class="{ active_arrows_box: isExpand }">
      <div class="arrow arrow-animation-1"></div>
      <div class="arrow arrow-animation-2"></div>
      <div class="arrow arrow-animation-3"></div>
    </div>
  </div>
</template>

<script setup name="animationArrows" lang="ts">
defineProps({
  isExpand: {
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(['change'])

const changeFold = () => {
  emits('change')
}
</script>

<style scoped lang="scss">
.animation_arrows {
  cursor: pointer;
  z-index: 21;
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -56px;
  height: 20px;
  width: 112px;
  background-image: url('/static/images/live/arrows_bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  span {
    color: #fff;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
  }
  .arrows_box {
    position: relative;
    width: 18px;
    height: 100%;

    .arrow {
      position: absolute;
      top: 0;
      left: 5px;
    }

    .arrow-animation-1 {
      -webkit-animation: arrow-movement 1.2s ease-in-out infinite;
      animation: arrow-movement 1.2s ease-in-out infinite;
    }

    .arrow-animation-2 {
      -webkit-animation: arrow-movement 1.2s 0.4s ease-in-out infinite;
      animation: arrow-movement 1.2s 0.4s ease-in-out infinite;
    }

    .arrow-animation-3 {
      -webkit-animation: arrow-movement 1.2s 0.8s ease-in-out infinite;
      animation: arrow-movement 1.2s 0.8s ease-in-out infinite;
    }

    .arrow:before,
    .arrow:after {
      background: #fff;
      content: '';
      display: block;
      height: 2px;
      position: absolute;
      top: 2px;
      left: 0;
      width: 8px;
      border-radius: 10px;
    }

    .arrow:before {
      -webkit-transform: rotate(45deg) translateX(-10%);
      transform: rotate(45deg) translateX(-10%);
      -webkit-transform-origin: top left;
      transform-origin: top left;
    }

    .arrow:after {
      -webkit-transform: rotate(-45deg) translateX(10%);
      transform: rotate(-45deg) translateX(10%);
      -webkit-transform-origin: top right;
      transform-origin: top right;
    }

    @-webkit-keyframes arrow-movement {
      0% {
        opacity: 0;
      }

      50% {
        opacity: 1;
      }

      100% {
        opacity: 0;
        top: 54%;
      }
    }

    @keyframes arrow-movement {
      0% {
        opacity: 0;
      }

      50% {
        opacity: 1;
      }

      100% {
        opacity: 0;
        top: 54%;
      }
    }
  }
  .active_arrows_box {
    transform: rotate(180deg);
  }
}
</style>
