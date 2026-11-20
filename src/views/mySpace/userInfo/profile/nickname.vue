<template>
  <div class="nickname-container">
    <div class="back" @click="back">
      <img src="/static/images/spaceAndMine/back-left.svg" alt="" />
      返回
    </div>

    <div class="tip">
      <img src="/static/images/home/bell.png" alt="" />
      <span
        >为保护您的隐私与资金安全，请不要使用QQ号/手机号/姓名等直接作为昵称，避免受到网络欺诈骚扰！</span
      >
    </div>

    <div class="content">
      <p class="label">昵称：</p>
      <div class="input-box">
        <input
          class="input"
          type="text"
          v-model.trim="nickname"
          maxlength="10"
          placeholder="请输入4-10个字的新昵称"
          @blur="onBlur"
          @focus="showErrorMessage = false"
        />
        <div v-if="showErrorMessage" class="error-message">
          <p v-if="nickname.length < 4 || nickname.length > 10">请输入4-10个字的新昵称</p>
          <p v-else-if="!/^[\u4E00-\u9FA5a-zA-Z0-9]+$/.test(nickname)">限制输入中文、英文、数字</p>
          <p v-else-if="!/^(?:[^0-9]*[0-9]){0,4}[^0-9]*$/.test(nickname)">限制数字4位</p>
        </div>
      </div>
      <div class="submit" :class="{ disabled }" @click="handleSubmit">提交</div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { updateNicknameApi } from '@/api'

const store = useStore()

const userInfo = computed(() => store.state.user.infoData)

const pattern = /^(?=(?:[^0-9]*[0-9]){0,4}[^0-9]*$)[\u4E00-\u9FA5a-zA-Z0-9]{4,10}$/

const nickname = ref(userInfo.value.user_nickname)

const router = useRouter()
const back = () => {
  router.back()
}

const showErrorMessage = ref(false)

const disabled = computed(() => {
  return nickname.value === userInfo.value?.user_nickname || !pattern.test(nickname.value)
})

const onBlur = () => {
  if (nickname.value && !pattern.test(nickname.value)) {
    showErrorMessage.value = true
  } else {
    showErrorMessage.value = false
  }
}

const handleSubmit = async () => {
  if (nickname.value && !pattern.test(nickname.value)) {
    showErrorMessage.value = true
    ElMessage.error('请检查昵称')
    return
  }
  try {
    await updateNicknameApi({ user_nickname: nickname.value })
    store.dispatch('updateUserInfo')
    ElMessage.success('更新成功')
    router.back()
  } catch (err) {
    ElMessage.error(err.msg)
  }
}
</script>
<style scoped lang="scss">
.nickname-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 24px;
  overflow: hidden;

  .back {
    display: flex;
    font-size: 18px;
    color: #333;
    height: 70px;
    line-height: 24px;
    align-items: center;
    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
    }
  }

  .tip {
    position: absolute;
    top: 57px;
    left: 0;
    right: 0;
    display: flex;
    color: #333;
    height: 56px;
    align-items: center;
    font-size: 12px;
    gap: 8px;
    margin-top: 16px;
    background-color: #fcf9f6;
    padding-left: 24px;

    img {
      width: 24px;
      height: 24px;
    }
  }

  .content {
    margin-top: 104px;
    overflow: hidden;

    .label {
      font-size: 16px;
      padding-left: 16px;
      color: #666;
      line-height: 20px;
    }

    .input-box {
      position: relative;
      width: 100%;
      padding: 16px 0 24px;

      .error-message {
        position: absolute;
        left: 0;
        bottom: 0;
        display: flex;
        padding-left: 16px;

        p {
          font-size: 12px;
          color: #e62020;
          line-height: 20px;
        }
      }
    }

    .input {
      display: block;
      width: 100%;
      height: 48px;
      line-height: 48px;
      padding-left: 16px;
      color: #333;
      background-color: #f9fafb;
      border: 1px solid #e5e7e8;
      border-radius: 8px;
    }

    .submit {
      width: 64px;
      line-height: 38px;
      text-align: center;
      cursor: pointer;
      color: #fff;
      border-radius: 8px;
      background: #d02d54;

      &.disabled {
        background: #999;
        pointer-events: none;
        cursor: no-drop;
      }
    }
  }
}
</style>
