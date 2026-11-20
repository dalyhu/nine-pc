<template>
  <div class="nav_bar">
    <div class="nav_bar_box">
      <div class="nav_bar_box_le">
        <a class="logo_box" @click="handleLogo()">
          <img src="/static/images/nav/logo.png" alt="" />
        </a>
        <el-menu
          :router="false"
          :default-active="activeMenu"
          popper-class="menu_box"
          mode="horizontal"
          :ellipsis="false"
        >
          <SubMenu :menuList="menuList" />
        </el-menu>
      </div>
      <div class="nav_bar_box_ri">
        <div class="search_box">
          <HeadSearch />
        </div>
        <!-- 暂时先屏蔽 -->
        <!-- <SwitchDark /> -->
        <div class="icon_btn le daily-task-btn" @click="handleTask">
          <svg
            class="icon_box"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M20.5 8H3.5C2.67157 8 2 8.67157 2 9.5V10.5C2 11.3284 2.67157 12 3.5 12H7H17H20.5C21.3284 12 22 11.3284 22 10.5V9.5C22 8.67157 21.3284 8 20.5 8Z"
              fill="#CFD3DC"
            />
            <path
              d="M12 6.5C12 5.11929 13.1193 4 14.5 4H15C16.1046 4 17 4.89543 17 6V6C17 7.10457 16.1046 8 15 8H12V6.5Z"
              stroke="#CFD3DC"
              stroke-width="1.5"
            />
            <path
              d="M12 6.5C12 5.11929 10.8807 4 9.5 4H9C7.89543 4 7 4.89543 7 6V6C7 7.10457 7.89543 8 9 8H12V6.5Z"
              stroke="#CFD3DC"
              stroke-width="1.5"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4 13V17C4 19.2091 5.79086 21 8 21H11.1992L11.1992 13H4ZM12.6992 13L12.6992 21H16C18.2091 21 20 19.2091 20 17V13H12.6992Z"
              fill="#CFD3DC"
            />
          </svg>
          <span>每日任务</span>
        </div>
        <!-- <LoginBtn /> -->
        <SpaceAndMine />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Baseball,
  Basketball,
  SwitchFilled,
  GoldMedal,
  CaretBottom,
} from '@element-plus/icons-vue'
import Blockchain from '@/layout/components/icons/Blockchain.vue'

import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import SubMenu from '@/layout/components/Navbar/SubMenu.vue'
import SpaceAndMine from './SpaceAndMine.vue'
import HeadSearch from '@/layout/components/Navbar/HeadSearch.vue'
import { LiveCateGory } from '@/enums/category'

const router = useRouter()
const route = useRoute()
const store = useStore()

const activeMenu = computed(() => {
  if (['/anchor', '/reserve', '/live'].includes(route.path)) {
    if ([`/anchor?type=${LiveCateGory.Blockchain}`].includes(route.fullPath)) {
      return route.fullPath
    }
    return `/anchor?type=${LiveCateGory.AllCategory}`
  } else if (['/football', '/basketball', '/gaming'].includes(route.path)) {
    return '/football'
  } else if (['/schedule'].includes(route.path)) {
    return '/schedule?type=4'
  }
  return route.fullPath
})

//每日任务
const handleTask = () => {
  router.push('/dailyMission')
}

const handleLogo = () => {
  router.push('/main')
}

const allNavMenuItems = [
  {
    title: '首页',
    path: '/main',
    icon: ''
  },
  {
    title: '即时比分',
    icon: CaretBottom,
    children: [
      { title: '足球', path: '/football', icon: Baseball },
      { title: '篮球', path: '/basketball', icon: Basketball },
      { title: '电竞', path: '/gaming', icon: SwitchFilled }
    ],
    path: '/football',
    showPopper: true
  },
  {
    title: '直播',
    icon: CaretBottom,
    // 这里daly重新调整过，让type和服务端返回的数据能够一一对上
    // 新增属性 showPopper 用来判断是否展示 popper
    children: [
      { title: '足球', path: `/anchor?type=${LiveCateGory.Football}`, icon: Baseball },
      { title: '篮球', path: `/anchor?type=${LiveCateGory.Basketball}`, icon: Basketball },
      { title: '电竞', path: `/anchor?type=${LiveCateGory.Esport}`, icon: SwitchFilled },
      { title: '区块链', path: `/anchor?type=${LiveCateGory.Blockchain}`, icon: Blockchain },
      { title: '其他', path: `/anchor?type=${LiveCateGory.Other}`, icon: GoldMedal }
    ],
    path: `/anchor?type=${LiveCateGory.AllCategory}`,
    showPopper: true
  },
  // {
  //   title: '区块链',
  //   icon: '',
  //   children: [],
  //   path: `/anchor?type=${LiveCateGory.Blockchain}`
  // },
  {
    title: '赛程',
    icon: '',
    children: [],
    path: '/schedule?type=4'
  },
  // {
  //   title: '情报中心',
  //   icon: '',
  //   children: [],
  //   path: '/foresight'
  // },
  {
    title: 'APP下载',
    icon: '',
    children: [],
    path: '/downLoad'
  },
  {
    title: '社区',
    icon: '',
    children: [],
    path: `/forum`
  }
]

const menuList = computed(() => {
  if (store.getters.showForumNavMenu) {
    return allNavMenuItems
  }
  return allNavMenuItems.filter((item) => item.path !== '/forum')
})
</script>

<style scoped lang="scss">
.nav_bar {
  width: 100%;
  height: 54px;
  position: relative;
  .nav_bar_box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 54px;
    background-color: #1d1e1f;
    padding-right: 8px;
    .nav_bar_box_le {
      display: flex;
      align-items: center;
      .logo_box {
        width: 132px;
        img {
          display: block;
          width: 108px;
        }
      }
      .el-menu {
        height: 54px;
        background-color: #1d1e1f;
      }
      .el-menu--horizontal {
        border-bottom: 0px;
      }
    }
    .nav_bar_box_ri {
      display: flex;
      align-items: center;
      color: var(--el-text-color-regular);
      .search_box {
        margin-right: 14px;
      }
      .le {
        margin-left: 18px;
      }
      .icon_btn {
        display: flex;
        align-items: center;
        cursor: pointer;
        .icon_box {
          margin-right: 4px;
          color: #e5eaf3;
        }
        span {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          margin-right: 14px;
          font-size: 14px;
          color: #e5eaf3;
        }
        @media only screen and (max-width: 840px) {
          span {
            display: none;
          }
        }
        &:hover {
          &.daily-task-btn {
            path {
              &:nth-child(1),
              &:nth-child(4) {
                fill: var(--el-color-primary);
              }
              &:nth-child(2),
              &:nth-child(3) {
                stroke: var(--el-color-primary);
              }
            }
          }
          &.start-live-btn {
            rect:nth-child(1),
            path {
              fill: var(--el-color-primary);
              stroke: var(--el-color-primary);
            }
          }
          span {
            color: var(--el-color-primary);
          }
        }
      }
    }
  }
  @include screen(medium) {
    .search_box {
      margin-right: 10px !important;
    }
    .icon_btn {
      .icon_box {
        margin-right: 10px !important;
      }
      span {
        display: none;
      }
    }
    .le {
      margin-left: 10px !important;
    }
  }
}
</style>
