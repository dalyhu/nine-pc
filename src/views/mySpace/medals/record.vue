<template>
  <div class="record-container">
    <div class="banner">
      <div class="back" @click="back">
        <img src="/static/images/spaceAndMine/back-left.svg" alt="" />
        返回
      </div>
    </div>

    <div class="medal-list">
      <div class="medal" v-for="item in applyMedals" :key="item.name" @click="handleClick(item)">
        <div class="left">
          <img class="image" :src="item.image" alt="" />
          <div class="desc">
            <p class="title">{{ item.name }}</p>
            <p class="sub-title">{{ item.description }}</p>
          </div>
        </div>

        <div class="status">{{ item.status ? '已经拥有' : '尚未拥有' }}</div>
      </div>
    </div>
  </div>

  <div v-if="showCheckItem" class="view-modal stop-colse">
    <img
      class="close stop-colse"
      src="/static/images/spaceAndMine/close_level.svg"
      @click="showCheckItem = false"
    />

    <img class="view-modal__image stop-colse" :src="checkViewItem.big_image" alt="" />

    <p class="view-modal__name stop-colse">{{ checkViewItem.name }}</p>
    <p class="view-modal__desc stop-colse">{{ checkViewItem.description }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { getApplyMedalsApi } from '@/api'

const router = useRouter()
const back = () => {
  router.back()
}

const applyMedals = ref([])

const getApplyMedals = async () => {
  const res = await getApplyMedalsApi()

  applyMedals.value = res.data
}

const checkViewItem = ref()
const showCheckItem = ref(false)

const handleClick = (item) => {
  checkViewItem.value = item
  showCheckItem.value = true
}

const eventFn = (event) => {
  let {className} = event.target
  let targetNode = !className.split(' ').includes('stop-colse')
  if (showCheckItem.value && targetNode) showCheckItem.value = false
}

onMounted(() => {
  getApplyMedals()
  window.addEventListener('click', eventFn, {capture: true})
})

onDeactivated(() => {
  window.removeEventListener('click', eventFn, {capture: true})
})
</script>
<style scoped lang="scss">
.record-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .banner {
    width: 100%;
    height: 197px;
    background: url('/static/images/spaceAndMine/medal_record_banner.webp') no-repeat center / 100%
      100%;
    overflow: hidden;

    .back {
      display: flex;
      font-size: 18px;
      color: #333;
      height: 70px;
      padding: 0 16px;
      line-height: 24px;
      align-items: center;
      cursor: pointer;

      img {
        width: 24px;
        height: 24px;
      }
    }
  }

  .medal-list {
    width: 100%;
    padding: 0 24px;
    height: calc(100% - 197px);
    overflow-y: scroll;

    .medal {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      cursor: pointer;
      border-bottom: 1px solid #f1f1f1;

      &:last-child {
        border-bottom: none;
      }

      .left {
        display: flex;

        .image {
          width: 48px;
          height: 48px;
          margin-right: 16px;
        }

        .desc {
          display: flex;
          gap: 8px;
          flex-direction: column;

          .title {
            font-size: 18px;
            color: #333;
            font-weight: bold;
          }

          .sub-title {
            font-size: 16px;
            color: #666;
          }
        }
      }

      .status {
        border-radius: 35px;
        padding: 8px 16px;
        color: #999;
        background: #f1f1f1;
      }
    }
  }
}

.view-modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 32px 16px;
  margin: auto;
  width: 476px;
  height: 475px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 16px 0 #0000001a;
  overflow: hidden;
  z-index: 99;

  .close {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  &__image {
    width: 248px;
    height: 248px;
    margin-bottom: 16px;
  }

  &__name {
    font-size: 18px;
    font-weight: bold;
    line-height: 25px;
    margin-bottom: 8px;
  }

  &__desc {
    font-size: 14px;
    line-height: 18px;
    word-break: break-all;
  }
}
</style>
