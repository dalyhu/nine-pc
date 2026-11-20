<!-- 下载页 -->
<template>
  <div class="download-index">
    <section class="section-1">
      <div class="inner-box">
        <div class="model-figure-box">
          <!-- <el-image
            :src="getImageUrl('/static/images/download/top-figure.webp?v=1')"
            class="model-figure"
          /> -->
        </div>
        <div class="main-content">
          <p class="slogan">看免费球赛直播<br />就来<span class="slogan-tip">小𝟵直播</span></p>
          <div class="main-content--bottom">
            <div class="QRCode-and-btn">
              <qrCode :size="106"></qrCode>
              <div class="btn-list">
                <!-- 苹果下载 -->
                <!-- 只有一个下载点则点击直接跳转，多个下载点则鼠标上浮后气泡显示所有下载点的按钮 -->
                <a
                  ref="iosBtnRef"
                  v-if="system.ios_download_url_extend.length > 1"
                  class="btn_a ios_a download-item download-item-apple"
                >
           <el-image
                    :src="getImageUrl('/static/images/download/apple.png')"
                    class="download-logo"
                  />
                         <div class="download-right download-apple-color">
                    <div class="download-en">Download on the</div>
                    <div class="download-cn">苹果下载</div>
                  </div>
                </a>
                <a
                  ref="iosBtnRef"
                  v-else
                  class="btn_a ios_a download-item download-item-apple"
                  @click="goToIpaDownload(system.ios_download_url_extend[0], $event)"
                >
                  <el-image
                    :src="getImageUrl('/static/images/download/apple.png')"
                    class="download-logo"
                  />
                         <div class="download-right download-apple-color">
                    <div class="download-en ">Download on the</div>
                    <div class="download-cn">苹果下载</div>
                  </div>
                </a>
                <!-- 安卓下载 -->
                <a
                  ref="androidBtnRef"
                  v-if="system.android_download_url_extend.length > 1"
                  class="btn_a ios_a download-item download-item-android"
                >
                  <el-image :src="getImageUrl('/static/images/download/android-down.png')"         class="download-logo"/>
                  <div class="download-right download-android-color">
                    <div class="download-en">Download on the</div>
                    <div class="download-cn">安卓下载</div>
                  </div>
                </a>
                <a
                  ref="androidBtnRef"
                  v-else
                  class="btn_a ios_a download-item download-item-android"
                  :href="system.android_download_url_extend[0]"
                  @click="buriedBtn"
                >
                <el-image :src="getImageUrl('/static/images/download/android-down.png')"         class="download-logo"/>
                  <div class="download-right download-android-color">
                    <div class="download-en">Download on the</div>
                    <div class="download-cn">安卓下载</div>
                  </div>
                </a>

                <!-- <a class="btn_a android_a" :href="system.androidDownloadUrl" @click="buriedBtn">
                  <el-image
                    :src="getImageUrl('/static/images/download/android-download-btn.png')"
                    class="btn-figure"
                  />
                </a> -->
                <!-- ios -->
                <el-popover
                  v-if="system.ios_download_url_extend.length > 1"
                  :virtual-ref="iosBtnRef"
                  trigger="hover"
                  placement="right"
                  width="auto"
                  popper-class="ios-download-popover"
                  virtual-triggering
                >
                  <a
                    v-for="(url, idx) in system.ios_download_url_extend"
                    :key="idx"
                    @click="goToIpaDownload(url, $event)"
                    class="btn_a ios_a "
                  >
                    <div class="btn_wrap iconIos download-app-btn-ios-firm">
                      <!-- <img class="imgBtn" src="/static/images/theme/download/IOS.png" /> -->
                      <div class="imgText">下载点{{ numToStr(idx) }}</div>
                    </div>
                  </a>
                </el-popover>
                <!-- 安卓下载 -->
                <el-popover
                  v-if="system.android_download_url_extend.length > 1"
                  :virtual-ref="androidBtnRef"
                  trigger="hover"
                  placement="right"
                  width="auto"
                  popper-class="android-download-popover"
                  virtual-triggering
                >
                  <a
                    v-for="(url, idx) in system.android_download_url_extend"
                    :key="idx"
                    :href="url"
                    @click="buriedBtn"
                    class="btn_a android_a"
                  >
                    <div class="btn_wrap iconIos download-app-btn-ios-firm">
                      <!-- <img class="imgBtn" src="/static/images/theme/download/IOS.png" /> -->
                      <div class="imgText">下载点{{ numToStr(idx) }}</div>
                    </div>
                  </a>
                </el-popover>
              </div>
            </div>
            <div class="evaluate">
              <div class="star-svg-box">
                <svg
                  v-for="item in 5"
                  :key="item"
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.72055 0.400394L9.47617 4.13521L13.5708 4.6457C13.9499 4.69455 14.2273 5.0444 14.1786 5.42374C14.154 5.60862 14.0617 5.76889 13.9304 5.88106L10.9498 8.67231L11.7278 12.7279C11.8005 13.1072 11.5527 13.4719 11.1732 13.5448C11.008 13.5739 10.8427 13.5448 10.7065 13.467L7.08831 11.4782L3.47543 13.467C3.13516 13.6566 2.71204 13.5303 2.52735 13.1946C2.44449 13.0439 2.42514 12.8785 2.45445 12.7279L3.22742 8.67231L0.217653 5.84687C-0.0598561 5.5842 -0.0745113 5.14191 0.188155 4.86459C0.304833 4.73814 0.455894 4.67013 0.611277 4.65059V4.6457L4.70571 4.13521L6.46114 0.400394C6.62179 0.0503608 7.03532 -0.0954396 7.38517 0.065016C7.54074 0.137916 7.65272 0.259479 7.72055 0.400394Z"
                    fill="#d02d54"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_3159_21702"
                      x1="0"
                      y1="-1.85614e-10"
                      x2="0"
                      y2="13.5559"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#FBD249" />
                      <stop offset="1" stop-color="#F5A623" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p class="evaluate-text">百万用户首选直播平台</p>
            </div>
            <div class="logo-top logo-card">
              <div class="logo-item logo-x9"></div>
              <el-image
                :src="getImageUrl('/static/images/download/xingcai.png')"
                class="logo-item logo-xc"
              />
              <el-image
                :src="getImageUrl('/static/images/download/figure-top_five_leagues.png')"
                class="logo-item logo-top-five-leagues"
              />
              <el-image
                :src="getImageUrl('/static/images/download/figure-olympic.png')"
                class="logo-item logo-european-cup"
              />
            </div>
            <div class="logo-card top-five-leagues">
              <p class="logo-hgroup">五大联赛</p>
              <el-image
                :src="getImageUrl('/static/images/download/figure-top-five-leagues---DeJia.png')"
                class="logo-item figure-top-five-leagues---DeJia"
              />
              <el-image
                :src="getImageUrl('/static/images/download/figure-top-five-leagues---YiJia.png')"
                class="logo-item figure-top-five-leagues---YiJia"
              />
              <el-image
                :src="getImageUrl('/static/images/download/figure-top-five-leagues-fajia.png?v=1')"
                class="logo-item figure-top-five-leagues---FaJia"
              />
              <el-image
                :src="getImageUrl('/static/images/download/figure-top-five-leagues-xijia.png')"
                class="logo-item figure-top-five-leagues---XiJia"
              />
              <el-image
                :src="getImageUrl('/static/images/download/figure-top-five-leagues---YingChao.png')"
                class="logo-item figure-top-five-leagues---YingChao"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section-2">
      <div class="inner-box">
        <div class="advantage-list">
          <div class="advantage-item" v-for="item in advantageList" :key="item.title">
            <div class="advantage-info">
              <df-image-lazy
                :src="item.icon"
                class="advantage-info--icon"
                placeholder-src="/static/images/placeholder_gray_bg.png"
              />
              <div class="advantage-info-hgroup">
                <p class="advantage-info-title">{{ item.title }}</p>
                <p class="advantage-info-desc">{{ item.desc }}</p>
              </div>
            </div>
            <dfContainer class="advantage-figure-box" :height-ratio="205.35">
              <df-image-lazy
                :src="item.figure"
                class="advantage-figure"
                placeholder-src="/static/images/placeholder_gray_bg.png"
              />
            </dfContainer>
          </div>
        </div>
      </div>
    </section>
    <section class="section-3">
      <div class="inner-box installation">
        <p class="hgroup">安装教程</p>
        <p class="installation-tips">
          需在同一网络环境下下载安装和注册，勿切换网络，若无法正常下载，请使用手机自带浏览器打开（Chrome谷歌浏览器、Safari浏览器）
        </p>
        <div class="installation--row installation-ios">
          <div class="title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
            >
              <g clip-path="url(#clip0_3159_21680)">
                <path
                  d="M16.8421 11.4534C16.814 8.78324 19.1791 7.50369 19.2843 7.4392C17.9548 5.6268 15.8846 5.37952 15.1471 5.34994C13.3857 5.18461 11.7096 6.31675 10.815 6.31675C9.92292 6.31675 8.54305 5.37467 7.08173 5.40037C5.16078 5.42607 3.38917 6.43991 2.40154 8.04286C0.405925 11.2691 1.89052 16.0479 3.83522 18.6642C4.78552 19.9457 5.91908 21.3833 7.40658 21.3324C8.83929 21.2786 9.38135 20.4679 11.1132 20.4679C12.8456 20.4679 13.3319 21.3319 14.8484 21.3057C16.3902 21.2786 17.3672 20.0005 18.3112 18.7156C19.4021 17.2305 19.8515 15.7919 19.8782 15.7177C19.8443 15.7032 16.8712 14.6428 16.8421 11.4534ZM14.5905 3.68881C15.4477 2.71134 16.0261 1.35373 15.8685 0C14.6332 0.0475163 13.136 0.773836 12.2506 1.74986C11.4545 2.61533 10.7593 3.99767 10.9459 5.32425C12.3248 5.42607 13.7314 4.66581 14.5905 3.68978V3.68881Z"
                  fill="#303133"
                />
              </g>
              <defs>
                <clipPath id="clip0_3159_21680">
                  <rect width="21.3331" height="21.3338" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span class="title--text">iOS如何安装？</span>
          </div>
          <div class="installation-step-list">
            <div class="step-item" v-for="item in iosInstallationList" :key="'ios' + item.title">
              <div class="top">
                <p class="step-title">{{ item.title }}</p>
                <p class="step-desc" v-for="descItem in item.descList" :key="descItem">
                  {{ descItem }}
                </p>
              </div>
              <df-image-lazy
                :src="item.figure"
                class="installation-figure"
                placeholder-src="/static/images/placeholder_gray_bg.png"
              />
            </div>
          </div>
        </div>
        <div class="hr"></div>
        <div class="installation--row installation-android">
          <div class="title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.81077 0.633584C9.547 0.403389 9.15375 0.403388 8.88998 0.633584L6.65633 2.58294C6.54107 2.68353 6.39604 2.74361 6.24341 2.75398L3.28555 2.95498C2.93626 2.97871 2.65819 3.25679 2.63445 3.60608L2.43345 6.56386C2.42308 6.71649 2.363 6.86153 2.26241 6.97679L0.313036 9.21038C0.0828295 9.47415 0.0828291 9.86742 0.313035 10.1312L2.26241 12.3648C2.363 12.48 2.42308 12.6251 2.43345 12.7777L2.63445 15.7355C2.65819 16.0848 2.93627 16.3629 3.28555 16.3866L6.24341 16.5876C6.39604 16.598 6.54107 16.658 6.65633 16.7586L8.88998 18.708C9.15375 18.9382 9.547 18.9382 9.81077 18.708L12.0444 16.7586C12.1597 16.658 12.3047 16.598 12.4573 16.5876L15.4152 16.3866C15.7645 16.3629 16.0426 16.0848 16.0663 15.7355L16.2673 12.7777C16.2777 12.6251 16.3377 12.48 16.4383 12.3648L18.3877 10.1312C18.6179 9.86742 18.6179 9.47415 18.3877 9.21038L16.4383 6.97679C16.3377 6.86153 16.2777 6.71649 16.2673 6.56386L16.0663 3.60608C16.0426 3.25679 15.7645 2.97871 15.4152 2.95498L12.4573 2.75398C12.3047 2.74361 12.1597 2.68353 12.0444 2.58294L9.81077 0.633584ZM5.92595 6.33713C5.78701 6.20449 5.56173 6.20449 5.42278 6.33713C5.28383 6.46978 5.28383 6.68484 5.42278 6.81749L6.47111 7.81827C5.26862 8.66336 4.48837 10.0242 4.48837 11.559C4.48837 11.5968 4.48884 11.6346 4.48978 11.6722H14.2121C14.2131 11.6346 14.2136 11.5968 14.2136 11.559C14.2136 10.0242 13.4333 8.66336 12.2308 7.81827L13.2791 6.81749C13.4181 6.68484 13.4181 6.46978 13.2791 6.33713C13.1402 6.20449 12.9149 6.20449 12.776 6.33713L11.612 7.44828C10.9366 7.10898 10.1672 6.91697 9.35096 6.91697C8.53468 6.91697 7.76537 7.10898 7.0899 7.44828L5.92595 6.33713ZM7.92776 9.63426C7.92776 9.88438 7.71537 10.0871 7.45336 10.0871C7.19136 10.0871 6.97896 9.88438 6.97896 9.63426C6.97896 9.38414 7.19136 9.18138 7.45336 9.18138C7.71537 9.18138 7.92776 9.38414 7.92776 9.63426ZM11.2486 10.0871C11.5106 10.0871 11.723 9.88438 11.723 9.63426C11.723 9.38414 11.5106 9.18138 11.2486 9.18138C10.9866 9.18138 10.7742 9.38414 10.7742 9.63426C10.7742 9.88438 10.9866 10.0871 11.2486 10.0871Z"
                fill="#303133"
              />
            </svg>
            <span class="title--text">安卓如何安装？</span>
          </div>
          <div class="installation-step-list">
            <div
              class="step-item"
              v-for="item in androidInstallationList"
              :key="'ios' + item.title"
            >
              <div class="top">
                <p class="step-title">{{ item.title }}</p>
                <p class="step-desc" v-for="descItem in item.descList" :key="descItem">
                  {{ descItem }}
                </p>
              </div>
              <df-image-lazy
                :src="item.figure"
                class="installation-figure"
                placeholder-src="/static/images/placeholder_gray_bg.png"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup name="DownloadIndex" lang="ts">
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { buriedPoint } from '@/api/common.js'
import mittBus from '@/utils/mittBus'
import qrCode from '@/components/qrCode.vue'
import dfContainer from '@/components/dfContainer/index.vue'
import { getImageUrl } from '@/utils/common.js'

