<!-- 足球分析 -->
<template>
  <div class="match-detail-football">
    <div class="section integral-container">
      <div class="title">
        <span class="title-line"></span>
        <span class="title-text">积分排名</span>
        <span class="title-line"></span>
      </div>
      <div class="football-integral-table-main">
        <div class="hostData" v-for="(item1, i, index) in analyze.points_ranking" :key="index">
          <div class="hostData-title">
            <span class="line line-d9ad66"></span>
            <span class="team-name color-333">{{
              index == 0 ? list.home_team_name_zh : list.away_team_name_zh
            }}</span>
          </div>
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div class="ant-table">
                  <div class="ant-table-container">
                    <div class="ant-table-content">
                      <table style="table-layout: auto">
                        <thead class="ant-table-thead">
                          <tr>
                            <th class="ant-table-cell">全场</th>
                            <th class="ant-table-cell">比赛</th>
                            <th class="ant-table-cell">胜</th>
                            <th class="ant-table-cell">平</th>
                            <th class="ant-table-cell">负</th>
                            <th class="ant-table-cell">进</th>
                            <th class="ant-table-cell">失</th>
                            <th class="ant-table-cell">净胜</th>
                            <th class="ant-table-cell">积分</th>
                            <th class="ant-table-cell">排名</th>
                            <th class="ant-table-cell">胜率</th>
                          </tr>
                        </thead>
                        <tbody class="ant-table-tbody" v-if="item1.all.length != 0">
                          <tr
                            data-row-key="0.3346919825977621"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td class="ant-table-cell">总成绩</td>
                            <td
                              class="ant-table-cell"
                              v-for="(item, index) in item1.all"
                              :key="index"
                            >
                              {{ item }}
                            </td>
                          </tr>
                          <tr
                            data-row-key="0.09111574408754053"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td class="ant-table-cell">主场</td>
                            <td
                              class="ant-table-cell"
                              v-for="(item, index) in item1.home"
                              :key="index"
                            >
                              {{ item }}
                            </td>
                          </tr>
                          <tr
                            data-row-key="0.22602587711655975"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td class="ant-table-cell">客场</td>
                            <td
                              class="ant-table-cell"
                              v-for="(item, index) in item1.away"
                              :key="index"
                            >
                              {{ item }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div
                        style="text-align: center; height: 60px; line-height: 60px; width: 100%"
                        v-if="item1.all.length == 0"
                      >
                        暂无数据
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
    <div class="section scoreboard-container">
      <div class="title">
        <span class="title-line"></span><span class="title-text">联赛排名(联赛)</span
        ><span class="title-line"></span>
      </div>
      <div class="scoreboard-table">
        <div class="ant-table-wrapper">
          <div class="ant-spin-nested-loading">
            <div class="ant-spin-container">
              <div class="ant-table">
                <div class="ant-table-container">
                  <div class="ant-table-content">
                    <table style="table-layout: fixed">
                      <colgroup>
                        <col />
                        <col style="width: 166px" />
                      </colgroup>
                      <thead class="ant-table-thead">
                        <tr>
                          <th class="ant-table-cell">排名</th>
                          <th title="球队名称" class="ant-table-cell ant-table-cell-ellipsis">
                            球队名称
                          </th>
                          <th class="ant-table-cell">赛</th>
                          <th class="ant-table-cell">胜</th>
                          <th class="ant-table-cell">平</th>
                          <th class="ant-table-cell">负</th>
                          <th class="ant-table-cell">进</th>
                          <th class="ant-table-cell">失</th>
                          <th class="ant-table-cell">净</th>
                          <th class="ant-table-cell">胜%</th>
                          <th class="ant-table-cell">平%</th>
                          <th class="ant-table-cell">负%</th>
                          <th class="ant-table-cell">均进</th>
                          <th class="ant-table-cell">均失</th>
                          <th class="ant-table-cell">积分</th>
                        </tr>
                      </thead>
                      <tbody class="ant-table-tbody">
                        <!-- 如果进入前20就添加类目  b -->
                        <tr
                          data-row-key="0"
                          class="ant-table-row ant-table-row-level-0"
                          v-for="(item, index) in analyze.league_standings"
                          :key="index"
                        >
                          <td class="ant-table-cell">{{ item[0] }}</td>
                          <td class="ant-table-cell ant-table-cell-ellipsis">
                            <div class="img-name-wrap">
                              <img :src="item[1]" width="24" height="24" />
                              <div>{{ item[2] }}</div>
                            </div>
                          </td>
                          <td
                            class="ant-table-cell"
                            v-for="(item1, index1) in item.filter((o, i) => i > 2)"
                            :key="index1"
                          >
                            {{ item1 }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div
                      style="text-align: center; height: 60px; line-height: 60px"
                      v-if="analyze.league_standings && analyze.league_standings.length == 0"
                    >
                      暂无数据
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section history-container">
      <div class="title">
        <span class="title-line"></span><span class="title-text">历史交锋</span
        ><span class="title-line"></span>
      </div>
      <div class="match-history-container">
        <div class="football-history-operation">
          <!-- 下拉框 -->
          <el-select
            v-model="plusValue"
            placeholder="请选择"
            style="width: 120px; margin-right: 20px"
          >
            <el-option
              v-for="item in plusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="sessionValue"
            placeholder="请选择"
            style="width: 120px; margin-right: 20px"
          >
            <el-option
              v-for="item in sessionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(item, index) in competition.competition"
              :checked="true"
              :key="index"
              :label="item.sourceid"
              >{{ item.short_name_zh }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <table class="history-table">
          <thead>
            <tr>
              <th class="history0"><span>赛事</span></th>
              <th class="history1"><span>比赛日期</span></th>
              <th class="history2"><span>主队</span></th>
              <th class="history3 content_txt_bf"><span></span></th>
              <th class="history4"><span>客队</span></th>
              <th class="history5"><span>半场</span></th>
              <th class="history6"><span class="select">让球(Bet365)</span></th>
              <th class="history7"><span class="select">欧赔(Bet365)</span></th>
              <th class="select history8"><span class="select">大小(Bet365)</span></th>
              <th class="history9"><span>盘路</span></th>
              <th class="history10"><span>大小</span></th>
            </tr>
          </thead>
          <tbody>
            <!-- 绿色是 green , 红色是 red -->
            <tr class="history0" v-for="(item, index) in competition.list" :key="index">
              <td>
                <span class="ellipsis league-name" :title="item.competition">{{
                  item.competition
                }}</span>
              </td>
              <td>
                <span>{{ item.match_time }}</span>
              </td>
              <td
                class="host-team"
                :class="
                  item.is_home == 'home' && item.is_home_style == 1
                    ? 'red'
                    : item.is_home == 'home' && item.is_home_style == 2
                    ? 'green'
                    : ''
                "
              >
                <span>{{ item.home_team }}</span>
              </td>
              <td class="score">{{ item.score }}</td>
              <td
                class="guest-team"
                :class="
                  item.is_home == 'away' && item.is_home_style == 1
                    ? 'red'
                    : item.is_home == 'away' && item.is_home_style == 2
                    ? 'green'
                    : ''
                "
              >
                {{ item.away_team }}
              </td>
              <td class="score">{{ item.half_score }}</td>
              <td>{{ item.asia }}</td>
              <td>{{ item.eu }}</td>
              <td>{{ item.bs }}</td>
              <td>
                <span class="loser" :class="item.asia_text == '输' ? 'green' : 'red'">{{
                  item.asia_text
                }}</span>
              </td>
              <td>
                <span class="small" :class="item.bs_text == '小' ? 'green' : 'red'">{{
                  item.bs_text
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          class="history-statistics"
          v-if="competition.count && competition.competition.length != 0"
        >
          <!-- {{sessionValue == 0?5:sessionValue == 1?10:15}} -->
          <span>近{{ competition.count[0] }}场交战</span>
          <span>{{ list.home_team_name_zh }}</span>
          <span>
            <span class="color-e30000 gap">{{ competition.count[1] }}胜</span>
            <span class="color-999 gap">{{ competition.count[2] }}平</span>
            <span class="color-6dd400 gap">{{ competition.count[3] }}负</span></span
          >
          <span class="gap"
            >胜<span class="color-e30000"> {{ competition.count[4] }}</span>
          </span>
          <span class="gap"
            >赢<span class="color-e30000"> {{ competition.count[5] }}</span></span
          >
          <span class="gap"
            >大<span class="color-e30000"> {{ competition.count[6] }}</span></span
          >
        </div>
        <div class="history-statistics">暂无数据</div>
      </div>
    </div>
    <div class="section recent-container">
      <div class="title">
        <span class="title-line"></span><span class="title-text sfjk-22">双方近况</span
        ><span class="title-line"></span>
      </div>
      <div class="football-recent-container">
        <div class="host-team-container">
          <div class="filter">
            <span class="line line-d9ad66"></span>
            <span class="team-name">{{ list.home_team_name_zh }}</span>
            <!-- 下拉框 -->
            <el-select
              v-model="sessionValue1"
              placeholder="请选择"
              style="width: 120px; margin-right: 20px"
            >
              <el-option
                v-for="item in sessionList1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="plusValue1"
              placeholder="请选择"
              style="width: 120px; margin-right: 20px"
            >
              <el-option
                v-for="item in plusList1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-checkbox-group v-model="checkList1">
              <el-checkbox
                v-for="(item, index) in competition1.competition"
                :checked="true"
                :key="index"
                :label="item.sourceid"
                >{{ item.short_name_zh }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div class="ant-table">
                  <div class="ant-table-container">
                    <div class="ant-table-content">
                      <table style="table-layout: fixed">
                        <colgroup>
                          <col style="width: 121px" />
                          <col style="width: 120px" />
                          <col style="width: 155px" />
                          <col style="width: 123px" />
                          <col style="width: 155px" />
                          <col style="width: 123px" />
                          <col style="width: 158px" />
                          <col style="width: 118px" />
                          <col style="width: 126px" />
                        </colgroup>
                        <thead class="ant-table-thead">
                          <tr>
                            <th title="赛事" class="ant-table-cell ant-table-cell-ellipsis">
                              赛事
                            </th>
                            <th class="ant-table-cell">比赛日期</th>
                            <th title="主队" class="ant-table-cell ant-table-cell-ellipsis">
                              主队
                            </th>
                            <th class="ant-table-cell content_txt_bf"></th>
                            <th title="客队" class="ant-table-cell ant-table-cell-ellipsis">
                              客队
                            </th>
                            <th title="半场" class="ant-table-cell ant-table-cell-ellipsis">
                              半场
                            </th>
                            <th title="让球" class="ant-table-cell ant-table-cell-ellipsis">
                              让球
                            </th>
                            <th title="盘路" class="ant-table-cell ant-table-cell-ellipsis">
                              盘路
                            </th>
                            <th title="大小" class="ant-table-cell ant-table-cell-ellipsis">
                              大小
                            </th>
                          </tr>
                        </thead>
                        <tbody v-if="competition1.list" class="ant-table-tbody">
                          <tr
                            data-row-key="0.6545653941663265"
                            class="ant-table-row ant-table-row-level-0"
                            v-for="(item, index) in competition1.list"
                            :key="index"
                          >
                            <td title="澳超" class="ant-table-cell ant-table-cell-ellipsis">
                              {{ item.competition }}
                            </td>
                            <td class="ant-table-cell">
                              <span>{{ item.match_time }}</span>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div class="host-team">
                                <div class="ellipsis">{{ item.home_team }}</div>
                              </div>
                            </td>
                            <td class="ant-table-cell">
                              <div class="score">{{ item.score }}</div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div class="guest-team">
                                <div class="ellipsis">{{ item.away_team }}</div>
                              </div>
                            </td>
                            <td
                              :title="item.half_score"
                              class="ant-table-cell ant-table-cell-ellipsis"
                            >
                              {{ item.half_score }}
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">{{ item.asia }}</td>
                            <td title="赢" class="ant-table-cell ant-table-cell-ellipsis">
                              <span
                                class="loser"
                                :class="item.asia_text == '赢' ? 'red' : 'green'"
                                >{{ item.asia_text }}</span
                              >
                            </td>
                            <td title="大" class="ant-table-cell ant-table-cell-ellipsis">
                              <span
                                class="large"
                                :class="item.asia_text == '大' ? 'red' : 'green'"
                                >{{ item.bs_text }}</span
                              >
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
          <div class="football-recent-circle" v-if="competition1.count">
            <div class="percent-left flex-start">
              <div>
                <span>{{ competition1.count[1] }}胜</span>
                <el-progress
                  type="circle"
                  :percentage="Number(competition1.count[1])"
                  color="rgb(227, 0, 0)"
                  :show-text="false"
                  :width="100"
                ></el-progress>
              </div>
              <div style="margin: 0 40px">
                <span>{{ competition1.count[2] }}平</span>
                <el-progress
                  type="circle"
                  :percentage="Number(competition1.count[2]) * 10"
                  color="rgb(183, 183, 183)"
                  :show-text="false"
                  :width="100"
                ></el-progress>
              </div>
              <div>
                <span>{{ competition1.count[3] }}输</span>
                <el-progress
                  type="circle"
                  :percentage="Number(competition1.count[3]) * 10"
                  color="rgb(82, 196, 26)"
                  :show-text="false"
                  :width="100"
                ></el-progress>
              </div>
            </div>
            <div class="percent-right flex-start" style="margin-left: 40px">
              <div>
                <span>{{ competition1.count[4] }}%胜</span>
                <el-progress
                  type="circle"
                  :percentage="Number(competition1.count[4])"
                  :show-text="false"
                  :width="100"
                ></el-progress>
              </div>
              <div style="margin: 0 40px">
                <span>{{ competition1.count[5] }}%赢</span>
                <el-progress
                  type="circle"
                  :percentage="Number(competition1.count[5])"
                  :show-text="false"
                  :width="100"
                ></el-progress>
              </div>
              <div>
                <span>{{ competition1.count[6] }}%大</span>
                <el-progress
                  type="circle"
                  :percentage="Number(competition1.count[6])"
                  :show-text="false"
                  :width="100"
                ></el-progress>
              </div>
            </div>
          </div>
          <div class="recent-table-bottom-con" v-if="competition1.count">
            <span>近{{ competition1.count[0] }}场交战</span>
            <span>{{ list.home_team_name_zh }}</span>
            <span>
              <span class="color-e30000 gap">{{ competition1.count[1] }}胜</span>
              <span class="color-999 gap">{{ competition1.count[2] }}平</span>
              <span class="color-6dd400 gap">{{ competition1.count[3] }}负</span></span
            >
            <span class="gap"
              >胜<span class="color-e30000"> {{ competition1.count[4] }}%</span>
            </span>
            <span class="gap"
              >赢<span class="color-e30000"> {{ competition1.count[5] }}%</span></span
            >
            <span class="gap"
              >大<span class="color-e30000"> {{ competition1.count[6] }}%</span></span
            >
          </div>
        </div>
        <div class="guest-team-container">
          <div class="filter">
            <span class="line line-d9ad66"></span>
            <span class="team-name">{{ list.away_team_name_zh }}</span>
            <!-- 下拉框 -->
            <el-select
              v-model="sessionValue2"
              placeholder="请选择"
              style="width: 120px; margin-right: 20px"
            >
              <el-option
                v-for="item in sessionList2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="plusValue2"
              placeholder="请选择"
              style="width: 120px; margin-right: 20px"
            >
              <el-option
                v-for="item in plusList2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-checkbox-group v-model="checkList2">
              <el-checkbox
                v-for="(item, index) in competition2.competition"
                :checked="true"
                :key="index"
                :label="item.sourceid"
                >{{ item.short_name_zh }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div class="ant-table">
                  <div class="ant-table-container">
                    <div class="ant-table-content">
                      <table style="table-layout: fixed">
                        <colgroup>
                          <col style="width: 121px" />
                          <col style="width: 120px" />
                          <col style="width: 155px" />
                          <col style="width: 123px" />
                          <col style="width: 155px" />
                          <col style="width: 123px" />
                          <col style="width: 158px" />
                          <col style="width: 118px" />
                          <col style="width: 126px" />
                        </colgroup>
                        <thead class="ant-table-thead">
                          <tr>
                            <th title="赛事" class="ant-table-cell ant-table-cell-ellipsis">
                              赛事
                            </th>
                            <th class="ant-table-cell">比赛日期</th>
                            <th title="主队" class="ant-table-cell ant-table-cell-ellipsis">
                              主队
                            </th>
                            <th class="ant-table-cell content_txt_bf"></th>
                            <th title="客队" class="ant-table-cell ant-table-cell-ellipsis">
                              客队
                            </th>
                            <th title="半场" class="ant-table-cell ant-table-cell-ellipsis">
                              半场
                            </th>
                            <th title="让球" class="ant-table-cell ant-table-cell-ellipsis">
                              让球
                            </th>
                            <th title="盘路" class="ant-table-cell ant-table-cell-ellipsis">
                              盘路
                            </th>
                            <th title="大小" class="ant-table-cell ant-table-cell-ellipsis">
                              大小
                            </th>
                          </tr>
                        </thead>
                        <tbody v-if="competition2.list" class="ant-table-tbody">
                          <tr
                            data-row-key="0.6545653941663265"
                            class="ant-table-row ant-table-row-level-0"
                            v-for="(item, index) in competition2.list"
                            :key="index"
                          >
                            <td title="澳超" class="ant-table-cell ant-table-cell-ellipsis">
                              {{ item.competition }}
                            </td>
                            <td class="ant-table-cell">
                              <span>{{ item.match_time }}</span>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div class="host-team">
                                <div class="ellipsis">{{ item.home_team }}</div>
                              </div>
                            </td>
                            <td class="ant-table-cell">
                              <div class="score">{{ item.score }}</div>
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">
                              <div class="guest-team">
                                <div class="ellipsis">{{ item.away_team }}</div>
                              </div>
                            </td>
                            <td
                              :title="item.half_score"
                              class="ant-table-cell ant-table-cell-ellipsis"
                            >
                              {{ item.half_score }}
                            </td>
                            <td class="ant-table-cell ant-table-cell-ellipsis">{{ item.asia }}</td>
                            <td title="赢" class="ant-table-cell ant-table-cell-ellipsis">
                              <span
                                class="loser"
                                :class="item.asia_text == '赢' ? 'red' : 'green'"
                                >{{ item.asia_text }}</span
                              >
                            </td>
                            <td title="大" class="ant-table-cell ant-table-cell-ellipsis">
                              <span
                                class="large"
                                :class="item.asia_text == '大' ? 'red' : 'green'"
                                >{{ item.bs_text }}</span
                              >
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
          <div class="football-recent-circle" v-if="competition2.count">
            <div class="percent-left flex-start">
              <div>
                <span>{{ competition2.count[1] }}胜</span>
                <el-progress
                  type="circle"
                  :percentage="Number(competition2.count[1])"
                  color="rgb(227, 0, 0)"
                  :show-text="false"
                  :width="100"
                ></el-progress>
              </div>
              <div style="margin: 0 40px">
                <span>{{ competition2.count[2] }}平</span>
                <el-progress
                  type="circle"
                  :percentage="Number(competition2.count[2]) * 10"
                  color="rgb(183, 183, 183)"
                  :show-text="false"
                  :width="100"
                ></el-progress>
              </div>
              <div>
                <span>{{ competition2.count[3] }}输</span>
                <el-progress
                  type="circle"
                  :percentage="Number(competition2.count[3]) * 10"
                  color="rgb(82, 196, 26)"
                  :show-text="false"
                  :width="100"
                ></el-progress>
              </div>
            </div>
            <div class="percent-right flex-start" style="margin-left: 40px">
              <div>
                <span>{{ competition2.count[4] }}%胜</span>
                <el-progress
                  type="circle"
                  :percentage="Number(competition2.count[4])"
                  :show-text="false"
                  :width="100"
                ></el-progress>
              </div>
              <div style="margin: 0 40px">
                <span>{{ competition2.count[5] }}%赢</span>
                <el-progress
                  type="circle"
                  :percentage="Number(competition2.count[5])"
                  :show-text="false"
                  :width="100"
                ></el-progress>
              </div>
              <div>
                <span>{{ competition2.count[6] }}%大</span>
                <el-progress
                  type="circle"
                  :percentage="Number(competition2.count[6])"
                  :show-text="false"
                  :width="100"
                ></el-progress>
              </div>
            </div>
          </div>
          <div class="recent-table-bottom-con" v-if="competition2.count">
            <span>近{{ competition2.count[0] }}场交战</span>
            <span>{{ list.away_team_name_zh }}</span>
            <span>
              <span class="color-e30000 gap">{{ competition2.count[1] }}胜</span>
              <span class="color-999 gap">{{ competition2.count[2] }}平</span>
              <span class="color-6dd400 gap">{{ competition2.count[3] }}负</span></span
            >
            <span class="gap"
              >胜<span class="color-e30000"> {{ competition2.count[4] }}%</span>
            </span>
            <span class="gap"
              >赢<span class="color-e30000"> {{ competition2.count[5] }}%</span></span
            >
            <span class="gap"
              >大<span class="color-e30000"> {{ competition2.count[6] }}%</span></span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="section trend-container">
      <div class="title">
        <span class="title-line"> </span>
        <span class="title-text">盘路走势</span>
        <span class="title-line"></span>
      </div>
      <div class="football-trend-container">
        <div class="hostData" v-for="(all, index) in analyze.market_trend" :key="index">
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div class="ant-table">
                  <div class="ant-table-container">
                    <div class="ant-table-content">
                      <table style="table-layout: fixed">
                        <colgroup>
                          <col style="width: 31px" />
                          <col style="width: 30px" />
                          <col />
                          <col style="width: 50px" />
                          <col style="width: 50px" />
                          <col style="width: 81px" />
                          <col style="width: 71px" />
                          <col style="width: 72px" />
                          <col style="width: 72px" />
                          <col style="width: 79px" />
                        </colgroup>
                        <thead class="ant-table-thead">
                          <tr>
                            <th class="ant-table-cell b-b"></th>
                            <th class="ant-table-cell b-r b-b"></th>
                            <th colspan="4" class="ant-table-cell b-r b-b">让球盘</th>
                            <th colspan="7" class="ant-table-cell b-b">大小球</th>
                          </tr>
                          <tr>
                            <th class="ant-table-cell b-b"></th>
                            <th class="ant-table-cell b-r b-b">赛</th>
                            <th class="ant-table-cell b-b">赢盘</th>
                            <th class="ant-table-cell b-b">走盘</th>
                            <th title="输盘" class="ant-table-cell b-b ant-table-cell-ellipsis">
                              输盘
                            </th>
                            <th title="赢盘率" class="ant-table-cell b-r b-b">赢盘率</th>
                            <th title="大球" class="ant-table-cell b-b">大球</th>
                            <th title="大球率" class="ant-table-cell b-b">大球率</th>
                            <th title="走球" class="ant-table-cell b-b">走</th>
                            <th title="小球" class="ant-table-cell b-b">小球</th>
                            <th
                              colspan="3"
                              title="小球率"
                              class="ant-table-cell b-b b-r"
                              style="width: 40px"
                            >
                              小球率
                            </th>
                          </tr>
                        </thead>
                        <tbody class="ant-table-tbody">
                          <tr
                            data-row-key="0.5721679296551017"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td class="ant-table-cell b-b">总</td>
                            <td
                              class="ant-table-cell b-b"
                              v-for="(item, index) in all.all"
                              :key="item.id"
                              :colspan="index === 9 ? 3 : 1"
                              :class="{
                                'b-r': index === 0 || index === 4,
                                'ant-table-cell-ellipsis': index === 4
                              }"
                            >
                              {{ item }}
                            </td>
                          </tr>
                          <tr
                            data-row-key="0.5721679296551017"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td class="ant-table-cell b-b">主</td>
                            <td
                              class="ant-table-cell b-b"
                              v-for="(item, index) in all.home"
                              :key="item.id"
                              :colspan="index === 9 ? 3 : 1"
                              :class="{
                                'b-r': index === 0 || index === 4,
                                'ant-table-cell-ellipsis': index === 4
                              }"
                            >
                              {{ item }}
                            </td>
                          </tr>
                          <tr
                            data-row-key="0.5721679296551017"
                            class="ant-table-row ant-table-row-level-0"
                          >
                            <td class="ant-table-cell b-b">客</td>
                            <td
                              class="ant-table-cell b-b"
                              v-for="(item, index) in all.away"
                              :key="item.id"
                              :colspan="index === 9 ? 3 : 1"
                              :class="{
                                'b-r': index === 0 || index === 4,
                                'ant-table-cell-ellipsis': index === 4
                              }"
                            >
                              {{ item }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="ant-table-footer">
                    <div class="table-footer">
                      <div class="b-r con-left">近6场</div>
                      <div class="b-r con-middle" style="width: 195px">
                        <div
                          :class="item == '赢' ? 'color-e30000' : 'color-7770b6'"
                          v-for="item in all.asia_text"
                          :key="item.id"
                        >
                          {{ item }}
                        </div>
                      </div>
                      <div class="con-right">
                        <div
                          :class="item == '大' ? 'color-e30000' : 'color-7770b6'"
                          v-for="item in all.bs_text"
                          :key="item.id"
                        >
                          {{ item }}
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
    </div>
    <div class="section avg-container">
      <div class="title">
        <span class="title-line"></span><span class="title-text">平均统计</span
        ><span class="title-line"></span>
      </div>
      <div class="football-avg-container">
        <div class="hostData" v-for="item in analyze.average_statistics" :key="item.id">
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div class="ant-table">
                  <div class="ant-table-container">
                    <div class="ant-table-content">
                      <table style="table-layout: auto">
                        <colgroup>
                          <col style="width: 150px" />
                        </colgroup>
                        <thead class="ant-table-thead">
                          <tr>
                            <th class="ant-table-cell"></th>
                            <th class="ant-table-cell">场均</th>
                            <th class="ant-table-cell">主场</th>
                            <th class="ant-table-cell">客场</th>
                          </tr>
                        </thead>
                        <tbody class="ant-table-tbody" v-if="item.avg_goals">
                          <tr data-row-key="Goal" class="ant-table-row ant-table-row-level-0">
                            <td class="ant-table-cell">入球</td>
                            <td class="ant-table-cell">{{ item.avg_goals }}个</td>
                            <td class="ant-table-cell">{{ item.home_goals }}个</td>
                            <td class="ant-table-cell">{{ item.away_goals }}个</td>
                          </tr>
                          <tr data-row-key="LostGoal" class="ant-table-row ant-table-row-level-0">
                            <td class="ant-table-cell">失球</td>
                            <td class="ant-table-cell">{{ item.avg_against }}个</td>
                            <td class="ant-table-cell">{{ item.home_against }}个</td>
                            <td class="ant-table-cell">{{ item.away_against }}个</td>
                          </tr>
                        </tbody>
                      </table>
                      <div
                        style="text-align: center; height: 60px; line-height: 60px; width: 100%"
                        v-if="!item.avg_goals"
                      >
                        暂无数据
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="guestData" style="display: none">
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div class="ant-table">
                  <div class="ant-table-container">
                    <div class="ant-table-content">
                      <table style="table-layout: auto">
                        <colgroup>
                          <col style="width: 150px" />
                        </colgroup>
                        <thead class="ant-table-thead">
                          <tr>
                            <th class="ant-table-cell"></th>
                            <th class="ant-table-cell">场均</th>
                            <th class="ant-table-cell">主场</th>
                            <th class="ant-table-cell">客场</th>
                          </tr>
                        </thead>
                        <tbody class="ant-table-tbody">
                          <tr data-row-key="Goal" class="ant-table-row ant-table-row-level-0">
                            <td class="ant-table-cell">入球</td>
                            <td class="ant-table-cell">2个</td>
                            <td class="ant-table-cell">0个</td>
                            <td class="ant-table-cell">6个</td>
                          </tr>
                          <tr data-row-key="LostGoal" class="ant-table-row ant-table-row-level-0">
                            <td class="ant-table-cell">失球</td>
                            <td class="ant-table-cell">-</td>
                            <td class="ant-table-cell">0个</td>
                            <td class="ant-table-cell">0个</td>
                          </tr>
                          <tr data-row-key="Corner" class="ant-table-row ant-table-row-level-0">
                            <td class="ant-table-cell">角球</td>
                            <td class="ant-table-cell">3个</td>
                            <td class="ant-table-cell">0个</td>
                            <td class="ant-table-cell">9个</td>
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
    <div class="section distribute-container">
      <div class="title">
        <span class="title-line"></span><span class="title-text">进球分布</span
        ><span class="title-line"></span>
      </div>
      <div class="football-distribute-container">
        <div class="guestData" v-for="item in analyze.goal_distribution" :key="item.id">
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div class="ant-table">
                  <div class="ant-table-container">
                    <div class="ant-table-content">
                      <table style="table-layout: auto">
                        <colgroup>
                          <col style="width: 80px" />
                        </colgroup>
                        <thead class="ant-table-thead">
                          <tr>
                            <th class="ant-table-cell"></th>
                            <th class="ant-table-cell">0-15′</th>
                            <th class="ant-table-cell">15-30′</th>
                            <th class="ant-table-cell">30-45′</th>
                            <th class="ant-table-cell">45-60′</th>
                            <th class="ant-table-cell">60-75′</th>
                            <th class="ant-table-cell">75-90′</th>
                          </tr>
                        </thead>
                        <tbody class="ant-table-tbody" v-if="item.all.length != 0">
                          <tr data-row-key="all" class="ant-table-row ant-table-row-level-0">
                            <td class="ant-table-cell">总</td>
                            <td class="ant-table-cell" v-for="item in item.all" :key="item.id">
                              {{ item }}
                            </td>
                          </tr>
                          <tr data-row-key="host" class="ant-table-row ant-table-row-level-0">
                            <td class="ant-table-cell">主</td>
                            <td class="ant-table-cell" v-for="item in item.home" :key="item.id">
                              {{ item }}
                            </td>
                          </tr>
                          <tr data-row-key="guest" class="ant-table-row ant-table-row-level-0">
                            <td class="ant-table-cell">客</td>
                            <td class="ant-table-cell" v-for="item in item.away" :key="item.id">
                              {{ item }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div
                        style="text-align: center; height: 60px; line-height: 60px; width: 100%"
                        v-if="item.all.length == 0"
                      >
                        暂无数据
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
    <div class="section distribute-container">
      <div class="title">
        <span class="title-line"></span> <span class="title-text">失球分布</span
        ><span class="title-line"></span>
      </div>
      <div class="football-distribute-container">
        <div class="guestData" v-for="item in analyze.against_distribution" :key="item.id">
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div class="ant-table">
                  <div class="ant-table-container">
                    <div class="ant-table-content">
                      <table style="table-layout: auto">
                        <colgroup>
                          <col style="width: 80px" />
                        </colgroup>
                        <thead class="ant-table-thead">
                          <tr>
                            <th class="ant-table-cell"></th>
                            <th class="ant-table-cell">0-15′</th>
                            <th class="ant-table-cell">15-30′</th>
                            <th class="ant-table-cell">30-45′</th>
                            <th class="ant-table-cell">45-60′</th>
                            <th class="ant-table-cell">60-75′</th>
                            <th class="ant-table-cell">75-90′</th>
                          </tr>
                        </thead>
                        <tbody class="ant-table-tbody" v-if="item.all.length != 0">
                          <tr data-row-key="all" class="ant-table-row ant-table-row-level-0">
                            <td class="ant-table-cell">总</td>
                            <td class="ant-table-cell" v-for="item in item.all" :key="item.id">
                              {{ item }}
                            </td>
                          </tr>
                          <tr data-row-key="host" class="ant-table-row ant-table-row-level-0">
                            <td class="ant-table-cell">主</td>
                            <td class="ant-table-cell" v-for="item in item.home" :key="item.id">
                              {{ item }}
                            </td>
                          </tr>
                          <tr data-row-key="guest" class="ant-table-row ant-table-row-level-0">
                            <td class="ant-table-cell">客</td>
                            <td class="ant-table-cell" v-for="item in item.away" :key="item.id">
                              {{ item }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div
                        style="text-align: center; height: 60px; line-height: 60px; width: 100%"
                        v-if="item.all.length == 0"
                      >
                        暂无数据
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
    <div class="foresight flex">
      <div class="f-l">
        <div class="f-l-logo flex-center">
          <div class="flex-center">
            <img :src="list.home_team_log" />
          </div>
          <p>{{ list.home_team_name_zh }}</p>
        </div>
        <div class="f-l-title flex-start">
          <img src="/static/images/foresight-down.png" />
          <span class="yl-3">有利消息</span>
        </div>
        <div class="f-l-li" v-for="item in match.good.home" :key="item.id">
          {{ item }}
        </div>
        <div class="f-l-title flex-start">
          <img src="/static/images/foresight-up.png" />
          <span style="color: #4280dc">不利消息</span>
        </div>
        <div class="f-l-li" v-for="item in match.bad.home" :key="item.id">
          {{ item }}
        </div>
      </div>
      <div class="f-c">
        <div class="f-l-title flex-start">
          <img src="/static/images/foresight-center.png" />
          <span style="color: #eaa315">中立消息</span>
        </div>
        <div class="f-l-li" v-for="item in match.neutral" :key="item.id">
          {{ item }}
        </div>
      </div>
      <div class="f-l">
        <div class="f-l-logo flex-center">
          <div class="flex-center">
            <img :src="list.away_team_log" />
          </div>
          <p>{{ list.away_team_name_zh }}</p>
        </div>
        <div class="f-l-title flex-start">
          <img src="/static/images/foresight-down.png" />
          <span class="yl-4">有利消息</span>
        </div>
        <div class="f-l-li" v-for="item in match.good.away" :key="item.id">
          {{ item }}
        </div>
        <div class="f-l-title flex-start">
          <img src="/static/images/foresight-up.png" />
          <span style="color: #4280dc">不利消息</span>
        </div>
        <div class="f-l-li" v-for="item in match.bad.away" :key="item.id">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// api/Football_Analyze/match_vs_list

import { getmatch_list, match_vs_list } from '@/api/football.js'
import { getList, match_foresight } from '@/api/foresight.js'
export default {
  // analyze,指数详情---list赛事详情
  props: ['analyze', 'list', 'query'],
  data() {
    return {
      type: 0,
      type1: 0,
      limit: 20,
      plusValue: 0,
      checkList: [],
      sessionValue: 0,
      plusList: [
        {
          value: 0,
          label: '不分主客'
        },
        {
          value: 1,
          label: '主客相同'
        }
      ],
      sessionList: [
        {
          value: 0,
          label: '近5场'
        },
        {
          value: 1,
          label: '近10场'
        },
        {
          value: 2,
          label: '近15场'
        }
      ],
      competition: {},
      // 双方状况
      plusValue1: 0,
      checkList1: [],
      sessionValue1: 0,
      plusList1: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '主客'
        },
        {
          value: 2,
          label: '客队'
        }
      ],
      sessionList1: [
        {
          value: 0,
          label: '近5场'
        },
        {
          value: 1,
          label: '近10场'
        },
        {
          value: 2,
          label: '近15场'
        }
      ],
      competition1: {},

      // 客队
      plusValue2: 0,
      checkList2: [],
      sessionValue2: 0,
      plusList2: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '主客'
        },
        {
          value: 2,
          label: '客队'
        }
      ],
      sessionList2: [
        {
          value: 0,
          label: '近5场'
        },
        {
          value: 1,
          label: '近10场'
        },
        {
          value: 2,
          label: '近15场'
        }
      ],
      competition2: {},
      match: {
        //优劣势分析
        bad: {},
        good: {},
        neutral: {}
      }
    }
  },
  mounted() {
    this.getmatch_list()
    this.match_vs_list()
    this.getmatch_list1()
    this.$nextTick(function () {
      this.getForesight()
    })
  },
  watch: {
    checkList(e) {
      this.match_vs_list()
    },
    plusValue(e) {
      this.match_vs_list()
    },
    sessionValue(e) {
      this.match_vs_list()
    },

    checkList1(e) {
      this.getmatch_list()
    },
    plusValue1(e) {
      this.getmatch_list()
    },
    sessionValue1(e) {
      this.getmatch_list()
    },

    checkList2(e) {
      this.getmatch_list1()
    },
    plusValue2(e) {
      this.getmatch_list1()
    },
    sessionValue2(e) {
      this.getmatch_list1()
    }
  },
  methods: {
    format(value) {
      return `${value} 赢`
    },
    // 获取主近况
    getmatch_list() {
      let data = {
        type: 0,
        id: this.query.id,
        home: this.plusValue1,
        limit: this.sessionValue1 == 0 ? 5 : this.sessionValue1 == 1 ? 10 : 15,
        competition_id: this.checkList1.toString()
      }
      // getmatch_list(data)
      //   .then((res) => {
      //     this.competition1 = res.data
      //   })
      //   .catch((res) => {})
    },
    // 获取客近况
    getmatch_list1() {
      let data = {
        type: 1,
        id: this.query.id,
        home: this.plusValue2,
        limit: this.sessionValue2 == 0 ? 5 : this.sessionValue2 == 1 ? 10 : 15,
        competition_id: this.checkList2.toString()
      }
      // getmatch_list(data)
      //   .then((res) => {
      //     this.competition2 = res.data
      //   })
      //   .catch((res) => {})
    },
    // 获取优劣势情报（
    getForesight(list) {
      // list.id
      let query = this.$route.query
      match_foresight({ id: query.id }).then((res) => {
        //获取优劣势
        this.match = { ...this.match, ...res.data }
      })
    },

    // 历史交锋
    match_vs_list() {
      let data = {
        id: this.query.id,
        type: this.plusValue,
        limit: this.sessionValue == 0 ? 5 : this.sessionValue == 1 ? 10 : 15,
        competition_id: this.checkList.toString()
      }
      // match_vs_list(data)
      //   .then((res) => {
      //     this.competition = res.data
      //   })
      //   .catch((res) => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.match-detail-football {
  width: 1200px;
  margin: 0 auto;
}

.match-detail-football .section .title {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
}

.match-detail-football .section .title-line {
  width: 90px;
  height: 1px;
  background: rgba(176, 138, 91, 0.5);
}

.match-detail-football .section .title-text {
  font-size: 18px;
  color: #b08a5b;
  margin: 0 15px;
}

.match-detail-football .section:last-child {
  margin-bottom: 40px;
}

.match-detail-football .integral-container .football-integral-table-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.match-detail-football .integral-container .football-integral-table-main .guestData,
.match-detail-football .integral-container .football-integral-table-main .hostData {
  width: 590px;
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgba(69, 74, 99, 0.08);
  background: #fff;
}

.match-detail-football .integral-container .football-integral-table-main .guestData-title,
.match-detail-football .integral-container .football-integral-table-main .hostData-title {
  display: flex;
  align-items: center;
  height: 50px;
  padding-left: 20px;
}

.match-detail-football
  .integral-container
  .football-integral-table-main
  .guestData-title
  .team-name,
.match-detail-football
  .integral-container
  .football-integral-table-main
  .hostData-title
  .team-name {
  font-size: 15px;
}

.match-detail-football .integral-container .football-integral-table-main .ant-table-tbody tr {
  font-size: 12px;
}

.match-detail-football .integral-container .football-integral-table-main .ant-table-tbody tr td {
  border-bottom: 1px solid #ebebeb;
}

.match-detail-football
  .integral-container
  .football-integral-table-main
  .ant-table-tbody
  tr
  td:first-child {
  color: #999;
}

.match-detail-football
  .integral-container
  .football-integral-table-main
  .ant-table-tbody
  tr:last-child
  td {
  border: none;
}

.match-detail-football .scoreboard-container .scoreboard-table {
  padding-bottom: 50px;
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgba(69, 74, 99, 0.08);
  background: #fff;
}

.match-detail-football .scoreboard-container .scoreboard-table .ant-table-row.y td {
  color: #b08a5b;
}

.match-detail-football .scoreboard-container .scoreboard-table .ant-table-row.b td {
  color: #4185ff;
}

.match-detail-football .scoreboard-container .scoreboard-table .ant-table-tbody tr:nth-child(2n) {
  background: #fafafa;
}

.match-detail-football .scoreboard-container .scoreboard-table .img-name-wrap {
  display: flex;
  align-items: center;
  padding-left: 17px;
}

.match-detail-football .scoreboard-container .scoreboard-table .img-name-wrap .name {
  max-width: 120px;
  margin-left: 6px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.match-detail-football .history-container {
  width: 1200px;
}

.match-detail-football .history-container .match-history-container {
  width: 100%;
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgba(69, 74, 99, 0.08);
  background-color: #fff;
}

.match-detail-football .history-container .match-history-container .football-history-operation {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  padding-left: 20px;
}

.match-detail-football
  .history-container
  .match-history-container
  .football-history-operation
  .ant-select {
  margin-right: 20px;
}

.match-detail-football .history-container .match-history-container .history-table thead th {
  background: #f7f7f8;
  color: #999;
  font-size: 12px;
  font-weight: 400;
  line-height: 45px;
}

.match-detail-football .history-container .match-history-container .history-table tbody td {
  color: #333;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}

.match-detail-football .history-container .match-history-container .history-table tbody td.green {
  color: #6dd400;
}

.match-detail-football .history-container .match-history-container .history-table tbody td.red {
  color: #ff5d5d;
}

.match-detail-football
  .history-container
  .match-history-container
  .history-table
  tbody
  td.color-e30000 {
  color: #e30000;
}

.match-detail-football
  .history-container
  .match-history-container
  .history-table
  tbody
  tr:nth-child(2n)
  td {
  background: #f7f7f8;
}

.match-detail-football .history-container .match-history-container .history-table tbody .space {
  display: inline-block;
  margin: 0 6px;
}

.match-detail-football .history-container .match-history-container .history-table th.history0 {
  width: 90px;
}

.match-detail-football .history-container .match-history-container .history-table .history0 {
  overflow: hidden;
  width: 90px !important;
  text-align: center;
}

.match-detail-football .history-container .match-history-container .history-table .history1 {
  width: 90px;
  text-align: center;
}

.match-detail-football .history-container .match-history-container .history-table .history2 {
  width: 170px;
  text-align: center;
}

.match-detail-football .history-container .match-history-container .history-table .history3 {
  width: 75px;
  text-align: center;
}

.match-detail-football .history-container .match-history-container .history-table .history4 {
  width: 170px;
  text-align: center;
}

.match-detail-football .history-container .match-history-container .history-table .history5 {
  width: 70px;
  text-align: center;
}

.match-detail-football .history-container .match-history-container .history-table .history6,
.match-detail-football .history-container .match-history-container .history-table .history7,
.match-detail-football .history-container .match-history-container .history-table .history8 {
  vertical-align: middle;
  width: 150px;
  text-align: center;
}

.match-detail-football .history-container .match-history-container .history-table .history9,
.match-detail-football .history-container .match-history-container .history-table .history10 {
  vertical-align: middle;
  width: 50px;
  text-align: center;
}

.match-detail-football .history-container .match-history-container .history-statistics {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
  font-size: 12px;
}

.match-detail-football
  .history-container
  .match-history-container
  .history-statistics
  .color-f48484 {
  color: #f48484;
}

.match-detail-football
  .history-container
  .match-history-container
  .history-statistics
  .color-6dd400 {
  color: #6dd400;
}

.match-detail-football .history-container .match-history-container .history-statistics .color-999 {
  color: #999;
}

.match-detail-football .history-container .match-history-container .history-statistics .gap {
  margin: 0 2px;
}

.match-detail-football .recent-container .football-recent-container .guest-team-container,
.match-detail-football .recent-container .football-recent-container .host-team-container {
  width: 100%;
  padding-bottom: 26px;
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgba(69, 74, 99, 0.08);
  background-color: #fff;
}

.match-detail-football .recent-container .football-recent-container .guest-team-container .filter,
.match-detail-football .recent-container .football-recent-container .host-team-container .filter {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 0 30px 0 20px;
}

.match-detail-football
  .recent-container
  .football-recent-container
  .guest-team-container
  .filter
  .team-name,
.match-detail-football
  .recent-container
  .football-recent-container
  .host-team-container
  .filter
  .team-name {
  margin-right: 40px;
  font-size: 15px;
  color: #333;
}

.match-detail-football
  .recent-container
  .football-recent-container
  .ant-table-tbody
  tr:nth-child(2n) {
  background: #fafafa;
}

.match-detail-football .recent-container .football-recent-container .guest-team-container {
  margin-top: 25px;
}

.match-detail-football .recent-container .football-recent-container .ant-select {
  margin-right: 20px;
}

.match-detail-football .recent-container .football-recent-container .football-recent-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
}

.match-detail-football
  .recent-container
  .football-recent-container
  .football-recent-circle
  .ant-progress {
  margin: 0 40px;
}

.match-detail-football
  .recent-container
  .football-recent-container
  .football-recent-circle
  .ant-progress-circle.ant-progress-status-success
  .ant-progress-text {
  color: rgba(0, 0, 0, 0.85);
}

.match-detail-football .recent-container .football-recent-container .recent-table-bottom-con {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 18px;
  font-size: 12px;
  color: #999;
}

.match-detail-football .recent-container .gap {
  margin: 0 2px;
}

.match-detail-football .trend-container .football-trend-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.match-detail-football .trend-container .football-trend-container .guestData,
.match-detail-football .trend-container .football-trend-container .hostData {
  width: 590px;
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgba(69, 74, 99, 0.08);
}

.match-detail-football .trend-container .football-trend-container .b-r {
  border-right: 1px solid #ebebeb;
}

.match-detail-football .trend-container .football-trend-container .b-b {
  border-bottom: 1px solid #ebebeb;
}

.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-thead
  tr:first-child
  th {
  font-size: 13px;
  color: #333;
}

.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-thead
  tr:not(:first-child)
  th {
  font-size: 12px;
}

.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-tbody
  tr
  td:first-child {
  color: #999;
}

.match-detail-football .trend-container .football-trend-container .ant-table-tbody tr:nth-child(4) {
  display: none;
}

.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-tbody
  tr:last-child
  td {
  border-bottom: none;
}

.match-detail-football .trend-container .football-trend-container .ant-table-footer {
  padding: 0;
}

.match-detail-football .trend-container .football-trend-container .ant-table-footer .table-footer {
  display: flex;
  height: 50px;
}

.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-footer
  .table-footer
  .con-left,
.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-footer
  .table-footer
  .con-middle,
.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-footer
  .table-footer
  .con-right {
  display: flex;
  align-items: center;
}

.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-footer
  .table-footer
  .con-left
  .color-e30000,
.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-footer
  .table-footer
  .con-middle
  .color-e30000,
.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-footer
  .table-footer
  .con-right
  .color-e30000 {
  color: #e30000;
}

.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-footer
  .table-footer
  .con-left
  .color-7770b6,
.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-footer
  .table-footer
  .con-middle
  .color-7770b6,
.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-footer
  .table-footer
  .con-right
  .color-7770b6 {
  color: #7770b6;
}

.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-footer
  .table-footer
  .con-left
  .color-333,
.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-footer
  .table-footer
  .con-middle
  .color-333,
.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-footer
  .table-footer
  .con-right
  .color-333 {
  color: #333;
}

.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-footer
  .table-footer
  .con-left {
  width: 61px;
  justify-content: center;
}

.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-footer
  .table-footer
  .con-middle {
  width: 235px;
  justify-content: space-around;
}

.match-detail-football
  .trend-container
  .football-trend-container
  .ant-table-footer
  .table-footer
  .con-right {
  width: 293px;
  justify-content: space-around;
}

.match-detail-football .avg-container .football-avg-container,
.match-detail-football .avg-container .football-distribute-container,
.match-detail-football .distribute-container .football-avg-container,
.match-detail-football .distribute-container .football-distribute-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.match-detail-football .avg-container .football-avg-container .guestData,
.match-detail-football .avg-container .football-avg-container .hostData,
.match-detail-football .avg-container .football-distribute-container .guestData,
.match-detail-football .avg-container .football-distribute-container .hostData,
.match-detail-football .distribute-container .football-avg-container .guestData,
.match-detail-football .distribute-container .football-avg-container .hostData,
.match-detail-football .distribute-container .football-distribute-container .guestData,
.match-detail-football .distribute-container .football-distribute-container .hostData {
  width: 590px;
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgba(69, 74, 99, 0.08);
}

.match-detail-football .avg-container .football-avg-container .ant-table-tbody tr td,
.match-detail-football .avg-container .football-distribute-container .ant-table-tbody tr td,
.match-detail-football .distribute-container .football-avg-container .ant-table-tbody tr td,
.match-detail-football .distribute-container .football-distribute-container .ant-table-tbody tr td {
  border-bottom: 1px solid #ebebeb;
}

.match-detail-football .avg-container .football-avg-container .ant-table-tbody tr td:first-child,
.match-detail-football
  .avg-container
  .football-distribute-container
  .ant-table-tbody
  tr
  td:first-child,
.match-detail-football
  .distribute-container
  .football-avg-container
  .ant-table-tbody
  tr
  td:first-child,
.match-detail-football
  .distribute-container
  .football-distribute-container
  .ant-table-tbody
  tr
  td:first-child {
  color: #999;
}

.match-detail-football .avg-container .football-avg-container .ant-table-tbody tr:last-child td,
.match-detail-football
  .avg-container
  .football-distribute-container
  .ant-table-tbody
  tr:last-child
  td,
.match-detail-football
  .distribute-container
  .football-avg-container
  .ant-table-tbody
  tr:last-child
  td,
.match-detail-football
  .distribute-container
  .football-distribute-container
  .ant-table-tbody
  tr:last-child
  td {
  border: none;
}

.percent-right div,
.percent-left div {
  position: relative;
}
.percent-right div span,
.percent-left div span {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  text-align: center;
  margin: 0;
  transform: translate(0, -50%);
}
.ant-table-wrapper {
  margin: 0;
}
.foresight > div {
  flex: 1;
}
.foresight {
  width: 100%;
  margin: 100px 0;
  box-shadow: 0 6px 12px 0 #454a6314;
  .f-l {
    padding-top: 112px;
    position: relative;
    align-self: flex-start;
    background-color: white;
  }
  .f-c {
    align-self: flex-start;
    border-top: 2px solid #eaa315;
  }
  .f-l-logo {
    position: absolute;
    left: 0;
    right: 0;
    top: -40px;
    img {
      width: 60px;
      height: auto;
    }
    div {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: white;
      box-shadow: 0 6px 12px 0 #454a6314;
    }
    p {
      width: 100%;
      text-align: center;
    }
  }
  .f-l-title {
    margin: 20px 0;
    padding: 0 20px;
    font-size: 16px;
    img {
      width: 18px;
      height: 19px;
      margin-right: 4px;
    }
    span {
      color: #ff5338;
    }
  }
  .f-l-li {
    padding: 0 20px;
    font-size: 16px;
    margin-bottom: 20px;
  }
}
</style>
