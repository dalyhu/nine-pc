<template>
  <div class="increment" :class="{ cricleAnimate: type === 'circle' }">
    <div
      class="animate"
      :class="type"
      v-for="item in animateList"
      :key="item.id"
      @animationend="onAnimationend(item.id)"
      v-show="Number(item.showNumber) > 0"
    >
      <span :class="{ circlestyle: type === 'circle', blueStyle: type === 'blue' }"
        >{{ type === 'circle' ? '￥' : '+'
        }}{{ type === 'circle' ? Number(item.showNumber).toFixed(2) : item.showNumber }} 
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onUnmounted } from 'vue'
import { cloneDeep, throttle } from 'lodash-es'
import mittBus from '@/utils/mittBus'
const props = defineProps({
  showNumber: {
    type: Number,
    default: 0
  },
  voteId: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    default: ''
  }
})

type animateItemType = {
  id: number
  showNumber: number
}

const animateList = reactive<animateItemType[]>([])



const generateItems = throttle(()=> {
  const animateItem: animateItemType = {
    id: Date.now(),
    showNumber: props.showNumber
  }

  animateList.push(animateItem)
}, 1300)

// 当动画加速的时候必须要清楚该元素，防止元素过多，造成前段页面卡顿
const onAnimationend = (id: number) => {
  const index = animateList.findIndex((item) => item.id === id)
  
  if (index !== -1) {
    setTimeout(() => {
      animateList.splice(index, 1)
    }, 300)
  }
}

function handleIMMessage(source: any) {
  const data = cloneDeep(source)
  try {
    switch (data.action) {
      case 'vote': {
        if (data.vote.some(ele => ele.vote_id === props.voteId )) {
          generateItems()
        }
        break
      }
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  mittBus.on('imOnMessage', handleIMMessage)
})

onUnmounted(() => {
  mittBus.off('imOnMessage', handleIMMessage)
})
</script>

<style lang="scss" scoped>
.increment {
  position: relative;
  width: 100%;
  height: 100%;
  &.cricleAnimate {
    height: 50%;
  }
  .animate {
    position: absolute;
    top: 50%;
    right: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    color: #ff000f;
    animation: rise 3s linear;
    animation-fill-mode: forwards;

    span {
      font-size: 30px;
      font-weight: bold;
      &.blueStyle {
        color: #00b2ff;
      }
      &.circlestyle {
        color: #fff;
      }
    }
  }
}

@keyframes rise {
  0% {
    opacity: 0.6;
    transform: translate3d(40%, -50%, 0);
  }
  12% {
    opacity: 0.6;
    transform: translate3d(50%, -80%, 0);
  }
  25% {
    opacity: 0.8;
    transform: translate3d(60%, -120%, 0);
  }
  50% {
    opacity: 1;
    transform: translate3d(80%, -160%, 0);
  }
  75% {
    opacity: 0.6;
    transform: translate3d(70%, -200%, 0);
  }
  88% {
    opacity: 0.6;
    transform: translate3d(60%, -220%, 0);
  }
  100% {
    opacity: 0;
    transform: translate3d(50%, -230%, 0);
  }
}

// @keyframes riseLine {
//   0% {
//     opacity: 0.6;
//     transform: translate3d(50%, -50%, 0);
//   }
//   25% {
//     opacity: 0.8;
//     transform: translate3d(50%, -60%, 0);
//   }
//   50% {
//     opacity: 1;
//     transform: translate3d(50%, -70%, 0);
//   }
//   75% {
//     opacity: 0.6;
//     transform: translate3d(50%, -80%, 0);
//   }
//   100% {
//     opacity: 0;
//     transform: translate3d(50%, -100%, 0);
//   }
// }
</style>
