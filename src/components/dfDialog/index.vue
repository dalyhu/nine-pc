<!-- 封装同意dialog -->
<template>
  <el-dialog
    :show-close="false"
    v-model="isShow"
    :center="isCenter"
    :width="isWidth"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="common_dialog"
  >
    <div class="content" v-if="showText">{{ showText }}</div>
    <div v-else class="flex-content">
      <slot></slot>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <span @click="handleClose" v-if="closeTest">{{ closeTest }}</span>
        <span @click="handleOther" v-if="otherTest" :class="{ isdisabled: !!isOtherdsiabled }">{{
          otherTest
        }}</span>
        <span :style="footerButton" @click="handleSure" :class="{ isdisabled: !!isSuredsiabled }">{{
          sureText
        }}</span>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(['update:isDialog', '_updataAttentFun'])
const props = defineProps({
  isDialog: {
    type: Boolean,
    default: false
  },
  isCenter: {
    type: Boolean,
    default: true
  },
  isWidth: {
    type: String,
    default: '360px'
  },
  // 取消按钮
  closeTest: {
    type: String,
    default: ''
  },
  // 确定按钮
  sureText: {
    type: String,
    default: '确认'
  },
  // 其他按钮
  otherTest: {
    type: String,
    default: ''
  },
  showText: {
    type: String,
    default: ''
  },
  // 按钮是否可以点击
  isOtherdsiabled: {
    type: Boolean,
    default: false
  },
  isSuredsiabled: {
    type: Boolean,
    default: false
  },
  footerButton: {
    type: Object,
    default: () => ({})
  }
})

const isShow = ref(false)

const handleClose = () => {
  emit('update:isDialog', false)
}
const handleOther = () => {
  emit('_updataAttentFun', false)
}

const handleSure = () => {
  emit('_updataAttentFun', true)
}

watch(
  () => props.isDialog,
  (val) => {
    isShow.value = val
  }
)
</script>

<style lang="scss">
.common_dialog {
  border-radius: 8px;
  max-height: 85vh;
  height: auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  scrollbar-width: none;
  position: fixed;
  top: 50%;
  left: 50%;
  margin: 0;
  transform: translate(-50%, -50%);
  &::-webkit-scrollbar {
    display: none;
  }
  .content {
    font-size: 16px;
    text-align: center;
  }
  .flex-content,
  .el-dialog__body {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
  }
  .el-dialog__footer {
    flex-shrink: 0;
  }
  .dialog-footer {
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 82px;
      height: 28px;
      text-align: center;
      border-radius: 2px;
      color: #d02d54;
      border: 1px solid #d02d54;
      margin: 20px 10px;
      cursor: pointer;
      &:last-child {
        background: #d02d54;
        color: #fff;
      }
      &.isdisabled {
        background: #ccc;
        pointer-events: none;
        cursor: not-allowed;
        color: #666;
        border: 1px solid #ccc;
      }
    }
  }
}
</style>
