import request from '@/utils/request'

// 電競
export function getGameList(data) {
  return request({
    url: 'api/e_sport_game/game_match',
    method: 'get',
    params: data
  })
}

export function getGameLiveList(data) {
  return request({
    url: '/api/e_sport_game/liveList',
    method: 'get',
    params: data
  })
}

export function getGames() {
  return request({
    url: `/api/e_sport_game/games`,
    method: 'get'
  })
}

export function getMatchRecent(data) {
  return request({
    url: `/api/e_sports_analysis/recent`,
    method: 'post',
    data
  })
}

export function getMatchFight(data) {
  return request({
    url: `/api/e_sports_analysis/fight`,
    method: 'post',
    data
  })
}

// 电竞-比赛 - 获取比赛即时比分
export function getLiveScore(data) {
  return request({
    url: `/api/e_sports_match/liveScore`,
    method: 'get',
    params: data
  })
}

//电竞-比赛 - 获取比赛赛果数据
export function getResults(data) {
  return request({
    url: `/api/e_sports_match/results`,
    method: 'get',
    params: data
  })
}

// 电竞-比赛 - 获取比赛赛程数据
export function getSchedule(data) {
  return request({
    url: `/api/e_sports_match/schedule`,
    method: 'get',
    params: data
  })
}

// 电竞-比赛 - 获取用户收藏比赛数据，未登录获取不到
export function getCollect(data) {
  return request({
    url: `/api/e_sports_match/collect`,
    method: 'get',
    params: data
  })
}

// 获取实时数据接口中的race_id
export function getEgameRoundInfo(data) {
  return request({
    url: `/api/mars_api_cache_proxy/eGameRoundInfo`,
    method: 'post',
    data
  })
}

// 阵容体系
export function getTeamData(data) {
  return request({
    url: `/api/mars_api_cache_proxy/teamData`,
    method: 'post',
    data
  })
}

// 实时数据
export function getRealTimeData(data) {
  return request({
    url: `/api/mars_api_cache_proxy/realTimeData`,
    method: 'post',
    data
  })
}
