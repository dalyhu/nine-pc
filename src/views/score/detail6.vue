<template>
  <div class="zhishu-container">
    <div class="zhishu-main">
      <div class="ant-tabs ant-tabs-top">
        <div role="tablist" class="ant-tabs-nav">
          <div class="ant-tabs-nav-wrap">
            <div class="ant-tabs-nav-list flex" style="transform: translate(0px, 0px)">
              <div
                class="ant-tabs-tab"
                v-for="(item, index) in titleTab"
                :key="index"
                @click="titleIndex = index"
                :class="index == titleIndex ? 'ant-tabs-tab-active' : ''"
              >
                <div
                  role="tab"
                  aria-selected="true"
                  class="ant-tabs-tab-btn"
                  tabindex="0"
                  id="rc-tabs-1-tab-oupei"
                  aria-controls="rc-tabs-1-panel-oupei"
                >
                  {{ item }}
                </div>
              </div>
              <!-- <div class="ant-tabs-ink-bar ant-tabs-ink-bar-animated" style="left: 0px; width: 80px;">
							</div> -->
            </div>
          </div>
          <div class="ant-tabs-nav-operations ant-tabs-nav-operations-hidden">
            <button
              type="button"
              class="ant-tabs-nav-more"
              tabindex="-1"
              aria-hidden="true"
              aria-haspopup="listbox"
              aria-controls="rc-tabs-1-more-popup"
              id="rc-tabs-1-more"
              aria-expanded="false"
              style="visibility: hidden; order: 1"
            >
              <span role="img" aria-label="ellipsis" class="anticon anticon-ellipsis"
                ><svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="ellipsis"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z"
                  ></path></svg
              ></span>
            </button>
          </div>
        </div>
        <div class="ant-tabs-content-holder" ref="chart" id="myChart"></div>
      </div>
      <div class="ant-table-wrapper">
        <div class="ant-spin-nested-loading">
          <div class="ant-spin-container">
            <div class="ant-table">
              <div class="ant-table-container">
                <div class="ant-table-content">
                  <table style="table-layout: auto">
                    <colgroup>
                      <col style="width: 199px" />
                      <col style="width: 250px" />
                      <col style="width: 250px" />
                      <col style="width: 250px" />
                      <col style="width: 250px" />
                    </colgroup>
                    <thead class="ant-table-thead">
                      <tr>
                        <th class="ant-table-cell">时间</th>
                        <th class="ant-table-cell content_txt_bf"></th>
                        <th class="ant-table-cell">主队</th>
                        <th class="ant-table-cell">{{ titleIndex == 0 ? '平局' : '盘口' }}</th>
                        <th class="ant-table-cell">客队</th>
                      </tr>
                    </thead>

                    <tbody
                      v-if="baseList.length > 0 || Object.keys(baseList) > 0"
                      class="ant-table-tbody"
                    >
                      <tr
                        data-row-key="0.40061956129737686"
                        v-for="(item, index) in baseList"
                        :key="index"
                        class="ant-table-row ant-table-row-level-0"
                      >
                        <td class="ant-table-cell">
                          <div class="b-r">
                            <span class="bg-d8ad66 i-temp"></span
                            ><span>{{ item.date }} {{ item.change_time }}</span>
                          </div>
                        </td>
                        <td class="ant-table-cell"></td>
                        <td class="ant-table-cell">
                          <div class="b-r b-l">{{ item.host }}</div>
                        </td>
                        <td class="ant-table-cell">
                          <div class="b-r">{{ item.early }}</div>
                        </td>
                        <td class="ant-table-cell">
                          <div>{{ item.guest }}</div>
                        </td>
                      </tr>
                    </tbody>

                    <tr v-else class="not-data-table">
                      <td colspan="5">暂无数据</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="title">
        <div class="title-info">
          <div class="info-wrap">
            <div class="bg-d8ad66 i-line"></div>
            <div>主胜</div>
          </div>
          <div class="info-wrap">
            <div class="i-line bg-50e3c2"></div>
            <div>平局</div>
          </div>
          <div class="info-wrap">
            <div class="bg-0071e3 i-line"></div>
            <div>客胜</div>
          </div>
        </div>
      </div>
      <div class="exhibition">
        <div class="exhibition-info">
          <div class="i-point bg-e30000"></div>
          <div>滚球盘</div>
        </div>
        <div class="exhibition-info">
          <div class="i-point bg-d8ad66"></div>
          <div>即时盘</div>
        </div>
        <div class="exhibition-info">
          <div class="i-point bg-0071e3"></div>
          <div>初盘</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getExponentList } from '@/api/basketball.js'
import { footballOddsDetail } from '@/api/football.js'

