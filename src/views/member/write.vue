<!-- 创作 -->
<template>
  <div class="creation-page-container">
    <div class="publish-button">
      <el-popover placement="bottom" trigger="hover">
        <div class="creation-page-publish-select">
          <div class="option" @click="(imgMask = true), (imgVideo = false)">发图文</div>
          <div class="option" @click="(imgMask = true), (imgVideo = true)">发视频</div>
        </div>
        <template #reference>
          <button class="i-button i-primary-image-button i-block-button">发布</button>
        </template>
      </el-popover>
    </div>

    <div class="i-tabs-container">
      <div class="header-nav">
        <a>
          <div class="item" :class="{ 'first-item': tabIndex == 0 }" @click="tabIndex = 0">
            资讯
          </div>
        </a>
        <a>
          <!--   -->
          <div
            class="item first-active"
            :class="{ 'first-item': tabIndex == 1 }"
            @click="tabIndex = 1"
          >
            视频
          </div>
        </a>
      </div>
      <div class="tab-pane-item" name="资讯">
        <div class="creation-news-container">
          <ul class="news-list">
            <li class="news-item" v-for="(item, index) in list.data" :key="index">
              <div class="left-wrap">
                <div class="new-cover" :class="{ 'is-video': tabIndex == 1 }">
                  <img :src="item.img" v-if="tabIndex == 0" />
                  <img v-if="item.flie && tabIndex == 1" :src="item.flie[0].img" />
                </div>
                <div class="new-info">
                  <p class="title">{{ item.title }}</p>
                  <div class="news-data">
                    <span class="date">{{ item.addtime }}</span>
                    <span class="read-num">阅读 {{ item.click }}</span>
                    <span>点赞 {{ item.likes }}</span>
                    <span>评论 {{ item.comment_count }}</span>
                  </div>
                </div>
              </div>
              <div class="right-wrap">
                <!-- news-status checking 审核中 -->
                <div class="news-status success" v-if="item.status == 1">已发布</div>
                <div class="news-status checking" v-if="item.status == 0">审核中</div>
                <div class="operations">
                  <!-- <span class="update" @click="edit(tabIndex,item)">修改</span>
									<span class="vertical-line">|</span> -->
                  <span class="delete" @click="del(tabIndex, item)">删除</span>
                </div>
              </div>
            </li>
          </ul>
          <ul
            class="ant-pagination"
            v-if="list.total != 0"
            unselectable="unselectable"
            style="width: 100%; text-align: center"
          >
            <el-pagination
              background
              class="ant-pagination"
              v-model:current-page="page"
              layout="prev, pager, next"
              :total="list.total"
            />
          </ul>
          <DfEmpty v-if="list.total == 0" />
        </div>
      </div>
    </div>

    <!-- 发布图文弹窗 -->
    <el-dialog
      v-model="imgMask"
      class="dialog"
      :destroy-on-close="false"
      :close-on-click-modal="false"
    >
      <div class="creation-news-picture-modal">
        <div class="picture-modal-containe">
          <div class="ant-modal-content">
            <div class="ant-modal-body">
              <div class="picture-dialog-content">
                <div class="form">
                  <div class="news-title">
                    <input
                      type="text"
                      v-model="title"
                      placeholder="输入5-30字的标题"
                      maxlength="30"
                    />
                    <span class="text-total">{{ title.length }}/30</span><i class="icon-clear"></i>
                  </div>
                  <div class="news-content-wrap" v-if="!imgVideo">
                    <div id="editor" data-we-id="wangEditor-1">
                      <div
                        style="
                          background-color: #fff;
                          border: 1px solid #c9d8db;
                          border-bottom: 1px solid #eee;
                          z-index: 10001;
                        "
                        class="w-e-toolbar"
                        id="toolbar-elem13589806312929653"
                      >
                        <div class="w-e-menu" data-title="图片"><i class="w-e-icon-image"></i></div>
                        <div
                          class="w-e-menu-tooltip w-e-menu-tooltip-up"
                          style="visibility: hidden; z-index: 10001"
                        >
                          <div class="w-e-menu-tooltip-item-wrapper">
                            <div></div>
                          </div>
                        </div>
                      </div>
                      <div
                        style="border: 1px solid #c9d8db; border-top: none; z-index: 10000"
                        class="w-e-text-container"
                      >
                        <textarea
                          v-model="content"
                          style="width: 98%; min-height: 300px; margin: 10px"
                          placeholder="输入正文 5000字以内"
                        ></textarea>
                      </div>
                    </div>
                    <div
                      class="video-select-tags select-tags clearfix"
                      v-if="JSON.stringify(match_id) != '{}'"
                    >
                      <div class="tag-item">
                        <img :src="match_id.logo" />
                        <span class="tag-name">{{ match_id.short_name_zh }}</span>
                        <i class="icon-remove" @click="match_id = {}"></i>
                      </div>
                      <div class="bottom-white-bar"></div>
                    </div>
                  </div>
                  <div class="media-cell flex-start">
                    <div style="margin-right: 20px">
                      <div class="cell-title">上传封面</div>
                      <span>
                        <el-upload
                          class="avatar-uploader"
                          :action="url"
                          :data="QiniuToken"
                          :show-file-list="false"
                          :on-success="handleAvatarSuccess1"
                          :before-upload="beforeAvatarUpload"
                        >
                          <div v-if="!img" class="video-box"></div>
                          <img v-else :src="img" style="176px" height="118px" />
                        </el-upload>
                      </span>
                    </div>
                    <div v-if="imgVideo">
                      <div class="cell-title">上传视频</div>
                      <span>
                        <el-upload
                          class="avatar-uploader"
                          :action="url"
                          :data="QiniuToken"
                          :show-file-list="false"
                          :on-success="handleAvatarSuccess2"
                          :before-upload="beforeAvatarUpload2"
                        >
                          <div v-if="!flie[0].video" class="video-box"></div>
                          <img v-else :src="!flie[0].video" style="176px" height="118px" />
                        </el-upload>
                      </span>
                    </div>
                  </div>
                  <div class="news-bottom-operation">
                    <div class="add-info-btn">
                      <!-- <div class="add-picture-button"></div> -->
                      <div
                        class="i-select-container"
                        v-if="!imgVideo"
                        style="width: 122px; margin-right: 16px"
                      >
                        <el-select v-model="cid" placeholder="请选择类型">
                          <el-option
                            v-for="item in classList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </div>
                      <div v-if="!imgVideo" class="add-tags-button" @click="label = true">
                        添加标签
                      </div>
                    </div>
                    <div class="operation">
                      <div class="cancel-button" style="margin-right: 10px">
                        <button
                          class="i-button i-default-button i-block-button"
                          style="font-size: 16px"
                          @click="imgMask = false"
                        >
                          取消
                        </button>
                      </div>
                      <!-- <div class="save-button">存为草稿</div> -->
                      <div class="confirm-button">
                        <button
                          class="i-button i-primary-image-button i-block-button"
                          style="font-size: 16px"
                          @click="addInsert(imgVideo)"
                        >
                          发布
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 选择标签 -->
    <el-dialog title="选择标签" v-model="label">
      <div style="padding: 20px">
        <div>
          <!-- <div class="group-name">标题</div> -->
          <div class="flex-wrap">
            <div
              class="tag-item"
              v-for="(item, index) in hot_match"
              @click="(match_id = item), (label = false)"
              :key="index"
              style="background-color: hsla(240, 3%, 85%, 0.25); padding: 4px 8px; margin-top: 10px"
            >
              <img :src="item.logo" />
              <span class="tag-name" title="item.short_name_zh">{{ item.short_name_zh }}</span>
            </div>
          </div>
        </div>
        <div class="tags-dialog-footer">
          <div class="confirm-button">
            <button class="i-button i-primary-image-button i-block-button" style="font-size: 16px">
              确定
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { classifyList, addInsert } from '@/api/user.js' //分类/添加/
import { initialList } from '@/api/search.js' //赛事标签
import {
  videoDelete,
  userPostList,
  addinsertVidoe,
  HeadlinesDelete,
  userPostVideoList
} from '@/api/headline.js' //头条/视频

