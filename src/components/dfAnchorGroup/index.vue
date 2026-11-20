<template>
  <div class="anchor-list hide_scrollbar">
    <div class="anchor" v-for="anchor in anchorList" :key="anchor.id" @click="goLive(anchor)">
      <i class="anchor-live" v-if="anchor.is_live"></i>
      <el-avatar
        class="anchor-avatar"
        :size="72"
        :src="anchor.avatar"
        @error="onError(anchor)"
      ></el-avatar>
      <p class="anchor-name">{{ anchor.user_nickname }}</p>
      <p class="anchor-subtitle">{{ anchor.attention }}人关注</p>
      <el-button
        :type="anchor.is_watchlist === 1 ? 'primary' : ''"
        round
        @click.stop="onAttention(anchor)"
      >
        <span class="anchor-button">
          <img
            v-if="anchor.is_watchlist !== 1"
            src="/static/images/search/search-new/add.svg"
            alt=""
          />
          <span v-else>已</span>
          关注
        </span>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IAnchorItem } from './anchor'
import { useStore } from 'vuex'
import { attention } from '@/api/user.js'
import { ResponseStatus } from '@/enums/response'
import { defaultAvatar } from '@/utils/common'
import { getQueryString } from '@/utils'
import { useRouter } from 'vue-router'

defineProps<{
  anchorList: IAnchorItem[]
}>()

const store = useStore()

const isLogin = computed(() => !!store.state.user.infoData.id)

// 头像加载失败时，替换成默认头像
const onError = (anchor: IAnchorItem) => {
  anchor.avatar = defaultAvatar
}

// 定义是否已经关注，然后前端手动去改变
const onAttention = async (anchor: IAnchorItem) => {
  // 没登陆 去登陆
  if (!isLogin.value) {
    store.commit('user/SET_LOGIN_MASK', true)
    return false
  }
  // 已关注 不能继续关注 进行跳转到直播的判断
  if (anchor.is_watchlist === 1) {
    goLive(anchor)
    return false
  }
  try {
    const res = await attention({ id: anchor.id })
    if (res.code === ResponseStatus.Success) {
      // 没有接口改变状态 需要前端来改变状态
      anchor.is_watchlist = 1
      anchor.attention += 1
      ElMessage.success(res.msg)
    }
  } catch (error) {
    console.error(error)
  }
}

const router = useRouter()
// 点击对于的主播，如果正在进行直播则进入直播进
const goLive = (anchor: IAnchorItem) => {
  if (anchor.is_live) {
    const live_path = `/live?router=live&uid=${anchor.id}`
    let route = router.resolve({ path: live_path, query: { ...getQueryString(live_path) } })
    window.open(route.href, '_self')
  }
}
</script>
<style scoped lang="scss">
.anchor-list {
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(auto-fill, 144px);

  .anchor {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 188px;
    background: #fff;
    cursor: pointer;
    transition: transform 0.5s;
    overflow: hidden;

    &:hover {
      transform: translate3d(0, -6px, 0);
    }

    &-live {
      position: absolute;
      top: 0;
      right: 0;
      width: 40px;
      height: 18px;
      background: url('/static/images/search/search-new/anchor-live.svg') no-repeat center center /
        100% 100%;
    }

    &-avatar {
      margin-top: 12px;
    }

    &-name {
      width: 100px;
      margin-top: 12px;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--el-icon-color-primary);
    }

    &-subtitle {
      font-size: 12px;
      margin-top: 3px;
      margin-bottom: 12px;
      color: var(--el-text-color-placeholder);
    }

    &-button {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        margin-right: 4px;
      }
    }
  }
}
</style>
