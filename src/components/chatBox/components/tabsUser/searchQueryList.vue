<template>
  <ul class="query-list-component">
    <li
      v-for="item in itemList"
      :key="item.status"
      class="flex"
      @click="handleOperate(item)"
      :class="{ 'not-allow': (item?.block_apply && item?.mute_apply) || item.toast }"
    >
      <div class="item-left flex-start">
        <!-- 等级 -->
        <div class="level-status flex-start" :class="'level-' + item.level">
          <img
            :src="`/static/images/live/level/${item.level}.png`"
            :alt="item.level"
            width="16px"
            height="16px"
          />
          <span class="sender-exp">{{ `Lv.${item.level}` }}</span>
        </div>
        <!-- 文本 -->
        <div class="text">{{ item.username }}</div>
      </div>

      <!-- 查询tab状态 -->
      <div v-if="isTabs === 'online'" class="block-ban-cus flex-start">
        <div class="block-down" v-if="item.block_apply">已拉黑</div>
        <div class="mute-down" v-if="item.mute_apply">已禁言</div>
      </div>
      <!-- 拉黑禁言状态 -->
      <div v-if="isTabs !== 'online'" class="block-ban-cus">
        <el-tag type="warning" size="small" v-if="!!item.toast">等待审批</el-tag>
        <el-tag type="info" size="small" v-else>取消{{ optionStatus[isTabs] }}</el-tag>
      </div>
    </li>
  </ul>
  <div v-if="loadingMoreList" class="loading-center">Loading...</div>
  <!-- <div v-if="noMore" class="loading-center">No more</div> -->

  <!-- 禁止发言 拉黑用户 -->
  <DfDialog
    v-model:isDialog="isBlockBanDialog"
    otherTest="禁止发言"
    :isOtherdsiabled="currentTips.mute_toast || !isBanPermiss"
    :isSuredsiabled="currentTips.block_toast || !isBlockPermiss"
    sureText="拉黑用户"
    @_updataAttentFun="_updataFristAttentFun"
  >
    <div class="close-images" @click="() => (isBlockBanDialog = false)">
      <img src="/static/images/feedback/close.png" alt="close" width="100%" height="100%" />
    </div>
    <!-- content -->
    <div class="current-tips-dialog flex-center">
      <div class="level-status flex-start" :class="'level-' + currentTips.level">
        <img
          :src="`/static/images/live/level/${currentTips.level}.png`"
          :alt="currentTips.level"
          width="16px"
          height="16px"
        />
        <span class="sender-exp">{{ `Lv.${currentTips.level}` }}</span>
      </div>
      <!-- 文本 -->
      <div class="text">{{ currentTips.username }}</div>
    </div>
  </DfDialog>

  <!-- 取消拉黑和禁言 -->
  <DfDialog
    v-model:isDialog="isOtherDialog"
    closeTest="取消"
    sureText="确定"
    @_updataAttentFun="_updataOtherAttentFun"
  >
    <div>
      <span class="text-style">{{
        `您确定对用户【${currentTips?.username}】取消${optionStatus[isTabs]}吗?`
      }}</span>
      <el-input
        v-model="cancleReason"
        type="textarea"
        maxlength="30"
        show-word-limit
        placeholder="请输入取消理由"
        :autosize="{ minRows: 4, maxRows: 10 }"
      ></el-input>
      <span v-if="!cancleReason || !cancleReason.trim()" class="reason-style">{{
        reasonRequiredText
      }}</span>
    </div>
  </DfDialog>

  <!-- 拉黑禁言 2次确认弹框 -->
  <DfDialog
    v-model:isDialog="isSeconedDialog"
    closeTest="取消"
    @_updataAttentFun="_updataSeconedSure"
  >
    <div>
      <span class="text-style">请输入{{ optionStatus[currentTips?.currentStatus] }}理由:</span>
      <el-input
        v-model="reasonText"
        type="textarea"
        maxlength="30"
        show-word-limit
        :autosize="{ minRows: 4, maxRows: 10 }"
      ></el-input>
      <span v-if="!reasonText || !reasonText.trim()" class="reason-style">{{
        reasonRequiredText
      }}</span>
    </div>
  </DfDialog>
</template>

<script setup>
import { useStore } from 'vuex'
import { usePermission } from '@/utils/usePermision'
import { optionStatus } from '@/utils/mapping'
import { submitBlockOperation, submitBanOperation } from '@/api/housManage.js'
const emit = defineEmits(['_updateItemList'])
const props = defineProps({
  itemList: {
    type: Array,
    default: () => []
  },
  isTabs: {
    type: String,
    default: ''
  },
  vid: {
    type: String,
    default: ''
  },
  roomId: {
    type: Number,
    default: 0
  },
  userNickname: {
    type: String,
    default: ''
  },
  loadingMoreList: {
    type: Boolean,
    default: false
  },
  noMore: {
    type: Boolean,
    default: false
  }
})
const store = useStore()
const isBlockBanDialog = ref(false)
const isOtherDialog = ref(false)
const isSeconedDialog = ref(false)
const currentTips = ref({
  currentStatus: '',
  apply_status: ''
})
// 拉黑禁言的理由
const reasonText = ref('')
// 取消的理由
const cancleReason = ref('')
const reasonRequiredText = ref('')
/**
 * 是否有拉黑权限
 * 是否有禁言权限
 * */
