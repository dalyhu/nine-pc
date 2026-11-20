<!-- 篮球资料库 -->
<template>
  <div class="database-page">
    <div class="database-bg"></div>
    <div class="database-content clearfix">
      <div class="breadcrumb" style="margin: 2px 0px 22px">
        <span class="adress">当前位置： </span>
        <span class="breadcrumb-link"
          ><span class="no-link">首页</span> <span class="breadcrumb-arrow">&gt;</span></span
        ><span class="breadcrumb-link">
          <!--					<a href="/database/basketball/580/1/234147">-->
          篮球资料库
          <!--          </a>-->
          <span class="breadcrumb-arrow">&gt;</span></span
        >
        <span class="breadcrumb-title">{{ details.info.name }}</span>
      </div>
      <div class="database-left">
        <div>
          <div>
            <div class="database-left-box">
              <div class="database-left-content-all">
                <!-- 热门赛事-->
                <div v-for="item in hotList" :key="item.id + '-only'">
                  <div class="database-left-item" @click="getAouth(item)">
                    <div class="database-left-desc">
                      <div class="menu-title">
                        <img class="menu-title-img" />
                        {{ item.name }}
                      </div>
                      <img
                        :src="
                          getImageUrl(
                            !item.check
                              ? '/static/images/database-down.png'
                              : '/static/images/database-up.png'
                          )
                        "
                      />
                    </div>
                  </div>
                  <div class="sub-menu-title" v-if="item.check">
                    <li
                      class="sub-menu-title-item"
                      @click="setCompetition(item1)"
                      :class="{ active: item1.id == selectId && item1.type == 1 }"
                      v-for="(item1, index1) in item.list"
                      :key="index1"
                    >
                      <div class="sub-title-img-box">
                        <img class="sub-title-img" :src="item1.logo || teamLogo" />
                      </div>
                      <span class="sub-menu-title-name text-clamp">{{ item1.name }}</span>
                      <!-- yes-attention 已关注 -->
                      <i
                        class="icon_attention"
                        @click.stop="getAttention(item1)"
                        :class="
                          hotList[0].list.indexOf(item1) == -1 ? 'no-attention' : 'yes-attention'
                        "
                      ></i>
                    </li>
                  </div>
                </div>
                <!-- 一级 -->
                <div v-for="(item, index) in title" @click="setCheck(item, index)" :key="index">
                  <div class="database-left-item">
                    <div class="database-left-desc">
                      <div class="menu-title">
                        <img class="menu-title-img" />
                        {{ item.name_zh }}
                      </div>
                      <img
                        :src="
                          getImageUrl(
                            !item.check
                              ? '/static/images/database-down.png'
                              : '/static/images/database-up.png'
                          )
                        "
                      />
                    </div>
                  </div>
                  <!-- 二级 -->
                  <div class="sub-menu-title" v-if="item.check">
                    <ul>
                      <!-- 国际赛程（没有三级） -->
                      <!-- <li class="sub-menu-title-item" v-for="(item1,index1) in item.children"
												@click.stop="setChildrenCheck(item,item1,index1)">
												<div class="sub-title-img-box">
													<img class="sub-title-img"
														src="https://sta-prod-score.zkreen.com/league/20160525/20160525164844588_280x280.png?x-image-process=image/format,webp"
														 >
												</div>

												<span class="sub-menu-title-name">{{item.name}}</span><i
													class="yes-attention"></i>
											</li> -->
                      <!-- 三级 -->
                      <li
                        class="country-group"
                        v-for="(item1, index1) in item.children"
                        :key="index1"
                        @click.stop="setChildrenCheck(item, item1, index1, index)"
                      >
                        <div class="country-group-wrap">
                          <span :class="!item1.check ? 'plus-icon' : 'less-icon'"></span>
                          <img class="country-logo" :src="item1.logo" /><span class="name ellipsis"
                            >{{ item1.name_zh }}
                          </span>
                        </div>
                        <!-- 四级 -->
                        <ul v-if="item1.check" class="ellipsis" style="width: 100px">
                          <li
                            class="country-group group"
                            :class="{ active: item2.id == selectId }"
                            v-for="item2 in item1.children"
                            :key="item2.id"
                          >
                            <span
                              @click.stop="setCompetition(item2)"
                              class="name ellipsis"
                              style="width: 80px; display: block"
                              >{{ item2.name_zh }}</span
                            >
                            <i
                              @click.stop="getAttention(item2)"
                              :class="
                                hotList[0].list.indexOf(item2) == -1
                                  ? 'no-attention'
                                  : 'yes-attention'
                              "
                            ></i>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="database-right">
        <div class="database-right-top">
          <div class="info" v-if="details.info">
            <img :src="details.info.logo || teamLogo" />
            <div class="basketball-info">
              <div id="name">
                <span class="name">{{ details.info.name }}</span>
              </div>
              <div class="sub-name">{{ details.info.name_en }}</div>
              <div class="team-info"></div>
            </div>
          </div>
          <div class="ant-select seasons-select ant-select-focused ant-select-single">
            <el-select v-model="selectValue" placeholder="请选择" @change="setSelect">
              <el-option
                v-for="item in details.season"
                :key="item.id"
                :label="item.season_name + '赛季'"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="database-right-main" style="background: rgb(255, 255, 255)">
          <div class="ant-tabs ant-tabs-top">
            <div role="tablist" class="ant-tabs-nav">
              <div class="ant-tabs-nav-wrap flex">
                <div class="ant-tabs-nav-list flex" style="transform: translate(0px, 0px)">
                  <div
                    class="ant-tabs-tab"
                    :class="tabindex == index ? 'ant-tabs-tab-active' : ''"
                    @click="tabindex = index"
                    v-for="(item, index) in tabList"
                    :key="index"
                  >
                    <div
                      role="tab"
                      aria-selected="true"
                      class="ant-tabs-tab-btn"
                      tabindex="0"
                      id="rc-tabs-0-tab-1"
                      aria-controls="rc-tabs-0-panel-1"
                    >
                      {{ item }}
                    </div>
                  </div>

                  <div
                    class="ant-tabs-ink-bar ant-tabs-ink-bar-animated"
                    style="left: 0px; width: 64px"
                  ></div>
                </div>
              </div>
              <!--							<div class="ant-tabs-nav-operations ant-tabs-nav-operations-hidden">
								<button type="button" class="ant-tabs-nav-more" tabindex="-1" aria-hidden="true"
									aria-haspopup="listbox" aria-controls="rc-tabs-0-more-popup" id="rc-tabs-0-more"
									aria-expanded="false" style="visibility: hidden; order: 1;"><span role="img"
										aria-label="ellipsis" class="anticon anticon-ellipsis"><svg
											viewBox="64 64 896 896" focusable="false" data-icon="ellipsis" width="1em"
											height="1em" fill="currentColor" aria-hidden="true">
											<path
												d="M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z">
											</path>
										</svg></span></button>
							</div>-->
            </div>
            <div class="ant-tabs-content-holder">
              <div class="ant-tabs-content ant-tabs-content-top">
                <!-- 联赛概况 -->
                <div
                  role="tabpanel"
                  v-if="tabindex == 0"
                  class="ant-tabs-tabpane ant-tabs-tabpane-active"
                  id="rc-tabs-0-panel-1"
                  aria-labelledby="rc-tabs-0-tab-1"
                >
                  <div class="basketball-league-overview">
                    <div class="overview-top-part">
                      <div class="category-container" style="min-height: auto">
                        <div class="database-category">
                          <span
                            class="name"
                            @click="typeListIndex = index"
                            :class="{ active: typeListIndex == index }"
                            :key="item.id"
                            v-for="(item, index) in details.matchTypeList"
                            >{{ item.name }}</span
                          >
                          <!-- <span class="name">常规赛</span> -->
                        </div>
                        <!-- <div class="database-sub-category">
													<span class="name active"
														style="margin-bottom: 0px;">2021年10月</span>
												</div> -->
                      </div>
                      <div
                        class="ant-table-wrapper"
                        v-if="details.list && details.list.total !== 0"
                      >
                        <div class="ant-spin-nested-loading">
                          <div class="ant-spin-container">
                            <div class="ant-table">
                              <div class="ant-table-container">
                                <div class="ant-table-content">
                                  <table
                                    style="table-layout: auto"
                                    border="0"
                                    cellspacing="0"
                                    cellpadding="0"
                                  >
                                    <colgroup>
                                      <col style="width: 140px" />
                                      <col style="width: 134px" />
                                      <col style="width: 84px" />
                                      <col style="width: 134px" />
                                      <col style="width: 95px" />
                                      <!-- <col style="width: 95px;">
																			<col style="width: 95px;">
																			<col style="width: 95px;">
																			<col style="width: 95px;"> -->
                                      <col style="width: 95px" />
                                    </colgroup>
                                    <thead class="ant-table-thead">
                                      <tr>
                                        <th class="ant-table-cell" style="text-align: center">
                                          时间
                                        </th>
                                        <th class="ant-table-cell" style="text-align: center">
                                          主队
                                        </th>
                                        <th
                                          class="ant-table-cell content_txt_bf"
                                          style="text-align: center"
                                        ></th>
                                        <th class="ant-table-cell" style="text-align: center">
                                          客队
                                        </th>
                                        <th class="ant-table-cell" style="text-align: center">
                                          赛果
                                        </th>
                                        <!-- <th class="ant-table-cell"
																					style="text-align: center;">让分盘</th>
																				<th class="ant-table-cell"
																					style="text-align: center;">盘路</th>
																				<th class="ant-table-cell"
																					style="text-align: center;">总分盘</th>
																				<th class="ant-table-cell"
																					style="text-align: center;">大小</th> -->
                                        <th class="ant-table-cell" style="text-align: center">
                                          数据
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody class="ant-table-tbody" v-if="details.list">
                                      <tr
                                        class="ant-table-row ant-table-row-level-0"
                                        v-for="item in details.list.data"
                                        :key="item.id"
                                      >
                                        <td class="ant-table-cell" style="text-align: center">
                                          <div class="match-time">
                                            {{ item.day }}
                                            {{ item.hour }}
                                          </div>
                                        </td>
                                        <td class="ant-table-cell" style="text-align: center">
                                          <div
                                            class="host-team"
                                            style="width: 100%; text-align: center"
                                          >
                                            <i></i
                                            ><span :title="item.home_name" class="team-name">{{
                                              item.home_name
                                            }}</span>
                                          </div>
                                        </td>
                                        <td class="ant-table-cell" style="text-align: center">
                                          <div
                                            class="score-top"
                                            v-if="item.away_scores_total > item.home_scores_total"
                                          >
                                            {{ item.home_scores_total }}-<span>{{
                                              item.away_scores_total
                                            }}</span>
                                          </div>
                                          <div
                                            class="score-top"
                                            v-if="item.away_scores_total < item.home_scores_total"
                                          >
                                            <span>{{ item.home_scores_total }}</span
                                            >-{{ item.away_scores_total }}
                                          </div>
                                          <div
                                            class="score-top"
                                            v-if="item.away_scores_total == item.home_scores_total"
                                          >
                                            {{ item.home_scores_total }}-{{
                                              item.away_scores_total
                                            }}
                                          </div>
                                          <div class="score-bottom">
                                            {{ item.home_scores_halftime }}-{{
                                              item.away_scores_halftime
                                            }}
                                          </div>
                                        </td>
                                        <td class="ant-table-cell" style="text-align: center">
                                          <div
                                            class="guest-team"
                                            style="width: 100%; text-align: center"
                                          >
                                            <i></i
                                            ><span :title="item.away_name" class="team-name">{{
                                              item.away_name
                                            }}</span>
                                          </div>
                                        </td>
                                        <td class="ant-table-cell" style="text-align: center">
                                          <div class="result-match">
                                            {{
                                              item.is_win == 1
                                                ? '胜'
                                                : item.is_win == 2
                                                ? '负'
                                                : '平'
                                            }}
                                          </div>
                                        </td>
                                        <!-- <td class="ant-table-cell"
																					style="text-align: center;">
																					<div class="action-a">-4</div>
																				</td> -->
                                        <!-- <td class="ant-table-cell"
																					style="text-align: center;">
																					<div class="plate-roads lose">输
																					</div>
																				</td> -->
                                        <!-- <td class="ant-table-cell"
																					style="text-align: center;">
																					<div class="total-score">222.5</div>
																				</td> -->
                                        <!-- <td class="ant-table-cell"
																					style="text-align: center;">
																					<div class="size small">小</div>
																				</td> -->

                                        <td
                                          class="ant-table-cell"
                                          style="text-align: center"
                                          v-if="item.is_normal == 1"
                                        >
                                          <a
                                            class="data"
                                            target="_self"
                                            :href="
                                              './score-detail?type=basketball&tabIndex=4&id=' +
                                              item.id
                                            "
                                            >析</a
                                          >
                                        </td>
                                        <td
                                          class="ant-table-cell"
                                          style="text-align: center"
                                          v-else
                                        >
                                          <span class="data">暂无数据</span>
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
                      <!-- 分页 -->
                      <ul
                        class="ant-pagination overview-pagination"
                        unselectable="unselectable"
                        v-if="details.list && details.list.total !== 0"
                      >
                        <el-pagination
                          background
                          layout="prev, pager, next"
                          :page-size="20"
                          v-model:current-page="page"
                          :total="details.list.total"
                        />
                      </ul>
                    </div>
                    <div class="overview-center-part">
                      <div class="top-info">
                        <div class="category">
                          <div class="database-sub-category">
                            <!-- <span class="name" style="margin-bottom: 2px;">盘路统计</span> -->
                            <span
                              class="name"
                              style="margin-bottom: 2px"
                              :class="{ active: tabIndex1 == 0 }"
                              @click="tabIndex1 = 0"
                              >单节得分</span
                            >
                            <span
                              class="name"
                              style="margin-bottom: 2px"
                              :class="{ active: tabIndex1 == 1 }"
                              @click="tabIndex1 = 1"
                              >分差场次</span
                            >
                            <!-- <span class="name" style="margin-bottom: 2px;">指数胜率</span> -->
                          </div>
                        </div>
                        <div class="data" v-if="details.list">
                          <span>已赛{{ details.list.total }}场</span>
                          <span>场均总分{{ details.totalPointsPerGame }}分</span>
                          <span>{{ details.rebounds }}篮板</span>
                          <span>{{ details.assists }}助攻</span>
                          <span>15.6抢断</span>
                          <span>{{ details.blocks }}盖帽</span>
                        </div>
                      </div>
                      <div class="data-view">
                        <div class="pre-btn" @click="tabIndex1 = 0"></div>
                        <div class="view-container">
                          <div
                            class="view-list"
                            style="width: 400%"
                            :style="{ marginLeft: tabIndex1 == 0 ? '-100%' : '-200%' }"
                          >
                            <div class="roads-statistics">
                              <div class="score">
                                <div class="title">让分统计</div>
                                <div>
                                  <div
                                    size-sensor-id="31"
                                    style="
                                      height: 300px;
                                      width: 200px;
                                      -webkit-tap-highlight-color: transparent;
                                      user-select: none;
                                      position: relative;
                                    "
                                  >
                                    <div
                                      style="
                                        position: relative;
                                        width: 200px;
                                        height: 300px;
                                        padding: 0px;
                                        margin: 0px;
                                        border-width: 0px;
                                        cursor: default;
                                      "
                                    >
                                      <canvas
                                        data-zr-dom-id="zr_0"
                                        width="200"
                                        height="300"
                                        style="
                                          position: absolute;
                                          left: 0px;
                                          top: 0px;
                                          width: 200px;
                                          height: 300px;
                                          user-select: none;
                                          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                                          padding: 0px;
                                          margin: 0px;
                                          border-width: 0px;
                                        "
                                      ></canvas>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="single-score">
                              <div
                                class="candle-data-bar-container"
                                v-for="(item, index) in details.singleQuarterScore"
                                :key="item.id"
                              >
                                <div v-if="index < 4" class="candle-data-bar">
                                  <span class="value">{{ item }}</span>
                                  <div
                                    class="shadow-box"
                                    style="
                                      height: 96.272px;
                                      box-shadow: rgba(236, 104, 104, 0.15) 0px 8px 7px 0px;
                                    "
                                  ></div>
                                  <div class="container">
                                    <div
                                      class="current-value"
                                      :style="{ top: getCount(details.singleQuarterScore, item) }"
                                      style="
                                        background-image: linear-gradient(
                                          to top,
                                          rgb(236, 104, 104),
                                          rgb(255, 125, 125)
                                        );
                                      "
                                    ></div>
                                  </div>
                                  <span class="name">第{{ index + 1 }}节</span>
                                </div>
                              </div>
                              <div
                                class="candle-data-bar-container"
                                v-for="(item, index) in details.singleQuarterScore"
                                :key="item.id"
                              >
                                <div v-if="index == 4" class="candle-data-bar">
                                  <span class="value">{{ item }}</span>
                                  <div
                                    class="shadow-box"
                                    style="
                                      height: 40.48px;
                                      box-shadow: rgba(85, 163, 255, 0.15) 0px 8px 7px 0px;
                                    "
                                  ></div>
                                  <div class="container">
                                    <div
                                      class="current-value"
                                      :style="{ top: getCount(details.singleQuarterScore, item) }"
                                      style="
                                        background-image: linear-gradient(
                                          to top,
                                          rgb(109, 161, 255),
                                          rgb(144, 189, 255)
                                        );
                                      "
                                    ></div>
                                  </div>
                                  <span class="name">加时</span>
                                </div>
                              </div>
                            </div>
                            <div class="points-difference">
                              <div
                                class="candle-data-bar-container"
                                v-for="(item, index) in details.numberOfPointsDifference"
                                :key="item.id"
                              >
                                <div class="candle-data-bar">
                                  <span class="value">{{ item }}场</span>
                                  <div
                                    class="shadow-box"
                                    style="
                                      height: 176px;
                                      box-shadow: rgba(251, 182, 109, 0.3) 0px 8px 7px 0px;
                                    "
                                  ></div>
                                  <div class="container">
                                    <div
                                      class="current-value"
                                      :style="{
                                        top: getCount(details.numberOfPointsDifference, item)
                                      }"
                                      style="
                                        background-image: linear-gradient(
                                          to top,
                                          rgb(250, 174, 94),
                                          rgb(255, 205, 153)
                                        );
                                      "
                                    ></div>
                                  </div>
                                  <span class="name">{{
                                    index == 0
                                      ? '≤5'
                                      : index == 1
                                      ? '6-10'
                                      : index == 2
                                      ? '11~15'
                                      : index == 3
                                      ? '16~20'
                                      : index == 4
                                      ? '21~25'
                                      : '≥26'
                                  }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="next-btn" @click="tabIndex1 = 1"></div>
                      </div>
                    </div>

                    <!-- 联赛之最 -->
                    <div
                      class="database-league-best"
                      style="display: none"
                      v-if="details.winRate && details.winRate.length != 0"
                    >
                      <div class="database-category" style="margin-bottom: 8px">
                        <span class="name active">联赛之最</span>
                      </div>
                      <div class="best-league clearfix" v-if="details.winRate">
                        <div class="league-item">
                          <span class="flag">胜率PK</span>
                          <div class="team">
                            <img
                              :src="details.winRate[0].logo"
                              :alt="details.winRate[0].name"
                              :title="details.winRate[0].name"
                            />
                            <div class="name">{{ details.winRate[0].name }}</div>
                            <div class="best-value win">
                              <span class="left">最佳</span>
                              <span class="right">{{ details.winRate[0].won_rate }}胜</span>
                            </div>
                          </div>
                          <div class="vs"></div>
                          <div class="team">
                            <img
                              :src="details.winRate[1].logo"
                              :alt="details.winRate[1].name"
                              :title="details.winRate[1].name"
                            />
                            <div class="name">{{ details.winRate[1].name }}</div>
                            <div class="best-value lose">
                              <span class="left">最差</span>
                              <span class="right">{{ details.winRate[1].won_rate }}胜</span>
                            </div>
                          </div>
                        </div>
                        <div class="league-item">
                          <span class="flag">进攻PK</span>
                          <div class="team">
                            <img
                              :src="details.attack[0].logo"
                              :alt="details.attack[0].name"
                              :title="details.attack[0].name"
                            />
                            <div class="name">{{ details.attack[0].name }}</div>
                            <div class="best-value win">
                              <span class="left">最佳</span>
                              <span class="right"
                                >{{ details.attack[0].defensive_rebounds }}分/场</span
                              >
                            </div>
                          </div>
                          <div class="vs"></div>
                          <div class="team">
                            <img
                              :src="details.attack[1].logo"
                              :alt="details.attack[1].name"
                              :title="details.attack[1].name"
                            />
                            <div class="name">{{ details.attack[1].name }}</div>
                            <div class="best-value lose">
                              <span class="left">最差</span>
                              <span class="right"
                                >{{ details.attack[1].defensive_rebounds }}分/场</span
                              >
                            </div>
                          </div>
                        </div>
                        <div class="league-item">
                          <span class="flag">防守PK</span>
                          <div class="team">
                            <img
                              :src="details.defense[0].logo"
                              :alt="details.defense[0].name"
                              :title="details.defense[0].name"
                            />
                            <div class="name">{{ details.defense[0].name }}</div>
                            <div class="best-value win">
                              <span class="left">最佳</span>
                              <span class="right"
                                >{{ details.defense[0].defensive_rebounds }}分/场</span
                              >
                            </div>
                          </div>
                          <div class="vs"></div>
                          <div class="team">
                            <img
                              :src="details.defense[1].logo"
                              :alt="details.defense[1].name"
                              :title="details.defense[1].name"
                            />
                            <div class="name">{{ details.defense[1].name }}</div>
                            <div class="best-value lose">
                              <span class="left">最差</span>
                              <span class="right"
                                >{{ details.defense[1].defensive_rebounds }}分/场</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 联赛排名 -->
                <div
                  role="tabpanel"
                  v-if="tabindex == 1"
                  tabindex="0"
                  aria-hidden="false"
                  class="ant-tabs-tabpane ant-tabs-tabpane-active"
                  id="rc-tabs-0-panel-2"
                  aria-labelledby="rc-tabs-0-tab-2"
                >
                  <div class="basketball-league-ranking">
                    <div style="padding: 20px; text-align: center" v-if="rangking.lenth == 0">
                      暂无数据
                    </div>
                    <div v-for="(item, index) in rangking" :key="index">
                      <div class="title-bar">{{ item.name }}</div>
                      <div class="ant-table-wrapper">
                        <div class="ant-spin-nested-loading">
                          <div class="ant-spin-container">
                            <div class="ant-table">
                              <div class="ant-table-container">
                                <div class="ant-table-content">
                                  <table style="table-layout: auto">
                                    <colgroup>
                                      <col style="width: 108px" />
                                      <col style="width: 213px" />
                                      <col style="width: 124px" />
                                      <col style="width: 124px" />
                                      <col style="width: 124px" />
                                      <col style="width: 124px" />
                                      <col style="width: 124px" />
                                      <col style="width: 124px" />
                                    </colgroup>
                                    <thead class="ant-table-thead">
                                      <tr>
                                        <th class="ant-table-cell" style="text-align: center">
                                          排名
                                        </th>
                                        <th class="ant-table-cell" style="text-align: center">
                                          球队
                                        </th>
                                        <th class="ant-table-cell" style="text-align: center">
                                          赛
                                        </th>
                                        <th class="ant-table-cell" style="text-align: center">
                                          胜-负
                                        </th>
                                        <th class="ant-table-cell" style="text-align: center">
                                          胜率
                                        </th>
                                        <th class="ant-table-cell" style="text-align: center">
                                          胜 差
                                        </th>
                                        <th class="ant-table-cell" style="text-align: center">
                                          均场得分
                                        </th>
                                        <th class="ant-table-cell" style="text-align: center">
                                          均场失分
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody class="ant-table-tbody">
                                      <tr
                                        data-row-key="0.45234216444506226"
                                        class="ant-table-row ant-table-row-level-0"
                                        v-for="(item1, index1) in item.list"
                                        :key="index1"
                                      >
                                        <td class="ant-table-cell" style="text-align: center">
                                          <div class="match-rank">
                                            <span>{{ item1.position }}</span>
                                          </div>
                                        </td>
                                        <td class="ant-table-cell" style="text-align: center">
                                          <div>
                                            <span class="team-name">{{ item1.name }}</span>
                                          </div>
                                        </td>
                                        <td class="ant-table-cell" style="text-align: center">
                                          <div class="match">
                                            {{ Number(item1.won) + Number(item1.lost) }}
                                          </div>
                                        </td>
                                        <td class="ant-table-cell" style="text-align: center">
                                          <span class="result"
                                            >{{ item1.won }}-{{ item1.lost }}</span
                                          >
                                        </td>
                                        <td class="ant-table-cell" style="text-align: center">
                                          <div class="win-rate">
                                            {{ item1.won_rate }}
                                          </div>
                                        </td>
                                        <td class="ant-table-cell" style="text-align: center">
                                          <div class="action-a">
                                            {{ item1.game_back }}
                                          </div>
                                        </td>
                                        <td class="ant-table-cell" style="text-align: center">
                                          <div class="last-ten">
                                            {{ item1.points_avg }}
                                          </div>
                                        </td>
                                        <td class="ant-table-cell" style="text-align: center">
                                          <div class="recent-situation lose">
                                            {{ item1.points_against_avg }}
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
                    </div>
                  </div>
                </div>
                <!-- 联赛数据 -->
                <div
                  role="tabpanel"
                  v-if="tabindex == 2"
                  aria-hidden="false"
                  class="ant-tabs-tabpane ant-tabs-tabpane-active"
                  id="rc-tabs-0-panel-3"
                  aria-labelledby="rc-tabs-0-tab-3"
                >
                  <div class="basketball-league-data league-data-common">
                    <div class="top">
                      <div class="database-category">
                        <span
                          class="name"
                          :class="{ active: teamId == 0 }"
                          @click="(teamId = 0), (teamTitle = player)"
                          >球员</span
                        >
                        <span
                          class="name"
                          :class="{ active: teamId == 1 }"
                          @click="(teamId = 1), (teamTitle = team)"
                          >球队</span
                        >
                      </div>
                    </div>
                    <div class="data-main">
                      <div class="left-nav" style="border-right: none">
                        <div
                          class="nav-item"
                          :class="{ active: selectTeam == index }"
                          :key="item.id"
                          @click="selectTeam = index"
                          v-for="(item, index) in teamTitle"
                        >
                          {{ item }}
                        </div>
                      </div>
                      <div class="table-container">
                        <div class="ant-table-wrapper" style="margin-bottom: 0px">
                          <div class="ant-spin-nested-loading">
                            <div class="ant-spin-container">
                              <div class="ant-table ant-table-empty">
                                <div class="ant-table-container">
                                  <div class="ant-table-content">
                                    <table style="table-layout: auto">
                                      <thead class="ant-table-thead">
                                        <tr>
                                          <th class="ant-table-cell" style="text-align: center">
                                            排名
                                          </th>
                                          <th class="ant-table-cell" v-if="teamId == 0">球员</th>
                                          <th class="ant-table-cell" v-if="teamId == 1">球队</th>
                                          <th
                                            class="ant-table-cell"
                                            style="text-align: center; padding: 0"
                                          >
                                            总数
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody class="ant-table-tbody">
                                        <tr
                                          data-row-key="0.46670301267142533"
                                          class="ant-table-row ant-table-row-level-0"
                                          v-for="(item, index) in teamList"
                                          :key="index"
                                        >
                                          <td class="ant-table-cell" style="text-align: center">
                                            <div class="match-rank">
                                              {{ index + 1 }}
                                            </div>
                                          </td>
                                          <!-- <td class="ant-table-cell" v-if="teamId == 0">
																						<div class="team">
																							<img :src="item.logo || teamLogo"
																								>
																							{{item.name}}
																						</div>
																					</td> -->
                                          <td class="ant-table-cell">
                                            <div class="team">
                                              <img
                                                class="w-22-av"
                                                :src="item.logo"
                                                @error="$common.errorImg($event)"
                                              />
                                              {{ item.name }}
                                            </div>
                                          </td>
                                          <td class="ant-table-cell" style="text-align: center">
                                            <span class="score">{{ item.points }}</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <div
                                      style="width: 100%; text-align: center; padding: 20px 0"
                                      v-if="teamList.length == 0"
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
import teamLogo from '/static/images/team.png'
import {
  popular,
  TeamData,
  teamMember,
  pointsRanking,
  competitionInfo,
  tournamentList,
  getCountry,
  getCategory
} from '@/api/database.js'
import { getImageUrl } from '@/utils/common.js'
import mittBus from '@/utils/mittBus'

export default {
  name: 'databaseBasketball',
  data() {
    return {
      teamLogo,
      page: 1,
      selectId: null, //选中的赛事（左侧三级
      options: [
        {
          //赛选赛季
          value: '选项1',
          label: '2022-10-10'
        }
      ],
      selectTeam: 0,
      teamId: 0,
      firstIndex: null, //选中一级分类下表
      selectValue: '', //下拉框
      title: [],
      tabIndex1: 0, //联赛赛况-切换2
      details: {
        info: {},
        matchTypeList: [],
        list: {
          data: [],
          total: 0,
          per_page: 20
        }
      }, //详情
      typeListIndex: 0, //季前赛，常规赛
      tabindex: 0,
      rangking: [],
      teamTitle: [],
      team: [
        '得分',
        '失分',
        '两分球命中数',
        '三分球命中数',
        '投篮命中数',
        '犯规',
        '篮板数',
        '防守篮板数',
        '进攻篮板数',
        '助攻',
        '失误',
        '抢断',
        '盖帽',
        '罚球命中数'
      ],
      hotList: [
        {
          id: 1,
          name: '关注赛事',
          check: false,
          list: []
        },
        {
          id: 2,
          name: '热门赛事',
          check: true,
          list: []
        }
        // {
        // 	id:3,
        // 	name:'国际赛事',
        // 	check:false,
        // 	list:[],
        // 	category_id:1
        // }
      ],
      player: [
        '得分',
        '上场时间',
        '罚球命中数',
        '两分球命中数',
        '三分球命中数',
        '投篮命中数',
        '篮板数',
        '防守篮板数',
        '进攻篮板数',
        '助攻',
        '失误',
        '抢断',
        '盖帽',
        '个人犯规'
      ],
      teamList: [], //联赛数据
      tabList: ['联赛概况', '联赛排名', '联赛数据'],
      updateKey: new Date().getTime()
    }
  },
  mounted() {
    this.getCategory()
    this.teamTitle = this.player
    this.popular()
  },
  watch: {
    tabindex(e) {
      if (e == 1) {
        this.pointsRanking()
      } else if (e == 2) {
        this.TeamData(0)
      } else if (e == 0) {
        this.competitionInfo({ id: this.selectId }, false)
      }
    },
    teamId(e) {
      this.selectTeam = 0
      this.TeamData(e)
      // console.log(e);
    },
    selectTeam(e) {
      // console.log(e);
      this.TeamData(this.teamId)
    },
    // selectValue(e) { //改变年份，需重新获取详情
    // 	console.log('改变年份--');
    // 	this.competitionInfo()
    // },
    typeListIndex(e) {
      //改变季前，需重新获取详情
      console.log('改变季前--')
      this.competitionInfo({ id: this.selectId }, false)
    },
    details: {
      deep: true,
      handler() {
        // this.updateKey = new Date().getTime()
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      }
    },
    page() {
      this.competitionInfo({ id: this.selectId })
    }
  },
  methods: {
    getImageUrl,
    // popular 资料库热门/关注接口
    popular() {
      popular()
        .then((res) => {
          let data = {
            id: res.data.basketball_id
          }
          this.hotList[1].list = res.data.popular

          let query = this.$route.query

          if (JSON.stringify(query) == '{}') {
            this.selectId = res.data.basketball_id
          } else {
            this.selectId = query.id
          }
          // this.TeamData(0)
          this.competitionInfo({ id: this.selectId })
        })
        .catch((res) => {})
    },
    // 修改选中（
    setSelect(e) {
      console.log('出发了', this.tabindex)
      if (this.tabindex == 0) {
        this.competitionInfo({ id: this.selectId }, false)
      } else if (this.tabindex == 1) {
        this.pointsRanking()
      } else {
        this.TeamData(0)
      }
    },
    // 获取球队列表
    TeamData(type) {
      if (type == 0) {
        teamMember({
          id: this.selectValue,
          type: this.selectTeam
        })
          .then((res) => {
            this.teamList = res.data
          })
          .catch((res) => {})
      } else {
        TeamData({
          id: this.selectValue,
          type: this.selectTeam
        })
          .then((res) => {
            this.teamList = res.data
          })
          .catch((res) => {})
      }
    },

    // 获取一级分类
    getCategory() {
      getCategory()
        .then((res) => {
          let arr = res.data.filter((item) => {
            return item.id != 1
          })
          arr.forEach((item) => {
            item.check = false
          })
          this.title = arr
        })
        .catch((res) => {})
    },

    // 获取排行
    pointsRanking() {
      pointsRanking({
        id: this.selectValue
      })
        .then((res) => {
          this.rangking = res.data
        })
        .catch((res) => {})
    },
    // 关注 热门 国际
    getAouth(item) {
      if (item.id == 3) {
        this.setChildrenCheck({ id: '' }, { category_id: 1 }, 1, 1)
        item.check = !item.check
      } else {
        item.check = !item.check
      }
    },

    // 一级分类选中
    setCheck(item, i) {
      this.firstIndex = i

      // 获取二级分类
      getCountry({
        id: item.id
      })
        .then((res) => {
          res.data.forEach((data) => {
            data.check = false
            data.children = []
          })
          this.title[i].children = res.data
          item.check = !item.check
          console.log(res.data)
        })
        .catch((res) => {})
    },
    // 收藏 添加入收藏列表
    getAttention(item) {
      let index = 0
      let list = this.hotList[0].list
      if (list.indexOf(item) == -1) {
        list.push(item)
      } else {
        list.splice(list.indexOf(item), 1)
      }

      localStorage.setItem('hotList', JSON.stringify(this.hotList[0].list))
      // list.push(item)
    },
    // 计算百分比
    getCount(list, i) {
      let all = 0
      list.forEach((item) => {
        all += item
      })
      if (all == 0) return '100%'
      return (1 - i / all) * 100 + '%'
    },

    // 二级分类选中 item1 = 父级；item = 选中
    setChildrenCheck(item1, item, i, i1) {
      // 判断国际赛事是没有三级
      // 获取三级分类
      tournamentList({
        country_id: item.id,
        category_id: item.category_id
      })
        .then((res) => {
          res.data.forEach((data) => {
            data.check = false
            data.type = 1
          })
          if (item.category_id == 1) {
            //国际赛事
            this.hotList[2].list = res.data
            return
          }
          this.title[this.firstIndex].children[i].children = res.data
          item.check = !item.check
          this.$forceUpdate()
          // this.updateKey = new Date().getTime()
        })
        .catch((res) => {})
    },
    // 选中三级/四级
    setCompetition(item) {
      console.log(item)
      console.log(item.type == 0)
      if (item.type == 0) {
        //type == 0 足球，1篮球
        // 当前页面为足球，当type = 1跳转页面
        let routeData = this.$router.resolve({
          path: '/base-football?id=' + item.id,
          query: {
            id: item.id
          }
        })

        window.open(routeData.href, '_self')
      } else {
        this.selectId = item.id
        this.selectValue = ''
        this.competitionInfo(item)
        this.tabindex = 0
      }
    },
    // 获取详情
    competitionInfo(item, type) {
      let matchTypeList = this.details.matchTypeList
      let data = {
        id: item.id,
        page: this.page,
        season_id: this.selectValue
        // type: matchTypeList.length != 0 ? matchTypeList[this.typeListIndex].id : ''
      }
      console.log(matchTypeList)
      if (this.typeListIndex != 0) {
        data.type = this.details.matchTypeList[this.typeListIndex].id
      } else {
        data.type = ''
      }

      competitionInfo(data)
        .then((res) => {
          this.details = res.data
          if (res.data.season.length == 0) {
            this.tabList = ['联赛概况']
          } else {
            this.tabList = ['联赛概况', '联赛排名', '联赛数据']
          }
          if (res.data.season.length != 0) {
            if (type == undefined) {
              this.selectValue = res.data.season[0].id
            }
          }
          // this.updateKey = new Date().getTime()
          this.$forceUpdate()
        })
        .catch((res) => {})
    }
  }
}
</script>

<style lang="scss" scoped="scoped">
@use './database.scss';
.ant-pagination {
  margin-top: 10px;
  .el-pagination {
    text-align: center;
  }
}
.title-bar {
  padding-left: 10px;
  line-height: 30px;
  font-weight: 600;
  text-decoration: underline;
}
</style>
