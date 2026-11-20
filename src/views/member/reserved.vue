<!-- 预约 -->
<template>
  <div class="personal-live-reserve-page">
    <div class="i-tabs-container">
      <div class="header-nav">
        <div class="item first-item">预约开播</div>
      </div>
      <div class="tab-pane-item" name="预约开播" style="padding: 0px 20px">
        <section class="home-search-box">
          <span class="title">直播类型：</span>
          <el-select v-model="typeS" placeholder="请选择" style="width: 140px">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span class="title title2">比赛日期：</span>
          <el-date-picker
            style="width: 140px"
            align="center"
            v-model="dateS"
            type="date"
            value-format="YYYY-MM-DD"
            @change="getTime1"
            placeholder="比赛日期"
          >
          </el-date-picker>
        </section>
        <section class="home-table-box">
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div
                  class="ant-table ant-table-middle ant-table-empty ant-table-fixed-header ant-table-scroll-horizontal"
                  style="height: 100% !important"
                >
                  <div class="ant-table-container">
                    <div class="ant-table-header" style="overflow: hidden">
                      <table style="table-layout: fixed">
                        <colgroup>
                          <col style="width: 204px" />
                          <col style="width: 164px" />
                          <col style="width: 199px" />
                          <col style="width: 30px" />
                          <col style="width: 199px" />
                          <col style="width: 120px" />
                          <col style="width: 4px" />
                        </colgroup>
                        <thead class="ant-table-thead">
                          <tr>
                            <th title="赛事名称" class="ant-table-cell ant-table-cell-ellipsis">
                              赛事名称
                            </th>
                            <th class="ant-table-cell">比赛时间</th>
                            <th
                              title="主队名称"
                              class="ant-table-cell ant-table-cell-ellipsis"
                              style="padding-right: 5px"
                            >
                              主队名称
                            </th>
                            <th class="ant-table-cell"></th>
                            <th
                              title="客队名称"
                              class="ant-table-cell ant-table-cell-ellipsis"
                              style="padding-left: 5px"
                            >
                              客队名称
                            </th>
                            <th class="ant-table-cell">操作</th>
                            <th class="ant-table-cell ant-table-cell-scrollbar"></th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                    <div class="ant-table-body" style="overflow: auto scroll; max-height: 330px">
                      <table style="width: 870px; min-width: 100%; table-layout: fixed">
                        <colgroup>
                          <col style="width: 204px" />
                          <col style="width: 164px" />
                          <col />
                          <col style="width: 30px" />
                          <col />
                          <col style="width: 120px" />
                        </colgroup>
                        <tbody class="ant-table-tbody">
                          <tr
                            aria-hidden="true"
                            class="ant-table-measure-row"
                            style="height: 0px; font-size: 0px"
                          >
                            <td style="padding: 0px; border: 0px; height: 0px">
                              <div style="height: 0px; overflow: hidden">&nbsp;</div>
                            </td>
                            <td style="padding: 0px; border: 0px; height: 0px">
                              <div style="height: 0px; overflow: hidden">&nbsp;</div>
                            </td>
                            <td style="padding: 0px; border: 0px; height: 0px">
                              <div style="height: 0px; overflow: hidden">&nbsp;</div>
                            </td>
                            <td style="padding: 0px; border: 0px; height: 0px">
                              <div style="height: 0px; overflow: hidden">&nbsp;</div>
                            </td>
                            <td style="padding: 0px; border: 0px; height: 0px">
                              <div style="height: 0px; overflow: hidden">&nbsp;</div>
                            </td>
                            <td style="padding: 0px; border: 0px; height: 0px">
                              <div style="height: 0px; overflow: hidden">&nbsp;</div>
                            </td>
                          </tr>
                          <tr
                            data-row-key="0.3428576777645791"
                            v-for="(item, index) in list"
                            :key="index"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div class="leagueName-box">
                                <img
                                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA2CAYAAACbZ/oUAAAAAXNSR0IArs4c6QAABSZJREFUaAXtWl1oHFUUPufOJI0/EcUg2jeVbbroY1ErTbJWW4xIU32zCBaaJ/FJKAXFZFpRKH2ygohNoKLogw+6RVBMbbcJGpG+yibdqm+tDxVEra3Jzr2eM5szO7sbZme3M8PY7MDuuffc8/fd/3tnAHpPrwZuqhpAQWOMweHpwiSAPgCID1H+dimLkyrb3rE8dfY7trnFKeww2l2I077YQsS/wZifANTs8uHSDOUNlyn+y781ct+wM3bagP6AuI8mBZZ9pfUwBg8LYWJsjJF9K25ZdwU/JrozrWDS9sPY1jCizd3YwM0LViqXQTNW6tI0ZjfMow8onqA2DF7CymM4kdk4i5XIWL1ZOovBJRVTD3BSNZsVu70WzkpLJBVH6i2stHEFjAVQlXRaNHHAvIlHBSfQUs9YA/1DZaf0g4DjNPO4zJPhDX/CD+amRrxTRNx+EGGFwB6DW+48unzo1F9R7A8f3TMI1/44ROvlQWOgP4pOpzIJAcYK9MFE5Y35cqcBsXzuzdE8rEIRwOS60Q/TiR0wtep5tanv6aXXvv1dHDuOoz7BsxNg9HN0ONtOJ1PvqGYQLtMxdRFQfb7PPFEkOS06W99+8m797+rX1NrbhBcHjRUwdeNLVj9sK7++cFmC2+qMPq41zNCJLC+89SgClpWCySVn/nsp5zOsuwLnqXtvFt6N0lgnLUup/UGwOWdkvzZwrh1YBsEyLLtlavQlAcW22Kbk46ChgKnWi3wloyzYy60X7hDnytPn5kQmf3hsF2icoS5pC68dZVmaQWc93TXhmk307a5ng2PjGDlWjnk9GeGFAh5Q6hW+f1qeXiiiweOitB61LHxX+AWnMOBq/T61Gy21nT7GYt3x4+ObRDNoW3hBiqje4Rg5Vo45WNacDgXcN2AHlhP8s1nZzyP8c6+pt8IlrSdo3D3gl3eYYN2fr1zdK2p3Dd5zGsiH5FuoBj/OxphbJGuXeK3szjg065ZLTum6r4XmWT/dbSJgY/HVz66xj25NBfVCWzgoGJY2gI3j28D9YfKRyppstPiIZKRVKBbArWazy4kFMIJpXCcRfr1hyE02Wnx06SAWwLRjyvPM7Mdg8Es/3W0iYINts49uTQX1QgGvXq8O1oXNHfV0U8rArb+h2SXczUoVaW38RfKdUtZ9cOi2L0TPs00+JN9CFfhxNsbcIgmhW0texNG2joGpDhkN74Vv8XCucmR+t7jgzUPVNV91vhaja1s4HtzE5KZGvyE7foWKD6G88aDj5cuA9hVTdQ/Srm1CypppKOBm4XZ521K7GwKlrSVtWE5E3W3RwaNKe8zJC0fmPxRftYrTBDieJ7RLd+qCdkgn5aUV61achZMKYYwPBu1ssQzLNoDlwwPZbKfbSXmsgLnL00urU3y0kyD49LNP7XyYbjWep273Eb3puEjgrvLPSxOPy1gmeFJiG2wrfBiJl+g01i5dd4sVVGrPBae0VOdFT/2vLgAEFk0kG+mKR2AD9Vq6mEPzKd9qqD77x+BNCEt5Nxur1Uf4NgQMvkATXKLvuhLq0nXAzSlbWdvl5jLvFB6ranexWSbJfKyTVpRAtUL/jEwX1JEvB6LYjiKTOuAoQSUp0wOcZO1mwXavhbPQCknGoLx1MkkPGbLNWFXt87wMRZVkKPQpIo1hNZukj2zZVrNq7cPLM9kKLP5oqDufYaw8ho3Vb15kRvxusmGRsa1hrL334ZdWtGl/Ko3Ph9OqAgJZ/3zYqX8+nJb/np9eDaRUA/8B2jj4vnX5dqwAAAAASUVORK5CYII="
                                /><span>{{ item.name }}</span>
                              </div>
                            </td>
                            <td class="ant-table-cell">{{ item.match_time }}</td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              {{ item.home_name }}
                            </td>
                            <td class="ant-table-cell">-</td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              {{ item.away_name }}
                            </td>
                            <td
                              class="ant-table-cell"
                              style="cursor: pointer"
                              @click="deleteReserveLive(item)"
                            >
                              删除
                            </td>
                          </tr>
                          <tr class="ant-table-placeholder" v-if="list.length == 0">
                            <td colspan="6" class="ant-table-cell">
                              <div
                                class="ant-table-expanded-row-fixed"
                                style="width: 916px; position: sticky; left: 0px; overflow: hidden"
                              >
                                <div class="common-empty-view">
                                  <DfEmpty />
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div class="pagination_box">
          <el-pagination
            v-if="list.length !== 0"
            background
            v-model:current-page="page"
            layout="prev, pager, next"
            :page-size="detail.per_page"
            :pager-count="5"
            :total="detail.total"
          />
        </div>

        <section class="home-btn-box">
          <button
            class="i-button i-primary-image-button"
            style="
              background-image: linear-gradient(106deg, rgb(238, 207, 181), rgb(216, 173, 102));
            "
            @click="dialogVisible = true"
          >
            添加预约
          </button>
        </section>
      </div>
    </div>
    <el-dialog :center="true" :show-close="false" width="60%" v-model="dialogVisible">
      <div class="ant-modal-content">
        <div class="ant-modal-body">
          <div class="personal-live-reserve-add-modal">
            <section class="search-box">
              <form class="ant-form ant-form-inline flex flex-start">
                <div class="ant-row ant-form-item ant-form-item-has-success" style="row-gap: 0px">
                  <div class="ant-col ant-form-item-label">
                    <label for="sportTypes" class="ant-form-item-required" title="直播类型"
                      >直播类型</label
                    >
                  </div>
                  <el-select v-model="value" placeholder="请选择" style="width: 140px">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="ant-row ant-form-item ant-form-item-has-success" style="row-gap: 0px">
                  <div class="ant-col ant-form-item-label">
                    <label for="matchTime" class="ant-form-item-required" title="比赛日期"
                      >比赛日期</label
                    >
                  </div>
                  <!-- <div  > -->
                  <!-- 添加align="center"以解決console的報錯 -->
                  <el-date-picker
                    style="width: 140px"
                    v-model="value1"
                    type="date"
                    value-format="YYYY-MM-DD"
                    align="center"
                    placeholder="比赛日期"
                  >
                  </el-date-picker>
                </div>
                <div class="ant-row ant-form-item" style="row-gap: 0px">
                  <div class="ant-col ant-form-item-control">
                    <div class="ant-form-item-control-input">
                      <div class="ant-form-item-control-input-content">
                        <div
                          class="ant-btn ant-btn-lg submit"
                          style="float: right; padding: 0 14px; line-height: 40px; cursor: pointer"
                          @click="setSchedule()"
                        >
                          <span>查 询</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </section>
            <section class="table-box">
              <div class="ant-table-wrapper">
                <div class="ant-spin-nested-loading">
                  <div class="ant-spin-container">
                    <div
                      class="ant-table ant-table-middle ant-table-fixed-header ant-table-scroll-horizontal"
                    >
                      <div class="ant-table-container" style="overflow: auto scroll">
                        <div class="ant-table-header">
                          <table style="table-layout: fixed; width: 100%">
                            <colgroup>
                              <col style="width: 200px" />
                              <col style="width: 143.993px" />
                              <col style="width: 143px" />
                              <col style="width: 30px" />
                              <col style="width: 143.993px" />
                              <col style="width: 143px" />
                            </colgroup>
                            <thead class="ant-table-thead">
                              <tr>
                                <th title="赛事名称" class="ant-table-cell ant-table-cell-ellipsis">
                                  赛事名称
                                </th>
                                <th class="ant-table-cell">比赛时间</th>
                                <th
                                  title="主队名称"
                                  class="ant-table-cell ant-table-cell-ellipsis"
                                  style="padding-right: 5px"
                                >
                                  主队名称
                                </th>
                                <th class="ant-table-cell"></th>
                                <th
                                  title="客队名称"
                                  class="ant-table-cell ant-table-cell-ellipsis"
                                  style="padding-left: 5px"
                                >
                                  客队名称
                                </th>
                                <th class="ant-table-cell ant-table-cell-ellipsis">预约比赛</th>
                              </tr>
                            </thead>
                          </table>
                        </div>
                        <div class="ant-table-body" style="max-height: 500px">
                          <table style="width: fit-content; min-width: 100%; table-layout: fixed">
                            <colgroup>
                              <col style="width: 200px" />
                              <col style="width: 143.993px" />
                              <col style="width: 143px" />
                              <col style="width: 30px" />
                              <col style="width: 143.993px" />
                              <col style="width: 143px" />
                            </colgroup>
                            <tbody class="ant-table-tbody">
                              <tr
                                aria-hidden="true"
                                class="ant-table-measure-row"
                                style="height: 0px; font-size: 0px"
                              >
                                <td style="padding: 0px; border: 0px; height: 0px">
                                  <div style="height: 0px; overflow: hidden">&nbsp;</div>
                                </td>
                                <td style="padding: 0px; border: 0px; height: 0px">
                                  <div style="height: 0px; overflow: hidden">&nbsp;</div>
                                </td>
                                <td style="padding: 0px; border: 0px; height: 0px">
                                  <div style="height: 0px; overflow: hidden">&nbsp;</div>
                                </td>
                                <td style="padding: 0px; border: 0px; height: 0px">
                                  <div style="height: 0px; overflow: hidden">&nbsp;</div>
                                </td>
                                <td style="padding: 0px; border: 0px; height: 0px">
                                  <div style="height: 0px; overflow: hidden">&nbsp;</div>
                                </td>
                              </tr>

                              <tr
                                v-for="(item, index) in baseList"
                                :key="index"
                                class="ant-table-row ant-table-row-level-0"
                              >
                                <td class="ant-table-cell ant-table-cell-ellipsis">
                                  <div class="leagueName-box">
                                    <img
                                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA2CAYAAACbZ/oUAAAAAXNSR0IArs4c6QAABNtJREFUaAXtml9oHEUcx2fmbntH26CkUlAqacUzl0uKNk/VvqkVfLi9a0vRh75INYVqi5Qi4h+MQtEn/1AQDE19qVI5ku7uiQ8W9EEfipJEEC8XU2qCsSktkVJtTHJ3O37n7G0nZ+Guezu3m2sGwv72N7vz+31mfjPzm70QslpWe6CleoBWaDjnNJ9KPc8J2Q9dN+F8faVuRV4p/Rt+/wLAwbhpnqCUAo2QMnBu9+57abF4CtCPr0i4Gk4D9hseDu9LDA/PMjGyrQwr+kIM5A1GSsd1/QUoBmp0UktUY6T72I052xJAtSAEK8ND3bUebKH6brbiV+PbGQ3sPGKE76iiEngei8Q58t9+GJhOVQIM0N8i0WhXl2U9qnV03MMofRPgS0GgprlkspyBeOkMgA8AdtlWN5lKJYqcD2IL3O6lrdttS80Ic36+2pGYaebivb07CGNHUDdfXd+seyXACN9bRg3t77cTpvlBeM2arYiCb5sFKdtRAyxZyOn6zolU6hlJRR4aGrqAhP4JEfpI5q/Jdapl5cAA2FCy7dNIYc28rt9XAQIsF/OcRaMJyF9W9KqvzQAuM2Cx0hHnuXwyKY6fTunMZP4AeBIr+T6AzzkVioSmAQv/AX2XTcgJhPlZgG+RmeKW9Vk4EumC7gtZ77XcVGDHec6fBPjP+OBwmPf3Oz7EMpkriWz2WSjSGO1Z53kPBceYh23W29Q627Y/yo+OfjexZ09cfimezZpRxhJY7U/Kei9kP4HL/iPMH7OXln4aTyZfw2iHK1BbDONqwrL2A/opjPbFir7Rq+/AAgCLWQR/x8ZHR3/4NZ1+RIYC9FmmaWILK8l6t3IggB3nOd9WLJV+xNx+3dFB6BwayiMSRmSdWzlYwKBAIvJ9iNLT1UAY4Y3VOjf3zpxx87KX75QzLsZeiRvGAOAQ4TdLeX5zvvmmxr0UFOCvwpp2IDY8PINFyqERn49JofAx6NOOskHBV2CM5BzwXkbScaqaA/P4ObtYfB/6u6vrGrn3DRiwGS0UeunBM2cuywDj6fRmYtsD2KN3ynqv5KYDA3SWMXaw0zAMGUJkXPmRkRd5qfQu9OvkOi/lpgIjfD9FBnVEJBUyBE5Rnci4BjFXd8h6FXKzgKdpKNTXZRhfyxAis8qPjR3ltv0WYKNynSpZOTBl7NwGTevZmMmIX/OcMrFr18MI4ZMA7XWUTRCUA2NUp2SOyUOHIoXp6TdKxeKr0Cu3L9sWsiqDbdWGxD2+kG4vTE2JE5A49/pSlADjrPs0aKwK0cW+vrXXLl06hvA9jJzY13RWzXdpcQCi9J0QYwb20x5Avg3YByod4OdVCbCfQLVs+xpetZxTUX/nASP7WVDRk0FsU7Ay/EvLhSA6p8InwcpAnVHReBDbFKws2t7+Hk4wE0F00EufBGOZVTQ6qevbCoSY+Gngfi+NBKYtSn/XCEnFLGusvEoLQWtr68GQfwInrwfG0cYduS6YBJtgFM3hfnkRyX1xZqYDo33LfHj50wG+o/Sv8KZN07HjxxcD7OWqa573wP9Cul4Ll/fuXf/n4mIah4K19b7jxXNweL49EjGqPyjU27br4+HcwsLngE3Wa8ir52CTwHYWF91Nm65zaWQtvh3iG7HtGhjn3Q+xmf/jppcbeadsE7bdtvEvUTWIm7J2kyAAAAAASUVORK5CYII="
                                    />
                                    <span v-if="item">
                                      {{
                                        item.match_type == 1
                                          ? item.competition_name_zh
                                          : item.match_type == 2
                                          ? item.short_name_zh
                                          : item.series_name_zh
                                      }}
                                    </span>
                                  </div>
                                </td>
                                <td class="ant-table-cell">
                                  {{
                                    item.match_type == 1 || item.match_type == 3
                                      ? $common.timeStamp1(item.time)
                                      : $common.timeStamp1(item.match_times)
                                  }}
                                </td>
                                <td class="ant-table-cell ant-table-cell-ellipsis">
                                  {{
                                    item.match_type == 1 || item.match_type == 3
                                      ? item.home_team_name_zh
                                      : item.home_team_data.short_name_zh
                                  }}
                                </td>
                                <td class="ant-table-cell">-</td>
                                <td class="ant-table-cell ant-table-cell-ellipsis">
                                  {{
                                    item.match_type == 1 || item.match_type == 3
                                      ? item.away_team_name_zh
                                      : item.away_team_data.short_name_zh
                                  }}
                                </td>
                                <td class="ant-table-cell ant-table-cell-ellipsis">
                                  <span @click="reserveMatch(item)" class="yuyue">预约</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div class="page-box">
              <el-pagination
                background
                @current-change="changePageSize"
                layout="prev, pager, next"
                :page-size="pageSize"
                :pager-count="5"
                :total="liveTotal"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteReserveLive, getReserveLiveList, setReserveLive } from '../../api/user.js'
