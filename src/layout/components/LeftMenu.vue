<template>
  <div class="left_menu">
    <ul>
      <li
        :class="[navItem.path === navActive ? 'is-active' : '']"
        v-for="navItem in leftMenuList"
        :key="navItem.path"
        @click="handleNav(navItem)"
      >
        <span class="nav_icon">
          <el-icon size="24">
            <component :is="navItem.icon"></component>
          </el-icon>
        </span>
        <span class="nav_title">
          {{ navItem.title }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup name="LeftMenu" lang="ts">
import {
  Calendar,
  AlarmClock,
  Files,
  Help,
  Basketball,
  SwitchFilled,
  GoldMedal
} from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { LiveCateGory } from '@/enums/category'
const router = useRouter()
const route = useRoute()

const noQueryTypeRoutes = ['/schedule', '/reserve']
const navActive = computed(() => {
  if (noQueryTypeRoutes.includes(route.path)) {
    return route.path
  }
  //需要匹配 path?type
  return route.path + '?type=' + route.query.type
})

const handleNav = (navItem) => {
  router.push(navItem.path)
}

// { title: '足球', path: `/anchor?type=${LiveCateGory.Football}`, icon: Baseball },
//       { title: '篮球', path: `/anchor?type=${LiveCateGory.Basketball}`, icon: Basketball },
//       { title: '电竞', path: `/anchor?type=${LiveCateGory.Esport}`, icon: SwitchFilled },
//       { title: '其他', path: `/anchor?type=${LiveCateGory.Other}`, icon: GoldMedal }

const leftMenuList = [
  {
    title: '赛程',
    icon: Calendar,
    path: '/schedule'
  },
  {
    title: '预约',
    icon: AlarmClock,
    path: '/reserve'
  },
  {
    title: '全部',
    icon: Files,
    path: `/anchor?type=${LiveCateGory.AllCategory}`
  },
  {
    title: '足球',
    icon: Help,
    path: `/anchor?type=${LiveCateGory.Football}`
  },
  {
    title: '篮球',
    icon: Basketball,
    path: `/anchor?type=${LiveCateGory.Basketball}`
  },
  {
    title: '电竞',
    icon: SwitchFilled,
    path: `/anchor?type=${LiveCateGory.Esport}`
  },
  {
    title: '更多',
    icon: GoldMedal,
    path: `/anchor?type=${LiveCateGory.Fighting}`
  }
]
</script>

<style scoped lang="scss">
.left_menu {
  position: fixed;
  top: 54px;
  left: 0;
  z-index: 3;
  width: 48px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1d1e1f;
  ul {
    padding-top: 12px;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 24px;
      cursor: pointer;
      .nav_icon {
        display: block;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px;
        margin-bottom: 8px;
        background-color: #303030;
        border-radius: 4px;
        color: #e5eaf3;
      }
      .nav_title {
        color: #e5eaf3;
        font-size: 12px;
        font-weight: 400;
        font-style: normal;
      }
      &:hover {
        .nav_icon {
          color: var(--el-primary-background-color);
          background-color: #40181d;
        }
        .nav_title {
          color: var(--el-primary-background-color);
        }
      }
    }
    .is-active {
      .nav_icon {
        color: var(--el-primary-background-color);
        background-color: #40181d;
      }
      .nav_title {
        color: var(--el-primary-background-color);
      }
    }
  }
}
</style>
