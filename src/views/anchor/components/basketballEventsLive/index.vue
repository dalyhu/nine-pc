<template>
  <div class="basketball_events_live hide_scrollbar">
    <div class="basketball_events_live_box" v-if="basketballEventLiveList.length > 0">
      <div class="sections_box" v-for="(item, index) in basketballEventLiveList" :key="index">
        <div class="sections_title" @click="handleButton(index)">
          <span class="button">第 {{ index + 1 }} 节</span>
          <img
            :class="[selectedIndex.includes(index) ? 'arrow_down' : '']"
            src="/static/images/live/arrow_icon.svg"
            alt=""
          />
        </div>
        <el-timeline :class="[selectedIndex.includes(index) ? 'timeline_close' : '']">
          <el-timeline-item v-for="(eventItem, index) in item" :key="index">
            <span class="event_time_box">{{ eventItem.conducttime }}</span>
            <span>{{ eventItem.info }}</span>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <DfEmpty v-else />
  </div>
</template>

<script setup name="basketball_events_live" lang="ts">
import { useStore } from 'vuex'

const store = useStore()
const selectedIndex = ref([])

const basketballEventLiveList = computed(() => {
  return store.state.basketballEventLive
})
const handleButton = (index) => {
  if (selectedIndex.value.includes(index)) {
    selectedIndex.value = selectedIndex.value.filter((curr) => curr !== index)
    return
  }
  selectedIndex.value.push(index)
}
</script>

<style scoped lang="scss">
.basketball_events_live {
  height: 100%;
  overflow-y: auto;
  .basketball_events_live_box {
    height: 100%;
    .sections_box {
      .sections_title {
        padding: 0px 12px;
        height: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        border-bottom: 1px solid var(--el-border-color-extra-light);
        border-top: 1px solid var(--el-border-color-extra-light);
        .button {
          padding: 2px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          font-style: normal;
          white-space: nowrap;
          cursor: pointer;
          color: var(--el-primary-background-color);
          border: 1px solid var(--el-primary-background-color);
        }
        img {
          width: 14px;
          transform: rotate(180deg);
        }
        .arrow_down {
          transform: rotate(0deg);
        }
      }
      .el-timeline {
        padding: 12px;
        .el-timeline-item:last-child {
          padding-bottom: 0px;
        }
      }
      .timeline_close {
        height: 0px;
        padding-top: 0px;
        padding-bottom: 0px;
        overflow: hidden;
      }
    }
    .event_time_box {
      margin-right: 8px;
    }
  }
}
</style>
