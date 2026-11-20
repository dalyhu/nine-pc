<template>
  <div class="item">
    <!--上面部分 赛事名称和头像 进行中-->
    <div class="item-header">
      <div class="item-header__top">
        <span class="name ellipsis">{{ match.competition }}</span>
        <!-- <el-avatar
          v-if="match.status_type === 1 && match.anchor.length"
          :src="match.anchor[0].avatar"
          :size="24"
        ></el-avatar> -->
        <df-image-lazy
          v-if="match.status_type === 1 && match.anchor.length"
          :src="$common.avatarHandler(match.anchor[0].avatar)"
          class="avatar-iamge"
        />
        <template v-if="match.status_type == 0">
          <p class="reserve" v-if="match.reserve == 0" @click="getReserveMatch"></p>
          <p class="reserve reserved" v-else @click="getReserveMatch">已预约</p>
        </template>
      </div>
      <p class="item-header__status">{{ match.status_type === 1 ? '进行中' : match.match_time }}</p>
    </div>
    <!-- 这里是赛事的信息 队标 队名 比分 -->
    <div class="item-content">
      <div class="item-content__team">
        <df-image-lazy
          fit="cover"
          :src="match.home_team_logo ? match.home_team_logo : teamLogo"
          :error-icon="teamLogo"
          placeholder-src="/static/images/placeholder_gray_bg.png"
        />
        <p class="name ellipsis">{{ match.home_team_name }}</p>
        <span style="flex: 1"></span>
        <p>{{ match.home_scores }}</p>
      </div>
      <div class="item-content__team">
        <df-image-lazy
          fit="cover"
          :src="match.away_team_logo ? match.away_team_logo : teamLogo"
          :error-icon="teamLogo"
          placeholder-src="/static/images/placeholder_gray_bg.png"
        />
        <p class="name ellipsis">{{ match.away_team_name }}</p>
        <span style="flex: 1"></span>
        <p>{{ match.away_scores }}</p>
      </div>

      <!-- 直播赛事hover出现遮罩 -->
      <div
        class="item-content__mask"
        v-show="match.anchor && match.anchor.length > 0"
        @click="openLive"
      >
        <span>进入直播间</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { reserveMatch2 } from '@/api/user.js'

import { ILiveMatchItem } from './types'
import teamLogo from '/static/images/team.png'
import { ResponseStatus } from '@/enums/response'
import { getQueryString } from '@/utils'
import { useRouter } from 'vue-router'
import { defaultAvatar } from '@/utils/common'

const props = defineProps<{
  match: ILiveMatchItem
}>()

const isLogin = computed(() => !!store.state.user.infoData.id)
const emit = defineEmits(['reserve'])
const store = useStore()
/** 这里进行预约与取消预约的操作**/
const getReserveMatch = async () => {
  // 1 未登录状态 提示登陆
  if (!isLogin.value) {
    store.commit('user/SET_LOGIN_MASK', true)
    return false
  }

  // 2 预约 /  取消预约
  const res = await reserveMatch2({
    type: props.match.type,
    match_id: props.match.sourceid
  })
  if (res.code === ResponseStatus.Success) {
    let msg = ''
    if (props.match.reserve == 0) {
      msg = '预约成功！'
    } else {
      msg = '取消预约成功！'
    }
    ElMessage.success(msg)

    // 派发时间修改取反
    emit('reserve', props.match.sourceid)
  }
}

const router = useRouter()
// 进入直播间
const openLive = () => {
  if (props.match.anchor.length === 0) {
    return
  }
  const live_path = `/live?router=live&uid=${props.match.anchor[0].id}`
  let route = router.resolve({ path: live_path, query: { ...getQueryString(live_path) } })
  window.open(route.href, '_self')
}
</script>
<style scoped lang="scss">
.avatar-iamge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.item {
  &:hover {
    .item-content__mask {
      opacity: 0.8;
      background-color: #0e1119;
      span {
        display: block;
      }
    }
  }
}
.item-header {
  color: #fff;
  border-bottom: 1px solid #464a5e;

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
      width: 55%;
      line-height: 22px;
      font-size: 14px;
    }

    .reserve {
      width: 60px;
      height: 22px;
      font-size: 12px;
      cursor: pointer;
      opacity: 0.8;
      background: url('/static/images/live/classify/reserve.png') no-repeat center center / 100%
        100%;

      &:hover {
        background-color: rgba(255, 255, 255, 0.15);
      }

      &.reserved {
        background: none;
        text-align: center;
        line-height: 22px;
        border-radius: 4px;
        background-color: hsla(0, 0%, 100%, 0.2);
        color: hsla(0, 0%, 100%, 0.8);
      }
    }
  }

  &__status {
    font-size: 12px;
    line-height: 20px;
    margin-bottom: 5px;
  }
}
.item-content {
  position: relative;
  &__team {
    display: flex;
    color: #fff;
    margin-top: 10px;
    align-items: center;
    .df_image {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }

    .name {
      width: 60%;
      margin-left: 5px;
      font-size: 14px;
    }
  }

  &__mask {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    z-index: 10;
    color: #f0c682;
    text-shadow: 0 2px 7px rgba(0, 0, 0, 0.49);
    will-change: opacity;
    transition: all 0.2s ease-in-out;

    span {
      display: none;
    }
  }
}
</style>
