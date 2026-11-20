<template>
  <DfDialog
    v-model:isDialog="isDialog"
    isWidth="542px"
    sureText="确认提交"
    :isSuredsiabled="isSubmitBlocked"
    :footerButton="{
      width: '100%',
      height: '48px',
      fontSize: '17px',
      borderRadius: '30px'
    }"
    @_updataAttentFun="handleSure"
  >
    <div v-loading="loading" class="mask-loading flex-cloumn">
      <div class="title">{{ dialogTitle }}</div>
      <el-icon class="grananed-close" color="#303133" size="24" @click="handleClose"
        ><Close
      /></el-icon>
      <!-- form -->
      <div class="grananed-content">
        <el-form
          ref="formRef"
          :model="formData"
          label-position="left"
          :rules="formRules"
          :validate-on-rule-change="false"
          label-width="85px"
        >
          <el-row class="not-emit">
            <el-form-item label="赛事类型: ">
              <el-input :model-value="getChangeValue" readonly />
            </el-form-item>
            <!-- 比赛时间 -->
            <el-form-item label="比赛时间: ">
              <el-input v-model="previewInfo.game_time" readonly />
            </el-form-item>
            <!-- 包赔赛事 -->
            <el-form-item label="活动联赛: ">
              <el-input v-model="previewInfo.select_game" readonly />
            </el-form-item>

            <el-form-item label="比赛队伍: ">
              <el-input v-model="previewInfo.competition_teams" readonly />
            </el-form-item>
          </el-row>

          <el-form-item
            v-if="formUi.account.show"
            :label="isCustom ? '账号名称: ' : 'XC账号: '"
            :required="formUi.account.req"
            prop="account"
            class="label-block"
          >
            <el-input
              v-model="formData.account"
              maxlength="20"
              :placeholder="isCustom ? '请输入账号名称' : '请输入XC账号'"
              @input="handleNoSpaceInput('account', $event)"
            />
          </el-form-item>

          <!-- 注单号 -->
          <el-form-item
            v-if="formUi.order_no.show"
            label="单号: "
            :required="formUi.order_no.req"
            prop="order_no"
            class="label-block"
          >
            <el-input
              v-model="formData.order_no"
              maxlength="20"
              placeholder="请输入单号"
              @input="handleNoSpaceInput('order_no', $event)"
            />
          </el-form-item>
          <!-- 投注金额 -->
          <el-form-item
            v-if="formUi.raise.show"
            label="金额: "
            :required="formUi.raise.req"
            prop="raise"
            class="label-block"
          >
            <el-input
              type="text"
              v-model="formData.raise"
              maxlength="9"
              placeholder="请输入金额"
              @input="handleRaiseInput"
            />
          </el-form-item>
          <!-- 情况说明 -->
          <el-form-item
            v-if="formUi.detail.show"
            label="情况说明: "
            class="label-block"
            :required="formUi.detail.req"
            prop="detail"
          >
            <el-input
              v-model="formData.detail"
              maxlength="200"
              :placeholder="detailPlaceholder"
              @input="handleNoSpaceInput('detail', $event)"
            />
          </el-form-item>
          <!-- 上传截图（错误文案挂在表单项，与 H5 van-field error 一致） -->
          <el-form-item
            v-if="formUi.files_path.show"
            label="上传截图: "
            :required="formUi.files_path.req"
            class="upload-item label-block upload-last-group"
            :error="uploadFieldError"
          >
            <CustomUploader ref="uploadRef"></CustomUploader>
          </el-form-item>
        </el-form>
        <div class="disclaimer-outer">
          <Disclaimer
            :notice-html="customNoticeHtml"
            :custom-notice-enabled="customNoticeEnabled"
            :show-disclaimer="showDisclaimerBlock"
          />
        </div>
      </div>
    </div>
  </DfDialog>
</template>

<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import Disclaimer from './disclaimer.vue'
import CustomUploader from './custom-uploader.vue'
import { FormRules } from 'element-plus'
import { FormData } from '@/utils/mapping'
import { getApplyParam, getCompensationApply } from '@/api/activities.js'
import { userXCAccount } from '@/api/activities.js'

