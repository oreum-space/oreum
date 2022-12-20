import dev from '@/router/routes/dev'
import other from '@/router/routes/other'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  ...dev,
  ...other,
  {
    name: 'Home',
    path: '/',
    component: () => import('@/view/HomePage.vue'),
    meta: { main: true }
  },
  {
    name: 'Postman',
    path: '/postman',
    component: () => import('@/view/PostmanPage.vue'),
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
    component: () => import('@/view/AuthorizationPage.vue'),
    meta: { main: true, header: false, footer: false, transition: 'sign-page' }
  },
  {
    name: 'UserInterface',
    path: '/user-interface',
    component: () => import('@/view/user-interface/UserInterface.vue'),
    meta: {
      main: true
    },
    children: [
      {
        name: 'UserInterfaceDefault',
        path: '',
        component: () => import('@/view/user-interface/UserInterfaceDefault.vue')
      },
      {
        name: 'UserInterfaceButtons',
        path: '/user-interface/buttons',
        component: () => import('@/view/user-interface/UserInterfaceButtons.vue')
      },
      {
        name: 'UserInterfaceSwitch',
        path: '/user-interface/switches',
        component: () => import('@/view/user-interface/UserInterfaceSwitches.vue')
      },
      {
        name: 'UserInterfaceSelect',
        path: '/user-interface/select',
        component: () => import('@/view/user-interface/UserInterfaceSelect.vue')
      },
      {
        name: 'UserInterfaceDialog',
        path: '/user-interface/dialog',
        component: () => import('@/view/user-interface/UserInterfaceDialog.vue')
      }
    ]
  },
  {
    name: 'NotFound',
    path: '/:pathMatch(.*)*',
    component: () => import('@/view/NotFound.vue'),
    meta: { main: true, header: false, footer: false, transition: 'sign-page' }
  }
]

export default routes