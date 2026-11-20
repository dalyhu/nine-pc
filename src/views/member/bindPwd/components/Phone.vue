<template>
  <el-form ref="formRef" label-position="top" :rules="formRules" :model="formData">
    <el-form-item label="手机号码:" prop="mobile">
      <el-input
        type="tel"
        v-model.number="formData.mobile"
        maxlength="11"
        placeholder="请输入手机号码"
      />
    </el-form-item>
    <el-form-item label="验证码:" prop="code">
      <div class="input-item">
        <el-input
          type="text"
          placeholder="请输入验证码"
          maxlength="6"
          v-model.number="formData.code"
        />

        <el-button
          v-if="countDown === 0"
          @click="sendCode"
          style="width: 128px"
          class="confirm-button"
          type="primary"
          :loading="countLoading"
          >获取验证码</el-button
        >
        <div v-else class="count">{{ countDown }}s</div>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button :loading="loading" @click="submit" type="primary" class="confirm-button"
        >确定</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
// @ts-ignore
import { useStore } from 'vuex'

import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

// @ts-ignore
import { bindMobileService } from '@/api/user.js'

// @ts-ignore
import UserForm from '@/store/models/userFormModel.js'
// @ts-ignore
import { useSendCodeCountDown } from '../../hooks/useSendCodeCountDown'

const emit = defineEmits(['back'])

const formRef = ref<FormInstance>()

interface FormType {
  mobile: string
  code: string
}

const formData = reactive<FormType>({
  mobile: '',
  code: ''
})

const formRules = reactive<FormRules<FormType>>({
  mobile: [
    {
      required: true,
      message: '请输入手机号码',
      trigger: ['blur', 'change']
    }
  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
      trigger: ['blur', 'change']
    }
  ]
})

const store = useStore()

const STORAGE_CODE_KEY = 'storage_bind_mobile'

const codeParams = {
  mobile: formData.mobile,
  type: 12
}

const { getCode, countLoading, countDown } = useSendCodeCountDown(STORAGE_CODE_KEY)

const sendCode = () => {
  formRef.value?.validateField('mobile', (vaild) => {
    if (vaild) {
      getCode({ ...codeParams, mobile: formData.mobile })
    }
  })
}

const loading = ref(false)

const submit = () => {
  formRef.value?.validate((vaild) => {
    if (vaild) {
      loading.value = true

      bindMobileService({
        ...formData,
        mobile: new UserForm({ mobile: formData.mobile }).cryptoMobile
      })
        .then(async () => {
          formRef.value?.resetFields()
          ElMessage.success('绑定成功')
          loading.value = false
          await store.dispatch('updateUserInfo')
          emit('back')
        })
        .catch(() => {
          loading.value = false
        })
    }
  })
}
</script>
<style scoped lang="scss">
:deep(.el-input) {
  flex: 1;

  .el-input__wrapper {
    height: 48px !important;
    box-shadow: none !important;
    background: #f9fafb;
  }
}

.input-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.confirm-button {
  width: 100%;
  height: 48px;
  border-radius: 8px;
}

.count {
  width: 128px;
  height: 48px;
  line-height: 48px;
  text-align: center;
}
</style>
