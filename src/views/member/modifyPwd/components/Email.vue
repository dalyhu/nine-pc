<template>
  <el-form ref="formRef" label-position="top" :rules="formRules" :model="formData">
    <el-form-item label="邮箱地址:">
      <el-input type="text" :value="formData.mail" readonly />
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
          :loading="countLoading"
          class="confirm-button"
          type="primary"
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
import { computed, reactive, ref } from 'vue'
// @ts-ignore
import { useStore } from 'vuex'

import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

// @ts-ignore
import { mailCryptoNewForgotPassword } from '@/api/user.js'
// @ts-ignore
import UserForm from '@/store/models/userFormModel.js'
// @ts-ignore
import { useSendCodeCountDown } from '../../hooks/useSendCodeCountDown'

const formRef = ref<FormInstance>()

const emit = defineEmits(['back'])

interface FormType {
  mail: string
  code: string
  password: string
}

const store = useStore()

const infos = computed(() => store.state.user.infoData)

const formData = reactive<FormType>({
  mail: infos.value.user_email,
  code: '',
  password: ''
})

const formRules = reactive<FormRules<FormType>>({
  code: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'change'
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

const STORAGE_CODE_KEY = 'storage_change_mail'

const codeParams = {
  mail: formData.mail,
  type: 2
}

const { getCode, countLoading, countDown } = useSendCodeCountDown(STORAGE_CODE_KEY)

const sendCode = () => {
  formRef.value?.validateField('mail', (vaild) => {
    if (vaild) {
      getCode(codeParams)
    }
  })
}

// 邮箱重置密码
const paymentPassword = () => {
  formRef.value?.validate((vaild) => {
    if (vaild) {
      const params = {
        mail: infos.value.user_email,
        code: formData.code,
        password: formData.password
      }
      const currForm = new UserForm(params).mailNewForgotPassForm
      mailCryptoNewForgotPassword(currForm).then(() => {
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
