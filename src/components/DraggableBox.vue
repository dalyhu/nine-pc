<template>
    <div
      class="draggable-box"
      :style="boxStyle"
      @mousedown="startDrag"
      @click="emitClickEvent"
    >
      <slot>
      </slot>
    </div>
  </template>
  
  <script>
import mittBus from '@/utils/mittBus'
import { ref, onMounted, computed } from 'vue';
  export default {
    props: {
      width: {
        type: String,
        default: '100px',
      },
      height: {
        type: String,
        default: '100px',
      },
      // 96px 拖拽元素的宽
      initialPosition: {
        type: Object,
        default: () => ({ top: '40%', left: 'calc(100% - 96px)'}),
      },
    },
    emits: ['box-click'], // 定义自定义事件
    setup(props, { emit }) {
      const draggableBox = ref(null);
      const offsetX = ref(0);
      const offsetY = ref(0);
      const isDragging = ref(false);
      const startX = ref(0);
      const startY = ref(0);
      const dragThreshold = 5;
      const hasMoved = ref(false);
      const boxPosition = ref(props.initialPosition);

      const clampedX = ref(0);
      const clampedY = ref(0);

      const containerRef = inject('containerRef')
  
     // 初始化位置
      const boxStyle = computed(() => ({
        width: props.width,
        height: props.height,
        position: 'absolute',
        top: boxPosition.value.top,
        left: boxPosition.value.left,
      }));

      // 开始
      const startDrag = (e) => {
        isDragging.value = true;
        hasMoved.value = false;

        mittBus.emit('ifreamAddpro', 'disabled')
        
        startX.value = e.clientX;
        startY.value = e.clientY;
        offsetX.value = e.clientX - draggableBox.value.offsetLeft;
        offsetY.value = e.clientY - draggableBox.value.offsetTop;
  
        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', stopDrag);
      };
  
      const onDrag = (e) => {
        if (isDragging.value) {
            const newX = e.clientX - offsetX.value;
            const newY = e.clientY - offsetY.value;
    
            if (Math.abs(e.clientX - startX.value) > dragThreshold || Math.abs(e.clientY - startY.value) > dragThreshold) {
              hasMoved.value = true;
            }
            
            const containerRect = containerRef.value.getBoundingClientRect();
            const maxLeft = containerRect.width - parseInt(props.width);
            const maxTop = containerRect.height - parseInt(props.height);
    
            clampedX.value = Math.max(0, Math.min(newX, maxLeft));
            clampedY.value = Math.max(0, Math.min(newY, maxTop));
  
            draggableBox.value.style.left = `${clampedX.value}px`
            draggableBox.value.style.top = `${clampedY.value}px`
        }
      };
  
      const stopDrag = () => {
        isDragging.value = false;

        mittBus.emit('ifreamAddpro', 'enabled')

        boxPosition.value = {
          top: `${clampedY.value}px`,
          left: `${clampedX.value}px`,
        };

        window.removeEventListener('mousemove', onDrag);
        window.removeEventListener('mouseup', stopDrag);

        // 停后距离右边距离不变
        boxPosition.value.left = `calc(100% - 96px)`;

      };
  
      // 触发点击事件，只在未发生拖动时触发
      const emitClickEvent = () => {
        if (!hasMoved.value) {
          emit('box-click');
        }
      };
  
      onMounted(() => {
        draggableBox.value = document.querySelector('.draggable-box');
      });

      onBeforeMount(() => {
        window.removeEventListener('mousemove', onDrag);
        window.removeEventListener('mouseup', stopDrag);
      })
  
      return {
        boxStyle,
        startDrag,
        emitClickEvent,
      };
    },
  };
  </script>
  
  <style scoped lang="scss">
  .draggable-box {
    cursor: grab;
    z-index: 99;
  }
  </style>
  