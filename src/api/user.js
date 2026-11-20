import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: 'api/user/login', // OLD PASS
    method: 'post',
    data
  })
}

// 登录-加密
export function cryptoLogin(data) {
  return request({
    url: 'api/user/NewLogin',
    method: 'post',
    data
  })
}

// 邮箱登录-加密
export function mailCryptoLogin(data) {
  return request({
    url: 'api/user/NewMailLogin',
    method: 'post',
    data
  })
}

// 忘记密码
export function forgotPassword(data) {
  return request({
    url: 'api/user/forgotPassword',
    method: 'post',
    data
  })
}

// 忘记密码-加密
export function cryptoForgotPassword(data) {
  return request({
    url: 'api/user/NewForgotPassword',
    method: 'post',
    data
  })
}

// 邮箱忘记密码-加密
export function mailCryptoForgotPassword(data) {
  return request({
    url: 'api/user/NewMailForgotPassword',
    method: 'post',
    data
  })
}

export function mailCryptoNewForgotPassword(data) {
  return request({
    url: 'api/user/forgotPasswordByMail',
    method: 'post',
    data
  })
}

// 注册
export function register(data) {
  return request({
    url: 'api/user/registered', // OLD PASS
    method: 'post',
    data
  })
}

// 注册-加密
export function cryptoRegister(data) {
  return request({
    url: 'api/user/NewRegistered',
    method: 'post',
    data
  })
}

// 邮箱注册-加密
export function cryptoMailRegister(data) {
  return request({
    url: 'api/user/NewMailRegistered',
    method: 'post',
    data
  })
}

// 获取验证码
export function getCode(data) {
  return request({
    url: 'api/user/getCode',
    method: 'get',
    params: data
  })
}

// 获取验证码-加密
export function cryptoSendCode(data) {
  return request({
    url: 'api/user/sendVerificationCode',
    method: 'post',
    data
  })
}

// 邮箱获取验证码
export function getMailCode(data) {
  return request({
    url: 'api/user/getcodeMail',
    method: 'get',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: 'api/user/info',
    method: 'get',
    params: { token }
  })
}

export function sdfdsf(data) {
  return request({
    url: '/activities/apply/student',
    method: 'POST',
    data
  })
}

// 退出登录
export function logoutService() {
  return request({
    url: '/api/Member/SignOut',
    method: 'post'
  })
}

// 验证推出登陆
export function isSignOutService() {
  return request({
    url: '/api/Member/isSignOut',
    method: 'post'
  })
}

// 绑定银行卡

export function bindBank(data) {
  return request({
    url: 'api/Bank_card/bind',
    method: 'get',
    params: data
  })
}

// 官方活动
export function getActivityUrl(data) {
  return request({
    url: 'api/front/getActivityUrl',
    method: 'post',
    data
  })
}

// 獲取廣告
export function getAdList(data) {
  return request({
    url: 'api/prompt_map/getPMList',
    method: 'get',
    params: data
  })
}

// 获取银行卡信息
export function getInfoBank(data) {
  return request({
    url: 'api/Bank_card/getInfo',
    method: 'get',
    params: data
  })
}

// 申请/修改主播认证
export function verified(data) {
  return request({
    url: 'api/Member/verified',
    method: 'post',
    data: data
  })
}

// 获取主播是否认证
export function getVerifiedInfo(data) {
  return request({
    url: 'api/Member/getVerifiedInfo',
    method: 'get',
    params: data
  })
}
// 主播经验列表
export function getExperienceList(data) {
  return request({
    url: 'api/User/anchorExperienceList',
    method: 'get',
    params: data
  })
}

// 获取推流地址
export function getLiveUrl(data) {
  return request({
    url: 'api/Live/getLiveUrl',
    method: 'get',
    params: data
  })
}
// 创建开播
export function createRoom(data) {
  return request({
    url: 'api/Live/createRoom',
    method: 'post',
    data
  })
}

// 直播接口
export function getRoomList(data) {
  return request({
    url: 'api/Live/getRoomList',
    method: 'get',
    params: data
  })
}

// 开播
export function startRoom(data) {
  return request({
    url: 'api/Live/startRoom',
    method: 'get',
    params: data
  })
}
// 关播
export function endRoom(data) {
  return request({
    url: 'api/Live/endRoom',
    method: 'get',
    params: data
  })
}
// 获取直播信息

export function endRoomInfo(data) {
  return request({
    url: 'api/Live/endRoomInfo',
    method: 'get',
    params: data
  })
}

