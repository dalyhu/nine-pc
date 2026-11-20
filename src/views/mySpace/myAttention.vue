<template>
  <div class="mainContainer">
    <tabs :tabs-list="tabData" v-model="tabKey" :empty="{
      show: !showFanMaintenance && !listData[tabKey].length,
      icon: '/static/images/spaceAndMine/emptyBox.png',
      des: ['暂无关注', '您目前还没有关注任何人唷！']
    }">
      <Error v-if="showFanMaintenance" />
      <template v-else>
      <div v-show="tabKey === 0" class="card" v-for="(item, i) in listData[tabKey]" :key="i">
        <div class="avatarRel" @click="pageToOtherInfo(item)">
          <el-avatar class="cursor" :size="54" :src="item.avatar || '/static/images/spaceAndMine/defaultAvatar.png'"></el-avatar>
          <div class="live" v-if="item.is_anchor === 1 && item.live.status === 1">直播中</div>
        </div>
        <div class="title">{{ item.username }}</div>
        <div class="lv" :style="{marginLeft: item.stars}">
          <div class="lvRel" v-if="item.stars">
            <el-image class="image-Lv" :src="`/static/images/Lv/Lv${item.stars}.png`"></el-image>
            Lv.{{ item.stars }}
          </div>
          <el-text class="vs">{{ item.live.title }}</el-text>
        </div>
        <div v-if="item.is_anchor === 1 && item.live.status === 1" class="btnDIY rightFirst" @click="pageToRoom(item)">
          进入直播间
        </div>
        <div v-if="item.is_anchor === 1 && item.live.status === 0 && item.live.starttime != 0" class="startBroadcastingSoon rightFirst">
          {{ formatDateLine(item.live.starttime, 'YYYY-MM-DD HH:mm') }}开播
        </div>
        <div v-if="item.is_anchor === 1 && item.live.status === -1" class="notWork rightFirst">
          未开播
        </div>
        <div class="btnDIY rightEnd" :class="{btnDIYCancel: !item.is_follow}" @click="handleFollow(item)">{{ item.is_follow ? '取消关注' : '关注Ta' }}</div>
      </div>
      <div v-if="tabKey === 1" class="card" v-for="(item, i) in listData[tabKey]" :key="i">
        <div class="avatarRel">
          <el-avatar class="cursor" :size="54" :src="item.avatar || '/static/images/spaceAndMine/defaultAvatar.png'"></el-avatar>
          <div class="live" v-if="item.is_anchor === 1 && item.live.status === 1">直播中</div>
        </div>
        <div class="title">{{ item.username }}</div>
        <div class="lv" :style="{marginLeft: item.stars}">
          <div class="lvRel" v-if="item.stars">
            <el-image class="image-Lv" :src="`/static/images/Lv/Lv${item.stars}.png`"></el-image>
            Lv.{{ item.stars }}
          </div>
          <el-text class="vs">{{ item.live.title }}</el-text>
        </div>
        <div v-if="item.is_anchor === 1 && item.live.status === 1" class="btnDIY rightFirst" @click="pageToRoom(item)">
          进入直播间
        </div>
        <div v-if="item.is_anchor === 1 && item.live.status === 0 && item.live.starttime != 0" class="startBroadcastingSoon rightFirst">
          {{ formatDateLine(item.live.starttime, 'YYYY-MM-DD HH:mm') }}开播
        </div>
        <div v-if="item.is_anchor === 1 && item.live.status === -1" class="notWork rightFirst">
          未开播
        </div>
        <div class="btnDIY rightEnd" :class="{btnDIYCancel: !item.is_follow}" @click="handleFollow(item)">{{ item.is_follow ? '取消关注' : '关注Ta' }}</div>
      </div>
      <div class="viewPort" ref="viewPortDom" v-show="listStatus[tabKey].hasNextPage">
        <el-icon class="is-loading"><Loading /></el-icon>
      </div>
      </template>
    </tabs>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import tabs from './component/tabs.vue'