import { getList } from '../../api/basketball.js'
import { football_match } from '../../api/football.js'
import { getGameList } from '@/api/game.js'
export default {
  data() {
    return {
      list: [], //预约列表
      detail: {},
      value1: '', //时间选择器
      options: [
        {
          value: 1,
          label: '足球'
        },
        {
          value: 2,
          label: '篮球'
        },
        {
          value: 3,
          label: '电竞'
        }
      ],
      options1: [
        {
          value: -1,
          label: '全部'
        },
        {
          value: 0,
          label: '足球'
        },
        {
          value: 1,
          label: '篮球'
        },
        {
          value: 3,
          label: '电竞'
        }
      ],
      typeS: -1,
      dateS: '',
      value: 1,
      dialogVisible: false,
      page: 1,
      pageRecord: 1, // 这个是获预约记录的page
      baseList: [],
      liveTotal: 0, // 赛事列表总条数
      pageSize: 20 // 赛事列表每页条数
    }
  },
  mounted() {
    this.value1 = this.getCurrentDate()
    this.getUserReserveLiveList()
  },
  watch: {
    typeS() {
      this.page = 1
      this.getUserReserveLiveList()
    },
    dialogVisible(cur) {
      if (cur) {
        this.setSchedule()
      }
    },
    page() {
      this.getUserReserveLiveList()
    }
  },
  methods: {
    getCurrentDate() {
      const date = new Date()
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()
      let currentDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      return currentDate
    },
    // 删除预约直播
    deleteReserveLive(item) {
      deleteReserveLive({ id: item.id })
        .then((res) => {
          this.getUserReserveLiveList()
          this.$message.success('删除成功')
        })
        .catch((res) => {})
    },

    changePageSize(e) {
      this.pageRecord = e
      if (this.value == 1) {
        this.football_match()
      } else if (this.value == 2) {
        this.getList()
      } else {
        this.getGameList()
      }
    },

    // 切换搜索赛程列表
    setSchedule() {
      this.liveTotal = 0
      this.baseList = []
      this.changePageSize(1)
    },
    // 预约比赛
    reserveMatch(item) {
      setReserveLive({
        type: this.value == 3 ? 3 : this.value - 1,
        match_id: item.id
      })
        .then((res) => {
          this.getUserReserveLiveList()
          this.$message.success('预约成功')
        })
        .catch((res) => {})
    },

    // 获取篮球赛程列表
    getList() {
      let data = {
        type: 2,
        page: this.pageRecord,
        time: this.value1
      }
      getList(data)
        .then((res) => {
          const { total, per_page, data } = res.data
          data.forEach((el) => {
            el.match_type = 2
          })
          this.baseList = data || []
          this.liveTotal = total || 0
          this.pageSize = per_page
        })
        .catch((res) => {})
    },
    // 选择日期
    getTime1() {
      // 选择日期
      this.page = 1
      this.getUserReserveLiveList()
    },
    // 获取足球赛程列表
    football_match() {
      let data = {
        type: 2,
        page: this.pageRecord,
        time: this.value1
      }
      football_match(data)
        .then((res) => {
          const { total, per_page, data } = res.data
          data.forEach((el) => {
            el.match_type = 1
          })
          this.baseList = data || []
          this.liveTotal = total || 0
          this.pageSize = per_page
        })
        .catch((res) => {})
    },
    // 获取電競赛程
    getGameList() {
      let data = {
        type: 2,
        page: this.pageRecord,
        time: this.value1
      }
      getGameList(data).then((res) => {
        const { total, per_page, data } = res.data
        data.forEach((el) => {
          el.match_type = 3
          el.time = el.match_time
        })
        this.baseList = data || []
        this.liveTotal = total || 0
        this.pageSize = per_page
      })
    },
    // 获取预约直播列表
    getUserReserveLiveList() {
      let data = {
        page: this.page,
        time: this.dateS,
        type: this.typeS
      }
      getReserveLiveList(data).then((res) => {
        this.list = res.data.data
        res.data.data = []
        this.detail = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination_box {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.personal-live-reserve-add-modal .ant-table {
  height: 345px !important;
  overflow: hidden;
}

.personal-live-reserve-add-modal .ant-modal-content {
  border-radius: 6px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
  background-color: #fff;
}

.personal-live-reserve-add-modal .ant-modal-content .ant-modal-body {
  padding: 50px 30px 30px;
}

.personal-live-reserve-add-modal .search-box {
  width: 100%;
  padding-bottom: 18px;
}

.personal-live-reserve-add-modal .search-box .ant-form-inline .ant-form-item {
  flex: auto;
  margin-right: 0;
  padding-top: 10px;
}

.personal-live-reserve-add-modal .search-box .ant-select-item-option {
  padding: 7px 12px;
}

.personal-live-reserve-add-modal .search-box .ant-select-item-option-active {
  background-color: #fdf3ec;
  color: #b08a5b;
}

.personal-live-reserve-add-modal .search-box .ant-form-item-label > label {
  height: 40px;
  color: #333;
  font-size: 14px;
}

.personal-live-reserve-add-modal .search-box .submit {
  text-align: center;
  width: 104px;
  font-size: 14px;
  color: #b08a5b;
  border: none;
  height: 40px;
  border-radius: 4px;
  background-image: linear-gradient(270deg, #eedac1, #faefe2 0);
}

.personal-live-reserve-add-modal .table-box .ant-table-body {
  max-height: 500px !important;
  overflow: auto !important;
}

.personal-live-reserve-add-modal .table-box .ant-table-body::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.personal-live-reserve-add-modal .table-box .ant-table-body::-webkit-scrollbar-thumb {
  width: 4px;
  height: 4px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.09);
}

.personal-live-reserve-add-modal .table-box .ant-table-body::-webkit-scrollbar-track {
  background: #fff;
  width: 4px;
  height: 4px;
}

.personal-live-reserve-add-modal .table-box tr td:nth-child(0),
.personal-live-reserve-add-modal .table-box tr th:nth-child(0) {
  text-align: left;
}

.personal-live-reserve-add-modal .table-box tr th:first-child {
  text-align: center;
}

.personal-live-reserve-add-modal .table-box tr td:first-child .leagueName-box span {
  text-align: left;
}

.personal-live-reserve-add-modal .table-box tr td:nth-child(2),
.personal-live-reserve-add-modal .table-box tr th:nth-child(2) {
  text-align: center;
}

.personal-live-reserve-add-modal .table-box tr td:nth-child(3),
.personal-live-reserve-add-modal .table-box tr th:nth-child(3) {
  text-align: right;
}

.personal-live-reserve-add-modal .table-box tr td:nth-child(4),
.personal-live-reserve-add-modal .table-box tr td:nth-child(6),
.personal-live-reserve-add-modal .table-box tr td:nth-child(7),
.personal-live-reserve-add-modal .table-box tr td:nth-child(8),
.personal-live-reserve-add-modal .table-box tr th:nth-child(4),
.personal-live-reserve-add-modal .table-box tr th:nth-child(6),
.personal-live-reserve-add-modal .table-box tr th:nth-child(7),
.personal-live-reserve-add-modal .table-box tr th:nth-child(8) {
  text-align: center;
}

.personal-live-reserve-add-modal .table-box .ant-table-thead tr {
  width: 920px;
}

.personal-live-reserve-add-modal .table-box .ant-table-thead tr th {
  background-color: #eee;
  color: #666;
  font-size: 14px;
}

.personal-live-reserve-add-modal .table-box .ant-table.ant-table-middle .ant-table-footer,
.personal-live-reserve-add-modal .table-box .ant-table.ant-table-middle .ant-table-tbody > tr > td,
.personal-live-reserve-add-modal .table-box .ant-table.ant-table-middle .ant-table-thead > tr > th,
.personal-live-reserve-add-modal .table-box .ant-table.ant-table-middle .ant-table-title,
.personal-live-reserve-add-modal .table-box .ant-table.ant-table-middle tfoot > tr > td,
.personal-live-reserve-add-modal .table-box .ant-table.ant-table-middle tfoot > tr > th {
  padding: 10px 0;
}

.personal-live-reserve-add-modal .table-box .ant-table-tbody .ant-table-row {
  height: 44px;
}

.personal-live-reserve-add-modal .table-box .ant-table-tbody .ant-table-row td {
  color: #333;
  font-size: 14px;
  border: none !important;
}

.personal-live-reserve-add-modal .table-box .ant-table-tbody .ant-table-row td .leagueName-box {
  padding-left: 20px;
}

.personal-live-reserve-add-modal
  .table-box
  .ant-table-tbody
  .ant-table-row
  td
  .leagueName-box
  span {
  width: 110px;
}

.personal-live-reserve-add-modal .table-box .ant-table-tbody .ant-table-row:hover td {
  background-color: #fdf3ec !important;
  color: #b08a5b;
}

.personal-live-reserve-add-modal
  .table-box
  .ant-table-tbody
  .ant-table-row:hover
  td
  .leagueName-box
  span {
  color: #b08a5b;
}

.personal-live-reserve-add-modal .table-box .ant-table-tbody tr:nth-child(odd) td {
  background-color: #f8f8f8;
}

.personal-live-reserve-add-modal .table-box .ant-table-tbody tr td:nth-child(2) {
  color: #999;
}

.personal-live-reserve-add-modal .leagueName-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.personal-live-reserve-add-modal .leagueName-box img {
  width: 20px;
  height: 17px;
}

.personal-live-reserve-add-modal .leagueName-box span {
  color: #333;
  font-size: 14px;
  margin-left: 20px;
  width: 150px;
  display: inline-block;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}

.personal-live-reserve-add-modal .yuyue {
  border-radius: 4px;
  border: 1px solid #d8ad66;
  text-align: center;
  color: #d8ad66;
  font-size: 14px;
  height: 20px;
  line-height: 20px;
  cursor: pointer;
  width: 60px;
  display: inline-block;
}

.personal-live-reserve-add-modal .yuyue:hover {
  background-color: hsla(31, 53%, 70%, 0.1);
}

.personal-live-reserve-add-modal .yiyuyue {
  border-radius: 4px;
  box-shadow: 0 0 15px 0 rgba(176, 138, 91, 0.1);
  background-color: #e7e7e7;
  text-align: center;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  color: #b8b8b8;
  width: 60px;
  display: inline-block;
  border: none;
  cursor: not-allowed;
}

.personal-live-reserve-add-modal .yiyuyue:hover {
  background-color: #e7e7e7;
}

.personal-live-reserve-add-modal .confirm-box {
  width: 360px;
  height: 162px;
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
  background-color: #fff;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
// 弹窗分页
.personal-live-reserve-add-modal .page-box {
  padding-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.personal-live-reserve-add-modal .confirm-box img.close {
  position: absolute;
  top: 15px;
  right: 18px;
  height: 20px;
  width: 20px;
  cursor: pointer;
}

.personal-live-reserve-add-modal .confirm-box .content-box {
  color: #333;
  font-size: 14px;
  text-align: center;
}

.personal-live-reserve-add-modal .confirm-box .btn-box {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.personal-live-reserve-add-modal .confirm-box .btn-box button {
  font-size: 16px;
  text-align: center;
  width: 130px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  outline: none;
}

.personal-live-reserve-add-modal .confirm-box .btn-box button:first-child {
  color: #fff;
  box-shadow: 0 2px 6px 2px hsla(38, 75%, 81%, 0.55);
  background-size: cover;
}

.personal-live-reserve-add-modal .confirm-box .btn-box button:nth-child(2) {
  color: #d8ad66;
  box-shadow: 0 2px 6px 2px hsla(38, 75%, 81%, 0.2);
  border: 1px solid #d8ad66;
  margin-left: 20px;
  background: #fff;
}

.personal-live-reserve-add-modal .ant-select-selector {
  border-radius: 4px !important;
}

.personal-live-reserve-add-modal .ant-table-body {
  height: 500px !important;
}

.personal-live-reserve-add-modal .ant-table-tbody:hover {
  background-color: none;
}

.personal-live-reserve-add-modal .ant-empty-image,
.personal-live-reserve-add-modal .anticon-close,
.personal-live-reserve-add-modal .anticon-down {
  display: none;
}

.personal-live-reserve-add-modal .ant-modal-close-x {
  width: 50px;
  height: 50px;
}

.personal-live-reserve-add-modal .ant-modal-close-x:after {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAmJJREFUWAntmMtOAjEYhZmBhGfQREncswES8JlEwCcRNT6MJq414bJhqwt14TOQEPAcnD+UmbYzbSeupgm20/6Xr6edZmqtVpVKgUoBPwV2u119sVgMlstlyy9Cvtd8Pj/Hr89cJutYNwCHGGBPqF+32+072tc6u5A+TP4K/h/4vSH+swky0iXhrOiojkVRdNPtdqdqn28b8UfwvVP9Ef8S8Y9yclyrIPp/8NvQQApmeItZT+TZt9bBIdYGgMyZKVrAXq/3BYcMTCgk4MYgOFKORFydTqfzmaHjmK5T+rj3sAfv5VmpJ5hEJpEynmkalKOdNZZWQYmOWT2gzVmnyzRRI92vfTYpB2MrHINZFZRsvrOnfwKne7ly4ehfCDBJlHnz2I9iTBQKx+CFAWnsomQZcM6ARSHLgvMCzIPkOIr3nvtzP/x1WuKDm3W5VTNpG/epGJhq6zFjcmI/zkGej5nDXOPjDcdY3goKiGW/0SQIjgG8FaTzf5QgBXPUE/4gFb0BC8IFQ3oBWuDkpSntmHHeg8k3oREg+coRUFGQtdMHhjg6KUg4fhOKs1Jn9plF5XFyRCnu5mZhQAucMWEZkIUAfeBEk1DIXMAQuDIgrYBlwIVCGgEt9xHjnhMYU21ablyahrhyPur8tICAa/HCDodGyskbTuIYVmXTbDYv2u32t9hJrT0HcZScwOAILo7jkcvxIAnSNS//vGam+hvr9fo01bd/1ALiNjdDkJfEgZfqYXLD08Vw7iMkJwzH/T8HmAt9M6dAULGOPdNfrVZnTo4OxtxKWPIBczm4VaaVApUCqgK/Ntc/QjrEvxYAAAAASUVORK5CYII=);
  background-size: cover;
}

.personal-live-reserve-add-modal .ant-select-arrow {
  margin-top: -8px;
  width: 16px;
  height: 16px;
}

.personal-live-reserve-add-modal .ant-select-arrow:after {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTTAgMEgxNlYxNkgweiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiM5OTkiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTguNDk1IDEwLjc0NGMtLjE0LjE1LS4zMy4yOTEtLjUxLjI0OC0uMTguMDMyLS4zNS0uMTE5LS40OS0uMjQ4bC00LjMzLTQuNzAxYy0uMjItLjIzOC0uMjItLjYyNyAwLS44NjUuMjItLjIzNy41OC0uMjM3LjggMGw0LjAzIDQuNDc0IDQuMDQtNC40NzRjLjIyLS4yMzcuNTgtLjIzNy44IDAgLjIyLjIzOC4yMi42MjcgMCAuODY1bC00LjM0IDQuN3oiLz4KICAgIDwvZz4KPC9zdmc+Cg==);
  background-size: cover;
}

.personal-live-reserve-add-modal .ant-input:focus,
.personal-live-reserve-add-modal .ant-picker.ant-picker-focused,
.personal-live-reserve-add-modal .ant-select-focused .ant-select-selector {
  border-color: #e6c891 !important;
}

.personal-live-reserve-add-modal .ant-table-placeholder td {
  background-color: #fff !important;
  border: none;
}

.personal-live-reserve-add-modal .ant-empty-normal:before {
  content: '';
  display: inline-block;
  width: 300px;
  height: 240px;
  background-image: url(/static/images/theme/no_data.png);
  background-size: cover;
  margin-top: 70px;
}

.personal-live-reserve-add-modal .ant-empty-description {
  margin-top: -70px;
  font-size: 16px;
}

.personal-live-reserve-add-modal .ant-input,
.personal-live-reserve-add-modal .ant-picker,
.personal-live-reserve-add-modal .ant-select-selector {
  border: 1px solid #d6dfea !important;
  height: 40px;
}

.personal-live-reserve-add-modal .ant-input::placeholder,
.personal-live-reserve-add-modal .ant-picker::placeholder,
.personal-live-reserve-add-modal .ant-select-selector::placeholder {
  color: #999;
}

.personal-live-reserve-add-modal .ant-select-selection-placeholder {
  color: #999;
}

.personal-live-reserve-add-modal .ant-input {
  background: rgba(214, 223, 234, 0.2);
}

.personal-live-reserve-add-modal .ant-picker-input > input {
  font-size: 14px !important;
}

.personal-live-reserve-add-modal .ant-picker-input > input::placeholder {
  color: #999;
}

.personal-live-reserve-add-modal .ant-switch {
  width: 42px;
  height: 20px;
  border-radius: 4px;
  background-color: #d6dfea;
}

.personal-live-reserve-add-modal .ant-switch-checked .ant-switch-inner {
  margin: -1px 25px 0 7px;
}

.personal-live-reserve-add-modal .ant-switch-checked {
  background-color: #d8ad66;
}

.personal-live-reserve-add-modal .ant-switch-checked .ant-switch-handle:before {
  box-shadow: 0 1px 4px 0 rgba(219, 137, 0, 0.2);
}

.personal-live-reserve-add-modal .ant-switch-handle:before {
  box-shadow: none;
}

.personal-live-reserve-add-modal .ant-switch-handle {
  width: 14px;
  height: 14px;
  margin: 1px 0 1px 4px;
  border-radius: 50%;
}

.personal-live-reserve-add-modal .ant-switch-checked .ant-switch-handle {
  left: calc(100% - 18px - 5px);
}

.personal-live-reserve-add-modal .ant-switch-inner {
  margin: -1px 7px 0 25px;
}

.personal-live-reserve-page .home-search-box {
  height: 80px;
  background: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
}

.personal-live-reserve-page .home-search-box .ant-select-item-option {
  padding: 7px 12px;
}

.personal-live-reserve-page .home-search-box .ant-select-item-option-active {
  background-color: #fdf3ec;
  color: #b08a5b;
}

.personal-live-reserve-page .home-search-box .ant-form-item-label > label {
  height: 40px;
  color: #333;
  font-size: 14px;
}

.personal-live-reserve-page .home-search-box .title {
  color: #333;
  font-size: 14px;
}

.personal-live-reserve-page .home-search-box .title2 {
  margin-left: 13px;
}

.personal-live-reserve-page .home-table-box .ant-table-body::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.personal-live-reserve-page .home-table-box .ant-table-body::-webkit-scrollbar-thumb {
  width: 4px;
  height: 4px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.09);
}

.personal-live-reserve-page .home-table-box .ant-table-body::-webkit-scrollbar-track {
  background: #fff;
  width: 4px;
  height: 4px;
}

.personal-live-reserve-page .home-table-box tbody tr:hover td {
  background-color: #fdf3ec;
  color: #b08a5b;
}

.personal-live-reserve-page .home-table-box tbody tr:hover td span {
  color: #b08a5b;
}

.personal-live-reserve-page .home-table-box tr th:first-child {
  text-align: center;
}

.personal-live-reserve-page .home-table-box tr td:first-child .leagueName-box span {
  text-align: left;
}

.personal-live-reserve-page .home-table-box tr td:nth-child(2),
.personal-live-reserve-page .home-table-box tr th:nth-child(2) {
  text-align: center;
}

.personal-live-reserve-page .home-table-box tr td:nth-child(3),
.personal-live-reserve-page .home-table-box tr th:nth-child(3) {
  text-align: right;
}

.personal-live-reserve-page .home-table-box tr td:nth-child(4),
.personal-live-reserve-page .home-table-box tr td:nth-child(6),
.personal-live-reserve-page .home-table-box tr th:nth-child(4),
.personal-live-reserve-page .home-table-box tr th:nth-child(6) {
  text-align: center;
}

.personal-live-reserve-page .home-table-box .ant-table-thead tr {
  width: 920px;
}

.personal-live-reserve-page .home-table-box .ant-table-thead tr th {
  background-color: #eee;
  color: #666;
  font-size: 14px;
}

.personal-live-reserve-page .home-table-box .ant-table-thead tr th.ant-table-cell-scrollbar {
  display: none;
}

.personal-live-reserve-page .home-table-box tr {
  height: 44px;
}

.personal-live-reserve-page .home-table-box tr td {
  color: #333;
  font-size: 14px;
  border: none !important;
}

.personal-live-reserve-page .home-table-box tr td .leagueName-box {
  padding-left: 34px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.personal-live-reserve-page .home-table-box tr td .leagueName-box img {
  width: 20px;
  height: 17px;
}

.personal-live-reserve-page .home-table-box tr td .leagueName-box span {
  color: #333;
  font-size: 14px;
  margin-left: 20px;
  width: 150px;
  display: inline-block;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}

.personal-live-reserve-page .home-table-box tr:nth-child(odd) td {
  background-color: #f8f8f8;
}

.personal-live-reserve-page .home-table-box tr td:nth-child(2) {
  color: #999;
}

.personal-live-reserve-page .home-table-box .ant-table.ant-table-middle .ant-table-footer,
.personal-live-reserve-page .home-table-box .ant-table.ant-table-middle .ant-table-tbody > tr > td,
.personal-live-reserve-page .home-table-box .ant-table.ant-table-middle .ant-table-thead > tr > th,
.personal-live-reserve-page .home-table-box .ant-table.ant-table-middle .ant-table-title,
.personal-live-reserve-page .home-table-box .ant-table.ant-table-middle tfoot > tr > td,
.personal-live-reserve-page .home-table-box .ant-table.ant-table-middle tfoot > tr > th {
  padding: 10px 0;
}

.personal-live-reserve-page .home-btn-box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 38px;
  width: 920px;
}

.personal-live-reserve-page .ant-table-body {
  height: 330px !important;
}

.personal-live-reserve-page .ant-table-tbody:hover {
  background-color: #fff;
}

.personal-live-reserve-page .ant-select-selector {
  border-radius: 4px !important;
}

.personal-live-reserve-page .ant-empty-image,
.personal-live-reserve-page .anticon-down {
  display: none;
}

.personal-live-reserve-page .ant-select-arrow {
  margin-top: -8px;
  width: 16px;
  height: 16px;
}

.personal-live-reserve-page .ant-select-arrow:after {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTTAgMEgxNlYxNkgweiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiM5OTkiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTguNDk1IDEwLjc0NGMtLjE0LjE1LS4zMy4yOTEtLjUxLjI0OC0uMTguMDMyLS4zNS0uMTE5LS40OS0uMjQ4bC00LjMzLTQuNzAxYy0uMjItLjIzOC0uMjItLjYyNyAwLS44NjUuMjItLjIzNy41OC0uMjM3LjggMGw0LjAzIDQuNDc0IDQuMDQtNC40NzRjLjIyLS4yMzcuNTgtLjIzNy44IDAgLjIyLjIzOC4yMi42MjcgMCAuODY1bC00LjM0IDQuN3oiLz4KICAgIDwvZz4KPC9zdmc+Cg==);
  background-size: cover;
}

.personal-live-reserve-page .ant-table-placeholder td {
  background-color: #fff !important;
}

.personal-live-reserve-page .ant-empty-normal:before {
  content: '';
  display: inline-block;
  width: 300px;
  height: 240px;
  background-image: url(/static/images/theme/no_data.png);
  background-size: cover;
  margin-top: 20px;
}

.personal-live-reserve-page .ant-empty-description {
  margin-top: -70px;
  font-size: 16px;
}

.personal-live-reserve-page .ant-picker.ant-picker-focused,
.personal-live-reserve-page .ant-select-focused .ant-select-selector {
  border-color: #e6c891 !important;
}

.personal-live-reserve-page .ant-picker,
.personal-live-reserve-page .ant-select-selector {
  border: 1px solid #d6dfea !important;
  height: 40px;
}

.personal-live-reserve-page .ant-picker::placeholder,
.personal-live-reserve-page .ant-select-selector::placeholder {
  color: #999;
}

.personal-live-reserve-page .ant-select-selection-placeholder {
  color: #999;
}

.personal-live-reserve-page .ant-picker-input > input {
  font-size: 14px !important;
}

.personal-live-reserve-page .ant-picker-input > input::placeholder {
  color: #999;
}

.personal-live-reserve-page .home-btn-box {
  width: fit-content;
  left: 50%;
  transform: translateX(-50%);
}
.personal-live-reserve-add-modal {
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background: #dadada;
  }
}
.ant-table-container {
  position: relative;
  height: 100%;
}
.ant-table.ant-table-bordered > .ant-table-container > .ant-table-header {
  position: sticky;
  top: 0;
  z-index: 99;
}
.personal-live-reserve-add-modal .search-box .ant-form-inline .ant-form-item {
  flex: unset;
  margin-right: 36px;
}
.personal-live-reserve-add-modal .table-box .ant-table-body {
  overflow: initial !important;
}
</style>
