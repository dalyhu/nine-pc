<template>
  <div class="level-info-container">
    <div class="level-card">
      <template v-if="isLogin">
        <div class="level-card__active card-item">
          <div class="card-item__icon"></div>

          <div class="level-content">
            <div class="level-info">
              <span class="level"> Lv.{{ activeLevel?.level_id }}</span>
              <img
                class="question-icon"
                src="/static/images/spaceAndMine/question_icon.png"
                alt=""
                @click="showActiveLevel = true"
              />
            </div>

            <img class="level-icon" v-if="!leftImgAlt" :src="activeLevel?.level_icon" alt="" @error="setDefaultImg('left')"/>
            <img class="level-icon" v-else :src="leftImgAlt" alt=""/>

            <div class="progress-content">
              <div class="score">
                <span>积分：{{ activeLevel?.current_exp }} </span>
                <span>还差 {{ activeLevel?.up_exp }} 升级</span>
              </div>

              <div class="progress-bar">
                <div class="progress" :style="{ width: activePercentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="level-card__live card-item">
          <div class="card-item__icon"></div>

          <div class="level-content">
            <div class="level-info">
              <span class="level">Lv.{{ liveLevel?.level_id }}</span>
              <img
                class="question-icon"
                src="/static/images/spaceAndMine/question_icon.png"
                alt=""
                @click="showLiveLevel = true"
              />
            </div>

            <div class="progress-content">
              <div class="score">
                <span>经验值：{{ liveLevel?.current_exp }}</span>
                <span>还差 {{ liveLevel?.up_exp }} 升级</span>
              </div>

              <img class="level-icon" v-if="!rightImgAlt" :src="levelIconImage" alt="" @error="setDefaultImg('right')"/>
              <img class="level-icon" v-else :src="rightImgAlt" alt=""/>

              <div class="progress-bar live">
                <div class="progress" :style="{ width: livePercentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <img class="no_login-banner" src="/static/images/spaceAndMine/no_login.png" alt="" @click="handleLogin" />
      </template>
    </div>

    <div class="score-container">
      <div class="score-content">
        <div class="score-item">
          <img class="score-icon" src="/static/images/spaceAndMine/dollar.png" alt="" />
          <div class="desc">
            <span class="title">钞能力</span>
            <span class="number">{{ formatThousandsIntl(totalCredit?.extcredits6) || '-' }}</span>
          </div>
        </div>

        <div class="score-item">
          <img class="score-icon" src="/static/images/spaceAndMine/heart.png" alt="" />
          <div class="desc">
            <span class="title">贡献</span>
            <span class="number">{{ formatThousandsIntl(totalCredit?.extcredits3) || '-' }}</span>
          </div>
        </div>

        <div class="score-item">
          <img class="score-icon" src="/static/images/spaceAndMine/gold.png" alt="" />
          <div class="desc">
            <span class="title">金币</span>
            <span class="number">{{ formatThousandsIntl(totalCredit?.extcredits1) || '-' }}</span>
          </div>
        </div>

        <div class="score-item">
          <img class="score-icon" src="/static/images/spaceAndMine/brick.png" alt="" />
          <div class="desc">
            <span class="title">钻石</span>
            <span class="number">{{ formatThousandsIntl(userInfo?.balances) || '-' }}</span>
          </div>
        </div>

        <div class="score-item">
          <img class="score-icon" src="/static/images/spaceAndMine/star.png" alt="" />
          <div class="desc">
            <span class="title">声望</span>
            <span class="number">{{ formatThousandsIntl(totalCredit?.extcredits4) || '-' }}</span>
          </div>
        </div>

        <div class="score-item">
          <img class="score-icon" src="/static/images/spaceAndMine/pen.png" alt="" />
          <div class="desc">
            <span class="title">原创</span>
            <span class="number">{{ formatThousandsIntl(totalCredit?.extcredits2) || '-' }}</span>
          </div>
        </div>
      </div>

      <div class="score-record" v-if="isLogin && !isOther">
        <span>最近一次：</span>
        <div v-if="dzInfo && creditLog && genCreditInfo.length" class="extcredits-text">
          {{ formatThousandsIntl(creditLog?.operation_text) }}
          <span v-for="item in genCreditInfo" :key="item.extcreditsName" class="add"
            >+ {{ item.extcredits }} {{ item.extcreditsName }}</span
          >
        </div>
        <span style="flex: 1"></span>
        <div class="btn" @click="handleScore">积分记录</div>
      </div>
    </div>

    <!-- 活跃等级 -->
    <div class="live-dialog active stop-colse" v-if="showActiveLevel">
      <img class="live-level_bg stop-colse" src="/static/images/spaceAndMine/active-level_bg.png" />
      <img
        class="close stop-colse"
        src="/static/images/spaceAndMine/close_level.svg"
        @click="showActiveLevel = false"
      />

      <p class="live-dialog__title stop-colse">活跃等级</p>

      <div class="top-content stop-colse">
        <div class="live-dialog__header stop-colse">
          <span class="dot stop-colse"></span>
          如何升级？
        </div>
        <div class="live-dialog__desc stop-colse">
          <p class="stop-colse">
            在小九直播与社区快乐游玩，参与每个新鲜有趣的事物，即可获得积分。累积充足的积分，提升活跃等级
          </p>
        </div>
      </div>

      <div class="top-content stop-colse">
        <div class="live-dialog__header stop-colse">
          <span class="dot stop-colse"></span>
          积分类型
        </div>
        <div class="active-detail stop-colse">
          <img class="score-icon stop-colse" src="/static/images/spaceAndMine/brick.png" alt="" />
          <div class="desc stop-colse">
            <span class="title stop-colse">钻石</span>
            <span class="text stop-colse">看直播与主播互动游戏</span>
          </div>
        </div>

        <div class="active-detail gold stop-colse">
          <img class="score-icon stop-colse" src="/static/images/spaceAndMine/gold.png" alt="" />
          <div class="desc stop-colse">
            <span class="title stop-colse">金币</span>
            <span class="text" stop-colse>畅游网络讨论与赛事</span>
          </div>
        </div>

        <div class="active-detail heart stop-colse">
          <img class="score-icon stop-colse" src="/static/images/spaceAndMine/heart.png" alt="" />
          <div class="desc stop-colse">
            <span class="title stop-colse">贡献</span>
            <span class="text stop-colse">参与社区里的大小事</span>
          </div>
        </div>

        <div class="active-detail pen stop-colse">
          <img class="score-icon stop-colse" src="/static/images/spaceAndMine/pen.png" alt="" />
          <div class="desc stop-colse">
            <span class="title stop-colse">原创</span>
            <span class="text stop-colse">写下属于您的原创帖子</span>
          </div>
        </div>

        <div class="active-detail star stop-colse">
          <img class="score-icon stop-colse" src="/static/images/spaceAndMine/star.png" alt="" />
          <div class="desc stop-colse">
            <span class="title stop-colse">声望</span>
            <span class="text stop-colse">分享趣事给您的好友</span>
          </div>
        </div>

        <div class="active-detail dollar stop-colse">
          <img class="score-icon stop-colse" src="/static/images/spaceAndMine/dollar.png" alt="" />
          <div class="desc stop-colse">
            <span class="title stop-colse">钞能力</span>
            <span class="text stop-colse">钞票就是最好的超能力</span>
          </div>
        </div>
      </div>

      <!-- 参加每日任务 -->
      <div class="confirm-btn stop-colse" @click="handleClickLevel">查看等级介绍</div>
    </div>
    <!-- 直播等级弹窗 -->

    <div class="live-dialog" v-if="showLiveLevel">
      <img class="live-level_bg" src="/static/images/spaceAndMine/live-level_bg.png" />
      <img
        class="close"
        src="/static/images/spaceAndMine/close_level.svg"
        @click="showLiveLevel = false"
      />

      <p class="live-dialog__title">直播等级</p>

      <div class="top-content">
        <div class="live-dialog__header">
          <span class="dot"></span>
          如何升级？
        </div>
        <div class="live-dialog__desc">
          <p>每日签到：可获得10经验</p>
          <p>每日任务：依任务可获得大量经验</p>
          <p>消费钻石：在直播间消费10钻石获得1经验</p>
        </div>
      </div>

      <div class="top-content">
        <div class="live-dialog__header">
          <span class="dot"></span>
          升级经验
        </div>
        <div class="live-dialog__desc list">
          <p v-for="level in levelList" :key="level.id" class="desc">
            Lv{{ level.levelid }}：{{ formatThousandsIntl(level.level_up) }} 经验值
          </p>
        </div>
      </div>

      <!-- 参加每日任务 -->
      <div class="confirm-btn" @click="handleClickTask">参加每日任务</div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getLevelListService } from '@/api/user'
