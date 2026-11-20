
import { computed } from 'vue'
import { useStore } from 'vuex'

export function useAnchorPermission(props) {
  const store = useStore()

  // 当前直播间是否有房管权限
  const isAnchorHouse = computed(() => {
    const anchor_list = store.state.house.houseAuthor?.anchor_list
    if (
      anchor_list.includes('all')
      || anchor_list.includes(`${props.uid}`)
      || (anchor_list.includes('robot') && store.state.house.isRobot)
      || (anchor_list.includes('replay') && store.state.house.isReplay)
    ) {
      return true
    }
    return false
  })
  return {
    isAnchorHouse
  }

}

export function usePermission() {
  const store = useStore()
  // 是否是房管(no)
  const isHouse = computed(() => {
    return Object.keys(store.state.house.houseAuthor).length === 0
  })
  // 是高级房管
  const isHightHouse = computed(() => {
    return !isHouse.value && `${store.state.house.houseAuthor.type}` === '2'
  })
  /** 是否有删除权限 */
  const isDetelePermiss = computed(() => {
    const permission = store.state.house.houseAuthor?.permission
    const values = permission ? Object.values(permission) : []
    return values.includes('delete')
  })
  /** 权限矩阵 */
  const perValues = computed(() => {
    const permission = store.state.house.houseAuthor?.permission
    return permission ? Object.values(permission) : []
  })
  /** 是否有拉黑权限 */
  const isBlockPermiss = computed(() => {
    return perValues.value.includes('block')
  })
  /** 是否有禁言权限 */
  const isBanPermiss = computed(() => {
    return perValues.value.includes('mute')
  })
  const isApprovePermiss = computed(() => {
    const permission = store.state.house.houseAuthor?.permission
    const values = permission ? Object.values(permission) : []
    return values.includes('approve')
  })
  return {
    isHouse,
    isHightHouse,
    isBlockPermiss,
    isBanPermiss,
    isApprovePermiss,
    isDetelePermiss
  }
}