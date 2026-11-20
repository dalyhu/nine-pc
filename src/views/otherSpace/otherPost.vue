<template>
  <div class="mainContainer">
    <list :empty="{
      show: !listData.length,
      icon: '/static/images/spaceAndMine/emptyPost.png',
      des: ['暂无帖子', '您目前还没有帖子唷！']
    }">
      <div class="card" v-show="!!listData.length" v-for="(item, i) in listData" :key="i" @click.stop="pageToDetails(item)">
        <div class="title">{{ item.subject }}</div>
        <el-text class="content">{{ item.message }}</el-text>
        <div class="flexImg" v-if="!!item.picture.length">
          <el-image
            v-for="(img, j) in item.picture"
            :key="'img' + j"
            fit="cover"
            class="image-list"
            :src="img"
            :lazy="i < 20"
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
      <div class="viewPort" ref="viewPortDom" v-show="listStatus.hasNextPage">
        <el-icon class="is-loading"><Loading /></el-icon>
      </div>
    </list>
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
import list from './component/list.vue'
import { useStore } from 'vuex'
import { Loading } from '@element-plus/icons-vue'
import { myPostApi, getDetailsUrl } from '@/api'
import { getYMD } from '@/utils/common'
import { normalizeUrl } from '@/utils'

const { getters } = useStore()
const imgUrl = reactive([])
const showImg = ref(false)
const tabKey = ref(0)
const viewPortDom = ref(null)
const listData = ref([])
const listStatus = reactive({
  page: 1,
  allCount: 0,
  hasNextPage: false
})

const viewImg = (url) => {
  imgUrl.splice(0, 1, url)
  showImg.value = true
}
const pageToForum = (item) => {
  const fid = getters.getForumId.find(x => x.name == item.name)?.fid
  if (fid) {
    getDetailsUrl({type: 'pc', action: 'redirectToDetail', redirectToDetail: `/forum/${fid}/new`}).then(res => {
      window.location.href = normalizeUrl(window.location.origin + res.data.bbs_url + '&channel_code=' + localStorage.getItem('channel'))
    })
  }
}
const pageToDetails = (item) => {
  if (item.has_viewperm) {
    getDetailsUrl({type: 'pc', action: 'redirectToDetail', redirectToDetail: `/thread/${item.tid}`}).then(res => {
      window.location.href = normalizeUrl(window.location.origin + res.data.bbs_url + '&channel_code=' + localStorage.getItem('channel'))
    })
  } else {
    ElMessage.error('暂无权限查看');
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
      httpMyPostApi(listStatus.page).then((res) => {
        listData.value.push(...res.data.list)
        // @ts-ignore
        listStatus.hasNextPage = res.page.hasNextPage
      })
    } else {
      // dom隐藏时候做点什么
    }
  })
})
const httpMyPostApi = (page = 1, type = 0) => myPostApi({ page, type, uid: history.state.uid })

onMounted(() => {
  httpMyPostApi().then((res) => {
    listData.value.splice(0, 0, ...res.data.list)
    // @ts-ignore
    listStatus.allCount = res.page.allCount
    // @ts-ignore
    listStatus.hasNextPage = res.page.hasNextPage
  })
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
