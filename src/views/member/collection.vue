<!-- 我的收藏 -->
<template>
  <div class="i-tabs-container">
    <div class="header-nav" style="margin-bottom: 0">
      <a v-for="(item, index) in tabList" :key="index" @click="tabIndex = index">
        <div
          class="item"
          :class="[{ 'first-item': index == tabIndex }, { 'first-active': index != 0 }]"
        >
          {{ item }}
        </div>
        <!-- <div class="item first-active" :class="index==tabIndex?'first-item left-space':''">{{item}}</div> -->
      </a>
    </div>
    <div class="tab-pane-item" name="">
      <div
        :class="tabIndex == 0 ? 'collection-news-container' : 'collection-post-container'"
        style="height: 526px; overflow: auto scroll"
      >
        <!-- 头条 -->
        <div class="collect" v-if="tabIndex == 0">
          <div>
            <div class="new-item" v-for="(item, index) in dataBase.data" :key="index">
              <!-- <div class="picBox"> -->
              <router-link class="picBox" target="_self" :to="'/detail?id=' + item.id">
                <div class="icon">
                  <div class="lazyload-wrapper"><img :src="item.img" /></div>
                </div>
                <div class="des">
                  <div class="title">{{ item.title }}</div>
                  <div class="btns">
                    <span>{{ item.addtime }}</span
                    ><span>评论 : {{ item.comment_count }}条</span>
                    <div style="display: inline-block; margin-left: 8px">
                      <div class="tags-container"></div>
                    </div>
                  </div>
                </div>
              </router-link>
              <div class="del" @click="cancel(1, item.circle_id)">
                <img
                  class="active-icon"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABTNJREFUaAXVWV1MHFUUPmdmFwvYAE0Q2/pTiGhM2zQxfaoaxS4k2hd+Ak01KkjtD3TxSXkwJk2ML/ZJoE2pWlFjoxAWXvQBqKRpStqkL21jjK4Wq1a6xbRU2FLYnbmes8u27N/cu7vDFm4ymdnzc7/vm3Pvztw7ACu84VLxH+6qeQsE7BbUELCnsm3g06XAWhIBQ121u8E0owkj7q9yDxy1W4TtAi589Xq+b2pmHEAUR5PFyZLCB0u3vPG1P9qe2S8ts/T47Ou3ZvbHk+c4URz2xedkYrG1AmO99bn+a4FxAVCSiBSB+fIfdpZua+ibTeRPx2ZrBfy+4L5k5Jkc+zgmHaLJcmyrwOgXjasC07cuE821ycDCdpxwri4oq2jquWMdp+a1rQLBmf/elpNnUmJtOFaNoCzKFgHeH9wPELF2Gdg9v2gP59yzpHtli4Arv19tpufVelUSHMs5qvFWcRnPgZ9663Ou+gK/0Qx91Aoozofw1/oS5xMbG/rm43wpGDKuwMQ1oyll8kyQBE9cDzSmwDVhaEYVON+9x3lzftJLQ+LxhL1LjIh4pSinuHzr3mMBSWhSd0oCeOL9Mf53mTCxnO5gOaLYRuRrk/au4CARHnrdGwMEL2rCu6H0kcvlr3TOKaSGQuIEjI4edAR+uVQKQSCSBh1EFugaxJMA+BidMx521uTQJIw/CetXivMCCjp0LzjA63xq83hFxcHg4vyQgB87arYYCO10V7dScik9MR2Lg5bLNZEl8jhO7+fnNF075Grpv4gjR+rKzKBxkUjmLxeiKjxIzLRDdz6jCcOkJ+jKIs8CaZSsDprBZo2U5KooXo4xNJTyNKHjtzSuaOKstIamQ2CvVtniOatp0IbIVVkZjbky55fcnjOhfyGmPdJVvUcIOErHXdtylMPk6djnOjB4jPlFkT3ZUdtogPicpsgS/9ene2vQ1AGbt7d5eiI9RAlg48jhmtdME74EIfRI0LI4Ixo0bN50tQ58s5hP3J1eCNhFyqKeeIuTsn29wGVXLHnmEVeBCLmRzrpqU5jf0XDKidjuzxnnNdR2utz9g4nwkwrg4OGO2h0CzH66pBXXfWlzCFpdZZvn+2TolgI46eTh6irTwEEBIqsPPNqOnNV0Ub29dXAoGXm2x82B2GDuAHXcQXZbd9RicWJ++xlTRp5zpAI4yNXqGaXp0s3X2WnYHcaUoykJCHcjeF2QpaaOpS4AYVOW2PN/ozKWkgDecabZviFbAhiLMVXwlAT8OzW9MZvvSIzFmLYJMBGVOlMBVI1RxVSqAN0R5TGpSlAWp4qpJIDAsi5AFVNJAO3/ZF2AKqZUwOkjrxZROdfJSm63nzEZW9avVMBccD6tu0+rpvOahlV88LWMSCK/CrZ0A0towU2QwpKftgp/pjeUDyrd/fwWG2nDw511dQDmh7QV+XTEKDuHsAFOW8VJK0BLfaUK8EatDlqTq8SxOYZ8CJ9t7OMYjrUiddengC2tAHWW8ItjBISemj5A7aN1JXq3bK8fG/oMyuuhbwon/vEZe0GY79NWSNL+6Xm2JoKT7CwVQAuKC7SoofJHNyI+JUA79FBh/iepfrxeENpJrwvHfVP+dxDMd0lIYTQC/RJ4Kc4WYyAe1o2+AeTdmJ8cokX+s6FIhNu02OhYped+/HzLiZvW2Wpe/re5Y8y+R4umNhqyeWEcPJOXV/Tyc83Hp616kQrgZJp4ONJV/wKgUeDILzhFn0inrDpN1zf2Wf0a/+3gi7SdfsN1oO8UzZUVs9mWrmb4HxEUs87RZuf9AAAAAElFTkSuQmCC"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 帖子 -->
        <div class="collection-list" style="padding-bottom: 80px" v-if="tabIndex == 1">
          <div class="collection-item" v-for="(item, index) in dataBase.data" :key="index">
            <div class="head">
              <div class="user">
                <div class="avatar">
                  <div class="lazyload-wrapper">
                    <img
                      class="img"
                      :src="item.avatar"
                      @error="$common.errorImg($event)"
                      width="20"
                      height="20"
                    />
                  </div>
                </div>
                <span class="name">{{ item.user_nickname }}</span>
              </div>
              <div class="operation" @click="cancel(2, item.circle_id)">
                <span class="favorites active"><i class="favorites-active-icon"></i></span>
              </div>
            </div>
            <router-link class="content" target="_self" :to="'/circle-detail?id=' + item.id">
              <div class="text-container">{{ item.title }}</div>
              <!-- <div class="images-container"></div> -->
            </router-link>
          </div>
        </div>
        <!-- <div class="collection-list" style="padding-bottom: 80px;"></div> -->
        <div class="common-empty-view" v-if="dataBase.data.length == 0">
          <DfEmpty description="暂无数据" />
        </div>
      </div>
      <el-pagination
        v-if="dataBase.data.length !== 0"
        background
        class="ant-pagination"
        v-model:current-page="page"
        layout="prev, pager, next"
        :total="dataBase.total"
      />
    </div>
  </div>