defineOptions({
  name: 'DownloadIndex',
  inheritAttrs: true
})

const advantageList = [
  {
    title: '魅力主播解说',
    desc: '看比赛就要一起嗨',
    icon: getImageUrl('/static/images/download/figure-football.png'),
    figure: getImageUrl('/static/images/download/app-screenshot-1.png?v=1')
  },
  {
    title: '精准赛事分析',
    desc: '专业解读精准分析',
    icon: getImageUrl('/static/images/download/figure-basketball.png'),
    figure: getImageUrl('/static/images/download/app-screenshot-2.png')
  },
  {
    title: '火爆体育赛区',
    desc: '志趣相投球友聚集地',
    icon: getImageUrl('/static/images/download/figure-game.png'),
    figure: getImageUrl('/static/images/download/app-screenshot-3.png')
  }
]
const iosInstallationList = [
  {
    title: '第一步',
    descList: ['点击下载安装'],
    figure: getImageUrl('/static/images/download/ios-download-1.png')
  },
  {
    title: '第二步',
    descList: ['下载后，点击信任证书'],
    figure: getImageUrl('/static/images/download/ios-download-2.png')
  },
  {
    title: '第三步',
    descList: ['手机自动跳转到“VPN与设备管理”点击', '(也可以在通用>VPN与设备管理找到)'],
    figure: getImageUrl('/static/images/download/ios-download-3.png')
  },
  {
    title: '第四步',
    descList: ['点击信任选项'],
    figure: getImageUrl('/static/images/download/ios-download-4.png')
  }
]
const androidInstallationList = [
  {
    title: '第一步',
    descList: ['点击立即下载'],
    figure: getImageUrl('/static/images/download/android-download-1.png')
  },
  {
    title: '第二步',
    descList: ['点击安装'],
    figure: getImageUrl('/static/images/download/android-download-2.png')
  },
  {
    title: '第三步',
    descList: ['点击“更多详情”'],
    figure: getImageUrl('/static/images/download/android-download-3.png')
  },
  {
    title: '第四步',
    descList: ['点击“仍要安装”'],
    figure: getImageUrl('/static/images/download/android-download-4.png')
  }
]

