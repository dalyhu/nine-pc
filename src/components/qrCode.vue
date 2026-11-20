<!-- 下载 -->
<template>
  <canvas :id="wrapId" :style="{ width: size + 'px', height: size + 'px' }"></canvas>
</template>

<script>
import QRious from 'qrious'

export default {
  props: {
    wrapId: {
      type: String,
      default: 'qrcode'
    },
    size: {
      type: Number,
      default: 120 // px
    }
  },
  mounted() {
    this.showQRcode()
  },
  methods: {
    showQRcode() {
      const appUrl = location.protocol + '//' + window.location.host + '/m/download'
      const channel = this.$store.state.channelCode
      const userId = this.$store.state.user.infoData.id

      new QRious({
        element: document.querySelector('#' + this.wrapId),
        size: this.size * 3,
        value: `${appUrl}?source=qrcode${channel ? '&channel_code=' + channel : ''}${
          userId ? '&g_id=' + userId : ''
        }`,
        level: 'H'
      })
    }
  }
}
</script>
