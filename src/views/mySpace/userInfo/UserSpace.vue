<template>
  <div class="container">
    <div class="user-content">
      <template v-if="isLogin">
        <img class="avatar" :src="userInfo?.avatar" alt="" />
        <p class="nickname">{{ userInfo?.user_nickname }}</p>

        <div class="medals" @click="goToMedal">
          <template v-if="dzInfo?.medals?.length">
            <img
              class="medals-item"
              v-for="item in dzInfo.medals?.slice(0, 5)"
              :key="item.id"
              :src="item.image"
              alt=""
            />
          </template>

          <template v-else>
            <div class="no-medals">
              你还没有勋章，去获取
              <img src="/static/images/spaceAndMine/modal_share.svg" alt="" srcset="" />
            </div>
          </template>
        </div>

        <div class="change-btn" @click="handleProfile">点击修改昵称头像</div>
      </template>
      <template v-else>
        <img class="avatar" src="/static/images/spaceAndMine/visit_avatar.png" alt="" />
        <p class="nickname">{{ '游客' + touristsId }}</p>

        <div class="change-btn" @click="login">戳我登录</div>
      </template>
    </div>

    <user-level :dzInfo="dzInfo" :isError="isError"></user-level>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getDzInfoService } from '@/api/user'
import UserLevel from './UserLevel.vue'

const store = useStore()

const userInfo = computed(() => store.state.user.infoData)

const isLogin = computed(() => !!userInfo.value.id)

const touristsId = computed(() => store.state.visitorInfo.id)

const dzInfo = ref({})

const router = useRouter()
const handleProfile = () => {
  router.push('/mySpace/profile')
}

const login = () => {
  store.commit('user/SET_LOGIN_MASK', true)
}

const goToMedal = () => {
  router.push('/mySpace/medal')
}


const isError = ref(false)
const getDzInfo = async () => {
  try {
    const res = await getDzInfoService()
    store.commit('setUid', res.data.dz_uid || '')
    dzInfo.value = res.data
    isError.value = false
  } catch (error) {
    console.error(error)
    isError.value = true
  }
}

onMounted(() => {
  if (isLogin.value) {
    getDzInfo()
  }
})

// 游客态在本页登录成功后，补拉一次 dzInfo，避免必须手动刷新
watch(isLogin, (loggedIn) => {
  if (loggedIn) {
    getDzInfo()
  }
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