// 获取直播详情
export function getRoomInfo(data) {
  return request({
    url: 'api/LiStre/getRoomInfo',
    method: 'get',
    params: data
  })
}
// 获取直播列表
export function getLiveList(data) {
  return request({
    url: 'api/front/getLiveList',
    method: 'post',
    data
  })
}
// 获取直播列表
export function getLives(data) {
  return request({
    url: 'api/front/liveList',
    method: 'post',
    data: {
      ...data,
      t: Math.floor(Date.now() / 10000)
    }
  })
}
// 新的获取直播列表
export function getLivesList(data) {
  return request({
    url: 'api/front/lives',
    method: 'get',
    params: {
      ...data,
      t: Math.floor(Date.now() / 10000)
    }
  })
}
// 获取主播详情
export function getPlacard(data) {
  return request({
    url: 'api/Live/getPlacard',
    method: 'get',
    params: data
  })
}
// 添加修改主播公告
export function setPlacard(data) {
  return request({
    url: 'api/Live/setPlacard',
    method: 'post',
    data: data
  })
}

// 主播发布动态
export function anchorDynamicsUser(data) {
  return request({
    url: 'api/anchor_dynamics_user/insert',
    method: 'post',
    data: data
  })
}
// 主播动态详情
export function anchorDynamicsList(data) {
  return request({
    url: 'api/anchor_dynamics/info',
    method: 'get',
    params: data
  })
}

// 动态点赞
export function setDynamiclikes(data) {
  return request({
    url: 'api/anchor_dynamics_user/likes',
    method: 'post',
    data: data
  })
}

// 用户动态记录
export function userPostList(data) {
  return request({
    url: 'api/anchor_dynamics/userPostList',
    method: 'get',
    params: data
  })
}

// 预约列表
export function getUserReserveLiveList(data) {
  return request({
    url: 'api/Live_streaming/getUserReserveLiveList',
    method: 'get',
    params: data
  })
}
// 预约列表，全局窗口推送
export function getGlobalUserReserveLiveList(data) {
  return request({
    url: 'api/li_stre/getUserReserveLiveList',
    method: 'get',
    params: data
  })
}

// 预约列表 主播直播间
export function getReserveLiveList(data) {
  return request({
    url: 'api/live_streaming/getReserveLiveList',
    method: 'get',
    params: data
  })
}
// 用户预约主播预约直播赛事
export function reserveMatch(data) {
  return request({
    url: 'api/live/reserveMatch',
    method: 'post',
    data
  })
}
// 用户预约主播预约直播赛事2
export function reserveMatch2(data) {
  return request({
    url: 'api/live/reserveMatch2',
    method: 'post',
    data
  })
}

// 预约开播
export function setReserveLive(data) {
  return request({
    url: 'api/Live/setReserveLiveNew',
    method: 'post',
    data
  })
}
// 用户关注
export function attention(data) {
  return request({
    url: 'api/Member/attention',
    method: 'post',
    data
  })
}
// 用户关注列表   ==== 废弃
export function attentionList(data) {
  return request({
    url: 'api/User/attentionList',
    method: 'get',
    params: data
  })
}
/*
 * 全局-获取关注主播开播列表
 * status: -1 未开播，0 预约直播，1 直播中
 * */
export function getAttentionFoucusList(data) {
  return request({
    url: 'api/live/attentionList',
    method: 'get',
    params: data
  })
}

// 删除预约开播
export function deleteReserveLive(data) {
  return request({
    url: 'api/live/deleteReserveLive',
    method: 'delete',
    params: data
  })
}

// 获取礼物列表
export function getList(data) {
  return request({
    url: 'api/Gift/getList',
    method: 'get',
    params: data
  })
}
// 赠送礼物
export function handselGift(data) {
  return request({
    url: 'api/member/handselGift',
    method: 'get',
    params: data
  })
}
// 用户背包礼物列表
export function getUserGiftList(data) {
  return request({
    url: 'api/Gift/getUserGiftList',
    method: 'get',
    params: data
  })
}

// 足球联赛积分榜
export function season_table(data) {
  return request({
    url: 'api/front/season_table',
    method: 'post',
    data
  })
}
// 贵族列表
export function getGuardList(data) {
  return request({
    url: 'api/Guard/getList',
    method: 'get',
    params: data
  })
}

// 用户信息
export function info(data) {
  return request({
    url: 'api/Member/info',
    method: 'get',
    params: data
  })
}
// 首页第二个列表 || 首页全部赛程
export function getAllMatch(data) {
  return request({
    url: 'api/v_sports/get_all_list',
    method: 'get',
    params: data
  })
}

// 购买贵族
export function guardUserBuy(data) {
  return request({
    url: 'api/guard_user/buy',
    method: 'get',
    params: data
  })
}

