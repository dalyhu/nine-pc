<template>
  <div class="in_room_notice_comp">
    <div class="hi_box">欢迎</div>
    <el-carousel
      height="22px"
      direction="vertical"
      indicator-position="none"
      :pause-on-hover="false"
      :interval="noticeInterval"
    >
      <el-carousel-item v-for="item in inRoomUserList" :key="item.user_id">
        <div class="in_room_notice_item">
          <UserPrefix :data="item" />
          <span>{{ item.text }}</span>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script setup lang="ts">
import HomedApi from '@/api/home'
import { useIntervalFn } from '@vueuse/core'
import { uniqBy } from 'lodash-es'
import UserPrefix from '@/components/chatBox/components/userPrefix/index.vue'

const props = defineProps({
  vid: {
    type: String,
    default: ''
  }
})

const inRoomUserList = ref([{ user_id: '0', text: '您的访问，共享赛事精彩' }])
const noticeInterval = ref(1200)

useIntervalFn(
  async () => {
    try {
      if (!props.vid) return

      const { data = [] } = await HomedApi.getOnlineUserList({
        vid: props.vid,
        page: 1,
        limit: 50
      })

      if (data.length) {
        inRoomUserList.value = uniqBy(data, 'user_id').map((item) => ({
          ...item,
          text: `${item.sender_nickname}进入直播间`
        }))
        noticeInterval.value = Math.min(60000 / inRoomUserList.value.length, 1200)
      }
    } catch (error) {
      //
    }
  },
  60000,
  { immediateCallback: true }
)
</script>
<style scoped lang="scss">
.in_room_notice_comp {
  flex-shrink: 0;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  overflow: hidden;
  .hi_box {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    width: 52px;
    background-color: var(--el-color-primary);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    color: #fff;
    font-size: 12px;
    line-height: 16px;
    height: 22px;
    padding: 0 5px;
    &::before {
      content: '';
      width: 16px;
      height: 16px;
      transform: translateY(-1px);
      background: url(/static/images/live/welcome_icon.gif) center center / 100% 100% no-repeat;
    }
  }
  .el-carousel {
    flex: 1;
  }
  .in_room_notice_item {
    font-size: 12px;
    line-height: 22px;
    color: var(--el-color-black);
    background-color: #ffe8dd;
    width: fit-content;
    padding: 0 4px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    display: flex;
    align-items: center;
    > * {
      display: inline-block;
      vertical-align: top;
    }
  }
}
</style>
