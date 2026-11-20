<template>
  <div class="mainMenu">
    <div class="ul">
      <div
        :class="['li', {active: model === item.key, liLine: item.line}]"
        v-for="item in mainMenuData"
        :key="item.key"
        @click="handleClickMenu(item.key)"
      >
        <template v-if="!item.line">
          <el-image v-show="model !== item.key" class="image-icon" :src="`/static/images/spaceAndMine/${item.icon}.svg`"></el-image>
          <el-image v-show="model === item.key" class="image-icon" :src="`/static/images/spaceAndMine/${item.icon}Select.svg`"></el-image>
          <span>{{ item.text }}</span>
        </template>
      </div>
    </div>
    <div class="signOut" v-if="isLogin" @click="signOut">
      <el-image class="image-icon-btn" src="/static/images/spaceAndMine/signOut.svg"></el-image>
      <span class="signOutTxt">退出登录</span>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
const store = useStore()
const model = defineModel()
const mainMenuData = reactive([
  {text: '活动记录', key: 2, icon: 'activityRecord'},
  {line: true},
  {text: '申请主播', key: 3, icon: 'myBroadcast'}
])

const isLogin = computed(() => !!store.getters.getUserInfo.id)

const handleClickMenu = (key) => {
  if (!isLogin.value && [0, 1].includes(key)) {
    store.commit('user/SET_LOGIN_MASK', true)
    return
  }
  model.value = key
}
const signOut = async () => {
  ElMessageBox.confirm(`
    <span style='font-size: 14px;line-height: 2;color: #333;'>
      是否确认退出登录</span>`, '提示', {
    confirmButtonText: '确 认',
    cancelButtonText: '取 消',
    center: true,
    showClose: false,
    customStyle: {width: '332px'},
    autofocus: false,
    cancelButtonClass: 'elBtn',
    confirmButtonClass: 'elBtn',
    dangerouslyUseHTMLString: true
  }).then(async () => {
    await store.dispatch('logout')
    // 整页加载而非 SPA 内跳转：SPA 挂载会在身份清空后立刻打出一批请求
    window.location.replace(`${import.meta.env.BASE_URL}main`)
  })
}

onMounted(() => {
  if (isLogin.value) {
    mainMenuData.splice(0, mainMenuData.length, ...[
      {text: '修改密码', key: 0, icon: 'modifyPwd'},
      {line: true},
      {text: '绑定账号', key: 1, icon: 'bindAccount'},
      {line: true},
      {text: '活动记录', key: 2, icon: 'activityRecord'},
      {line: true},
      {text: '申请主播', key: 3, icon: 'myBroadcast'}
    ])
  }
})
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
  cursor: pointer;
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
        color: #D02D54;
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
    margin: 0 auto;
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
<style lang="scss">
.el-message-box {
  padding: 24px;
}
.el-button.elBtn {
  width: 134px;
  height: 38px;
  color: #333;
  font-size: 16px;
  border-color: #333;
  &:hover {
    background-color: #fff;
  }
}
.el-message-box__btns .el-button.elBtn.el-button--primary {
  background-color: #fff;
  color: #d02d54;
  border-color: #d02d54;
}
</style>