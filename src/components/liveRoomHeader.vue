<template>
  <div class="live_room_header_box">
    <div class="live_room_header_left">
      <el-avatar :size="48" :src="anchorInfo.avatar" @error="() => true">
        <img src="/static/images/avatar.png" alt="" />
      </el-avatar>
      <div class="live_room_header_info">
        <h1>
          <span class="title_text">{{ anchorInfo.title_sub }} {{ anchorInfo.title_main }}</span>
          <img
            v-if="userInfo.id == route.query.uid"
            @click="handleEditTitle"
            src="/static/images/edit.png"
          />
        </h1>
        <div class="anchor_info">
          <span class="level_img" style="width: 58px">
            <img style="width: 58px" :src="anchorInfo.votestotal_icon" />
          </span>
          <span class="live_name">{{ anchorInfo.user_nickname }}</span>
          <span class="live_room_num">房间号：{{ anchorInfo.uid }}</span>
          <span class="live_room_heat">
            <svg
              class="heat_img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.85545 0C5.36122 1.13777 4.84609 2.14225 5.08925 3.44339C5.23366 4.21605 5.98271 5.46964 7.05982 5.46964C8.01983 5.46964 8.81783 4.74046 8.98 3.78021C9.96834 4.62954 10.5992 5.92132 10.5992 7.368C10.5992 9.92618 8.6265 12 6.19303 12C3.52736 12 1.23998 10.6876 1 6.84788C1 3.44339 3.35064 1.29398 5.85545 0Z"
                fill="#D02D54"
              />
              <path
                d="M3.48954 6.52602C3.46131 6.32394 3.75331 6.22604 3.88085 6.3853C4.36807 6.99371 5.22707 7.80449 6.40557 7.91767C6.40554 7.91767 6.4056 7.91767 6.40557 7.91767C7.18777 7.91767 7.82196 8.57281 7.82196 9.38097C7.82196 10.1891 7.18786 10.8443 6.40566 10.8443C4.56938 10.8442 3.72967 8.24504 3.48954 6.52602Z"
                fill="white"
              />
            </svg>
            <i>{{ heat }}</i>
          </span>
        </div>
      </div>
    </div>
    <div class="live_room_header_right">
      <div class="live_room_person">
        <span class="person_num_box">
          <i class="person_icon"></i>
          <span class="person_num">{{ anchorInfo.attention }}</span>
        </span>
        <span v-if="anchorInfo.is_attention == 0" @click="handlePay" class="add_pay_box">
          <i class="add_icon"></i>
          <span class="add_text">关注</span>
        </span>
        <span v-else class="add_pay_box" @click="handlePay">
          <span class="add_text">已关注</span>
        </span>
      </div>
      <div class="live_room_fun_btn">
        <!-- 弹幕 -->
        <div class="live_room_btn" @click="danmusClick">
          <i class="btn_icon_box barr_icon"></i>
          <div v-if="!danmakuSystem.show" class="occlusion">
            <img src="/static/images/red_stop.png" width="100%" alt="123唯一标识" />
          </div>
          <span class="btn_text"> {{ danmakuSystem.show ? '关闭' : '开启' }}弹幕</span>
        </div>
        <!-- 留言板 -->
        <div class="live_room_btn" @click="handleMess">
          <i class="btn_icon_box mess_icon"></i>
          <span class="btn_text">悄悄话留言板</span>
        </div>
        <!-- 分享 -->
        <el-popover
          popper-class="popper_class_share"
          placement="bottom"
          width="380"
          :trigger="tabletMode ? 'click' : 'hover'"
        >
          <template #reference>
            <div class="live_room_btn">
              <i class="btn_icon_box share_icon"></i>
              <span class="btn_text">分享</span>
            </div>
          </template>
          <div class="live_room_share_box">
            <div class="big_title">呼唤小伙伴们前来围观主播吧</div>
            <el-input v-model="shareUrl" :readonly="true">
              <template #append>
                <el-button type="primary" @click="handleCopy">复制链接</el-button>
              </template>
            </el-input>
          </div>
        </el-popover>
        <!-- 手机看 -->
        <el-popover popper-class="el_popover_live_room" :trigger="tabletMode ? 'click' : 'hover'" width="268">
          <template #reference>
            <div class="live_room_btn look_btn">
              <i class="btn_icon_box look_icon"></i>
              <span class="btn_text">手机看</span>
            </div>
          </template>
          <div class="el_popover_downLoad_box">
            <span class="downLoad_title">手机扫码，随心所欲畅享直播</span>
            <div class="downLoad_qrCode">
              <qrCode wrapId="qrcode-live" :size="112"></qrCode>
            </div>
            <router-link to="/download">
              <el-button type="primary">立即下载</el-button>
            </router-link>
          </div>
        </el-popover>
      </div>
    </div>
  </div>

  <el-dialog
    v-model="titleDialogVisible"
    title="编辑标题"
    width="480px"
    append-to-body
    destroy-on-close
    @closed="resetTitleForm"
  >
    <el-form ref="titleFormRef" :model="titleForm" :rules="titleRules" label-width="80px">
      <el-form-item label="主标题" prop="title_main">
        <el-input
          v-model="titleForm.title_main"
          placeholder="请输入主标题"
          maxlength="30"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="副标题" prop="title_sub">
        <el-input
          v-model="titleForm.title_sub"
          placeholder="请输入副标题"
          maxlength="30"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="titleDialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="titleSubmitting" @click="submitEditTitle">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup name="liveRoomHeader" lang="ts">
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { attention, setTitle } from '@/api/user.js'
import qrCode from '@/components/qrCode.vue'
import mittBus from '@/utils/mittBus'
import { useClipboard } from '@vueuse/core'
import type { FormInstance, FormRules } from 'element-plus'