import { formatThousandsIntl } from '@/utils/common'

const props = defineProps({
  dzInfo: {
    type: Object,
    required: true
  },
  isOther: {
    type: Boolean,
    default: false
  }
})

const store = useStore()

const userInfo = computed(() => store.state.user.infoData)

const isLogin = computed(() => !!userInfo.value.id)

const activeLevel = computed(() => {
  return (props.dzInfo?.level_card && props.dzInfo?.level_card[0]) || {}
})

const handleLogin = () => {
  store.commit('user/SET_LOGIN_MASK', true)
}

const liveLevel = computed(() => {
  if (props.isOther) {
    return (props.dzInfo?.level_card && props.dzInfo?.level_card[1]) || {}
  }
  return {
    level_id: userInfo.value?.exp,
    current_exp: userInfo.value?.current_exp,
    up_exp: userInfo.value?.difference
  }
})

const leftImgAlt = ref(undefined)
const rightImgAlt = ref(undefined)
const setDefaultImg = (leftRight) => {
  if (leftRight === 'left') leftImgAlt.value = '/static/images/home/medal_bg.png'
  if (leftRight === 'right') rightImgAlt.value = '/static/images/home/medal_bg.png'
  
}

const activePercentage = computed(() => {
  if (!activeLevel.value?.up_exp) return 0
  return Math.round(
    (activeLevel.value?.current_exp /
      (activeLevel.value?.current_exp + activeLevel.value?.up_exp)) *
      100
  )
})

