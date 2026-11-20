<template>
  <div class="container">
    <div class="banner-info">
      <img class="banner" src="/static/images/promotion/banner.jpg" alt="" />
      <div class="copy-info">
        <p class="title">有热闹？一起看！</p>
        <p class="desc">分享链接给好友红包礼金送送送！</p>

        <div class="button" @click="handleCopy">
          <img src="/static/images/promotion/copy.svg" alt="" />
          <span>点我复制链接</span>
        </div>
      </div>
    </div>

    <div class="member-list">
      <div class="member">
        <div class="info">
          <img src="/static/images/promotion/member.svg" alt="" />
          <p class="title">昨日成功邀请</p>
        </div>
        <div class="count">{{ yesterday_count }} 位</div>
      </div>
      <div class="member">
        <div class="info">
          <img src="/static/images/promotion/member.svg" alt="" />
          <p class="title">当月成功邀请</p>
        </div>
        <div class="count">{{ current_month_count }} 位</div>
      </div>
    </div>

    <div class="content">
      <p class="label">邀请好友状态</p>
      <div class="content-header">
        <ul class="tab-list">
          <li class="tab-item" :class="{ active: activeIndex === 0 }" @click="handleActive(0)">
            未激活好友 ({{ inactiveFriends.length }})
          </li>
          <li class="tab-item" :class="{ active: activeIndex === 1 }" @click="handleActive(1)">
            有效好友 ({{ activeFriends.length }})
          </li>
          <li class="tab-item" :class="{ active: activeIndex === 2 }" @click="handleActive(2)">
            VIP ({{ vipFriends.length }})
          </li>
        </ul>

        <div class="flex">
          <div class="pagination flex">
            <span
              class="page-btn prev"
              :class="{ disable: page === 1 || disable }"
              @click="handleClickPage('prev')"
              >上一页</span
            >
            <span class="page">{{ page }}</span>
            <span
              class="page-btn next"
              :class="{ disable: page === Math.ceil(inviteeList.length / 10) || disable }"
              @click="handleClickPage('next')"
              >下一页</span
            >
          </div>

          <img
            class="question"
            @click="showImage = true"
            src="/static/images/promotion/question.svg"
            alt=""
          />
        </div>
        <div class="image" v-if="showImage">
          <img :src="`/static/images/promotion/image${activeIndex + 1}.png`" alt="" />
          <span @click="showImage = false" class="image-close"></span>
        </div>
      </div>

      <div class="content-list">
        <div class="content-item list-header">
          <div>注册日期</div>
          <div>好友昵称</div>
        </div>

        <div
          class="content-item"
          v-for="item in inviteeList.slice(10 * (page - 1), 10 * page)"
          :key="item.id"
        >
          <div>{{ item.created_date }}</div>
          <div>{{ item.user_nickname }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { inviteeListApi } from '@/api/user'
import { useClipboard } from '@vueuse/core'

const store = useStore()

const showImage = ref(false)

const userInfo = computed(() => store.state.user.infoData)

const { copy } = useClipboard()

const handleCopy = () => {
  const origin = window.location.origin
  const url = origin + `?invite_code=${userInfo.value?.invite_code || ''}-12-0`
  copy(url)
  store.dispatch('setInviterLog', { st: 12, s: 0 })
}

const activeIndex = ref(0)
const page = ref(1)

const handleActive = (index) => {
  activeIndex.value = index
  showImage.value = false
  page.value = 1
}

const activeFriends = ref([])
const current_month_count = ref(0)
const yesterday_count = ref(0)
const inactiveFriends = ref([])
const vipFriends = ref([])

const inviteeList = computed(() => {
  switch (activeIndex.value) {
    case 1:
      return activeFriends.value
    case 2:
      return vipFriends.value
    default:
      return inactiveFriends.value
  }
})

const disable = computed(() => inviteeList.value.length <= 10)

const handleClickPage = (type) => {
  if (disable.value) return
  const length = inviteeList.value.length
  if (type === 'prev') {
    if (page.value === 1) return
    page.value--
  } else {
    if (page.value === Math.ceil(length / 10)) return
    page.value++
  }
}

const getInviteeList = async () => {
  try {
    const { data } = await inviteeListApi()
    activeFriends.value = data.active_friends
    current_month_count.value = data.current_month_count
    yesterday_count.value = data.yesterday_count
    inactiveFriends.value = data.inactive_friends
    vipFriends.value = data.vip_friends
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getInviteeList()
})
</script>
<style scoped lang="scss">
.container {
  position: relative;
  padding: 0 16px;
  margin: 0 auto;
  background-color: #fff;
  overflow: hidden;

  .banner-info {
    display: flex;
    padding: 40px 0;
    overflow: hidden;

    .banner {
      display: block;
      width: 514px;
      height: 269px;
      border-radius: 12px;
    }

    .copy-info {
      margin-left: 32px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .title {
        color: #141414;
        line-height: 60px;
        font-size: 48px;
        font-weight: 600;
      }

      .desc {
        font-size: 16px;
        line-height: 24px;
        margin-top: 8px;
        margin-bottom: 32px;
      }

      .button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 48px;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        border-radius: 12px;
        background: linear-gradient(90deg, #ff5f7c, #d02d54);
        overflow: hidden;

        img {
          width: 18px;
          height: 18px;
          margin-right: 7px;
        }
      }
    }
  }

  .member-list {
    padding: 16px 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    .member {
      width: 100%;
      height: 112px;
      padding: 24px;
      color: #141414;
      border-radius: 12px;
      border: 1px solid rgba(233, 80, 87, 0.1);
      box-sizing: border-box;
      background: linear-gradient(180deg, #fff 0%, #fff2f1 100%);
      overflow: hidden;

      .info {
        display: flex;
        margin-bottom: 8px;
        img {
          width: 24px;
          height: 24px;
          margin-right: 16px;
        }

        .title {
          font-size: 16px;
          font-weight: 500;
        }
      }

      .count {
        font-size: 24px;
        font-weight: bold;
        line-height: 30px;
      }
    }
  }

  .content {
    margin: 20px 0 12px;

    .label {
      font-size: 22px;
      font-weight: bold;
      color: #141414;
      line-height: 28px;
    }

    .content-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .question {
        cursor: pointer;
      }

      .image {
        position: absolute;
        bottom: 70%;
        right: 0;
        overflow: hidden;

        img {
          display: block;
          width: 379px;
        }

        .image-close {
          position: absolute;
          width: 20px;
          height: 20px;
          top: 28px;
          right: 15px;
          border-radius: 50%;
          cursor: pointer;
        }
      }
    }

    .tab-list {
      display: flex;
      align-items: center;
      height: 54px;
      border-bottom: 1px solid rgba(233, 80, 87, 0.1);

      .tab-item {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
        color: #141414;
        line-height: 22px;
        cursor: pointer;
        height: 100%;
        margin-right: 32px;
        border-bottom: 3px solid #e5e8eb;

        &.active {
          border-color: #d02d54;
        }
      }
    }

    .content-list {
      width: 100%;
      margin-top: 26px;

      // .scroll {
      //   height: 600px;
      //   padding-bottom: 20px;
      //   overflow-y: scroll;
      // }
      .content-item {
        margin-bottom: 26px;
        display: flex;
        align-items: center;
        height: 45px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        color: #141414;
        padding: 0 16px;
        border: 1px solid rgba(233, 80, 87, 0.1);

        & > div {
          flex: 1;
        }

        &.list-header {
          background: linear-gradient(180deg, #fff 0%, #fff2f1 100%);
        }
      }
    }
  }
}

.pagination {
  height: 28px;
  margin-right: 24px;
  color: #999;
  text-align: center;

  .page-btn {
    width: 66px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #fbebef;
    border-radius: 28px;
    font-size: 14px;
    cursor: pointer;
    color: #333;

    &.disable {
      color: #999;
      cursor: not-allowed;
    }
  }

  .page {
    font-size: 12px;
    width: 30px;
  }
}
</style>
