<template>
  <i
    class="new-msg-icon"
    :class="{
      'shark-an': privateChatDotVisible || unreadTotalZB || unreadTotalYY
    }"
  ></i>
</template>

<script>
import mittBus from '@/utils/mittBus'
import { cloneDeep } from 'lodash-es'

export default {
  data() {
    return {
      unreadTotalZB: 0,
      unreadTotalYY: 0
    }
  },
  computed: {
    privateChatDotVisible() {
      return Object.values(this.$store.state.hasNewMsgChatsMap).some((item) => item.count)
    }
  },
  mounted() {
    mittBus.on('imOnMessage', this.handleIMMessage)
  },
  beforeUnmount() {
    mittBus.off('imOnMessage', this.handleIMMessage)
  },
  methods: {
    async handleIMMessage(source) {
      const data = cloneDeep(source)

      try {
        switch (data.action) {
          case 'startLive':
            this.unreadTotalZB++
            break
          case 'reserveStartLive':
            this.unreadTotalYY++
            break
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shark-an {
  display: flex;
}

.new-msg-icon {
  font-style: normal;
  width: 12px;
  z-index: 1;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  right: 4px;
  top: 4px;
  font-size: 10px;
  background-color: var(--el-color-primary);
  color: #fff;
  display: none;
  align-items: center;
  justify-content: center;
  text-indent: -9999px;

  .shark-an {
    display: block;
  }
}
</style>
