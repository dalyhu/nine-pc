export const workBanStatus = {
  0: '进行中',
  1: '同意',
  2: '拒绝'
}

export const optionStatus = {
  block: '拉黑',
  ban: '禁言',
  del: '删除',
  online: '',
}

export const permissionList = ['approve', 'ban', 'block', 'delete']


export const packPayStatus = {
  block: '审核中',
  ban: '已驳回',
  del: '已发放',
  online: '已取消',
}

export interface ListData {
  id: number;
  /** 重新申请时 getApplyParam 使用的活动 event_id（与 H5 subItemId 一致） */
  event_id?: number | string;
  eventId?: number | string;
  live_room_id?: number | string;
  apply_time: string;
  live_room: string;
  game_type: number;
  game_name: string;
  order_no: string;
  competition_teams: string;
  raise: number;
  status: number;
  account?: number | string;
  mark: string;
  reorder?: boolean;
  again?: boolean;
  /** 上传截图 URL，接口可能为逗号分隔字符串或 string[] */
  files_path?: string | string[];
}

export const StatusType: Record<number, string> = {
  1: '已发放',
  2: '已驳回',
  3: '已取消',
  4: '审核中'
}

/** 活动包赔表单可提交字段（只读展示项单独维护，不混入提交数据） */
export interface FormData {
  id?: number
  account: string
  order_no: string
  raise: string
  detail: string
}
export interface Props {
  modelValue: any[]
}
