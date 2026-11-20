import { CHAT_BOX_MODE, CHAT_TYPE, MESSAGE_TYPE, PM_SOURCE_TYPE } from '@/enums'
import { padStart } from 'lodash-es'
import { genSeedId, formatTextMsg } from '@/utils/common'

function getContentType(item) {
  if (item.text?.includes('进入直播间') && item?.action === 'system') return MESSAGE_TYPE.IN_ROOM
  if (item.pic && item.video) return MESSAGE_TYPE.IMG //如果为视频，则为图片类型2 单独排到最前面，以示其重要性
  if (item.pic && item.text) return MESSAGE_TYPE.AD
  if (item.pic && !item.text) return MESSAGE_TYPE.IMG // 图片 和 表情图片，后台未返回类型，统一当图片展示
  return MESSAGE_TYPE.TEXT
}

function getTime(item) {
  let time = item.creation_time || item.time

  if (typeof time === 'string') {
    try {
      return time.split(' ')[1].split(':').slice(0, 2).join(':')
    } catch {
      return ''
    }
  } else {
    time = time || new Date()
    return `${padStart(time.getHours(), 2, '0')}:${padStart(time.getMinutes(), 2, '0')}`
  }
}

function processImg(img) {
  if (img instanceof File) {
    const URL = window.URL || window.webkitURL
    return URL.createObjectURL(img)
  }

  return img
}

export function formatMsg(item) {
  const msg = {
    ...item,
    seed: item.seed || genSeedId(),
    sender: parseInt(item.sender),
    contentType: getContentType(item),
    displayTime: getTime(item),
    displayText: formatTextMsg(item.text)
  }

  if (msg.contentType === MESSAGE_TYPE.IMG) msg.displayImg = processImg(msg.pic)

  return msg
}

export function processPinData(data: { [key: string]: any } = {}) {
  const { pinObj = {}, pinType, extra = {}, pinData } = data
  const links = extra.list || []
  const type = parseInt(pinType)

  if (type === 1 && (links.length || pinObj.text)) {
    return {
      ...pinObj,
      type, // 1.主播公告    0.置顶消息
      links, // 公告主内容，多条文本链接
      content: pinData || '' // 文本内容
    }
  }

  if (type === 0) {
    const msgType = parseInt(pinObj.msg_type)
    const msgId = String(pinObj.msg_id || '')
    const info = {
      ...pinObj,
      type,
      msgType,
      msgId
    }

    // 图片
    if (msgType === 2) {
      info.content = pinObj.pic || ''
      return info
    }

    // 广告
    if (msgType === 3) {
      return {
        ...info,
        link: pinObj.link || '',
        img: pinObj.pic || '',
        title: pinObj.title || '',
        content: pinObj.originalText || pinObj.text || ''
      }
    }

    // 文字, 兼容早期消息类型
    if (msgType === 0 || pinObj.text) {
      info.content = pinObj.text || ''
      info.msgType = 0
      return info
    }
  }

  return null
}

export function openLink(link = '', target = '_blank') {
  if (!link.trim()) return
  window.open(link, target)
}

export type PmSourceContext = {
  chatBoxMode: CHAT_BOX_MODE
  chatType: CHAT_TYPE
  tabIndex: string
  uid: number
  matchType: number
  matchId: string
  /** 全局聊天：当前来源类型（默认 3，寻求帮助时为 6/7） */
  globalPmSourceType?: number
  /** 直播间活动寻求帮助会话 */
  isLiveActivityHelp?: boolean
}

/** 根据聊天场景解析发言来源类型 */
export function resolvePmSourceType(ctx: PmSourceContext): number | undefined {
  if (ctx.chatBoxMode === CHAT_BOX_MODE.MAIN) {
    return ctx.globalPmSourceType ?? PM_SOURCE_TYPE.GLOBAL_CHAT_LIST
  }

  if (ctx.chatBoxMode === CHAT_BOX_MODE.SCORE_LIVE) {
    return PM_SOURCE_TYPE.MATCH_CHAT_LIST
  }

  if (ctx.chatBoxMode === CHAT_BOX_MODE.LIVE) {
    if (ctx.chatType === CHAT_TYPE.ANCHOR_PRIVATE) {
      return PM_SOURCE_TYPE.LIVE_ANCHOR_PRIVATE
    }
    if (ctx.chatType === CHAT_TYPE.PUBLIC) {
      return undefined
    }
    if (ctx.isLiveActivityHelp) {
      return PM_SOURCE_TYPE.LIVE_ACTIVITY_HELP
    }
    return PM_SOURCE_TYPE.LIVE_CHAT_LIST
  }

  return undefined
}

export function resolvePmSourceTypeStr(
  sourceType: number,
  ctx: Pick<PmSourceContext, 'chatBoxMode' | 'chatType' | 'uid' | 'matchType' | 'matchId'>
): string {
  if (ctx.chatBoxMode === CHAT_BOX_MODE.SCORE_LIVE) {
    return `${ctx.matchType}_${ctx.matchId}`
  }
  if (ctx.chatBoxMode === CHAT_BOX_MODE.LIVE) {
    return String(ctx.uid)
  }
  return '0'
}

export const sendMsgOmitKeys = [
  'time',
  'sender_exp',
  'sender_nickname',
  'avatar',
  'sender_user_type',
  'msgStatus',
  'action',
  'contentType',
  'displayTime',
  'displayText',
  'displayImg',
  'isMyself',
  'isAnchor',
  'chatType',
  'className',
  'imageUploadProgress'
]

export const testGifts = [
  '520',
  '666',
  '6666',
  'duck',
  'money',
  'mvp',
  'MVP2',
  'rose',
  '中奖了',
  '为你打call',
  '五色礼花',
  '加油',
  '卧龙',
  '向前冲鸭',
  '吹哨',
  '吹金哨',
  '喷钞枪',
  '垫球',
  '城堡',
  '夸夸弹幕',
  '干杯',
  '开球',
  '恐龙踢球',
  '护身符',
  '招财猫',
  '朱雀',
  '欢呼',
  '比心',
  '爱你鸭',
  '礼炮',
  '胜利',
  '财神驾到',
  '足球',
  '进球',
  '邮轮',
  '鎏金神树',
  '锦鲤',
  '青龙',
  '飞鹰进球',
  '黄金飞车',
  '龙年机车'
]

export function msgToPrivateChat(data: SendMessageItem) {
  const sender = parseInt(data.sender)
  const { vid, pic, pic_bnc, type: room_type, avatar, sender_nickname, seed, time, text } = data

  return {
    vid,
    name: sender_nickname,
    room_type,
    pic: avatar,
    user_id: sender,
    is_online: 1,
    pin_time: 0,
    is_pin: 0,
    last_msg: {
      vid,
      room_type,
      sender,
      sender_name: sender_nickname,
      seed,
      creation_time: time,
      text,
      pic,
      pic_bnc
    }
  }
}
