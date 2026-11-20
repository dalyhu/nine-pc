<template>
  <el-dialog v-model="outVisible" width="862" :show-close="false" align-center :close-on-click-modal="false">
    <div class="setting">开播设置</div>
    <div class="flexCol">
      <div class="row">
        <span class="title required">直播分类:</span>
        <el-select class="width492" v-model="form.type" @change="restFormData">
          <el-option v-for="item in gameType" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </div>
      <div class="row" v-if="form.type === 3">
        <span class="title">电竞分类:</span>
        <el-select class="width492" v-model="form.gameSort">
          <el-option v-for="item in gameList" :key="item.sourceid" :value="item.sourceid" :label="item.short_name_zh"></el-option>
        </el-select>
      </div>
      <div class="row" v-if="form.type !== 4">
        <span class="title required">直播赛事:</span>
        <span @click="liveListModalRef.openSubModal(form)">
          <el-input
            class="width492 isFocus"
            :model-value="form.showTitle"
            readonly
            placeholder="选择赛事"
            :suffix-icon="ArrowDown"
          ></el-input>
        </span>
        <span class="redColor" @click="copy(form.showTitle)">复制名称</span>
      </div>
      <div class="row">
        <span class="title required">主标题:</span>
        <el-input class="width492" v-model="form.title_main" placeholder="请填写直播主标题"></el-input>
        <CircleCheck class="iconCircle" :class="{iconCircleSelect: !isCheck}" @click="isCheck = !isCheck"></CircleCheck>
        <span class="greyFont" @click="isCheck = !isCheck">标题与队伍相同</span>
      </div>
      <div class="row">
        <span class="title required">副标题:</span>
        <el-input class="width492" v-model="form.title_sub" placeholder="请填写直播副标题"></el-input>
        <CircleCheck class="iconCircle" :class="{iconCircleSelect: !isCheckCopy}" @click="isCheckCopy = !isCheckCopy"></CircleCheck>
        <span class="greyFont" @click="isCheckCopy = !isCheckCopy">标题与赛事相同</span>
      </div>
      <div class="row">
        <span class="title">开播时间:</span>
        <el-date-picker
          width="timeTxtItem"
          style="width: 492px;height: 30px;"
          v-model="form.starttime"
          :clearable="true"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="开播时间"
        ></el-date-picker>
      </div>
      <div class="row row4Col">
        <span class="title">直播封面:</span>
        <div style="display: inline-block;">
          <el-upload
            class="avatar-uploader"
            action="upload"
            :auto-upload="false"
            :on-change="beforeAvatarUpload"
            accept=".png, .jpg, .jpeg"
            :show-file-list="false"
            :disabled="isUploading"
          >
            <div class="DIYBtnUpload" type="info">上传封面</div>
          </el-upload>
          <div style="margin-top: 10px;">
            <span class="imgTip">支持png/jpg/jpeg格式，图片大小不超过2M</span>
          </div>
        </div>
        <span class="title">效果预览:</span>
        <div class="viewImgCard">
          <img class="imgThumb" :src="form.thumb || '/room.webp'" alt="">
          <div style="padding: 8px;">
            <el-text style="color: #303133;font-size: 16px;" truncated>
              {{ form.title_main || '直播主标题' }}
            </el-text>
            <div style="display: flex;justify-content: space-between; gap: 10px">
              <el-text style="font-size: 14px;color: #a8abb2;flex: 1;" truncated>
                {{ form.title_sub || '直播副标题' }}
              </el-text>
              <div style="font-size: 14px;color: #a8abb2;width: 36px;">
                <span style="display: inline-block;width: 12px;height: 12px;vertical-align: middle;">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_2722_20738)">
                      <path
                        d="M6 11.5C8.05868 11.5 9.74995 9.86855 9.74995 7.77453C9.74995 7.26045 9.72383 6.70938 9.43888 5.8529C9.15393 4.99645 9.09653 4.8859 8.79523 4.35698C8.6665 5.43635 7.97775 5.8862 7.80277 6.02065C7.80277 5.88077 7.38612 4.33397 6.7544 3.40847C6.13425 2.5 5.29085 1.90398 4.79633 1.5C4.79633 2.26744 4.58047 3.40848 4.27135 3.98985C3.96222 4.57123 3.90417 4.5924 3.51805 5.02505C3.13195 5.4577 2.95472 5.59132 2.63185 6.11627C2.30899 6.64125 2.25 7.34045 2.25 7.85453C2.25 9.94855 3.94132 11.5 6 11.5Z"
                        stroke="#A8ABB2"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2722_20738">
                        <rect width="12" height="12" fill="white" transform="translate(0 0.5)" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span>100</span>
              </div>
            </div>
          </div>
          <div class="absAvatar">
            <img class="defaultAvatarImg" :src="userInfo?.avatar || '/avatar.png'" alt="">
              <el-text truncated style="color: #fff;font-size: 14px;transform: translateY(4px);">
                {{ userInfo?.user_nickname || '游客' }}
              </el-text>
          </div>
          <div class="absLiveIcon">
            <liveIcon></liveIcon>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="row">
        <span class="title titleWidth">推流服务器地址:</span>
        <el-input class="widthSmall" :model-value="form.urlDomain" disabled></el-input>
        <span class="redColor" @click="copy(form.urlDomain)">复制</span>
      </div>
      <div class="row">
        <span class="title titleWidth">串流密钥:</span>
        <el-input class="widthSmall" :model-value="form.urlKeys" disabled></el-input>
        <span class="redColor" @click="copy(form.urlKeys)">复制</span>
        <span class="redColor" @click="getLiveUri()">获取推流地址</span>
      </div>
      <div class="row">
        <span class="title titleWidth">直播状态:</span>
        <el-input class="widthSmall" :model-value="form.status_str || '未直播'" disabled></el-input>
      </div>
      <div class="btnGrp">
        <div class="btn" @click="outVisible = false">取消</div>
        <div class="btn btnConfirm" @click="submit($parent)">确认</div>
      </div>
    </div>
  </el-dialog>
  <liveListModal
    ref="liveListModalRef"
    v-model:form="form"
    :gameType="gameType"
    :isCheck="isCheck"
    :isCheckCopy="isCheckCopy"
  ></liveListModal>
