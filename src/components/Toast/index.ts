import type { App } from 'vue'
import ShowToast from './ShowToast.vue'

const RegisterToastComponent = {
  install: (Vue: App): void => {
    let toastTimer: number

    const toastElement = createApp(ShowToast)
    const ToastConstructor = toastElement.mount(
      document.createElement('div')
    ) as InstanceType<typeof ShowToast>
    document.body.appendChild(ToastConstructor.$el)

    const showToast = (text?: string, duration = 2500) => {
      // 不存在信息或信息为空则直接跳出方法
      if (!text) {
        return
      }
      clearTimeout(toastTimer)
      toastTimer = setTimeout(() => {
        ToastConstructor.show = false
      }, duration)
      ToastConstructor.toastText = text
      ToastConstructor.show = true
    }

    Vue.config.globalProperties.$showToast = showToast
  },
}

export default RegisterToastComponent