const emit = defineEmits(['update:isGrauantedShow', 'change'])
const props = defineProps({
  isGrauantedShow: {
    type: Boolean,
    required: true
  },

  subItemId: {
    type: [Number, String],
    default: null
  },
  liveRoom: {
    type: [Number, String],
    default: null
  },
  /**
   * 提交成功后 @change 携带的 id（如工单 id）
   */
  changeNotifyId: {
    type: [Number, String],
    default: null
  }
})

const store = useStore()

const isDialog = ref(false)
/** 仅上传截图校验文案，与 el-form 各字段错误相互独立 */
const uploadError = ref('')
const loading = ref(false)
const isSubmitting = ref(false)
const formRef = ref()
const lowestAmount = ref(0)
const uploadRef = ref<{ fileList: any[]; validate: () => Promise<unknown>; isUploading?: boolean }>()

/** getApplyParam 完整响应：表单展示与提交参数均由接口返回（与 H5 一致） */
type ApplyParamResponse = Record<string, any>
const applyParamRes = ref<ApplyParamResponse | null>(null)

/** 是否自定义活动：由 getApplyParam 返回的 sub_type === 1 */
const isCustom = computed(() => {
  const r = applyParamRes.value
  return r != null && (r.sub_type === 1 || r.sub_type === '1')
})
/** 接口/父组件回填的只读展示，不参与提交 */
const previewInfo = reactive({
  game_type: 0,
  game_time: '',
  select_game: '',
  competition_teams: ''
})

const formData = reactive<FormData>({
  account: '',
  order_no: '',
  raise: '',
  detail: ''
})

type ApplyFieldKey = 'account' | 'order_no' | 'raise' | 'detail' | 'files_path'
type ApplySettingItem = { req?: string | number; show?: string | number; text?: string }

/** 自定义活动（sub_type === 1）后台下发的表单与免责配置 */
const applySetting = reactive<Record<string, ApplySettingItem>>({})

function replaceApplySetting(raw: Record<string, ApplySettingItem> | null | undefined) {
  Object.keys(applySetting).forEach((k) => delete applySetting[k])
  if (raw && typeof raw === 'object') {
    Object.assign(applySetting, raw)
  }
}

function fieldCfg(key: ApplyFieldKey) {
  if (!isCustom.value) {
    return {
      show: true,
      req: key === 'detail' ? false : true
    }
  }
  const cfg = applySetting[key]
  if (!cfg) {
    return { show: false, req: false }
  }
  return {
    show: cfg.show === '1' || cfg.show === 1,
    req: cfg.req === '1' || cfg.req === 1
  }
}

/** 自定义活动名称（与 getApplyParam / apply.json 中 name 一致，用于弹窗标题） */
const customActivityName = ref('')

const dialogTitle = computed(() => {
  if (!isCustom.value) return '申请包赔'
  const t =
    (customActivityName.value || '').trim() || String(applyParamRes.value?.name ?? '').trim()
  return t || '超级包赔'
})

const formUi = computed(() => ({
  account: fieldCfg('account'),
  order_no: fieldCfg('order_no'),
  raise: fieldCfg('raise'),
  detail: fieldCfg('detail'),
  files_path: fieldCfg('files_path')
}))

/** 免责文案里的换行转为 <br />，供 v-html 展示（与 H5 一致） */
function normalizeNoticeText(text: string) {
  return String(text ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\n/g, '<br />')
}

const customNoticeHtml = computed(() => {
  if (!isCustom.value) return ''
  const n = applySetting.notice
  if (!n) return ''
  if (!(n.show === '1' || n.show === 1)) return ''
  return normalizeNoticeText(n.text ?? '')
})

/** 与 setting.notice.show == 1 一致：为 true 时 Disclaimer 展示自定义区域（含空文案） */
const customNoticeEnabled = computed(() => {
  if (!isCustom.value) return false
  const n = applySetting.notice
  if (!n) return false
  return n.show === '1' || n.show === 1
})

