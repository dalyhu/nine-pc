<template>
  <div class="level-container">
    <Error v-if="isError" />

    <template v-else>
    <div class="level-list" v-for="item in dataList" :key="item.level">
      <p class="title">{{ item.name }}</p>

      <div class="level-content">
        <div class="level-item" v-for="level in item.data" :key="level.stars" @click="viewMedal(level)">
          <img :src="level.icon" alt="" />
          <p class="name">Lv{{ level.stars }} {{ level.grouptitle }}</p>
          <p class="desc">查看等级权益</p>
        </div>
      </div>
    </div>
    </template>
  </div>

  <div v-if="showCheckItem" class="view-modal stop-colse">
    <img
      class="close stop-colse"
      src="/static/images/spaceAndMine/close_level.svg"
      @click="showCheckItem = false"
    />

    <img class="view-modal__image stop-colse" :src="checkViewItem.icon" alt="" />

    <p class="view-modal__name stop-colse">Lv{{ checkViewItem.stars }} {{ checkViewItem.grouptitle }}</p>
    <p class="view-modal__desc stop-colse">{{ checkViewItem.desc }}</p>
  </div>
</template>

<script setup>
import { getMemberGroupsApi } from '@/api'
import Error from '../component/Error.vue'

const showCheckItem = ref(false)
const checkViewItem = ref()

const viewMedal = (item) => {
  if (showCheckItem.value) return false
  checkViewItem.value = item
  showCheckItem.value = true
}

const dataList = ref([])

const isError = ref(false)

const getMemberGroups = async () => {
  try {
    const res = await getMemberGroupsApi()
    dataList.value = res.data.list
    isError.value = false
  } catch (error) {
    console.error(error)
    dataList.value = []
    isError.value = true
  }
}

const eventFn = (event) => {
  let {className} = event.target
  let targetNode = !className.split(' ').includes('stop-colse')
  if (showCheckItem.value && targetNode) showCheckItem.value = false
}

onMounted(() => {
  getMemberGroups()
  window.addEventListener('click', eventFn, {capture: true})
})

onDeactivated(() => {
  window.removeEventListener('click', eventFn, {capture: true})
})
</script>
<style scoped lang="scss">
.level-container {
  width: 100%;
  height: calc(100% - 180px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
  }

  .level-list {
    .title {
      font-size: 18px;
      color: #666;
      line-height: 24px;
    }

    .level-content {
      margin-top: 16px;
      display: grid;
      gap: 24px;
      grid-template-columns: repeat(5, 1fr);

      .level-item {
        display: flex;
        gap: 8px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 241px;
        padding: 16px;
        border-radius: 8px;
        background: #f9fafb;
        overflow: hidden;

        img {
          width: 120px;
          height: 120px;
        }

        p.name {
          font-size: 18px;
          color: #333;
          font-weight: bold;
        }

        p.desc {
          font-size: 14px;
          color: #666;
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
