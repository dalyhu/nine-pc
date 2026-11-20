// 搜索
import request from '@/utils/request'

// 综合
export function searchIndex(data) {
  return request({
    url: 'api/anchor_search/index',
    method: 'get',
    params: data
  })
}
// 搜索-主播
export function searchAnchor(data) {
  return request({
    url: 'api/Search/anchor',
    method: 'get',
    params: data
  })
}

// 搜索-直播
export function searchLive(data) {
  return request({
    url: 'api/Search/live',
    method: 'get',
    params: data
  })
}

// 搜索-热门推荐
export function initialList(data) {
  return request({
    url: 'api/hot_match/initial_list',
    method: 'get',
    params: data
  })
}

// 搜索-新闻
export function searchHeadlines(data) {
  return request({
    url: 'api/anchor_search/headlines',
    method: 'get',
    params: data
  })
}

// 搜索-主播
export function getAnchorAssistant(data) {
  return request({
    url: 'api/chat/searchAssistant',
    method: 'post',
    data
  })
}
/** 群组消息列表隐藏 */
export function deleteChatRoomHide(data) {
  return request({
    url: 'api/chat_room/hide',
    method: 'post',
    data
  })
}
