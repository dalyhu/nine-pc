<template>
  <div v-if="props.data.msgType === 0" class="pin_text_msg_box">
    <div class="pin_msg_box_title">置顶消息</div>
    <div class="pin_text_msg_box_content">
      <df-collapse :preview-rows="1">
        <div v-html="formatTextMsg(props.data.content)"></div>
        <template #statusIcon="{ isExpand }">
          <IconDoubleArrow class="pin_text_msg_box_icon" :class="{ is_expand: isExpand }" />
        </template>
      </df-collapse>
    </div>
  </div>
  <!-- 图片 -->
  <div v-else-if="props.data.msgType === 2" class="pin_img_text_msg_box">
    <el-image
      class="pin_msg_box_img"
      fit="cover"
      :src="props.data.content"
      :preview-src-list="[props.data.content]"
      :hide-on-click-modal="true"
    />
    <div class="pin_msg_box_detail">
      <div class="pin_msg_box_title">置顶消息</div>
      <div class="pin_msg_box_content">[图片]</div>
    </div>
  </div>
  <!-- 公告 -->
  <div v-else-if="props.data.msgType === 3" class="pin_img_text_msg_box">
    <el-image
      class="pin_msg_box_img"
      fit="cover"
      :src="props.data.img"
      :preview-src-list="[props.data.img]"
      :hide-on-click-modal="true"
    />
    <div class="pin_msg_box_detail is_link" @click="openLink(props.data.link)">
      <div class="pin_msg_box_title">{{ props.data.title }}</div>
      <div class="pin_msg_box_content" v-html="formatTextMsg(props.data.content)"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import IconDoubleArrow from '@/components/icons/iconDoubleArrow.vue'
import { formatTextMsg } from '@/utils/common'
import { openLink } from '@/components/chatBox/chatHelper'

const props = defineProps({
  data: {
    type: Object,
    default: () => null
  }
})
</script>
<style lang="scss" scoped>
.pin_img_text_msg_box,
.pin_text_msg_box {
  padding: 4px 12px;
  background-color: var(--el-bg-color-overlay);
  border-bottom: 1px solid var(--el-border-color-extra-light);
}
.pin_msg_box_title,
.pin_msg_box_content {
  font-size: 14px;
  line-height: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.pin_text_msg_box {
  .pin_text_msg_box_content {
    color: var(--el-text-color-primary);
    font-size: 14px;
    line-height: 20px;
    :deep(.text_link) {
      text-decoration: underline;
      color: #025be8;
      font-size: 14px;
      line-height: 20px;
      margin-left: 2px;
      margin-right: 2px;
      display: inline-block;
      vertical-align: top;
    }
    :deep(.df_collapse) {
      padding-right: 18px;
    }
    :deep(> img) {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-left: 2px;
      margin-right: 2px;
      vertical-align: top;
    }
  }
  :deep(.expand_btn) {
    width: 18px;
    height: 18px;
    background-color: transparent;
    top: 0;
    right: 0;
  }
  .pin_text_msg_box_icon {
    stroke: var(--el-color-primary);
    &.is_expand {
      transform: rotate(180deg);
    }
  }
}
.pin_msg_box_title {
  color: var(--el-color-primary);
  margin-bottom: 2px;
  white-space: nowrap;
}
.pin_msg_box_content {
  color: var(--el-text-color-primary);
  white-space: pre-wrap;
  word-break: break-all;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  :deep(.text_link) {
    text-decoration: underline;
    color: #025be8;
    font-size: 14px;
    line-height: 20px;
    margin-left: 2px;
    margin-right: 2px;
    display: inline-block;
    vertical-align: top;
  }
  :deep(> img) {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-left: 2px;
    margin-right: 2px;
    vertical-align: top;
  }
}
.pin_img_text_msg_box {
  display: flex;
  align-items: center;

  .pin_msg_box_img {
    width: 38px;
    height: 38px;
    border-radius: 4px;
    margin-right: 4px;
    flex-shrink: 0;
  }
  .pin_msg_box_detail {
    flex: 1;
    overflow: hidden;
    &.is_link {
      cursor: pointer;
    }
  }
}
</style>
