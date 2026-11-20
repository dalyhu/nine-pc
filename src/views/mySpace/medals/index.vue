<template>
  <div class="medal-container">
    <div class="back">
      <div class="left" @click="back">
        <img src="/static/images/spaceAndMine/back-left.svg" alt="" />
        <span>返回</span>
      </div>

      <div class="get-btn" @click="getMedals">获取勋章</div>
    </div>

    <div class="content">
      <Error v-if="isError" />

      <tabs
        v-else
        :tabs-list="tabData"
        v-model="tabKey"
        :empty="{
          show: !medalList.length,
          icon: '/static/images/spaceAndMine/emptyMedal.png',
          des: ['暂无勋章', '您目前还没有勋章唷！']
        }"
      >
        <div class="medal-list" v-if="medalList.length > 0">
          <div class="medal-item" v-for="item in medalList" :key="item" @click="viewMedal(item)">
            <img :src="item.image" alt="" />
            <p class="title">{{ item.name }}</p>

            <div class="time">
              <span>获得 {{ formatDateLine(item.dateline, 'YYYY-MM-DD') }}</span>
              <span
                >到期
                {{
                  item.expiration == 0 ? '永久' : formatDateLine(item.expiration, 'YYYY-MM-DD')
                }}</span
              >
            </div>
          </div>
        </div>
      </tabs>
    </div>
  </div>

  <div v-if="showCheckItem" class="view-modal stop-colse">
    <img
      class="close stop-colse"
      src="/static/images/spaceAndMine/close_level.svg"
      @click="showCheckItem = false"
    />

    <img class="view-modal__image stop-colse" :src="checkViewItem.image" alt="" />

    <p class="view-modal__name stop-colse">{{ checkViewItem.name }}</p>
    <p class="view-modal__desc stop-colse">{{ checkViewItem.description }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { getMemberMedalsApi } from '@/api'
import { formatDateLine } from '@/utils/common'
import Tabs from '../component/tabs.vue'
import Error from '../component/Error.vue'

const tabKey = ref(0)

const tabData = [
  { name: '现存勋章', key: 0 },
  { name: '过期勋章', key: 1 }
]

const router = useRouter()
const back = () => {
  router.back()
}

const medalList = ref([])
const isError = ref(false)

const getMemberMedals = async () => {
  try {
    const res = await getMemberMedalsApi({
      isExpire: tabKey.value,
      page: 1,
      pageSize: 100
    })
    medalList.value = res.data.list
    isError.value = false
  } catch (error) {
    console.error(error)
    medalList.value = []
    isError.value = true
  }
}

const getMedals = () => {
  router.push('/mySpace/medal-record')
}

const showCheckItem = ref(false)
const checkViewItem = ref()

const viewMedal = (item) => {
  if (showCheckItem.value) return false
  checkViewItem.value = item
  showCheckItem.value = true
}

watch(tabKey, () => {
  getMemberMedals()
})

const eventFn = (event) => {
  let {className} = event.target
  let targetNode = !className.split(' ').includes('stop-colse')
  if (showCheckItem.value && targetNode) showCheckItem.value = false
}

onMounted(() => {
  getMemberMedals()
  window.addEventListener('click', eventFn, {capture: true})
})

onDeactivated(() => {
  window.removeEventListener('click', eventFn, {capture: true})
})
</script>
<style scoped lang="scss">
.medal-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .back {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 70px;

    .left {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 38px;
      line-height: 24px;
      color: #333;
      cursor: pointer;

      img {
        width: 24px;
        height: 24px;
      }
    }

    .get-btn {
      width: 96px;
      height: 38px;
      font-size: 16px;
      text-align: center;
      line-height: 38px;
      border: 1px solid #333;
      border-radius: 8px;
      cursor: pointer;
    }
  }

  .content {
    overflow: hidden;

    :deep(.tabs) {
      display: flex;
      justify-content: center;
    }

    .medal-list {
      display: grid;
      gap: 24px;
      grid-template-columns: repeat(4, 1fr);
      height: 500px;
      overflow-y: scroll;
      padding: 0 24px;

      .medal-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid #e6e7eb;
        border-radius: 8px;
        gap: 8px;
        // padding: 3216px;
        height: 230px;
        cursor: pointer;
        overflow: hidden;

        img {
          width: 120px;
          height: 120px;
        }

        .title {
          font-size: 18px;
          font-weight: bold;
          line-height: 25px;
        }

        .time {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          color: #666;
          line-height: 18px;
        }
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
