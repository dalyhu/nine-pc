<template>
  <div class="head_search_box">
    <el-popover popper-class="popper_search" :trigger="tabletMode ? 'click' : 'hover'" width="404">
      <template #reference>
        <div class="search_input_box">
          <el-input
            v-model="searchValue"
            :clearable="true"
            @keydown="handleKeyCode($event)"
            placeholder="请输入"
          >
            <template #append>
              <el-icon @click="handleSearch" :size="20">
                <Search />
              </el-icon>
            </template>
          </el-input>

          <div class="search_icon">
            <el-icon @click="handleOpen" :size="20">
              <Search />
            </el-icon>
          </div>
        </div>
      </template>
      <div class="head_search_content">
        <div class="head_search_title">
          <span class="span_annal">历史记录</span>
          <el-button size="small" @click="clearHistory">
            <template #icon>
              <el-icon size="14">
                <Delete />
              </el-icon>
            </template>

            清空</el-button
          >
        </div>
        <div class="tag_list">
          <el-tag
            @click="handleTag(historyItem)"
            v-for="historyItem in historyList"
            type="info"
            :key="historyItem"
            >{{ historyItem }}</el-tag
          >
        </div>

        <div class="popular_search">热门搜索</div>
        <div class="popular_tag">
          <el-tag
            @click="handleTag(popularItem.short_name_zh)"
            v-for="popularItem in popularList"
            :key="popularItem.sourceid"
            >{{ popularItem.short_name_zh }}</el-tag
          >
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup name="HeadSearch" lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { union } from 'lodash-es'
import { useRouter } from 'vue-router'
import { Search, Delete } from '@element-plus/icons-vue'
import { initialList } from '@/api/search.js'
import { useStore } from 'vuex'
const tabletMode = document.documentElement.hasAttribute('data-tablet-pc')
const router = useRouter()

const searchValue = ref('')
const popularList = ref([])
const historyList = useLocalStorage('historyList', [])

//搜索
const handleSearch = () => {
  if (!searchValue.value.trim()) {
    return ElMessage({
      message: '搜索内容不能为空',
      type: 'error'
    })
  }
  handleTag(searchValue.value)
}

const handleTag = (value) => {
  const routeData = router.resolve({
    path: '/search?name=' + value,
    query: {
      name: value
    }
  })

  historyList.value = union([value], historyList.value) // 存储搜索记录
  if (historyList.value.length > 10) {
    historyList.value.pop()
  }

  window.open(routeData.href, '_self')
}

const handleOpen = () => {
  const routeData = router.resolve({
    path: '/search'
  })
  window.open(routeData.href, '_self')
}

const handleKeyCode = (event) => {
  if (!event.shiftKey && event.keyCode === 13) {
    event.cancelBubble = true // ie阻止冒泡行为
    event.stopPropagation() //Firefox阻止冒泡行为
    event.preventDefault() // 取消事件默认行为换行
    if (searchValue.value) {
      handleTag(searchValue.value)
    }
  }
}

// 清除搜索历史记录
const clearHistory = () => {
  historyList.value = []
}

const store = useStore()
// 热门列表
const initPopularList = () => {
  initialList().then((res) => {
    const { hot_match = [] } = res.data
    popularList.value = hot_match
    // 将热门列表存起来，搜索页面需要用到
    store.commit('setSearchHotList', popularList.value)
  })
}

onMounted(() => {
  initPopularList()
})
</script>

<style scoped lang="scss">
.head_search_box {
  .search_input_box {
    .el-input {
      width: 200px;
      background-color: #1d1e1f;
      :deep(.el-input__wrapper) {
        border-top-left-radius: 999px;
        border-bottom-left-radius: 999px;
        background-color: #1d1e1f;
        box-shadow: 0 0 0 1px #2b2b2c inset !important;
        transition: box-shadow 0.2s;
        .el-input__inner {
          color: #e5eaf3;
          &::placeholder {
            color: #8a8b8d;
          }
        }
      }
      :deep(.el-input-group__append) {
        padding: 0 16px;
        border-top-right-radius: 999px;
        border-bottom-right-radius: 999px;
        box-shadow: 0 0 0 1px #2b2b2c inset !important;
        background-color: #262727;
        color: #e5eaf3;
        margin-left: -1px;
        cursor: pointer;
        transition: box-shadow 0.2s;
      }
      &:hover {
        :deep(.el-input__wrapper) {
          box-shadow: 0 0 0 1px #4c4d4f inset !important;
        }
        :deep(.el-input-group__append) {
          box-shadow: 0 0 0 1px #4c4d4f inset !important;
        }
      }
      :deep(.el-input__wrapper.is-focus) {
        box-shadow: 0 1px 0 0 #d02d54 inset, 0 -1px 0 0 #d02d54 inset,
          1px 0 0 0 #d02d54 inset !important;
        & + .el-input-group__append {
          box-shadow: 0 1px 0 0 #d02d54 inset, 0 -1px 0 0 #d02d54 inset,
            -1px 0 0 0 #d02d54 inset !important;
        }
      }
    }
    .search_icon {
      display: none;
    }
  }

  // 1080
  @include screen(small) {
    .search_input_box {
      .el-input {
        display: none;
      }
      .search_icon {
        display: block;
        width: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }
}
.popper_search {
  .head_search_content {
    .head_search_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      .span_annal {
        color: #e5eaf3;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
      }
      .el-button {
        background-color: #1d1e1f !important;
        border: 1px solid #4c4d4f;
        color: #909399;
        &:hover,
        &:focus {
          color: #d02d54;
          border-color: #4c1c27;
          background-color: #27171a;
        }
      }
    }
    .tag_list {
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px solid #414243;
      .el-tag {
        margin-right: 12px;
        margin-bottom: 12px;
        cursor: pointer;
        border: 1px solid #2b2b2c;
        background-color: #202121;
      }
    }
    .popular_search {
      height: 54px;
      font-size: 16px;
      line-height: 58px;
      font-style: normal;
      font-weight: 600;
      color: #e5eaf3;
    }
    .popular_tag {
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px solid #414243;
      .el-tag {
        margin-right: 12px;
        margin-bottom: 12px;
        cursor: pointer;
        color: #f56c6c;
        border: 1px solid #412626;
        background-color: #2b1d1d;
      }
    }
  }
}
</style>
<style lang="scss">
.popper_search {
  background-color: #1d1e1f !important;
  border: 1px solid #363637 !important;
  .el-popper__arrow::before {
    background-color: #1d1e1f !important;
    border: 1px solid #414243 !important;
  }
}
</style>
