<script lang="ts" setup>
import { emojis } from './emojis'

const emit = defineEmits(['selected'])
</script>
<template>
  <div class="df_emoji_picker_list_panel hide_scrollbar">
    <div v-for="(item, index) in emojis" :key="index" class="df_emoji_picker_item_box">
      <div @click="() => emit('selected', { type: 'emoji', content: item, data: item })">
        {{ item }}
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.df_emoji_picker_list_panel {
  height: 350px;
  width: 100%;
  display: flex;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  flex-wrap: wrap;
  padding: 6px;
  background-color: var(--el-bg-color-overlay);
  border: 1px solid var(--el-bg-color-overlay);
  border-top-left-radius: 4;
  border-top-right-radius: 4;
}

.df_emoji_picker_item_box {
  height: 37px;
  width: 37px;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 3px;

  > div {
    font-size: 24px;
    overflow: hidden;
    text-align: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    font-family:
      Twemoji,
      NotomojiColor,
      Notomoji,
      EmojiOne Color,
      Symbola,
      Noto,
      Segoe UI Emoji,
      OpenSansEmoji,
      monospace;
  }
}
</style>
