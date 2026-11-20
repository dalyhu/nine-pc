import service from '@/utils/request'

const toggleUrl = (url = '') => url.startsWith('/') ? url : '/' + url

export const http = {
  get   : (url, params) => service({
    url: toggleUrl(url), method: 'get', params
  }),
  post  : (url, data) => service({
    url: toggleUrl(url), method: 'post', data
  }),
  put   : (url, params) => service({
    url: toggleUrl(url), method: 'put', params
  }),
  delete: (url, params) => service({
    url: toggleUrl(url), method: 'delete', params
  })
}

// 查询我的帖子
export const myPostApi = (data) => http.get('bbs/thread/list', data)

// 查询我的收藏
export const myCollectApi = (data) => http.get('bbs/member/favorite', data)

// 查询我的关注/粉丝
export const myAttentionApi = (data) => http.get('bbs/member/getFriendList', data)

// 关注/取消关注（非作者）
export const unWriterFocusApi = (data) => http.get('api/Member/attention', data)

// 关注/取消关注（作者）
export const myFocusApi = (data) => http.get('bbs/member/follow', data)

// 投诉分类
export const myFBCategoryApi = (data) => http.get('api/feedbacks/category', data)

// 提交悄悄话
export const myMsgSubmitApi = (data) => http.post('api/feedbacks/submit', data)

// 查询留言列表
export const myMsgRecordApi = (data) => http.get('api/feedbacks/list', data)

// 查询留言记录
export const myInfoApi = (data) => http.get('api/feedbacks/info', data)

// 包赔记录
export const compensationApi = (data) => http.get('api/compensation/getRecord', data)

// 投票记录
export const voteRecordApi = (data) => http.get('api/activity_vote_log/list', data)

// 发验证码
export const getVCCodeApi = (data) => http.post('api/user/sendVerificationCode', data)

// 校验手机号
export const checkMobileApi = (data) => http.post('api/user/modifyPwdMobileValidate', data)

// 校验邮箱
export const checkMailApi = (data) => http.post('api/user/modifyPwdMailValidate', data)

// 通过手机号修改密码
export const modifyPwdByMobileApi = (data) => http.post('api/user/modifyPwdMobileConfirm', data)

// 通过邮箱修改密码
export const modifyPwdByEmailApi = (data) => http.post('api/user/modifyPwdMailConfirm', data)

// 绑定手机
export const bindMobileApi = (data) => http.post('api/user/bindMobile', data)

// 绑定邮箱
export const bindEmailApi = (data) => http.post('api/user/bindMail', data)

// 绑定体育站
export const bindSportApi = (data) => http.post('api/user_xing/bind', data)

export const getAvatarAuditUrlApi = () => http.get('bbs/member/avatarAuditUrl')

export const getApplyMedalsApi = () => http.get('bbs/member/applyMedals')

export const getMemberMedalsApi = (data) => http.get('/bbs/member/medals', data)

export const updateNicknameApi = (data) => http.get('/api/member/updateNickname', data)

// 预约开播-总列表查询
export const getReserveLiveApi = (data) => http.get('api/live_streaming/getReserveLiveList', data)

// 预约开播-电竞列表查询
export const getGameVSApi = (data) => http.get('api/e_sport_game/game_match', data) 

// 预约开播-足球列表查询
export const getFootballListApi = (data) => http.get('api/foot_sports/f_matches', data)
// export const getFootballListApi = (data) => http.get('api/Football/football_match', data)

// 预约开播-篮球列表查询
export const getBasketballListApi = (data) => http.get('api/basket_sports/b_matches', data)
// export const getBasketballListApi = (data) => http.get('api/basketball/getList', data)

// 预约开播-预约
export const setBookApi = (data) => http.post('api/Live/setReserveLiveNew', data)

// 预约开播-删除
export const deleteBookApi = (data) => http.delete('api/live/deleteReserveLive', data)

// 获取积分记录
export const getMemberCreditkApi = (data) => http.get('bbs/member/credit', data)

// 获取等级信息
export const getMemberGroupsApi = () => http.get('bbs/member/groups')

// 我的直播-开播记录-列表
export const getRoomListApi = (data) => http.get('api/live/getRoomList', data)

// 我的直播-开播记录-开播
export const openRoomApi = (data) => http.get('api/Live/startRoom', data)

// 我的直播-开播记录-关播
export const closeRoomApi = (data) => http.get('api/Live/endRoom', data)

// 我的直播--弹窗-电竞列表
export const gameListApi = () => http.get('api/e_sport_game/games')

// 我的直播--弹窗-新增-提交
export const submitRoomApi = (data) => http.post('api/Live/createRoom', data)

// 我的直播--弹窗-修改-提交
export const updateRoomApi = (data) => http.get('api/live/updateLive', data)

// 我的直播--子弹窗-篮球赛事列表
export const basketballListApi = () => http.get('api/Basketball/liveList', { type: 0, isWeb: 1 })

// 我的直播--子弹窗-足球赛事列表
export const footballListApi = () => http.get('api/Football/liveList', { type: 0, isWeb: 1 })

// 我的直播--子弹窗-电竞赛事列表
export const matchListApi = (game_id = 0) => http.get('api/e_sport_game/liveList', { type: 0, isWeb: 1, game_id })

// 他的空间个人信息
export const getOtherInfoV2 = (data) => http.get('bbs/member/otherInfoV2', data)

// 板块列表
export const getForumList = () => http.get('bbs/forum/list')

// 获取详情地址
export const getDetailsUrl = (data) => http.get('bbs/user/bbsUrl', data)
