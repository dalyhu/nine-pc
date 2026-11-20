<template>
  <div class="foucus-match">
    <section class="content-box">
      <!-- <section class="content-box" v-infinite-scroll="loadMore" infinite-scroll-immediate="false"> -->
      <div class="item-li flex flex-wrap" v-for="(item, index) in dataList.sort((a, b) => b.status - a.status)" :key="index">
        <div class="left">
          <df-image-lazy
            fit="cover"
            placeholder-src="/static/images/avatar.png"
            :src="item.avatar"
          />
        </div>

        <!--  -1 未开播，0 预约直播，1 直播中 -->
        <div :class="`right flex right-b_${item.status}`">
          <div class="item-name">
            <span>{{ item.user_nickname }}</span>
            <span class="title" v-if="+item.status !== -1">
              <df-marquee :spacing="50">{{ item.title }}</df-marquee>
            </span>
          </div>

          <div class="last-button flex">
            <df-image-lazy
              class="item-icon"
              v-if="item.status == 1"
              src="/static/images/icon_state.png"
            />
            <div class="txt" @click="goToLive(item)">
              <div v-if="isStatusFun(item)">开播时间</div>
              <div :class="{ 'reserve-style': isStatusFun(item) }">{{ returnStatusTxt(item) }}</div>
            </div>
          </div>

          <!-- <div class="un-follow" @click="handleClose(item)">取消关注</div> -->
        </div>
      </div>
    </section>

    <!-- 取消关注2次提示 -->
    <DfDialog
      v-model:isDialog="isDialog"
      closeTest="取消"
      :showText="`您确定对主播【${itemAnchor?.user_nickname}】取消关注吗?`"
      @_updataAttentFun="_updataAttentFun"
    />
  </div>
</template>

<script>
import { attentionList, attention } from '@/api/user.js'
import dfMarquee from '@/components/dfMarquee/index.vue'
import { defaultAvatar, getBaseUrl } from '@/utils/common'
export default {
  name: 'FoucusAnchorMatch',
  components: { dfMarquee },
  props: {
    dataList: {
      type: Array
    },
    isForum: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultAvatar,
      itemAnchor: null,
      isDialog: false
    }
  },
  methods: {
    _updataAttentFun() {
      attention({ id: this.itemAnchor?.anchor_id })
        .then(() => {
          this.$emit('getMore')
          this.isDialog = false
          ElMessage({ message: '操作成功!', type: 'success' })
        })
        .catch(() => {
          this.isDialog = false
        })
    },

    // 取消关注
    handleClose(item) {
      this.isDialog = true
      this.itemAnchor = item
    },

    // 开播状态
    isStatusFun(item) {
      return item.status !== 1 && item.status !== -1
    },

    // 返回状态文本， -1 未开播，0 预约直播，1 直播中
    returnStatusTxt(data) {
      if (data.status === 1) return '直播中'

      if (data.status === -1) return '未开播'

      let strs = ''
      if (data.starttime) {
        strs = `${this.$common.timeStamp1(data.starttime)}`
      }
      return strs?.replaceAll('-', '/')
    },
    // 加载更多
    // loadMore() {
    //   if (!this.isLoading) {
    //     this.$emit('getMore')
    //   }
    // },
    // 跳转直播
    goToLive(data) {
      // 直播中，并且当前不在该直播间，才可以跳转
      if (this.isForum) return
      if (data.status !== 1 || data.anchor_id == this.$route.query.uid) return
      window.open(`${getBaseUrl()}/live?router=chatWin&uid=${data.anchor_id}`, '_self')
    }
  }
}
</script>

<style lang="scss" scoped>
.foucus-match {
  padding: 0 0 10px;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
  }
  .item-li {
    font-size: 12px;
    padding: 9px 12px;
    flex-wrap: nowrap !important;
    border-bottom: 1px solid #efefef;
    .left {
      margin-right: 15px;
      width: 40px;
      .el-image {
        width: 100%;
        height: 40px;
        border-radius: 50%;
      }
    }
    .right {
      flex: 1;
      position: relative;
      .item-icon {
        width: 12px;
        margin-right: 5px;
      }
      .item-name {
        font-size: 12px;
        color: #000;
        font-weight: 550;
        display: flex;
        flex-direction: column;
        .title {
          color: #525252;
          font-weight: 400;
          margin-top: 10px;
          max-width: 178px;
        }
      }
      .txt {
        font-size: 12px;
        color: #525252;
        text-align: right;
      }
      &:hover {
        .un-follow {
          display: block;
        }
      }
      .un-follow {
        display: none;
        position: absolute;
        right: 82px;
        top: 50%;
        transform: translateY(-50%);
        width: 82px;
        height: 36px;
        background: #fff;
        text-align: center;
        line-height: 36px;
        font-size: 14px;
        border-radius: 2px;
        cursor: pointer;
        box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
      }
    }
    .right-b_-1 {
      .last-button {
        background: #f0f0f0;
        padding: 5px;
        border-radius: 3px;
        .txt {
          color: #a8a8a8;
        }
      }
    }
    .right-b_1 {
      .title {
        max-width: 210px !important;
      }
      .last-button {
        background: #ebf9ee;
        padding: 5px;
        cursor: pointer;
        border-radius: 3px;
        .txt {
          color: #35924f;
        }
      }
    }
    .reserve-style {
      background: #faeaee;
      color: #d02d54;
      padding: 3px;
      border-radius: 3px;
      margin-top: 10px;
    }
  }
}
</style>