export default {
  data() {
    return {
      page: 1,
      list: {},
      tabIndex: 0,
      cid: null, //分类id
      title: '',
      content: '',
      img: '', //封面
      label: false,
      imgVideo: false,
      imgMask: false,
      match_id: {},
      hot_match: [],
      classList: [],
      flie: [
        {
          img: '',
          video: ''
        }
      ],
      url: window.location.origin + '/qiniu/',
      QiniuToken: {}
    }
  },
  computed: {
    // QiniuToken() {
    // 	return this.$store.state.user.QiniuToken
    // }
  },
  watch: {
    tabIndex(e) {
      if (e == 1) {
        this.userPostVideoList()
      } else {
        this.userPostList()
      }
    },
    page() {
      if (this.tabIndex === 0) {
        this.userPostList()
      } else {
        this.userPostVideoList()
      }
    }
  },
  mounted() {
    this.userPostList()
    this.initialList()
    this.getcClassify()
    this.getQiniu()
  },
  methods: {
    // 删除
    del(index, item) {
      let data = {
        id: item.id
      }
      if (index == 0) {
        HeadlinesDelete(data)
          .then((res) => {
            this.$message.success('操作成功')
            this.userPostList()
          })
          .catch((res) => {})
      } else {
        videoDelete(data)
          .then((res) => {
            this.$message.success('操作成功')
            this.userPostVideoList()
          })
          .catch((res) => {})
      }
    },
    // 修改
    edit(index, item) {
      if (index == 0) {
        // cid: this.cid,
        // title: this.title,
        // img: this.img,
        // content: this.content,
        // match_id: this.match_id.sourceid,
        // type: this.match_id.type,
      } else {
      }
    },
    // 分类
    getcClassify() {
      classifyList()
        .then((res) => {
          this.classList = res.data
        })
        .catch((res) => {})
    },
    // 头条列表
    userPostList() {
      let data = {
        type: 2,
        page: this.page
      }
      userPostList(data)
        .then((res) => {
          this.list = res.data
        })
        .catch((res) => {})
    },
    // 赛事标签
    initialList() {
      initialList()
        .then((res) => {
          this.hot_match = res.data.hot_match
        })
        .catch((res) => {})
    },
    // 视频列表
    userPostVideoList() {
      let data = {
        type: 2,
        page: this.page
      }
      userPostVideoList(data)
        .then((res) => {
          this.list = res.data
        })
        .catch((res) => {})
    },
    async getQiniu() {
      let token = this.$store.state.user.QiniuToken
      if (JSON.stringify(token) === '{}') {
        const { code, data } = await this.$store.dispatch('user/setQiniuToken')
        if (code === 0) {
          this.QiniuToken = data
          console.log(this.QiniuToken)
        }
      } else {
        this.QiniuToken = token
      }
    },
    // 添加
    addInsert(type) {
      if (type) {
        //视频

        if (!this.title) return this.$message.error('请输入标题')
        if (!this.flie[0].img) return this.$message.error('请上传封面')
        if (!this.flie[0].video) return this.$message.error('请上传视频')
        let data = {
          title: this.title,
          flie: this.flie
        }
        addinsertVidoe(data)
          .then((res) => {
            this.imgMask = false
            this.$message.success('操作成功')
            this.userPostVideoList()
          })
          .catch((res) => {})
      } else {
        //图片

        if (!this.title) return this.$message.error('请输入标题')
        if (!this.content) return this.$message.error('请输入内容')
        if (!this.img) return this.$message.error('请上传封面')
        if (this.match_id == {}) return this.$message.error('请添加标签')
        if (!this.cid) return this.$message.error('请选择分类')

        let data = {
          cid: this.cid,
          title: this.title,
          img: this.img,
          content: this.content,
          match_id: this.match_id.sourceid,
          type: this.match_id.type
        }
        addInsert(data)
          .then((res) => {
            this.imgMask = false
            this.$message.success('操作成功')
            this.userPostList()
          })
          .catch((res) => {})
      }
    },
    // 图片上传返回地址
    handleAvatarSuccess1(res, file) {
      this.img = `${this.QiniuToken.domain}/${res.key}`
      if (this.tabIndex == 0) {
      } else {
        this.flie[0].img = `${this.QiniuToken.domain}/${res.key}`
      }
    },
    beforeAvatarUpload(file) {
      let QiniuToken = this.$store.state.user.QiniuToken
      const fileName =
        new Date().valueOf().toString() +
        this.$common.rand() +
        file.name.slice(file.name.lastIndexOf('.'))
      QiniuToken.data = file
      QiniuToken.key = `${fileName}`
    },

    // 视频上传返回地址
    handleAvatarSuccess2(res, file) {
      this.flie[0].video = `${this.QiniuToken.domain}/${res.key}`
      this.$message.success('上传成功')
    },
    beforeAvatarUpload2(file) {
      let QiniuToken = this.$store.state.user.QiniuToken
      const fileName =
        new Date().valueOf().toString() +
        this.$common.rand() +
        file.name.slice(file.name.lastIndexOf('.'))
      QiniuToken.data = file
      QiniuToken.key = `${fileName}`
    }
  }
}
</script>

<style scoped="scoped">
.creation-page-container {
  position: relative;
}

.creation-page-container .publish-button {
  width: 90px;
  height: 38px;
  position: absolute;
  top: 6px;
  right: 20px;
  z-index: 9;
}

.creation-page-publish-select {
  width: 100%;
}

.creation-page-publish-select .option {
  width: 90px;
  height: 35px;
  line-height: 35px;
  color: #333;
  font-size: 14px;
  text-align: center;
  user-select: none;
  cursor: pointer;
}

.creation-page-publish-select .option:hover {
  color: #b08a5b;
  background-color: #fffbf8;
}

.creation-page-publish-select > div:last-child {
  margin-bottom: 0;
}

.creation-page-publish-button-popover {
  padding-top: 0;
}

.creation-page-publish-button-popover .ant-popover-arrow {
  top: -2px !important;
  z-index: 0;
}

.creation-page-publish-button-popover .ant-popover-inner-content {
  padding: 0 !important;
}

.creation-news-container .news-list {
  padding-top: 5px;
}

