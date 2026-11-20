<template>
    <!-- 常用前三英雄展示 -->
    <div class="hero-top flex">
      <div v-for="(item, index) in heroTopList" :key="index" class="flex-name" :class="{ 'insert-div': item.insertText }">
        <div v-if="item.insertText" class="gray-name">{{ item.insertText }}</div>
        <div v-if="item.insertText" class="gray">胜 / 负</div>
        <div v-if="!item.insertText" class="avater"><img :src="item.logo || defaultImage" alt="logo" width="100%" height="100%"/></div>
        <div v-if="!item.insertText" class="gray">{{ item.win }}/{{ item.lose }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    leftRoles: {
      type: Array,
      default: () => []
    },
    rightRoles: {
      type: Array,
      default: () => []
    }
  });
  const heroTopList = computed(() => {
    if (props.leftRoles && props.leftRoles.length && props.rightRoles && props.rightRoles.length) {
      return [...props.leftRoles.slice(0, 3), { insertText: '常用英雄' }, ...props.rightRoles.slice(0, 3)];
    }
    return [];
  });

  const defaultImage = '/static/images/theme/personalCenter/default_avatar.png'
  </script>
  
  <style scoped lang="scss">
  .hero-top {
    .flex-name {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-wrap: nowrap;
      width: 33px;
      &.insert-div {
        flex:1;
      }
    }
    .avater {
      margin-bottom: 5px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      overflow: hidden;
    }
    .gray {
      font-size: 12px;
      color: #999;
    }
    .gray-name {
      font-size: 14px;
      color: #999;
      text-align: center;
    }
  }
  </style>
  