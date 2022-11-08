import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'Home',
    path: '/',
    component: () => import('@/view/Home.vue'),
    meta: { main: true }
  },
  {
    name: 'Test',
    path: '/test',
    component: () => import('@/view/Test.vue'),
    meta: { main: true }
  }
]

export default routes