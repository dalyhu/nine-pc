import request from '@/utils/request'

// 篮球
export function getList(data) {
  return request({
    url: 'api/basket_sports/b_matches',
    method: 'get',
    params: data
  })
}
// 篮球(跨日)
export function getLiveList(data) {
  return request({
    url: 'api/Basketball/liveList',
    method: 'get',
    params: data
  })
}
// 篮球详情
export function getBasketballInfo(data) {
  return request({
    url: 'api/basket_sports/b_matches_info',
    method: 'get',
    params: data
  })
}
// 篮球指数
export function getExponent(data) {
  return request({
    url: 'api/Basketball/exponent',
    method: 'get',
    params: data
  })
}
// 篮球指数详情
export function getExponentList(data) {
  return request({
    url: 'api/Basketball/getExponentList',
    method: 'get',
    params: data
  })
}

// 篮球球队统计
export function playerData(data) {
  return request({
    url: 'api/Basketball/playerData',
    method: 'get',
    params: data
  })
}

// 篮球分析
export function basketballAnalyze(data) {
  return request({
    url: 'api/Basketball_Analyze/info',
    method: 'get',
    params: data
  })
}

// 篮球比分新接口
export function getBasketballScore(data) {
  return request({
    url: 'api/basketball/getBasketballScore',
    method: 'get',
    params: data
  })
}
