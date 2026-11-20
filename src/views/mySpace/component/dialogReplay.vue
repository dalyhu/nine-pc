<template>
  <div class="details" v-if="visible">
    <div class="back">
      <span @click="close">
        <el-image class="icon-back" src="/static/images/spaceAndMine/rightBack.svg"></el-image>
        <span>返回</span>
      </span>
    </div>
    <div class="padding24">
      <div class="flexSB">
        <div class="titleTop">{{ item.category.name }}</div>
        <div class="timeTop">{{ getYMD(item.updated_at) }}</div>
      </div>
      <div class="content">
        {{ item.message.filter(x => x.type === 1).at(-1)?.message_text || '' }}
      </div>
      <div class="talkOut">
        <div class="TOTitle">全部回复{{ num || '' }}</div>
        <div class="flexCol" ref="scrollDom">
          <div class="row" :class="{flexEnd: x.type === 1}" v-for="(x, i) in replies" :key="x.id">
            <template v-if="i != 0">
              <el-avatar class="avatar" :size="28" :src="retAvatar(x.type === 1)"></el-avatar>
              <div class="txtBox">
                <div class="txt">
                  {{ x.message_text }}
                </div>
                <div class="txtTime">{{ x.updated_at }}</div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="input">
        <el-input class="el-input-new-style" placeholder="在这里请输入" size="large" v-model="reply"></el-input>
        <div class="btnDIY" :class="{btnActive: !!reply}" @click="sendMsg">发送</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RpeliesKey, MessageKey } from './type'
import { getYMD } from '@/utils/common'
import { myInfoApi, myMsgSubmitApi } from '@/api'

const props = defineProps<{visible: boolean, item: RpeliesKey & any}>()
const emit = defineEmits(['close'])
let visible = toRef(props, 'visible')
const item = toRef(props, 'item')
const reply = ref('')
const replies = reactive<MessageKey[]>([])
const user = reactive({id: '', user_nickname: '', avatar: ''})
const scrollDom = ref<HTMLDivElement>(null)
const num = ref(0)

const close = () => {
  emit('close', false)
}

const retAvatar = (isUser: boolean) => {
  return isUser ? (user.avatar || '/static/images/spaceAndMine/defaultAvatar.png') : '/static/images/spaceAndMine/defaultAvatarOffice.svg'
}

const httpMyInfoApi = (feedbacksId = '') => myInfoApi({feedbacksId})

const sendMsg = () => {
  myMsgSubmitApi({category_id: item.value.category_id, message: reply.value, feedback_id: item.value.id}).then(() => {
    httpMyInfoApi(item.value.id).then(res => {
      let msg = [...res.data.message]
      num.value = msg.filter(x => x.type === 2).length
      replies.splice(0, replies.length, ...msg.reverse())
      reply.value = ''
      scrollDom.value.scrollIntoView() // 祖先元素也要滚动
      scrollDom.value.scrollTo({top: scrollDom.value.scrollHeight, behavior: 'smooth'})
    })
  })
}

watch(item.value, () => {
  httpMyInfoApi(item.value.id).then(res => {
    let msg = [...res.data.message]
    num.value = msg.filter(x => x.type === 2).length
    replies.splice(0, replies.length, ...msg.reverse())
    setTimeout(() => {
      scrollDom.value.scrollTo({top: scrollDom.value.scrollHeight, behavior: 'smooth'})
    }, 0)
    user.id = res.data.user.id
    user.avatar = res.data.user.avatar
    user.user_nickname = res.data.user.user_nickname
  })
})
</script>

<style scoped lang="scss">
.details {
  .back {
    position: sticky;
    top: 16px;
    background-color: #fff;
    box-shadow: #fff 0 -16px;
    margin: 16px 0 0 16px;
    font-size: 18px;
    font-weight: 400;
    color: #333;
    cursor: pointer;
    .icon-back {
      width: 24px;
      vertical-align: middle;
      transform: rotate(180deg);
    }
  }
  .padding24 {
    padding: 0 24px;
    .flexSB {
      display: flex;
      justify-content: space-between;
      font-weight: 400;
      margin: 40px 0 16px 0;
      .titleTop {
        font-size: 18px;
        color: #333;
        line-height: 17px;
      }
      .timeTop {
        font-size: 14px;
        color: #666;
      }
    }
    .content {
      font-size: 16px;
      vertical-align: middle;
      color: #666;
      font-weight: 400;
      line-height: 1.35;
      margin-bottom: 46px;
    }
    .talkOut {
      margin-bottom: 80px;
      .TOTitle {
        height: 33px;
        line-height: 33px;
        margin-bottom: 16px;
        font-size: 18px;
        font-weight: 400;
      }
      .flexCol {
        display: flex;
        flex-flow: column;
        max-height: 550px;
        padding: 0 16px;
        gap: 8px;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          width: 0;
        }
        .row {
          display: flex;
          flex-flow: row;
          gap: 0 8px;
          .avatar {
            width: 28px;
            height: 28px;
          }
          .txtBox {
            max-width: calc(100% - 28px - 8px - 28px - 8px);
            padding: 16px;
            background-color: #f7f7f7;
            border-radius: 4px;
            .txt {
              font-size: 14px;
              color: #333;
              font-weight: 400;
              line-height: 1.5;
            }
            .txtTime {
              font-size: 14px;
              font-weight: 400;
              color: #999;
              margin-top: 9px;
            }
            .txtTimeRight {
              text-align: right;
            }
          }
        }
        .flexEnd {
          justify-content: end;
          flex-direction: row-reverse;
        }
      }
    }
    .input {
      position: fixed;
      width: 948px;
      bottom: 20px;
      display: grid;
      grid-template-columns: 1fr auto;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      background-color: #fff;
      box-shadow: #fff 0 14px;
      gap: 16px;
      :deep(.el-input) {
        height: 56px;
      }
      .el-input.el-input-new-style {
        --el-input-border-color: #ffffffff;
        --el-input-hover-border-color: #ffffffff;
        --el-input-focus-border-color: #ffffffff;
        --el-input-bg-color: #f9fafb;
      }
      .btnDIY {
        display: inline-block;
        height: 56px;
        line-height: 56px;
        padding: 0 16px;
        background-color: #999;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        color: #fff;
        cursor: pointer;
      }
      .btnActive {
        background-color: #d02d54;
        color: #fff;
      }
    }
  }
}
</style>