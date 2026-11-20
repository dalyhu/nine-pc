/**
 * 刷新用户信息：请求 Member/info，返回后合并进当前用户信息并提交。
 * 依赖全部由参数传入，便于 node --test 直接测试（store/index.js 依赖别名，测试里导入不了）。
 *
 * @param {object} options
 * @param {string|number} options.userId 发请求时的用户 ID
 * @param {(params: { user_id: string|number }) => Promise<{ data: object }>} options.fetchInfo 请求接口
 * @param {() => string|number|undefined} options.readCachedUserId 读本地存储里的用户 ID
 * @param {() => object} options.getCurrentInfo 读返回时的 Vuex 用户信息（合并的底）
 * @param {(info: object) => void} options.commit 提交用户信息
 * @returns {Promise<boolean>} 是否提交了
 */
export async function refreshUserInfo({ userId, fetchInfo, readCachedUserId, getCurrentInfo, commit }) {
  if (!userId) return false

  try {
    const { data } = await fetchInfo({ user_id: userId })

    // 请求期间可能已退出（logout 只清 localStorage、不清 Vuex），或在别的标签页换了账号：
    // 本地存储里已不是发请求时的用户，就丢弃这次结果，否则会把旧登录信息写回（NX-2146）
    if (String(readCachedUserId() ?? '') !== String(userId)) return false

    commit({ ...getCurrentInfo(), ...data })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
