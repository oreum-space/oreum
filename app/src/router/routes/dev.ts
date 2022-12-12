import type { RouteRecordRaw } from 'vue-router'

const dev: Array<RouteRecordRaw> = [
  {
    name: 'Development Tools: Requestman',
    path: '/development/tools/requestman',
    component: () => import('@/view/dev/requestman/RequestmanPage.vue'),
    meta: {
      main: true,
      footer: false
    }
  }
]

export default dev