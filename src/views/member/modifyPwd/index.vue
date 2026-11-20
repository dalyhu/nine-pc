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
        <p class="title">修改密码</p>
        <div v-if="infos.mobile" class="item" @click="handleClick(ModifyStep.Phone)">
          <img src="./images/message.png" alt="" />
          <p>短信验证</p>
        </div>
        <div v-if="infos.user_email" class="item" @click="handleClick(ModifyStep.Email)">
          <img src="./images/email.png" alt="" />
          <p>邮箱验证</p>
        </div>
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
// @ts-ignore
import { ModifyStep } from '@/enums/ModifyPwdStep'

// @ts-ignore
import Email from './components/Email.vue'
// @ts-ignore
import Phone from './components/Phone.vue'

// @ts-ignore
import { useStore } from 'vuex'

const store = useStore()

const infos = computed(() => store.state.user.infoData)

const showStep = ref(ModifyStep.Home)

const handleClick = (step: ModifyStep) => {
  showStep.value = step
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
      }
    }
  }
}
</style>
