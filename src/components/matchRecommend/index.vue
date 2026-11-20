<!-- 赛事推荐 -->
<template>
  <div class="match-recommend">
    <dfHgroup
      title="赛事推荐"
      :btnText="`今日(<i class='num'>${matchRecommendCount}</i>)`"
      @btnClick="onHandleNavigate"
    >
      <template v-slot:prepend>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
        >
          <circle cx="14" cy="14" r="14" fill="#006BFF" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.468 10.1211H15.3357C17.3631 10.1211 18.3776 10.1211 19.007 10.7513C19.6372 11.3807 19.6372 12.3952 19.6372 14.4226V15.1797C19.6372 16.9039 19.6372 17.7663 19.2092 18.4596C18.7805 19.1521 18.0091 19.5378 16.467 20.3092C15.2081 20.9387 14.5786 21.2534 13.9019 21.2534C13.2251 21.2534 12.5956 20.9387 11.3367 20.3092C9.79463 19.5378 9.02322 19.1521 8.5945 18.4596C8.1665 17.7663 8.1665 16.9032 8.1665 15.1797V14.4226C8.1665 12.3952 8.1665 11.3807 8.79668 10.7513C9.42613 10.1211 10.4406 10.1211 12.468 10.1211ZM13.9019 12.9888C13.6983 12.9888 13.562 13.2325 13.2896 13.7222L13.2194 13.8484C13.1419 13.9874 13.1032 14.0563 13.043 14.1021C12.9821 14.148 12.9068 14.1652 12.7562 14.1989L12.62 14.2305C12.0909 14.3502 11.8264 14.4097 11.7633 14.6119C11.7002 14.8148 11.8809 15.0255 12.2415 15.4471L12.3347 15.5561C12.4372 15.6758 12.4888 15.7353 12.5118 15.8098C12.5347 15.8844 12.5268 15.964 12.5118 16.1239L12.4974 16.2694C12.4429 16.8322 12.4157 17.1139 12.5799 17.2387C12.7448 17.3634 12.9928 17.2494 13.4882 17.0214L13.6158 16.9627C13.757 16.8981 13.8273 16.8659 13.9019 16.8659C13.9764 16.8659 14.0467 16.8981 14.1879 16.9627L14.3155 17.0214C14.8109 17.2501 15.059 17.3634 15.2239 17.2387C15.3887 17.1139 15.3608 16.8322 15.3063 16.2694L15.292 16.1239C15.2769 15.964 15.269 15.8844 15.292 15.8098C15.3149 15.736 15.3665 15.6758 15.469 15.5561L15.5622 15.4471C15.9229 15.0255 16.1035 14.8148 16.0404 14.6119C15.9773 14.4097 15.7128 14.3502 15.1837 14.2305L15.0475 14.1989C14.8969 14.1652 14.8217 14.1487 14.7607 14.1021C14.7005 14.0563 14.6618 13.9874 14.5844 13.8484L14.5141 13.7222C14.2417 13.2325 14.1055 12.9888 13.9019 12.9888Z"
            fill="white"
          />
          <path
            d="M13.1848 7.25195H14.6186C15.9707 7.25195 16.6461 7.25195 17.0662 7.67207C17.363 7.96887 17.4497 8.39329 17.4756 9.09372C16.8877 9.04353 16.1915 9.04353 15.4065 9.04425H12.3962C11.6112 9.04425 10.9157 9.04425 10.3271 9.09372C10.3522 8.39329 10.4397 7.96816 10.7358 7.67207C11.1573 7.25195 11.8341 7.25195 13.1848 7.25195Z"
            fill="white"
          />
        </svg>
      </template>
    </dfHgroup>
    <div class="wrapper">
      <div class="grid-type-filter">
        <div class="filter-list">
          <div
            class="filter-item"
            v-for="(item, index) in tabList"
            :key="index"
            v-show="item.show"
            :class="{ active: tabIndex === index }"
            @click="onHandleType(index)"
          >
            <el-text class="text">{{ item.name }}</el-text>
          </div>
        </div>
        <el-dropdown class="filter-dropdown" trigger="click" @command="handleCommand">
          <span class="filter-result-box">
            {{ selectedStatusText }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in matchStatusList" :key="item.id" :command="item.id">{{
                item.text
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="grid-match-list">
        <matchInfoCardItem
          v-for="item in matchList"
          :key="item.sourceid"
          :info="item"
          @btnClick="onHandleNavigate"
        />
        <DfEmpty description="哎呀，暂无赛事" v-if="matchList?.length === 0" />
      </div>
    </div>
  </div>
</template>
<script setup name="MatchRecommend" lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import dfHgroup from '@/components/dfHgroup/index.vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { multiEventRecommend } from '../../api/common.js'
import { getQueryString } from '@/utils'
import matchInfoCardItem from '@/components/matchInfoCardItem/index.vue'
defineOptions({
  name: 'MatchRecommend',
  inheritAttrs: true
})

const props = defineProps({
  isDoneInitUserId: {
    type: Boolean,
    default: false
  }
})

const selectedStatusText = computed(() => {
  return matchStatusList.find((it) => it.id == selectedStatus.value)?.text || ''
})
const matchList = computed(() => {
  return matchRecommendListMap.value[`type${selectedStatus.value}`]
})

watch(
  () => props.isDoneInitUserId,
  () => {
    if (props.isDoneInitUserId) getRecommend({})
  }
)

const router = useRouter()

const tabIndex = ref(0)
const tabList = [
  {
    name: '全部',
    moreBtnUrl: 'football',
    show: true,
    showIcon: false,
    params: { type: 0 },
    btn_type: 0,
    icon: 'all'
  },
  // { name: "世界杯", params: {type: 99} },
  {
    name: '足球',
    moreBtnUrl: 'football',
    show: true,
    showIcon: false,
    params: { type: 1 },
    btn_type: 0,
    icon: 'ft'
  },
  {
    name: '篮球',
    moreBtnUrl: 'basketball',
    show: true,
    showIcon: false,
    params: { type: 2 },
    btn_type: 0,
    icon: 'bk'
  },
  {
    name: '电竞',
    moreBtnUrl: 'anchor?type=4',
    show: true,
    showIcon: false,
    params: { type: 4 },
    btn_type: 0,
    icon: 'dj'
  },
  {
    name: '五大联赛',
    moreBtnUrl: 'football',
    show: true,
    showIcon: true,
    params: { football: '82,120,108,129,142' },
    btn_type: 1,
    icon: 'wdls'
  },
  {
    name: 'NBA',
    moreBtnUrl: 'basketball',
    show: true,
    showIcon: true,
    params: { basketball: '1' },
    btn_type: 2,
    icon: 'nba'
  }
]
// 默认选中：进行中
const selectedStatus = ref(1)
const matchStatusList = [
  {
    id: 1,
    text: '进行中'
  },
  {
    id: 2,
    text: '未开始'
  },
  {
    id: 3,
    text: '已结束'
  }
]
const handleCommand = (status) => {
  selectedStatus.value = status
}

const navigate = (url) => {
  let routeData = router.resolve({
    path: '/' + url,
    query: {
      ...getQueryString(url)
    }
  })
  window.open(routeData.href, '_self')
}

const onHandleType = (index) => {
  tabIndex.value = index
  getRecommend(tabList[index].params)
}

const onHandleNavigate = (item, anchor_id, isLive) => {
  let url = ''
  let type = 'football'
  if (!item) {
    url = tabList[tabIndex.value].moreBtnUrl
    navigate(url)
    return
  }
  switch (Number(item.type)) {
    case 0:
      type = 'football'
      break
    case 1:
      type = 'basketball'
      break
    default:
      type = item.type
      break
  }
  if (anchor_id) {
    url = `live?router=recommend&uid=${anchor_id}`
  } else if (isLive) {
    return
  } else {
    url = tabList[tabIndex.value].moreBtnUrl
  }

  navigate(url)
}

const matchRecommendCount = ref(0)
const matchRecommendListMap = ref({})
// 获取首页赛事推荐
const getRecommend = (params) => {
  // let recommend_type = [0, 99, 1, 2]
  // 0:全部, 99:世界杯, 1:足球, 2:籃球

  multiEventRecommend(params).then((res: any) => {
    if (res.code === 0) {
      let data = res.data
      matchRecommendCount.value = data.count
      delete data.count
      // 去重
      Object.keys(data).forEach((k) => {
        let arr = new Map()
        data[k] = data[k].filter(
          (item) => !arr.has(item['sourceid']) && arr.set(item['sourceid'], 1)
        )
      })
      matchRecommendListMap.value = {
        ...data
      }
    }
  })
}

if (props.isDoneInitUserId) {
  getRecommend({})
}
</script>
<style lang="scss" scoped>
.match-recommend {
  font-size: 0;
  width: 100%;
  max-width: 1424px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .dfHgroup {
    padding: 10px 0;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    background-color: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color-extra-light);
    border-radius: 16px;
    overflow: hidden;
    flex: 1;
  }
  .grid-type-filter {
    padding: 20px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .filter-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: -10px;
  }
  .filter-item {
    padding: 8px 20px;
    border-radius: 999px 999px 999px 999px;
    border: 1px solid var(--el-border-color);
    background: var(--el-fill-color-blank);
    margin-top: 10px;
    cursor: pointer;
    .text {
      color: var(--el-text-color-regular);
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
    }
    &.active,
    &:hover {
      border: 1px solid var(--el-color-primary);
      background: var(--el-color-primary);
      .text {
        color: var(--el-color-white);
      }
    }
    + .filter-item {
      margin-left: 12px;
    }
  }
  .filter-dropdown {
    .filter-result-box {
      padding: 8px 16px;
      border-radius: 999px;
      border: 1px solid var(--el-border-color);
      background-color: var(--el-fill-color-blank);
      cursor: pointer;
      color: var(--el-text-color-primary);
      white-space: nowrap;
      @include fontStyle-body1-Medium;
    }
  }
}
</style>
