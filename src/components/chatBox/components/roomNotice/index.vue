<template>
  <div class="room_notice_comp">
    <DfContainer :height-ratio="25">
      <div class="room_notice_comp_inner_box">
        <div class="title_box"><IconGoldThumbs /><span>主播公告</span></div>
        <div class="main_content_box" v-if="props.data.links?.[0]">
          <div class="main_content_text" :title="props.data.links[0].text_link">
            {{ props.data.links[0].text_link }}
          </div>
          <div class="register_btn" @click="openLink(props.data.links[0].text_link_url)">
            点我注册
          </div>
        </div>
        <!-- <div class="main_content_box second" v-if="props.data.links?.[1]">
          <div class="main_content_text" :title="props.data.links[1].text_link">
            {{ props.data.links[1].text_link }}
          </div>
          <div class="register_btn" @click="openLink(props.data.links[1].text_link_url)">
            发财地址，点我马上注册
          </div>
        </div> -->
        <div class="sub_content_box" :title="props.data.content" v-if="props.data.content">
          {{ props.data.content }}
        </div>
      </div>
    </DfContainer>
  </div>
</template>
<script setup lang="ts">
import IconGoldThumbs from './images/iconGoldThumbs.vue'
import DfContainer from '@/components/dfContainer/index.vue'
import { openLink } from '@/components/chatBox/chatHelper'
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
</script>
<style lang="scss" scoped>
.room_notice_comp {
  flex-shrink: 0;
  margin: 0 12px;
  .room_notice_comp_inner_box {
    height: 100%;
    display: flex;
    flex-direction: column;
    // justify-content: space-around;
    padding: 1.68% 1.88% 0 1.88%;
    position: relative;
    overflow: hidden;
    background: url(./images/main_bg.svg) center top no-repeat;
    background-size: 100% auto;
    color: #fff;
    font-size: 12px;
    border-radius: 0 0 8px 8px;
    &::after {
      content: '';
      position: absolute;
      z-index: 1;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background: url(./images/person_bg.png) right bottom no-repeat;
      background-size: auto 100%;
    }
  }
  .title_box,
  .main_content_box,
  .sub_content_box {
    position: relative;
    z-index: 2;
   
  }
  .title_box {
    display: flex;
    align-items: center;
    height: 17px;
    > * {
      display: block;
    }
    > span {
      font-weight: 500;
      margin-left: 0.2vw;
      line-height: 14px;
    }
  }
  .sub_content_box {
    font-size: 12px;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    word-break: break-all;
    height: 36px;
  }
  .main_content_box {
    display: flex;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    overflow: hidden;
    padding: 10px 0 5px;
    .main_content_text {
      margin-right: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .register_btn {
      padding: 0 6px;
      border-radius: 28px;
      background: linear-gradient(180deg, #ff6d90 0%, #d02d54 100%);
      cursor: pointer;
      flex-shrink: 0;
    }
    &.second {
      .register_btn {
        background: linear-gradient(90deg, #f75531 0%, #ff9317 100%);
      }
    }
  }
}
</style>
