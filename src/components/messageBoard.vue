<template>
  <div class="message_board">
    <div class="message_board_title">选择问题类型</div>
    <ul class="message_board_type">
      <li
        :class="[selectedId === item.id ? 'is-active' : '']"
        v-for="item in listData"
        :key="item.id"
        @click="select(item)"
      >
        {{ item.name }}
      </li>
    </ul>
    <div class="textarea_box">
      <el-input
        v-model="messValue"
        resize="none"
        placeholder="请填写您的意见和建议..."
        type="textarea"
      ></el-input>
      <el-button class="submit_box" :disabled="!canSubmitMessage" :class="{ 'is-active': canSubmitMessage }" @click="doSubmitDebounceFn">提交</el-button>
    </div>
  </div>
</template>

<script setup name="messageBoard" lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { category, submit } from '@/api/feedback.js'

const listData = ref([])
const selectedId = ref(1)
const messValue = ref('')
const canSubmitMessage = computed(() => !!selectedId.value && messValue.value.trim().length >= 5)

const select = ({ id }) => {
  selectedId.value = id
}

const doSubmit = () => {
  if (!canSubmitMessage.value) {
    return
  }
  if (!messValue.value.trim()) {
    return ElMessage({
      message: '内容不能为空',
      type: 'error',
      customClass: 'feedback_message'
    })
  }

  let params = {
    feedback_id: '', // 反馈ID，第一次反馈的时候不需要，后面回复需要带上
    category_id: selectedId.value, // 类目ID
    message: messValue.value.trim()
  }
  submit(params)
    .then((res) => {
      if (res.code === 0) {
        messValue.value = ''
        ElMessage({
          message: '提交成功',
          type: 'success',
          customClass: 'feedback_message'
        })
      } else {
        ElMessage({
          message: res.msg || res.data?.msg || '提交失败',
          type: 'error',
          customClass: 'feedback_message'
        })
      }
    })
    .catch((err) => {
      ElMessage({
        message: err.msg || err.data?.msg || '提交失败',
        type: 'error',
        customClass: 'feedback_message'
      })
    })
}
const doSubmitDebounceFn = useDebounceFn(doSubmit, 300)

const getCategory = () => {
  category()
    .then((res) => {
      if (res.code === 0) {
        listData.value = res.data
      } else {
        ElMessage({
          message: res.msg || res.data?.msg || '问题类型获取失败',
          type: 'error'
        })
      }
    })
    .catch((err) => {
      ElMessage({
        message: err.msg || err.data?.msg || '问题类型获取失败',
        type: 'error'
      })
    })
}

onMounted(() => {
  getCategory()
})
</script>

<style scoped lang="scss">
.message_board {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 12px;
  background-color: var(--el-bg-color-overlay);
  overflow: hidden;
  .message_board_title {
    color: var(--el-text-color-primary);
    font-size: 14px;
    font-weight: 600;
    line-height: 32px;
    padding-left: 12px;
    margin-bottom: 12px;
  }
  .message_board_type {
    display: flex;
    flex-wrap: wrap;
    padding: 0 8px;
    margin-bottom: 4px;
    li {
      padding: 2px 12px;
      border-radius: 999px;
      border: 1px solid var(--el-borer-color);
      font-size: 12px;
      font-weight: 500;
      font-style: normal;
      color: var(--el-text-color-regular);
      margin-right: 8px;
      white-space: nowrap;
      cursor: pointer;
      margin-bottom: 8px;
      &:hover {
        color: var(--el-text-color-white);
        background-color: var(--el-primary-background-color);
        border: 1px solid var(--el-primary-background-color);
      }
    }
    .is-active {
      color: var(--el-text-color-white);
      background-color: var(--el-primary-background-color);
      border: 1px solid var(--el-primary-background-color);
    }
  }
  .textarea_box {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 8px;
    overflow: hidden;
    .el-textarea {
      flex: 1;
      :deep(.el-textarea__inner) {
        height: 100%;
        box-shadow: 0 0 0 0 !important;
        background-color: var(--el-bg-color-page);
        border-radius: 0px;
      }
    }
    .submit_box {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      height: 40px;
      color: var(--el-text-color-regular);
      font-size: 14px;
      font-weight: 600;
      font-style: normal;
      &:disabled {
        cursor: not-allowed;
      }
      &.is-active {
        color: var(--el-primary-background-color);
      }
    }
  }
}
</style>
