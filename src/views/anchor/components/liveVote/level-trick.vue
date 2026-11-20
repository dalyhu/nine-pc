<template>
  <!-- 大屏 -->
  <div class="level-trick" v-if="!smallScreen">
    <div class="level">
      <span class="legend-position" :style="{ width: ratesPer }"></span>
      <div class="block-bottom flex">
        <img src="/static/images/live/activities/hg.png" width="16" />
        <!-- <span>下一级:</span> -->
        <span>{{ showLevelDiffer }}</span>
      </div>
    </div>
    <!-- 奖池 -->
    <div class="level prize">
      <span class="legend-position pos-prize" :style="{ width: '50%' }"></span>
      <div class="block-bottom flex">
        <img src="/static/images/live/activities/icon_gold.png" width="16" />
        <span>奖池:</span>
        <span>{{ Number(addBonusEveryTime).toFixed(2) }}</span>
      </div>
    </div>
  </div>
  <!-- 小屏 -->
  <div v-else class="small-level-trick">
    <div class="block-bottom flex">
      <img src="/static/images/live/activities/hg.png" width="16" />
      <span>{{ showLevelDiffer }}</span>
    </div>
    <div class="block-bottom flex">
      <img src="/static/images/live/activities/icon_gold.png" width="16" />
      <span>{{ Number(addBonusEveryTime).toFixed(2) }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch, ref } from 'vue'
const props = defineProps({
  details: {
    type: Object,
    default: () => ({})
  },
  smallScreen: {
    type: Boolean,
    default: false
  },
  addBonusEveryTime: {
    type: Number,
    default: 0
  }
})

const showLevelDiffer = ref('1级/0票')
const ratesPer = ref('')

watch(
  () => props.details,
  (val) => {
    definLevelFun(val)
  },
  { deep: true, immediate: true }
)

// 计算下一级和所差的票数
function definLevelFun(obj) {
  const newObj = obj.rules && obj.rules.sort((a, b) => a.num - b.num)
  const items = (newObj && newObj.find((o) => o.num > obj.vote_nums)) || null
  const downLevel = items ? items.level + '级/' : '最大等级'
  const differ = items ? items.num - obj.vote_nums + '票' : ''

  showLevelDiffer.value = downLevel + differ

  ratesPer.value = items ? ((obj.vote_nums / items.num) * 100).toFixed(0) + '%' : '100%'
}
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}
.level-trick {
  position: absolute;
  right: 8px;
  bottom: 9px;
  color: #fff;
  .level {
    height: 26px;
    background: #2d040c;
    border: 2px solid #2d040c;
    box-sizing: border-box;
    border-radius: 40px;
    font-size: 14px;
    overflow: hidden;
    width: 160px;
    position: relative;
    &.prize {
      margin-top: 6px;
    }
    .block-bottom {
      align-items: center;
      padding-left: 10px;
      flex-wrap: nowrap;
      position: absolute;
      left: 0;
      z-index: 2;
      white-space: nowrap;
      > img {
        margin-right: 5px;
      }
    }
    .right_icon {
      position: absolute;
      right: 0;
      z-index: 2;
      top: 50%;
      transform: translateY(-50%);
      padding-right: 10px;
    }
    .legend-position {
      position: absolute;
      left: 0px;
      border-radius: 40px 0 0 40px;
      transition: width 500ms ease;
      height: 24px;
      overflow: hidden;
      z-index: 1;
      top: 0;
      width: 0;
      background: #dd2d54;
      &.pos-prize {
        background: #ff571a;
      }
    }
  }
}

.small-level-trick {
  position: absolute;
  top: 50%;
  z-index: 9;
  width: 100%;
  margin: auto;
  transform: translateY(-50%);
  .block-bottom {
    font-size: 12px;
    color: #fff;
    width: 100%;
    letter-spacing: 1.5px;
    justify-content: center;
    > img {
      margin-right: 4px;
    }
  }
}
</style>
