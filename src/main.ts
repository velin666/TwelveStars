import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/styles/index.less'
import '@/styles/loading.css'

import App from './App.vue'
import router from './router'
import RegisterToastComponent from '@/components/Toast'
import { resizeRem } from './util'

const app = createApp(App)

app.use(RegisterToastComponent)
app.provide('$showToast', app.config.globalProperties.$showToast)

app.use(createPinia())
app.use(router)

app.mount('#app')

resizeRem()
window.addEventListener('resize', () => {
  resizeRem()
})
