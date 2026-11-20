<template>
  <div class="score-container">
    <div class="back" @click="back">
      <img src="/static/images/spaceAndMine/back-left.svg" alt="" />
      <span>返回</span>
    </div>

    <div class="content">
      <div class="tabs">
        <span
          v-for="item in tabsList"
          class="tab"
          :key="item.key"
          :class="{ tabSelect: tabKey === item.key }"
          @click="tabKey = item.key"
          >{{ item.name }}</span
        >
      </div>

      <ScorePage v-if="tabKey === 0" />
      <LevelPage v-if="tabKey === 1" />
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import ScorePage from './Score.vue'
import LevelPage from './Level.vue'

const tabKey = ref(0)

const tabsList = [
  { name: '积分记录', key: 0 },
  { name: '等级权益', key: 1 }
]

const router = useRouter()
const route = useRoute()
const back = () => {
  router.back()
}
onMounted(() => {
  if (route.query.tab === 'level') tabKey.value = 1
})
</script>
<style scoped lang="scss">
.score-container {
  position: relative;
  width: 100%;
  height: 100%;
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

  .content {
    padding: 0 24px;
    height: 100%;
    overflow: hidden;

    .tabs {
      position: sticky;
      top: 34px;
      background-color: #fff;
      box-shadow: #fff 0px -10px 0 24px;
      z-index: 10;
      display: flex;
      justify-content: center;
      margin: 32px 16px;
      font-size: 20px;
      line-height: 24px;
      font-weight: 400;
      color: #333;
      gap: 48px;

      .tab {
        cursor: pointer;
        padding-bottom: 4px;
        border-bottom: 2px solid transparent;
      }
      .tabSelect {
        color: #d02d54;
        border-bottom: 2px solid #d02d54;
      }
    }
  }
}
</style>