const showDisclaimerBlock = computed(() => {
  if (!isCustom.value) return true
  const n = applySetting.notice
  if (!n) return false
  return n.show === '1' || n.show === 1
})

const DEFAULT_DETAIL_PLACEHOLDER = '请输入情况说明, 最多200字'

/** 自定义活动下 setting.detail.text 为占位提示，不写入 model 默认值（与 H5 一致） */
const detailPlaceholder = computed(() => {
  if (!isCustom.value || !fieldCfg('detail').show) return DEFAULT_DETAIL_PLACEHOLDER
  const raw = applySetting.detail?.text
  const s = raw == null ? '' : String(raw).trim()
  return s || DEFAULT_DETAIL_PLACEHOLDER
})

/** 上传校验失败等：展示在「上传截图」表单项（与 H5 error-message 一致） */
const uploadFieldError = computed(() => {
  if (!formUi.value.files_path.show) return ''
  return uploadError.value || ''
})

function applyDetailPreset() {
  if (!isCustom.value) return
  formData.detail = ''
}

function minRaiseErrorMessage(min: number) {
  return `不满足活动最低金额${min}元`
}

function validateRaiseValue(_rule: any, value: string, cb: (e?: Error) => void, requireValue: boolean) {
  const regex = /^[0-9]*\.?[0-9]*$/
  const min = lowestAmount.value
  const amount = Number(value)
  if (!value) {
    if (requireValue) cb(new Error('请输入金额'))
    else cb()
    return
  }
  if (!regex.test(value)) {
    cb(new Error('投注金额必须是数字'))
    return
  }
  // 非必填时不做最低金额校验；必填时由表单项下方展示错误（不用 ElMessage）
  if (requireValue && min > 0 && !Number.isNaN(amount) && amount < min) {
    cb(new Error(minRaiseErrorMessage(min)))
    return
  }
  cb()
}

const formRules = computed<FormRules>(() => {
  const rules: FormRules = {}
  const a = fieldCfg('account')
  if (a.show && a.req) {
    rules.account = [
      {
        required: true,
        message: isCustom.value ? '请输入账号名称' : '请输入XC账号',
        trigger: ['blur', 'change']
      }
    ]
  }
  const o = fieldCfg('order_no')
  if (o.show && o.req) {
    rules.order_no = [{ required: true, message: '请输入单号', trigger: ['blur', 'change'] }]
  }
  const r = fieldCfg('raise')
  if (r.show) {
    rules.raise = [
      {
        validator: (_rule, value, cb) => validateRaiseValue(_rule, value, cb, r.req),
        trigger: ['change', 'blur']
      }
    ]
  }
  const d = fieldCfg('detail')
  if (d.show && d.req) {
    rules.detail = [{ required: true, message: '请输入情况说明', trigger: ['blur', 'change'] }]
  }
  return rules
})

// 提交按钮禁用：上传中或文件未全部 success
const isUploadingDown = computed(() => {
  return (
    !!uploadRef.value?.fileList?.length &&
    !uploadRef.value?.fileList.every((f) => f.status === 'success')
  )
})

const isSubmitBlocked = computed(
  () => isSubmitting.value || isUploadingDown.value || !!uploadRef.value?.isUploading
)

const gameTypeMaps = ['', '足球', '篮球'] // 1足球 2 篮球

const getChangeValue = computed(() => {
  return gameTypeMaps[previewInfo.game_type] || previewInfo.game_type
})

const handleRaiseInput = (val: string) => {
  formData.raise = String(val).replace(/\s/g, '').replace(/\D/g, '').slice(0, 9)
}

type NoSpaceField = 'account' | 'order_no' | 'raise' | 'detail'

const handleNoSpaceInput = (field: NoSpaceField, val: string) => {
  formData[field] = String(val).replace(/\s/g, '')
}

const normalizeNoSpaceFields = () => {
  ;(['account', 'order_no', 'raise', 'detail'] as NoSpaceField[]).forEach((field) => {
    handleNoSpaceInput(field, formData[field])
  })
}

function getApplyParamEventId(): number | string | null {
  const id = props.subItemId
  if (id == null || id === '') return null
  return id
}

