<template>
    <div class="live_vote" ref="voteRef" v-if="showLiveVote && isLivevote">
      <div class="ri_btn">
        <img src="/static/images/live/activities/btn_bg.png" alt="" />
        <div class="ri_btn_box">
          <!-- <voteCountdown :voteItem="defaultDetails" :isType="'video'"></voteCountdown> -->
          <div class="over-time" v-if="defaultDetails.status !== 6">
            {{ defaultDetails.end_timestamp > Math.floor(Date.now() / 1000) ? `截止：${getFormDate(defaultDetails.end_time)}` : '已截止投票' }}
          </div>
          <div v-else class="special-status">结果已开,待结算</div>
  
          <p class="explain_btn" @click.stop="handleExplainFun">
            <el-icon size="14"><Document /></el-icon>说明
          </p>
          <p class="help_btn" @click.stop="handleHelp">
            <el-icon size="14"><InfoFilled /></el-icon>帮助
          </p>
          <p class="icon_close" @click.stop="handleClose(false)">
            <el-icon size="24"><Close /></el-icon>
          </p>
        </div>
      </div>
      <!-- content-vote -->
      <div class="vote-content flex">
         <!-- 大屏幕 -->
          <div class="animation-area" v-if="isShowMore">
              <img src="/static/images/live/activities/woman.png" class="woman" />
              <!-- 圆球动画 -->
              <div class="circle-animation">
                  <CircleAnimation 
                    :showNumber="defaultDetails.addMonery"
                    :details="defaultDetails">
                  </CircleAnimation>
                  <LevelTrick 
                    :details="defaultDetails" 
                    :addBonusEveryTime="defaultDetails.bonus"/>
              </div>
          </div>
          <!-- 小屏幕 -->
          <div v-else class="small-screen">
              <CircleAnimation :showNumber="defaultDetails.addMonery" :details="defaultDetails">
                <LevelTrick 
                  :details="defaultDetails" 
                  :smallScreen="true" 
                  :addBonusEveryTime="defaultDetails.bonus"/>
              </CircleAnimation>
          </div>
          <!-- 投票 -->
          <VoteArea 
            :details="defaultDetails"
            />
          <!-- 更多投票 -->
            <div class="more-vote flex" v-show="isShowMore" @click="handleMore">
              <img src="/static/images/live/activities/more-vote.png" alt="" width="34" />
              <span>更多投票</span> 
          </div>
      </div>
    </div>
    

    <div v-show="!showLiveVote && isLivevote" @click.stop="handleClose(true)" class="close-switch small-screen">
        <CircleAnimation :details="defaultDetails" :showNumber="defaultDetails.addMonery">
          <LevelTrick 
            :details="defaultDetails" 
            :smallScreen="true" 
            :addBonusEveryTime="defaultDetails.bonus"/>
        </CircleAnimation>
        <div class="open-vote">展开投票</div>
    </div>
  <illustrate-dialog v-model="illustrateVisible" :explainData="explainData"></illustrate-dialog>
</template>

<script setup name="liveVote" lang="ts">
import { useStore } from 'vuex'
import { ref, nextTick } from 'vue'
import mittBus from '@/utils/mittBus'
// import { cloneDeep } from 'lodash-es';
import { Close, InfoFilled, Document } from '@element-plus/icons-vue'
import LevelTrick from './level-trick.vue'
import VoteArea from './vote-area.vue'
import CircleAnimation from './circle-animation.vue'
import { getFormDate } from '@/utils/common'
// import voteCountdown from '@/views/anchor/components/activities/voteCountdown.vue'
import illustrateDialog from '@/views/anchor/components/activities/illustrateDialog.vue'
const store = useStore()
const voteRef = ref<HTMLDivElement | null>(null)
const isShowMore = ref(false)
const illustrateVisible = ref(false)
const explainData = ref({})
const descriptionStr = ref('')
const showLiveVote = ref(true)
// const addBonusEveryTime = ref(0)
// const addMonery = ref(0)

// 设置默认值
const defautVote = {
  options: [],
  rules: [],
  vote_nums: 0,
  countdown: 0,
  title: '',
  description:'',
  id: ''
}
// 获取整个活动列表数据
const activitiesData = computed(() => store.state.activitiesData)

// 获取当前live_vote对应的vote数据
const defaultDetails = computed(() => {
  if (activitiesData.value && activitiesData.value.length) {
      const list = activitiesData.value.filter((ele) => ele.live_vote.length) || null;
      let maxTimeTtem = list && list.length && list.reduce((maxItem, currentItem) => {
        return currentItem.live_vote[0].created_timestamp > maxItem.live_vote[0].created_timestamp ? currentItem : maxItem
      })

      descriptionStr.value = maxTimeTtem?.description
      const liveVotes = maxTimeTtem ? maxTimeTtem.live_vote : null;
      const votes = maxTimeTtem ? maxTimeTtem.vote : null;
      let currentLiveVote = []
      if (votes && votes.length) {
        currentLiveVote = votes.filter((one) => liveVotes.some((tow) => tow.id === one.id)) || []
      } 
     
      // addMonery.value = currentLiveVote[0]?.addMonery || 0
      // addBonusEveryTime.value = currentLiveVote[0]?.bonus || 0
      return currentLiveVote.length ? currentLiveVote[0] : defautVote
    }
    return defautVote
})

