<template>
  <!-- 草稿列表 -->
  <el-dialog
    class="illustrate_custom"
    v-model="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :append-to-body="true"
    :width="434"
  >
    <div class="explain_box">
      <div class="explain_title">{{ explainData.title }}</div>
      <div class="explain_content" v-html="formatTextMsg(explainData.description)"></div>
      <div class="explain_button">
        <el-button @click="visible = !visible" round>确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup name="illustrateDialog" lang="ts">
import { formatTextMsg } from '@/utils/common'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  explainData: {
    type: Object,
    default: () => ({})
  }
})

const visible = computed({
  get: function () {
    return props.modelValue
  },
  set: function (newValue) {
    emits('update:modelValue', newValue)
  }
})

const emits = defineEmits(['update:modelValue'])
</script>

<style lang="scss">
.illustrate_custom {
  padding: 20px;
  padding-bottom: 18px;
  border-radius: 12px;
  .el-dialog__header {
    display: none;
  }
  .explain_box {
    display: flex;
    flex-direction: column;
    font-family: 'PingFang SC';

    .explain_title {
      padding-bottom: 8px;
      color: #000;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
    }
    .explain_content {
      height: 290px;
      overflow-y: auto;
      color: #2d2d2d;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      letter-spacing: 1px;
      white-space: pre-wrap;
      word-break: break-word;

      &::-webkit-scrollbar {
        width: 5px;
      }
    }
    .explain_button {
      padding-top: 18px;
      flex: 1;
      .el-button {
        background-color: #d31357;
        color: #fff;
        width: 100% !important;
        border: 0;
        height: 44px;
        font-weight: 600;
      }
    }
  }
}
</style>
