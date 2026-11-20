import request from '@/utils/request'

// 获取举报分类
export function category(data) {
  return request({
    url: '/api/feedbacks/category',
    method: 'get',
    params: data
  })
}
// 提交反馈
export function submit(data) {
  return request({
    url: '/api/feedbacks/submit',
    method: 'post',
    data
  })
}
// 用户反馈列表
export function list(data) {
  return request({
    url: '/api/feedbacks/list',
    method: 'get',
    params: data
  })
}
// 反馈详情
export function info(data) {
  return request({
    url: '/api/feedbacks/info',
    method: 'get',
    params: data
  })
}
