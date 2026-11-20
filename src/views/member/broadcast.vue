<!-- 开播 -->
<template>
  <div class="star-lLive-page" style="position: relative">
    <div
      class="start-live-btn"
      style="z-index: 3"
      @click="(dialogVisible = true), reSet(), (status = '')"
    >
      <img
        class="start-live-img"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAdVJREFUWAntV71KA0EQzolapfEHfIBgIwiKD+B1PkBKn8LayicQyxBS2doIFumtBSsFEUHQQjD+oYhRc36DGRkGk53JrXLFLQw7MzvfN3NzOxetVAwry7IqpAm5g3gXYQhbNaSyhYCs4a3il/iGJVtiCQL5LeJmIBuQYwtGxCxB34Z0kiSZFf7RVfG0qZcF2JTxFuyYJeg/Y8qCQt0uXIfGQxWr8zlc0HPlW8T0vLIP5y3oq2xjPxR6UPUW9AzGHcX6rux92PLTEP8t8NhiT1XyoEkYxgeDERC/ekvWITGFK8h7h6bR/j31gOu41G/sw/km9GW2sV8IPah6C+qB8VGxZsp+UTFddZ7f5EuJPfWyEYbxFmzh7lBZUOi1eS81TdmBIq2rKdvC+YqIORN6UPUW9AnGS8Wqp+xGxTyp+PwmTwlNjJeNMIy3YMtLHepS2aFYHfr5izBEOOQ8Bsc3PaakzZOSY28PKdZ3hCJqkNMcxRC2Zslq+leaiEBIH9EFyBTZYjWhz0M6kLrws3oP5QRf8w92/OmOQo/6nbuOkahwY+9+KHTjAdIV0ut3iDbpJ33Nm8D740r8k5CJAYm03/0G3IABhURzj9KhXWSnLlnWlSVIxnwBY+bsFQp1eDgAAAAASUVORK5CYII="
      />我要开播
    </div>
    <div></div>
    <div class="i-tabs-container">
      <div class="header-nav">
        <a>
          <div class="item first-item">开播记录</div>
        </a>
      </div>
      <div class="tab-pane-item" name="开播记录">
        <div class="star-live-page-recode" style="padding-bottom: 80px">
          <div class="recode">
            <div class="table-container">
              <div class="ant-table-wrapper">
                <div class="ant-spin-nested-loading">
                  <div class="ant-spin-container">
                    <div class="ant-table">
                      <div class="ant-table-container">
                        <div class="ant-table-content">
                          <table style="table-layout: fixed">
                            <colgroup>
                              <col style="width: 88px" />
                              <col style="width: 88px" />
                              <col style="width: 88px" />
                              <col style="width: 88px" />
                              <col style="width: 88px" />
                              <col style="width: 88px" />
                              <col style="width: 88px" />
                              <col style="width: 88px" />
                              <col style="width: 88px" />
                              <col style="width: 88px" />
                              <col style="width: 88px" />
                              <col style="width: 88px" />
                              <col style="width: 88px" />
                            </colgroup>
                            <thead class="ant-table-thead">
                              <tr>
                                <!-- <th class="ant-table-cell align-center">直播分类</th> -->
                                <th class="ant-table-cell align-center">赛事分类</th>
                                <th
                                  title="赛事名称"
                                  class="ant-table-cell align-center ant-table-cell-ellipsis"
                                >
                                  赛事名称
                                </th>
                                <th
                                  title="主场"
                                  class="ant-table-cell align-center ant-table-cell-ellipsis"
                                >
                                  主场
                                </th>
                                <th
                                  title="客场"
                                  class="ant-table-cell align-center ant-table-cell-ellipsis"
                                >
                                  客场
                                </th>
                                <th
                                  title="开赛时间"
                                  class="ant-table-cell align-center ant-table-cell-ellipsis"
                                >
                                  开赛时间
                                </th>
                                <th class="ant-table-cell align-center">直播状态</th>
                                <th
                                  title="直播标题"
                                  class="ant-table-cell align-center ant-table-cell-ellipsis"
                                >
                                  直播标题
                                </th>
                                <th class="ant-table-cell align-center">直播时长</th>
                                <th class="ant-table-cell align-center">观看人数</th>
                                <th class="ant-table-cell align-center">获得钻石</th>
                                <!-- <th class="ant-table-cell align-center">获得球票</th> -->
                                <th
                                  title="操作"
                                  class="ant-table-cell align-center ant-table-cell-ellipsis"
                                >
                                  操作
                                </th>
                              </tr>
                            </thead>
                            <tbody class="ant-table-tbody">
                              <tr
                                data-row-key="1313711"
                                v-for="(item, index) in list.data"
                                :key="index"
                                class="ant-table-row ant-table-row-level-0"
                              >
                                <td class="ant-table-cell align-center">
                                  {{ item.typeName }}
                                </td>
                                <!-- <td class="ant-table-cell align-center">
																	<div style="color: rgb(153, 153, 153);">足球</div>
																</td> -->
                                <td class="ant-table-cell align-center ant-table-cell-ellipsis">
                                  <a style="color: rgb(153, 153, 153)">{{ item.name }}</a>
                                </td>
                                <td class="ant-table-cell align-center ant-table-cell-ellipsis">
                                  <a style="color: rgb(153, 153, 153)">{{ item.home_name }}</a>
                                </td>
                                <td class="ant-table-cell align-center ant-table-cell-ellipsis">
                                  <a style="color: rgb(153, 153, 153)">{{ item.away_name }}</a>
                                </td>
                                <td class="ant-table-cell align-center ant-table-cell-ellipsis">
                                  <a style="color: rgb(153, 153, 153)">{{ item.match_time }}</a>
                                </td>
                                <td class="ant-table-cell align-center">
                                  <div style="color: rg b(153, 153, 153)">
                                    {{ item.isliveName }}
                                  </div>
                                </td>
                                <td class="ant-table-cell align-center ant-table-cell-ellipsis">
                                  <a style="color: rgb(153, 153, 153)">{{ item.title }}</a>
                                </td>
                                <td class="ant-table-cell align-center">
                                  {{ item.live_duration }}
                                </td>
                                <td class="ant-table-cell align-center">{{ item.viewers }}</td>
                                <td class="ant-table-cell align-center">
                                  <div style="color: rgb(255, 108, 0)">
                                    {{ item.hotvotes }}
                                  </div>
                                </td>
                                <!-- <td class="ant-table-cell align-center">
																	<div  style="color: rgb(0, 214, 120);">0
																	</div>
																</td> -->

                                <td
                                  title="开播设置"
                                  v-if="item.islive != 2"
                                  class="ant-table-cell align-center ant-table-cell-ellipsis"
                                  style="cursor: pointer"
                                >
                                  <span @click="setItem(item)">设置</span>
                                  <span
                                    style="margin-left: 10px"
                                    @click="setRoom(item)"
                                    :style="{
                                      color:
                                        item.islive == 0 ? 'rgb(0, 214, 120)' : 'rgb(255, 108, 0)'
                                    }"
                                    >{{ item.islive == 0 ? '开播' : '关播' }}</span
                                  >
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
          <ul class="ant-pagination" unselectable="unselectable">
            <el-pagination
              :background="true"
              v-model:current-page="page"
              layout="prev, pager, next"
              :total="total"
            />
          </ul>
          <div></div>
        </div>
      </div>
    </div>

    <el-dialog title="开播设置" :center="true" class="dialog" v-model="dialogVisible">
      <div role="document" class="ant-modal star-live-setting" style="width: 860px; top: 0">
        <div
          tabindex="0"
          aria-hidden="true"
          style="width: 0px; height: 0px; overflow: hidden; outline: none"
        ></div>
        <div class="ant-modal-content">
          <div class="ant-modal-body">
            <div class="dialog-content setting">
              <form class="ant-form ant-form-horizontal">
                <div class="ant-row ant-form-item" style="row-gap: 0px">
                  <div class="ant-col ant-form-item-label">
                    <label for="form_liveGroupId" class="ant-form-item-required" title="直播分类:"
                      >直播分类</label
                    >
                  </div>
                  <el-select v-model="gameType" placeholder="请选择" style="width: 202px">
                    <el-option
                      v-for="(item, index) in options"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div v-if="gameType === 3" class="ant-row ant-form-item" style="row-gap: 0px">
                  <div class="ant-col ant-form-item-label">
                    <label for="form_liveGroupId" title="电竞分类:"> 电竞分类 </label>
                  </div>
                  <el-select v-model="gameSort" placeholder="选择游戏" style="width: 202px">
                    <el-option
                      v-for="item in gameList"
                      :key="item.name_zh"
                      :label="item.short_name_zh"
                      :value="item.sourceid"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="ant-row ant-form-item" v-if="gameType < 2 || gameType === 3">
                  <div class="ant-col ant-form-item-label">
                    <label
                      for="form_matchInfo"
                      :class="gameType < 2 || gameType === 3 ? 'ant-form-item-required' : ''"
                      title="选择赛事:"
                    >
                      选择赛事
                    </label>
                  </div>
                  <div class="ant-col ant-form-item-control">
                    <div class="ant-form-item-control-input">
                      <div class="ant-form-item-control-input-content">
                        <div class="container" id="form_matchInfo">
                          <div class="like-ant-input">
                            {{ selectTitle ? selectTitle : '选择赛事' }}
                          </div>
                          <div class="op" @click="dialogVisible1 = true">查询</div>
                          <div class="op btnss" @click="copy(selectTitle)">复制名称</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ant-row ant-form-item" style="row-gap: 0px">
                  <div class="ant-col ant-form-item-label">
                    <label for="form_title" class="ant-form-item-required" title="开播时间:"
                      >开播时间</label
                    >
                  </div>
                  <div class="ant-col ant-form-item-control">
                    <div class="ant-form-item-control-input">
                      <div class="ant-form-item-control-input-content">
                        <el-date-picker
                          v-model="starttime"
                          type="datetime"
                          :picker-options="{
                            disabledDate: (time) => {
                              return time.getTime() < Date.now() - 3600 * 1000 * 24
                            }
                          }"
                          placeholder="开播时间"
                          @change="selectStartTime"
                        ></el-date-picker>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ant-row ant-form-item" style="row-gap: 0px">
                  <div class="ant-col ant-form-item-label">
                    <label for="form_title" class="ant-form-item-required" title="直播标题:"
                      >直播标题</label
                    >
                  </div>
                  <div class="ant-col ant-form-item-control">
                    <div class="ant-form-item-control-input">
                      <div class="ant-form-item-control-input-content">
                        <input
                          v-model="title"
                          maxlength="30"
                          placeholder="直播标题"
                          type="text"
                          id="form_title"
                          class="ant-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ant-row ant-form-item img-form-item" style="row-gap: 0px">
                  <div class="ant-col ant-form-item-label">
                    <label class="ant-form-item-required" title="直播间封面:">直播间封面</label>
                  </div>
                  <div class="ant-col ant-form-item-control">
                    <div class="ant-form-item-control-input">
                      <div class="ant-form-item-control-input-content">
                        <div class="img-right flex flex-start">
                          <div class="left flex">
                            <el-radio v-model="radioType" label="1"></el-radio>
                            <el-upload
                              class="avatar-uploader"
                              action="upload"
                              :auto-upload="false"
                              :on-change="beforeAvatarUpload"
                              accept="image/*"
                              :show-file-list="false"
                              :disabled="isUploading"
                            >
                              <img
                                style="width: 166px; height: 94px"
                                :src="thumbUpload"
                                v-if="thumbUpload"
                              />
                              <div
                                v-else
                                class="ant-upload ant-upload-select ant-upload-select-text"
                              >
                                <span tabindex="0" class="ant-upload" role="button"
                                  ><input
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                    style="display: none"
                                  />
                                  <div class="add-pic">
                                    <span
                                      role="img"
                                      aria-label="plus"
                                      class="anticon anticon-plus"
                                      style="font-size: 40px"
                                    >
                                      <svg
                                        viewBox="64 64 896 896"
                                        focusable="false"
                                        data-icon="plus"
                                        width="1em"
                                        height="1em"
                                        fill="currentColor"
                                        aria-hidden="true"
                                      >
                                        <defs></defs>
                                        <path
                                          d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"
                                        ></path>
                                        <path
                                          d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"
                                        ></path>
                                      </svg>
                                    </span>
                                  </div>
                                </span>
                              </div>
                            </el-upload>
                          </div>
                          <div class="right">
                            <div class="top flex">
                              <el-radio v-model="radioType" label="2"></el-radio>
                              <img class="default-img" src="/room.webp" />
                            </div>
                          </div>
                        </div>
                        <div class="up-bottom flex flex-start">
                          <div class="upload-tips">支持png、jpg格式图片大小不超过5M</div>
                          <p class="l-tip">默认图片</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ant-row ant-form-item" style="row-gap: 0px">
                  <div class="ant-col ant-form-item-label">
                    <label title="推流服务器地址:">推流服务器地址</label>
                  </div>
                  <div class="ant-col ant-form-item-control">
                    <div class="ant-form-item-control-input">
                      <div class="ant-form-item-control-input-content">
                        <input
                          disabled
                          :value="urlDomain"
                          type="text"
                          class="ant-input ant-input-disabled"
                        />
                        <div class="op btnss" @click="copy(urlDomain)">复制</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ant-row ant-form-item" style="row-gap: 0px">
                  <div class="ant-col ant-form-item-label">
                    <label title="串流密钥:">串流密钥</label>
                  </div>
                  <div class="ant-col ant-form-item-control">
                    <div class="ant-form-item-control-input">
                      <div class="ant-form-item-control-input-content">
                        <input
                          disabled
                          :value="urlKeys"
                          type="text"
                          class="ant-input ant-input-disabled"
                        />

                        <div class="op btnss" @click="copy(urlKeys)">复制</div>
                        <br />
                        <div class="op" @click="getLiveUrl()">获取推流地址</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="live-status-item-wrap">
                  <div class="ant-row ant-form-item" style="row-gap: 0px">
                    <div class="ant-col ant-form-item-label">
                      <label title="直播状态：">直播状态</label>
                    </div>
                    <div class="ant-col ant-form-item-control">
                      <div class="ant-form-item-control-input">
                        <div class="ant-form-item-control-input-content">
                          <div style="display: flex; margin-top: 9px">
                            <span class="live-status"> <div class="live-status-img"></div> </span
                            ><span class="live-status-word isLiveText">未直播</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="ant-row ------------rowData---------------anchorInfo?.status=0"
                  style="row-gap: 0px"
                >
                  <div class="btns">
                    <div class="btn" @click="dialogVisible = false">取消</div>
                    <div @click="submit()" class="ant-btn btn" style="padding: 0 15px">
                      <span>{{ status == 'edit' ? '完成' : '确 定' }}</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div
          tabindex="0"
          aria-hidden="true"
          style="width: 0px; height: 0px; overflow: hidden; outline: none"
        ></div>
      </div>
    </el-dialog>

    <el-dialog
      title="选择赛事"
      :center="true"
      width="800px"
      class="dialog"
      v-model="dialogVisible1"
    >
      <div class="ant-modal-body star-live-setting">
        <div class="dialog-content setting" style="padding-top: 0px; padding-bottom: 10px">
          <div class="container">
            <div class="list">
              <div>
                <div class="titleBox">
                  <ul class="spaceTab-base">
                    <li class="spaceTab-active">
                      {{ gameType == 1 ? '篮球' : gameType == 3 ? '电竟' : '足球' }}
                      <div class="active-bottom"></div>
                    </li>
                  </ul>
                </div>
                <div style="padding-right: 5px">
                  <div class="item title-box">
                    <div class="title-countryName">赛事名称</div>
                    <div class="title-time">比赛时间</div>
                    <div class="title-host">主队名称</div>
                    <div class="vs"></div>
                    <div class="title-guest">客队名称</div>
                  </div>
                  <div class="items">
                    <div
                      class="item"
                      :class="GameIndex == item.id ? 'active' : ''"
                      v-for="(item, index) in selectList"
                      :key="index"
                      :data-id="item.id"
                      @click="getActive(item)"
                    >
                      <div class="radio"></div>
                      <div class="img">
                        <div class="lazyload-wrapper">
                          <img
                            v-if="item.isShow"
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA2CAYAAACbZ/oUAAAAAXNSR0IArs4c6QAABNtJREFUaAXtml9oHEUcx2fmbntH26CkUlAqacUzl0uKNk/VvqkVfLi9a0vRh75INYVqi5Qi4h+MQtEn/1AQDE19qVI5ku7uiQ8W9EEfipJEEC8XU2qCsSktkVJtTHJ3O37n7G0nZ+Guezu3m2sGwv72N7vz+31mfjPzm70QslpWe6CleoBWaDjnNJ9KPc8J2Q9dN+F8faVuRV4p/Rt+/wLAwbhpnqCUAo2QMnBu9+57abF4CtCPr0i4Gk4D9hseDu9LDA/PMjGyrQwr+kIM5A1GSsd1/QUoBmp0UktUY6T72I052xJAtSAEK8ND3bUebKH6brbiV+PbGQ3sPGKE76iiEngei8Q58t9+GJhOVQIM0N8i0WhXl2U9qnV03MMofRPgS0GgprlkspyBeOkMgA8AdtlWN5lKJYqcD2IL3O6lrdttS80Ic36+2pGYaebivb07CGNHUDdfXd+seyXACN9bRg3t77cTpvlBeM2arYiCb5sFKdtRAyxZyOn6zolU6hlJRR4aGrqAhP4JEfpI5q/Jdapl5cAA2FCy7dNIYc28rt9XAQIsF/OcRaMJyF9W9KqvzQAuM2Cx0hHnuXwyKY6fTunMZP4AeBIr+T6AzzkVioSmAQv/AX2XTcgJhPlZgG+RmeKW9Vk4EumC7gtZ77XcVGDHec6fBPjP+OBwmPf3Oz7EMpkriWz2WSjSGO1Z53kPBceYh23W29Q627Y/yo+OfjexZ09cfimezZpRxhJY7U/Kei9kP4HL/iPMH7OXln4aTyZfw2iHK1BbDONqwrL2A/opjPbFir7Rq+/AAgCLWQR/x8ZHR3/4NZ1+RIYC9FmmaWILK8l6t3IggB3nOd9WLJV+xNx+3dFB6BwayiMSRmSdWzlYwKBAIvJ9iNLT1UAY4Y3VOjf3zpxx87KX75QzLsZeiRvGAOAQ4TdLeX5zvvmmxr0UFOCvwpp2IDY8PINFyqERn49JofAx6NOOskHBV2CM5BzwXkbScaqaA/P4ObtYfB/6u6vrGrn3DRiwGS0UeunBM2cuywDj6fRmYtsD2KN3ynqv5KYDA3SWMXaw0zAMGUJkXPmRkRd5qfQu9OvkOi/lpgIjfD9FBnVEJBUyBE5Rnci4BjFXd8h6FXKzgKdpKNTXZRhfyxAis8qPjR3ltv0WYKNynSpZOTBl7NwGTevZmMmIX/OcMrFr18MI4ZMA7XWUTRCUA2NUp2SOyUOHIoXp6TdKxeKr0Cu3L9sWsiqDbdWGxD2+kG4vTE2JE5A49/pSlADjrPs0aKwK0cW+vrXXLl06hvA9jJzY13RWzXdpcQCi9J0QYwb20x5Avg3YByod4OdVCbCfQLVs+xpetZxTUX/nASP7WVDRk0FsU7Ay/EvLhSA6p8InwcpAnVHReBDbFKws2t7+Hk4wE0F00EufBGOZVTQ6qevbCoSY+Gngfi+NBKYtSn/XCEnFLGusvEoLQWtr68GQfwInrwfG0cYduS6YBJtgFM3hfnkRyX1xZqYDo33LfHj50wG+o/Sv8KZN07HjxxcD7OWqa573wP9Cul4Ll/fuXf/n4mIah4K19b7jxXNweL49EjGqPyjU27br4+HcwsLngE3Wa8ir52CTwHYWF91Nm65zaWQtvh3iG7HtGhjn3Q+xmf/jppcbeadsE7bdtvEvUTWIm7J2kyAAAAAASUVORK5CYII="
                          />
                        </div>
                      </div>
                      <div class="countryName ellipsis">{{ item.competition_name_zh }}</div>
                      <div class="time">{{ item.match_time }}</div>
                      <div class="host ellipsis">{{ item.home_team_name_zh }}</div>
                      <div class="vs">-</div>
                      <div class="guest ellipsis">{{ item.away_team_name_zh }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="_btns">
                <div class="cancel" @click="dialogVisible1 = false">取消</div>
                <div class="ok" @click="dialogVisible1 = false">确定</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getLiveUrl,
  createRoom,
  getRoomList,
  startRoom,
  endRoom,
  updateLive,
  uploadImage
} from '../../api/user.js'
import { footballLiveList } from '../../api/football.js'
import { getLiveList } from '../../api/basketball.js'
import { getGameLiveList, getGames } from '@/api/game.js'
import { copyToClipboard, doCompressor } from '@/utils'
import { divide } from 'lodash-es'