</template>

<script setup>
import { getLiveUrl, gameListApi, submitRoomApi, uploadImage, updateRoomApi } from '@/api'
import liveIcon from '@/components/liveIcon.vue'
import liveListModal from './liveListModal.vue'
import { CircleCheck, ArrowDown } from '@element-plus/icons-vue'
import { copyToClipboard, doCompressor } from '@/utils'
import { getTimeMs } from '@/utils/common'
import { divide } from 'lodash-es'
import { useStore } from 'vuex'
const store = useStore()
const outVisible = ref(false)
const isCheck = ref(true)
const isCheckCopy = ref(true)
const gameType = reactive([
  {value: 0, label: '足球'},
  {value: 1, label: '篮球'},
  {value: 3, label: '电竞'},
  {value: 4, label: '区块链'}
])
const gameList = reactive([])
const form = reactive({type: 0})
const liveListModalRef = ref(null)
const isUploading = ref(false)
const isUpdate = ref(false)
let clickStearm = false
const userInfo = computed(() => store.state.user.infoData)

watch(outVisible, () => {
  if (!outVisible.value) {
    Object.keys(form).forEach(key => form[key] = undefined)
    form.type = 0
    clickStearm = false
  }
})

const restFormData = () => {
  form.gameSort = undefined
  form.competition_name_zh = undefined
  form.title_main = undefined
  form.title_sub = undefined
  form.match_id = undefined
  form.starttime = undefined
  form.showTitle = undefined
}

const submit = ($parent) => {
  const {type, title_main, title_sub, thumb = '/room.webp', starttime, id, match_id, urlKeys} = form
  if (!clickStearm && !urlKeys) {
    return ElMessage.warning('请先获取推流地址')
  }
  if (!id) {
    ElMessageBox.alert('您正在直播中，请先关播后才可重新开播', '', {confirmButtonText: '确定'})
    return
  }
  if (!title_main) {
    return ElMessage.warning('请输入直播主标题')
  }
  if (!title_sub) {
    return ElMessage.warning('请输入直播副标题')
  }
  const api = [submitRoomApi, updateRoomApi]
  let params = {
    type,
    title_main,
    title_sub,
    thumb,
    starttime: getTimeMs(starttime),
    id,
    match_id
  }
  api[+isUpdate.value](params).then(({code, msg}) => {
    if (code === 0) {
      outVisible.value = false
      ElMessage.success(msg)
      $parent.httpGetRoomList() // !调用父组件查询直播列表
    }
  }).catch(e => {
    ElMessage.error(e.msg)
  })
  isUpdate.value = false
}
const copy = text => {
  if (!text) return ElMessage.warning('不能复制空内容')
  if (copyToClipboard(text)) ElMessage.success('复制成功')
  else ElMessage.warning('该浏览器不支持自动复制')
}
const getLiveUri = () => {
  clickStearm = true
  getLiveUrl().then((res) => {
    let url = res.data.url.split('/live/')
    form.url = res.data.url
    form.id = res.data.id
    form.urlDomain = url.length === 2 ? url[0] + '/live/' : ''
    form.urlKeys = url.length === 2 ? url[1] : ''
  }).catch(e => {
    // ElMessage.error(e.msg)
  })
}
const beforeAvatarUpload = async (rawFile) => {
  const fileM = divide(rawFile.size, 1024 * 1024)
  if (!/jpg|jpeg|png/gi.test(rawFile.raw.type)) {
    ElMessage.error('图片格式错误，仅支持 jpg, jpeg, png 格式')
    return false
  }
  if (fileM > 2) {
    ElMessage.error('图片仅支持 2M 以内，请换张图片试试')
    return false
  }
  try {
    isUploading.value = true
    const pic = await doCompressor(rawFile.raw)
    const { data } = await uploadImage({ pic })
    form.thumb = data
    isUploading.value = false
  } catch (error) {
    ElMessage.error(error.msg)
    isUploading.value = false
  }
}