</template>

<script>
import { logList, favorites1 } from '@/api/headline.js'
import { favoritesList, favorites } from '@/api/circleuser.js'
export default {
  data() {
    return {
      page: 1,
      tabIndex: 0,
      dataBase: {
        data: []
      },
      tabList: ['头条']
    }
  },
  mounted() {
    this.logList()
  },
  watch: {
    tabIndex(e) {
      if (e == 0) {
        this.logList()
      } else {
        this.favoritesList()
      }
    },
    page() {
      if (this.tabIndex === 0) {
        this.logList()
      } else {
        this.favoritesList()
      }
    }
  },
  methods: {
    // 取消收藏 1 帖子；2头条
    cancel(type, id) {
      if (type == 2) {
        favorites({ id: id })
          .then((res) => {
            this.favoritesList()
            this.$message.success('操作成功')
          })
          .catch((res) => {
            this.$message.success(res.msg)
          })
      } else {
        favorites1({ id: id })
          .then((res) => {
            this.logList()
            this.$message.success('操作成功')
          })
          .catch((res) => {})
      }
    },

    // 头条
    logList() {
      let data = {
        page: this.page,
        type: 1
      }
      // logList(data)
      //   .then((res) => {
      //     this.dataBase = res.data
      //   })
      //   .catch((res) => {})
    },
    // 帖子
    favoritesList() {
      let data = {
        page: this.page,
        type: 1
      }
      favoritesList(data)
        .then((res) => {
          this.dataBase = res.data
        })
        .catch((res) => {})
    }
  }
}
</script>