export default {
  directives: {
    'el-select-loadmore': {
      inserted(el, binding) {
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },
  data() {
    return {
      id: '',
      url: '',
      urlDomain: '',
      urlKeys: '',
      list: [],
      total: 0,
      status: '',
      starttime: null, //開播時間
      title: '', //赛题
      thumb: '', // 提交到接口的直播封面
      thumbUpload: '', // 上传的直播封面
      options: [
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
        },
        {
          value: 4,
          label: '区块链'
        }
        // {
        // 	value: 2,
        // 	label: '其它'
        // }
      ],
      GameIndex: '',
      selectGameStartTime: null,
      match_id: null,
      selectList: [],
      gameType: null, //赛事分类
      page: 1,
      selectTitle: '', //选中的赛事标题
      loadStatus: 'more',
      dialogVisible: false,
      dialogVisible1: false,
      gameSort: null, // 电竞需要传 ，默认电竞分类 id 为 0
      gameList: [],
      matchList: [],
      radioType: '1', // 1 图片上传， 2 默认本地
      upload: {},
      isUploading: false
    }
  },
  watch: {
    gameType(cur, prev) {
      if (cur !== prev) {
        this.selectList = []
        if (this.status !== 'edit') {
          this.gameSort = null
          this.selectTitle = ''
        }
      }
      switch (cur) {
        case 0:
          this.football_match()
          break
        case 1:
          this.getList()
          break
        case 3:
          this.getGames()
          this.getGameList()
          break
      }
    },
    gameSort(cur, prev) {
      if (cur !== prev && this.status !== 'edit') {
        this.selectTitle = ''
      }
      this.getGameList()
      this.selectList = this.matchList.filter((item) => {
        return item.game_id === e
      })
    },
    page() {
      this.getRoomList()
    }
  },
  mounted() {
    this.getRoomList()
  },
  computed: {
    host() {
      return import.meta.env.VITE_ENV === 'production' ? '' : ''
    }
  },
  methods: {
    getActive(item) {
      this.selectTitle =
        item.competition_name_zh +
        ' ' +
        ' ' +
        item.match_time +
        ' ' +
        item.home_team_name_zh +
        ' - ' +
        item.away_team_name_zh
      this.GameIndex = item.id
      this.starttime =
        this.gameType === 0 || this.gameType === 3
          ? new Date(item.time * 1000)
          : new Date((item.match_times || item.time) * 1000)
      this.selectGameStartTime = new Date(item.time * 1000)
    },
    selectStartTime(val) {
      //允许主播调整调整开赛时间，赛事开始前进行直播
      this.starttime = val
      // let now = new Date();

      // if (this.selectGameStartTime == null) {
      // 	// 沒選擇賽事時, 選擇過去時間帶入當前時間
      // 	if (val < now) {
      // 		this.starttime = now
      // 	}
      // } else {
      // 	// 有選擇賽事時, 選擇過去時間帶入比賽時間
      // 	if (val < this.selectGameStartTime) {
      // 		this.starttime = this.selectGameStartTime
      // 	}
      // }
    },

    // 开/关播
    setRoom(item) {
      let data = {
        name: item.title,
        id: item.id
      }

      if (item.islive == 0) {
        //item.islive == 0需要开播
        // item.islive = 1
        startRoom({
          id: item.id
        })
          .then((res) => {
            this.$message.success('已开启直播')
          })
          .catch((res) => {})
      } else {
        //关播
        // item.islive = 0
        endRoom({
          id: item.id
        })
          .then((res) => {
            this.$message.success('已关闭直播')
          })
          .catch((res) => {})
      }
      setTimeout((res) => {
        this.getRoomList()
      }, 500)
    },
    setItem(item) {
      console.log(item)
      this.status = 'edit'
      // endRoomInfo({id:item.id}).then(res=>{ }).catch(res=>{})
      this.id = item.id
      this.gameType = item.type
      this.url = item.push
      this.thumb = item.thumb
      this.title = item.title
      this.match_id = item.match_id
      this.GameIndex = item.match_id
      this.gameSort = item.type === 3 ? item.game_id : null
      this.selectTitle =
        item.name +
        ' ' +
        ' ' +
        item.match_time.split(' ')[1] +
        ' ' +
        item.home_name +
        ' - ' +
        item.away_name
      this.starttime = item.starttime > 0 ? new Date(item.starttime * 1000) : Date.now()
      this.selectGameStartTime = new Date(item.starttime * 1000)
      this.dialogVisible = true
      this.setUrl()
      // 默认图片
      if (item.thumb.indexOf('room_zr.png') > -1 || item.thumb.indexOf('/room.webp') > -1) {
        this.radioType = '2'
        this.thumbUpload = ''
      } else {
        // 上传的图片
        this.radioType = '1'
        this.thumbUpload = item.thumb
      }
      // console.log(item);
      // data.id = this.id
      // data.type = this.gameType
      // data.thumb = this.thumb
      // data.title = this.title
      // data.match_id = this.GameIndex
    },
    reSet() {
      this.id = ''
      this.url = ''
      this.urlDomain = ''
      this.urlKeys = ''
      this.gameType = 0
      this.thumb = ''
      this.title = ''
      this.match_id = ''
      this.GameIndex = ''
      this.selectGameStartTime = null
      this.starttime = new Date()
      this.selectTitle = ''

      this.radioType = '1'
      this.thumbUpload = ''
    },
    // 赛事触底加载
    // loadMore(e) {
    // 	if (this.loadStatus == 'more') {
    // 		if (this.gameType == 0) { //足球
    // 			this.football_match()
    // 		} else if (this.gameType == 1) {
    // 			this.getList()
    // 		} else if (this.gameType == 3) {
    // 			this.getGameList()
    // 		}
    // 	}
    // },
    // 获取开播记录
    getRoomList() {
      if (!this.$store.state.user.infoData.id) return
      let data = {
        page: this.page
      }
      getRoomList(data)
        .then((res) => {
          this.list = res.data
          this.total = res.data.total
        })
        .catch((res) => {})
    },

    // 获取足球
    football_match() {
      let data = {
        type: 0,
        is_web: 1
      }
      footballLiveList(data)
        .then((res) => {
          let selectList = []
          let list1 = []
          let list2 = []
          res.data.forEach((item) => {
            let status = item.status
            item.isShow = false
            item.match_time = this.$common.timeStamp(item.time)
            if (
              status == 2 ||
              status == 3 ||
              status == 4 ||
              status == 5 ||
              status == 6 ||
              status == 7
            ) {
              item.isShow = true //当天的显示
              list1.push(item)
            } else if (status == 1) {
              list2.push(item)
            }
          })
          // list1.reverse()
          // list2.reverse()
          selectList = selectList.concat(list1).concat(list2)
          this.selectList = selectList
        })
        .catch((res) => {})
    },
    // 获取篮球
    getList() {
      let data = {
        type: 0,
        isWeb: 1
      }
      getLiveList(data)
        .then((res) => {
          let selectList = []
          let list1 = []
          let list2 = []
          res.data.forEach((item) => {
            item.isShow = false
            item.home_team_name_zh = item.home_team_data.short_name_zh
            item.away_team_name_zh = item.away_team_data.short_name_zh
            item.competition_name_zh = item.short_name_zh
            let id = item.status_id
            if (
              id == 2 ||
              id == 3 ||
              id == 4 ||
              id == 5 ||
              id == 6 ||
              id == 7 ||
              id == 8 ||
              id == 9
            ) {
              list1.push(item)
              item.isShow = true //当天的显示
            } else if (id == 1) {
              list2.push(item)
            }
          })
          // list1.reverse()
          // list2.reverse()
          selectList = selectList.concat(list1).concat(list2)
          this.selectList = selectList
        })
        .catch((res) => {})
    },
    // 獲取電競遊戲分類
    getGames() {
      getGames().then((res) => {
        this.gameList = res.data
      })
    },
    // 获取電競赛程
    getGameList() {
      let data = {
        type: 0,
        isWeb: 1
      }
      // 电竞
      if (this.gameType === 3) {
        data.game_id = this.gameSort ? this.gameSort : 0 // 默认 0 全部
      }
      getGameLiveList(data)
        .then((res) => {
          let selectList = []
          let list1 = []
          let list2 = []
          res.data.forEach((item) => {
            let status = item.status
            item.isShow = false
            item.competition_name_zh = item.series_name_zh
            item.time = item.match_time
            item.match_time = this.$common.timeStamp(item.match_time)
            // 電競 status 0:未開賽 1:進行中 2:已結束 4:已取消/异常
            if (status == 1) {
              list1.push(item)
              item.isShow = true //当天的显示
            } else if (status == 0) {
              list2.push(item)
            }
          })
          // list1.reverse()
          // list2.reverse()
          selectList = selectList.concat(list1).concat(list2)
          this.matchList = selectList
          this.selectList = selectList
        })
        .catch((res) => {})
    },
    // 上传图片回调
    async beforeAvatarUpload(rawFile) {
      const fileM = divide(rawFile.size, 1024 * 1024)

      if (!/jpeg|png|gif|bmp/gi.test(rawFile.raw.type)) {
        ElMessage.error('图片格式错误，仅支持 jpg, png, gif, bmp 格式')
        return false
      }

      if (rawFile.raw.type === 'image/jpeg') {
        if (fileM > 10) {
          ElMessage.error('jpg 图片仅支持 10M 以内，请换张图片试试')
          return false
        }
      } else {
        if (fileM > 2) {
          ElMessage.error('非 jpg 图片仅支持 2M 以内，请换张图片试试')
          return false
        }
      }

      try {
        this.isUploading = true

        const pic = await doCompressor(rawFile.raw)
        const { data } = await uploadImage({ pic })

        this.thumbUpload = `${data}`
        this.isUploading = false
      } catch (error) {
        ElMessage.error(error.msg)
        this.isUploading = false
      }
    },
    // 获取推流地址
    getLiveUrl() {
      getLiveUrl()
        .then((res) => {
          this.url = res.data.url
          this.id = res.data.id
          this.setUrl()
        })
        .catch((res) => {})
    },
    setUrl() {
      if (this.url.indexOf('live/') != -1) {
        let urlSplit = this.url.split('live/')
        this.urlDomain = `${urlSplit[0]}live/`
        this.urlKeys = urlSplit[1]
      } else {
        this.urlDomain = ''
        this.urlKeys = ''
      }
    },
    // 提交
    submit() {
      let data = {}
      this.thumb = this.radioType === '1' ? this.thumbUpload : '/room.webp'
      if (this.GameIndex == null) {
        return this.$message.warning('请选中直播分类')
      }
      if (!this.title) {
        return this.$message.warning('请输入直播标题')
      }
      if (!this.thumb) {
        return this.$message.warning('请上传直播封面')
      }
      if (this.starttime == null) {
        return this.$message.warning('请选择开播时间')
      }
      data.id = this.id
      data.type = this.gameType
      data.thumb = this.thumb
      data.title = this.title
      data.match_id = this.GameIndex
      data.starttime = parseInt(this.starttime.valueOf() / 1000)
      /* 编辑 */
      if (this.status == 'edit') {
        updateLive(data)
          .then((res) => {
            this.dialogVisible = false
            this.$message.success('编辑成功')
            setTimeout((res) => {
              this.getRoomList()
            }, 2000)
          })
          .catch((res) => {})
      } else {
        createRoom(data)
          .then((res) => {
            this.dialogVisible = false
            this.$message.success('创建成功')
            setTimeout((res) => {
              this.getRoomList()
            }, 2000)
          })
          .catch((res) => {})
      }
      // console.log();
    },

    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    // 复制
    copy(text) {
      if (copyToClipboard(text)) this.$message.success('复制成功')
      else this.$message.warning('该浏览器不支持自动复制')
    }
  }
}
</script>

<style lang="scss" scoped>
.star-lLive-page {
  :deep(.el-dialog) {
    .el-dialog__header {
      color: #333;
      font-size: 18px;
      text-align: center;
      font-weight: 700;
    }
  }
}
.star-lLive-page {
  position: relative;
}

.star-lLive-page .start-live-btn {
  width: 90px;
  height: 38px;
  background: url(/static/images/btn-wykb.png) no-repeat 50%;
  background-size: 100% 100%;
  text-align: center;
  line-height: 38px;
  position: absolute;
  font-size: 14px;
  color: #fff;
  top: 6px;
  right: 15px;
  cursor: pointer;
  z-index: 9;
  user-select: none;
}

.star-lLive-page .start-live-btn .start-live-img {
  width: 12px;
  height: 12px;
}

.star-live-page-recode .align-center {
  text-align: center;
}

.star-live-page-recode .table-container .ant-table-cell {
  border: none;
  font-size: 12px;
  padding: 13px 0;
}

.star-live-page-recode .table-container .ant-table-row:hover {
  background: #fff9f5;
}

.star-live-page-recode .table-container .ant-table-thead {
  background: #fffbf8;
}

.star-live-page-recode .table-container .ant-table-tbody {
  font-size: 12px;
  color: #999;
}

.star-live-setting .ant-modal-content {
  box-shadow: none;
}

.star-live-setting .loading-componet {
  height: 269px !important;
}

.star-live-setting .ant-modal-close-x {
  position: relative;
}

.star-live-setting .ant-modal-close-x:after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  top: 18px;
  left: 18px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAAA79JREFUaAXtms1uEzEQx5s0p1yBE72CVKTSVOmhSIiP9AmAF+EAb4HEkwBP0EJFJXpom35IRIJrj+WaUz74/0NcbRfvztixnYstRd6P8cz8xh57d+OVlVxyBHIEcgRyBHIEcgSWFYGG1vDZ2dnD0Wj0pNlsXm1tbX1tNBoTbdsYctPptHF6evoSfqzBp6NOp/NLY0cFfHJy8hYGPkDh6lzpIepX29vb1xojoWUGg8Gd4XD4GT49m+seA/x9t9v9KNkSgfv9/oPxePwTilolZZc476WGnsPuA/ZxyZ9xq9V6JPV0s9Tov1Mo3sHFMizlNvDbx7C6x5MU5fj4+C561gZL86tMOckPEXgymVzVKNnA/T06UiMT5BZtYNjuWXr2Rj/nl5uTigMRGHnxDYYOKtrz8qynY0JrYOHjd06mNX7ObonAUDRtt9tvUJ/XKIsGrYGFX5fo+dfwUVw5RGBCrq+v/wH0bmpoDSx8uoCL6slTnKUJbMp8hmQebZprljrI7K2FhS+7LiuFEzDhUkDHgqX/zsCxoWPCegPHgo4NuxBwaOgUsPRZNUtT0Fa0szdm0tqHk1SwZPDK4TJ8zfPtjSiXD9uMSlgI7ePHtdxaqtpahYWLQYBpwwc6NSz9DAbsCk15lGQ9+89cYGAqdchHBjvJMDawrIP2sFGsgTaytjpkzpb1RwGmEV/omLD0KxqwD3Rs2OjALtApYOnPQg8eVKApWH/FkaSR0diSZERHJAV19zXrbKl9kFfLks5bp9GAPWCNY1GhowAvABsdOjiwBpYTFMmQt+VvywaYdZSeDjppaWH5EsGfAS9SFo43cL/2Lasgqz4M1sMusOYbFNsQqq6nGRQGx7RRk1UIBgH2gTX+pIZeGHgR2GVAL5TDIWAJzeEq5TSHPYc/37tNoHxq7x4OBVt0Wju88adAj5+Xim21x17AWlgfx5S6z/lPiA+0M7DSoQsfWNNLShte0E457OCI95Aj9HwJ6uGQDx/WgpzexH/Fzjmt7mEHWK+hZqOKYVMFHMOwDdB2LbRtcUhj6FDmC351H9y88skGWL7mMLw/wVexA0VgbGphLj0tO2LOsTZGgzU2lNDPsdvohWlTVYvA2MNxv6pxClhjWwONPR5rRr6qFoGxFegHGo/LClLCGtsC9Ag+HRnZqloE5r4nKHoHBSOjBOcHvgu/0eFbF6APCzpmG9OwqeV34Zr1UExy04ob1DAp7HAb03xnz9TcW0bNyZTzC1OOo1DakLYMH7PNHIEcgRyBHIEcgRyB2xH4C9KwySbUktaWAAAAAElFTkSuQmCC)
    no-repeat 50%;
  background-size: contain;
  background-color: #fff;
  pointer-events: none;
}

