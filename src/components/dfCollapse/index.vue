<template>
  <div class="df_collapse">
    <div class="df_collapse_inner">
      <slot></slot>
    </div>
    <div class="expand_btn" v-if="rowCount > previewRows" @click="toggle(!isExpand)">
      <slot v-if="$slots.statusIcon" name="statusIcon" :is-expand="isExpand"></slot>
      <template v-else>
        <i v-if="!isExpand" class="el-icon-arrow-down"></i>
        <i v-else class="el-icon-arrow-up"></i>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dfCollapse',
  props: {
    previewRows: {
      type: Number,
      default: 2
    },
    maxHeight: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      isExpand: false,
      rowCount: 0
    }
  },
  mounted() {
    this.computedHeight()
    this.observer = new MutationObserver(this.computedHeight)
    this.observer.observe(this.$el, {
      childList: true,
      subtree: true
    })
  },
  beforeUnmount() {
    this.observer.disconnect()
  },
  methods: {
    toggle(status) {
      this.isExpand = status
      this.innerEl.scrollTop = 0

      if (this.isExpand) {
        const height = Math.min(
          this.maxHeight,
          this.paddingTop + this.rowCount * this.lineHeight + this.paddingBottom
        )

        this.$el.style.height = height + 'px'

        Object.assign(this.innerEl.style, {
          maxHeight: height + 'px',
          display: 'block',
          overflowY: 'auto'
        })
      } else {
        this.$el.style.height =
          this.paddingTop +
          Math.min(this.previewRows, this.rowCount) * this.lineHeight +
          this.paddingBottom +
          'px'

        if (this.previewRows <= this.rowCount) {
          Object.assign(this.innerEl.style, {
            lineClamp: this.previewRows,
            webkitLineClamp: this.previewRows,
            display: '-webkit-box',
            overflowY: 'hidden'
          })
        }
      }
    },
    computedHeight() {
      try {
        this.innerEl = this.$el.children[0]
        this.innerEl.style.display = 'block'
        this.isExpand = false

        setTimeout(() => {
          const { paddingTop, paddingBottom } = window.getComputedStyle(this.$el) || {}
          const {
            fontSize,
            lineHeight,
            height: contentHeight
          } = window.getComputedStyle(this.innerEl) || {}

          this.fontSize = this.pxToValue(fontSize) || 14
          this.lineHeight = this.pxToValue(lineHeight) || Math.ceil(this.fontSize * 1.14)
          this.paddingTop = this.pxToValue(paddingTop)
          this.paddingBottom = this.pxToValue(paddingBottom)
          this.contentHeight = this.pxToValue(contentHeight)
          this.rowCount = Math.floor(this.contentHeight / this.lineHeight) || 1

          Object.assign(this.innerEl.style, {
            lineHeight: this.lineHeight + 'px',
            fontSize: this.fontSize + 'px'
          })

          this.toggle(this.isExpand)
        }, 0)
      } catch (error) {
        //
      }
    },
    pxToValue(px) {
      try {
        if (px && px !== 'normal') return Math.ceil(px.replace('px', ''))
        return 0
      } catch (error) {
        return 0
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.df_collapse {
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  .df_collapse_inner {
    white-space: pre-wrap;
    word-break: break-all;
    height: fit-content;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    :deep(img) {
      display: inline-block;
      width: auto;
      min-width: 12px;
      height: 12px;
      margin-left: 2px;
      margin-right: 2px;
      object-fit: cover;
    }
    &::-webkit-scrollbar {
      width: 2px;
    }
  }
  .expand_btn {
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 4px;
    right: 4px;
    border-radius: 4px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-icon-arrow-up,
    .el-icon-arrow-down {
      display: block;
      font-size: 14px;
      color: #e0e0e0;
    }
  }
}
</style>
