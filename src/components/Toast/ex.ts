import ShowToast from './exShowToast.vue'
import { nextTick, createVNode, type Component, type App } from 'vue'
import type { IObject } from '@/interface'

interface IToastConfig {
  toastContext: string
  duration?: number
}

let saveToastApp: IObject | undefined

const createMountComponent = (rootComponent: Component) => {
  if (saveToastApp !== undefined) {
    saveToastApp.unmount()
  }
  const app = createApp(rootComponent)
  const root = document.createElement('div')
  document.body.appendChild(root)
  saveToastApp = app.mount(root)
  return {
    instance: saveToastApp,
    unmount() {
      app.unmount()
      document.body.removeChild(root)
    },
  }
}

const registerToastComponent = (toastConfig: IToastConfig | string) => {
  // 持续时间
  const duration = typeof toastConfig !== 'string' ? toastConfig.duration : 2000

  // 提示文案
  const createToastText =
    typeof toastConfig === 'string' ? toastConfig : toastConfig.toastContext

  // 注册组件
  const { instance, unmount } = createMountComponent(
    createVNode(ShowToast, { toastText: createToastText })
  )

  const { $data, $el } = instance
  nextTick(() => {
    ;($data as IObject).show = true
    setTimeout(() => {
      ;($data as IObject).show = false
      $el.addEventListener('transitionend', () => {
        saveToastApp = undefined
        unmount()
      })
    }, duration)
  })

  return instance
}

export default {
  install: (app: App) => {
    app.config.globalProperties.$showToast = registerToastComponent
  },
}