// 获取充值列表
export function chargerulesList(data) {
  return request({
    url: 'api/chargerules/getList',
    method: 'post',
    data
  })
}

// 获取充值链接
export function payUrl(data) {
  return request({
    url: 'api/chargerules/payUrl',
    method: 'get',
    params: data
  })
}

// 修改支付密码

export function paymentPassword(data) {
  return request({
    url: 'api/Member/paymentPassword',
    method: 'post',
    data
  })
}

// 余额变动记录

export function getOrderList(data) {
  return request({
    url: 'api/Order/getList',
    method: 'get',
    params: data
  })
}

// 绑定支付宝
export function bindAliPay(data) {
  return request({
    url: 'api/Bank_card/bindAliPay',
    method: 'get',
    params: data
  })
}
// 获取支付宝详情
export function getAliPayInfo(data) {
  return request({
    url: 'api/Bank_card/getAliPayInfo',
    method: 'get',
    params: data
  })
}
// 申请提现
export function applyForWithdrawal(data) {
  return request({
    url: 'api/Balance/applyForWithdrawal',
    method: 'get',
    params: data
  })
}
// 提现记录
export function withdrawalList(data) {
  return request({
    url: 'api/Balance/withdrawalList',
    method: 'get',
    params: data
  })
}


export function getIframeDomainService() {
  return request({
    url: 'api/app_domain/getIframeDomain',
    method: 'get',
  })
}

// 获取系统配置
export function getHot(data) {
  return request({
    url: 'api/secret/getHot',
    // url: 'api/secret/getReviseHot',
    method: 'get',
    params: data
  })
}

// 获取福袋数据
export function getRedbagAmount() {
  return request({
    url: 'api/redbag/getRedbagAmount',
    method: 'get'
  })
}

// 领取红包接口
export function getOnRedbag(data) {
  return request({
    url: 'api/redbag/onRedbag',
    method: 'post',
    data: data
  })
}

// 修改用户信息
export function updateInfo(data) {
  return request({
    url: 'api/member/updateInfo',
    method: 'post',
    data
  })
}
// 发送喇叭信息
export function sneHorn(data) {
  return request({
    url: 'api/Member/sneHorn',
    method: 'get',
    params: data
  })
}

// 获取喇叭列表
export function hornList(data) {
  return request({
    url: 'api/Member/hornList',
    method: 'get',
    params: data
  })
}

// 获取直播排行榜
export function roomRanking(data) {
  return request({
    url: 'api/live_streaming/roomRanking',
    method: 'get',
    params: data
  })
}

// 获取话痨榜榜
export function chatterSpeaking(data) {
  return request({
    url: 'api/ranking/speaking',
    method: 'get',
    params: data
  })
}

// 获取指定用户信息
export function getUserInfo(data) {
  return request({
    url: 'api/User/getUserInfo',
    method: 'get',
    params: data
  })
}

// 获取指定用户关注列表
export function watchlistList(data) {
  return request({
    url: 'api/User/watchlistList',
    method: 'get',
    params: data
  })
}

// 获取隐私政策
export function portalPpost(data) {
  return request({
    url: 'api/Portal_post/getList2',
    method: 'get',
    params: data
  })
}

// 获取创作者分类
export function classifyList(data) {
  return request({
    url: 'api/Headlines/classifyList',
    method: 'get',
    params: data
  })
}
// 创作者添加文章
export function addInsert(data) {
  return request({
    url: 'api/Headlines_user/insert',
    method: 'get',
    params: data
  })
}
// 获取腾讯云im
export function imTouristAccount(data) {
  return request({
    url: 'api/Universal/imTouristAccount',
    method: 'get',
    params: data
  })
}

// 把可提现余额转换成余额

export function conversionBalance(data) {
  return request({
    url: 'api/Balance/conversionBalance',
    method: 'get',
    params: data
  })
}

// 我得钱包-类型

export function getTypeList(data) {
  return request({
    url: 'api/order/getTypeList',
    method: 'get',
    params: data
  })
}

//api/order/export

export function getExport(data) {
  return request({
    url: 'api/order/export',
    method: 'get',
    params: data
  })
}

// 获取默认头像
export function avatarList(data) {
  return request({
    url: 'api/user/avatarList',
    method: 'get',
    params: data
  })
}

// 修改标题
export function setTitle(data) {
  return request({
    url: 'api/live/setTitle',
    method: 'get',
    params: data
  })
}

// 获取机器人
export function getRobot(data) {
  return request({
    url: 'api/hot_match/getRobot',
    method: 'get',
    params: data
  })
}

/* 修改直播间 */
export function updateLive(data) {
  return request({
    url: 'api/live/updateLive',
    method: 'get',
    params: data
  })
}

