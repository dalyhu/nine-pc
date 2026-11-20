<template>
  <div class="ipa-qr-page">
    <div class="ipa-qr">
      <h1>请使用手机扫描二维码下载</h1>
      <img class="ipa-qr-icon" src="/static/images/ipa-download/app-icon.png" alt="小9直播" />
      <p class="ipa-qr-name">小9直播</p>
      <canvas ref="qrCanvas" class="ipa-qr-code" />
      <p class="ipa-qr-disclaimer">声明：本平台仅提供下载托管，APP 内容由开发者负责，与本平台无关</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import QRious from 'qrious'

const QUERY_KEYS = ['prefix', 'hash', 'ver', 'channel_code', 'g_id', 'from']

function queryText(value) {
  if (Array.isArray(value)) return value[0] || ''
  return value ? String(value) : ''
}

const route = useRoute()
const store = useStore()
const qrCanvas = ref(null)

function buildMobileIpaUrl() {
  const params = new URLSearchParams()
  QUERY_KEYS.forEach((key) => {
    const value = queryText(route.query[key])
    if (value) params.set(key, value)
  })
  if (!params.get('channel_code') && store.state.channelCode) {
    params.set('channel_code', store.state.channelCode)
  }
  const qs = params.toString()
  return `${location.protocol}//${location.host}/m/ipa-download${qs ? `?${qs}` : ''}`
}

function renderQr() {
  if (!qrCanvas.value) return
  const value = buildMobileIpaUrl()
  qrCanvas.value.dataset.value = value
  new QRious({
    element: qrCanvas.value,
    size: 600,
    value,
    level: 'M',
    background: '#ffffff',
    foreground: '#000000'
  })
}

watch(() => route.fullPath, () => nextTick(renderQr))
onMounted(() => nextTick(renderQr))
</script>

<style lang="scss" scoped>
.ipa-qr-page {
  height: 100vh;
  overflow: auto;
  background: #fff;
  color: #222;
  color-scheme: light;
}

.ipa-qr {
  width: min(960px, 100%);
  margin: 0 auto;
  padding: 48px 24px 64px;
  text-align: center;

  h1 {
    margin: 0;
    color: #6c757d;
    font-size: 24px;
    font-weight: 400;
    line-height: 24px;
  }
}

.ipa-qr-icon {
  width: 120px;
  height: 120px;
  margin-top: 28px;
  border-radius: 14px;
  object-fit: cover;
}

.ipa-qr-name {
  margin: 25px 0 0;
  color: #222;
  font-size: 24px;
  font-weight: 600;
  line-height: 20px;
}

.ipa-qr-code {
  display: block;
  width: 200px;
  height: 200px;
  margin: 36px auto 0;
}

.ipa-qr-disclaimer {
  margin: 30px 0 0;
  color: #6c757d;
  font-size: 16px;
  line-height: 18px;
}
</style>
