import { IM_STATUS } from '@/enums'
import { unionEndBy } from '@/utils/common'
import { formatMsg } from '@/components/chatBox/chatHelper'
import { cloneDeep } from 'lodash-es'
import wsHelper from './wsHelper'

const allowEvents = [
  'clearHistory',
  'delmsg',
  'ban',
  'pin',
  'gift',
  'send',
  'msg',
  'closeLive',
  'useronline',
  'kickuser',
  'vote',
  'toggle',
  'toggle',
  'tokenError',
  'inRoom',
  'balanceChanged' // 钻石派发
]
let wsInstance = null
let isConnected = false
let timer = null
let messageList = []

function scheduledPush(interval = 200) {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }

  function nextPush() {
    timer = setTimeout(() => {
      if (messageList.length) {
        const _messageList = cloneDeep(messageList)
        messageList = []

        self.postMessage({ action: 'messageList', messageList: _messageList })
      }

      nextPush()
    }, interval)
  }

  nextPush()
}

export function handleStateChange(state, info) {
  isConnected = state === IM_STATUS.CONNECTED

  if (isConnected) {
    scheduledPush(100)
  }

  self.postMessage({ action: 'stateChange', state, ...info })
}

function handleMessage(data) {
  try {
    if (!allowEvents.includes(data.action)) return

    if (data.action !== 'balanceChanged') {
      data.userid = parseInt(data.userid)
      data.sender = parseInt(data.sender)
    }

    if (data.action === 'msg' || data.action === 'send') {
      messageList = unionEndBy(messageList, [formatMsg(data)], 'seed')
    } else {
      self.postMessage(data)
    }
  } catch (error) {
    console.error('[ws-worker] handleMessage', data?.action, error)
  }
}

self.addEventListener('message', (msg) => {
  const { action, data = {} } = msg.data || {}

  switch (action) {
    case 'connect': {
      wsInstance = wsHelper
      wsInstance.connect({ handleMessage, handleStateChange, ...data })
      break
    }
    case 'subscribe': {
      wsInstance.send({ action: 'sub', vid: data.vid })
      break
    }
    case 'unsubscribe': {
      wsInstance.send({ action: 'unsub', vid: data.vid })
      break
    }
    case 'destroy': {
      wsInstance?.destroy()
      break
    }
  }
})

// setInterval(() => {
//   handleMessage({
//     action: 'send',
//     msg_id: 1717031163469639,
//     vid: '09F86104FE7FBE3A7A483F617AAE3493',
//     text: genSeedId() + 'asdfasdfasdfasdfasdfasdfasdfsdafadsjfkasdjfkajsdkfjaksdjfkjasdklfjaskdjfklasjfkjasdkjfaksjd',
//     type: 0,
//     msg_type: 0,
//     sender: '5546',
//     sender_user_type: 1,
//     sender_nickname: 'talos1',
//     time: '2024-05-30 09:06:03',
//     avatar: '',
//     channel_id: 0,
//     seed: genSeedId(),
//     originalText: '21231221sdfas',
//     has_tag: 0,
//     designation: '大帅哥',
//     designation_color: 4,
//     block_channel: [],
//     readed_count: 0,
//     qos: 0,
//     is_batch: 0,
//     sender_total_exp: 0,
//     sender_current_exp: 0,
//     sender_exp: '1',
//     sender_difference: 500,
//     sender_exp_icon: 'http://10.83.222.100/upload/default/20230728/8a4b356b0c8287b6bec15296224d113b.png',
//     prefix: '',
//     seedsy: '4b6f02f0da75d6c74621d3a86a793043',
//     weight: 'im-notices-high',
//     method: 'notice'
//   });
// }, 5);
