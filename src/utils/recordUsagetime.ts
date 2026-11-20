import localForage from 'localforage'
import { recordUsageTime } from '@/api/user.js'

export function initLocalForage() {
  localForage.config({
    driver: localForage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name: 'x9-web-pc:usage-time',
    version: 1.0,
    size: 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName: 'usageTimeLog', // Should be alphanumeric, with underscores.
    description: '用户观看时长记录'
  })
}

/**
 * usageTimeRecordData(记录用户在直播间的时长，用于每日任务中的观看直播时长的统计): {
 *  user_id: 用户ID,
 *  match_id: 主播ID, // 接口的入参
 *  channel_code: 渠道号, // 接口的入参
 *  time: 上报时本地当前时间,
 *  cum_min: 时长,
 * }
 * // 上面的字段均是接口的入参,除了user_id（后端从header取token/游客id）
 */
interface RecordUsageTimeDataModel {
  channel_code: string
  user_id: string | number
  match_id: string | number
  cum_min: number
  addTime: number
}
// 记录的数据有效期(10天)
const recordDataTimeoutLimit = 60 * 60 * 24 * 10
// 清除过期的无效数据
export function clearExpiredRecordData(userId: string | number) {
  const limit = Math.floor(new Date().getTime() / 1000) - recordDataTimeoutLimit
  const user_id = userId

  localForage
    .iterate(function (value: Array<any>, key: any) {
      const list = value.filter((item) => !(item.addTime < limit && item.cum_min === 0))
      // 此回调函数将对所有 key/value 键值对运行
      // console.log('===log: iterate~~~~', [key, value], '最新：', list);
      localForage.setItem(key, list)
      list.forEach((item) => {
        // 只上报当前用户id的记录，避免突然退出登录导致注册用户的数据跟游客的串了
        if (item.cum_min > 0 && Number(item.user_id) === Number(user_id)) {
          postUsageTimeRecord(item)
        }
      })
    })
    .then(function () {
      // console.log('===log: Iteration has completed');
    })
    .catch(function (err: any) {
      console.log(err)
    })
}
// 自动上报的时长阈值，即满10分钟就上报
const uploadTimeInterval = 10
export async function recordUsageTimeAction(recordData: RecordUsageTimeDataModel) {
  // console.log('recordUsageTime Action ----recordData', recordData, new Date());
  try {
    if (!recordData.match_id) return // 如果接口慢的时候存在没有match_id的情况
    const value = (await localForage.getItem(recordData.user_id + '')) as Array<any>
    let index = -1
    if (value)
      index = value.findIndex(
        (item: any) =>
          Number(item.user_id) === Number(recordData.user_id) &&
          Number(item.match_id) === Number(recordData.match_id) &&
          item.channel_code === recordData.channel_code
      )
    // console.log('===log: try:::', value, index, recordData);
    if (!value || index === -1) {
      const list = value || []
      list.push({
        user_id: Number(recordData.user_id),
        match_id: recordData.match_id,
        channel_code: recordData.channel_code,
        cum_min: 1,
        addTime: new Date().getTime()
      })
      localForage.setItem(recordData.user_id + '', list)
    } else {
      value[index].cum_min++
      if (value[index].cum_min === uploadTimeInterval) {
        postUsageTimeRecord(value[index])
      }
      localForage.setItem(recordData.user_id + '', value)
    }
  } catch (err) {
    console.log(err)
  }
}

export function postUsageTimeRecord(recordData: RecordUsageTimeDataModel) {
  try {
    if (recordData.cum_min === 0) return console.warn('时长0分钟,不请求统计时长')
    recordUsageTime({
      time: Math.floor(new Date().getTime() / 1000), // 当前10位数时间戳
      match_id: Number(recordData.match_id), // 主播id
      channel_code: recordData.channel_code, // 渠道编号
      cum_min: recordData.cum_min // 累计分钟数
    }).then(async () => {
      const value = (await localForage.getItem(recordData.user_id + '')) as Array<any>
      value.find(
        (item: any) =>
          Number(item.user_id) === Number(recordData.user_id) &&
          Number(item.match_id) === Number(recordData.match_id) &&
          item.channel_code === recordData.channel_code
      ).cum_min = 0
      localForage.setItem(recordData.user_id + '', value)
    })
  } catch (error) {
    console.error(error)
  }
}
