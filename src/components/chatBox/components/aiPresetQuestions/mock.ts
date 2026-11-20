/**
 * NX-1892 AI 预设问题 dev-only mock
 * 生产环境（VITE_ENV === 'prod'）下 useAiMock() 恒返回 null
 * URL query:
 *   ?aiMock=0  空数据（卡片不显示）
 *   ?aiMock=1  一行内容
 *   ?aiMock=2  两行刚好放满，无「更多」
 *   ?aiMock=3  超两行，出「更多」
 *   ?aiMock=4  大量数据，展开态滚动
 *   ?aiMock=5  超长文案，测截断 + tooltip
 */
export interface AiCategory {
  id: number
  text: string
  sort: number
}

const SCENARIOS: Record<string, AiCategory[]> = {
  '0': [],
  '1': [
    { id: 1, text: '今天看哪场？', sort: 100 },
    { id: 2, text: '决赛几点？', sort: 90 }
  ],
  '2': [
    { id: 1, text: '今天看哪场？', sort: 100 },
    { id: 2, text: '决赛几点？', sort: 90 },
    { id: 3, text: '内马尔是谁，告诉我？', sort: 80 },
    { id: 4, text: '什么是包赔？', sort: 70 },
    { id: 5, text: '推荐热门赛事', sort: 60 }
  ],
  '3': [
    { id: 1, text: '今天看哪场？', sort: 100 },
    { id: 2, text: '决赛几点？', sort: 90 },
    { id: 3, text: '内马尔是谁，告诉我？', sort: 80 },
    { id: 4, text: '什么是包赔？', sort: 70 },
    { id: 5, text: '推荐热门赛事', sort: 60 },
    { id: 6, text: '在哪里看赛程？', sort: 50 },
    { id: 7, text: '如何领取活动奖励？', sort: 40 },
    { id: 8, text: '为什么无法播放？', sort: 30 }
  ],
  '4': Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    text: `常见问题 ${i + 1}`,
    sort: 100 - i
  })),
  '5': [
    { id: 1, text: '今天看哪场？', sort: 100 },
    {
      id: 2,
      text: '这是一个很长很长很长很长很长很长很长很长很长的问题会被截断显示省略号',
      sort: 90
    },
    { id: 3, text: '决赛几点？', sort: 80 },
    {
      id: 4,
      text: '另一个稍微长一点点的问题，观察下截断效果，鼠标悬停应展示完整内容',
      sort: 70
    },
    { id: 5, text: '推荐赛事', sort: 60 },
    { id: 6, text: '如何领取活动奖励？', sort: 50 }
  ]
}

export function useAiMock(): AiCategory[] | null {
  if (import.meta.env.VITE_ENV === 'prod') return null
  try {
    const key = new URLSearchParams(window.location.search).get('aiMock')
    if (key == null) return null
    return SCENARIOS[key] ?? null
  } catch {
    return null
  }
}
