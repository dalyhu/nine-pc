<template>
  <div class="profile-container">
    <div class="back" @click="back">
      <img src="/static/images/spaceAndMine/back-left.svg" alt="" />
      返回
    </div>

    <div class="content">
      <div class="title">修改昵称头像</div>

      <div class="avatar-info" @click="handleClickAvatarItem">
        <div class="label">头像</div>

        <div class="right">
          <template v-if="pendingUrl">
            <span class="mask">审核中</span>
            <img class="avatar" :src="pendingUrl" alt="" />
          </template>
          <img class="avatar" :src="userInfo?.avatar" alt="" />
          <img class="arrow" src="/static/images/spaceAndMine/back-left.svg" alt="" />
        </div>
      </div>

      <div class="avatar-info" @click="handleClickNickNameItem">
        <div class="label">昵称</div>

        <div class="right">
          <span class="nickname">{{ userInfo?.user_nickname }}</span>
          <img class="arrow" src="/static/images/spaceAndMine/back-left.svg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getAvatarAuditUrlApi } from '@/api'

const store = useStore()

const userInfo = computed(() => store.state.user.infoData)

const router = useRouter()
const back = () => {
  router.back()
}

const pendingUrl = ref('')

const getUserAvatarStatus = async () => {
  const res = await getAvatarAuditUrlApi()
  if (res.data.url) {
    pendingUrl.value = res.data.url
  }
}

const handleClickAvatarItem = () => {
  router.push('/mySpace/profile/avatar')
}
const handleClickNickNameItem = () => {
  router.push('/mySpace/profile/nickname')
}

onMounted(() => {
  getUserAvatarStatus()
})
</script>
<style scoped lang="scss">
.profile-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .back {
    display: flex;
    font-size: 18px;
    color: #333;
    padding: 0 16px;
    height: 70px;
    line-height: 24px;
    align-items: center;
    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
    }
  }

  .content {
    width: 676px;
    margin: 80px auto;
    overflow: hidden;

    .title {
      font-size: 18px;
      font-weight: bold;
      color: #3f3f3f;
    }

    .label {
      font-size: 16px;
      color: #111827;
      line-height: 24px;
    }

    .avatar-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px;
      width: 100%;
      cursor: pointer;
      margin-top: 24px;
      border: 1px solid #e6e7e8;
      border-radius: 8px;
      font-weight: bold;

      .right {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;

        .mask {
          position: absolute;
          top: 0;
          left: 0;
          font-size: 10px;
          width: 40px;
          height: 40px;
          line-height: 40px;
          border-radius: 50%;
          color: #fff;
          text-align: center;
          background: rgba(0, 0, 0, 0.5);
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .arrow {
          width: 24px;
          height: 24px;
          transform: scaleX(-1);
        }

        .nickname {
          font-size: 16px;
          color: #333;
          line-height: 24px;
        }
      }
    }
  }
}
</style>
