<template>
  <div class="private-message-page" v-show="!dialogVisible">
    <tabs :tabs-list="tabData" v-model="tabKey">
      <section v-show="isSubmitTab" class="private-message-panel">
        <feedback
          class="private-message-panel__category"
          single
          v-model="feedbackValue"
          :feedbackData="fbData"
        />

        <div class="message-form">
          <div class="message-form__label">请填写您的意见和建议</div>
          <el-input
            v-model="advice"
            class="message-form__textarea"
            :class="{
              'is-selected': feedbackValue.length,
              'is-valid': trimmedAdvice.length >= ADVICE_MIN_LENGTH
            }"
            spellcheck="false"
            type="textarea"
            :maxlength="ADVICE_MAX_LENGTH"
            resize="none"
            show-word-limit
            placeholder="在这里请输入…"
          />
          <el-button
            class="message-form__submit"
            :disabled="!canSubmitAdvice"
            :class="{ 'is-active': canSubmitAdvice }"
            @click="submitAdvice"
          >
            提交
          </el-button>
        </div>
      </section>

      <section v-show="isRecordTab" class="private-message-panel">
        <feedback
          class="private-message-panel__category"
          v-model="msgValue"
          :feedbackData="fbData"
          @click="handleMsgRecord"
        />

        <el-empty
          v-show="!msgRecord.length"
          image="/static/images/spaceAndMine/emptyBox.png"
          description="暂无留言"
        >
          <el-text class="message-record-empty">您目前还没有留言记录唷！</el-text>
        </el-empty>

        <div class="message-record-list" v-show="msgRecord.length">
          <div class="message-record-card" v-for="record in msgRecord" :key="record.id">
            <div class="message-record-card__title">{{ record.category?.name }}</div>
            <div class="message-record-card__time">{{ getYMD(record.updated_at) }}</div>
            <div class="message-record-card__content">{{ record.message[0]?.message_text }}</div>
            <div class="message-record-card__more" @click="seeMore(record)">
              查看全部{{ getReplyCount(record) }}条回复
            </div>
          </div>
        </div>
      </section>

      <div class="message-record-loader" ref="viewPortDom" v-show="isRecordTab && listStatus.has_more">
        <el-icon class="is-loading"><Loading /></el-icon>
      </div>
    </tabs>
  </div>
  <dialogReplay :item="item" :visible="dialogVisible" @close="dialogVisible = $event" />
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'
import { computed, onActivated, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import tabs from './component/tabs.vue'
import feedback from './component/feedback.vue'
import dialogReplay from './component/dialogReplay.vue'
import { myFBCategoryApi, myMsgSubmitApi, myMsgRecordApi } from '@/api'
import { getYMD } from '@/utils/common'

const TAB_KEY = {
  SUBMIT: 0,
  RECORD: 1
}
const ADVICE_MIN_LENGTH = 5
const ADVICE_MAX_LENGTH = 100
const ANCHOR_APPLY_CATEGORY_NAME = '申请成为主播'

const router = useRouter()
const tabKey = ref(TAB_KEY.SUBMIT)
const dialogVisible = ref(false)
const tabData = [
  { name: '我要反馈', key: TAB_KEY.SUBMIT },
  { name: '留言记录', key: TAB_KEY.RECORD }
]

const fbData = reactive([])
const feedbackValue = reactive([])
const msgValue = reactive([])
const advice = ref('')
const isSubmitting = ref(false)
const msgRecord = reactive([])
const viewPortDom = ref<HTMLDivElement>(null)
const listStatus = reactive({ page: 1, total: 0, has_more: false })
const item = reactive({})

const isSubmitTab = computed(() => tabKey.value === TAB_KEY.SUBMIT)
const isRecordTab = computed(() => tabKey.value === TAB_KEY.RECORD)
const trimmedAdvice = computed(() => advice.value.trim())
const selectedCategoryId = computed(() => feedbackValue[0])
const canSubmitAdvice = computed(
  () =>
    !!selectedCategoryId.value &&
    trimmedAdvice.value.length >= ADVICE_MIN_LENGTH &&
    !isSubmitting.value
)

const seeMore = value => {
  dialogVisible.value = true
  Object.assign(item, value)
}

const getReplyCount = record => record.message?.filter(message => message.type === 2).length || 0

const resetSubmitForm = () => {
  advice.value = ''
  feedbackValue.splice(0, feedbackValue.length)
}

const submitAdvice = () => {
  const message = trimmedAdvice.value
  if (!feedbackValue.length) {
    return ElMessage.warning('请选择悄悄话类型')
  }
  if (message.length === 0) {
    return ElMessage.warning('请输入悄悄话')
  }
  if (message.length < ADVICE_MIN_LENGTH || message.length > ADVICE_MAX_LENGTH) {
    return ElMessage.warning('请输入' + ADVICE_MIN_LENGTH + '-' + ADVICE_MAX_LENGTH + '字')
  }
  if (isSubmitting.value) return

  isSubmitting.value = true
  myMsgSubmitApi({ category_id: selectedCategoryId.value, message, feedback_id: '' })
    .then(() => {
      resetSubmitForm()
      ElMessage.success({ message: '悄悄话留言成功', duration: 3000 })
      goMySpace()
    })
    .catch(() => {
      ElMessage.error('提交失败')
    })
    .finally(() => {
      isSubmitting.value = false
    })
}

const goMySpace = () => {
  localStorage.setItem('mainMenuKey', '0')
  router.replace('/mySpace').then(() => {
    router.replace('/mySpace/user')
  })
}

const fetchRecords = (page = 1, category_id = '') => myMsgRecordApi({ page, category_id })

const syncRecordStatus = res => {
  listStatus.total = res?.data?.total || 0
  listStatus.has_more = !!res?.data?.has_more
}

const handleMsgRecord = () => {
  fetchRecords(1, msgValue.join(',')).then(res => {
    msgRecord.splice(0, msgRecord.length, ...(res?.data?.data || []))
    listStatus.page = 1
    syncRecordStatus(res)
  })
}

const loadMoreRecords = () => {
  const nextPage = listStatus.page + 1
  fetchRecords(nextPage, msgValue.join(',')).then(res => {
    msgRecord.push(...(res?.data?.data || []))
    listStatus.page = nextPage
    syncRecordStatus(res)
  })
}

const loadCategories = () => {
  myFBCategoryApi().then(res => {
    fbData.splice(0, fbData.length, ...(res.data || []))
  })
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || !listStatus.has_more) return
    loadMoreRecords()
  })
})

