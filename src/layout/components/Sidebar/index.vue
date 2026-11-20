<template>
  <div class="main_page_footer">
    <div class="footer_info">
      <div class="logo_box">
        <img src="/static/images/nav/logo.png" alt="" />
      </div>
      <div class="logo_help_box">
        <ul>
          <li>
            <h4>主播帮助</h4>
            <a href="/about-user">主播开播教程</a>
            <a href="/about-user">直播规范</a>
            <a href="/about-user">直播协议</a>
            <a href="https://obsproject.com/download" target="_blank">直播工具下载</a>
          </li>
        </ul>
        <ul class="ul_1">
          <li>
            <h4>联系我们</h4>
            <a>申请主播QQ ： {{ system.apply_for_anchor }}</a>
            <a>问题反馈QQ ：{{ system.feedback_qq }}</a>
            <a class="a_end" @click="handleClickCopy"
              >客服邮箱 ： {{ system.customer_service_email }}</a
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="foot_copyright">
      <p class="agreement">
        <router-link target="_self" to="/about-user">
          <a>关于我们</a>
          <b>|</b>
          <a>用户协议</a>
          <b>|</b>
          <a>隐私政策</a>
        </router-link>
      </p>
      <p v-if="route.name === 'downLoad'" class="agreement" style="font-size: 12px">
        软体名称:{{ system.app_name }} | 开发者名称:{{ system.app_company }} | 版本号:{{
          system.app_version
        }}
        | 更新时间:{{ system.app_updatedate }}
      </p>
      <p class="agreement" style="font-size: 14px">
        ∷直播所有足球直播和NBA直播信号均由用户收集或从搜索引擎搜索整理获得，所有内容均
        来自互联网，我们自身不提供任何直播信号和视频内容，如有侵犯您的权益请通知我们，我们会第一时间处理。
      </p>
      <p class="copyright">
        <a href="https://beian.miit.gov.cn" target="_blank" rel="nofollow">{{ system.site_icp }}</a>
        <b>|</b>
        <a href="https://beian.miit.gov.cn" target="_blank" rel="nofollow">{{ system.site_gwa }}</a>

        <a rel="nofollow">{{ system.Value_added_business_license }}</a>
      </p>
      <p class="right">Copyright @ 2019-2021 . ALL Rights Reserved</p>
    </div>
  </div>
</template>

<script setup name="Sidebar">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useClipboard } from '@vueuse/core'

const store = useStore()
const route = useRoute()

const { copy } = useClipboard()

const system = computed(() => {
  return store.state.system
})

const handleClickCopy = () => {
  copy(system.value.customer_service_email)
  ElMessage.success('复制成功')
}
</script>

<style scoped lang="scss">
$mediumMaxWidth: 1144px;
$smallMaxWidth: 800px;
.main_page_footer {
  width: 100%;
  background-color: #25262e;
  position: relative;
  z-index: 50;
  p {
    margin: 0;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #808392;
  }
  .footer_info {
    max-width: 1424px;
    margin: 0 auto;
    width: 73.59%;
    display: flex;
    justify-content: space-between;
    padding-bottom: 18px;
    padding-top: 18px;
    border-bottom: 1px solid #33343d;
    min-width: $smallMaxWidth;
    // 自适应 - 1440
    @include screen(medium) {
      max-width: $mediumMaxWidth;
    }
    // 自适应 - 1080
    @include screen(small) {
      max-width: $smallMaxWidth;
    }

    .logo_box {
      img {
        display: block;
        width: 108px;
      }
    }
    .logo_help_box {
      display: flex;
      ul {
        li {
          h4 {
            color: #dedfe5;
            padding-left: 8px;
            font-size: 15px;
            font-weight: 600;
            border-left: 2px solid #d02d54;
            margin-bottom: 8px;
          }
          a {
            font-size: 12px;
            color: #8d93a1;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 13px;
            &:hover {
              color: #d02d54;
            }
          }
          .a_end {
            margin-right: 0px;
          }
        }
      }
      .ul_1 {
        margin-left: 42px;
      }
    }
  }

  .foot_copyright {
    background-color: #25262e;
    .agreement {
      padding: 15px 0 0 0;
      cursor: default;
      -ms-user-select: none;
      user-select: none;
      margin-bottom: 3px;
      a {
        color: #808392;
        padding: 0 10px;
        font-size: 12px;
      }
      b {
        color: #808392;
      }
      a:hover {
        color: #d02d54;
      }
    }
    .copyright {
      padding-top: 8px;
      font-size: 12px;
      b {
        color: #808392;
      }
      a {
        display: inline-block;
        margin: 0 10px;
        color: #808392;
      }
      a:hover {
        color: #d02d54;
      }
    }
  }
  p.right {
    color: #4a4c55;
    font-size: 12px;
    padding-top: 10px;
    padding-bottom: 16px;
  }
}
</style>
