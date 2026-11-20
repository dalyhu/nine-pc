<template>
  <div class="mainContainer">
    <Error v-if="isError" />

    <template v-else>
    <tabs
      :tabs-list="tabData"
      v-model="tabKey"
      :empty="{
        show: !listData[tabKey].length,
        icon: '/static/images/spaceAndMine/emptyPost.png',
        des: ['暂无帖子', '您目前还没有帖子唷！']
      }"
    >
      <div
        class="card"
        v-show="!!listData[tabKey].length"
        v-for="(item, i) in listData[tabKey]"
        :key="tabKey + i"
        @click.stop="pageToDetails(item)"
      >
        <div class="title">{{ item.subject }}</div>
        <el-text class="content">{{ item.message }}</el-text>
        <div class="flexImg" v-if="!!item.picture.length">
          <el-image
            v-for="(img, j) in item.picture"
            :key="tabKey + j"
            fit="cover"
            class="image-list"
            :src="img"
            lazy
            @click.stop="viewImg(img)"
          >
          </el-image>
        </div>
        <div class="border8f">
          <span class="tagDIY" @click.stop="pageToForum(item)">{{ item.name }}</span>
        </div>
        <div class="flexSb">
          <el-text class="time">{{ getYMD(item.dateline) }}</el-text>
          <div class="flexCt">
            <el-image class="image-icon" src="/static/images/spaceAndMine/eyeOpen.png"></el-image>
            <el-text class="marginRight font-sc">{{ item.views }}</el-text>
            <el-image class="image-icon" src="/static/images/spaceAndMine/msg.png"></el-image>
            <el-text class="font-sc">{{ item.replies }}</el-text>
          </div>
        </div>
      </div>
      <div class="viewPort" ref="viewPortDom" v-show="listStatus[tabKey].hasNextPage">
        <el-icon class="is-loading"><Loading /></el-icon>
      </div>
    </tabs>
    </template>
    <teleport to="body">
      <el-image-viewer
        hide-on-click-modal
        v-if="showImg"
        :url-list="imgUrl"
        @close="showImg = false"
      ></el-image-viewer>
    </teleport>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'
import { myPostApi, getDetailsUrl } from '@/api'
import { useStore } from 'vuex'
import tabs from './component/tabs.vue'
import Error from './component/Error.vue'
import { getYMD } from '@/utils/common'
import { normalizeUrl } from '@/utils'

const { getters } = useStore()
const imgUrl = reactive([])
const showImg = ref(false)
const tabKey = ref(0)
const viewPortDom = ref(null)
const tabData = [
  { name: '全部', key: 0 },
  { name: '已发表', key: 1 },
  { name: '草稿箱', key: 2 },
  { name: '待审核', key: 3 },
  { name: '已忽略', key: 5 },
  { name: '回收站', key: 4 }
]
const listStatus = reactive({
  0: { page: 1, allCount: 0, hasNextPage: false },
  1: { page: 1, allCount: 0, hasNextPage: false },
  2: { page: 1, allCount: 0, hasNextPage: false },
  3: { page: 1, allCount: 0, hasNextPage: false },
  5: { page: 1, allCount: 0, hasNextPage: false },
  4: { page: 1, allCount: 0, hasNextPage: false }
})
const listData = reactive({
  0: [],
  1: [],
  2: [],
  3: [],
  5: [],
  4: []
})
const isError = ref(false)

