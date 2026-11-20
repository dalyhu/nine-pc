import request from '@/utils/request'

// 活动列表
export function activityGames(data) {
  return request({
    url: 'api/activity_games/list',
    method: 'get',
    params: data
  })
}

// 投票
export function activityVote(data) {
  return request({
    url: 'api/activity_vote/vote',
    method: 'get',
    params: data
  })
}

// 体育账号
export function userXCAccount() {
  return request({
    url: 'api/user_xing/index',
    method: 'get'
  })
}

// 绑定体育站账号
export function bindAccount(data) {
  return request({
    url: 'api/user_xing/bind',
    method: 'post',
    data
  })
}

// 领取奖励
export function receiveAward(data) {
  return request({
    url: 'api/activity_vote/award',
    method: 'get',
    params: data
  })
}

// 投票记录
export function activityVoteLog(data) {
  return request({
    url: 'api/activity_vote_log/list',
    method: 'get',
    params: data
  })
}

// 协助绑体育站账号
export function helpBindAccount(data) {
  return request({
    url: 'api/user_xing/help',
    method: 'get',
    params: data
  })
}
// 包赔记录
export function getPackPayRecord(data) {
  return request({
    url: 'api/compensation/getRecord',
    method: 'get',
    params: data
  })
}
export function getApplyParam(data) {
  return request({
    url: 'api/compensation/getApplyParam',
    method: 'get',
    params: data
  })
}
export function getApplyUpload(data) {
  return request({
    url: 'api/compensation/upload',
    method: 'upload',
    data
  })
}
// 申请包赔
export function getCompensationApply(data) {
  return request({
    url: 'api/compensation/apply',
    method: 'post',
    data
  })
}