const livePercentage = computed(() => {
  if (!liveLevel.value?.up_exp) return 0
  return Math.round(
    (liveLevel.value?.current_exp / (liveLevel.value?.current_exp + liveLevel.value?.up_exp)) * 100
  )
})

const levelIconImage = computed(() => {
  if (props.isOther) {
    return liveLevel.value?.level_icon
  }
  return userInfo.value?.exp_icon_url
})

const creditLog = computed(() => props.dzInfo?.credit_log || {})
const totalCredit = computed(() => props.dzInfo?.total_credit || {})

const genCreditInfo = computed(() => {
  const extcredits = []
  for (const key in creditLog.value) {
    if (key.includes('extcredits')) {
      if (!isNaN(creditLog.value[key]) && creditLog.value[key] > 0) {
        const obj = {}
        obj.extcredits = creditLog.value[key]
        obj.extcreditsName = creditLog.value[`${key}_text`]
        extcredits.push(obj)
      }
    }
  }

  return extcredits
})

const router = useRouter()

const showLiveLevel = ref(false)

const showActiveLevel = ref(false)

const handleClickLevel = () => {
  router.push({
    path: '/mySpace/score',
    query: {
      tab: 'level'
    }
  })
}

const handleScore = () => {
  router.push('/mySpace/score')
}

const levelList = ref([])

const getLevelList = async () => {
  const res = await getLevelListService()
  levelList.value = res.data
}

const handleClickTask = () => {
  router.push('/dailyMission')
}

const eventFn = (event) => {
  let {className} = event.target
  let targetNode = !className.split(' ').includes('stop-colse')
  if (showLiveLevel.value && targetNode) showLiveLevel.value = false
}

onMounted(() => {
  getLevelList()
  window.addEventListener('click', eventFn, {capture: true})
})

