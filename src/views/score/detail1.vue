<template>
  <div class="basketball">
    <div class="section integral-container" style="display: none">
      <div class="title">
        <span class="title-line"></span>
        <span class="title-text">积分排名</span>
        <span class="title-line"></span>
      </div>
      <div class="basketball-integral-table-main">
        <div class="guestData" v-for="(item, index) in 2" :key="index">
          <div class="guestData-title">
            <span class="line line-0071e3"></span>
            <span class="team-name color-333">{{
              index == 1 ? list.home_team_data.short_name_zh : list.away_team_data.short_name_zh
            }}</span>
          </div>
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div class="ant-table">
                  <div class="ant-table-container">
                    <div class="ant-table-content">
                      <table style="table-layout: fixed">
                        <colgroup>
                          <col style="width: 50px" />
                          <col style="width: 55px" />
                          <col style="width: 50px" />
                          <col style="width: 50px" />
                          <col style="width: 55px" />
                          <col style="width: 55px" />
                          <col style="width: 55px" />
                          <col style="width: 70px" />
                          <col style="width: 145px" />
                        </colgroup>
                        <thead class="ant-table-thead">
                          <tr>
                            <th class="ant-table-cell">全场</th>
                            <th class="ant-table-cell">赛</th>
                            <th class="ant-table-cell">胜</th>
                            <th class="ant-table-cell">负</th>
                            <th title="得" class="ant-table-cell ant-table-cell-ellipsis">得</th>
                            <th title="失" class="ant-table-cell ant-table-cell-ellipsis">失</th>
                            <th title="净胜" class="ant-table-cell ant-table-cell-ellipsis">
                              净胜
                            </th>
                            <th title="排名" class="ant-table-cell ant-table-cell-ellipsis">
                              排名
                            </th>
                            <th title="胜率" class="ant-table-cell ant-table-cell-ellipsis">
                              胜率
                            </th>
                          </tr>
                        </thead>
                        <tbody class="ant-table-tbody">
                          <tr
                            data-row-key="0.9799075311969383"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td class="ant-table-cell">总</td>
                            <td class="ant-table-cell">
                              <div>-</div>
                            </td>
                            <td class="ant-table-cell">
                              <div>-</div>
                            </td>
                            <td class="ant-table-cell">
                              <div>-</div>
                            </td>
                            <td title="-" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>-</div>
                            </td>
                            <td title="-" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>-</div>
                            </td>
                            <td title="-" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>-</div>
                            </td>
                            <td title="-" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>-</div>
                            </td>
                            <td title="-" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>-</div>
                            </td>
                          </tr>
                          <tr
                            data-row-key="0.9290009226127316"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td class="ant-table-cell">主</td>
                            <td class="ant-table-cell">
                              <div>-</div>
                            </td>
                            <td class="ant-table-cell">
                              <div>-</div>
                            </td>
                            <td class="ant-table-cell">
                              <div>-</div>
                            </td>
                            <td title="-" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>-</div>
                            </td>
                            <td title="-" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>-</div>
                            </td>
                            <td title="-" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>-</div>
                            </td>
                            <td title="-" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>-</div>
                            </td>
                            <td title="-" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>-</div>
                            </td>
                          </tr>
                          <tr
                            data-row-key="0.4227320529464018"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td class="ant-table-cell">客</td>
                            <td class="ant-table-cell">
                              <div>-</div>
                            </td>
                            <td class="ant-table-cell">
                              <div>-</div>
                            </td>
                            <td class="ant-table-cell">
                              <div>-</div>
                            </td>
                            <td title="-" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>-</div>
                            </td>
                            <td title="-" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>-</div>
                            </td>
                            <td title="-" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>-</div>
                            </td>
                            <td title="-" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>-</div>
                            </td>
                            <td title="-" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>-</div>
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
        </div>
      </div>
    </div>
    <div class="section recent-container">
      <div class="title">
        <span class="title-line"></span>
        <span class="title-text">历史交锋</span>
        <span class="title-line"></span>
      </div>
      <div class="basketball-recent-table-main">
        <div class="header-operation">
          <div class="ant-radio-group ant-radio-group-outline">
            <el-radio v-model="radio" label="1">全场</el-radio>
            <el-radio v-model="radio" label="2">半场</el-radio>
          </div>
        </div>
        <div class="ant-table-wrapper">
          <div class="ant-spin-nested-loading">
            <div class="ant-spin-container">
              <div class="ant-table">
                <div class="ant-table-container">
                  <div class="ant-table-content">
                    <table style="table-layout: fixed">
                      <colgroup>
                        <col style="width: 140px" />
                        <col style="width: 120px" />
                        <col style="width: 110px" />
                        <col style="width: 160px" />
                        <col style="width: 110px" />
                        <col style="width: 60px" />
                        <col style="width: 60px" />
                        <col style="width: 75px" />
                        <col style="width: 72px" />
                        <col style="width: 90px" />
                        <col style="width: 100px" />
                        <col style="width: 102px" />
                      </colgroup>
                      <thead class="ant-table-thead">
                        <tr>
                          <th title="赛事" class="ant-table-cell ant-table-cell-ellipsis">赛事</th>
                          <th class="ant-table-cell">比赛日期</th>
                          <th title="客队" class="ant-table-cell ant-table-cell-ellipsis">客队</th>
                          <th
                            class="ant-table-cell"
                            :class="radio == 1 ? 'content_txt_bfbc' : 'content_txt_bc'"
                          ></th>
                          <th title="主队" class="ant-table-cell ant-table-cell-ellipsis">主队</th>
                          <th title="胜负" class="ant-table-cell ant-table-cell-ellipsis">胜负</th>
                          <th title="分差" class="ant-table-cell ant-table-cell-ellipsis">分差</th>
                          <th title="让分盘" class="ant-table-cell ant-table-cell-ellipsis">
                            让分盘
                          </th>
                          <th title="盘路" class="ant-table-cell ant-table-cell-ellipsis">盘路</th>
                          <th title="总分" class="ant-table-cell ant-table-cell-ellipsis">总分</th>
                          <th title="总分盘" class="ant-table-cell ant-table-cell-ellipsis">
                            总分盘
                          </th>
                          <th title="大小" class="ant-table-cell ant-table-cell-ellipsis">大小</th>
                        </tr>
                      </thead>
                      <tbody class="ant-table-tbody" v-if="detail.vs_match">
                        <tr
                          v-for="item in detail.vs_match.list"
                          class="ant-table-row ant-table-row-level-0"
                          :key="item.id"
                        >
                          <td title="NBA" class="ant-table-cell ant-table-cell-ellipsis">
                            {{ item.competition }}
                          </td>
                          <td class="ant-table-cell">
                            <div>{{ item.match_time }}</div>
                          </td>
                          <td class="ant-table-cell ant-table-cell-ellipsis">
                            {{ item.away_team }}
                          </td>
                          <td class="ant-table-cell">
                            <div v-if="radio == 1">
                              <span class="red bold">{{ item.away_score }}</span
                              >:<span class="red bold">{{ item.home_score }}</span> ({{
                                item.away_half_score
                              }}:{{ item.home_half_score }})
                            </div>
                            <div v-else>
                              <span class="red bold">{{ item.away_half_score }}</span
                              >:<span class="red bold">{{ item.home_half_score }}</span>
                            </div>
                          </td>
                          <td
                            :title="item.home_team"
                            class="ant-table-cell ant-table-cell-ellipsis"
                          >
                            {{ item.home_team }}
                          </td>
                          <td class="ant-table-cell ant-table-cell-ellipsis">
                            <div
                              class="loser"
                              :class="
                                item.all_type == '胜' || item.half_type == '胜' ? 'red' : 'green'
                              "
                            >
                              {{ radio == 1 ? item.all_type : item.half_type }}
                            </div>
                          </td>
                          <td class="ant-table-cell ant-table-cell-ellipsis">
                            <div>{{ radio == 1 ? item.all_score_gap : item.half_score_gap }}</div>
                          </td>
                          <td class="ant-table-cell ant-table-cell-ellipsis">
                            <div>{{ radio == 1 ? item.asia : item.half_asia }}</div>
                          </td>
                          <td class="ant-table-cell ant-table-cell-ellipsis">
                            <div>{{ radio == 1 ? item.asia_text : item.asia_half_text }}</div>
                          </td>
                          <td class="ant-table-cell ant-table-cell-ellipsis">
                            <div>
                              {{ radio == 1 ? item.score_all_total : item.score_half_total }}
                            </div>
                          </td>
                          <td class="ant-table-cell ant-table-cell-ellipsis">
                            <div>{{ radio == 1 ? item.bs : item.half_bs }}</div>
                          </td>
                          <td class="ant-table-cell ant-table-cell-ellipsis">
                            <div
                              :class="
                                item.bs_text == '大' || item.bs_half_text == '大' ? 'red' : 'green'
                              "
                            >
                              {{ radio == 1 ? item.bs_text : item.bs_half_text }}
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
        <div class="statistics" v-if="detail.vs_match">
          <span
            >两队近{{ detail.vs_match.count[0] }}场交锋，热火队胜{{
              detail.vs_match.count[1]
            }}场，</span
          ><span class="gap"
            >胜<span class="red">{{ detail.vs_match.count[2] }}%</span></span
          ><span class="gap"
            >赢<span class="red">{{ detail.vs_match.count[5] }}%</span></span
          ><span class="gap"
            >大<span class="red">{{ detail.vs_match.count[7] }}%</span></span
          >
        </div>
      </div>
    </div>
    <div class="section recent-container">
      <div class="title">
        <span class="title-line"></span><span class="title-text sfjk-11">双方近况</span
        ><span class="title-line"></span>
      </div>
      <div class="guest-recent">
        <div class="basketball-recent-table-main">
          <div class="header-operation">
            <div class="header-operation-team-name">
              <span class="line line-0071e3"></span>
              <span class="team-name color-333">{{ list.home_team_data.short_name_zh }}</span>
            </div>
            <div class="ant-radio-group ant-radio-group-outline">
              <el-radio v-model="radio1" label="1">全场</el-radio>
              <el-radio v-model="radio1" label="2">半场</el-radio>
            </div>
          </div>
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div class="ant-table">
                  <div class="ant-table-container">
                    <div class="ant-table-content">
                      <table style="table-layout: fixed">
                        <colgroup>
                          <col style="width: 140px" />
                          <col style="width: 120px" />
                          <col style="width: 110px" />
                          <col style="width: 160px" />
                          <col style="width: 110px" />
                          <col style="width: 60px" />
                          <col style="width: 60px" />
                          <col style="width: 75px" />
                          <col style="width: 72px" />
                          <col style="width: 90px" />
                          <col style="width: 100px" />
                          <col style="width: 102px" />
                        </colgroup>
                        <thead class="ant-table-thead">
                          <tr>
                            <th title="赛事" class="ant-table-cell ant-table-cell-ellipsis">
                              赛事
                            </th>
                            <th class="ant-table-cell">比赛日期</th>
                            <th title="客队" class="ant-table-cell ant-table-cell-ellipsis">
                              客队
                            </th>
                            <th
                              class="ant-table-cell"
                              :class="radio1 == 1 ? 'content_txt_bfbc' : 'content_txt_bc'"
                            ></th>
                            <th title="主队" class="ant-table-cell ant-table-cell-ellipsis">
                              主队
                            </th>
                            <th title="胜负" class="ant-table-cell ant-table-cell-ellipsis">
                              胜负
                            </th>
                            <th title="分差" class="ant-table-cell ant-table-cell-ellipsis">
                              分差
                            </th>
                            <th title="让分盘" class="ant-table-cell ant-table-cell-ellipsis">
                              让分盘
                            </th>
                            <th title="盘路" class="ant-table-cell ant-table-cell-ellipsis">
                              盘路
                            </th>
                            <th title="总分" class="ant-table-cell ant-table-cell-ellipsis">
                              总分
                            </th>
                            <th title="总分盘" class="ant-table-cell ant-table-cell-ellipsis">
                              总分盘
                            </th>
                            <th title="大小" class="ant-table-cell ant-table-cell-ellipsis">
                              大小
                            </th>
                          </tr>
                        </thead>
                        <tbody class="ant-table-tbody" v-if="detail.match.home">
                          <tr
                            v-for="item in detail.match.home.list"
                            :key="item.id"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td title="NBA" class="ant-table-cell ant-table-cell-ellipsis">
                              {{ item.competition }}
                            </td>
                            <td class="ant-table-cell">
                              <div>{{ item.match_time }}</div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              {{ item.away_team }}
                            </td>
                            <td class="ant-table-cell">
                              <div v-if="radio1 == 1">
                                <span class="red bold">{{ item.away_score }}</span
                                >:<span class="red bold">{{ item.home_score }}</span> ({{
                                  item.away_half_score
                                }}:{{ item.home_half_score }})
                              </div>
                              <div v-else>
                                <span class="red bold">{{ item.away_half_score }}</span
                                >:<span class="red bold">{{ item.home_half_score }}</span>
                              </div>
                            </td>
                            <td
                              :title="item.home_team"
                              class="ant-table-cell ant-table-cell-ellipsis"
                            >
                              {{ item.home_team }}
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div
                                class="loser"
                                :class="
                                  item.all_type == '胜' || item.half_type == '胜' ? 'red' : 'green'
                                "
                              >
                                {{ radio1 == 1 ? item.all_type : item.half_type }}
                              </div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div>
                                {{ radio1 == 1 ? item.all_score_gap : item.half_score_gap }}
                              </div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div>{{ radio1 == 1 ? item.asia : item.half_asia }}</div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div>{{ radio1 == 1 ? item.asia_text : item.asia_half_text }}</div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div>
                                {{ radio1 == 1 ? item.score_all_total : item.score_half_total }}
                              </div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div>{{ radio1 == 1 ? item.bs : item.half_bs }}</div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div
                                :class="
                                  item.bs_text == '大' || item.bs_half_text == '大'
                                    ? 'red'
                                    : 'green'
                                "
                              >
                                {{ radio1 == 1 ? item.bs_text : item.bs_half_text }}
                              </div>
                            </td>
                          </tr>
                        </tbody>

                        <tr v-else class="not-data-table">
                          <td colspan="9">暂无数据</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="host-recent">
        <div class="basketball-recent-table-main">
          <div class="header-operation">
            <div class="header-operation-team-name">
              <span class="line line-0071e3"></span>
              <span class="team-name color-333">{{ list.away_team_data.short_name_zh }}</span>
            </div>
            <div class="ant-radio-group ant-radio-group-outline">
              <el-radio v-model="radio2" label="1">全场</el-radio>
              <el-radio v-model="radio2" label="2">半场</el-radio>
            </div>
          </div>
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div class="ant-table">
                  <div class="ant-table-container">
                    <div class="ant-table-content">
                      <table style="table-layout: fixed">
                        <colgroup>
                          <col style="width: 140px" />
                          <col style="width: 120px" />
                          <col style="width: 110px" />
                          <col style="width: 160px" />
                          <col style="width: 110px" />
                          <col style="width: 60px" />
                          <col style="width: 60px" />
                          <col style="width: 75px" />
                          <col style="width: 72px" />
                          <col style="width: 90px" />
                          <col style="width: 100px" />
                          <col style="width: 102px" />
                        </colgroup>
                        <thead class="ant-table-thead">
                          <tr>
                            <th title="赛事" class="ant-table-cell ant-table-cell-ellipsis">
                              赛事
                            </th>
                            <th class="ant-table-cell">比赛日期</th>
                            <th title="客队" class="ant-table-cell ant-table-cell-ellipsis">
                              客队
                            </th>
                            <th
                              class="ant-table-cell"
                              :class="radio2 == 1 ? 'content_txt_bfbc' : 'content_txt_bc'"
                            ></th>
                            <th title="主队" class="ant-table-cell ant-table-cell-ellipsis">
                              主队
                            </th>
                            <th title="胜负" class="ant-table-cell ant-table-cell-ellipsis">
                              胜负
                            </th>
                            <th title="分差" class="ant-table-cell ant-table-cell-ellipsis">
                              分差
                            </th>
                            <th title="让分盘" class="ant-table-cell ant-table-cell-ellipsis">
                              让分盘
                            </th>
                            <th title="盘路" class="ant-table-cell ant-table-cell-ellipsis">
                              盘路
                            </th>
                            <th title="总分" class="ant-table-cell ant-table-cell-ellipsis">
                              总分
                            </th>
                            <th title="总分盘" class="ant-table-cell ant-table-cell-ellipsis">
                              总分盘
                            </th>
                            <th title="大小" class="ant-table-cell ant-table-cell-ellipsis">
                              大小
                            </th>
                          </tr>
                        </thead>
                        <tbody class="ant-table-tbody" v-if="detail.match.away.list">
                          <tr
                            v-for="item in detail.match.away.list"
                            :key="item.id"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td title="NBA" class="ant-table-cell ant-table-cell-ellipsis">
                              {{ item.competition }}
                            </td>
                            <td class="ant-table-cell">
                              <div>{{ item.match_time }}</div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              {{ item.away_team }}
                            </td>
                            <td class="ant-table-cell">
                              <div v-if="radio2 == 1">
                                <span class="red bold">{{ item.away_score }}</span
                                >:<span class="red bold">{{ item.home_score }}</span> ({{
                                  item.away_half_score
                                }}:{{ item.home_half_score }})
                              </div>
                              <div v-else>
                                <span class="red bold">{{ item.away_half_score }}</span
                                >:<span class="red bold">{{ item.home_half_score }}</span>
                              </div>
                            </td>
                            <td
                              :title="item.home_team"
                              class="ant-table-cell ant-table-cell-ellipsis"
                            >
                              {{ item.home_team }}
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div
                                class="loser"
                                :class="
                                  item.all_type == '胜' || item.half_type == '胜' ? 'red' : 'green'
                                "
                              >
                                {{ radio2 == 1 ? item.all_type : item.half_type }}
                              </div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div>
                                {{ radio2 == 1 ? item.all_score_gap : item.half_score_gap }}
                              </div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div>{{ radio2 == 1 ? item.asia : item.half_asia }}</div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div>{{ radio2 == 1 ? item.asia_text : item.asia_half_text }}</div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div>
                                {{ radio2 == 1 ? item.score_all_total : item.score_half_total }}
                              </div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div>{{ radio2 == 1 ? item.bs : item.half_bs }}</div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div
                                :class="
                                  item.bs_text == '大' || item.bs_half_text == '大'
                                    ? 'red'
                                    : 'green'
                                "
                              >
                                {{ radio2 == 1 ? item.bs_text : item.bs_half_text }}
                              </div>
                            </td>
                          </tr>
                        </tbody>

                        <tr v-else class="not-data-table">
                          <td colspan="9">暂无数据</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section tape-container">
      <div class="title">
        <span class="title-line"></span><span class="title-text">盘路走势</span
        ><span class="title-line"></span>
      </div>
      <div class="basketball-tape-table-main">
        <div class="guestData" v-for="(item, i, index) in detail.market_trend" :key="item.id">
          <div class="guestData-title">
            <span class="line line-0071e3"></span
            ><span class="team-name color-333">{{
              index == 1 ? list.away_team_data.short_name_zh : list.home_team_data.short_name_zh
            }}</span>
          </div>
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div class="ant-table">
                  <div class="ant-table-container">
                    <div class="ant-table-content">
                      <table style="table-layout: fixed">
                        <thead class="ant-table-thead">
                          <tr>
                            <th class="ant-table-cell"></th>
                            <th class="ant-table-cell">赛</th>
                            <th class="ant-table-cell">赢盘</th>
                            <th class="ant-table-cell asiaDraw">走水</th>
                            <th title="输盘" class="ant-table-cell ant-table-cell-ellipsis">
                              输盘
                            </th>
                            <th title="赢盘率" class="ant-table-cell ant-table-cell-ellipsis">
                              赢盘率
                            </th>
                            <!-- <th title="详情"
															class="ant-table-cell ant-table-cell-ellipsis">详情
														</th> -->
                            <th class="ant-table-cell">大分</th>
                            <th class="ant-table-cell">走水</th>
                            <th title="小分" class="ant-table-cell ant-table-cell-ellipsis">
                              小分
                            </th>
                            <th title="大分率" class="ant-table-cell ant-table-cell-ellipsis">
                              大分率
                            </th>
                            <!-- <th title="详情"
															class="ant-table-cell ant-table-cell-ellipsis">详情
														</th> -->
                          </tr>
                        </thead>
                        <tbody class="ant-table-tbody">
                          <tr
                            data-row-key="0.04810938982312751"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td class="ant-table-cell">
                              <div>总</div>
                            </td>
                            <td
                              class="ant-table-cell ant-table-cell-ellipsis"
                              v-for="(item1, index) in item.all"
                              :key="index"
                            >
                              <div>{{ item1 }}</div>
                            </td>
                          </tr>
                          <tr
                            data-row-key="0.04810938982312751"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td class="ant-table-cell">
                              <div>主</div>
                            </td>
                            <td
                              class="ant-table-cell ant-table-cell-ellipsis"
                              v-for="(item1, index) in item.home"
                              :key="index"
                            >
                              <div>{{ item1 }}</div>
                            </td>
                          </tr>
                          <tr
                            data-row-key="0.04810938982312751"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td class="ant-table-cell">
                              <div>客</div>
                            </td>
                            <td
                              class="ant-table-cell ant-table-cell-ellipsis"
                              v-for="(item1, index) in item.away"
                              :key="index"
                            >
                              <div>{{ item1 }}</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="ant-table-footer">
                    <div class="tape-table-footer">
                      <div class="footer-name">近6场</div>
                      <div class="footer-left">
                        <div
                          :class="item1 == '输' ? 'green' : 'red'"
                          v-for="(item1, index) in item.asia_text"
                          :key="index"
                        >
                          {{ item1 }}
                        </div>
                      </div>
                      <!-- <div class="blue look width100">查看</div> -->
                      <div class="footer-right">
                        <div
                          :class="item1 == '小' ? 'green' : 'red'"
                          v-for="(item1, index) in item.bs_text"
                          :key="index"
                        >
                          {{ item1 }}
                        </div>
                      </div>
                      <!-- <div class="blue look width100">查看</div> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section integral-container">
      <div class="title">
        <span class="title-line"></span>
        <span class="title-text">近期赛程</span>
        <span class="title-line"></span>
      </div>
      <div class="basketball-integral-table-main flex">
        <div
          class="guestData"
          style="height: auto; align-self: flex-start"
          v-for="(item, i, index) in detail.fixture"
          :key="index"
        >
          <div class="guestData-title">
            <span class="line line-0071e3"></span>
            <span class="team-name color-333">{{
              index == 1 ? list.away_team_data.short_name_zh : list.home_team_data.short_name_zh
            }}</span>
          </div>
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div class="ant-table">
                  <div class="ant-table-container">
                    <div class="ant-table-content">
                      <table style="table-layout: fixed">
                        <thead class="ant-table-thead">
                          <tr>
                            <th class="ant-table-cell">赛事</th>
                            <th class="ant-table-cell">日期</th>
                            <th class="ant-table-cell">客队</th>
                            <th class="ant-table-cell">主队</th>
                            <th class="ant-table-cell">与本场相隔</th>
                          </tr>
                        </thead>
                        <tbody class="ant-table-tbody">
                          <tr
                            data-row-key="0.9799075311969383"
                            class="ant-table-row ant-table-row-level-0"
                            v-for="(item1, index) in item"
                            :key="index"
                          >
                            <td class="ant-table-cell">{{ item1.competition }}</td>
                            <td class="ant-table-cell">{{ item1.match_time }}</td>
                            <td class="ant-table-cell">{{ item1.away_team }}</td>
                            <td class="ant-table-cell">{{ item1.home_team }}</td>
                            <td class="ant-table-cell red">{{ item1.separated_day }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section skill-container">
      <div class="title">
        <span class="title-line"></span><span class="title-text">技术统计</span
        ><span class="title-line"></span>
      </div>
      <div class="basketball-skill-table-main">
        <div class="guestData">
          <div class="guestData-title">
            <span class="line line-0071e3"></span><span class="team-name color-333">雄鹿</span>
          </div>
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div class="ant-table">
                  <div class="ant-table-container">
                    <div class="ant-table-content">
                      <table style="table-layout: fixed">
                        <colgroup>
                          <col style="width: 132px" />
                          <col style="width: 132px" />
                          <col style="width: 178px" />
                          <col style="width: 178px" />
                          <col style="width: 170px" />
                          <col style="width: 170px" />
                          <col style="width: 170px" />
                        </colgroup>
                        <thead class="ant-table-thead">
                          <tr>
                            <th title=" " class="ant-table-cell ant-table-cell-ellipsis"></th>
                            <th title="投篮命中率" class="ant-table-cell ant-table-cell-ellipsis">
                              投篮命中率
                            </th>
                            <th title="三分命中率" class="ant-table-cell ant-table-cell-ellipsis">
                              三分命中率
                            </th>
                            <th title="平均篮板" class="ant-table-cell ant-table-cell-ellipsis">
                              平均篮板
                            </th>
                            <th title="平均助攻" class="ant-table-cell ant-table-cell-ellipsis">
                              平均助攻
                            </th>
                            <th title="平均抢断" class="ant-table-cell ant-table-cell-ellipsis">
                              平均抢断
                            </th>
                            <th title="平均失误" class="ant-table-cell ant-table-cell-ellipsis">
                              平均失误
                            </th>
                          </tr>
                        </thead>
                        <tbody class="ant-table-tbody">
                          <tr
                            data-row-key="0.1487494348674947"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td title="近6场" class="ant-table-cell ant-table-cell-ellipsis">
                              近6场
                            </td>
                            <td title="47.2%" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>47.2%</div>
                            </td>
                            <td title="39.3%" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>39.3%</div>
                            </td>
                            <td title="46.8" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>46.8</div>
                            </td>
                            <td title="22.8" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>22.8</div>
                            </td>
                            <td title="7.7" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>7.7</div>
                            </td>
                            <td title="13.0" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>13.0</div>
                            </td>
                          </tr>
                          <tr
                            data-row-key="0.964079499165905"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td title="季前赛" class="ant-table-cell ant-table-cell-ellipsis">
                              季前赛
                            </td>
                            <td title="47.6%" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>47.6%</div>
                            </td>
                            <td title="39.7%" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>39.7%</div>
                            </td>
                            <td title="45.2" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>45.2</div>
                            </td>
                            <td title="22.4" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>22.4</div>
                            </td>
                            <td title="7.6" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>7.6</div>
                            </td>
                            <td title="14.2" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>14.2</div>
                            </td>
                          </tr>
                          <tr
                            data-row-key="0.8888164997634551"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td title="常规赛" class="ant-table-cell ant-table-cell-ellipsis">
                              常规赛
                            </td>
                            <td title="45.7%" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>45.7%</div>
                            </td>
                            <td title="37.8%" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>37.8%</div>
                            </td>
                            <td title="55.0" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>55.0</div>
                            </td>
                            <td title="25.0" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>25.0</div>
                            </td>
                            <td title="8.0" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>8.0</div>
                            </td>
                            <td title="7.0" class="ant-table-cell ant-table-cell-ellipsis">
                              <div>7.0</div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// api/Basketball_Analyze/info
import { basketballAnalyze } from '../../api/basketball.js'
export default {
  // analyze,指数详情---list赛事详情
  props: ['analyze', 'list'],
  data() {
    return {
      radio: '1',
      radio1: '1',
      radio2: '1',
      detail: {}
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      basketballAnalyze({ id: this.list.id })
        .then((res) => {
          this.detail = res.data
        })
        .catch((res) => {})
    }
  }
}
</script>

<style scoped lang="scss">
.basketball {
  width: 1200px;
  margin: 0 auto;
}

.basketball .section .title {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
}

.basketball .section .title-line {
  width: 90px;
  height: 1px;
  background: rgba(176, 138, 91, 0.5);
}

.basketball .section .title-text {
  font-size: 18px;
  color: #b08a5b;
  margin: 0 15px;
}

.basketball .section:last-child {
  margin-bottom: 40px;
}

.basketball .integral-container .basketball-integral-table-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.basketball .integral-container .basketball-integral-table-main .guestData,
.basketball .integral-container .basketball-integral-table-main .hostData {
  width: 590px;
  height: 245px;
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgba(69, 74, 99, 0.08);
  background: #fff;
}

.basketball .integral-container .basketball-integral-table-main .guestData-title,
.basketball .integral-container .basketball-integral-table-main .hostData-title {
  display: flex;
  align-items: center;
  height: 50px;
  padding-left: 20px;
}

.basketball .integral-container .basketball-integral-table-main .guestData-title .team-name,
.basketball .integral-container .basketball-integral-table-main .hostData-title .team-name {
  font-size: 15px;
}

.basketball .integral-container .basketball-integral-table-main .ant-table-tbody tr td {
  border-bottom: 1px solid #ebebeb;
}

.basketball .integral-container .basketball-integral-table-main .ant-table-tbody tr:first-child {
  color: #999;
}

.basketball .integral-container .basketball-integral-table-main .ant-table-tbody tr:last-child td {
  border: none;
}

.basketball .recent-container .host-recent {
  margin-top: 20px;
}

.basketball .recent-container .basketball-recent-table-main {
  padding-bottom: 26px;
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgba(69, 74, 99, 0.08);
  background-color: #fff;
}

.basketball .recent-container .basketball-recent-table-main .header-operation {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  padding-left: 20px;
}

.basketball .recent-container .basketball-recent-table-main .header-operation-team-name {
  display: flex;
  align-items: center;
  height: 100%;
  margin-right: 20px;
}

.basketball .recent-container .basketball-recent-table-main .header-operation .ant-select {
  margin-right: 20px;
}

.basketball .recent-container .basketball-recent-table-main .statistics {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30px;
  margin-top: 15px;
  font-size: 12px;
  color: #999;
}

.basketball .recent-container .basketball-recent-table-main .gap {
  margin: 0 2px;
}

.basketball .recent-container .ant-table-tbody tr:nth-child(2n) {
  background: #fafafa;
}

.basketball .tape-container .basketball-tape-table-main {
  width: 100%;
}

.basketball .tape-container .basketball-tape-table-main .guestData,
.basketball .tape-container .basketball-tape-table-main .hostData {
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgba(69, 74, 99, 0.08);
  background: #fff;
}

.basketball .tape-container .basketball-tape-table-main .guestData-title,
.basketball .tape-container .basketball-tape-table-main .hostData-title {
  display: flex;
  align-items: center;
  height: 50px;
  padding-left: 20px;
}

.basketball .tape-container .basketball-tape-table-main .guestData-title .team-name,
.basketball .tape-container .basketball-tape-table-main .hostData-title .team-name {
  font-size: 15px;
}

.basketball .tape-container .basketball-tape-table-main .guestData {
  margin-bottom: 25px;
}

.basketball .tape-container .basketball-tape-table-main .ant-table-tbody tr td {
  border-bottom: 1px solid #ebebeb;
}

.basketball .tape-container .basketball-tape-table-main .ant-table-tbody tr:first-child {
  color: #999;
}

.basketball .tape-container .basketball-tape-table-main .ant-table-tbody tr:last-child td {
  border: none;
}

.basketball .tape-container .basketball-tape-table-main .ant-table-tbody tr:nth-child(4) {
  display: none;
}

.basketball .tape-container .basketball-tape-table-main .ant-table-footer {
  padding: 0;
}

.basketball .tape-container .basketball-tape-table-main .tape-table-footer {
  height: 50px;
  display: flex;
  align-items: center;
  background: #fff;
}

.basketball .tape-container .basketball-tape-table-main .tape-table-footer .footer-name {
  text-align: center;
  width: 68px;
}

.basketball .tape-container .basketball-tape-table-main .tape-table-footer .footer-left,
.basketball .tape-container .basketball-tape-table-main .tape-table-footer .footer-right {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.basketball .tape-container .basketball-tape-table-main .tape-table-footer .footer-left {
  width: 477px;
}

.basketball .tape-container .basketball-tape-table-main .tape-table-footer .footer-right {
  width: 451px;
}

.basketball .tape-container .basketball-tape-table-main .width100 {
  text-align: center;
  width: 100px;
}

.basketball .tape-container .basketball-tape-table-main .red {
  color: #e30000;
}

.basketball .tape-container .basketball-tape-table-main .green {
  color: #6dd400;
}

.basketball .tape-container .basketball-tape-table-main .blue {
  color: #7770b6;
}

.basketball .tape-container .basketball-tape-table-main .black {
  color: #333;
}

.basketball .tape-container .basketball-tape-table-main .look {
  cursor: pointer;
}

.basketball .skill-container .basketball-skill-table-main {
  width: 100%;
}

.basketball .skill-container .basketball-skill-table-main .guestData,
.basketball .skill-container .basketball-skill-table-main .hostData {
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgba(69, 74, 99, 0.08);
  background: #fff;
}

.basketball .skill-container .basketball-skill-table-main .guestData-title,
.basketball .skill-container .basketball-skill-table-main .hostData-title {
  display: flex;
  align-items: center;
  height: 50px;
  padding-left: 20px;
}

.basketball .skill-container .basketball-skill-table-main .guestData-title .team-name,
.basketball .skill-container .basketball-skill-table-main .hostData-title .team-name {
  font-size: 15px;
}

.basketball .skill-container .basketball-skill-table-main .guestData {
  margin-bottom: 25px;
}

.basketball .skill-container .basketball-skill-table-main .ant-table-tbody tr td {
  border-bottom: 1px solid #ebebeb;
}

.basketball .skill-container .basketball-skill-table-main .ant-table-tbody tr:first-child {
  color: #999;
}

.basketball .skill-container .basketball-skill-table-main .ant-table-tbody tr:last-child td {
  border: none;
}
</style>