export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      query: {},
      asia: [],
      bs: [],
      eu: [],
      list: {},
      time: [], //折线时间
      guest: [], //折线客队
      host: [], //折线主队
      titleIndex: 0,
      baseList: [],
      typeList: ['eu', 'asia', 'bs'],
      titleTab: ['欧赔', '亚盘', '大小球']
    }
  },
  watch: {
    titleIndex(e) {
      if (this.query.type == 'basketball') {
        this.setData()
      } else {
        this.footballOddsDetail(this.query)
      }
    }
  },
  mounted() {
    console.log(this.id, this.type)
    if (this.type == 'eu') {
      this.titleIndex = 0
    } else if (this.type == 'asia') {
      this.titleIndex = 1
    } else {
      this.titleIndex = 2
    }

    this.query = this.$route.query
    // console.log(this.type)
    if (this.query.type == 'basketball') {
      this.getExponentList(this.query)
    } else {
      this.footballOddsDetail(this.query)
    }
  },
  methods: {
    // 获取篮球数据详情
    getExponentList(item) {
      getExponentList({ id: item.id })
        .then((res) => {
          this.list = res.data
          this.setData()
        })
        .catch((res) => {})
    },

    // 获取足球
    footballOddsDetail(item) {
      console.log(this.typeList[this.titleIndex])
      footballOddsDetail({ id: item.id, type: this.typeList[this.titleIndex] })
        .then((res) => {
          // this.list = res.data
          res.data.forEach((item1) => {
            // console.log(item1.company_id,item.id)
            if (item1.company_id == this.id) {
              console.log(item1)
              this.baseList = item1.list
              this.hostAndguest(item1.list)
            }
          })
          // this.setData()
        })
        .catch((res) => {})
    },
    setData() {
      let _this = this
      console.log(this.typeList[this.titleIndex])
      this.list[this.typeList[this.titleIndex]].forEach((item) => {
        if (item.company_id == this.id) {
          // 赋值给列表
          this.baseList = item.list
          // 将主队客队的数组单独导出来
          // host 主
          // early 初
          // guest 客
          // 主队
          console.log(item)
          this.hostAndguest(item.list)
          // return this.baseList = item.list
        }
      })
    },

    hostAndguest(item) {
      console.log(item)
      let host = []
      let guest = []
      let early = []
      let time = []
      for (var i = 0; i < item.length; i++) {
        time.push(item[i].date + ' ' + item[i].change_time)
        host.push(item[i].host)
        early.push(item[i].early)
        guest.push(item[i].guest)
      }
      this.host = host.reverse()
      this.early = early.reverse()
      this.guest = guest.reverse()
      this.time = time.reverse()
      this.drawLine()
      // console.log(this.host)
    },
    drawLine() {}
  }
}
</script>

<style scoped lang="scss">
.zhishu-container {
  display: flex;
}

.zhishu-container .display {
  display: flex;
  align-items: center;
  justify-content: center;
}

.zhishu-container .zhishu-main {
  position: relative;
  margin: auto auto 40px;
  width: 1200px;
}

.zhishu-container .loading-style {
  width: 100%;
  height: 400px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.zhishu-container .ant-tabs-content-holder {
  min-height: 400px;
}

.zhishu-container .ant-tabs-nav:before {
  border-bottom: 1px solid #e5e1e1;
}

.zhishu-container .ant-tabs-nav .ant-tabs-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 30px;
  margin: 20px 20px 24px 0;
  border-radius: 3px;
  border: 1px solid #ddd;
  background: #fff;
}

.zhishu-container .ant-tabs-nav .ant-tabs-tab .ant-tabs-tab-btn {
  color: #666;
}

.zhishu-container .ant-tabs-nav .ant-tabs-tab-active {
  background-color: #d8ad66;
  border: none;
}

.zhishu-container .ant-tabs-nav .ant-tabs-tab-active .ant-tabs-tab-btn {
  color: #fff;
}

.zhishu-container .ant-tabs-nav .ant-tabs-ink-bar {
  display: none;
}

.zhishu-container .title {
  position: absolute;
  width: 300px;
  height: 72px;
  top: 0;
  left: 50%;
  margin-left: -150px;
}

.zhishu-container .title,
.zhishu-container .title-info,
.zhishu-container .title-info .info-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.zhishu-container .title-info .info-wrap {
  margin-right: 30px;
  font-size: 16px;
  color: #333;
}

.zhishu-container .title-info .info-wrap:last-child {
  margin-right: 0;
}

.zhishu-container .exhibition {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72px;
  top: 0;
  right: 0;
}

.zhishu-container .exhibition-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
  font-size: 14px;
}

.zhishu-container .exhibition-info:last-child {
  margin-right: 0;
}

.zhishu-container .ant-table {
  border-radius: 4px;
  border: 1px solid #e2e2e3;
}

.zhishu-container .ant-table td,
.zhishu-container .ant-table th {
  padding: 0;
  text-align: center;
}

.zhishu-container .ant-table .ant-table-thead th {
  height: 44px;
  line-height: 44px;
  color: #333;
  background-color: #f1f3f4;
}

.zhishu-container .ant-table .ant-table-tbody tr td {
  height: 49px;
  line-height: 49px;
  color: #666;
}

.zhishu-container .ant-table .ant-table-tbody tr:nth-child(2n) td {
  background-color: #f7f7f8;
}

.zhishu-container .b-l {
  border-left: 1px solid #e2e2e3;
}

.zhishu-container .b-r {
  border-right: 1px solid #e2e2e3;
}

.zhishu-container .i-line {
  width: 28px;
  height: 6px;
  margin-right: 10px;
  border-radius: 3px;
}

.zhishu-container .i-point,
.zhishu-container .i-temp {
  width: 8px;
  height: 8px;
  margin-right: 10px;
  border-radius: 50%;
}

.zhishu-container .i-temp {
  display: inline-block;
}

.zhishu-container .bg-d8ad66 {
  background: #d8ad66;
}

.zhishu-container .bg-50e3c2 {
  background: #50e3c2;
}

.zhishu-container .bg-e30000 {
  background: #e30000;
}

.zhishu-container .bg-0071e3 {
  background: #0071e3;
}
</style>