onMounted(() => {
  handleMsgRecord()
  loadCategories()
  if (viewPortDom.value) {
    observer.observe(viewPortDom.value)
  }
})

onUnmounted(() => {
  if (viewPortDom.value) {
    observer.unobserve(viewPortDom.value)
  }
})

onActivated(() => {
  if (history.state.comp !== 7) return
  history.state.comp = undefined
  myFBCategoryApi().then(res => {
    const item = res.data.find(x => x.name === ANCHOR_APPLY_CATEGORY_NAME)
    if (item) feedbackValue.push(item.id)
  })
})
</script>

<style scoped lang="scss">
.private-message-page {
  margin: 0 8px;
}

.private-message-panel {
  margin: 0 16px;

  &__category {
    padding: 2px 16px 32px;
  }
}

.message-form {
  &__label {
    color: #333;
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 16px;
  }

  &__textarea {
    --el-input-border-color: #fff;
    --el-input-hover-border-color: #fff;
    --el-input-focus-border-color: #fff;

    &.is-selected,
    &:focus-within {
      --el-input-border-color: #999;
      --el-input-hover-border-color: #999;
      --el-input-focus-border-color: #999;
    }

    &.is-valid {
      :deep(.el-input__count) {
        color: #000;
      }
    }

    :deep(.el-textarea__inner) {
      height: 264px;
      background-color: #f9fafb;
      border: 0;
    }

    :deep(.el-input__count) {
      background-color: #f9fafb;
    }
  }

  &__submit {
    float: right;
    margin-top: 32px;
    padding: 6px 16px;
    background-color: #999;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
    }

    &.is-active {
      background-color: #d02d54;
      color: #fff;
      pointer-events: all;
    }
  }
}

.message-record-empty {
  color: #666;
}

.message-record-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-record-card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 17px 0;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f1f1;

  &__title {
    font-size: 18px;
    color: #333;
    font-weight: 400;
    line-height: 17px;
  }

  &__time {
    font-size: 14px;
    color: #666;
    font-weight: 400;
  }

  &__content {
    font-size: 16px;
    color: #666;
    line-height: 1.4;
    font-weight: 400;
    grid-column: 1 / -1;
  }

  &__more {
    font-size: 16px;
    font-weight: 400;
    line-height: 1;
    color: #367df1;
    cursor: pointer;
  }
}

.message-record-loader {
  text-align: center;
  height: 60px;
  line-height: 60px;
}
</style>
