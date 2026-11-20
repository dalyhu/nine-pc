export interface EmptyKey {
  show: boolean
  icon: string
  des: [string, string]
}

export interface TabKey {
  name: string
  key: number
}

export interface FeedbackKey {
  name: string
  id: number
  addtime: string
  content: string
  status: number
  tag: string
  type: any
}

export interface MessageKey {
  admin_unread: number
  create_at: string
  feedback_id: number
  id: number
  message_text: string
  receiver_id: string
  sender_id: string
  status: number
  type: number
  unread: number
  updated_at: string
}

export interface RpeliesKey {
  category: {
    id: number
    name: string
    tag: string
  }
  category_id: number
  create_at: string
  id: number
  status: number
  updated_at: string
  user: {
    id: number
    user_nickname: string
    user_id: string
  }
  message: MessageKey[]
}