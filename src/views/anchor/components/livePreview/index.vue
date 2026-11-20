<template>
  <div class="live_preview_panel hide_scrollbar" v-if="livePreviewGroup.length">
    <div v-for="group in livePreviewGroup" :key="group.label" class="live_preview_group_box">
      <div class="group_label_box">{{ group.label }}</div>
      <div class="live_preview_list_box">
        <div v-for="item in group.list" :key="item.match_id" class="live_preview_item_box">
          <div class="live_preview_team_info_box main">
            <div class="live_preview_team_info_name">{{ item.home_name }}</div>
            <df-image-lazy
              fit="contain"
              :src="item.home_logo"
              placeholder-src="/static/images/placeholder_gray_bg.png"
              :error-icon="defaultTeamAvatar"
            />
          </div>
          <div class="live_preview_desc_box">
            <div class="live_preview_desc_name">{{ item.name }}</div>
            <div class="live_preview_desc_time">{{ item.start }}</div>
          </div>
          <div class="live_preview_team_info_box">
            <df-image-lazy
              fit="contain"
              :src="item.away_logo"
              placeholder-src="/static/images/placeholder_gray_bg.png"
              :error-icon="defaultTeamAvatar"
            />
            <div class="live_preview_team_info_name">{{ item.away_name }}</div>
          </div>
          <el-button
            class="reserve_btn"
            type="primary"
            size="small"
            :plain="item.is_reserve === 1"
            @click="() => reserveLive(item)"
            >{{ item.is_reserve !== 1 ? '预约' : '取消' }}</el-button
          >
        </div>
      </div>
    </div>
  </div>
  <div class="live_preview_panel no_data" v-else>
    <DfEmpty />
  </div>
</template>
<script setup lang="ts" name="LivePreview">
import { getReserveLiveList, reserveMatch } from '@/api/user.js'
import { defaultTeamAvatar } from '@/utils/common'
import { useStore } from 'vuex'
import { useThrottleFn } from '@vueuse/core'

const props = defineProps({
  uid: {
    type: Number,
    default: 0
  },
  type: {
    type: Number,
    default: 0 // 0-足球 1-篮球 3-电竞
  }
})

const store = useStore()
const livePreviewGroup = ref([])
const isProcessing = ref(false)

onMounted(() => {
  getLivePreviewList()
})

async function getLivePreviewList() {
  try {
    const { data } = await getReserveLiveList({
      uid: props.uid,
      type: props.type === 3 ? 2 : props.type // 电竞类型为3，但是传给后端要传2
    })

    const map = (data?.data || []).reduce((res, item) => {
      const group = res[item.key] || { label: item.key, list: [] }
      group.list.push({ ...item })
      res[item.key] = group
      return res
    }, {})

    livePreviewGroup.value = Object.keys(map)
      .sort()
      .reduce((res, key) => {
        res.push(map[key])
        return res
      }, [])
  } catch (error) {
    ElMessage(error.msg)
  }
}

const reserveLive = useThrottleFn(async (data) => {
  if (isProcessing.value) return ElMessage.warning('处理中，请耐心等待...')

  if (!store.state.user.infoData.id) {
    store.commit('user/SET_LOGIN_MASK', true)
    return
  }

  try {
    isProcessing.value = true
    await reserveMatch({ live_id: data.id })

    if (data.is_reserve === 1) {
      data.is_reserve = 0
      ElMessage.success('已取消预约')
    } else {
      data.is_reserve = 1
      ElMessage.success('预约成功')
    }

    nextTick(() => (isProcessing.value = false))
  } catch (err) {
    ElMessage.error(err.msg || '预约状态更改失败')
    nextTick(() => (isProcessing.value = false))
  }
}, 500)
</script>
<style lang="scss" scoped>
.live_preview_panel {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.live_preview_group_box {
  background-color: var(--el-fill-color);
}
.group_label_box {
  padding: 9px 8px;
  line-height: 22px;
  color: var(--el-text-color-primary);
  font-size: 14px;
  font-weight: 500;
}
.live_preview_list_box {
  background-color: var(--el-bg-color-overlay);
  overflow: hidden;
}
.live_preview_item_box {
  padding: 8px 6px;
  display: flex;
  overflow: hidden;
  align-items: center;
}
.reserve_btn {
  flex-shrink: 0;
  margin-left: 4px;
}
.live_preview_desc_box {
  width: 100px;
  overflow: hidden;
  flex-shrink: 0;
  margin-left: 4px;
  margin-right: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .live_preview_desc_name {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--el-color-info);
    line-height: 20px;
    font-size: 12px;
    text-align: center;
  }
  .live_preview_desc_time {
    line-height: 20px;
    border-radius: 4px;
    padding: 0 8px;
    font-size: 12px;
    color: var(--el-color-info);
    background-color: var(--el-fill-color-dark);
  }
}
.live_preview_team_info_box {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  .el-image {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }
  &.main {
    .live_preview_team_info_name {
      text-align: right;
      padding-left: 0;
      padding-right: 4px;
    }
  }
  .live_preview_team_info_name {
    padding-left: 4px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    color: var(--el-text-color-primary);
  }
}
</style>
