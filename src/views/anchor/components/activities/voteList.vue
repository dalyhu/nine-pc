<template>
  <div class="pk_item" v-for="pkItem in guessItem.vote" :key="pkItem.id">
    <div class="pk_title voerFlow">{{ pkItem.title }}</div>
    <div class="pk_vote">
      <div class="pk_vote_l">
        <div class="pk_vote_button_box">
          <div
            class="pk_vote_button"
            :title="pkItem.options[0].log_id ? `你已投票${pkItem.options[0].option_name}` : ''"
            :class="[
              pkItem.options[0].log_id ? 'check_icon' : '',
              pkItem.options[0].log_id !== null ||
              pkItem.options[1].log_id !== null ||
              pkItem.status === 6
                ? 'disabled_vote_button'
                : ''
            ]"
            @click="handleVoteDebounceFn(pkItem, pkItem.options[0], pkItem.options)"
          >
            <img src="/static/images/live/activities/icon_check.svg" alt="" />
            <span class="voerFlow">{{ pkItem.options[0].option_name }}</span>
          </div>
        </div>
        <p>{{ pkItem.options[0].option_nums }}票</p>
        <el-progress :percentage="percentageValue(pkItem)[0]" :show-text="false" :stroke-width="6">
        </el-progress>
      </div>
      <img src="/static/images/live/activities/pk.png" alt="" />
      <div class="pk_vote_r">
        <div class="pk_vote_button_box">
          <div
            class="pk_vote_button"
            :title="pkItem.options[1].log_id ? `你已投票${pkItem.options[1].option_name}` : ''"
            :class="[
              pkItem.options[1].log_id ? 'check_icon' : '',
              pkItem.options[0].log_id !== null ||
              pkItem.options[1].log_id !== null ||
              pkItem.status === 6
                ? 'disabled_vote_button'
                : ''
            ]"
            @click="handleVoteDebounceFn(pkItem, pkItem.options[1], pkItem.options)"
          >
            <img src="/static/images/live/activities/icon_check.svg" alt="" />
            <span class="voerFlow">{{ pkItem.options[1].option_name }}</span>
          </div>
        </div>
        <p>{{ pkItem.options[1].option_nums }}票</p>
        <el-progress
          color="#5473ff"
          :percentage="percentageValue(pkItem)[1]"
          :show-text="false"
          :stroke-width="6"
        >
        </el-progress>
      </div>
    </div>
    <div class="bonus_box">
      <div class="prize_pool">
        <span>奖池:</span>
        {{ Number(pkItem.bonus).toFixed(2) }}
      </div>
      <div v-if="pkItem.status !== 6">
        {{
          pkItem.end_timestamp > Math.floor(Date.now() / 1000)
            ? `截止时间：${getFormDate(pkItem.end_time)}`
            : '已截止投票'
        }}
      </div>
      <div v-else class="special-status">结果已开,待结算</div>
      <!-- <voteCountdown :voteItem="pkItem" @handleVoteEnd="handleVoteEnd"></voteCountdown> -->
      <div
        class="live_btn"
        @click="goLivePage(pkItem)"
        :class="[pkItem.anchor_id ? '' : 'disabled_btn']"
      >
        {{ pkItem.anchor_id ? '观看直播' : '暂无直播' }}
      </div>
    </div>
    <div class="progress_box">
      <el-progress
        :percentage="levelPercentageValue(pkItem)"
        :text-inside="true"
        :stroke-width="19"
      >
        <span>{{ prizePoolStage(pkItem) }}</span>
      </el-progress>
      <el-icon @click.stop="handleBonus(pkItem)" size="12"><InfoFilled /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import { InfoFilled } from '@element-plus/icons-vue'
