<template>
  <ul v-if="showDisclaimer" class="upload-tips disclamer">
    <li>免责声明:</li>
    <template v-if="customNoticeEnabled">
      <li class="custom-notice-wrap">
        <div class="custom-notice" v-html="noticeHtmlForDisplay" />
      </li>
    </template>
    <template v-else>
      <li v-for="(item, index) in textList" :key="index">
        <span>{{ item.text }}</span>
      </li>
    </template>
  </ul>
</template>

<script lang="ts" setup>
const props = defineProps({
  /** 为 false 时不渲染免责整块（标题 + 正文） */
  showDisclaimer: {
    type: Boolean,
    default: true
  },
  /** 展示后台配置的 HTML，不展示默认 textList */
  noticeHtml: {
    type: String,
    default: ''
  },
  /** 自定义活动且 notice.show==1 时为 true；text 为空仍走自定义区块（仅标题下空白），不显示默认 textList */
  customNoticeEnabled: {
    type: Boolean,
    default: false
  }
})

/** 统一换行：真实 \r\n / \n，以及文案里字面的 \n、\r\n（反斜杠转义写法） */
const noticeHtmlForDisplay = computed(() => {
  const raw = props.noticeHtml
  if (!raw) return ''
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
})
const textList = [
  {
    text: '1、平台首先以玩家包賠的截图为准, 如截图正确但单号不正确,可以联系助理修改(反之不可以修改)。'
  },
  {
    text: '2、如上传非包賠赛事截图, 但单号提供正确, 则以单号进行包賠登记。'
  },
  {
    text: '3、如截图和单号都上传错误, 视为放弃本次包賠活动。'
  },
  {
    text: '4、每个账号每个活动只能申请一次。'
  }
]
</script>
<style lang="scss" scoped>
.upload-tips {
  font-size: 12px;
  font-weight: 400;
  color: #848587;
  padding: 10px 0;

  &.disclamer {
    padding: 0;
    color: #303133;

    .custom-notice-wrap {
      list-style: none;
      padding-bottom: 4px;
    }

    .custom-notice {
      line-height: 1.5;
      white-space: pre-line;

      :deep(p) {
        margin: 0.35em 0;
      }
    }

    li {
      padding-left: 8px;
      padding-bottom: 4px;

      &:first-child {
        padding-left: 0;
      }
    }
  }
}
</style>