.creation-news-container .news-list .news-item {
  height: 100px;
  display: flex;
  justify-content: space-between;
  margin: 0 35px;
  padding: 20px 0;
  box-shadow: inset 0 -1px 0 0 #f0f0f0;
}

.creation-news-container .news-list .news-item:hover .left-wrap .new-info .news-data,
.creation-news-container .news-list .news-item:hover .left-wrap .new-info .title {
  color: #ba9250;
}

.creation-news-container .news-list .news-item .left-wrap {
  display: flex;
}

.creation-news-container .news-list .news-item .left-wrap .new-cover {
  width: 90px;
  height: 60px;
  margin-right: 12px;
  position: relative;
}

.creation-news-container .news-list .news-item .left-wrap .new-cover.is-video:before {
  content: '';
  width: 30px;
  height: 30px;
  position: absolute;
  top: 15px;
  left: 30px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHYAAAB4CAMAAAAQc/ZTAAAApVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+4/eNVAAAANnRSTlMA8/j8CQNFw7egjD0mEu7kmTYyGermvqZp3s6tSyIdDoN2bmZXKwbb0cmqYVIWDNiye1sukofJUFtWAAADkUlEQVRo3tXah1LiUACF4ZObRgihhN6RoiBV0PP+j7bjumNGVLgtmdnvBf6B5OaWBP+LZrydvUbPpXATlobR61svGPvI1WQbrQW/E8fhfIVcTJf1Pm9pdxdN2OWPuoL3uaWzB2tW5TZlOVEMK9Ih1YQBjMUlqhvsYKRSop51DG3eTFBbtIeeUZ8mqj0f6g5dmgonUHU50lxrBDULQSvKPuQ9dmlLuIesaYf2PI0hZz+gTe0LZIz7tMuJcV+lTdtEgHuafdrnpLhtumYeWhXc4nWYj34TNzwzL2sPv5ozPxF+kwrm6IyfTfvMk1MxuLDWL++SeXvDd4ca8yYq+KbM/HVw7eKyAEtcCVmE9gFfjFiMF4Mfa6DlAZmYRZkDmRKLUnvEpwaLs8CniMUZZJO7wwKt8M+ZRSqr31Cth8auLmik5uOvpitdXQFAs+7SRKC6lNnhQ+WZBur4a0hZ2ZhLO9TWxzu/SkkOkAkG1DUGgJRK2czyiXq2APCgm4W/qFFHV234OLjmPVSprgYAbYMskJQFle2BKQ2ymsM4BhqmWaAyVJ+FzuZZoNFRfSzPDLK6w/gEPBtkdYfxEejYysLvtSmnCmyMsxnvpUoZAjhayGaSruScUrOSzZwoIUHVcrYhNwe5lrOPcss4x3K2SQkVtC1nHyihiSe72UBQwgEDm9lJRBkuEGpmTeZeBzgZZ7NHlMLy4tU0mz2QpYVATzNrsoqsA4Fm1mTN/ABMjLONDhWNADiaWYP9UAXAwCCrt/sTPoCyfjZ5E9pngCPlbLYlMDgTm7rSWaMNUCYGoLCaEsjsjtTl+Hj3pnIHfgg21FdSPQw7+XiXlmiihw9PlNVNgFWXRkSCDy+UJgZtGhrinzGLtCvwNDlTzY57tizOKz491lgUd2L6TtH8DaPXYjHcytWiuhhdfDGtsgjuBV8tWIQ6rm2Yv1aCa6nL3G3x3SvzFuIH0xrzJVb4SewyVwuDHbGtIVvUq76nA36T1JgXccHvUof5cJcaRw/merht5zIHM9zTo3113De3X/Uh4SyK/IczgUOL5pDVaNEWsYS8SUg7+g2o8Mu0YZhA0cj8jxZzqJucaGaTGnwFbvINePHfvEd7GBhHLjWUGjA0Uf/OYpjCgma5RXkiWsGSx91QUEpne4BNSa9zr+xuXiawzwtm4a/pdXk0RW4OjfPseS2YEcdTeRsnKIK3H1/iIE7Hew//kz/wxRSXLXEZwAAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.creation-news-container .news-list .news-item .left-wrap .new-cover > img {
  border-radius: 4px;
  object-fit: cover;
  object-position: center;
  width: 90px;
  height: 60px;
}

.creation-news-container .news-list .news-item .left-wrap .new-info {
  line-height: 1;
  padding-top: 10px;
}

.creation-news-container .news-list .news-item .left-wrap .new-info .title {
  color: #333;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 15px;
  cursor: pointer;
}

.creation-news-container .news-list .news-item .left-wrap .new-info .news-data {
  font-size: 12px;
  color: #999;
}

.creation-news-container .news-list .news-item .left-wrap .new-info .news-data > span {
  margin-right: 12px;
}

.creation-news-container .news-list .news-item .left-wrap .new-info .news-data .date {
  margin-right: 16px;
}

.creation-news-container .news-list .news-item .right-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.creation-news-container .news-list .news-item .right-wrap .news-status {
  width: 60px;
  height: 24px;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  margin-bottom: 12px;
}

