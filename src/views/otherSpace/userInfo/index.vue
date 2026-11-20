<template>
  <div class="container">
    <div class="user-content">
      <img class="avatar" :src="otherInfo?.avatar" alt="" />
      <p class="nickname">{{ otherInfo?.user_nickname }}</p>

      <div class="medals">
        <template v-if="otherInfo?.medals?.length">
          <img
            class="medals-item"
            v-for="item in otherInfo.medals?.slice(0, 5)"
            :key="item.id"
            :src="item.image"
            alt=""
          />
        </template>

        <template v-else>
          <div class="no-medals">他还没有勋章</div>
        </template>
      </div>
    </div>

    <user-level :dzInfo="otherInfo" :isOther="true"></user-level>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { getOtherInfoV2 } from '@/api'
import UserLevel from '../../mySpace/userInfo/UserLevel.vue'

const otherInfo = ref({})

onMounted(() => {
  getOtherInfoV2({ uid: history.state.uid }).then(res => otherInfo.value = res.data).catch(res => {
    ElMessage.error(res.msg)
  })
})
</script>
<style scoped lang="scss">
.container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 24px;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 0;
  }

  .user-content {
    padding: 8px 0 24px;
    border-bottom: 1px solid #f1f1f1;
    overflow: hidden;

    .avatar {
      display: block;
      width: 68px;
      height: 68px;
      border-radius: 50%;
      cursor: pointer;
      margin: 0 auto 16px;
      object-fit: cover;
    }

    .nickname {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      text-align: center;
      line-height: 25px;
    }

    .medals {
      width: 100%;
      height: 28px;
      margin-top: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      overflow: hidden;

      &-item {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        overflow: hidden;
      }

      .no-medals {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #999;
        text-align: center;
        cursor: pointer;
        border: 1px dashed #ccc;
        padding: 2px 4px;

        img {
          width: 16px;
          height: 16px;
          margin-left: 3px;
        }
      }
    }

    .change-btn {
      height: 28px;
      line-height: 28px;
      margin: 16px auto 0;
      padding: 0px 8px;
      font-size: 14px;
      width: fit-content;
      color: #333;
      background: #f9fafb;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
