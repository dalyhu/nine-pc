<template>
  <nav class="main-menu">
    <ul class="main-menu__list">
      <template v-for="(entry, index) in menuEntries" :key="getEntryKey(entry, index)">
        <li v-if="entry.type === 'divider'" class="main-menu__divider" role="separator" />
        <li
          v-else
          class="main-menu__item"
          :class="{ 'main-menu__item--active': model === entry.key }"
          @click="handleClickMenu(entry.key)"
        >
          <span class="main-menu__icon" aria-hidden="true">
            <el-image
              v-show="model !== entry.key"
              class="main-menu__icon-img"
              :src="getIconSrc(entry.icon)"
            />
            <el-image
              v-show="model === entry.key"
              class="main-menu__icon-img"
              :src="getIconActiveSrc(entry.icon)"
            />
          </span>
          <span class="main-menu__text">{{ entry.text }}</span>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

defineOptions({ name: 'MainMenu' })

type MenuItemConfig = {
  key: number
  text: string
  icon: string
}

type MenuDivider = { type: 'divider' }
type MenuItem = MenuItemConfig & { type: 'item' }
type MenuEntry = MenuDivider | MenuItem

const LOGIN_REQUIRED_KEYS = new Set([1, 2, 3])
const USER_SPACE_KEY = 0
const ICON_BASE = '/static/images/spaceAndMine'

const BASE_ITEMS: MenuItemConfig[] = [
  { text: '我的空间', key: 0, icon: 'mySpace' },
  { text: '我的帖子', key: 1, icon: 'myPost' },
  { text: '我的收藏', key: 2, icon: 'myCollect' },
  { text: '我的关注', key: 3, icon: 'myAttention' },
  { text: '我的推广', key: 4, icon: 'myPromote' }
]

const ANCHOR_ITEMS: MenuItemConfig[] = [
  { text: '预约开播', key: 5, icon: 'bookBroadcast' },
  { text: '我要直播', key: 6, icon: 'myBroadcast' }
]

const PRIVATE_MSG_ITEM: MenuItemConfig = {
  text: '我的悄悄话',
  key: 7,
  icon: 'myMsg'
}

const store = useStore()
const router = useRouter()
const model = defineModel<number>()

const isLogin = computed(() => !!store.getters.getUserInfo.id)
const isAnchor = computed(() => store.getters.getUserInfo.is_anchor === 1)

const menuItems = computed<MenuItemConfig[]>(() =>
  isAnchor.value
    ? [...BASE_ITEMS, ...ANCHOR_ITEMS, PRIVATE_MSG_ITEM]
    : [...BASE_ITEMS, PRIVATE_MSG_ITEM]
)

function withDividers(items: MenuItemConfig[]): MenuEntry[] {
  return items.flatMap((item, index) => {
    const entry: MenuItem = { type: 'item', ...item }
    return index === 0 ? [entry] : [{ type: 'divider' }, entry]
  })
}

const menuEntries = computed(() => withDividers(menuItems.value))

const getEntryKey = (entry: MenuEntry, index: number) =>
  entry.type === 'divider' ? `divider-${index}` : entry.key

const getIconSrc = (icon: string) => `${ICON_BASE}/${icon}.svg`
const getIconActiveSrc = (icon: string) => `${ICON_BASE}/${icon}Select.svg`

const handleClickMenu = (key: number) => {
  if (!isLogin.value && LOGIN_REQUIRED_KEYS.has(key)) {
    store.commit('user/SET_LOGIN_MASK', true)
    return
  }
  if (key === USER_SPACE_KEY) {
    router.replace('/mySpace/user')
  }
  model.value = key
}
</script>

<style scoped lang="scss">
.main-menu {
  display: flex;
  flex-direction: column;
  width: 180px;
  min-height: 480px;
  margin-top: 16px;
  padding: 16px 0;
  background-color: #fff;
  border-radius: 8px;
  overflow-y: auto;
  cursor: pointer;

  &::-webkit-scrollbar {
    width: 0;
  }

  &__list {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    align-items: center;
    height: 41px;
    font-weight: 500;
    font-size: 18px;
    border-left: 2px solid transparent;
    color: #333;

    &--active {
      border-left-color: #d4647e;
      color: #d02d54;
    }
  }

  &__icon {
    position: relative;
    width: 24px;
    height: 24px;
    margin: 6px 10px;
    flex-shrink: 0;
  }

  &__icon-img {
    position: absolute;
    inset: 0;
    width: 24px;
    height: 24px;
  }

  &__text {
    line-height: 1;
  }

  &__divider {
    width: 148px;
    height: 1px;
    margin: 16px auto;
    background-color: #f6f6f6;
  }
}
</style>
