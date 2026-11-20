<template>
  <div class="mainBody">
    <div class="flexSB">
      <span class="recordTxt">开播记录</span>
      <div class="btnAddBook" @click="createRoom">
        <img class="iconBook" src="/static/images/spaceAndMine/applyAnchor.svg">
        <span class="addBook">我要开播</span>
      </div>
    </div>
    <div class="ul">
      <div class="cardLi" v-for="item in roomList" :key="item.id">
        <div class="girdRow2">
          <div class="titleVS" v-if="item.type != 4">
            <span class="category">主</span>
            <span class="teamNameLeft">{{ item.home_name }}</span>
            <img class="iconVS" src="/static/images/vs.png" />
            <span class="teamNameRight">{{ item.away_name }}</span>
            <span class="category">客</span>
          </div>
          <div class="btnGrp" v-if="item.islive != 2">
            <div class="btn" @click="updateRoom(item)">设置</div>
            <div class="btn btnClose" :class="{btnOpen: !item.islive}" @click="setStatus(item.islive, item.id)">
              {{ !item.islive ? '开播' : '关播'}}
            </div>
          </div>
          <div class="btnGrp" v-else></div>
          <div class="detailsGame">
            赛事分类：{{ item.typeName }}
            <span class="spacer">|</span>
            赛事名称：{{ item.name }}
            <span class="spacer">|</span>
            赛事时间：{{ item.type != 4 ? item.addtime.slice(0, 10) : '' }}
          </div>
        </div>
        <div class="line"></div>
        <div class="titleTime">
          主标题：{{ item.title_main }}<span class="spacer">|</span>
          副标题：{{ item.title_sub }}<span class="spacer">|</span>
          开播时间：{{ item.starttime ? formatDate(item.starttime, 'YYYY-MM-DD HH:mm') : '' }}
        </div>
        <div class="detailsGame">
          <span class="tagRadius greyTag" :class="{redTag: item.islive === 1}">
            直播状态：{{ statusTxt[item.islive] }}
          </span>
          <span class="tagRadius greyTag" :class="{yellowTag: item.islive != 0}">直播时长：{{ item.live_duration }}</span>
          <span class="tagRadius greyTag" :class="{greenTag: item.islive != 0}">观看人数：{{ item.viewers }}</span>
          <span class="tagRadius greyTag" :class="{purpleTag: item.islive != 0}">获得钻石：{{ item.hotvotes }}</span>
        </div>
      </div>
      <el-empty v-show="roomList.length === 0" image="/static/images/spaceAndMine/emptyBox.png" description="暂无直播">
        <el-text style="color: #666">您目前还没有直播唷！</el-text>
      </el-empty>
      <div class="viewPort" ref="viewPortDom" v-show="hasNextPage">
        <el-icon class="is-loading"><Loading /></el-icon>
      </div>
    </div>
    <broadcastModal ref="broadcastModalRef"></broadcastModal>
  </div>
</template>

<script setup>
import {getRoomListApi, openRoomApi, closeRoomApi} from '@/api'
import { Loading } from '@element-plus/icons-vue'
import broadcastModal from './modal/broadcastModal.vue'
import { formatDate } from '@/utils/common'

const roomList = reactive([])
let listPage = 1
const viewPortDom = ref(null)
const broadcastModalRef = ref(null)
const hasNextPage = ref(false)
const statusTxt = ['未直播', '直播中', '已关播']

const updateRoom = item => {
  const url = item.push.split('/live/')
  Object.assign(broadcastModalRef.value.form, {
    type: item.type,
    title: item.title,
    showTitle: item.title.slice(0, (item.title?.indexOf(' ') || item.title.length)),
    title_main: item.title_main,
    title_sub: item.title_sub,
    thumb: item.thumb || '/room.webp',
    localThumb: item.thumb === '/room_zr.png' || item.thumb === '/room.webp' ? '/room.webp' : undefined,
    starttime: formatDate(item.starttime),
    id: item.id,
    match_id: item.match_id,
    gameSort: item.type,
    status_str: statusTxt[item.islive],
    competition_name_zh: item.name,
    urlDomain: url.length === 2 ? url[0] + '/live/' : '',
    urlKeys: url.length === 2 ? url[1] : ''
  })
  broadcastModalRef.value.isUpdate = true
  broadcastModalRef.value.outVisible = true
}
const setStatus = async (islive, id) => {
  if (islive == 0) {
    await openRoomApi({id}).then(() => ElMessage.success('已开启直播'))
  } else {
    await closeRoomApi({id}).then(() => ElMessage.success('已关闭直播'))
  }
  httpGetRoomList()
}
const createRoom = () => {
  broadcastModalRef.value.outVisible = true
  broadcastModalRef.value.isUpdate = false
}
const httpGetRoomList = (page = 1) => {
  getRoomListApi({page}).then(res => {
    hasNextPage.value = res.has_more
    roomList.splice(0, page === 1 ? roomList.length : 0, ...res.data.data)
  })
}
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (!hasNextPage.value) {
        return
      } else {
        listPage += 1
      }
      httpGetRoomList(listPage)
    } else {
      // dom隐藏时候做点什么
    }
  })
})

