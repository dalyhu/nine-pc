<template>
  <el-form ref="formRef" label-position="top" :rules="formRules" :model="formData">
    <el-form-item label="手机号码:">
      <el-input type="tel" :value="formData.mobile" readonly />
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
    <el-form-item label="登陆密码:" prop="password">
      <el-input
        type="password"
        show-password
        placeholder="请设置登录密码(6-18位字母数字)"
        v-model="formData.password"
      />
    </el-form-item>
    <el-form-item>
      <el-button @click="paymentPassword" type="primary" class="confirm-button">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
// @ts-ignore
import { useStore } from 'vuex'

import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

// @ts-ignore
import { cryptoForgotPassword } from '@/api/user.js'

// @ts-ignore
import UserForm from '@/store/models/userFormModel.js'

// @ts-ignore
import { useSendCodeCountDown } from '../../hooks/useSendCodeCountDown'

const formRef = ref<FormInstance>()

interface FormType {
  mobile: string
  code: string
  password: string
}
const store = useStore()

const emit = defineEmits(['back'])

const infos = computed(() => store.state.user.infoData)

const formData = reactive<FormType>({
  mobile: infos.value.mobile.split('-')[1],
  code: '',
  password: ''
})

const formRules = reactive<FormRules<FormType>>({
  code: [
    {
      required: true,
      message: '请输入验证码',
      trigger: ['blur', 'change']
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['blur', 'change']
    }
  ]
})

const STORAGE_CODE_KEY = 'storage_change_phone'

const codeParams = {
  mobile: formData.mobile,
  type: 2
}

const { getCode, countLoading, countDown } = useSendCodeCountDown(STORAGE_CODE_KEY)

const sendCode = () => {
  formRef.value?.validateField('mobile', (vaild) => {
    if (vaild) {
      getCode(codeParams)
    }
  })
}

const paymentPassword = () => {
  formRef.value?.validate((vaild) => {
    if (vaild) {
      const currForm = new UserForm({ ...formData, countryCode: infos.value.mobile.split('-')[0] })
        .PhoneForgotPassForm
      cryptoForgotPassword(currForm).then(() => {
        formRef.value?.resetFields()
        ElMessage.success('修改成功')
        emit('back')
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
