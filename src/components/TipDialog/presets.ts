export interface TipDialogPreset {
  title?: string
  subtitle?: string
  content: string
  tip?: string
  confirmText: string
  showClose?: boolean
  showNoRemind?: boolean
  noRemindKey?: string
}

export const TIP_DIALOG_PRESETS = {
  bindPhone: {
    subtitle: '亲爱的小9球迷',
    content: '为了您的账号安全，建议您尽快绑定手机！\n完善个人信息后。',
    tip: '可私聊小助理领取好运小惊喜',
    confirmText: '绑定手机',
    showNoRemind: true,
    noRemindKey: 'BIND_PHONE'
  },
  bindEmail: {
    subtitle: '亲爱的小9球迷',
    content: '为了您的账号安全，建议您尽快绑定邮箱！\n完善个人信息后。',
    tip: '可私聊小助理领取好运小惊喜',
    confirmText: '绑定邮箱',
    showNoRemind: true,
    noRemindKey: 'SET_MAIL_TIP'
  },
  levelTooLow: {
    subtitle: '邮箱注册的会员',
    content: '新账号等级过低，请先进行签到活跃升级，\n或绑定手机号码立刻解锁发言！',
    tip: 'XC会员可私聊小助理即刻开通VIP权益',
    confirmText: '我明白了',
    showNoRemind: false
  },
  guestRegister: {
    subtitle: '亲爱的小9游客',
    content: '注册开启新体验，更多有趣的小9功能与活动\n等着您！',
    tip: '完善个人信息后，可私聊小助理领取好运小惊喜',
    confirmText: '现在就注册',
    showNoRemind: true,
    noRemindKey: 'GUEST_REGISTER'
  }
} satisfies Record<string, TipDialogPreset>

export type TipDialogPresetKey = keyof typeof TIP_DIALOG_PRESETS