.star-live-setting input {
  border-radius: 2px;
  border: 1px solid #e3e3e3;
  line-height: 38px;
  height: 40px;
  padding: 0 15px;
  font-size: 14px;
  width: 460px;
  color: #333;
  caret-color: #b08a5b;
}

.star-live-setting input::placeholder {
  font-size: 14px;
  color: #ccc;
}

.star-live-setting input:focus {
  outline: 0;
  box-shadow: 0 0 0 2px rgba(237, 64, 20, 0.2);
}

.star-live-setting .ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.star-live-setting .setting {
  padding: 15px 0 0 10px;
}

.star-live-setting .setting .selectCompetition {
  width: 180px;
  overflow: hidden;
}

.star-live-setting .setting .live-status,
.star-live-setting .setting .live-status-2 {
  display: flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
}

.star-live-setting .setting .live-status-2 .live-img,
.star-live-setting .setting .live-status-2 .live-status-img,
.star-live-setting .setting .live-status .live-img,
.star-live-setting .setting .live-status .live-status-img {
  width: 18px;
  height: 16px;
}

.star-live-setting .setting .live-status-2 .live-img,
.star-live-setting .setting .live-status-2 .live-status-img,
.star-live-setting .setting .live-status .live-img,
.star-live-setting .setting .live-status .live-status-img {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAAAXNSR0IArs4c6QAAAopJREFUaAXtWj1II0EUNpsQsxAwciBobMXKH+wszInYWF6TwkAgISGliIKNWFynNpZXBEIiaYJ1Ogst5FqxsBQNsbAwBgImhCR+I1HCOLNnzM4xK29hmJ33Zt77vvdld2eXDA3RQRXQogIu1ShyudxYvV4/RJ7Vbq5Tn8+3HY1GH1TmVkosn8+P1mq1KxAIciTKbrd7NpFIPHJ224aGbZEEgUBqD2aeFJsZbLfbzKfsUEoMqEMWyH9a+AZ2KSXmcrlEar2C7nQ6EwOjtwiglJhFXuUuIqa8xDYnIMVsLqjycKSY8hLbnMBjc7z/Gi6TyQSazeYBkq7huWjiuXmOtpVMJm8cS6xQKJiVSuUvSE2/VRPkfqGtpNPpOcdeY9VqdbOX1Bs59COtVmvfscSwiV7qIcOfhhxLDNeS1V5z3LHEeIn4MRHjK6L7mBTTXSEeHynGV0T38euWKpvNBvHt7wDPhhC2JM/oi4FAYDccDtd0JyDDZ3RJXWLCOkhNop9Cv4F92EWxWByWLdTdbjQajX2A/CEAOlMqlTYEdkeYDKizLEOKn6TUJ1uji53dFaXf/v7h04WDEAfd7oVl0dhIimksjhAaKSYsi8ZGUkxjcYTQSDFhWTQ2kmIaiyOERooJy6Kx8fsqhpfJe1nh8RIq9cnW9Nqxvtw75s6tfNzUj0MrbIwTU+z847J3y9n72ddOpLGRXOr7ZCorbGfs08AOkjzxwWC79nq9R7y9n7Hf7/+N+SJlyoZhMN+XD4aNYeQDMC4ej2fHSKVSd0gyD8MJJj2gv0X7A8KLsViszi/sZxyJRCqmaS4gXg7tvtuOmW3Qf74xbAwjw4p228V+wrjE4/FSPzhpLlVAYQVeAEdcp/cDYJkgAAAAAElFTkSuQmCC)
    no-repeat 50%;
  background-size: 100% 100%;
}

