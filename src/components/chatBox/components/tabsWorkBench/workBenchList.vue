<template>
  <ul class="my-list">
    <li v-for="item in workList" :key="item.id">
      <div class="flex-center work-table">
        <p>
          <span>ID</span>
          <span>{{ item.user_id }}</span>
        </p>
        <p>
          <span>房管昵称</span>
          <span>{{ item.user_nickname }}</span>
        </p>
        <p>
          <span>操作</span>
          <span>{{ item.action }}</span>
        </p>
      </div>

      <slot :item="item"></slot>
    </li>
  </ul>

  <div v-if="loadingMoreList" class="loading-center">Loading...</div>
</template>

<script setup>
// import { optionStatus } from '@/utils/mapping'
const props = defineProps({
  workList: {
    type: Array,
    default: () => []
  },
  loadingMoreList: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="scss">
.loading-center {
  text-align: center;
}
.my-list {
  li {
    border: 1.5px solid #f2f5fc;
    border-radius: 8px;
    margin-bottom:10px;
    .work-table {
      padding: 8px;
      font-size: 14px;
      p {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #848587;
        font-size: 14px;
        border-right: 1.5px solid #f2f5fc;
        &:last-child {
          border-width: 0;
        }
        span:last-child {
          color: #000;
          font-weight: 550;
          margin-top: 8px;
        }
      }
    }
  }
}
</style>
