<template>
  <div class="greyBgc">
    <div class="center">
      <mainMenu v-model="mainMenuKey" />
      <div class="contentBlock">
        <keep-alive :max="4">
          <component :is="[updatePwd, bindAccount, activityRecord, applyAnchor][mainMenuKey]"></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script setup>
import mainMenu from './mainMenu.vue'
import updatePwd from './updatePwd.vue'
import bindAccount from './bindAccount.vue'
import activityRecord from './activityRecord.vue'
import applyAnchor from './applyAnchor.vue'
import { useStore } from 'vuex'

const { getters } = useStore()
const mainMenuKey = ref(0)

const isLogin = computed(() => !!getters.getUserInfo.id)

watch(mainMenuKey, (k) => {
  localStorage.setItem('mainMenuKey', String(k))
  // 与路由 state 同步，否则只改侧栏时 comp 仍停在旧值，刷新会回到「绑定账号」并再次触发 openBindEmail
  const prev = history.state != null ? { ...history.state } : {}
  const next = { ...prev, comp: k }
  // 离开「绑定账号」时清掉一次性标记，避免子页尚未 onActivated 消费时一直留在 history 里
  if (k !== 1) {
    delete next.openBindEmail
  }
  history.replaceState(next, '')
})

onMounted(() => {
  const rawStored = localStorage.getItem('mainMenuKey')
  const stateComp = history.state?.comp
  mainMenuKey.value = !isLogin.value
    ? 2
    : stateComp != null
      ? stateComp
      : rawStored !== null && rawStored !== ''
        ? ~~rawStored
        : 0
})

onUnmounted(() => {
  localStorage.removeItem('mainMenuKey')
})
</script>

<style scoped lang="scss">
.greyBgc {
  position: fixed;
  top: 54px;
  left: 0;
  bottom: 0px;
  width: 100%;
  margin-bottom: 16px;
  background-color: #f1f1f1;
  overflow-y: scroll;
  border-bottom: 1px solid transparent;
  &::-webkit-scrollbar {
    width: 0;
  }
  .center {
    display: flex;
    height: 100%;
    margin: 0 auto;
    justify-content: center;
    gap: 20px;
    .contentBlock {
      width: 996px;
      margin-top: 16px;
      min-height: 480px;
      background-color: #fff;
      border-radius: 8px;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 0;
      }
    }
  }
}
</style>