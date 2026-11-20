<template>
  <div class="activities hide_scrollbar">
    <div class="activities_title">
      <p>活动先锋报</p>
      <div class="button btn" @click="handelBtn">
        <el-icon size="14">
          <InfoFilled />
        </el-icon>关于活动
      </div>

      <div class="button2 btn" @click="handelRecored('16')">
        <img src="/static/images/live/activities/Subtract.svg" alt="" />活动记录
      </div>

      <!-- <el-popover trigger="hover" placement="bottom" width="380">
        <div class="record-style">
          <span @click="handelRecored('13')">投票记录</span>
          <span @click="handelRecored('16')">包賠记录</span>
        </div>
        <template #reference>

        </template>
</el-popover> -->
    </div>
    <!-- 活动列表 -->
    <div class="activities_content" v-if="activitiesData.length">
      <div class="collapse_item" v-for="guessItem in activitiesData" :key="guessItem.id">
        <div class="collapse_box" :style="{
          // paddingBottom: `${selectIds.includes(guessItem.id) ? guessItem.vote.length * 178 : 0}px`
          paddingBottom: boxPaddingBottom(guessItem) + 'px'
        }">
          <div class="guess_box">
            <div class="guess_item" :class="{ 'reset-gray': guessItem.status !== 1 }" :style="{
              backgroundImage: `url(${guessItem.img_address
                  ? guessItem.img_address
                  : '/static/images/live/activities/guess_item_bg.png'
                })`
            }">
              <div class="guess_item_inner">
                <div class="guess_item_title">
                  <div class="guess_title">
                    <p class="name">{{ guessItem.name }}</p>
                    <el-icon v-if="guessItem.type === 2" @click.stop="handelInfoFilled(guessItem)" size="13">
                      <InfoFilled />
                    </el-icon>
                  </div>
                  <!-- 领取奖励 -->
                  <div v-show="guessItem.status == 1 && guessItem.type === 2" class="rec_button"
                    @click="handelReceive(guessItem)">
                    <span class="rec_button__inner">
                      <img src="/static/images/live/activities/icon_gold.png" alt="" />
                      <span class="rec_button__text">领取奖励</span>
                    </span>
                  </div>
                  <!-- 申请包赔 -->
                  <div v-show="guessItem.type === 3 && !guessItem.apply" class="rec_button"
                    @click="handelReceive(guessItem)">
                    <span class="rec_button__inner">
                      <img src="/static/images/live/activities/icon_gold.png" alt="" />
                      <span class="rec_button__text">{{
                        guessItem.sub_type === 1 ? (guessItem?.name ? guessItem.name : '超级包賠') : '申请包賠'
                      }}</span>
                    </span>
                  </div>
                </div>
                <div class="des_num" v-show="guessItem.status == 1 && guessItem.type === 2">
                  本周累计奖励：<span>{{ Number(guessItem.bonus).toFixed(2) }}/{{
                    Number(guessItem.bonus_max).toFixed(2)
                  }}</span>
                  已提交领取：<span>{{ Number(guessItem.bonus_received).toFixed(2) }}</span>
                </div>
                <!-- 截至时间 -->
                <div v-show="guessItem.status == 1" class="close-time">
                  {{ `截止日期：${guessItem.close_time}` }}
                </div>
                <!-- 开始时间 -->
                <div v-show="guessItem.status == -2" class="close-time">
                  {{ `开始日期：${getFormDate(guessItem.start_time, 'YYYY.MM.DD')}` }}
                </div>
                <!-- 包赔玩法说明按钮 -->
                <div v-if="guessItem.type === 3" class="fold_btn pack-pay-button flex-center"
                  @click="handelInfoFilled(guessItem)">
                  <img src="/static/images/live/activities/sign.png" alt="sign" />
                  活动说明
                </div>
                <!-- 投票活动开展 -->
                <div v-if="guessItem.status === 1 && guessItem.type === 2" class="fold_btn"
                  @click="handelFoldBtn(guessItem.id)">
                  <img :class="[selectIds.includes(guessItem.id) ? '' : 'icon-down']"
                    src="/static/images/live/activities/icon_expand.svg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pk_box" :style="{
          opacity: `${selectIds.includes(guessItem.id) ? 1 : 0}`
        }">
          <voteList v-if="guessItem.vote.length" :guessItem="guessItem" @handleExplain="handelInfoFilled"
            @voteEnd="handleVoteEnd"></voteList>

          <DfEmpty v-else class="vote-empty" description="暂无其它投票，稍后过来查看" />
        </div>
      </div>
    </div>

    <!-- 无数据显示 -->
    <DfEmpty v-else class="resert-empty" />
  </div>

  <illustrate-dialog v-model="illustrateVisible" :explainData="explainData"></illustrate-dialog>
  <helpDialog v-model="helpVisible" @bindAccountSuccess="(value) => (isXCAccountInfo = value)"
    :isXCAccountInfo="isXCAccountInfo"></helpDialog>
  <applyDialog v-model="applyVisible" :guessItem="guessItemData" @receiveSuccess="emits('receiveSuccess')">
  </applyDialog>

  <!-- 申请包赔 -->
  <GrauantedForm
    v-model:isGrauantedShow="isGrauantedShow"
    :sub-item-id="granantedEventId"
    :live-room="live_room"
    @change="updateApplyVal"
  ></GrauantedForm>
  <!-- 申请包赔玩法说明 -->
  <GrauantedCaption v-model:isPackPayCaptionShow="isPackPayCaptionShow" :description="description"></GrauantedCaption>