onDeactivated(() => {
  window.removeEventListener('click', eventFn, {capture: true})
})
</script>
<style scoped lang="scss">
.level-info-container {
  margin: 24px 0;

  .level-card {
    width: 100%;
    display: flex;
    gap: 16px;

    .no_login-banner {
      display: block;
      width: 100%;
      cursor: pointer;
    }

    .card-item {
      position: relative;
      flex: 1;
      height: 182px;
      padding: 0 24px 20px;
      box-sizing: border-box;
      border-radius: 8px;
      overflow: hidden;

      &__icon {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 72px;
        height: 28px;
      }

      .level-content {
        color: #fff;
        margin-top: 63px;

        .level-info {
          display: flex;
          align-items: end;
          font-size: 38px;
          line-height: 36px;
          font-weight: bold;

          .question-icon {
            position: relative;
            top: -5px;
            width: 16px;
            height: 16px;
            margin-left: 6px;
            cursor: pointer;
          }
        }

        .level-icon {
          position: absolute;
          top: 10px;
          right: 66px;
          width: 120px;
          height: 120px;
          object-fit: contain;
        }

        .progress-content {
          margin-top: 33px;
          line-height: 14px;
          font-size: 16px;

          .score {
            display: flex;
            justify-content: space-between;
          }

          .progress-bar {
            width: 100%;
            height: 8px;
            border-radius: 8px;
            margin-top: 8px;
            background: #95203c;
            overflow: hidden;

            &.live {
              background: #000;
            }

            .progress {
              width: 50%;
              height: 100%;
              border-radius: 8px;
              background: #fff;
            }
          }
        }
      }
    }

    &__active {
      background: url('/static/images/spaceAndMine/bgRed.png') no-repeat center / 100% 100%;

      .card-item__icon {
        background: url('/static/images/spaceAndMine/active_level_icon.png') no-repeat center / 100%
          100%;
      }
    }
    &__live {
      background: url('/static/images/spaceAndMine/bgBlack.png') no-repeat center / 100% 100%;

      .card-item__icon {
        background: url('/static/images/spaceAndMine/live_level_icon.png') no-repeat center / 100%
          100%;
      }
    }
  }

  .score-container {
    padding: 16px;
    margin-top: 24px;
    background: #f9fafb;
    border-radius: 8px;
    overflow: hidden;

    .score-content {
      width: 100%;
      display: grid;
      gap: 16px 24px;
      grid-template-columns: repeat(3, 1fr);

      .score-item {
        display: flex;
        align-items: center;
        height: 64px;
        padding: 8px 16px;
        border-radius: 8px;
        border: 1px solid #e6e7e8;
        background: #fff;

        .score-icon {
          width: 48px;
          height: 48px;
        }

        .desc {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 8px;

          .title {
            font-size: 16px;
            color: #666;
            line-height: 14px;
            margin-bottom: 4px;
          }

          .number {
            font-size: 18px;
            color: #333;
            line-height: 25px;
          }
        }
      }
    }

    .score-record {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 8px 16px;
      border-radius: 8px;
      margin-top: 24px;
      color: #666;
      border: 1px solid #e6e7e8;
      background: #fff;

      .extcredits-text {
        display: flex;
        font-size: 18px;
        color: #333;
        font-weight: bold;
        margin-left: 8px;
        align-items: center;

        .add {
          color: #d02d54;
          margin: 0 8px;
        }
      }

      .btn {
        width: 96px;
        height: 38px;
        line-height: 36px;
        text-align: center;
        cursor: pointer;
        border: 1px solid #333;
        color: #333;
        border-radius: 8px;
      }
    }
  }

  .live-dialog {
    position: absolute;
    top: 6%;
    left: 0;
    right: 0;
    padding: 16px;
    margin: auto;
    width: 476px;
    border-radius: 8px;
    background: #202020;
    box-shadow: 0 4px 16px 0 #0000001a;
    overflow: hidden;
    z-index: 99;

    &.active {
      background: #d02d54;

      .active-detail {
        display: flex;
        align-items: center;
        padding: 8px;
        gap: 8px;
        border-radius: 4px;
        background-color: #faf2ff;
        overflow: hidden;
        margin-top: 8px;

        &.gold {
          background-color: #fff4e8;
        }

        &.heart {
          background-color: #fff1f0;
        }

        &.pen {
          background-color: #eefff3;
        }

        &.star {
          background-color: #f6f4ff;
        }

        &.dollar {
          background-color: #f4ffe3;
        }

        .score-icon {
          width: 28px;
          height: 28px;
        }

        .desc {
          display: flex;
          flex-direction: column;
          justify-content: center;

          .title {
            font-size: 16px;
            color: #333;
            line-height: 22px;
          }

          .text {
            font-size: 14px;
            color: #666;
            line-height: 20px;
          }
        }
      }
    }

    .close {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .live-level_bg {
      position: absolute;
      top: 0;
      right: 42px;
      width: 129px;
      height: 129px;
    }

    &__title {
      color: #fff;
      padding-left: 28px;
      line-height: 25px;
      margin-top: 24px;
      margin-bottom: 12px;
    }

    .top-content {
      position: relative;
      border-radius: 8px;
      padding: 8px 16px 16px;
      background: #fff;
      margin-bottom: 8px;
      z-index: 10;
    }

    &__header {
      display: flex;
      align-items: center;
      height: 40px;
      font-size: 18px;
      color: #333;
      font-weight: bold;
      border-bottom: 1px dashed #fee9ee;

      .dot {
        width: 3px;
        height: 14px;
        border-radius: 1px;
        background: #d02d54;
        margin-right: 10px;
      }
    }

    &__desc {
      display: flex;
      flex-direction: column;
      gap: 16px;
      font-size: 16px;
      line-height: 22px;
      padding: 8px 0;
      font-weight: bold;
      color: #333;

      &.list {
        gap: 8px;
      }
    }

    .confirm-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 128px;
      height: 38px;
      font-size: 16px;
      border-radius: 8px;
      margin: 16px auto;
      cursor: pointer;
      color: #fff;
      border: 1px solid #fff;
    }
  }
}
</style>
