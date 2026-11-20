// 圈子
import request from '@/utils/request'

// 添加圈子
export function add(data) {
  return request({
    url: 'api/Circleuser/insert',
    method: 'post',
    data
  })
}
// 圈子收藏
export function favorites(data) {
  return request({
    url: 'api/Circleuser/favorites',
    method: 'post',
    data
  })
}

// 圈子评论
export function comment(data) {
  return request({
    url: 'api/Circleuser/comment',
    method: 'post',
    data
  })
}

// 圈子收藏、回帖列表
export function favoritesList(data) {
  return request({
    url: 'api/Circleuser/logList',
    method: 'get',
    params: data
  })
}

// 用户发帖记录
export function userPostList(data) {
  return request({
    url: 'api/Circleuser/userPostList',
    method: 'get',
    params: data
  })
}

// 帖子详情
export function info(data) {
  return request({
    url: 'api/circle/info',
    method: 'get',
    params: data
  })
}

// 圈子分类
export function classification(data) {
  return request({
    url: 'api/circle/classification',
    method: 'get',
    params: data
  })
}
