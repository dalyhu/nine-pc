export enum MESSAGE_TYPE {
  /**
   * 弹幕
   */
  DANMU = 0,
  /**
   * 文本信息（内容可包含超链接 和 emoji）
   */
  TEXT = 1,
  /**
   * 图片
   */
  IMG = 2,
  /**
   * 视频
   */
  VIDEO = 7,
  /**
   * 广告
   */
  AD = 3,
  /**
   * 表情图片
   */
  EMOTICON = 5,
  /**
   * 进入房间，欢迎语
   */
  IN_ROOM = 21
}

export enum CHAT_TYPE {
  /**
   * 主播私聊
   */
  ANCHOR_PRIVATE = -2,
  /**
   * 聊天列表
   */
  LIST = -1,
  /**
   * 广场
   */
  PUBLIC,
  /**
   * 群聊
   */
  GROUP,
  /**
   * 私聊
   */
  PRIVATE
}

export enum CHAT_BOX_MODE {
  /**
   * 消息弹框
   */
  MAIN,
  /**
   * 直播间详情
   */
  LIVE,
  /**
   * 即时比分详情
   */
  SCORE_LIVE
}

/** 发言来源类型（pm_source_type） */
export enum PM_SOURCE_TYPE {
  /** 未知 */
  UNKNOWN = 0,
  /** 直播间主播私聊 */
  LIVE_ANCHOR_PRIVATE = 1,
  /** 直播间群组/私聊列表 */
  LIVE_CHAT_LIST = 2,
  /** 全局聊天列表（右下角通知） */
  GLOBAL_CHAT_LIST = 3,
  /** 赛事播放间聊天列表 */
  MATCH_CHAT_LIST = 4,
  /** 直播间活动寻求帮助 */
  LIVE_ACTIVITY_HELP = 5,
  /** 个人中心绑定杏体账号寻求帮助 */
  BIND_XINGTI_HELP = 6,
  /** 个人中心绑定邮箱寻求帮助 */
  BIND_EMAIL_HELP = 7
}

export enum MESSAGE_STATUS {
  /**
   * 发送中
   */
  SENDING,
  /**
   * 成功
   */
  SUCCESS,
  /**
   * 失败
   */
  FAIL
}

export enum IM_STATUS {
  /**
   * 初始化
   */
  INIT,
  /**
   * 连接中
   */
  CONNECTING,
  /**
   * 已连接
   */
  CONNECTED,
  /**
   * 断开
   */
  CLOSE,
  /**
   * 出错
   */
  ERROR,
  /**
   * 超时
   */
  TIMEOUT,
  /**
   * 重连次数超过上限
   */
  EXCEED_COUNT,
  /**
   * 心跳超时
   */
  HEART_TIMEOUT
}

/**
 * 图片请求方式
 */
export enum IMG_MODE {
  /**
   * 默认模式，直接请求
   */
  NORMAL,
  /**
   * 直连模式，以当前域名来请求
   */
  DIRECT
}
