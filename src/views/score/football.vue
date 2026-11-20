<template>
  <div
    id="ScoreBoard"
    class="layout_score_board score_football"
    ref="ScoreBoard"
    @mouseover="changeFlag(false)"
  >
    <div class="score-container">
      <main class="score-container-main" :class="['tabIndex' + tabIndex]">
        <div class="score-main--top">
          <div class="fixed-header-wrap" style="position: relative">
            <div
              class="score-left-nav-filter-wrap"
              style="position: absolute; left: -60px"
              v-if="tabIndex == 0"
            >
              <div class="score-left-nav-filter-item" @click="collect()">
                <div class="score-left-nav-filter-item-icon left-nav-guanzhu"></div>
                <span>预约</span>
              </div>
              <div class="score-left-nav-filter-item" @click="retain()" :class="{actionClass: setConf.action === 1}">
                <div class="score-left-nav-filter-item-icon left-nav-gouxuan"></div>
                <span>保留</span>
              </div>
              <div class="score-left-nav-filter-item" @click="conceal()" :class="{actionClass: setConf.action === 2}">
                <div class="score-left-nav-filter-item-icon left-nav-yingcang"></div>
                <span>隐藏</span>
              </div>
            </div>
            <div class="score-right-wrap"></div>

            <div style="position: absolute; top: 310px; right: -70px" v-if="tabIndex == 10">
              <div>
                <div id="matchStatusNav">
                  <div
                    class="item"
                    :class="[typeTab == 0 ? 'active' : '', objNum.a == 0 ? 'disable' : '']"
                    @click="setTab(0)"
                  >
                    <i class="going-icon"></i>进行中
                  </div>
                  <div
                    class="item"
                    :class="[typeTab == 1 ? 'active' : '', objNum.b == 0 ? 'disable' : '']"
                    @click="setTab(1)"
                  >
                    <i class="uncoming-icon"></i>未开<span class="line"></span>
                  </div>
                  <div
                    class="item"
                    @click="setTab(2)"
                    :class="[typeTab == 2 ? 'active' : '', objNum.c == 0 ? 'disable' : '']"
                  >
                    <i class="finished-icon"></i>完场<span class="line"></span>
                  </div>
                  <!-- disable -->
                  <div
                    class="item"
                    @click="setTab(3)"
                    :class="[typeTab == 3 ? 'active' : '', objNum.d == 0 ? 'disable' : '']"
                  >
                    <i class="unknown-icon"></i>异常
                  </div>
                </div>
              </div>
            </div>

            <div id="header-filter">
              <div class="header-filter-left">
                <div class="buttons-wrap">
                  <button
                    class="left-button"
                    @click="tabIndex = index"
                    v-for="(item, index) in tabList"
                    :class="index == tabIndex ? 'active' : ''"
                    :key="index"
                  >
                    {{ item }}
                  </button>
                  <!-- <el-badge :hidden="shouNum != 0?false:true" :value="shouNum" class="item"> -->
                  <button
                    class="left-button"
                    style="margin-right: 0"
                    :class="3 == tabIndex ? 'active' : ''"
                    @click="tabIndex = 3"
                  >
                    预约
                  </button>
                  <!-- </el-badge> -->
                  <button
                    class="left-button active"
                    style="margin-left: 16px"
                    v-if="$store.state.concealNum != 0"
                    @click="cancelConceal()"
                  >
                    全部<span class="weight"> （隐藏{{ $store.state.concealNum }}场）</span>
                  </button>
                </div>
              </div>

              <div class="header-filter-right">
                <!-- 收藏标签不需要显示 -->
                <!-- nest_comment_start~<div
                  v-show="[0, 1, 2].includes(tabIndex)"
                  class="header-second-filter-right"
                  style="position: relative"
                >
                  <div
                    class="ant-dropdown-trigger filter-main-button-container"
                    style="position: relative"
                  >
                    <el-popover
                      placement="bottom"
                      width="100"
                      trigger="click"
                      popper-class="popover"
                      ref="popover2"
                    >
                      <ul role="menu" tabindex="0" data-menu-list="true">
                        <li
                          class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child"
                          role="menuitem"
                          tabindex="-1"
                          data-menu-id="rc-menu-uuid-93853-1-0"
                          @click="selectTab(item, 1)"
                          v-for="(item, index) in matchList"
                          :key="index"
                        >
                          <span class="ant-dropdown-menu-title-content">
                            <div class="filter-choose-item" style="text-align: center">
                              {{ item.name }}
                            </div>
                          </span>
                        </li>
                      </ul>
                      <template #reference>
                        <button
                          class="match-filter-main-button"
                          :class="maskIndex == 1 ? 'active' : ''"
                          style="margin: 0px"
                          @click="getMaskShow(1)"
                        >
                          <div class="i">{{ selectLi }}</div>
                          <i class="arrow-down"></i>
                        </button>
                      </template>
                    </el-popover>
                    ~nest_comment_end --><!-- 类型下拉 --><!-- nest_comment_start~
                  </div>

                  <el-popover
                    placement="bottom"
                    width="424"
                    trigger="click"
                    popper-class="popover"
                    ref="popover1"
                  >
                    <div class="filter-content">
                      <div class="filter-header-tabs">
                        <div
                          class="tab-item"
                          :class="checkIndex == 0 ? 'active' : ''"
                          @click="checkIndex = 0"
                        >
                          按赛事
                        </div>
                        <div
                          class="tab-item"
                          :class="checkIndex == 1 ? 'active' : ''"
                          @click="checkIndex = 1"
                        >
                          国家/地区
                        </div>
                      </div>
                      <div class="filter-scroll-view" style="height: 348px">
                        <div
                          class="filter-checkbox-wrap"
                          v-for="(item, key, index) in screen.list"
                          :key="index"
                        >
                          <div class="filter-checkbox-word" v-if="maskIndex != 3">
                            {{ item.name }}
                          </div>
                          <ul class="filter-checkbox-list">
                            <li
                              class="filter-checkbox-item"
                              :class="item1.check ? 'active' : ''"
                              v-for="(item1, index1) in item.list"
                              :key="index1"
                            >
                              <label
                                class="checkbox-wrap"
                                @click.stop="setCheckStatus($event, item1)"
                              >
                                ~nest_comment_end --><!-- <input type="checkbox" :value="!item1.check"> --><!-- nest_comment_start~
                                <img
                                  width="18px"
                                  height="18px"
                                  :src="
                                    getImageUrl(
                                      item1.check
                                        ? '/static/images/check1.png'
                                        : '/static/images/check.png'
                                    )
                                  "
                                />
                                ~nest_comment_end --><!-- <div class="checkbox-content"></div> --><!-- nest_comment_start~
                                <div class="checkbox-children">
                                  {{ item1.name }}
                                  <span class="filter-checkbox-item-matchnum"
                                    >[{{ item1.count }}]</span
                                  >
                                </div>
                              </label>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div class="filter-footer-wrap-for-football">
                        <div class="quantity-information">
                          选中
                          <span class="active"
                            >{{ checkIndex == 0 ? screen.count_2 : screen.count_1 }}/</span
                          >
                          {{ checkIndex == 0 ? screen.count_competition : screen.count_country }}
                          {{ '场' }}
                        </div>
                        <div class="filter-footer-button" @click="setAllCheck(true)">全选</div>
                        <div class="filter-footer-button" @click="setAllCheck(false)">反选</div>
                        <div class="filter-footer-button confirm-button" @click="setCheckList()">
                          确定
                        </div>
                      </div>
                    </div>
                    <template #reference>
                      <button
                        :class="maskIndex == 2 ? 'active' : ''"
                        class="match-filter-main-button"
                        @click="getMaskShow(2)"
                      >
                        <div class="i">赛事</div>
                        <i class="arrow-down"></i>
                      </button>
                    </template>
                  </el-popover>
                </div>~nest_comment_end -->
                <div class="header-filter-right-tools-wrap">
                  <div class="search">
                    <div class="search-main" style="margin-left: 12px; width: auto" v-if="isSearch">
                      <input
                        placeholder="请输入要查询的赛事或球队名称"
                        v-model="inputValue"
                        type="text"
                        class="ant-input ant-input-sm"
                      />
                      <div class="search-number">
                        <!-- {{num0}} -->
                        <span class="color-b98c53" v-if="allNum != 0">{{ allNum }}</span>
                      </div>
                      <div class="division"></div>
                      <div class="close" @click="(isSearch = false), clearSearch()"></div>
                    </div>
                    <div v-else @click="isSearch = true">
                      <img
                        class="enlarge-button"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAWlBMVEUAAACJiZiBhJKDhZWFiJWlpaWAg5OBhJOBg5KAhJKAhJOBhZWBg5OBhJSVmKWAg5KChJSSkpeBhJOBhJOBhJSBhZOBhJOChpSFhZWAhJOBhJOChZSAg5KUl6RY8yGOAAAAHHRSTlMAEcA5JgP1387F2UGPUbWrfgy7olx07Ukesp5iRCjhZAAAATFJREFUSMflVdl2hCAMBQRkGce9Tlv9/9+siZ4zynJKXtv7okAuuUkgsL8IPo3Cae3EOPEC80asF4jmF/PKrgFsxfJQjzWBh8qKH1aE6bzse+k7c4wHnrF3uNzK95RsccolGQr3rwPJVY0+UqpQv+CRX4FxJPKD9irhGRlxrizoSWrloMpG9Qq2eT4D52EFwW97GW/bZdCC2sAtbCJzBAmrd7kT1IvlCAwqON0I4z7T5QndvjxGIfg8wUdBOAghS8Ag3I2g95n+yOd2w5Hdfl/WZAJVUk0N2lDT+kUt3Df1aLyIh28gH2/iBTKKeEU9sQnohtZmsP8RGhnCvopbpZg1fD6a4maMwvCvpN17dP4ZyMo9KHZhJ05ZS/mTdcqaWRHesrRi5ZhBFIEAOTEL+5f4AfcQNF+GuUUUAAAAAElFTkSuQmCC"
                        alt="enlarge"
                      />
                    </div>
                  </div>

                  <el-popover
                    placement="bottom-end"
                    width="384"
                    trigger="click"
                    popper-class="popover"
                    ref="popover3"
                  >
                    <div class="setting-popover-content">
                      <div class="setting-header content_txt_1"></div>
                      <div class="setting-content" style="background: white">
                        <!-- <div>
                          <div class="setting-item">
                            <p class="label-name">语言选择</p>
                            <div class="options">
                              <div
                                class="option-button"
                                @click="setGame('lang', index)"
                                v-for="(item, index) in langList"
                                :key="index"
                                :class="index == langIndex ? 'active' : ''"
                              >
                                {{ item }}
                              </div>
                            </div>
                          </div>
                        </div> -->
                        <div>
                          <div class="setting-item">
                            <p class="label-name">比赛信息</p>
                            <div class="ant-checkbox-group checkbox-group-container">
                              <!--  -->
                              <label
                                class="ant-checkbox-wrapper"
                                @click="setGame('red')"
                                :class="game.red ? 'ant-checkbox-wrapper-checked' : ''"
                              >
                                <span class="ant-checkbox">
                                  <img
                                    class="icon_check"
                                    :src="
                                      getImageUrl(
                                        game.red
                                          ? '/static/images/check1.png'
                                          : '/static/images/check.png'
                                      )
                                    "
                                  />
                                  <!-- <span class="ant-checkbox-inner"></span> -->
                                  红牌数
                                </span>
                              </label>
                              <label
                                class="ant-checkbox-wrapper"
                                @click="setGame('yellow')"
                                :class="game.yellow ? 'ant-checkbox-wrapper-checked' : ''"
                              >
                                <span class="ant-checkbox">
                                  <img
                                    class="icon_check"
                                    :src="
                                      getImageUrl(
                                        game.yellow
                                          ? '/static/images/check1.png'
                                          : '/static/images/check.png'
                                      )
                                    "
                                  />
                                  <!-- <span class="ant-checkbox-inner"></span> -->
                                  黄牌数
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="setting-item">
                            <p class="label-name">声音设置</p>
                            <div class="options" style="width: 157px">
                              <div
                                class="option-button"
                                :class="game.voice ? 'active' : ''"
                                @click="setGame('voice', 1)"
                              >
                                哨声
                              </div>
                              <div
                                class="option-button"
                                :class="game.voice ? '' : 'active'"
                                @click="setGame('voice', 2)"
                              >
                                静音
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <template #reference>
                      <img
                        class="setting-popover-button"
                        @click="langMask = !langMask"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAn1BMVEUAAACjo6Ojo6yAg5KUmKWBhJOUoqWBg5OChZOBhJOBhJOLi5yVl6WUmKSAg5OVmKaBhZSXm6aUmaeUmqaBhJOAhJOChZSIiJuBhJKAhJOBhJKChZSDhZSDhZWDh5SFhpaGh5aBhJKAg5KBhZOHh5eVmKSUl6WChJOBhJODhJSAg5KAg5OBhJOBhJOBhJODg5KBhJKBhJKBhZOAg5KUl6R0AIjxAAAAM3RSTlMABAb9kvEL2Fq4nA/z1aqaeEI3K/nQTxT0yLBVSjYuKSLn4XEa5r1zZD7utKGZf0PCpJRbH5GKAAABxUlEQVRIx91V2ZaCMAwdVgvDouigwrC57zrS//+2aYq0pUcRXs0L9Saxyc3Sr48UxZ6UlWjWdxeH35LLsIvDUHCIujhYgkOhdIhII4YZOaiz9phUhCDFGMxuFLHJaTJUCA3h7kn2HtFaxwFlZ0+R1YxGdfSKsvxR27i5PLBQe82XMmAqjevCGUONVdNhWSsmUSrAK9uoFaeG/RTwcxqjvZydukdxuoWLExE+w6VTyVYKeC4AKWS35L/Huus4rj5mwBWCQs3iDhQWhY4fojMyI2Kx4GUHMg55bb/B2A9MM/Ax3jw8ppTEnDn8lSWvjY7Xo+o0WmO9rioYKDypOwC7Kn6Mwb7ywJjmkYD61iDlxGjQsc9hv7rCZgEwyYBpE04uDjgcYBc+kEEoUb2ok3KwyVETO/AB1uUqFTAFrxxgyKUWyDUSktoWUixNw9uk54rYK6cOtLKdwwqndCocb42spTVM1hq9m69/e/cfID6idhaiqzyiZoLiZElHtOcSsF+vmS1DQ0NeM+2LLJYXmdwcxtFbCKsyp/9fWJHBpkFaxtCm6MAIudP4VKKSlvGT2DLgBy7Y9ntQoLjv5SI4eL0fxf7P7kfKP05cbJAGXu+dAAAAAElFTkSuQmCC"
                        width="24"
                        alt="setting"
                      />
                    </template>
                  </el-popover>
                </div>
              </div>
            </div>
            <img
              class="score-banner"
              @click="$router.push('/downLoad')"
              :src="ballBanner"
              alt="score-banner"
            />
            <ul v-if="tabIndex == 0" class="football-score-container-header">
              <li
                class="width40"
                style="background: rgb(58, 48, 64); height: 100%"
                @click="setAllCheck1()"
              >
                <img
                  class="icon-check"
                  :src="
                    getImageUrl(
                      !allCheck ? '/static/images/check.png' : '/static/images/check1.png'
                    )
                  "
                />
              </li>
              <li class="width93">赛事</li>
              <li class="width32 text-center">时间</li>
              <li class="width46 football-all-status">状态</li>
              <li class="teamName-score width425">
                <div class="hostTeam">主队</div>
                <div class="vs width40 content_txt_bf"></div>
                <div class="guestTeam">客队</div>
              </li>
              <div class="variable width554">
                <div class="immediate">
                  <div class="model-one width180">
                    <div class="width66 text-center">半场</div>
                    <div class="corner width48 text-left">角球</div>
                    <div>直播</div>
                  </div>
                  <div class="model-two width224 model-item-9">
                    <div class="gou-container" @click="immediatelyCheck(1)">
                      <div class="gou" :class="immediately.value1 ? 'checked' : 'no-checked'"></div>
                      <div class="rangqiu">亚</div>
                    </div>
                    <div class="gou-container" @click="immediatelyCheck(2)">
                      <div class="gou" :class="immediately.value2 ? 'checked' : 'no-checked'"></div>
                      <div class="daxiao">大</div>
                    </div>
                    <div class="gou-container" @click="immediatelyCheck(3)">
                      <div class="gou" :class="immediately.value3 ? 'checked' : 'no-checked'"></div>
                      <div class="europe">欧</div>
                    </div>
                  </div>
                  <div class="width87 text-center">数据</div>
                  <div class="text-center width76">操作</div>
                </div>
              </div>
            </ul>
            <!-- 赛果 -->
            <div v-if="tabIndex == 1">
              <div class="header-date-filter">
                <div
                  class="date-button"
                  :class="index == timeIndex ? 'active' : ''"
                  @click="timeIndex = index"
                  v-for="(item, index) in dateTime"
                  :key="index"
                >
                  <div class="date">{{ item.data }}</div>
                  <div class="week">{{ item.time }}</div>
                </div>
                <div
                  class="date-button"
                  style="color: rgb(128, 131, 146); position: relative"
                  @click="getShow()"
                >
                  <i class="date-picker-icon"></i>日历<i class="arrow-down"></i>
                  <el-date-picker
                    ref="abc"
                    type="date"
                    v-model="time"
                    :picker-options="pickerBeginDateBefore"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    class="datePicker"
                    @change="change"
                    placeholder="选择日期"
                    :disabledDate="disableDates"
                  >
                  </el-date-picker>
                </div>
              </div>

              <ul class="football-score-container-header" style="border-radius: 0px">
                <li class="width93">赛事</li>
                <li class="width32 text-center">时间</li>
                <li class="width46 football-all-status margin-right-20">状态</li>
                <li class="teamName-score width425">
                  <div class="hostTeam">主队</div>
                  <div class="vs width40 content_txt_bf"></div>
                  <div class="guestTeam">客队</div>
                </li>
                <div class="variable width547">
                  <div class="finished">
                    <div class="model-one width417">
                      <div class="width54 text-center">半场</div>
                      <div class="width54 text-center">角球</div>
                      <div class="width60 text-center">赛果</div>
                      <div class="width60 text-center">让球</div>
                      <div class="width60 text-center">总进球</div>
                      <div class="width60 text-center"></div>
                      <div class="width60 text-center">半全场</div>
                    </div>
                    <div class="match width80 text-center">数据</div>
                    <div class="match width50 text-center">统计</div>
                  </div>
                </div>
              </ul>
            </div>
            <!-- 赛程 -->
            <div v-if="tabIndex == 2">
              <div class="header-date-filter">
                <div
                  class="date-button"
                  :class="index == timeIndex ? 'active' : ''"
                  @click="timeIndex = index"
                  v-for="(item, index) in dateTime"
                  :key="index"
                >
                  <div class="date">{{ item.data }}</div>
                  <div class="week">{{ item.time }}</div>
                </div>
                <div
                  class="date-button"
                  style="color: rgb(128, 131, 146); position: relative"
                  @click="getShow()"
                >
                  <i class="date-picker-icon"></i>日历<i class="arrow-down"></i>
                  <el-date-picker
                    :picker-options="pickerBeginDateBefore1"
                    ref="abc"
                    type="date"
                    v-model="time"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    class="datePicker"
                    @change="change"
                    placeholder="选择日期"
                    :disabledDate="disableDates"
                  >
                  </el-date-picker>
                </div>
              </div>
              <ul class="football-score-container-header" style="border-radius: 0px">
                <li class="width93">赛事</li>
                <li class="width32 text-center">时间</li>
                <li class="width46 football-all-status margin-right-20">状态</li>
                <li class="teamName-score width425">
                  <div class="hostTeam">主队</div>
                  <div class="vs width40 content_txt_bf"></div>
                  <div class="guestTeam">客队</div>
                </li>
                <div class="variable width547">
                  <div class="progress">
                    <div class="width115 text-center"></div>
                    <div class="width65">直播</div>
                    <div class="model-one width224">
                      <div class="gou-container" @click="immediatelyCheck(1)">
                        <div
                          class="gou"
                          :class="immediately.value1 ? 'checked' : 'no-checked'"
                        ></div>
                        <div class="rangqiu">亚</div>
                      </div>
                      <div class="gou-container" @click="immediatelyCheck(2)">
                        <div
                          class="gou"
                          :class="immediately.value2 ? 'checked' : 'no-checked'"
                        ></div>
                        <div class="daxiao">大</div>
                      </div>
                      <div class="gou-container" @click="immediatelyCheck(3)">
                        <div
                          class="gou"
                          :class="immediately.value3 ? 'checked' : 'no-checked'"
                        ></div>
                        <div class="europe">欧</div>
                      </div>
                    </div>
                    <div class="match width87 text-center">数据</div>
                    <div class="match width56 text-center">操作</div>
                  </div>
                </div>
              </ul>
            </div>
            <ul v-if="tabIndex == 3" class="football-score-container-header">
              <li class="width93">赛事</li>
              <li class="width32 text-center">时间</li>
              <li class="width46 football-all-status margin-right-20">状态</li>
              <li class="teamName-score width420">
                <div class="hostTeam">主队</div>
                <div class="vs width40 content_txt_bf"></div>
                <div class="guestTeam">客队</div>
              </li>
              <div class="variable width547">
                <div class="immediate">
                  <div class="model-one width180">
                    <div class="width66 text-center">半场</div>
                    <div class="corner width48 text-left">角球</div>
                    <div>直播</div>
                  </div>
                  <div class="model-two width224 model-item-10">
                    <div class="gou-container" @click="immediatelyCheck(1)">
                      <div class="gou" :class="immediately.value1 ? 'checked' : 'no-checked'"></div>
                      <div class="rangqiu">亚</div>
                    </div>
                    <div class="gou-container" @click="immediatelyCheck(2)">
                      <div class="gou" :class="immediately.value2 ? 'checked' : 'no-checked'"></div>
                      <div class="daxiao">大</div>
                    </div>
                    <div class="gou-container" @click="immediatelyCheck(3)">
                      <div class="gou" :class="immediately.value3 ? 'checked' : 'no-checked'"></div>
                      <div class="europe">欧</div>
                    </div>
                  </div>
                  <div class="width87 text-center">数据</div>
                  <div class="text-center width56">操作</div>
                </div>
              </div>
            </ul>
          </div>
        </div>
        <!--
        即使/赛果/赛程/预约
        -->
        <div class="scrollbar_wrap" ref="scrollbarContainer">
          <!-- 即时 -->
          <football0
            :itemHeight="60"
            @getList="getList"
            @getFootList="getFootList"
            :lang="langIndex"
            :list="list1"
            :id="id"
            :setConf="setConf"
            @getHeight="getHeight"
            @setHeight="setHeight"
            @setTop="setTop"
            @getallNum="getallNum"
            :topList="topList"
            ref="football0"
            v-show="tabIndex == 0"
          ></football0>
          <!-- 赛果 -->
          <football1
            v-if="tabIndex == 1"
            ref="football1"
            :time="timeType"
            :id="id"
            @getallNum="getallNum"
            :lang="langIndex"
          >
          </football1>
          <!-- 赛程 -->
          <football2
            v-if="tabIndex == 2"
            ref="football2"
            :time="timeType"
            :id="id"
            @getallNum="getallNum"
            :checked="checked"
            :lang="langIndex"
          >
          </football2>
          <!-- 收藏 -->
          <football3
            v-if="tabIndex == 3"
            ref="football3"
            :time="timeType"
            :id="id"
            :itemHeight="60"
            @getallNum="getallNum"
            :checked="checked"
            :lang="langIndex"
          >
          </football3>
        </div>
        <div
          class="football-score-legend-container"
          style="
            position: fixed;
            height: auto;
            background: transparent;
            bottom: 0;
            padding: 10px 0;
            background: white;
            margin-bottom: 0;
          "
          v-if="tabIndex == 0"
        >
          <div>
            <span class="label">图例:</span>
            <div class="legend-item flex-start" v-for="(item, index) in legendList" :key="index">
              <img :src="getImageUrl(`/static/images/f-${index}.png`)" />{{ item }}
            </div>
            <div class="legend-item">
              <img src="/static/images/yan.png" />
              隐藏
            </div>
            <div class="legend-item">
              <img :src="getImageUrl('/static/images/icon-reserve.png')" alt="预约" />预约
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import football0 from './football-0.vue'
import football1 from './football-1.vue'
import football2 from './football-2.vue'
import football3 from './football-3.vue'
import { match_filter, football_match, exponent_company } from '@/api/football.js'
import { collect } from '@/api/common.js'
import pollingGetScoreList from '@/mixins/pollingGetScoreList.js'
import scorePageMixins from '@/mixins/scorePageMixins.js'
import { getImageUrl } from '@/utils/common.js'
import { myMIxins } from './ballMixins.js'