.star-live-setting .setting .live-status-2 .live-img,
.star-live-setting .setting .live-status-2 .live-status-img {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAAAXNSR0IArs4c6QAAAqhJREFUaAXtWr9rFFEQnlnucrnkziiCYGIrqfyBnYWJBJuohSmuORD8ByRIhDSSIl1iY2kZDIhwQgpRMGCRFGIrFpaiEkELjdl4Z27PG2cOAs+ns9zqLryVt7Dcm5n3Zr9vvne3b98tgD98BZyoAGaNIrw6c4T2mrcB6ELvWoTPcHDoZnV17VOW186UGNUvHQqj6BUBjJkk+KJbVcCT2Hj62fSn2Q7STGbn2u10FmxS0kd8uwALdv807UyJdQEmNLBdoEktloY/U2II9MsUNAHzdBw17bTbmRJLG2ySfJ5Ykmq50Ncr5oIKSTB4xZJUy4W+BRdA/C0GunblYNhsLfNSZprXM2XOs1mE0ly58ehNbolRrVYOv+28IKBxozAzbdibatUvnsrtdyzEnRsWqX1+I+3ox1JuiRHBuX0m9icv1yZySyxurclKHs0tMVsl2/bE7Iq4bnvFXFfIxucVsyviut1bUjVrl8ciiJblxsZrrhYCPqnAgVvYaPBmUj6PQEh1oP2SCdX5xnaMt8aO8w7SbAhfn9P16VI+aQEEEXaWmMxhmwD7ToQfu7O2Py92gNQ9r4Il0mPqIDcCASuj7v0BYEzMDQIaCv9zr1XGVb9XzFVlNFxeMa0yrvq9Yq4qo+HyimmVcdXvFXNVGQ2XV0yrjKv+/1cxRPigVZ2f1dSYNsb0E+CWaZvtuJjZT2vHYRNO8qC5qQ3mF1A2tFg/fp4Oau64WD+547Bx0TaCASrNc6JtOxmzfl0dHr1j+5PYlUJhkXe+flNNfBWAxSS57L6CTTDafra3iwHNB/y35ruBYuE0X+whn/yqHb4FxLtVGjmLKyvf/zCwbxfef/wFB4fPIOI9mR69E3C15/vHN98Em2AUrIJZsAsH4TL0YP193yB9R1+BbCvwEyL8o8zpkQoUAAAAAElFTkSuQmCC)
    no-repeat 50%;
  background-size: 100% 100%;
}