</template>

<script setup name="activities" lang="ts">
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { InfoFilled } from '@element-plus/icons-vue'
import illustrateDialog from '@/views/anchor/components/activities/illustrateDialog.vue'
import helpDialog from '@/views/anchor/components/activities/helpDialog.vue'
import voteList from '@/views/anchor/components/activities/voteList.vue'
import applyDialog from '@/views/anchor/components/activities/applyDialog.vue'
import GrauantedCaption from '@/views/anchor/components/activities/grananted-caption.vue'
import GrauantedForm from '@/views/anchor/components/activities/grananted-form.vue'
import mittBus from '@/utils/mittBus'
import { getFormDate } from '@/utils/common'
import { userXCAccount } from '@/api/activities.js'

const store = useStore()
const router = useRouter()
const emits = defineEmits(['receiveSuccess'])
defineProps({
  live_room: {
    type: Number,
    default: 0
  }
})

const illustrateVisible = ref(false)
const helpVisible = ref(false)
const applyVisible = ref(false)
const granantedEventId = ref<number | string | null>(null)
const isPackPayCaptionShow = ref(false)
const isGrauantedShow = ref(false)
const description = ref('')
const isXCAccountInfo = ref({
  xing_account: ''
}) // 体育站账户信息
const guessItemData = ref({})
const explainData = ref({})
const selectIds = ref([])
const activitiesData = computed(() => store.state.activitiesData)
const userInfo = computed(() => store.state.user.infoData)

// 处理ws 推送过来的数据
function precrossWsDataFun(deepSource) {
  // 使用 Map 优化查找和构建
  const transformedVote = deepSource.vote.reduce(
    (acc, { activity_id, anchor_id, vote_id, num, vote_option_id, total_num }) => {
      const key = `${activity_id}-${anchor_id}-${vote_id}` // 唯一标识每个 vote
      if (!acc.has(key)) {
        acc.set(key, { activity_id, anchor_id, vote_id, options: [] })
      }
      acc.get(key).options.push({ num, vote_option_id, total_num })
      return acc
    },
    new Map()
  )

  // 将 Map 转回数组
  return [...transformedVote.values()]
}

function handleIMMessage(source) {
  // const deepSource = cloneDeep(source) // 导致性能耗时
  try {
    switch (source.action) {
      case 'vote': {
        const voteList = precrossWsDataFun(source)
        // console.error(Math.floor(performance.now()), '消息推送时间毫秒', `票${source.vote}`, voteList)
        handelVoteMessage(voteList)
        break
      }
    }
  } catch (error) {
    console.log(error)
  }
}
// 手动改变申请状态
const updateApplyVal = (id) => {
  const currentItem = activitiesData.value.find((ele) => ele.id === id)
  if (currentItem) {
    currentItem.apply = true
  }
}

async function handelReceive(data) {
  // 申请包赔
  const nowTimestamp = new Date().getTime()
  const startTimestamp = data.start_timestamp * 1000
  const closeTimestamp = data.close_timestamp * 1000
  if (nowTimestamp < startTimestamp) {
    ElMessage.error('活动未开始')
    return
  }
  if (nowTimestamp > closeTimestamp) {
    ElMessage.error('活动已结束')
    return
  }
  if (data.type === 3) {
    granantedEventId.value = data.id
    isGrauantedShow.value = true
  } else {
    // 投票领取奖励
    if (!userInfo.value.id) {
      store.state.user.showLoginMask = true
      return
    }
    await xcAccountApi()
    if (!isXCAccountInfo.value?.xing_account) {
      return handelBtn()
    }
    guessItemData.value = data
    applyVisible.value = true
  }
}

