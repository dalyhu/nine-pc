<template>
    <div class="small-title flex">
      {{ title }}
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: {
      type: String,
      default: '请设置标题名称'
    }
  });
  </script>
  
  <style lang="scss" scoped>
  .small-title {
    margin-top: 24px;
    font-size: 16px;
    font-weight: 500;
    color: #000;
    justify-content: center;
  }
  </style>
  