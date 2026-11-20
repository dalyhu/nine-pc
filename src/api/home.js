import request from '@/utils/request'

export default {
  /**
   *getToken
   */
  getImToken() {
    return request({
      url: `api/chat/getChatToken`,
      method: 'get'
    })
  },
  /**
   *getMsgList
   * type 1群聊 2私聊
   */
  getMessageList(params) {
    return request({
      url: `api/chat/getChatRoomList`,
      method: 'get',
      params
    })
  },
  /**
   * 群聊、直播间发消息
   */
  sendMessage(params, method = 'post') {
    return request({
      url: `api/chat/sendMessage`,
      method,
      data: params
    })
  },
  /**
   * 主播私聊
   */
  sendToAnchor(params, method = 'post') {
    return request({
      url: `api/chat/sendToAnchor`,
      method,
      data: params
    })
  },
  /**
   * 主播私聊-上传视频
   */
  sendVideoToAnchor(params, method = 'post') {
    return request({
      url: `api/chat_msg_video/send`,
      method,
      data: params
    })
  },
  /**
   * 主播私聊-上传视频-有无权限
   */
  sendVideoIsAgree(params) {
    return request({
      url: `api/chat_msg_video/check`,
      method: 'get',
      params
    })
  },
  /**
   * 助理私聊
   */
  sendToAssistant(params, method = 'post') {
    return request({
      url: `api/chat/sendToAssistant`,
      method,
      data: params
    })
  },
  // 获取表情包
  getEmoticonsList() {
    return request({
      url: `api/emoji/getList`,
      method: 'get'
    })
  },
  /**
   * 获取主播公告或置顶消息
   */
  getPinInfo(params) {
    return request({
      url: `api/chat/pin`,
      method: 'get',
      params
    })
  },
  /**
   * 获取历史消息
   */
  getChatHistory(params) {
    return request({
      url: `api/chat/history`,
      method: 'get',
      params
    })
  },
  /**
   * 获取历史消息
   */
  getChatAnchorHistory(params) {
    return request({
      url: `api/chat/anchorHistory`,
      method: 'get',
      params
    })
  },
  /**
   * 将消息标记为已读
   */
  readMessage(data) {
    return request({
      url: `api/chat/read`,
      method: 'post',
      data
    })
  },
  /**
   *mute
   */
  mute(params) {
    return request({
      url: `api/chat/mute`,
      method: 'post',
      data: params
    })
  },
  /**
   *freeze
   */
  freeze(params) {
    return request({
      url: `api/chat/freeze`,
      method: 'post',
      data: params
    })
  },
  /**
   *pin
   */
  pin(params) {
    return request({
      url: `api/chat/pin`,
      method: 'post',
      data: params
    })
  },
  getQuickReplyList() {
    return request({
      url: `api/chat/getQuickReplyList`,
      method: 'get'
    })
  },
  gettoburl(params) {
    return request({
      url: `api/tob/gettoburl`,
      method: 'post',
      data: params
    })
  },
  /**
   *addQuickReply
   */
  addQuickReply(params) {
    return request({
      url: `api/chat/addQuickReply`,
      method: 'post',
      data: params
    })
  },
  /**
   *delQuickReply
   */
  delQuickReply(params) {
    return request({
      url: `api/chat/delQuickReply`,
      method: 'post',
      data: params
    })
  },
  /**
   * 获取最近上线的用户记录
   */
  getOnlineUserList(params) {
    return request({
      url: 'api/chat/getLiveInroomlog',
      method: 'get',
      params
    })
  },
  /**
   *房间置顶
   */
  chatPin(params) {
    return request({
      url: `api/chat_room/pin`,
      method: 'post',
      data: params
    })
  },
  /**
   * 获取 AI 预设分类问题列表（主播私聊快捷入口）
   * NX-1887
   */
  getAiCategoryList() {
    return request({
      url: `api/chatAi/category/list`,
      method: 'get'
    })
  }
}
