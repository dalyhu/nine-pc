/// <reference types="vite-plugin-pwa/client" />

import { UseScrollReturn } from '@vueuse/core'
import { MESSAGE_TYPE, CHAT_TYPE, MESSAGE_STATUS } from '@/enums'
import { UploadRawFile } from 'element-plus'

export {}

declare global {
  interface MenuOptions {
    path: string
    icon?: string
    title: string
    children?: MenuOptions[]
  }

  type UseScrollArrivedState = Partial<UseScrollReturn['arrivedState']>

  type UserInfo = {
    id: number
    user_nickname: string
    [key: string]: any
  }

  type SendMessageItem = {
    vid: string
    uid: number
    type: CHAT_TYPE
    method: 'notice'
    msg_type: MESSAGE_TYPE
    color: string
    contentType: number,
    sender: number
    seed: string
    anchorId?: number
    anchor_id?: number
    assignId?: number
    msgType?: MESSAGE_TYPE
    pm_source_type?: number
    pm_source_type_str?: string
    msgStatus?: MESSAGE_STATUS
    text?: string
    pic?: string | UploadRawFile | File
    video?: string | UploadRawFile | File
    localVideo?: string | UploadRawFile | File
    localVideoType?: string
    localVideoIsPlay?: boolean
    title?: string
    link?: string
    time?: Date
    sender_exp?: string
    sender_nickname?: string
    avatar?: string
    sender_user_type?: number
    imageUploadProgress?: number
    isAiCategory?: number // AI 快捷回复标识，值为 1 表示通过快捷问题发送
  }

  type NormalObject = { [key: string]: any }

  type RequestError = {
    msg: string
    [key: string]: any
  }

  interface MatchListItem {
    type: string
    date: string
    competition: string
    home_team_logo: string
    home_team_name: string
    home_scores: string
    away_team_logo: string
    away_team_name: string
    away_scores: string
    status_str: string
    match_ADate: number
    match_time: string
  }

  interface CountdownDataListItem {
    [key: string]: any
    type: string
    date: string
    matchs: MatchListItem[]
    date_diff: number
    name: string
  }

  type NormalModel = { [key: string]: any }

  type UAInfo = {
    fingerprintId?: string
    brand?: string
    model?: string
    versionOS?: string
  }
}
