<template>
  <div class="work-tab-component">
    <ul class="status-list flex">
      <li
        v-for="sub in stautsList"
        :key="sub.type"
        @click="handleChangeType(sub)"
        :class="{ isLight: currentType === sub.type }"
      >
        <span>{{ sub.text }}</span>
      </li>
    </ul>

    <SearchFrom @search="_emitsSearch" v-model="selectTime"></SearchFrom>
    <div v-loading="loading" class="mask-loading">
      <div
        class="workban-tab-content hide_scrollbar"
        v-infinite-scroll="_updateloadMore"
        :infinite-scroll-immediate="false"
      >
        <!-- 我的待办 -->
        <div class="work-online" v-if="isTodo">
          <WorkBenchList :workList="workTodoList" v-if="workTodoList.length" :loadingMoreList="loadingMoreList">
            <template v-slot="{ item }">
              <div class="operation-details">
                <div class="flex operation">
                  <div class="text-clamp operation-max-width">
                    操作详情:
                    <el-tooltip popper-class="work-tooltip" placement="top" :content="item.detail">
                      <span>{{ item.detail }}</span>
                    </el-tooltip>
                  </div>
                  <span>{{ getFormDate(item.created_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
                </div>
                <div @click="handleProcess(item)" class="process-click" v-if="isApprovePermiss">点击处理</div>
              </div>
            </template>
          </WorkBenchList>
          <!-- 无数据显示 -->
          <DfEmpty v-else />
        </div>
        <!-- 我的已办 -->
        <div class="work-online user-block" v-if="isDone">
          <WorkBenchList :workList="workDoneList" v-if="workDoneList.length" :loadingMoreList="loadingMoreList">
            <template v-slot="{ item }">
              <div class="operation-details">
                <div class="flex operation">
                  <div class="text-clamp operation-max-width">
                    操作详情:
                    <el-tooltip popper-class="work-tooltip" placement="top" :content="item.detail">
                      <span>{{ item.detail }}</span>
                    </el-tooltip>
                  </div>
                  <span>审核时间: {{ getFormDate(item.updated_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
                </div>
                <div :class="[`flex defin-result`, { reject: +item.status === 2 }]">
                  <span
                    >状态: <span class="status-value">{{ workBanStatus[item.status] }}</span></span
                  >
                  <div class="text-clamp remark">
                    备注:
                    <el-tooltip
                      popper-class="work-tooltip"
                      placement="top-start"
                      :content="item.approval_comment"
                    >
                      <span>{{ item.approval_comment }}</span>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </template>
          </WorkBenchList>
          <!-- 无数据显示 -->
          <DfEmpty v-else />
        </div>
      </div>
    </div>

    <DfDialog
      v-model:isDialog="isRemarkDialog"
      otherTest="拒绝"
      sureText="同意"
      @_updataAttentFun="_updataAttentFun"
    >
      <div class="close-images" @click="() => (isRemarkDialog = false)">
        <img src="/static/images/feedback/close.png" alt="close" width="100%" height="100%" />
      </div>
      <!-- content -->
      <div>
        <span class="text-style">备注:</span>
        <el-input
          v-model="remarkText"
          type="textarea"
          maxlength="30"
          show-word-limit
          :autosize="{ minRows: 4, maxRows: 10 }"
        ></el-input>
      </div>
      <span v-if="!remarkText" class="remark-style">{{ remarkRequiredText }}</span>
    </DfDialog>
  </div>
</template>

<script setup>
import { usePermission } from '@/utils/usePermision'
import { myApprovalTodo, myApprovalDone, definApproval } from '@/api/housManage'
import SearchFrom from './searchFrom.vue'
import WorkBenchList from './workBenchList.vue'
import { workBanStatus } from '@/utils/mapping'
import { getFormDate } from '@/utils/common'
const stautsList = [
  { text: '我的待办', type: 'todo' },
  { text: '我的已办', type: 'done' }
]
const currentType = ref('todo')
const isRemarkDialog = ref(false)
const loadingMoreList = ref(false)
const loading = ref(false)
const currentItem = ref()
const currentPage = ref(1)
const remarkText = ref('')
const remarkRequiredText = ref('')
/** 当前时间 */
const selectTime = ref('')
/** 是待办 */
const isTodo = computed(() => {
  return currentType.value === 'todo'
})
/** 是已办 */
const isDone = computed(() => {
  return currentType.value === 'done'
})
/** 是否有审批权限 */
const { isApprovePermiss } = usePermission()

const workDoneList = ref([])
const workTodoList = ref([])

const handleChangeType = (sub) => {
  if (currentType.value === sub.type) return
  currentType.value = sub.type
  currentPage.value = 1
  selectTime.value = null
  _init()
}
/** 搜索 */
const _emitsSearch = (val) => {
  selectTime.value = val
  _init()
}
/** 点击处理 */
const handleProcess = (item) => {
  isRemarkDialog.value = true
  currentItem.value = item
}
/** 同意 else 拒绝 */
const _updataAttentFun = (type) => {
  if (type) {
    remarkRequiredText.value = ''
    const text = remarkText.value ? remarkText.value : '同意'
    _getApprovalFun(text, 1)
  } else {
    if (!remarkText.value) {
      remarkRequiredText.value = '请填写备注'
      return
    }
    _getApprovalFun(remarkText.value, 2)
  }
}

const _getApprovalFun = (text, status) => {
  try {
    definApproval({
      instanceId: currentItem.value.instance_id,
      approvalStatus: status,
      approvalComment: text
    }).then((res) => {
      console.log(res, 'res')
      isRemarkDialog.value = false
    })
  } catch (error) {
    console.log(error)
  }
}

const _getToDoFun = () => {
  loading.value = true
  myApprovalTodo({
    time_start: selectTime.value ? selectTime.value[0] + ' 00:00:00' : null,
    time_end: selectTime.value ? selectTime.value[1] + ' 23:59:59': null,
    page: currentPage.value,
    page_size: 20
  }).then((res) => {
    const { code, data } = res
    if (code === 0) {
      workTodoList.value.push(...data.data)
      loadingMoreParams(data)
    }
    loading.value = false
  }).catch(error =>{
    loading.value = false
    ElMessage.warning(error.msg)
    workTodoList.value = []
  })
}
const _getDoneFun = () => {
  loading.value = true
  myApprovalDone({
    time_start: selectTime.value ? selectTime.value[0] : null,
    time_end: selectTime.value ? selectTime.value[1] : null,
    page: currentPage.value,
    page_size: 20
  }).then((res) => {
    const { code, data } = res
    if (code === 0) {
      workDoneList.value.push(...data.data)
      loadingMoreParams(data)
    }
    loading.value = false
  }).catch(error => {
    console.log(error)
    loading.value = false
    workDoneList.value = []
  })
}

const loadingMoreParams = (data) => {
  if (currentPage.value < data.last_page) {
    currentPage.value++
    loadingMoreList.value = true
  } else {
    loadingMoreList.value = false
  }
}

const _updateloadMore = () => {
  if (loadingMoreList.value) {
    console.log('翻页加载')
    if (isTodo.value) {
      _getToDoFun()
    } else {
      _getDoneFun()
    }
  }
}

const _init = () => {
  if (isTodo.value) {
    workTodoList.value = []
    _getToDoFun()
  } else {
    workDoneList.value = []
    _getDoneFun()
  }
}

onMounted(() => {
  _init()
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
<style lang="scss">
.work-tooltip {
  max-width: 240px;
  white-space: pre-line;
  word-wrap: break-word;
}
</style>
