import routes from '@/router/routes'
import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    header?: boolean,
    footer?: boolean,
    main?: boolean,
    transition?: string
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router