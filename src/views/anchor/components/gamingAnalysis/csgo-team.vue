<template>
    <div class="csgo-team-name flex">
      <div class="cs-home">
        <span class="text-clamp">{{ homeData.name }}</span>
        <img :src="homeData.logo || defaultImage" alt="home" width="28px" />
      </div>
      <div class="cs-away">
        <img :src="awayData.logo || defaultImage" alt="away" width="28px" />
        <span class="text-clamp">{{ awayData.name }}</span>
      </div>
    </div>
  </template>
  <script setup>
  defineProps({
    awayData: {
      type: Object,
      default: () => ({})
    },
    homeData: {
      type: Object,
      default: () => ({})
    }
  });
const defaultImage = '/static/images/theme/personalCenter/default_avatar.png'
  </script>
  
  <style lang="scss" scoped>
  .csgo-team-name {
    font-size: 14px;
    .cs-home {
      background: #d02d54;
      margin-right: 2px;
      padding-right: 10px;
      span {
        text-align: right;
        padding-right: 8px;
      }
    }
    .cs-away {
      background: #025be8;
      margin-left: 2px;
      padding-left: 10px;
      span {
        padding-left: 8px;
      }
    }
    .cs-home,
    .cs-away {
      flex: 1;
      display: flex;
      align-items: center;
      height: 32px;
      width: 32px;
      color: #fff;
      span {
        width: calc(100% - 16px);
      }
    }
  }
  </style>
  