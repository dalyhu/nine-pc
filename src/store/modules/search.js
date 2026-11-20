export default {
  state: () => ({
    searchHotList: [] // 让头部导航栏搜索的hotList可以被search组件共用
  }),

  mutations: {
    setSearchHotList(state, list) {
      state.searchHotList = list
    }
  }
}
