import { createRouter, createWebHistory } from 'vue-router'
import NProgress from '@/utils/nprogress'
import Layout from '@/layout/index.vue'
import store from '@/store'
import { KeepAlive } from 'vue'

// import SpaceLayout from '@/views/space/SpaceLayout.vue'
// import { menuRoutes } from './config/menuRouter'

const title =
  'JyUyMyUyMyVFMiU4OCVCNyVFNyU5QiVCNCVFNiU5MiVBRDIwMjQlRTklQUIlOTglRTYlQjglODUlRTIlODglQjclRTclOUIlQjQlRTYlOTIlQUQlRUYlQkMlOEMlRTglQjYlQjMlRTclOTAlODMlRTUlOEQlQjMlRTYlOTclQjYlRTclOUIlQjQlRTYlOTIlQUQlRUYlQkMlOENOQkElRTclQUYlQUUlRTclOTAlODMlRTclOUIlQjQlRTYlOTIlQUQlRTUlOUMlQTglRTclQkElQkYlRTUlODUlOEQlRTglQjQlQjklRTglQTclODIlRTclOUMlOEIlMjMlMjMn'

function getPageTitle(pageTitle) {
  let titleSp = window.decodeURIComponent(window.atob(title)).split('##')[1]
  if (pageTitle) {
    return `${pageTitle} - ${titleSp}`
  }
  return `${titleSp}`
}

