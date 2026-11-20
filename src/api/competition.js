import request from '@/utils/request'

// 赛事分类（赛程）
export function scheduleMatch(data) {
  return request({
    url: 'api/hot_match/schedule_match',
    method: 'get',
    params: data
  })
}

// 赛事列表（赛程）
export function scheduleList(data) {
  return request({
    url: 'api/hot_match/schedule',
    method: 'get',
    params: data
  })
}
