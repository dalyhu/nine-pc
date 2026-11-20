<template>
  <DfDialog
    v-model:isDialog="isDialog"
    isWidth="542px"
    :footerButton="{
      width: '100%',
      height: '48px',
      fontSize: '17px',
      borderRadius: '30px'
    }"
    @_updataAttentFun="handleSure"
  >
    <div class="title">活动说明</div>
    <div class="caption-content">{{ description }}</div>
  </DfDialog>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:isPackPayCaptionShow'])
const props = defineProps({
  isPackPayCaptionShow: {
    type: Boolean,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
const isDialog = ref(false)

const handleSure = () => {
  emit('update:isPackPayCaptionShow', false)
}

watch(
  () => props.isPackPayCaptionShow,
  (val) => {
    isDialog.value = val
  }
)
</script>
<style scoped lang="scss">
.caption-content {
  padding: 0 24px;
  height: 210px;
  overflow-y: auto;
  scrollbar-width: none;
  white-space: pre-wrap;
  word-break: break-word;
  &::-webkit-scrollbar {
    display: none;
  }
}
.title {
  font-size: 17px;
  font-weight: 550;
  padding-bottom: 36px;
  text-align: center;
}
</style>
