<template>
  <template v-for="(subItem, index) in menuList" :key="subItem.path">
    <el-menu-item :index="subItem.path" @click="handleClickMenu(subItem)">
      <template #title>
        <el-popover
          ref="popoverRefs"
          popper-class="sub_menu_box"
          width="114"
          v-if="subItem.showPopper"
          :trigger="tabletMode ? 'click' : 'hover'"
        >
          <template #reference>
            <span @click="tabletMode && $event.stopPropagation()">
              <span class="subItem_title_box">{{ subItem.title }}</span>
              <el-icon size="12">
                <component :is="subItem.icon"></component>
              </el-icon>
            </span>
          </template>
          <div
            :class="['el_popover_item', { 'is-active': item.path === subMenuActive }]"
            @click="handleClickMenu(item, index)"
            v-for="item in subItem.children"
            :key="item.path"
          >
            <el-icon size="16">
              <component :is="item.icon"></component>
            </el-icon>
            {{ item.title }}
          </div>
        </el-popover>
        <el-popover
          ref="downloadPopoverRef"
          popper-class="el_popover_downLoad"
          v-else-if="['/downLoad'].includes(subItem.path)"
          :trigger="tabletMode ? 'click' : 'hover'"
          width="268"
        >
          <template #reference>
            <span @click="tabletMode && $event.stopPropagation()">{{ subItem.title }} </span>
          </template>
          <div class="el_popover_downLoad_box">
            <span class="downLoad_title">小𝟵直播移动端</span>
            <span class="downLoad_sub_title">扫码下载小𝟵APP</span>
            <div class="downLoad_qrCode">
              <qrCode wrapId="qrcode-navbar" :size="112"></qrCode>
            </div>
            <el-button @click="gotoDownload" type="primary">立即下载</el-button>
          </div>
        </el-popover>
        <span v-else>{{ subItem.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import qrCode from '@/components/qrCode.vue'
import { getBbsUrl } from '@/api/common'
import { getUrlParams, normalizeUrl } from '@/utils'
import { useStore } from 'vuex'

defineProps({
  menuList: {
    type: Array,
    required: true
  }
})

const tabletMode = document.documentElement.hasAttribute('data-tablet-pc')
const router = useRouter()
const route = useRoute()

const store = useStore()

const isLogin = computed(() => !!store.state.user.infoData.id)

const popoverRefs = ref([])
const downloadPopoverRef = ref(null)

const subMenuActive = computed(() => route.path + '?type=' + route.query.type)

const handleClickMenu = (subItem, index) => {
  if (index != null && popoverRefs.value[index - 1]) {
    popoverRefs.value[index - 1].hide()
  }

  nextTick(() => {
    if (subItem.path && subItem.path === '/forum') {
      linkBbsUrlFun()
    } else {
      router.push(subItem.path)
    }
  })
}

const redirectTo = getUrlParams('redirectTo')

const getPrefix = (url) => {
  return url.includes('?') ? '&' : '?'
}
// 请求返回的论坛路径
const linkBbsUrlFun = async () => {
  try {
    const res = await getBbsUrl()
    if (res.code === 0) {
      const channel_code = getUrlParams('channel_code') || ''
      let url = window.location.origin + res.data.bbs_url

      if (!isLogin.value) {
        const fingerprintId = localStorage.getItem('fingerprintId')
        if (fingerprintId) {
          url +=
            getPrefix(url) + 'fingerprintId=' + btoa(unescape(encodeURIComponent(fingerprintId)))
        }
      }
      if (redirectTo) {
        url += getPrefix(url) + `redirectTo=${redirectTo}`
      }

      window.location.href = normalizeUrl(url + getPrefix(url) + 'channel_code=' + channel_code)
    }
  } catch (error) {
    console.log(error)
  }
}

const gotoDownload = () => {
  if (downloadPopoverRef.value[0]) downloadPopoverRef.value[0].hide()

  nextTick(() => {
    router.push('download')
  })
}
</script>

<style scoped lang="scss">
.el-menu-item {
  color: #e5eaf3;
  &:hover,
  &:focus {
    color: #d02d54 !important;
    background-color: #27171a !important;
  }
  .subItem_title_box {
    margin-left: 8px !important;
  }
}
.el-menu-item [class^='el-icon'] {
  margin-right: 0px !important;
  margin-left: 5px !important;
  width: auto;
}
.sub_menu_box {
  .el_popover_item {
    height: 34px;
    display: flex;
    // justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #e5eaf3;
    &:deep(.el-icon) {
      margin-left: 25px;
    }
    &:hover {
      background-color: #40181d;
      color: var(--el-primary-background-color);
      :deep(svg) {
        fill: var(--el-primary-background-color);
        stroke: var(--el-primary-background-color);
        path {
          fill: var(--el-primary-background-color);
          stroke: var(--el-primary-background-color);
        }
      }
    }
    .el-icon {
      margin-right: 6px;
    }
  }
  .is-active {
    background-color: #40181d;
    color: var(--el-primary-background-color);

    :deep(svg) {
      fill: var(--el-primary-background-color);
      stroke: var(--el-primary-background-color);
      path {
        fill: var(--el-primary-background-color);
        stroke: var(--el-primary-background-color);
      }
    }
  }
}
// 下载弹框
.el_popover_downLoad {
  .el_popover_downLoad_box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .downLoad_title {
      text-align: center;
      color: #e5eaf3;
      font-size: 16px;
      font-weight: 600;
      font-style: normal;
      line-height: 34px;
    }
    .downLoad_sub_title {
      text-align: center;
      color: #8d9095;
      font-size: 14px;
      font-weight: 400;
      font-style: normal;
      margin-bottom: 10px;
    }
    .downLoad_qrCode {
      width: 126px;
      height: 126px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      box-sizing: border-box;
      border: 1px solid #414243;
      margin-bottom: 12px;
      border-radius: 4px;
      overflow: hidden;
    }
    a {
      width: 100%;
    }
    .el-button {
      width: 100%;
    }
  }
}
</style>

<style lang="scss">
// 下载提示框
.el_popover_downLoad {
  background-color: #1d1e1f !important;
  border: 1px solid #363637 !important;
  .el-popper__arrow::before {
    background-color: #1d1e1f !important;
    border: 1px solid #414243 !important;
  }
}
.sub_menu_box {
  min-width: 114px !important;
  padding: 10px 0 !important;
  background-color: #1d1e1f !important;
  border: 1px solid #363637 !important;
  .el-popper__arrow::before {
    background-color: #1d1e1f !important;
    border: 1px solid #414243 !important;
  }
}
</style>
