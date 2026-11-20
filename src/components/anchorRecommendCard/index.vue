<!-- 主播推荐-卡片 -->
<template>
  <div class="anchorRecommendCard" @click="openPage">
    <div class="inner-box">
      <div class="grid-avatar">
        <df-image-lazy
          class="avatar"
          placeholder-src="/static/images/avatar.png"
          :src="$common.avatarHandler(props.info.user.avatar)"
        />
      </div>
      <div class="grid-info">
        <el-text class="nickname" truncated>{{ props.info.user.user_nickname }}</el-text>
        <div class="heat">
          <el-text class="num">{{ props.info.heat }}</el-text>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup name="AnchorRecommendCard" lang="ts">
import { useRouter } from 'vue-router'
import { getQueryString } from '@/utils'
defineOptions({
  name: 'AnchorRecommendCard',
  inheritAttrs: true
})

const router = useRouter()
const props = defineProps({
  info: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const openPage = () => {
  if (props.info.is_live) {
    const live_path = `/live?router=live&uid=${props.info.user.id}`
    let route = router.resolve({ path: live_path, query: { ...getQueryString(live_path) } })
    window.open(route.href, '_self')
  } else {
    const url = `/search?name=${props.info.user.id}&checkOther=1`
    let route = router.resolve({ path: url, query: { ...getQueryString(url) } })
    window.open(route.href, '_self')
  }
}
</script>
<style lang="scss" scoped>
.anchorRecommendCard {
  width: 100%;
  padding: 4px;
  border-radius: 8px;
  box-shadow: 0px 6px 12px 0px rgba(99, 69, 83, 0.05);
  .inner-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  cursor: pointer;
  & + & {
    margin-top: 24px;
  }
  &:hover {
    background: var(--el-hover-background-color);
    .nickname {
      color: var(--el-primary-text-color-2);
    }
  }
  .grid-avatar {
    position: relative;
    width: 72px;
    height: 72px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 100%;
  }
  .avatar {
    @include imageStyle-cover;
  }
  .grid-info {
    display: flex;
    justify-content: space-between;
    margin-left: 12px;
  }
  .nickname {
    @include fontStyle-Headline3-Medium;
    width: 125px;
    color: var(--el-text-color-primary);
  }
  .heat {
    display: flex;
    align-items: center;
    position: relative;
    font-size: 0;
    .icon {
      width: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: middle;
    }
    .num {
      @include fontStyle-body3-Regular;
      max-width: 52px;
      color: var(--el-text-color-placeholder);
      margin-left: 4px;
      display: inline-block;
      vertical-align: middle;
      margin-top: 4px;
    }
  }
}
</style>
