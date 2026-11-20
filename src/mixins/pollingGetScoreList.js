export default {
  data() {
    return {
      isFirstGetList: true, // 首次请求列表
      pollingTimeInterval: null,
      goingList: [], // 进行中的比赛
      isGettingList: false
    }
  },
  computed: {
    // 是否启用比。分推送服务（后台开关设置，is_score_push=0时不启用 则前台不连接wssc以及不展示分数）
    scorePushState() {
      return this.$store.state.system.is_score_push !== '0'
    }
  },
  methods: {
    // 即时比。分轮询更新列表数据
    pollingGetList(type, tabIndex, func) {
      if (!this.scorePushState)
        this.pollingTimeInterval = window.setInterval(() => {
          if (
            !this.goingList.length ||
            this.tabIndex !== tabIndex ||
            this.$store.state.system.is_score_push !== '0'
          ) {
            window.clearInterval(this.pollingTimeInterval)
            console.log(
              '===log: 不在该列表页 或 无进行中的比赛，不轮询更新列表,清除此轮询任务',
              tabIndex,
              'is_score_push:' + this.$store.state.system.is_score_push
            )
            return
          }
          if (this.isGettingList) {
            console.log('===log: 上一次列表请求未完成')
            return
          }
          console.log(
            `===log: 比赛类型：${type}，列表组件索引：${tabIndex} 请求时间:${
              new Date().toString().split(' ')[4]
            }`
          )
          func()
        }, 5 * 1000)
    }
  },
  beforeUnmount() {
    window.clearInterval(this.pollingTimeInterval)
  }
}
