<!-- 赛事推荐列表项 -->
<template>
  <div class="matchInfoCardItem grid-td">
    <div class="grid-td--left">
      <div class="match-time-info">
        <div class="match-time">{{ props.info.match_time.slice(6, 11) || '-' }}</div>
        <div class="match-date">{{ props.info.match_time.slice(0, 5) || '-' }}</div>
      </div>
      <el-text class="competition-info" truncated>{{ props.info.competition }}</el-text>
    </div>
    <div class="grid-td--main">
      <div class="team-info home-team">
        <df-image-lazy
          placeholder-src="/static/images/placeholder_gray_bg.png"
          :src="props.info.home_team_logo"
          class="team-logo"
        />
        <el-text class="team-name" truncated>{{ props.info.home_team_name || '-' }}</el-text>
      </div>
      <div class="score-info">
        <span>{{ props.info.home_scores || '0' }}</span>
        <span>-</span>
        <span>{{ props.info.away_scores || '0' }}</span>
      </div>
      <div class="team-info away-team">
        <el-text class="team-name" truncated>{{ props.info.away_team_name || '-' }}</el-text>
        <df-image-lazy
          placeholder-src="/static/images/placeholder_gray_bg.png"
          :src="props.info.away_team_logo"
          class="team-logo"
        />
      </div>
    </div>
    <div class="grid-td--right">
      <div class="live-status" :class="{ 'show-panel': props.info.anchor_total > 0 }">
        <el-popover
          trigger="hover"
          placement="bottom"
          width="auto"
          :popper-class="'select-anchor-popover select-anchor-popover-' + props.info.sourceid"
        >
          <template #reference>
            <span class="btn" v-if="props.info.anchor_total > 0">观看直播</span>
          </template>
          <!-- 啊实打实的 -->
          <div class="hover-anchor-panel">
            <div class="panel-title">{{ props.info.anchor_total }}位主播</div>
            <div
              class="anchor-list flex"
              v-for="anchor in props.info.anchor_list"
              :key="anchor.id"
              @click="emits('btnClick', props.info, anchor.id)"
            >
              <span class="anchor-name">{{ anchor.user_nickname }}</span>
              <span class="live-lable">
                <df-image-lazy
                  class="w-20"
                  :src="getImageUrl('/static/images/home/icon-m.png')"
                  placeholder-src="/static/images/placeholder_gray_bg.png"
                />
              </span>
            </div>
          </div>
        </el-popover>
        <div
          v-if="
            (props.info.anchor_total === 0 && [0, 2].includes(props.info.status_type)) ||
            (props.info.status_type === 1 &&
              props.info.anchor_total === 0 &&
              props.info.mlive === 1)
          "
          :class="`btn match-live-${props.info.mlive} status-${props.info.status_type}`"
          @click="
            props.info.mlive === 1 && [1, 2].includes(props.info.status_type)
              ? emits('btnClick', props.info, null, true)
              : false
          "
        >
          {{
            props.info.mlive === 1
              ? '查看详情'
              : props.info.status_type === 0
              ? '敬请期待'
              : '已结束'
          }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup name="MatchInfoCardItem" lang="ts">
import { getImageUrl } from '@/utils/common.js'
defineOptions({
  name: 'MatchInfoCardItem',
  inheritAttrs: true
})

const props = defineProps({
  info: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const emits = defineEmits(['btnClick'])
</script>
<style lang="scss">
.el-popover.el-popper.select-anchor-popover {
  padding: 0;
  .el-popper__arrow {
    opacity: 0;
  }
}
.hover-anchor-panel {
  min-width: 165px;
  width: max-content;
  height: auto;
  // position: absolute;
  bottom: -1px;
  right: 8px;
  z-index: 99;
  padding: 8px;
  border-radius: 2px;
  background: linear-gradient(316.31deg, #13151e 31.05%, #b12043 91.21%);
  box-shadow: 0 6px 12px rgba(99, 69, 83, 0.05);
  .panel-title {
    font-size: 12px;
    padding: 0 0 5px;
    color: #fff0db;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    text-align: left;
  }
  .anchor-list {
    min-width: 100%;
    max-width: max-content;
    padding: 4px 4px;
    margin: 4px 0;
    cursor: pointer;
    color: #fff;
    .anchor-name {
      font-size: 14px;
    }
    .live-lable {
      animation: shining 2s ease infinite alternate;
      display: flex;
      align-items: center;
      .el-image {
        display: flex;
        align-items: center;
      }
    }
    &:hover {
      border-radius: 2px;
      background: linear-gradient(
        116.75deg,
        rgba(255, 139, 70, 0.3) -36.81%,
        rgba(208, 45, 84, 0.3) 69.05%,
        rgba(182, 119, 245, 0.3) 135.08%
      );
    }
  }
}
.show-panel:hover {
  .anchor-icon {
    animation-play-state: paused;
  }
  .hover-anchor-panel {
    display: block;
  }
}
@keyframes shining {
  10% {
    transform: scale(1.2);
  }
  20% {
    transform: scale(1);
  }
  30% {
    transform: rotate(5deg);
  }
  40% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
  60% {
    transform: rotate(-5deg);
  }
  65% {
    transform: rotate(0);
  }
}
</style>
<style lang="scss" scoped>
.grid-td {
  font-size: 0;
  text-align: center;
  padding: 20px;
  background: var(--el-bg-color-overlay);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: -10px;
  &:nth-child(odd) {
    background: var(--el-fill-color-light);
  }
  &--left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // flex: 1;
    margin-top: 10px;
    width: 30%;
  }
  &--main {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex: 1;
    margin-top: 10px;
    width: 57%;
  }
  &--right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 13%;
    margin-top: 10px;
  }
  .team-info {
    width: calc((100% - 80px) / 2);
    display: flex;
    align-items: center;
  }
  .team-logo {
    width: 32px;
    height: 32px;
    border-radius: 100%;
    flex-shrink: 0;
    object-fit: cover;
  }
  .home-team {
    .team-logo {
      margin-right: 12px;
    }
  }
  .away-team {
    justify-content: flex-end;
    .team-logo {
      margin-left: 12px;
    }
  }
  .team-name {
    color: var(--el-text-color-primary);
    @include fontStyle-Headline3-Medium;
  }
  .score-info {
    min-width: 80px;
    padding: 2px 12px;
    border-radius: 999px;
    background: var(--el-warning-background---el-color-warning-9);
    text-align: center;
    color: var(--el-warning-text-color-2);
    font-size: 14px;
    @include fontStyle-body1-Medium;
  }
  .competition-info {
    flex: 1;
    @include fontStyle-Headline3-Medium;
    padding: 0 5px 0 15px;
  }
  .match-time {
    color: var(--el-text-color-regular);
    @include fontStyle-body1-Medium;

    font-size: 16px;
  }
  .match-date {
    @include fontStyle-body3-Regular;
    color: var(--el-text-color-placeholder);
  }
  .live-status {
    position: relative;
    min-width: 80px;
    @include fontStyle-body1-Medium;
    .btn {
      padding: 4px 12px;
      border-radius: 999px;
      background: var(--el-error-background-color-8);
      color: var(--el-primary-text-color-2);
      font-size: 14px;
      cursor: pointer;
      &.match-live-0 {
        pointer-events: none;
        background: var(--el-fill-color-darker);
        color: var(--el-color-info-light-3);
      }
      /* 赛事推荐列表的查看详情按钮暂时隐藏，因为里面的页面来不及改版 */
      &.match-live-1 {
        opacity: 0;
        pointer-events: none;
      }
    }
  }
}
</style>
