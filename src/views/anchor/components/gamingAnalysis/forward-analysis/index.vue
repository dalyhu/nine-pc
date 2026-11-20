<!-- 火星电竞前瞻分析 - 新版，未完待续日写的什么！！！ -->
<template>
    <div class="gaming-forward-analysis hide_scrollbar">
      <div class="top flex">
        <div class="top-box">
          <!-- 添加原本存在代码的备注， 左边队名和logo -->
          <div class="flex-center flex-col">
            <div class="top-img flex-center">
              <div class="top-bor">
                <img :src="(home_team.meta && home_team.meta.logo) || defaultImage" />
              </div>
            </div>
            <div class="bankSans top-txt">
              {{ home_team.meta && (home_team.meta.abbr || home_team.meta.name)}}
            </div>
          </div>

          <div class="top-desc flex flex-center flex-col">
            <div class="top-desc-txt">
              <img class="top-desc-img" :src="getImageUrl('/static/images/marz/win_rate_prediction.png')" />
              <span>本场比赛胜率</span>
            </div>
            <div class="top-bar">
              <!-- 如果胜率为0 -->
              <p
                v-if="(home_team.overview && toPercentage(home_team.overview.pre_win_rate)) == 0 || !home_team"
                style="width: 50%; color: var(--el-text-color-primary)"
                class="top-bar-inner binbold grey"
              >
                0%
              </p>
              <p v-else :style="{ width: (home_team.overview && toPercentage(home_team.overview.pre_win_rate)) + '%', minWidth: '30px'}" class="top-bar-inner binbold blue">
                {{ home_team.overview && toPercentage(home_team.overview.pre_win_rate)}}%
              </p>
  
              <!-- 如果胜率为0 -->
              <p
                v-if="(away_team.overview && toPercentage(away_team.overview.pre_win_rate)) == 0 || !away_team"
                style="width: 50%; color: var(--el-text-color-primary)"
                class="top-bar-inner binbold grey"
              >
                0%
              </p>
              <p v-else :style="{width: (away_team.overview && toPercentage(away_team.overview.pre_win_rate)) + '%', minWidth: '30px' }" class="top-bar-inner binbold red">
                {{ away_team.overview && toPercentage(away_team.overview.pre_win_rate)}}%
              </p>
            </div>
          </div>

          <!-- 添加原本存在代码的备注， 右边队名和logo -->
          <div class="flex-center flex-col">
            <div class="top-img borRed flex-center">
              <div class="top-bor">
                <img :src="(away_team.meta && away_team.meta.logo) || defaultImage"/>
              </div>
            </div>
            <div class="bankSans top-txt">
              {{ away_team.meta && (away_team.meta.abbr || away_team.meta.name) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 中间切换tab -->
      <div class="reset-con-tab">
        <span @click="tab(2)" :class="tabNum == 2 ? 'on' : ''">近期数据</span>
        <span @click="tab(1)" :class="tabNum == 1 ? 'on' : ''">历史交手</span>
      </div>

      <!-- content -->
      <div class="con"  v-if="home_team && home_team.meta && home_team.meta.name">
        <div class="tab">
          <!-- 切换 -->
          <div class="con-top">
            <div class="con-opt">
              <div class="con-opt-num">
                <span class="text">统计场次</span>
                <select @change="selectNum" v-model="match_num">
                  <option value="3">3</option>
                  <option value="6">6</option>
                  <option value="10">10</option>
                </select>
              </div>
              <div class="con-checkbox" @click="onlyGame">
                <i :class="current_league_only == true ? 'on' : ''"></i>
                <span class="ml5">只看当前联赛</span>
              </div>
            </div>
          </div>
        </div>
        <div class="con-box">
          <div class="con-left">
            <!-- 交手数据 -->
            <div class="data-con">
              <div v-if="tabNum == 1" class="data-tit">
                <i></i>
                <span class="ml5">交手数据</span>
              </div>
              <div v-if="tabNum == 2" class="data-tit">
                <i></i>
                <span class="ml5">各队近期数据</span>
              </div>
              <div class="battle-data-spacing" v-if="home_team.overview.win_rate !== ''">
                <div class="battle-data-con">
                  <div class="battle-data-ranks">
                    <div class="battle-data-name">
                      <span class="bankSans">{{
                        home_team.meta && (home_team.meta.abbr || home_team.meta.name)
                      }}</span>
                      <div class="battle-data-img">
                        <div class="flex-center battle-data-img-box">
                          <img
                            :src="(home_team.meta && home_team.meta.logo) || defaultImage"
                          />
                        </div>
                      </div>
                    </div>
                    <div v-if="tabNum == 1">
                      <div class="battle-data-vs">
                        <img
                          :src="
                            getImageUrl(
                              '/static/images/marz/831ed842-74a3-4057-b5a3-5e9ed750d261_26_26.png'
                            )
                          "
                        />
                      </div>
                    </div>
                    <div v-if="tabNum == 2">
                      <div class="battle-data-vs">
                        <span>|</span>
                      </div>
                    </div>
                    <div class="battle-data-name">
                      <div class="battle-data-img">
                        <div class="flex-center battle-data-img-box">
                          <img
                            :src="(away_team.meta && away_team.meta.logo) || defaultImage"
                          />
                        </div>
                      </div>
                      <span class="bankSans">{{
                        away_team.meta && (away_team.meta.abbr || away_team.meta.name)
                      }}</span>
                    </div>
                  </div>
  
                  <div class="battle-data-num">
                    <!-- 主队 -->
                    <div class="battle-data-cibox binbold">
                      <div class="battle-data-ci">
                        <span>{{ home_team.overview && home_team.overview.race_lose }}</span>
                        <img
                          src="/static/images/marz/aea767e6-b57f-48cd-bf93-9c70aadd58de_18_18.png"
                        />
                      </div>
                      <div class="battle-data-ci">
                        <span>{{ home_team.overview && home_team.overview.race_win }}</span>
                        <img
                          src="/static/images/marz/431342eb-37eb-451e-8c72-3b8384a63e55_18_18.png"
                        />
                      </div>
                    </div>
                    <!-- 客队 -->
                    <div class="battle-data-cibox binbold">
                      <div class="battle-data-ci">
                        <img
                          src="/static/images/marz/431342eb-37eb-451e-8c72-3b8384a63e55_18_18.png"
                        />
                        <span>{{ away_team.overview && away_team.overview.race_win }}</span>
                      </div>
                      <div class="battle-data-ci">
                        <img
                          src="/static/images/marz/aea767e6-b57f-48cd-bf93-9c70aadd58de_18_18.png"
                        />
                        <span>{{ away_team.overview && away_team.overview.race_lose }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="battle-data-list">
                    <div v-if="game_id == 2">
                      <div class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview && toPercentage(home_team.overview.win_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <div
                              :style="
                                'width:' +
                                (home_team.overview && toPercentage(home_team.overview.win_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.win_rate) >
                                (away_team.overview && away_team.overview.win_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl justify">胜率</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <div
                              :style="
                                'width:' +
                                (away_team.overview && toPercentage(away_team.overview.win_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.win_rate) >
                                (home_team.overview && home_team.overview.win_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview && toPercentage(away_team.overview.win_rate)
                            }}%</span
                          >
                        </div>
                      </div>
                      <div class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview && toPercentage(home_team.overview.r1_win_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <div
                              :style="
                                'width:' +
                                (home_team.overview && toPercentage(home_team.overview.r1_win_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.r1_win_rate) >
                                (away_team.overview && away_team.overview.r1_win_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl">R1手枪胜</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <div
                              :style="
                                'width:' +
                                (away_team.overview && toPercentage(away_team.overview.r1_win_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.r1_win_rate) >
                                (home_team.overview && home_team.overview.r1_win_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview && toPercentage(away_team.overview.r1_win_rate)
                            }}%</span
                          >
                        </div>
                      </div>
                      <div class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview && toPercentage(home_team.overview.r16_win_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <div
                              :style="
                                'width:' +
                                (home_team.overview &&
                                  toPercentage(home_team.overview.r16_win_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.r16_win_rate) >
                                (away_team.overview && away_team.overview.r16_win_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl">R16手枪胜</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <div
                              :style="
                                'width:' +
                                (away_team.overview &&
                                  toPercentage(away_team.overview.r16_win_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.r16_win_rate) >
                                (home_team.overview && home_team.overview.r16_win_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview && toPercentage(away_team.overview.r16_win_rate)
                            }}%</span
                          >
                        </div>
                      </div>
                      <div class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview && toPercentage(home_team.overview.f5_k_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <div
                              :style="
                                'width:' +
                                (home_team.overview && toPercentage(home_team.overview.f5_k_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.f5_k_rate) >
                                (away_team.overview && away_team.overview.f5_k_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl">先胜五轮</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <div
                              :style="
                                'width:' +
                                (away_team.overview && toPercentage(away_team.overview.f5_k_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.f5_k_rate) >
                                (home_team.overview && home_team.overview.f5_k_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview && toPercentage(away_team.overview.f5_k_rate)
                            }}%</span
                          >
                        </div>
                      </div>
                      <div class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview && toPercentage(home_team.overview.f10_k_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <!-- <span>{{ home_team.overview && home_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (home_team.overview && toPercentage(home_team.overview.f10_k_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.f10_k_rate) >
                                (away_team.overview && away_team.overview.f10_k_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl">先胜十轮</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <!-- <span>{{ away_team.overview && away_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (away_team.overview && toPercentage(away_team.overview.f10_k_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.f10_k_rate) >
                                (home_team.overview && home_team.overview.f10_k_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview && toPercentage(away_team.overview.f10_k_rate)
                            }}%</span
                          >
                        </div>
                      </div>
  
                      <div v-if="tabNum == 2" class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview && toPercentage(home_team.overview.round_gt_x_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <!-- <span>{{ home_team.overview && home_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (home_team.overview &&
                                  toPercentage(home_team.overview.round_gt_x_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.round_gt_x_rate) >
                                (away_team.overview && away_team.overview.round_gt_x_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl" style="font-size: 13px">回合数>26.5</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <!-- <span>{{ away_team.overview && away_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (away_team.overview &&
                                  toPercentage(away_team.overview.round_gt_x_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.round_gt_x_rate) >
                                (home_team.overview && home_team.overview.round_gt_x_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview && toPercentage(away_team.overview.round_gt_x_rate)
                            }}%</span
                          >
                        </div>
                      </div>
                    </div>
  
                    <div v-if="game_id != 2">
                      <div class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview && toPercentage(home_team.overview.win_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <div
                              :style="
                                'width:' +
                                (home_team.overview && toPercentage(home_team.overview.win_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.win_rate) >
                                (away_team.overview && away_team.overview.win_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl justify">胜率</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <div
                              :style="
                                'width:' +
                                (away_team.overview && toPercentage(away_team.overview.win_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.win_rate) >
                                (home_team.overview && home_team.overview.win_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview && toPercentage(away_team.overview.win_rate)
                            }}%</span
                          >
                        </div>
                      </div>
                      <!-- 一  血 率 -->
                      <div class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview && toPercentage(home_team.overview.first_blood_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <div
                              :style="
                                'width:' +
                                (home_team.overview &&
                                  toPercentage(home_team.overview.first_blood_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.first_blood_rate) >
                                (away_team.overview && away_team.overview.first_blood_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl">一 血 率</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <div
                              :style="
                                'width:' +
                                (away_team.overview &&
                                  toPercentage(away_team.overview.first_blood_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.first_blood_rate) >
                                (home_team.overview && home_team.overview.first_blood_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview && toPercentage(away_team.overview.first_blood_rate)
                            }}%</span
                          >
                        </div>
                      </div>
                      <!-- 一  塔 率 -->
                      <div class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview &&
                              toPercentage(home_team.overview.first_turret_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <div
                              :style="
                                'width:' +
                                (home_team.overview &&
                                  toPercentage(home_team.overview.first_turret_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.first_turret_rate) >
                                (away_team.overview && away_team.overview.first_turret_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl">一 塔 率</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <div
                              :style="
                                'width:' +
                                (away_team.overview &&
                                  toPercentage(away_team.overview.first_turret_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.first_turret_rate) >
                                (home_team.overview && home_team.overview.first_turret_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview &&
                              toPercentage(away_team.overview.first_turret_rate)
                            }}%</span
                          >
                        </div>
                      </div>
                      <!-- 五  杀 率 -->
                      <div class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview && toPercentage(home_team.overview.five_kills_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <div
                              :style="
                                'width:' +
                                (home_team.overview &&
                                  toPercentage(home_team.overview.five_kills_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.five_kills_rate) >
                                (away_team.overview && away_team.overview.five_kills_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl">五 杀 率</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <div
                              :style="
                                'width:' +
                                (away_team.overview &&
                                  toPercentage(away_team.overview.five_kills_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.five_kills_rate) >
                                (home_team.overview && home_team.overview.five_kills_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview && toPercentage(away_team.overview.five_kills_rate)
                            }}%</span
                          >
                        </div>
                      </div>
                      <!-- 十  杀 率 -->
                      <div class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview && toPercentage(home_team.overview.ten_kills_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <!-- <span>{{ home_team.overview && home_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (home_team.overview &&
                                  toPercentage(home_team.overview.ten_kills_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.ten_kills_rate) >
                                (away_team.overview && away_team.overview.ten_kills_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl">十 杀 率</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <!-- <span>{{ away_team.overview && away_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (away_team.overview &&
                                  toPercentage(away_team.overview.ten_kills_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.ten_kills_rate) >
                                (home_team.overview && home_team.overview.ten_kills_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview && toPercentage(away_team.overview.ten_kills_rate)
                            }}%</span
                          >
                        </div>
                      </div>
                      <!-- 英雄联盟 首小龙率 -->
                      <div v-if="game_id == 1" class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview &&
                              toPercentage(home_team.overview.first_dragon_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <!-- <span>{{ home_team.overview && home_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (home_team.overview &&
                                  toPercentage(home_team.overview.first_dragon_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.first_dragon_rate) >
                                (away_team.overview && away_team.overview.first_dragon_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl">首小龙率</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <!-- <span>{{ away_team.overview && away_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (away_team.overview &&
                                  toPercentage(away_team.overview.first_dragon_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.first_dragon_rate) >
                                (home_team.overview && home_team.overview.first_dragon_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview &&
                              toPercentage(away_team.overview.first_dragon_rate)
                            }}%</span
                          >
                        </div>
                      </div>
                      <!-- 英雄联盟 首大龙率 -->
                      <div v-if="game_id == 1" class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview && toPercentage(home_team.overview.first_baron_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <!-- <span>{{ home_team.overview && home_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (home_team.overview &&
                                  toPercentage(home_team.overview.first_baron_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.first_baron_rate) >
                                (away_team.overview && away_team.overview.first_baron_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl">首大龙率</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <!-- <span>{{ away_team.overview && away_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (away_team.overview &&
                                  toPercentage(away_team.overview.first_baron_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.first_baron_rate) >
                                (home_team.overview && home_team.overview.first_baron_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview && toPercentage(away_team.overview.first_baron_rate)
                            }}%</span
                          >
                        </div>
                      </div>
  
                      <!-- 王者 首暴君率 -->
                      <div v-if="game_id == 3" class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview &&
                              toPercentage(home_team.overview.first_dragon_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <!-- <span>{{ home_team.overview && home_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (home_team.overview &&
                                  toPercentage(home_team.overview.first_dragon_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.first_dragon_rate) >
                                (away_team.overview && away_team.overview.first_dragon_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl">首暴君率</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <!-- <span>{{ away_team.overview && away_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (away_team.overview &&
                                  toPercentage(away_team.overview.first_dragon_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.first_dragon_rate) >
                                (home_team.overview && home_team.overview.first_dragon_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview &&
                              toPercentage(away_team.overview.first_dragon_rate)
                            }}%</span
                          >
                        </div>
                      </div>
  
                      <!-- 王者 首主宰率 -->
                      <div v-if="game_id == 3" class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview && toPercentage(home_team.overview.first_baron_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <!-- <span>{{ home_team.overview && home_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (home_team.overview &&
                                  toPercentage(home_team.overview.first_baron_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.first_baron_rate) >
                                (away_team.overview && away_team.overview.first_baron_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl">首主宰率</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <!-- <span>{{ away_team.overview && away_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (away_team.overview &&
                                  toPercentage(away_team.overview.first_baron_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.first_baron_rate) >
                                (home_team.overview && home_team.overview.first_baron_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview && toPercentage(away_team.overview.first_baron_rate)
                            }}%</span
                          >
                        </div>
                      </div>
  
                      <!-- DOTA2 首兵营率 -->
                      <div v-if="game_id == 4" class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold"
                            >{{
                              home_team.overview &&
                              toPercentage(home_team.overview.first_barrack_rate)
                            }}%</span
                          >
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <!-- <span>{{ home_team.overview && home_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (home_team.overview &&
                                  toPercentage(home_team.overview.first_barrack_rate)) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.first_barrack_rate) >
                                (away_team.overview && away_team.overview.first_barrack_rate)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl">首兵营率</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <!-- <span>{{ away_team.overview && away_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (away_team.overview &&
                                  toPercentage(away_team.overview.first_barrack_rate)) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.first_barrack_rate) >
                                (home_team.overview && home_team.overview.first_barrack_rate)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold"
                            >{{
                              away_team.overview &&
                              toPercentage(away_team.overview.first_barrack_rate)
                            }}%</span
                          >
                        </div>
                      </div>
  
                      <!-- 场均总时长 -->
                      <div v-if="game_id != 2 && tabNum == 2" class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold">{{
                            home_team.overview && formatSeconds(home_team.overview.duration_avg)
                          }}</span>
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <!-- <span>{{ averageTime(home_team.overview.duration_avg,away_team.overview.duration_avg)}}</span> -->
                            <div
                              :style="
                                'width:' +
                                (home_team.overview &&
                                home_team.overview.duration_avg > away_team.overview &&
                                away_team.overview.duration_avg
                                  ? '80'
                                  : averageTime(
                                      home_team.overview && home_team.overview.duration_avg,
                                      away_team.overview && away_team.overview.duration_avg
                                    )) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.duration_avg) >
                                (away_team.overview && away_team.overview.duration_avg)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl" style="font-size: 13px">场均总时长</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <!-- <span>1111：{{averageTime(home_team.overview.duration_avg,away_team.overview.duration_avg)}}</span> -->
                            <div
                              :style="
                                'width:' +
                                (away_team.overview &&
                                away_team.overview.duration_avg > home_team.overview &&
                                home_team.overview.duration_avg
                                  ? '80'
                                  : averageTime(
                                      home_team.overview && home_team.overview.duration_avg,
                                      away_team.overview && away_team.overview.duration_avg
                                    )) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.duration_avg) >
                                (home_team.overview && home_team.overview.duration_avg)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold">{{
                            away_team.overview && formatSeconds(away_team.overview.duration_avg)
                          }}</span>
                        </div>
                      </div>
  
                      <!-- 场均击杀 -->
                      <div v-if="game_id != 2 && tabNum == 2" class="battle-data-item">
                        <div class="battle-data-box">
                          <span class="binbold">{{
                            home_team.overview && home_team.overview.kill_avg.toFixed(1)
                          }}</span>
                          <div class="battle-data-bar battle-data-bar-left binbold">
                            <!-- <span>{{ home_team.overview && home_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (home_team.overview &&
                                home_team.overview.kill_avg > away_team.overview &&
                                away_team.overview.kill_avg
                                  ? '80'
                                  : averageTime(
                                      home_team.overview && home_team.overview.kill_avg,
                                      away_team.overview && away_team.overview.kill_avg
                                    )) +
                                '%'
                              "
                              :class="[
                                (home_team.overview && home_team.overview.kill_avg) >
                                (away_team.overview && away_team.overview.kill_avg)
                                  ? 'blue'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                        </div>
  
                        <span class="battle-data-sl">场均击杀</span>
                        <div class="battle-data-box">
                          <div class="battle-data-bar battle-data-bar-right binbold">
                            <!-- <span>{{ away_team.overview && away_team.overview.f10_k_rate.toFixed(2)*100}}%</span> -->
                            <div
                              :style="
                                'width:' +
                                (away_team.overview &&
                                away_team.overview.kill_avg > home_team.overview &&
                                home_team.overview.kill_avg
                                  ? '80'
                                  : averageTime(
                                      home_team.overview && home_team.overview.kill_avg,
                                      away_team.overview && away_team.overview.kill_avg
                                    )) +
                                '%'
                              "
                              :class="[
                                (away_team.overview && away_team.overview.kill_avg) >
                                (home_team.overview && home_team.overview.kill_avg)
                                  ? 'red'
                                  : '',
                                'battle-data-bar-inner'
                              ]"
                            ></div>
                          </div>
                          <span class="binbold">{{
                            away_team.overview && away_team.overview.kill_avg.toFixed(1)
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- csgo -->
                <div v-if="game_id == 2 && tabNum == 1" class="data-round">
                  <div>
                    <p class="data-round-p1 binbold">
                      {{ home_team.overview && toPercentage(home_team.overview.round_gt_x_rate) }}%
                    </p>
                    <p class="data-round-p2">回合>26.5</p>
                  </div>
                  <div>
                    <p class="data-round-p1 binbold">
                      {{ home_team.overview && toPercentage(home_team.overview.overtime_rate) }}%
                    </p>
                    <p class="data-round-p2">进入加时赛</p>
                  </div>
                </div>
                <!-- moba -->
                <div v-if="game_id != 2 && tabNum == 1" class="data-round">
                  <!-- 英雄联盟 -->
                  <div v-if="game_id == 1">
                    <p class="data-round-p1 binbold">
                      {{ home_team.overview && toPercentage(home_team.overview.kill_gt_x_rate) }}%
                    </p>
                    <p class="data-round-p2">总击杀>26.5</p>
                  </div>
                  <div v-if="game_id == 1">
                    <p class="data-round-p1 binbold">
                      {{
                        home_team.overview &&
                        toPercentage(home_team.overview.duration_gt_x_minute_rate)
                      }}%
                    </p>
                    <p class="data-round-p2">游戏时长>33</p>
                  </div>
  
                  <!-- 王者荣耀 -->
                  <div v-if="game_id == 3">
                    <p class="data-round-p1 binbold">
                      {{ home_team.overview && toPercentage(home_team.overview.kill_gt_x_rate) }}%
                    </p>
                    <p class="data-round-p2">总击杀>23.5</p>
                  </div>
                  <div v-if="game_id == 3">
                    <p class="data-round-p1 binbold">
                      {{
                        home_team.overview &&
                        toPercentage(home_team.overview.duration_gt_x_minute_rate)
                      }}%
                    </p>
                    <p class="data-round-p2">游戏时长>19</p>
                  </div>
  
                  <!-- DOTA2 -->
                  <div v-if="game_id == 4">
                    <p class="data-round-p1 binbold">
                      {{ home_team.overview && toPercentage(home_team.overview.kill_gt_x_rate) }}%
                    </p>
                    <p class="data-round-p2">总击杀>47.5</p>
                  </div>
                  <div v-if="game_id == 4">
                    <p class="data-round-p1 binbold">
                      {{
                        home_team.overview &&
                        toPercentage(home_team.overview.duration_gt_x_minute_rate)
                      }}%
                    </p>
                    <p class="data-round-p2">游戏时长>35</p>
                  </div>
                </div>
              </div>
              <div class="battle-data-spacing" v-else>
                <DfEmpty />
              </div>
            </div>
          </div>
          <div class="con-right">
            <div class="old-con">
              <div class="data-con pb0">
                <div class="data-tit">
                  <i></i>
                  <span class="ml5">交手/比赛记录</span>
                  <div class="data-tit-tab">
                    <span @click="tit_tab(1)" :class="tab_switch == 1 ? 'on' : ''">大局</span>
                    <span @click="tit_tab(2)" :class="tab_switch == 2 ? 'on' : ''">小局</span>
                  </div>
                </div>
              </div>
  
              <!-- 历史交手-大局 -->
              <div v-show="tabNum == 1 && tab_switch == 1" class="divScroll">
                <DfEmpty v-if="!match_stats || !match_stats.length" />
                <div class="game-record" v-if="match_stats && match_stats.length">
                  <div class="game-record-left">
                    <p class="bankSans">
                      {{ home_team.meta && (home_team.meta.abbr || home_team.meta.name) }}
                    </p>
                    <div class="game-record-desc binbold">
                      <img src="/static/images/marz/431342eb-37eb-451e-8c72-3b8384a63e55_18_18.png" />
                      <span>{{ home_team.overview && home_team.overview.win }}</span>
                      <img src="/static/images/marz/aea767e6-b57f-48cd-bf93-9c70aadd58de_18_18.png" />
                      <span>{{ home_team.overview && home_team.overview.lose }}</span>
                      <img src="/static/images/marz/cb39697d-09d0-4808-8dfb-0cb08f819bb0_28_28.png" />
                      <span
                        >{{ home_team.overview && toPercentage(home_team.overview.win_rate) }}%</span
                      >
                    </div>
                  </div>
                  <div class="game-record-right">
                    <p class="bankSans">
                      {{ away_team.meta && (away_team.meta.abbr || away_team.meta.name) }}
                    </p>
                    <div class="game-record-desc binbold">
                      <img src="/static/images/marz/cb39697d-09d0-4808-8dfb-0cb08f819bb0_28_28.png" />
                      <span
                        >{{ away_team.overview && toPercentage(away_team.overview.win_rate) }}%</span
                      >
                      <img src="/static/images/marz/aea767e6-b57f-48cd-bf93-9c70aadd58de_18_18.png" />
                      <span>{{ away_team.overview && away_team.overview.lose }}</span>
                      <img src="/static/images/marz/431342eb-37eb-451e-8c72-3b8384a63e55_18_18.png" />
                      <span>{{ away_team.overview && away_team.overview.win }}</span>
                    </div>
                  </div>
                </div>
                <div
                  class="data-con"
                  v-for="(item, index) in match_stats"
                  :key="'match_stats-' + index"
                >
                  <p class="game-record-tit">{{ item.league.name }}</p>
                  <div class="game-record-item" v-for="(item2, index2) in item.matches" :key="index2">
                    <div class="game-record-div">
                      <div class="game-record-name">BO{{ item2.bo }}</div>
                      <div class="game-record-img">
                        <div class="game-record-img-box">
                          <img
                            :src="item2.teams[0].meta.logo || defaultImage"
                            @error="(e) => (e.target as HTMLImageElement).src=defaultImage"
                          />
                        </div>
                        <span
                          :class="[item2.win_team == item2.teams[0].meta.id ? 'on' : '', 'bankSans']"
                          >{{ item2.teams[0].meta.abbr || item2.teams[0].meta.name }}</span
                        >
                        <img
                          v-if="item2.win_team == item2.teams[0].meta.id"
                          class="icon-sheng"
                          src="/static/images/marz/icon-sheng.png"
                        />
                      </div>
                      <div
                        :class="[
                          item2.win_team == item2.teams[0].meta.id ? 'on' : '',
                          'game-record-cs bankSans'
                        ]"
                      >
                        {{ item2.teams[0].Score }}
                      </div>
                      <div class="game-record-gl binbold">
                        <span v-if="item2.teams[0].win_rate == 0">-</span>
                        <span v-if="item2.teams[0].win_rate != 0"
                          >{{ toPercentage(item2.teams[0].win_rate) }}%</span
                        >
                      </div>
                    </div>
                    <div class="game-record-div">
                      <div class="game-record-time">
                        {{ formatTime(item2.start_time, 'yyyy-MM-dd') }}
                      </div>
                      <div class="game-record-img">
                        <div class="game-record-img-box">
                          <img
                            :src="item2.teams[1].meta.logo || defaultImage"
                            @error="(e) => (e.target as HTMLImageElement).src=defaultImage"
                          />
                        </div>
                        <span
                          :class="[item2.win_team == item2.teams[1].meta.id ? 'on' : '', 'bankSans']"
                          >{{ item2.teams[1].meta.abbr || item2.teams[1].meta.name }}</span
                        >
                        <img
                          v-if="item2.win_team == item2.teams[1].meta.id"
                          class="icon-sheng"
                          src="/static/images/marz/icon-sheng.png"
                        />
                      </div>
                      <div
                        :class="[
                          item2.win_team == item2.teams[1].meta.id ? 'on' : '',
                          'game-record-cs bankSans'
                        ]"
                      >
                        {{ item2.teams[1].Score }}
                      </div>
                      <div class="game-record-gl binbold">
                        <span v-if="item2.teams[1].win_rate == 0">-</span>
                        <span v-if="item2.teams[1].win_rate != 0"
                          >{{ toPercentage(item2.teams[1].win_rate) }}%</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 历史交手-小局 -->
              <div v-show="tabNum == 1 && tab_switch == 2" class="divScroll">
                <DfEmpty v-if="!race_stats" />
                <div class="data-con" v-if="race_stats">
                  <div v-for="(item, index) in race_stats" :key="index">
                    <div class="data-record">
                      <div class="data-record-ranks">
                        <span
                          :class="[item.win_team == item.competitor.id ? '' : 'on', 'bankSans']"
                          >{{ home_team.meta && (home_team.meta.abbr || home_team.meta.name) }}</span
                        >
                        <img src="/static/images/marz/icon-vs.png" />
                        <span
                          :class="[item.win_team == item.competitor.id ? 'on' : '', 'bankSans']"
                          >{{ item.competitor.abbr || item.competitor.name }}</span
                        >
                      </div>
                      <div class="data-record-time">
                        {{ formatTime(item.start_time, 'yyyy-MM-dd') }}
                        {{ item.league.name }}
                      </div>
                    </div>
                    <div class="data-record-item" v-for="(item2, index2) in item.stats" :key="index2">
                      <template v-if="item2">
                        <div class="record-item-name">
                          <img
                            v-if="game_id == 2"
                            src="https://static.marsesport.com/images/ce0e65da-571e-4f15-8325-b2b50c682c71_28_28.png"
                          />
                          <img v-else src="/static/images/marz/clock2.png" />
                          <span v-if="game_id == 2">{{ item2.map && item2.map.name }}</span>
                          <span v-if="game_id != 2">{{ formatSeconds(item2.duration) }}</span>
                        </div>
                        <div class="record-item-num bankSans">
                          <div v-if="game_id == 2">
                            <span :class="item2.score > item2.competitor_score ? 'on' : ''">{{
                              item2.score
                            }}</span>
                            :
                            <span :class="item2.score > item2.competitor_score ? '' : 'on'">{{
                              item2.competitor_score
                            }}</span>
                          </div>
                          <div v-if="game_id != 2">
                            <span :class="item2.win == true ? 'on' : ''">{{ item2.kill }}</span>
                            :
                            <span :class="item2.win == true ? '' : 'on'">{{
                              item2.competitor_kill
                            }}</span>
                          </div>
                        </div>
                        <div class="record-item-desc">
                          <!-- CSGO -->
                          <div class="record-item-desc-box" v-if="game_id == 2">
                            <div
                              :class="[item2.f5_k == true ? 'on' : '', 'desc-icon icon-5-csgo']"
                            ></div>
                            <div
                              :class="[item2.f10_k == true ? 'on' : '', 'desc-icon icon-10-csgo']"
                            ></div>
                            <div
                              :class="[item2.r1_win == true ? 'on' : '', 'desc-icon icon-shouqiang1']"
                            ></div>
                            <div
                              :class="[
                                item2.r16_win == true ? 'on' : '',
                                'desc-icon icon-shouqiang16'
                              ]"
                            ></div>
                          </div>
                          <!-- moba -->
                          <div class="record-item-desc-box" v-if="game_id != 2">
                            <div
                              :class="[item2.first_blood == true ? 'on' : '', 'desc-icon icon-1xue']"
                            ></div>
                            <div
                              :class="[item2.first_turret == true ? 'on' : '', 'desc-icon icon-1ta']"
                            ></div>
                            <div
                              :class="[item2.f5_k == true ? 'on' : '', 'desc-icon icon-5sha']"
                            ></div>
                            <div
                              :class="[item2.f10_k == true ? 'on' : '', 'desc-icon icon-10sha']"
                            ></div>
                            <!-- dota 不统计大龙小龙-->
                            <div
                              v-if="game_id != 4"
                              :class="[
                                item2.first_dragon == true ? 'on' : '',
                                'desc-icon icon-xiaolong'
                              ]"
                            ></div>
                            <div
                              v-if="game_id != 4"
                              :class="[
                                item2.first_baron == true ? 'on' : '',
                                'desc-icon icon-dalong'
                              ]"
                            ></div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- 近期交手-大局 -->
              <div v-show="tabNum == 2 && tab_switch == 1" class="divScroll">
                <DfEmpty v-if="!home_team.match_stats.length && !away_team.match_stats.length" />
                <!-- 近期数据-比赛记录 -->
                <!-- 近期数据-比赛记录-主队 -->
                <div class="old-list-tit tit-blue" v-if="home_team.match_stats.length">
                  <div class="flex-y-center">
                    <img
                      class="icon"
                      :src="
                        (home_team.meta && home_team.meta.logo) ||
                        'https://dev-img.marzesport.cn/default/default.png'
                      "
                    />
                    <span class="bankSans">{{
                      home_team.meta && (home_team.meta.abbr || home_team.meta.name)
                    }}</span>
                  </div>
                  <div class="game-record-desc binbold">
                    <img src="/static/images/marz/756de3d3-7889-4cfd-a213-a2eb32d4aa26_18_18.png" />
                    <span>{{ home_team.overview && home_team.overview.win }}</span>
                    <img src="/static/images/marz/e999ed21-82d2-4c25-9328-744d64430be5_28_28.png" />
                    <span>{{ home_team.overview && home_team.overview.lose }}</span>
                    <img src="/static/images/marz/cb39697d-09d0-4808-8dfb-0cb08f819bb0_28_28.png" />
                    <span
                      >{{ home_team.overview && toPercentage(home_team.overview.win_rate) }}%</span
                    >
                  </div>
                </div>
                <div
                  class="data-con bg-white"
                  v-for="(item, index) in home_team.match_stats"
                  :key="'match_stats-' + index"
                >
                  <p class="game-record-tit">{{ item.league.name }}</p>
                  <div
                    class="game-record-item bg-grey"
                    v-for="(item2, index2) in item.matches"
                    :key="'matches-' + index2"
                  >
                    <div class="game-record-div">
                      <div class="game-record-name">BO{{ item2.bo }}</div>
                      <div class="game-record-img">
                        <div class="game-record-img-box 123">
                          <img
                            :src="item2.teams[0].meta.logo || defaultImage"
                            @error="(e) => (e.target as HTMLImageElement).src=defaultImage"
                          />
                        </div>
                        <span
                          :class="[item2.win_team == item2.teams[0].meta.id ? 'on' : '', 'bankSans']"
                          >{{ item2.teams[0].meta.abbr || item2.teams[0].meta.name }}</span
                        >
                        <img
                          v-if="item2.win_team == item2.teams[0].meta.id"
                          class="icon-sheng"
                          src="/static/images/marz/icon-sheng.png"
                        />
                      </div>
                      <div
                        :class="[
                          item2.win_team == item2.teams[0].meta.id ? 'on' : '',
                          'game-record-cs bankSans'
                        ]"
                      >
                        {{ item2.teams[0].Score }}
                      </div>
                      <div class="game-record-gl binbold">
                        <span v-if="item2.teams[0].win_rate == 0">-</span>
                        <span v-if="item2.teams[0].win_rate != 0"
                          >{{ toPercentage(item2.teams[0].win_rate) }}%</span
                        >
                      </div>
                    </div>
                    <div class="game-record-div">
                      <div class="game-record-time">
                        {{ formatTime(item2.start_time, 'yyyy-MM-dd') }}
                      </div>
                      <div class="game-record-img">
                        <div class="game-record-img-box">
                          <img
                            :src="item2.teams[1].meta.logo || defaultImage"
                            @error="(e) => (e.target as HTMLImageElement).src=defaultImage"
                          />
                        </div>
                        <span
                          :class="[item2.win_team == item2.teams[1].meta.id ? 'on' : '', 'bankSans']"
                          >{{ item2.teams[1].meta.abbr || item2.teams[1].meta.name }}</span
                        >
                        <img
                          v-if="item2.win_team == item2.teams[1].meta.id"
                          class="icon-sheng"
                          src="/static/images/marz/icon-sheng.png"
                        />
                      </div>
                      <div
                        :class="[
                          item2.win_team == item2.teams[1].meta.id ? 'on' : '',
                          'game-record-cs bankSans'
                        ]"
                      >
                        {{ item2.teams[1].Score }}
                      </div>
                      <div class="game-record-gl binbold">
                        <span v-if="item2.teams[1].win_rate == 0">-</span>
                        <span v-if="item2.teams[1].win_rate != 0"
                          >{{ toPercentage(item2.teams[1].win_rate) }}%</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 近期数据-比赛记录-客队 -->
                <div class="old-list-tit tit-red" v-if="away_team.match_stats.length">
                  <div class="flex-y-center">
                    <img
                      class="icon"
                      :src="
                        (away_team.meta && away_team.meta.logo) ||
                        'https://dev-img.marzesport.cn/default/default.png'
                      "
                    />
                    <span class="binbold">{{
                      away_team.meta && (away_team.meta.abbr || away_team.meta.name)
                    }}</span>
                  </div>
                  <div class="game-record-desc binbold">
                    <img src="/static/images/marz/756de3d3-7889-4cfd-a213-a2eb32d4aa26_18_18.png" />
                    <span>{{ away_team.overview && away_team.overview.win }}</span>
                    <img src="/static/images/marz/e999ed21-82d2-4c25-9328-744d64430be5_28_28.png" />
                    <span>{{ away_team.overview && away_team.overview.lose }}</span>
                    <img src="/static/images/marz/cb39697d-09d0-4808-8dfb-0cb08f819bb0_28_28.png" />
                    <span
                      >{{ away_team.overview && toPercentage(away_team.overview.win_rate) }}%</span
                    >
                  </div>
                </div>
                <div
                  class="data-con bg-white"
                  v-for="(item, index) in away_team.match_stats"
                  :key="index"
                >
                  <p class="game-record-tit">{{ item.league.name }}</p>
                  <div
                    class="game-record-item bg-grey"
                    v-for="(item2, index2) in item.matches"
                    :key="index2"
                  >
                    <div class="game-record-div">
                      <div class="game-record-name">BO{{ item2.bo }}</div>
                      <div class="game-record-img">
                        <div class="game-record-img-box">
                          <img
                            :src="item2.teams[0].meta.logo || defaultImage"
                            @error="(e) => (e.target as HTMLImageElement).src=defaultImage"
                          />
                        </div>
                        <span
                          :class="[item2.win_team == item2.teams[0].meta.id ? 'on' : '', 'bankSans']"
                          >{{ item2.teams[0].meta.abbr || item2.teams[0].meta.name }}</span
                        >
                        <img
                          v-if="item2.win_team == item2.teams[0].meta.id"
                          class="icon-sheng"
                          src="/static/images/marz/icon-sheng.png"
                        />
                      </div>
                      <div
                        :class="[
                          item2.win_team == item2.teams[0].meta.id ? 'on' : '',
                          'game-record-cs bankSans'
                        ]"
                      >
                        {{ item2.teams[0].Score }}
                      </div>
                      <div class="game-record-gl binbold">
                        <span v-if="item2.teams[0].win_rate == 0">-</span>
                        <span v-if="item2.teams[0].win_rate != 0"
                          >{{ toPercentage(item2.teams[0].win_rate) }}%</span
                        >
                      </div>
                    </div>
                    <div class="game-record-div">
                      <div class="game-record-time">
                        {{ formatTime(item2.start_time, 'yyyy-MM-dd') }}
                      </div>
                      <div class="game-record-img">
                        <div class="game-record-img-box">
                          <img
                            :src="item2.teams[1].meta.logo || defaultImage"
                            @error="(e) => (e.target as HTMLImageElement).src=defaultImage"
                          />
                        </div>
                        <span
                          :class="[item2.win_team == item2.teams[1].meta.id ? 'on' : '', 'bankSans']"
                          >{{ item2.teams[1].meta.abbr || item2.teams[1].meta.name }}</span
                        >
                        <img
                          v-if="item2.win_team == item2.teams[1].meta.id"
                          class="icon-sheng"
                          src="/static/images/marz/icon-sheng.png"
                        />
                      </div>
                      <div
                        :class="[
                          item2.win_team == item2.teams[1].meta.id ? 'on' : '',
                          'game-record-cs bankSans'
                        ]"
                      >
                        {{ item2.teams[1].Score }}
                      </div>
                      <div class="game-record-gl binbold">
                        <span v-if="item2.teams[1].win_rate == 0">-</span>
                        <span v-if="item2.teams[1].win_rate != 0"
                          >{{ toPercentage(item2.teams[1].win_rate) }}%</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- 近期交手-小局 -->
              <div v-show="tabNum == 2 && tab_switch == 2" class="divScroll">
                <DfEmpty v-if="!home_team.match_stats && !away_team.match_stats" />
                <!-- 近期数据详情 -主队 -->
                <div class="old-data-tit" v-if="home_team.race_stats">
                  <img
                    :src="
                      (home_team.meta && home_team.meta.logo) ||
                      'https://dev-img.marzesport.cn/default/default.png'
                    "
                  />
                  <span class="bankSans">{{
                    home_team.meta && (home_team.meta.abbr || home_team.meta.name)
                  }}</span>
                </div>
                <div class="old-data-con">
                  <div v-for="(item, index) in home_team.race_stats" :key="'race_stats-' + index">
                    <div class="data-record">
                      <div class="data-record-ranks">
                        <span
                          :class="[item.win_team == item.competitor.id ? '' : 'on', 'bankSans']"
                          >{{ home_team.meta && (home_team.meta.abbr || home_team.meta.name) }}</span
                        >
                        <img src="/static/images/marz/icon-vs.png" />
                        <span
                          :class="[item.win_team == item.competitor.id ? 'on' : '', 'bankSans']"
                          >{{ item.competitor.abbr || item.competitor.name }}</span
                        >
                      </div>
                      <div class="data-record-time">
                        {{ formatTime(item.start_time, 'yyyy-MM-dd') }}
                        {{ item.league.name }}
                      </div>
                    </div>
  
                    <div
                      class="data-record-item"
                      v-for="(item2, index2) in item.stats"
                      :key="'stats-' + index2"
                    >
                      <template v-if="item2">
                        <div class="record-item-name">
                          <img
                            v-if="game_id == 2"
                            src="https://static.marsesport.com/images/ce0e65da-571e-4f15-8325-b2b50c682c71_28_28.png"
                          />
                          <img
                            v-else
                            src="/static/images/marz/e999ed21-82d2-4c25-9328-744d64430be5_28_28.png"
                          />
                          <span v-if="game_id == 2">{{ item2.map && item2.map.name }}</span>
                          <span v-if="game_id != 2">{{ formatSeconds(item2.duration) }}</span>
                        </div>
                        <div class="record-item-num bankSans">
                          <div v-if="game_id == 2">
                            <span :class="item2.score > item2.competitor_score ? 'on' : ''">{{
                              item2.score
                            }}</span
                            >:<span :class="item2.score > item2.competitor_score ? '' : 'on'">{{
                              item2.competitor_score
                            }}</span>
                          </div>
                          <div v-if="game_id != 2">
                            <!-- {{item.win_team}}+{{item.competitor.id}} -->
                            <span :class="item.win_team == item.competitor.id ? '' : 'on'">{{
                              item2.kill
                            }}</span
                            >:<span :class="item.win_team == item.competitor.id ? 'on' : ''">{{
                              item2.competitor_kill
                            }}</span>
                          </div>
                        </div>
                        <div class="record-item-desc">
                          <!-- CSGO -->
                          <div class="record-item-desc-box" v-if="game_id == 2">
                            <div
                              :class="[item2.f5_k == true ? 'on' : '', 'desc-icon icon-5-csgo']"
                            ></div>
                            <div
                              :class="[item2.f10_k == true ? 'on' : '', 'desc-icon icon-10-csgo']"
                            ></div>
                            <div
                              :class="[item2.r1_win == true ? 'on' : '', 'desc-icon icon-shouqiang1']"
                            ></div>
                            <div
                              :class="[
                                item2.r16_win == true ? 'on' : '',
                                'desc-icon icon-shouqiang16'
                              ]"
                            ></div>
                          </div>
                          <!-- moba -->
                          <div class="record-item-desc-box" v-if="game_id != 2">
                            <div
                              :class="[item2.first_blood == true ? 'on' : '', 'desc-icon icon-1xue']"
                            ></div>
                            <div
                              :class="[item2.first_turret == true ? 'on' : '', 'desc-icon icon-1ta']"
                            ></div>
                            <div
                              :class="[item2.f5_k == true ? 'on' : '', 'desc-icon icon-5sha']"
                            ></div>
                            <div
                              :class="[item2.f10_k == true ? 'on' : '', 'desc-icon icon-10sha']"
                            ></div>
                            <!-- dota 不统计大龙小龙-->
                            <div
                              v-if="game_id != 4"
                              :class="[
                                item2.first_dragon == true ? 'on' : '',
                                'desc-icon icon-xiaolong'
                              ]"
                            ></div>
                            <div
                              v-if="game_id != 4"
                              :class="[
                                item2.first_baron == true ? 'on' : '',
                                'desc-icon icon-dalong'
                              ]"
                            ></div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
  
                <!-- 近期数据详情 -客队 -->
                <div class="old-data-tit" v-if="away_team.race_stats">
                  <img
                    :src="
                      (away_team.meta && away_team.meta.logo) ||
                      'https://dev-img.marzesport.cn/default/default.png'
                    "
                  />
                  <span class="bankSans">{{ away_team.meta && away_team.meta.name }}</span>
                </div>
                <div class="old-data-con">
                  <div v-for="(item, index) in away_team.race_stats" :key="'race_stats-' + index">
                    <div class="data-record">
                      <div class="data-record-ranks">
                        <span
                          :class="[item.win_team == item.competitor.id ? '' : 'on', 'bankSans']"
                          >{{ away_team.meta && (away_team.meta.abbr || away_team.meta.name) }}</span
                        >
                        <img src="/static/images/marz/icon-vs.png" />
                        <span
                          :class="[item.win_team == item.competitor.id ? 'on' : '', 'bankSans']"
                          >{{ item.competitor.abbr || item.competitor.name }}</span
                        >
                      </div>
                      <div class="data-record-time">
                        {{ formatTime(item.start_time, 'yyyy-MM-dd') }}
                        {{ item.league.name }}
                      </div>
                    </div>
  
                    <div
                      class="data-record-item"
                      v-for="(item2, index) in item.stats"
                      :key="'stats-' + index"
                    >
                      <template v-if="item2">
                        <div class="record-item-name">
                          <img
                            v-if="game_id == 2"
                            src="https://static.marsesport.com/images/ce0e65da-571e-4f15-8325-b2b50c682c71_28_28.png"
                          />
                          <img
                            v-else
                            src="/static/images/marz/e999ed21-82d2-4c25-9328-744d64430be5_28_28.png"
                          />
                          <span v-if="game_id == 2">{{ item2.map && item2.map.name }}</span>
                          <span v-if="game_id != 2">{{ formatSeconds(item2.duration) }}</span>
                        </div>
                        <div class="record-item-num bankSans">
                          <div v-if="game_id == 2">
                            <span :class="item2.score > item2.competitor_score ? 'on' : ''">{{
                              item2.score
                            }}</span
                            >:<span :class="item2.score > item2.competitor_score ? '' : 'on'">{{
                              item2.competitor_score
                            }}</span>
                          </div>
                          <div v-if="game_id != 2">
                            <span :class="item2.win == true ? 'on' : ''">{{ item2.kill }}</span
                            >:<span :class="item2.win == true ? '' : 'on'">{{
                              item2.competitor_kill
                            }}</span>
                          </div>
                        </div>
                        <div class="record-item-desc">
                          <!-- CSGO -->
                          <div class="record-item-desc-box" v-if="game_id == 2">
                            <div
                              :class="[item2.f5_k == true ? 'on' : '', 'desc-icon icon-5-csgo']"
                            ></div>
                            <div
                              :class="[item2.f10_k == true ? 'on' : '', 'desc-icon icon-10-csgo']"
                            ></div>
                            <div
                              :class="[item2.r1_win == true ? 'on' : '', 'desc-icon icon-shouqiang1']"
                            ></div>
                            <div
                              :class="[
                                item2.r16_win == true ? 'on' : '',
                                'desc-icon icon-shouqiang16'
                              ]"
                            ></div>
                          </div>
                          <!-- moba -->
                          <div class="record-item-desc-box" v-if="game_id != 2">
                            <div
                              :class="[item2.first_blood == true ? 'on' : '', 'desc-icon icon-1xue']"
                            ></div>
                            <div
                              :class="[item2.first_turret == true ? 'on' : '', 'desc-icon icon-1ta']"
                            ></div>
                            <div
                              :class="[item2.f5_k == true ? 'on' : '', 'desc-icon icon-5sha']"
                            ></div>
                            <div
                              :class="[item2.f10_k == true ? 'on' : '', 'desc-icon icon-10sha']"
                            ></div>
                            <!-- dota 不统计大龙小龙-->
                            <div
                              v-if="game_id != 4"
                              :class="[
                                item2.first_dragon == true ? 'on' : '',
                                'desc-icon icon-xiaolong'
                              ]"
                            ></div>
                            <div
                              v-if="game_id != 4"
                              :class="[
                                item2.first_baron == true ? 'on' : '',
                                'desc-icon icon-dalong'
                              ]"
                            ></div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="gaming-forward-analysis no_data" v-else>
        <DfEmpty />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { formatSeconds, averageTime, formatTime2 as formatTime } from '@/utils'
  import { getMatchRecent, getMatchFight } from '@/api/game'
  import { getImageUrl } from '@/utils/common.js'
  
  interface TeamDataModel {
    [key: string]: any
  }
  
  defineOptions({
    name: 'GamingAnalysis',
    inheritAttrs: true
  })
  
  const props = defineProps({
    gameId: {
      type: Number,
      default: 0
    },
    matchId: {
      type: Number,
      default: 0
    }
  })

  const defaultImage = '/static/images/theme/personalCenter/default_avatar.png'
  
  // 主队
  const home_team = ref<TeamDataModel>({})
  // 客队
  const away_team = ref<TeamDataModel>({})
  // 交手记录
  const race_stats = ref([])
  // 比赛记录
  const match_stats = ref([])
  const game_id = ref(0)
  const match_id = ref(0)
  // const mockData = ref('')
  
  // watch(
  //   () => props.gameId,
  //   (id) => {
  //     game_id.value = id
  //     match_id.value = props.matchId
  //     if (id) getRecentData()
  //   }
  // )
  
  onMounted(() => {
    game_id.value = props.gameId
    match_id.value = props.matchId
    getRecentData()
  })
  
  // 切换历史交手/近期交手
  //  1 交手记录 2 近期数据
  const tabNum = ref(2)
  // 近期场次
  const match_num = ref(3)
  // 只看当前联赛
  const current_league_only = ref(false)
  const tab = (num) => {
    tabNum.value = num
    // 初始化场次
    match_num.value = 3
    // 初始化当前联赛
    current_league_only.value = false
    // 初始化当前联赛
    if (num == 1) {
      getFightData()
    } else {
      getRecentData()
    }
  }
  
  const requestResData = ref('')
  // 历史交手记录
  const getFightData = async () => {
    if (!game_id.value) return
    const params = {
      match_num: match_num.value,
      current_league_only: current_league_only.value ? 1 : 0,
      game_id: game_id.value,
      match_id: match_id.value
    }
    let { code, data } = (await getMatchFight(params)) as any
    // let { code, data } = match_fight
    if (code === 0) {
      if (!data && home_team.value?.overview) {
        data = requestResData.value
        data.home_team.overview.win_rate = ''
        data.away_team.overview.win_rate = ''
        data.home_team.match_stats = []
        data.away_team.match_stats = []
        data.race_stats = []
        data.match_stats = []
      } else {
        requestResData.value = data
      }
      // 兼容火星接口
      data?.match_stats?.forEach((msItem) => {
        msItem.matches.forEach((mItem) => {
          mItem.teams.forEach((tItem) => {
            tItem.meta = tItem.team_info
            tItem.Score = tItem.score
          })
        })
      })
      home_team.value = data?.home_team || ''
      away_team.value = data?.away_team || ''
      race_stats.value = data?.race_stats || []
      match_stats.value = data?.match_stats || []
    }
  }
  
  // 近期数据
  // const recentData = ref('')
  const getRecentData = async () => {
    if (!game_id.value) return
    const params = {
      match_num: match_num.value,
      current_league_only: current_league_only.value ? 1 : 0,
      game_id: game_id.value,
      match_id: match_id.value
    }
    let { code, data } = (await getMatchRecent(params)) as any
    // let { code, data } = match_recent
    if (code === 0) {
      // data = JSON.parse(JSON.stringify(data))
      if (!data && home_team.value?.overview) {
        data = requestResData.value
        data.home_team.overview.win_rate = ''
        data.away_team.overview.win_rate = ''
        data.home_team.match_stats = ''
        data.away_team.match_stats = ''
        data.race_stats = []
        data.match_stats = []
      } else {
        requestResData.value = data
      }
      // 兼容火星接口
      data?.home_team?.match_stats?.forEach((msItem) => {
        msItem.matches.forEach((mItem) => {
          mItem.teams.forEach((tItem) => {
            tItem.meta = tItem.team_info
            tItem.Score = tItem.score
          })
        })
      })
      data?.away_team?.match_stats?.forEach((msItem) => {
        msItem.matches.forEach((mItem) => {
          mItem.teams.forEach((tItem) => {
            tItem.meta = tItem.team_info
            tItem.Score = tItem.score
          })
        })
      })
  
      home_team.value = data.home_team || ''
      away_team.value = data.away_team || ''
      race_stats.value = []
      match_stats.value = []
    }
  }
  const selectNum = (e) => {
    match_num.value = e.target.value
    if (tabNum.value == 1) {
      getFightData()
    } else {
      getRecentData()
    }
  }
  const onlyGame = () => {
    current_league_only.value = !current_league_only.value
    if (tabNum.value == 1) {
      getFightData()
    } else {
      getRecentData()
    }
  }
  // 处理百分比
  const toPercentage = (num) => {
    if (!num) return 0
    return (Math.round(num * 10000) / 100).toFixed()
  }
  // 切换大局小局
  const tab_switch = ref(1)
  const tit_tab = (num) => {
    tab_switch.value = num
  }
  </script>
  
  <style scoped lang="scss">
  .gaming-forward-analysis {
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px;
      border-radius: 5px;
    }
    .con {
      .tab {
        display: block;
        position: relative;
        height: auto;
      }
    }
    .no_data {
      .text {
        text-align: center;
      }
    }
  }
  
  .blue {
    background: #d02d54;
  }
  
  .red {
    background: #025be8;
  }
  
  .grey {
    background: #f5f7fa;
  }
  
  .pb0 {
    padding-bottom: 0 !important;
  }
  
  .ml5 {
    margin-left: 5px;
  }
  
  .mr5 {
    margin-right: 5px;
  }
  
  .top {
    height: 90px;
    width: 100%;
  
    .top-box {
      display: flex;
      justify-content: space-between;
      margin: 0 15px;
      width: 100%;
  
      .top-desc {
        width: 60%;
      }
  
      .top-txt {
        margin-top: 10px;
        font-size: 12px;
        text-align: center;
        width: 80px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .top-img.borRed {
        border-color: rgba(255, 122, 122, 0.2);
      }
      .top-img {
        width: 37px;
        height: 37px;
        border: 2px solid rgba(216, 173, 102, 0.2);
        border-radius: 100%;
        .top-bor {
          width: 32px;
          height: 32px;
          border-radius: 100%;
          border: 2px solid rgba(216, 173, 102, 0.14);
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        img {
          @include imageStyle-cover;
        }
      }
    }
  
    .top-desc {
      .top-desc-txt {
        margin-bottom: 9px;
        text-align: center;
        display: flex;
  
        span {
          color: #606266;
          font-size: 12px;
        }
  
        .top-desc-img {
          width: 54px;
          height: 20px;
        }
      }
  
      .top-bar {
        height: 30px;
        line-height: 30px;
        width: 100%;
        display: flex;
  
        .top-bar-inner {
          border-radius: 2.97px;
          font-weight: bold;
          font-size: 12px;
          color: #fff;
          margin-right: 2px;
        }
  
        .top-bar-inner:first-child {
          padding-left: 15px;
          text-align: left;
        }
  
        .top-bar-inner:last-child {
          padding-right: 15px;
          text-align: right;
        }
      }
    }
  }
  
  .con-top {
    margin-top: 6px;
    .con-opt {
      height: 53px;
      line-height: 53px;
      margin: 0 27px;
      margin-top: 9px;
      display: flex;
      justify-content: space-between;
  
      .con-opt-num {
        font-size: 12px;
        color: var(--el-text-color-primary);
  
        .text {
          margin-right: 5px;
        }
  
        select {
          width: 82px;
          height: 32px;
          line-height: 32px;
          padding-left: 32px;
          border: 1px solid #bfc2cc;
          color: var(--el-text-color-primary);
          border-radius: 20px;
          outline: none;
          appearance: none;
          -moz-appearance: none;
          -webkit-appearance: none;
          /*在选择框的最右侧中间显示小箭头图片*/
          background: url(/static/images/marz/b0476c0f-23f9-4c7e-8210-20761919d5d2_14_14.png)
            no-repeat 60px center;
          background-size: 14px;
          cursor: pointer;
          option {
            cursor: pointer;
          }
        }
      }
  
      .con-checkbox {
        font-size: 12px;
        color: var(--el-text-color-primary);
        cursor: pointer;
        i {
          display: inline-block;
          vertical-align: middle;
          width: 14px;
          height: 14px;
          background: url(/static/images/marz/4bca03f1-8cb5-456f-8275-bbf956a3bb06_14_14.png)
            no-repeat center center;
          background-size: 100% 100%;
        }
  
        i.on {
          background: url(/static/images/marz/f81a4644-be54-4526-aee9-d848b3b47c51_14_14.png)
            no-repeat center center;
          background-size: 100% 100%;
        }
  
        span {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
  
  .con-box {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding: 0 10px;
    .con-left,
    .con-right {
      width: 100%;
    }
  }
  
  .data-con {
    margin-bottom: 12px;
    .battle-data-spacing {
      margin: 0 10px;
    }
    .data-tit {
      height: 54px;
      line-height: 54px;
      font-size: 12px;
      color: var(--el-text-color-primary);
      margin: 0 26px;
      position: relative;
      i {
        display: inline-block;
        height: 12px;
        width: 4px;
        background: var(--el-text-color-primary);
      }
      .data-tit-tab {
        position: absolute;
        right: 0;
        top: 0;
        height: 54px;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-size: 12px;
          color: #909399;
          display: inline-block;
          width: 78px;
          height: 32px;
          line-height: 32px;
          cursor: pointer;
        }
        span.on {
          color: #ffffff;
        }
        span:first-child {
          background: url(/static/images/marz/daju-bg.png) no-repeat center center;
          background-size: 100% 100%;
          margin-right: -20px;
          padding-left: 20px;
        }
        span:last-child {
          background: url(/static/images/marz/xiaoju-bg.png) no-repeat center center;
          background-size: 100% 100%;
          padding-left: 30px;
        }
        span:first-child.on {
          background: url(/static/images/marz/daju-bg-active.png) no-repeat center center;
          background-size: 100% 100%;
        }
        span:last-child.on {
          background: url(/static/images/marz/xiaoju-bg-active.png) no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }
  }
  
  .battle-data-con {
    .battle-data-ranks {
      display: flex;
      justify-content: center;
      align-items: center;
  
      .battle-data-vs {
        width: 26px;
        height: 26px;
        margin: 0 34px;
        text-align: center;
        color: #bfc2cc;
      }
  
      .battle-data-name:first-child {
        text-align: right;
      }
  
      .battle-data-name {
        font-size: 14px;
        width: 190px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
  
        .battle-data-img {
          display: inline-block;
          vertical-align: middle;
          width: 36px;
          height: 36px;
          border: 2px solid rgba(216, 173, 102, 0.2);
          border-radius: 100%;
          overflow: hidden;
          .battle-data-img-box {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
  
        .battle-data-img:first-child {
          margin-right: 7px;
          border: 2px solid rgba(255, 122, 122, 0.2);
        }
  
        .battle-data-img:last-child {
          margin-left: 7px;
        }
  
        img {
          border-radius: 100%;
          overflow: hidden;
        }
      }
    }
  
    .battle-data-num {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 18px;
      margin-bottom: 6px;
  
      .battle-data-cibox {
        display: flex;
        justify-content: center;
        align-items: center;
      }
  
      .battle-data-cibox:first-child {
        margin-right: 84px;
      }
  
      .battle-data-ci {
        span {
          display: inline-block;
          vertical-align: middle;
          color: var(--el-text-color-primary);
          font-size: 12px;
        }
  
        img {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          margin: 0 4px;
        }
      }
  
      .battle-data-ci:first-child {
        margin-right: 23px;
      }
    }
    .battle-data-list {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      > div {
        width: 100%;
      }
    }
    .battle-data-item {
      display: flex;
      align-items: center;
      margin-bottom: 17px;
      .battle-data-box {
        display: flex;
        width: 100%;
        span {
          position: relative;
          color: var(--el-text-color-primary);
          display: block;
          text-align: right;
          width: 50px;
          font-size: 12px;
        }
  
        span:last-child {
          text-align: left;
        }
      }
      .battle-data-sl {
        min-width: 70px;
        height: 26px;
        line-height: 26px;
        margin: 0 8px;
        text-align: center;
        text-align: justify;
        letter-spacing: -0.1em;
        font-size: 12px;
      }
  
      .battle-data-sl.justify {
        text-align: justify;
      }
  
      .battle-data-sl:after {
        content: '';
        display: inline-block;
        width: 100%;
      }
  
      .battle-data-bar {
        width: 100%;
        line-height: 26px;
        background: #f5f7fa;
        border-radius: 2.57px;
        position: relative;
  
        span {
          position: relative;
          z-index: 9;
          color: #ffffff;
          font-size: 12px;
        }
  
        .battle-data-bar-inner {
          border-radius: 2.57px;
          // background: #bfc2cc;
        }
  
        .battle-data-bar-inner.red {
          background: #025be8;
        }
  
        .battle-data-bar-inner.blue {
          background: #d02d54;
        }
      }
  
      .battle-data-bar-left {
        text-align: right;
        padding-right: 10px;
        margin-left: 5px;
      }
  
      .battle-data-bar-left .battle-data-bar-inner {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        background: #d02d54;
      }
  
      .battle-data-bar-right {
        text-align: left;
        padding-left: 10px;
        margin-right: 5px;
      }
  
      .battle-data-bar-right .battle-data-bar-inner {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: #025be8;
      }
    }
  }
  
  .data-round {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 95px;
    background: var(--el-fill-color-light);
  
    > div {
      flex: 1;
      text-align: center;
      position: relative;
    }
  
    > div:first-child:after {
      content: '';
      width: 1px;
      height: 26px;
      background: #ecf0f5;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  
    .data-round-p1 {
      font-weight: bold;
      font-size: 14px;
      color: var(--el-text-color-primary);
    }
  
    .data-round-p2 {
      font-size: 13px;
      color: var(--el-text-color-primary);
    }
  }
  
  .divScroll {
    margin: 0 26px;
    overflow: hidden;
    position: relative;
  }
  
  .game-record {
    display: flex;
    justify-content: space-between;
    align-items: center;
  
    .game-record-left,
    .game-record-right {
      width: 49%;
      height: 76px;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
  
    .game-record-left {
      padding-left: 16px;
      background-image: linear-gradient(80deg, #f79645 -150%, #ffffff 80%);
    }
  
    .game-record-right {
      padding-right: 16px;
      background-image: linear-gradient(90deg, #ffffff 20%, #fd8c8c 170%);
      text-align: right;
      .game-record-desc {
        justify-content: flex-end;
      }
    }
  
    .binbold {
      font-size: 15px;
      color: var(--el-text-color-primary);
    }
  
    .game-record-desc {
      margin-top: 12px;
      display: flex;
      align-items: center;
      img {
        width: 18px;
        height: 18px;
        display: inline-block;
        vertical-align: middle;
        color: var(--el-text-color-primary);
        font-size: 15px;
        margin-right: 4px;
      }
  
      span {
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
      }
  
      span:last-child {
        margin-right: 0;
      }
    }
  }
  
  .game-record-tit {
    font-size: 12px;
    color: var(--el-text-color-primary);
    padding: 9px 0;
  }
  
  .game-record-item {
    padding-left: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 10px;
  
    background: var(--el-fill-color-light);
    height: 94px;
  
    .game-record-div {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
    }
  
    .game-record-name {
      font-size: 12px;
      color: var(--el-text-color-primary);
      font-weight: 500;
      width: 110px;
    }
  
    .game-record-time {
      font-size: 12px;
      color: #909399;
      width: 110px;
    }
  
    .game-record-img {
      display: flex;
      align-items: center;
      width: 240px;
      .game-record-img-box {
        width: 30px;
        height: 30px;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        overflow: hidden;
      }
      img {
        width: 25px;
        border-radius: 100%;
      }
  
      .icon-sheng {
        width: 18px;
      }
  
      span {
        font-size: 12px;
        color: #909399;
        margin-left: 8px;
        margin-right: 18px;
      }
  
      span.on {
        color: #ff931d;
      }
    }
  
    .game-record-cs {
      font-size: 13px;
      color: #909399;
      width: 120px;
      text-align: center;
    }
  
    .game-record-cs.on {
      color: #ff931d;
    }
  
    .game-record-gl {
      font-size: 13px;
      color: var(--el-text-color-primary);
      font-weight: bold;
      position: relative;
      width: 120px;
      text-align: center;
    }
  
    .game-record-div:first-child .game-record-gl:after {
      content: '';
      position: absolute;
      left: 0;
      top: 10px;
      width: 1px;
      height: 30px;
      background: #edeff2;
    }
  }
  
  .game-record-item:last-child {
    margin-bottom: 0;
  }
  
  .data-record {
    margin: 5px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  
    .data-record-ranks {
      font-size: 13px;
      color: #909399;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
  
      img {
        width: 22px;
        height: 22px;
        margin: 0 18px;
      }
  
      .on {
        color: #ff931d;
      }
    }
  
    .data-record-time {
      font-size: 13px;
      color: #909399;
      flex: 1;
      text-align: right;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  
  .data-record-item:last-child {
    margin-bottom: 0;
  }
  
  .data-record-item {
    display: flex;
    align-items: center;
    height: 46px;
    background: var(--el-fill-color-light);
    padding-left: 11px;
    margin-bottom: 5px;
    position: relative;
  
    .record-item-name {
      display: flex;
      align-items: center;
      flex: 1;
      img {
        width: 13px;
      }
  
      span {
        width: 70px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 13px;
        color: var(--el-text-color-primary);
        margin-left: 3px;
      }
    }
  
    .record-item-num {
      font-size: 14px;
      color: #909399;
      flex: 1;
  
      .on {
        color: #ff931d;
      }
    }
  
    .record-item-desc {
      display: flex;
      align-items: center;
      justify-content: center;
  
      .record-item-desc-box {
        display: flex;
        align-items: center;
        justify-content: center;
  
        .desc-icon {
          width: 24px;
          height: 24px;
        }
  
        .icon-5-csgo {
          background: url(/static/images/marz/5shoot.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-10-csgo {
          background: url(/static/images/marz/10shoot.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-shouqiang1 {
          background: url(/static/images/marz/shouqiang1.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-shouqiang16 {
          background: url(/static/images/marz/shouqiang16.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-5-csgo.on {
          background: url(/static/images/marz/5shoot_active.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-10-csgo.on {
          background: url(/static/images/marz/10shoot_active.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-shouqiang1.on {
          background: url(/static/images/marz/shouqiang1_active.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-shouqiang16.on {
          background: url(/static/images/marz/shouqiang16_active.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-1xue {
          background: url(/static/images/marz/1xue.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-1ta {
          background: url(/static/images/marz/1ta.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-5sha {
          background: url(/static/images/marz/5sha.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-10sha {
          background: url(/static/images/marz/10sha.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-xiaolong {
          background: url(/static/images/marz/xiaolong.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-dalong {
          background: url(/static/images/marz/dalong.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-1xue.on {
          background: url(/static/images/marz/1xue_active.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-1ta.on {
          background: url(/static/images/marz/1ta_active.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-5sha.on {
          background: url(/static/images/marz/5sha_active.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-10sha.on {
          background: url(/static/images/marz/10sha_active.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-xiaolong.on {
          background: url(/static/images/marz/xiaolong_active.png) no-repeat center center;
          background-size: 100% 100%;
        }
  
        .icon-dalong.on {
          background: url(/static/images/marz/dalong_active.png) no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }
  }
  
  .old-data-tit {
    height: 54px;
    line-height: 54px;
    font-size: 12px;
    color: var(--el-text-color-primary);
    display: flex;
    align-items: center;
    background-image: linear-gradient(115deg, #999 -250%, #ffffff 100%);
  
    img {
      width: 30px;
      height: 30px;
      margin-right: 6px;
      margin-left: 14px;
      border-radius: 100%;
    }
  }
  
  .old-data-con {
    padding-bottom: 0.32rem;
  
    .data-record-item {
      background: var(--el-fill-color-light);
      padding: 0 11px;
    }
  }
  
  .tit-blue {
    background-image: linear-gradient(115deg, #f79645 -250%, #ffffff 100%);
  }
  
  .tit-red {
    background-image: linear-gradient(115deg, #fd8c8c -250%, #ffffff 100%);
  }
  
  .old-list-tit {
    height: 54px;
    line-height: 54px;
    font-size: 12px;
    color: var(--el-text-color-primary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  
    .icon {
      width: 30px;
      height: 30px;
      margin-right: 6px;
      margin-left: 14px;
      border-radius: 100%;
    }
  
    .game-record-desc {
      img {
        width: 18px;
        height: 18px;
        display: inline-block;
        vertical-align: middle;
        color: var(--el-text-color-primary);
        font-size: 12px;
        margin: 0 4px;
      }
  
      span {
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
      }
  
      span:last-child {
        margin-right: 10px;
      }
    }
  }
  
  .bg-white {
    background: var(--el-fill-color-lighter);
  }
  
  .bg-grey {
    background: var(--el-fill-color);
  }
  .no-data {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
      display: block;
      width: 233px;
    }
    p {
      margin-top: 6px;
      font-size: 12px;
      text-align: center;
      color: var(--el-text-color-primary);
    }
  }

  .reset-con-tab {
      margin: 0 18px;
      display: flex;
      cursor: pointer;
      border: 1px solid #bfc2cc;
      border-radius: 6px;
      height: 24px;
      line-height: 24px;
  
      span {
        width: 50%;
        font-size: 12px;
        color: var(--el-text-color-primary);
        text-align: center;
        border: 1px solid transparent;
        border-radius: 6px;
        height: 24px;
        line-height: 24px;
        position: relative;
        top: -1px;
        left: -1px;
      }
      span:last-child {
        left: 1px;
      }
      span.on {
        border: 1px solid #855c2b;
        background: #d02d54;
        color: #fff;
      }
    }
  </style>
  