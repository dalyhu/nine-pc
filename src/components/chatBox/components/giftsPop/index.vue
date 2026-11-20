<template>
  <div class="gifts_pop_list" :class="{ 'tablet-gifts': tabletMode }" ref="giftsScrollerRef">
    <el-popover
      v-for="(gift, index) in giftList"
      :key="gift.id"
      popper-class="normal_popover"
      :show-arrow="false"
      width="310"
      placement="top"
      :offset="14"
      :show-after="200"
      :trigger="tabletMode ? 'click' : 'hover'"
      ref="gifPopoverRef"
      @show="gifPopoverIndex = index"
      @before-enter="gift.isHover = true"
      @before-leave="gift.isHover = false"
      :teleported="false"
    >
      <template #reference>
        <div class="gift_item" :class="{ 'touch-preview': tabletMode && gift.isHover }">
          <df-container :height-ratio="100">
            <df-image-lazy
              class="gift_icon"
              fit="cover"
              placeholder-src="/static/images/placeholder_gray_bg.png"
              :src="gift.gifticon"
            />
            <div class="gift_send_btn" @click="tabletMode && $event.stopPropagation(); debouncedSendGift(gift)">赠送</div>
          </df-container>
        </div>
      </template>
      <template #default>
        <GiftDetail :data="gift" />
      </template>
    </el-popover>
  </div>
  <div class="gifts_pop_assets">
    <div>
      <span>我的钻石：</span><span class="assets_count">{{ floor(userInfo.balances || 0) }}</span>
    </div>
    <div>
      <span class="guide_title">如何获得钻石</span
      ><IconQuestion class="guide_btn" @click="showDiamondDirections = true" />
    </div>
  </div>
  <el-dialog
    v-model="showDiamondDirections"
    align-center
    :append-to-body="true"
    :show-close="false"
    modal-class="is_gifts_pop_inner normal_dialog"
  >
    <GetCoinGuide @close="showDiamondDirections = false" />
  </el-dialog>
</template>
<script setup lang="ts">
import IconQuestion from '@/components/icons/iconQuestion.vue'
import GiftDetail from '@/components/chatBox/components/giftsPop/giftDetail.vue'
import GetCoinGuide from '@/components/chatBox/components/giftsPop/getCoinGuide.vue'
import { computed } from 'vue'
import { handselGift, getList } from '@/api/user.js'
import { useDebounceFn, useScroll } from '@vueuse/core'
import { floor } from 'lodash-es'
import { useStore } from 'vuex'
import dfContainer from '@/components/dfContainer/index.vue'

const tabletMode = document.documentElement.hasAttribute('data-tablet-pc')
const props = defineProps({
  vid: {
    type: String,
    default: ''
  },
  uid: {
    type: Number,
    default: 0
  }
})

const gifPopoverRef = ref<HTMLElement | null>(null)
const giftsScrollerRef = ref<HTMLElement | null>(null)
const gifPopoverIndex = ref<number>(0)
// @ts-ignore
const { isScrolling } = useScroll(giftsScrollerRef)
const gifts = inject<Ref<[]>>('gifts')
const showDiamondDirections = ref(false)
const giftList = ref([])
const store = useStore()

const userInfo = computed(() => store.state.user.infoData)

watch(
  () => isScrolling.value,
  (val) => val && gifPopoverRef.value[gifPopoverIndex.value]?.hide()
)

onMounted(() => {
  if (gifts.value.length) giftList.value = gifts.value
  else initGiftList()
})

async function initGiftList() {
  try {
    const { data = [] } = await getList()
    giftList.value = data
  } catch (error) {
    console.log(error)
  }
}

const debouncedSendGift = useDebounceFn(async (item) => {
  if (!userInfo.value.id) {
    store.commit('user/SET_LOGIN_MASK', true)
    return
  }

  if (parseFloat(userInfo.value.balances) < item.needcoin)
    return ElMessage.warning('钻石不足, 先做日常任务领取钻石后再来吧~')

  if (userInfo.value.id === props.uid) return ElMessage.warning('主播不允许给自己刷礼物')

  // try {
    let res = await handselGift({
      gift_id: item.id,
      anchor_id: props.uid,
      type: 0,
      exp_icon: userInfo.value.exp_icon,
      is_guard: userInfo.value.is_guard,
      is_room: 0,
      guard_icon: userInfo.value.is_guard == 1 ? userInfo.value.guard.icon : ''
    })

    if (res && res.code === 0) {
      ElMessage.success('赠送成功')
      store.dispatch('updateUserInfo')
    } else {
      ElMessage.success(res.msg || '请稍后在试')
    }

  // } catch (error) {
    // ElMessage.success('请稍后在试')
  // }
}, 500)
</script>
<style lang="scss" scoped>
.gifts_pop_list {
  max-height: 120px;
  overflow-y: scroll;
  background-color: var(--el-fill-color-extra-light);
  padding: 4px;
  padding-right: 0px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  .gift_item {
    width: 12.5%;
    display: inline-block;
    padding: 4px;
    &.touch-preview .df_container .gift_send_btn {
      display: flex;
    }
    .df_container {
      border-radius: 4px;
      border: 1px solid var(--el-border-color-lighter);
      cursor: pointer;
      :deep(.df_container_inner) {
        padding: 4px;
        .el-image__error {
          font-size: 12px;
          line-height: 14px;
        }
      }
      .gift_icon {
        width: 100%;
        height: 100%;
      }
      .gift_send_btn {
        border-radius: 4px;
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 10;
        top: 0;
        left: 0;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 12px;
        color: var(--el-color-white);
        line-height: 20px;
        background-color: var(--el-color-primary-light-3);
      }
      &:hover {
        .gift_send_btn {
          display: flex;
        }
      }
    }
  }
  // 触摸会模拟 hover；选中预览前不显示赠送覆盖层。
  &.tablet-gifts .gift_item:not(.touch-preview) .gift_send_btn {
    display: none;
  }
}
.gifts_pop_assets {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 16px;
  justify-content: space-between;
  background-color: var(--el-color-warning-light-9);
  > div {
    display: flex;
    align-items: center;
    > * {
      display: block;
      font-size: 12px;
      line-height: 16px;
      color: var(--el-text-color-primary);
    }
  }
  .guide_btn {
    display: block;
    cursor: pointer;
    width: 16px;
    height: 16px;
    margin-left: 2px;
    stroke: var(--el-color-white);
    fill: var(--el-text-color-placeholder);
  }
  .assets_count {
    font-weight: 700;
    line-height: 24px;
    font-size: 16px;
  }
  .guide_title {
    color: var(--el-text-color-placeholder);
  }
}
</style>