.star-live-setting .setting .live-status-word {
  margin-left: 7px;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #333;
}

.star-live-setting .setting .isLiveText {
  color: #888;
}

.star-live-setting .setting ._btns {
  cursor: pointer;
  text-align: center;
  font-size: 0;
  padding: 15px 0 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.star-live-setting .setting ._btns .cancel,
.star-live-setting .setting ._btns .ok {
  display: inline-block;
  width: 130px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
  color: #fff;
  height: 40px;
}

.star-live-setting .setting ._btns .ok {
  background: url(/static/images/btn-queding.png) no-repeat 50%;
  background-size: 100% 100%;
}
.star-live-setting .setting ._btns .cancel {
  margin-right: 20px;
  border-radius: 4px;
  color: #dbb389;
  border: 1px solid #dbb389;
}

.star-live-setting .setting ._btns .cancel:hover {
  background-color: hsla(31, 53%, 70%, 0.05);
  box-shadow: 0 2px 6px 2px hsla(38, 75%, 81%, 0.2);
}

.star-live-setting .setting ._btns .cancel-active {
  background-color: hsla(31, 53%, 70%, 0.15);
}

.star-live-setting .setting .op {
  cursor: pointer;
  font-size: 14px;
  color: #b08a5b;
  display: inline-block;
  margin-left: 5px;
  position: relative;
  text-decoration: underline;
  text-underline: #b08a5b;
}

.star-live-setting .setting .container {
  position: relative;
}

.star-live-setting .setting .container .title,
.star-live-setting .setting .container .titleSpaceTab {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  text-align: center;
  height: 52px;
  line-height: 52px;
  border-bottom: 1px solid #eaeaea;
}

.star-live-setting .setting .container .titleSpaceTab {
  height: 85px;
  line-height: 65px;
  margin-bottom: -23px;
}

.star-live-setting .setting .container .items {
  height: 450px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.star-live-setting .setting .container .items::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

.star-live-setting .setting .container .items::-webkit-scrollbar-thumb {
  background: #d8d8d8;
  border-radius: 4px;
  height: 10px;
}

.star-live-setting .setting .container .title-box {
  display: flex;
  justify-content: flex-start;
  color: #666;
  margin-top: 15px;
  background: #eee;
}

.star-live-setting .setting .container .title-box:hover {
  color: #666;
  background: #eee !important;
}

.star-live-setting .setting .container .title-box .title-countryName {
  margin-left: 96px;
  width: 113px;
  text-align: left;
}

.star-live-setting .setting .container .title-box .title-host {
  width: 182px;
  text-align: right;
}

.star-live-setting .setting .container .title-box .title-time {
  font-size: 14px;
  width: 100px;
  text-align: center;
}

.star-live-setting .setting .container .title-box .vs {
  width: 69px;
  height: 100%;
}

.star-live-setting .setting .container .title-box .title-guest {
  width: 182px;
  text-align: left;
}

.star-live-setting .setting .container .item {
  height: 44px;
  width: 725px;
  font-size: 14px;
  display: flex;
  padding: 0 0 0 20px;
  align-items: center;
}

.star-live-setting .setting .container .item:hover {
  background-color: #fffbf8;
}

.star-live-setting .setting .container .item:active,
.star-live-setting .setting .container .item:active .ellipsis,
.star-live-setting .setting .container .item:active .time {
  background-color: #fdf3ec;
  color: #b08a5b;
}

.star-live-setting .setting .container .item.active .limit {
  color: #b08a5b;
}

.star-live-setting .setting .container .active .radio {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAA1tJREFUSA29VjtoVEEUnTvPiAY/SLpkkUgUsVQj2IiNVuru+iFFPoIKWglqsmIhGMFC3ETFTkEFk1gEP7urVtpImoBRSwkaDJLEKogfohjfu94z4zxesmHzTJadYt/M7D3nzNy5c++QitHy3Yc3k89pVsEOJqpTimstjCaIeZyUHmCPcqn2e2/no6NSBrmulkMU0CVWvLGUnfuPFA2z5vPpjr4Hbm72d07BQrZtHTPfF6HtFkBjpDlPynvmkRqpXrZiAvNTv37U+qwaWPl7OKCU7DyBeREeJKLmZKbnI8bRViRYuNq2M/jDDwVcI39OaE0X9q5N3qWmJj8KnN3n/n7v6afCkSDgi6yUuJwm9RI6mDzT8zJqO0PQiPn8XDFXySoLqmZpa+rYne9DN49XjX/9mWYK0kLUGD1D6Q8R61zd6uW5xhO3pvO3j65Uk797xTtJRTStPdodFQ0F4caA+RV2pknd2Nex4TRRZ5DLtuwXkawsoiG60qI+0YhgM+lM32PmTp3vHrmuguCk2SnRNude7YA4M4hhZxDDfD7bekWxejSvGIyxILE1GBmm2htOGS8Jp+WGkVJGENGIAMGZwY3YWaHrw2UxzFiz+L/AAAsOwyWc4IZGKIjQNwMJEJwZ3LgQMbcsYMEBLgQd5p0G4VKz77+RqbFUfbL+9ZcXeuzb1LtYbnQKc33lTBOrqjdtXbMryI8WRsXnCfK8LRoZBPbmnknoIxoXLQZCOVNw4TqB22iIlka6MgO51MbOhD56i2/2GslmHLdoaZsblUIGsRK4Z+VqlstxQ0ui1CZil67cuDySxdzhPSyPQGkWYslJ4uEwEVtzOy4NjfvvTG4m9VmjngGOrG9peCgu3fx2lstxQ0vSph4AECUGXyRifMvRHFfILVoalRrkqGcoMcj6kuX/RewiZIUDXOC0tVI0REvjWSBJdliGCdQzlBjp/3cOLV4aZ8AFTnBDA1omSvEsAADFE/UMJUYqdraYJN4MsOAAFziBchpGEG8QWcGgqdQonlLPkh3rzy1EFBhgwWELsaoFt3vnhPdQDJslZCZRqZ90vb+GVaUyvWclLx2IdaY4d7E1GMGiAJuqL5yWG4xIc5FW0SeG063oIyoUreQz0YniW7GHcFQU/XI+9f8C7tEVBAEhON0AAAAASUVORK5CYII=)
    50% no-repeat;
  background-size: 16px 16px;
}

.star-live-setting .setting .container .active .ellipsis,
.star-live-setting .setting .container .active .time {
  color: #b08a5b;
}

.star-live-setting .setting .container .radio {
  width: 24px;
  height: 24px;
  margin-right: 25px;
  position: relative;
  top: -1px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAqNJREFUSA29lr9rE2EYx3Nvkyk4dUsyKB3MlpggZBGnToW2oJN0EVwF3Qul4G7xH3ARJ4VY6OQkXQomMdmSQerQximTZEqa+P1c3zvexHBRc9eD9+798bzfz/u89/54vNRfPO12+95kMtlVeiDzvOd5ObpNp9O+PpfGmFOlerlc/kZ91ONFNbZarceCvJLN3Sg7p60n8H6lUvng1M1kFwI7nc6d8Xj8Xh7UrPWFvPqkdCLB75lMBs9So9EopwFtyG5LaUdVBepld5ZOp5+USqVzyu7zB1BePZTIRxmtq2NfQgfVavWt8ldux/m87NaazeZT2R0qz5QPNLhH8vaLazsDtLDPMsio43E2m90rFou/3A7L8t1u99ZwOHwn6LZsR4JuutAQyDRqir7KaF3pjbx6KehkGWBRu2BG3h6p7bnSQL/gfjC9JujAP1OeaTxeBYYeA5XGC7TQtNo0pXwgq1GjqsmgzzTSwW9d4YWG1WId1GCEQLv02VcH//rPosaEFprYBAyPTS2XW6q70DTc1sgiV2MUYFGbgKzeH2oraKtUjMi7GArEPosVZnWv0CYPCyDHFcATvkk8gTYsFk0eCCdIErA57bwR3T+Ig+MqCWigDSvch0mA5jW1gKZGKTyI5w3iKnPIW62feHhJQT90w1bG/nG0uTvNKQR5uhU7yQoG2rAA1i1wRw1rcUPRVOKuZCfUjQ0LeioXuM/iBlpNLuYeLH+VirwPSMv2kPssLihaaKIXMHwgMYgazuR6zl6eK28XaRmrlUM7iHNCYWIQDWQgw21Nw2s6/K+n9JXGEVpoWm1fLrzxKd1EiDHjBbGH5nqTUTE6TUm30Wg8U37p6sUGW/oEnqHlxjM4NeMhFTw3GiZeI6/fhAU6JZIPhF0o+ThD/d809aDI6rMy2wAAAABJRU5ErkJggg==)
    50% no-repeat;
  background-size: 16px 16px;
  cursor: pointer;
}

.star-live-setting .setting .container .img {
  width: 22px;
  margin-right: 25px;
}

.star-live-setting .setting .container .img img {
  vertical-align: middle;
  width: 22px;
  height: 19px;
}

.star-live-setting .setting .container .countryName {
  width: 113px;
  color: #333;
}

.star-live-setting .setting .container .bond {
  font-weight: 700;
}

.star-live-setting .setting .container .time {
  font-size: 14px;
  width: 100px;
  color: #999;
  text-align: center;
}

.star-live-setting .setting .container .host {
  width: 182px;
  color: #333;
  text-align: right;
}

.star-live-setting .setting .container .vs {
  color: #999;
  width: 69px;
  text-align: center;
}

.star-live-setting .setting .container .guest {
  color: #333;
  width: 182px;
  text-align: left;
}

.star-live-setting .setting .btns,
.star-live-setting .setting .btnsOther {
  cursor: pointer;
  padding-top: 5px;
  text-align: left;
  width: 100%;
  display: flex;
  justify-content: center;
}

.star-live-setting .setting .btns .btn,
.star-live-setting .setting .btns .btnOther,
.star-live-setting .setting .btnsOther .btn,
.star-live-setting .setting .btnsOther .btnOther {
  width: 130px;
  display: inline-block;
  margin-right: 20px;
  height: 40px;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  line-height: 40px;
  outline: none;
  border: none;
  overflow: hidden;
}

.star-live-setting .setting .btns .btn[type='submit'],
.star-live-setting .setting .btnsOther .btn[type='submit'] {
  display: flex;
  justify-content: center;
  align-items: center;
}

.star-live-setting .setting .btns .btn:last-child,
.star-live-setting .setting .btnsOther .btn:last-child {
  background: url(/static/images/btn-queding.png) no-repeat 50%;
  background-size: 100% 100%;
}
.star-live-setting .setting .btns .btn:first-child,
.star-live-setting .setting .btnsOther .btn:first-child {
  color: #dbb389;
  border: 1px solid #dbb389;
}

.star-live-setting .setting .btns .btn:first-child:hover,
.star-live-setting .setting .btnsOther .btn:first-child:hover {
  background-color: hsla(31, 53%, 70%, 0.05);
}

.star-live-setting .setting .btns .btn:first-child -active,
.star-live-setting .setting .btnsOther .btn:first-child -active {
  background-color: hsla(31, 53%, 70%, 0.15);
}

.star-live-setting .setting .file {
  width: 90px;
  height: 60px;
  border-radius: 2px;
  border: 1px solid #e3e3e3;
  text-align: center;
  background: #fff
    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAeFBMVEUAAACvr6+YmJiampqYmJiYmJiampqgoKCYmJiYmJiZmZmYmJiYmJiYmJiYmJiYmJiampqfn5+YmJiYmJiYmJiYmJiZmZmYmJienp6YmJiYmJiYmJiYmJiYmJiampqYmJiYmJiYmJibm5uYmJiYmJiZmZmYmJiXl5eaB0mNAAAAJ3RSTlMABXg+5tMZDvuMTPjy7LLPIhS1n9qIVjgJ4ci0pn8yk2xmKK6ZRb5rb52NAAABpUlEQVRYw+2XyXKDMAyGZYMx+xIIEAjZ0//937BZJoUemBrr0nbyXzw66BttHsv0lr1WKyYAeAO+A/J1luBnKfGoPyZ69EKsfQB2gP7unwJbR9unECAJOTU4+QhZRQxQ8rqg0PAAMbTVZep/6Uw6qeumjj1A4iFpC3AQSc+TERxLQAr5jCOlOeVHeQiLOYAL7354cGfcjwp3+eerFaDogWR7KT8iYLBIoa3g1uJBkj6G5UUskX0lf0WUL21jiDgfrQv2Swcpw2FiNegWjnKNjZiYGvFCgMJxpvuAaQAcgKhwJA5AQgkOwIvhEAdQ4kwLALoegiHUNJ3Q3BxQ7CPcFe/1eAkGMgbsXCDby0sHbHavl0MJY0ATo3r6XRWi+tkBf0emgF2CbfvqfQl0QZDBP5Ap4JTgPIm23uAm1yFTQO5i9S3bNjzIRpApwNvgo6UZGQC8Cp0me0ChkGliADqoghiANq6828FJQRALcNOfBdjtSBoxb0troHh7YomAtamG8E+cXTlMEIyW6Jdt69rZAr14meN/YYH89eg//lhMlWTrnP6TPgGEg0/Q0PFZrwAAAABJRU5ErkJggg==)
    50% no-repeat;
  background-size: 32px 32px;
}

.star-live-setting .setting .file:hover {
  border-radius: 2px;
  border: 1px solid #b08a5b;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAkFBMVEUAAAD/bAD/awD/bQD/awD/cAD/egD/bAD/bAD/mwD/awD/bAD/awD/awD/bwD/awD/cQD/cwD/dwD/bAD/bAD/bAD/bQD/awD/bAD/awD/bAD/bAD/bAD/bAD/bQD/bAD/bAD/bQD/bgD/bgD/bAD/awD/bAD/bAD/bQD/bAD/awD/awD/bAD/fAD/bQD/awCqSEqPAAAAL3RSTlMA+3c9tRkG5o0D8tSy7CKfFBAM0YhNN/fZz8imf3pKbGZDMiji366ZlFPqvlcKW8hXCHkAAAGvSURBVFjD7dfZbsIwEAXQcRYnzr4nhLDv3e7//10FiBKkRnXsl7bivkR+yBHjGcRAz6jHsjQB4Ak8AlExCfFzfH65f/Ry6YUoGAB1QATA1EzVS3ARljp3sGGYkw7gIiYtwEelB3jI1L5Mv3QmzcBxAlMdmOEcNlMFTMYM2zYYMxWBAMb5YSCgoURLYzFPhgAH9vlhwxl4fZlfa9yvlIDEAsLpIX6tgU6hhKzBy0lcJIOhG3+JMSZfxc9ZHX3bRjbcxhJedD8dcBw7SDkWvVOFduQon7Dl/QuBNxLIsRzovhzwhi3XAfgOS9IBDORCB7A9rEgHiLGnEUB26tyuTHvTgTqSB5JjjXM890bwBh1JA2sHLD8ahxbYrW+/HD6XBioPzfW9lY/649oBVpEssA4xfb998hhoXTcHW5AssHnBXvTGbwsAzopkgciB9VAtLxczU5AsYO/wymkgEoDdoM1IHUh8TFLSAFr4CWkA715jkw5AKSc9gOjPAmo7UgZPb0ur4OvtiTFcrU11DrbR2ZXLEO79JKxx23pqTgFLUE8oGMaFFYJo9D+WW8JJEdF/yicwEl3VrIsyygAAAABJRU5ErkJggg==)
    50% no-repeat;
  background-size: 32px 32px;
}

.star-live-setting .setting .zy {
  display: inline-block;
  font-style: normal;
  font-size: 12px;
  padding-top: 5px;
  color: #999;
  line-height: 12px;
}

.star-live-setting .setting .zy img {
  margin-right: 5px;
  vertical-align: top;
  width: 12px;
  height: 12px;
}

.star-live-setting .spaceTab-base {
  display: flex;
  list-style: none;
  font-size: 18px;
  font-weight: 700;
  color: #333;
  text-align: center;
  border-bottom: 1px solid #eaeaea;
}

.star-live-setting .spaceTab-base li {
  height: 25px;
  margin: -7px 23px 0 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 25px;
  letter-spacing: normal;
  color: #333;
}

.star-live-setting .spaceTab-base .spaceTab-active {
  color: #b08a5b;
}

.star-live-setting .spaceTab-base .spaceTab-active .active-bottom {
  height: 3px;
  margin-top: -1px;
  border-radius: 1px;
  background-color: #d8ad66;
}

.star-live-setting .add-pic,
.star-live-setting .add-pic-disabled {
  width: 166px;
  height: 94px;
  border-radius: 4px;
  border: 2px dashed #ccc;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f6f7fa;
}

.star-live-setting .add-pic {
  background: none;
  cursor: pointer;
}

.add-pic.star-live-setting:hover {
  border: 2px dashed #eec292;
  color: #eec292;
}

.star-live-setting .cover-img {
  width: 166px;
  height: 94px;
  border-radius: 4px;
  position: relative;
  display: inline-block;
}

.star-live-setting .cover-img img {
  width: 166px;
  height: 94px;
  object-fit: cover;
  border-radius: 4px;
}

.star-live-setting .cover-img .del-img-btn {
  width: 20px;
  height: 20px;
  cursor: pointer;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAjhJREFUWAntmD9PwkAYxot/Y6wYGRz8MxijA4QFNAEmYXHWKAxOfBO+Dg76DWADBmArJhJwdyARcTGx+jzqkYYIvWtRL8Y3edorubfvr+/17ugbMAyjAP2mPSP4A9SBmtA9NLRZtI6GV7/TIMMytAUdQCZ0B9mQMcODRhYAyyF0Ac2RSzdAMtF2oGM2dAUkG4d7XWdADndMZ0BmcVd3wFXdARd0B9R6FvMd/IOAnU4n32g0zoPBILcoKWPfer1+1u1281IOjk7K72Cv13uMxWLharWak4E0TXOmUqlk4/F4hL6O2FJNZcB0On1lWdZtOBzeQ+CJkISr1Wq5SCSyD592JpO5lqJydFIGHAwGdiKRKBISgcdCjsKlUqliv99/ccSWaioD8q5ukJ/DOsycVzjG8gQ4BjJLMAEXjUbfh9UPHONwQy6w4dVGhvLWtm1jWnBk8g3Imzghec0J4TdzvA/N8xB/uH//0TegM3utVqvtNrtVH8kX4ChcMpksyixBKpCeAb+C4zrntgSpwLGvJ8BxcCI4ITFJLqcx3MqAbnACktmcBqQyYLlcPuXeygnBd27S9uWAbHNbLJVKJ+IBZM/KgKFQyGw2my03OAHwCVnEXzQLvivid9nzVBZq2WBe+iln0EsQPz7/gH6yR19mkPU5bY2ALB5qawRkZVNbIyDLrq+6EvLb9gli2XVTR0jx8c2a8Da0phukAGTB2oKWoA2IO4wWJgAJQ8g2dAPx+3URmoecfXD5s/YGWIU4OxCNOMkAAAAASUVORK5CYII=);
  background-size: cover;
  position: absolute;
  top: 0;
  right: 0;
  display: none;
}

.star-live-setting .cover-img:hover .del-img-btn {
  display: block;
}

.star-live-setting .img-form-item {
  position: relative;
}

.star-live-setting .disable-mask {
  position: absolute;
  width: 168px;
  height: 96px;
  top: 0;
  left: 0;
}

.star-live-setting .upload-tips {
  display: inline-block;
  width: 105px;
  color: #ccc;
  font-size: 12px;
  vertical-align: top;
  margin-left: 30px;
}

.star-live-setting .ant-modal-body {
  padding: 0;
}

.star-live-setting .dialog-content {
  padding: 0 20px 30px;
}

.star-live-setting .dialog-content .ant-form-item {
  margin-bottom: 16px;
}

.star-live-setting .dialog-content .ant-form-item-label {
  width: 110px;
  margin-right: 10px;
}

.star-live-setting .dialog-content .ant-form-item-label > label {
  height: 40px;
  color: #333;
}

.star-live-setting .dialog-content .ant-select {
  color: #666;
}

.star-live-setting .dialog-content .ant-select-selector {
  border: 1px solid #ccc;
  border-radius: 4px;
}

.star-live-setting .dialog-content .ant-select-disabled .ant-select-selector {
  background: #f6f7fa;
  border: 1px solid #e5e7ee;
}

.star-live-setting .dialog-content .ant-select-lg {
  font-size: 14px;
}

.star-live-setting .dialog-content .ant-input {
  color: #666;
}

.star-live-setting .dialog-content .ant-input::-webkit-input-placeholder {
  color: #ccc;
}

.star-live-setting .dialog-content .ant-input:-moz-placeholder,
.star-live-setting .dialog-content .ant-input::-moz-placeholder {
  color: #ccc;
}

.star-live-setting .dialog-content .ant-input:-ms-input-placeholder {
  color: #ccc;
}

.star-live-setting .dialog-content .ant-input[disabled] {
  background-color: #f6f7fa;
  border: 1px solid #e5e7ee;
  color: #ccc;
}

.star-live-setting .dialog-content .ant-form-item-control input {
  height: 38px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.star-live-setting .dialog-content textarea.ant-input {
  border: 1px solid #ccc;
}

.star-live-setting .dialog-content .live-status-item-wrap {
  margin-top: -16px;
}

.star-live-setting .like-ant-input {
  background-color: #f6f7fa;
  border: 1px solid #e5e7ee;
  color: #ccc;
  min-height: 38px;
  line-height: 36px;
  border-radius: 4px;
  padding: 0 15px;
  font-size: 14px;
  width: 460px;
  display: inline-block;
}

.ant-modal {
  padding-bottom: 0 !important;
}
.dialog .el-dialog__header {
  display: none !important;
}
.dialog .el-dialog__body {
  padding: 0 !important;
}

/* .el-select-dropdown {
	    top: auto !important;
	} */
.img-right {
  :deep(.el-radio) {
    margin-right: 15px;
    .el-radio__label {
      display: none;
    }
  }
  .right {
    margin-left: 50px;
    .default-img {
      height: 94px;
      padding: 2px;
    }
  }
}
.up-bottom {
  .l-tip {
    font-size: 12px;
    color: #ccc;
    margin-left: 140px;
  }
}

.ant-row,
.ant-row:after,
.ant-row:before {
  display: flex;
}

.ant-row {
  align-items: center;
  flex-flow: row wrap;
}
</style>