export default {
  name: 'FootballScore',
  components: {
    football0,
    football1,
    football2,
    football3
  },
  mixins: [pollingGetScoreList, scorePageMixins, myMIxins],
  data() {
    return {
      setConf: {
        action: 0, //0不操作 1显示 2不显示
        timingDataId: [],
      },
      adCode: '012',
      footballBanner: '',
      timeInterval: null,
      mainHeight: 0,
      objNum: {
        a: 0,
        b: 0,
        c: 0,
        d: 0
      },
      id: 2,
      dataList: [],
      dataList1: [],
      checked: false, //是否打开列表的欧赔指数
      selectId: 1, //选中完整热门
      selectLi: '完整', //选中的完整热门
      boxLi: '',
      time: '',
      bosList: [],
      typeTab: 0,
      timeType: {},
      langMask: false,
      loading: false,
      allCheck: false, //全选
      footballList: [],
      langIndex: 0,
      checkIndex: 0,
      match_id: 0,
      isSearch: false,
      num0: 0, //搜索改变数量
      allNum: 0, //搜索总数
      inputValue: '', //搜索内容
      loadingMask: false, //加载
      langList: ['简体', '繁体', 'English'],
      tabIndex: 0, //
      status: 'competition_id', //赛事选中的状态
      countryList: [], //赛事选中列表
      maskIndex: null, //显示的弹窗
      dateTime: [], //时间列表
      timeIndex: 0, //时间下表
      footList: [], //选中列表
      matchList: [],
      topList: [], //即时比.分置顶列表
      matchList1: [],
      allList: [], //总数组
      concealList: [], //选中的保留
      screen: {
        list: [],
        country: {},
        count_1: null,
        count_2: null,
        competition: {},
        count_country: null,
        count_competition: null
      }, //筛选对象competition-赛事；country-国家
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      pickerBeginDateBefore1: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      height: document.documentElement.clientHeight - 166 - 90,
      tabList: ['即时', '赛果', '赛程'],
      legendList: [
        '进球',
        '点球',
        '点球射失',
        '乌龙球',
        '换人',
        '角球',
        '黄牌',
        '红牌',
        '两黄变红',
        '受伤离场',
        '动画',
        '视频'
      ]
    }
  },

  mounted() {
    this.$store.state.type = 1
    this.resetParams()
    this.getList()
    // this.getAllList()
  },
  computed: {
    shouNum() {
      return this.$store.state.shouNum
    },
    infos() {
      return this.$store.state.user.infoData
    },
    game() {
      return this.$store.state.game
    },
    immediately() {
      return this.$store.state.immediately
    },
    list1() {
      return this.filterInvalidTitles('football', this.dataList1, this.topList || [])
    }
  },
  created() {
    this.$store.state.loading = true
    // 先不取储存 this.langIndex = Number(localStorage.getItem('langIndex')) || 0
    this.langIndex = 0
  },
  watch: {
    // 监听赛事切换监听
    checkIndex(e) {
      if (e == 0) {
        this.screen.list = this.screen.competition
      } else {
        this.screen.list = this.screen.country
      }
    },
    langIndex(e) {
      this.langMask = false
      localStorage.setItem('langIndex', e)
    },
    langMask(e) {
      if (e) {
        this.maskIndex = null
      }
    },
    tabIndex(e) {
      this.resetParams()
      // 赛果
      if (e == 1) {
        this.get6Days(2)
        this.timeIndex = 5
        if (this.tabIndex == 0) {
          // this.$refs.football0.update()
        }
      } else if (e == 2) {
        // 赛程
        this.timeIndex = 0
        this.get6Days(1)
        this.timeType = this.dateTime[0] // 更新当前查询日期 , 取第一个
      } else if (e == 0) {
        this.getList() // 需要重新请求数据
      }
      // 不加这个会造成首次进入赛果未带入当天日期
      // this.$nextTick(() => {
      //   this.getCheckList()
      // })
    },
    timeIndex(e) {
      if (e == null) {
        return
      }
      this.resetParams()
      this.timeType = this.dateTime[e]
    },
    listType1(e) {
      this.listType1 = e
    },
    inputValue(e) {
      this.$refs['football' + this.tabIndex].searchText(e)
    }
  },
  methods: {
    getImageUrl,
    // 重置参数
    resetParams() {
      this.checkIndex = 0 // 重置 赛事/国家地区tab
      this.$store.state.concealNum = 0 // 重置
    },
    /* 修改子集滚动状态 */
    changeFlag() {
      if (this.tabIndex == 0) {
        this.$refs.football0 && this.$refs.football0.changeFlag(false)
      }
    },
    /* 子集获取高度 */
    getHeight(e) {
      let i = 0
      this.dataList1.forEach((item) => {
        if (item.note) {
          i++
        }
      })
      this.mainHeight = e + i * 31
    },
    /* 子集获取高度 */
    setHeight(e) {
      // document.documentElement.scrollTop = e
    },
    // 获取搜索总数
    getallNum(allNum) {
      this.allNum = allNum
    },
    /* 全选 */
    setAllCheck1() {
      if (this.tabIndex == 0) {
        this.$refs.football0.setAllCheck1(this.allCheck)
        this.allCheck = !this.allCheck
      }
    },
    // 搜索
    search() {
      // let allNum = this.$refs['football' + this.tabIndex].searchText(this.inputValue)
      // this.allNum = allNum
    },
    // 清除搜查
    clearSearch() {
      this.inputValue = ''
      this.allNum = 0
      this.$refs['football' + this.tabIndex].clearSearch()
    },

    // 切换显示红牌 黄牌
    setGame(type, num) {
      if (type == 'voice' && num == 1) {
        this.$store.state.game[type] = true
      } else if (type == 'voice' && num == 2) {
        this.$store.state.game[type] = false
      } else if (type == 'lang') {
        this.langIndex = num
      } else {
        this.$store.state.game[type] = !this.$store.state.game[type]
      }
      // this.$refs.popover3.hide()
      localStorage.setItem('gameSeting', JSON.stringify(this.$store.state.game))
    },

    // 申请主播
    applyFor() {
      if (Object.keys(this.infos).length === 0) return (this.$store.state.user.showLoginMask = true)
      if (this.infos.is_anchor == 1) {
        router.push({
          name: 'mySpace',
          state: {comp: 6}
        })
        window.open(routeData.href, '_self')
      } else {
        router.push({
          name: 'mySpace',
          state: {comp: 7}
        })
      }
    },

    // 隐藏
    conceal() {
      this.setConf.action = this.setConf.action === 2 ? 0 : 2
      if (this.footList.length == 0) return
      let arr = []
      this.dataList.forEach((item) => {
        if (item.id == undefined) return
        if (this.footList.indexOf(item.id) !== -1) {
          arr.push(item.id)
        }
      })
      this.concealList = arr
      this.$store.state.concealNum = arr.length
    },
    // 保留
    retain() {
      this.setConf.action = this.setConf.action === 1 ? 0 : 1
      if (this.footList.length == 0) return
      let arr = []
      this.dataList.forEach((item) => {
        if (item.id == undefined) return
        if (this.footList.indexOf(item.id) == -1) {
          arr.push(item.id)
        }
      })
      this.$store.state.concealNum = arr.length
      this.concealList = arr
    },
    /* 获取选中列表 */
    getFootList(e) {
      this.footList = e
    },
    // 收藏
    collect() {
      if (!this.infos.id) {
        return this.$message.error('请登录后进行操作')
      }
      if (this.footList.length == 0) return
      let data = {
        match_ids: this.footList,
        match_type: 1
      }
      collect(data)
        .then((res) => {
          this.getList()
          this.$message.success('操作成功')
        })
        .catch((res) => {
          this.$message.error(res.msg || res.data?.msg || '操作失败')
        })
    },
    // 取消隐藏
    cancelConceal() {
      this.concealList = []
      this.$store.state.concealNum = 0
      // 同步清除过滤模式,否则左侧"隐藏"按钮高亮和 listFilter 过滤会与头部状态不一致
      this.setConf.action = 0
    },

    // 获取选中的赛事
    setCheckList() {
      let list = []
      let num = 0
      list.push(1000000)
      // this.$refs.popover1.hide()
      // 按赛事选择
      if (this.checkIndex == 0) {
        let arr = this.screen.competition

        for (let i in arr) {
          arr[i].list.forEach((item) => {
            if (item.check) {
              list.push(item.id)
            } else {
              num += item.count
            }
          })
        }
        this.status = 'competition_id'
        // this.countryList = list
      } else {
        // 按国家/地区选择
        let arr = this.screen.country
        for (let i in arr) {
          arr[i].list.forEach((item) => {
            if (item.check) {
              list.push(item.id)
            } else {
              num += item.count
            }
          })
        }
        this.status = 'country_id'
        this.countryList = list
      }
      if (this.tabIndex == 0) {
        // 即时比分
        // this.$refs.football0.update()
      } else {
        // 赛果赛程
        this.$refs['football' + this.tabIndex].screenList(list, this.status)
      }
      this.$store.state.concealNum = num
      this.getMaskShow(2)
      this.$nextTick(() => {
        // 返回顶部
        this.$refs['football' + this.tabIndex].$refs.scoreScroller.scrollToPosition(-250)
      })
    },
    // 全选/反选
    setAllCheck(status) {
      let checkedNum = 0
      if (this.checkIndex == 0) {
        let arr = this.screen.competition
        for (let i in arr) {
          arr[i].list.forEach((item) => {
            if (status) {
              item.check = status
              checkedNum++
            } else {
              item.check = !item.check
              if (item.check) checkedNum++
            }
          })
        }
        if (status) {
          this.screen.count_2 = this.screen.count_competition
        } else {
          this.screen.count_2 = checkedNum
        }
        this.screen.list = arr
      } else {
        let arr = this.screen.country
        for (let i in arr) {
          arr[i].list.forEach((item) => {
            if (status) {
              item.check = status
              checkedNum++
            } else {
              item.check = !item.check
              if (item.check) checkedNum++
            }
          })
        }
        if (status) {
          this.screen.count_1 = this.screen.count_country
        } else {
          this.screen.count_1 = checkedNum
        }
        this.screen.list = arr
      }
    },
    setCheckStatus(e, item) {
      if (e.target.tagName === 'INPUT') return
      item.check = !item.check
      if (item.check && this.checkIndex == 0) {
        this.screen.count_2++
      }
      if (!item.check && this.checkIndex == 0) {
        this.screen.count_2--
      }
      if (item.check && this.checkIndex == 1) {
        this.screen.count_1++
      }
      if (!item.check && this.checkIndex == 1) {
        this.screen.count_1--
      }
    },

    // 调用筛选
    // getCheckList() {
    //   let data = {
    //     ball: 0,
    //     type: this.match_id,
    //     match_filter: this.tabIndex
    //   }
    //   if (this.tabIndex == 1 || this.tabIndex == 2) {
    //     data.date = this.timeType.day
    //   }

    //   match_filter(data)
    //     .then((res) => {
    //       res.data.count_1 = res.data.count_country
    //       res.data.count_2 = res.data.count_competition
    //       res.data.list = res.data.competition
    //       this.screen = res.data
    //       let list = []
    //       res.data.competition.forEach((item1) => {
    //         item1.list.forEach((item) => {
    //           if (item.check) {
    //             list.push(item.id)
    //           }
    //         })
    //       })
    //       list.push(1000000)
    //       this.countryList = list
    //       this.status = 'competition_id'
    //       if (this.tabIndex != 0) {
    //         this.$refs['football' + this.tabIndex].screenList(list, 'competition_id')
    //       }
    //     })
    //     .catch((res) => {})
    // },

    addEvent() {
      //监听是否有网络
      if (!navigator.onLine) {
        this.onLine = true
        this.$message.error('当前网络不可用')
        return
      } else {
        this.$message.success('网络连接正常!')
      }
    },

    // setItem(){
    // 	if(this.tabIndex == 0)
    // },

    // 选择公司
    selectTab(item, type) {
      if (type == 2) {
        this.id = item.id
        this.boxLi = item.name
        this.getList()
        // this.$refs.popover.hide()
      } else if (type == 1) {
        this.match_id = item.id
        // this.$refs.popover2.hide()
        // this.getCheckList()
        this.selectId = item.id
        this.selectLi = item.name
      } else {
        this.selectId = item.id
        this.selectLi = item.name
      }

      this.maskIndex = null
    },
    // 显示隐藏弹窗
    getMaskShow(type) {
      if (this.maskIndex == type) {
        return (this.maskIndex = null)
      }
      if (this.langMask) {
        this.langMask = false
      }
      this.maskIndex = type
      if (type == 1) {
        //
        this.matchList = [
          {
            name: '完整',
            id: 0
          },
          {
            name: '热门',
            id: 1
          }
        ]
      }
    },
    // 跳到对应区域(进行中/未开始/已结束/异常比赛)
    // setTab(type) {
    // 	this.typeTab = type
    // 	this.$nextTick(() => {
    // 		// this.$refs['scrollbarContainer'].wrap.scrollTop = 500
    // 		// document.querySelector(".el-main").scrollTop = anchor.offsetTop;
    // 		// this.$refs.scrollbarContainer.scrollTop = 0
    // 	});
    // },
    setTab1(e) {
      this.typeTab = e
    },

    // 获取足球数组
    // 选中的日期
    change(e) {
      let data = {
        day: e
      }

      this.timeType = data
      this.timeIndex = null
    },

    /* 设置置顶 */
    setTop(item) {
      this.setArr(this.dataList1, 2)
    },

    // getAllList() {
    //   this.getList(1)
    //   this.getList(2)

    //   this.allList = res.data.data
    // },

    // 获取列表
    async getList() {
      if (this.isFirstGetList) this.$store.state.loading = true
      try {
        if (this.tabIndex === 0) {
          const [res1, res2] = await Promise.all([
            football_match({
              type: 1
            }),
            football_match({
              type: 2
            })
          ])

          this.$store.state.loading = false

          if (res1 && res2) {
            this.setConf.timingDataId.splice(0)
            let getId = []
            // 不再在轮询里强制 action=0,避免用户的保留/隐藏状态被自动撤销
            res1.data.data.forEach(item => {
              getId.push(item.id)
            })
            this.setConf.timingDataId.splice(0, ...getId)
            this.allList = [...res1.data.data.map(x => ({timing: true, ...x})), ...res2.data.data]
          }

          this.setArr(this.allList, 1)
          if (this.isFirstGetList) {
            if (this.tabIndex === 0) this.pollingGetList('football', 0, this.getList)
            this.isFirstGetList = false
          }
        }
      } catch (error) {
        console.error(error)
        this.$store.state.loading = false
      }
    },

    /* 重组数组 */
    setArr(data, type) {
      // return
      this.list = []
      let list1 = [] // 进行中
      let list2 = [] // 未开始
      let list3 = [] // 完场
      let list5 = [] // 异常
      let arr = []
      data.forEach((obj) => {
        let obj1 = {
          eu: {
            scram: {
              win: 0,
              draw: 0,
              fail: 0
            },
            initial: {
              win: 0,
              draw: 0,
              fail: 0
            },
            immediate: {
              win: 0,
              draw: 0,
              fail: 0
            }
          },
          bs: {
            scram: {
              win: 0,
              draw: 0,
              fail: 0
            },
            initial: {
              win: 0,
              draw: 0,
              fail: 0
            },
            immediate: {
              win: 0,
              draw: 0,
              fail: 0
            }
          },
          asia: {
            scram: {
              win: 0,
              draw: 0,
              fail: 0
            },
            initial: {
              win: 0,
              draw: 0,
              fail: 0
            },
            immediate: {
              win: 0,
              draw: 0,
              fail: 0
            }
          }
        }
        obj = Object.assign(obj, obj1)
        obj.new_away_team_name_zh = obj.away_team_name_zh
        obj.new_home_team_name_zh = obj.home_team_name_zh
        if (this.getMatchStatusType('football', obj) === 3) {
          //完场
          obj.type = 3
          list3.push(obj)
        } else if (this.getMatchStatusType('football', obj) === 1) {
          //进行中

          obj.type = 1

          list1.push(obj)
        } else if (this.getMatchStatusType('football', obj) === 2) {
          //未开始
          obj.type = 2
          list2.push(obj)
        } else if (this.getMatchStatusType('football', obj) === 5) {
          //异常
          obj.type = 4
          list5.push(obj)
        } else {
          obj.type = 5
        }
        arr.push(obj.competition_id)
      })
      let arrList = this.list.concat(list1).concat(list2).concat(list3).concat(list5)
      // 添加标题
      if (list1.length > 0)
        arrList.splice(0, 0, {
          typeTitle: 0,
          competition_id: 1000000,
          country_id: 1000000,
          competition_name_zh: '进行中',
          id: 1000000,
          imgUrl: getImageUrl('/static/images/main-beigin.png')
        })
      if (list2.length > 0)
        arrList.splice(
          arrList.findIndex((it) => it.id === list2.slice(0, 1)[0].id),
          0,
          {
            typeTitle: 1,
            competition_id: 1000000,
            country_id: 1000000,
            competition_name_zh: '未开始',
            id: 1000001,
            imgUrl: getImageUrl('/static/images/main-end.png')
          }
        )
      if (list3.length > 0)
        arrList.splice(
          arrList.findIndex((it) => it.id === list3.slice(0, 1)[0].id),
          0,
          {
            typeTitle: 2,
            competition_id: 1000000,
            country_id: 1000000,
            competition_name_zh: '已结束',
            id: 1000002,
            imgUrl: getImageUrl('/static/images/main-ends.png')
          }
        )
      if (list5.length > 0)
        arrList.splice(
          arrList.findIndex((it) => it.id === list5.slice(0, 1)[0].id),
          0,
          {
            typeTitle: 3,
            competition_id: 1000000,
            country_id: 1000000,
            competition_name_zh: '异常',
            id: 1000003,
            imgUrl: getImageUrl('/static/images/main-yi.png')
          }
        )

      // this.updateVisibleData()
      /* 处理置顶思路
					1.判断列表长度
					2.将列表数据筛选
					3.在原来的数组中添加
				 */
      let topList = JSON.parse(localStorage.getItem('topList')) || []

      this.topList = topList
      /* 判断是否为空 */

      /*
          空：增加标题和选中的数据
          非：增加选中的数据
          第一次进入：获取缓存，渲染列表
				 */
      let visibleTopList = arrList.filter((item) => {
        // screenListT有延迟
        return topList.indexOf(item.id) !== -1
      })
      if (visibleTopList.length != 0) {
        // let newTopList = []
        let a = arrList.filter((item, index) => {
          return topList.indexOf(item.id) !== -1
        })
        let b = arrList.filter((item, index) => {
          return topList.indexOf(item.id) == -1
        })
        arrList = [...a, ...b]
        arrList.splice(0, 0, {
          typeTitle: 4,
          competition_id: 1000000,
          country_id: 1000000,
          competition_name_zh: '置顶',
          id: 1000009,
          imgUrl: getImageUrl('/static/images/main-beigin.png')
        })
      }

      this.dataList = arrList
      this.dataList1 = arrList
      this.goingList = list1
      // })
    },

    // 切换亚/大/欧
    immediatelyCheck(type) {
      let immediately = this.$store.state.immediately
      immediately['value' + type] = !immediately['value' + type]
      // 判断有三个为true
      if (immediately.value1 && immediately.value2 && immediately.value3) {
        immediately.value4 = true
      } else {
        immediately.value4 = false
      }
      localStorage.setItem('immediately', JSON.stringify(immediately))
    },
    // 获取数量
    getNumber(e) {
      this.objNum = e
    },

    getShow() {
      this.$refs.abc.focus()
    },
    //获取六天数据
    get6Days(type) {
      //type==1前,2后
      //获取系统当前时间
      var now = new Date()
      var nowTime = now.getTime()
      var oneDayTime = 24 * 60 * 60 * 1000
      let arr = []
      let ShowTime
      for (var i = 0; i < 6; i++) {
        //显示周一
        if (type == 1) {
          ShowTime = nowTime + i * oneDayTime
        } else {
          ShowTime = nowTime - i * oneDayTime
        }

        //                    var ShowTime = nowTime + (i+1)*oneDayTime ;
        //初始化日期时间
        var myDate = new Date(ShowTime)
        var year = myDate.getFullYear()
        var month = myDate.getMonth() + 1
        var date = myDate.getDate()
        var str = '周' + '日一二三四五六'.charAt(myDate.getDay())
        arr.push({
          data: month + '-' + date.toString().padStart(2, '0'),
          time: str,
          day: year + '-' + month + '-' + date
        })
      }
      if (type == 1) {
        this.dateTime = arr
      } else {
        this.dateTime = arr.reverse()
      }
    },
    disableDates(date) {
      const today = new Date()
      if (this.tabIndex === 1) {
        return date.getTime() >= today.getTime()
      } else {
        return date.getTime() < today.getTime()
      }
    }
  },
  beforeUnmount() {
    window.clearInterval(this.timeInterval)
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/liveScore.scss';

.datePicker {
  position: absolute;
  top: 0;
  left: -50px;
  z-index: -1;
}
</style>
<style lang="scss" scoped>
.checkbox-group-container {
  display: flex;
  left: 0;
  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: 10px;
  }
  .ant-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
    .icon_check {
      width: 20px;
      height: 20px;
      margin-right: 2px;
    }
  }
}
.header-date-filter {
  :deep(.datePicker) {
    position: fixed;
    pointer-events: none;
    opacity: 0;
  }
}
</style>
<style lang="scss">
.app-wrapper {
  /* 防止挡住滚动条 */
  .global-chat-win {
    right: 6px;
  }

  .list-view-item {
    padding: 0;
  }

  #ScoreBoard
    .score-container
    .score-container-main
    .container-section
    .score_list_item:nth-child(odd)
    li {
    background-color: #fff;
  }

  .vue-recycle-scroller__item-wrapper {
    margin-bottom: 10px;
  }

  #ScoreBoard {
    .score-container-main {
      padding-top: 136px;
      .score-main--top {
        position: fixed;
        top: 54px;
        z-index: 3;
      }
    }
    &.score_football,
    &.score_gaming {
      .score-container-main {
        padding-top: 166px;
        &.tabIndex1,
        &.tabIndex2 {
          padding-top: 226px;
        }
      }
    }
  }
}
.actionClass {
  * {
    color: #b88230;
  }
  .left-nav-yingcang {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAKlBMVEUAAADmr3TkrXPkrXLkrXPlrXPlrnPss3jor3TlrXPzvYXkrXPkrXPjrHKZVqLwAAAADXRSTlMAPOPIln9TFSRnCLetO02gWAAAARRJREFUOMvtkD1LA0EQhgcULjEW22iXWkQDV1jYXGsXELHQInBWFiKIH71YK1ikFSzyA9JYCmKfIkfi9/NfzHC7t7nbVJaSt5llntmZd0b+tZa6RnobZyFYZCgd+iFoMpY2byFIJslTsqBXHWJpQD/shJEajCr5WoufSXiA3TK4gTW1BqPqB651mQS2fVpbWKMXwL3P3wJpvv8zZKnLX0KxWQ/IDvKiE30bsRoAbB4erXYTgI/CBiV5k8tUZPwFvvewegJid0ttu/IKsHUs7cJVnfwozbz0HLJHEfdywNWpOvApHuiJvtwWsQUuDjXqNDMNGvBuZ4xlGkQtOyPaT0tArnakpDt4kVlagHQmiAbrMtdf9AvUxLNy2QsgnQAAAABJRU5ErkJggg==)!important;
  }
  .left-nav-gouxuan {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAKlBMVEUAAADxvYHkrHLlrXPnrnnkrXLkrXLkrXPkrXPkrXLlrHTmr3bkrXPjrHIsQgpmAAAADXRSTlMACfVyFNa9jeirTTJdqj3sYwAAAQdJREFUOMtjoAWQMp+WWbwQQ5jxpO5dILg0RwBNwgIoqhoEJJpRZZbevZu8hYHB2+zu3Shkcfa7l0wgLGfduwVIFuReKoGx3XWvIQwTvduNULXjbiCcnXvVASHBEnsNbgNYDUI/3Ja1N0AaEFp6b0GtjtVG9dOmqxDrmWFaEUYbgGmJSw6oEiy6jWD67GX0gLO9A6bmXkGX8L0Jtls3AV2C7RLIdi6gVQgAdc4CMLkBXYIbrJb9rgO6BAvYA5yXMKNZdwLIpquYErEJOCVwGoXTcpzOxelBnEGCKxBxBjvOiMIftQxYEgOu5EMgwWEmUUKJGjMbEM44mFkNYRha5iScnREFAA0AAEzPftWAZHkoAAAAAElFTkSuQmCC)!important;
  }
}
</style>