// 判断是否有  live_vote
const isLivevote = computed(() => {
    return !!defaultDetails.value.options.length
})

// 活动说明
function handleExplainFun() {
  explainData.value = {
    title: '活动说明',
    description: descriptionStr.value
  }
  illustrateVisible.value = true

}
// 助力奖池，全民瓜分活动说
function handleHelp() {
  explainData.value = {
    title: '活动说明：',
    description: defaultDetails.value.detail
  }
  illustrateVisible.value = true
}
// 关闭
function handleClose(val) {
  showLiveVote.value = val
  if (val) {
    getLiveVoteFun()
  }
}
// 点击更多
function handleMore() {
  mittBus.emit('ismore', 'activities')
}

// 监听
const getLiveVoteFun = () =>{
  setTimeout(() => {
    if (voteRef.value) {
      const width = voteRef.value.clientWidth;
      if (width <= 999) {
        isShowMore.value = false
      } else {
        isShowMore.value = true
      }
    }
  }, 0)
}

watch(()=>isLivevote.value, (val) => {
  if (val) {
    getLiveVoteFun()
  }
})

// function processVoteFun() {
//   const sortListRules = defaultDetails.value.rules.sort((a, b) => b.num - a.num);
//   const items = sortListRules.find((o) => defaultDetails.value.vote_nums >= o.num);
//   addBonusEveryTime.value = items.bonus + (defaultDetails.value.vote_nums - items.num -1) * items.step_bonus;
// }

// function handleIMMessage(source) {
//     const data = cloneDeep(source)
//     if (data.action === 'vote' && data.vote_id === defaultDetails.value.id) {
//       // 处理奖池和票数
//       processVoteFun()
//     }
// }

onMounted(async() => {
    // mittBus.on('imOnMessage', handleIMMessage)
    await nextTick();
    getLiveVoteFun();
    window.addEventListener('resize', getLiveVoteFun);
})

onUnmounted(() => {
  // mittBus.off('imOnMessage', handleIMMessage)
  window.removeEventListener('resize', getLiveVoteFun);
})
</script>

<style scoped lang="scss">
.live_vote {
  height: 96px;
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  background-image: url(/static/images/live/activities/vote_bg.png);
  background-position: center center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index:2;
  .ri_btn {
    position: absolute;
    right: 0px;
    top: -34px;
    display: flex;
    img {
      width: 288px;
      height: auto;
    }
    .ri_btn_box {
      height: 34px;
      position: absolute;
      top: 0px;
      right: 0px;
      color: #fff;
      display: flex;
      align-items: center;
      // background-color: red;
      .over-time {
        font-size: 12px;
      }
      .special-status {
        font-size: 12px;
        color: #d02d54;
      }
      .explain_btn,
      .help_btn {
        padding: 2px 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #e0e3e7;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        cursor: pointer;
        margin-right: 4px;
        .el-icon {
          margin-right: 2px;
        }
      }
      .icon_close {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 1px;
        width: 24px;
        cursor: pointer;
        margin-right: 6px;
      }
    }
  }
}

.vote-content {
    position: relative;
    height: 100%;
    .animation-area {
        position: relative;
        height: 100%;
        width: 370px;
        .woman {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 176px;
        }
        .circle-animation {
            width: 306px;
            height:129px;
            position: absolute;
            left: 68px;
            bottom: 9px;
            background-image: url('/static/images/live/activities/circle_bg.png');
            background-size: 100%;
            background-repeat: no-repeat;
        }
    }
    
    .more-vote {
        width: 88px;
        height: 69px;
        border-radius: 8px;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.8);
        background: rgba(255, 255, 255, 0.1);
        flex-direction: column; 
        justify-content: center;
        margin-right:  8px;
    }
}
.small-screen {
      position: relative;
      min-width: 126px;
      width: 126px;
      height: 126px;
      bottom: 25px;
      border-radius: 50%;
      margin-left: 8px;
      background-image: url('/static/images/live/activities/small_circle.png');
      background-size: 100%;
      background-repeat: no-repeat;
      &.close-switch {
        position: absolute;
        bottom: 9px;
        z-index: 2;
        cursor: pointer;
        .open-vote {
          position: absolute;
          bottom:0;
          color:#fff;
          padding: 3px 0;
          border-radius: 50px;
          background-color: rgba(208, 45, 84, 0.8);
          z-index:202;
          text-align: center;
          width: 126px;
          font-size: 14px;
        }
      }
  }
</style>
