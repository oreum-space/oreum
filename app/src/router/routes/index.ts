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
  },
  {
    name: 'Postman',
    path: '/postman',
    component: () => import('@/view/Postman.vue'),
    meta: { main: true }
  },
  {
    name: 'New Account',
    path: '/new-account',
    component: () => import('@/view/NewAccount.vue'),
    meta: { main: true, header: false, footer: false, transition: 'sign-page' }
  },
  {
    name: 'Authorization',
    path: '/auth',
    component: () => import('@/view/Authorization.vue'),
    meta: { main: true, header: false, footer: false, transition: 'sign-page' }
  },
  {
    name: 'UserInterface',
    path: '/user-interface',
    component: () => import('@/view/UserInterface.vue')
  },
  {
    name: 'NotFound',
    path: '/:pathMatch(.*)*',
    component: () => import('@/view/NotFound.vue'),
    meta: { main: true, header: false, footer: false, transition: 'sign-page' }
  }
]

export default routes