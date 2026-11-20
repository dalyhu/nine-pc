<template>
  <div class="vote-area" v-if="!isEmpty(details.options)">
    <div class="red-vote-name than" 
      :class="{ 
        'disabled_vote_button':  details.options[0].log_id !== null || details.options[1].log_id !== null || details.status === 6
        }"
       @click="handleClickTrick(0)">
      <div class="select-vote flex">
        <img
          src="/static/images/live/activities/select.png"
          alt=""
          width="24"
          v-if="details.options[0]?.log_id"
        />
        <span>{{ details.options[0]?.option_name }}</span>
      </div>
      <div class="click-vote">
        <span v-if="!isVote">点击投票</span>
        <span v-else> 已投票{{ isFlagHome ? '+1' : '' }} </span>
      </div>

      <!-- +1动画 -->
      <AddOneAnimation v-show="details.options[0]?.newAddNum" :showNumber="details.options[0]?.newAddNum" :voteId="details.id"/>
      <!-- <AddOneAnimation :showNumber="details.options[0]?.newAddNum" /> -->
    </div>

    <div class="process">
      <div class="flex">
        <img src="/static/images/live/activities/pk2.png" alt="" width="34" />
        <span class="voerFlow">{{ details.title }}</span>
      </div>
      <!-- 进度条  -->
      <div class="progress-bar flex">
        <span
          class="position-mask"
          :style="{ width: pkRate * 100 + '%' }"
          :class="{ 'not-mask-star': pkRate < 0.05 || pkRate > 0.95 }"
        ></span>
        <div class="red-pk flex">
          <span class="rate">{{ (rate1 * 100).toFixed(0) }} %</span>
          <span>{{ details.options[0]?.option_nums }} 票</span>
        </div>
        <div class="blue-pk flex">
          <span> {{ (rate2 * 100).toFixed(0) }} %</span>
          <span class="trick">{{ details.options[1]?.option_nums }}票</span>
        </div>
      </div>
    </div>

    <div class="blue-vote-name than" 
      :class="{ 
          'disabled_vote_button':  details.options[0].log_id !== null || details.options[1].log_id !== null || details.status === 6
          }"
      @click="handleClickTrick(1)">
      <div class="select-vote flex">
        <img
          src="/static/images/live/activities/select.png"
          alt=""
          width="24"
          v-if="details.options[1]?.log_id"
        />
        <span> {{ details.options[1]?.option_name }}</span>
      </div>
      <div class="click-vote">
        <span v-if="!isVote">点击投票</span>
        <span v-else> 已投票{{ isFlagAway ? '+1' : '' }} </span>
      </div>

      <!-- +1动画 -->
      <AddOneAnimation
        v-show="details.options[1]?.newAddNum"
        :showNumber="details.options[1]?.newAddNum"
        :voteId="details.id"
        type="blue"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { activityVote } from '@/api/activities.js'
import { isEmpty } from 'lodash-es'
import { useStore } from 'vuex'
import AddOneAnimation from './add-one-animation.vue'
const props = defineProps({
  details: {
    type: Object,
    default: () => ({})
  }
})
const store = useStore()
const pkRate = ref(0.5)
const rate1 = ref<number>(0)
const rate2 = ref<number>(0)
const userInfo = computed<UserInfo>(() => store.state.user.infoData)

const isVote = computed(() => {
  return props.details.options.some((ele) => ele.log_id)
})
const isFlagHome = computed(() => {
  return props.details.options[0]?.log_id
})
const isFlagAway = computed(() => {
  return props.details.options[1]?.log_id
})

const handleVote = (val) => {
  // 先登录
  if (!userInfo.value.id) {
    store.state.user.showLoginMask = true
    return
  }
  if (props.details.status === 6) return;

  let list = props.details.options
  let currentData = props.details
  if (list && list.length) {
    if (list.some((item) => item.log_id)) {
      return '已投票,不能再投'
    } else {
      activityVote({ option_id: list[val]?.id }).then((res) => {
        const { data = false } = res
        if (data) {
          list[val].log_id = '投票成功'
          list[val].option_nums +=1
          currentData.vote_nums +=1
        }
      })
    }
  }
}
const handleClickTrick = useDebounceFn(handleVote, 300)

watch(
  () => props.details.vote_nums,
  (val) => {
    if (val) {
      rate1.value = +(props.details.options[0]?.option_nums / val).toFixed(2) || 0
      rate2.value = +(props.details.options[1]?.option_nums / val).toFixed(2) || 0

      if (rate1.value === 0 && rate2.value === 0) {
        pkRate.value = 0.5
        return
      }

      if (rate2.value >= 0.5) {
        pkRate.value = 1 - rate2.value
      } else {
        pkRate.value = rate1.value
      }
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
// .voerFlow {
  // max-width: 200px;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
// }

.vote-area {
  position: relative;
  height: 71px;
  min-width: 500px;
  padding: 4px 9px;
  border-radius: 8px;
  display: flex;
  flex: 1;
  margin: 0 12px;
  box-sizing: border-box;
  border: 1px solid transparent;
  &::before {
    content: '';
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
    border-radius: 8px;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-image: linear-gradient(to right, #ce2c53 20%, #3f2ed4 80%);
    border-image-slice: 1;
    pointer-events: none;
  }

  .process {
    flex: 1;
    color: #fff;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: space-around;
  }
  .than {
    color: #fff;
    width: 118px;
    height: 60px;
    border-radius: 8px;
    position: relative;
    font-size: 14px;
    cursor: pointer;
    background-size: 100%;
    background-repeat: no-repeat;
    &.disabled_vote_button {
        cursor: not-allowed;
      }
    .select-vote {
      justify-content: center;
      padding-top: 12px;
      > span {
        margin-left: 5px;
        max-width: 110px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .click-vote {
      font-size: 13px;
      position: absolute;
      bottom: 0px;
      left: 50%;
      transform: translateX(-50%);
      background-size: 100%;
      background-repeat: no-repeat;
    }
    &.red-vote-name {
      // background: linear-gradient(90deg, #eb3377 50%, #ff9eb6 100%);
      background-image: url('/static/images/live/activities/home_away_bg.png');
      .click-vote {
        color: #ffa4ba;
      }
    }
    &.blue-vote-name {
      // background: linear-gradient(to right, #74B1FF 0, #302BFF);
      background-image: url('/static/images/live/activities/away_bg.png');
      .click-vote {
        color: #8d8aff;
      }
    }
  }

  .progress-bar {
    height: 19px;
    border-radius: 100px;
    background: #4632e1;
    position: relative;
    justify-content: space-between;
    .position-mask {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 49%;
      border-radius: 100px;
      background: #dd2d54;
      &.not-mask-star {
        &::before {
          content: '';
          background-image: url();
        }
      }
      &::before {
        content: '';
        width: 16px;
        height: 100%;
        position: absolute;
        right: -4px;
        display: inline-block;
        background-image: url('/static/images/live/activities/lightning.svg');
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: 0 center;
      }
    }
    .red-pk,
    .blue-pk {
      z-index: 2;
      color: #fff;
      font-size: 12px;
      padding: 0 10px;
      .rate,
      .trick {
        padding: 0 5px;
      }
    }
    .red-pk {
      &::before {
        content: '';
        width: 16px;
        height: 16px;
        display: inline-block;
        background-image: url('/static/images/live/activities/star.svg');
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: 0 center;
      }
    }
    .blue-pk {
      &::after {
        content: '';
        width: 16px;
        height: 16px;
        display: inline-block;
        background-image: url('/static/images/live/activities/star.svg');
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: 0 center;
      }
    }
  }
}
</style>