function handelBtn() {
  helpVisible.value = true
  if (userInfo.value.id) {
    xcAccountApi()
  }
}

function handelRecored(type) {
  if (type !== '16') {
    if (!userInfo.value.id) return (store.state.user.showLoginMask = true)
  }

  router.push({
    name: 'personalCenter',
    state: { comp: 2 }
  })
  localStorage.setItem('recored', type)
}

async function xcAccountApi() {
  const { data = [] } = await userXCAccount()
  if (data.length === 0) return
  isXCAccountInfo.value = data
}

function handelVoteMessage(voteList) {
  const activitiesList = activitiesData.value.reduce((arr, curr) => {
    voteList.forEach((sub) => {
      if (curr.id === sub.activity_id) {
        curr.vote = curr.vote.map((item) => {
          // 更新每一组中的数据
          if (item.id === sub.vote_id) {
            // 更新每个选项options
            const newOptions = new Map()
            sub.options.forEach((w) => {
              newOptions.set(w.vote_option_id, { ...w })
            })
            const newitemOptions = item.options.map((it) => {
              if (newOptions.has(it.id)) {
                const match = newOptions.get(it.id)
                return {
                  ...it,
                  option_nums: match.total_num,
                  newAddNum: match.num
                }
              }
              return it
            })

            const sortRules = item.rules.sort((a, b) => b.num - a.num)
            const rule = sortRules.find((o) => item.vote_nums >= o.num)
            const subOptions = sub.options.reduce((sum, ele) => sum + ele.num, 0)
            const itemOptions = newitemOptions.reduce((sum, ele) => sum + ele.option_nums, 0)
            const vote_nums = itemOptions - item.vote_nums > 0 ? itemOptions : item.vote_nums
            const bonus = Number(rule?.bonus) + (vote_nums - rule?.num - 1) * rule?.step_bonus
            return {
              ...item,
              options: [...newitemOptions],
              addMonery: Number(rule?.step_bonus * subOptions).toFixed(2),
              vote_nums,
              bonus: Number(bonus).toFixed(2)
            }
          }
          return item
        })
      }
    })
    return [...arr, { ...curr }]
  }, [])

  store.commit('setActivitiesData', activitiesList)
}

function handleVoteEnd(guessItem) {
  const voteList = guessItem.vote.filter((curr) => curr.id !== guessItem.vote_id)
  const activitiesList = activitiesData.value.map((item) =>
    item.id === guessItem.id ? { ...item, vote: voteList } : item
  )

  store.commit('setActivitiesData', activitiesList)
}

function handelInfoFilled(item) {
  if (item.type === 2) {
    explainData.value = {
      title: item.name,
      description: item.description
    }
    illustrateVisible.value = true
  }
  // 包赔说明玩法
  else {
    description.value = item.description
    isPackPayCaptionShow.value = true
  }
}

function handelFoldBtn(id) {
  if (selectIds.value.includes(id)) {
    selectIds.value = selectIds.value.filter((curr) => curr !== id)
    return
  }
  selectIds.value.push(id)
}

// 计算向下的padding
const boxPaddingBottom = ({ id, vote }) => {
  if (!selectIds.value.includes(id)) {
    return 0
  }

  if (vote.length) {
    return vote.length * 178
  }

  return 185
}

onMounted(async () => {
  mittBus.on('imOnMessage', handleIMMessage)
})

onBeforeUnmount(() => {
  mittBus.off('imOnMessage', handleIMMessage)
})
</script>

