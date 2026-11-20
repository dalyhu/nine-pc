<template>
  <div class="mainContainer">
    <Error v-if="isError" />

    <template v-else>
    <list
      :empty="{
        show: !listData.length,
        icon: '/static/images/spaceAndMine/emptyBox.png',
        des: ['暂无收藏', '您目前还没有收藏唷！']
      }"
    >
      <div class="card" v-for="(item, i) in listData" :key="i" @click="pageToDetails(item)">
        <div class="header">
          <el-avatar
            class="avatar"
            :size="54"
            :src="item.avatar || '/static/images/spaceAndMine/defaultAvatar.png'"
            @click.stop="handleGotoInfo(item)"
          ></el-avatar>
          <div class="title">{{ item.nickname }}</div>
          <div class="lv">
            <div class="lvRel">
              <el-image class="image-Lv" :src="`/static/images/Lv/Lv${item.stars}.png`"></el-image>
              Lv.{{ item.stars }}
            </div>
            <el-text class="tips">{{ item.grouptitle }}</el-text>
          </div>
        </div>
        <div class="title">{{ item.subject }}</div>
        <el-text class="content" line-clamp="2" :title="item.message">{{ item.message }}</el-text>
        <div class="flexImg" v-show="item.picture > 0">
          <el-image
            v-for="(imgUrl, j) in item.picture"
            :key="j"
            fit="cover"
            class="image-list"
            :src="imgUrl"
            lazy
            @click.stop="viewImg(imgUrl)"
          ></el-image>
        </div>
        <div class="border8f">
          <span class="tagDIY" @click.stop="pageToForum(item)">{{ item.name }}</span>
        </div>
        <div class="flexSb">
          <el-text class="time">{{ getYMD(item.dateline) }}</el-text>
          <div class="flexCt">
            <template v-if="!item.has_viewperm">
              <el-image class="image-icon" src="/static/images/spaceAndMine/lock.png"></el-image>
              <el-text class="marginRight font-sc">阅读权限 {{ item.readperm || '' }}</el-text>
            </template>
            <el-image class="image-icon" src="/static/images/spaceAndMine/eyeOpen.png"></el-image>
            <el-text class="marginRight font-sc">{{ item.views }}</el-text>
            <el-image class="image-icon" src="/static/images/spaceAndMine/msg.png"></el-image>
            <el-text class="font-sc">{{ item.replies }}</el-text>
          </div>
        </div>
      </div>
      <div class="viewPort" ref="viewPortDom" v-show="listStatus.hasNextPage">
        <el-icon class="is-loading"><Loading /></el-icon>
      </div>
    </list>
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

<script setup lang="ts">
import { useStore } from 'vuex'
import { Loading } from '@element-plus/icons-vue'
import list from './component/list.vue'
import Error from './component/Error.vue'
import { myCollectApi, getDetailsUrl } from '@/api'
import { getYMD } from '@/utils/common'
import { useRouter } from 'vue-router'
import { normalizeUrl } from '@/utils'

const { getters } = useStore()
const router = useRouter()
const imgUrl = []
const showImg = ref(false)
const listData = reactive([])
const viewPortDom = ref<HTMLDivElement>(null)
const listStatus = reactive({ page: 1, allCount: 0, hasNextPage: false })
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

const handleGotoInfo = (item) => {
  if (item.isForbidden) {
    // @ts-ignore
    ElMessage.error('操作成功')
    return
  }
  router.push({
    name: 'otherSpace',
    state: {
      uid: item.authorid
    }
  })
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
    // @ts-ignore
    ElMessage.error('暂无权限查看')
  }
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (!listStatus.hasNextPage) {
        return
      } else {
        listStatus.page += 1
      }
      httpMyCollectApi(listStatus.page)
        .then((res) => {
          listData.push(...res.data.list)
          // @ts-ignore
          listStatus.hasNextPage = res.page.hasNextPage
        })
        .catch(() => {
          listStatus.page -= 1
        })
    } else {
      // dom隐藏时候做点什么
    }
  })
})

const httpMyCollectApi = async (page = 1) => {
  try {
    const res = await myCollectApi({ page })
    if (page === 1) isError.value = false
    return res
  } catch (error) {
    console.error(error)
    if (page === 1) {
      isError.value = true
      listData.length = 0
    }
    throw error
  }
}

onMounted(async () => {
  try {
    const res = await httpMyCollectApi()
    listData.push(...res.data.list)
    // @ts-ignore
    listStatus.allCount = res.page.allCount
    // @ts-ignore
    listStatus.hasNextPage = res.page.hasNextPage
  } catch {
    // isError 已在 httpMyCollectApi 中处理
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
  padding: 24px;
  .card {
    padding: 16px;
    border: 1px solid #e6e7eb;
    border-radius: 8px;
    cursor: pointer;
    .header {
      display: grid;
      grid-template-columns: 54px 1fr;
      grid-template-rows: auto auto;
      align-items: center;
      align-content: center;
      gap: 10px 16px;
      .avatar {
        grid-row: 1 / -1;
        cursor: pointer;
      }
      .lv {
        font-size: 0;
        margin-left: 8px;
        .lvRel {
          display: inline-block;
          position: relative;
          padding: 2px 6px 0 24px;
          margin-right: 8px;
          border-radius: 12px;
          font-size: 18px;
          color: #fff;
          font-weight: 700;
          background: linear-gradient(to right, #2e078f, #6027ec);
          .image-Lv {
            position: absolute;
            width: 28px;
            bottom: 0;
            left: -9px;
          }
        }
        .tips {
          color: #d02d54;
          font-size: 16px;
          font-weight: 400;
        }
      }
    }
    .title {
      font-size: 18px;
      font-weight: 400;
      margin-top: 8px;
      color: #333;
    }
    .content {
      line-height: 1.5;
      color: #666;
      font-size: 16px;
      font-weight: 400;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
    }
    .flexImg {
      display: flex;
      gap: 14.69px;
      margin-top: 8px;
      .image-list {
        width: 160px;
        height: 160px;
        border-radius: 12px;
      }
    }
    .border8f {
      margin-top: 8px;
      .tagDIY {
        display: inline-block;
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
      margin-top: 8px;
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
