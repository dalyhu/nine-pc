<!-- 直播列表 -->
<template>
  <div class="df-live-card-item" @click="goLivePage(item)">
    <liveIcon />
    <div class="top">
      <df-image-lazy
        class="thumbnail"
        :src="item.thumb"
        placeholder-src="/static/images/placeholder_gray_bg.png"
        error-icon="/room.webp"
        fit="cover"
        :binding="isIndex ? 300 : 0"
      />
      <div class="flex-align-center anchor-info">
        <dfContainer class="avatar" :height-ratio="100">
          <df-image-lazy
            :src="$common.avatarHandler(item.avatar)"
            class="avatar_img"
            fit="cover"
            :error-icon="defaultAvatar"
          />
        </dfContainer>
        <el-text class="nickname" truncated>{{ item.user_nickname }}</el-text>
      </div>
    </div>
    <div class="bottom">
      <div class="df-row">
        <el-text class="title" size="large" truncated>
          {{ item.title_main || (item.title.split(' ').length === 2
              ? item.title.split(' ').slice(1, item.title.split(' ').length).join()
              : item.title)}}
        </el-text>
      </div>
      <div class="df-row live-info-desc">
        <!-- 联赛名，可能为空值 -->
        <el-text class="desc" truncated>
          {{ item.title_sub || (item.title.split(' ').length === 2 ? item.title.split(' ')[0] : '&nbsp;') }}
        </el-text>
        <el-text class="heat" size="small">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="13"
            viewBox="0 0 12 13"
            fill="none"
          >
            <g clip-path="url(#clip0_2722_20738)">
              <path
                d="M6 11.5C8.05868 11.5 9.74995 9.86855 9.74995 7.77453C9.74995 7.26045 9.72383 6.70938 9.43888 5.8529C9.15393 4.99645 9.09653 4.8859 8.79523 4.35698C8.6665 5.43635 7.97775 5.8862 7.80277 6.02065C7.80277 5.88077 7.38612 4.33397 6.7544 3.40847C6.13425 2.5 5.29085 1.90398 4.79633 1.5C4.79633 2.26744 4.58047 3.40848 4.27135 3.98985C3.96222 4.57123 3.90417 4.5924 3.51805 5.02505C3.13195 5.4577 2.95472 5.59132 2.63185 6.11627C2.30899 6.64125 2.25 7.34045 2.25 7.85453C2.25 9.94855 3.94132 11.5 6 11.5Z"
                stroke="#A8ABB2"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_2722_20738">
                <rect width="12" height="12" fill="white" transform="translate(0 0.5)" />
              </clipPath>
            </defs>
          </svg>
          {{ item.heat }}
        </el-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getQueryString } from '@/utils'
import liveIcon from '@/components/liveIcon.vue'
import dfContainer from '@/components/dfContainer/index.vue'
import { defaultAvatar } from '@/utils/common'

const router = useRouter()
defineProps({
  item: {
    type: Object,
    default: () => {
      return {}
    }
  },
  isIndex: {
    type: Boolean,
    default: false
  }
})

const playerIframe = document.querySelector('.iframe-container') as HTMLIFrameElement
const goLivePage = (item) => {
  playerIframe &&
    playerIframe.contentWindow.postMessage(
      {
        messageType: 'controlIframe',
        event: 'pause'
      },
      '*'
    )
  const live_path = `/live?router=main&uid=${item.uid}`
  let route = router.resolve({ path: live_path, query: { ...getQueryString(live_path) } })
  window.open(route.href, '_self')
}
</script>

<style lang="scss" scoped>
.df-live-card-item {
  position: relative;
  cursor: pointer;
  background-color: var(--el-bg-color-overlay);
  transition: transform 0.2s;
  border-radius: 8px;
  overflow: hidden;
  &:hover {
    transform: translateY(-6px);
  }
  width: 100% !important;
}
.top {
  position: relative;
  width: 100%;
  padding-bottom: 50%;
}
.thumbnail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.bottom {
  text-align: left;
  padding: 8px;
  background-color: var(--el-bg-color-overlay);
}
.title {
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 22px;
}
.desc {
  color: var(--el-text-color-placeholder);
  line-height: 22px;
}
.row-roomInfo {
  margin-top: 8px;
}
.anchor-info {
  // width: 61%;
  position: absolute;
  bottom: 0;
  padding: 3px 12px;
  z-index: 1;
  width: 100%;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.5));
  // .img_box {
  //   width: 30px;
  //   height: 30px;
  //   border-radius: 50%;
  // }
  .avatar_img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.avatar {
  width: 14.95%;
  border-radius: 100%;
  margin-right: 4px;
}
.nickname {
  color: #fff;
  line-height: 22px;
  word-break: break-word;
  max-width: 81.3%;
}
.live-info-desc {
  display: flex;
  justify-content: space-between;
}
.heat {
  color: var(--el-text-color-placeholder);
  line-height: 20px;
  margin-left: 9%;
  display: flex;
  align-items: center;
  svg {
    margin-bottom: 1px;
  }
}
</style>