import Error from './component/Error.vue'
import { myAttentionApi, myFocusApi, unWriterFocusApi } from '@/api'
import { getAttentionFoucusList } from '@/api/user'
import { formatDateLine } from '@/utils/common'

const PAGE_SIZE = 30

/** /api/live/attentionList 字段映射（status: -1未开播 0预约 1直播中） */
function mapLiveAttentionApiRow(row) {
  return {
    uid: row.anchor_id,
    username: row.user_nickname ?? '',
    avatar: row.avatar ?? '',
    is_follow: 1,
    is_anchor: 1,
    stars: null,
    isForbidden: false,
    dzUid: row.anchor_id,
    is_writer: 0,
    live: {
      title: row.title ?? '',
      starttime: row.starttime ?? '',
      status: Number(row.status ?? -1),
      anchor_id: row.anchor_id,
      vid: row.vid ?? ''
    }
  }
}

const store = useStore()
const useLiveAttention = computed(() => {
  const status = store.state.system?.discuz_system?.discuz_status
  return status !== 1 && status !== '1'
})

const showFanMaintenance = computed(() => useLiveAttention.value && tabKey.value === 1)

const viewPortDom = ref<HTMLDivElement>(null)
const tabData = reactive([
  {name: '我的关注', key: 0},
  {name: '我的粉丝', key: 1}
])
const tabKey = ref(0)
const listStatus = reactive({
  '0': {page: 1, allCount: 0, hasNextPage: false},
  '1': {page: 1, allCount: 0, hasNextPage: false}
})
const listData = reactive({
  '0': [],
  '1': []
})

const pageToRoom = item => {
  // @ts-ignore
  $router.push(`/live?router=iframe&uid=${item.uid}&vid=${item.live.vid}`)
}

const pageToOtherInfo = (item) => {
  if (item.isForbidden || !item.dzUid) {
    // @ts-ignore
    return ElMessage.error('您无权限访问该用户')
  }
  // @ts-ignore
  $router.push({
    name: 'otherSpace',
    state: {
      uid: item.dzUid
    }
  })
}

const httpMyFocusApi = (uid, action) => myFocusApi({uid, action})
const httpUnWriterFocusApi = (id) => unWriterFocusApi({id})