<style scoped lang="scss">
.collection-news-container .collect .new-item {
  display: block;
  position: relative;
  cursor: pointer;
}

.collection-news-container .collect .del {
  width: 50px;
  height: 50px;
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.collection-news-container .collect .del .active-icon,
.collection-news-container .collect .del .cancel-icon {
  height: 24px;
  width: 24px;
}

.collection-news-container .collect .picBox {
  width: 100%;
  padding: 20px 0 0 20px;
  border-radius: 5px;
  margin-top: 15px;
  background-color: #fbfbfb;
  height: 100px;
  display: flex;
}

.collection-news-container .collect .picBox:hover {
  background-color: #fff9f5;
}

.collection-news-container .collect .picBox:hover .des .title {
  color: #b08a5b;
}

.collection-news-container .collect .picBox:hover .des .title.is-delete {
  color: #999;
}

.collection-news-container .collect .picBox:hover .des .btns span {
  color: #b08a5b;
}

.collection-news-container .collect .picBox .icon {
  width: 90px;
  height: 60px;
  position: relative;
}

.collection-news-container .collect .picBox .icon img {
  border-radius: 5px;
  object-fit: cover;
  object-position: center;
  width: 90px;
  height: 60px;
}

.collection-news-container .collect .picBox .icon .play-btn {
  position: absolute;
  width: 25px;
  height: 25px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.collection-news-container .collect .picBox .des {
  margin-left: 15px;
}

.collection-news-container .collect .picBox .des .title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  text-align: left;
  overflow: hidden;
  width: 702px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.collection-news-container .collect .picBox .des .title.is-delete {
  color: #999;
}

.collection-news-container .collect .picBox .des .btns {
  margin-top: 15px;
  width: 704px;
  text-align: left;
}

.collection-news-container .collect .picBox .des .btns span {
  color: #999;
  line-height: 25px;
  font-size: 12px;
}

.collection-news-container .collect .picBox .des .btns span:first-child {
  margin-right: 10px;
}

.collection-news-container .collect .picBox .des .btns .btn {
  display: inline-block;
  margin-left: 15px;
  border-radius: 2px;
  border: 1px solid #ddd;
  line-height: 22px;
  text-align: center;
  font-size: 12px;
  padding: 0 11px;
  color: #333;
}
.collection-post-container .collection-list .collection-item {
  padding-bottom: 20px;
  margin-left: 35px;
  margin-right: 35px;
  border-radius: 3px;
  border-bottom: 1px solid #f1f1f1;
  background-color: #fff;
  cursor: pointer;
}

.collection-post-container .collection-list .collection-item .head {
  height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  background: #fff;
}

.collection-post-container .collection-list .collection-item .head .user .avatar {
  display: inline-block;
  margin-right: 10px;
}

.collection-post-container .collection-list .collection-item .head .user .avatar .img {
  border-radius: 50%;
  overflow: hidden;
}

.collection-post-container .collection-list .collection-item .head .user .name {
  font-size: 14px;
  font-weight: 500;
  color: #999;
}

.collection-post-container .collection-list .collection-item .head .operation > span {
  line-height: 30px;
  padding: 10px 8px;
  font-size: 14px;
  color: #878787;
  user-select: none;
}

.collection-post-container .collection-list .collection-item .head .operation > span.active {
  color: #b08a5b;
}

.collection-post-container .collection-list .collection-item .head .operation i {
  display: inline-block;
  width: 16px;
  height: 16px;
  position: relative;
  top: 3px;
  margin-right: 10px;
}

.collection-post-container .collection-list .collection-item .head .operation .like-icon {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAABXhJREFUaAXtmlloXFUYx2cmM5MSl0jV0WrdqqIPrmirRqzaFlKbZkUJPvgifdCHWsiDDymuGPDFFlRQRKQP6oOQFZKmRkk12IVGC61LhUIJNVi3jDXtVLPM+Dthzul3DrmzpXNzCx24nG875/z/5zvbvUkodOEXrBEILwac7u7uVZlMZivPqnA4fBEYdkUikdebmpoOl4rHdyJdXV1rADsAiUoH9BSknm1pafnEsRekRgqKOrdB2+YhoXqI8+zo7e1dXUp3vhLp6em5DhJ3ewHFF52dnf2IssIrxsvuKxEALpNAmEoHWBvPYEtrOzE3k5VWrRda+k1khQPsWHNz88cQek/a0+n0k1IvRPaVCICvdUCNKz0Wi70r7WRljdQLkX0lAsD7JCiIzRGpr68/gvyb8FX39/dfLfS8om9ERkdHY6B5wkE0IvRjQg5NTU1dL/V8cjRfwLnyj42NbaSty3R7KgMcgAe0TpkUcohNYInU88m+ZQTgL0swTLNebBlhsw5nFrzKYME/X4hwfrQC/B6BKh2NRrcJXYkXO/qko+dUy06EK0mCQ+4diYJMfNbY2PiztEHUXdx/SX8+uaxEABfh+RAQV2ogkPivoqLiVa2rUsVRLJe2qqqqE1LPJ5eVCLfc7QCod0C85Gajr69vBTFycY/X1taedurlVMtGBBIvMtIvOL3v4SR/y7GFWNh3SBtZs6ad9HnJZdl+IfE8JN6UnQLuOLZWSnOv0n7sD2g5W/7OBnGnYzMqxGdo51cG5W9ttLY8bVxI2dnZuZn6b8s26DTJLvVIQ0PDD9KuZTaE3ZB5VOsFlmna/Zz1tpmpetTKCKOwAbZtNLSShi/1aPAkDYxwYL3BgbbfjcH3CnWl+V9iG71IZAPvkhUKlNVGsp4d8Rtw32/WCKPyFMY+nGt5vEioPqrxbyR2hAbWuZ3iu1zaINECYXkVkW4t/6KFYkv6SzD47TIjr9FIMS80MRrooM4XuTpnHu/M5Vc+pt3TMzMzak3dkC9W+QGvdrhbdSz6BkME5RbtKKL0fNsroo1Qdtq527RnE8PDw0smJibOiIBlhghzewIyV2lnPB5fzvV6XOu6ZDGbBUC8+wFBh5W1TCaT1tQH+ymzRuj5D9n79PT0FVIPksy6u0niYUCPSyJ/SicsA0uEtXmbg/XoeUkEEtZNAP2IJxHSZS56kn0QZLDdK3Ew1Q4ZIkwla42QvsBOLbDKdxt1VztoiMDyvFgj3ONuBKsc5FOcVWfXCOmxiDjBMpOLLT8kAZCdUZ50rowEco0wwA9KIsj7lG6IkBFrjQQ1I+CqkUTQ91pEMFhTi3TJeSjrLprMN+FL6NzsWGDMcAPZYxFJJBIWkSBmhBv3w4CWF9ufuEbN4TZTq6am5gwMU2K44wMDA9adRvgWRWRwVzsdf611Q0QZCLTWSdDOEgb6cQ08W36ldYsIgdb0CtLFcWhoSL3QrdTAVVlZWblb6xYRAi0iEAvMgp+cnHwM0GZ9gO37urq6E/MScTPC1ArMWQK2tRp0tvxS6lZGCLbWCHpgMsKgrpfAka1XbIuIO7XQA0GEDyPqWmLe0Rlg9dnVLHRFMCcR/KUQOaka1j9ejds5yK7Reollu6zHAO/kW5b1td68s6tANbUIMnWQNwFkkzEUJqi7T60I7eALSQftCFNxosSkapKN990WrIzwR8kf3YBcOsStvzKpWO5sWylO56q3EB997uU72S63DYuI+qMkAZ+6QTn0D1wf7wbfYlPfeP9xfQvVaTNFNp6br53wfEZeXrawS2zBpz6YWWTRp2lQEd4B6O3IZ+ciRv0bHBxcmkql2pgW67DdzlOtfSWU6v9UvqNeG/+rMnfbLaGNC1V8HYH/ASy6B6buLt50AAAAAElFTkSuQmCC)
    50% no-repeat;
  background-size: auto 100%;
}

.collection-post-container .collection-list .collection-item .head .operation .like-active-icon {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAABCJJREFUaAXtWkloFEEUrV89kzGKxi1iEBXUg7cILgcRIdtBiZBEo54EFdziKOTgQUGiqEcDmQQXggTEBUNUPChmQWPQKETFBY2Qm4hbXKLGaDJd39+j3ZnqTMfuWXpssCFU/V+/qt7rql/9f00Y+//8W28A0gGnraZkiQDYR3MvYYjjkMF1AN/BomDjk3jxuE6kLVSaryJeJcABGTQMcoVtKqy4dEbW25O4PbPkWamMHaXRTCS08TEDVWxoqy1bHs9srhJpr1s/k7ZSrhVQZMwnBJ7CC+WKlY2V3lUiYfVHjhUQXY8M57a+Vdfpst3SVSLIYY4dYERmjR27aBtXiQgBM6Int6rTCZRv1Wald5UIAC60AhKtR8SsG3Xl06N1f6u7RqTrxBY/OfqKvwHS24U6NEuv2yldI9I31FtMp9JEO6AiNpyPsW1Lhq4RUVHsdwJMZdzvxN4VIq2hsnUM2QInwBQR/urEPuVEbh8rnSYQQ05ARWwD7IOTPiklgljF+4ewnsKPbCegNNupmePfOOmTUiItdY+qCcwqJ4A0WwB4lbvhdL+TfikjQn6xhwnc5QSMbkun2wu9brdMSRjfUluynZy7DinRsAtEsgM4D8x3RNJFCzwc9o3Nep23seGzro5vIr13jLIlVBZEFDUxmpKsAkHgm32KL5hX0dgjEWmuXb0ShFpJS7uYZp0Qa2bav32k71CAH8rf2XTPbNMSKu2lEGOKWZ8yGeBdgAcWGT7SHCotZyiuEIkCmjQmCQ2MFgfRXzF94Dpaa1YXmgG6SuI3oGmD4udegwgtzQFCaTuhIcB+AeKwmUhaZMSVBhECMM8xiFGyPcdjJdIBIGeYCOLHOMaKkXvHMUqCXSgR+2YQoZPyfYLjpa07ILw0iFDS05s2JIlODKzHIIIIniUCwLoNIiR4lghDeGwQIYfxrI8wwIcGEe7RrUWRxreCitwoHwGv+gh2AVSJ4RXhwqM+Ane1Q88gIrjiSR+h71+nRCRD+D23InTSoj8jcEci4s9WPUeEkrfneVvPRXAbW2vp2sYByue+a+w88wDc0rEaRDQFeCzeoq3VHpMI5Rie2l4K+G7GJOKtMAWeUq5u3H1JW4tiFs+sCAfWpq+GVspEvBRvAWu1JuKdMOXnmMxJhqOPWBHKtBLeWn+ui6JfVtLr5MvXlm0+Jd3WS1srOaE8RmKfpKOXBlSOSyIJEhEf8Gdmg1FlYJ/M7YrCtH/NcHQBbR5jNJlWvLMo2HTdbCMRyQs2ddOynTUbWcmUw5w0t+XvuHwfGNd+J/9ibktYpsgDFL4t1jjSlalu0Bwq2U313XQcz6a7RYksvZEh0hFhaCiouFhNJV1Ojnzu1JdP7h8I0/UrFlLEMJ8+tlkjrexqYJCAPgDOKgt3XopEu3Z7/rdL1xv4BcgfNbHJhHEgAAAAAElFTkSuQmCC)
    50% no-repeat;
  background-size: auto 100%;
}

.collection-post-container .collection-list .collection-item .head .operation .comment-icon {
  background: url(data:image/png;base64,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)
    50% no-repeat;
  background-size: auto 100%;
}

.collection-post-container .collection-list .collection-item .head .operation .comment-active-icon {
  background: url(data:image/png;base64,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)
    50% no-repeat;
  background-size: auto 100%;
}

.collection-post-container .collection-list .collection-item .head .operation .favorites {
  padding-right: 4px;
}

.collection-post-container .collection-list .collection-item .head .operation .favorites-icon {
  background: url(data:image/png;base64,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)
    50% no-repeat;
  background-size: auto 100%;
}

.collection-post-container
  .collection-list
  .collection-item
  .head
  .operation
  .favorites-active-icon {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAABVZJREFUaAXdWm1oHEUYnnf27hJta0tLtKUgMZj80R+iFbVCsble/aCV5JKTVkHTgIaaXPFfS5H+KKIUKUKuF6k/an9EkV5zESm19pJLFS2KQREpQk9iUKQ1saFNE5vL7s74Tu7WXvc+Zu5uL825sMzOO+/H8+w7XzssIf+TCyrJYzjcspWZ8LKIARrp39I9eKZS8SpGZCjc+hIzeX8mcI3QXd490eOZMqeeK0JkJBxYbjBjnHO+JhMoAFxxUVf95u7ITKbciWfqhBO7D50b3XYSQkfIRJtd34m64xkZPfranVPJyXGEXZcbIEyurqmr39D1wT+520uTOp6RqeTfu/OTECB5XUqnNMD5rBzNyPkTgTtmL+u/cULuyRdQyDHoX8vWuu/b+ELkRiG9YtoczcjshNklIyHACR2hWwxQma5jGRn5sKNWv35tDGGukwVNtcMl94qVDZt3HZ9T0y+s5VhGjJnpV9VJCFB8XcqmMEDVVkeIJE4HaxDYXtWgN/X43pTtTUmpT44QGR/7oxPXiPXFghA2wrZYu1z6ZRO5cCLgIYzsy+VcSYa2Cz6UlPMrlU3k0oTegbPQvflDFG4RtsJHYS15q/KshfuntabJGzk1G3H+bMQxgTdp4pw0YYljpKwrCUAuoge8IYELTQKYltA0SOC+7LKK51uIDB1pXcMpNBKDNxFRcoZgRYkECFmh4tBpHQR4nQCSIxwJ0gRhWLrgImC5pWfwihVvgUist9XPgR/CN32/1VANJe6mf+EE9m0NRj8D7DIPGab+Pb5xVzWAz8IIYLqpawM1TWNH1ZIQrDjXdKbvpAyAZbGsQgF1AXyEuJNViD0NGeaBuPtpc8/ABUqhA0e9UW1kBGZKySu+YOTnhVlLEBgK+9s54x/jtsFdDYRwxtIJoTt9wYEBgfc/IqJyNuR/HgdPBEeQR9SX7gXzuLYExLRrYbyFiBAOh1qeZQSimJlaS2kplZiJOUq43xv89PNMXFl7LaEAnG7HXDl6OJAZtORnxCSw2UkIf1kZsYLEQu1PcW6cwvoyS3aby1kA1zZf8OS5XDjyEhHK8ZD/SYOz0/h4Vy7jRZRNu4A+1xyMfpMvZkEiwih+pO0xk5lncPVflc9JJeUI8KpGtWdwmfiuUBwpEWEc72t5xDDgLM5mqws5c74NpjQKPm9P9AeZbyUiwonIjMHMb2UOnWx3Ue1xWSaseFmzltWQVVJz8Vf+ImIqE2EMHswiV2GBacADqiGUieBgV3aqGlyqR4nyy1MnwtWdSgEqKuB5gPNEcMZSdqqIU0FNPabSrBU7GljJk/pVhciOq0CNe5WvK3JN5lipa1GDL/74SCNXja1EBPdct6FbpZioxlYkoj7oZF2g2HbVAa9EhPCy1pBpBC/uki48t1Lq1kpEOBS/hix8AFFyGM8DGlI3OSxkJbBR6tbSWeurY4G6uRl9QhUAOjTwK+cYdbkPendH/sy0G34/sJ4Z+gE80ews5iytdrn77k2dkclMX/Zn6eni/A1T7Y0AwiPwCf4QcAAPnn+1BxL1NLEuPN18F38oOIhr0w4cA9KXmcYwksunJZMS4QykW3fsMqc0Tt5s3jP4k+W4UJkm+mK8t/WQCeQtPB/YVkifMfkBupQIBT5qEjDF0aQ9GBD4kmrafm/3yfP2NpV6mvj24XD7Rvx4ewdjbLLbia7qoZ4f7XJ7XZpWYRDrbenB4j2rX2MG8EOH7sczpS/sDsupx0JtTxPC3sYMPZzyA3iiC2/4gtGQzK8SEeFkqK+tgZj8UULJmPf1gVEMgLycv5AExPsCTzDG6olH+xq3J787H2UJe/wX6qXTl0Klc+gAAAAASUVORK5CYII=)
    50% no-repeat;
  background-size: auto 100%;
}

