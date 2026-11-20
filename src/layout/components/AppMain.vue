<template>
  <div class="app_main_box" :class="{ 'live-route': key === '/live' }">
    <PageErrorBoundary>
      <router-view v-slot="{ Component }">
        <transition name="fade-transform" mode="out-in">
          <component :is="Component" :key="key" />
        </transition>
      </router-view>
    </PageErrorBoundary>
  </div>
</template>

<script>
import PageErrorBoundary from '@/components/PageErrorBoundary/index.vue'

export default {
  name: 'AppMain',
  components: { PageErrorBoundary },
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped lang="scss">
.app_main_box {
  position: relative;
  min-height: calc(100vh - 54px);
  width: 100%;
  overflow: hidden;
  background: var(--el-bg-color-page);
}
</style>
