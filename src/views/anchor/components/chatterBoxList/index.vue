<!-- 话痨榜 -->
<template>
    <div class="chatter_list_header">
      <div
        class="ranking_tab_item"
        :class="{ active: tabIndex === 'daily' }"
        @click="handleTabChange('daily')"
      >
      话痨日榜
      </div>
      <div
        class="ranking_tab_item"
        :class="{ active: tabIndex === 'weekly' }"
        @click="handleTabChange('weekly')"
      >
      话痨周榜
      </div>
      <CircleCloseFilled class="close_btn" @click="emit('close')" />
    </div>
    <div class="chatter_list_content">
      <div class="chatter_top3_list">
        <div class="chatter_top3 top2">
          <div class="ranking_info_box">
            <df-image-lazy fit="cover" class="ranking_icon" :src="rankingList[1].avatar" />
            <div class="ranking_amount">{{ rankingList[1].count }}</div>
          </div>
          <div class="ranking_name" :title="rankingList[1].user_nickname">
            {{ rankingList[1].user_nickname }}
          </div>
        </div>
        <div class="chatter_top3 top1">
          <div class="ranking_info_box">
            <df-image-lazy fit="cover" class="ranking_icon" :src="rankingList[0].avatar" />
            <div class="ranking_amount">{{ rankingList[0].count }}</div>
          </div>
          <div class="ranking_name" :title="rankingList[0].user_nickname">
            {{ rankingList[0].user_nickname }}
          </div>
        </div>
        <div class="chatter_top3 top3">
          <div class="ranking_info_box">
            <df-image-lazy fit="cover" class="ranking_icon" :src="rankingList[2].avatar" />
            <div class="ranking_amount">{{ rankingList[2].count }}</div>
          </div>
          <div class="ranking_name" :title="rankingList[2].user_nickname">
            {{ rankingList[2].user_nickname }}
          </div>
        </div>
      </div>
      <div class="other_chatter_list">
        <div
          class="other_ranking_item"
          v-for="(item, index) in rankingList.filter((o, i) => i > 2)"
          :key="index"
        >
          <div class="ranking_num">{{ index + 4 }}</div>
          <div class="ranking_name">{{ item.user_nickname }}</div>
          <div class="ranking_amount">{{ `发言${item.count}` }}</div>
        </div>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import { onMounted } from 'vue'
  import { chatterSpeaking } from '@/api/user.js'
  import { CircleCloseFilled } from '@element-plus/icons-vue'
  import mittBus from '@/utils/mittBus'
  import { useDebounceFn } from '@vueuse/core'
  import { cloneDeep } from 'lodash-es'
  import { defaultAvatar } from '@/utils/common'
  
  defineOptions({
    name: 'ContributionRanking'
  })
  
  const props = defineProps({
    uid: {
      type: Number,
      default: 0
    },
    vid: {
      type: String,
      default: ''
    }
  })
  
  const emit = defineEmits(['close'])
  
  const tabIndex = ref('daily')
  
  const rankingList = ref(genBaseList())
  
//   话痨榜
  const getChatterList = useDebounceFn(async () => {
    try {
      const { data = [] } = await chatterSpeaking({
        // uid: props.uid,
        type: tabIndex.value,
        limit: 10
      })
  
      rankingList.value = genBaseList().map((item, index) => data[index] || item)
    } catch (error) {
      console.log(error)
    }
  }, 500)

  
  onMounted(() => {
    // 话痨榜
    getChatterList()

    mittBus.on('imOnMessage', handleIMMessage)
  })
  
  onBeforeUnmount(() => {
    mittBus.off('imOnMessage', handleIMMessage)
  })
  
  async function handleIMMessage(source) {
    const data = cloneDeep(source)
  
    if (data.action === 'gift' && data.vid === props.vid) getChatterList()
  }
  
  function handleTabChange(type) {
    tabIndex.value = type
    getChatterList()
  }
  
  function genBaseList() {
    return Array.from({ length: 10 }, () => ({
      count: 0,
      user_nickname: '虚位已待',
      avatar: defaultAvatar
    }))
  }
  </script>
  <style scoped lang="scss">
  .chatter_list_header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--el-fill-color);
    height: 32px;
    .ranking_tab_item {
      font-size: 14px;
      line-height: 32px;
      position: relative;
      padding: 0 12px;
      cursor: pointer;
      &::after {
        content: '';
        display: block;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        border-style: solid;
        border-width: 5px;
        border-bottom-color: transparent;
        border-top-color: transparent;
        border-left-color: transparent;
        border-right-color: transparent;
      }
      &.active {
        color: var(--el-color-primary);
        &::after {
          border-bottom-color: var(--el-color-primary);
        }
      }
    }
    .close_btn {
      width: 16px;
      height: 16px;
      position: absolute;
      top: 8px;
      right: 8px;
      cursor: pointer;
      color: var(--el-text-color-disabled);
    }
  }
  .chatter_list_content {
    padding: 12px 16px;
    background-color: var(--el-bg-color-overlay);
  }
  .chatter_top3_list {
    display: flex;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--el-border-color-extra-light);
  }
  .chatter_top3 {
    font-size: 14px;
    line-height: 22px;
    width: 130px;
    .ranking_info_box {
      display: flex;
      margin: 0 auto;
      position: relative;
      align-items: center;
      justify-content: center;
      width: 106px;
      height: 106px;
      flex-shrink: 0;
      .ranking_icon {
        width: 78px;
        height: 78px;
        display: block;
        border-radius: 50%;
      }
      &::after {
        content: '';
        display: block;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        background-repeat: no-repeat;
        background-position: center bottom;
        background-size: 100% auto;
      }
      .ranking_amount {
        position: absolute;
        z-index: 2;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        line-height: 24px;
      }
    }
    .ranking_name {
      overflow: hidden;
      margin-top: 6px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &.top1 {
      .ranking_info_box::after {
        background-image: url(../contributionRanking/images/first.png);
      }
      .ranking_amount,
      .ranking_name {
        color: #b96022;
      }
    }
    &.top2 {
      .ranking_info_box::after {
        background-image: url(../contributionRanking/images/second.png);
      }
      .ranking_amount,
      .ranking_name {
        color: #565f6d;
      }
    }
    &.top3 {
      .ranking_info_box::after {
        background-image: url(../contributionRanking/images/third.png);
      }
      .ranking_amount,
      .ranking_name {
        color: #b35136;
      }
    }
  }
  .other_chatter_list {
    .other_ranking_item {
      display: flex;
      align-items: center;
      line-height: 20px;
      font-size: 12px;
      color: var(--el-text-color-primary);
      margin-top: 12px;
      padding: 1px 0;
      .ranking_num {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        text-align: center;
        border-radius: 50%;
        background-color: var(--el-fill-color);
        margin-right: 8px;
      }
      .ranking_name {
        flex: 1;
        font-size: 14px;
      }
      .ranking_amount {
        flex-shrink: 0;
        color: var(--el-color-warning);
      }
    }
  }
  </style>
  