onActivated(() => {
  listPage = 1
  httpGetRoomList(1)
  if (viewPortDom.value) {
    // @ts-ignore
    observer.observe(viewPortDom.value)
  }
})
onUnmounted(() => {
  if (viewPortDom.value) {
    observer.unobserve(viewPortDom.value)
  }
})

// 向子组件提供查询方法，以便提交后更新数据
defineExpose({httpGetRoomList})
</script>

<style scoped lang="scss">
.mainBody {
  position: relative;
  padding: 32px 24px;
  .flexSB {
    position: sticky;
    top: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    margin-bottom: 16px;
    box-shadow: 0px -32px 0 32px #fff;
    background-color: #fff;
    .recordTxt {
      color: #3f3f3f;
      font-size: 14px;
      font-weight: 600;
    }
    .btnAddBook {
      width: 118px;
      height: 36px;
      line-height: 36px;
      padding: 0 8px;
      margin: 0 0 0 auto;
      border: 1px solid #333;
      border-radius: 8px;
      cursor: pointer;
      .iconBook {
        width: 24px;
        margin-right: 8px;
      }
    }
  }
  .ul {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background-color: #f9fafb;
    border-radius: 8px;
    padding: 12px;
    .cardLi {
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #e6e7eb;
      background-color: #fff;
      .girdRow2 {
        display: grid;
        grid-template: 'a b' auto
                       'c b' auto / 1fr auto;
        gap: 8px 0;
        align-items: center;
        .titleVS {
          font-size: 16px;
          color: #333;
          font-weight: bold;
          .category {
            padding: 7px 4px;
            font-weight: 600;
            font-size: 12px;
            border-radius: 4px;
            color: #e23434;
            background-color: #fcebeb;
          }
          .teamNameLeft {
            margin-left: 4px;
          }
          .teamNameRight {
            margin-right: 4px;
          }
          .iconVS {
            width: 24px;
            margin: 0 8px;
            vertical-align: middle;
          }
        }
        .btnGrp {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 104px;
          grid-area: b;
          .btn {
            color: #333;
            border: 1px solid #333;
            border-radius: 8px;
            font-size: 14px;
            height: 28px;
            line-height: 28px;
            padding: 0 8px;
            cursor: pointer;
          }
          .btnClose {
            color: #d02d54;
            border-color: #d02d54;
          }
          .btnOpen {
            color: #38b46f;
            border-color: #38b46f;
          }
        }
      }
      .line {
        border-bottom: 1px solid #f1f1f1;
        margin: 8px 0;
      }
      .titleTime {
        margin-bottom: 8px;
        font-weight: 500;
        font-size: 14px;
        color: #000;
        .spacer {
          margin: 0 16px;
          color: #e6e7eb;
        }
      }
      .detailsGame {
        font-size: 14px;
        color: #666;
        .spacer {
          margin: 0 16px;
          color: #e6e7eb;
        }
        .tagRadius {
          border-radius: 8px;
          margin-right: 16px;
          padding: 4px 8px;
        }
        .greyTag {
          color: #666;
          background-color: #f1f1f1;
        }
        .redTag {
          color: #d02d54;
          background-color: #fff2f5;
        }
        .yellowTag {
          color: #d46c00;
          background-color: #fff4e8;
        }
        .greenTag {
          color: #19a055;
          background-color: #eefff3;
        }
        .purpleTag {
          color: #821ad4;
          background-color: #faf2ff;
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