<template>
  <div class="emoticons">
    <div class="emoticons-box">
      <EmojiPicker v-show="btnIndex === 1" @selected="handleSelect" />
      <div
        :class="['hide_scrollbar', 'gif-box', isEmpty(userInfo) ? 'vip_active' : '']"
        v-show="btnIndex === 2"
        @click.stop="openRegister"
      >
        <template v-if="!isEmpty(userInfo)">
          <div class="gif-list" v-for="(list, title) in emoticonsGroup" :key="title">
            <p>{{ title }}</p>
            <div class="image-box">
              <el-image
                fit="cover"
                class="image-gif no-copy"
                loading="lazy"
                @contextmenu.prevent
                @click.stop="handleImage(item)"
                v-for="item in list"
                :key="item.id"
                :src="item.thumburl"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import homeApi from '@/api/home.js'
import EmojiPicker from '@/components/Emoticons/emojiPicker.vue'
import { isEmpty } from 'lodash-es'
import { useStore } from 'vuex'
import mittBus from '@/utils/mittBus'

defineOptions({
  name: 'EmoticonsPop'
})

const props = defineProps({
  activeIndex: {
    type: Number,
    default: 1
  }
})

const store = useStore()
const userInfo = computed(() => store.state.user.infoData)

const emit = defineEmits(['changeImage', 'handleChange'])

const emoticons = inject<Ref<{ [key: string]: any }>>('emoticons')
const btnIndex = ref(1)
const emoticonsGroup = ref({})
const btnList = ref([
  { id: 1, name: '表情' },
  { id: 2, name: '贴图' }
])

watch(
  () => props.activeIndex,
  () => {
    btnIndex.value = props.activeIndex
  }
)

onMounted(() => {
  if (isEmpty(emoticons?.value) && userInfo.value.id) initEmoticons()
  else emoticonsGroup.value = { ...emoticons.value }
  btnIndex.value = props.activeIndex
})

// 获取表情包
function initEmoticons() {
  try {
    homeApi.getEmoticonsList().then((res) => {
      emoticonsGroup.value = res.data || {}
    })
  } catch (error) {
    console.log(error)
  }
}

function openRegister() {
  if (isEmpty(userInfo.value)) {
    store.commit('user/SET_LOGIN_MASK', true)
    nextTick(() => mittBus.emit('goSignUp', 2))
  }
}

function handleImage(val) {
  emit('changeImage', val)
}

function handleBtn({ id }) {
  btnIndex.value = id
}

function handleSelect(emojiValue) {
  emit('handleChange', emojiValue)
}
</script>

<style lang="scss" scoped>
.emoticons {
  width: 310px;
  background-color: var(--el-bg-color-overlay);
  .emoticons-box {
    .gif-box {
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: scroll;
      height: 350px;
      border: 1px solid var(--el-bg-color-overlay);
      padding: 8px 6px 0 8px;
      .gif-list {
        p {
          color: var(--el-text-color-primary);
          font-size: 12px;
          font-weight: 400;
          padding-bottom: 7px;
        }
        .image-box {
          display: flex;
          flex-wrap: wrap;
          .el-image {
            width: 54px;
            height: 54px;
            margin-bottom: 7px;
            margin-right: 5px;
            cursor: pointer;
            object-fit: cover;
            :deep(.el-image__error) {
              font-size: 12px;
            }
          }
          .no-copy {
            // pointer-events: none;
            user-select: none;
          }
          .image-gif:nth-child(5n) {
            margin-right: 0;
          }
        }
      }
    }
    .vip_active {
      cursor: pointer;
      background-image: url(/static/images/live/VIP_bg.png);
      background-size: cover;
      border: 0px;
    }
    .gif-box::-webkit-scrollbar {
      border-radius: 4px;
      width: 4px;
      overflow: hidden;
    }
  }
  ul {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    li {
      position: relative;
      padding: 2px 24px;
      border-radius: 23px;
      margin-right: 18px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      color: var(--el-text-color-regular);
      background-color: var(--el-fill-color);
    }
    .active {
      color: var(--el-text-color-white);
      background-color: var(--el-primary-background-color);
    }
    img {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 26px;
      height: 12px;
    }
  }
}
</style>