const tabletMode = document.documentElement.hasAttribute('data-tablet-pc')
const emits = defineEmits(['handleMess', 'editSuccess'])
const props = defineProps({
  // 主播信息
  anchorInfo: {
    type: Object,
    default: () => ({})
  }
})
const route = useRoute()
const store = useStore()

const heat = computed(() => {
  if (props.anchorInfo.heat) {
    return (parseFloat(props.anchorInfo.heat).toFixed(2) + '').replace(
      /\d{1,4}(?=(\d{4})+(\.\d*)?$)/g,
      '$&,'
    )
  }
  return 0
})

const userInfo = computed(() => {
  return store.state.user.infoData
})

const titleDialogVisible = ref(false)
const titleSubmitting = ref(false)
const titleFormRef = ref<FormInstance>()

const titleForm = reactive({
  title_main: '',
  title_sub: ''
})

const titleRules: FormRules = {
  title_main: [{ required: true, message: '请输入主标题', trigger: 'blur' }],
  title_sub: [{ required: true, message: '请输入副标题', trigger: 'blur' }]
}

const resetTitleForm = () => {
  titleForm.title_main = props.anchorInfo.title_main
  titleForm.title_sub = props.anchorInfo.title_sub
  titleFormRef.value?.clearValidate()
}

// 编辑直播间名称
const handleEditTitle = () => {
  titleForm.title_main = props.anchorInfo.title_main
  titleForm.title_sub = props.anchorInfo.title_sub
  titleDialogVisible.value = true
}

const submitEditTitle = async () => {
  const formEl = titleFormRef.value
  if (!formEl) return
  try {
    await formEl.validate()
  } catch {
    return
  }
  titleSubmitting.value = true
  try {
    await setTitle({
      title_main: titleForm.title_main,
      title_sub: titleForm.title_sub
    })
    ElMessage.success('修改成功')
    titleDialogVisible.value = false
    emits('editSuccess', {
      title_main: titleForm.title_main,
      title_sub: titleForm.title_sub
    })
  } finally {
    titleSubmitting.value = false
  }
}

// 分享
const shareUrl = computed(() => {
  return window.location.origin + '/room/' + route.query.uid
})

const { copy } = useClipboard()

const handleCopy = () => {
  const symbols = shareUrl.value.includes('?') ? '&' : '?'
  const url =
    shareUrl.value +
    symbols +
    `invite_code=${userInfo.value?.invite_code || ''}-11-${route.query.uid}`
  copy(url)
  store.dispatch('setInviterLog', { st: 11, s: route.query.uid })
}

//悄悄留言板
const handleMess = () => {
  emits('handleMess')
}

// 弹幕配置
const danmakuSystem = computed(() => {
  return store.state.danmakuSystem
})
// 弹幕
const danmusClick = () => {
  localStorage.setItem('danmakuShow', localStorage.getItem('danmakuShow') === '1' ? '1' : '0')
  store.state.danmakuSystem.show = !store.state.danmakuSystem.show
}

// 关注|取消关注
const handlePay = () => {
  if (!userInfo.value.id) {
    store.commit('user/SET_LOGIN_MASK', true)
    return
  }

  const parmas = {
    id: props.anchorInfo.uid
  }

  attention(parmas).then(() => {
    // 0未关注
    if (props.anchorInfo.is_attention == 1) {
      // eslint-disable-next-line vue/no-mutating-props
      props.anchorInfo.is_attention = 0
      // eslint-disable-next-line vue/no-mutating-props
      props.anchorInfo.attention -= 1
    } else {
      // eslint-disable-next-line vue/no-mutating-props
      props.anchorInfo.is_attention = 1
      // eslint-disable-next-line vue/no-mutating-props
      props.anchorInfo.attention += 1
    }
    mittBus.emit('anchorFollowStatusChange', {
      status: props.anchorInfo.is_attention,
      id: props.anchorInfo.uid
    })
    ElMessage.success('操作成功')
  })
}
defineExpose({
  handlePay,
  handleCopy
})
</script>

