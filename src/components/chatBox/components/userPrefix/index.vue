<template>
  <div class="anchor-tag" v-if="props.data.isAnchor">
    <span>主播</span>
  </div>
  <div
    class="designation-tag"
    :class="`color${props.data.designation_color}`"
    v-else-if="props.data.designation"
  >
    <span>{{ props.data.designation }}</span>
  </div>
  <div
    class="level-tag"
    :class="'level-' + props.data.sender_exp"
    v-else-if="props.data.sender_user_type"
  >
    <span>{{ `Lv.${props.data.sender_exp}`}}</span>
  </div>
</template>
<script setup lang="ts" name="UserPrefix">
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
</script>
<style lang="scss" scoped>
.anchor-tag,
.designation-tag,
.level-tag {
  height: 20px;
  padding: 1px 4px;
  border-radius: 29px;
  margin-right: 4px;
  border-width: 1px;
  border-style: solid;
  > span {
    display: inline-block;
    vertical-align: top;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    line-height: 16px;
  }
  &::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 2px;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
  }
}
.anchor-tag {
  border-color: #a191b1;
  background-color: #2d0d4c;
  &::before {
    background-image: url(/static/images/live/sign/0.png);
  }
}
.designation-tag {
  border-color: #b1a791;
  background-color: #1d130d;
  &::before {
    background-image: url(/static/images/live/sign/1.png);
  }
  &.color2 {
    border-color: #cfb471;
    background-color: #6c1e1e;
    &::before {
      background-image: url(/static/images/live/sign/2.png);
    }
  }
  &.color3 {
    border-color: #3bb9ff;
    background-color: #0c1d47;
    &::before {
      background-image: url(/static/images/live/sign/3.png);
    }
  }
  &.color4 {
    border-color: #f2c98a;
    background-color: #4c2b0d;
    &::before {
      background-image: url(/static/images/live/sign/4.png);
    }
  }
  &.color5 {
    border-color: #ffa31a;
    background-color: #922c00;
    &::before {
      background-image: url(/static/images/live/sign/5.png);
    }
  }
  &.color6 {
    border-color: #f57b48;
    background-color: #5f2403;
    &::before {
      background-image: url(/static/images/live/sign/6.png);
    }
  }
  &.color7 {
    border-color: #9abdff;
    background-color: #262550;
    &::before {
      background-image: url(/static/images/live/sign/7.png);
    }
  }
  &.color8 {
    border-color: #f2851b;
    background-color: #682d09;
    &::before {
      background-image: url(/static/images/live/sign/8.png);
    }
  }
  &.color9 {
    border-color: #e5a7ac;
    background-color: #560a27;
    &::before {
      background-image: url(/static/images/live/sign/9.png);
    }
  }
}
.level-tag {
  padding: 2px 5px 2px 2px;
  border: none;
  background-color: rgba(55, 196, 142, 0.15);
  > span {
    color: rgb(55, 196, 142);
  }
  &::before {
    background-image: url(/static/images/live/level/1.png);
  }
  &.level-2 {
    background-color: rgba(76, 194, 255, 0.15);
    > span {
      color: rgb(76, 194, 255);
    }
    &::before {
      background-image: url(/static/images/live/level/2.png);
    }
  }
  &.level-3 {
    background-color: rgba(255, 145, 75, 0.15);
    > span {
      color: rgb(255, 145, 75);
    }
    &::before {
      background-image: url(/static/images/live/level/3.png);
    }
  }
  &.level-4 {
    background-color: rgba(193, 120, 255, 0.15);
    > span {
      color: rgb(193, 120, 255);
    }
    &::before {
      background-image: url(/static/images/live/level/4.png);
    }
  }
  &.level-5 {
    background-color: rgba(255, 106, 106, 0.15);
    > span {
      color: rgb(255, 106, 106);
    }
    &::before {
      background-image: url(/static/images/live/level/5.png);
    }
  }
  &.level-6 {
    background-color: rgba(108, 149, 255, 0.15);
    > span {
      color: rgb(108, 149, 255);
    }
    &::before {
      background-image: url(/static/images/live/level/6.png);
    }
  }
  &.level-7 {
    background-color: rgba(255, 93, 154, 0.15);
    > span {
      color: rgb(255, 93, 154);
    }
    &::before {
      background-image: url(/static/images/live/level/7.png);
    }
  }
  &.level-8 {
    background-color: rgba(255, 165, 29, 0.15);
    > span {
      color: rgb(255, 165, 29);
    }
    &::before {
      background-image: url(/static/images/live/level/8.png);
    }
  }
  &.level-9 {
    background-color: rgba(230, 68, 107, 0.15);
    > span {
      color: rgb(230, 68, 107);
    }
    &::before {
      background-image: url(/static/images/live/level/9.png);
    }
  }
  &.level-10 {
    background-color: rgba(255, 2, 0, 0.15);
    > span {
      color: rgb(73, 16, 33);
    }
    &::before {
      background-image: url(/static/images/live/level/10.png);
    }
  }
}
</style>