<style scoped lang="scss">
.activities {
  height: 100%;
  overflow-y: auto;

  .activities_title {
    padding: 8px 12px;
    display: flex;
    align-items: center;

    // justify-content: space-between;
    p {
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      color: var(--el-primary-text-color);
    }

    .btn {
      width: 78px;
      height: 25px;
      border-radius: 32px;
      background-color: #fff4f7;
      color: #d02d54;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &.button {
        margin-left: auto;

        .el-icon {
          margin-right: 2px;
        }
      }

      &.button2 {
        margin-left: 20px;

        >img {
          margin-right: 2px;
        }
      }
    }
  }

  .activities_content {
    padding: 0px 8px;

    .collapse_item {
      position: relative;

      .collapse_box {
        padding-bottom: 0px;
        transition: all 0.2s ease-in-out;

        .guess_box {
          height: 124px;
          box-sizing: border-box;
          padding: 6px;
          border-radius: 8px;
          border: 1px solid #f5d5dc;
          margin-bottom: 4px;

          .guess_item {
            height: 110px;
            border-radius: 8px;
            background-image: url(/static/images/live/activities/guess_item_bg.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;

            &.reset-gray {
              opacity: 0.5;
              filter: grayscale(100%);
              -webkit-filter: grayscale(100%);
              // pointer-events: none;
            }

            .guess_item_inner {
              position: relative;
              display: flex;
              // justify-content: center;
              padding-top: 10px;
              flex-direction: column;
              box-sizing: border-box;
              height: 110px;
              border-radius: 8px;
              padding-left: 8px;
              background-image: url(/static/images/live/activities/guess_item_inner_bg.png);
              background-repeat: no-repeat;
              background-size: 100% 100%;

              .guess_item_title {
                display: flex;
                justify-content: space-between;
                padding-right: 8px;
                padding-bottom: 4px;

                .guess_title {
                  display: flex;
                  align-items: center;

                  .name {
                    color: #fff;
                    font-size: 18px;
                    font-style: normal;
                    font-weight: 600;
                    margin-right: 8px;
                    max-width: 270px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    // white-space: nowrap;
                    white-space: pre-wrap;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                  }

                  .el-icon {
                    cursor: pointer;
                    color: #dea7b6;
                  }
                }

                .rec_button {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-width: 0;
                  cursor: pointer;
                  height: 32px;
                  width: 108px;
                  line-height: 32px;
                  padding: 0px 8px;
                  border-radius: 38px;
                  background-color: var(--el-primary-background-color);
                  color: #fff;
                  font-size: 14px;
                  font-style: normal;
                  font-weight: 500;
                  overflow: hidden;
                  box-sizing: border-box;
                  box-shadow:
                    0px 2px 4px 0px rgba(255, 255, 255, 0.25),
                    0px 4px 4px 0px rgba(208, 54, 84, 0.25);

                  /* 短：整体 shrink-to-fit，由外层 justify-content 居中；长：顶满可用宽，文案左对齐省略 */
                  .rec_button__inner {
                    display: inline-flex;
                    align-items: center;
                    justify-content: flex-start;
                    max-width: 100%;
                    min-width: 0;
                  }

                  .rec_button__text {
                    min-width: 0;
                    flex: 0 1 auto;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    text-align: left;
                  }

                  img {
                    flex-shrink: 0;
                    width: 18px;
                    height: 18px;
                    margin-right: 4px;
                    vertical-align: middle;
                  }
                }
              }

              .des_num {
                display: flex;
                color: rgba(255, 255, 255, 0.8);
                font-size: 12px;
                font-weight: 400;
                white-space: normal;

                span {
                  color: #fff;
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 600;
                  line-height: 18px;

                  &:first-child {
                    // width: 108px;
                    margin-right: 10px;
                    overflow: hidden;
                  }
                }
              }

              .fold_btn {
                position: absolute;
                bottom: 0px;
                right: 0px;
                width: 24px;
                height: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-top-left-radius: 8px;
                border-bottom-right-radius: 8px;
                background-color: #27030c;
                cursor: pointer;
                transform: rotate(-180deg);

                img {
                  width: 14px;
                  height: 8px;
                  transition: all 0.4s;
                }

                .icon-down {
                  transform: rotate(180deg);
                }

                &.pack-pay-button {
                  color: #fff;
                  width: 90px;
                  transform: none;
                  font-size: 14px;
                  background: rgba(0, 0, 0, 0.5);

                  img {
                    width: 12px;
                    height: 12px;
                    margin-right: 4px;
                    vertical-align: middle;
                  }
                }
              }
            }
          }
        }
      }

      .pk_box {
        position: absolute;
        opacity: 0;
        top: 128px;
        left: 0px;
        width: 100%;
        transition: all 0.3s ease-in-out;
      }
    }
  }

  .close-time {
    color: #ffe67c;
    width: fit-content;
    margin-top: 4px;
    font-size: 12px;
    padding: 2px 8px;
    background: rgba(34, 3, 11, 0.2);
    border-radius: 50px;
  }

  .resert-empty {
    height: calc(100% - 42px) !important;
  }
}

.record-style {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  cursor: pointer;

  span {
    height: 32px;
    line-height: 32px;
  }
}
</style>
<style lang="scss">
.vote-empty {
  .el-empty {
    --el-empty-padding: 0 !important;
  }
}
</style>