.creation-news-container .news-list .news-item .right-wrap .news-status.checking {
  color: #d8ad66;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAwCAYAAADab77TAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAeKADAAQAAAABAAAAMAAAAABgYUZmAAADPUlEQVR4Ae2cS2sUQRDHq3o24guTBcE3opjNVcghnvxAin4MP4Ee9It4z01QcvGgC4piglGETcQXSWbK6pn07PRM930r/HPp7eoJVP1/9Ku6Z5gyfzKb3i1FnjDLPREaZx6DeYEUYKZDIn5LzC/c8upzVnic8k/2pxtVVW0q2FOpdtgWXwGF+7QYrz1KAi5n714r3PXFDwMe5hTwvdeRW3f9B+TXx0uA21fFXl1EuCK5PwBM1cEde+HA47QCMh4ALiu+nn4YVmsK6AprZwCYhQDYGsmMvwXT9gCwLrMBOCOYOXM5GgIWqgDYHMmMwy4BmAQ9OCOXKbPuf//wys3ZYIjWBvRgUyizzn7xLRFg3TsVxHQl+y9oMKOAMG97ZyPA9Hd6uYZsJgw4mlNAR+IE4EPMvznBzNlZEoCxBzbHMe+wGwKuADivl7EWV6WGaJIbxuKAuzkFNIvlm+JFFnpwTi579iIxBwv2wPZAJjxm4n98Ye2Hb4p6sJ4RI8mREMycSU+Rgs8tYH9ArMaroQGlXQWEmuHZR9ACpt+f/E2OJbthwfOgQEhy+Poc8BFOkYJA5ktp9sAxYDnC/GuebAggMUQjyRHEsV+64z2wj2Q+ROMmh32yIQIe1UmOGDBjDg76mC9HXJ8FR4CR5DCPtQ6gfn3l3K3vIZp2iNbsBxZZQRXb5Y5/qyGE0AImoWvBiNKuApqvaudfH0UNWH6+v6jZj9N2w4LnQYFuksPbmh5cYngOAtkv53vgOWBhnAPbJ9tEwPMsVgu4ohILrBMCuJvkaAGTwxB9Qvjqm0fNTY4QTzMH4yZH0MN+uZSYg5HksM/VR6D735LOTHa70dQ9mAk3ObqimP0t9LWG3AkAQ3RHDOs/dSSOkhw+Hid7n8facNZ6cPBfFTh+m6GrhaMKB/1dQSz/Zor3wD4WRwUAW4Ya+x6voGvAJbZIsUaGa8LSngOHMJweLOEUKahhvCz0kw39EHQVzbO+EXWjCjj3oe+5c8Sb3QPi/gOo21BAb3K84fO3v/W9dTxe3VLjs34D6nYUULgHzrmHKY/rRIdbmTzWg+IH2pO3mk/Sph6FbdEUUFY6vfJL/ejoBi9PXqX8+w87mrkj+b7MVwAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.creation-news-container .news-list .news-item .right-wrap .news-status.success {
  color: #6dd400;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAwCAYAAADab77TAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAeKADAAQAAAABAAAAMAAAAABgYUZmAAADOUlEQVR4Ae2cz27TQBDGv13/I0khRVURKohTJaRyLC/Ay/AE3DF3DsCNvgwv0F4REpyCVCECFemfJLbXNmsnTuPs+J6pJlJlZ2xL334/zXg9XUeh4xOfon/h4YkOMShyeB2nSXiLHNA+ynyOOe5j/OkQf5RCqSh9b35hYC7wvDAgj1PXSGy7HFAexh9fYKQpWWaMZwKXcoZPrMyxH5+j75Te16cIPA9P+QxFlHY5MJ8hcTL4oIeo6wKJ83IgCuA5gCdAyGsYorbLgdkUmQO4KBB0XSBxXg70h0gdwPamLBnMi2On2jQkAGcCuNMwbgeGP4gSHZZSormBpPT6Hor4FYxToo2SEk0Zxi1mDGwxBlqAyxLK/skkixtNQq9fInUAv/sqcAmvWIaKiAB8vSeAWdIkRKuEKNH+b7n/El6xDJkBkcEzmWCxhEmJ9q6JDI7uSYmmzOIY282JDM5mUqI5wiQ1H1OApYtFesUtqEuUsYKpdLeeg+0DsDwDc6NJ6C2CRfa2ANdNDl8AE36xC6lsMcFqAT45gy/LdNixJAUHyyZHC/D3QCZYpFsMg8myydECbB5IeWbIkpRs11zVfegWYP9SMph0i2HQJqsLOJFHJIYoack2Wet/FVZHV49JUSQlmraLX/QyIzI4S6RE80PpKq5eX/l8vGhyVEdXGVwGksGuXfwiyq7kqN5JapSvAOtMMrgxhfO2sCsp1/XXgOPSNjmUvGi2bgzXfZ3eTrCqMSwy+EyylyvQTd1muRarideA/3kCuDGE+1ZrIoN7OzLB4g620d+jMnh+IxncGMR9ax4Rk6xM1mJx57rSv/OXKNFhKCV65RDznbdHBGCTSolmzrWWbxscrSZHFaxn0b6s5LgLfNG8rrI+GB1/gW/y25bl+kHZ5+VAajN4U7GeHMr9d9MUrt/tislWm7Iahw7l/suVp6M7pwBPJzLBcpxiGtjsYlXD0L2+lGimPB3ZQyqDkww2s+VzFxw4tz98tjkO/XAPV5tB+c7PAa0wPXlJzKLjA0yrH67kNyRR3DhQLdPx9zFqvq9v60bHhyP8HPQwKg1m1cnrJ8j+9jqgPXt7zXG5O8W3949xQyn9D/6uumzwYpm1AAAAAElFTkSuQmCC);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.creation-news-container .news-list .news-item .right-wrap .news-status.fail {
  color: #ccc;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAwCAYAAADab77TAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAeKADAAQAAAABAAAAMAAAAABgYUZmAAADNElEQVR4Ae2cW4riQBSGc9MYLx0CExiEBp/6pZk9uIjBJbgNXcUswlW4g3mah+4noUEGMo3Y3lKamElVODXGig3z5qmcfimtaHP+/0ulyt+KpnHjbzicOo7zq5NlnpOmJ/PGy6j7zhzodMy03T7Fs9ksNk0zqwQ3Ho8br68b/85qp3L+y4Egns9/bO2q9/R63x4MI7WqjlEfFgdiZzD4flQgTqfTvI85WGRQnbcdCMN1QwG8XC4rR/Xtf0NH7tWB9fqPpQB+e3OVvnsVQHV97sDxaKvzrOMwGsGf+4bmaBgOzspo3WxWSh8aRVRoyYEoMlTAntckwCWb8D4ZDisAHw7qwguvxHpXnn8iUkew69o0gjU4L3iixWWUYGZZZjK2L/VpoLWWEhjrnhXAo9GI4GpyOrTbiQo4CAICrAngOD6pgCnk0IRuLsP3YxVwt+vQCNaG8bO6yOLZpTb6ai6EhxzcghJQ2z5TTKnJiTHMQw4FMIUcmtDNZfCQQwFMIYcegF23LeCWAFPIoQdcroKxVAKWc26+QctaLN49fWTWV8nDQ/P08vLzyB2QiyzayaHPCQEhRwkwhRz6AIaQowS42/0tR7M+UuupZLv9KudgCXW9bsnH9bRFH9WPj0wF3GrRF/26IO73+yKm5HrkqP34oBRLF8CTySQDLRIwhRxgCe6Whxz8niRQIQHTTg6wBHd7GXJwJQJwcbsKbmFUfeGA5xVf9IMfAvB8/m8uhgPU4nQgTS25wOIKBGDPe5eRJU5ZVDU44Ptf5Eck3icAU8gB9uBvt9tisx0oEYAp5AA78LeXIQdXIwBTyIEfLChYrVbqJXq/p812YBD2Nv9tDhWwba9okYWdbF7/dcjBJYlLNGM0gjXgW9rJAXosCjnACvztdcjBFVkUcuAHCwoOh2Np/hWAw7C4TMOLqMXrQK8XqICjaCHmYbyyqHJwIEncUkzJ+61mM6UVNDiEvL0OOQTg6+wSucZal3+5kwOMsKLIP8ETajE74CZwu8qlinwVPU0MI4gvO+kxPgeenpq7qqrFr83y21byn29o7feN1m6X0Zxc5dQd9tl2IzPNQ5Ikz7tioKpF/gURtuY+gnUNPQAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.creation-news-container .news-list .news-item .right-wrap .operations .delete,
.creation-news-container .news-list .news-item .right-wrap .operations .update {
  cursor: pointer;
  font-size: 12px;
  color: #666;
  user-select: none;
}

.creation-news-container .news-list .news-item .right-wrap .operations .delete:hover,
.creation-news-container .news-list .news-item .right-wrap .operations .update:hover {
  color: #ba9250;
}

.creation-news-container .news-list .news-item .right-wrap .operations .update.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.creation-news-container .news-list .news-item .right-wrap .operations .vertical-line {
  color: #e1e1e1;
  font-size: 10px;
  margin: 0 10px;
}

.creation-paid-container li,
.creation-paid-container ul {
  list-style: none;
}

.creation-paid-container .paid-list {
  padding-top: 10px;
}

.creation-paid-container .paid-list .paid-item {
  height: 119px;
  margin: 0 35px;
  box-shadow: inset 0 -1px 0 0 #f0f0f0;
  display: flex;
  justify-content: space-between;
  padding-top: 17px;
}

.creation-paid-container .paid-list .paid-item .left-wrap {
  width: 780px;
}

.creation-paid-container .paid-list .paid-item .left-wrap .match-list .match-item {
  width: 354px;
  height: 60px;
  border-radius: 4px;
  background-color: #f5f5f5;
  padding: 13px 16px;
  margin-right: 10px;
  float: left;
  display: flex;
}

.creation-paid-container .paid-list .paid-item .left-wrap .match-list .match-item .match-info {
  width: 85px;
  height: 34px;
  color: #333;
  font-size: 12px;
  border-right: 1px solid #ddd;
}

.creation-paid-container .paid-list .paid-item .left-wrap .match-list .match-item .team-info {
  height: 34px;
  line-height: 34px;
  padding-left: 16px;
  color: #333;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.creation-paid-container .paid-list .paid-item .left-wrap .paid-data {
  color: #999;
  font-size: 12px;
  margin-top: 10px;
}

.creation-paid-container .paid-list .paid-item .left-wrap .paid-data .sport-type {
  color: #ba9250;
}

.creation-paid-container .paid-list .paid-item .left-wrap .paid-data > span {
  margin-right: 16px;
}

.creation-paid-container .paid-list .paid-item .right-wrap {
  position: relative;
}

.creation-paid-container .paid-list .paid-item .right-wrap .paid-status {
  width: 60px;
  height: 24px;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
}

.creation-paid-container .paid-list .paid-item .right-wrap .paid-status.checking {
  color: #d8ad66;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAwCAYAAADab77TAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAeKADAAQAAAABAAAAMAAAAABgYUZmAAADPUlEQVR4Ae2cS2sUQRDHq3o24guTBcE3opjNVcghnvxAin4MP4Ee9It4z01QcvGgC4piglGETcQXSWbK6pn07PRM930r/HPp7eoJVP1/9Ku6Z5gyfzKb3i1FnjDLPREaZx6DeYEUYKZDIn5LzC/c8upzVnic8k/2pxtVVW0q2FOpdtgWXwGF+7QYrz1KAi5n714r3PXFDwMe5hTwvdeRW3f9B+TXx0uA21fFXl1EuCK5PwBM1cEde+HA47QCMh4ALiu+nn4YVmsK6AprZwCYhQDYGsmMvwXT9gCwLrMBOCOYOXM5GgIWqgDYHMmMwy4BmAQ9OCOXKbPuf//wys3ZYIjWBvRgUyizzn7xLRFg3TsVxHQl+y9oMKOAMG97ZyPA9Hd6uYZsJgw4mlNAR+IE4EPMvznBzNlZEoCxBzbHMe+wGwKuADivl7EWV6WGaJIbxuKAuzkFNIvlm+JFFnpwTi579iIxBwv2wPZAJjxm4n98Ye2Hb4p6sJ4RI8mREMycSU+Rgs8tYH9ArMaroQGlXQWEmuHZR9ACpt+f/E2OJbthwfOgQEhy+Poc8BFOkYJA5ktp9sAxYDnC/GuebAggMUQjyRHEsV+64z2wj2Q+ROMmh32yIQIe1UmOGDBjDg76mC9HXJ8FR4CR5DCPtQ6gfn3l3K3vIZp2iNbsBxZZQRXb5Y5/qyGE0AImoWvBiNKuApqvaudfH0UNWH6+v6jZj9N2w4LnQYFuksPbmh5cYngOAtkv53vgOWBhnAPbJ9tEwPMsVgu4ohILrBMCuJvkaAGTwxB9Qvjqm0fNTY4QTzMH4yZH0MN+uZSYg5HksM/VR6D735LOTHa70dQ9mAk3ObqimP0t9LWG3AkAQ3RHDOs/dSSOkhw+Hid7n8facNZ6cPBfFTh+m6GrhaMKB/1dQSz/Zor3wD4WRwUAW4Ya+x6voGvAJbZIsUaGa8LSngOHMJweLOEUKahhvCz0kw39EHQVzbO+EXWjCjj3oe+5c8Sb3QPi/gOo21BAb3K84fO3v/W9dTxe3VLjs34D6nYUULgHzrmHKY/rRIdbmTzWg+IH2pO3mk/Sph6FbdEUUFY6vfJL/ejoBi9PXqX8+w87mrkj+b7MVwAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.creation-paid-container .paid-list .paid-item .right-wrap .paid-status.success {
  color: #6dd400;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAwCAYAAADab77TAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAeKADAAQAAAABAAAAMAAAAABgYUZmAAADOUlEQVR4Ae2cz27TQBDGv13/I0khRVURKohTJaRyLC/Ay/AE3DF3DsCNvgwv0F4REpyCVCECFemfJLbXNmsnTuPs+J6pJlJlZ2xL334/zXg9XUeh4xOfon/h4YkOMShyeB2nSXiLHNA+ynyOOe5j/OkQf5RCqSh9b35hYC7wvDAgj1PXSGy7HFAexh9fYKQpWWaMZwKXcoZPrMyxH5+j75Te16cIPA9P+QxFlHY5MJ8hcTL4oIeo6wKJ83IgCuA5gCdAyGsYorbLgdkUmQO4KBB0XSBxXg70h0gdwPamLBnMi2On2jQkAGcCuNMwbgeGP4gSHZZSormBpPT6Hor4FYxToo2SEk0Zxi1mDGwxBlqAyxLK/skkixtNQq9fInUAv/sqcAmvWIaKiAB8vSeAWdIkRKuEKNH+b7n/El6xDJkBkcEzmWCxhEmJ9q6JDI7uSYmmzOIY282JDM5mUqI5wiQ1H1OApYtFesUtqEuUsYKpdLeeg+0DsDwDc6NJ6C2CRfa2ANdNDl8AE36xC6lsMcFqAT45gy/LdNixJAUHyyZHC/D3QCZYpFsMg8myydECbB5IeWbIkpRs11zVfegWYP9SMph0i2HQJqsLOJFHJIYoack2Wet/FVZHV49JUSQlmraLX/QyIzI4S6RE80PpKq5eX/l8vGhyVEdXGVwGksGuXfwiyq7kqN5JapSvAOtMMrgxhfO2sCsp1/XXgOPSNjmUvGi2bgzXfZ3eTrCqMSwy+EyylyvQTd1muRarideA/3kCuDGE+1ZrIoN7OzLB4g620d+jMnh+IxncGMR9ax4Rk6xM1mJx57rSv/OXKNFhKCV65RDznbdHBGCTSolmzrWWbxscrSZHFaxn0b6s5LgLfNG8rrI+GB1/gW/y25bl+kHZ5+VAajN4U7GeHMr9d9MUrt/tislWm7Iahw7l/suVp6M7pwBPJzLBcpxiGtjsYlXD0L2+lGimPB3ZQyqDkww2s+VzFxw4tz98tjkO/XAPV5tB+c7PAa0wPXlJzKLjA0yrH67kNyRR3DhQLdPx9zFqvq9v60bHhyP8HPQwKg1m1cnrJ8j+9jqgPXt7zXG5O8W3949xQyn9D/6uumzwYpm1AAAAAElFTkSuQmCC);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.creation-paid-container .paid-list .paid-item .right-wrap .paid-status.fail {
  color: #ccc;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAwCAYAAADab77TAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAeKADAAQAAAABAAAAMAAAAABgYUZmAAADNElEQVR4Ae2cW4riQBSGc9MYLx0CExiEBp/6pZk9uIjBJbgNXcUswlW4g3mah+4noUEGMo3Y3lKamElVODXGig3z5qmcfimtaHP+/0ulyt+KpnHjbzicOo7zq5NlnpOmJ/PGy6j7zhzodMy03T7Fs9ksNk0zqwQ3Ho8br68b/85qp3L+y4Egns9/bO2q9/R63x4MI7WqjlEfFgdiZzD4flQgTqfTvI85WGRQnbcdCMN1QwG8XC4rR/Xtf0NH7tWB9fqPpQB+e3OVvnsVQHV97sDxaKvzrOMwGsGf+4bmaBgOzspo3WxWSh8aRVRoyYEoMlTAntckwCWb8D4ZDisAHw7qwguvxHpXnn8iUkew69o0gjU4L3iixWWUYGZZZjK2L/VpoLWWEhjrnhXAo9GI4GpyOrTbiQo4CAICrAngOD6pgCnk0IRuLsP3YxVwt+vQCNaG8bO6yOLZpTb6ai6EhxzcghJQ2z5TTKnJiTHMQw4FMIUcmtDNZfCQQwFMIYcegF23LeCWAFPIoQdcroKxVAKWc26+QctaLN49fWTWV8nDQ/P08vLzyB2QiyzayaHPCQEhRwkwhRz6AIaQowS42/0tR7M+UuupZLv9KudgCXW9bsnH9bRFH9WPj0wF3GrRF/26IO73+yKm5HrkqP34oBRLF8CTySQDLRIwhRxgCe6Whxz8niRQIQHTTg6wBHd7GXJwJQJwcbsKbmFUfeGA5xVf9IMfAvB8/m8uhgPU4nQgTS25wOIKBGDPe5eRJU5ZVDU44Ptf5Eck3icAU8gB9uBvt9tisx0oEYAp5AA78LeXIQdXIwBTyIEfLChYrVbqJXq/p812YBD2Nv9tDhWwba9okYWdbF7/dcjBJYlLNGM0gjXgW9rJAXosCjnACvztdcjBFVkUcuAHCwoOh2Np/hWAw7C4TMOLqMXrQK8XqICjaCHmYbyyqHJwIEncUkzJ+61mM6UVNDiEvL0OOQTg6+wSucZal3+5kwOMsKLIP8ETajE74CZwu8qlinwVPU0MI4gvO+kxPgeenpq7qqrFr83y21byn29o7feN1m6X0Zxc5dQd9tl2IzPNQ5Ikz7tioKpF/gURtuY+gnUNPQAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.creation-paid-container .paid-list .paid-item .right-wrap .income {
  width: 65px;
  height: 24px;
  line-height: 23px;
  color: #ba9250;
  font-size: 12px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  border-radius: 4px;
  border: 1px solid rgba(186, 146, 80, 0.5);
  background-color: #fff;
  cursor: pointer;
}

.creation-paid-container .paid-list .paid-item .right-wrap .icon-return {
  width: 24px;
  height: 24px;
  background-image: url(data:image/png;base64,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);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 34px;
  left: -28px;
}

.creation-paid-container .paid-list .paid-item .right-wrap .icon-result {
  width: 48px;
  height: 48px;
  position: absolute;
  top: 6px;
  left: -68px;
}

.creation-paid-container .paid-list .paid-item .right-wrap .icon-result.future {
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.creation-paid-container .paid-list .paid-item .right-wrap .icon-result.red {
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.creation-paid-container .paid-list .paid-item .right-wrap .icon-result.leave {
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.creation-paid-container .paid-list .paid-item .right-wrap .icon-result.cancel {
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.creation-page-publish-select div {
  width: 100% !important;
}

.news-content-wrap {
  /* width: 852px; */
  min-height: 300px;
  border-radius: 8px;
  border: 1px solid #d6dfea;
  margin-bottom: 30px;
  overflow: hidden;
  position: relative;
  padding-top: 10px;
}

.news-title {
  height: 42px;
  border-radius: 8px;
  border: 1px solid #d6dfea;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
}

.news-title > input[type='text'] {
  width: 94%;
  height: 42px;
  line-height: 42px;
  color: #666;
  font-size: 14px;
  padding: 11px 10px;
  outline: none;
}

.cell-title {
  color: #666;
  font-size: 14px;
  text-align: left;
  margin-bottom: 15px;
}

.media-cell {
  margin-bottom: 30px;
}

.media-cell .video-box {
  width: 176px;
  height: 118px;
  background-image: url(data:image/png;base64,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);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
}

.select-tags {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 99999;
  padding-left: 10px;
  padding-bottom: 8px;
  padding-top: 5px;
  right: 0;
  height: 53px;
  overflow: hidden;
}

.select-tags .tag-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f5f5f5;
  float: left;
  cursor: pointer;
  margin-right: 8px;
  margin-bottom: 8px;
  position: relative;
}

.tag-item > img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
}

.tag-item .tag-name {
  color: #636366;
  font-size: 12px;
  max-width: 108px;
  white-space: nowrap;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag-item .icon-remove {
  width: 16px;
  height: 16px;
  position: absolute;
  right: -8px;
  top: -5px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAAB65masAAAEqElEQVRYCc2ZSWscRxTHa0b7vm8jUEYj6WBsHYJCPoQIcXQJxsYhH0DGIZcQ9AEUEnAgti8Gn4S3nOwo5JJbSG4RviSEoF3g0b4vyJJmxv9/4Veq6eme6WlphB40Vf2q3nu/frVMdU9IBZTp6en+VCp1Heb9uCKoR0KhUAfqh7jiuI/j/g2uPyoqKsYjkcga9HlLKB+LmZmZD5LJ5B0EH4JdzK8tIBOw+TMcDv8ci8Ue4/6tb1s/Hefn5xuOj49HEGQY/cv82Hj1AdwcrhGAPkOZ8uon+pwZnJqa+hKd7wGuQYzOowTcBDJ6C6D/Z/PnCQigMIb0Bwzp19kcnKUNkFuA/ByQv3v5cQVcXV2t2d7efg7IQS/D89IDkvPzbl9f30M3n2Gnkpm7KDjGRrwiFA8mJydvO1l4nwGI7WP0IjLnhEEmH2FKfZyhtxWAu4k598TWFaJeWlqqEomEvhz+48XFxQPd3d1LojcZXF9frwXcT9Jgl62trSoajaq6ujpbHaje0tKiurq6tL+SkhKnjwjAv7OVBnBzc/MbNDTZjawXFRWp2tpahSdTdN7QEHy34YPKQ2JIFTPpIrextV0TvQacm5vjT9RXorRLDsXe3p5RNTU1qcbGRnPvt0I4PqjIwcGB2t/fl1tTcpHiGhWFBgQEf74qReksl5eXFR2KEDAfyLa2tgy4xcVFcedWfoJVfZUNGhBz7zO3XqIDvKJD+4kJyGzmEsLV1NSYbvRBX/SZTTAFNFMYK7cPHa9k68w2N0jOx+bmZk/T9vb2QHDvHfKkpDjen3pGcGng09tzsr6+3hWScNXV1caDZM4oclc+WlhYiHCIB3L3Te+xtLSUAckVLuKE4wPlmHNiakokLoQT1IfFqESMNo8KIW0Q2T64HVVVVRlPhGPfIEK2MCYjt5hAwsC7u7vGlpA2HNuCwtEp2TgHA2VQqLgF2ZCip45tZxGdwbM4oC1/EfhrUyjhEMeDOidcR0eHqqzM3OO593EPPIuQjUOcdUv3CkA4vKmlwe3s7CicJY0JIbmQggrZAmVQ4PA6aWITbGVlReE0ngbJvTAopM4gIkyYKD4qXnAEE2F9a2tLbvWGnS8k4qRwHHvNDP5iPOWo4AVHdXZ2KjtzBLHhxMXa2loGJOdrHvI3zo3xcE9PzySM/stlSDjOufLyctOVcATxErbhnGmauUcSkqPgQ16xjz7NIPjLbAaSORuOgbPBiT+c1ANBYoFoJg2Ifew+nur0wCfeUfJpOaxlZacfFAjHwH6FfTc2Nkx3bks5tqBf8Rr6Lw00YDQa5Vbzo/FgVbhV2HAMlA+cuHLacbjdhhq6JK5vxU4D8gZnu+9RZKQFJwp9FkTKNZidCXHit2TmuaCOjo70AqJPFxnr7e39R/Rps9XrtZNvX3R2cnIidoUqvV87GREr+inSy0ymCbNYaDjEPcRaGLLfiQmRlkEqkCm+BoyjHOT9BcoXWBhjznhmDkoDJynOdTdQ/ia6QpaIk4D/YTc4xs3IoMAwk5f285tAsry0HzBtyEv9CdgGnZ2djeIrxDCGfwj6mN2Wrc55Bpu/8JP5oiAf0d2CY6VfyN8Q7wD7FEIkSfONUAAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.tag-item.active {
  background: #fdf3ec;
}

.group-name {
  color: #666;
  font-size: 14px;
  text-align: left;
  margin-bottom: 10px;
}

.tags-dialog-footer {
  width: 100%;
  height: 90px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  padding-top: 20px;
}

.tags-dialog-footer .confirm-button {
  width: 130px;
  height: 40px;
}
.dialog .el-dialog__header {
  display: none !important;
}
.dialog .el-dialog__body {
  padding: 0 !important;
}

.creation-news-picture-modal .picture-modal-container .ant-modal-content {
  border-radius: 6px;
}

.creation-news-picture-modal .picture-modal-container .ant-modal-content .ant-modal-header {
  display: none;
}

.creation-news-picture-modal .picture-modal-container .ant-modal-content .ant-modal-body {
  padding: 30px 20px 20px;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-title {
  width: 852px;
  height: 42px;
  border-radius: 8px;
  border: 1px solid #d6dfea;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-title
  > input[type='text'] {
  width: 100%;
  height: 42px;
  position: absolute;
  line-height: 42px;
  color: #666;
  font-size: 14px;
  padding: 11px 10px;
  outline: none;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-title
  > input[type='text']::-webkit-input-placeholder {
  font-size: 14px;
  color: #999;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-title
  > input[type='text']:-moz-placeholder {
  font-size: 14px;
  color: #999;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-title
  > input[type='text']:-ms-input-placeholder {
  font-size: 14px;
  color: #999;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-title
  .text-total {
  color: #999;
  font-size: 12px;
  position: absolute;
  right: 42px;
  top: 11px;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-title
  .icon-clear {
  width: 20px;
  height: 20px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAAB65masAAAEqElEQVRYCc2ZSWscRxTHa0b7vm8jUEYj6WBsHYJCPoQIcXQJxsYhH0DGIZcQ9AEUEnAgti8Gn4S3nOwo5JJbSG4RviSEoF3g0b4vyJJmxv9/4Veq6eme6WlphB40Vf2q3nu/frVMdU9IBZTp6en+VCp1Heb9uCKoR0KhUAfqh7jiuI/j/g2uPyoqKsYjkcga9HlLKB+LmZmZD5LJ5B0EH4JdzK8tIBOw+TMcDv8ci8Ue4/6tb1s/Hefn5xuOj49HEGQY/cv82Hj1AdwcrhGAPkOZ8uon+pwZnJqa+hKd7wGuQYzOowTcBDJ6C6D/Z/PnCQigMIb0Bwzp19kcnKUNkFuA/ByQv3v5cQVcXV2t2d7efg7IQS/D89IDkvPzbl9f30M3n2Gnkpm7KDjGRrwiFA8mJydvO1l4nwGI7WP0IjLnhEEmH2FKfZyhtxWAu4k598TWFaJeWlqqEomEvhz+48XFxQPd3d1LojcZXF9frwXcT9Jgl62trSoajaq6ujpbHaje0tKiurq6tL+SkhKnjwjAv7OVBnBzc/MbNDTZjawXFRWp2tpahSdTdN7QEHy34YPKQ2JIFTPpIrextV0TvQacm5vjT9RXorRLDsXe3p5RNTU1qcbGRnPvt0I4PqjIwcGB2t/fl1tTcpHiGhWFBgQEf74qReksl5eXFR2KEDAfyLa2tgy4xcVFcedWfoJVfZUNGhBz7zO3XqIDvKJD+4kJyGzmEsLV1NSYbvRBX/SZTTAFNFMYK7cPHa9k68w2N0jOx+bmZk/T9vb2QHDvHfKkpDjen3pGcGng09tzsr6+3hWScNXV1caDZM4oclc+WlhYiHCIB3L3Te+xtLSUAckVLuKE4wPlmHNiakokLoQT1IfFqESMNo8KIW0Q2T64HVVVVRlPhGPfIEK2MCYjt5hAwsC7u7vGlpA2HNuCwtEp2TgHA2VQqLgF2ZCip45tZxGdwbM4oC1/EfhrUyjhEMeDOidcR0eHqqzM3OO593EPPIuQjUOcdUv3CkA4vKmlwe3s7CicJY0JIbmQggrZAmVQ4PA6aWITbGVlReE0ngbJvTAopM4gIkyYKD4qXnAEE2F9a2tLbvWGnS8k4qRwHHvNDP5iPOWo4AVHdXZ2KjtzBLHhxMXa2loGJOdrHvI3zo3xcE9PzySM/stlSDjOufLyctOVcATxErbhnGmauUcSkqPgQ16xjz7NIPjLbAaSORuOgbPBiT+c1ANBYoFoJg2Ifew+nur0wCfeUfJpOaxlZacfFAjHwH6FfTc2Nkx3bks5tqBf8Rr6Lw00YDQa5Vbzo/FgVbhV2HAMlA+cuHLacbjdhhq6JK5vxU4D8gZnu+9RZKQFJwp9FkTKNZidCXHit2TmuaCOjo70AqJPFxnr7e39R/Rps9XrtZNvX3R2cnIidoUqvV87GREr+inSy0ymCbNYaDjEPcRaGLLfiQmRlkEqkCm+BoyjHOT9BcoXWBhjznhmDkoDJynOdTdQ/ia6QpaIk4D/YTc4xs3IoMAwk5f285tAsry0HzBtyEv9CdgGnZ2djeIrxDCGfwj6mN2Wrc55Bpu/8JP5oiAf0d2CY6VfyN8Q7wD7FEIkSfONUAAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .recommend-reason {
  width: 852px;
  height: 75px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #d6dfea;
  box-shadow: none;
  resize: none;
  margin-bottom: 30px;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .recommend-reason::-webkit-input-placeholder {
  font-size: 14px;
  color: #999;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .recommend-reason:-moz-placeholder {
  font-size: 14px;
  color: #999;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .recommend-reason:-ms-input-placeholder {
  font-size: 14px;
  color: #999;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-content-wrap {
  width: 852px;
  height: 526px;
  border-radius: 8px;
  border: 1px solid #d6dfea;
  margin-bottom: 30px;
  overflow: hidden;
  position: relative;
  padding-top: 10px;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-content-wrap
  .w-e-text {
  scrollbar-width: thin;
  scrollbar-color: #d8d8d8 transparent;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-content-wrap
  .w-e-text::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-content-wrap
  .w-e-text::-webkit-scrollbar-thumb {
  width: 4px;
  height: 4px;
  border-radius: 4px;
  background-color: #d8d8d8;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-content-wrap
  .w-e-text::-webkit-scrollbar-track {
  background: #fff;
  width: 4px;
  height: 4px;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-content-wrap
  .select-tags {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 99999;
  padding-left: 10px;
  padding-bottom: 8px;
  padding-top: 5px;
  right: 0;
  height: 53px;
  overflow: hidden;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-content-wrap
  .select-tags
  .bottom-white-bar {
  height: 15px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-content-wrap
  .select-tags
  .tag-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f5f5f5;
  float: left;
  cursor: pointer;
  margin-right: 8px;
  margin-bottom: 8px;
  position: relative;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-content-wrap
  .select-tags
  .tag-item
  > img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-content-wrap
  .select-tags
  .tag-item
  .icon-remove {
  width: 16px;
  height: 16px;
  position: absolute;
  right: -8px;
  top: -5px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAAB65masAAAEqElEQVRYCc2ZSWscRxTHa0b7vm8jUEYj6WBsHYJCPoQIcXQJxsYhH0DGIZcQ9AEUEnAgti8Gn4S3nOwo5JJbSG4RviSEoF3g0b4vyJJmxv9/4Veq6eme6WlphB40Vf2q3nu/frVMdU9IBZTp6en+VCp1Heb9uCKoR0KhUAfqh7jiuI/j/g2uPyoqKsYjkcga9HlLKB+LmZmZD5LJ5B0EH4JdzK8tIBOw+TMcDv8ci8Ue4/6tb1s/Hefn5xuOj49HEGQY/cv82Hj1AdwcrhGAPkOZ8uon+pwZnJqa+hKd7wGuQYzOowTcBDJ6C6D/Z/PnCQigMIb0Bwzp19kcnKUNkFuA/ByQv3v5cQVcXV2t2d7efg7IQS/D89IDkvPzbl9f30M3n2Gnkpm7KDjGRrwiFA8mJydvO1l4nwGI7WP0IjLnhEEmH2FKfZyhtxWAu4k598TWFaJeWlqqEomEvhz+48XFxQPd3d1LojcZXF9frwXcT9Jgl62trSoajaq6ujpbHaje0tKiurq6tL+SkhKnjwjAv7OVBnBzc/MbNDTZjawXFRWp2tpahSdTdN7QEHy34YPKQ2JIFTPpIrextV0TvQacm5vjT9RXorRLDsXe3p5RNTU1qcbGRnPvt0I4PqjIwcGB2t/fl1tTcpHiGhWFBgQEf74qReksl5eXFR2KEDAfyLa2tgy4xcVFcedWfoJVfZUNGhBz7zO3XqIDvKJD+4kJyGzmEsLV1NSYbvRBX/SZTTAFNFMYK7cPHa9k68w2N0jOx+bmZk/T9vb2QHDvHfKkpDjen3pGcGng09tzsr6+3hWScNXV1caDZM4oclc+WlhYiHCIB3L3Te+xtLSUAckVLuKE4wPlmHNiakokLoQT1IfFqESMNo8KIW0Q2T64HVVVVRlPhGPfIEK2MCYjt5hAwsC7u7vGlpA2HNuCwtEp2TgHA2VQqLgF2ZCip45tZxGdwbM4oC1/EfhrUyjhEMeDOidcR0eHqqzM3OO593EPPIuQjUOcdUv3CkA4vKmlwe3s7CicJY0JIbmQggrZAmVQ4PA6aWITbGVlReE0ngbJvTAopM4gIkyYKD4qXnAEE2F9a2tLbvWGnS8k4qRwHHvNDP5iPOWo4AVHdXZ2KjtzBLHhxMXa2loGJOdrHvI3zo3xcE9PzySM/stlSDjOufLyctOVcATxErbhnGmauUcSkqPgQ16xjz7NIPjLbAaSORuOgbPBiT+c1ANBYoFoJg2Ifew+nur0wCfeUfJpOaxlZacfFAjHwH6FfTc2Nkx3bks5tqBf8Rr6Lw00YDQa5Vbzo/FgVbhV2HAMlA+cuHLacbjdhhq6JK5vxU4D8gZnu+9RZKQFJwp9FkTKNZidCXHit2TmuaCOjo70AqJPFxnr7e39R/Rps9XrtZNvX3R2cnIidoUqvV87GREr+inSy0ymCbNYaDjEPcRaGLLfiQmRlkEqkCm+BoyjHOT9BcoXWBhjznhmDkoDJynOdTdQ/ia6QpaIk4D/YTc4xs3IoMAwk5f285tAsry0HzBtyEv9CdgGnZ2djeIrxDCGfwj6mN2Wrc55Bpu/8JP5oiAf0d2CY6VfyN8Q7wD7FEIkSfONUAAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.creation-news-picture-modal
  .picture-modal-container
  .ant-modal-content
  .ant-modal-body
  .picture-dialog-content
  .news-content-wrap
  .select-tags
  .tag-item
  .tag-name {
  color: #636366;
  font-size: 12px;
  max-width: 108px;
  white-space: nowrap;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
}

.creation-news-picture-modal .w-e-text-container,
.creation-news-picture-modal .w-e-toolbar {
  border: none !important;
}

.creation-news-picture-modal div[data-title='\56FE\7247'].w-e-menu {
  display: none;
}

.creation-news-picture-modal .w-e-text-container .placeholder {
  color: #999;
  font-size: 14px;
}
</style>