import { activityVote } from '@/api/activities.js'
import { getFormDate } from '@/utils/common'
// import voteCountdown from '@/views/anchor/components/activities/voteCountdown.vue'
import { useStore } from 'vuex'
const router = useRouter()
const store = useStore()
defineProps({
  guessItem: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['handleExplain', 'voteEnd'])
const userInfo = computed(() => store.state.user.infoData)
// 下一级的票数num-当前的vote_nums总票数
const prizePoolStage = computed(() => {
  return (curr) => {
    const currRules = curr.rules && curr.rules.sort((a, b) => a.num - b.num)
    const voteItem = currRules.find((item) => item.num > curr.vote_nums) || null

    return voteItem
      ? `奖池升级下一级尚须：${voteItem.level}级/${voteItem.num - curr.vote_nums}票`
      : `奖池升级下一级尚须: 最大等级`
  }
})

const levelPercentageValue = computed(() => {
  return (curr) => {
    const currRules = curr.rules && curr.rules.sort((a, b) => a.num - b.num)
    const currlevelItem = currRules.find((item) => item.num > curr.vote_nums) || null
    // const currLevelItem = curr.rules.find((item) => curr.level === item.level)
    // const nextLevelItem = curr.rules.find((item) => curr.level + 1 === item.level)
    // const num =
    //   curr.level === curr.rules.length && !nextLevelItem
    //     ? 100
    //     : parseInt(
    //         ((curr.vote_nums - currLevelItem.num) / (nextLevelItem.num - currLevelItem.num)) * 100 +
    //           ''
    //       )
    if (currlevelItem) {
      return curr.vote_nums > currlevelItem.num ? 100 : (curr.vote_nums / currlevelItem.num) * 100
    }
    return 100
  }
})

// vote_nums总票数/option_nums投票的数量*100
const percentageValue = computed(() => {
  return (voteItem) => {
    return [
      voteItem.vote_nums === 0
        ? 0
        : parseInt((voteItem.options[0].option_nums / voteItem.vote_nums) * 100 + ''),
      voteItem.vote_nums === 0
        ? 0
        : parseInt((voteItem.options[1].option_nums / voteItem.vote_nums) * 100 + '')
    ]
  }
})

// function handleVoteEnd(voteValue) {
//   emits('voteEnd', { ...props.guessItem, vote_id: voteValue.id })
// }

// 投票 vote_option_id 收到事件加+1
const handleVoteDebounceFn = useDebounceFn(handleVote, 90)

const requestLoading = ref(false)

function handleVote(pkItem, curr, options) {
  if (pkItem.status === 6) return

  if (!userInfo.value.id) {
    store.state.user.showLoginMask = true
    // ElMessage.error('请先登录，在投票!')
  } else {
    if (requestLoading.value) return false
    requestLoading.value = true
    if (options[0].log_id !== null || options[1].log_id !== null) return
    activityVote({
      option_id: curr.id
    })
      .then((res) => {
        // 投票成功以后修改log_id的状态，log_id !==null都为已投票
        const { data = false } = res
        if (data) {
          curr.log_id = 1
          curr.option_nums += 1
          pkItem.vote_nums += 1
        }
      })
      .finally(() => {
        requestLoading.value = false
      })
  }
}

function handleBonus({ title, detail }) {
  emits('handleExplain', {
    name: title,
    type: 2,
    description: detail
  })
}

const playerIframe = document.querySelector('.iframe-container')
function goLivePage(item) {
  if (!item.anchor_id) return
  playerIframe &&
    playerIframe.contentWindow.postMessage(
      {
        messageType: 'controlIframe',
        event: 'pause'
      },
      '*'
    )
  const live_path = `/live?router=main&uid=${item.anchor_id}`
  let route = router.resolve({ path: live_path, query: { uid: item.anchor_id } })
  window.open(route.href, '_self')
}

// watch(() => props.guessItem.vote_nums, ()=>{
//   console.error(Math.floor(performance.now()), '界面渲染时间毫秒')
// }, { deep: true })
</script>

<style scoped lang="scss">
.voerFlow {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pk_item {
  height: 174px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #f5d5dc;
  background-color: #fff4f7;
  margin-bottom: 4px;
  padding: 8px 0px;
  .special-status {
    color: #d02d54;
  }
  .pk_title {
    padding-left: 8px;
    margin-bottom: 4px;
    color: var(--el-color-black);
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    max-width: 92%;
  }
  .pk_vote {
    box-sizing: border-box;
    height: 82px;
    background-image: url(/static/images/live/activities/pk_vote_bg.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .pk_vote_l,
    .pk_vote_r {
      flex: 1;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      .pk_vote_button_box {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 4px;
        .pk_vote_button {
          position: relative;
          padding: 0px 12px;
          height: 28px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          border-radius: 38px;
          background-color: var(--el-primary-background-color);
          color: #fff;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          transition: all 0.2s ease-in-out;
          box-shadow:
            0px 2px 4px 0px rgba(255, 255, 255, 0.25),
            0px 4px 8px 0px rgba(208, 45, 84, 0.3);
          img {
            position: absolute;
            opacity: 0;
            top: 4px;
            left: 12px;
            width: 24px;
            height: 20px;
            margin-right: 4px;
            transition: all 0.3s ease-in-out;
          }
        }
        .check_icon {
          padding-left: 40px;
          img {
            opacity: 1;
          }
        }
        .disabled_vote_button {
          cursor: not-allowed;
        }
      }

      p {
        color: var(--el-primary-text-color);
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
      }
      .el-progress {
        padding-right: 20px;
        :deep(.el-progress-bar__outer) {
          background-color: #fff;
        }
      }
    }
    .pk_vote_l {
      padding-left: 16px;
    }
    .pk_vote_r {
      align-items: flex-end;
      padding-right: 16px;
      .pk_vote_button_box {
        .pk_vote_button {
          background-color: #5473ff;
          box-shadow:
            0px 2px 4px 0px rgba(255, 255, 255, 0.25),
            0px 4px 8px 0px rgba(84, 115, 255, 0.3);
        }
      }

      p {
        text-align: right;
        color: #5473ff;
      }
      .el-progress {
        transform: rotate(180deg);
      }
    }
    img {
      width: 58px;
      height: 58px;
      flex-shrink: 0;
    }
  }
  .bonus_box {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    .prize_pool {
      color: var(--el-primary-text-color);
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      padding-left: 8px;
      span {
        margin-right: 4px;
        color: var(--el-color-black);
      }
    }

    .live_btn {
      cursor: pointer;
      align-self: self-end;
      height: 20px;
      line-height: 20px;
      padding: 0px 8px;
      border-radius: 32px;
      border: 1px solid var(--el-primary-border-color);
      color: var(--el-primary-text-color);
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      margin-right: 8px;
    }
    .disabled_btn {
      // pointer-events: none;
      cursor: not-allowed;
      border: 1px solid #a8abb2;
      background-color: #fff;
      color: rgba(168, 171, 178, 0.8);
    }
  }
  .progress_box {
    position: relative;
    padding: 0px 8px;
    .el-progress {
      :deep(.el-progress-bar__outer) {
        background-color: #2d040c;
      }
      :deep(.el-progress-bar__inner) {
        text-align: left;
        border-radius: 0px;
        .el-progress-bar__innerText {
          margin-left: 12px;
        }
      }
    }
    .el-icon {
      cursor: pointer;
      color: #c3c3c3;
      position: absolute;
      top: 3px;
      right: 12px;
    }
  }
}
</style>
