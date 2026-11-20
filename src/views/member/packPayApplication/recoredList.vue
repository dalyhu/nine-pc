<template>
  <ul class="recored-list hide_scrollbar">
    <li v-for="item in list" :key="item.id" class="item-li">
      <!-- 工单号 -->
      <div class="order-floor flex">
        <div class="flex-direct">
          <span>
            包賠工单号<span class="font-14 font-left">{{ item.id }}</span>
          </span>
          <span class="div-top">{{ item.apply_time }}</span>
        </div>
        <!-- DC1a00  4e77f8  638659  848587 -->
        <div :class="`font-18 status_color_${Number(item.status)}`">
          {{ StatusType[item.status] }}
        </div>
      </div>

      <!-- mathch -->
      <div class="match-info">
        <div class="flex font-14 div-bottom text-left">
          赛事: {{ item.game_name }}
          <span class="font-18">￥{{ item.raise }}</span>
        </div>
        <div class="div-bottom text-left">比赛队伍： {{ item.competition_teams }}</div>
        <div class="div-bottom text-left">赛事类型： {{ item.game_type }}</div>
        <div class="div-bottom text-left">单号： {{ item.order_no }}</div>
        <div class="text-left" v-if="item.status === 1">领取账号： {{ item.account }}</div>
      </div>

      <!-- remark -->
      <div class="remark-info flex">
        <div class="font-bg" :title="item.mark">备注： {{ item.mark }}</div>
        <div
          class="font-14 font-color"
          v-if="item.status === 2 && !item.reorder"
          @click="handleRequest(item)"
        >
          重新申请
        </div>
      </div>
    </li>
  </ul>
</template>
<script lang="ts" setup>
import { type ListData, StatusType } from '@/utils/mapping'
defineProps<{ list: ListData[] }>()

const emit = defineEmits(['handleRequest'])
const handleRequest = (item: ListData) => {
  emit('handleRequest', item)
}
</script>
<style lang="scss" scoped>
.flex-direct {
  text-align: left;
  display: flex;
  flex-direction: column;
}
.div-bottom {
  margin-bottom: 4px;
}
.text-left {
  text-align: left;
}
.font-left {
  margin-left: 4px;
}
.recored-list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  overflow-y: scroll;

  .item-li {
    width: 100%;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 12px;
    font-size: 14px;
    font-weight: 400;
    color: #848587;
    overflow: hidden;

    .font-18 {
      font-size: 18px;
      font-weight: 500;
    }
    .font-14 {
      font-size: 15px;
      color: #303133;
      font-weight: 500;
      &.font-color {
        white-space: nowrap;
        flex-shrink: 0;
        color: #d02d54;
        border: 1px solid #d02d54;
        padding: 4px 8px;
        border-radius: 2px;
        margin-left: 8px;
        cursor: pointer;
      }
    }
    .div-top {
      margin-top: 8px;
      font-size: 14px;
      text-align: left;
    }
  }
  .order-floor {
    padding-bottom: 8px;
    border-bottom: 1px solid #f2f5fc;
    .status_color_1 {
      color: #63b659;
    }
    .status_color_2 {
      color: #dc1a00;
    }
    .status_color_3 {
      color: #848587;
    }
    .status_color_4 {
      color: #4e77f8;
    }
  }
  .match-info {
    border-bottom: 1px solid #f2f5fc;
    padding: 8px 0;
  }
  .remark-info {
    padding-top: 8px;
    .font-bg {
      text-align: left;
      background-color: #f2f5fc;
      padding: 8px;
      border-radius: 60px;
      flex: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
