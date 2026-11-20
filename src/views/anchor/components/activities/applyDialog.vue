<template>
  <!-- 领取奖励 -->
  <el-dialog
    class="apply_custom"
    v-model="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :append-to-body="true"
    :width="435"
  >
    <div class="apply_content">
      <div class="apply_header">
        <div class="apply_header_bg">
          <img src="/static/images/live/activities/help_bg.png" alt="" />
          <div class="_text">
            <span>提交领取</span>
            <span>彩金奖励申请</span>
          </div>
        </div>
        <p @click.stop="handelClose">
          <el-icon size="16"><Close /></el-icon>关闭
        </p>
        
        <div class="award_amount">
          <img src="/static/images/live/activities/icon_gold.png" alt="" />
          <div class="amount_box">
            <span
              >本周累计奖励：<strong>{{ Number(guessItem.bonus).toFixed(2) }}</strong
              ><em> / {{ Number(guessItem.bonus_max).toFixed(2) }}</em></span
            >
            <span
              >已提交领取： <strong>{{ Number(receivedMonery).toFixed(2) }}</strong></span
            >
          </div>
        </div>
      </div>

      <div class="apply_main">
         <!-- 有奖励可以领取 -->
        <div v-if="rewaresFlag">
          <p v-if="isGetMonely">
            余额为
            <strong>{{ Number(Number(guessItem.bonus) - Number(guessItem.bonus_received)).toFixed(2) }}</strong>
            请参加投票活动获取<br />若已发出申请请等待小助手审核发放
          </p>
          <p v-else>
            还未领取的体育站彩金奖励 <strong>{{ Number(Number(guessItem.bonus) - Number(guessItem.bonus_received)).toFixed(2) }}</strong> <br />是否提交申请领取？
          </p>
        </div>
        
        <!-- 无奖励领取 -->
        <template v-else>
          <!-- 是 -->
          <div v-if="noRewardsFlag" class="mid">
            <div>彩金领取已达周奖励上限</div>
            每个礼拜日重置奖励
          </div>
          <!-- 否 -->
          <div v-else class="mid">
            <div>暂无更多彩金可领取</div>
            请多参加活动赚取彩金
          </div>
        </template>
      </div>

      <!-- 按钮 -->
      <div class="apply_footer">
        <el-button class="el_button_info" round v-if="!rewaresFlag">暂无可领取彩金</el-button>
        <el-button v-else-if="rewaresFlag && !isGetMonely" @click="handleSubmit" round>提 交</el-button>
        <el-button class="el_button_info" round v-else>已提交</el-button>

        <p v-if="rewaresFlag && !isGetMonely">
          让我想一想！<span @click="visible = !visible">先不要</span>
        </p>
      </div>
    </div>
  </el-dialog>
</template>

<script setup name="applyDialog" lang="ts">
import { Close } from '@element-plus/icons-vue'
import { receiveAward } from '@/api/activities.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  guessItem: {
    type: Object,
    default: () => ({})
  }
})
// 已领取奖励
const isGetMonely = ref(false)
const receivedMonery = ref(0)

watch(()=> props.guessItem.bonus_received, (val) => {
  receivedMonery.value = val
})

 /**
 * 1.有奖励可以领取  1-1 提交 和 1-2 已提交
 * 2 没有奖励领取 -- 2-1 是  和 2-2 否
 */

  // 1.有奖励可以领取  提交
const rewaresFlag = computed(() => {
  let { bonus_received, bonus } = props.guessItem
  return Number(bonus) > Number(bonus_received)
})
  // 2 没有奖励领取 -- 是
const noRewardsFlag = computed(() => {
  let { bonus_received, bonus_max } = props.guessItem
  return !rewaresFlag.value && Number(bonus_received) === Number(bonus_max)
})

const visible = computed({
  get: function () {
    return props.modelValue
  },
  set: function (newValue) {
    emits('update:modelValue', newValue)
  }
})

const emits = defineEmits(['update:modelValue', 'receiveSuccess'])

function handleSubmit() {
  receiveAward({ activity_id: props.guessItem.id }).then((res) => {
    const { data } = res
    console.log('data', data)
    if (data) {
      isGetMonely.value = true
      receivedMonery.value = props.guessItem.bonus
      // handelClose()不要
      emits('receiveSuccess')
    }
  })
}

function handelClose() {
  visible.value = false
}
</script>

<style lang="scss">
.apply_custom {
  padding: 0;
  border-radius: 12px;
  background-color: transparent;
  font-family: 'PingFang SC';
  .el-dialog__header {
    display: none;
  }
  .apply_content {
    .apply_header {
      position: relative;
      .apply_header_bg {
        position: relative;
        img {
          width: 100%;
          height: auto;
        }
        ._text {
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 50px;
          left: 60px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 28px;
          font-style: normal;
          font-weight: 600;
        }
      }
      p {
        position: absolute;
        top: 4px;
        right: 16px;
        color: #111;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        display: flex;
        align-items: center;
        cursor: pointer;
        .el-icon {
          margin-top: 2px;
          margin-right: 4px;
        }
      }
      .award_amount {
        position: absolute;
        display: flex;
        align-items: center;
        left: 20px;
        bottom: -5px;
        width: 396px;
        img {
          width: 18px;
          height: 18px;
          margin-right: 4px;
        }
        .amount_box {
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items: center;
          color: #9d898d;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          span {
            em {
              color: #320610;
              font-size: 14px;
              font-style: normal;
              font-weight: 700;
            }
            strong {
              color: #d02d54;
              font-size: 14px;
              font-style: normal;
              font-weight: 600;
            }
          }
        }
      }
    }
    .apply_main {
      padding: 20px 0px;
      background-color: #fff;
      color: #9d898d;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      text-align: center;
      line-height: 22px;
      strong {
        color: #d02d54;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
      }
    }
    .apply_footer {
      padding: 0px 22px 20px 22px;
      background-color: #fff;
      border-radius: 12px;
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
      .el-button {
        background-color: #d31357;
        color: #fff;
        width: 100% !important;
        border: 0;
        height: 44px;
        font-weight: 600;
      }
      .el_button_info {
        background-color: #c3c3c3;
      }
      p {
        padding-top: 12px;
        text-align: center;
        color: #a9969d;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: 22px;
        span {
          cursor: pointer;
          color: #111;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