// const childrenRoutes = menuRoutes.map((item) => ({
//   path: item.path,
//   name: item.name,
//   component: item.component,
//   meta: { title: item.title, icon: item.icon }
// }))

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/main',
    children: [
      {
        path: 'main',
        name: 'main',
        component: () => import('@/views/main/index.vue'),
        meta: {
          index: 0,
          title: '首页',
          icon: 'el-icon-s-home'
        }
      },
      {
        path: '/basketball',
        name: 'basketball',
        component: () => import('@/views/score/basketball.vue'),
        meta: { title: '篮球', icon: 'el-icon-s-home', index: 1 }
      },
      {
        path: '/football',
        name: 'football',
        component: () => import('@/views/score/football.vue'),
        meta: { title: '足球', icon: 'el-icon-s-home', index: 1 }
      },
      {
        path: '/gaming',
        name: 'gaming',
        component: () => import('@/views/score/gaming.vue'),
        meta: { title: '电竞', icon: 'el-icon-s-home', index: 1 }
      },
      {
        path: '/anchor',
        name: 'anchor',
        component: () => import('@/views/anchor/index.vue'),
        meta: { title: '直播', icon: 'el-icon-s-home', index: 2 }
      },
      {
        path: '/schedule',
        name: 'schedule',
        component: () => import('@/views/anchor/schedule.vue'),
        meta: { title: '赛程', icon: 'el-icon-s-home', index: 3 }
      },
      {
        path: '/reserve',
        name: 'reserve',
        component: () => import('@/views/anchor/reserve.vue'),
        meta: { title: '预约', icon: 'el-icon-s-home', index: 2 }
      },
      {
        path: '/foresight',
        name: 'foresight',
        component: () => import('@/views/foresight/index.vue'),
        meta: { title: '情报中心', icon: 'el-icon-s-home', index: 9 }
      },
      {
        path: '/news',
        name: 'news',
        component: () => import('@/views/news/index.vue'),
        meta: { title: '头条', icon: 'el-icon-s-home', index: 4 }
      },
      {
        path: '/base-football',
        name: 'base-football',
        component: () => import('@/views/database/football.vue'),
        meta: { title: '足球资料库', icon: 'el-icon-s-home', index: 6 }
      },
      {
        path: '/base-basketball',
        name: 'base-basketball',
        component: () => import('@/views/database/basketball.vue'),
        meta: { title: '篮球资料库', icon: 'el-icon-s-home', index: 6 }
      },
      {
        path: '/downLoad',
        name: 'downLoad',
        component: () => import('@/views/downLoad/index.vue'),
        meta: { title: '下载', icon: 'el-icon-s-home', index: 7 }
      },
      {
        path: '/ipa-download',
        name: 'ipaDownload',
        component: () => import('@/views/ipaDownload/index.vue'),
        meta: { title: 'IPA download' }
      },
      {
        path: '/forum',
        name: 'forum',
        component: () => import('@/views/forum/index.vue')
      },
      {
        path: '/dailyMission',
        name: 'dailyMission',
        component: () => import('@/views/dailyMission/index.vue'),
        meta: { title: '每日任务', icon: 'el-icon-s-home', index: null }
      },
      {
        path: '/live',
        name: 'live',
        component: () => import('@/views/anchor/live.vue'),
        meta: { title: '直播间', icon: 'el-icon-s-home', index: 2 }
      },
      {
        path: '/score-detail',
        name: '/score-detail',
        component: () => import('@/views/score/detail.vue'),
        meta: { title: '分析', icon: 'el-icon-s-home', index: 1 }
      },

      {
        path: '/search',
        name: 'search',
        component: () => import('@/views/search/index.vue'),
        meta: { title: '搜索', icon: 'el-icon-s-home', index: null }
      },
      {
        path: '/member',
        name: 'member',
        component: () => import('@/views/member/index.vue'),
        meta: { title: '个人资料', icon: 'el-icon-s-home', index: null }
      },
      {
        path: '/mySpace',
        name: 'mySpace',
        component: () => import('@/views/mySpace/index.vue'),
        meta: { title: '我的空间', icon: 'el-icon-s-home', index: null },
        children: [
          {
            path: 'user',
            component: () => import('@/views/mySpace/userInfo/UserSpace.vue')
          },
          {
            path: 'profile',
            component: () => import('@/views/mySpace/userInfo/profile/index.vue')
          },
          {
            path: 'score',
            component: () => import('@/views/mySpace/score/index.vue')
          },
          {
            path: 'medal',
            component: () => import('@/views/mySpace/medals/index.vue')
          },
          {
            path: 'medal-record',
            component: () => import('@/views/mySpace/medals/record.vue')
          },
          {
            path: 'profile/avatar',
            component: () => import('@/views/mySpace/userInfo/profile/avatar.vue')
          },
          {
            path: 'profile/nickname',
            component: () => import('@/views/mySpace/userInfo/profile/nickname.vue')
          }
        ]
      },
      {
        path: '/otherSpace',
        name: 'otherSpace',
        component: () => import('@/views/otherSpace/index.vue'),
        meta: { title: '他的空间', icon: 'el-icon-s-home', index: null }
      },
      {
        path: '/personalCenter',
        name: 'personalCenter',
        component: () => import('@/views/personalCenter/index.vue'),
        meta: { title: '个人中心', icon: 'el-icon-s-home', index: null }
      },
      {
        path: '/promotion',
        name: 'promotion',
        component: () => import('@/views/promotion/index.vue'),
        meta: { title: '个人资料', icon: 'el-icon-s-home', index: null }
      },
      {
        path: '/detail',
        name: 'detail',
        component: () => import('@/views/news/detail.vue'),
        meta: { title: '详情', icon: 'el-icon-s-home', index: null }
      },
      {
        path: '/about-user',
        name: 'about-user',
        component: () => import('@/views/about/index.vue'),
        meta: { title: '关于我们', icon: 'el-icon-s-home', index: null }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404.vue'),
    hidden: true
  },
  // 兜底：没有匹配上的地址显示 404 页（地址栏保持原样），否则整页空白
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404.vue'),
    hidden: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from) => {
  if (
    import.meta.env.PROD &&
    from.matched.length > 0 &&
    navigator.onLine === false
  ) {
    window.location.assign(to.fullPath)
    return false
  }
})

router.beforeEach((to, from, next) => {
  NProgress.start() // 1.NProgress 开始

  // /live 直播间页面：uid 必须为大于 0 的整数，否则直接跳转首页，避免以非法 uid 调用后端接口
  if (to.path === '/live') {
    const uidNum = Number(to.query.uid)
    if (!Number.isInteger(uidNum) || uidNum <= 0) {
      return next('/')
    }
  }

  const channel_code = store.state.channelCode

  if (!to.query.channel_code && channel_code) {
    return next({
      ...to,
      query: {
        ...to.query,
        channel_code
      }
    })
  }

  next()
})

/**
 * @description 路由跳转错误
 * */
router.onError((error) => {
  NProgress.done()
  console.warn('路由错误', error.message)
})

/**
 * @description 路由跳转结束
 * */
router.afterEach((to) => {
  document.title = getPageTitle(to.meta.title).replace(/(.*)(\d{4})(.*)/, `$1${new Date().getFullYear()}$3`)
  NProgress.done()
})

export default router