const store = useStore()
const route = useRoute()
const router = useRouter()
const system = computed(() => {
  return store.state.system
})

const iosBtnRef = ref(null)
const androidBtnRef = ref(null)

const numToStr = (num) => {
  let num_str = ['一', '二', '三', '四', '五']
  return num_str[num]
}
const buriedBtn = () => {
  buriedPoint({
    ponit_typeid: 1
  })
}
const goToIpaDownload = (downloadUrl, event) => {
  event.preventDefault()
  buriedBtn()
  const query = { ...route.query }
  try {
    const url = new URL(downloadUrl, window.location.origin)
    url.searchParams.forEach((value, key) => {
      query[key] = value
    })
  } catch (error) {
    console.warn('Invalid iOS download URL', downloadUrl, error)
  }
  router.push({ name: 'ipaDownload', query })
}
const setDownLoadPage = () => {
  if (route.query.type === 'download') {
    store.state.showHeaderFooter = false
  }
}

onMounted(() => {
  setDownLoadPage()
  mittBus.emit('pageScrollToTop')
})
</script>
<style lang="scss" scoped>
.download-index {
  .section-1,
  .section-2,
  .section-3 {
    width: 100%;
    .inner-box {
      display: flex;
      justify-content: center;
      width: 100%;
    }
  }
  .section-1 {
    padding-top: 120px;
    background-color: var(--el-bg-color-overlay);
    background-image: url('/static/images/download/download-hero-bg.jpg?v=1');
    background-repeat: no-repeat;
    background-position: center top;
    background-size: cover;
    position: relative;
    height: 705px;
    .inner-box {
      gap: 120px;
      // margin-left: 24.16%;
      // margin-right: 24.42%;
      position: relative;
    }
    .model-figure-box {
      width: 612px;
      font-size: 0;
      transform: translateX(-56px);
      .model-figure {
        width: 100%;
        height: auto;
      }
    }
    .main-content {
      display: flex;
      justify-content: center;
      flex-direction: column;
      &--bottom {
        width: 334px;
      }
      .slogan {

        font-size: 50px;
        font-weight: 900;
        line-height: 60px;
        margin-bottom: 38px;
    
      }
      .slogan-tip {
        color:#d02d54;
      }
      .QRCode-and-btn {
        display: flex;
        align-items: center;
        #qrcode {
          margin-right: 24px;
        }
      }
      .btn-list {
        display: flex;
        justify-content: space-between;
        font-size: 0;
        flex-direction: column;
        height: 106px;
        .btn-figure {
          width: 250px;
          height: 46px;
        }
      }
       .download-item {
        display: flex;
        font-family: var(--fontFamily-PingFangSC);
        align-items: center;
        justify-content: center;
        width: 250px;
        height: 46px;
        box-sizing: border-box;
        border-radius: 6px;
        padding: 6px;
       }
       .download-item-apple {
        background-color: #000;
       }
       .download-item-android {
 border:1px solid #d02d54;
 background-color:#f0f5fe;

       }
       .download-right {
        margin-left: 16px;
        display: flex;
        flex-direction: column;
        
       }
       .download-cn {

              font-size: 16px;

              font-weight: 700;
       }
       .download-en {
           
          font-size: 12px;
                font-weight: 300;
       }
       .download-android-color {
         color: #d02d54;
       }
       .download-apple-color {
         color: #fff;
       }
.download-logo {
  height: 24px;
  width: auto;
}
      .evaluate {
        display: flex;
        align-items: center;
        margin-top: 42px;
      }
      .star-svg-box {
        display: flex;
        align-items: center;
        svg {
          margin-right: 3px;
        }
      }
      .evaluate-text {
        color:#333;
        font-size: 14px;
        line-height: 18px;
        font-weight: 400;
        font-family:
          Helvetica,
          PingFang SC,
          Hiragino Sans GB,
          Microsoft YaHei,
          '\5FAE\8F6F\96C5\9ED1',
          Arial,
          sans-serif;
      }
      .logo-box {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
        background-color: #f2f3f5;
        border-radius: 4px;
        padding: 8px;
        &.top-five-leagues {
          align-items: center;
        }
      }
      .logo-top {
        margin: 12px 0 8px 0;
      }
      .logo-card {
    
          /* Layout */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 380px;              /* Figma Fill,实际 380.51px */
  height: 54px;             /* Figma Hug */
  padding: 16px;
  border-radius: 4px;
  
  /* Fill: #F0F0F0 @ 30% */
  background-color: rgba(240, 240, 240, 0.3);
  
  /* Background blur */
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  
  /* 5 层堆叠 drop shadows */
  box-shadow:
    -2px  4px  10px 0 rgba(145, 145, 145, 0.05),
    -7px  17px 18px 0 rgba(145, 145, 145, 0.04),
    -15px 37px 24px 0 rgba(145, 145, 145, 0.03),
    -27px 66px 29px 0 rgba(145, 145, 145, 0.01);
    /* 第 5 层原始为 0% 不可见,已省略;需要保留设计保真度可加回 */
  
  position: relative;
  isolation: isolate;
      }
      .logo-card::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: conic-gradient(
    from 0deg,
    rgba(255, 134, 134, 0.5),
    rgba(255, 134, 134, 0.35),
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.5),
    rgba(255, 134, 134, 0.35),
    rgba(249, 249, 249, 0.5),
    rgba(255, 255, 255, 0.5),
    rgba(249, 249, 249, 0.5),
    rgba(255, 134, 134, 0.5)  /* 闭环回到起点色 */
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
}
      .logo-item {
        height: 22px;
        width: auto;
      }
      .logo-item + .logo-item {
        margin-left: 20px;
      }
      .logo-x9 {
        width: 71.6px;
        background-image: var(--x9-logo-background-image-url);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .logo-hgroup {
        color: #303133;
        font-family: Helvetica, sans-serif;
        font-size: 14px;
        font-weight: 700;
        margin-right: 17px;
      }
    }
  }
  .section-2 {
    background-color: var(--el-bg-color-page);
    padding: 42px 0;
    .inner-box {
      margin: 0 auto;
      max-width: 959px;
      .advantage-list {
        display: flex;
        justify-content: space-between;
        width: 100%;
        .advantage-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .advantage-info--icon {
          width: 72px;
          height: auto;
        }
        .advantage-info-title {
          font-size: 24px;
          color: var(--el-text-color-primary);
          font-weight: 700;
          line-height: 28px;
        }
        .advantage-info-desc {
          font-size: 14px;
          color: var(--el-text-color-regular);
          font-weight: 400;
          line-height: 22px;
          margin-top: 1.46px;
        }
        .advantage-figure-box {
          width: 224px;
          margin-top: 7.6px;
        }
        .advantage-figure {
          @include imageStyle-cover;
        }
      }
    }
  }
  .section-3 {
    background-color: var(--el-bg-color-overlay);
    .inner-box {
      // margin-left: 19.79%;
      // margin-right: 19.79%;
      margin: 0 auto;
      max-width: 1160px;
    }
    .installation {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-top: 46px;
      padding-bottom: 83.7px;
      .hgroup {
        color: var(--el-text-color-primary);
        text-align: center;
        font-size: 48px;
        font-weight: 800;
        line-height: 65px;
      }
      .installation-tips {
        margin-top: 16px;
        margin-bottom: 16.3px;
        color: var(--el-text-color-regular);
        text-align: center;
        @include fontStyle-Headline2-Medium;
      }
      .installation--row {
        .title {
          display: flex;
          align-items: center;
          padding-left: 21.32px;
          height: 32px;
          margin-bottom: 8px;
          &--text {
            margin-left: 8.88px;
            color: var(--el-text-color-primary);
            font-size: 20px;
            font-weight: 600;
          }
        }
        .installation-step-list {
          display: flex;
          justify-content: space-between;
          .step-item {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 258px;
          }
          .step-title {
            color: var(--el-text-color-primary);
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            font-family: var(--fontFamily-PingFangSC);
          }
          .step-desc {
            margin-top: 2px;
            color: var(--el-text-color-regular);
            font-size: 14px;
            font-weight: 400;
            text-align: center;
            font-family: var(--fontFamily-PingFangSC);
            white-space: nowrap;
          }
          .installation-figure {
            text-align: center;
            margin-top: 11px;
            min-height: 205px;
            height: 205px;
            :deep(img) {
              height: 205px;
              width: auto;
            }
          }
        }
      }
      .hr {
        width: 100%;
        height: 2px;
        background: rgba(217, 217, 217, 0.2);
        margin: 19px 0;
      }
    }
  }

  @media only screen and (max-width: 1200px) {
    .section-1 {
      .model-figure-box {
        width: 460px;
        transform: translateX(-40px);
      }
    }
    .section-2 {
      .inner-box {
        max-width: 650px;
        .advantage-list {
          .advantage-info--icon {
            width: 54px;
          }
          .advantage-info-title {
            font-size: 18px;
          }
          .advantage-info-desc {
            font-size: 12px;
          }
          .advantage-figure-box {
            width: 170px;
          }
        }
      }
    }
    .section-3 {
      .inner-box {
        max-width: 600px;
        .installation-step-list {
          flex-wrap: wrap;
        }
        .step-item {
          flex: 0 0 40%;
          &:nth-child(n + 3) {
            margin-top: 20px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.android-download-popover.el-popover.el-popper,.ios-download-popover.el-popover.el-popper {
  min-width: 84px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.06);
  .ios_a {
    display: block;
    color: var(--el-text-color-primary);
    transition: color var(--el-transition-duration);
    &:hover {
      color: var(--el-color-primary);
    }
    &:not(:first-child) {
      margin-top: 5px;
    }
  }
}
</style>
