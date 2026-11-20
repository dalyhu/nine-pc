import request from '@/utils/request'

export function getRecentRecord(data) {
  return request({
    url: `/api/sports_analysis/recent`,
    method: 'post',
    data
  })
}

export function getHistoryFight(data) {
  return request({
    url: `/api/sports_analysis/fight`,
    method: 'get',
    params: data
  })
}
