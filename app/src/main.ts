import pinia from '@/store'
import { createApp } from 'vue'
import router from '@/router'
import App from '@/App.vue'

createApp(App)
  .use(router)
  .use(pinia)
  .mount('body')

/*
if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
  void (async function () {
    try {
      await navigator.serviceWorker.register('./pwa/worker.js')
    } catch {
      console.warn('SSL is not valid!')
    }
  })()
}
*/
