<template>
  <div class="df_form">
    <el-form ref="formRef" :inline="false" :rules="rules" :model="ruleForm" :label-width="200">
      <el-form-item label="输入体育站的帐号：" prop="xcAccount">
        <el-input
          :disabled="!!(Object.values(ruleForm).length > 1 && ruleForm?.xing_account)"
          placeholder="请输入您在体育站帐号"
          :maxlength="12"
          v-model="ruleForm.xcAccount"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <p v-if="Object.values(ruleForm).length > 1 && ruleForm?.xing_account">
          账号已绑定，有问题请点下面按钮
        </p>
        <p v-else>
          ※请注意若账号输入错误，无法取得彩金奖励 <br />
          若输入错误想改绑账号，请咨询小助理
        </p>
        <span
          v-if="Object.values(ruleForm).length > 1 && ruleForm?.xing_account"
          class="span_button"
          @click="helpBindAccountApi"
          >绑定账号有问题需要协助</span
        >
        <span v-else class="span_button" @click="handleSubmit">确认保存</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="dfForm" lang="ts">
import { useStore } from 'vuex'
import mittBus from '@/utils/mittBus'
import { FormInstance, FormRules } from 'element-plus'
import { userXCAccount, bindAccount, helpBindAccount } from '@/api/activities.js'

const store = useStore()

const userInfo = computed(() => store.state.user.infoData)
const formRef = ref<FormInstance>()
const ruleForm = ref({
  xcAccount: '',
  xing_account: ''
})

function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) bindAccountApi()
  })
}

async function helpBindAccountApi() {
  let res = await helpBindAccount()
  if (res?.code === 0) {
    ElMessage.success('发送成功')
    mittBus.emit('mycenter', { data: { ...res.data, room_type: 2, is_online: 1 }, type: 6 })
  }
}

async function bindAccountApi() {
  const { data = {} } = await bindAccount({ xing: ruleForm.value.xcAccount })
  console.log('data', data)
  ElMessage.success('绑定成功')
  xcAccountApi()
}

async function xcAccountApi() {
  const { data = [] } = await userXCAccount()
  if (data.length === 0) return
  ruleForm.value = {
    ...data,
    xcAccount: data.xing_account
  }
}

// 账号
// function validateAccount(rule, value, callback) {
//   const accountRegex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
//   if (value === '') {
//     callback(new Error('账号不能为空'))
//   } else if (!accountRegex.test(value)) {
//     callback(new Error('请输入由字母和数字组成的6-12为字符'))
//   } else {
//     callback()
//   }
// }
function validateAccount(rule, value, callback) {
  if (value === '') {
    callback(new Error('账号不能为空'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  xcAccount: [
    {
      required: true,
      validator: validateAccount,
      type: 'string'
    }
  ]
})
onMounted(() => {
  if (!userInfo.value.id) return
  xcAccountApi()
})
</script>

<style lang="scss">
.df_form {
  padding-top: 20px;
  padding-left: 40px;

  .el-form {
    .el-form-item {
      width: 500px;
      margin-right: 0px;
      margin-bottom: 12px;
      p {
        line-height: 20px;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        margin-bottom: 20px;
      }
      .el-form-item__label {
        height: 40px;
        line-height: 40px;
        padding-right: 0px;
      }
      .el-input {
        .el-input__wrapper {
          border-radius: 0px;
          &:hover {
            box-shadow: 0 0 0 1px #e6c891 inset !important;
          }
        }
        .el-input__inner {
          height: 40px !important;
        }
        .is-focus {
          box-shadow: 0 0 0 1px #e6c891 inset !important;
        }
      }
      .span_button {
        font-size: 14px;
        text-align: center;
        font-weight: 500;
        padding: 3px 61px;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        color: #fff;
        background-image: linear-gradient(106deg, #eecfb5, #d8ad66);
        &:hover {
          box-shadow: 0 2px 6px 2px hsla(38, 75%, 81%, 0.55);
          background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)),
            linear-gradient(106deg, #eecfb5, #d8ad66);
        }
      }
    }
  }
}
</style>
