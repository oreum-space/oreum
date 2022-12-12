import type { RouteRecordRaw } from 'vue-router'

const other: Array<RouteRecordRaw> = [
  {
    name: 'LuckyWheel',
    path: '/other/lucky-wheel',
    component: () => import('@/view/other/LuckyWheel.vue'),
    meta: {
      main: true,
      footer: false
    }
  }
]

export default other