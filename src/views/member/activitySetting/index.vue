<template>
  <div class="activity_setting my-person-box">
    <div class="header_nav my-person-header">
      <a v-for="item in tabList" :key="item.id">
        <div class="tab_item first_tab_item">
          {{ item.name }}
        </div>
      </a>
    </div>
    <div class="set_main">
      <dfForm></dfForm>
    </div>
  </div>
</template>

<script setup name="activitySetting" lang="ts">
import dfForm from './dfForm.vue'

const tabList = [{ id: 1, name: '绑定账号' }]
</script>

<style scoped lang="scss">
@import '../my-person-header.scss';
.activity_setting {
  .header_nav {
    p {
      flex: 1;
      text-align: right;
      font-size: 16px;
      color: #333;
      font-weight: 700;
    }

    .first_tab_item {
      padding: 14px 35px;
      margin-left: 0;
      background-image: url(/static/images/tab-bar-xuanzhongqianbu.png);
      background-size: 100% 100%;

      &.first-active {
        color: #b08a5b;
        font-weight: 700;
        background-image: url(/static/images/tab-bar-xuanzhong.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .set_main {
    text-align: left;
  }
}
</style>
