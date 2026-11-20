<template>
  <div class="live_icon">
    <div class="line line_1"></div>
    <div class="line line_2"></div>
    <div class="line line_3"></div>
    <div class="line line_4"></div>
  </div>
</template>

<script>
export default {
  name: 'LiveIcon'
}
</script>

<style lang="scss" scoped>
.live_icon {
  display: flex;
  align-items: flex-end;
  height: 16px;
  position: absolute;
  right: 4px;
  top: 4px;
  z-index: 1;
  padding: 2px;
}
.line {
  animation-iteration-count: infinite;
  animation-duration: 0.4s;
  animation-direction: alternate;
  background-color: #fff;
  width: 2px;
}
.line + .line {
  margin-left: 1px;
}
.line_1 {
  height: 6px;
  animation-name: height_1;
  animation-delay: 0.1s;
}
.line_2 {
  height: 3px;
  animation-name: height_2;
  animation-delay: 0.2s;
}
.line_3 {
  height: 12px;
  animation-name: height_3;
  animation-delay: 0.3s;
}
.line_4 {
  height: 8px;
  animation-name: height_4;
  animation-delay: 0.4s;
}

@keyframes height_1 {
  0% {
    height: 6px;
  }
  100% {
    height: 10px;
  }
}

@keyframes height_2 {
  0% {
    height: 3px;
  }
  100% {
    height: 6px;
  }
}

@keyframes height_3 {
  0% {
    height: 12px;
  }
  100% {
    height: 8px;
  }
}

@keyframes height_4 {
  0% {
    height: 8px;
  }
  100% {
    height: 12px;
  }
}
</style>
