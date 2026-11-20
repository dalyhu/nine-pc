<template>
  <div class="gift_detail_pop">
    <div class="gift_detail_box">
      <div class="gift_pic_box">
        <df-image-lazy
          fit="cover"
          class="gift_pic"
          :src="props.data.gifticon"
          placeholder-src="/static/images/placeholder_gray_bg.png"
        />
      </div>
      <div class="gift_detail_box_inner">
        <div class="gift_name">{{ props.data.giftname }}</div>
        <div class="gift_price_box">
          <img src="./images/diamond.png" class="gift_price_icon" /><span class="gift_price_num">{{
            props.data.needcoin
          }}</span>
        </div>
        <div class="gift_info_box">{{ props.data.info }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
</script>
<style scoped lang="scss">
.gift_detail_pop {
  padding: 8px;
  background-color: var(--el-fill-color-extra-light);
  .gift_detail_box {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 22px;
    .gift_pic_box {
      padding: 6px;
      margin-right: 4px;
    }
    .gift_pic {
      width: 44px;
      height: 44px;
    }
    .gift_detail_box_inner {
      flex: 1;
      overflow: hidden;
    }
    .gift_name {
      margin-bottom: 4px;
      color: var(--el-text-color-primary);
      white-space: nowrap;
      overflow: hidden;
      width: 100%;
      text-overflow: ellipsis;
    }
    .gift_price_box {
      display: flex;
      align-items: flex-start;
      margin-bottom: 4px;
      .gift_price_icon {
        width: 26px;
        height: 26px;
        margin-right: 3px;
      }
      .gift_price_num {
        color: var(--el-color-primary);
      }
    }
    .gift_info_box {
      white-space: wrap;
      word-break: break-all;
      color: var(--el-text-color-placeholder);
    }
  }
}
</style>