.collection-post-container .collection-list .collection-item .content {
  width: 890px;
  height: 88px;
  border-radius: 3px;
  background-color: #f8f8f8;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}

.collection-post-container .collection-list .collection-item .content .text-container {
  /* width: 504px; */
  height: 68px;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.collection-post-container .collection-list .collection-item .content .images-container {
  width: 376px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.collection-post-container .collection-list .collection-item .content .images-container .pic-box {
  width: 110px;
  height: 66px;
  margin-left: 8px;
  overflow: hidden;
  position: relative;
  border: 1px solid #f1f1f1;
}

.collection-post-container
  .collection-list
  .collection-item
  .content
  .images-container
  .pic-box
  .img {
  width: 110px;
  height: 66px;
  border-radius: 3px;
  object-fit: cover;
  object-position: center;
}

.collection-post-container
  .collection-list
  .collection-item
  .content
  .images-container
  .pic-box
  .video-pop {
  position: absolute;
  z-index: 3;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
}

.collection-post-container
  .collection-list
  .collection-item
  .content
  .images-container
  .pic-box
  .video-pop:after {
  content: '';
  display: block;
  width: 34px;
  height: 34px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAAAmVBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VHQRUAAAAMnRSTlMAEfwE7uQJOtrprm9nch328nteNBXOn0wryL22m4l9Jxrf1LKPeFpCIrmYV1Qvo5WAEIAp5PMAAAIUSURBVFjDpdbpVuowGIXhTdJ5LpRZBgVxRD37/i/uiOgpB5smaZ/frHclab4soCb9ZL+8cx2Rh8H8rXzdwl6WLgteCZ6nEhbkcCHYKNzPYMiLXbaIRjCRhNTYPULnOKdeXkq0SgWNjNsWNNjRVPEClSyghTWazVxaeW+uOLQ0adqRS2srXBsE7CDGlR27ED7+k7Ibd4ALR8GOIlyYs7Mp/knY3a2Hb17IHu7xLWYfoYcv0mWt++UZsp9bfFmwpwd8ylR3Jo/9tWM8oikVhgD+rHJqFRLAkgpbnGyfBXV8QBZUGOBsExk8hD51GWD0xFYLIGnJ1B7GbOEA+9ZM7TWgWoWlYQYycVvO+E6XqXn3qmt0gKvP1AYrNkrg2GRUXySFsMt4jb//QG6X2bBJidAqU80VT05gkfHKQjXFc+OMVP8Pm+LNNPMSUGmDUpvRD5WQeDXJjBZsEwBbfWYTGbyigSazvRHUGAJ4psLxPEU5tTIAUypEsp7pVmN8kiEV3KVDEylO9uxHVDiZsZ8IZxF7GeFsxD6e8GPXbzE/HnN2doNaya6cCjU5ZkcHXHos+myp9sIu7jxcWdOem+GXd/vjnaHBxLbio9HKbkczKMTC4nQzKPmu8Zf20GIQmR3LARrTW4OlVNDy7kPNy+DDiBerVySiEcw9TAo2GKcV7Eh/vXBYE8FkmKGbyj8k6UcZD6cbiTZ/Ae8InswZUfQkAAAAAElFTkSuQmCC)
    50% no-repeat;
  background-size: cover;
  cursor: pointer;
}

.collection-post-container .collection-list .collection-item .content .images-container .pic-tips {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 3;
  width: 110px;
  height: 19px;
  opacity: 0.75;
  border-radius: 3px;
  background-color: #000;
  font-size: 12px;
  color: #fff;
  text-align: center;
}

.collection-post-container .collection-list .collection-item:hover .head .operation > span,
.collection-post-container .collection-list .collection-item:hover .head .user .name {
  color: #b08a5b;
}

.collection-post-container .collection-list .collection-item:hover .head .operation .like-icon {
  background: url(data:image/png;base64,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)
    50% no-repeat;
  background-size: auto 100%;
}

.collection-post-container .collection-list .collection-item:hover .head .operation .comment-icon {
  background: url(data:image/png;base64,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)
    50% no-repeat;
  background-size: auto 100%;
}

.collection-post-container .collection-list .collection-item:hover .head .operation .favorites {
  padding-right: 4px;
}

.collection-post-container
  .collection-list
  .collection-item:hover
  .head
  .operation
  .favorites-icon {
  background: url(data:image/png;base64,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)
    50% no-repeat;
  background-size: auto 100%;
}

.collection-post-container .collection-list .collection-item:hover .content {
  background-color: #fffbf8;
}

.collection-post-container .collection-list .collection-item:hover .content .text-container {
  color: #b08a5b;
}
</style>
