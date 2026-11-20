<template>
  <el-form ref="formRef" label-position="top" :rules="formRules" :model="formData">
    <el-form-item label="邮箱地址:" prop="mail">
      <el-input type="email" v-model="formData.mail" placeholder="请输入邮箱地址" />
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
import { bindMailService } from '@/api/user.js'

// @ts-ignore
import UserForm from '@/store/models/userFormModel.js'

// @ts-ignore
import { useSendCodeCountDown } from '../../hooks/useSendCodeCountDown'

const formRef = ref<FormInstance>()

interface FormType {
  mail: string
  code: string
}

const emit = defineEmits(['back'])

const formData = reactive<FormType>({
  mail: '',
  code: ''
})

const formRules = reactive<FormRules<FormType>>({
  mail: [
    {
      required: true,
      message: '请输入邮箱地址',
      trigger: ['blur', 'change']
    },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
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

const STORAGE_CODE_KEY = 'storage_bind_mail'

const codeParams = {
  mail: '',
  type: 12
}

const { getCode, countLoading, countDown } = useSendCodeCountDown(STORAGE_CODE_KEY)

const sendCode = () => {
  formRef.value?.validateField('mail', (vaild) => {
    if (vaild) {
      getCode({ ...codeParams, mail: formData.mail })
    }
  })
}

const loading = ref(false)

const submit = () => {
  formRef.value?.validate((vaild) => {
    if (vaild) {
      loading.value = true
      const data = {
        mail: new UserForm({ mail: formData.mail }).sendNewMailCodeForm.mail,
        code: formData.code
      }
      bindMailService(data)
        .then(async () => {
          loading.value = false
          formRef.value?.resetFields()
          ElMessage.success('绑定成功')
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
