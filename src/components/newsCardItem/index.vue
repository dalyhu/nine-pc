<!-- 新闻头条 -->
<template>
  <div class="newsCardItem" :class="thumbClass">
    <router-link target="_self" class="grid-link" :to="'/detail?id=' + info.id">
      <div class="inner">
<dfContainer class="left" :height-ratio="56.25">
          <df-image-lazy
   class="figure"
          :src="info.img"
  placeholder-src="/static/images/placeholder_gray_bg.png"
    :alt="info.title"
   :title="info.title"
       />
  </dfContainer>
     <div class="right">
          <div class="title-wrap">
        <div class="title text-clamp2">
  <span v-if="info.is_top === 1" class="tag tag-top">置顶</span>
 {{ info.title }}
       </div>
     </div>
        <div v-if="info.summary" class="summary">{{ info.summary }}</div>
          <div class="meta">
      <div class="tags">
              <span v-if="newsTag" class="tag tag-cat">{{ newsTag }}</span>
    </div>
        <span class="time">{{ formatNewsTime(info.addtime) }}</span>
          </div>
 </div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dfContainer from '@/components/dfContainer/index.vue'
import { formatNewsTime } from '@/utils/common'

const props = defineProps({
  info: {
    type: Object,
    default: () => ({})
  },
  /** fluid | 180x106 | 108x78 */
  thumbSize: {
  type: String,
    default: 'fluid'
  }
})

const thumbClass = computed(() =>
  props.thumbSize && props.thumbSize !== 'fluid'
    ? `newsCardItem--thumb-${props.thumbSize}`
    : ''
)

const newsTag = computed(
  () => props.info.tag || props.info.short_name_zh || props.info.classification_name || ''
)
</script>

<style lang="scss" scoped>
@mixin news-card-thumb-size($width, $height) {
  .grid-link .inner {
    align-items: flex-start;
  }

  .grid-link .inner .left {
    flex-shrink: 0;
    width: $width;
    min-width: $width;
    max-width: $width;
    height: $height;
  }

  .grid-link .inner .right {
    height: $height;
    min-height: $height;
    max-height: $height;
    box-sizing: border-box;
    overflow: hidden;
  }

  .grid-link .inner .left :deep(.df_container) {
    position: relative;
    width: $width;
  height: $height;
  }

  .grid-link .inner .left :deep(.df_container_placeholder) {
    display: none;
  }

  .grid-link .inner .left :deep(.df_container_inner) {
    position: absolute;
    inset: 0;
  }

  .grid-link .inner .left .figure,
  .grid-link .inner .left :deep(img) {
    width: $width;
    height: $height;
    object-fit: cover;
    object-position: center;
  }
}

.newsCardItem {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  font-size: 0;

  .grid-link {
    display: block;
    width: 100%;
    padding: 12px;

    &:hover {
      background: var(--el-hover-background-color);

    .inner .right .title {
        color: var(--el-primary-text-color-2);
      }
    }

    .inner {
      display: flex;
      align-items: flex-start;
      position: relative;
    }

    .left {
      flex-shrink: 0;
      margin-right: 12px;
      overflow: hidden;
      border-radius: 8px;
      text-align: center;

    .figure {
      width: 100%;
        height: 100%;
  }

      :deep(img) {
        @include imageStyle-cover;
      }
    }

    .right {
      display: flex;
      flex: 1;
      flex-direction: column;
      // 不用 space-between，改用 margin-top: auto 推底，避免 title-wrap 被撑高
min-width: 0;
      min-height: 78px;

      .title-wrap {
        display: flex;
   align-items: flex-start;
  gap: 8px;
     min-width: 0;

        .tag-top {
      flex-shrink: 0;
      margin-top: 2px;
        }
   }

      .title {
        flex: 1;
        min-width: 0;
    color: var(--el-text-color-primary);
   white-space: initial;
        word-break: break-word;
     @include fontStyle-body1-Medium;
      }

      .text-clamp2 {
 display: -webkit-box;
  overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
      }

      // 描述字段：标题正下方 6px，单行截断
      .summary {
        margin-top: 6px;
     overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: var(--el-text-color-secondary);
        @include fontStyle-body3-Regular;
      }

      .meta {
 display: flex;
      align-items: center;
        justify-content: space-between;
        // 将 meta 推到 right 底部，不依赖 space-between 撑开父容器
        margin-top: auto;
      padding-top: 8px;
      }

      .tags {
   display: flex;
        flex-wrap: wrap;
        gap: 8px;
    min-width: 0;
      }

      .time {
        flex-shrink: 0;
        margin-left: 12px;
    color: var(--el-text-color-placeholder);
        @include fontStyle-body3-Regular;
      }

      .tag {
        padding: 1px 6px;
        border-radius: 4px;
    font-size: 12px;
        line-height: 18px;
        white-space: nowrap;
      }

      .tag-top {
        color: #d02d54;
        background: rgba(208, 45, 84, 0.1);
      }

      .tag-cat {
        color: #e67e22;
        border: 1px solid #e67e22;
        background: rgba(230, 126, 34, 0.08);
      }
    }
  }

  &:not([class*='--thumb-']) .grid-link .inner .left {
    width: 39.41%;
  }

  &--thumb-180x106 {
    @include news-card-thumb-size(180px, 106px);
  }

  &--thumb-108x78 {
    @include news-card-thumb-size(108px, 78px);
  }
}
</style>