const handleFollow = item => {
  ElMessageBox.confirm(`
    <span style='font-size: 14px;line-height: 2;'>
      您要${item.is_follow?"取消":""}关注「<span style='color: #d02d54;'>${item.username}
    </span>」 吗？</span>`, '提示', {
    confirmButtonText: '确 认',
    cancelButtonText: '再想想',
    center: true,
    showClose: false,
    customStyle: {width: '332px'},
    autofocus: false,
    cancelButtonClass: 'elBtn',
    confirmButtonClass: 'elBtn',
    dangerouslyUseHTMLString: true
  }).then(async () => {
    let response = null
    if (item.is_writer === 1) {
      response = await httpMyFocusApi(item.uid, +(!item.is_follow)).catch(res => {
        // @ts-ignore
        ElMessage.error(res.msg)
      })
    } else {
      response = await httpUnWriterFocusApi(item.uid).catch(res => {
        // @ts-ignore
        ElMessage.error(res.msg)
      })
    }
    if (response.code === 0) {
      item.is_follow = +(!item.is_follow)
      // @ts-ignore
      ElMessage.success(response.msg)
      if (item.is_follow === 0) { // 取消关注则前端删除
        listData['0'].splice(listData['0'].findIndex(x => x.uid === item.uid), 1)
      }
    }
  })
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (!listStatus[tabKey.value].hasNextPage) {
        return
      } else {
        listStatus[tabKey.value].page += 1 
      }
      httpMyAttentionApi(listStatus[tabKey.value].page, tabKey.value ? 'fan' : 'follow')
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

const httpMyAttentionApi = async (page = 1, type = 'follow') => {
  // 社区关闭：粉丝列表不请求；关注列表走直播关注接口
  if (useLiveAttention.value && type === 'fan') {
    return {
      data: { list: [] },
      page: { hasNextPage: false, allCount: 0 }
    }
  }

  if (useLiveAttention.value && type === 'follow') {
    const res = await getAttentionFoucusList({ page, limit: PAGE_SIZE })
    const listRaw = Array.isArray(res?.data) ? res.data : []
    const list = listRaw.map(mapLiveAttentionApiRow)
    return {
      data: { list },
      page: {
        hasNextPage: listRaw.length >= PAGE_SIZE,
        allCount: list.length
      }
    }
  }

  return myAttentionApi({ page, type, pre_page: PAGE_SIZE })
}

const httpMyAttention = async () => {
  if (showFanMaintenance.value) {
    return
  }
  listStatus[tabKey.value].page = 1
  const type = tabKey.value ? 'fan' : 'follow'
  const res = await httpMyAttentionApi(1, type)
  listData[tabKey.value] = res.data.list
  // @ts-ignore
  listStatus[tabKey.value].allCount = res.page.allCount
  // @ts-ignore
  listStatus[tabKey.value].hasNextPage = res.page.hasNextPage
}

watch(tabKey, () => {
  httpMyAttention()
})

onMounted(async () => {
  await httpMyAttention()
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
  padding: 0 18px;
  .card {
    display: grid;
    grid-template:
      "a b c d" auto
      "a e c d";
    grid-template-columns: 54px 1fr auto auto;
    align-items: center;
    gap: 10px 16px;
    padding: 12px;
    border: 1px solid #eff0f3;
    box-shadow: #f9f9f9 0 0 2px;
    border-radius: 6px;
    cursor: pointer;
    .avatarRel {
      position: relative;
      grid-area: a;
      font-size: 0;
      .cursor {
        cursor: pointer;
      }
      .live {
        position: absolute;
        bottom: 0;
        right: 0;
        border-radius: 6.67px 0 6.67px 0;
        box-shadow: #f65f5b 0 1px 1px;
        font-size: 11px;
        font-weight: 500;
        color: #fff;
        padding: 1px 2.5px;
        background-color: #f65f5b;
      }
    }
    .title {
      font-size: 18px;
      font-weight: 400;
      line-height: 1.387;
      color: #333;
      grid-area: b;
    }
    .lv {
      grid-area: e;
      font-size: 0;
      margin-left: 9px;
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
      .vs {
        color: #666;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .btnDIY {
      border: 1px solid #d02d54;
      border-radius: 8px;
      padding: 8px 16px;
      color: #d02d54;
      font-size: 16px;
      cursor: pointer;
      &:where(:active) {
        filter: brightness(110%);
      }
    }
    .btnDIY.btnDIYCancel {
      border: 1px solid #333;
      color: #333;
      &:hover {
        box-shadow: #7f7f7f 0 0 1px;
      }
    }
    .rightFirst {
      grid-area: c;
    }
    .startBroadcastingSoon {
      padding: 6px 6px 6px 28px;
      border-radius: 8px;
      background: url('/static/images/applyAnchorSelect.png') no-repeat;
      background-size: 16px auto;
      background-position: 8px 8px;
      font-size: 14px;
      font-weight: 400;
      background-color: #ffeeee;
      color: #d02d54;
    }
    .notWork {
      font-size: 14px;
      font-weight: 400;
      padding: 6px 6px 6px 28px;
      color: #999;
    }
    .rightEnd {
      grid-area: d;
    }
  }
  .viewPort {
    text-align: center;
    height: 60px;
    line-height: 60px;
  }
}
</style>

<style lang="scss">
.el-message-box {
  padding: 24px;
}
.el-button.elBtn {
  width: 134px;
  height: 38px;
  color: #333;
  font-size: 16px;
  border-color: #333;
  &:hover {
    background-color: #fff;
  }
}
.el-message-box__btns .el-button.elBtn.el-button--primary {
  background-color: #fff;
  color: #d02d54;
  border-color: #d02d54;
}
</style>