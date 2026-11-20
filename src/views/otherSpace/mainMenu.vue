<template>
  <div class="mainMenu">
    <div class="ul">
      <div
        :class="['li', { active: model === item.key, liLine: item.line }]"
        v-for="item in mainMenuData"
        :key="item.key"
        @click="model = item.key"
      >
        <template v-if="!item.line">
          <el-image
            v-show="model !== item.key"
            class="image-icon"
            :src="`/static/images/spaceAndMine/${item.icon}.svg`"
          ></el-image>
          <el-image
            v-show="model === item.key"
            class="image-icon"
            :src="`/static/images/spaceAndMine/${item.icon}Select.svg`"
          ></el-image>
          <span>{{ item.text }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
const model = defineModel()

const mainMenuData = reactive([
  { text: '他的空间', key: 0, icon: 'mySpace' },
  { line: true },
  { text: '他的帖子', key: 1, icon: 'myPost' }
])
</script>

<style scoped lang="scss">
.mainMenu {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  width: 180px;
  min-height: 480px;
  margin-top: 16px;
  padding: 16px 0;
  background-color: #fff;
  border-radius: 8px;
  overflow-y: scroll;
  cursor: pointer;
  &::-webkit-scrollbar {
    width: 0;
  }
  .ul {
    display: flex;
    flex-flow: column;
    .li {
      height: 41px;
      font-weight: 500;
      font-size: 18px;
      border-left: 2px solid transparent;
      color: #333;
      align-content: center;
      &.active {
        border-left-color: #d4647e;
        color: #d02d54;
      }
      .image-icon {
        width: 24px;
        vertical-align: middle;
        margin: 6px 10px;
      }
    }
    .liLine {
      width: 148px;
      height: 1px;
      background-color: #f6f6f6;
      margin: 16px auto;
    }
  }
  .signOut {
    margin: 20px auto 0;
    width: 148px;
    color: #666;
    border: 1px solid #c5c5c5;
    border-radius: 6px;
    text-align: center;
    .image-icon-btn {
      width: 24px;
      vertical-align: middle;
      margin: 6px 12px 6px 0;
    }
    .signOutTxt {
      color: #666;
    }
  }
}
</style>
