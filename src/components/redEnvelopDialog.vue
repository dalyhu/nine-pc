<template>
  <el-dialog
    :show-close="false"
    v-model="dialogShow"
    :center="true"
    width="420px"
    class="red_dialog"
    top="30vh"
  >
    <template #header>
      <div class="title">优惠小助手</div>
      <el-icon @click="handleClose" size="30">
        <CircleCloseFilled></CircleCloseFilled>
      </el-icon>
    </template>
    <div class="red_content">
      <a @click="diamondDirectionsBtnClick()">
        <img src="/static/images/daily/red-z.png" />
      </a>
      <a @click="showZbChat">
        <img src="/static/images/daily/red-x.png" />
      </a>
    </div>
  </el-dialog>
</template>

<script setup name="redEnvelopDialog" lang="ts">
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { CircleCloseFilled } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // 选中的房间信息
  chatRoomInfo: {
    type: Object,
    default: () => ({})
  }
})

const store = useStore()
const router = useRouter()

const emits = defineEmits(['update:modelValue', 'showZbChat'])

const dialogShow = computed({
  get: function () {
    return props.modelValue
  },
  set: function (newValue) {
    emits('update:modelValue', newValue)
  }
})

const diamondDirectionsBtnClick = () => {
  if (!store.state.user.infoData.id) {
    store.commit('user/SET_LOGIN_MASK', true)
  }
  let { href } = router.resolve({
    path: '/dailyMission'
  })
  window.open(href, '_self')
  handleClose()
}
const showZbChat = () => {
  emits('showZbChat')
}
const handleClose = () => {
  dialogShow.value = false
}
</script>

<style lang="scss">
.red_dialog {
  border-radius: 20px;
  .el-dialog__body {
    padding-top: 16px;
    .red_content {
      display: flex;
      justify-content: space-between;
      a {
        transition: 0.3s;
        &:hover {
          transform: translateY(-4px);
        }
      }
    }
  }

  .el-dialog__header {
    padding: 10px 30px !important;
    border-bottom: 1px solid var(--el-border-color-light);
    margin-right: 0;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    position: relative;
    .title {
      font-weight: bold;
      color: var(--el-text-color-primary);
    }
    i {
      position: absolute;
      cursor: pointer;
      top: 7px;
      right: 7px;
      transition: 0.3s;
      &:hover {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
