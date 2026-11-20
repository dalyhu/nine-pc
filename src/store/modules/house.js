
import { getHouseRoomManager } from '@/api/housManage.js'
const state = {
  houseAuthor: {},
  isRobot: false,
  isReplay: false
}

const mutations = {
  /** 判读是不是robot直播 
   *  isiszr:true 是
   * 对应接口   front/lives front/liveList  getRoomInfo
   * */
  setIsRobotAction(state, data) {
    state.isRobot = data
  },
    /** 判读是不是replay回放
   *  isRecord:true 是
   * 对应接口   front/lives front/liveList  getRoomInfo
   * */
  setIsReplayAction(state, data) {
    state.isReplay = data
  }
}

const actions = {
  // 获取房管权限
  async houseRoomManagerStore({ state }) {
    getHouseRoomManager().then(res => {
      const { code, data } = res
      if (code === 0) {
        if (data && !Array.isArray(data)) {
          state.houseAuthor = data
        } else {
          state.houseAuthor = {}
        }
      }
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
