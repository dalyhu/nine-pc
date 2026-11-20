import { cloneDeep } from 'lodash-es'
import mittBus from '@/utils/mittBus'
export default {
  data() {
    return {
      titleIdList: [
        1000000, // '进行中'
        1000001, // '未开始'
        1000002, // '已结束'
        1000003, // '异常'
        1000009 // 置顶
      ]
    }
  },
  provide() {
    return {
      titleIdList: this.titleIdList,
      getMatchStatusType: this.getMatchStatusType,
      filterInvalidTitles: this.filterInvalidTitles
    }
  },
  methods: {
    // 回到顶部
    // scrollToTop(flag, tabIndex) {
    //   try {
    //     this.$refs[flag + tabIndex].$refs.scoreScroller.scrollToPosition(-250) // 如果为0的话，会距离顶部还有一些距离，这个距离是列表顶部距离页面顶部的距离，由于scrollTop不存在负数，所以取个大一点的值也行
    //   } catch (error) {
    //     console.error(error)
    //   }
    // },
    /**
     * @description 根据传入的赛事类型 以及 单项数据 返回这赛事的比赛状态
     * @param {string} flag football/basketball/gaming
     * @param {object} item 全数据
     * @returns {number|null} type
     * type=1 -> 进行中
     * type=2 -> 未开始
     * type=3 -> 完场
     * type=5 -> 异常
     */
    getMatchStatusType(flag, item) {
      let type
      switch (flag) {
        case 'football':
          if (item.status === 8) {
            type = 3
          } else if (
            item.status == 2 ||
            item.status == 3 ||
            item.status == 4 ||
            item.status == 5 ||
            item.status == 6 ||
            item.status == 7
          ) {
            //进行中
            type = 1
          } else if (item.status === 1) {
            //未开始
            type = 2
          } else if (
            item.status == 9 ||
            item.status == 10 ||
            item.status == 11 ||
            item.status == 12 ||
            item.status == 13
          ) {
            //异常
            type = 5
          }
          break
        case 'basketball':
          // 进行中
          if (
            item.status_id == 2 ||
            item.status_id == 3 ||
            item.status_id == 4 ||
            item.status_id == 5 ||
            item.status_id == 6 ||
            item.status_id == 7 ||
            item.status_id == 8 ||
            item.status_id == 9
          ) {
            type = 1
          } else if (item.status_id == 1) {
            // 未开始
            type = 2
          } else if (item.status_id == 10) {
            // 已结束
            type = 3
          } else if (item.status_id == 0) {
            // 异常
            type = 5
          }
          break
        default:
          // 电竞
          if (item.status === 2) {
            //完场
            type = 3
          } else if (item.status == 1) {
            //进行中
            type = 1
          } else if (item.status === 0) {
            //未开始
            type = 2
          } else if (item.status == 3) {
            //异常（已删除）
            type = 5
          }
          break
      }
      return type
    },
    /**
     * @description 把没有对应比赛数据的标题给去掉
     * @param {*} flag football/basketball/gaming
     * @param {*} list 全数据
     * @param {*} topList 置顶数据
     * @param {*} screenListT 筛选列表
     * @returns
     */
    filterInvalidTitles(flag, list, topList = []) {
      let data = cloneDeep(list)
      let list1 = [] // 进行中
      let list2 = [] // 未开始
      let list3 = [] // 完场
      let list4 = [] // 置顶
      let list5 = [] // 异常
      data.forEach((item) => {
        if (topList.includes(item.id)) {
          list4.push(item)
        }
        // 进行中
        if (this.getMatchStatusType(flag, item) === 1) {
          list1.push(item)
        } else if (this.getMatchStatusType(flag, item) === 2) {
          // 未开始
          list2.push(item)
        } else if (this.getMatchStatusType(flag, item) === 3) {
          // 已结束
          list3.push(item)
        } else if (this.getMatchStatusType(flag, item) === 5) {
          // 异常
          list5.push(item)
        }
      })
      if (list1.length === 0 && data.find((it) => it.id === 1000000))
        data.splice(
          data.findIndex((it) => it.id === 1000000),
          1
        )
      if (list2.length === 0 && data.find((it) => it.id === 1000001))
        data.splice(
          data.findIndex((it) => it.id === 1000001),
          1
        )
      if (list3.length === 0 && data.find((it) => it.id === 1000002))
        data.splice(
          data.findIndex((it) => it.id === 1000002),
          1
        )
      if (list4.length === 0 && data.find((it) => it.id === 1000009))
        data.splice(
          data.findIndex((it) => it.id === 1000009),
          1
        )
      if (list5.length === 0 && data.find((it) => it.id === 1000003))
        data.splice(
          data.findIndex((it) => it.id === 1000003),
          1
        )
      return data
    }
  }
}