onMounted(() => {
  gameListApi().then(res => gameList.splice(0, 0, ...res.data))
})

defineExpose({outVisible, form, isUpdate})
</script>

<style scoped lang="scss">
.setting {
  margin: 32px 8px 24px 8px;
  text-align: center;
  color: #3f3f3f;
  font-size: 20px;
  font-weight: 600;
}
.flexCol {
  display: flex;
  flex-direction: column;
  margin: 0 8px;
  padding-left: 32px;
  gap: 24px 0;
  .row {
    .title {
      display: inline-block;
      width: 78px;
      text-align: right;
      font-size: 14px;
      color: #3f3f3f;
      margin-right: 14px;
      font-weight: 600;
    }
    .viewImgCard {
      position: relative;
      width: 223px;
      border-radius: 8px;
      box-shadow: 0 0 0 1px #e6e6e6;
      .imgThumb {
        width: 223px;
        height: 111px;
        border-radius: 8px 8px 0 0;
        object-fit: cover;
      }
      .absAvatar {
        position: absolute;
        top: 70px;
        left: 10px;
        .defaultAvatarImg {
          object-fit: cover;
          width: 37px;
          height: 37px;
          border-radius: 50%;
          background: #a8abb2;
          vertical-align: middle;
          margin-right: 4px;
        }
      }
      .absLiveIcon {
        position: absolute;
        top: 4px;
        right: 4px;
      }
    }
    .titleWidth {
      width: 112px;
    }
    .timeTxtItem {
      display: inline-block;
      width: 492px;
      height: 30px;
      line-height: 30px;
      color: #a8abb2;
      background: #f5f7fa;
      padding-left: 11px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      cursor: no-drop;
    }
    .required::before {
      content: "*";
      color: var(--el-color-danger);
      margin-right: 2px;
      font-size: 16px;
    }
    .width492 {
      width: 492px;
    }
    .widthSmall {
      width: 458px;
    }
    .redColor {
      margin-left: 16px;
      font-size: 14px;
      border-bottom: 1px solid #d02d54;
      font-weight: 500;
      color: #d02d54;
      cursor: pointer;
    }
    .iconCircle {
      width: 16px;
      margin: 0 16px;
      vertical-align: middle;
    }
    .iconCircleSelect {
      color: #fff;
      transform: scale(0.86);
      border: 1px solid var(--el-text-color-regular);
      border-radius: 50%;
    }
    .greyFont {
      color: #333;
      font-size: 12px;
    }
    .avatar-uploader {
      vertical-align: text-top;
      display: inline-block;
      .DIYBtnUpload {
        &:active {
          filter: brightness(98%);
        }
        text-align: center;
        line-height: 31px;
        border-radius: 8px;
        width: 168px;
        height: 31px;
        color: #333;
        background-color: #f1f1f1;
      }
      .imgArea {
        width: 168px;
        line-height: 84px;
        height: 84px;
        margin-bottom: 6px;
        text-align: center;
        border: 1px dashed #333;
        border-radius: 8px;
      }
      .imgStyle {
        border: 0;
      }
      .imgTip {
        color: #999;
        font-size: 12px;
      }
    }
  }
  .row4Col {
    display: grid;
    grid-template-columns: 78px 1fr 78px 1fr;
    gap: 13px;
    width: 586px;
  }
  .line {
    border-bottom: 1px solid #f1f1f1;
    margin: 8px 0;
  }
}
.btnGrp {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
  margin-left: -32px;
  .btn {
    width: 128px;
    height: 38px;
    line-height: 38px;
    font-size: 16px;
    font-weight: 500;
    color: #d02d54;
    border: 1px solid #d02d54;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
  }
  .btnConfirm {
    background-color: #d02d54;
    color: #fff;
  }
}
</style>
<style lang="scss">
  .isFocus > .is-focus {
    box-shadow: 0 0 0 1px #dcdfe6 inset;
  }
</style>