import pinia from '@/store'
import { createApp } from 'vue'
import router from '@/router'
import App from '@/App.vue'

createApp(App)
  .use(router)
  .use(pinia)
  .mount('body')