const viewImg = (url) => {
  imgUrl.splice(0, 1, url)
  showImg.value = true
}
const pageToForum = (item) => {
  const fid = getters.getForumId.find((x) => x.name == item.name)?.fid
  if (fid) {
    getDetailsUrl({
      type: 'pc',
      action: 'redirectToDetail',
      redirectToDetail: `/forum/${fid}/new`
    }).then((res) => {
      window.location.href = normalizeUrl(
        window.location.origin +
          res.data.bbs_url +
          '&channel_code=' +
          localStorage.getItem('channel')
      )
    })
  }
}
const pageToDetails = (item) => {
  if (item.has_viewperm) {
    getDetailsUrl({
      type: 'pc',
      action: 'redirectToDetail',
      redirectToDetail: `/thread/${item.tid}`
    }).then((res) => {
      window.location.href = normalizeUrl(
        window.location.origin +
          res.data.bbs_url +
          '&channel_code=' +
          localStorage.getItem('channel')
      )
    })
  } else {
    ElMessage.error('暂无权限查看')
  }
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (!listStatus[tabKey.value].hasNextPage) {
        return
      } else {
        listStatus[tabKey.value].page += 1
      }
      httpMyPostApi(listStatus[tabKey.value].page, tabKey.value)
        .then((res) => {
          listData[tabKey.value].push(...res.data.list)
          // @ts-ignore
          listStatus[tabKey.value].hasNextPage = res.page.hasNextPage
        })
        .catch(() => {
          listStatus[tabKey.value].page -= 1
        })
    } else {
      // dom隐藏时候做点什么
    }
  })
})

const httpMyPostApi = async (page = 1, type = 0) => {
  try {
    const res = await myPostApi({ page, type, uid: getters.getUid || ~~localStorage.getItem('UID') })
    if (page === 1) isError.value = false
    return res
  } catch (error) {
    console.error(error)
    if (page === 1) {
      isError.value = true
      listData[type] = []
    }
    throw error
  }
}

watch(tabKey, async () => {
  listStatus[tabKey.value].page = 1
  try {
    const res = await httpMyPostApi(1, tabKey.value)
    listData[tabKey.value] = res.data.list
    // @ts-ignore
    listStatus[tabKey.value].allCount = res.page.allCount
    // @ts-ignore
    listStatus[tabKey.value].hasNextPage = res.page.hasNextPage
  } catch {
    // isError 已在 httpMyPostApi 中处理
  }
})

onMounted(async () => {
  if (getters.getUid) {
    // uid解决刷新丢失问题 !important
    localStorage.setItem('UID', getters.getUid)
  }
  try {
    const res = await httpMyPostApi()
    listData[tabKey.value] = res.data.list
    // @ts-ignore
    listStatus[tabKey.value].allCount = res.page.allCount
    // @ts-ignore
    listStatus[tabKey.value].hasNextPage = res.page.hasNextPage
  } catch {
    // isError 已在 httpMyPostApi 中处理
  }
  if (viewPortDom.value) {
    // @ts-ignore
    observer.observe(viewPortDom.value)
  }
})

onUnmounted(() => {
  if (viewPortDom.value) {
    // @ts-ignore
    observer.unobserve(viewPortDom.value)
  }
})
</script>

<style scoped lang="scss">
.mainContainer {
  padding: 2px 24px;
  .card {
    padding: 16px;
    border: 1px solid #e6e7eb;
    border-radius: 8px;
    cursor: pointer;
    .title {
      font-size: 18px;
      font-weight: 400;
      color: #333;
    }
    .content {
      line-height: 1.5;
      color: #666;
      font-size: 16px;
      font-weight: 400;
      cursor: pointer;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
    }
    .flexImg {
      display: flex;
      gap: 14.69px;
      margin-top: 8px;
      padding-bottom: 8px;
      .image-list {
        width: 180px;
        height: 180px;
        border-radius: 14.69px;
      }
    }
    .border8f {
      .tagDIY {
        display: inline-block;
        margin-top: 8px;
        line-height: 17px;
        padding: 6px 12px;
        border-radius: 4px;
        background-color: #ffe8ed;
        color: #d02d54;
        cursor: pointer;
      }
    }
    .flexSb {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      .time {
        font-style: 14px;
        font-weight: 400;
        color: #999;
        line-height: 17px;
      }
      .flexCt {
        display: flex;
        align-items: center;
        .image-icon {
          width: 24px;
          vertical-align: middlemi;
          margin-right: 6px;
        }
        .font-sc {
          font-size: 14px;
          font-weight: 400;
          line-height: 17px;
          color: #666;
        }
        .marginRight {
          margin-right: 12px;
        }
      }
    }
  }
  .viewPort {
    text-align: center;
    height: 60px;
    line-height: 60px;
  }
}
</style>
