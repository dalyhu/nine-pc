<!-- 滚动广告 -->
<template>
  <div class="scroll_ads" @click="adsClick">
    <div class="title">
      <div class="icon_box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
        >
          <path
            d="M9.54778 0.00507736C9.33192 -0.015049 8.98914 0.00948524 8.78155 0.217068C8.78155 0.217068 3.7003 4.98265 3.48444 5.19464H1.777C0.820809 5.19464 0 5.96979 0 6.92585L0 10.3883C0 11.3444 0.820863 12.1195 1.77695 12.1195H3.4856C3.70146 12.3338 8.78272 17.0971 8.78272 17.0971C9.00769 17.3221 9.33308 17.3292 9.54894 17.3091C9.9878 17.2677 10.3872 16.8505 10.3872 16.5133C10.3908 16.4754 10.3932 0.840006 10.3872 0.802109C10.3872 0.472746 9.98545 0.0465717 9.54778 0.00507736Z"
            fill="#D02D54"
          />
          <path
            d="M13.8745 4.12652C13.4794 3.73138 12.8389 3.73138 12.4437 4.12652C12.0487 4.52167 12.0487 5.16241 12.4437 5.55761C14.1531 7.26731 14.1531 10.0492 12.4437 11.7589C12.0487 12.1541 12.0487 12.7948 12.4437 13.1899C12.6414 13.3875 12.9002 13.4863 13.1591 13.4863C13.4181 13.4863 13.677 13.3875 13.8745 13.19C16.3727 10.6912 16.3727 6.62536 13.8745 4.12652Z"
            fill="#D02D54"
          />
          <path
            d="M17.333 2.21852C16.9379 1.82337 16.2974 1.8234 15.9023 2.21852C15.5072 2.61367 15.5072 3.25438 15.9023 3.64958C18.6634 6.41143 18.6634 10.9053 15.9023 13.6671C15.5072 14.0623 15.5072 14.7031 15.9023 15.0982C16.0999 15.2957 16.3587 15.3945 16.6177 15.3945C16.8765 15.3945 17.1355 15.2957 17.3329 15.0981C19.0526 13.3779 19.9998 11.0909 19.9998 8.65829C19.9998 6.22559 19.0527 3.93859 17.333 2.21852Z"
            fill="#D02D54"
          />
        </svg>
      </div>
      <el-text class="title_text" truncated>{{ system.video_ad_bar_title }}</el-text>
    </div>
    <div class="ads_text_wrap">
      <df-marquee :spacing="300" v-if="system.video_ad_bar_content">{{
        system.video_ad_bar_content
      }}</df-marquee>
    </div>
  </div>
</template>
<script>
import dfMarquee from '@/components/dfMarquee/index.vue'

export default {
  name: 'ScrollAds',
  components: { dfMarquee },
  computed: {
    system() {
      return this.$store.state.system
    }
  },
  methods: {
    adsClick() {
      if (!this.system.textLinkUrl) return
      let newTab = window.open('about:blank')
      newTab.location.href = this.system.textLinkUrl
    }
  }
}
</script>
<style lang="scss" scoped>
.scroll_ads {
  cursor: pointer;
  height: 32px;
  display: flex;
  align-items: center;
  overflow: hidden;
  flex: 1;
  .title {
    min-width: 80px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: var(--el-text-color-primary);
    font-family: var(--fontFamily-PingFangSC);
    font-size: 14px;
    font-weight: 700;
    height: 100%;
    line-height: 32px;
    padding: 0 5px;
    text-align: center;
    flex-shrink: 0;
    border-radius: 4px;
    max-width: 33.33%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }
  .ads_text_wrap {
    height: 100%;
    padding: 0 9px;
    box-sizing: border-box;
    flex: 1;
    overflow: hidden;
    :deep(.df_marquee_inner_box) {
      color: var(--el-text-color-primary);
      font-size: 14px;
      font-family: var(--fontFamily-PingFangSC);
      font-weight: 400;
    }
  }
  .icon_box {
    width: 24px;
    height: 24px;
    min-width: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 3px;
  }
  .title_text {
    color: var(--el-text-color-primary);
    font-size: 14px;
    font-weight: 700;
  }
}
</style>