/** 解析 getApplyParam 的响应体为业务对象（兼容 { code, data } 与扁平结构） */
function unwrapApplyParamPayload(res: any): ApplyParamResponse | null {
  const body = res?.data
  if (!body || typeof body !== 'object') return null
  if ('code' in body && body.code === 0 && body.data != null) {
    return body.data as ApplyParamResponse
  }
  if ('game_type' in body || 'sub_type' in body || 'select_game' in body) {
    return body as ApplyParamResponse
  }
  return null
}

async function validateFormFields(): Promise<boolean> {
  const ref = formRef.value
  if (!ref?.validate) return true
  try {
    await ref.validate()
    return true
  } catch {
    return false
  }
}

async function validateUploadField(): Promise<boolean> {
  const f = fieldCfg('files_path')
  if (!f.show || !f.req || !uploadRef.value?.validate) {
    uploadError.value = ''
    return true
  }
  try {
    await uploadRef.value.validate()
    uploadError.value = ''
    return true
  } catch (e: unknown) {
    uploadError.value =
      typeof e === 'string' ? e : (e as { message?: string })?.message || String(e ?? '')
    return false
  }
}

const handleSure = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    normalizeNoSpaceFields()
    // 最低金额与 getApplyParam 数据在打开弹窗时 getInitParamsFun 已拉取，此处不再重复请求
    const [formOk, uploadOk] = await Promise.all([validateFormFields(), validateUploadField()])
    await nextTick()
    if (!formOk || !uploadOk) {
      isSubmitting.value = false
      return
    }

    const apiRes = applyParamRes.value
    if (!apiRes) {
      ElMessage.warning('活动信息缺失，请重新打开')
      isSubmitting.value = false
      return
    }

    loading.value = true
    const files = uploadRef.value?.fileList || []
    const eventId = apiRes.event_id ?? getApplyParamEventId()

    const liveRoomRaw = props.liveRoom
    const liveRoom =
      liveRoomRaw != null && liveRoomRaw !== ''
        ? liveRoomRaw
        : apiRes.live_room ?? apiRes.live_room_id

    const params: Record<string, any> = {
      files_path: files.map((ele) => ele.url).filter(Boolean).join(','),
      event_id: eventId,
      live_room: liveRoom,
      raise: Number(formData.raise),
      account: formData.account,
      order_no: formData.order_no,
      detail: formData.detail
    }

    const reapplyOrderId =
      apiRes.apply_record_id ??
      apiRes.compensation_order_id ??
      apiRes.compensation_id ??
      apiRes.compensation_record_id ??
      apiRes.record_id

    const idForParams =
      reapplyOrderId != null && reapplyOrderId !== ''
        ? reapplyOrderId
        : props.changeNotifyId != null && props.changeNotifyId !== ''
          ? props.changeNotifyId
          : null
    if (idForParams != null && idForParams !== '') {
      params.id = idForParams
    }

    getCompensationApply(params)
      .then((res: any) => {
        if (res.code === 0) {
          ElMessage.success({ message: res.msg })
          setTimeout(() => {
            loading.value = false
            isSubmitting.value = false
            handleClose()
          }, 500)
          const d = res.data
          const notifyId =
            (d && (d.id ?? d.order_id ?? d.apply_id)) ??
            res.id ??
            res.order_id ??
            res.apply_id ??
            props.changeNotifyId ??
            props.subItemId
          emit('change', notifyId)
        } else {
          loading.value = false
          isSubmitting.value = false
        }
      })
      .catch((error) => {
        console.log(error)
        loading.value = false
        isSubmitting.value = false
      })
  } catch {
    isSubmitting.value = false
    /* 前置异常已在各自逻辑中处理 */
  }
}

const handleClose = () => {
  emit('update:isGrauantedShow', false)
  formRef.value?.resetFields()
  replaceApplySetting(null)
  customActivityName.value = ''
  formData.account = ''
  formData.order_no = ''
  formData.raise = ''
  formData.detail = ''
  Object.assign(previewInfo, {
    game_type: 0,
    game_time: '',
    select_game: '',
    competition_teams: ''
  })
  if (uploadRef.value) {
    uploadRef.value.fileList = []
  }
  uploadError.value = ''
  isSubmitting.value = false
  lowestAmount.value = 0
  applyParamRes.value = null
}

