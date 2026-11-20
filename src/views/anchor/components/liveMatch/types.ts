export interface ILiveMatchItem {
  sourceid: number
  vid: string
  competition: string
  match_time: string
  home_team_name: string
  home_team_name_en: string
  home_team_name_zht: string
  home_team_logo: string
  away_team_name: string
  away_team_name_en: string
  away_team_name_zht: string
  away_team_logo: string
  home_scores: number
  away_scores: number
  status: number
  status_id: number
  status_sort: string
  status_str: string
  mlive: number
  reserve: number
  sort: number
  anchor: Anchor[]
  status_type: number
  type: number
  match_str: string
  match_date: string
  time: number
  league_level: number
  details: Details
  home_score: number
  away_score: number
  is_collect: number
  match_ADate: number
  anchor_list: AnchorList[]
  hot_type: number
  anchor_total: number
}

export interface Anchor {
  match_id: number
  vid: string
  type: number
  avatar: string
  iszr: number
  heat: number
  id: number
  user_nickname: string
}

export interface Details {
  id: number
  match_id: number
  finished: number
  state: number
  time: number
  home_win: number
  home_score: number
  home_stage_score: string
  home_stats: string
  home_half_stats: string
  home_players: string
  away_win: number
  away_score: number
  away_stage_score: string
  away_stats: string
  away_half_stats: string
  away_players: string
  addtime: number
}

export interface AnchorList {
  match_id: number
  vid: string
  type: number
  avatar: string
  iszr: number
  heat: number
  id: number
  user_nickname: string
}