const { isBlockPermiss, isBanPermiss } = usePermission()

/** 点击名称 */
const handleOperate = (item) => {
  if (props.isTabs === 'online' && (!item.block_apply || !item.mute_apply)) {
    isBlockBanDialog.value = true
    currentTips.value = item
    return
  }

  if (props.isTabs !== 'online') {
    if (item.toast) return
    reasonRequiredText.value = ''
    cancleReason.value = ''
    isOtherDialog.value = true
    currentTips.value = item
  }
}
/** 弹框确定 type false禁止发言 type true拉黑用户 */
const _updataFristAttentFun = (type) => {
  if (type) {
    currentTips.value.apply_status = 'block_toast'
    currentTips.value.currentStatus = 'block'
  } else {
    currentTips.value.apply_status = 'mute_toast'
    currentTips.value.currentStatus = 'ban'
  }
  isSeconedDialog.value = true
  reasonText.value = ''
  reasonRequiredText.value = ''
}
/** 拉黑禁言 2次确认弹框 */
const _updataSeconedSure = () => {
  if (!reasonText.value || !reasonText.value.trim()) {
    reasonRequiredText.value = `${optionStatus[currentTips.value.currentStatus]}理由不能为空!`
    return
  }
  if (currentTips.value.currentStatus === 'block') {
    _implementBlockFun(1)
  } else {
    _implementBanFun(1)
  }
}
/** 取消拉黑和禁言弹框确定 */
const _updataOtherAttentFun = () => {
  if (!cancleReason.value || !cancleReason.value.trim()) {
    reasonRequiredText.value = `请输入取消的理由!`
    return
  }
  if (props.isTabs === 'block') {
    _implementBlockFun(0)
  } else {
    _implementBanFun(0)
  }
}
const searchParams = (type) => {
  console.log(store.state.user.infoData.user_nickname, 'info')
  return {
    uid: currentTips.value.user_id,
    vid: props.vid,
    room_id: props.roomId,
    reason: type ? reasonText.value.trim() : cancleReason.value.trim(),
    chat_room_name: props.userNickname,
    room_manager_nickname: store.state.user.infoData.user_nickname,
    room_manager_name: '这个后台自己查下room_manager_name',
    manager_type: store.state.house.houseAuthor.type // 房管1普通  2高级
  }
}
const _implementBanFun = (type) => {
  const params = {
    type, // 0 取消禁言  1 禁言
    ...searchParams(type)
  }
  try {
    submitBanOperation(params)
      .then((res) => {
        console.log(res, '禁言和取消禁言')
        if (res.code === 0) {
          emit('_updateItemList', currentTips.value)
          isSeconedDialog.value = false
          isBlockBanDialog.value = false
          isOtherDialog.value = false
          ElMessage.success(res.msg)
        }
      })
      .catch((error) => {
        isOtherDialog.value = false
        ElMessage.warning(error.msg)
      })
  } catch (error) {
    console.log(error)
  }
}
const _implementBlockFun = (type) => {
  const params = {
    type, // 0 取消拉黑  1 拉黑
    ...searchParams(type)
  }
  try {
    submitBlockOperation(params)
      .then((res) => {
        if (res.code === 0) {
          emit('_updateItemList', currentTips.value)
          isSeconedDialog.value = false
          isBlockBanDialog.value = false
          isOtherDialog.value = false
          ElMessage.success(res.msg)
        }
      })
      .catch((error) => {
        isOtherDialog.value = false
        ElMessage.warning(error.msg)
      })
    // eslint-disable-next-line no-empty
  } catch {}
}
</script>

<style scoped lang="scss">
@import './searchQueryList.scss';
.query-list-component {
  li {
    font-size: 14px;
    color: #303133;
    height: 36px;
    border-bottom: 1px solid #f0f2f5;
    // .item-left {
    cursor: pointer;
    &.not-allow {
      cursor: not-allowed;
    }
    // }
  }
  .block-down {
    color: #baa9ae;
    background-color: #f9e9e9;
    padding: 4px;
    border-radius: 2px;
  }
  .mute-down {
    color: #d39986;
    background-color: #fff0eb;
    padding: 4px;
    border-radius: 2px;
    margin-left: 4px;
  }
}
::v-deep(.el-tag.el-tag--info) {
  color: #333;
}
</style>
