import request from '@/utils/request'

// 足球
export function getQiniuToken(data) {
  return request({
    url: 'api/Member/getQiniuToken',
    method: 'get',
    params: data
  })
}

// 赛事收藏
export function collect(data) {
  return request({
    // url: 'api/Basketballuser/collect',
    url: 'api/hot_match/collect',
    method: 'post',
    data
  })
}

// 首页赛事推荐
export function recommend(data) {
  return request({
    url: 'api/front/recommend',
    method: 'post',
    data
  })
}

// 埋點
export function buriedPoint(data) {
  return request({
    url: 'api/front/buriedPoint',
    method: 'get',
    data
  })
}

// 首页赛事推荐-多賽事id查詢
export function multiEventRecommend(data) {
  return request({
    url: 'api/front/MultiEvent',
    method: 'post',
    data
  })
}

// 等級列表
export function getLevelList(params) {
  return request({
    url: 'api/level/list',
    method: 'get',
    params
  })
}

// 获取主播排序列表（推荐/热门）
// let params = {
//   type: 2, // 1:热门 2:推荐
//   platform: 2, // 1:pc 2:h5 3:android 4:ios
//   side: 6, // 投放位置  1:足球 2:篮球 3:电竞 4:首页 5:直播间 6:其他
//   listRows: 6, // 每页数量
//   page: 1, // 页码
// }
export function getRecommendNew(params) {
  return request({
    url: 'api/anchor/sort',
    method: 'get',
    params
  })
}

// 获取首页的banner（同H5
export function getBannerList(params) {
  return request({
    url: 'api/banner/getBannerList',
    method: 'get',
    params
  })
}
// 获取首页的活动倒计时
export function getCountdown(params) {
  return request({
    url: 'api/countdown/get',
    method: 'get',
    params
  })
}

export function getBbsUrl(params) {
  // 修改地址
  return request({
    url: 'bbs/user/bbsUrl',
    method: 'get',
    params
  })
}

export function getNetworkSpeedApi() {
  return request({
    url: 'api/',
    method: 'get'
  })
}

// 提交网络访问时间
export function uploadNetworkSpeed(params) {
  return request({
    url: 'api/analyze/speedRecord',
    method: 'get',
    params
  })
}