const getUserXCAccount = async () => {
  if (!fieldCfg('account').show) return
  try {
    const { data } = await userXCAccount()
    formData.account = String(data.xing_account ?? '').replace(/\s/g, '')
  } catch (error) {
    console.error(error)
  }
}

const getInitParamsFun = async () => {
  const eventId = getApplyParamEventId()
  if (eventId == null || eventId === '') {
    ElMessage.warning('缺少活动参数')
    applyParamRes.value = null
    return
  }
  try {
    const res: any = await getApplyParam({ event_id: eventId })
    const data = unwrapApplyParamPayload(res)
    if (!data) {
      applyParamRes.value = null
      lowestAmount.value = 0
      return
    }
    applyParamRes.value = data
    const { game_type, game_time, select_game, at_least_raise, competition_teams } = data
    previewInfo.game_type = game_type
    previewInfo.game_time = game_time
    previewInfo.select_game = select_game
    previewInfo.competition_teams = competition_teams
    lowestAmount.value = Number(at_least_raise) || 0

    const custom = data.sub_type === 1 || data.sub_type === '1'
    customActivityName.value =
      custom && data.name != null && String(data.name) !== '' ? String(data.name).trim() : ''

    if (custom && data.setting) {
      replaceApplySetting(data.setting as Record<string, ApplySettingItem>)
      applyDetailPreset()
    } else {
      replaceApplySetting(null)
    }
  } catch {
    applyParamRes.value = null
    lowestAmount.value = 0
  }
}

const isLogin = computed(() => !!store.state.user.infoData.id)

/** 上传已全部成功时清除表单项上的上传错误（与 el-upload status 一致） */
watch(
  () => uploadRef.value?.fileList,
  (list) => {
    if (!list?.length) return
    const ok = list.every((f: { status?: string }) => f.status === 'success' || f.status === 'done')
    if (ok) uploadError.value = ''
  },
  { deep: true }
)

watch(
  () => props.isGrauantedShow,
  (val) => {
    isDialog.value = val
    if (val) {
      getInitParamsFun().then(async () => {
        if (isLogin.value && fieldCfg('account').show) {
          await getUserXCAccount()
        }
        await nextTick()
        formRef.value?.clearValidate()
      })
    }
  }
)

watch(isDialog, () => {
  if (!isDialog.value) {
    formRef.value?.resetFields()
  }
})
</script>
<style scoped lang="scss">
.flex-cloumn {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}
.grananed-content {
  flex: 1;
  padding: 0 24px;
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  ::v-deep(.el-form) {
    .not-emit {
      display: block !important;
      margin-bottom: 18px;
      border-bottom: 1px solid #f2f5fc;
      .el-form-item {
        border-bottom: 0;
        margin-bottom: 8px;
      }
    }
    .el-form-item {
      border-bottom: 1px solid #f2f5fc;
      &:last-child {
        border-bottom: 0;
      }
      .el-form-item__label-wrap {
        margin-right: 0 !important;
      }
      .el-form-item__label {
        font-weight: 400;
        color: #848587;
      }
      &.label-block {
        .el-form-item__label {
          font-size: 500;
          color: #303133;
        }
        &.upload-item {
          flex-direction: column;
        }
      }
    }
    .el-form-item__content {
      .el-textarea .el-textarea__inner,
      .el-input .el-input__wrapper {
        border: none;
        outline: none;
        box-shadow: none;
        padding-left: 0 !important;
      }
      .el-input__inner {
        color: #848587;
      }
    }
  }
}
.title {
  font-size: 17px;
  font-weight: 550;
  padding-bottom: 36px;
  text-align: center;
}
.grananed-close {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
  font-weight: 500;
}
.disclaimer-outer {
  padding: 0 0 8px;
}
.upload-last-group {
  margin-top: 4px;
}
</style>
