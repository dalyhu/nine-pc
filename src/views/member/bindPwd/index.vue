<template>
  <div class="container">
    <!-- 是两个标签 -->
    <!-- 短信验证 -->
    <!-- 邮箱验证 -->
    <div class="content">
      <p
        v-if="showStep !== ModifyStep.Home"
        class="back title"
        @click="handleClick(ModifyStep.Home)"
      >
        <el-icon :size="16">
          <ArrowLeftBold />
        </el-icon>
        <span style="margin-left: 10px">返回</span>
      </p>
      <template v-if="showStep === ModifyStep.Home">
        <p class="title">绑定账号</p>
        <div class="item" @click="handleClick(ModifyStep.Phone)">
          <img src="./images/message.png" alt="" />
          <p style="flex: 1">手机绑定</p>
          <img class="ok" v-if="infos.mobile" src="./images/ok.svg" alt="" />
        </div>
        <div class="item" @click="handleClick(ModifyStep.Email)">
          <img src="./images/email.png" alt="" />
          <p style="flex: 1">邮箱绑定</p>
          <span>{{ infos.user_email }} </span>
          <img class="ok" v-if="infos.user_email" src="./images/ok.svg" alt="" />
        </div>

        <p v-if="infos.id" class="desc-text" @click="helpBindAccountApi">
          <img src="./images/chat.svg" alt="" />
          绑定账号有问题需要协助
        </p>
      </template>

      <template v-if="showStep === ModifyStep.Phone">
        <Phone @back="handleClick(ModifyStep.Home)" />
      </template>
      <template v-if="showStep === ModifyStep.Email">
        <Email @back="handleClick(ModifyStep.Home)" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { ModifyStep } from '@/enums/ModifyPwdStep'
// @ts-ignore
import { useStore } from 'vuex'

import mittBus from '@/utils/mittBus'
// @ts-ignore
import { helpBindAccount } from '@/api/activities.js'

const store = useStore()

const infos = computed(() => store.state.user.infoData)
// @ts-ignore
import Email from './components/Email.vue'
// @ts-ignore
import Phone from './components/Phone.vue'
import { ElMessage } from 'element-plus'

const showStep = ref(ModifyStep.Home)

const handleClick = (step: ModifyStep) => {
  if (step === ModifyStep.Phone && infos.value.mobile) {
    return
  }

  if (step === ModifyStep.Email && infos.value.user_email) {
    return
  }
  showStep.value = step
}

async function helpBindAccountApi() {
  let res = await helpBindAccount({ type: 2 })
  if (res?.code === 0) {
    ElMessage.success('发送成功')
    mittBus.emit('mycenter', { data: { ...res.data, room_type: 2, is_online: 1 }, type: 7 })
  }
}
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 500px;

  .content {
    width: 450px;
    margin: 0 auto;
    overflow: hidden;

    .title {
      font-size: 18px;
      margin-bottom: 20px;
    }

    .desc-text {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #606266;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
    }

    .back {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .item {
      display: flex;
      align-items: center;
      gap: 16px;
      height: 76px;
      padding: 18px;
      cursor: pointer;
      border: 1px solid #eee;
      border-radius: 8px;
      margin-bottom: 18px;

      &:hover {
        background-color: #f5f5f5;
      }

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;

        &.ok {
          width: 20px;
          height: 20px;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
