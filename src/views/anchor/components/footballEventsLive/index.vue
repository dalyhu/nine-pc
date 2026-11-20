<template>
  <div class="football_events_live hide_scrollbar">
    <template v-if="footballEventLiveList.length > 0">
      <ul>
        <li v-for="(eventItem, index) in footballEventLiveList" :key="index">
          <div class="line_box">
            <div class="image_box">
              <img v-if="eventItem && eventItem.position != 0" :src="imgUrl(eventItem.type)" />
              <img v-else src="/static/images/artboard.png" />
            </div>
            <div class="line"></div>
          </div>
          <div class="event_text_box">
            <p>{{ eventItem.time }}</p>
            <span>{{ eventItem.data }}</span>
          </div>
        </li>
      </ul>
    </template>
    <DfEmpty v-else />
  </div>
</template>

<script setup name="footballEventsLive" lang="ts">
import { useStore } from 'vuex'
import { getImageUrl } from '@/utils/common.js'

const store = useStore()

const imgUrl = (type) => {
  const urlList = [
    '',
    'f-0',
    'f-5',
    'f-6',
    'f-7',
    '',
    'f-12',
    '',
    'f-1',
    'f-4',
    '',
    '',
    '',
    '',
    '',
    'f-9'
  ]
  if (urlList[type]) {
    return getImageUrl(`/static/images/${urlList[type]}.png`)
  } else {
    return getImageUrl(`/static/images/${urlList[1]}.png`)
  }
}

const footballEventLiveList = computed(() => {
  return store.state.footballEventLive
})
</script>

<style scoped lang="scss">
.football_events_live {
  height: 100%;
  padding: 0px 12px;
  overflow-y: auto;
  ul {
    padding-top: 12px;

    li {
      display: flex;
      .line_box {
        flex-shrink: 0;
        width: 32px;
        margin-right: 8px;
        display: flex;
        justify-content: center;
        position: relative;
        .image_box {
          position: absolute;
          width: 32px;
          height: 32px;
          background-color: var(--el-fill-color);
          border-radius: 999px;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 16px;
            height: 16px;
          }
        }
        .line {
          width: 2px;
          background-color: var(--el-fill-color);
        }
      }
      .event_text_box {
        flex: 1;
        padding-bottom: 20px;
        p {
          color: var(--el-text-color-placeholder);
          font-size: 14px;
          padding-bottom: 8px;
          line-height: 22px;
        }
        span {
          color: var(--el-text-color-primary);
          font-size: 14px;
          line-height: 22px;
        }
      }
    }
    li:last-child {
      .line_box {
        .line {
          background-color: transparent;
        }
      }
    }
  }
}
</style>