<style scoped lang="scss">
.live_room_header_box {
  position: relative;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  height: 88px;
  box-sizing: border-box;
  padding: 16px 12px;
  background-color: var(--el-bg-color-overlay);
  .live_room_header_left {
    display: flex;
    align-items: center;
    overflow: hidden;
    .el-avatar {
      flex-shrink: 0;
    }
    .live_room_header_info {
      margin-left: 12px;
      overflow: hidden;
      h1 {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        img {
          width: 20px;
          height: 20px;
          margin-left: 10px;
          cursor: pointer;
        }
      }
      .title_text {
        font-size: 18px;
        color: var(--el-text-color-primary);
        font-weight: 700;
        font-style: normal;
        margin-bottom: 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .anchor_info {
        display: flex;
        align-items: center;
        .level_img {
          margin-right: 8px;
        }
        .live_name {
          color: var(--el-text-color-placeholder);
          font-size: 14px;
          font-weight: 400;
          font-style: normal;
          margin-right: 20px;
          white-space: nowrap;
          overflow: hidden;
        }
        .live_room_num {
          color: var(--el-text-color-placeholder);
          font-size: 14px;
          font-weight: 400;
          font-style: normal;
          margin-right: 20px;
          white-space: nowrap;
          overflow: hidden;
        }
        .live_room_heat {
          display: flex;
          align-items: center;
          .heat_img {
            width: 12px;
            height: 12px;
            margin-right: 2px;
          }
          i {
            color: var(--el-text-color-placeholder);
            font-size: 14px;
            font-weight: 400;
            font-style: normal;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
  }
  .live_room_header_right {
    .live_room_person {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
      .person_num_box {
        display: flex;
        align-items: center;
        margin-right: 12px;
        .person_icon {
          display: block;
          width: 12px;
          height: 12px;
          background-image: url(/static/images/live/person_num.svg);
          background-repeat: no-repeat;
          margin-right: 4px;
        }
        .person_num {
          color: var(--el-text-color-placeholder);
          font-size: 14px;
          font-weight: 400;
          font-style: normal;
        }
      }
      .add_pay_box {
        display: flex;
        align-items: center;
        padding: 4px 12px;
        border-radius: 999px;
        background-color: var(--el-fill-color);
        cursor: pointer;
        .add_icon {
          display: block;
          width: 12px;
          height: 12px;
          background-image: url(/static/images/live/add_pay.svg);
          background-repeat: no-repeat;
          margin-right: 4px;
        }
        .add_text {
          color: var(--el-text-color-primary);
          font-size: 14px;
          font-weight: 600;
          font-style: normal;
        }
      }
    }
    .live_room_fun_btn {
      display: flex;
      align-items: center;
      .live_room_btn {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-right: 25px;
        position: relative;
        // .occlusion {
        //   display: none;
        // }
        .btn_icon_box {
          display: block;
          width: 18px;
          height: 18px;
          background-image: url(/static/images/live/barr_icon.svg);
          background-repeat: no-repeat;
          margin-right: 4px;
        }
        .btn_text {
          color: var(--el-text-color-placeholder);
          font-size: 14px;
          font-weight: 400;
          font-style: normal;
          white-space: nowrap;
          overflow: hidden;
        }
        .barr_icon {
          background-image: url(/static/images/live/barr_icon.svg);
        }
        .mess_icon {
          background-image: url(/static/images/live/mess_icon.svg);
        }
        .share_icon {
          background-image: url(/static/images/live/share_icon.svg);
        }
        .look_icon {
          background-image: url(/static/images/live/look_icon.svg);
        }
      }
      .look_btn {
        margin-right: 0px;
      }
    }
  }
  .occlusion {
    width: 18px;
    height: 18px;
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block !important;
  }
  @include screen(medium) {
    .live_room_header_right {
      .live_room_fun_btn {
        .live_room_btn {
          margin-right: 12px !important;
          position: relative;
          // .occlusion {
          //   width:18px;
          //   height: 18px;
          //   position: absolute;
          //   top: 0;
          //   left: 0;
          //   display: inline-block!important;
          // }
          .btn_icon_box {
            margin-right: 0px !important;
          }
          .btn_text {
            display: none !important;
          }
        }
        .look_btn {
          margin-right: 0px !important;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.popper_class_share {
  .live_room_share_box {
    .big_title {
      color: var(--el-text-color-placeholder);
      font-size: 14px;
      font-weight: 400;
      font-style: normal;
      margin-bottom: 12px;
    }
  }
}
.el_popover_live_room {
  .el_popover_downLoad_box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .downLoad_title {
      text-align: center;
      color: var(--el-text-color-primary);
      font-size: 16px;
      font-weight: 600;
      font-style: normal;
      line-height: 34px;
      margin-bottom: 12px;
    }
    .downLoad_sub_title {
      text-align: center;
      color: var(--el-text-color-placeholder);
      font-size: 14px;
      font-weight: 400;
      font-style: normal;
      margin-bottom: 10px;
    }
    .downLoad_qrCode {
      width: 126px;
      height: 126px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid var(--el-border-color-light);
      border-radius: 4px;
      background-color: var(--el-color-white);
      margin-bottom: 12px;
    }
    a {
      width: 100%;
    }
    .el-button {
      width: 100%;
    }
  }
}
</style>