// 記錄進入直播間時長
export function recordUsageTime(data) {
  return request({
    url: 'api/front/recordUsageTime',
    method: 'post',
    data
  })
}

// 取得每日任務列表
export function getMission(data) {
  return request({
    url: 'api/task/list',
    method: 'get',
    params: data
  })
}

// 每日任務取得簽到記錄
export function getSignInRecord(data) {
  return request({
    url: 'api/task/show',
    method: 'get',
    params: {
      code: 'checkin',
      ...data
    }
  })
}

// 每日任務取得補簽過的次數
export function getAmendedService() {
  return request({
    url: 'api/task/amended',
    method: 'get',
    params: {}
  })
}

// 每日任務簽到/補簽
export function signIn(data) {
  return request({
    url: 'api/task/update',
    method: 'get',
    params: {
      code: 'checkin',
      ...data
    }
  })
}

// 每日任務領取獎勵
export function receiveAward(data) {
  return request({
    url: 'api/task/update',
    method: 'get',
    params: data
  })
}

// 获取轮盘礼物
export function getTurntableList(data) {
  return request({
    // url: 'api/activity_config/turntable',
    url: 'api/activity_game/getInfo',
    method: 'get',
    params: data
  })
}
// 获取抽奖次数
export function getTurntableNum(data) {
  return request({
    // url: 'api/activity_config/turntable_num',
    url: 'api/activity_game/getGameChance',
    method: 'get',
    params: data
  })
}
// 轮盘开奖
export function openTurntable(data) {
  return request({
    // url: 'api/activity_config/open_turntable',
    url: 'api/activity_game/sendWinner',
    method: 'get',
    params: data
  })
}
// 开播上传封面图
export function uploadImage(data) {
  return request({
    url: 'api/live/localUpload',
    method: 'upload',
    data
  })
}
// 用户头像自定义上传
export function uploadAvatar(data) {
  return request({
    url: 'api/avatar/uploadAvatar',
    method: 'upload',
    data
  })
}
// 通用的文件上传接口（ex:身份证图片
export function commonUpload(data) {
  return request({
    url: 'api/upload/upload',
    method: 'upload',
    data
  })
}

// 红包接口
export function getRedBagInfo(data) {
  return request({
    url: 'api/redbag/getRedBagInfo',
    method: 'get',
    params: data
  })
}

//  获取直播分类
export function getLiveCategories() {
  return request({
    url: 'api/live_streaming/categories',
    method: 'get'
  })
}

// bindMail
export function bindMailService(data) {
  return request({
    url: 'api/user/bindMail',
    method: 'post',
    data
  })
}

export function bindMobileService(data) {
  return request({
    url: 'api/user/bindMobile',
    method: 'post',
    data
  })
}

// 记录进入直播间接口
// 接口描述：用户点击客户端，进入直播间后，（10秒后）调用该接口
export function enterLiveWatchRecord(data) {
  return request({
    url: 'api/live_watch_record/enter',
    method: 'post',
    data,
    silentError: true
  })
}

// 直播间观看心跳接口
// 接口描述：用户点击客户端，进入直播间后，3分钟调用一次接口，判断用户是否依然在线观看直播
export function heartLiveWatchRecord(data) {
  return request({
    url: 'api/live_watch_record/heart',
    method: 'post',
    data,
    silentError: true
  })
}

// 邀请
export function inviterLog(data) {
  return request({
    url: 'api/inviter/log',
    method: 'get',
    params: data
  })
}

// 受邀请
export function inviteeLog(invite_code) {
  return request({
    url: `api/invitee/log?invite_code=${invite_code}`,
    method: 'get'
  })
}

export function inviteeListApi() {
  return request({
    url: `api/invitee/list`,
    method: 'get'
  })
}

/**************************************** 个人中心合并的新api  ***********************************************/

export function getDzInfoService() {
  return request({
    url: `/bbs/member/dzInfo`,
    method: 'get'
  })
}

export function getLevelListService() {
  return request({
    url: `/api/level/list`,
    method: 'get'
  })
}

// 进入系统（访问记录，后端按天去重）。出错不提示用户，见 request-o.js 的 silentError
export function enterSystemService(clientType) {
  return request({
    url: '/api/user_visit/enter',
    method: 'post',
    data: { client_type: clientType },
    timeout: 10000,
    silentError: true
  })
}

// 在线心跳，由 utils/onlineHeartbeat.js 选出的一个标签页定时调用。出错不提示用户
export function onlineHeartbeatService(clientType) {
  return request({
    url: '/api/user_on_line/heartbeat',
    method: 'post',
    data: { client_type: clientType },
    timeout: 10000,
    silentError: true
  })
}
